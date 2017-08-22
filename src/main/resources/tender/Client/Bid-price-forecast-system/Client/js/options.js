//全国地图
var optionMap = {
    title : {
        text: '全年最低价分布',
        top:20,
        x:'center'
    },
    tooltip : {
        trigger: 'item',
    	position: function(point, params, dom) {
            return ['5%', '5%'];
        },
        formatter:function(e){
        	return '<div><div style="color:#fff;">'+e.seriesName+'</div><div style="color:#fff;"><span>'+e.name+'--</span><span> '+(isNaN(e.value)?'无数据':e.value)+'</span><div></div>'
        }
    },
//  legend: {
//      orient: 'vertical',
//      x:'left',
//      data:['iphone3']
//  },
    visualMap: {
        min: 200,
        max: 300,
        left: 'left',
        top: 'bottom',
        text: ['高','低'],
        inRange: {
            color: ['#77BBEF', '#055cb3']
        },
        calculable : true
    },
//  toolbox: {
//      show: true,
//      orient : 'vertical',
//      x: 'right',
//      y: 'center',
//      feature : {
//          mark : {show: true},
//          dataView : {show: true, readOnly: false},
//          restore : {show: true},
//          saveAsImage : {show: true}
//      }
//  },
    series : [
        {
            name: '药品分布',
            type: 'map',
            mapType: 'china',
            itemStyle:{
                normal:{label:{show:true}},
                emphasis:{label:{show:true}}
            },
//          roam: false,//地图不允许拖动
//          roam: 'scale',
//			scaleLimit:{min:0.8,max:1.5},
            selectedMode : 'single',
            data:[
//              {name: '北京',value:226},
//              {name: '天津',value: 226},
//              {name: '上海',value:226},
//              {name: '重庆',value: 170},
//              {name: '河北',value: 186},
//              {name: '河南',value: 196},
//              {name: '云南',value: 226},
//              {name: '辽宁',value: 217},
//              {name: '黑龙江',value: 221},
//              {name: '湖南',value: 206},
//              {name: '安徽',value: 224},
//              {name: '山东',value: 206},
//              {name: '新疆',value: 196},
//              {name: '江苏',value: 206},
//              {name: '浙江',value: 226},
//              {name: '江西',value:226},
//              {name: '湖北',value: 196},
//              {name: '广西',value: 226},
//              {name: '甘肃',value: 196},
//              {name: '山西',value: 226},
//              {name: '内蒙古',value: 260},
//              {name: '陕西',value: 188},
//              {name: '福建',value: 226},
//              {name: '吉林',value: 230},
//              {name: '贵州',value:226},
//              {name: '青海',value: 206},
//              {name: '西藏',value: 226},
//              {name: '四川',value: 206},
//              {name: '宁夏',value: 180},
//              {name: '海南',value:190},
//              {name: '台湾',value: 186},
//              {name: '香港',value: 186},
//              {name: '澳门',value:186}
            ]
        }
    ],
    animation:false
};

var optionAllLine = {
	title : {
        text: '全年价格蔓延趋势图',
        x:'center'
    },
    tooltip : {
        trigger: 'axis'
    },
     grid:{
    	x:40,
    	y:60,
    	x2:40,
    	y2:60
    },
    calculable : true,
    xAxis : [
        {
//      	name:'月份',
            type : 'category',
            boundaryGap : false,
            splitLine:false,
            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            axisLabel : {
                formatter: '{value}'
            }
        }
    ],
    yAxis : [
        {
        	name:'最低价',
            type : 'value'
        }
    ],
    series : [
        {
            name:'价格',
            smooth:true,
            type:'line',
            data:[],
//          markPoint : {
//              data : [
//                  {type : 'max', name: '最大值'},
//                  {type : 'min', name: '最小值'}
//              ]
//          },
//          itemStyle:{
//          	normal:{
//          		lineStyle:{
//          			color:'#46a0fa'
//          		}
//          	}
//          }
//          markLine : {
//              data : [
//                  {type : 'average', name: '平均值'}
//              ]
//          }
        }
    ]
}

var dataAxis = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
//var CityData = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
var yMax = 500;
var dataShadow = [];

var optionCityBar = {
    title : {
        text: '省市中标价趋势图'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    toolbox: {
        show : true,
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis: {
        data: dataAxis,
        axisLabel: {
//          inside: true,
            textStyle: {
                color: '#999'
            }
        },
        axisTick: {
            show: true,
        },
        axisLine: {
            show: false
        },
        z: 10
    },
    
    yAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#999'
            }
        }
    },
    
    grid:{
    	x:40,
    	y:60,
    	x2:40,
    	y2:40
    },
    series : [
        {
        	name:'中标价',
        	type: 'bar',
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#83bff6'},
                            {offset: 0.5, color: '#188df0'},
                            {offset: 1, color: '#188df0'}
                        ]
                    )
                },
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#2378f7'},
                            {offset: 0.7, color: '#2378f7'},
                            {offset: 1, color: '#83bff6'}
                        ]
                    )
                }
            },
            data: []
        }
    ]
};




//sdCharts.title = '单轴散点图';

var Months = dataAxis;




