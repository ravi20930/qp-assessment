#!/bin/sh

# Define a list of required environment variables
REQUIRED_ENV_VARS=(
    "NODE_ENV"
    "PORT"
    "DB_CONNECTION"
    "DB_HOST"
    "DB_DATABASE"
    "DB_USERNAME"
    "DB_PASSWORD"
    "JWT_ACCESS_SECRET"
    "JWT_ACCESS_EXPIRY"
    "JWT_REFRESH_SECRET"
    "JWT_REFRESH_EXPIRY"
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "GOOGLE_AUTH_CALLBACK_URL"
)

# Check if all required environment variables are set
for var in "${REQUIRED_ENV_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Environment variable $var is not set."
        exit 1
    fi
done

echo "All required environment variables are set."
