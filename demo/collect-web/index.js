import CollectWeb from "../../sdk/reportSDK/src/collect-web/collect-web";

const besChannesSDK = new CollectWeb();
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



window.addEventListener('load',()=>{
    document.getElementById('search').onclick=(e)=>{
        besChannesSDK.eventClick(e)
    }
}, false)






