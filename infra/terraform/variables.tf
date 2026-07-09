variable "project_name" {
  description = "Nome do projeto para naming e tags."
  type        = string
}

variable "environment" {
  description = "Ambiente da infraestrutura."
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "Regiao AWS principal dos recursos."
  type        = string
  default     = "us-east-1"
}

variable "site_bucket_name" {
  description = "Nome do bucket S3 do site. Se vazio, usa nome derivado de project/environment."
  type        = string
  default     = ""
}

variable "enable_custom_domain" {
  description = "Habilita dominio customizado no CloudFront."
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "Dominio principal para o site (ex: portfolio.exemplo.com)."
  type        = string
  default     = ""

  validation {
    condition     = var.enable_custom_domain ? length(trimspace(var.domain_name)) > 0 : true
    error_message = "Quando enable_custom_domain=true, informe domain_name."
  }
}

variable "enable_www_redirect" {
  description = "Quando true, configura www.<domain_name> como alias no CloudFront e redireciona para domain_name."
  type        = bool
  default     = true
}

variable "hosted_zone_id" {
  description = "Hosted Zone ID do Route53 para criar registros DNS. Se vazio e enable_custom_domain=true, cria uma public hosted zone."
  type        = string
  default     = ""
}

variable "create_acm_certificate" {
  description = "Quando true, cria certificado ACM em us-east-1 e validacao DNS."
  type        = bool
  default     = false
}

variable "acm_certificate_arn" {
  description = "ARN de certificado ACM existente em us-east-1 (usado quando create_acm_certificate=false)."
  type        = string
  default     = ""
  sensitive   = true

  validation {
    condition = (
      var.enable_custom_domain && !var.create_acm_certificate
      ? length(trimspace(var.acm_certificate_arn)) > 0
      : true
    )
    error_message = "Com dominio customizado e create_acm_certificate=false, informe acm_certificate_arn."
  }
}
