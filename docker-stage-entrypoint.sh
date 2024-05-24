#!/bin/sh

# Verify database migrations
if ! prisma migrate status > /dev/null 2>&1; then
    echo "Aplying migrations"
    npx prisma migrate dev --name=_
else
    echo "Migrations already applied"
    npx prisma migrate deploy
fi

# Start app
echo "Starting application..."
exec yarn start:prod