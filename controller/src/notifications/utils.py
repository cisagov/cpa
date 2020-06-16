"""Utils for notification service."""

# Standard Libraries


def get_notification(message_type):
    """
    Get notification.

    Parses out the type of notificartion.
    """
    if message_type == "monthly_report":
        subject = "DHS CISA Phishing Subscription Monthly Report"
        path = "monthly_report"
    elif message_type == "cycle_report":
        subject = "DHS CISA Phishing Subscription Cycle Report"
        path = "cycle_report"
    elif message_type == "yearly_report":
        subject = "DHS CISA Phishing Subscription Yearly Report"
        path = "yearly_report"
    elif message_type == "subscription_started":
        subject = "DHS CISA Phishing Subscription Started"
        path = "subscription_started"
    else:
        subject = ""
        path = ""
    return subject, path
