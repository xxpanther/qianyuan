/**
 * 我的应用组件加载
 * 参数说明
 * 
 * 	//数组对象
	var app_list = [{	app_id : "asd",									// 应用id
				app_name : "网上申报",									// 应用名称
				//app_status : "0",										// app添加状态（0:未添加；1已经添加） 默认是为添加
				img_src : "css/images/tb_23.png",						// 应用小图标
				big_img_src : "css/images/gg_image.jpg",				// 应用大图标
				app_intro : "67890位用户正在使用 | 所属分类：税务应用",	// 应用使用情况
				text : "网络发票是国家税务局应用均为..."					// 应用描述
				btn_text : "添加按钮描述"										// 添加按钮描述
				is_index_app : true											// true: 是否首页应用
			}]
 * var opt = {
				location : '<%=basePath%>',		//当前上下文
				pid : "#hahh",					// 父div
				app_list : app_list				// 应用数组参数
	};
	App_ui.init(opt);		// 初始化方法
	App_ui.add(item);		// 动态添加一个应用方法调用
	App_ui.operate();		// 应用管理（显示删除按钮）
	App_ui.delete();		// 删除应用处理
 * 
 */
var App_ui = function(){
	var options = null;
	
	options = {
		pid : null,
		app_list : [],	
		render : function(_option){
			for(var i=0;i<_option["app_list"].length;i++){
				var item = _option.app_list[i];	
				item["app_status"] = item["app_status"] ? item["app_status"] : "0";	//初始化状态，默认未添加
				item["location"] = _option["location"];
				_option.add(item);
			}
			
		},
		
		// 构建一个app模块
		_init_field : function(item){
			var _str = "";
			if(options.type != null && options.type != undefined && options.type == 1) {
				if ($("#center_" + item.yylx_dm).size() <= 0) {
					_str += "<span  class=\"app_content_item\"><div id='center_"+item.yylx_dm+"'class='app_topcontent'>";
					_str += "</div>";
					_str += "<span  class='app_list'>";
					
					_str += appendAppItem(item);
					
					_str += "<div  class='clearBoth'></div></span></span>";
				} else {
					_str += appendAppItem(item);
					
				}
			}else {
				if ($("#" + item.yylx_dm).size() <= 0) {
					_str += "<span  class=\"app_content_item\"><div id='"+item.yylx_dm+"'class='app_topcontent'>";
					_str += "</div>";
					_str += "<span class='app_list'>";
					
					_str += appendAppItem(item);
					
					_str += "<div  class='clearBoth'></div></span></span>";
				} else {
					_str += appendAppItem(item);
				}
			}
			
			return $(_str);
		},
		eventHandler : function(){
			
			
		},
		
		add : function(item){
		
	         //菜单右击功能
			var imageMenuData = [
			    [{
			        text: "关闭",
			        func: function() {
			        	 $(this).find("p").trigger("click");
			            }
			        }, 
			        {
			            text: "关闭其他",
			            func: function() {
			            	$(this).siblings().find("p").trigger("click");
			            	$(this).trigger("click");
			            	
			            }
			        }, 
			        {
			            text: "关闭所有",
			            func: function() {
			            	 $(this).siblings().find("p").trigger("click");
			            	$(this).find("p").trigger("click");
			            }
			        }]
			        ];
			var _opt = options;
			
			// 构建jquery对象 单个应用
			var field = _opt._init_field(item);
			if(options.type != null && options.type != undefined && options.type == 1) {
				if ($("#center_" + item.yylx_dm).size() <= 0) {
					$(_opt.pid).append(field);
				} else {
					$("#center_" + item.yylx_dm).next().find(".clearBoth").before(field);
				}
			}else {
				if ($("#" + item.yylx_dm).size() <= 0) {
					$(_opt.pid).append(field);
				} else {
					$("#" + item.yylx_dm).next().find(".clearBoth").before(field);
				}
			}
			
			// 事件绑定
			// 显示app详细信息
		
		
			field.find("dt,dd").each(function(i, itm) {
				$(this).live("click", function(){
					appJump1(item,field,imageMenuData)
				});
			});
		/*	field.find("dt").each(function(i, itm){
				$(this).live("click", function(){
					$(".out_div:first", field).show();
				});
			});*/
			/*
			field.find("dt").live("click", function(){
				alert("")
				$(".out_div:first", field).show();
			});
			*/
			
			//隐藏app信息
			field.find(".close_appdetial").each(function(i, itm){
				$(this).live("click", function(){
					$(".out_div:first", field).hide();
				});
			});
			/*
			$(".close_appdetial:first", field).live("click", function(){
				$(".out_div:first", field).hide();
			});
			*/
			// 添加到首页方法
			field.find(".appdetial_top span").each(function(i, itm){
				$(this).live("click", function(){
					//alert("应用使用状态" + item.app_status)
					if(options.app_addCenter){
						options.app_addCenter(item);
					}

					$(".out_div:first", field).hide();
				});
				
//				return false;
			});
			
			// 删除按钮事件绑定
			field.find(".close_icon").each(function(i, itm){
				$(this).live("click", function(){
					
					if(item.defaultApp != "Y"){
						if(options.app_delete){
							item.field=field;
							options.app_delete(item);
						}
//						field.remove();	//移除该对象
						
					}
					return false;
				});
//				
			});
			
		},
		// 显示操作按钮
		operate : function(item){
			//$(options.pid).find(".close_icon").show();
			$("#user_app").find(".close_icon").show();
		},
		operateadd : function(item){			
			//$(options.pid).find(".add_icon").show();			
			$("#app_center").find(".add_icon").show();			
		},
		operatehide : function(item){
			//$(options.pid).find(".add_icon").hide();		
			$("#app_center").find(".add_icon").hide();	
		},
		init : function(_option){
			options = $.extend(true, {}, options, _option);
			
			options.render(options);
			//options.eventHandler(_option);
		},
		initSpecial : function(_option){
			
			options.app_list = [];
			options = $.extend(true, {}, options, _option);
			options.render(options);
			//options.eventHandler(_option);
		}
	
	};
	
	return {
		init : options.init,
		initSpecial : options.initSpecial,
		add : options.add,
		operate : options.operate,
		operateadd : options.operateadd,
		operatehide : options.operatehide
	};
}();

/*
 * 获取上下文路径
 */
function getContextPath() {
	var contextPath = document.location.pathname;
	var index = contextPath.substr(1).indexOf("/");
	contextPath = contextPath.substr(0, index + 1);
	delete index;
	return contextPath;
}

function appendAppItem(item) {
	var _str = "";
	_str += "<dl id='"+item.app_dm+"'>";
	_str += "	<dt>";
	_str += "		<img src='"+ item.img_src+"' width='50' height='50'/>";
	if(item.closeable){
		_str += "		<img src='"+staticPath+"css/images/close_app.png' width='18' height='18' class='close_icon' style='display:none;'/>";
	}
	_str += "       <img src='"+staticPath+"css/images/add_app.png' width='18' height='18' class='add_icon' style='display:none;'/>";
	_str += "	</dt>";
	_str += "	<dd>"+item.app_name+"</dd>";
	_str += "	<div class='out_div' style='display:none'>";
	_str += "		<div class='show_appdetial' id='show_appdetial'></div>";
	_str += "		<div class='appdetial_content'>";
	_str += "			<div class='close_appdetial' id='move_app'>";
	_str += "				<img src='"+staticPath+"/css/images/X_03.png' width='10' height='8'>";
	_str += "			</div>";
	_str += "			<div class='appdetial_top'>";
	_str += "				<div class='appdetial_topleft'><img src='"+item.img_src+"' width='65' height='65'></div>";
	_str += "				<div class='appdetial_topmiddle'><p class='title_app'>"+item.app_name+"</p><p class='user-app'>"+item.app_intro+"</p></div>";
	_str += "				<div class='appdetial_topright'><span>"+item.btn_text+"</span></div>";
	_str += "			</div>";
	_str += "			<div class='appdetial_bottom'>" +
			"				<div class='appdetial_bottomleft'><img src='"+ staticPath+item.big_img_src+"' width='325' height='241'></div>" +
			"				<div class='appdetial_bottomright'><p>"+item.text+"</p></div>" +
			"			</div>";
	_str += "		</div>" +
			"	</div>" +
			"</dl>";
	return _str;
}
function appJump1(item, field, imageMenuData) {
	var sf_mryy =item.sf_mryy ;
	if (item.hideDetail) {	
		var url =getContextPath()+"/user/my_app/app_manage.do?sign=to_app";
		var params = {
			app_dm : item.app_dm,
			app_bbh : item.app_bbh,
			appNo : item.appNo,
			sf_mk : item.sf_mk,
			app_url : item.app_url,
			appb_jxlx : item.appb_jxlx
		};
        ZRJC.ajaxCall(url, params, function(json) {
        	if(ZRJC.isOperationSuccessful(json)){
        		var data = ZRJC.getOperationData(json);
        		if("11101"==data.RESULT){
        			layerHandler.alert("此应用暂停使用！");
        			return;
        		}
        		if("E2002"==data.RESULT){
        			layerHandler.alert(data.MSG);
        			return;
        		}
        		if("11102"==data.RESULT){
        			layerHandler.alert(data.MSG);
        			return;
        		}
        		if(item.app_dm=='shenbao_pzdy'){
        			layerHandler.alert("此功能只支持非电子税局的网上申报历史凭证打印。", function(){
        				window.open(data.url);
       				});
        			return;
    			};
    			//纳税服务链接
    			if(item.app_dm.indexOf('hotapp')==0){
       				window.open(data.url);
        			return;
    			};
        		//添加应用使用频率
//        		yysypl(params);
    			//委托代征链接
    			if(item.app_dm.indexOf('wtdz')==0){
       				window.open(data.url);
        			return;
    			};

        		var if_tz = data.if_tz;
        		if((if_tz=="Y")||((if_tz=="N")&&(sf_mryy=="N"))){
        			if(data.isJspbApp != null && data.isJspbApp == "Y") {
        				$("#show_appdetial").load(getContextPath() + "/commons/ca/ca.jsp", null, function(){
        					layerHandler.dialog(("#div_alert_jspb"));	
        				});
        				return false;
        			}
        			if(data.isSKpbApp != null && data.isSKpbApp == "Y") {
        				$("#show_appdetial").load(getContextPath() + "/commons/ca/ca.jsp", null, function(){
        					layerHandler.dialog(("#div_alert_skpb"));
        				});
        				return false;
        			}
                	//ZRJC.openNewWindow(data.url);
//	                		var opt = {title :item.app_name, src : data.url, 	selected : false, close : true};
            		var opt = {id : item.app_dm.replace(/\./g, "_"), title :item.app_name, src : data.url, 	selected : false, close : true, click_refresh : false};
            		//ZRJC.log(item);
            		//alert(item.app_name);
            		window.top.Index_tab.add_tab(opt);
            		window.top.$("#ulTabId_"+opt.id).smartMenu(imageMenuData, {
        			    name: "image"    
        			});
        		}else{
            		layerHandler.alert("用户未与企业绑定，非默认程序不可用");
            	}	
        	}
			return false;
//			var app_detail = {title : "应用详情", src : retUrl, 	selected : false, close : true};
//			Index_tab.add_tab(app_detail);
		} ,function(data){
			 try{
				    layerHandler.alert("连接超时，请重试",function(){
						window.location.reload();
					});
			    }catch(e){
				    /*  console.log(e);*/
			   }

		});
	} else {
		$(".out_div:first", field).show();
	}
}
$(function(){
	$("#online dt,dd").click(function(){
		var url = getContextPath()+"/user/online/query_index.do"
		$.ajax({
			url : url,
			type : 'post',
			data : null,
			async : true,
			dataType : "json",
			success : function(json) {
			         var url = getContextPath()+"/"+json.url;
				   if(json.code =="0000"){
				       var opt = {id : "online", title :"网上预约", src : url, 	selected : false, close : true, click_refresh : false};
	                		window.top.Index_tab.add_tab(opt);
				   }
			
			},
			error :function(json){
			 alert(json);
				 layerHandler.alert("连接超时，请重试",function(){
						window.location.reload();
					});
			 }
		
	     });
});
});




//添加应用使用频率
//function yysypl(params){
//	var url =getContextPath()+"/user/my_app/yySypl.do";
//	$.ajax({
//		type : "POST",
//		url : url,
//		data:params,
//		dataType : 'json',
//		success : function(msg) {
//		}});
//} 
