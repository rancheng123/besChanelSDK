import CollectWeb from "../collect-web/collect-web";
import getUtmJson from "./parseUrl";
class CollectWebTracing extends CollectWeb{
    constructor() {
        super()
    }
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
}
export default CollectWebTracing
