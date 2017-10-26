/* global WProcess, Log, Validate */
/* 
 Created on : 2017-10-16, 13:38:47
 Author     : Wbody <2903056737@qq.com>
 */
/* 
 .Wlayer,.inlineWlayer{
 z-index: 1001;
 background-color: #eaeaea;
 opacity: 0.5;
 top: 0;
 height: 100%;
 width: 100%;
 position: fixed
 }
 .inline-Wlayer{
 position: absolute;
 }
 .WlayerLabel{
 background-image: url("../images/loading.gif");
 background-repeat: no-repeat;
 background-position: center;
 z-index: 1002;
 top: 0;
 height: 100%;
 width: 100%;
 position: fixed
 }
 .inline-WlayerLabel{
 position: absolute;
 }
 */

var WLayer = new Object();
WLayer.addLayer = function (target, isDefault) {
    if ($(target).find(".Wlayer").length < 1) {
        var layer = $("<div>").addClass("Wlayer");
        if (!isDefault) {
            layer.addClass("inline-Wlayer").css({
                width: $(target).outerWidth(),
                height: $(target).outerHeight(),
                top: $(target).offset().top,
                left: $(target).offset().left
            });
        }
        $(target).append(layer);
    } else {
        Log.debug("WLayer初始化异常，.Wlayer 元素已存在");
    }
};
WLayer.addLabel = function (target, isDefault) {
    if ($(target).find(".WlayerLabel").length < 1) {
        var layer = $("<div>").addClass("WlayerLabel");
        if (!isDefault) {

            layer.addClass("inline-WlayerLabel").css({
                width: $(target).outerWidth(),
                height: $(target).outerHeight(),
                top: $(target).offset().top,
                left: $(target).offset().left
            });
        }
        $(target).append(layer);
    } else {
        $(target).find(".Wlayer").show();
        $(target).find(".WlayerLabel").show();
    }
};
WLayer.destory = function (target) {
    if (Validate.isUndefined(target)) {
        target = "body";
    }
    $(target).find(".Wlayer").remove();
    $(target).find(".WlayerLabel").remove();
    WProcess.clearSet(target);
    return this;
};
WLayer.show = function (target) {
    var isDefault = true;
    if (Validate.isUndefined(target)) {
        target = "body";
    } else {
        isDefault = false;
    }
    WLayer.addLayer(target, isDefault);
    WLayer.addLabel(target, isDefault);
    WProcess.pushSet(target, true);
    return this;
};
WLayer.qhide = function (target) {
    if (Validate.isUndefined(target)) {
        target = "body";
    }
    $(target).find(".Wlayer").hide();
    $(target).find(".WlayerLabel").hide();
    WProcess.clearSet(target);
    return this;
};
WLayer.hide = function (target) {
    if (Validate.isUndefined(target)) {
        target = "body";
    }
    var len = WProcess.getSet(target).length;
    Log.debug("(WLayer实例)len:" + len);
    if (len <= 1) {
        $(target).find(".Wlayer").hide();
        $(target).find(".WlayerLabel").hide();
    } else {
        WProcess.popSet(target);
    }
    return this;
};