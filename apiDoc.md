/**
* 用户访问行为上报
* @params params 自定义参数，非必填
  */
  besChannesSDK.$visit(params);


/**
* 接收自定义参数
* @params params 自定义参数，非必填(可传多个自定义参数,如下示例)
  */
  besChannesSDK.recieveSelfParmas({
  memberid: {{memberid}},
  openid: {{openid}},
  })


/**
* 用户关联， 将第三方用户ID 与指纹ID 关联
* @params yourId 第三方用户ID
  */
  besChannesSDK.$associate(yourId)
