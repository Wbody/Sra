var WUtil = new Object();
WUtil.generateUUID = function (flag) {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    if (flag) {
        uuid = WUtil.replaceAll(uuid, "-", "");
    }
    return uuid;
};
WUtil.replaceAll = function (uuid,s1, s2) {
    return uuid.replace(new RegExp(s1, "gm"), s2);
};
WUtil.data = function (o, key, value) {
    $(o).attr("data-" + key, value);
};
WUtil.getData = function (o, key) {
    return $(o).attr("data-" + key);
};
//合并obj，obj1 相同字段以obj1为准
WUtil.andData = function (obj, obj1) {
    var object = new Object();
    for (var i in obj) {
        var attr = i;
        var attrValue = obj[i];
        object[attr] = attrValue;
    }
    for (var i in obj1) {
        var attr = i;
        var attrValue = obj1[i];
        object[attr] = attrValue;
    }
    return object;
};
WUtil.isContains = function (str, substr) {
    return (str.indexOf(substr) >= 0);
};
//url加时间戳 参数名timeFlag如果有值就更新
WUtil.addLss = function (s) {
    if (s.indexOf("?") === -1) {
        return s += "?timeFlag=" + new Date().getTime();
    } else {
        return WUtil.timeStrUr(s);
    }
};
WUtil.reLssTimeStr = function (surl, value) {
    var url = surl;
    if (!WUtil.isContains(url, "timeFlag")) {
        url = WUtil.addLss(url);
    }
    if (!value) {
        value = new Date().getTime();
    }
    var ssurl = WUtil.changeURLParam(url, "timeFlag", value);
    return ssurl;
};
WUtil.timeStrUr = function (src) {
    if (WUtil.getParameters(src, "timeFlag")) {
        src = WUtil.changeURLParam(src, "timeFlag", new Date().getTime());
    } else {
        src += "&timeStr=" + new Date().getTime();
    }
    return src;
};
//修改url参数
WUtil.changeURLParam = function (url, param, paramValue) {
    var pattern = param + '=([^&]*)';
    var replaceText = param + '=' + paramValue;
    return url.match(pattern) ? url.replace(eval('/(' + param + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
};

//获取url参数
WUtil.getParameter = function (param) {
    var query = window.location.search;
    var iLen = param.length;
    var iStart = query.indexOf(param);
    if (iStart === -1)
        return "";
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart);
    if (iEnd === -1)
        return query.substring(iStart);
    return query.substring(iStart, iEnd);
};
//从obj1中找obj的字段，isReplaceNull表示如果空字符串替不替换
WUtil.initMode = function (obj, obj1, isReplaceNull, dealer) {
    var object = new Object();
    for (var i in obj) {
        var attr = i;
        var attrValue = obj[i];
        var replaceValue = obj1[i];
        if (replaceValue === "" && isReplaceNull) {
            object[attr] = replaceValue;
        } else {
            if (!Validate.isEmpty(replaceValue)) {
                if (dealer) {
                    replaceValue = dealer.call(dealer, replaceValue);
                }
                object[attr] = replaceValue;
            } else {
                object[attr] = attrValue;
            }
        }
    }
    return object;
};
WUtil.PrefixInteger = function (num, n) {
    return (Array(n).join(0) + num).slice(-n);
};
WUtil.random = function (m, n) {
   var s= parseInt(Math.random() * (n - m + 1) + m);
   return s;
};
var Validate = new Object();
Validate.isUndefined = function (obj) {
    return (typeof (obj) === "undefined");
};
Validate.isEmpty = function (obj) {
    return (Validate.isUndefined(obj) || obj === "" || obj.length === 0);
};

var RegPattern = new Object();


var Type = new Object();
Type.STRING = "string";
Type.INTEGER = "int";
Type.NUMBER = "number";
Type.DOUBLE = "double";
Type.FLOAT = "float";
Type.DATE = "Date";
Type.OBJECT = "object";
Type.ARRAY = "Array";
Type.isObject = function (obj) {
    return typeof (obj) === Type.OBJECT;
};
Type.isArray = function (arr) {
    return  !Validate.isUndefined(arr) && arr instanceof Array;
};
Type.isDate = function (date) {
    return  !Validate.isUndefined(date) && date instanceof Date;
};
Type.isInteger = function (int) {
    return typeof int === Type.NUMBER && int % 1 === 0;
};
Type.isFloat = function (str) {
    return typeof str === Type.NUMBER && str % 1 !== 0;
};

var StrKit = new Object();
StrKit.format = function () {
    var result = arguments[0];
    if (arguments.length > 1) {
        if (arguments.length === 2 && Type.isObject(arguments[1])) {
            for (var key in arguments[1]) {
                if (!Validate.isUndefined(arguments[1][key])) {
                    var reg = new RegExp("(\\${" + key + "})", "g");
                    result = result.replace(reg, arguments[1][key]);
                }
            }
        } else {
            for (var i = 1; i < arguments.length; i++) {
                if (!Validate.isUndefined(arguments[i])) {
                    var reg = new RegExp("(\\${)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};


function HashMap() {
    var size = 0;
    var entry = new Object();
    this.put = function (key, value) {
        if (!this.containsKey(key)) {
            size++;
            entry[key] = value;
        } else {
            entry[key] = value;
        }
    };
    this.get = function (key) {
        return this.containsKey(key) ? entry[key] : null;
    };
    this.remove = function (key) {
        if (this.containsKey(key) && (delete entry[key])) {
            size--;
        }
    };
    this.containsKey = function (key) {
        return (key in entry);
    };
    this.containsValue = function (value) {
        for (var prop in entry)
        {
            if (entry[prop] === value) {
                return true;
            }
        }
        return false;
    };
    this.values = function () {
        var values = new Array();
        for (var prop in entry)
        {
            values.push(entry[prop]);
        }
        return values;
    };
    this.keys = function () {
        var keys = new Array();
        for (var prop in entry)
        {
            keys.push(prop);
        }
        return keys;
    };
    this.size = function () {
        return size;
    };
    this.clear = function () {
        size = 0;
        entry = new Object();
    };
}


//日志调试相关
var Log = new Object();
Log.DEBUG_LOG_LEVEL = "DEBUG";
Log.INFO_LOG_LEVEL = "INFO";
Log.ERROR_LOG_LEVEL = "ERROR";
Log.WARN_LOG_LEVEL = "WARN";
Log.isOpen = false;
Log.openLog = function () {
    Log.isOpen = true;
};
Log.closeLog = function () {
    Log.isOpen = false;
};
Log.warn = function (infoStr, fuc) {
    return Log.debug(infoStr, Log.WARN_LOG_LEVEL, fuc);
};
Log.error = function (infoStr, fuc) {
    return Log.debug(infoStr, Log.ERROR_LOG_LEVEL, fuc);
};
Log.info = function (infoStr, fuc) {
    return Log.debug(infoStr, Log.INFO_LOG_LEVEL, fuc);
};
Log.debug = function (infoStr, level, fuc) {
    var fucName = "";
    if (fuc) {
        var tmp = fuc.toString();
        var re = /function\s*(\w*)/i;
        var matches = re.exec(tmp);
        fucName = "  [" + matches[1] + "]";
    }
    var slevel = Log.DEBUG_LOG_LEVEL;
    if (level) {
        slevel = level;
    }
    if (Log.isOpen) {
        console.log(DatePattern.getFormatDate(new Date()) + "  (" + slevel + ") : " + infoStr + fucName);
    }
};
window.console = window.console
        || (function () {
            var c = {};
            c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
            };
            return c;
        })();

//时间转换函数
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
var DatePattern = new Object();
DatePattern.getFormatDateByLong = function (l, pattern) {
    return DatePattern.getFormatDate(new Date(l), pattern);
};
DatePattern.getFormatDate = function (date, pattern) {
    if (date === undefined) {
        date = new Date();
    }
    if (pattern === undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    }
    return date.format(pattern);
};