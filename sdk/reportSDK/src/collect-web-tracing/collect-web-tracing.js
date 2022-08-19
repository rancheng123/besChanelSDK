import CollectWeb from "../collect-web/collect-web";
import getUtmJson, {parseUrl} from "./parseUrl";
class CollectWebTracing extends CollectWeb{
    constructor() {
        super()
    }

    // //覆盖生命周期
    // onPageShow(){
    //
    //
    // }
    extendReportParam(){
        let location =  window.location
        if(this.mappingAddress && this.parseMapping(this.mappingAddress)){
            let url = this.parseMapping(this.mappingAddress)
            if(url){
                location = parseUrl(url)
            }

        }
        let utmJson = getUtmJson(location, 'link')
        return utmJson
    }
    addOriginPage({
                         isUsePush = false,
                         reportAll = false,
                     } = {}){
        let originPage
        if(isUsePush){
            originPage = localStorage.getItem('originPage').replace(/\"/g,'')
        }else{
            let dataFrom
            //有指定的跳转链接
            if(this.mappingAddress && this.parseMapping(this.mappingAddress)){
                if(document.referrer){
                    dataFrom = {
                        href: document.referrer,
                        search: '?' + document.referrer.split('?')[1]
                    }
                }else{
                    let url = this.parseMapping(this.mappingAddress)
                    if(url){
                        dataFrom = parseUrl(url)
                    }
                }
                if(dataFrom){
                    originPage = getOriginPage(dataFrom)
                }

            }else{
                //首次进入
                if(!document.referrer && location.href.match("utm_")){
                    dataFrom = location
                }else if(document.referrer){
                    dataFrom = {
                        href: document.referrer,
                        search: '?' + document.referrer.split('?')[1]
                    }
                }
                if(dataFrom){
                    originPage = getOriginPage(dataFrom)
                }
            }
        }



        if(!location.href.match('originPage')){
            let link = window.location.href
            if (originPage) {
                //如果未加密， 加密
                if(originPage.match(/http(s)?\:\/\//)){
                    originPage = encodeURIComponent(originPage)
                }

                if(!location.search){
                    link += '?originPage=' + originPage
                }else{
                    link += '&originPage=' + originPage
                }
            }

            history.pushState({
                'traceFlag': 1,
                'page_id': link
            }, document.title, link)
            //设置缓存
            localStorage.setItem('originPage', originPage)
            //补完参数，上报
        }
    }
}
export default CollectWebTracing
