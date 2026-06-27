#!/bin/bash

# Wait for terraform to finish
echo "Waiting for terraform apply to complete..."
while pgrep -x "terraform" > /dev/null; do
    sleep 5
done

echo "Terraform apply finished. Deploying MCP Server..."
cd /home/charizard/agentt/mcp-server

MCP_DEPLOY_OUT=$(~/google-cloud-sdk/bin/gcloud run deploy mcp-server \
  --source . \
  --region us-central1 \
  --set-env-vars="MONGODB_URI=<YOUR_MONGODB_URI>" \
  --allow-unauthenticated \
  --project project-849bbb76-ad72-4c26-bb8 --format="value(status.url)")

echo "MCP Server deployed at: $MCP_DEPLOY_OUT"

echo "Deploying Vector App..."
cd /home/charizard/agentt/vector-app

FRONTEND_DEPLOY_OUT=$(~/google-cloud-sdk/bin/gcloud run deploy vector-app \
  --source . \
  --region us-central1 \
  --set-env-vars="MCP_SERVER_URL=$MCP_DEPLOY_OUT" \
  --allow-unauthenticated \
  --project project-849bbb76-ad72-4c26-bb8 --format="value(status.url)")

echo "Frontend deployed at: $FRONTEND_DEPLOY_OUT"

echo "Deployment Successful! Frontend URL: $FRONTEND_DEPLOY_OUT" > /home/charizard/agentt/deployment_success.txt
