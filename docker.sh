#!/usr/bin/env node

# $1 是版本号
# 镜像打包
docker build -t track-sdk-web-$2:$1 .
# 镜像打标签
docker tag track-sdk-web-$2:$1 ccr.ccs.tencentyun.com/renew_test/track-sdk-web-$2:$1
# push 到远程镜像仓库
docker push ccr.ccs.tencentyun.com/renew_test/track-sdk-web-$2:$1
