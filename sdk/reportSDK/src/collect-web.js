import Collect from "./collect";
import {addEvent, getCurrentTime} from "./utils";
import {firstPageLoad} from "../../common/utils";
class CollectWeb extends Collect{
    constructor() {
        super()
    }
    // 注册事件
    registerEvent() {

        firstPageLoad(()=>{
            debugger
            this.reportVisit()
        })
        window.addEventListener('beforeunload', (state) => {
            this.reportLeave()
        });







        // 改写replaceState和pushState，以确保window能监听到
        history.replaceState = addEvent('replaceState');
        window.addEventListener('replaceState', (state) => {
            this.reportLeaveAndVisit()
        });
        window.addEventListener('pushState', (state) => {
            this.reportLeaveAndVisit()
        });
        window.addEventListener('popstate', (state) => {
            this.reportLeaveAndVisit()
        });

        // 监听页面是显示和隐藏
        window.addEventListener('visibilitychange', (state) => {
            // 页面隐藏和显示
            if(document.hidden || document.visibilityState === "hidden"){
                this.computedLeaveTimeAndDuration()
            }else{
                debugger
                this.params.visitTime = getCurrentTime()
            }
        })
        // 监听页面的点击事件
        window.addEventListener('click', (e) => this.autoCollectUpload(e))
    }
}
export default CollectWeb
