import CollectWeb from "../../sdk/reportSDK/src/collect-web/collect-web";

const besChannesSDK = new CollectWeb();
besChannesSDK.init({autoCollect:false,events:["BUTTON"]});

besChannesSDK.recieveSelfParmas({
    memberid: 123,
    openid: 123,
    mappingAddress: JSON.stringify({
        //'/index.html': '/index2.html',
        '/meetings/MeetingPc/Detail': '/meetings-api/sapIndex/SapSourceData'
    })
})



