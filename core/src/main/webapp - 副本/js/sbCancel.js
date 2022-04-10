function sbCancel(lsh,sbzl,sssq_q,sssq_z,yzpzxh,tbrq,ybtse,sbuuid,callJs){
	// 受理通过的《土地增值税纳税申报表（二）（从事房地产开发的纳税人清算适用）》无法作废
	if(sbzl == "10519"){
		layerHandler.alertauto("受理通过的《土地增值税纳税申报表（二）（从事房地产开发的纳税人清算适用）》不允许作废！","提示信息","360px","180px",null);
		return;
	}
	
	if(sbzl == "10521"){
		layerHandler.alertauto("《土地增值税纳税申报表（从事房地产开发的纳税人清算方式为核定征收适用）》不允许作废！","提示信息","360px","180px",null);
		return;
	}
	 //添加校验,添加逾期申报过申报期限的税种 不允许作废,因为存在逾期申报情况,此时已经过了申报期,申报成功后,不可作废
	 //由于逾期申报需要放开,只要纳税人处理了罚款违章，所以会存在很多逾期申报的税种,不再根据当前月申报作为作废判断,直接根据申报属期获取申报期限校验
	 debugger;
	 //申报作废添加逻辑 :如果过申报期 不允许作废 
	 $.etaxAjax('sbCancelAction.action?sign=sbCancelCheck', {
			"sbzl" : sbzl,
			"sssq_q":sssq_q,
	 		"sssq_z":sssq_z
		}, function(data) {
			debugger;//票表比对时只针对强制监控的数据校验 提示性的校验放在申报提交时触发
			if (data["zfbz"] == '1') {//不允许作废
				layerHandler.alertauto("当前属期已过申报期,不允许作废!","提示","280px","160px",null);
				return;
			}else if (data["zfbz"] == '2') {//年报A申报期最后一天不允许作废
				layerHandler.alertauto("《居民企业所得税查账征收年度申报》申报期最后一天,不允许作废!","提示","320px","180px",null);
				return;
			}else{
				layerHandler.confirm("您确定要执行申报作废操作吗？", "提示信息", "330px", "160px", function(){
			 		delegateSbCancel(lsh,sbzl,sssq_q,sssq_z,yzpzxh,tbrq,ybtse,sbuuid,callJs);
			 	}, null);
			}
		});
 }
function delegateSbCancel(lsh,sbzl,sssq_q,sssq_z,yzpzxh,tbrq,ybtse,sbuuid,callJs){
	$.etaxAjax('sbCancelAction.action?sign=sbCancel', {
 		"lsh" :lsh,
 		"sbzl" : sbzl,
 		"sssq_q":sssq_q,
 		"sssq_z":sssq_z,
 		"tbrq":tbrq,
 		"ybtse":ybtse,
 		"sbuuid":sbuuid,
 		"yzpzxh":yzpzxh
 	}, function(data) {
 		debugger;
 		if(data["rtn_code"]=='0'){
 			layerHandler.alert('申报作废成功!','提示信息',function(){
 				if(typeof callJs === 'function'){
 					callJs();
 				}
 			});
 		}else if(data["rtn_code"]=='2'){
 			layerHandler.alertauto(data["rtn_msg"],'提示信息',"350","200",function(){
 				if(typeof callJs === 'function'){
 					callJs();
 				}
 			});
 		}else{
			var tag="核心征管服务发生业务异常：";
			var errMsg=data["rtn_msg"];
			errMsg="<font style='color: red;font-weight: bold;font-size:15px;'>"+tag+"</font><br/>"+errMsg;
			 layerHandler.alertauto(errMsg,"提示信息","450","250",null);
 		}
 	});
 } 