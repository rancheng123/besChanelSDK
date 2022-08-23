import Collect from "../base/collect";
import {addEvent, getCurrentTime} from "../utils";
import {firstPageLoad} from "../../../common/utils";



class CollectWeb extends Collect{
    constructor() {
        super()

        // 注册事件
        this.registerEvent();

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

    // 注册事件
    registerEvent() {

        let that = this;

        history.pushState = (()=>{
            let orig = window.history.pushState;
            return function () {
                let state = arguments[0];
                let newHistoryEvent = orig.apply(this,
                    [{
                        timeStamp: that.createTimeStamp(),
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



        firstPageLoad(()=>{
            this.onPageShow()
        })
        window.addEventListener('beforeunload', (state) => {
            this.onPageBeforeUnload()
        });

        // 改写replaceState和pushState，以确保window能监听到
        history.replaceState = addEvent('replaceState');
        window.addEventListener('replaceState', (state) => {
            this.onChangeState('replaceState')
        });
        window.addEventListener('pushState', (state) => {
            this.onChangeState('pushState')
        });
        window.addEventListener('popstate', (state) => {
            this.onChangeState('popstate')
        });

        // 监听页面是显示和隐藏
        window.addEventListener('visibilitychange', (state) => {
            // 页面隐藏和显示
            if(document.hidden || document.visibilityState === "hidden"){
                this.computedLeaveTimeAndDuration()
            }else{
                this.params.visitTime = getCurrentTime()
            }
        })
        // 监听页面的点击事件
        window.addEventListener('click', (e) => {
            this.onClick(e)
        })
    }

    //生命周期   start
    onPageShow(){
        this.reportVisit()
    }
    onChangeState(type){
        this.reportLeaveAndVisit()
    }
    onClick(e){
        this.eventClick(e)
    }
    onPageBeforeUnload(){
        this.reportLeave()
    }

    //生命周期   end
}
window.CollectWeb = CollectWeb
export default CollectWeb
