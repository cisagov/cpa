from api.serializers.subscriptions_serializers import SubscriptionPostSerializer

from datetime import datetime
from uuid import uuid4


def create(
    customer_uuid,
    name,
    url,
    keywords,
    start_date,
    gophish_campaign_list,
    primary_contact,
    status,
    target_email_list,
    templates_selected_uuid_list,
    active,
    archived,
    manually_stopped,
):
    data = {
        "customer_uuid": customer_uuid,
        "name": name,
        "url": url,
        "keywords": keywords,
        "start_date": start_date,
        "gophish_campaign_list": gophish_campaign_list,
        "primary_contact": primary_contact,
        "status": status,
        "target_email_list": target_email_list,
        "templates_selected_uuid_list": templates_selected_uuid_list,
        "active": active,
        "archived": archived,
        "manually_stopped": manually_stopped,
    }
    serializer = SubscriptionPostSerializer(data=data)
    return serializer


def test_creation():
    customer_data = {
        "first_name": "firstname",
        "last_name": "lastname",
        "title": "sometitle",
        "office_phone": "(208)453-9032",
        "mobile_phone": "(208)453-9032",
        "email": "someemail@domain.com",
        "notes": "somenotes",
        "active": True,
    }
    serializer = create(
        uuid4(),
        "name",
        "www.someurl.com",
        "keywords",
        datetime.now(),
        [],
        customer_data,
        "status",
        [],
        [],
        False,
        False,
        False,
    )
    assert isinstance(serializer, SubscriptionPostSerializer)
    serializer.is_valid()
    assert len(serializer.errors) == 0


def test_serializer_missing_fields():
    customer_data = {
        "first_name": "firstname",
        "last_name": "lastname",
        "title": "sometitle",
        "office_phone": "(208)453-9032",
        "mobile_phone": "(208)453-9032",
        "email": "someemail@domain.com",
        "notes": "somenotes",
        "active": True,
    }

    data = {
        "customer_uuid": uuid4(),
        # missing name and url fields should return an invalid serializer
        "keywords": "keywords",
        "start_date": datetime.now(),
        "gophish_campaign_list": [],
        "primary_contact": customer_data,
        "status": "status",
        "target_email_list": [],
        "templates_selected_uuid_list": [],
        "active": True,
        "archived": False,
        "manually_stopped": False,
    }
    serializer = SubscriptionPostSerializer(data=data)

    assert serializer.is_valid() is False
    assert len(serializer.errors) == 2
    assert serializer.errors.get("name") is not None
    assert serializer.errors.get("url") is not None
