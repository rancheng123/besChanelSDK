import CollectWebTracing from "../../sdk/reportSDK/src/collect-web-tracing/collect-web-tracing";


const besChannesSDK = new CollectWebTracing();
besChannesSDK.init({autoCollect:false,events:["BUTTON"]});

besChannesSDK.recieveSelfParmas({
    memberid: 123,
    openid: 123,
    mappingAddress: JSON.stringify({
        '/index.html': '/index2.html',
        '/meetings/MeetingPc/Detail': '/meetings-api/sapIndex/SapSourceData'
    })
})



