#=================================================
#  CORE
#=================================================
variable "env" {
  type = string
}

variable "app" {
  type = string
}

variable "region" {
  type = string
}

#=================================================
#  COGNITO
#=================================================
variable "additional_redirect" {
  type = string
  default = ""
}

#=================================================
#  LOGS
#=================================================
variable "log_retention_days" {
  type = number
}

#=================================================
#  NETWORK
#=================================================
variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "public_subnet_ids" {
  type = list(string)
}

#=================================================
#  LOAD BALANCING
#=================================================
variable "idle_timeout" {
  type    = number
  default = 600
}

#=================================================
#  ROUTE 53
#=================================================
variable "route53_zone_name" {
  type = string
}

#=================================================
#  GOPHISH
#=================================================
variable "gophish_image_repo" {
  type = string
}

variable "gophish_image_tag" {
  type = string
}

variable "gophish_mysql_instance_class" {
  type = string
}

variable "gophish_mysql_storage" {
  type = number
}

variable "gophish_cpu" {
  type = number
}

variable "gophish_memory" {
  type = number
}

variable "gophish_count" {
  type = number
}

variable "gophish_landing_subdomain" {
  type = string
}

#=================================================
#  API
#=================================================
variable "api_image_repo" {
  type = string
}

variable "api_image_tag" {
  type = string
}

variable "delay_minutes" {
  type    = string
  default = "5"
}

variable "cycle_minutes" {
  type    = string
  default = "129600"
}

variable "monthly_minutes" {
  type    = string
  default = "43200"
}

variable "yearly_minutes" {
  type    = string
  default = "525600"
}

variable "api_desired_count" {
  type = number
}

variable "api_max_count" {
  type = number
}

variable "api_min_count" {
  type = number
}

variable "api_scale_out_count" {
  type = number
}

variable "api_scale_in_count" {
  type = number
}

variable "api_cpu" {
  type = number
}

variable "api_memory" {
  type = number
}

variable "api_gunicorn_workers" {
  type = string
}

variable "extra_bcc_emails" {
  type = string
}

#=================================================
#  DOCUMENTDB
#=================================================
variable "documentdb_cluster_size" {
  type = number
}


variable "documentdb_instance_class" {
  type = string
}

#=================================================
#  BROWSERLESS
#=================================================
variable "browserless_cpu" {
  type = number
}

variable "browserless_memory" {
  type = number
}

variable "browserless_count" {
  type = number
}

#=================================================
#  TASKS
#=================================================
variable "tasks_memory" {
  type = number
}

variable "tasks_schedule" {
  type = string
}

variable "tasks_timeout" {
  type = number
}

#=================================================
#  WEB
#=================================================
variable "web_image_repo" {
  type = string
}

variable "web_image_tag" {
  type = string
}

variable "web_cpu" {
  type = number
}

variable "web_memory" {
  type = number
}

variable "web_desired_count" {
  type = number
}
