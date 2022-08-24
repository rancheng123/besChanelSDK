docker build -t sdk-stg:0.0.1 -f ./Dockerfile . --build-arg env=dev

docker run -detach --publish 80:80 --name sdk-stg-container sdk-stg:0.0.1
