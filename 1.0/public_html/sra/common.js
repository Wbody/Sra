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
WUtil.data = function (o, key, value) {
    $(o).attr("data-" + key, value);
};
WUtil.getData = function (o, key) {
    return $(o).attr("data-" + key);
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