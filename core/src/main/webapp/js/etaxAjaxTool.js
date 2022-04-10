$.etaxAjax=function(_url,_data,_callback,_async){
	$.ajax({
		type:"POST",
		url:_url,
		data:_data,
		async:_async,
		beforeSend:function(XMLHttpRequest){
			loadingInfo();
		},
		complete:function(XMLHttpRequest,textStatus){
			removeLoadingInfo();
		},
		success:function(data){
			if(data["EXCEPTION-CODE"]){
				layerHandler.alert("错误码："+data["EXCEPTION-CODE"]+"<br>错误信息:"+data["EXCEPTION-MSG"],'错误信息');
				return;
			}
			if(_callback){
				_callback(data);
			}
		},
		error:function(e) {
			debugger;
			removeLoadingInfo();
			if(e.status=='502'){
				var path=getContextPath();
				var container=path.substring(path.indexOf('V'),path.indexOf('shenbao')+7);
				$.ajax({type:"POST",url:'/go?sign=checkcontainer&ctname='+container+'&app=shenbao&tag=12345678&tagType=1',success:function(data){
					var msg=$.parseJSON(data);
					if(msg["Result"]=='9999'){
						layerHandler.alert('当前页面已经过期,请关闭当前app应用,重新进入.');
					}
				},error:function(ex) {
					console.log($.toJSON(ex));
				}});
			}else{
				layerHandler.alertErrorFold("系统异常,请联系运维人员。错误码："+e.status,"错误信息:"+e.responseText,'错误信息',null);
			}
			
		}
	});
};

