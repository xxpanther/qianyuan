//插件编写
;(function($) {
	jQuery.extend({
				"showInfo" : function(message, title, btn,width,height) {
					if ($("#info_dialog").length == 0) {
						$("body").append('<div id="info_dialog"> <p style="height:48px;line-height:48px"> <img width="24" height="24" style="vertical-align:middle;" src="lib/jquery/images/info.png"><span id="info_message"  style="margin-left:15px;font-weight:bold;color:#4f4f4d;"></span></p> </div>');
					}
					var ags = arguments;
					var cfg = {};
					cfg.message = message || "操作成功";
					cfg.bgiframe = true;
					cfg.modal=true;					
					cfg.title = title || "提示信息";
					
					if(width){
						cfg.width=	width;
					}
					if(height){
						cfg.height=	height;
					}

					cfg.buttons = btn || {
						"确定" : function() {
							$(this).dialog('close');
						}
					};
					$("#info_message").html(cfg.message);
                    
					$("#info_dialog").dialog(cfg);
					
				},
				
				"showConfirm" : function (message, callback){
				    if ($("#confirm_dialog").length == 0) {
				        $("body").append('<div id="confirm_dialog"> <p id="confirm_message"></p> </div>');}
				        $("#confirm_dialog").dialog({
				            autoOpen: false,
				            title: '提示',
				            modal: true,
				            resizable:false,
				            buttons: {
				                "确定": function(){
				                if(callback){
				                    callback();}
				                    $(this).dialog("close");
				                },
				                "取消": function(){
				                    $(this).dialog("close");
				                }
				            }
				        });
				    $("#confirm_message").html(message);
				    $("#confirm_dialog").dialog("open"); 
				    },
				    
				    "appPublishInit" : function (title, callback){
				        $("#appPublish").dialog({
				            autoOpen: false,
				            title: title,
				            modal: true,
				            resizable:false,
				            buttons: {
				                "确定": function(){
				                if(callback){
				                    callback();}
				                    $(this).dialog("close");
				                },
				                "取消": function(){
				                    $(this).dialog("close");
				                }
				            }
				        });
				    $("#appPublish").dialog("open"); 
				    }
			});
})(jQuery);