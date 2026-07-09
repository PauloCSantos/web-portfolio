locals {
  computed_bucket_name = lower(replace("${var.project_name}-${var.environment}-site", "_", "-"))
  bucket_name          = length(trimspace(var.site_bucket_name)) > 0 ? var.site_bucket_name : local.computed_bucket_name

  should_create_domain_resources = var.enable_custom_domain
  should_create_acm              = var.enable_custom_domain && var.create_acm_certificate
  should_create_hosted_zone      = var.enable_custom_domain && length(trimspace(var.hosted_zone_id)) == 0
  should_redirect_www            = var.enable_custom_domain && var.enable_www_redirect

  www_domain_name          = "www.${var.domain_name}"
  cloudfront_aliases       = local.should_redirect_www ? [var.domain_name, local.www_domain_name] : [var.domain_name]
  redirect_function_name   = "${var.project_name}-${var.environment}-www-redirect"
  redirect_function_prefix = "https://${var.domain_name}"
  route53_zone_id          = local.should_create_hosted_zone ? aws_route53_zone.site[0].zone_id : var.hosted_zone_id

  viewer_certificate_arn = var.enable_custom_domain ? (
    var.create_acm_certificate ? aws_acm_certificate_validation.site[0].certificate_arn : var.acm_certificate_arn
  ) : null

  cert_validation_records = local.should_create_acm ? {
    for dvo in aws_acm_certificate.site[0].domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  website_url = local.should_create_domain_resources ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

resource "aws_route53_zone" "site" {
  count = local.should_create_hosted_zone ? 1 : 0
  name  = var.domain_name

  comment = "Public hosted zone for ${var.project_name} ${var.environment}"
}

resource "aws_s3_bucket" "site" {
  bucket        = local.bucket_name
  force_destroy = var.environment != "prod"
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "site" {
  bucket = aws_s3_bucket.site.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.project_name}-${var.environment}-oac"
  description                       = "OAC para acesso privado do CloudFront ao bucket S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_function" "www_redirect" {
  count   = local.should_redirect_www ? 1 : 0
  name    = local.redirect_function_name
  runtime = "cloudfront-js-2.0"
  comment = "Redirect www host to canonical root domain"
  publish = true
  code    = <<-EOT
function handler(event) {
  var request = event.request;
  var host = request.headers.host && request.headers.host.value;

  if (host === "${local.www_domain_name}") {
    var target = "${local.redirect_function_prefix}" + request.uri;
    var querystring = request.querystring;
    var queryKeys = Object.keys(querystring || {});

    if (queryKeys.length > 0) {
      target += "?" + queryKeys.map(function (key) {
        var value = querystring[key].value;
        return value === "" ? key : key + "=" + value;
      }).join("&");
    }

    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: {
        location: {
          value: target
        },
        "cache-control": {
          value: "public,max-age=31536000,immutable"
        }
      }
    };
  }

  return request;
}
EOT
}

resource "aws_cloudfront_response_headers_policy" "site_security_headers" {
  name = "${var.project_name}-${var.environment}-security-headers"

  security_headers_config {
    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    strict_transport_security {
      access_control_max_age_sec = 63072000
      include_subdomains         = true
      preload                    = false
      override                   = true
    }

    xss_protection {
      protection = true
      mode_block = true
      override   = true
    }

    content_security_policy {
      content_security_policy = "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; upgrade-insecure-requests"
      override                = true
    }
  }
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} (${var.environment})"
  default_root_object = "index.html"
  aliases             = local.should_create_domain_resources ? local.cloudfront_aliases : []

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-site-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "s3-site-origin"
    viewer_protocol_policy     = "redirect-to-https"
    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.site_security_headers.id
    compress                   = true

    dynamic "function_association" {
      for_each = local.should_redirect_www ? [aws_cloudfront_function.www_redirect[0].arn] : []

      content {
        event_type   = "viewer-request"
        function_arn = function_association.value
      }
    }
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = local.should_create_domain_resources ? false : true
    acm_certificate_arn            = local.should_create_domain_resources ? local.viewer_certificate_arn : null
    ssl_support_method             = local.should_create_domain_resources ? "sni-only" : null
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}

resource "aws_acm_certificate" "site" {
  count                     = local.should_create_acm ? 1 : 0
  provider                  = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = local.should_redirect_www ? [local.www_domain_name] : []
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = local.cert_validation_records

  zone_id = local.route53_zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]
}

resource "aws_acm_certificate_validation" "site" {
  count    = local.should_create_acm ? 1 : 0
  provider = aws.us_east_1

  certificate_arn         = aws_acm_certificate.site[0].arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

resource "aws_route53_record" "site_alias" {
  count   = local.should_create_domain_resources ? 1 : 0
  zone_id = local.route53_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "site_alias_ipv6" {
  count   = local.should_create_domain_resources ? 1 : 0
  zone_id = local.route53_zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_redirect_alias" {
  count   = local.should_redirect_www ? 1 : 0
  zone_id = local.route53_zone_id
  name    = local.www_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_redirect_alias_ipv6" {
  count   = local.should_redirect_www ? 1 : 0
  zone_id = local.route53_zone_id
  name    = local.www_domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

data "aws_iam_policy_document" "site_bucket_policy" {
  statement {
    sid    = "AllowCloudFrontReadOnly"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = ["s3:GetObject"]

    resources = [
      "${aws_s3_bucket.site.arn}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site_bucket_policy.json
}
