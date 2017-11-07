/* global WUtil, echarts, BMap, BMAP_SATELLITE_MAP, BMAP_NORMAL_MAP, BMAP_HYBRID_MAP */
function addTimer(fuc, speed) {
    return setInterval(fuc, speed);
}
var bmap;
function initMap(points) {
    var myChart = echarts.init(document.getElementById('map'));
    myChart.setOption(getMap(points));
    bmap = myChart.getModel().getComponent('bmap').getBMap();
//    bmap.setMapStyle(mapStyle);
    bmap.addControl(new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]
    }));
    bmap.addTileLayer(new BMap.PanoramaCoverageLayer());

    var stCtrl = new BMap.PanoramaControl(); //构造全景控件
    stCtrl.setOffset(new BMap.Size(20, 80));
    bmap.addControl(stCtrl);//添加全景控件
    bmap.addEventListener("addtilelayer", function (e) {
        bmap.setMapType(BMAP_HYBRID_MAP);
    });

    bmap.disableScrollWheelZoom();

}
function initLCS(lcs, target) {
    $(target).empty();
    lcs = Number(lcs).toFixed(2);
    var zs = lcs.substring(0, lcs.indexOf("."));
    var xs = lcs.substring(lcs.indexOf(".") + 1, lcs.length);
    zs = WUtil.PrefixInteger(zs, 4);
    var islt = false;
    for (var i in zs) {
        var div = $('<div>').addClass("chart_number_item");
        if (Number(zs[i]) === 0 && !islt) {
            $(div).addClass("empty_num");
        } else {
            islt = true;
        }
        $(div).text(zs[i]).appendTo(target);
    }
    var clazz = "";
    if (Number(zs) === 0) {
        clazz = "empty_num";
    }
    var dotdiv = $('<div>').addClass("chart_number_item");
    $(dotdiv).addClass("dot").addClass(clazz).text(".").appendTo(target);
    for (var m in xs) {
        var div = $('<div>').addClass("chart_number_item").addClass(clazz);
        $(div).text(xs[m]).appendTo(target);
    }
    var dw = $('<div>').addClass("chart_number_item").addClass(clazz);
    $(dw).addClass("dw").text('公里').appendTo(target);
    $(target).append($("<div class='clearfix'></div>"));
    return lcs;
}
function getYBP(mcolor, acolor, value, name, fontSize) {
    value = Number(value);
    var ybp = {
        calculable: true,
        tooltip: {
            show: false
        },
        toolbox: {
            show: false
        },
        series: [{
                name: '业务指标',
                type: 'gauge',
                splitNumber: 5,
                max: 10,
                axisLine: {
                    lineStyle: {
                        color: [[0.2, mcolor], [0.8, mcolor], [1, mcolor]],
                        width: 10
                    }
                },
                axisTick: {
                    splitNumber: 5,
                    length: 5,
                    lineStyle: {
                        color: acolor
                    }
                },
                axisLabel: {
                    show: true
                },
                splitLine: {// 分隔线
                    show: true, // 默认显示，属性show控制显示与否
                    length: 10, // 属性length控制线长
                    lineStyle: {// 属性lineStyle（详见lineStyle）控制线条样式
                        color: acolor
                    }
                },
                pointer: {
                    width: 3
                },
                title: {
                    show: true,
                    offsetCenter: [0, '100%'],
                    textStyle: {
                        fontWeight: 'normal',
                        color: "#fff",
                        fontSize: fontSize
                    }
                },
                detail: {
                    formatter: '{value} 小时',
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    offsetCenter: [0, '60%'],
                    textStyle: {
                        color: 'auto',
                        fontSize: 10
                    }
                },
                data: [{value: value, name: name}]
            }
        ]
    };
    return ybp;
}

function getRS(value, barHeight) {
    var rs = {
        calculable: true,
        xAxis: [{
                show: false
            }
        ],
        yAxis: [{
                show: false,
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data: ['比例']
            }
        ],
        series: [
            {
                type: 'bar',
                stack: '总量',
                barWidth: barHeight,
                itemStyle: {
                    normal: {
                        color: "#1dc4f1",
                        barBorderColor: "#1dc4f1",
                        barBorderRadius: [0, 0, 0, 0],
                        label: {
                            show: false, position: 'insideRight'
                        }
                    }
                },
                data: [Number(value)]
            },
            {
                type: 'bar',
                stack: '总量',
                itemStyle: {normal: {
                        color: "rgba(29,196,241,0.3)",
                        barBorderColor: "rgba(29,196,241,0.3)",
                        barBorderRadius: [0, 0, 0, 0],
                        label: {show: false}
                    }
                },
                data: [1 - Number(value)]
            }
        ]
    };
    return rs;
}
function getRose(setting, width) {
    var option = {
        title: {
            text: '',
            subtext: '',
            x: 'center'
        },
        grid: {
            left: 30,
            top: 10,
            bottom: 30
        },
        tooltip: {
            show: false
        },
        legend: {
            show: true,
            x: 'right',
            y: 'bottom',
            itemWidth: 10,
            itemHeight: 10,
            data: ["报警", "预警", "正常"]
        },
        toolbox: {
            show: false
        },
        calculable: true,
        series: [
            {
                name: '',
                type: 'pie',
                radius: ["30%", "50%"],
                center: ['50%', '50%'],
                clockWise: true,
                roseType: 'radius',
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: "outer",
                            formatter: "{b} {c}个",
                            distance: 0
                        },
                        labelLine: {
                            show: true
                        }
                    }
                },
                data: [

                    {
                        value: setting.bj,
                        name: '报警',
                        itemStyle: {
                            normal: {
                                color: "#9e56f0"
                            }
                        }
                    },
                    {
                        value: setting.yj,
                        name: '预警',
                        itemStyle: {
                            normal: {
                                color: "#51abff"
                            }
                        }
                    },
                    {
                        value: setting.zc,
                        name: '正常',
                        itemStyle: {
                            normal: {
                                color: "rgba(29,196,241,0.3)"
                            }
                        }
                    }
                ]
            }
        ]
    };


    var option1 = {
        title: {
            text: '',
            subtext: '',
            x: 'center'
        },
        grid: {
            left: 30,
            top: 10,
            bottom: 30
        },
        tooltip: {
            show: false
        },
        legend: {
            show: true,
            x: 'right',
            y: 'bottom',
            itemWidth: 10,
            itemHeight: 10,
            data: ["报警", "预警", "正常"]
        },
        toolbox: {
            show: false
        },
        calculable: true,
        series: [
            {
                name: '',
                type: 'pie',
                radius: ["20%", "30%"],
                center: ['50%', '50%'],
                clockWise: true,
                roseType: 'radius',
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: "outer",
                            formatter: "{b}\n\n {c}个",
                            distance: 0
                        },
                        labelLine: {
                            show: true
                        }
                    }
                },
                data: [

                    {
                        value: 15,
                        name: '报警',
                        itemStyle: {
                            normal: {
                                color: "#9e56f0"
                            }
                        }
                    },
                    {
                        value: 10,
                        name: '预警',
                        itemStyle: {
                            normal: {
                                color: "rgba(29,196,241,0.3)"
                            }
                        }
                    },
                    {
                        value: 5,
                        name: '正常',
                        itemStyle: {
                            normal: {
                                color: "#51abff"
                            }
                        }
                    }
                ]
            }
        ]
    };
    if (width < 100) {
        return option1;
    } else {
        return option;
    }
}


var style = {
    main: {
        css: {
            container: "container form",
            row: "border text-center row"
        },
        elements: {
            container: "div",
            row: "div",
            column: "div"
        }
    },
    title: {
        css: {
            container: "form_title"
        },
        elements: {
            container: "div"
        }
    },
    tbody: {
        css: {
            container: "border_a",
            row: "overflow-hidden  ",
            column: "col-xs-6 reset-v text-center border_b"
        },
        elements: {
            row: "div",
            column: "div"
        }
    }
};
var tableSetting = {
    title: {
        isSra: false,
        text: "基本信息"
    },
    tbody: {
        isSra: true,
        fieldDealer: function (value, obj, column, field, fieldOption) {
            if (field === "sfpd") {
                if (Number(value) > 0) {
                    value = "已派单";
                } else {
                    value = "未派单";
                }
            }
            var label = $("<div>").addClass("col-xs-3 line-label form_label reset-v").text(fieldOption[field].name);
            var val = $("<div>").addClass("col-xs-9 line-label form_value  reset-v").text(value);
            if (field === "EMPTY") {
                label.addClass("EMPTY");
                val.addClass("EMPTY");
            }


            $(column).addClass(fieldOption[field].resetClass).append(label).append(val);
        },
        fieldOption: {
            tzh: {
                name: "台站号"
            },
            zm: {
                name: "台站名"
            },
            zz: {
                name: "地址"
            },
            bzry: {
                name: "保障人员"
            },
            cwxx: {
                name: "错误信息"
            },
            wjscsj: {
                name: "检查时间"
            },
            sfpd: {
                name: "派单情况"
            },
            EMPTY: {
                name: "NULL"
            }
        }
    }
};

var tableSetting1 = {
    title: {
        isSra: false,
        text: "要素信息"
    },
    tbody: {
        isSra: true,
        fieldDealer: function (value, obj, column, field, fieldOption) {
            var label = $("<div>").addClass("col-xs-3 line-label form_label reset-v").text(fieldOption[field].name);
            if (field !== "bz") {
                value = WUtil.random(0, 2);
                var url = "image/point_" + value + ".png";
                value = $("<img>").attr("src", url);
            }
            var val = $("<div>").addClass("col-xs-9 line-label form_value  reset-v").append(value);
            if (field === "EMPTY") {
                label.addClass("EMPTY");
                val.addClass("EMPTY");
            }
            $(column).addClass(fieldOption[field].resetClass).append(label).append(val);
        },
        fieldOption: {
            fx: {
                name: "风向"
            },
            fs: {
                name: "风速"
            },
            wd: {
                name: "温度"
            },
            sd: {
                name: "湿度"
            },
            yl: {
                name: "雨量"
            },
            qy: {
                name: "气压"
            },
            njd: {
                name: "能见度"
            },
            dw: {
                name: "地温"
            },
            bz: {
                name: "备注",
                resetClass: "col-xs-12"
            }
        }
    }
};
var tableSetting2 = {
    title: {
        isSra: false,
        text: "状态信息"
    },
    tbody: {
        isSra: true,
        fieldDealer: function (value, obj, column, field, fieldOption) {
            var label = $("<div>").addClass("col-xs-3 line-label form_label form_slabel reset-v").text(fieldOption[field].name);
            value = WUtil.random(0, 2);
            var url = "image/point_" + value + ".png";
            value = $("<img>").attr("src", url);
            var val = $("<div>").addClass("col-xs-9 line-label form_value  reset-v").append(value);
            if (field === "EMPTY") {
                label.addClass("EMPTY");
                val.addClass("EMPTY");
            }
            $(column).addClass(fieldOption[field].resetClass).append(label).append(val);
        },
        fieldOption: {
            zbdy: {
                name: "主板电压"
            },
            zbwd: {
                name: "主板温度"
            },
            dydy: {
                name: "电源电压"
            },
            gdlx: {
                name: "供电类型"
            },
            hdgl: {
                name: "耗电功率"
            },
            cfk: {
                name: "CF卡"
            },
            wdcgq: {
                name: "温度传杆器"
            },
            sdcgq: {
                name: "湿度传杆器"
            },
            fxcgq: {
                name: "风向传感器"
            },
            fscgq: {
                name: "风速传感器"
            },
            csfcgq: {
                name: "超声风传感器"
            },
            fdylcgq: {
                name: "翻斗雨量传感器"
            },
            qycgq: {
                name: "气压传感器"
            },
            njdcgq: {
                name: "能见度传感器"
            },
            jsxxcgq: {
                name: "降水现象传感器"
            },
            xscgq: {
                name: "雪深传感器"
            },
            czcgq: {
                name: "称重传感器"
            },
            cwcgq: {
                name: "草温传感器"
            },
            dbwcgq: {
                name: "地表温度传感器"
            },
            qcdwcgq: {
                name: "浅层地温传感器"
            },
            sddwcgq: {
                name: "深层地温传感器"
            },
            rzcgq: {
                name: "日照传感器"
            },
            srdzt: {
                name: "输入端状态"
            },
            srddy: {
                name: "输入端电压"
            },
            dfddl: {
                name: "充放电电流"
            },
            xdczt: {
                name: "蓄电池端状"
            }
        }
    }
};
function getMap(points) {
    var convertData = function (points) {
        var res = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var arr = [];
            arr[0] = point.x;
            arr[1] = point.y;
            arr[2] = 1;
            var sfpd = Number(point.sfpd);
            var color = "#ccc21f";
            if (sfpd === 0) {
                color = "#d83838";
            }
            res.push({
                name: point.name,
                value: arr,
                itemStyle: {
                    normal: {
                        color: color,
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                }
            });
        }
        return res;
    };
    var option = {
        bmap: {
            center: [121.15, 31.89],
            zoom: 10,
            roam: true
        },
        series: [{
                type: 'effectScatter',
                coordinateSystem: 'bmap',
                data: convertData(points),
                symbolSize: function (val) {
                    return 40;
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    }
                },
                zlevel: 0
            }]
    };
    return option;
}
var mapStyle = {
    styleJson: [
        {
            "featureType": "highway", //高速及国道
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "arterial", //城市及主路
            "elementType": "all",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "local", //普通道路
            "elementType": "all",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "railway", //铁路
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "subway", //地铁
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "poi", //兴趣点
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "label", //行政标注
            "elementType": "all",
            "stylers": {
                "visibility": "on"
            }
        },
        {
            "featureType": "boundary", //边界线
            "elementType": "all",
            "stylers": {
                "visibility": "on"
            }
        }
    ]
};
var style1 = {
    main: {
        css: {
            row: "text-center"
        },
        elements: {
            container: "div",
            row: "div",
            column: "div"
        }
    },
    thead: {
        css: {
            container: "table_thead fixed-table",
            row: "overflow-hidden",
            column: "text-center table_column line-label"
        },
        elements: {
            row: "div",
            column: "div"
        }
    },
    tbody: {
        css: {
            container: "fixed-table-body",
            row: "overflow-hidden border table_body",
            column: "text-center table_column table_body_column line-label"
        },
        elements: {
            row: "div",
            column: "div"
        }
    }
};
var tableSetting3 = {
    thead: {
        isSra: true,
        dataDealer: function () {
            return {
                NO: "序号",
                tzh: "台站号",
                zm: "台站名",
                cwxx: "错误信息",
                wjscsj: "检查时间",
                dya: "错误类型"
            };
        },
        fieldDealer: function (value, obj, column, field, fieldOption) {
            var p = fieldOption[field].persent;
            var size = Math.floor(p / 12 * 100);
            $(column).css("width", size + "%").append(value);
        },
        fieldOption: {
            NO: {
                name: "序号",
                persent: 1
            },
            tzh: {
                name: "台站号",
                persent: 2
            },
            zm: {
                name: "台站名",
                persent: 2
            },
            cwxx: {
                name: "错误信息",
                persent: 3
            },
            wjscsj: {
                name: "检查时间",
                persent: 2
            },
            dya: {
                name: "错误类型",
                persent: 2
            }
        }
    },
    tbody: {
        isSra: true,
        fieldDealer: function (value, obj, column, field, fieldOption) {
            if (field === "NO") {
                value = parseInt(WUtil.getData(column, "row")) + 1;
                if (Number(obj.sfpd) > 0) {
                    $(column).addClass("table_body_column_ypd");
                } else {
                    $(column).addClass("table_body_column_wpd");
                }
            }
            var p = fieldOption[field].persent;
            var size = Math.floor(p / 12 * 100);
            $(column).css("width", size + "%").append(value);
        },
        fieldOption: {
            NO: {
                name: "序号",
                persent: 1
            },
            tzh: {
                name: "台站号",
                persent: 2
            },
            zm: {
                name: "台站名",
                persent: 2
            },
            cwxx: {
                name: "错误信息",
                persent: 3
            },
            wjscsj: {
                name: "发生时间",
                persent: 2
            },
            dya: {
                name: "错误类型",
                persent: 2
            }
        }
    }
};

