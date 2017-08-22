//url
//var lUrl = 'http://180.76.174.246:8089';
var lUrl = 'http://localhost:80';
//省市信息
var areaData = [{"Province":"上海","provinceCode":"31","City":"上海省级","cityCode":"3100"},{"Province":"上海","provinceCode":"31","City":"上海市","cityCode":"3101"},{"Province":"云南","provinceCode":"53","City":"云南省级","cityCode":"5300"},{"Province":"云南","provinceCode":"53","City":"昆明市","cityCode":"5301"},{"Province":"云南","provinceCode":"53","City":"曲靖市","cityCode":"5303"},{"Province":"云南","provinceCode":"53","City":"玉溪市","cityCode":"5304"},{"Province":"云南","provinceCode":"53","City":"保山市","cityCode":"5305"},{"Province":"云南","provinceCode":"53","City":"昭通市","cityCode":"5306"},{"Province":"云南","provinceCode":"53","City":"丽江市","cityCode":"5307"},{"Province":"云南","provinceCode":"53","City":"普洱市","cityCode":"5308"},{"Province":"云南","provinceCode":"53","City":"临沧市","cityCode":"5309"},{"Province":"云南","provinceCode":"53","City":"楚雄彝族自治州","cityCode":"5323"},{"Province":"云南","provinceCode":"53","City":"红河哈尼族彝族自治州","cityCode":"5325"},{"Province":"云南","provinceCode":"53","City":"文山壮族苗族自治州","cityCode":"5326"},{"Province":"云南","provinceCode":"53","City":"西双版纳傣族自治州","cityCode":"5328"},{"Province":"云南","provinceCode":"53","City":"大理白族自治州","cityCode":"5329"},{"Province":"云南","provinceCode":"53","City":"德宏傣族景颇族自治州","cityCode":"5331"},{"Province":"云南","provinceCode":"53","City":"怒江傈僳族自治州","cityCode":"5333"},{"Province":"云南","provinceCode":"53","City":"迪庆藏族自治州","cityCode":"5334"},{"Province":"内蒙古","provinceCode":"15","City":"内蒙古省级","cityCode":"1500"},{"Province":"内蒙古","provinceCode":"15","City":"呼和浩特市","cityCode":"1501"},{"Province":"内蒙古","provinceCode":"15","City":"包头市","cityCode":"1502"},{"Province":"内蒙古","provinceCode":"15","City":"乌海市","cityCode":"1503"},{"Province":"内蒙古","provinceCode":"15","City":"赤峰市","cityCode":"1504"},{"Province":"内蒙古","provinceCode":"15","City":"通辽市","cityCode":"1505"},{"Province":"内蒙古","provinceCode":"15","City":"鄂尔多斯市","cityCode":"1506"},{"Province":"内蒙古","provinceCode":"15","City":"呼伦贝尔市","cityCode":"1507"},{"Province":"内蒙古","provinceCode":"15","City":"巴彦淖尔市","cityCode":"1508"},{"Province":"内蒙古","provinceCode":"15","City":"乌兰察布市","cityCode":"1509"},{"Province":"内蒙古","provinceCode":"15","City":"兴安盟","cityCode":"1522"},{"Province":"内蒙古","provinceCode":"15","City":"锡林郭勒盟","cityCode":"1525"},{"Province":"内蒙古","provinceCode":"15","City":"阿拉善盟","cityCode":"1529"},{"Province":"北京","provinceCode":"11","City":"北京省级","cityCode":"1100"},{"Province":"北京","provinceCode":"11","City":"北京市","cityCode":"1101"},{"Province":"吉林","provinceCode":"22","City":"吉林省级","cityCode":"2200"},{"Province":"吉林","provinceCode":"22","City":"长春市","cityCode":"2201"},{"Province":"吉林","provinceCode":"22","City":"吉林市","cityCode":"2202"},{"Province":"吉林","provinceCode":"22","City":"四平市","cityCode":"2203"},{"Province":"吉林","provinceCode":"22","City":"辽源市","cityCode":"2204"},{"Province":"吉林","provinceCode":"22","City":"通化市","cityCode":"2205"},{"Province":"吉林","provinceCode":"22","City":"白山市","cityCode":"2206"},{"Province":"吉林","provinceCode":"22","City":"松原市","cityCode":"2207"},{"Province":"吉林","provinceCode":"22","City":"白城市","cityCode":"2208"},{"Province":"吉林","provinceCode":"22","City":"延边朝鲜族自治州","cityCode":"2224"},{"Province":"四川","provinceCode":"51","City":"四川省级","cityCode":"5100"},{"Province":"四川","provinceCode":"51","City":"成都市","cityCode":"5101"},{"Province":"四川","provinceCode":"51","City":"自贡市","cityCode":"5103"},{"Province":"四川","provinceCode":"51","City":"攀枝花市","cityCode":"5104"},{"Province":"四川","provinceCode":"51","City":"泸州市","cityCode":"5105"},{"Province":"四川","provinceCode":"51","City":"德阳市","cityCode":"5106"},{"Province":"四川","provinceCode":"51","City":"绵阳市","cityCode":"5107"},{"Province":"四川","provinceCode":"51","City":"广元市","cityCode":"5108"},{"Province":"四川","provinceCode":"51","City":"遂宁市","cityCode":"5109"},{"Province":"四川","provinceCode":"51","City":"内江市","cityCode":"5110"},{"Province":"四川","provinceCode":"51","City":"乐山市","cityCode":"5111"},{"Province":"四川","provinceCode":"51","City":"南充市","cityCode":"5113"},{"Province":"四川","provinceCode":"51","City":"眉山市","cityCode":"5114"},{"Province":"四川","provinceCode":"51","City":"宜宾市","cityCode":"5115"},{"Province":"四川","provinceCode":"51","City":"广安市","cityCode":"5116"},{"Province":"四川","provinceCode":"51","City":"达州市","cityCode":"5117"},{"Province":"四川","provinceCode":"51","City":"雅安市","cityCode":"5118"},{"Province":"四川","provinceCode":"51","City":"巴中市","cityCode":"5119"},{"Province":"四川","provinceCode":"51","City":"资阳市","cityCode":"5120"},{"Province":"四川","provinceCode":"51","City":"阿坝藏族羌族自治州","cityCode":"5132"},{"Province":"四川","provinceCode":"51","City":"甘孜藏族自治州","cityCode":"5133"},{"Province":"四川","provinceCode":"51","City":"凉山彝族自治州","cityCode":"5134"},{"Province":"天津","provinceCode":"12","City":"天津省级","cityCode":"1200"},{"Province":"天津","provinceCode":"12","City":"天津市","cityCode":"1201"},{"Province":"宁夏","provinceCode":"64","City":"宁夏省级","cityCode":"6400"},{"Province":"宁夏","provinceCode":"64","City":"银川市","cityCode":"6401"},{"Province":"宁夏","provinceCode":"64","City":"石嘴山市","cityCode":"6402"},{"Province":"宁夏","provinceCode":"64","City":"吴忠市","cityCode":"6403"},{"Province":"宁夏","provinceCode":"64","City":"固原市","cityCode":"6404"},{"Province":"宁夏","provinceCode":"64","City":"中卫市","cityCode":"6405"},{"Province":"安徽","provinceCode":"34","City":"安徽省级","cityCode":"3400"},{"Province":"安徽","provinceCode":"34","City":"合肥市","cityCode":"3401"},{"Province":"安徽","provinceCode":"34","City":"芜湖市","cityCode":"3402"},{"Province":"安徽","provinceCode":"34","City":"蚌埠市","cityCode":"3403"},{"Province":"安徽","provinceCode":"34","City":"淮南市","cityCode":"3404"},{"Province":"安徽","provinceCode":"34","City":"马鞍山市","cityCode":"3405"},{"Province":"安徽","provinceCode":"34","City":"淮北市","cityCode":"3406"},{"Province":"安徽","provinceCode":"34","City":"铜陵市","cityCode":"3407"},{"Province":"安徽","provinceCode":"34","City":"安庆市","cityCode":"3408"},{"Province":"安徽","provinceCode":"34","City":"黄山市","cityCode":"3410"},{"Province":"安徽","provinceCode":"34","City":"滁州市","cityCode":"3411"},{"Province":"安徽","provinceCode":"34","City":"阜阳市","cityCode":"3412"},{"Province":"安徽","provinceCode":"34","City":"宿州市","cityCode":"3413"},{"Province":"安徽","provinceCode":"34","City":"六安市","cityCode":"3415"},{"Province":"安徽","provinceCode":"34","City":"亳州市","cityCode":"3416"},{"Province":"安徽","provinceCode":"34","City":"池州市","cityCode":"3417"},{"Province":"安徽","provinceCode":"34","City":"宣城市","cityCode":"3418"},{"Province":"山东","provinceCode":"37","City":"山东省级","cityCode":"3700"},{"Province":"山东","provinceCode":"37","City":"济南市","cityCode":"3701"},{"Province":"山东","provinceCode":"37","City":"青岛市","cityCode":"3702"},{"Province":"山东","provinceCode":"37","City":"淄博市","cityCode":"3703"},{"Province":"山东","provinceCode":"37","City":"枣庄市","cityCode":"3704"},{"Province":"山东","provinceCode":"37","City":"东营市","cityCode":"3705"},{"Province":"山东","provinceCode":"37","City":"烟台市","cityCode":"3706"},{"Province":"山东","provinceCode":"37","City":"潍坊市","cityCode":"3707"},{"Province":"山东","provinceCode":"37","City":"济宁市","cityCode":"3708"},{"Province":"山东","provinceCode":"37","City":"泰安市","cityCode":"3709"},{"Province":"山东","provinceCode":"37","City":"威海市","cityCode":"3710"},{"Province":"山东","provinceCode":"37","City":"日照市","cityCode":"3711"},{"Province":"山东","provinceCode":"37","City":"莱芜市","cityCode":"3712"},{"Province":"山东","provinceCode":"37","City":"临沂市","cityCode":"3713"},{"Province":"山东","provinceCode":"37","City":"德州市","cityCode":"3714"},{"Province":"山东","provinceCode":"37","City":"聊城市","cityCode":"3715"},{"Province":"山东","provinceCode":"37","City":"滨州市","cityCode":"3716"},{"Province":"山东","provinceCode":"37","City":"菏泽市","cityCode":"3717"},{"Province":"山西","provinceCode":"14","City":"山西省级","cityCode":"1400"},{"Province":"山西","provinceCode":"14","City":"太原市","cityCode":"1401"},{"Province":"山西","provinceCode":"14","City":"大同市","cityCode":"1402"},{"Province":"山西","provinceCode":"14","City":"阳泉市","cityCode":"1403"},{"Province":"山西","provinceCode":"14","City":"长治市","cityCode":"1404"},{"Province":"山西","provinceCode":"14","City":"晋城市","cityCode":"1405"},{"Province":"山西","provinceCode":"14","City":"朔州市","cityCode":"1406"},{"Province":"山西","provinceCode":"14","City":"晋中市","cityCode":"1407"},{"Province":"山西","provinceCode":"14","City":"运城市","cityCode":"1408"},{"Province":"山西","provinceCode":"14","City":"忻州市","cityCode":"1409"},{"Province":"山西","provinceCode":"14","City":"临汾市","cityCode":"1410"},{"Province":"山西","provinceCode":"14","City":"吕梁市","cityCode":"1411"},{"Province":"广东","provinceCode":"44","City":"广东省级","cityCode":"4400"},{"Province":"广东","provinceCode":"44","City":"广州市","cityCode":"4401"},{"Province":"广东","provinceCode":"44","City":"韶关市","cityCode":"4402"},{"Province":"广东","provinceCode":"44","City":"深圳市","cityCode":"4403"},{"Province":"广东","provinceCode":"44","City":"珠海市","cityCode":"4404"},{"Province":"广东","provinceCode":"44","City":"汕头市","cityCode":"4405"},{"Province":"广东","provinceCode":"44","City":"佛山市","cityCode":"4406"},{"Province":"广东","provinceCode":"44","City":"江门市","cityCode":"4407"},{"Province":"广东","provinceCode":"44","City":"湛江市","cityCode":"4408"},{"Province":"广东","provinceCode":"44","City":"茂名市","cityCode":"4409"},{"Province":"广东","provinceCode":"44","City":"肇庆市","cityCode":"4412"},{"Province":"广东","provinceCode":"44","City":"惠州市","cityCode":"4413"},{"Province":"广东","provinceCode":"44","City":"梅州市","cityCode":"4414"},{"Province":"广东","provinceCode":"44","City":"汕尾市","cityCode":"4415"},{"Province":"广东","provinceCode":"44","City":"河源市","cityCode":"4416"},{"Province":"广东","provinceCode":"44","City":"阳江市","cityCode":"4417"},{"Province":"广东","provinceCode":"44","City":"清远市","cityCode":"4418"},{"Province":"广东","provinceCode":"44","City":"潮州市","cityCode":"4451"},{"Province":"广东","provinceCode":"44","City":"揭阳市","cityCode":"4452"},{"Province":"广东","provinceCode":"44","City":"云浮市","cityCode":"4453"},{"Province":"广东","provinceCode":"44","City":"东莞市","cityCode":"4419"},{"Province":"广东","provinceCode":"44","City":"中山市","cityCode":"4420"},{"Province":"广西","provinceCode":"45","City":"广西省级","cityCode":"4500"},{"Province":"广西","provinceCode":"45","City":"南宁市","cityCode":"4501"},{"Province":"广西","provinceCode":"45","City":"柳州市","cityCode":"4502"},{"Province":"广西","provinceCode":"45","City":"桂林市","cityCode":"4503"},{"Province":"广西","provinceCode":"45","City":"梧州市","cityCode":"4504"},{"Province":"广西","provinceCode":"45","City":"北海市","cityCode":"4505"},{"Province":"广西","provinceCode":"45","City":"防城港市","cityCode":"4506"},{"Province":"广西","provinceCode":"45","City":"钦州市","cityCode":"4507"},{"Province":"广西","provinceCode":"45","City":"贵港市","cityCode":"4508"},{"Province":"广西","provinceCode":"45","City":"玉林市","cityCode":"4509"},{"Province":"广西","provinceCode":"45","City":"百色市","cityCode":"4510"},{"Province":"广西","provinceCode":"45","City":"贺州市","cityCode":"4511"},{"Province":"广西","provinceCode":"45","City":"河池市","cityCode":"4512"},{"Province":"广西","provinceCode":"45","City":"来宾市","cityCode":"4513"},{"Province":"广西","provinceCode":"45","City":"崇左市","cityCode":"4514"},{"Province":"新疆","provinceCode":"65","City":"新疆省级","cityCode":"6500"},{"Province":"新疆","provinceCode":"65","City":"乌鲁木齐市","cityCode":"6501"},{"Province":"新疆","provinceCode":"65","City":"克拉玛依市","cityCode":"6502"},{"Province":"新疆","provinceCode":"65","City":"吐鲁番市","cityCode":"6521"},{"Province":"新疆","provinceCode":"65","City":"哈密市","cityCode":"6522"},{"Province":"新疆","provinceCode":"65","City":"昌吉回族自治州","cityCode":"6523"},{"Province":"新疆","provinceCode":"65","City":"博尔塔拉蒙古自治州","cityCode":"6527"},{"Province":"新疆","provinceCode":"65","City":"巴音郭楞蒙古自治州　","cityCode":"6528"},{"Province":"新疆","provinceCode":"65","City":"阿克苏地区","cityCode":"6529"},{"Province":"新疆","provinceCode":"65","City":"克孜勒苏柯尔克孜自治州","cityCode":"6530"},{"Province":"新疆","provinceCode":"65","City":"喀什地区","cityCode":"6531"},{"Province":"新疆","provinceCode":"65","City":"和田地区","cityCode":"6532"},{"Province":"新疆","provinceCode":"65","City":"伊犁哈萨克自治州","cityCode":"6540"},{"Province":"新疆","provinceCode":"65","City":"塔城地区","cityCode":"6542"},{"Province":"新疆","provinceCode":"65","City":"阿勒泰地区","cityCode":"6543"},{"Province":"江苏","provinceCode":"32","City":"江苏省级","cityCode":"3200"},{"Province":"江苏","provinceCode":"32","City":"南京市","cityCode":"3201"},{"Province":"江苏","provinceCode":"32","City":"无锡市","cityCode":"3202"},{"Province":"江苏","provinceCode":"32","City":"徐州市","cityCode":"3203"},{"Province":"江苏","provinceCode":"32","City":"常州市","cityCode":"3204"},{"Province":"江苏","provinceCode":"32","City":"苏州市","cityCode":"3205"},{"Province":"江苏","provinceCode":"32","City":"南通市","cityCode":"3206"},{"Province":"江苏","provinceCode":"32","City":"连云港市","cityCode":"3207"},{"Province":"江苏","provinceCode":"32","City":"淮安市","cityCode":"3208"},{"Province":"江苏","provinceCode":"32","City":"盐城市","cityCode":"3209"},{"Province":"江苏","provinceCode":"32","City":"扬州市","cityCode":"3210"},{"Province":"江苏","provinceCode":"32","City":"镇江市","cityCode":"3211"},{"Province":"江苏","provinceCode":"32","City":"泰州市","cityCode":"3212"},{"Province":"江苏","provinceCode":"32","City":"宿迁市","cityCode":"3213"},{"Province":"江西","provinceCode":"36","City":"江西省级","cityCode":"3600"},{"Province":"江西","provinceCode":"36","City":"南昌市","cityCode":"3601"},{"Province":"江西","provinceCode":"36","City":"景德镇市","cityCode":"3602"},{"Province":"江西","provinceCode":"36","City":"萍乡市","cityCode":"3603"},{"Province":"江西","provinceCode":"36","City":"九江市","cityCode":"3604"},{"Province":"江西","provinceCode":"36","City":"新余市","cityCode":"3605"},{"Province":"江西","provinceCode":"36","City":"鹰潭市","cityCode":"3606"},{"Province":"江西","provinceCode":"36","City":"赣州市","cityCode":"3607"},{"Province":"江西","provinceCode":"36","City":"吉安市","cityCode":"3608"},{"Province":"江西","provinceCode":"36","City":"宜春市","cityCode":"3609"},{"Province":"江西","provinceCode":"36","City":"抚州市","cityCode":"3610"},{"Province":"江西","provinceCode":"36","City":"上饶市","cityCode":"3611"},{"Province":"河北","provinceCode":"13","City":"河北省级","cityCode":"1300"},{"Province":"河北","provinceCode":"13","City":"石家庄市","cityCode":"1301"},{"Province":"河北","provinceCode":"13","City":"唐山市","cityCode":"1302"},{"Province":"河北","provinceCode":"13","City":"秦皇岛市","cityCode":"1303"},{"Province":"河北","provinceCode":"13","City":"邯郸市","cityCode":"1304"},{"Province":"河北","provinceCode":"13","City":"邢台市","cityCode":"1305"},{"Province":"河北","provinceCode":"13","City":"保定市","cityCode":"1306"},{"Province":"河北","provinceCode":"13","City":"张家口市","cityCode":"1307"},{"Province":"河北","provinceCode":"13","City":"承德市","cityCode":"1308"},{"Province":"河北","provinceCode":"13","City":"沧州市","cityCode":"1309"},{"Province":"河北","provinceCode":"13","City":"廊坊市","cityCode":"1310"},{"Province":"河北","provinceCode":"13","City":"衡水市","cityCode":"1311"},{"Province":"河南","provinceCode":"41","City":"河南省级","cityCode":"4100"},{"Province":"河南","provinceCode":"41","City":"郑州市","cityCode":"4101"},{"Province":"河南","provinceCode":"41","City":"开封市","cityCode":"4102"},{"Province":"河南","provinceCode":"41","City":"洛阳市","cityCode":"4103"},{"Province":"河南","provinceCode":"41","City":"平顶山市","cityCode":"4104"},{"Province":"河南","provinceCode":"41","City":"安阳市","cityCode":"4105"},{"Province":"河南","provinceCode":"41","City":"鹤壁市","cityCode":"4106"},{"Province":"河南","provinceCode":"41","City":"新乡市","cityCode":"4107"},{"Province":"河南","provinceCode":"41","City":"焦作市","cityCode":"4108"},{"Province":"河南","provinceCode":"41","City":"濮阳市","cityCode":"4109"},{"Province":"河南","provinceCode":"41","City":"许昌市","cityCode":"4110"},{"Province":"河南","provinceCode":"41","City":"漯河市","cityCode":"4111"},{"Province":"河南","provinceCode":"41","City":"三门峡市","cityCode":"4112"},{"Province":"河南","provinceCode":"41","City":"南阳市","cityCode":"4113"},{"Province":"河南","provinceCode":"41","City":"商丘市","cityCode":"4114"},{"Province":"河南","provinceCode":"41","City":"信阳市","cityCode":"4115"},{"Province":"河南","provinceCode":"41","City":"周口市","cityCode":"4116"},{"Province":"河南","provinceCode":"41","City":"驻马店市","cityCode":"4117"},{"Province":"浙江","provinceCode":"33","City":"浙江省级","cityCode":"3300"},{"Province":"浙江","provinceCode":"33","City":"杭州市","cityCode":"3301"},{"Province":"浙江","provinceCode":"33","City":"宁波市","cityCode":"3302"},{"Province":"浙江","provinceCode":"33","City":"温州市","cityCode":"3303"},{"Province":"浙江","provinceCode":"33","City":"嘉兴市","cityCode":"3304"},{"Province":"浙江","provinceCode":"33","City":"湖州市","cityCode":"3305"},{"Province":"浙江","provinceCode":"33","City":"绍兴市","cityCode":"3306"},{"Province":"浙江","provinceCode":"33","City":"金华市","cityCode":"3307"},{"Province":"浙江","provinceCode":"33","City":"衢州市","cityCode":"3308"},{"Province":"浙江","provinceCode":"33","City":"舟山市","cityCode":"3309"},{"Province":"浙江","provinceCode":"33","City":"台州市","cityCode":"3310"},{"Province":"浙江","provinceCode":"33","City":"丽水市","cityCode":"3311"},{"Province":"海南","provinceCode":"46","City":"海南省级","cityCode":"4600"},{"Province":"海南","provinceCode":"46","City":"海口市","cityCode":"4601"},{"Province":"海南","provinceCode":"46","City":"三亚市","cityCode":"4602"},{"Province":"海南","provinceCode":"46","City":"三沙市","cityCode":"4603"},{"Province":"海南","provinceCode":"46","City":"儋州市","cityCode":"4604"},{"Province":"湖北","provinceCode":"42","City":"湖北省级","cityCode":"4200"},{"Province":"湖北","provinceCode":"42","City":"武汉市","cityCode":"4201"},{"Province":"湖北","provinceCode":"42","City":"黄石市","cityCode":"4202"},{"Province":"湖北","provinceCode":"42","City":"十堰市","cityCode":"4203"},{"Province":"湖北","provinceCode":"42","City":"宜昌市","cityCode":"4205"},{"Province":"湖北","provinceCode":"42","City":"襄阳市","cityCode":"4206"},{"Province":"湖北","provinceCode":"42","City":"鄂州市","cityCode":"4207"},{"Province":"湖北","provinceCode":"42","City":"荆门市","cityCode":"4208"},{"Province":"湖北","provinceCode":"42","City":"孝感市","cityCode":"4209"},{"Province":"湖北","provinceCode":"42","City":"荆州市","cityCode":"4210"},{"Province":"湖北","provinceCode":"42","City":"黄冈市","cityCode":"4211"},{"Province":"湖北","provinceCode":"42","City":"咸宁市","cityCode":"4212"},{"Province":"湖北","provinceCode":"42","City":"随州市","cityCode":"4213"},{"Province":"湖北","provinceCode":"42","City":"恩施土家族苗族自治州","cityCode":"4228"},{"Province":"湖南","provinceCode":"43","City":"湖南省级","cityCode":"4300"},{"Province":"湖南","provinceCode":"43","City":"长沙市","cityCode":"4301"},{"Province":"湖南","provinceCode":"43","City":"株洲市","cityCode":"4302"},{"Province":"湖南","provinceCode":"43","City":"湘潭市","cityCode":"4303"},{"Province":"湖南","provinceCode":"43","City":"衡阳市","cityCode":"4304"},{"Province":"湖南","provinceCode":"43","City":"邵阳市","cityCode":"4305"},{"Province":"湖南","provinceCode":"43","City":"岳阳市","cityCode":"4306"},{"Province":"湖南","provinceCode":"43","City":"常德市","cityCode":"4307"},{"Province":"湖南","provinceCode":"43","City":"张家界市","cityCode":"4308"},{"Province":"湖南","provinceCode":"43","City":"益阳市","cityCode":"4309"},{"Province":"湖南","provinceCode":"43","City":"郴州市","cityCode":"4310"},{"Province":"湖南","provinceCode":"43","City":"永州市","cityCode":"4311"},{"Province":"湖南","provinceCode":"43","City":"怀化市","cityCode":"4312"},{"Province":"湖南","provinceCode":"43","City":"娄底市","cityCode":"4313"},{"Province":"湖南","provinceCode":"43","City":"湘西土家族苗族自治州","cityCode":"4331"},{"Province":"甘肃","provinceCode":"62","City":"甘肃省级","cityCode":"6200"},{"Province":"甘肃","provinceCode":"62","City":"兰州市","cityCode":"6201"},{"Province":"甘肃","provinceCode":"62","City":"嘉峪关市","cityCode":"6202"},{"Province":"甘肃","provinceCode":"62","City":"金昌市","cityCode":"6203"},{"Province":"甘肃","provinceCode":"62","City":"白银市","cityCode":"6204"},{"Province":"甘肃","provinceCode":"62","City":"天水市","cityCode":"6205"},{"Province":"甘肃","provinceCode":"62","City":"武威市","cityCode":"6206"},{"Province":"甘肃","provinceCode":"62","City":"张掖市","cityCode":"6207"},{"Province":"甘肃","provinceCode":"62","City":"平凉市","cityCode":"6208"},{"Province":"甘肃","provinceCode":"62","City":"酒泉市","cityCode":"6209"},{"Province":"甘肃","provinceCode":"62","City":"庆阳市","cityCode":"6210"},{"Province":"甘肃","provinceCode":"62","City":"定西市","cityCode":"6211"},{"Province":"甘肃","provinceCode":"62","City":"陇南市","cityCode":"6212"},{"Province":"甘肃","provinceCode":"62","City":"临夏回族自治州","cityCode":"6229"},{"Province":"甘肃","provinceCode":"62","City":"甘南藏族自治州","cityCode":"6230"},{"Province":"福建","provinceCode":"35","City":"福建省级","cityCode":"3500"},{"Province":"福建","provinceCode":"35","City":"福州市","cityCode":"3501"},{"Province":"福建","provinceCode":"35","City":"厦门市","cityCode":"3502"},{"Province":"福建","provinceCode":"35","City":"莆田市","cityCode":"3503"},{"Province":"福建","provinceCode":"35","City":"三明市","cityCode":"3504"},{"Province":"福建","provinceCode":"35","City":"泉州市","cityCode":"3505"},{"Province":"福建","provinceCode":"35","City":"漳州市","cityCode":"3506"},{"Province":"福建","provinceCode":"35","City":"南平市","cityCode":"3507"},{"Province":"福建","provinceCode":"35","City":"龙岩市","cityCode":"3508"},{"Province":"福建","provinceCode":"35","City":"宁德市","cityCode":"3509"},{"Province":"西藏","provinceCode":"54","City":"西藏省级","cityCode":"5400"},{"Province":"西藏","provinceCode":"54","City":"拉萨市","cityCode":"5401"},{"Province":"西藏","provinceCode":"54","City":"日喀则市","cityCode":"5402"},{"Province":"西藏","provinceCode":"54","City":"昌都市","cityCode":"5421"},{"Province":"西藏","provinceCode":"54","City":"山南市","cityCode":"5422"},{"Province":"西藏","provinceCode":"54","City":"那曲地区","cityCode":"5424"},{"Province":"西藏","provinceCode":"54","City":"阿里地区","cityCode":"5425"},{"Province":"西藏","provinceCode":"54","City":"林芝市","cityCode":"5426"},{"Province":"贵州","provinceCode":"52","City":"贵州省级","cityCode":"5200"},{"Province":"贵州","provinceCode":"52","City":"贵阳市","cityCode":"5201"},{"Province":"贵州","provinceCode":"52","City":"六盘水市","cityCode":"5202"},{"Province":"贵州","provinceCode":"52","City":"遵义市","cityCode":"5203"},{"Province":"贵州","provinceCode":"52","City":"安顺市","cityCode":"5204"},{"Province":"贵州","provinceCode":"52","City":"毕节市","cityCode":"5205"},{"Province":"贵州","provinceCode":"52","City":"铜仁市","cityCode":"5206"},{"Province":"贵州","provinceCode":"52","City":"黔西南布依族苗族自治州","cityCode":"5223"},{"Province":"贵州","provinceCode":"52","City":"黔东南苗族侗族自治州","cityCode":"5226"},{"Province":"贵州","provinceCode":"52","City":"黔南布依族苗族自治州","cityCode":"5227"},{"Province":"辽宁","provinceCode":"21","City":"辽宁省级","cityCode":"2100"},{"Province":"辽宁","provinceCode":"21","City":"沈阳市","cityCode":"2101"},{"Province":"辽宁","provinceCode":"21","City":"大连市","cityCode":"2102"},{"Province":"辽宁","provinceCode":"21","City":"鞍山市","cityCode":"2103"},{"Province":"辽宁","provinceCode":"21","City":"抚顺市","cityCode":"2104"},{"Province":"辽宁","provinceCode":"21","City":"本溪市","cityCode":"2105"},{"Province":"辽宁","provinceCode":"21","City":"丹东市","cityCode":"2106"},{"Province":"辽宁","provinceCode":"21","City":"锦州市","cityCode":"2107"},{"Province":"辽宁","provinceCode":"21","City":"营口市","cityCode":"2108"},{"Province":"辽宁","provinceCode":"21","City":"阜新市","cityCode":"2109"},{"Province":"辽宁","provinceCode":"21","City":"辽阳市","cityCode":"2110"},{"Province":"辽宁","provinceCode":"21","City":"盘锦市","cityCode":"2111"},{"Province":"辽宁","provinceCode":"21","City":"铁岭市","cityCode":"2112"},{"Province":"辽宁","provinceCode":"21","City":"朝阳市","cityCode":"2113"},{"Province":"辽宁","provinceCode":"21","City":"葫芦岛市","cityCode":"2114"},{"Province":"重庆","provinceCode":"50","City":"重庆省级","cityCode":"5000"},{"Province":"重庆","provinceCode":"50","City":"重庆市","cityCode":"5001"},{"Province":"陕西","provinceCode":"61","City":"陕西省级","cityCode":"6100"},{"Province":"陕西","provinceCode":"61","City":"西安市","cityCode":"6101"},{"Province":"陕西","provinceCode":"61","City":"铜川市","cityCode":"6102"},{"Province":"陕西","provinceCode":"61","City":"宝鸡市","cityCode":"6103"},{"Province":"陕西","provinceCode":"61","City":"咸阳市","cityCode":"6104"},{"Province":"陕西","provinceCode":"61","City":"渭南市","cityCode":"6105"},{"Province":"陕西","provinceCode":"61","City":"延安市","cityCode":"6106"},{"Province":"陕西","provinceCode":"61","City":"汉中市","cityCode":"6107"},{"Province":"陕西","provinceCode":"61","City":"榆林市","cityCode":"6108"},{"Province":"陕西","provinceCode":"61","City":"安康市","cityCode":"6109"},{"Province":"陕西","provinceCode":"61","City":"商洛市","cityCode":"6110"},{"Province":"青海","provinceCode":"63","City":"青海省级","cityCode":"6300"},{"Province":"青海","provinceCode":"63","City":"西宁市","cityCode":"6301"},{"Province":"青海","provinceCode":"63","City":"海东市","cityCode":"6302"},{"Province":"青海","provinceCode":"63","City":"海北藏族自治州","cityCode":"6322"},{"Province":"青海","provinceCode":"63","City":"黄南藏族自治州","cityCode":"6323"},{"Province":"青海","provinceCode":"63","City":"海南藏族自治州","cityCode":"6325"},{"Province":"青海","provinceCode":"63","City":"果洛藏族自治州","cityCode":"6326"},{"Province":"青海","provinceCode":"63","City":"玉树藏族自治州","cityCode":"6327"},{"Province":"青海","provinceCode":"63","City":"海西蒙古族藏族自治州","cityCode":"6328"},{"Province":"黑龙江","provinceCode":"23","City":"黑龙江省级","cityCode":"2300"},{"Province":"黑龙江","provinceCode":"23","City":"哈尔滨市","cityCode":"2301"},{"Province":"黑龙江","provinceCode":"23","City":"齐齐哈尔市","cityCode":"2302"},{"Province":"黑龙江","provinceCode":"23","City":"鸡西市","cityCode":"2303"},{"Province":"黑龙江","provinceCode":"23","City":"鹤岗市","cityCode":"2304"},{"Province":"黑龙江","provinceCode":"23","City":"双鸭山市","cityCode":"2305"},{"Province":"黑龙江","provinceCode":"23","City":"大庆市","cityCode":"2306"},{"Province":"黑龙江","provinceCode":"23","City":"伊春市","cityCode":"2307"},{"Province":"黑龙江","provinceCode":"23","City":"佳木斯市","cityCode":"2308"},{"Province":"黑龙江","provinceCode":"23","City":"七台河市","cityCode":"2309"},{"Province":"黑龙江","provinceCode":"23","City":"牡丹江市","cityCode":"2310"},{"Province":"黑龙江","provinceCode":"23","City":"黑河市","cityCode":"2311"},{"Province":"黑龙江","provinceCode":"23","City":"绥化市","cityCode":"2312"},{"Province":"黑龙江","provinceCode":"23","City":"大兴安岭地区","cityCode":"2327"}];

//初始页码
var pageIndex = 1;
//每页显示数量
var infoNum = [10,20,50,100];
//初始每页信息条数
var pageSize = infoNum[0];
//药物类别
var medCategory = ['竞价药品','议价药品','谈判药品'];
//招标模式
var biddingMode = ['招标','跟随','议价'];
//默认药品类别
var defaultMedCategory = medCategory[0];
//投标信息列表头部
var bidListHeader = ['开标年','开标月','延时实时周期','省','市','药物类别','上限价','上限价-中标价比例','中标价','模式','规则','操作'];

//数学符号
var MathML = ['>','<','>=','<='];

//规则参考值
var rulesValue = ['最低价','平均价','平均价(最低3省)','平均价(最低5省)','平均价(最低价、次低价)'];

//省市集合
var areaProvince = [];
for(var i=0;i<areaData.length;i++){
	areaProvince.push({'Province':areaData[i].Province,'provinceCode':areaData[i].provinceCode,'City':areaData[i].City,'cityCode':areaData[i].cityCode});
}

function deleteRepeat(arr) {
    for(var i=0;i<arr.length-1;i++){
        var old=arr[i]
        for(var j=i+1;j<arr.length;j++){
            if(old.Province==arr[j].Province && old.provinceCode==arr[j].provinceCode){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}
areaProvince=deleteRepeat(areaProvince);

//省汉字 变换为省code
function getProvinceCode(x){
	for(var i=0;i<areaProvince.length;i++){
		if(x==areaProvince[i].Province){
			return areaProvince[i].provinceCode;
		}
	}
}



//////////拼接url方法
function AUrl(obj,arg){
	var addUrl = '';
	for(var i=0;i<obj.length;i++){
		if(arg[i]){
			addUrl+='&'+obj[i]+'='+arg[i];
		}
	}
	return addUrl;
}




///////修改规则 省市选择
//获得省级对应市的集合
//[[{'山东省':'济南市'},{'山东省':'菏泽市'}],[]...]
function areaChange(){
	var AProvince=[];
	for(var j=0;j<areaProvince.length;j++){
		var ACity = [];
		for(var i=0;i<areaData.length;i++){
			if(areaProvince[j].provinceCode == areaData[i].provinceCode){
				ACity.push(areaData[i])
			}
		}
//		console.log(ACity)
		AProvince.push(ACity);
	}
	return AProvince;
}

//数组去重
Array.prototype.filter = function(){  
    for(var i=0, temp={}, result=[], ci; ci=this[i++];){  
        var ordid = ci.CityCode;  
        if(temp[ordid]){  
            continue;  
        }  
        temp[ordid] = true;  
        result.push(ci);  
    }  
    return result;  
};  

//错误信息
function errorInfo(x){
	var dbr = x
	var ErrArr = dbr.split(';');
	var htmlArr = '';
	for(var i=0;i<ErrArr.length;i++){
		htmlArr+='<div class="fl errL">'+ErrArr[i]+'</div>'
	}
	layer.open({
	  	type: 1,
	  	title:"错误信息",
	  	skin:"uploadErr",
		btn:["确定"],
	  	area: ['400px', 'auto'],
	  	content: '<div class="errList clearfix">'+htmlArr+'</div>'	,
		yes:function(index,obj){
			layer.close(index);
		}
	})
}








