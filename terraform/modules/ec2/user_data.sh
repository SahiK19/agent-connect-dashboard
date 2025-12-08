#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

aws ecr get-login-password --region ${aws_region} | docker login --username AWS --password-stdin ${ecr_repository_url}

docker pull ${ecr_repository_url}:latest
docker run -d -p 80:80 --name backend ${ecr_repository_url}:latest

cat > /usr/local/bin/docker-cleanup.sh << 'EOF'
#!/bin/bash
IMAGE_COUNT=$(docker images -q | wc -l)
if [ $IMAGE_COUNT -gt 5 ]; then
  docker images --format "{{.ID}} {{.CreatedAt}}" | sort -rk 2 | tail -n +6 | awk '{print $1}' | xargs -r docker rmi -f
fi
EOF

chmod +x /usr/local/bin/docker-cleanup.sh
echo "0 2 * * * /usr/local/bin/docker-cleanup.sh" | crontab -
