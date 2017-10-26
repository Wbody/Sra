/* global WUtil, Log, Validate, WLayer */

var EasyAjaxConf = new Object();
EasyAjaxConf.AJAX_POST_TYPE = "POST";
EasyAjaxConf.AJAX_GET_TYPE = "GET";
EasyAjaxConf.RES_SUCCESS = "SUCCESS";
EasyAjaxConf.RES_ERROR = "ERROR";
EasyAjaxConf.RES_WARNING = "WARN";
EasyAjaxConf.RES_TOKEN_ERROR = "TOKEN_ERROR";
EasyAjaxConf.ASYNC = false;
EasyAjaxConf.notConnection = function (url, setting, dealer) {
    var message = "连接异常url:({0})[{1},{2},{3}]".format(url, setting.type, setting.url, setting.async, setting.dataType);
    Log.debug(message);
    if (dealer) {
        dealer.call(dealer, message);
    } else {
        alert(message);
    }

};
EasyAjaxConf.urlDealer = function (url, type, params) {
    if (type === EasyAjaxConf.AJAX_GET_TYPE) {
        url = encodeURI(encodeURI(url)); //对应服务端要 java.net.URLDecoder.decode(linename , "UTF-8");
    }
    return url;
};
EasyAjaxConf.before = function (container, action) {
    if (action) {
        $(action).button("loading");
    }
    WLayer.show(container);
};
EasyAjaxConf.after = function (container, action) {
    if (action) {
        $(action).button("reset");
    }
    WLayer.hide(container);
};
function EasyAjax() {
    this.setting = {
        type: EasyAjaxConf.AJAX_GET_TYPE,
        async: true,
        dataType: "json",
        url: "",
        params: {},
        container: "",
        action: "",
        before: function (container, action) {
            EasyAjaxConf.before(container, action);
        },
        after: function (container, action) {
            EasyAjaxConf.after(container, action);
        },
        paramsDealer: function (params, ext) {
            return params;
        },
        dataDealer: function (data, ext) {
            return data;
        },
        urlDealer: function (url, type, params, ext) {
            return  EasyAjaxConf.urlDealer(url, type, params);
        },
        errorDealer: function (url, setting) {
            EasyAjaxConf.notConnection(url, setting);
        },
        ext: {}
    };
    this.set = function (options) {
        this.setting = WUtil.andData(this.setting, options);
        return this;
    };

    this.biu = function () {
        var options = this.setting;
        var before = options.before;
        var container = options.container;
        var action = options.action;
        if (before) {
            before.call(before, container, action);
        }
        var urlDealer = options.urlDealer;
        var type = options.type;
        var params = options.params;
        var url = options.url;
        var ext = options.ext;
        var paramsDealer = options.paramsDealer;
        if (paramsDealer) {
            params = paramsDealer.call(paramsDealer, params, ext);
            options.params = params;
        }
        url = WUtil.addLss(url);
        if (type === EasyAjaxConf.AJAX_GET_TYPE && urlDealer) {
            url = urlDealer.call(urlDealer, url, type, params, ext);
            options.url = url;
        }

        ajax(options);
        return this;
    };
    var ajax = function (setting) {
        var after = setting.after;
        var container = setting.container;
        var action = setting.action;
        var dataDealer = setting.dataDealer;
        var ext = setting.ext;
        var errorDealer = setting.errorDealer;
        $.ajax({
            type: setting.type,
            url: setting.url,
            data: setting.params,
            async: setting.async,
            dataType: setting.dataType,
            success: function (data) {
                if (dataDealer) {
                    dataDealer.call(dataDealer, data, ext);
                }
                if (after) {
                    after.call(after, container, action);
                }
            },
            error: function (data) {
                if (errorDealer) {
                    errorDealer.call(errorDealer, setting.url, setting);
                }
                if (after) {
                    after.call(after, container, action);
                }
            }
        });
    };
    return this;
}
