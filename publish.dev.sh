
docker build --build-arg env=dev -t sdk-dev:0.0.1         -f ./Dockerfile .
docker tag sdk-dev:0.0.1 zqbc-scrm-new-docker.pkg.coding.net/renew/test/sdk-dev:0.0.1
docker push zqbc-scrm-new-docker.pkg.coding.net/renew/test/sdk-dev:0.0.1



ssh root@10.0.0.49 -p 22



docker pull zqbc-scrm-new-docker.pkg.coding.net/renew/test/sdk-dev:0.0.1
docker run -d -p 9501:80 zqbc-scrm-new-docker.pkg.coding.net/renew/test/sdk-dev:0.0.1


docker run -detach --publish 80:80 --name sdk-dev-container sdk-dev:0.0.1
