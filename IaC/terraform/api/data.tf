data "aws_vpc" "vpc" {
  tags = {
    Name = "${var.app}-${var.env}-vpc"
  }
}

data "aws_subnet_ids" "public" {
  vpc_id = data.aws_vpc.vpc.id

  tags = {
    Name = "${var.app}-${var.env}-subnet-public*"
  }
}

data "aws_lb" "public" {
  name = "${var.app}-${var.env}-public"
}

data "aws_security_group" "alb" {
  name = "${var.app}-${var.env}-alb-sg"
}

data "aws_ssm_parameter" "gp_api_key" {
  name = "/${var.env}/${var.app}/gophish/apikey"
}

data "aws_ssm_parameter" "gp_smtp_host" {
  name = "/${var.env}/${var.app}/mailgun/smtp_host"
}

data "aws_ssm_parameter" "gp_smtp_from" {
  name = "/${var.env}/${var.app}/mailgun/smtp_from"
}

data "aws_ssm_parameter" "gp_smtp_pass" {
  name = "/${var.env}/${var.app}/mailgun/smtp_pass"
}

data "aws_ssm_parameter" "gp_smtp_user" {
  name = "/${var.env}/${var.app}/mailgun/smtp_user"
}

data "aws_ssm_parameter" "smtp_port" {
  name = "/${var.env}/${var.app}/mailgun/smtp_port"
}

data "aws_ssm_parameter" "smtp_host_no_port" {
  name = "/${var.env}/${var.app}/mailgun/smtp_host_no_port"
}

data "aws_cognito_user_pools" "users" {
  name = "${var.env}-${var.app}-users"
}

data "aws_iam_server_certificate" "self" {
  name = "${var.app}-${var.env}-alb"
}
