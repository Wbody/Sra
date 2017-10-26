var WProcess = new Object();
WProcess.ParamMap = new HashMap();
WProcess.AssistMap = new HashMap();
WProcess.FunctionSetMap = new HashMap();
WProcess.SetMap = new HashMap();

WProcess.addParam = function (key, value) {
    WProcess.ParamMap.put(key, value);
    return this;
};
WProcess.getParam = function (key) {
    return  WProcess.ParamMap.get(key);
};
WProcess.pushSet = function (key, value) {
    var arr = WProcess.getSet(key);
    arr.push(value);
    WProcess.SetMap.put(key, arr);
};
WProcess.popSet = function (key) {
    var arr = new Array();
    if (WProcess.SetMap.containsKey(key)) {
        arr = WProcess.SetMap.get(key);
    }
    var obj = arr.pop();
    WProcess.SetMap.put(key, arr);
    return obj;
};
WProcess.clearSet = function (key) {
    WProcess.SetMap.remove(key);
};
WProcess.getSet = function (key) {
    var arr = new Array();
    if (WProcess.SetMap.containsKey(key)) {
        arr = WProcess.SetMap.get(key);
    }
    return arr;
};


