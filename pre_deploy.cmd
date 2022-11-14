#!/bin/sh

echo "============== Starting sync dependencies ==============="

echo "Installing dependencies"
cd frontend/ && npm i && cd ../backend/ && npm i
echo "\n"

echo "Building react frontend"
cd ../frontend/ && npm run build
echo "\n"

echo "Sync build to backend folder"
cd ../
rsync -arv frontend/build backend/
echo "\n"

echo "================ Synced dependencies ==============="