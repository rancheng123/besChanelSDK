cd /d/workSpace/frontend-sdk/cms-track-sdk
npm run build:prod
cp ./dist/collect-0.0.1.min.js ./dist/besChannel.js



cd /d/workSpace/renew/frontend/base-component/
#开发处-----
#拷贝SDK 到 20220621_rancheng_tracing
#提交 push
#合并到 dev
#切回 20220621_rancheng_tracing




#部署处-----
#切换项目分支
cd /d/BaiduNetdiskDownload/knowlege/Linux/shellFunction/
sh switchBranch.sh /d/depoly/frontend/base-component dev




#切换分支 end

sh /d/depoly/deploy/publishDev/.startDpr base-component dev
