provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      project       = var.project_name
      environment   = var.environment
      managed_by    = "terraform"
      web-portfolio = "1"
    }
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      project       = var.project_name
      environment   = var.environment
      managed_by    = "terraform"
      web-portfolio = "1"
    }
  }
}
