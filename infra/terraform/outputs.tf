output "s3_bucket_name" {
  description = "Nome do bucket S3 do site."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "ID da distribuicao CloudFront."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "Dominio padrao da distribuicao CloudFront."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "website_url" {
  description = "URL final do site."
  value       = local.website_url
}

output "route53_hosted_zone_id" {
  description = "Hosted Zone ID usado para os registros DNS, quando dominio customizado estiver habilitado."
  value       = local.should_create_domain_resources ? local.route53_zone_id : null
}

output "route53_name_servers" {
  description = "Nameservers da hosted zone criada pelo Terraform. Configure estes NS no registrador do dominio."
  value       = local.should_create_hosted_zone ? aws_route53_zone.site[0].name_servers : []
}
