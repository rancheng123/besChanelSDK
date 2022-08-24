/**
 * 数据收集
 */
  import privateMethods from '../private';
  import { addEvent, register, remove, getCurrentTime,hasEvent } from '../utils';
  import Axios from 'axios';
  const baseUrl = {
    development:'https://exp-stg.beschannels.com/collect/collect.gif',
    test:'https://exp-stg.beschannels.com/collect/collect.gif',
    release:'https://exp-stg.beschannels.com/collect/collect.gif',
    production:'https://exp.beschannels.com/collect/collect.gif',
  }
  /**
   * 数据收集
   * @params org_id 主账号ID
   * @params customer_id 客户ID
   */
  class Collect {
     constructor({org_id,customer_id,module_type} = {}){
      // 初始化数据
      this.commonProperties = {
        token:'XXXX',
        fingerprint_id: "", // 指纹id
        anonymous_id: "",// 匿名id
        session_id:"", // 会话id
        useragent:"", // UserAgent
        model :"", // 设备型号
        os :"", // 操作系统
        os_version :"", // 操作系统版本
        browser:"", // 浏览器名
        browser_version :"", // 浏览器版本
        lib_version: '1.0.0', // SDK版本
        org_id,  // 主账号ID
        customer_id: customer_id ? customer_id : "" , // 客户ID
        log_type:"user", // 日志类型	system 系统发送（时长）， user 用户发送
        module_type:module_type ? module_type: ""
      };
      this.pageSession =""; // 页面会话ID，一个会话中只能存在一个，访问页面和点击事件需要传递
      // 访问数据
      this.visitParams = {}; // 访问上报数据
      this.eventData = {}; // 点击事件上报数据
      this.params = {
        view_duration:0
      };
      this.optionsParams = {};
      this.expiresTime = 30 * 60;
      this.baseUrl = baseUrl[process.env.NODE_ENV],
      this.autoCollect = false
      this.events = ["A"]
      this.getFingerprintId()
      this.getAnonymousId()
      this.getSessionId()
      this.getDeviceInfo();
    }
    // 初始化
   async init(option) {

       const eventTags = option.events || []
       this.events= [...this.events,...eventTags];
       this.autoCollect = option.autoCollect || false
       // 生成指纹ID
       await this.getFingerprintId()
       // 生成匿名ID
       await this.getAnonymousId()
       // 生成会话ID
       await this.getSessionId()
       // 获取浏览器信息
       await this.getDeviceInfo();


       if(option.customParams){

           this.commonProperties = {
               ...this.commonProperties,
               ...option.customParams
           }

           if(option.customParams.mappingAddress){
               this.mappingAddress = option.customParams.mappingAddress
           }
       }


       if(option.autoCollect){
           const visitParams = {
               page_id: window.location,
               page_first_title: document.title,
               source_title: document.referrer
           }
           this._visit(visitParams)
       }

    }
    // 获取指纹ID
     getFingerprintId(){
       const self = this
      return new Promise((resolve, reject) => {
        if(localStorage.getItem("fingerprintId")){
          self.commonProperties.fingerprint_id = localStorage.getItem("fingerprintId")
          resolve()
        }else{
          privateMethods.getDeviceId().then( fingerprintId => {
            self.commonProperties.fingerprint_id = fingerprintId;
            localStorage.setItem("fingerprintId", self.commonProperties.fingerprint_id)
            resolve()
           });
        }
      })
    }
    // 生成一个唯一标识
    getAnonymousId(key){
      if(localStorage.getItem("anonymous_id")){
        this.commonProperties.anonymous_id = localStorage.getItem("anonymous_id")
      }else{
        this.commonProperties.anonymous_id = privateMethods.getUuid(16,16)
        localStorage.setItem("anonymous_id", this.commonProperties.anonymous_id)
        this.commonProperties.is_first = 1
      }
    }
    // 生成一个唯一标识
    getSessionId(){
      const sessionInfo = JSON.parse(localStorage.getItem("sessionInfo"))
      if(sessionInfo){
        let expires = sessionInfo.expires || getCurrentTime()
        const session_id = sessionInfo.session_id
        const now = getCurrentTime()
        // 会话过期

        if(session_id && now >= expires){
          this.commonProperties.session_id = privateMethods.getUuid(16,16)
          expires = getCurrentTime() + this.expiresTime // 过期时间 30分钟
          localStorage.setItem("sessionInfo",JSON.stringify({session_id:this.commonProperties.session_id,expires}))
        }else {

          this.commonProperties.session_id = session_id
        }
      }else{
        // 初始化 会话ID
        this.commonProperties.session_id = privateMethods.getUuid(16,16)
        const expires = getCurrentTime() + this.expiresTime
        localStorage.setItem("sessionInfo",JSON.stringify({session_id:this.commonProperties.session_id,expires}))
      }
    }
    // 获取设备信息
    getDeviceInfo() {
      this.commonProperties.UserAgent = navigator.userAgent.toLowerCase();
      this.commonProperties.os = privateMethods.getOperationSys();
      this.commonProperties.browser = privateMethods.getBrowserInfo()? privateMethods.getBrowserInfo().browser:'';
      this.commonProperties.browser_version = privateMethods.getBrowserInfo()?privateMethods.getBrowserInfo().ver:'';
    }

    // 全埋点实现监听
    eventClick (e) {
      if(hasEvent(e.target.nodeName,this.events)){
        const eventParams = {
          element_content:e.target.innerText,
          element_name:e.target.innerText,
          element_target_url:e.target.href,
          element_class:e.target.className,
          element_id:e.target.id,
        }
        if(e.target.nodeName === "A"){
          // a标签会触发页面离开事件
          Object.assign(this.params,eventParams);
        }else{
          this._eventClick(eventParams)
        }

      }
    }

    computedLeaveTimeAndDuration(){
        this.params.leaveTime  = getCurrentTime()
        let viewDuration = this.params.leaveTime-this.params.visitTime
        if(typeof this.params.view_duration === 'undefined' || isNaN(this.params.view_duration)){
            this.params.view_duration = 0
        }
        if(typeof viewDuration === 'undefined' || isNaN(viewDuration)){
            viewDuration = 30
        }

        this.params.view_duration  = this.params.view_duration + viewDuration
    }



    // 上传数据
    async collectUpload(params) {
      const keys = Object.keys(params)
      const paramsArray = keys.map((item)=>{
        return `${item}=${params[item]}`
      })
      const paramsString = paramsArray.join('&')
      try {
        const img = new Image()
        img.src = `${this.baseUrl}?${paramsString}`
        setTimeout(function(){},1000);
      } catch(err) {
        console.error("上报失败：",err);
      }
      this.commonProperties.is_first = ""
    }
    // 设置请求的baseUrl
    $setBaseUrl(url) {
      if(url) {
        Axios.defaults.baseURL = url;
        return;
      }
    }




      reportLeaveAndVisit(){
          this._calcParams();
          //上报离开
          this.collectUpload(this._concatParams(3)).then(res => {
              this._clearDataParams();
              //上报访问
              this._visit({})
          })
      }

      reportVisit(){
          //上报访问
          this._visit({})
      }

      reportLeave(){
          this._calcParams();
          //上报离开
          this.collectUpload(this._concatParams(3)).then(res => {
              this._clearDataParams();

          })
      }


      parseMapping(mapJson){


          mapJson = JSON.parse(mapJson)


          let arr = []

          var params = location.href.replace(location.origin + location.pathname + '?','').split('&')
          var lastUtmIndex
          params.forEach((item, index)=>{
              if(item.match('utm_') && !item.match('originPage')){
                  lastUtmIndex = index
              }
          })

          params.forEach((item, index)=>{
              if(index <=lastUtmIndex){
                  arr.push(item)
              }
          })



          if(mapJson[location.pathname]){

              return location.origin + mapJson[location.pathname] + '?' + arr.join('&')
          }else{
              return null
          }
      }
      tokenToOrgId(){

          if(document.getElementById('besChannesSDK')){
              let srcValue = document.getElementById('besChannesSDK').getAttribute('src')
              let tokenValue = srcValue.split('?')[1].replace('token=','')
              return tokenValue


          }else {
              return ''
          }

      }




      /**
     * 访问事件触发
     * @param {*} visitParams
     */
    async $visit(visitParams) {
      if(this.autoCollect) return;
      // if(!visitParams.page_id){
      //   return
      // }
      this._visit(visitParams)
    }
    async _visit(visitParams){
        if(!this.commonProperties.org_id){
            var org_id = this.tokenToOrgId()
            if(org_id){
                this.commonProperties.org_id = org_id
            }

        }

      this.getSessionId() // 校验会话是否过期
      if(!this.commonProperties.fingerprint_id){
        await this.getFingerprintId()
      }
      const visitData = {
        behavior_type : "page_view",
        url:privateMethods.referUrlInstance.url,
        url_path:privateMethods.referUrlInstance.urlPath,
        url_host:privateMethods.referUrlInstance.urlHost ,
        referer:privateMethods.referUrlInstance.referUrl ,
        referer_host:privateMethods.referUrlInstance.refererHost ,
        source_type:privateMethods.referUrlInstance.sourceType ,
      }
      this.visitParams = visitParams
      this.params.visitTime = getCurrentTime()
      this.pageSession= privateMethods.getUuid(16,16)
      Object.assign(this.visitParams,visitData,this.commonProperties);
      let commomParams = this._concatParams(1);
      this.collectUpload(commomParams);
    }
    /**
     * 点击事件触发
     * @param {*} eventParams
     */
    $eventClick(eventParams) {
      if(this.autoCollect) return;
      if(!eventParams.element_name){
        return
      }
      this._eventClick(eventParams)
    }
    _eventClick(eventParams){
      this.getSessionId() // 校验会话是否过期
      const eventData = {
        behavior_type:'web_click'
      }
      Object.assign(this.eventData, eventData,eventParams);
      let commomParams = this._concatParams(2);
      this.collectUpload(commomParams);
    }
    /**
   * 用户关联触发
   * @param {*} customerId 事件名称
   */
    async $associate(customerId) {
      if(!customerId.customer_id){
        return
      }
      this.getSessionId() // 校验会话是否过期
      if(customerId.customer_id && customerId.customer_id != this.commonProperties.customer_id){
        this.commonProperties.customer_id = customerId.customer_id
        const params = {
          ...customerId,
          anonymous_id:this.commonProperties.anonymous_id,
          behavior_type:'associate'
        }
      }
    }
     /**
   * 用户关联触发
   * @param {*} customerId 事件名称
   */
      async $loginOut() {
        this.commonProperties.customer_id = ""
        localStorage.removeItem("sessionInfo")
        localStorage.removeItem("fingerprintId")
        localStorage.removeItem("anonymous_id")
      }
     /**
     * 自定义事件触发
     * @param {*} customerId 事件名称
     */
    $dispatch(params) {
      this.getSessionId() // 校验会话是否过期
      const paramsData = {
        ...params,
        behavior_type:'dispatch'
      }
      Object.assign(this.optionsParams,paramsData);
      let commomParams = this._concatParams(4);
      this.collectUpload(commomParams);
    }

    // 设备参数拿属性里的，特定参数进行传递, type 1 访问，2点击事件，3离开
    _concatParams(type) {
      let { commonProperties,pageSession,visitParams,eventData,params,optionsParams } = { ...this };
      let query;
      if(type === 1) {

          query = {
              ...commonProperties,
              page_session:pageSession,
              ...visitParams,
          }

          if(this.onBeforeReport){
              query = this.onBeforeReport(query)
          }
      } else if(type === 2) {
        query = {
          page_session:pageSession,
          ...commonProperties,
          ...eventData,
          page_id:visitParams.page_id
        }
      } else if (type === 3){
        query = {
          ...commonProperties,
          ...params,
          page_session:pageSession,
          page_id:visitParams.page_id,
          log_type:"system",
          behavior_type:'page_view'

        }
      }else if(type === 4){
        query = {
          ...optionsParams,
          ...commonProperties,
          page_session:pageSession,
          page_id:visitParams.page_id,
        }
      }
      return query;
    }
    // 私有方法
    // 清空paramslist数组
    _clearDataParams() {
      this.params = {};
    }
    // 计算common下params参数
    _calcParams() {
      this.params.leaveTime  = getCurrentTime()
      let viewDuration = this.params.leaveTime-this.params.visitTime
        if(typeof this.params.view_duration === 'undefined' || isNaN(this.params.view_duration)){
            this.params.view_duration = 0
        }
        if(typeof viewDuration === 'undefined' || isNaN(viewDuration)){
            viewDuration = 30
        }

      this.params.view_duration = this.params.view_duration + viewDuration

      Object.assign(this.params);
    }
     /**
     * 获取匿名id
     */
      $getAnonymousId() {
       return this.commonProperties.anonymous_id
      }
}

export default Collect;
