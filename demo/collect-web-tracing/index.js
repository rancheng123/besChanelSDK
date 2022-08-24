import CollectWebTracing from "../../sdk/reportSDK/src/collect-web-tracing/collect-web-tracing";


const besChannesSDK = new CollectWebTracing();
besChannesSDK.init({
    events:["BUTTON"],
    customParams: {
        memberid: 123,
        openid: 123,
        target_type: 'page_title',
        system_type: '官网',
        mappingAddress: JSON.stringify({
            //'/index.html': '/index2.html',
            '/meetings/MeetingPc/Detail': '/meetings-api/sapIndex/SapSourceData'
        })
    }
});



