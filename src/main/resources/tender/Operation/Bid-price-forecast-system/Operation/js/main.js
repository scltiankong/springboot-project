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
	$urlRouterProvider.otherwise("/um");
	$stateProvider
		.state('toLogin',{
			url: "",  
            templateUrl: 'login.html', 
            controller:'loginCtrl'
		})
		.state('toOperation',{
			url:'/Operation',
			templateUrl:'index_operation.html',
			controller:'operationCtrl'
		})
		.state('toOperation.userM',{
			url:'/um',
			templateUrl: "page/userManagement.html", 
//          controller:'operationCtrl'
		})
		.state('toOperation.rulesM',{
			url:'/rm',
			templateUrl: "page/rulesManagement.html", 
//          controller:'operationCtrl'
		});
}])
.controller('allCtrl',['$scope','$state','$cookies','$http','$location',function($scope,$state,$cookies,$http,$location){
	//如果存在cookie 页面直接跳转
	if($cookies.get("ManagerLoginAccount")){
		var loginAt = JSON.parse($cookies.get("ManagerLoginAccount"));
		var saveSession = sessionStorage.getItem("loginInfo");
		if(!saveSession){
//			if(loginAt.isManager==1){
					window.location.href="index.html#/Operation/um";
					sessionStorage.setItem("loginInfo",JSON.stringify(loginAt));
//			}else{
//				layer.msg('账户信息不匹配,无法自动登录，请重新登录',{icon:7,shift:6});
//			}
		}
	}
}])
////////////itemIndex.value()类似$rootScope
itemIndex.controller('loginCtrl',['$scope','$http','$cookies','$state','$location',function($scope,$http,$cookies,$state,$location){
	$scope.userData = {};//保存登录信息
	$scope.loginErrInfo = false;//错误提示框显示状态
	$scope.userData.loginStatus = true;//默认登录状态
	//点击登录按钮
	$scope.submitLogin = function(){
		var Url = lUrl+'/tenderPriceForecast/sysUser/loginIn';
		$http.post(Url,{"loginAccount":$scope.userData.name,'password':$scope.userData.pwd})
		.success(function(data,status,headers,config){
			var callBackCode = data.backHttpResult.code;
			$scope.errorInfo = data.backHttpResult.result;
			if(callBackCode==000){
//				if(data.bean[0].isManager==1){
					//记录登录账号
	//				var dataBean = data.bean[0];
					sessionStorage.setItem('loginInfo',JSON.stringify(data.bean[0]));
					
					if($scope.userData.loginStatus){
						var expireDate = new Date();
						expireDate.setDate(expireDate.getDate() + 14);
						$cookies.put("ManagerLoginAccount",JSON.stringify(data.bean[0]),{'expires': expireDate.toUTCString()});//14天后过期
					}else{
						$cookies.remove("ManagerLoginAccount");
					}
					$state.go('toOperation.userM');
					$scope.menuIndex = 0;
//				}else{
//					layer.msg('账户信息不匹配，请重新输入',{icon:7,shift:6});
//				}
			}else{
				$scope.loginErrInfo = true;
			}
		}).error(function(){
			layer.msg('登录失败，确认网络连接后重新登录',{icon:7,shift:6});
		})
	}
	//点击输入框隐藏错误信息
	$scope.inputInfo = function(){
		$scope.loginErrInfo = false;
	}
	
}])




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


itemIndex.controller('operationCtrl',['$scope','$compile','$http','$location','$state','$cookies',function($scope,$compile,$http,$location,$state,$cookies){


	$scope.infoNum = infoNum;//每页显示条数
	$scope.page = {	'pageSize':$scope.infoNum[0],
					'pageIndex':1,
					'paraCond':'',
					'startTenderTime':'',
					'endTenderTime':'',
					'province':'',
					'city':'',
					'medicineTypeCode':'',
					'modeCode':'',
					'selRulesIds':[]};
	$scope.viewRules = {
					mode:'',
					modeId1:1,//竞价
					modeId2:2,//谈判
					modeId3:3,//议价
					selAreaIds:[],
				};

	var sessitionInfo = jQuery.parseJSON(sessionStorage.getItem('loginInfo'));
	//省集合
	$scope.AreaProvince = areaProvince;
	
	//省市联动
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
	
	
	
	
	
	
	
	
	
	//初始密码
	$scope.password=123456;
	
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
	
    //时间转换   毫秒-年月日时分秒 (new Date(data[i].creationTime)).Format("yyyy-MM-dd hh:mm:ss.S")   
    Date.prototype.Format = function (fmt) { //author: meizz    
        var o = {    
            "M+": this.getMonth() + 1, //月份    
            "d+": this.getDate(), //日    
            "h+": this.getHours(), //小时    
            "m+": this.getMinutes(), //分    
            "s+": this.getSeconds(), //秒    
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度    
            "S": this.getMilliseconds() //毫秒    
        };    
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));    
        for (var k in o)    
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));    
        return fmt;    
    };    
    
    
	//用户查询/用户搜索
	$scope.userSearch = function(){
		if(sessionStorage.length==0){
			$state.go('toLogin');
			window.location.hash='';
			return;
		}
		var UrlKeys = ['pageIndex','pageSize','paraCond','contactPerson'];
		var UrlVal = [$scope.page.pageIndex,$scope.page.pageSize,$scope.page.paraCond]
		var addUrl = AUrl(UrlKeys,UrlVal);
		
		$http.get(lUrl+'/tenderPriceForecast/sysUser/finduserlist?userId='+sessitionInfo.userId+addUrl)
		.success(function(data){
			if(data.rows.length>0){
				///////数据查询的返回数据
				$scope.userInfo = data.rows;
				$scope.loginName = sessitionInfo.userName;//在个人中心保存登录名
				//数据条数显示
			}else{
				layer.msg('无相关记录',{time: 1000, icon:5,shift:6});
			}
			$scope.totalPageNum = Math.ceil(data.total/$scope.page.pageSize);//显示总页数
			
		})
		.error(function(data){
			layer.msg('连接失败，请检查网络',{icon:7});
		})
	}
	
	//规则查询
	$scope.rulesSearch = function(x,y){
		if(x){
			$scope.page.pageIndex = x;
			$scope.page.pageSize = y;
		}
		if(!sessitionInfo){
			layer.msg('登录信息失效，请重新登录',{icon:7})
			$state.go('toLogin');
			window.location.hash='';
		}
		var urlKeys = ['pageIndex','pageSize','startTenderTime','endTenderTime','provinceCode','cityCode','medicineTypeCode','modeCode'];
		if(!$scope.page.province){
			$scope.page.province=[{'provinceCode':''}];
		}
		if(!$scope.page.city){
			$scope.page.city=[{'cityCode':''}];
		}
		if(!$scope.page.medicineTypeCode){
			$scope.page.medicineTypeCode=[{'id':''}];
		}
		if(!$scope.page.modeCode){
			$scope.page.modeCode=[{'id':''}];
		}
		var urlVals = [$scope.page.pageIndex,$scope.page.pageSize,$scope.page.startTenderTime,$scope.page.endTenderTime,$scope.page.province.provinceCode,$scope.page.city.cityCode,$scope.page.medicineTypeCode.id,$scope.page.modeCode.id];
		var addUrl = AUrl(urlKeys,urlVals);
		$http.get(lUrl+'/tenderPriceForecast/rule/findList?userId='+sessitionInfo.userId+addUrl)
		.success(function(data){
			$scope.rulesList = data.rows;
			$scope.totalPageNum = Math.ceil(data.total/$scope.page.pageSize);//显示总页数
			$scope.loginName = sessitionInfo.userName;//在个人中心保存登录名
		})
		.error(function(data){
			layer.msg('连接失败，请检查网络',{icon:7});
		})
	}
	//页面刷新状态	
	$scope.menuIndex = 0;
	if($location.path().indexOf('/Operation/')>=0){
		var urlHash = $location.path().slice(-2);
		if(urlHash == 'um'){
			$scope.menuIndex = 0;
			$scope.userSearch();
		
		}else if(urlHash == 'rm'){
			$scope.menuIndex = 1;
			$scope.rulesSearch();
		}
	}

	//切换左侧导航
	$scope.menuChecked = function(e){
		$scope.menuIndex = $(e.target).parents('li').index();
		if($scope.menuIndex==0){
			$scope.page.pageSize = $scope.infoNum[0];
			$scope.page = {	'pageSize':$scope.infoNum[0],
							'pageIndex':1,
							'paraCond':'',
							'startTenderTime':'',
							'endTenderTime':'',
							'province':'',
							'city':'',
							'medicineTypeCode':'',
							'modeCode':'',
							'selRulesIds':[]};
			$scope.userSearch();
		}else if($scope.menuIndex==1){
			$scope.page.pageSize = $scope.infoNum[0];
			$scope.page = {	'pageSize':$scope.infoNum[0],
							'pageIndex':1,
							'paraCond':'',
							'startTenderTime':'',
							'endTenderTime':'',
							'province':'',
							'city':'',
							'medicineTypeCode':'',
							'modeCode':'',
							'selRulesIds':[]};
			$scope.rulesSearch();
		}
	}
	
	
	//获取药物类别
	$scope.getType = function(){
		if(!sessitionInfo){
			layer.msg('登录信息失效，请重新登录',{icon:7})
			$state.go('toLogin');
			window.location.hash='';
		}
		$http.get(lUrl+'/tenderPriceForecast/rule/findmtList?userId='+sessitionInfo.userId)
		.success(function(data){
			$scope.medCategory = data.rows;
		})
	}
	//获取模式
	$scope.getModel = function(){
		$http.get(lUrl+'/tenderPriceForecast/rule/findModeList?userId='+sessitionInfo.userId)
		.success(function(data){
			$scope.biddingMode = data.rows;
			$scope.viewRules.mode = data.rows[0];
		})
	}
	$scope.getType();
	$scope.getModel();
	
	//退出
	$scope.exit = function(){
		layer.confirm('确定退出用户登录吗？', {
		  	btn: ['确定','取消'] 
		}, function(index,layero){
		  	$http.get(lUrl+'/tenderPriceForecast/sysUser/loginOut',{'userId':sessitionInfo.userId})
			.success(function(data){
				if(data.backHttpResult.code==000){
					$state.go('toLogin');
					window.location.hash='';
					layer.close(index);
					$cookies.remove("ManagerLoginAccount");
					sessionStorage.removeItem('loginInfo');
				}else{
					layer.msg(data.backHttpResult.result, {time: 1000, icon:5,shift:6});
				}
			})
		});
	}
	
	//删除搜索词
	$scope.removeKeywords = function(){
		$scope.page.keywords = "";
		$('.inputSearch').focus();
	}
	
	
	
	//新建用户账号
	$scope.newUI = function(){
		$scope.newUserName = '';
		$scope.loginAccount = '';
		var newUIB = $compile('<div class="newUIPromp">'+
						'<form>'+
						'	<div class="relative"><label>用户名称</label><input type="text" name="newUserName" class="newInput" placeholder="请输入医药工业公司名称" ng-model="userName" required/></div>'+
						'	<div class="relative"><label>用户账号</label><input type="text" name="newUserAccount" class="newInput" placeholder="请设置用户登录账号" ng-model="loginAccount" required/></div>'+
						'	<div class="relative"><label>用户密码</label><input type="text" name="newUserPwd" class="newInput" ng-model="password" required/></div>'+
						'	<div class="relative pwdHint" >密码为6到12位数字字母下划线组合</div>'+
						'	<div class="relative"><label>联系人</label><input type="text" name="newUserPerson" class="newInput" placeholder="请输入联系人姓名" ng-model="contactPerson" required/></div>'+
						'	<div class="relative"><label>联系方式</label><input type="text" name="newUserMobile" class="newInput" placeholder="请输入联系方式" ng-model="mobile" required/></div>'+
						'</form>'+
						'</div>')($scope);
			newUIB.appendTo('body');
		layer.open({
		  	type: 1,
		  	skin:'newUI',
		  	title:"新建用户",
		  	area: ['340px', '320px'],
		  	btn:['创建','取消'],
		  	content:newUIB,
			yes:function(index,layero){
				console.log($scope.mobile)
				//判断是否输入用户名或账号
				var regPwd = /^[\w]{6,12}$/;
				var regMobile = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[358]\d{9})$)/
				if(!$scope.userName||!$scope.password||!$scope.loginAccount||!$scope.contactPerson||!$scope.mobile){
					layer.msg('有未填充字段，请重新填写', {
					  	icon: 5,
					  	anim:6,
					  	time: 2000, //2秒关闭（如果不配置，默认是3秒）
					  	offset:'50px'
					}) 
					return false;
				}else{
					if(!regPwd.test($scope.password)){
						layer.msg('密码格式有误，请重新填写',{icon:6});
						return;
					}
					if(!regMobile.test($scope.mobile)){
						layer.msg('电话号码有误，请重新填写',{icon:6});
						return;
					}
					$http.post(lUrl+'/tenderPriceForecast/sysUser/create',{'loginAccount':$scope.loginAccount ,'userName':$scope.userName ,'password':$scope.password,'userId':sessitionInfo.userId,'contactPerson':$scope.contactPerson,'mobile':$scope.mobile})
					.success(function(data){
						if(data.backHttpResult.code==000){
							layer.close(index);
							$scope.userSearch();
							$scope.viewInfo($scope);
						}else{
							layer.msg(data.backHttpResult.result,{time: 2000, icon:5,offset:'100px',shift:6});
						}
					})
					.error(function(){
						layer.msg('请求失败，请刷新重试',{icon:7,shift:6});
					})
				}	
			},
			end:function(){
				$('.newUIPromp').remove();
			}
		});
	};
	//查看个人信息
	$scope.viewInfo = function(obj){
		console.log(obj)
		layer.open({
//		  	type: 1,
		  	skin:'viewInfo',
		  	area: ['auto', 'auto'],
		  	title: false, 
		  	btn:false,
		  	content: 
				'<table>'+
				'	<tbody>'+
				'		<tr class="line">'+
				'			<td class="lineL">用户名称</td>'+
				'			<td>'+obj.userName+'</td>'+
				'		</tr>'+
				'		<tr class="line">'+
				'			<td class="lineL">用户账号</td>'+
				'			<td>'+obj.loginAccount+'</td>'+
				'		</tr>'+
				'		<tr class="line">'+
				'			<td class="lineL">联系人</td>'+
				'			<td>'+obj.contactPerson+'</td>'+
				'		</tr>'+
				'		<tr class="line">'+
				'			<td class="lineL">联系电话</td>'+
				'			<td>'+obj.mobile+'</td>'+
				'		</tr>'+
//				'		<tr class="line">'+
//				'			<td class="lineL">创建时间</td>'+
//				'			<td>'+new Date(obj.createTime).Format("yyyy-MM-dd hh:mm:ss")+'</td>'+
//				'		</tr>'+
				'	</tbody>'+
				'</table>'
		});
	}
	
	//重置密码
	$scope.resetPwd = function(obj){
		var pwd = $compile(
				'	<div id="resetPwd">'+	
				'		<div class="resetPL"><span>管理员密码</span><input type="text" class="rePwdInput" placeholder="请输入管理员密码" ng-model="ManagerPwd"></div>'+
				'		<div class="resetPL"><span>用户新密码</span><input type="text" class="rePwdInput" placeholder="请输入用户新密码" ng-model="UserPwd"></div>'+
				'		<div class="pwdHint">密码由6-12位数字字母下划线组成</div>'+
				'	</div>'
				)($scope);
		pwd.appendTo('body');
		layer.open({
			type:1,
			btn:['确定','取消'],
			skin:'ResetPwd',
			area:['auto','auto'],
			title:'重置密码',
			content:pwd,
			yes:function(index){
				var regExp=/^[\w]{6,12}$/;
				if(!$scope.ManagerPwd){
					layer.msg('管理员密码不能为空',{time: 1000, icon:5,offset:'100px',shift:6})
				}else{
					console.log(!regExp.test($scope.UserPwd))
					if((!$scope.UserPwd)||!regExp.test($scope.UserPwd)){
						layer.msg('密码由6-12位数字字母下划线组成', {time: 1000, icon:5,offset:'100px',shift:6});
						return false;	
					}else{
						//重置密码接口
						$http.post(lUrl+'/tenderPriceForecast/sysUser/resetPwd',{'userId':obj.userId,'parentId':sessitionInfo.userId,'password':$scope.UserPwd,'managerPwd':$scope.ManagerPwd})
						.success(function(data){
							if(data.backHttpResult.code==000){
								layer.close(index);
								layer.msg('密码重置成功！',{icon:6});
							}else{
								layer.msg(data.backHttpResult.result,{time:1500,icon:6});
							}
						});
					}
				}
			},
			end:function(){
				$('#resetPwd').remove();
			}
			
		});
	}
	
	
	
	//上一页/下一页
	$scope.PrevOrNextPage = function(e){
		if($(e.target).hasClass('prevP')){
			if($scope.page.pageIndex==1){
				layer.msg('已经是第一页啦!',{icon:6,time:600});
				return;
			}else{
				$scope.page.pageIndex--;
				
				var locationUrl = $location.url();
				if(locationUrl.indexOf('rm')>=0){
					$scope.rulesSearch();
				}else if(locationUrl.indexOf('um')>=0){
					$scope.userSearch();
				}
			}
			
		}else if($(e.target).hasClass('nextP')){
			if($scope.page.pageIndex==$scope.totalPageNum){
				layer.msg('已经是最后一页啦!',{icon:6,time:600});
				return;
			}else{
				$scope.page.pageIndex++;
				
				var locationUrl = $location.url();
				if(locationUrl.indexOf('rm')>=0){
					$scope.rulesSearch();
				}else if(locationUrl.indexOf('um')>=0){
					$scope.userSearch();
				}
			}
		}
	}
	
	//每页信息条数选择
	$scope.changeSize = function(){
		$scope.page.pageIndex = 1;
		
		var locationUrl = $location.url();
		if(locationUrl.indexOf('rm')>=0){
			$scope.rulesSearch();
		}else if(locationUrl.indexOf('um')>=0){
			$scope.userSearch();
		}
		
	}
	//跳转页面
	$scope.skipPage = function(){
		console.log($scope.page.pageIndex)
		if($scope.page.pageIndex>$scope.totalPageNum||$scope.page.pageIndex<1||!$scope.page.pageIndex){
			layer.tips('页数超出范围，请重新输入', '.inputIndex', {
			  	tips: 1,
			  	time: 2000,
			  	area:['150px','60px']
			});
			$scope.page.pageIndex = 1;
		}
		
		var locationUrl = $location.url();
		if(locationUrl.indexOf('rm')>=0){
			$scope.rulesSearch();
		}else if(locationUrl.indexOf('um')>=0){
			$scope.userSearch();
		}
	}
	//////////////////////////////////////////////规则
	
	//上传规则表
	$scope.volumeUploadRules = function(){
		
		$scope.upload={
			isUploadFile:false,
			uploadFileName:'',
			showFN:'',
			fileId:''
		}
		var uf = $compile('<div class="addAnStep2">'+
		  				'<form method="post" enctype="multipart/form-data" id="uploadFiles">'+
						'	<div class="layui-tab layui-tab-card">'+
						'	  	<div class="layui-tab-content" style="height: 130px;">'+
						'	    	<div class="layui-tab-item layui-show">'+
						'				<div class="uploadBox">'+
						'					<div class="inputFileBox"><input type="file" name="filename" class="addAnInputFile" onchange="angular.element(this).scope().changeF(this)" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/></div>'+
						'					<button type="button" class="uploadBtn" ng-click="uploadBtn()">上传</button>'+
						'					<div class="fileNameBox"><span class="uploadFileName">{{upload.showFN}}</span></div>'+
						'				</div>'+
						'				<div class="templateBox"><a class="downloadTemplate" ng-click="downloadRulesModel()">模板下载.xls</a></div>'+
						'				<div class="note">注：重复的规则将进行覆盖</div>'+
						'			</div>'+
						'	  	</div>'+
						'	</div>'+
						'</form>'+
						'</div>')($scope);
		uf.appendTo('body');
		layer.open({
		  	type: 1,
		  	skin:'vuf',
		  	title:"上传规则表",
			btn:["确定","取消"],
		  	area: ['340px', '230px'],
		  	content: uf,
			yes:function(index,layero){
				if($scope.upload.isUploadFile){
					$http.post(lUrl+'/tenderPriceForecast/rule/import',{'userId':sessitionInfo.userId,'id': $scope.upload.fileId})
					.success(function(data){
						console.log(data)
						layer.close(index);
						$scope.rulesSearch();
					})
					.error(function(data){
						layer.msg('上传错误',{icon:5,shift:6})
					})
				}else{
					layer.msg('请先上传数据，再进行提交', {time: 1000, icon:5,shift:6});
				}
			},
			no:function(index,layero){
				layer.close(index);
			},
			end:function(){
				$('.addAnStep2').remove();
			}
		});
	}
	$scope.changeF = function(obj){
		var fileList = obj.files[0];
	   	if (window.FileReader) {    
            var reader = new FileReader();    
            reader.readAsDataURL(fileList);    
            //监听文件读取结束后事件    
          	reader.onloadend = function () {
          		$scope.upload.uploadFileName=fileList.name;
            }   
       	}
	}
	$scope.uploadBtn = function(){
		var fname = $scope.upload.uploadFileName;
		if(fname){
			var formData = new FormData(document.getElementById('uploadFiles'));
			formData.append("userId",sessitionInfo.userId);
			$.ajax({
	    	 	url:lUrl+'/tenderPriceForecast/rule/upload',
			    data: formData,
			    type: "post",
			    processData: false,
  		 		contentType: false,
			    success: function(data){
			    	if(data.backHttpResult.code!=000){
			    		errorInfo(data.backHttpResult.result);
			    	}else{
			    		$scope.upload.isUploadFile = true;//文件上传状态;
			    		$scope.upload.showFN = fname;
			    		$scope.$apply();
			    		///////
			    		$scope.upload.fileId = data.id;
			    	}
			    },
			    error:function(x,y,z){
			    	layer.msg('系统错误，请刷新后重新上传',{icon:7,shift:6});
			    }
			});
		}else{
			layer.msg('未选中文件',{time: 1000, icon:5,offset:'60px',shift:6})
			return false;
		}
	}
	
	
	
	//模板下载
	$scope.downloadRulesModel = function(){
		window.location = lUrl+'/tenderPriceForecast/rule/template?userId='+sessitionInfo.userId;
	}
	
	
	
	
	//修改规则修改
	$scope.amendRules = function(obj){
		console.log(obj)
		$scope.obj = obj;
		$scope.dMode = obj.modeCode;
		for(var i=0;i<$scope.biddingMode.length;i++){
			if(obj.modeCode==$scope.biddingMode[i].id){
				$scope.viewRules.mode = $scope.biddingMode[i];
			}
		}
		$scope.viewRules.MathML = MathML;
		$scope.viewRules.upperArea = obj.upperArea;
		$scope.viewRules.upperAreaId = obj.upperAreaId;
		$scope.viewRules.upperBargain = obj.upperBargain;
		$scope.viewRules.lrMathSymbol = obj.lrMathSymbol;
		//判断用户输入的>或者<是半角还是全角
		if(obj.lrMathSymbol.indexOf('＞')>=0){
			$scope.viewRules.lrMathSymbol = obj.lrMathSymbol.replace('＞','>');
		}else if(obj.lrMathSymbol.indexOf('＜')>=0){
			$scope.viewRules.lrMathSymbol = obj.lrMathSymbol.replace('＜','<');
		}
		$scope.viewRules.lrLinkageRegion = obj.lrLinkageRegion;
		$scope.viewRules.lrLinkageRegionId = obj.lrLinkageRegionId;
		$scope.viewRules.lrLinkageRefVal = obj.lrLinkageRefVal;
		$scope.viewRules.lrLinkageTiggerCondtion = obj.lrLinkageTiggerCondtion;
		$scope.viewRules.lrLinkageCycle = obj.lrLinkageCycle;
		$scope.viewRules.udLinkageArea = obj.udLinkageArea;
		$scope.viewRules.udLinkageAreaId = obj.udLinkageAreaId;
		$scope.viewRules.udLinkageRefVal = obj.udLinkageRefVal;
		$scope.viewRules.udLinkageTiggerCondtion = obj.udLinkageTiggerCondtion;
		$scope.viewRules.udLinkageCycle = $scope.obj.udLinkageCycle;
		$scope.viewRules.udMathSymbol = obj.udMathSymbol;
		//判断用户输入的>或者<是半角还是全角
		if(obj.udMathSymbol.indexOf('＞')>=0){
			$scope.viewRules.udMathSymbol = obj.udMathSymbol.replace('＞','>');
		}else if(obj.udMathSymbol.indexOf('＜')>=0){
			$scope.viewRules.udMathSymbol = obj.udMathSymbol.replace('＜','<');
		}
		$scope.viewRules.upTenderPriceRatio = $scope.obj.upTenderPriceRatio;
//		$scope.viewRules.oLinkageArea = $scope.obj.oLinkageArea;
//		$scope.viewRules.oLinkageCycle = $scope.obj.oLinkageCycle;
//		$scope.viewRules.oLinkageRefVal = $scope.obj.oLinkageRefVal;
//		$scope.viewRules.oLinkageTiggerCondtion = $scope.obj.oLinkageTiggerCondtion;
//		$scope.viewRules.oMathSymbol = $scope.obj.oMathSymbol;
		
		$scope.newAreaList = $scope.areaList = areaChange();
		console.log($scope.newAreaList)
		//每个市数组里 加入省级		
		for(var i=0;i<$scope.newAreaList.length;i++){
//			console.log($scope.newAreaList[i][0])
//			$scope.newAreaList[i][0].City =$scope.newAreaList[i][0].Province + $scope.newAreaList[i][0].City;//如果省级  不加前面省市 比如河北省级只写成省级 拼接字符串
//			var sjObj = {
//				Province:sjName,
//				City:sjName+'省级',
//				cityCode:sjCode+'00',
//				provinceCode:sjCode
//			}
//			$scope.newAreaList[i].unshift(sjObj);//新的各省份内市区集合
			if($scope.newAreaList[i].length==2){
				$scope.newAreaList[i].pop();
			}
		}
		
		$scope.rulesProvince = areaProvince;
		
		var amendRules = $compile(
			'<div class="rulesBox">'+
			'	<div>'+
			'		<div class="rules1"><span>模式 : </span>'+
			'			<select ng-model = "viewRules.mode" ng-options="obj.name for obj in biddingMode" ng-change="toggleMode(viewRules.mode)">'+
			'			</select>'+
			'		</div>'+
			'	</div>'+
			'	<div class="layui-tab layui-tab-card Tender" ng-if="viewRules.modeId1==viewRules.mode.id">'+
			'	  	<ul class="layui-tab-title">'+
			'	    	<li class="layui-this tab1" ng-click="tabChange($event)">初始中标价规则</li>'+
			'	    	<li class="tab2" ng-click="tabChange($event)">联动规则</li>'+
			'	  	</ul>'+
			'	  	<div class="layui-tab-content">'+
			'	    	<div class="layui-tab-item layui-show">'+
			'				<div class="rulesLine">'+
			'					<span class="rulesL">参考区域</span>'+
			'					<div class="rulesR relative">'+
			'						<input ng-model="viewRules.upperArea" readonly="readonly" class="imp CKArea" ng-focus="addArea($event)" ng-click="notHide($event)"  ng-mouseover="showArea($event)" ng-mouseleave="hideArea($event,areaIndex)"/>'+
			'						<div class="areaPopup" ng-click="notHide($event)">'+
					'					<div class="searchBox"><input class="search" type="search" placeholder="搜索"	 ng-model="cityKeyWords" ng-change="areaSearch(cityKeyWords)"/></div>'+
					'					<div class="areaList">'+
					'						<div class="AllA"><label><input class="lev1" type="checkbox" ng-model="selectedNationwide" ng-click="selAllArea(selectedNationwide,$event)"/>全国</label></div>'+
					'						<ul class="eachProvince">'+
					'							<li ng-repeat="prov in newAreaList" class="len len2">'+
					'								<span class="glyphicon glyphicon-plus" ng-click="SHCity($event)"></span>'+
					'								<label class="provLabel"><input class="lev2" type="checkbox" ng-checked="selectedProv{{$index}}" ng-click="selPC(newAreaList,prov,$event)"/>{{prov[0].Province}}</label>'+
					'								<ul class="cityA">'+
					'									<li ng-repeat="city in prov" class="cityLine len len3"><label><input class="lev3" type="checkbox" ng-click="selPC(prov,city,$event)"/>{{city.City}}</label></li>'+
					'								</ul>'+
					'							</li>'+
					'						</ul>'+
					'					</div>'+
					'					<div class="popupBtnBox clearfix">'+
					'						<input class="fr popupBtn" type="button" value="确定" ng-click="areaSure($event)">'+
					'					</div>'+
			'						</div>'+
			'					</div>'+
			'				</div>'+
			'				<div class="rulesLine">'+
			'					<span class="rulesL">参考价</span>'+
			'					<div class="rulesR relative">'+
			'						<input ng-model="viewRules.upperBargain" readonly="readonly" class="imp CKValue" ng-focus="addRef($event)" ng-click="notHide($event)"/>'+
			'						<div class="areaPopup" ng-click="notHide($event)">'+
			
			'						</div>'+
			'					</div>'+
			'				</div>'+
			'				<div class="rulesLine"><span class="rulesL">中标价比例</span><span class="rulesAreaR"><input type="text" ng-model="viewRules.upTenderPriceRatio" class="lowerValue tenderRatio"/></span></div>'+
			'			</div>'+
			'	    	<div class="layui-tab-item">'+
			'			<div class="LDBox LRLinkage">'+
			'				<div class="rulesAreaLine rulesLine"><span class="rulesAreaL between">左右联动规则</span><span class="rulesAreaR hr"><hr></span><button type="button" class="btn-ld btn btn-danger btn-xs LRLinkage LD"  ng-click="isLD($event)">取消联动</button></div>'+
			'				<div class="rulesAreaLine rulesLine">'+
			'					<span class="rulesAreaL ">联动区域</span>'+
			'					<div class="rulesR relative">'+
			'						<input ng-model="viewRules.lrLinkageRegion" readonly="readonly" class="imp LRArea" ng-focus="addArea($event)" ng-click="notHide($event)"  ng-mouseover="showArea($event)" ng-mouseleave="hideArea($event,areaIndex)"/>'+
			'						<div class="areaPopup" ng-click="notHide($event)">'+
					'					<div class="searchBox"><input class="search" type="search" placeholder="搜索"	 ng-model="cityKeyWords" ng-change="areaSearch(cityKeyWords)"/></div>'+
					'					<div class="areaList">'+
					'						<div class="AllA"><label><input class="lev1" type="checkbox" ng-model="selectedNationwide" ng-click="selAllArea(selectedNationwide,$event)"/>全国</label></div>'+
					'						<ul class="eachProvince">'+
					'							<li ng-repeat="prov in newAreaList" class="len len2">'+
					'								<span class="glyphicon glyphicon-plus" ng-click="SHCity($event)"></span>'+
					'								<label class="provLabel"><input class="lev2" type="checkbox" ng-checked="selectedProv{{$index}}" ng-click="selPC(newAreaList,prov,$event)"/>{{prov[0].Province}}</label>'+
					'								<ul class="cityA">'+
					'									<li ng-repeat="city in prov" class="cityLine len len3"><label><input class="lev3" type="checkbox" ng-click="selPC(prov,city,$event)"/>{{city.City}}</label></li>'+
					'								</ul>'+
					'							</li>'+
					'						</ul>'+
					'					</div>'+
					'					<div class="popupBtnBox clearfix">'+
					'						<input class="fr popupBtn" type="button" value="确定" ng-click="areaSure($event)">'+
					'					</div>'+
			'						</div>'+
			'					</div>'+
			'				</div>'+
			'				<div class="rulesAreaLine rulesLine">'+
			'					<span class="rulesAreaL">联动参考值</span>'+
			'					<div class="rulesR relative">'+
			'						<input ng-model="viewRules.lrLinkageRefVal" readonly="readonly" class="imp LRValue" ng-focus="addRef($event)" ng-click="notHide($event)"/>'+
			'						<div class="areaPopup" ng-click="notHide($event)">'+
			'						</div>'+
			'					</div>'+
			'				</div>'+
			'				<div class="rulesAreaLine rulesLine">'+
			'					<span class="rulesAreaL ">联动范围</span>'+
			'					<select ng-model="viewRules.lrMathSymbol" ng-options="mathML for mathML in viewRules.MathML" class="LRScope">'+
			'					</select>'+
			'					<input type="text" class="rangeInput" ng-model="viewRules.lrLinkageTiggerCondtion"/>'+
			'				</div>'+
			'				<div class="rulesAreaLine rulesLine"><span class="rulesAreaL ">联动周期</span><div class="rulesR" ><input type="text"  class="ml4 LRTime" ng-model="viewRules.lrLinkageCycle" /></div></div>'+
			'			</div>'+
			'			<div class="LDBox UDLinkage">'+
			'				<div class="rulesAreaLine rulesLine"><span class="rulesAreaL  between">上下联动规则</span><span class="rulesAreaR hr"><hr></span><button type="button" class="btn-ld btn btn-danger btn-xs UDLinkage LD"  ng-click="isLD($event)">取消联动</button></div>'+
			'				<div class="rulesAreaLine rulesLine">'+
			'					<span class="rulesAreaL ">联动区域</span>'+
			'					<div class="rulesR relative">'+
			'						<input ng-model="viewRules.udLinkageArea" readonly="readonly" class="imp UDArea" ng-focus="addArea($event)" ng-click="notHide($event)" ng-mouseover="showArea($event)" ng-mouseleave="hideArea($event,areaIndex)"/>'+
			'						<div class="areaPopup" ng-click="notHide($event)" >'+
					'					<div class="searchBox"><input class="search" type="search" placeholder="搜索"	 ng-model="cityKeyWords" ng-change="areaSearch(cityKeyWords)"/></div>'+
					'					<div class="areaList">'+
					'						<div class="AllA"><label><input class="lev1" type="checkbox" ng-model="selectedNationwide" ng-click="selAllArea(selectedNationwide,$event)"/>全国</label></div>'+
					'						<ul class="eachProvince">'+
					'							<li ng-repeat="prov in newAreaList" class="len len2">'+
					'								<span class="glyphicon glyphicon-plus" ng-click="SHCity($event)"></span>'+
					'								<label class="provLabel"><input class="lev2" type="checkbox" ng-checked="selectedProv{{$index}}" ng-click="selPC(newAreaList,prov,$event)"/>{{prov[0].Province}}</label>'+
					'								<ul class="cityA">'+
					'									<li ng-repeat="city in prov" class="cityLine len len3"><label><input class="lev3" type="checkbox" ng-click="selPC(prov,city,$event)"/>{{city.City}}</label></li>'+
					'								</ul>'+
					'							</li>'+
					'						</ul>'+
					'					</div>'+
					'					<div class="popupBtnBox clearfix">'+
					'						<input class="fr popupBtn" type="button" value="确定" ng-click="areaSure($event)">'+
					'					</div>'+
			'						</div>'+
			'					</div>'+
			'				</div>'+
			'				<div class="rulesAreaLine rulesLine">'+
			'					<span class="rulesAreaL">联动参考值</span>'+
			'					<div class="rulesR relative">'+
			'						<input ng-model="viewRules.udLinkageRefVal" readonly="readonly" class="imp UDValue" ng-focus="addRef($event)" ng-click="notHide($event)"/>'+
			'						<div class="areaPopup" ng-click="notHide($event)">'+
			'						</div>'+
			'					</div>'+
			'				</div>'+
			'				<div class="rulesAreaLine rulesLine">'+
			'					<span class="rulesAreaL ">联动范围</span>'+
			'					<select ng-model="viewRules.udMathSymbol" ng-options="mathML for mathML in viewRules.MathML"  class="UDScope">'+
			'					</select>'+
			'					<input type="text" class="rangeInput" ng-model="viewRules.udLinkageTiggerCondtion"/>'+
			'				</div>'+
			'				<div class="rulesAreaLine rulesLine"><span class="rulesAreaL ">联动周期</span><div class="rulesR" ><input class="ml4 UDTime" type="text"  ng-model="viewRules.udLinkageCycle" /></div></div>'+
			'			</div>'+
//			'			<a class="addRules" ng-click="addRules($event)">添加规则</a>'+
			'			</div>'+
			'	  	</div>'+
			'	</div>'+
			'	<div class="layui-tab layui-tab-card Follow" ng-if="viewRules.modeId2==viewRules.mode.id">'+
			'	  	<ul class="layui-tab-title">'+
			'	    	<li class="layui-this">跟随模式</li>'+
			'	  	</ul>'+
			'		<div class="layui-tab-content">'+
			'	    	<div class="layui-tab-item layui-show">'+
			'				<div class="rulesLine">'+
			'					<span class="rulesL">跟随区域</span>'+
			'					<div class="rulesR relative">'+
			'						<input ng-model="viewRules.upperArea" readonly="readonly" class="imp CKArea" ng-focus="addArea($event)" ng-click="notHide($event)" ng-mouseover="showArea($event)" ng-mouseleave="hideArea($event,areaIndex)"/>'+
			'						<div class="areaPopup" ng-click="notHide($event)">'+
					'					<div class="searchBox"><input class="search" type="search" placeholder="搜索"	 ng-model="cityKeyWords" ng-change="areaSearch(cityKeyWords)"/></div>'+
					'					<div class="areaList">'+
					'						<div class="AllA"><label><input class="lev1" type="checkbox" ng-model="selectedNationwide" ng-click="selAllArea(selectedNationwide,$event)"/>全国</label></div>'+
					'						<ul class="eachProvince">'+
					'							<li ng-repeat="prov in newAreaList" class="len len2">'+
					'								<span class="glyphicon glyphicon-plus" ng-click="SHCity($event)"></span>'+
					'								<label class="provLabel"><input class="lev2" type="checkbox" ng-checked="selectedProv{{$index}}" ng-click="selPC(newAreaList,prov,$event)"/>{{prov[0].Province}}</label>'+
					'								<ul class="cityA">'+
					'									<li ng-repeat="city in prov" class="cityLine len len3"><label><input class="lev3" type="checkbox" ng-click="selPC(prov,city,$event)"/>{{city.City}}</label></li>'+
					'								</ul>'+
					'							</li>'+
					'						</ul>'+
					'					</div>'+
					'					<div class="popupBtnBox clearfix">'+
					'						<input class="fr popupBtn" type="button" value="确定" ng-click="areaSure($event)">'+
					'					</div>'+
			'						</div>'+
			'					</div>'+
			'				</div>'+
//			'				<div class="rulesLine">'+
//			'					<span class="rulesL">参考值</span>'+
//			'					<div class="rulesR relative">'+
//			'						<input ng-model="viewRules.upperBargain" class="imp" ng-focus="addRef($event)" ng-click="notHide($event)"/>'+
//			'						<div class="areaPopup" ng-click="notHide($event)">'+
//			
//			'						</div>'+
//			'					</div>'+
//			'				</div>'+
//			'				<div class="rulesLine"><span class="rulesL">参考范围</span><span class="rulesAreaR"><input type="text" ng-model="viewRules.upTenderPriceRatio" class="lowerValue"/></span></div>'+
			'			</div>'+
			'		</div>'+
			'	</div>'+
			'	<div class="layui-tab layui-tab-card Negotiate" ng-if="viewRules.modeId3==viewRules.mode.id">'+
			'	  	<ul class="layui-tab-title">'+
			'	    	<li class="layui-this tab1" ng-click="tabChange($event)">初始中标价规则</li>'+
			'	    	<li class="tab2" ng-click="tabChange($event)">联动规则</li>'+
			'	  	</ul>'+
			'	  	<div class="layui-tab-content">'+
			'	    	<div class="layui-tab-item layui-show">'+
			'				<div class="rulesLine">'+
			'					<span class="rulesL">参考区域</span>'+
			'					<div class="rulesR relative">'+
			'						<input ng-model="viewRules.upperArea" readonly="readonly" class="imp CKArea" ng-focus="addArea($event)" ng-click="notHide($event)" ng-mouseover="showArea($event)" ng-mouseleave="hideArea($event,areaIndex)"/>'+
			'						<div class="areaPopup" ng-click="notHide($event)">'+
					'					<div class="searchBox"><input class="search" type="search" placeholder="搜索"	 ng-model="cityKeyWords" ng-change="areaSearch(cityKeyWords)"/></div>'+
					'					<div class="areaList">'+
					'						<div class="AllA"><label><input class="lev1" type="checkbox" ng-model="selectedNationwide" ng-click="selAllArea(selectedNationwide,$event)"/>全国</label></div>'+
					'						<ul class="eachProvince">'+
					'							<li ng-repeat="prov in newAreaList" class="len len2">'+
					'								<span class="glyphicon glyphicon-plus" ng-click="SHCity($event)"></span>'+
					'								<label class="provLabel"><input class="lev2" type="checkbox" ng-checked="selectedProv{{$index}}" ng-click="selPC(newAreaList,prov,$event)"/>{{prov[0].Province}}</label>'+
					'								<ul class="cityA">'+
					'									<li ng-repeat="city in prov" class="cityLine len len3"><label><input class="lev3" type="checkbox" ng-click="selPC(prov,city,$event)"/>{{city.City}}</label></li>'+
					'								</ul>'+
					'							</li>'+
					'						</ul>'+
					'					</div>'+
					'					<div class="popupBtnBox clearfix">'+
					'						<input class="fr popupBtn" type="button" value="确定" ng-click="areaSure($event)">'+
					'					</div>'+
			'						</div>'+
			'					</div>'+
			'				</div>'+
			'				<div class="rulesLine">'+
			'					<span class="rulesL">参考值</span>'+
			'					<div class="rulesR relative">'+
			'						<input ng-model="viewRules.upperBargain" readonly="readonly" class="imp CKValue" ng-focus="addRef($event)" ng-click="notHide($event)"/>'+
			'						<div class="areaPopup" ng-click="notHide($event)">'+
			
			'						</div>'+
			'					</div>'+
			'				</div>'+
			'				<div class="rulesLine"><span class="rulesL">议价范围</span><span class="rulesAreaR"><input type="text" ng-model="viewRules.upTenderPriceRatio" class="lowerValue tenderRatio"/></span></div>'+
			'			</div>'+
			'	    	<div class="layui-tab-item">'+
				'			<div class="LDBox LRLinkage">'+
				'				<div class="rulesAreaLine rulesLine"><span class="rulesAreaL between">左右联动规则</span><span class="rulesAreaR hr"><hr></span><button type="button" class="btn-ld btn btn-danger btn-xs LRLinkage LD"  ng-click="isLD($event)">取消联动</button></div>'+
				'				<div class="rulesAreaLine rulesLine">'+
				'					<span class="rulesAreaL ">联动区域</span>'+
				'					<div class="rulesR relative">'+
				'						<input ng-model="viewRules.lrLinkageRegion" readonly="readonly" class="imp LRArea" ng-focus="addArea($event)" ng-click="notHide($event)" ng-mouseover="showArea($event)" ng-mouseleave="hideArea($event,areaIndex)"/>'+
				'						<div class="areaPopup" ng-click="notHide($event)">'+
						'					<div class="searchBox"><input class="search" type="search" placeholder="搜索"	 ng-model="cityKeyWords" ng-change="areaSearch(cityKeyWords)"/></div>'+
						'					<div class="areaList">'+
						'						<div class="AllA"><label><input class="lev1" type="checkbox" ng-model="selectedNationwide" ng-click="selAllArea(selectedNationwide,$event)"/>全国</label></div>'+
						'						<ul class="eachProvince">'+
						'							<li ng-repeat="prov in newAreaList" class="len len2">'+
						'								<span class="glyphicon glyphicon-plus" ng-click="SHCity($event)"></span>'+
						'								<label class="provLabel"><input class="lev2" type="checkbox" ng-checked="selectedProv{{$index}}" ng-click="selPC(newAreaList,prov,$event)"/>{{prov[0].Province}}</label>'+
						'								<ul class="cityA">'+
						'									<li ng-repeat="city in prov" class="cityLine len len3"><label><input class="lev3" type="checkbox" ng-click="selPC(prov,city,$event)"/>{{city.City}}</label></li>'+
						'								</ul>'+
						'							</li>'+
						'						</ul>'+
						'					</div>'+
						'					<div class="popupBtnBox clearfix">'+
						'						<input class="fr popupBtn" type="button" value="确定" ng-click="areaSure($event)">'+
						'					</div>'+
				'						</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="rulesAreaLine rulesLine">'+
				'					<span class="rulesAreaL">联动参考值</span>'+
				'					<div class="rulesR relative">'+
				'						<input ng-model="viewRules.lrLinkageRefVal" readonly="readonly" class="imp LRValue" ng-focus="addRef($event)" ng-click="notHide($event)"/>'+
				'						<div class="areaPopup" ng-click="notHide($event)">'+
				'						</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="rulesAreaLine rulesLine">'+
				'					<span class="rulesAreaL ">联动范围</span>'+
				'					<select ng-model="viewRules.lrMathSymbol" ng-options="mathML for mathML in viewRules.MathML"  class="LRScope">'+
				'					</select>'+
				'					<input type="text" class="rangeInput" ng-model="viewRules.lrLinkageTiggerCondtion"/>'+
				'				</div>'+
				'				<div class="rulesAreaLine rulesLine"><span class="rulesAreaL ">联动周期</span><div class="rulesR" ><input type="text"  class="ml4 LRTime" ng-model="viewRules.lrLinkageCycle" /></div></div>'+
				'			</div>'+
				'			<div class="LDBox LRLinkage">'+
				'				<div class="rulesAreaLine rulesLine"><span class="rulesAreaL  between">上下联动规则</span><span class="rulesAreaR hr"><hr></span><button type="button" class="btn-ld btn btn-danger btn-xs UDLinkage LD"  ng-click="isLD($event)">取消联动</button></div>'+
				'				<div class="rulesAreaLine rulesLine">'+
				'					<span class="rulesAreaL ">联动区域</span>'+
				'					<div class="rulesR relative">'+
				'						<input ng-model="viewRules.udLinkageArea" readonly="readonly" class="imp UDArea" ng-focus="addArea($event)" ng-click="notHide($event)" ng-mouseover="showArea($event)" ng-mouseleave="hideArea($event,areaIndex)"/>'+
				'						<div class="areaPopup" ng-click="notHide($event)" >'+
						'					<div class="searchBox"><input class="search" type="search" placeholder="搜索"	 ng-model="cityKeyWords" ng-change="areaSearch(cityKeyWords)"/></div>'+
						'					<div class="areaList">'+
						'						<div class="AllA"><label><input class="lev1" type="checkbox" ng-model="selectedNationwide" ng-click="selAllArea(selectedNationwide,$event)"/>全国</label></div>'+
						'						<ul class="eachProvince">'+
						'							<li ng-repeat="prov in newAreaList" class="len len2">'+
						'								<span class="glyphicon glyphicon-plus" ng-click="SHCity($event)"></span>'+
						'								<label class="provLabel"><input class="lev2" type="checkbox" ng-checked="selectedProv{{$index}}" ng-click="selPC(newAreaList,prov,$event)"/>{{prov[0].Province}}</label>'+
						'								<ul class="cityA">'+
						'									<li ng-repeat="city in prov" class="cityLine len len3"><label><input class="lev3" type="checkbox" ng-click="selPC(prov,city,$event)"/>{{city.City}}</label></li>'+
						'								</ul>'+
						'							</li>'+
						'						</ul>'+
						'					</div>'+
						'					<div class="popupBtnBox clearfix">'+
						'						<input class="fr popupBtn" type="button" value="确定" ng-click="areaSure($event)">'+
						'					</div>'+
				'						</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="rulesAreaLine rulesLine">'+
				'					<span class="rulesAreaL">联动参考值</span>'+
				'					<div class="rulesR relative">'+
				'						<input ng-model="viewRules.udLinkageRefVal" readonly="readonly" class="imp UDValue" ng-focus="addRef($event)" ng-click="notHide($event)"/>'+
				'						<div class="areaPopup" ng-click="notHide($event)">'+
				'						</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="rulesAreaLine rulesLine">'+
				'					<span class="rulesAreaL ">联动范围</span>'+
				'					<select ng-model="viewRules.udMathSymbol" ng-options="mathML for mathML in viewRules.MathML"  class="UDScope">'+
				'					</select>'+
				'					<input type="text" class="rangeInput" ng-model="viewRules.udLinkageTiggerCondtion"/>'+
				'				</div>'+
				'				<div class="rulesAreaLine rulesLine"><span class="rulesAreaL ">联动周期</span><div class="rulesR" ><input class="ml4 UDTime" type="text"  ng-model="viewRules.lrLinkageCycle" /></div></div>'+
				'			</div>'+
//			'				<a class="addRules" ng-click="addRules($event)">添加规则</a>'+
			'			</div>'+
			'	  	</div>'+
			'	</div>'+
			'</div>')($scope);
		amendRules.appendTo('body');
		$scope.selB = $scope.selC = false;
		layer.open({
		  	type: 1,
		  	title:"修改规则",
		  	skin:"viewRules",
			btn:["保存修改","取消"],
		  	area: ['550px', '550px'],
		  	content: amendRules,
			yes:function(index,r){
				//招标//议价
				var tenderModeInitial = {
						'upperBargain':$scope.viewRules.upperBargain,
						'upperArea':$scope.viewRules.upperArea,
						'upperAreaId':$scope.viewRules.upperAreaId,
						'upTenderPriceRatio':$scope.viewRules.upTenderPriceRatio
					},
					tenderModeLRLinkage = {
						'lrLinkageRegion':$scope.viewRules.lrLinkageRegion,
						'lrLinkageRegionId':$scope.viewRules.lrLinkageRegionId,
						'lrLinkageRefVal':$scope.viewRules.lrLinkageRefVal,
						'lrMathSymbol':$scope.viewRules.lrMathSymbol,
						'lrLinkageTiggerCondtion':$scope.viewRules.lrLinkageTiggerCondtion,
						'lrLinkageCycle':$scope.viewRules.lrLinkageCycle
					},
					tenderModeUDLinkage = {	
						'udLinkageArea':$scope.viewRules.udLinkageArea,
						'udLinkageAreaId':$scope.viewRules.udLinkageAreaId,
						'udLinkageRefVal':$scope.viewRules.udLinkageRefVal,
						'udMathSymbol':$scope.viewRules.udMathSymbol,
						'udLinkageTiggerCondtion':$scope.viewRules.udLinkageTiggerCondtion,
						'udLinkageCycle':$scope.viewRules.udLinkageCycle
					},
					tenderModeOtherLinkage = {
						'oLinkageRegion':$scope.viewRules.oLinkageRegion,
						'oLinkageRefVal':$scope.viewRules.oLinkageRefVal,
						'oMathSymbol':$scope.viewRules.oMathSymbol,
						'oLinkageTiggerCondtion':$scope.viewRules.oLinkageTiggerCondtion,
						'oLinkageCycle':$scope.viewRules.oLinkageCycle
					},
				//跟随
					followMode = {
						'upperArea':$scope.viewRules.upperArea,
						'upperAreaId':$scope.viewRules.upperAreaId
					};
				////////////////////////////////////////////////////
				var requiredUrl =	{	
										'userId':sessitionInfo.userId,
										'ids':[obj.id],
										'modeCode':$scope.viewRules.mode.id
								};
				var inResult = new RegExp(/^\d+\.?\d{0,2}%$/);
				if($scope.viewRules.upTenderPriceRatio){
					var j = inResult.test($scope.viewRules.upTenderPriceRatio);
					if(!j){
						layer.msg('中标价比例为百分数(%)，请重新填写',{icon:7,shift:6});
						return false;
					}
				}
				
				
				
				if($scope.viewRules.mode.id==1){
					var initialNum = 0,//初始中标价未填写数量
						LRLinkageNum = 0,
						UDLinkageNum = 0;
					//初始中标价字段填写判断
					for(var k in tenderModeInitial){
						if(!tenderModeInitial[k]){
							initialNum++;
						}
					}
					if(initialNum>0){
						layer.msg('初始中标价规则有未填字段，请仔细填写',{icon:5,shift:6});
						return false;
					}
					//左右联动字段填写判断
					if($('.Tender .LRLinkage').hasClass('LD')){
//						console.log('左右联动')
						var lrNum=0;
						for(var m in tenderModeLRLinkage){
							console.log(tenderModeLRLinkage[m])
							if(!tenderModeLRLinkage[m]){
								LRLinkageNum++;
							}
							lrNum++;
						}
						if(LRLinkageNum>0&&LRLinkageNum<lrNum){
							layer.msg('左右联动规则有未填字段，请重新填写 或 取消联动',{icon:5,shift:6});
							return false;
						}
						if($scope.viewRules.lrLinkageTiggerCondtion){
							var j = inResult.test($scope.viewRules.lrLinkageTiggerCondtion);
							if(!j){
								layer.msg('左右联动范围为百分数(%)，请重新填写',{icon:7,shift:6});
								return false;
							}
						}
					}else{
						tenderModeLRLinkage={};
					}
					//上下联动字段填写判断
					if($('.Tender .UDLinkage').hasClass('LD')){
//						console.log('上下联动')
						var udNum = 0;
						for(var m in tenderModeUDLinkage){
							console.log(tenderModeUDLinkage[m])
							if(!tenderModeUDLinkage[m]){
								UDLinkageNum++;
							}
							udNum++;
						}
//						console.log(UDLinkageNum)
//						console.log(udNum)
						if(UDLinkageNum>0&&UDLinkageNum<udNum){
							layer.msg('上下联动规则有未填字段，请重新填写 或 取消联动',{icon:5,shift:6});
							return false;
						}
						if($scope.viewRules.udLinkageTiggerCondtion){
							var j = inResult.test($scope.viewRules.udLinkageTiggerCondtion);
							if(!j){
								layer.msg('左右联动范围为百分数(%)，请重新填写',{icon:7,shift:6});
								return false;
							}
						}
					}else{
						tenderModeUDLinkage = {};
					}
					
					var tenderFinalUrl = $.extend(requiredUrl,tenderModeInitial,tenderModeLRLinkage,tenderModeUDLinkage);
					
//					console.log(tenderFinalUrl)
					//招标修改
					$http.post(lUrl+'/tenderPriceForecast/rule/updateRule',tenderFinalUrl)
					.success(function(data){
						if(data.backHttpResult.code==000){
							layer.close(index);
							$scope.rulesSearch();
							layer.msg('修改成功',{icon:6});
						}else{
							layer.msg(data.backHttpResult.result,{icon:7});
						}
						console.log($scope.viewRules.lrMathSymbol)
					})
					.error(function(data){
						layer.msg('服务连接失败，请检查网络后重新修改',{icon:7});
					})
				}else if($scope.viewRules.mode.id==2){
					var followNum = 0;
					for(var n in followMode){
						if(!followMode[n]){
							followNum++;
						}
					}
					if(followNum>0){
						layer.msg('跟随模式有未填字段，请重新填写',{icon:5,shift:6});
						return false;
					}
					var followFinalUrl = $.extend(requiredUrl,followMode);
					console.log(followFinalUrl)
					$http.post(lUrl+'/tenderPriceForecast/rule/updateRule',followFinalUrl)
					.success(function(data){
						layer.close(index);
						$scope.rulesSearch();
						layer.msg('修改成功',{icon:6});
					})
					.error(function(data){
						layer.msg('服务连接失败，请检查网络后重新修改',{icon:7});
					})
				}else if($scope.viewRules.mode.id==3){
					var initialNum = 0,//初始中标价未填写数量
						LRLinkageNum = 0,
						UDLinkageNum = 0;
					//初始中标价字段填写判断
					for(var k in tenderModeInitial){
						if(!tenderModeInitial[k]){
							initialNum++;
						}
					}
					if(initialNum>0){
						layer.msg('初始中标价规则有未填字段，请仔细填写',{icon:5,shift:6});
						return false;
					}
					//左右联动字段填写判断
					if($('.Negotiate .LRLinkage').hasClass('LD')){
//						console.log('左右联动')
						var lrNum=0;
						for(var m in tenderModeLRLinkage){
							if(!tenderModeLRLinkage[m]){
								LRLinkageNum++;
							}
							lrNum++;
						}
						if(LRLinkageNum>0&&LRLinkageNum<lrNum){
							layer.msg('左右联动规则有未填字段，请重新填写 或 取消联动',{icon:5,shift:6});
							return false;
						}
						if($scope.viewRules.lrLinkageTiggerCondtion){
							var j = inResult.test($scope.viewRules.lrLinkageTiggerCondtion);
							if(!j){
								layer.msg('左右联动范围为百分数(%)，请重新填写',{icon:7,shift:6});
								return false;
							}
						}
					}else{
						tenderModeLRLinkage={};
					}
					//上下联动字段填写判断
					if($('.Negotiate .UDLinkage').hasClass('LD')){
//						console.log('上下联动')
						var udNum = 0;
						for(var m in tenderModeUDLinkage){
							if(!tenderModeUDLinkage[m]){
								UDLinkageNum++;
							}
							udNum++;
						}
						if(UDLinkageNum>0&&UDLinkageNum<udNum){
							layer.msg('上下联动规则有未填字段，请重新填写 或 取消联动',{icon:5,shift:6});
							return false;
						}
						if($scope.viewRules.udLinkageTiggerCondtion){
							var j = inResult.test($scope.viewRules.udLinkageTiggerCondtion);
							if(!j){
								layer.msg('左右联动范围为百分数(%)，请重新填写',{icon:7,shift:6});
								return false;
							}
						}
					}else{
						tenderModeUDLinkage = {};
					}
					var negotiateFinalUrl = $.extend(requiredUrl,tenderModeInitial,tenderModeLRLinkage,tenderModeUDLinkage);
					console.log(negotiateFinalUrl)
					$http.post(lUrl+'/tenderPriceForecast/rule/updateRule',negotiateFinalUrl)
					.success(function(data){
						layer.close(index);
						$scope.rulesSearch();
						layer.msg('修改成功',{icon:6});
					})
					.error(function(data){
						layer.msg('服务连接失败，请检查网络后重新修改',{icon:7});
					})
				}
				
				
				
				
				
				
			},
			btn2:function(){
				
			},
			end:function(){
				$(".rulesBox").remove();
			}
		});
	}
	//是否联动
	$scope.isLD = function(e){
		if($(e.target).hasClass('LD')){
			$(e.target).addClass('btn-info').removeClass('LD btn-danger').html('联动').parents('.LDBox').find('input,select').attr('disabled','disabled');
		}else{
			$(e.target).removeClass('btn-info').addClass('LD btn-danger').html('取消联动').parents('.LDBox').find('input,select').removeAttr('disabled');
		}
		
	}
	//切换模式切换
	$scope.toggleMode = function(mode){
		if($scope.viewRules.mode.id==$scope.dMode){
			$scope.viewRules.upperArea = $scope.obj.upperArea;
			$scope.viewRules.upperAreaId = $scope.obj.upperAreaId;
			$scope.viewRules.upperBargain = $scope.obj.upperBargain;
			$scope.viewRules.lrLinkageRegion = $scope.obj.lrLinkageRegion;
			$scope.viewRules.lrLinkageRegionId = $scope.obj.lrLinkageRegionId;
			$scope.viewRules.lrLinkageRefVal = $scope.obj.lrLinkageRefVal;
			$scope.viewRules.lrLinkageTiggerCondtion = $scope.obj.lrLinkageTiggerCondtion;
			$scope.viewRules.lrLinkageCycle = $scope.obj.lrLinkageCycle;
			$scope.viewRules.udLinkageArea = $scope.obj.udLinkageArea;
			$scope.viewRules.udLinkageAreaId = $scope.obj.udLinkageAreaId;
			$scope.viewRules.udLinkageRefVal = $scope.obj.udLinkageRefVal;
			$scope.viewRules.udLinkageTiggerCondtion = $scope.obj.udLinkageTiggerCondtion;
			$scope.viewRules.udLinkageCycle = $scope.obj.udLinkageCycle;
			$scope.viewRules.upTenderPriceRatio = $scope.obj.upTenderPriceRatio;
		}else{
			$scope.viewRules.upperArea = '';
			$scope.viewRules.upperAreaId = '';
			$scope.viewRules.upperBargain = '';
			$scope.viewRules.lrLinkageRegion = '';
			$scope.viewRules.lrLinkageRegionId = '';
			$scope.viewRules.lrLinkageRefVal = '';
			$scope.viewRules.lrLinkageTiggerCondtion = '';
			$scope.viewRules.lrLinkageCycle = '';
			$scope.viewRules.udLinkageArea = '';
			$scope.viewRules.udLinkageAreaId = '';
			$scope.viewRules.udLinkageRefVal = '';
			$scope.viewRules.udLinkageTiggerCondtion = '';
			$scope.viewRules.udLinkageCycle = '';
			$scope.viewRules.upTenderPriceRatio = '';
		}
	}
	//
//	document.onclick = function(){
//   	$('.areaPopup').html('');
//  }
	//阻止冒泡
//	$scope.notHide = function(e){
//		e.stopPropagation(); 
//	}
	
	
	var selectedProv = [];
	//弹出联动区域
	$scope.addArea = function(obj){
		$('.areaPopup').hide();
		$(obj.target).siblings('.areaPopup').show();
		
		document.onclick = function(){
	     	$('.areaPopup').hide();
	    }
		$scope.notHide = function(e){
			e.stopPropagation(); 
		}
		
		//判断当前点击是哪个input
		var inputBox = $(obj.target);
		if(inputBox.hasClass('CKArea')){
			$scope.viewRules.selCityIds	= $scope.viewRules.upperAreaId;
		}else if(inputBox.hasClass('LRArea')){
			$scope.viewRules.selCityIds = $scope.viewRules.lrLinkageRegionId;
		}else if(inputBox.hasClass('UDArea')){
			$scope.viewRules.selCityIds = $scope.viewRules.udLinkageAreaId;
		}
		
//		$scope.viewRules.selCityIds = '1100,1500,1501';
//		$scope.viewRules.selCityIds = '9999';
//		console.log($scope.viewRules.selCityIds)
		if($scope.viewRules.selCityIds){
			if($scope.viewRules.selCityIds == '9999'){
				$(obj.target).siblings('.areaPopup').find('input[type=checkbox]').prop('checked','checked');
			}else{
				var newSelCityIds = $scope.viewRules.selCityIds.split(',');
				var nscids = [];
				for(var r=0;r<newSelCityIds.length;r++){
					nscids.push(newSelCityIds[r])
				}
				$scope.viewRules.modifySelCityIds = [];//变更后的id数组
//				console.log($scope.newAreaList)
				console.log(nscids)
				var provIndex = [];//省所在位置
				var cityIndex = [];//市所在位置
				for(var j=0;j<nscids.length;j++){
					for(var i=0;i<areaProvince.length;i++){
						if(areaProvince[i].provinceCode==nscids[j].substr(0,2)){
							provIndex.push(i);
							$scope.newAreaList[j];
							for(var k=0;k<$scope.newAreaList[i].length;k++){
								if(nscids[j]==$scope.newAreaList[i][k].cityCode){
									cityIndex.push(k);
									angular.element(obj.target).siblings('.areaPopup').find('.eachProvince').find('.len2').eq(i).find('.cityA').find('.len3').eq(k).find('.lev3').prop('checked','checked');
								}
							}
							
						}
					}
				}
				var plen = $(obj.target).siblings('.areaPopup').find('.areaList').find('.eachProvince').find('.len2');
				for(var n=0;n<plen.length;n++){
					var clen = $(obj.target).siblings('.areaPopup').find('.areaList').find('.eachProvince').find('.len2').eq(n).find('.cityA').find('.len3');
					var cclen = 0;//所选择市 数量
					for(var m=0;m<clen.length;m++){
						if($(clen).eq(m).find('.lev3').prop('checked')){
							cclen++;
						}
					}
					if(clen.length == cclen){
						$(plen).eq(n).find('.lev2').prop('checked','checked');
					}
				}
			}
		}
	}
	
	
	//省市搜索
	$scope.areaSearch = function(kws){
		$(".eachProvince").find('li').show();
		if(kws){
			$(".eachProvince .len2").each(function(){  
	//			var text2 = $(this).find('.provLabel').text();
				var visibelLen = 0;
	            $(this).find(".cityA").find('.len3').each(function(){  
	                var text3 = $(this).find('label').text();
	                if(text3.indexOf(kws) == -1 ){ 
	                    $(this).hide(); 
	                }else{
	                	visibelLen++;
	                }
	            });  
	            if(visibelLen==0){
	            	$(this).hide();
	            }
	        });  
       	}else{
       		$(".eachProvince").find('li').show();
       	}
	}
	//省市分解 所有选择的市
	function areaAdjust(x){
		$scope.viewRules.totalArea = {};
		for(var i=0;i<x.length;i++){
			var TAKey = x[i].Province;
			if(!$scope.viewRules.totalArea[TAKey]){
				$scope.viewRules.totalArea[TAKey]=[];
			}
			$scope.viewRules.totalArea[TAKey].push(x[i].City);
		}
		
	}
	//所有未选择的市
	function areaAdjustOther(y){
		$scope.viewRules.totalAreaOther = {};
		for(var i=0;i<y.length;i++){
			var TAKey = y[i].Province;
			if(!$scope.viewRules.totalAreaOther[TAKey]){
				$scope.viewRules.totalAreaOther[TAKey]=[];
			}
			$scope.viewRules.totalAreaOther[TAKey].push(y[i].City);
		}
	}
	//省市确定
	$scope.areaSure = function(e){
		console.log($scope.viewRules.selCityIds)
		$scope.viewRules.totalArea = [];
		loopCity(e);
		////id json
		var cityObj = $scope.viewRules.selCity;//所有选中city
		var cityObjOther = $scope.viewRules.selCityOther;//所有未选中city
		
		areaAdjust(cityObj);//{province:[city]}
		areaAdjustOther(cityObjOther);//{province:[city]}
//		console.log($scope.viewRules.selCityIds)
		if($scope.viewRules.selCityIds.length>0){///
			$scope.allAreaData = [];
			for(var i=0;i<$scope.newAreaList.length;i++){
				var eachProv = $(e.target).parents('.popupBtnBox').siblings('.areaList').find('.eachProvince').find('.len2').eq(i).find('.cityA').find('.len3');
				var cityObjB = {};
				var cityArr = [];
				var cityNum = 0;
				
				for(var j=0;j<eachProv.length;j++){
					if(eachProv.find('.lev3').eq(j).prop('checked')){
						cityArr.push($scope.areaList[i][j].City);
						cityNum++;
					}
				}
				if(cityArr.length>0){
					if(cityNum==eachProv.length){
						cityObjB.city = $scope.areaList[i][0].Province+'全省市';
					}else if(cityNum>Math.ceil(eachProv.length/3*2)){
						var notSelAllProv = $scope.viewRules.totalAreaOther;
						for(var notSelP in notSelAllProv){
							console.log(notSelP)
							if($scope.areaList[i][0].Province == notSelP){
//								console.log(notSelAllProv[notSelP])
								cityObjB.city=$scope.areaList[i][0].Province+'全省市(除'+notSelAllProv[notSelP]+')';
							}
						}
					}else{
						var arr = cityArr.join(',');
//						cityObjB.city=$scope.areaList[i][0].Province+'('+arr+')';//山东(菏泽市,枣庄市)
						cityObjB.city= arr.replace(',','、');
					}
//					cityObj.city = cityArr;
					$scope.allAreaData.push(cityObjB);
				}
			}
			var str = '';
//			console.log($scope.allAreaData)
			for(var c=0;c<$scope.allAreaData.length;c++){
				str+=$scope.allAreaData[c].city+'、';
			}
//			console.log(str)
//			console.log($scope.viewRules.selCityIds)
			var inputBox = $(e.target).parents('.areaPopup').siblings('.imp');
			var checkAll = $(e.target).parents('.popupBtnBox').siblings('.areaList').find('.lev1');
			if(inputBox.hasClass('CKArea')){
				if(checkAll.prop('checked')){
					$scope.viewRules.upperArea = '全国';
					$scope.viewRules.upperAreaId = '9999';
				}else{
	//				console.log($scope.allAreaData)
					$scope.viewRules.upperArea = str.substr(0,str.length-1);
	//				$scope.viewRules.upperAreaId = $scope.viewRules.selCityIds;
					var uaIds = '';
					if($scope.viewRules.selCityIds.length>0){
//						for(var ua=0;ua<$scope.viewRules.selCityIds.length;ua++){
//							uaIds+=$scope.viewRules.selCityIds[ua].slice(0,2)+':'+$scope.viewRules.selCityIds[ua]+',';
//						}
						
//						$scope.viewRules.upperAreaId = uaIds.slice(0,uaIds.length-1);
						$scope.viewRules.upperAreaId = $scope.viewRules.selCityIds.join(',');
					}
				}
				console.log($scope.viewRules.upperAreaId)
				console.log($scope.viewRules.upperArea)
			}else if(inputBox.hasClass('LRArea')){
				if(checkAll.prop('checked')){
					$scope.viewRules.lrLinkageRegion = '全国';
					$scope.viewRules.lrLinkageRegionId = '9999';
				}else{
	//				console.log($scope.allAreaData)
					$scope.viewRules.lrLinkageRegion = str;
	//				$scope.viewRules.lrLinkageRegionId = $scope.viewRules.selCityIds;
					var lrIds = '';
					if($scope.viewRules.selCityIds.length>0){
						for(var ua=0;ua<$scope.viewRules.selCityIds.length;ua++){
							lrIds+=$scope.viewRules.selCityIds[ua].slice(0,2)+':'+$scope.viewRules.selCityIds[ua]+',';
						}
						$scope.viewRules.lrLinkageRegionId = lrIds.slice(0,lrIds.length-1);
					}	
				}
			}else if(inputBox.hasClass('UDArea')){
				if(checkAll.prop('checked')){
					$scope.viewRules.udLinkageArea = '全国';
					$scope.viewRules.udLinkageAreaId = '9999';
				}else{
					$scope.viewRules.udLinkageArea = str;
	//				console.log($scope.allAreaData)
	//				$scope.viewRules.udLinkageAreaId = $scope.viewRules.selCityIds;
					var udIds = '';
					if($scope.viewRules.selCityIds.length>0){
						for(var ua=0;ua<$scope.viewRules.selCityIds.length;ua++){
							udIds+=$scope.viewRules.selCityIds[ua].slice(0,2)+':'+$scope.viewRules.selCityIds[ua]+',';
						}
						
						$scope.viewRules.udLinkageAreaId = udIds.slice(0,udIds.length-1);
					}
				}
			}
		}else{
			var inputBox = $(e.target).parents('.areaPopup').siblings('.imp');
			if(inputBox.hasClass('CKArea')){
				$scope.viewRules.upperArea = '';
				$scope.viewRules.upperAreaId = '';
			}
			if(inputBox.hasClass('LRArea')){
				$scope.viewRules.lrLinkageRegion = '';
				$scope.viewRules.lrLinkageRegionId = '';
			}
			if(inputBox.hasClass('UDArea')){
				$scope.viewRules.udLinkageArea = '';
				$scope.viewRules.udLinkageAreaId = '';
			}
		}
		$(e.target).parents('.areaPopup').hide();
//		$scope.viewRules.modifySelCityIds = $scope.viewRules.selCityIds;//变更后的id数组
	}
	//鼠标移入省市input 显示省市信息
	$scope.showArea = function(e){
		var thisHtml = $(e.target).val();
		if(thisHtml.length>0){
//			areaHtml = $scope.viewRules.upperArea
//			console.log(areaHtml)
			var ar = thisHtml.replace(/、/g,"<br>");
		
		
			thisHtml = '<div>'+ar+'</div>';
			$(e.target).addClass('showArea');
	//		console.log(areaHtml)
			$scope.areaIndex = layer.tips(thisHtml,$(e.target), {
							  	tips: [1, '#fff'],
							  	time:false,
							  	area: '150px'
							});
		}
	}
	//鼠标移出省市input 隐藏省市信息
	$scope.hideArea = function(e,i){
		layer.close(i);
	}
	
	//区域选择
	$scope.viewRules.selProv=[];//省obj集合
	$scope.viewRules.selProvName = [];//省名称集合
	$scope.viewRules.selProvIds = [];//省集合
	$scope.viewRules.selCity = [];//市obj集合
	$scope.viewRules.selCityName = [];//市名称集合
	$scope.viewRules.selCityIds = [];//选择的市id集合
	$scope.viewRules.selCityOther = [];//未选择市集合
	$scope.viewRules.selCityIdsOther = [];//未选择的市id集合
	function loopCity(e){
		$scope.viewRules.selProv=[];//省obj集合
		$scope.viewRules.selProvIds = [];//省集合
		$scope.viewRules.selCity = [];//市obj集合
		$scope.viewRules.selCityIds = [];//市id集合
		$scope.viewRules.selCityOther = [];//未选择市集合
		$scope.viewRules.selCityIdsOther = [];//未选择的市id集合
		for(var i=0;i<$scope.newAreaList.length;i++){
			if($(e.target).parents('.areaPopup').find('.eachProvince').find('.len2').eq(i).find('.lev2').prop('checked')){
				$scope.viewRules.selProv.push($scope.newAreaList[i][0]);
				$scope.viewRules.selProvIds.push($scope.newAreaList[i][0].provinceCode);
			}
			if($scope.viewRules.selProvIds.length==$(e.target).parents('.areaPopup').find('.eachProvince').find('.len2').length){
				$(e.target).parents('.areaPopup').find('.lev1').prop('checked','checked');
			}
			for(var n=0;n<$scope.newAreaList[i].length;n++){
				if($(e.target).parents('.areaPopup').find('.eachProvince').children('.len2').eq(i).find('.cityA').find('.len3').eq(n).find('.lev3').prop('checked')){
					$scope.viewRules.selCity.push($scope.newAreaList[i][n]);
					$scope.viewRules.selCityIds.push($scope.newAreaList[i][n].cityCode);
				}else{
					$scope.viewRules.selCityOther.push($scope.newAreaList[i][n]);
					$scope.viewRules.selCityIdsOther.push($scope.newAreaList[i][n].cityCode);
				}
			}
		}
		console.log($scope.viewRules.selCityIds)
	}
	//全国
	$scope.selAllArea = function(x,e){
		if(x){
			$(e.target).parents('.AllA').siblings('.eachProvince').find('input[type=checkbox]').prop('checked','checked');
			loopCity(e);
		}else{
			$(e.target).parents('.AllA').siblings('.eachProvince').find('input[type=checkbox]').prop('checked','');
			$scope.viewRules.selProvIds = [];//省集合
			$scope.viewRules.selCityIds = [];//市集合
		}
//		console.log($scope.viewRules.selProvIds)
//		console.log($scope.viewRules.selCityIds)
//		console.log($scope.viewRules.selProv)
	}
	//省市
	$scope.selPC = function(parent,obj,e){
//		loopCity(e);
		var thisCity = 0;
		var len = parent.length;
		if($(e.target).hasClass('lev3')){
			if($(e.target).prop('checked')){
				for(var u=0;u<len;u++){
					if($(e.target).parents('.cityA').find('.len3').eq(u).find('.lev3').prop('checked')){
						thisCity++;
					}
				}
				
				if(thisCity==len){
					$(e.target).parents(".cityA").siblings('.provLabel').find(".lev2").prop("checked","checked");
				}
				loopCity(e);
				if($scope.viewRules.selProvIds.length==$scope.newAreaList.length){
					$('.lev1').prop('checked','checked');
				}
			}else{
				$(e.target).parents(".cityA").siblings('.provLabel').find(".lev2").prop("checked","").parents('.eachProvince').siblings('.AllA').find('.lev1').prop('checked','');
				loopCity(e);
				//当前元素在数组中的位置
//				var objIndex = $.inArray(obj,thisCity)
//				thisCity.splice(objIndex,1);
			}
		}else if($(e.target).hasClass('lev2')){
			if($(e.target).prop('checked')){
				$(e.target).parents('.provLabel').siblings('.cityA').find('.lev3').prop('checked','checked');
				loopCity(e);
				if($scope.viewRules.selProvIds.length==len){
					$('.lev1').prop('checked','checked');
				}
			}else{
				$(e.target).parents('.provLabel').siblings('.cityA').find('.lev3').prop('checked','');
			}
			loopCity(e);
			$(e.target).parents('.eachProvince').siblings('.AllA').find('.lev1').prop('checked',$scope.viewRules.selProvIds.length==len?true:false);
		}
//		console.log($scope.viewRules.selProvIds)
//		console.log($scope.viewRules.selCityIds)
	}
	
	$scope.SHCity = function(e){
		$(e.target).toggleClass('glyphicon-minus').siblings('.cityA').toggle();
	}
	
	
	
/////////////////////////////////////////////	
	//弹出参考值
	 $scope.addRef = function(e){
	 	document.onclick = function(){
	     	$('.areaPopup').hide();
	    }
		$scope.notHide = function(e){
			e.stopPropagation(); 
		}
	 	$scope.rulesValue = rulesValue;
		var html = $compile(
//				'				<div class="searchBox"><input class="search" type="search" placeholder="搜索"	/></div>'+
				'				<div class="areaList" style="margin-top:10px;">'+
				'					<ul>'+
				'						<li class="radioLi" ng-repeat="rv in rulesValue"><label><input type="checkbox"  ng-click="radioC($event)"/>{{rv}}</label></li>'+
				'					</ul>'+
//				'					<div><a class="add" ng-click="createRule()" style="margin-left:20px;cursor:pointer;line-height:30px;">添加</a></div>'+
				'				</div>'+
				'				<div class="popupBtnBox clearfix">'+
				'					<input class="fr popupBtn" type="button" value="确定" ng-click="refSure($event)">'+
				'				</div>')($scope);
		$(e.target).siblings('.areaPopup').html(html).show();
	}
	$scope.radioC = function(e){
		$(e.target).parents('.radioLi').siblings('.radioLi').find('input[type="checkbox"]').removeAttr('checked');
	}
	//确定参考值
	$scope.refSure = function(e){
		var inputRef = $(e.target).parents('.areaPopup').siblings('.imp');
		var liLen = $(e.target).parent('.popupBtnBox').siblings('.areaList').find('.radioLi');
		for(var i=0;i<liLen.length;i++){
			if(liLen.eq(i).find('input[type=checkbox]').prop('checked')){
				var ref = liLen.eq(i).find('label').text();
				if(inputRef.hasClass('CKValue')){
					$scope.viewRules.upperBargain = ref;
				}else if(inputRef.hasClass('LRValue')){
					$scope.viewRules.lrLinkageRefVal = ref;
				}else if(inputRef.hasClass('UDValue')){
					$scope.viewRules.udLinkageRefVal = ref;
					console.log($scope.viewRules.udLinkageRefVal)
				}
			}
		}
		$(e.target).parents('.areaPopup').html('');
	}
//	//添加参考值
//	$scope.createRule = function(){
//		layer.open({
//		  	type: 1,
//		  	title:"创建参考规则",
//		  	skin:'createRules',
//		  	area: ['470px', '430px'],
//		  	btn:['有效计算公式','确定'],
//		  	content: 	'<div class="rulesBox">'+
//						'	<div><textarea class="layui-textarea"></textarea></div>'+
//		  				'	<div class="clearfix">'+
//		  				'		<div class="fl lump">'+
//		  				'			<label>函数</label>'+
//		  				'			<div class="list">'+
//		  				'				<ul>'+
//		  				'					<li>AVG</li>'+
//		  				'					<li>MIN</li>'+
//		  				'					<li>SMALL</li>'+
//		  				'					<li>SUM</li>'+
//		  				'					<li>SUMPRODUCT</li>'+
//		  				'					<li>最低5省</li>'+
//		  				'					<li>最低3省</li>'+
//		  				'				</ul>'+
//		  				'			</div>'+
//		  				'		</div>'+
//		  				'		<div class="fr lump">'+
//		  				'			<label>字段</label>'+
//		  				'			<div class="list">'+
//		  				'				<ul>'+
//		  				'					<li>全国</li>'+
//		  				'					<li>北京</li>'+
//		  				'					<li>河北省</li>'+
//		  				'					<li>山东省</li>'+
//		  				'				</ul>'+
//		  				'			</div>'+
//		  				'		</div>'+
//		  				'	</div>'+
//		  				'</div>',
//			yes:function(){
//					
//			}
//		});
//		$(".createRules .rulesBox .lump .list li").click(function(){
//			$(this).addClass("active").siblings().removeClass("active");
//		})
//	}
//////////////////////////////////////////////////////////////////
	//添加新规则
//	$scope.addRules = function(obj){
//		$(obj.target).before(
//			$compile('				<div class="rulesAreaLine rulesLine"><span class="rulesAreaL  between">新规则</span><span class="rulesAreaR hr"><hr></span><button type="button" class="btn-ld btn btn-danger btn-xs LD"  ng-click="isLD($event)">取消联动</button></div>'+
//					'				<div class="rulesAreaLine rulesLine">'+
//					'					<span class="rulesAreaL ">联动区域</span>'+
//					'					<div class="rulesR relative">'+
//					'						<input value="全国" class="imp" ng-model="viewRules.oLinkageRegion" ng-focus="addArea($event)"/>'+
//					'						<div class="areaPopup" ng-click="notHide($event)" >'+
//					
//					'						</div>'+
//					'					</div>'+
//					'				</div>'+
//					'				<div class="rulesAreaLine rulesLine">'+
//					'					<span class="rulesAreaL">联动参考值</span>'+
//					'					<div class="rulesR relative">'+
//					'						<input class="imp" ng-model="viewRules.oLinkageRefVal" ng-focus="addRef($event)"/>'+
//					'						<div class="areaPopup" ng-click="notHide($event)">'+
//					
//					'						</div>'+
//					'					</div>'+
//					'				</div>'+
//					'				<div class="rulesAreaLine rulesLine">'+
//					'					<span class="rulesAreaL">联动范围</span>'+
//					'					<select class="otherMath" ng-model="viewRules.oMathSymbol" ng-options="mathML for mathML in viewRules.MathML" >'+
//					'					</select>'+
//					'					<input type="text" ng-model="viewRules.oLinkageTiggerCondtion"/>'+
//					'				</div>'+
//					'				<div class="rulesAreaLine rulesLine"><span class="rulesAreaL ">联动周期</span><div class="rulesR" ><input class="ml4 otherTime" type="text"  value="viewRules.oLinkageCycle" /></div></div>')($scope)
//				);
//		$('.addRules').remove();
//	}

	////////全选
	//全部
//	$scope.multiAll = function(activeAll){
//		$scope.page.selRulesIds=[];
//		if(activeAll){
//			for(var i=0;i<$scope.rulesList.length;i++){
//				$scope.page.selRulesIds.push($scope.rulesList[i].id);
//			}
//			$('.content .viewArea .userManagementTable.search .rulesTable .table tbody tr input[type=checkbox]').prop('checked','checked');
//		}else{
//			$('.content .viewArea .userManagementTable.search .rulesTable .table tbody tr input[type=checkbox]').prop('checked','');
//		}
//	}
//	//单个
//	$scope.multiSin = function(e,Id,active){
//		var checkBox = e.target
//		if(active){
//			$scope.page.selRulesIds.push(Id);
//		}else{
//			$scope.page.selRulesIds.splice($.inArray(Id,$scope.page.selRulesIds), 1);
//			$('.content .viewArea .userManagementTable.search .rulesTable #as').prop('checked','');
//		}
//		if($scope.page.selRulesIds.length==$scope.rulesList.length){
//			$('.content .viewArea .userManagementTable.search .rulesTable #as').prop('checked','checked');
//		}
//	}
	
	
	//菜单
	$(".content").css('min-height',$(window).height()-64+'px');
		

	

}])













