/* global Validate, Log, WUtil, StrKit, Type */
var SRA = new Object();
SRA.Mode = new Object();
SRA.Mode.CSS = 1;
SRA.Mode.HTML = 2;
SRA.ATTR = new Object();
SRA.ATTR.CONTAINER = "CONTAINER";
SRA.ATTR.ROW = "ROW";
SRA.ATTR.COLUMN = "COLUMN";
function Sra() {
    this.set = function (options) { //设置两个样式配置参数
        this.css(options.css);
        this.elements(options.elements);
        this.init();
        return this;
    };
    this.setting = {
        css: {
            container: "",
            row: "",
            column: ""
        },
        elements: {
            container: "",
            row: "",
            column: ""
        }
    };
    this.context = {
        MODE: SRA.Mode.CSS, //CSS模式 普通模式（element 常用元素） HTML模式 扩展模式（element扩展成html代码）
        DATA: [],
        CONTAINER: {
            target: "",
            id: "",
            element: "",
            css: "",
            container: "",
            bycreate: true
        },
        ROW: {
            length: 0,
            element: "",
            css: "",
            rows: [],
            bycreate: true,
            viewValue: true
        },
        COLUMN: {
            length: 0,
            element: "",
            css: "",
            columns: [],
            fields: [],
            viewValue: true
        }
    };
    //初始化方法
    this.init = function () {
        for (var i in SRA.ATTR) {
            var attr = SRA.ATTR[i];
            var elements = item(this.elements(), attr.toLowerCase());
            var css = item(this.css(), attr.toLowerCase());
            this.vcontext(attr, "element", elements);
            this.vcontext(attr, "css", css);
        }
        return this;
    };


    //设置dom渲染的模式 html和CSS模式 默认css模式
    this.mode = function (type) {
        if (Validate.isUndefined(type)) {
            type = SRA.Mode.HTML;
        }
        this.context.MODE = type;
        return this;
    };

    //多行数据渲染（核心方法）
    this.applyData = function (data, fieldArray) {
        this.data(data);
        this.context.ROW.length = data.length;
        if (Type.isArray(fieldArray)) {
            this.context.COLUMN.length = fieldArray.length;
            this.context.COLUMN.fields = fieldArray;
            this.context.COLUMN.columns = [];
        }
        return this;
    };


    //一行多列（渲染arr数据）
    this.applyArr = function (arr) {
        var obj = new Object();
        var fieldArray = new Array();
        for (var i in arr) {
            obj[i] = arr[i];
            fieldArray.push(i);
        }
        return this.applyData([obj], fieldArray);
    };
    //一行多列（渲染obj数据）
    this.applyJson = function (obj, fieldArray) {
        if (Validate.isUndefined(fieldArray)) {
            fieldArray = new Array();
            for (var i in obj) {
                fieldArray.push(i);
            }
        }
        return this.applyData([obj], fieldArray);
    };

    //多行多列（dom创建，无数数据）一般用于某个插件快速实现的草稿期
    this.applyContainer = function (row, column) { //设置容器行和列的数量
        var fieldArray = new Array();
        var data = new Array();
        for (var m = 0; m < row; m++) {
            var obj = new Object();
            for (var i = 0; i < column; i++) {
                obj[i] = i;
                fieldArray.push(i);
            }
            data.push(obj);
        }
        this.context.ROW.viewValue = false;
        this.context.COLUMN.viewValue = false;
        return this.applyData(data, fieldArray);
    };



    //将sra的初始化container 必须调用 
    this.initContainer = function () { //初步渲染html容器
        var container;
        if (this.context.CONTAINER.bycreate === true) {
            container = this.getContainer();
            $(container).attr("id", WUtil.generateUUID(true));
            WUtil.data("link-sra", true);
            this.context.CONTAINER.container = container;
        }
        return this;
    };

    //初始化并生成行对象  必须调用
    //rowDealer为回调方法 多用于插件草稿期
    this.initRows = function (rowDealer) { //生成行的html
        if (this.context.ROW.bycreate === true) {
            var rlen = this.context.ROW.length;
            var rows = new Array();
            var context = this.context;
            for (var i = 0; i < rlen; i++) {
                var row = this.getRow();
                WUtil.data(row, "index", i);
                var json;
                if (this.context.ROW.viewValue === true) {
                    json = JSON.stringify(item(this.data(), i));
                    WUtil.data(row, "json", json);
                }
                if (rowDealer) {
                    var column = this.getColumn();
                    rowDealer.call(rowDealer, row, i, json, column, context);
                }
                rows.push(row);
            }
            this.context.ROW.rows = rows;
        }
        return this;
    };



    //初始化并生成column对象 必须调用
    //isAppend表示是否绑定到父级元素 false的情况时为以后扩展留用 一般都是true 
    //fieldDealer 字段处理回调方法
    this.initColums = function (isAppend, fieldDealer) { //生成列的html isappend表示是否绑定到父级元素

        var rlen = this.context.ROW.length;
        var rows = this.context.ROW.rows;
        var clen = this.context.COLUMN.length;
        var fields = this.context.COLUMN.fields;
        var columns = new Array();
        var context = this.context;
        for (var i = 0; i < rlen; i++) {
            var row = rows[i];
            var colums = new Array();
            var obj = item(this.data(), i);
            if (clen > 0) {
                for (var j = 0; j < clen; j++) {
                    var colum = this.getColumn();
                    var value;
                    if (this.context.COLUMN.viewValue === true) {
                        value = item(obj, fields[j]);
                        WUtil.data(colum, "value", value);
                        WUtil.data(colum, "field", fields[j]);
                    }
                    WUtil.data(colum, "column", j);
                    WUtil.data(colum, "row", i);
                    WUtil.data(colum, "trow", WUtil.getData(row, "index"));

                    if (fieldDealer) {
                        fieldDealer.call(fieldDealer, colum, fields[j], value, obj, row, context);
                    }
                    if (isAppend) {
                        $(colum).appendTo(row);
                    }
                    colums.push(colum);
                }
                columns.push(colums);
            }
        }
        this.context.COLUMN.columns = columns;
        return this;
    };


    //获取一个按配置生成的未绑定的Column对象
    this.getColumn = function () {
        return this.getSettingElement(SRA.ATTR.COLUMN);
    };
    //获取一个按配置生成的未绑定的Row对象
    this.getRow = function () {
        return this.getSettingElement(SRA.ATTR.ROW);
    };
    //获取一个按配置生成的未绑定的Container对象
    this.getContainer = function () {
        return this.getSettingElement(SRA.ATTR.CONTAINER);
    };

    this.getSettingElement = function (attr) {
        var el;
        var element = this.context[attr].element;
        var css = this.context[attr].css;
        var mode = this.context.MODE;
        if (!Validate.isUndefined(element)) {
            if (SRA.Mode.CSS === mode) {
                var selement = document.createElement(element);
                el = $(selement).addClass(css);
            } else if (SRA.Mode.HTML === mode) {
                el = $(element).addClass(css);
            }
        }
        return el;
    };


    //将sra的container对象绑定到某个dom节点上 不必须调用 
    //如该target也是通过sra创建出来的即可不必调用
    this.toBindContainer = function (target) {
        if (this.context.CONTAINER.bycreate === true) {
            this.context.CONTAINER.target = target;
            var container = this.context.CONTAINER.container;
            $(container).appendTo(target);
        } else {
            Log.debug("容器非自建，不必调用");
        }
        return this;
    };
    //将rows绑定到container上
    this.toBindRows = function () {
        if (this.context.ROW.bycreate === true) {
            var rows = this.context.ROW.rows;
            var container = this.context.CONTAINER.container;
            for (var i in rows) {
                var row = rows[i];
                $(row).appendTo(container);
            }
        } else {
            Log.debug("行非自建，不必调用");
        }
        return this;
    };


    //强制设置第一行row，且container只有一行row 
    //多用于持续渲染时，不想多创建container Dom的情况
    this.setRow = function (row) {
        var css = this.context[SRA.ATTR.ROW].css;
        $(row).addClass(css);
        this.context.ROW.length = 1;
        this.context.ROW.rows = [row];
        this.context.CONTAINER.bycreate = false;
        this.context.ROW.bycreate = false;
        return this;
    };
    //清空行数据内存
    this.resetRows = function () {
        this.context.ROW.rows = [];
        return this;
    };

    //强制设置Container 
    //多用组合渲染时，不想多创建Container Dom的情况
    this.setContainer = function (container) {
        var css = this.context[SRA.ATTR.CONTAINER].css;
        $(container).addClass(css);
        this.context.CONTAINER.bycreate = false;
        this.context.CONTAINER.container = container;
        return this;
    };

    //获取sra的Container对象
    this.container = function () {
        return this.context.CONTAINER.container;
    };

    //获取sra的Container对象id属性
    this.containerId = function () {
        var container = this.context.CONTAINER.container;
        return $(container).attr("id");
    };

    //获取sra某行某列的column对象
    this.element = function (row, column) {
        return this.context.COLUMN.columns[row][column];
    };
    //获取sra某行的row对象
    this.row = function (row) {
        return this.context.ROW.rows[row];
    };
    //获取sra行数
    this.rowNum = function () {
        return this.context.ROW.length;
    };
    //获取sra第一行row对象
    this.firstRow = function () {
        return this.context.ROW.rows[0];
    };
    //获取sra最后一行row对象
    this.lastRow = function () {
        var len = this.context.Row.length - 1;
        return this.context.ROW.rows[len];
    };



    //data的设值或取值
    this.data = function (data) {
        return this.pcontext("DATA", data);
    };

    //设置sra渲染的父级容器
    this.target = function (target) {
        if (Validate.isUndefined(target)) {
            return this.vcontext(SRA.ATTR.CONTAINER, "target");
        } else {
            this.vcontext(SRA.ATTR.CONTAINER, "target", target);
            return this;
        }
    };
    //设置sra的element配置的方法
    this.elements = function (option) {
        if (!Validate.isUndefined(option)) {
            this.setting.elements = option;
        }
        return this.setting.elements;
    };
    //设置sra的css配置的方法
    this.css = function (option) {
        if (!Validate.isUndefined(option)) {
            this.setting.css = option;
        }
        return this.setting.css;
    };

    //object的取值和设值
    var item = function (object, key, warnfunc) {
        if (Validate.isEmpty(object)) {
            return "";
        }
        var value = object[key];
        var warndealer = Validate.isUndefined;
        if (warnfunc) {
            warndealer = warnfunc;
        }
        if (warndealer.call(warndealer, value)) {
            Log.warn(StrKit.format("${1}为空", key));
        }
        return value;
    };
    this.vcontext = function (cattr, attr, value) {
        if (!Validate.isUndefined(value)) {
            this.context[cattr][attr] = value;
        }
        return this.context[cattr][attr];
    };
    this.pcontext = function (attr, value) {
        if (!Validate.isUndefined(value)) {
            this.context[attr] = value;
        }
        return this.context[attr];
    };

}
