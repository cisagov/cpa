from api.serializers.template_serializers import (
    TemplatePatchResponseSerializer,
    TEMPLATE_TYPE_CHOICES,
)
from faker import Faker

fake = Faker()


def test_serializer():
    image_data = {"file_name": fake.file_name(), "file_url": fake.image_url()}
    appearance_data = {
        "grammar": fake.random_number(),
        "link_domain": fake.random_number(),
        "logo_graphics": fake.random_number(),
    }
    sender_data = {
        "external": fake.random_number(),
        "internal": fake.random_number(),
        "authoritative": fake.random_number(),
    }
    relevancy_data = {
        "organization": fake.random_number(),
        "public_news": fake.random_number(),
    }
    behavior_data = {
        "fear": fake.random_number(),
        "duty_obligation": fake.random_number(),
        "curiosity": fake.random_number(),
        "greed": fake.random_number(),
    }
    data = {
        "template_uuid": fake.uuid4(),
        "gophish_template_id": fake.random_number(),
        "name": fake.name(),
        "template_type": TEMPLATE_TYPE_CHOICES[0][0],
        "deception_score": fake.random_number(),
        "descriptive_words": fake.word(),
        "description": fake.paragraph(),
        "image_list": [image_data],
        "from_address": fake.email(),
        "retired": fake.boolean(),
        "retired_description": fake.paragraph(),
        "subject": fake.word(),
        "text": fake.paragraph(),
        "html": fake.paragraph(),
        "topic_list": [fake.word()],
        "appearance": appearance_data,
        "sender": sender_data,
        "relevancy": relevancy_data,
        "behavior": behavior_data,
        "complexity": fake.random_number(),
        "created_by": fake.name(),
        "cb_timestamp": fake.date_time(),
        "last_updated_by": fake.name(),
        "lub_timestamp": fake.date_time(),
    }
    serializer = TemplatePatchResponseSerializer(data=data)

    assert isinstance(serializer, TemplatePatchResponseSerializer)
    assert serializer.is_valid()


def test_serializer_fields_over_max_length():
    # subject, created by, and last updated by fields over 200 characters should return an invalid serializer
    image_data = {"file_name": fake.file_name(), "file_url": fake.image_url()}
    appearance_data = {
        "grammar": fake.random_number(),
        "link_domain": fake.random_number(),
        "logo_graphics": fake.random_number(),
    }
    sender_data = {
        "external": fake.random_number(),
        "internal": fake.random_number(),
        "authoritative": fake.random_number(),
    }
    relevancy_data = {
        "organization": fake.random_number(),
        "public_news": fake.random_number(),
    }
    behavior_data = {
        "fear": fake.random_number(),
        "duty_obligation": fake.random_number(),
        "curiosity": fake.random_number(),
        "greed": fake.random_number(),
    }
    data = {
        "template_uuid": fake.uuid4(),
        "gophish_template_id": fake.random_number(),
        "name": fake.name(),
        "template_type": TEMPLATE_TYPE_CHOICES[0][0],
        "deception_score": fake.random_number(),
        "descriptive_words": fake.word(),
        "description": fake.paragraph(),
        "image_list": [image_data],
        "from_address": fake.email(),
        "retired": fake.boolean(),
        "retired_description": fake.paragraph(),
        "subject": fake.random_letter() * 201,
        "text": fake.paragraph(),
        "html": fake.paragraph(),
        "topic_list": [fake.word()],
        "appearance": appearance_data,
        "sender": sender_data,
        "relevancy": relevancy_data,
        "behavior": behavior_data,
        "complexity": fake.random_number(),
        "created_by": fake.random_letter() * 201,
        "cb_timestamp": fake.date_time(),
        "last_updated_by": fake.random_letter() * 201,
        "lub_timestamp": fake.date_time(),
    }
    serializer = TemplatePatchResponseSerializer(data=data)

    assert serializer.is_valid() is False
    assert len(serializer.errors) == 3
    assert serializer.errors.get("subject") is not None
    assert serializer.errors.get("created_by") is not None
    assert serializer.errors.get("last_updated_by") is not None
