# Hybrid IDS - Terraform Infrastructure

## Prerequisites
- AWS CLI configured
- Terraform installed
- AWS account with appropriate permissions

## Setup

1. Initialize Terraform:
```bash
terraform init
```

2. Review the plan:
```bash
terraform plan
```

3. Apply the infrastructure:
```bash
terraform apply
```

4. Note the outputs (S3 bucket name, ECR repository URL, EC2 IP, etc.)

## GitHub Secrets Required

Add these secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `S3_BUCKET_NAME` - S3 bucket name from Terraform output
- `ECR_REPOSITORY_NAME` - ECR repository name (hybrid-ids-backend)
- `EC2_HOST` - EC2 public IP from Terraform output
- `EC2_SSH_PRIVATE_KEY` - SSH private key for EC2 access

## Cleanup

To destroy all resources:
```bash
terraform destroy
```
