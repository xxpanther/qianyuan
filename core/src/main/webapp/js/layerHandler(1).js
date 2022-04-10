var layerHandler = {
	errorMsg : null,
	screenHeight: function (){
		if(document.body.clientHeight>100&&document.body.clientHeight<window.screen.availHeight){
			return document.body.clientHeight;
		}else{
			return window.screen.availHeight-75;
		}
	},
	setMsg : function(msg){
		this.errorMsg = msg;
	},
	getMsg : function(){
		return this.errorMsg;
	},
	/**
	 * 提示信息框
	 * @param msg
	 *            提示消息
	 * @param title
	 *            提示标题（默认为 "提示"），默认title下，可为回调函数
	 * @param yes
	 *            按钮回调函数
	 */
	alert : function(msg, title, fn) {

		var icon = -1;
		var isfn1 = (typeof title === 'function');
		var title_default = "提示";
		if(title){
			title_default = isfn1 ? title_default : title;
		}

		var yes = isfn1 ? title : fn;
		
		var _yes = function(index){
			if(yes){
				yes(index);
			}
			layer.close(index);
		};
		
		
		// 判断是否是回调函数
		var conf = {
			title : [ title_default, 'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1)'],  // title背景色
			dialog : {
				msg : msg,
				type : icon,
//				btns: 2,
				yes : _yes
			},
//			area : [ 'auto', 'auto' ]
			area : [ '250px', '160px' ],
			border:[6,1,"#c6c6c6"]
		};

		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-85+"px";
		 conf.offset = [top,""];
		
		$.layer(conf);

	},	
	alertauto : function(msg, title,width,height, fn) {
		this.setMsg(msg);
		var icon = -1;
		var isfn1 = (typeof title === 'function');
		var title_default = "提示";
		if(title){
			title_default = isfn1 ? title_default : title;
		}

		var yes = isfn1 ? title : fn;
		
		var _yes = function(index){
			if(yes){
				yes(index);
			}
			layer.close(index);
		};

		// 判断是否是回调函数
		var conf = {
			title : [ title_default, 'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1)'],  // title背景色
			dialog : {
				msg : msg,
				type : icon,
//				btns: 2,
				yes : _yes
			},
//			area : [ 'auto', 'auto' ]
			area: [width, height],
			border:[6,1,"#c6c6c6"]
		};
		debugger;
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(height)*0.5-10+"px";
		 conf.offset = [top,""];
		 
		$.layer(conf);

	},
	/**
	 * 错误折叠 提示信息框
	 * @param code
	 *			错误码
	 * @param msg
	 *            提示消息
	 * @param title
	 *            提示标题（默认为 "提示"），默认title下，可为回调函数
	 * @param yes
	 *            按钮回调函数
	 */
	layerindex:"",
	alertErrorFold : function(code, msg, title, fn) {
		var icon = -1;
		var isfn1 = (typeof title === 'function');
		var title_default = "提示";
		if(title){
			title_default = isfn1 ? title_default : title;
		}
		
		var yes = isfn1 ? title : fn;
		
		var _yes = function(index){
			if(yes){
				yes(index);
			}
			layer.close(index);
		};
		
		var _html = "<div class='errorBox' style='width:100%;height:100%;word-break: break-all;'>"
						+code+"<div class='openError' style='color:rgb(81, 138, 201);margin-top:40px;margin-left:10px;line-height:30px;cursor:pointer;' "
						+"onclick=\"layerHandler._resize(this);\">详情如下</div>"
						+"<div id='errorIM' style='display:none;height:300px;overflow-y:auto;'>"+msg+"</div>"
					+"</div>";		
	    
		var conf = {
			type:1,
			title : [ title_default, 'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1)'],  // title背景色
			page: {
		    	html:_html 
		    },
			area : [ '250px', '150px' ],
			border:[6,1,"#c6c6c6"]
		};
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-150*0.5-20+"px";
		 conf.offset = [top,""];
		layerHandler.layerindex = $.layer(conf);

	},
	_resize : function(_this) {
		if($(_this).html()=="查看详情"){
			layer.area(layerHandler.layerindex,{width:"500px",height:"400px"}); 
			$("#errorIM").show();
			$(_this).html("收起详情").css("margin-top","0px");
		}else{
			layer.area(layerHandler.layerindex,{width:"250px",height:"150px"});
			$("#errorIM").hide();
			$(_this).html("查看详情").css("margin-top","40px");
		}
		
	},
	dialog : function(_html,_title,width,height,_top){
		debugger;
		var _width = width;
		var _height = height;
		var conf = {
				 type: 1,   //0-4的选择,（1代表page层）
				 area: [_width, _height],
				 title: [
				        _title,
				        'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1);' //title背景色
				    ],
				border:[6,0.9,"#c6c6c6"],
				bgcolor: '#fff', //设置层背景色
				page: {
				    	html: _html 
				    }
		   };
		//重新定位 fix iframe 过长 不居中再底部问题
		var top="";
		if(_top){
			top=_top;
		}else{
			if($.browser.msie){
				//IE
				top= parseInt(_width)*0.5-parseInt(_height)*0.5-10+"px";
			}else{//其他浏览器
				top= layerHandler.screenHeight()*0.5-parseInt(_height)*0.5-10+"px";
			}
		}
		 conf.offset = [top,""];
		layerHandler.layerindex = $.layer(conf);
	},
	dialogbtn : function(_html,_title,width,height,yesfn){
		var _width = width;
		var _height = parseInt(height);
		var new_html = "<div style='position: relative;'>"
		        +"<div style='position: relative;width:"+parseInt(width)+"px;height:"+_height+"px; overflow-y:auto;'>"
				+_html
				+"</div>"
				+"<div class='tablebtns' style='width:225px;height:50px;position:absolute;bottom:-50px;left:50%;margin-left:-112px;'>"
					+"<input type='button' class='btn02' value='确认' onclick='"+yesfn.toString() +"();' />"
					+"<input type='button' class='btn02' value='取消' onclick='layer.closeAll();' />"
				+"</div>"
				
			+"</div>";
		var conf = {
				 type: 1,   //0-4的选择,（1代表page层）
				 area: [_width, _height+80],
				 title: [
				        _title,
				        'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1);' //title背景色
				    ],
				border:[6,0.9,"#c6c6c6"],
				bgcolor: '#fff', //设置层背景色
				page: {
				    	html: new_html 
				    }
		   };
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(_height)*0.5-10+"px";
		 conf.offset = [top,""];		
		layerHandler.layerindex = $.layer(conf);
	},
	dialogYes : function(_html,_title,width,height,yesfn){
		var _width = width;
		var _height = parseInt(height);
		var new_html = "<div style='position: relative;'>"
		        +"<div style='position: relative;width:"+parseInt(width)+"px;height:"+_height+"px; overflow-y:auto;'>"
				+_html
				+"</div>"
				+"<div class='tablebtns' style='width:225px;height:50px;position:absolute;bottom:-50px;left:50%;margin-left:-112px;'>"
					+"<input type='button' class='btn02' value='确认' onclick='layer.closeAll();' />"
				+"</div>"
				
			+"</div>";
		var conf = {
				 type: 1,   //0-4的选择,（1代表page层）
				 area: [_width, _height+80],
				 title: [
				        _title,
				        'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1);' //title背景色
				    ],
				border:[6,0.9,"#c6c6c6"],
				bgcolor: '#fff', //设置层背景色
				page: {
				    	html: new_html 
				    }
		   };
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(_height)*0.5-10+"px";
		 conf.offset = [top,""];		
		layerHandler.layerindex = $.layer(conf);
	},
	dialogbtnOver : function(_html,_title,width,height,yesfn,nofn){
		var _width = width;
		var _height = parseInt(height);
		var new_html = "<div style='position: relative;'>"
		        +"<div style='position: relative;width:"+parseInt(width)+"px;height:"+_height+"px; overflow-y:auto;'>"
				+_html
				+"</div>"
				+"<div class='tablebtns' style='width:225px;height:50px;position:absolute;bottom:-50px;left:50%;margin-left:-112px;'>"
					+"<input type='button' class='btn02' value='确认' onclick='"+yesfn.toString() +"();' />"
					+"<input type='button' class='btn02' value='取消' onclick='"+nofn.toString()+"();' />"
				+"</div>"
				
			+"</div>";
		var conf = {
				 type: 1,   //0-4的选择,（1代表page层）
				 area: [_width, _height+80],
				 title: [
				        _title,
				        'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1);' //title背景色
				    ],
				border:[6,0.9,"#c6c6c6"],
				bgcolor: '#fff', //设置层背景色
				page: {
				    	html: new_html 
				    }
		   };
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(_height)*0.5-10+"px";
		 conf.offset = [top,""];		
		layerHandler.layerindex = $.layer(conf);
	},
	dialogbtnJjdj : function(_html,_title,width,height,yesfn,nofn){
		var _width = width;
		var _height = parseInt(height);
		var new_html = "<div style='position: relative;'>"
		        +"<div style='position: relative;width:"+parseInt(width)+"px;height:"+_height+"px; overflow-y:auto;'>"
				+_html
				+"</div>"
				+"<div class='tablebtns' style='width:225px;height:50px;position:absolute;bottom:-50px;left:50%;margin-left:-112px;'>"
					+"<input type='button' class='btn02' value='填写声明' onclick='"+yesfn.toString() +"();' />"
					+"<input type='button' class='btn02' value='关闭' onclick='"+nofn.toString()+"();' />"
				+"</div>"
				
			+"</div>";
		var conf = {
				 type: 1,   //0-4的选择,（1代表page层）
				 area: [_width, _height+80],
				 title: [
				        _title,
				        'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1);' //title背景色
				    ],
				border:[6,0.9,"#c6c6c6"],
				bgcolor: '#fff', //设置层背景色
				page: {
				    	html: new_html 
				    }
		   };
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(_height)*0.5-10+"px";
		 conf.offset = [top,""];		
		layerHandler.layerindex = $.layer(conf);
	},
	alertErrDemo : function(_html,_title,width,height){
		var _width = width;
		var _height = parseInt(height);
		var new_html = "<div style='position: relative;'>"
		        +"<div style='position: relative;width:"+parseInt(width)+"px;height:"+_height+"px; overflow-y:auto;'>"
				+_html
				+"</div>"
				+"<div class='tablebtns' style='width:225px;height:50px;position:absolute;bottom:-50px;left:50%;margin-left:-112px;'>"
				+"</div>"
				
			+"</div>";
		var conf = {
				 type: 1,   //0-4的选择,（1代表page层）
				 area: [_width, _height+80],
				 title: [
				        _title,
				        'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1);' //title背景色
				    ],
				border:[6,0.9,"#c6c6c6"],
				bgcolor: '#fff', //设置层背景色
				page: {
				    	html: new_html 
				    }
		   };
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(_height)*0.5-10+"px";
		 conf.offset = [top,""];		
		layerHandler.layerindex = $.layer(conf);
	},
	dialogForm: function(_html,_title,width,height,yesfn,nofn,cancel){
		var _width = width;
		var _height = parseInt(height);
		var new_html = "<div style='position: relative;'>";
		new_html+="<div style='position: relative;width:"+parseInt(width)+"px;height:"+_height+"px; overflow-y:auto;'>";
		new_html+=_html;
		new_html+="</div>";
			new_html+="<div class='tablebtns' style='width:225px;height:50px;position:absolute;bottom:-50px;left:50%;margin-left:-112px;'>";
				new_html+="<input type='button' class='btn02' value='确认' onclick='"+yesfn.toString() +"();' />";
					if(cancel){
						new_html+="<input type='button' class='btn02' value='取消' onclick='"+nofn.toString()+"();' />";
					}
		new_html+="</div>";
				
		new_html+="</div>";
		var conf = {
				 type: 1,   //0-4的选择,（1代表page层）
				 area: [_width, _height+80],
				 title: [
				        _title,
				        'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1);' //title背景色
				    ],
				border:[6,0.9,"#c6c6c6"],
				bgcolor: '#fff', //设置层背景色
				page: {
				    	html: new_html 
				    }
		   };
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = '';
		if($.browser.msie){
			top=layerHandler.screenHeight()*0.5-parseInt(_height)*0.5+"px";
		}else{
			top=layerHandler.screenHeight()*0.5-parseInt(_height)*0.5-76+"px";
		}
		 conf.offset = [top,""];		
		layerHandler.layerindex = $.layer(conf);
	},
//	prompt : function(options, fn){
//		window.top.$.layer.prompt({title: options.title}, function(name){
//			fn();
//		});
//	}
	/**
	 * 提示信息框
	 * @param msg
	 *            提示消息
	 * @param title
	 *            提示标题（默认为 "提示"），默认title下，可为回调函数
	 * @param yesfn
	 *            按钮回调函数
	 */
	confirm : function(msg, title,width,height, yesfn,noFn) {

		var icon = -1;
		var isfn1 = (typeof title === 'function');
		var title_default = "提示";
		if(title){
			title_default = isfn1 ? title_default : title;
		}

		var yes = isfn1 ? title : yesfn;
		var no =  isfn1 ? title : noFn;
		//debugger;
		var _yes = function(index){
			if(yes){
				yes(index);
			}
			layer.close(index);
		};
		 var nofn = function(index){
			 if(no){
				 no(index);
			 }
			 layer.close(index);
		 };
		 
		// 判断是否是回调函数
		var conf = {
			title : [ title_default, 'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1)'],  // title背景色
			dialog : {
				msg : msg,
				type : icon,
				btns: 2,
				btn: ['是','否'],
				yes : _yes,
				no:nofn
			},
			area : [ width, height ],
			border:[6,1,"#c6c6c6"]
		};
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(height)*0.5-10+"px";
		 conf.offset = [top,""];
		layerHandler.layerindex = $.layer(conf);

	},
	/**
	 * 提示信息框
	 * @param msg
	 *            提示消息
	 * @param title
	 *            提示标题（默认为 "提示"），默认title下，可为回调函数
	 * @param yesfn
	 *            按钮回调函数
	 */
	confirmCancel : function(msg, title,width,height, yesfn,noFn) {

		var icon = -1;
		var isfn1 = (typeof title === 'function');
		var title_default = "提示";
		if(title){
			title_default = isfn1 ? title_default : title;
		}

		var yes = isfn1 ? title : yesfn;
		var no =  isfn1 ? title : noFn;
		//debugger;
		var _yes = function(index){
			if(yes){
				yes(index);
			}
			layer.close(index);
		};
		 var nofn = function(index){
			 if(no){
				 no(index);
			 }
			 layer.close(index);
		 };
		 
		// 判断是否是回调函数
		var conf = {
			title : [ title_default, 'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1)'],  // title背景色
			dialog : {
				msg : msg,
				type : icon,
				btns: 2,
				btn: ['继续','取消'],
				yes : _yes,
				no:nofn
			},
			area : [ width, height ],
			border:[6,1,"#c6c6c6"]
		};
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(height)*0.5-10+"px";
		 conf.offset = [top,""];
		layerHandler.layerindex = $.layer(conf);

	},
	/**
	 * 提示信息框(只弹出确定按钮 无法取消)
	 * @param msg
	 *            提示消息
	 * @param title
	 *            提示标题（默认为 "提示"），默认title下，可为回调函数
	 * @param yesfn
	 *            按钮回调函数
	 */
	confirmQd: function(msg, title,width,height, yesfn) {
		var icon = -1;
		var isfn1 = (typeof title === 'function');
		var title_default = "提示";
		if(title){
			title_default = isfn1 ? title_default : title;
		}
		var yes = isfn1 ? title : yesfn;
		//debugger;
		var _yes = function(index){
			if(yes){
				yes(index);
			}
			layer.close(index);
		};
		// 判断是否是回调函数
		var conf = {
			title : [ title_default, 'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1)'],  // title背景色
			dialog : {
				msg : msg,
				type : icon,
				btns: 1,
				btn: ['确定'],
				yes : _yes
			},
			area : [ width, height ],
			border:[6,1,"#c6c6c6"]
		};
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(height)*0.5-10+"px";
		 conf.offset = [top,""];
		layerHandler.layerindex = $.layer(conf);

	},
	doClose:function(){
		layer.closeAll();
	},
	/**
	 * 提示信息框(只弹出确定按钮 无法取消)
	 * @param msg
	 *            提示消息
	 * @param title
	 *            提示标题（默认为 "提示"），默认title下，可为回调函数
	 * @param yesfn
	 *            按钮回调函数
	 */
	confirmCgs: function(msg, title,width,height, yesfn) {
		var icon = -1;
		var isfn1 = (typeof title === 'function');
		var title_default = "提示";
		if(title){
			title_default = isfn1 ? title_default : title;
		}
		var yes = isfn1 ? title : yesfn;
		//debugger;
		var _yes = function(index){
			if(yes){
				yes(index);
			}
			layer.close(index);
		};
		// 判断是否是回调函数
		var conf = {
			title : [ title_default, 'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1)'],  // title背景色
			dialog : {
				msg : msg,
				type : icon,
				btns: 2,
				btn: ['确认核对','取消核对'],
				yes : _yes
			},
			area : [ width, height ],
			border:[6,1,"#c6c6c6"]
		};
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.7-parseInt(height)*0.5-10+"px";
		 conf.offset = [top,""];
		layerHandler.layerindex = $.layer(conf);

	},
	doClose:function(){
		layer.closeAll();
	},
	/**
	 * 提示信息框(只弹出确定按钮 无法取消)
	 * @param msg
	 *            提示消息
	 * @param title
	 *            提示标题（默认为 "提示"），默认title下，可为回调函数
	 * @param yesfn
	 *            按钮回调函数
	 */
	confirmSdsA: function(msg, title,width,height, yesfn,noFn) {
		var icon = -1;
		var isfn1 = (typeof title === 'function');
		var title_default = "提示";
		if(title){
			title_default = isfn1 ? title_default : title;
		}
		var yes = isfn1 ? title : yesfn;
		var no =  isfn1 ? title : noFn;
		//debugger;
		var _yes = function(index){
			if(yes){
				yes(index);
			}
			layer.close(index);
		};
		var nofn = function(index){
			 if(no){
				 no(index);
			 }
			 layer.close(index);
		 };
		// 判断是否是回调函数
		var conf = {
			title : [ title_default, 'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1)'],  // title背景色
			dialog : {
				msg : msg,
				type : icon,
				btns: 2,
				btn: ['继续申报','终止申报'],
				yes : _yes,
				no:nofn
			},
			area : [ width, height ],
			border:[6,1,"#c6c6c6"]
		};
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.7-parseInt(height)*0.5-10+"px";
		 conf.offset = [top,""];
		layerHandler.layerindex = $.layer(conf);

	},
	doClose:function(){
		layer.closeAll();
	},
	/**
	 * 提示信息框(主附税联合申报套餐)
	 * @param msg
	 *            提示消息
	 * @param title
	 *            提示标题（默认为 "提示"），默认title下，可为回调函数
	 * @param yesfn
	 *            按钮回调函数
	 */
	confirmZfslhsb: function(msg, title,btnName,width,height, yesfn) {
		var icon = -1;
		var isfn1 = (typeof title === 'function');
		var title_default = "提示";
		if(title){
			title_default = isfn1 ? title_default : title;
		}
		var yes = isfn1 ? title : yesfn;
		//debugger;
		var _yes = function(index){
			if(yes){
				yes(index);
			}
			layer.close(index);
		};
		// 判断是否是回调函数
		var conf = {
			title : [ title_default, 'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1)'],  // title背景色
			dialog : {
				msg : msg,
				type : icon,
				btns: 1,
				btn: [btnName],
				yes : _yes
			},
			area : [ width, height ],
			border:[6,1,"#c6c6c6"]
		};
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(height)*0.5-10+"px";
		 conf.offset = [top,""];
		layerHandler.layerindex = $.layer(conf);

	},
	doClose:function(){
		layer.closeAll();
	},
	dialogbtnJyjs : function(_html,_title,width,height,yesfn,nofn){
		var _width = width;
		var _height = parseInt(height);
		var new_html = "<div style='position: relative;'>"
		        +"<div style='position: relative;width:"+parseInt(width)+"px;height:"+_height+"px; overflow-y:auto;'>"
				+_html
				+"</div>"
				+"<div class='tablebtns' style='width:225px;height:50px;position:absolute;bottom:-45px;left:50%;margin-left:-112px;'>"
					+"<input type='button' class='btn02' value='继续申报' onclick='"+yesfn.toString() +"();' />"
					+"<input type='button' class='btn02' value='关闭' onclick='"+nofn.toString()+"();' />"
				+"</div>"
				
			+"</div>";
		var conf = {
				 type: 1,   //0-4的选择,（1代表page层）
				 area: [_width, _height+80],
				 title: [
				        _title,
				        'border:none;color:#fff;background-color:#518AC9;background-image:linear-gradient(to top, #2f5e9e, #5792d1);' //title背景色
				    ],
				border:[6,0.9,"#c6c6c6"],
				bgcolor: '#fff', //设置层背景色
				page: {
				    	html: new_html 
				    }
		   };
		//重新定位 fix iframe 过长 不居中再底部问题
		var top = layerHandler.screenHeight()*0.5-parseInt(_height)*0.5-10+"px";
		 conf.offset = [top,""];		
		layerHandler.layerindex = $.layer(conf);
	}
};