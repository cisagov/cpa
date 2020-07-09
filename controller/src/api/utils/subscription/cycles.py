"""Cycles Util."""
# Standard Python Libraries
import logging

# Third-Party Libraries
from api.utils.generic import format_ztime

logger = logging.getLogger()


def get_reported_emails(subscription):
    """Get Reported Emails.

    Args:
        subscription (object): subscription object

    Returns:
        list: list of all cycles and thair reported emails
    """
    list_data = subscription["gophish_campaign_list"]
    reports_per_campaign = []
    for campaign in list_data:
        timeline = campaign["timeline"]
        filtered_list = [d for d in timeline if d["message"] == "Email Reported"]
        reported_emails = []
        for item in filtered_list:
            reported_emails.append(
                {
                    "campaign_id": campaign["campaign_id"],
                    "email": item["email"],
                    "datetime": item["time"],
                }
            )
        reports_per_campaign.append(
            {
                "campaign_id": campaign["campaign_id"],
                "reported_emails": reported_emails,
            }
        )

    cycles = subscription["cycles"]
    master_list = []
    for c in cycles:
        emails_reported_per_cycle = []
        c_list = c["campaigns_in_cycle"]
        for reports in reports_per_campaign:
            if reports["campaign_id"] in c_list:
                emails_reported_per_cycle.extend(reports["reported_emails"])

        cycle_reported_emails = {
            "start_date": c["start_date"],
            "end_date": c["end_date"],
            "email_list": emails_reported_per_cycle,
        }
        master_list.append(cycle_reported_emails)

    return master_list


def delete_reported_emails(gophish_campaign_list, delete_list):
    """Delete Reported Emails.

    Args:
        gophish_campaign_list (list): list of gophish campaigns
        delete_list (list): list of objects to be deleted.

    Returns:
        list: updated gophish campaign list
    """
    delete_list_campaigns = [email["campaign_id"] for email in delete_list]
    for campaign in gophish_campaign_list:
        if campaign["campaign_id"] in delete_list_campaigns:
            item_to_delete = next(
                (
                    item
                    for item in delete_list
                    if item["campaign_id"] == campaign["campaign_id"]
                ),
                None,
            )
            for timeline_item in campaign["timeline"]:
                if (
                    timeline_item["email"] == item_to_delete["email"]
                    and timeline_item["message"] == "Email Reported"
                ):
                    campaign["timeline"].remove(timeline_item)

    return gophish_campaign_list


def update_reported_emails(gophish_campaign_list, update_list):
    """Update Reported Emails.

    Args:
        gophish_campaign_list (list): list of gophish campaigns
        update_list (list): list of objects to be Updated or to add.

    Returns:
        list: updated gophish campaign list
    """
    update_list_campaigns = add_email_reports = []
    for email in update_list:
        if email["campaign_id"] is not None:
            update_list_campaigns.append(email)
        else:
            add_email_reports.append(email)

    for campaign in gophish_campaign_list:
        campaign_targets = [target["email"] for target in campaign["target_email_list"]]
        if campaign["campaign_id"] in update_list_campaigns:
            item_to_update = next(
                (
                    item
                    for item in update_list
                    if item["campaign_id"] == campaign["campaign_id"]
                ),
                None,
            )
            for timeline_item in campaign["timeline"]:
                if (
                    timeline_item["email"] == item_to_update["email"]
                    and timeline_item["message"] == "Email Reported"
                ):
                    timeline_item.update(
                        {"time": format_ztime(item_to_update["datetime"])}
                    )

        for new_reported_email in add_email_reports:
            exixting_timeline_reports = [
                timeline_item["email"]
                for timeline_item in campaign["timeline"]
                if timeline_item["message"] == "Email Reported"
            ]
            if (
                new_reported_email["email"] in campaign_targets
                and new_reported_email["email"] not in exixting_timeline_reports
            ):
                campaign["timeline"].append(
                    {
                        "email": new_reported_email["email"],
                        "message": "Email Reported",
                        "time": format_ztime(new_reported_email["datetime"]),
                        "details": "",
                        "duplicate": False,
                    }
                )
                add_email_reports.remove(new_reported_email)

    return gophish_campaign_list
