import Collect from "../sdk/src/collect";
import CollectWeb from "../sdk/src";

const besChannesSDK = new CollectWeb();
besChannesSDK.init({autoCollect:false,events:["BUTTON"]});

besChannesSDK.recieveSelfParmas({
    memberid: 123,
    openid: 123,
    mappingAddress: JSON.stringify({
        '/index.html': '/index2.html',
        '/meetings/MeetingPc/Detail': '/meetings-api/sapIndex/SapSourceData'
    })
})



