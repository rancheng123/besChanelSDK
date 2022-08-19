import Collect from "./collect";
import {addEvent} from "./utils";
import {firstPageLoad} from "../../common/utils";
class CollectWeb extends Collect{
    constructor() {
        super()
    }
    // 注册事件
    registerEvent() {

        firstPageLoad(()=>{
            this.reportVisit()
        })

        // 改写replaceState和pushState，以确保window能监听到
        history.replaceState = addEvent('replaceState');
        //history.pushState = addEvent('pushState');
        window.addEventListener('replaceState', (state) => this.onPushStateHandle(state));
        window.addEventListener('pushState', (state) => this.onPushStateHandle(state));

        window.addEventListener('popstate', (state) => this.onPopStateHandle(state));
        window.addEventListener('beforeunload', (state) => this.onBeforeunloadHandle(state));
        // 监听页面是显示和隐藏
        window.addEventListener('visibilitychange', (state) => this.onHiddenOrShow(state))
        // 监听页面的点击事件
        window.addEventListener('click', (e) => this.autoCollectUpload(e))
    }
}
export default CollectWeb
