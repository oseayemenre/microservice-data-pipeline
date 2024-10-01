#!/bin/bash

echo "stopping the broker..."

docker-compose -f docker-compose.broker.yml down

echo "cleaning out the old volumes..."

docker volume prune -a
