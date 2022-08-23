import CollectWeb from "../collect-web/collect-web";
import getUtmJson, {parseUrl, getOriginPage} from "./parseUrl";
class CollectWebTracing extends CollectWeb{
    constructor() {
        super()





        window.addEventListener("popstate", (e)=> {

            //记录当前state
            this.updateCurrentState((()=>{
                let state = this.getCurrentState()
                return state.timeStamp
            })())



            let currentState = history.state
            if(currentState === null){
                this.goBack()
            }else{
                let oldState = JSON.parse(localStorage.getItem('preState'))
                let currentIndex = this.getStateIndex(currentState.timeStamp)
                let oldIndex = this.getStateIndex(oldState.timeStamp)
                if(!oldIndex){
                    debugger
                }

                var res = (currentState.timeStamp - oldState.timeStamp)

                //单页应用
                if(res < 0 ){
                    this.goBack()
                }else{
                    this.goForward()
                }
            }

            if(e.state === null){
                localStorage.setItem('preState', JSON.stringify(window.firstState))
                this.updatePreState(window.firstState)
            }else{
                localStorage.setItem('preState', JSON.stringify(e.state))
                this.updatePreState(history.state.timeStamp)
            }
        }, false);
    }

    //覆盖生命周期      onPageShow + onChangeState
    onPageShow(){
        this.addOriginPage()
        console.log('补充参数')
        this.reportVisit()

    }

    onChangeState(type){
        if(type == 'pushState'){

            localStorage.setItem('preState', JSON.stringify(history.state || {}))
            this.pushStateArr(history.state)
            this.updateCurrentState(history.state.timeStamp)
            this.updatePreState(history.state.timeStamp)



            if(!history.state.traceFlag){
                //用户的pushState  需要补充originPage
                this.addOriginPage({
                    isUsePush: true,
                    reportAll: true
                })
                this.reportLeaveAndVisit()
            }
        }else if(type == 'popState'){
            this.reportLeaveAndVisit()
        }


    }

    //上报之前 留出扩展参数的机会
    onBeforeReport(query){
        let location =  window.location
        if(this.mappingAddress && this.parseMapping(this.mappingAddress)){
            let url = this.parseMapping(this.mappingAddress)
            if(url){
                location = parseUrl(url)
            }

        }
        let utmJson = getUtmJson(location, 'link')
        return {
            ...query,
            ...utmJson
        }
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




    getState(){
        return JSON.parse(localStorage.getItem('stateArr'))
    }
    updateCurrentState(timeStamp){
        let arr = this.getState()
        arr.forEach((item)=>{
            if(item.timeStamp === timeStamp){
                item.isCurrent = true
            }else{
                item.isCurrent = false
            }
        })
        localStorage.setItem('stateArr',JSON.stringify(arr))
    }
    pushStateArr(state){
        let arr = (()=>{
            if(!localStorage.getItem('stateArr')){
                return []
            }else{
                return JSON.parse(localStorage.getItem('stateArr'))
            }
        })()
        arr.push(state)
        localStorage.setItem('stateArr',JSON.stringify(arr))
    }
    updatePreState(timeStamp){
        let arr = this.getState()
        arr.forEach((item)=>{
            if(item.timeStamp === timeStamp){
                item.isPreState = true
            }else{
                item.isPreState = false
            }
        })
        localStorage.setItem('stateArr',JSON.stringify(arr))
    }
    getCurrentState(){
        if(history.state === null){
            return window.firstState
        }else{
            return history.state
        }
    }
    goBack(){
        let state = this.getCurrentState()
        if(!state.traceFlag){
            history.back()
        }
    }
    goForward(){
        let state = this.getCurrentState()
        if(!state.traceFlag){
            history.forward()
        }
    }
    getStateIndex(timeStamp){
        let states = this.getState()
        let res
        states.forEach((state, index)=>{
            if(state.timeStamp === timeStamp){
                res =  index
            }
        })
        return res
    }
}
export default CollectWebTracing
