class Track {
    constructor({
                    reportLeaveAndVisit, reportVisit
                }) {

        this.reportLeaveAndVisit = reportLeaveAndVisit;
        this.reportVisit = reportVisit;

        this.state = {
            firstLoad: false,
            firstReportVisitDone: false
        }
        this.firstPageLoad()


        let that = this
        history.pushState = (()=>{
            let orig = window.history.pushState;
            return function () {
                let state = arguments[0];
                let newHistoryEvent = orig.apply(this,
                    [{
                        timeStamp: that.createTimeStamp() ,
                        ...state
                    },
                        arguments[1],
                        arguments[2]
                    ]

                );
                let e = new Event('pushState');
                e.arguments = arguments;
                window.dispatchEvent(e);
                return newHistoryEvent;
            }
        })()





        window.addEventListener("popstate", function(e) {

            //记录当前state
            that.updateCurrentState((()=>{
                let state = that.getCurrentState()
                return state.timeStamp
            })())



            let currentState = history.state
            if(currentState === null){
                that.goBack()
            }else{
                let oldState = JSON.parse(localStorage.getItem('preState'))
                let currentIndex = that.getStateIndex(currentState.timeStamp)
                let oldIndex = that.getStateIndex(oldState.timeStamp)
                if(!oldIndex){
                    debugger
                }

                var res = (currentState.timeStamp - oldState.timeStamp)

                //单页应用
                if(res < 0 ){
                    that.goBack()
                }else{
                    that.goForward()
                }
            }

            if(e.state === null){
                localStorage.setItem('preState', JSON.stringify(window.firstState))
                trackCase.updatePreState(window.firstState)
            }else{
                localStorage.setItem('preState', JSON.stringify(e.state))
                trackCase.updatePreState(history.state.timeStamp)
            }
        }, false);


        window.addEventListener('pageshow', ()=>{

            if(history.state === null){
                this.goForward()
            }else{
                this.goBack()
            }
        }, false)



        //待优化  start
        window.firstState = {
            isFirstState: true,
            timeStamp: this.createTimeStamp()
        }
        this.pushStateArr(window.firstState)
        //待优化  end

    }
    firstPageLoad(){

        let handle = ()=>{
            this.firstReportVisit()
        }
        window.removeEventListener('load',handle)
        window.addEventListener('load', handle, false)

        window.removeEventListener('pageshow',handle)
        window.addEventListener('pageshow', handle, false)
    }
    firstReportVisit(){
        if(!this.state.firstLoad){
            this.state.firstLoad = true
            //上报访问
            setTimeout(()=>{
                this.urlAddOriginPage()
                this.state.firstReportVisitDone = true
            },300)
        }
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
    urlAddOriginPage({
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

        if(reportAll){
            this.reportLeaveAndVisit()
        }else{
            this.reportVisit()
        }
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
    getState(){
        return JSON.parse(localStorage.getItem('stateArr'))
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
    createTimeStamp(){
        if(!window.count){
            window.count = 0
        }
        window.count++;
        if(window.count === 9){
            window.count = 0
        }
        return Date.now() + window.count
    }
    scanAlink(){
        document.querySelectorAll('a').forEach((a)=>{
            var res = this.addOriginPage(a.getAttribute('href'))
            a.setAttribute('href', res)
        })
    }
    addOriginPage(href){
        if(href.indexOf('?') !== -1){
            href += '&originPage=' + getOriginPage(location)
        }else{
            href += '?originPage=' + getOriginPage(location)
        }
        return href
    }
}

trackCase = new Track({
    reportLeaveAndVisit:  besChannesSDK.reportLeaveAndVisit,
    reportVisit: besChannesSDK.reportVisit,
})

