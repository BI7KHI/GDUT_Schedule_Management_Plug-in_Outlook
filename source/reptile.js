/**
 * 常见的自动测试工具，驱动浏览器渲染内核：
 * WebDriver内核：puppeteer、Selenium
 * Webkit内核：Splash
 *
 */
;(function(win) {
    var doc = win.document, docEl = doc.documentElement, navigator = win.navigator;
    var reptileHandles = [], reptileCallback = function() {
        docEl.innerHTML = '请不要使用自动化工具访问'
        win.location.href = win.location.href
    };
    /*******特征反爬虫Start*****/
    // webDriver自动化工具内核渲染 keywords
    function detectWebDriver() {
        const r = [];
        const w = ['webdriver', '__driver_evaluate', '__webdriver_evaluate',
            ' __selenium_evaluate', '__fxdriver_evaluate', '__driver_unwrapped',
            '__webdriver_unwrapped', '__selenium_unwrapped', '__fxdriver_unwrapped',
            '_Selenium_IDE_Recorder', '_selenium', 'calledSelenium',
            '_WEBDRIVER_ELEM_CACHE', 'ChromeDriverw', 'driver-evaluate',
            'webdriver-evaluate', 'selenium-evaluate', 'webdriverCommand',
            'webdriver-evaluate-response','__webdriverFunc', '__webdriver_script_fn',
            '__$webdriverAsyncExecutor', '__lastWatirAlert',
            '__lastWatirConfirm', '__lastWatirPrompt', '$chrome_asyncScriptInfo',
            '$cdc_asdjflasutopfhvcZLmcfl_', '_phantom', '_phantomas'];
        w.forEach(function(t) {
            if (!!win[t] || !!docEl.getAttribute(t) || !!navigator[t]) {
                r.push(t);
            }
        });
        return r;
    }
    function featuresUserAgent() {
        var userAgent = navigator.userAgent, r = [],
            w = [/HeadlessChrome/, /Splash/, /selenium/];

        w.forEach(function (t) {
            if(t.test(userAgent)) {
                r.push(t);
            }
        })
        return r;
    }
    reptileHandles.push(function() {
        return detectWebDriver().length > 0
    }, function() {
        return featuresUserAgent().length > 0
    })
    /*******特征反爬虫End*****/

    var isReptile = reptileHandles.some(function(fn) {
        var flag = fn();
        if(flag) {
            console.log(fn.toString());
        }
        return flag || false;
    })
    //如果有一个返回true就是爬虫
    if(isReptile) {
        reptileCallback();
    }
})(window);