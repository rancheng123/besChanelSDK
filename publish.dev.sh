
docker build --build-arg env=dev -t sdk-dev:0.0.2         -f ./Dockerfile .
docker tag sdk-dev:0.0.2 zqbc-scrm-new-docker.pkg.coding.net/renew/test/sdk-dev:0.0.2
docker push zqbc-scrm-new-docker.pkg.coding.net/renew/test/sdk-dev:0.0.2



ssh root@10.0.0.49 -p 22

docker pull zqbc-scrm-new-docker.pkg.coding.net/renew/test/sdk-dev:0.0.2


containerid=`docker ps |grep sdk-dev | awk '{ print $1 }'`
docker stop $containerid

docker run -d -p 9501:80 zqbc-scrm-new-docker.pkg.coding.net/renew/test/sdk-dev:0.0.2




