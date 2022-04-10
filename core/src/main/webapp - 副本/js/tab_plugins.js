var Index_tab = function(){
		var options = null;
		options = {
			tab_totalwidth: 540,
		   	tab_index : 0,								//页签计数器，用于新增页签id增量操作	
			tab_index_str : "ulTabId_",					//tab标签id默认字符串
			default_tab : "",
			select : function(){
			},
			
			// 初始化创建页签对象
			render : function(_option){
				if(_option["tab_list"] && _option["tab_list"].length > 0){
				$(_option.tab_id).append("<ul></ul>");
					for(var i=0;i<_option["tab_list"].length;i++){
						var _item = _option["tab_list"][i];
						$(_option.tab_id + " ul:first").append(options._add_tab(_item));
					}
				}
			},
			_add_tab : function(item){
				/* 创建页签id start*/
				var _li_id = "";
				if(item.id){
						_li_id = options.tab_index_str + item.id; 
				}else{
						
					_li_id = options.tab_index_str + options.tab_index; 
					options.tab_index ++;
				}
//				alert(_li_id)
				
				// 默认显示tab也签
				if(item.selected){
					options.default_tab = _li_id;
				}
			
				/* 创建页签id start*/
//				alert(_li_id)
				var _str = "";
				var tempid = "";
				if(item.type){
					tempid = item.id;
				}else{
					tempid = _li_id;
				}
				
				refresh = (item.click_refresh == undefined || item.click_refresh) ? "click_refresh" : "";
				if(!item.isLoadAjax){
					isLoadAjax=false;
				}
				if(item.isLoadJrj){
					_str += item.selected ? "<li onmouseover='show_banner()' onmouseout='hide_banner()' class='active-left "+refresh+"' id='"+_li_id+"' title='" + item.title + "' src='"+item.src+"' isLoadAjax = '"+item.isLoadAjax+"'>" : "<li onmouseover='show_banner()' onmouseout='hide_banner()' id='"+tempid+"' class='index_tab_not_selected meau "+refresh+"' title='" + item.title + "' src='"+item.src+"' isLoadAjax = '"+item.isLoadAjax+"'>" ;
				}else{
					_str += item.selected ? "<li class='active-left "+refresh+"' id='"+_li_id+"' title='" + item.title + "' src='"+item.src+"' isLoadAjax = '"+item.isLoadAjax+"'>" : "<li id='"+tempid+"' class='index_tab_not_selected meau "+refresh+"' title='" + item.title + "' src='"+item.src+"' isLoadAjax = '"+item.isLoadAjax+"'>" ;
				}
				_str += item.close ? "<p><img src='"+staticPath+"/css/images/cc.png' width='14' height='14' ></p>" : "" ;
				_str += item.title;
				if(item.isLoadJrj){
					if(item.jrjxx_jg){
						_str += "<div style='display:none' id ='jrj_d' class='jrj_box' ><p>"+item.jrjxx_cp+"预授信额度区间</p><b>"+item.jrjxx_ed+"</b><a target='_blank' href='"+item.jrjxx_url+"'>查看详情</a></div>";
					}else{
						_str += "<div style='display:none' id ='jrj_d'  class='jrj_box_' ></div>";
					}
				}
				_str +="</li>";
				return _str;
			},
			//构建tab对应内容
			_init_tab_container : function(field){

				var _tab_content_src = field.attr("src");

				var _tab_item_id = field.attr("id");
				var _tab_content_id = _tab_item_id + "_container";
				/*
				<div id="contentiframe_home" class="all">
					<iframe src="html-left/home.html" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" width="100%" height="100%" name="iframepage"></iframe>
				</div>
				 */
				var _str = "";
				_str += '<div id="'+_tab_content_id+'" class="iframe_tab_container" style="height:100%;">';
				_str += '	<iframe src="'+_tab_content_src+'" marginheight="0" marginwidth="0" frameborder="0" scrolling="auto" width="100%" height="100%" ></iframe>';
				_str += '</div>';
				
				return _str;
			},
			//构建tab对应内容
			_init_tab_container_ajax : function(field){
				var _tab_content_src = field.attr("src");
				var _tab_item_id = field.attr("id");
				var _tab_content_id = _tab_item_id + "_container";
				/*
				<div id="contentiframe_home" class="all">
					<iframe src="html-left/home.html" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" width="100%" height="100%" name="iframepage"></iframe>
				</div>
				 */
				var _str = "";
				_str += '<div id="'+_tab_content_id+'" style="height:100%;" class="iframe_tab_container" >';
				
//				_str += '	<iframe src="'+_tab_content_src+'" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" width="100%" height="100%" ></iframe>';
				_str += '</div>';
				
				return _str;
			},
			
			eventHandler : function(_option){
				$(_option.tab_id + " ul li .jrj_box_").live("click", function(){
					var field = $(this).parent();
					$(options.tab_id + " ul li").removeClass("active-left").addClass("index_tab_not_selected").css("color","#7ecef4");
					field.addClass("active-left").removeClass("index_tab_not_selected").css("color","#fff");
					
					options._load_data(field);
					
					$(_option.tab_id).show();
					$("#index_body_container").show();
					
				})
				$(_option.tab_id + " ul li").live("click", function(){
					var field = $(this);
					$(options.tab_id + " ul li").removeClass("active-left").addClass("index_tab_not_selected").css("color","#7ecef4");
					field.addClass("active-left").removeClass("index_tab_not_selected").css("color","#fff");
					
					options._load_data(field);
					
					$(_option.tab_id).show();
					$("#index_body_container").show();
					
				}).live("mouseover", function(){
					var field = $(this);
					if(!field.hasClass("active-left")){
						$(_option.tab_id + " ul li[class*=index_tab_not_selected]").css("color","#7ecef4");
						field.css("color","#fff");;
					}
				}).live("mouseout", function(){
					var field = $(this);
					if(!field.hasClass("active-left")){
						field.css("color","#7ecef4");
					}
				});
				
				// 关闭tab按钮触发
				$(_option.tab_id + " ul li p").live("click", function(){
					var field = $(this);
					var li_width=field.parent("li").width();
				    var _width=window.screen.width; 
				    var _ulwidth=window.screen.width-481;
					options.tab_totalwidth=options.tab_totalwidth-li_width-30;
					if(_ulwidth>options.tab_totalwidth){
						$(".roll-left,.roll-right").hide();
						$("#mylist ul").animate({
							left : "0"
						})
					}
					// 关闭移除tab，并且删除对应内容
					field.parent("li").remove();
					var _container_id = field.parent("li").attr("id") + "_container";
//					alert(field.parent("li").attr("id"));
					$("#"+_container_id).hide().remove();
					
					var liId=field.parent().attr("id");
					
					if(liId=="ulTabId_usercenterindex"||liId=="ulTabId_appcenterindex"||liId=="ulTabId_settingindex"||liId == "ulTabId_smyzindex"){
						$(_option.tab_id + " ul li:first").trigger("click");
					}else{
						$(_option.tab_id + " ul li:eq(1)").trigger("click");
					}
					
					return false;
				    //options._load_data($(_option.tab_id + " ul li:first").attr("src"));
					//
				
				});
				
				$(".roll-left").click(function(){
					var cLeft = parseInt($("#mylist ul").css("left").replace("px", ""));
					if(cLeft<0){
						if(cLeft<-100){
					$("#mylist ul").animate({
						left : "+=50px"
					})
						}
						else{
							$("#mylist ul").animate({
								left : "0"
							})	
						}
				}
				else{
					$("#mylist ul").animate({
						left : "0"
					});
					return;
					}
				});
				$(".roll-right").click(function(){

					var cLeft = parseInt($("#mylist ul").css("left").replace("px", ""));
					  var _width=window.screen.width; 
				      var _ulwidth=window.screen.width-481;
		
					if((_ulwidth-options.tab_totalwidth)<(cLeft-5)){
						
					$("#mylist ul").animate({
						left : "-=60px"
					})
						
				}
				else{
					$("#mylist ul").animate({
						left : _ulwidth-options.tab_totalwidth-30
					})
					return;
					}
				})
				
			},
			
			// 单击按钮 加载数据
			_load_data : function(field){
				var _tab_item_id = field.attr("id");	
				//判定是否存在对应的container，不存在重新创建
				// _content
				var tmp_id = (_tab_item_id + "_container").replace(/\./g, "_");
			    
				if($("#"+tmp_id)[0] && !field.hasClass("click_refresh")){
					$("#index_body_container div.iframe_tab_container").hide();
					$("#index_body_container #" + tmp_id).show();
					//点击用户中心 刷新内部数据但不新建iframe 
					/*if(_tab_item_id=="ulTabId_0"){
						refreshIframe_home();
					}*/
					if(_tab_item_id=="ulTabId_appcenterindex"){			
						setTimeout(function(){
							$("#"+tmp_id).find("iframe")[0].contentWindow.refreshIframe();
						},10);
					}
					  /*if(_tab_item_id=="ulTabId_2"){	
						refreshMyapp();
					}*/
					//return null;
					return false;
				}else{
					$("#index_body_container div.iframe_tab_container").hide();
					if(field.attr('isLoadAjax') == "true"&& !field.hasClass("click_refresh")){
						var _tab_item_id = field.attr("id");
						var _tab_content_id = _tab_item_id + "_container";
						if($("#"+_tab_content_id).val()==undefined){
							$("#index_body_container").append(options._init_tab_container_ajax(field));
						}
						//$("#"+_tab_content_id).load(field.attr("src"));
						$.ajax({
							url:field.attr("src"),
							type:"GET",
							dataType:"text",
							success:function(return_html){
								$("#"+_tab_content_id).html(return_html);
							}
						})
					}else{
						$("#index_body_container").append(options._init_tab_container(field));
					}
				}
				
				
				/*
				if($("#"+tmp_id)[0]){
					$("#index_body_container div.iframe_tab_container").hide();
					$("#index_body_container #" + tmp_id).show();
				}else{
					
					$("#index_body_container div.iframe_tab_container").hide();
					$("#index_body_container").append(options._init_tab_container(field));
				}
				 */
				
			},
			
			add_tab : function(item){
				
				options.tab_totalwidth=options.tab_totalwidth;
			    var _option = options;
				// 判断是否显示过该页签，如果显示过，跳转页签，不需要重建
//				var tab_li = $(".tab_ul li a[title='"+item.title+"']");
//				var tab_li = $(_option.tab_id + " ul li[title="+ item.title+"]", window.top);
			    var item_id ="";
			    if(item.type){
			    	  item_id = item.id;
			    }else{
			    	  item_id = options.tab_index_str + item.id;
			    }
			  
			    
				//var item_id = _option.tab_index_str + item.id;
				var tab_li = $("#"+item_id);
				var len = tab_li.length;
				if(len > 0){
					//20150203 修正页面打开多次 刷新的问题
					//window.location.reload();
			//		alert(666)
			//		window.location.reload();
					//options._event_click(item);
					$(_option.tab_id + " ul li").removeClass("active-left").addClass("index_tab_not_selected").css("color","#7ecef4");
					tab_li.addClass("active-left").removeClass("index_tab_not_selected").css("color","#fff");
					
					var _tab_item_id = tab_li.attr("id");
					//判定是否存在对应的container，不存在重新创建
					var tmp_id = _tab_item_id + "_container";
					$("#index_body_container div.iframe_tab_container").hide();
					//window.location.reload();
					$("#index_body_container #" + tmp_id).show();
					//$("#user_index_body").load(item.src);
					
					return ;
				}
			
				//window.location.reload();
				
			  var _width=window.screen.width; 
		      var _ulwidth=window.screen.width-481;
		  	  var field = $(_option._add_tab(item));
		  	  $(_option.tab_id + " ul:first").append(field);
				if(options.tab_totalwidth<_ulwidth)
				{ 
					
				if((_ulwidth-options.tab_totalwidth)<(field.width()+30)){
					$(".roll-left,.roll-right").show();
					
					$("#mylist ul").css("left",_ulwidth-options.tab_totalwidth-field.width()-100);
				   
				}
				
				}
				else{
		
					$(".roll-left,.roll-right").show();
			    	  var _width=window.screen.width; 
				      var _ulwidth=window.screen.width-481;
				   
			    	  $("#mylist ul").css("left",_ulwidth-options.tab_totalwidth-field.width()-100);
					$(_option.tab_id + " ul:first").append(field);
				}
				$(_option.tab_id + " ul li").removeClass("active-left").addClass("index_tab_not_selected").css("color","#7ecef4");
				field.addClass("active-left").removeClass("index_tab_not_selected").css("color","#fff");
				_option._load_data(field);
				options.tab_totalwidth=options.tab_totalwidth + field.width()+30;
			},
			init : function(_option){
				options = $.extend(true, {}, options, _option);
				options.render(_option);
				options.eventHandler(_option);
				// 默认显示tab也签
				if(options.default_tab != ""){
//					alert(options.default_tab)
					options._load_data($("#" + options.default_tab));
				}
			}
		};
		
		return {
			select : options.select,
			init : options.init,
			add_tab : options.add_tab
		};
	}();
	
	
	function show_banner(){
		$("#jrj_d").show();
	}
	
	function hide_banner(){
		$("#jrj_d").hide();
	}