let firstPageLoadDone = false

export const firstPageLoad = (callback) => {
    let handle = ()=>{
        if(!firstPageLoadDone){
            firstPageLoadDone = true
            setTimeout(()=>{
                firstPageLoadDone = false
            },2000)


            callback && callback()
        }

    }
    window.removeEventListener('load',handle)
    window.addEventListener('load', handle, false)

    window.removeEventListener('pageshow',handle)
    window.addEventListener('pageshow', handle, false)
}
