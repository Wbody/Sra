function getYBP(mcolor, acolor, value, name, fontSize) {
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
                splitNumber: 10,
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
                    show: false
                },
                splitLine: {// 分隔线
                    show: true, // 默认显示，属性show控制显示与否
                    length: 10, // 属性length控制线长
                    lineStyle: {// 属性lineStyle（详见lineStyle）控制线条样式
                        color: acolor
                    }
                },
                pointer: {
                    width: 5
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
                    formatter: '{value}',
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    offsetCenter: [0, '40%'],
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
function getRose(width) {
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
            var label = $("<div>").addClass("col-xs-3 line-label form_label reset-v").text(fieldOption[field].name);
            var val = $("<div>").addClass("col-xs-9 line-label form_value  reset-v").text(value);
            if (field === "EMPTY") {
                label.addClass("EMPTY");
                val.addClass("EMPTY");
            }
            $(column).addClass(fieldOption[field].resetClass).append(label).append(val);
        },
        fieldOption: {
            tz: {
                name: "台站号"
            },
            tzm: {
                name: "台站名"
            },
            dz: {
                name: "地址"
            },
            bzry: {
                name: "保障人员"
            },
            cwxx: {
                name: "错误信息"
            },
            fssj: {
                name: "发生时间"
            },
            pdxq: {
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

