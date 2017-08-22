//获取cookie
//function getCookie(name){
//	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
//	if(arr=document.cookie.match(reg)){
//		return unescape(arr[2]);
//	}else{
//		return null;
//	}
//}
var itemIndex = angular.module('BidPriceForecastSystem',['ngResource','ngCookies','ui.router']);
itemIndex.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise("/Client");
	$stateProvider
		.state('toLogin',{
			url: "",  
            templateUrl: "login.html", 
            controller:'loginCtrl'
		})
		.state('toClient',{
			url:'/Client',
			templateUrl:'index_client.html',
			controller:'clientCtrl'
		})
}])
.controller('allCtrl',['$scope','$state','$cookies','$cookieStore','$http',function($scope,$state,$cookies,$cookieStore,$http){
	//存在cookie 页面直接跳转
	if($cookies.get("loginAccount")){
		var loginAt = JSON.parse($cookies.get("loginAccount"));
		var saveSession = sessionStorage.getItem("loginInfo");
		if(!saveSession){
			console.log(loginAt)
//			if(loginAt.isManager==0){
				sessionStorage.setItem("loginInfo",JSON.stringify(loginAt));
	//			$state.go('toClient');	
				window.location.href="index.html#/Client"
//			}else{
//				layer.msg('账户信息不匹配,无法自动登录，请重新登录',{icon:7,shift:6});
//			}
		}
	}
}])
////////////itemIndex.value()类似$rootScope
itemIndex.controller('loginCtrl',['$scope','$http','$cookies','$cookieStore','$state','$location',function($scope,$http,$cookies,$cookieStore,$state,$location){
	
	
	$scope.userData = {};//保存登录信息
	$scope.loginErrInfo = false;//错误提示框显示状态
	$scope.userData.loginStatus = true;//默认登录状态
	//点击登录按钮
	$scope.submitLogin = function(){
		var Url = lUrl+'/tenderPriceForecast/sysUser/finduser';
		$http.post(Url,{"loginAccount":$scope.userData.name,'password':$scope.userData.pwd})
		.success(function(data,status,headers,config){
			var callBackCode = data.backHttpResult.code;
			$scope.errorInfo = data.backHttpResult.result;
			if(callBackCode==000){
//				if(data.bean[0].isManager==0){
					//记录登录账号
					sessionStorage.setItem("loginInfo",JSON.stringify(data.bean[0]));
					if($scope.userData.loginStatus){	
						var expireDate = new Date();
						expireDate.setDate(expireDate.getDate() + 14);
//						$cookieStore.put("loginAccount",data.bean[0],{'expires': expireDate.toUTCString()});//14天后过期
						$cookies.put("loginAccount",JSON.stringify(data.bean[0]),{'expires': expireDate.toUTCString()})
					}else{
						$cookies.remove("loginAccount");
					}
					$state.go('toClient');
//				}else{
//					layer.msg('账户信息不匹配，请重新输入',{icon:7,shift:6});
//				}
			}else{
				$scope.loginErrInfo = true;
			}
		}).error(function(){
			layer.msg('访问失败，请刷新后重新登录',{icon:7,shift:6});
		})
	}
	//点击输入框隐藏错误信息
	$scope.inputInfo = function(){
		$scope.loginErrInfo = false;
	}
	
}])

/////////////////////////////client//////////////////////////////////////
//头部
itemIndex.directive('appHeader',function(){
	return	{
		restrict: 'A',
		templateUrl:'page/appHeader.html'
	}
})
//左侧树形菜单
.directive('homeMenu',function(){
	return {
		restrict: 'A',
        templateUrl: 'page/homeMenu.html'
	}
})
//二级菜单
.directive('secondaryMenu',function(){
	return {
		restrict: 'A',
        templateUrl: 'page/secondaryMenu.html'
	}
})
//主页面(药品列表)
.directive('homePage',function(){
	return {
		restrict: 'A',
        templateUrl: 'page/homePage.html'
	}
})
//详细页面(药品详情)
.directive('detailsPage',function(){
	return {
		restrict: 'A',
        templateUrl: 'page/detailsPage.html'
	}
})






//日期插件
.directive('wdatePicker',function(){  
    return{  
        restrict:"A",  
        link:function(scope,element,attr){   
				
            element.bind('click', function () {
                WdatePicker({
                    oncleared: function(){element.change()} ,
                    onpicked: function(){element.change()},
                    dateFmt: (attr.datefmt || 'yyyy')
                })
            });
        }  
    }  
})
.controller('clientCtrl',['$scope','$document','$compile','$state','$http','$cookies','$location',function($scope,$document,$compile,$state,$http,$cookies,$location){
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
	
	
	
	
	//保存sessiton
//	console.log(sessionStorage.getItem('loginInfo'))
	var st = sessionStorage.getItem("loginInfo");
	$scope.menuList = [];
	$scope.medList = [];
	//页面加载时 渲染
	window.onhashchange = function(){
		location.reload();
	}
	
	if(st){
		sessitionInfo = JSON.parse(st);
		$http.get(lUrl+'/tenderPriceForecast/department/findList?userId='+sessitionInfo.userId)
		.success(function(data){
			if(data.rows.length>0){
				
				$scope.loginName = sessitionInfo.userName;//在个人中心保存登录名
			
				var currentUrl = $location.url();
				var urlObj = $location.search();//url hash
				//页面为历史数据页 显示当前历史页面
				if(currentUrl.indexOf('#his')>=0){
					//当前medId
					var currentMedId = parseInt(urlObj.med);
					$scope.showStatusList=false;
					$scope.showStatusHis=true;
					$scope.showPage = false;
					//当前depId
					var currentDepId = parseInt(urlObj.dep);
					for(var j=0;j<data.rows.length;j++){
						if(currentDepId==data.rows[j].depId){
							$scope.CDepName = data.rows[j].depName;
						}
					}
					$http.get(lUrl+'/tenderPriceForecast/medicinal/groupFindList?userId='+sessitionInfo.userId+'&depId='+currentDepId)
					.success(function(res){
						$scope.medList = res.rows;
						//保存当前med下标
						var currentMedIndex = 0;
						for(var i=0;i<$scope.medList.length;i++){
							if(currentMedId==$scope.medList[i].medicineId){
								currentMedIndex=i;
							}
						}
						
						//默认页码
//						$scope.pageIndex = pageIndex;
//						$scope.pageSize = pageSize;
						$scope.medActive = currentMedIndex;
//						$http.get(lUrl+'/tenderPriceForecast/historyCal/findList?userId='+sessitionInfo.userId+'&medicineId='+$scope.medList[currentMedIndex].medicineId+'&pageIndex='+$scope.pageIndex+'&pageSize='+$scope.pageSize)
//						.success(function(data){
//							$scope.hisData = data.rows;
////							$scope.viewHistory($scope.medList[currentMedIndex]);
//							$scope.showStatusHis=true;
//							$scope.showStatusList=false;
							$scope.hisSearch();
//						}).error(function(){
//							layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
//						})
					}).error(function(){
						layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
					})
				}else{
					$scope.menuList = data.rows;//渲染页面--加载数据
					//如果有med--当前dep当前med详情页
					if(!$.isEmptyObject(urlObj)){
						if(urlObj.med){
							$scope.showPage = false;
							$scope.menuList = data.rows;
							
							//当前medId
							var currentMedId = parseInt(urlObj.med);
							//当前depId
							var currentDepId = parseInt(urlObj.dep);
							for(var j=0;j<data.rows.length;j++){
								if(currentDepId==data.rows[j].depId){
									$scope.CDepName = data.rows[j].depName;
								}
							}
							$http.get(lUrl+'/tenderPriceForecast/medicinal/groupFindList?userId='+sessitionInfo.userId+'&depId='+currentDepId)
							.success(function(res){
								$scope.medList = res.rows;
								//保存当前med下标
								var currentMedIndex = 0;
								for(var i=0;i<$scope.medList.length;i++){
									if(currentMedId==$scope.medList[i].medicineId){
										currentMedIndex=i;
									}
								}
								$scope.showDetails($scope.medList[currentMedIndex],currentMedIndex);
							}).error(function(){
								layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
							})
						}else{
							$scope.menuList = data.rows;//渲染页面--加载数据
							//如果有dep--当前dep部门列表页药品列表页
							var currentDepId = parseInt(urlObj.dep);
							if(currentDepId){
								for(var i=0;i<$scope.menuList.length;i++){
									if(urlObj.dep==$scope.menuList[i].depId){
										var currentDepObj = $scope.menuList[i];//obj
										var currentDepIndex = i;//id
									}
								}
								$scope.homeMenuClick(currentDepObj,currentDepIndex);
							}
						}
					}else{
						$scope.menuList = data.rows;//渲染页面--加载数据
						
						//首页--默认dep //页面初始显示第一个部门
						$scope.homeMenuClick($scope.menuList[0],0);
					}
				}
			}else{
				$scope.menuList = [];
				layer.confirm('您是新用户,暂无部门信息,是否创建新部门？', {
				  	btn: ['是','否']
				}, function(index){
				  	$scope.createFile();
				  	layer.close(index);
				});
			}
		})
		.error(function(data){
			layer.msg('网络连接失败，请检查网络状况再次连接',{icon:7});
		})
	}else{
		//如果没有sessiton 跳转到登录页
		$state.go('toLogin');
		window.location.hash='';
	}
	
	//页面首页
	$scope.toIndex = function(){
		$location.search()
		$http.get(lUrl+'/tenderPriceForecast/department/findList?userId='+sessitionInfo.userId)
		.success(function(data){
			$scope.showPage = true;
			if(data.rows.length>0){
				$scope.homeMenuClick(data.rows[0],0);
			}else{
				$scope.menuList = [];
				layer.confirm('您是新用户,暂无部门信息,是否创建新部门？', {
				  	btn: ['是','否']
				}, function(index){
				  	$scope.createFile();
				  	layer.close(index);
				});
			}
		}).error(function(){
			layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
		})
	}
	
	//菜单
	$(".content").css('min-height',$(window).height()-64+'px');
//	$scope.menuList = [
//		{'depId':'111','depName':'肿瘤事业部'},
//		{'depId':'112','depName':'骨科事业部'}
//	];
//	$scope.medList=[
//		{'medicinalId':'121','medicinalName':'药品1','time':'2017/11/25'},{'id':'122','name':'药品2','time':'2017/11/28'},
//		{'medicinalId':'221','medicinalName':'药品A','time':'2017/11/25'},{'id':'222','name':'药品B','time':'2017/11/25'},{'id':'223','name':'药品C','time':'2017/11/25'}
//	]
	
	
//	$scope.hisPageIndex = pageIndex;
	//每页显示数量
	$scope.infoNum = infoNum;
	//初始每页信息条数
//	$scope.hisPageSize = pageSize;
	//初始页码
	$scope.page={	'pageIndex':pageIndex,
					'pageSize':pageSize,
					'totalPage':1,
					'master':false,
					'province':'',
					'city':'',
					'tenderStartTime':'',
					'tenderEndTime':'',
					'medType':'',
					'mode':'',
					'calendarMonth':'',
					'pageNum':'',
					'isTenderAll':isTenderMonth,
					'isTenderMonth':isTenderMonth[0],
					'tenderArr':[]
			};
	
	//echarts图标 区域信息
	$scope.area = {
		totalObj:{}
	}
	
	//投标信息列表头部
	$scope.bidListHeader = bidListHeader;
	//月份
	$scope.Month = [1,2,3,4,5,6,7,8,9,10,11,12];
	//月份
	$scope.monthData = monthData;
	//省集合
	$scope.AreaProvince = areaProvince;
	
	//保存列表内选中的药品id集合
	var selMedIds = [];	
	//当前年月
	var nowDate = new Date();
	var nowYear = nowDate.getFullYear();
	var nowMonth = nowDate.getMonth()+1;
	
	//表格数据
//	$scope.defaultName = '议价药品';
	
	//新分析数据//历史数据
//	$scope.hisData = [
//		{"medicineId":1,"Id":1,"tenderYear":2016,"tenderMonth":3,"implementationMonth":3,"province":"河北省","city":"唐山市","medicineType":"","upPrice":13.05,"upTenderPrice":"95%","mode":"招标",'flag':0,'hasTender':1},
//		{"medicineId":1,"Id":2,"tenderYear":2016,"tenderMonth":3,"implementationMonth":3,"province":"河北省","city":"唐山市","medicineType":"","upPrice":13.05,"upTenderPrice":"95%","mode":"招标",'flag':0,'hasTender':1},
//		{"medicineId":1,"Id":3,"tenderYear":2016,"tenderMonth":3,"implementationMonth":3,"province":"河北省","city":"唐山市","medicineType":"","upPrice":13.05,"upTenderPrice":"95%","mode":"招标",'flag':0,'hasTender':0},
//		{"medicineId":1,"Id":4,"tenderYear":2016,"tenderMonth":3,"implementationMonth":3,"province":"河北省","city":"唐山市","medicineType":"","upPrice":13.05,"upTenderPrice":"95%","mode":"招标",'flag':0,'hasTender':0},
//		{"medicineId":1,"Id":5,"tenderYear":2016,"tenderMonth":3,"implementationMonth":3,"province":"河北省","city":"唐山市","medicineType":"","upPrice":13.05,"upTenderPrice":"95%","mode":"招标",'flag':1,'hasTender':0},
//		{"medicineId":1,"Id":6,"tenderYear":2016,"tenderMonth":3,"implementationMonth":3,"province":"河北省","city":"唐山市","medicineType":"","upPrice":13.05,"upTenderPrice":"95%","mode":"招标",'flag':1,'hasTender':0},
//		{"medicineId":1,"Id":7,"tenderYear":2016,"tenderMonth":3,"implementationMonth":3,"province":"河北省","city":"唐山市","medicineType":"","upPrice":13.05,"upTenderPrice":"95%","mode":"招标",'flag':0,'hasTender':0},
//		{"medicineId":1,"Id":8,"tenderYear":2016,"tenderMonth":3,"implementationMonth":3,"province":"河北省","city":"唐山市","medicineType":"","upPrice":13.05,"upTenderPrice":"95%","mode":"招标",'flag':0,'hasTender':0},
//		{"medicineId":1,"Id":9,"tenderYear":2016,"tenderMonth":3,"implementationMonth":3,"province":"河北省","city":"唐山市","medicineType":"","upPrice":13.05,"upTenderPrice":"95%","mode":"招标",'flag':0,'hasTender':0},
//		{"medicineId":1,"Id":10,"tenderYear":2016,"tenderMonth":3,"implementationMonth":3,"province":"河北省","city":"唐山市","medicineType":"","upPrice":13.05,"upTenderPrice":"95%","mode":"招标",'flag':0,'hasTender':0}
//	]

////////////////////////////////////////////////////////////////////////////////////////////////
	//页面加载状态
	$scope.showPage = true;
	
	//当前url
	$scope.now = {
		nurl : $location.search().dep
	}
	console.log($scope.now.nurl)
	
	//选中省份后 市区联动
	$scope.cityKinkage = function(x){
		$scope.AreaCityObj=[];
		$scope.AreaCity = [];
		if(x){
			for(var i=0;i<areaData.length;i++){
				if(x.provinceCode == areaData[i].provinceCode){
					$scope.AreaCityObj.push(areaData[i])
				}
			}
			//去重
			Array.prototype.filter = function(){  
		        for(var i=0, temp={}, result=[], ci; ci=this[i++];){  
		            var ordid = ci.cityCode;  
		            if(temp[ordid]){  
		                continue;  
		            }  
		            temp[ordid] = true;  
		            result.push(ci);  
		        }  
		        return result;  
		    };  
			$scope.AreaCity = $scope.AreaCityObj.filter(); 
		}
	}
	//获取药物类别
	$scope.getType = function(){
		$http.get(lUrl+'/tenderPriceForecast/rule/findmtList?userId='+sessitionInfo.userId)
		.success(function(data){
			$scope.medCategory = data.rows;
		}).error(function(){
			layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
		})
	}
	//获取模式
	$scope.getModel = function(){
		$http.get(lUrl+'/tenderPriceForecast/rule/findModeList?userId='+sessitionInfo.userId)
		.success(function(data){
			$scope.biddingMode = data.rows;
		}).error(function(){
			layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
		})
	}
	if(sessitionInfo){
		$scope.getType();
		$scope.getModel();
	}
	//文件夹(部门)选中
	$scope.homeMenuClick = function(obj,i){
		var whref = window.location.href;
		$scope.thisPageDepId = obj.depId;
		
		//保存当前选中li的id到url
		window.location.hash ='#/Client?dep=' + obj.depId;
		$scope.showPage = true;//显示药品列表
		$scope.selectedItem = i;//选中index
		$scope.CDepName = $scope.menuList[i].depName;
		$http.get(lUrl+'/tenderPriceForecast/medicinal/groupFindList?userId='+sessitionInfo.userId+'&depId='+obj.depId)
		.success(function(res){
			var DepId = obj.depId;
			$scope.medList = res.rows;
			if(res.rows.length<=0){
				layer.confirm('无药品信息,是否创建新药品', {
				  	btn: ['是','否']
				}, function(index){
				  	$scope.addAnalyzing(DepId);
				  	layer.close(index);
				})
			}
		}).error(function(){
			layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
		})
	}
	var saveIndex = 0;//保存返回前一级菜单index
	
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
		  	content: '<div class="errList clearfix">'+htmlArr+'</div>',
			yes:function(index,obj){
				layer.close(index);
			}
		})
	}
	
	
	//点击药品列表展示详细数据 //数据查询
	$scope.showDetails = function(obj,medIndex){
		console.log(obj)
		$scope.hisData = [];
		$scope.showMap = false;//地图为隐藏
		//初始页码
		$scope.page={'pageIndex':pageIndex,
					'pageSize':pageSize,
					'totalPage':1,
					'master':false,
					'province':'',
					'city':'',
					'tenderStartTime':'',
					'tenderEndTime':'',
					'medType':'',
					'mode':'',
					'calendarMonth':'',
					'pageNum':'',
					'selected':'',
					'isTenderAll':isTenderMonth,
					'isTenderMonth':isTenderMonth[0],
					'tenderArr':[]
				};
		$scope.showStatusList=true;
		$scope.showStatusHis=false;
		$scope.currentMed = obj;
		$scope.showPage = false;
		$scope.medActive = medIndex;
		$location.search('med',obj.medicineId);
		$location.hash('');
		$http.get(lUrl+'/tenderPriceForecast/historyCal/findList?userId='+sessitionInfo.userId+'&medicineId='+obj.medicineId+'&pageIndex='+$scope.page.pageIndex+'&pageSize='+$scope.page.pageSize+'&isTenderMonth='+$scope.page.isTenderMonth.code)
		.success(function(data){
			if(data.isEdit==1){
				$('.changeDataHint').show();
			}else{
				$('.changeDataHint').hide();
			}
			$scope.page.pageNum = data.bean.total;
			$scope.hisData = data.bean.rows;
			
			if($scope.hisData.length>0){
//				for(var i=0;i<$scope.hisData.length;i++){
//					if($scope.hisData[i].flag){
//						angular.element('#bidList tbody tr').eq(i).find('.edit').prop('disabled','disabled');
//					}
//					
//				}
			}else{
				layer.msg('无记录，请上传历史数据或规则', {time: 2000, icon:7,shift:6});
			}
			$scope.page.totalPage = Math.ceil(data.bean.total/$scope.page.pageSize);
			if(data.error){
				errorInfo(data.error);
			}
			if(data.backHttpResult.result!='success'){
				layer.msg(data.backHttpResult.result,{icon:7,shift:6});
			}
				
		})
		.error(function(){
			layer.msg('服务器连接失败，请刷新后重试',{icon:7});
		})
	}
	//数据查询
	$scope.searchMedData = function(x,y){
		if(x){
			$scope.page.pageIndex = x;
		}
		if(y){
			$scope.page.pageSize = y;
		}
		selMedIds = [];
		$scope.page.tenderArr = [];
		$('#allSel').prop('checked','');
		var currentUrl = $location.search();
		var UrlKeys = ['startTenderTime','endTenderTime','provinceCode','cityCode','medicineTypeCode','modeCode','pageIndex','pageSize','calendarMonth','isTenderMonth'];
		if(!$scope.page.province){
			$scope.page.province=[{'provinceCode':''}];
		}
		if(!$scope.page.city){
			$scope.page.city=[{'cityCode':''}];
		}
		if(!$scope.page.medType){
			$scope.page.medType=[{'id':''}];
		}
		if(!$scope.page.mode){
			$scope.page.mode=[{'id':''}];
		}
		
		var UrlVals = [$scope.page.tenderStartTime,$scope.page.tenderEndTime,$scope.page.province.provinceCode,$scope.page.city.cityCode,$scope.page.medType.id,$scope.page.mode.id,$scope.page.pageIndex,$scope.page.pageSize,$scope.page.calendarMonth,$scope.page.isTenderMonth.code];
		var addUrl = AUrl(UrlKeys,UrlVals);
		$http.get(lUrl+'/tenderPriceForecast/historyCal/findList?userId='+sessitionInfo.userId+
											'&medicineId='+currentUrl.med+addUrl)
		.success(function(data){
			$scope.hisData = data.bean.rows;
			$scope.page.totalPage = Math.ceil(data.bean.total/$scope.page.pageSize);
			if(data.isEdit==1){
				$('.changeDataHint').show();
			}else{
				$('.changeDataHint').hide();
			}
			if(data.bean.rows.length>0){
				$scope.page.pageNum = data.bean.total;
//				($scope.page.pageSize>10&&data.rows.length>10)?$scope.page.SHList = true:$scope.page.SHList=false;
			}else{
				layer.msg('无记录，请上传历史数据或规则', {time: 1500, icon:7,shift:6});
			}
			if(data.error){
				errorInfo(data.error);
			}
			if(data.backHttpResult.result!='success'){
				layer.msg(data.backHttpResult.result,{icon:7,shift:6});
			}
				
			
		})
		.error(function(){
			layer.msg('服务器连接失败，请刷新后重试',{icon:7});
		})
	}
	//历史数据查询
	$scope.hisSearch = function(x,y){
		if(x){
			$scope.page.pageIndex = x;
		}
		if(y){
			$scope.page.pageSize = y;
		}
		if(!$scope.page.province){
			$scope.page.province=[{'provinceCode':''}];
		}
		if(!$scope.page.city){
			$scope.page.city=[{'cityCode':''}];
		}
		$scope.hisData = [];
		var currentUrl = $location.search();
		var UrlKeys = ['startTenderDate','endTenderDate','provinceCode','cityCode','pageIndex','pageSize']
		var UrlVals = [$scope.page.tenderStartTime,$scope.page.tenderEndTime,$scope.page.province.provinceCode,$scope.page.city.cityCode,$scope.page.pageIndex,$scope.page.pageSize];
		var addUrl = AUrl(UrlKeys,UrlVals);
		$http.get(lUrl+'/tenderPriceForecast/history/findList?userId='+sessitionInfo.userId+
												'&medicineId='+currentUrl.med+addUrl)
		.success(function(data){
			if(data.rows.length>0){
				$scope.hisData = data.rows;
				$scope.page.pageNum = data.total;//数据总条数
				$scope.page.totalPage = Math.ceil(data.total/$scope.page.pageSize);
			}else{
				layer.msg('该项历史数据为空，请重新上传', {time: 2000, icon:7,shift:6});
			}
		})
		.error(function(){
			layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
		})
	}
	
	//点击查看历史数据
	$scope.viewHistory = function(obj){
//		$scope.hisData = '';
		//初始页码
		$scope.page={'pageIndex':pageIndex,
					'pageSize':pageSize,
					'totalPage':1,
					'master':false,
					'province':'',
					'city':'',
					'tenderStartTime':'',
					'tenderEndTime':'',
					'medType':'',
					'mode':'',
					'calendarMonth':'',
					'pageNum':'',
					'selected':'',
					'isTenderMonth':''
				};
		$location.hash('his');
//		$scope.showStatusHis=true;
//		$scope.showStatusList=false;
//		$scope.hisSearch();
	}
	//历史数据返回
	$scope.hisDataBack = function(){
//		var hisMed = $location.search().med;
//		for(var i=0;i<$scope.medList.length;i++){
//			if(hisMed == $scope.medList[i].medicineId){
//				$scope.showDetails($scope.medList[i],$.inArray(hisMed,$scope.medList));
//				$scope.medActive = i;
//			}
//		}

		$location.url($location.url().replace('#his',''))  ;

	}
	
	
	
	
	
	
	//信息条数select
	$scope.changeNum = function(){
		$scope.page.master = false;
		$scope.page.pageIndex = 1;
//		$scope.page.totalPage = Math.ceil($scope.page.pageNum/$scope.page.pageSize);
//		console.log($scope.page.pageNum)
		if($location.url().indexOf('his')>=0){
			$scope.hisSearch();
		}else{
			$scope.searchMedData();
		}
	}
	
	
	//上一页
	$scope.prevPage = function(){
		if($scope.page.pageIndex>1){
			$scope.page.master = false;
			$scope.page.pageIndex--;
			if($location.url().indexOf('his')>=0){
				$scope.hisSearch();
			}else{
				$scope.searchMedData();
			}
		}else{
			layer.msg('已经是第一页啦!',{icon:0,time:600});
		}
	}
	//下一页
	$scope.nextPage = function(){
		if($scope.page.pageIndex<$scope.page.totalPage){
			$scope.page.master = false;
			$scope.page.pageIndex++;
			if($location.url().indexOf('his')>=0){
				$scope.hisSearch();
			}else{
				$scope.searchMedData();
			}
		}else{
			layer.msg('已经是最后一页啦!',{icon:0,time:600});
		}
	}
	//跳转页面
	$scope.skipPage = function(){
		if($scope.page.pageIndex>$scope.page.totalPage||$scope.page.pageIndex<1){
			layer.tips('页数超出范围，请重新输入', '#PI,#hisPI', {
			  	tips: 1,
			  	time: 2000,
			  	area:['150px','60px']
			});
			$scope.page.pageIndex = 1;
			return false;
		}else{
			$scope.page.master = false;
		}
		if($location.url().indexOf('his')>=0){
			$scope.hisSearch();
		}else{
			$scope.searchMedData();
		}
	}
	
	
	
	
	
	//返回
//	$scope.back = function(){
//		$scope.showPage = true;//显示药品列表
//		$location.search('med',null); 
//		$http.get(lUrl+'/tenderPriceForecast/department/findList?userId='+sessitionInfo.userId)
//		.success(function(data){
//			$scope.menuList=data.rows;
//			var currentUrl = $location.search();
//			for(var i=0;i<$scope.menuList.length;i++){
//				if(currentUrl.dep==$scope.menuList[i].depId){
//					var currentDepObj = $scope.menuList[i];//obj
//					var currentDepIndex = i;//id
//				}
//			}
//			$scope.homeMenuClick(currentDepObj,currentDepIndex);
//		})
//		.error(function(){
//			layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
//		})
//	}
	//鼠标移入菜单
	$scope.itemMouseOver = function(obj){
		$scope.itemHover = obj;
	}
	$scope.itemMouseOut = function(obj){
		$scope.itemHover = -1;
	}
	


	//修改密码
	$scope.changepwd = function(){
		var changePwd = $compile(
			'<div class="pwd" id="changePwd">'+
			'<form name="cpwd">'+
			'	<div class="pwdLine relative"><label for="oldpwd">旧密码</label><input type="password" id="oldpwd" class="oldpwd" name="opwd" ng-model="oldPwd" ng-blur="oldPwdCheck($event)"/><i class="layui-icon OPwdErr" style="font-size: 18px; color: #cd3714;">&#x1007</i><i class="layui-icon OPwdRight" style="font-size: 18px; color: #cd3714;" >&#xe616</i></div>'+
			'	<div class="pwdLine relative"><label for="newpwd">新密码</label><input type="password" id="newpwd" class="newpwd" ng-model="newPwd" required/></div>'+
			'	<div class="pwdPromp">密码由6-12位数字字母下划线组成</div>'+
			'	<div class="pwdLine relative"><label for="newpwdSecond">重复新密码</label><input type="password" id="newpwdSecond" class="newpwdSecond" name="opwda" ng-model="newPwdAgain" required/></div>'+
			'	<div class="newPwdPromp" ng-show="newPwd!=newPwdAgain">两次密码输入不一致</div>'+
			'</form>'+
			'</div>')($scope);
			changePwd.appendTo('body');
		layer.open({
		  	type: 1,
		  	title:"修改密码",
			btn:["确定","取消"],
		  	area: ['340px', '250px'],
		  	content: changePwd,
			yes:function(index){
//				var regExp=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/;
				var regExp=/^[\w]{6,12}$/;
				var OPwd = sessitionInfo.password;
				if($scope.oldPwd!=OPwd){
					layer.msg('旧密码错误，请重新输入', {time: 1000, icon:7,offset:'100px',shift:6});
					return false;	
				}else if(!$scope.newPwd||!$scope.oldPwd){
					layer.msg('密码不能为空', {time: 1000, icon:7,offset:'100px',shift:6});
					return false;
				}else if(!regExp.test($scope.newPwd)){
					layer.msg('密码格式有误', {time: 1000, icon:7,offset:'100px',shift:6});
					return false;
				}else{
					$http.post(lUrl+'/tenderPriceForecast/sysUser/update',{'userId':sessitionInfo.userId,'oldpwd':sessitionInfo.password,'password':$scope.newPwd})
					.success(function(data){
						
						$state.go('toLogin');
						$cookies.remove("loginAccount");
						sessionStorage.removeItem('loginInfo');
						layer.close(index);
						if(data.backHttpResult.result!='success'){
							layer.msg(data.backHttpResult.result,{icon:7,shift:6});
						}
					})
					.error(function(){
						layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
					})
				}
			},
			end:function(){
				$('#changePwd').remove();
			}
		});
	}
	//修改密码--旧密码检查
	$scope.oldPwdCheck = function(e){
		var OPwd = sessitionInfo.password;
		$('.OPwdErr,.OPwdRight').hide();
		if($(e.target).val()==OPwd){
			$('.OPwdRight').show();
		}else{
			$('.OPwdErr').show();
		}
	}
	
	
	//用户退出
	$scope.Logout = function(){
		layer.confirm('确定退出用户登录吗？', {
		  	btn: ['确定','取消'] 
		}, function(index,layero){
		  	$http.get(lUrl+'/tenderPriceForecast/sysUser/loginOut',{'userId':sessitionInfo.userId})
			.success(function(data){
				
				layer.closeAll();
				window.location.hash='';
				$state.go('toLogin');
				$cookies.remove("loginAccount");
				sessionStorage.removeItem('loginInfo');
				if(data.backHttpResult.result!='success'){
					layer.msg(data.backHttpResult.result,{icon:7,shift:6});
				}
			})
			.error(function(){
				layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
			})
		});
	}
	



	//创建新文件夹(创建部门)
	$scope.createFile = function(){
		//弹框
		layer.open({
		  	type: 1,
		  	title:"新建文件夹",
	//	  	skin: 'layui-layer-rim', //加上边框
			btn:["确定","取消"],
		  	area: ['320px', '180px'], //宽高
		  	content: 	'<div class="newFile">'+
		  				'<form>'+
						'	<label for="fileName">文件夹名称</label>'+
						'	<input id="fileName" type="text" class="fileName" ng-model="FileName" autofocus="autofocus" autoComplete="off"/>'+
						'</form>'+
						'</div>',
			yes:function(index,layero){
				var fileName = $("#fileName").val().trim();
				if(!fileName){
					layer.msg('文件夹名称不能为空', {time: 1000, icon:7,offset:'100px',shift:6},function(){
						$("#fileName").focus();
						return false;
					});
				}else{
					$http.post(lUrl+'/tenderPriceForecast/department/create',{'userId':sessitionInfo.userId,'depName':fileName})
					.success(function(data){
						var DepId = data.bean.depId;
						$scope.menuList.push(data.bean);
						if($scope.menuList.length==1){
							$scope.CDepName = data.bean.depName;
							$scope.selectedItem = 0;
						}
						
						layer.close(index);
						layer.confirm('部门创建成功,是否立即创建新药品?', {
						  	btn: ['是','否']
						}, function(index){
						  	layer.close(index);
						  	$scope.addAnalyzing(DepId);
						});
						if(data.backHttpResult.result!='success'){
							layer.msg(data.backHttpResult.result,{time: 1000, icon:7,offset:'100px',shift:6});
						}
					})
					.error(function(){
						layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
					})
				}
			}
		});
	}

	//文件夹重命名
	$scope.editItem = function(event,obj){
		event.stopPropagation();
		layer.open({
		  	type: 1,
		  	title:"修改名称",
		  	skin:'EditName',
			btn:["确定","取消"],
		  	area: ['320px', '180px'], //宽高
		  	content: 	'<div class="editNameBox">'+
		  				'	<form>'+
						'		<label>名称 </label>'+
						'		<input type="text" id="editFileName" class="editNameInput" value="'+obj.depName+'"/>'+	
						'	</form>'+
						'</div>',
			yes:function(index){
				var newFileName = $("#editFileName").val();
				//如果名字相同 不发送请求

				if(newFileName!=obj.depName){
					$http.post(lUrl+'/tenderPriceForecast/department/rename',{'userId':sessitionInfo.userId,'depId':obj.depId,'depName':newFileName})
					.success(function(data){
						//当标题页为当前修改的dep时 一起修改
						if(obj.depName == $scope.CDepName){
							$scope.CDepName = newFileName;	
						}
						obj.depName = newFileName;
						layer.close(index);
						if(data.backHttpResult.result!='success'){
							layer.msg(data.backHttpResult.result,{ icon:7,shift:6});
						}
						
					})
					.error(function(){
						layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
					})
				}
			}
		});
	}
	
	//修改/移动药品
	$scope.editOrMoveMed = function(event,obj,medIndex){
		//当前depId
		var currentDepId = $location.search().dep;
		for(var i=0;i<$scope.menuList.length;i++){
			if(currentDepId==$scope.menuList[i].depId){
				//当前药品所在部门
				var medInDep = $scope.moveTo = $scope.menuList[i];
			}
		}
		var EOMM = $compile('<div class="editNameBox">'+
			  				'	<form>'+
			  				'		<div>'+
							'			<label>名称 </label>'+
							'			<input type="text" id="editFileName2" class="editNameInput" value="'+obj.medicineName+'"/>'+	
							'		</div>'+
							'		<div>'+
							'			<label>移动到 </label>'+	
							'			<select class="moveMed" ng-options="item.depName for item in menuList" ng-model="moveTo" >'+
							'			</select>'+
							'		</div>'+
							'	</form>'+
							'</div>')($scope);
		EOMM.appendTo('body');
		event.stopPropagation();
		layer.open({
		  	type: 1,
		  	title:"修改/移动",
		  	skin:'EditName',
			btn:["确定","取消"],
		  	area: ['320px', '200px'], //宽高
		  	content:EOMM,
			yes:function(index){
//				obj.medicineName = $("#editFileName2").val();
				//////删除
				//sel选择的数组index
				var selIndex = $.inArray($scope.moveTo,$scope.menuList);
				if(($("#editFileName2").val()==obj.medicineName)&&($scope.moveTo.depId==medInDep.depId)){
					//未改变 不发送请求
				}else{
					obj.medicineName = $("#editFileName2").val();
					$http.post(lUrl+'/tenderPriceForecast/medicinal/move',{'userId':sessitionInfo.userId,'medicineId':obj.medicineId,'depId':$scope.moveTo.depId,'medicineName':obj.medicineName})
					.success(function(data){
						
						if($scope.moveTo.depId!=medInDep.depId){
							$location.search('dep',$scope.moveTo.depId)
							$scope.medActive = medIndex;
							$http.get(lUrl+'/tenderPriceForecast/medicinal/groupFindList?userId='+sessitionInfo.userId+'&depId='+$scope.moveTo.depId)
							.success(function(data){
								$scope.CDepName = $scope.moveTo.depName;
								$scope.medList=data.rows;
							})
							
						}
						if(data.backHttpResult.result!='success'){
							layer.msg(data.backHttpResult.result,{ icon:7,shift:6});
						}
					})
					.error(function(){
						layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
					})
				}
				layer.close(index);
			},
			end:function(){
				$(".editNameBox").remove();
			}
		});
	}
	
	
	
	
	
	//删除药品分析
	$scope.removeMed = function(obj,medIndex,list,e){
		e.stopPropagation();
		layer.open({
		  	type: 1,
		  	title:"删除提示",
	//	  	skin: 'layui-layer-rim', //加上边框
			btn:["确定","取消"],
		  	area: ['320px', '180px'], //宽高
		  	content: 	'<div class="newFile">'+
		  				'<form>'+
						'	<label>确认删除该药品分析吗</label>'+
						'</form>'+
						'</div>',
			yes:function(index){
				$http.post(lUrl+'/tenderPriceForecast/medicinal/del',{'userId':sessitionInfo.userId,'medicineId':obj.medicineId})
				.success(function(data){
					
					list.splice(medIndex,1);
//						$scope.$apply();
					layer.close(index);
					//刷新页面为默认选中第一个
					$scope.showDetails($scope.medList[0],0);
					if(data.backHttpResult.result!='success'){
						layer.msg(data.backHttpResult.result,{time: 1000, icon:7,offset:'100px',shift:6});
					}
				})
				.error(function(){
					layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
				})
			}
		});
	}
	//批量设置药物类别						
	$scope.drugCategory = function(){
		//////////检索出相同类别
		var commonType = [];
		for(var i=0;i<selMedIds.length;i++){
			commonType.push($scope.hisData[i].medicineTypeList);
		}
		function fun(arrs){
	       	var arr = arrs.shift();
	       	for(var i=arrs.length;i--;){
	          	var p = {"boolean":{}, "number":{}, "string":{}}, obj = [];
	           	arr = arr.concat(arrs[i]).filter(function (x) {
	               	var t = typeof x;
	               	x = JSON.stringify(x);
	               	return !((t in p) ? !p[t][x] && (p[t][x] = 1) : obj.indexOf(x) < 0 && obj.push(x));
	           	});
	           	if(!arr.length) return null;//发现不符合马上退出
	       	}
	       	return arr;
	   	}
	    $scope.medCategory = fun(commonType);//获取的公共药物类别数组
//		console.log($scope.medCategory)
		var setCategory = $compile(
			'<div class="newFile" id="setCategory">'+
			'<form>'+
			'	<div><label class="selCty">选择药物类别</label></div>'+
			'	<div>'+
			'		<select ng-model="listMedC" ng-options="cy.name for cy in medCategory">'+
			'			<option value="">--请选择--</option>'+	
			'		</select>'+
			'	</div>'+
			'</form>'+
			'</div>')($scope);
		setCategory.appendTo('body');
		layer.open({
		  	type: 1,
		  	title:"设置药物类别",
	//	  	skin: 'layui-layer-rim', //加上边框
			btn:["确定","取消"],
		  	area: ['320px', '220px'], //宽高
		  	content: setCategory,
			yes:function(index){
				if(selMedIds.length>0){
					if($scope.listMedC){
					
						var UrlC = {'userId':sessitionInfo.userId,'ids':selMedIds,'medicineTypeCode':$scope.listMedC.id};
						$http.post(lUrl+'/tenderPriceForecast/historyCal/setBatchType',UrlC)
						.success(function(data){
							
//							//刷新页面
							$scope.searchMedData();
							layer.close(index);
							if(data.backHttpResult.result!='success'){
								layer.msg(data.backHttpResult.result, {time: 1500, icon:7,offset:'100px',shift:6});
							}
							$scope.page.master = false;
						})
						.error(function(){
							layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
						})
					}else{
						layer.msg('请选择批量修改的药物类别', {time: 1500, icon:7,offset:'100px',shift:6});
					}
				}else{
					layer.msg('请选择批量修改药物类别的选项', {time: 1500, icon:7,offset:'100px',shift:6});
				}
			},
			end:function(){
				$("#setCategory").remove();
			}
		});
	}
	//设置上限价-中标价比例
	$scope.setRatio = function(){
		//比例默认值--从服务器获取
		$scope.ratio = 95;
		var sr = $compile('<div class="newFile" id="setRatio">'+
		  				'	<form>'+
						'		<div><input type="number" step="0.1" min="0" max="100" ng-model="ratio"/><span>%</span></div>'+
						'		<div>注：100%代表中标价=上限价</div>'+
						'	</form>'+
						'</div>')($scope);
		sr.appendTo('body');
		layer.open({
		  	type: 1,
		  	skin:'setRatio',
		  	title:"设置上限价-中标价比例",
			btn:["确定","取消"],
		  	area: ['320px', '200px'], //宽高
		  	content:sr,
			yes:function(index){
				if(selMedIds.length>0){
					if($scope.ratio){
						var reg = /^((\d|[1-9]\d)(\.\d+)?|100)$/
						if(reg.test($scope.ratio)){
							var Ratio = $scope.ratio+'%';
						  	$http.post(lUrl+'/tenderPriceForecast/historyCal/tenderPriceRatio',{'userId':sessitionInfo.userId,'modifyUpTenderPrice':Ratio,'ids':selMedIds})
							.success(function(data){
								$scope.searchMedData();
								layer.closeAll();
								layer.alert('批量设置成功，需要重新开始运算', {
								  	skin: 'layui-layer-lan' //样式类名
								  	,closeBtn: 0,
								  	btn:['开始运算']
								}, function(){
									layer.closeAll();
								  	$scope.startCalculate();
								});
							})
						  	.error(function(data){
						  		layer.msg('修改失败，请刷新重试',{icon:7,shift:6});
						  	})
						}
					}else{
						layer.msg('数值不能为空或超出范围,请输入0-100范围内的数值', {time: 1500, icon:7,offset:'100px',shift:6});
					}
				}else{
					layer.msg('请选择批量设置比例的选项', {time: 1500, icon:7,offset:'100px',shift:6});
				}
			},
			end:function(){
				$('#setRatio').remove();
			}
		});
	}
	
	//药品导出到excel
	$scope.ExportToExcel = function(){
		var pi = $scope.page.pageIndex,
			ps = $scope.page.pageSize;
		var CMedId = $location.search().med;
		window.location = lUrl+'/tenderPriceForecast/historyCal/exportNewAnalysis?userId='+sessitionInfo.userId+'&medicineId='+CMedId+'&pageIndex='+pi+'&pageSize='+ps;
	}
	
	
	
	
	
	//添加新分析//上传历史数据
	$scope.addAnalyzing = function(dId){
		if($scope.menuList.length==0){
			layer.msg('请先创建文件夹，再添加新分析',{icon:7,time:1000});
			return false;
		}
		$scope.uploadFileName = "";//获取上传文件名字
		$scope.showFN = '';//文件名字
//		var checkedMed = "";//当前选中medicine的id
		$scope.uploadFTrue = false;//文件处于未上传状态
		var analyzingInfo = {"medName":"","medId":""}//新建药品信息
		step1();
		///////新建分析
		function step1 (){
			layer.open({
			  	type: 1,
			  	skin:'addAn1',
			  	title:"添加新分析",
				btn:["创建"],
			  	area: ['340px', '230px'],
			  	content: 	'<div class="addAnStep1">'+
			  				'<form>'+
							'	<div class="diyDrugName"><label for="drugName">自定义药品名称</label></div>'+
							'	<div><input type="text" id="drugName" class="drugName" /></div>'+
							'</form>'+
							'</div>',
				yes:function(index,layero){
					analyzingInfo.medName=$("#drugName").val().trim();
					if(!analyzingInfo.medName){
						layer.msg('名称不能为空', {time: 1000, icon:7,offset:'100px',shift:6},function(){
							$("#drugName").focus();
						})
					}else{
//						console.log($location.search().dep)
//						var depId = $location.search().dep;
						console.log(dId)
						$http.post(lUrl+'/tenderPriceForecast/medicinal/create',{'userId':sessitionInfo.userId,'medicineName':analyzingInfo.medName,'depId':dId})
						.success(function(data){
							analyzingInfo.medId = data.bean.medicineId;
							for(var i=0;i<$scope.menuList.length;i++){
								if(dId == $scope.menuList[i].depId){
									$scope.homeMenuClick($scope.menuList[i],i);
								}
							}
							step2();
							layer.close(index);
							if(data.backHttpResult.result!='success'){
								layer.msg(data.backHttpResult.result,{ icon:7,shift:6});
							}
						})
						.error(function(){
							layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
						})
					}
				}
			});
		}
		
		function step2(){
			var ST2 = $compile(
								'<div class="addAnStep2">'+
				  				
								'	<div class="uploadData"><span for="drugName">上传该药品历史数据</span></div>'+
								'	<div class="layui-tab layui-tab-card">'+
								'	  	<ul class="layui-tab-title">'+
								'	    	<li class="layui-this">新上传表格</li>'+
								'	    	<li>选择已有表格</li>'+
								'	  	</ul>'+
								'	  	<ul class="layui-tab-content" >'+
								'	    	<li class="layui-tab-item layui-show">'+
								'				<div class="uploadBox">'+
								'					<form method="post" enctype="multipart/form-data" id="uploadFiles">'+
								'						<div class="inputFileBox"><input type="file" name="filename" class="addAnInputFile" onchange="angular.element(this).scope().changeF(this)" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/></div>'+
								'						<input type="button" class="btn btn-danger uploadBtn" ng-click="uploadBtn()"  value="上传">'+
								'						<div class="fileNameBox"><span class="uploadFileName">{{showFN}}</span></div>'+
								'					</form>'+
								'				</div>'+
								'				<div class="templateBox"><a ng-click="downloadModel()" class="downloadTemplate">模板下载.xls</a></div>'+
								'			</li>'+
								'	    	<li class="layui-tab-item">'+
								'				<div class="tableChecked"><span>选择已有的数据表</span><i class="layui-icon" style="font-size: 14px; color: #1E9FFF; margin-left: 20px;">&#xe615;</i></div>'+
								'				<ul class="layui-nav layui-nav-tree" >'+
								'				  	<li class="layui-nav-item" ng-repeat="obj in menuList" >'+
								'				    	<a href="javascript:;"  ng-click="ck1(obj,$event,$index)"><i class="layui-icon" style="font-size: 16px;line-height:30px; color: #333;vertical-align:middle;">&#xe622;</i><span class="depW whiteSpace">{{obj.depName}}</span><i class="menuIcon glyphicon glyphicon-plus-sign" style="font-size:10px;margin-left:10px;" ></i></a>'+
								'				    	<dl class="layui-nav-child">'+
								'				      		<dd ng-repeat="objMed in objMedList"><a href="javascript:;" class="whiteSpace" ng-click="ck2($index,objMed,$event)" >{{objMed.medicineName}}</a></dd>'+
								'				    	</dl>'+
								'				  	</li>'+
								'				</ul>'+	
								'			</li>'+
								'	  	</ul>'+
								'	</div>'+
								
								'</div>')($scope);
			ST2.appendTo('body');
			
			
			layer.open({
			  	type: 1,
			  	skin:'addAn1 addAn2',
			  	title:"上传历史表",
				btn:["跳过","确定"],
			  	area: ['340px', '340px'],
			  	closeBtn:0, //不显示关闭按钮
			  	content: ST2	,
				yes:function(index,layero){
					layer.close(index);
					layer.alert('历史数据是系统必须的数据，你可以在后续操作中上传历史数据或修改历史数据', {
			  			skin: 'layui-layer-lan' //样式类名
			  			,closeBtn: 0,
			  			btn:'进入操作台'
					})
				},
				btn2:function(index,layero){
					//当前选择dep的id
//					var nowMedId = $location.search().med;
					//判断当前弹框 tab标签页在哪一页
					//当前页默认为0
					var defaultTab = 0;
					var tab = $('.addAn1 .layui-tab-item');
					for(var i=0;i<tab.length;i++){
						if($(tab[i]).hasClass('layui-show')){
							 defaultTab = i;
						}
					}
					if(defaultTab==0){
						if($scope.uploadFTrue){//上传文件
							//上传数据需确认						////////////再加一个文件id
							$http.post(lUrl+'/tenderPriceForecast/history/import',{"userId":sessitionInfo.userId,'medicineId':analyzingInfo.medId,'id':$scope.fileId})
							.success(function(data){
								layer.alert('历史数据是系统必须的数据，你可以在后续操作中上传历史数据或修改历史数据', {
						  			skin: 'layui-layer-lan' //样式类名
						  			,closeBtn: 0,
						  			btn:'进入操作台'
								})
								if(data.backHttpResult.result!='success'){
									layer.msg(data.backHttpResult.result,{time: 2000, icon:7,offset:'50px',shift:6});
//									return false;
								}
							})
							.error(function(data){
								layer.msg('上传失败，请刷新页面重新上传',{icon:7,shift:6});
							})
						}else{
							layer.msg('请选择上传文件，或跳过此步骤',{time: 2000, icon:7,offset:'50px',shift:6});
							return false;
						}
					}else{
						if($scope.checkedMed){//历史表
							//上传数据需确认
							$http.post(lUrl+'/tenderPriceForecast/history/uploadExists',{"userId":sessitionInfo.userId,'exisMedicineId':$scope.checkedMed.medicineId,'medicineId':analyzingInfo.medId})
							.success(function(data){
								layer.alert('历史数据是系统必须的数据，你可以在后续操作中上传历史数据或修改历史数据', {
						  			skin: 'layui-layer-lan' //样式类名
						  			,closeBtn: 0,
						  			btn:'进入操作台'
								})
							})
							.error(function(data){
								layer.msg('文件异常，请刷新后重试',{icon:7,shift:6});
							})
						}else{
							layer.msg('请选择历史数据，或跳过此步骤',{time: 1000, icon:7,offset:'50px',shift:6});
							return false;
						}
					}	
				},
				end:function(){
					$('.addAnStep2').remove();
				}
			});
		}
	}
	$scope.changeF = function(obj){
//		$(".uploadFileName").html("");
		var fileList = obj.files[0];
	   	if (window.FileReader) {    
            var reader = new FileReader();    
            reader.readAsDataURL(fileList);  
            //监听文件读取结束后事件    
          	reader.onloadend = function () {
          		$scope.uploadFileName=fileList.name;
            }   
       	}
	}
	$scope.uploadBtn = function(){

		var fname = $scope.uploadFileName;
		if(fname){
			var formData = new FormData(document.getElementById('uploadFiles'));
			formData.append("userId",sessitionInfo.userId);
			$.ajax({
	    	 	url:lUrl+'/tenderPriceForecast/history/upload',
			    data: formData,
			    type: "post",
			    processData: false,
  		 		contentType: false,
			    success: function(data){
//			    	if(data.backHttpResult.code==000){
			    		/////返回id
			    		
			    		if(data.backHttpResult.result!='success'){
//							layer.msg(data.backHttpResult.result,{ icon:7,shift:6});
							errorInfo(data.backHttpResult.result);
						}else{
							$scope.uploadFTrue = true;//文件处于上传状态;
				    		$scope.showFN = fname;
				    		$scope.$apply();
				    		///////
				    		$scope.fileId = data.id;
						}
//			    	}else{
//			    		errorInfo(data.backHttpResult.result);
//			    	}
			    },
			    error:function(){
					layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
				}
			});
		}else{
			layer.msg('未选中文件',{time: 1000, icon:7,offset:'60px',shift:6})
			return false;
		}
	}
	//模板下载
	$scope.downloadModel = function(){
		window.location = lUrl+'/tenderPriceForecast/history/template?userId='+sessitionInfo.userId;
	}
	//添加分析第二步 菜单点击事件
	$scope.ck1 = function(obj,e,Index){
		$http.get(lUrl+'/tenderPriceForecast/medicinal/groupFindList?userId='+sessitionInfo.userId+'&depId='+obj.depId)
		.success(function(res){
			$scope.objMedList = res.rows;
//			$scope.hadMedIndex = Index;
		}).error(function(data){
			layer.msg('系统异常，请刷新后重试',{icon:7,shift:6});
		})
		$(e.target).parents('.layui-nav-item').siblings('.layui-nav-item').removeClass('layui-nav-itemed').find('.menuIcon').removeClass('glyphicon-minus-sign');
		$(e.target).parents('.layui-nav-item').toggleClass('layui-nav-itemed').find('.menuIcon').toggleClass('glyphicon-minus-sign');
			
	}
	$scope.ck2 = function(Index,objMed,e){
		$(e.target).parents('.layui-nav').find('a').removeClass('active');
		$(e.target).addClass('active');
		$scope.checkedMed = objMed;
	}
	
	
	//查看规则
	$scope.viewRules = function(objR){
		$scope.objRules=objR;
		var cfr = objR.modifyUpTenderPrice==null?objR.upTenderPrice:objR.modifyUpTenderPrice; //保存修改前的比例值
		if(objR.modifyUpTenderPrice==null){
			$scope.objRules.modifyUpTenderPrice = parseFloat(objR.upTenderPrice);	
		}else{
			$scope.objRules.modifyUpTenderPrice = parseFloat(objR.modifyUpTenderPrice);
		}
		if(obj.medicineTypeCode==2){
			$scope.objRules.issShow = false;
		}else{
			$scope.objRules.isShow = true;
		}
		console.log($scope.objRules)
		var VR = $compile('<div class="rulesBox">'+
		  				'<form>'+
						'	<div class="clearfix">'+
						'		<div class="fl rules1"><span>模式 : </span><span>{{objRules.mode}}</span></div>'+
						'		<div class="fl rules1"><span>药物类别 : </span><span>{{objRules.medicineType}}</span></div>'+
						'	</div>'+
						'	<div class="layui-tab layui-tab-card">'+
						'	  	<ul class="layui-tab-title">'+
						'	    	<li class="layui-this" ng-click="hideThisBtn($event)">初始中标价规则</li>'+
						'	    	<li class="showThis" ng-click="hideThisBtn($event)" ng-show="objRules.isShow">联动规则</li>'+
						'	  	</ul>'+
						'	  	<div class="layui-tab-content">'+
						'	    	<div class="layui-tab-item layui-show">'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL" style="vertical-align:top;">参考区域</span><span class="rulesAreaR">{{objRules.upperArea}}</span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL" ng-if="objRules.modeCode!=2">上限价</span><span class="rulesAreaR">{{objRules.modifyUpPrice==null?objRules.upPrice:objRules.modifyUpPrice}}</span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL" ng-if="objRules.modeCode!=2">上限价-中标价比例</span><span class="rulesAreaR"><input type="text" ng-model="objRules.modifyUpTenderPrice" class="lowerValue"/>%</span></div>'+
						'			</div>'+
						'	    	<div class="layui-tab-item">'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL between">左右联动规则</span><span class="rulesAreaR hr"><hr></span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL">联动区域</span><span class="rulesAreaR">{{objRules.lrLinkageRegion}}</span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL">联动参考值</span><span class="rulesAreaR">{{objRules.lrLinkageRefVal}}</span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL">触发条件</span><span class="rulesAreaR">{{objRules.lrMathSymbol}}{{objRules.lrLinkageTiggerCondtion}}</span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL">联动周期</span><span class="rulesAreaR">{{objRules.lrLinkageCycle}}</span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL between">上下联动规则</span><span class="rulesAreaR hr"><hr></span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL">联动区域</span><span class="rulesAreaR">{{objRules.udLinkageArea}}</span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL">联动参考值</span><span class="rulesAreaR">{{objRules.udLinkageRefVal}}</span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL">触发条件</span><span class="rulesAreaR">{{objRules.udMathSymbol}}{{objRules.udLinkageTiggerCondtion}}</span></div>'+
						'				<div class="rulesAreaLine"><span class="rulesAreaL">联动周期</span><span class="rulesAreaR">{{objRules.udLinkageCycle}}</span></div>'+
						'			</div>'+
						'	  	</div>'+
						'	</div>'+
						'</form>'+
						'</div>')($scope);
		VR.appendTo('body');
		layer.open({
		  	type: 1,
		  	title:"查看规则",
		  	skin:"viewRules",
			btn:["保存修改","规则报错"],
		  	area: ['500px', '550px'],
		  	content: VR	,
			yes:function(index,obj){
				var nn = $(obj).find(".lowerValue");
				var hl = $(obj).find(".layui-layer-btn0");
				if(nn.attr("disabled")){
					nn.removeAttr('disabled').css('padding-right',0);
					hl.html('保存修改');
				}else{
					var ids = [];
					ids.push(objR.id);
					var objRulesUTP = $scope.objRules.modifyUpTenderPrice+'%';
					$http.post(lUrl+'/tenderPriceForecast/historyCal/tenderPriceRatio',{'userId':sessitionInfo.userId,'modifyUpTenderPrice':objRulesUTP,'ids':ids})
					.success(function(data){
						$scope.searchMedData();
						nn.attr("disabled",'disabled').css('padding-right','2px');
						hl.html('编辑规则');
						if(data.backHttpResult.result!='success'){
							layer.msg(data.backHttpResult.result, {time: 1500, icon:7,shift:6});
						}
					})
					.error(function(){
						layer.msg('连接异常，请刷新后重试',{icon:7,shift:6});
					})
				}
//				$(obj).find(".lowerValue").attr("disabled","disabled");
			},
			btn2:function(){
				layer.open({
				  	type: 1,
				  	title:"规则报错",
				  	shadeClose:true,
				  	area: ['400px', '180px'],
				  	content: 	'<div class="rulesErr">'+
								'	<div>如该规则有错误，请拨打电话 010-2324134</div>'+
								'	<div >感谢您的支持</div>'+
								'</div>'
				});
				return false;
			},
			cancel:function(){
				console.log(cfr)
//				console.log(objR.modifyUpTenderPrice)
//				console.log($scope.objRules.modifyUpTenderPrice)
//				objR.modifyUpTenderPrice = cfr;
				$scope.objRules.modifyUpTenderPrice = cfr;
				$scope.$apply();
//				$scope.searchMedData();
			},
			end:function(){
				$('.rulesBox').remove();
			}
		});	
	}
	$scope.hideThisBtn = function(e){
		if($(e.target).hasClass('showThis')){
			$('.viewRules.layui-layer .layui-layer-btn a.layui-layer-btn0').hide();
		}else{
			$('.viewRules.layui-layer .layui-layer-btn a.layui-layer-btn0').show();
		}
	}

	
	//弃标
	$scope.abstain = function(obj,e){
		var Edit = $(e.target);
		var qibiao = $('.content .detailsInfoBox .tableBg #bidList tbody tr');
		var addUrl = {'userId':sessitionInfo.userId,'medicineId':obj.medicineId,'provinceCode':obj.provinceCode,'modeCode':obj.modeCode};
		if(obj.cityCode){
			addUrl.cityCode = obj.cityCode;
		}
		if(obj.flag){//现处于弃标状态
			$http.post(lUrl+'/tenderPriceForecast/historyCal/modifyTender',addUrl)
			.success(function(data){
//				if(data.backHttpResult.code==000){
					//判断是否被选中 影响批量处理
				if(selMedIds.length>0){
					var aoo = $(e.target).parent('td').siblings('td').children('.edit');
					if(aoo.is(':checked')){
						selMedIds.push(parseInt(obj.id));
					}
				}
				obj.flag = 0;
				if(data.backHttpResult.result!='success'){
					layer.msg(data.backHttpResult.result,{time: 2000, icon:7,offset:'180px',shift:6});
				}
			})
			.error(function(){
				layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
			})
		}else{//现在处于应标状态 按钮显示弃标 点击后变成弃标状态 按钮显示应标
			$http.post(lUrl+'/tenderPriceForecast/historyCal/discarded',addUrl)
			.success(function(data){
				if(data.backHttpResult.code==000){
					//判断是否被选中 影响批量处理
					if(selMedIds.length>0){
						for(var i=0;i<selMedIds.length;i++){
							if(obj.id==selMedIds[i]){
								selMedIds.splice(i,1);
							}
						}
					}
					obj.flag = 1;
				}else{
					
					layer.msg(data.backHttpResult.result,{time: 2000, icon:7,offset:'180px',shift:6});
				}
			})
			.error(function(){
				layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
			})
		}
	}

	//创建参考规则
	$scope.createRule = function(){
		layer.open({
		  	type: 1,
		  	title:"创建参考规则",
		  	skin:'createRules',
		  	area: ['470px', '430px'],
		  	btn:['有效计算公式','确定'],
		  	content: 	'<div class="rulesBox">'+
						'	<div><textarea class="layui-textarea"></textarea></div>'+
		  				'	<div class="clearfix">'+
		  				'		<div class="fl lump">'+
		  				'			<label>函数</label>'+
		  				'			<div class="list">'+
		  				'				<ul>'+
		  				'					<li>AVG</li>'+
		  				'					<li>MIN</li>'+
		  				'					<li>SMALL</li>'+
		  				'					<li>SUM</li>'+
		  				'					<li>SUMPRODUCT</li>'+
		  				'					<li>最低5省</li>'+
		  				'					<li>最低3省</li>'+
		  				'				</ul>'+
		  				'			</div>'+
		  				'		</div>'+
		  				'		<div class="fr lump">'+
		  				'			<label>字段</label>'+
		  				'			<div class="list">'+
		  				'				<ul>'+
		  				'					<li>全国</li>'+
		  				'					<li>北京</li>'+
		  				'					<li>河北省</li>'+
		  				'					<li>山东省</li>'+
		  				'				</ul>'+
		  				'			</div>'+
		  				'		</div>'+
		  				'	</div>'+
		  				'</div>',
			yes:function(){
					
			}
		});
		$(".createRules .rulesBox .lump .list li").click(function(){
			$(this).addClass("active").siblings().removeClass("active");
		})
	}
	
	//新分析编辑 编辑List
	$scope.editMedList = function(obj){
//		if(obj.modeCode==2){
//			$scope.objMedList.hasTender = true;
//		}
		//保存初始值 便于恢复
		var Dmonth = obj.tenderMonth,
		DdelayedM = obj.implementationMonth,
		DmedCategory = obj.medicineType;
		DonThePrice = obj.modifyUpPrice==null?obj.upPrice:obj.modifyUpPrice,
		Dratio = obj.modifyUpTenderPrice==null?obj.upTenderPrice:obj.modifyUpTenderPrice,
		DbiddingPrice = obj.updateTenderPrice==null?obj.tenderPrice:obj.updateTenderPrice;
		if(obj.medicineTypeList.length>0){
			for(var i=0;i<obj.medicineTypeList.length;i++){
				if(obj.medicineTypeCode==obj.medicineTypeList[i].id){
					$scope.medicineTypeObj = obj.medicineTypeList[i];
				}
			}
		}
		$scope.objMedList = obj;
		$scope.objMedList.modifyUpPrice = $scope.objMedList.modifyUpPrice==null?$scope.objMedList.upPrice:$scope.objMedList.modifyUpPrice;
		$scope.objMedList.modifyUpTenderPrice = $scope.objMedList.modifyUpTenderPrice==null?$scope.objMedList.upTenderPrice:$scope.objMedList.modifyUpTenderPrice;
		$scope.objMedList.updateTenderPrice = $scope.objMedList.updateTenderPrice==null?$scope.objMedList.tenderPrice:$scope.objMedList.updateTenderPrice;
		var mep = $compile(
				'<table class="table" id="medEditPromp">'+
				'	<thead>'+
				'		<tr>'+
				'			<th ng-repeat="bidTitle in bidListHeader">{{bidTitle}}</th>'+
				'		</tr>'+
				'	</thead>'+
				'	<tbody>'+
						'<tr>'+
						'	<td class="w1">{{objMedList.tenderYear}}</td>'+
						'	<td class="w1"><select ng-options="m for m in Month" ng-model="objMedList.tenderMonth"></select></td>'+
						'	<td class="w1"><input type="number" ng-model="objMedList.implementationMonth" /></td>'+
						'	<td>{{objMedList.province}}</td>'+
						'	<td>{{objMedList.city}}</td>'+
						'	<td>'+
						'		<select ng-model="medicineTypeObj" ng-options="category.name for category in objMedList.medicineTypeList">'+
						'		</select>'+
						'	</td>'+
						'	<td class="w2"><input id="c1" type="text" ng-model="objMedList.modifyUpPrice"  ng-disabled="objMedList.hasTender" ng-change="CNUP(objMedList.modifyUpPrice,objMedList.modifyUpTenderPrice,objMedList.updateTenderPrice)" ng-focus="CNUPFocus(objMedList.modifyUpPrice,objMedList.modifyUpTenderPrice,objMedList.updateTenderPrice)"/></td>'+
						'	<td class="w2"><input id="c2" type="text" ng-model="objMedList.modifyUpTenderPrice" ng-disabled="objMedList.hasTender" ng-change="CNMUTP(objMedList.modifyUpPrice,objMedList.modifyUpTenderPrice,objMedList.updateTenderPrice)" ng-focus="CNMUTPFocus(objMedList.modifyUpPrice,objMedList.modifyUpTenderPrice,objMedList.updateTenderPrice)"/></td>'+
						'	<td class="w2"><input id="c3" type="text" ng-model="objMedList.updateTenderPrice" ng-change="CUTP(objMedList.modifyUpPrice,objMedList.modifyUpTenderPrice,objMedList.updateTenderPrice)" ng-focus="CUTPFocus(objMedList.modifyUpPrice,objMedList.modifyUpTenderPrice,objMedList.updateTenderPrice)"/></td>'+
						'	<td>{{objMedList.calendarMonth}}</td>'+
						'	<td>{{objMedList.monthRealPrice}}</td>'+
						'	<td>{{objMedList.mode}}</td>'+
						'	<td><a href="javascript:;" ng-click="viewRules(objMedList)">查看</a></td>'+
						'	<td>'+
						'		<a href ng-click="CompleteMedList(objMedList,delPromp)">完成</a>'+
						'	</td>'+
						'</tr>'+
				'	</tbody>'+
				'</table>')($scope);
		mep.appendTo('body');
		layer.open({
		  	type: 1,
		  	title:false,
		  	skin:'medEditPromp',
		  	area: ['1040px', '80px'],
		  	content:mep,
		  	success:function(layero, index){
		  		$scope.delPromp = index;
		  	},
		  	end:function(){
		  		$("#medEditPromp").remove();
		  	},
		  	cancel:function(){
		  		//恢复编辑前
		  		$scope.objMedList.tenderMonth = Dmonth;
		  		$scope.objMedList.implementationMonth = DdelayedM;
		  		$scope.medicineTypeObj = DmedCategory;
		  		$scope.objMedList.modifyUpPrice = DonThePrice;
		  		$scope.objMedList.modifyUpTenderPrice = Dratio;
		  		$scope.objMedList.updateTenderPrice = DbiddingPrice;
		  		$scope.$apply();
		  	}
		})
	}
	//编辑时候 确定修改哪个值
	var chA = 0;
	var chB = 0;
	var chC = 0;

//	编辑上限价
	$scope.CNUPFocus = function(a,b,c){
		if(b){
			chB = 1;
		}else if(c){
			chC = 1;
			chB = 0;
		}
	}

	$scope.CNUP = function(a,b,c){
		if(chB){
			var inResult = new RegExp(/^(\d+\.?\d*)%$/);
			if(inResult.test(b)){
				var bb = b.replace(/%/, "");
				c=(a*bb/100).toFixed(2);
			}
		}else if(chC){
			b=(c/a*100).toFixed(2)+'%';
		}
		$scope.objMedList.modifyUpTenderPrice = b;
		$scope.objMedList.updateTenderPrice = c;
	}
//	编辑比例
	$scope.CNMUTPFocus = function(a,b,c){
		if(a){
			chA = 1;
		}else if(chC){
			chC = 1;
			chA = 0;
		}
	}
	$scope.CNMUTP = function(a,b,c){
		var inResult = new RegExp(/^(\d+\.?\d*)%$/);
		if(inResult.test(b)){
			if(chA){
				console.log(12345)
				var bb = b.replace(/%/, "");
				c=(a*bb/100).toFixed(2);
			}else if(chC){
				var bb = b.replace(/%/, "");
				a=(c/bb*100).toFixed(2);
			}
		}
		$scope.objMedList.modifyUpPrice = a;
		$scope.objMedList.updateTenderPrice = c;
	}
	//	编辑中标价
	$scope.CUTPFocus = function(a,b,c){
		if(a){
			chA = 1;
		}else if(b){
			chB = 1;
			chA = 0; 	
		} 
	}
	$scope.CUTP = function(a,b,c){
		var inResult = new RegExp(/^(\d+\.?\d*)%$/);
		if(chA){
			if(a==0){
				b=0+'%'
			}else{
				b=(c/a*100).toFixed(2)+'%';
			}
		}else if(chB){
//			console.log(b)
			if(inResult.test(b)){
				bb = b.replace(/%/, "");
				console.log(bb)
				a=(c/bb*100).toFixed(2);
				console.log(a)
			}			
		} 
		$scope.objMedList.modifyUpPrice = a;
		$scope.objMedList.modifyUpTenderPrice = b;
	}
	
	
	
	//投标编辑内的完成/新分析编辑
	$scope.CompleteMedList = function(obj,prompIndex){
		//0~100%以内的百分数 包含小数
		if(obj.modifyUpTenderPrice){
			var inResult = new RegExp(/^\d+\.?\d{0,2}%$/);
//			console.log(inResult.test(obj.modifyUpTenderPrice))
			if(!inResult.test(obj.modifyUpTenderPrice)){
				layer.msg('招标比例参数有误，请确认无误后提交<br>(需包含"%"字符)',{time: 2000, icon:7,offset:'180px',shift:6});
				return;
			}
		}
		
		var UrlKeys = ['userId','implementationMonth','tenderMonth','medicineType','modifyUpTenderPrice','modifyUpPrice','updateTenderPrice','id'];
		var UrlVal = [sessitionInfo.userId,obj.implementationMonth,obj.tenderMonth,obj.medicineType,obj.modifyUpTenderPrice,obj.modifyUpPrice,obj.updateTenderPrice,obj.id];
		var addUrl = {};
		for(var i=0;i<UrlKeys.length;i++){
			if(UrlVal[i]||UrlVal[i]==0){
				addUrl[UrlKeys[i]] = UrlVal[i];
			}
		}
		$http.post(lUrl+'/tenderPriceForecast/historyCal/edit',addUrl)
		.success(function(data){
			if(data.backHttpResult.code==000){
				//刷新页面				
				$scope.searchMedData();
				layer.close(prompIndex);
			}else{
				layer.msg(data.backHttpResult.result,{time: 1000, icon:7,offset:'180px',shift:6});	
			}
		})
		.error(function(){
			layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
		})
	}
	//清空单条数据
	$scope.clearData = function(obj,e){
		$http.post(lUrl+'/tenderPriceForecast/historyCal/clear',{'userId':sessitionInfo.userId,'medicineId':obj.medicineId,'id':obj.id})
		.success(function(data){
			console.log(data)
			if(obj.hasTender){
				obj.updateTenderPrice=null;
				obj.modifyUpPrice=null;
				obj.modifyUpTenderPrice = null;
			}else{
				obj.updateTenderPrice='';
				obj.modifyUpPrice='';
				obj.modifyUpTenderPrice = null;
			}
		})
		.error(function(){
			layer.msg('连接失败，请刷新后重试',{icon:7,shift:6});
		});
	}
	//清空所有选中数据
	$scope.clearAllData = function(){
		var currentMed = $location.search().med;
		$http.post(lUrl+'/tenderPriceForecast/historyCal/clear',{'userId':sessitionInfo.userId,'medicineId':currentMed})
		.success(function(data){
//			console.log(data)
//			if(data.backHttpResult.code==000){
//				$scope.searchMedData();
				for(var i=0;i<$scope.hisData.length;i++){
					$scope.hisData[i].updateTenderPrice = '';
					$scope.hisData[i].modifyUpPrice = '';
					$scope.hisData[i].modifyUpTenderPrice = null;
				}
//			}else{
//				layer.msg(data.backHttpResult.result,{time: 1000, icon:7,offset:'180px',shift:6});
//			}
			if(data.backHttpResult.result!='success'){
				layer.msg(data.backHttpResult.result,{ icon:7,offset:'180px',shift:6});
			}
		})
		.error(function(){
			layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
		})
	}
	
	//开始运算
	$scope.startCalculate = function(x){
		if(x){
			var addUrl = '&isDiscarded='+x;
		}else{
			var addUrl = '';
		}
		layer.load(2);
		var mId = $location.search().med;
		$http.get(lUrl+'/tenderPriceForecast/historyCal/calRule?userId='+sessitionInfo.userId+'&medicineId='+mId+addUrl)
		.success(function(data){
			console.log(data)
			if(data.backHttpResult.code==000){
				$http.post(lUrl+'/tenderPriceForecast/historyCal/findAll',
					{
						'userId':sessitionInfo.userId,
						'medicineId':mId
					}
				).success(function(data){
					//初始页码
					$scope.page={'pageIndex':pageIndex,
						'pageSize':pageSize,
						'totalPage':1,
						'master':false,
						'province':'',
						'city':'',
						'tenderStartTime':'',
						'tenderEndTime':'',
						'medType':'',
						'mode':'',
						'calendarMonth':'',
						'pageNum':'',
						'selected':'',
						'isTenderAll':isTenderMonth,
						'isTenderMonth':isTenderMonth[0]
					};
					
					layer.closeAll('loading');
					
					$scope.searchMedData();
					
					//获取当年多有数据
					var thisYearDate = [];
							
					for(var nn=0;nn<data.rows.length;nn++){
						if(data.rows[nn].tenderYear==nowYear){
							thisYearDate.push(data.rows[nn]);
						}
					}
					if(thisYearDate.length>0){
						var THeight = $('#bidList').find('thead').css('height');
						$('.content .detailsInfoBox .tableBg .tableHeight').animate({maxHeight:THeight,minHeight:THeight},'slow');
						$scope.page.SHList = true;
						$('.tableBg').children('button').html('展开');
						
						
						var areaTotalArr = [];////地图data数据
						var areaTotalBarArr = [[],[],[],[],[],[],[],[],[],[],[],[]];//全国折线图集合
						var areaTotalBarData = [];
						var allCityArr = [];//所有省最低价的集合 算出最大值最小值用		
						///////数组类型转换
					
						
						var realPriceArr = [];//////实际价格数组
						
						for(var i=0;i<thisYearDate.length;i++){
							var TAKey = thisYearDate[i].province;
							if(!$scope.area.totalObj[TAKey]){
								$scope.area.totalObj[TAKey]=[];
							}
							$scope.area.totalObj[TAKey].push(thisYearDate[i].monthRealPrice);
							//////
							for(var q=0;q<12;q++){
								if(thisYearDate[i].calendarMonth==(q+1)){
									areaTotalBarArr[q].push(thisYearDate[i].monthRealPrice)
								}
							}
							//////实际价格数组
							if(thisYearDate[i].monthRealPrice){
								realPriceArr.push(thisYearDate[i].monthRealPrice);
							}
						}
						
						var DValue = 0;
						if(realPriceArr.length>0){
							DValue = Math.floor(Math.min.apply(null,realPriceArr)/5);
						}
						console.log(DValue)
//						console.log(Math.ceil(Math.max.apply(null,realPriceArr)));
//						console.log(Math.floor(Math.min.apply(null,realPriceArr)));
//						console.log(areaTotalBarArr)
						/////算出全国折线图数组的最低价并排序
						for(var p=0;p<areaTotalBarArr.length;p++){
//							var dataArr = areaTotalBarArr[p].length>0?areaTotalBarArr[p]:[0];
//							areaTotalBarData.push(Math.min.apply(null, dataArr));//最小值
							if(areaTotalBarArr[p].length>0){
								var minArr = [];
								for(var uu=0;uu<areaTotalBarArr[p].length;uu++){
									if(areaTotalBarArr[p][uu]){
										minArr.push(areaTotalBarArr[p][uu]);
									}
								}
								if(minArr.length>0){
									areaTotalBarData.push(Math.min.apply(null, minArr));//最小值
								}else{
									areaTotalBarData.push(null);
								}
							}
						}
//						console.log(areaTotalBarData)
						for(var kk in $scope.area.totalObj){
							var areaObj = {}
							var sum = 0;
							var minData = [];
							for(var u=0;u<$scope.area.totalObj[kk].length;u++){
								sum+=$scope.area.totalObj[kk][u];
								if($scope.area.totalObj[kk][u]){//如果为null，不载入
									
									minData.push($scope.area.totalObj[kk][u])
								}
							}
	//						console.log(minData)
							areaObj['name']=kk;
							if(minData.length>0){
								areaObj['value'] = Math.min.apply(null,minData);//最低价
							}else{
								areaObj['value'] = null;
							}
//							console.log(areaObj['value'])
							allCityArr.push(areaObj['value']);//转换为地图data数组类型
							areaTotalArr.push(areaObj);
						}
						$scope.showMap = true;
						
						/////////////////////////////////////单轴散点图//////////////////////////////
						var scatterSingleData = [];
						var sData = thisYearDate;
						for(var f=1;f<=12;f++){
							var scaMonth = [];//每个月散点图显示数据
							for(var g=0;g<sData.length;g++){
								var eMonth = [];//每个月数据
								var obj = {};
								if(sData[g].calendarMonth==f){
									if(sData[g].cityCode%100==0){//省级数据 显示省名字
										sData[g].city = sData[g].province+sData[g].city;									
									}
									obj.calendarMonth = sData[g].calendarMonth;
									obj.monthRealPrice = sData[g].monthRealPrice;
									obj.city = sData[g].city;
									scaMonth.push(obj);
								}
							}
							var tb = [];
							var narr = [];
							for (var i = 0; i < scaMonth.length; i++) {
							    var n = tb.indexOf(scaMonth[i].monthRealPrice);
							    if(scaMonth[i].city=='省级'){
							    	scaMonth[i].city = scaMonth[i].province + scaMonth[i].city;
							    }
							    if (n==-1) {
							        tb.push(scaMonth[i].monthRealPrice);
							        narr.push({ 'city' : [scaMonth[i].city] , 'monthRealPrice' : scaMonth[i].monthRealPrice , 'calendarMonth' : scaMonth[i].calendarMonth});
							    } else {
							        narr[n].city.push(scaMonth[i].city);
							    }
							}
							var fArr = [];
							for(var b=0;b<narr.length;b++){
								var eachPriceArr = [];
								eachPriceArr.push(narr[b].calendarMonth);
								eachPriceArr.push(narr[b].monthRealPrice);
								eachPriceArr.push(narr[b].city.length);
								eachPriceArr.push(narr[b].city.toString());
								fArr.push(eachPriceArr)
							}
							scatterSingleData=scatterSingleData.concat(fArr);
						}
//						var SDa = [];	//所有横坐标实际数值 求最大值最小值
//						for(var m=0;m<scatterSingleData.length;m++){
//							SDa.push(scatterSingleData[m][1]);
//						}
//						console.log(SDa)
						optionSD = {
						    tooltip: {
						        position: 'top',
						        textStyle:{
						        	width:300,
						        },
							    formatter:function(e){
							      	for(var t=0;t<scatterSingleData.length;t++){
							      		if(scatterSingleData[t][0]==e.seriesIndex+1){
							      			if(scatterSingleData[t][1]==e.data[0]){
							      				var eachPointCityData = '';
							      				for(var a=0;a<scatterSingleData[t][3].length;a+=30){
							      					var tmp=scatterSingleData[t][3].substring(a, a+30);
							      					eachPointCityData+=tmp+'<br>'
							      				}
							      				return '<div class="scaToolTip"><div><span>价格:'+scatterSingleData[t][1]+'</span><span>地区数量:'+scatterSingleData[t][2]+'</span></div><div><div>地区明细:</div><div class="areaDetails">'+eachPointCityData+'</div></div></div>'
							      			}
							      		}
							      	}
							    }
						    },
						    title: [],
						    singleAxis: [],
						    series: []
						};	
						echarts.util.each(Months, function (month, idx) {
						    optionSD.title.push({
						        textBaseline: 'middle',
						        top: (idx + 0.5) * 100 / Months.length + '%',
						        text: month,
						        left:'2%'
						    });
						    optionSD.singleAxis.push({
						        left: 80,
						        type: 'value',
						        boundaryGap: false,
						//		data: [0,400],
						        max:Math.ceil(Math.max.apply(null,realPriceArr))+DValue,
						        min:(Math.floor(Math.min.apply(null,realPriceArr))-DValue>0)?(Math.floor(Math.min.apply(null,realPriceArr))-DValue):0,
						        top: (idx * 100 / Months.length + 5) + '%',
						        height: (100 / Months.length - 10) + '%',
						        axisLabel: {
						            interval: 2
						        }
						    });
						    optionSD.series.push({
						        singleAxisIndex: idx,
						        coordinateSystem: 'singleAxis',
						        type: 'scatter',
						        data: [],
						        symbolSize: function (dataItem) {
						        	//设置最大点是16
//						        	var point = {
//						        		max:0,//最大值
//						        		cityNum:381//市区数量
//						           	}
//						        	var pointRatio = point.max/point.cityNum;
						        	
						            return Math.sqrt(dataItem[1]) * 8;//点大小
						        }
						    });
						});
						echarts.util.each(scatterSingleData, function (dataItem) {
						    optionSD.series[dataItem[0]-1].data.push([dataItem[1], dataItem[2]]);
						});				
						
						
						var myCharts = echarts.init(document.getElementById('sdt'));
						myCharts.setOption(optionSD);
						///////////////////////////////////////////////////////////////////////////////
						
						var myChartMap = echarts.init(document.getElementById('chartMap'));
						///地图显示全年或者各月份 切换按钮显示状态
						$('#isShowYearPrice').hide();
						optionMap.series[0].data=areaTotalArr;//地图数据
	//						optionMap.series[0].data = [
	//							{name: '北京',value:226},
	//			                {name: '天津',value: 226},
	//			                {name: '上海',value:226},
	//			                {name: '重庆',value: 170},
	//			                {name: '河北',value: 186},
	//			                {name: '河南',value: 196},
	//			                {name: '云南',value: 226},
	//			                {name: '辽宁',value: 217},
	//			                {name: '黑龙江',value: 221},
	//			                {name: '湖南',value: 206},
	//			                {name: '安徽',value: 224},
	//			                {name: '山东',value: 206},
	//			                {name: '新疆',value: 196},
	//			                {name: '江苏',value: 206},
	//			                {name: '浙江',value: 226},
	//			                {name: '江西',value:226},
	//			                {name: '湖北',value: 196},
	//			                {name: '广西',value: 226},
	//			                {name: '甘肃',value: 196},
	//			                {name: '山西',value: 226},
	//			                {name: '内蒙古',value: 260},
	//			                {name: '陕西',value: 188},
	//			                {name: '福建',value: 226},
	//			                {name: '吉林',value: 230},
	//			                {name: '贵州',value:226},
	//			                {name: '青海',value: 206},
	//			                {name: '西藏',value: 226},
	//			                {name: '四川',value: 206},
	//			                {name: '宁夏',value: 180},
	//			                {name: '海南',value:190},
	//			                {name: '台湾',value: 186},
	//			                {name: '香港',value: 186},
	//			                {name: '澳门',value:186}
	//						]
						optionMap.title.text = "全年最低价分布";
						optionMap.visualMap.max = Math.ceil(Math.max.apply(null,realPriceArr))+DValue;//最大值
						optionMap.visualMap.min = (Math.floor(Math.min.apply(null,realPriceArr))-DValue>0)?(Math.floor(Math.min.apply(null,realPriceArr))-DValue):0;//最小值
						myChartMap.setOption(optionMap, true); //显示国家地图
					
						var myChartLine = echarts.init(document.getElementById('chartLine'));
						optionAllLine.series[0].data=areaTotalBarData;
//						optionAllLine.yAxis[0].max = Math.ceil(Math.max.apply(null, areaTotalBarData));//最大值
//						optionAllLine.yAxis[0].min = Math.floor(Math.min.apply(null, areaTotalBarData));//最小值
						optionAllLine.yAxis[0].max = Math.ceil(Math.max.apply(null, realPriceArr))+DValue;//最大值
						optionAllLine.yAxis[0].min = (Math.floor(Math.min.apply(null,realPriceArr))-DValue>0)?(Math.floor(Math.min.apply(null,realPriceArr))-DValue):0;//最小值
						myChartLine.setOption(optionAllLine,true);//显示全国价格曲线
						
						//折线图 点的点击事件  地图上显示当前月各省最低价
						myChartLine.on('click',function(e){
							$('#isShowYearPrice').fadeIn(500);
							//当前月总数据
							var thisMonthData = [];
							var thisMonthMapData = [];//当前月全国map数据
							for(var point=0;point<thisYearDate.length;point++){
								if(e.name.substr(0,e.name.length-1)==thisYearDate[point].calendarMonth){
									thisMonthData.push(thisYearDate[point]);
								}
								
							}
							var tbM = [];
							var narrM = [];
							for (var i = 0; i < thisMonthData.length; i++) {
							    var n = tbM.indexOf(thisMonthData[i].provinceCode);
							    if (n==-1) {
							        tbM.push(thisMonthData[i].provinceCode);
							        narrM.push({ 'value' : [thisMonthData[i].monthRealPrice] , 'name' : thisMonthData[i].province});
							    } else {
							        narrM[n].value.push(thisMonthData[i].monthRealPrice);
							    }
							}
							//当前月所有省市最低价
							thisMonthMapData = narrM;
							for(var tmmd=0;tmmd<thisMonthMapData.length;tmmd++){
//								console.log(thisMonthMapData[tmmd].value)
								if(thisMonthMapData[tmmd].value.length>0){
									var minArr = [];
									for(var jj=0;jj<thisMonthMapData[tmmd].value.length;jj++){
										if(thisMonthMapData[tmmd].value[jj]){
											minArr.push(thisMonthMapData[tmmd].value[jj])
										}
										console.log(minArr)
									}
									if(minArr.length>0){
										thisMonthMapData[tmmd].value = Math.min.apply(null,minArr);
									}else{
										thisMonthMapData[tmmd].value = null;
									}
								}
							}
							
//							console.log(thisMonthMapData)
							optionMap.series[0].data=thisMonthMapData;//地图数据
							optionMap.title.text=e.name+"最低价分布";
							optionMap.visualMap.max = Math.ceil(Math.max.apply(null,realPriceArr))+DValue;//最大值
							optionMap.visualMap.min = (Math.floor(Math.min.apply(null,realPriceArr))-DValue>0)?(Math.floor(Math.min.apply(null,realPriceArr))-DValue):0;//最小值
							myChartMap.setOption(optionMap, true); //显示国家地图
							
						})
						//跳转至全年
						$scope.skipToYear = function(){
							$('#isShowYearPrice').fadeOut(500);
							optionMap.series[0].data=areaTotalArr;//地图数据
							optionMap.title.text = "全年最低价分布";
	//						console.log(areaTotalArr)
							optionMap.visualMap.max = Math.ceil(Math.max.apply(null, allCityArr))+DValue;//最大值
							optionMap.visualMap.min = Math.floor(Math.min.apply(null, allCityArr))>DValue?Math.floor(Math.min.apply(null, allCityArr))-DValue:Math.floor(Math.min.apply(null, allCityArr));//最小值
							myChartMap.setOption(optionMap, true); //显示国家地图
						}
					
						myChartMap.on('mapselectchanged',function (param){//单击省份事件
							 var selectProvince;
							 ///////////////////判断省市
						    for (var i = 0, l = optionMap.series[0].data.length; i < l; i++) {
						        var name = optionMap.series[0].data[i].name;
						        
						        
						        optionMap.series[0].data[i].selected = param.batch[0].selected[name];
						        if (param.batch[0].selected[name]) {
						            selectProvince = name;
						        }
						    }
						    if (typeof selectProvince == 'undefined') {
						        optionMap.series.splice(1);
						        optionMap.legend = null;
						        optionMap.dataRange = null;
				//			        myChart.setOption(optionMap);//如果选择省份不存在则显示国家
						        layer.msg('无该地区数据或已关闭该地区地图',{icon:7,time:1000});
						        $scope.showProvince = false;
						        $scope.$apply();
						        //
						        return;
						    }
						    
						    var provinceArr = [];/////所选省份  接口要求数组形式
						    ///所得为省汉字  变换为省code 并压入数组中
						    provinceArr.push(getProvinceCode(selectProvince));
							$http.post(lUrl+'/tenderPriceForecast/historyCal/findAll',
								{
									'medicineId':mId,
									'userId':sessitionInfo.userId,
									'provinceCodeList':provinceArr
								}
							).success(function(data){
								var thisYearDate = [];
								if(data.rows.length>0){
									
									
									for(var nn=0;nn<data.rows.length;nn++){
										if(data.rows[nn].tenderYear==nowYear){
											thisYearDate.push(data.rows[nn]);
										}
									}
									
									if(thisYearDate.length>0){
									
										////////省份地图
										$scope.showProvince = true;
										var myChartProvice = echarts.init(document.getElementById('chartProM'));
									   
									   	////将所得省份多有市区数组 变换成 所需data形式
									   	var optionProvMapData = [];///该省 所有市的集合
									   	var allCityData = [];//所有市的集合 用于获取最大值最小值及其他操作
									   	var optionProvBarData = [];///省份柱状图data
									   	var optionProvBarArr = [[],[],[],[],[],[],[],[],[],[],[],[]];//各省份按月份柱状图集合
									   	
									   	for(var i=0;i<thisYearDate.length;i++){
									   		var opmd={}
									   		opmd['name'] = thisYearDate[i].city;
									   		opmd['value'] = thisYearDate[i].monthRealPrice;
									   		optionProvMapData.push(opmd);
									   		allCityData.push(opmd['value']);
									   		
									   		/////////省月份柱状图
									   		for(var s=0;s<12;s++){
									   			if(thisYearDate[i].calendarMonth==(s+1)){
									   				optionProvBarArr[s].push(thisYearDate[i].monthRealPrice)
									   			}
									   		}
									   		
									   	}
									   	/////
										for(var p=0;p<optionProvBarArr.length;p++){
//											var optionArr = optionProvBarArr[p].length>0?optionProvBarArr[p]:[0];
//											console.log(optionArr)
											var minArr = [];
											for(var ii=0;ii<optionProvBarArr[p].length;ii++){
												if(optionProvBarArr[p][ii]){
													minArr.push(optionProvBarArr[p][ii]);
												}
											}
											if(minArr.length>0){
												optionProvBarData.push(Math.min.apply(null, minArr));//最小值
											}else{
												optionProvBarData.push(null);
											}
										}
										///所得optionMapData去重
										var optionProvMapData = amalgamateObject(optionProvMapData,'value','name')
										for(var op=0;op<optionProvMapData.length;op++){
											var minArr2 = [];
											for(var yy=0;yy<optionProvMapData[op].value.length;yy++){
												if(optionProvMapData[op].value[yy]){
													minArr2.push(optionProvMapData[op].value[yy]);
												}
											}
											if(minArr2.length>0){
												optionProvMapData[op].value = Math.min.apply(null,minArr2);
											}else{
												optionProvMapData[op].value = null;
											}
										}
//									   	optionProvMapData.shift();//移除第一个 没用的
		//							   	allCityData.shift();
									    ///////////////////
										//省市地图
										var optionProvinceMap = {
										    series:[
										    	{
												    name: '药品分布',
												    type: 'map',
												    mapType: selectProvince,
												    itemStyle:{
												        normal:{label:{show:true}},//没选择时候省份是否显示
												        emphasis:{label:{show:true}}//选择之后省份是否显示
												    },
												    mapLocation: {//显示子地图的位置及其大小
												        x: 'right',
												        y: 'top',
												        width: '80%'
												    },
							//					    roam: false,//地图不允许拖动
											        roam: true,
											        selectedMode : 'single',
													scaleLimit:{min:0.8,max:1.5},
												    data:optionProvMapData
												}
											],
											tooltip : {
										        trigger: 'item',
										    	position: function(point, params, dom) {
										            return ['5%', 0];
										        },
										        formatter:function(e){
										        	return '<div><div style="color:#fff;">'+e.seriesName+'</div><div style="color:#fff;"><span>'+e.name+'--</span><span>'+(isNaN(e.value)?'无数据':e.value)+'</span><div></div>'
										        }
										    },
							 				visualMap: {
										        min: Math.floor(Math.min.apply(null, allCityData)),//最小值,
										        max: Math.ceil(Math.max.apply(null, allCityData)),//最大值
										        left: 'left',
										        top: 'bottom',
										        text: ['高','低'],
										        inRange: {
										            color: ['#77BBEF', '#055cb3']
										        },
										        calculable : true
										  	}
										}
										
										
									    myChartProvice.setOption(optionProvinceMap, true);
										///////////////省份柱状图
										
										var myChartCityBar = echarts.init(document.getElementById('chartCityB'));
										optionCityBar.title.text=selectProvince+"中标价趋势图";
										optionCityBar.series[0].data = optionProvBarData;
										/////////模拟数据
		//									optionCityBar.series[0].data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
										myChartCityBar.setOption(optionCityBar, true);
							
										
									                    
									///////////////////////////////////
										 //选择地级市的单击事件
										
										myChartProvice.on('mapselectchanged', function (param){
											var selectCity;
									
											for (var i = 0, l = optionProvinceMap.series[0].data.length; i < l; i++) {
										        var name = optionProvinceMap.series[0].data[i].name;
										        
										        optionProvinceMap.series[0].data[i].selected = param.batch[0].selected[name];
										        if (param.batch[0].selected[name]) {
										            selectCity = name;
										        }
										   }
										    if (typeof selectCity == 'undefined') {
										        optionMap.series.splice(1);
										        optionMap.legend = null;
										        optionMap.dataRange = null;
								//			        myChart.setOption(optionMap);//如果选择省份不存在则显示国家
							//			        layer.msg('当前显示为该省份信息',{icon:6});
												optionCityBar.title.text=selectProvince+"中标价趋势图";
												optionCityBar.series[0].data = optionProvBarData;
												myChartCityBar.setOption(optionCityBar, true);
							
										        return;
										    }
										    //////通过city查找cityCode
										    var selectCityCode = [];
										    for(var h=0;h<areaData.length;h++){
										    	if(selectCity.indexOf(areaData[h].City)>=0){//模糊匹配
										    		selectCityCode.push(parseInt(areaData[h].cityCode));
										    	}
										    }
											$http.post(lUrl+'/tenderPriceForecast/historyCal/findAll',
												{
													'medicineId':mId,
													'userId':sessitionInfo.userId,
													'cityCodeList':selectCityCode
												}
											).success(function(data){
		//										console.log(data.rows)
		//										if(data.rows.length>0){
													var optionCityBarData = [];///市区柱状图data
										   			var optionCityBarArr = [[],[],[],[],[],[],[],[],[],[],[],[]];//各省份按月份柱状图集合
													if(data.rows.length>0){
														var thisYearDate = [];
											
														for(var nn=0;nn<data.rows.length;nn++){
															if(data.rows[nn].tenderYear==nowYear){
																thisYearDate.push(data.rows[nn]);
															}
														}
														if(thisYearDate.length>0){
															
															for(var i=0;i<thisYearDate.length;i++){
																for(var j=0;j<12;j++){
																	if(thisYearDate[i].calendarMonth==(j+1)){
																		optionCityBarArr[j].push(thisYearDate[i].monthRealPrice);
																	}
																}
															}	
														   	/////算出各市区的最低价并排序
															for(var p=0;p<optionCityBarArr.length;p++){
																var cityArr = optionCityBarArr[p].length>0?optionCityBarArr[p]:[0];
																optionCityBarData.push(Math.min.apply(null, cityArr));//最小值集合
															}
														}
													}
													optionCityBar.title.text=selectProvince+selectCity+"中标价趋势图";
													optionCityBar.series[0].data = optionCityBarData;
													myChartCityBar.setOption(optionCityBar, true);
		//										}else{
		//											layer.msg('无该省份数据，请上传后查看',{icon:7,shift:6});
		//										}
											}).error(function(data){
												layer.msg('请求超时，请稍后重试');
											})
										});
									}else{
										layer.msg('无该地区数据，请上传后查看',{icon:7,time:1000});
									}
								}else{	
									layer.msg('无该地区数据，请上传后查看',{icon:7,time:1000});
								}
							}).error(function(data){
								layer.msg('计算错误，请刷新重试',{icon:7,shift:6});
							})
						})
					}else{
						layer.msg('无可计算数据，请核对数据再重新计算',{icon:7,shift:6});
					}
				}).error(function(data){
					layer.msg('计算错误，请刷新重试',{icon:7,shift:6});
				})
			}else{
				layer.closeAll('loading');
//				var ErrArr = data.bean.split(';');
//				ErrArr.pop();
//				var htmlArr = '';
//				var nullArr = data.notExistHistory;
//				for(var i=0;i<ErrArr.length;i++){
//					htmlArr+='<div class="fl errL">'+ErrArr[i]+'</div>'
//				}
				var ErrArr = data.notExistHistory.split(';');
				ErrArr.pop();
				var nullArr = '';
				for(var i=0;i<ErrArr.length;i++){
					nullArr+='<div class="fl errL">'+ErrArr[i]+'</div>'
				}
				layer.open({
				  	type: 1,
				  	title:"错误信息",
				  	skin:"errorInfo",
					btn:["完善数据","弃标"],
				  	area: ['500px', 'auto'],
				  	cancel:false,
//				  	content: '<div class="errHintTitle fwb">以下开标省市上限价/参考价无法计算</div><div class="errList computeErrList clearfix">'+nullArr+'</div><div class="el" ><div class="fwb" style="margin:0 1% 5px;">无法计算原因</div><div class="errList computeErrList clearfix">'+htmlArr+'</div></div><div class="errHintTitle fwb">请完善参考区域的数据或者弃标后重新计算</div>',
				  	content: '<div class="errHintTitle fwb">以下开标省市上限价/参考价无法计算</div><div class="errList computeErrList clearfix">'+nullArr+'</div><div class="errHintTitle fwb">请完善参考区域的数据或者弃标后重新计算</div>',
					yes:function(index,obj){
						layer.close(index);
					},
					btn2:function(){
						$scope.startCalculate(1);
					}
				})
			}
		})
		.error(function(data,re,ra){
			
			layer.closeAll('loading');
			layer.alert('内部服务器错误 ,点击确定刷新重试', {
				title:'错误提示',
			  	skin: 'layui-layer-lan', //样式类名
			  	closeBtn: 0
				},function(index){
					$scope.searchMedData();
					layer.close(index);
				}
			);
			
		})
	}
	
	
	
	
	
	
	
	
	//展开列表
	$scope.showList = function(e){
		if($(e.target).html()=='收起'){
			$(e.target).html('展开');
			var TBox = $('.content .detailsInfoBox .tableBg .tableHeight');
			var THeight = TBox.find('#bidList').find('thead').css('height');
			$('.content .detailsInfoBox .tableBg .tableHeight').animate({maxHeight:THeight,minHeight:THeight},'slow');
		}else{
			$(e.target).html('收起');
			$('.content .detailsInfoBox .tableBg .tableHeight').animate({maxHeight:'100%'},'slow');
		}
		
	}
	
	//历史数据编辑
	$scope.editHistory = function(obj){
		//保存初始值 便于恢复
		var Dyear = obj.tenderYear,
			Dmonth = obj.tenderMonth,
  			DbiddingPrice = obj.tenderPrice;
		
		$scope.objHisMedList = obj
		var mep = $compile(
				'<table class="table" id="hisMedEditPromp">'+
				'	<thead>'+
				'		<tr>'+
				'			<th>开标年</th>'+
				'			<th>开标月</th>'+
				'			<th>省</th>'+
				'			<th>市</th>'+
				'			<th>中标价</th>'+
				'			<th>操作</th>'+
				'		</tr>'+
				'	</thead>'+
				'	<tbody>'+
				'		<tr>'+
				'			<td class="w2">'+
				'				<input type="text" ng-model="objHisMedList.tenderYear" id="aaa" onclick = "WdatePicker({onpicked: function(){$(this).trigger(\'change\')},dateFmt: \'yyyy\'})"/>'+
				'			</td>'+
				'			<td class="w1"><select ng-options="m for m in Month" ng-model="objHisMedList.tenderMonth"></select></td>'+
				'			<td>{{objHisMedList.province}}</td>'+
				'			<td>{{objHisMedList.city}}</td>'+
				'			<td class="w2"><input type="number" min="0" ng-model="objHisMedList.tenderPrice"/></td>'+
				'			<td>'+
				'				<a href ng-click="completeHisEdit(objHisMedList,hisDelPromp)">完成</a>'+
				'			</td>'+
				'		</tr>'+
				'	</tbody>'+
				'</table>'
				
				)($scope);
		mep.appendTo('body');
		layer.open({
		  	type: 1,
		  	title:false,
		  	skin:'hisMedEditPromp',
		  	area: ['900px', '80px'],
		  	content:mep,
		  	success:function(layero, index){
		  		$scope.hisDelPromp = index;
		  	},
		  	end:function(){
		  		$("#hisMedEditPromp").remove();
		  	},
		  	cancel:function(){
		  		//恢复编辑前
		  		$scope.objHisMedList.tenderYear = Dyear;
		  		$scope.objHisMedList.tenderMonth = Dmonth;
		  		$scope.objHisMedList.tenderPrice = DbiddingPrice;
		  		$scope.$apply();
		  	}
		})
	}
	//完成历史编辑
//	$scope.completeHisEdit = function(obj,hisPrompIndex){
//		obj.tenderPrice=obj.tenderPrice||null;
//		$http.post(lUrl+'/tenderPriceForecast/history/edit',
//			{'userId':sessitionInfo.userId,
//			'tenderYear':obj.tenderYear,
//			'tenderMonth':obj.tenderMonth,
//			'tenderPrice':obj.tenderPrice,
//			'tenderId':obj.Id})
//		.success(function(data){
//			if(data.backHttpResult.code==000){
//				layer.close(hisPrompIndex);
//			}
//		})
//	}
	
	
	
	
	
	//重新上传文件
	$scope.reUploadFile = function(){
		$scope.uploadFileName = "";//获取上传文件名字
		$scope.showFN = '';//文件名字
		$scope.uploadFTrue = false;//文件处于未上传状态
//		$scope.fileName='';
		var RUF = $compile(
			'<div id="reUpload">'+
			'	<div class="uploadBox">'+
			'		<form id="uploadFiles" method="post" enctype="multipart/form-data">'+
			'			<div class="inputFileBox"><input type="file" name="filename" class="addAnInputFile" onchange="angular.element(this).scope().changeF(this)" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/></div>'+
			'			<button type="button" class="btn btn-danger uploadBtn" ng-click="uploadBtn()" >上传</button>'+
			'		</form>'+	
			'		<div class="fileNameBox"><span class="reUploadFileName">{{showFN}}</span></div>'+
			'	</div>'+
			'	<div class="templateBox"><a ng-click="downloadModel()" class="downloadTemplate">模板下载.xls</a></div>'+
			'</div>')($scope);
		RUF.appendTo('body');
		layer.open({
		  	type: 1,
		  	skin:'reUpload',
		  	title:"上传历史表",
			btn:["确定","取消"],
		  	area: ['340px', '200px'],
		  	content:RUF,
			yes:function(index,layero){
				//当前选择dep的id
				var nowMedId = $location.search().med;
				if($scope.uploadFTrue){//上传文件
					//上传数据需确认						////////////再加一个文件id
						
					for(var i=0;i<$scope.medList.length;i++){
						if(nowMedId==$scope.medList[i].medicineId){
							var CurrentMed = $scope.medList[i];
						}
					}
					$http.post(lUrl+'/tenderPriceForecast/history/import',{"userId":sessitionInfo.userId,'medicineId':nowMedId,'id':$scope.fileId})
					.success(function(data){
//						$scope.viewHistory(CurrentMed);
						$scope.showStatusHis=true;
						$scope.showStatusList=false;
						$scope.hisSearch();
						layer.alert('历史数据是系统必须的数据，你可以在后续操作中上传历史数据或修改历史数据', {
				  			skin: 'layui-layer-lan' //样式类名
				  			,closeBtn: 0,
				  			btn:'进入操作台'
						});
						layer.close(index);
						if(data.backHttpResult.result!='success'){
							layer.msg(data.backHttpResult.result,{ time:2000,icon:7,offset:'50px',shift:6});
						}	
					})
					.error(function(){
						layer.msg('服务器异常，请刷新后重新登录',{icon:7,shift:6});
					})
				}else{
					layer.msg('请选择上传文件，或跳过此步骤',{time: 2000, icon:7,offset:'50px',shift:6});
					return false;
				}
				
			},
			end:function(){
				$('#reUpload').remove();
			}
		});
	}

	
	
//	全选 多选
//	详情页table
	//点击一级列表 全选/取消全选
	$scope.checkAll = function(e){
		$(e.target).parents(".tableTitle").siblings(".tableBg").find("input.singleSel").prop("checked",$(e.target).get(0).checked?true:false);
		selMedIds = [];
		if($(e.target).prop('checked')){
			var allMed = $scope.hisData;
			var qibiao = $('.content .detailsInfoBox .tableBg #bidList tbody tr');
			for(var i=0;i<allMed.length;i++){
				if(!$(qibiao[i]).children('td').find('.edit').prop('disabled')){
					selMedIds.push(parseInt(allMed[i].id));
				}
			}
		}
	}
	//点击二级列表
	$scope.checkSin = function(e,obj){
	
		//声明变量len 保存二级列表数量
		var len = $(e.target).parents("tbody").children('.sinTr').length;
		//声明变量ckLen 保存每个一级菜单下的二级菜单选中的数量
		var ckLen = 0;
//		for(var i=0;i<len;i++){
			ckLen = $(e.target).parents("tbody").find("td input:checked").length;
//		}
		if($(e.target).prop('checked')){
			selMedIds.push(parseInt(obj.id));
		}else{
			//当前元素在数组中的位置
			var objIndex = $.inArray(obj.id,selMedIds)
			selMedIds.splice(objIndex,1);
		}
		//判断二级列表是否全部选中 改变一级列表选中状态 
		$(e.target).parents(".tableBg").siblings('.tableTitle').find("#allSel").prop("checked",ckLen==len?true:false);
	}
	/******全选反选结束*****/
	
}])




















