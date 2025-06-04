# Run this script by using sh docker-container-build.sh
docker build -t auto-booking-backend -f ./Dockerfile.backend .
docker build -t auto-booking-frontend -f ./Dockerfile.frontend .
docker-compose up