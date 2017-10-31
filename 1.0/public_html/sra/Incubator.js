/* global WUtil, SRA, Validate, Log, StrKit, Type */

function Plugin(pluginName) {
    this.context = {
        MAIN: {
            pluginName: pluginName, //"SRA-PLUGIN"
            attr: [],
            target: "body",
            mode: SRA.Mode.CSS,
            isSra: true,
            sra: {},
            data: []
        }
    };
    this.setting = {

    };
    this.style = {
        main: {
            css: {
                container: "group",
                row: "item"
            },
            elements: {
                container: "div",
                row: "div"
            }
        }
    };
    this.set = function (target, style) { //默认
        var attr = this.context.MAIN.attr;
        for (var i in attr) {
            var attrName = attr[i];
            this.style[attrName] = {
                css: {
                    container: pluginName + "_" + attrName + "_group",
                    row: pluginName + "_" + attrName + "_item",
                    column: pluginName + "_" + attrName + "_cell"
                },
                elements: {
                    container: "div",
                    row: "div",
                    column: "div"
                }
            };
        }
        var main = {
            css: {
                container: pluginName + "_group",
                row: pluginName + "_item"
            },
            elements: {
                container: "div",
                row: "div"
            }
        };
        this.style.main = main;
        this.context.MAIN.target = target;
        this.style = WUtil.andData(this.style, style);

        return this;
    };
    this.protocol = function (attr, protocols) {
        this.context.MAIN.attr = attr;
        this.setting = protocols;
        return this;
    };
    this.setTarget = function (target) {
        this.context.MAIN.target = target;
        return this;
    };
    this.target = function () {
        return this.context.MAIN.target;
    };
    this.getElement = function (style, mode) {
        var css;
        if (style.css) {
            css = style.css.container;
        }
        var element;
        if (style.elements) {
            element = style.elements.container;
        }
        var el;
        if (element) {
            if (SRA.Mode.CSS === mode) {
                var selement = document.createElement(element);
                el = $(selement).addClass(css);
            } else if (SRA.Mode.HTML === mode) {
                el = $(element).addClass(css);
            }
        }
        return el;
    };
    this.apply = function (data) {
        var plugin = new Sra();
        var pluginContext = this.context;
        var mode = this.context.MAIN.mode;
        var protocols = this.setting;
        var rowLen = this.context.MAIN.attr.length;
        var style = this.style;
        this.context.MAIN.data = data;
        var getElement = this.getElement;
        if (rowLen > 0) {
            plugin.set(style.main).mode(this.context.MAIN.mode)
                    .applyContainer(rowLen, 1)
                    .initContainer()
                    .initRows(function (row, rowindex) {
                        var attr = pluginContext.MAIN.attr[rowindex];
                        var protocol = protocols[attr];

                        if (!Validate.isUndefined(protocol)) {
                            var isSra = protocol.isSra;
                            if (isSra) {
                                var attrSra = new Sra();
                                if (!Validate.isUndefined(protocol.style)) {
                                    attrSra.set(protocol.style);
                                } else {
                                    protocol.style = style[attr];
                                    attrSra.set(style[attr]);
                                }

                                var smode = protocol.mode;
                                if (!Validate.isUndefined(smode)) {
                                    attrSra.mode(smode);
                                }

                                var sdata = protocol.data;

                                if (Validate.isUndefined(sdata)) {
                                    sdata = data;
                                }
                                var dealer = protocol.dataDealer;

                                if (!Validate.isUndefined(dealer)) {
                                    sdata = dealer.call(dealer, sdata);
                                }
                                protocol.data = sdata;

                                var fieldArr = new Array();
                                var fieldOption = protocol.fieldOption;
                                if (!Validate.isUndefined(fieldOption)) {
                                    if (Type.isArray(fieldOption)) {
                                        fieldArr = fieldOption;
                                    } else {
                                        for (var i in  fieldOption) {
                                            fieldArr.push(i);
                                        }
                                    }

                                    if (Validate.isEmpty(sdata)) {
                                        attrSra.applyArr(fieldArr);
                                    } else {
                                        if (Type.isArray(sdata)) {
                                            attrSra.applyData(sdata, fieldArr);
                                        } else {
                                            attrSra.applyJson(sdata, fieldArr);
                                        }
                                    }

                                } else {
                                    if (Validate.isEmpty(sdata)) {
                                        Log.debug("data为空无法渲染");
                                        return false;
                                    } else {
                                        attrSra.applyJson(sdata);
                                    }
                                }


                                var gfieldDealer = protocol.fieldDealer;
                                attrSra.setContainer(row)
                                        .initContainer()
                                        .initRows()
                                        .initColums(true, function (column, field, value, obj, row, context) {
                                            if (!Type.isArray(fieldOption)) {
                                                if (!Validate.isUndefined(fieldOption)) {
                                                    var fieldDealer = fieldOption[field].dealer;
                                                    if (!Validate.isUndefined(fieldDealer)) {
                                                        value = dealer.call(dealer, value, obj, column, fieldOption[field]);
                                                    }
                                                }
                                            }
                                            if (!Validate.isUndefined(gfieldDealer)) {
                                                value = gfieldDealer.call(gfieldDealer, value, obj, column, field, fieldOption);
                                            }
                                            if (!Validate.isEmpty(value)) {
                                                $(column).append(value);
                                            }
                                        }).toBindRows();
                                protocol.sra = attrSra;
                                pluginContext[attr.toUpperCase()] = protocol;
                            } else {
                                var el;
                                if (!Validate.isUndefined(protocol.style)) {
                                    el = getElement.call(getElement, protocol.style, mode);
                                } else {
                                    protocol.style = style[attr];
                                    el = getElement.call(getElement, style[attr], mode);
                                }

                                var text = protocol.text;
                                var dealer = protocol.dealer;
                                if (!Validate.isUndefined(dealer)) {
                                    text = dealer.call(dealer, text, el, row);
                                }
                                protocol.dom = el;
                                pluginContext[attr.toUpperCase()] = protocol;
                                if (text) {
                                    $(el).append(text);
                                }
                                $(row).append($(el));
                            }
                        } else {
                            Log.debug(StrKit.format("插件protocol定义出错,缺少protocol ${1}属性", attr));
                        }
                    }).toBindContainer(this.target()).toBindRows();
        } else {
            Log.debug("插件protocol字段未定义");
        }
        this.context.MAIN.sra = plugin;
        return this;
    };

}