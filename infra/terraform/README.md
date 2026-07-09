# Infraestrutura AWS (S3 + CloudFront)

Este diretório provisiona a hospedagem estática do portfolio em AWS usando:

- S3 privado para armazenar os arquivos do build
- CloudFront para entrega do conteúdo
- OAC (Origin Access Control) para acesso seguro S3 <- CloudFront

A estrutura já está preparada para domínio customizado + certificado ACM + Route53 por variáveis opcionais.

## Pré-requisitos

- Terraform >= 1.15.7
- AWS CLI configurado por credenciais de ambiente
- Permissões AWS para S3, CloudFront, IAM Policy, ACM e Route53 (quando domínio customizado estiver habilitado)

## Backend remoto

O state usa backend S3 com lock nativo via arquivo (`use_lockfile = true`).

Antes do primeiro deploy, crie um bucket S3 dedicado para o state, com versionamento habilitado. O backend fica parcial em `versions.tf`; a pipeline completa a configuração no `terraform init` a partir das GitHub Variables:

```bash
terraform -chdir=infra/terraform init \
  -backend-config="bucket=$TF_STATE_BUCKET" \
  -backend-config="key=$TF_STATE_KEY" \
  -backend-config="region=$TF_STATE_REGION" \
  -backend-config="encrypt=true" \
  -backend-config="use_lockfile=true"
```

## CI/CD

O deploy oficial acontece pelo GitHub Actions:

- `CI`: roda em PRs e pushes para `main`, bloqueando por lint, build, audit de segurança, formatação Terraform, TFLint, Trivy IaC, validação Terraform e plan especulativo quando as credenciais AWS estão disponíveis.
- `Dependency Review`: bloqueia PRs que introduzem dependências vulneráveis.
- `AWS Connectivity`: roda manualmente para validar OIDC, acesso ao bucket de state e inicialização do backend remoto.
- `Deploy`: roda manualmente, gera `terraform plan` e só aplica no environment `production` após aprovação.
- `Destroy`: roda manualmente, exige execução pelo owner, aprovação do environment `production`, esvazia o bucket versionado do site e executa `terraform destroy`.

Configure no GitHub em `Settings -> Secrets and variables -> Actions`, no
escopo do repositório ou da organização:

- Secret `AWS_PLAN_ROLE_ARN`: role assumida via OIDC por CI e `terraform plan`.
- Secret `AWS_DEPLOY_ROLE_ARN`: role assumida via OIDC pelo `apply` no environment `production`.
- Variable `AWS_REGION`: região principal da infra.
- Variables `TF_STATE_BUCKET`, `TF_STATE_KEY`, `TF_STATE_REGION`: backend S3 do Terraform.
- Variable `TF_VAR_PROJECT_NAME`: nome do projeto.
- Variables opcionais de domínio: `TF_VAR_ENABLE_CUSTOM_DOMAIN`, `TF_VAR_DOMAIN_NAME`, `TF_VAR_HOSTED_ZONE_ID`, `TF_VAR_CREATE_ACM_CERTIFICATE`.
  Se `TF_VAR_HOSTED_ZONE_ID` ficar vazio e domínio customizado estiver ativo, o Terraform cria uma public hosted zone.
- Secret opcional `TF_VAR_ACM_CERTIFICATE_ARN`: quando usar certificado ACM existente.

Crie também o GitHub Environment `production` com reviewers obrigatórios para aprovar o `terraform apply`.
O job de `plan` lê as variables do backend antes da aprovação do Environment
`production`.

## Ciclo básico

`npm run infra:validate` executa `terraform validate -no-color`. Rode `terraform init` com `-backend-config` antes da validação quando estiver em um checkout novo.

```bash
terraform -chdir=infra/terraform init \
  -backend-config="bucket=$TF_STATE_BUCKET" \
  -backend-config="key=$TF_STATE_KEY" \
  -backend-config="region=$TF_STATE_REGION" \
  -backend-config="encrypt=true" \
  -backend-config="use_lockfile=true"
npm run infra:validate
terraform fmt -recursive
terraform plan
terraform apply
```

Para rodar localmente, exporte credenciais AWS no ambiente.

## Outputs úteis

```bash
terraform output cloudfront_domain_name
terraform output cloudfront_distribution_id
terraform output s3_bucket_name
```

## Deploy da aplicação

Fluxo executado pela pipeline:

```bash
terraform -chdir=infra/terraform apply
npm run build
aws s3 sync dist/ s3://<bucket>
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
```

O Terraform:

1. provisiona ou atualiza infraestrutura
2. expõe `website_url`, `s3_bucket_name` e `cloudfront_distribution_id`

O workflow:

1. gera o build React com `VITE_PUBLIC_SITE_URL=<website_url>`
2. envia `dist/` para o bucket S3 (`--delete`)
3. aplica cache longo para assets e cache curto para `index.html`
4. cria invalidação `/*` no CloudFront

Observação: no fluxo oficial, isso roda na pipeline com credenciais OIDC. O deploy usa AWS CLI em steps dedicados, fora do `terraform apply`.

## Domínio customizado

Configure estas variables/secrets no GitHub:

- `TF_VAR_ENABLE_CUSTOM_DOMAIN = true`
- `TF_VAR_DOMAIN_NAME = "portfolio.seudominio.com"`
- `TF_VAR_HOSTED_ZONE_ID = "ZXXXXXXXXXXXXX"` para usar uma zone existente, ou vazio para criar uma public hosted zone

Escolha um modo de certificado:

- Criar certificado automaticamente: `TF_VAR_CREATE_ACM_CERTIFICATE = true`
- Usar certificado existente (em `us-east-1`):
  - `TF_VAR_CREATE_ACM_CERTIFICATE = false`
  - secret `TF_VAR_ACM_CERTIFICATE_ARN = "arn:aws:acm:us-east-1:...:certificate/..."`

Depois rode o workflow `Deploy`.

Se o Terraform criar a hosted zone, copie o output `route53_name_servers` e configure esses nameservers no registrador do domínio.

## Troubleshooting rápido

- Site vazio ou antigo: rode invalidação CloudFront novamente.
- Erro 403 em rota SPA: confirme `custom_error_response` para 403/404 -> `/index.html`.
- Acesso direto ao bucket S3 deve falhar (bucket privado por design).
