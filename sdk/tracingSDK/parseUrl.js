const getUtmJson = (traceLocation, actionType) => {
    //测试链接地址
    // 路过页面 http://localhost:3030/web-mobile/cmscontent/474?org_id=orge17556409edc315a4aabab78887b999a&originPage=http://www.baidu.com?utm_a=1

    // link
    // http://www.aaa?a=1
    // http://www.aaa?a=1&utm_a=1
    // http://www.aaa?a=1&originPage=http://www.aaa?a=1&utm_a=1


    let originPageFlag = traceLocation.search.match("originPage=");
    let utmFlag = traceLocation.search.match("utm_");
    let url;

    if (utmFlag) {
        // 中间级页面       // http://www.aaa?a=1&originPage=http://www.aaa?a=1&utm_a=1
        if (originPageFlag) {
            var res6 = traceLocation.search.replace(/originPage=[\w\W]+/,'').split('&').filter((item)=>{
                return !item.match('originPage=')
            }).filter((item)=>{
                return item.match('utm_')
            })

            var isTraceLink = res6 && res6.length

            if(isTraceLink){
                var search = traceLocation.search.split('&').filter((item)=>{
                    return !item.match('originPage=')
                }).join('&')
                url = traceLocation.origin + traceLocation.pathname + search

            }else{
                url = traceLocation.href
                    .split("?")[1]
                    .split("&")
                    .filter((item) => {
                        return item.match("originPage");
                    })[0]
                    .split("=")[1];
            }



            url = decodeURIComponent(url);
            url = decodeURIComponent(url);
            url = decodeURIComponent(url);
            url = decodeURIComponent(url);
            url = decodeURIComponent(url);

            if (actionType === "link" && !isTraceLink) {
                //debugger;
                // 中间路过 不收集PV
                return {};
            }
        }
        // 分享链接页面    // http://www.aaa?a=1&utm_a=1
        else {
            url = traceLocation.href;
        }
    }
    // 其他页面   // http://www.aaa?a=1
    else {
        if (actionType === "link") {
            //debugger;
            // 其他页面 不收集PV
            return {};
        } else if (actionType === "download") {
            //debugger;
            // 其他页面 不收集PV
            return null;
        }
    }

    if (utmFlag) {
        // 中间级页面
        if (originPageFlag) {
            if (actionType === "link") {
                //debugger;
            } else if (actionType === "download") {
                //debugger;
            }
        }
        // 分享链接页面
        else {
            if (actionType === "link") {
                //debugger;
            } else if (actionType === "download") {
                //debugger;
            }
        }
    }
    // 其他页面
    else {
        if (actionType === "link") {
            //debugger;
        } else if (actionType === "download") {
            //debugger;
        }
    }




    url = filterUnusefulParams(url)


    let res = {
        renew_utm_type: (() => {
            if (actionType === "download") {
                return "utm_download";
            } else if (actionType === "link") {
                return "utm_link";
            }
        })(),
        // renew_utm_url: encodeURIComponent(
        //   url.replace("/m/", "/")
        // ),
        renew_utm_url: encodeURIComponent(
            (()=>{
                let customurl;
                customurl=url.substring(8, 16)
                if(Number(customurl)){
                    return url.replace("/m/", "/")
                }else{
                    return url.replace("/m/contents/", "/")
                }
            })()
        ),


        ...(() => {
            let utmJson = {};
            let querys = url.split("?")[1].split("&");
            querys
                .filter((item) => {
                    return item.match("utm_");
                })
                .forEach((item) => {
                    utmJson[item.split("=")[0]] = decodeURIComponent(item.split("=")[1]);
                });
            return utmJson;
        })(),
    };
    return res;
};

export const getOriginPage = (traceLocation) => {
    let isHasUtmFlag = traceLocation.href.match("utm_");
    let isHasOriginPageFlag = traceLocation.href.match("originPage=");
    let originPage;

    //有originPage 携带
    if (isHasOriginPageFlag) {
        originPage = traceLocation.search
            .substring(1)
            .split("&")
            .filter((item) => {
                return item.match("originPage=");
            })[0]
            .split("=")[1];
    } else {
        if (isHasUtmFlag) {
            originPage = traceLocation.href;
        }
    }


    originPage = filterUnusefulParams(originPage)


    return originPage;
};


const filterUnusefulParams = (url)=>{
    var origin = parseUrl(decodeURIComponent(url)).origin
    var pathname = parseUrl(decodeURIComponent(url)).pathname
    var arr = []
    var params = parseUrl(decodeURIComponent(url)).search.replace('?','').split('&')
    var isMatchUtm = false;

    params.forEach((item)=>{
        if(item.match('utm_')){
            isMatchUtm = true
        }

        if(!isMatchUtm && !item.match('utm_')){
            arr.push(item)
        }else if(isMatchUtm && item.match('utm_')){
            arr.push(item)
        }
    })


    return origin + pathname + '?' + arr.join('&')
}


export const parseUrl = (url) => {


    var a = document.createElement("a");
    a.href = url;
    return {
        href: a.href,
        pathname: a.pathname,
        hostname: a.hostname,
        search: a.search,
        origin:a.origin,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, "").split("&"),
                len = seg.length,
                i = 0,
                s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split("=");
                //ret[s[0]] = s[1];
                ret[s[0]] = decodeURIComponent(s[1]);
            }
            return ret;
        })(),
        hash: a.hash.replace("#", ""),
    };
};
export default getUtmJson;


