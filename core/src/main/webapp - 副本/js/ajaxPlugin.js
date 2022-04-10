;(function($) {
	// 备份jquery的ajax方法
	var _ajax = $.ajax;
	 
	// 重写jquery的ajax方法
	$.ajax = function(opt) {
		// 备份opt中error和success方法
		var fn = {
			error : function(XMLHttpRequest, textStatus, errorThrown) {
			},
			success : function(data, textStatus) {
			}
		}
		if (opt.error) {
			fn.error = opt.error;
		}
		if (opt.success) {
			fn.success = opt.success;
		}

		// 扩展增强处理
		var _opt = $.extend(opt, {
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				// 错误方法增强处理
				fn.error(XMLHttpRequest, textStatus, errorThrown);
			},
			success : function(data, textStatus) {
				// 成功回调方法增强处理
				if(data && data["EXCEPTION-CODE"]){
					//layerHandler.alert("错误码："+data["EXCEPTION-CODE"]+"<br>错误信息:"+data["EXCEPTION-MSG"],'错误信息',function(){
				    //新增错误折叠 by zyh 2016.7.26
					layerHandler.alertErrorFold("系统异常,请联系运维人员。错误码："+data["EXCEPTION-CODE"],"错误信息:"+data["EXCEPTION-MSG"],'错误信息',function(){	
						try{
							Exception_CallBack();
						}catch(e){}
					});
				}else{
					fn.success(data, textStatus);
				}
			}
		});
		return _ajax(_opt);
	};
})(jQuery);