"""Webhook View."""
# Standard Python Libraries
import asyncio
import datetime
import logging

# Third-Party Libraries
from api.manager import CampaignManager
from api.models.subscription_models import SubscriptionModel, validate_subscription
from api.serializers import campaign_serializers, webhook_serializers
from api.serializers.subscriptions_serializers import (
    SubscriptionPatchResponseSerializer,
)
from api.utils import db_service, format_ztime
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)
manager = CampaignManager()


class IncomingWebhookView(APIView):
    """
    This is the a Incoming Webhook View.

    This handles Incoming Webhooks from gophish.
    """

    @swagger_auto_schema(
        request_body=webhook_serializers.InboundWebhookSerializer,
        responses={"202": SubscriptionPatchResponseSerializer, "400": "Bad Request",},
        security=[],
        operation_id="Incoming WebHook from gophish ",
        operation_description=" This handles incoming webhooks from GoPhish Campaigns.",
    )
    def post(self, request):
        """Post method."""
        data = request.data.copy()
        return self.__handle_webhook_data(data)

    def __handle_webhook_data(self, data):
        """
        Handle Webhook Data.

        The Webhook doesnt give us much besides:
        campaign_id = serializers.IntegerField()
        email = serializers.EmailField()
        time = serializers.DateTimeField()
        message = serializers.CharField()
        details = serializers.CharField()

        But using this, we can call the gophish api and update out db on each
        webhook event.
        """
        if "message" in data:
            seralized = webhook_serializers.InboundWebhookSerializer(data)
            seralized_data = seralized.data
            subscription = self.__get_single_subscription(seralized_data["campaign_id"])

            if seralized_data["message"] in [
                "Email Sent",
                "Email Opened",
                "Clicked Link",
                "Submitted Data",
            ]:
                gophish_campaign = manager.get(
                    "campaign", campaign_id=seralized_data["campaign_id"]
                )
                gophish_campaign_serialized = campaign_serializers.CampaignSerializer(
                    gophish_campaign
                )
                gophish_campaign_data = gophish_campaign_serialized.data
                for campaign in subscription["gophish_campaign_list"]:
                    if campaign["campaign_id"] == seralized_data["campaign_id"]:
                        print("here")
                        campaign["timeline"].append(
                            {
                                "email": seralized_data["email"],
                                "message": seralized_data["message"],
                                "time": format_ztime(seralized_data["time"]),
                                "details": seralized_data["details"],
                            }
                        )
                        campaign["results"] = gophish_campaign_data["results"]
                        campaign["status"] = gophish_campaign_data["status"]

            updated_response = self.__update_single(
                subscription=subscription,
                collection="subscription",
                model=SubscriptionModel,
                validation=validate_subscription,
            )
            if "errors" in updated_response:
                return Response(updated_response, status=status.HTTP_400_BAD_REQUEST)
            serializer = SubscriptionPatchResponseSerializer(updated_response)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

        return Response()

    def __get_single_subscription(self, campaign_id):
        """Get single subscription with campaign id."""
        parameters = {"gophish_campaign_list.campaign_id": campaign_id}
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        service = db_service("subscription", SubscriptionModel, validate_subscription)
        subscription_list = loop.run_until_complete(
            service.filter_list(parameters=parameters)
        )
        return next(iter(subscription_list), None)

    def __update_single(self, subscription, collection, model, validation):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        service = db_service(collection, model, validation)
        put_data = {
            "last_updated_by": "webhook",
            "lub_timestamp": datetime.datetime.utcnow(),
        }
        subscription.update(put_data)
        update_response = loop.run_until_complete(service.update(subscription))
        if "errors" in update_response:
            return update_response
        return subscription
