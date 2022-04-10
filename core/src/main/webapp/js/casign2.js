var CASigner = {
	portcheck : function(port){
		var json_port = {};
		$.ajax({
			url:'http://127.0.0.1:'+port+'/caclient',
			type:'post',
			data:'{ "url": "login" }',
			async:false,
			dataType:"json",
			success:function(jsonData) {
				if (jsonData.resultCode == "0") {
					json_port['flag']='1';
					json_port['cert'] = jsonData.Cert;
				}else{
					json_port['flag']='0';
					json_port['error']=jsonData.resultCode+":"+jsonData.resultMsg;
				}
			},
			error:function (XMLHttpRequest, textStatus, errorThrown) {
				json_port['flag']='-1';
			}
		});
		return json_port;
	},
	
	getport : function(){
		var json_port = {};
		var ports=new Array();
		ports[0]="8000";
		ports[1]="32000";
		ports[2]="32001";
		ports[3]="32002";
		ports[4]="32003";
		for (var i=0;i<ports.length;i++){
			json_port = CASigner.portcheck(ports[i]);
			if(json_port['flag']!='-1'){
				if(json_port['flag']=='1'){
					json_port['port']=ports[i];
				}
				break;
			}
		}
		return json_port;
	},
	jsgxcasign4IE : function(ca_login_time){
		try{
			jQuery.support.cors = true;
			var json_obj = {};
			var code = gxcaCert.gxGetCertInfo(1);
			var _cert = gxcaCert.gxGetSelectCert();
			var _nsrsbh = null;
			var _dsswglm = null;
			if(code == 0){
				var subjectDN = gxcaCert.CertInfo;
				var dnData = subjectDN.split(",");
				for (var i = 0; i < dnData.length; i++) {
					var extData = $.trim(dnData[i]).split("=");
					if ("OID.2.5.4.31" == extData[0]) {
						_nsrsbh = extData[1];
					}else if("G" == extData[0] || "OID.2.5.4.42" == extData[0]){
						_dsswglm = extData[1];
					}
				}
			}else{
				layerHandler.alert("国信CA gxGetCertInfo 失败 :"+JsgxcaBase.getGxcaErrMsg(code));
				return;
			}
			if (_nsrsbh != undefined && _nsrsbh != "" && _nsrsbh.length >= 15) {
				json_obj["loginmode"] = '02';
			} else if (_dsswglm != undefined && _dsswglm != "" && (_dsswglm.length == 7 || _dsswglm.length == 10 || _dsswglm.length >= 15)) {
				_nsrsbh = _dsswglm
				json_obj["loginmode"] = '03';
			}
			if(_nsrsbh != undefined && _nsrsbh != ""){
				gxcaSign.B64Certificate = _cert;
				code = gxcaSign.gxPKCS1(_nsrsbh+ca_login_time, 1);
				//console.log("gxcaSign.gxPKCS1="+code);
				if(code == 0){
					json_obj["signature"] = gxcaSign.B64Signature;
					json_obj["cacert"] = gxcaSign.B64Certificate;
					json_obj["causername"] = _nsrsbh;
				}else{
					var error = JsgxcaBase.getGxcaErrMsg(code);
					layerHandler.alert("国信CA login失败:"+error.name+":"+error.message);
				}
			}else{
				layerHandler.alert("您的CA设备中用户信息不正确，请去当地国信CA网点进行更正。如有疑问可联系国信CA客服，025-96010。");
				return;
			}
		}catch (e){
			layerHandler.alert("登录时使用国信CA操作异常，异常信息：" + e+"。可能原因及解决方法如下:<br/>"+"1、国信CA助手未安装或安装后控件未注册成功。请点击【国信CA驱动】下载安装 。<br/>"+"2、可联系国信CA客服，025-96010。");
			return;
		}
		return json_obj;
	},
	jsgxcasign : function(ca_login_time){
		//console.log("enter function jsgxcasign");
		try{
			jQuery.support.cors = true;
			var json_obj = {};
			var _nsrsbh;
			var _cert = "";
			var port=JsgxcaBase.getGxcaPortBySession();
			//console.log("port="+port);
			$.ajax({
				url:'http://127.0.0.1:'+port+'/caclient',
				type:'post',
				data:'{ "url": "login" }',
				async:false,
				dataType:"json",
				success:function(jsonData) {
					//console.log("jsonData.resultCode="+jsonData.resultCode);
					if (jsonData.resultCode == "0") {
						_cert = jsonData.Cert;
						//console.log("_cert="+_cert);
						$.ajax({
							url:'http://127.0.0.1:'+port+'/caclient',
							type:'post',
							data:'{"url":"SOF_GetCertInfoLoc","Cert":"'+_cert+'","type":31}',
							async:false,
							dataType:"json",
							success:function(jsonData) {
								//console.log("jsonData.resultCode="+jsonData.resultCode);
								if (jsonData.resultCode == "0") {
									_nsrsbh = jsonData.UserCertInfo;
									//console.log("jsgxca .31="+_nsrsbh);
									$.ajax({
										url:'http://127.0.0.1:'+port+'/caclient',
										type:'post',
										data:'{"url":"SOF_GetCertInfoLoc","Cert":"'+_cert+'","type":30}',
										async:false,
										dataType:"json",
										success:function(jsonData) {
											//console.log("jsonData.resultCode="+jsonData.resultCode);
											if (jsonData.resultCode == "0") {
												var _dsswglm= jsonData.UserCertInfo;
												//console.log("jsgxca .30="+_dsswglm);
												if (_nsrsbh != undefined && _nsrsbh != "" && _nsrsbh.length >= 15) {
													json_obj["loginmode"] = '02';
												} else if (_dsswglm != undefined && _dsswglm != "" && (_dsswglm.length == 7 || _dsswglm.length == 10 || _dsswglm.length >= 15)) {
													_nsrsbh = _dsswglm
													json_obj["loginmode"] = '03';
												}
												if(_nsrsbh != undefined && _nsrsbh != ""){
													$.ajax({
														url:'http://127.0.0.1:'+port+'/caclient',
														type:'post',
														data:'{"url":"SOF_SignData","Cert":"'+_cert+'","InData":"'+_nsrsbh+ca_login_time+'"}',
														async:false,
														dataType:"json",
														success:function(jsonData) {
															//console.log("jsonData.resultCode="+jsonData.resultCode);
															if (jsonData.resultCode == "0") {
																json_obj["cacert"] = jsonData.Cert;
																json_obj["causername"] = _nsrsbh;
																json_obj["signature"] = jsonData.SignData;
															}else{
																layerHandler.alert("登录时使用国信CA签名失败，请联系电子税务局服务人员。错误代码："+jsonData.resultCode+":"+jsonData.resultMsg);
																return;
															}
														},
														error:function (XMLHttpRequest, textStatus, errorThrown) {
															layerHandler.alert('国信CA SignData 异常'+textStatus);
															return;
														}
													});
												}else{
													layerHandler.alert("您的CA设备中用户信息不正确，请去当地国信CA网点进行更正。如有疑问可联系国信CA客服，025-96010。");
													return;
												}
											}else{
												layerHandler.alert("国信CA GetUserInfo 30失败"+jsonData.resultCode+":"+jsonData.resultMsg);
												return;
											}
										},
										error:function (XMLHttpRequest, textStatus, errorThrown) {
											layerHandler.alert('国信CA GetUserInfo 30异常'+textStatus);
											return;
										}
									});
								}else{
									layerHandler.alert("国信CA GetUserInfo 31失败"+jsonData.resultCode+":"+jsonData.resultMsg);
									return;
								}
							},
							error:function (XMLHttpRequest, textStatus, errorThrown) {
								layerHandler.alert('国信CA GetUserInfo 31异常'+textStatus);
								return;
							}
						});
					}else{
						layerHandler.alert("国信CA Login 失败，请检查CA是否已插入电脑中。["+jsonData.resultCode+":"+jsonData.resultMsg+"]");
						return;
					}
				},
				error:function (XMLHttpRequest, textStatus, errorThrown) {
					layerHandler.alert('国信CA Login 异常'+textStatus);
					return;
				}
			});
		}catch (e){
			layerHandler.alert("登录时使用国信CA操作异常，异常信息：" + e+"。可能原因及解决方法如下:<br/>"+"1、国信CA助手未安装或安装后控件未注册成功。请点击【国信CA驱动】下载安装 。<br/>"+"2、可联系国信CA客服，025-96010。");
			return;
		}
		return json_obj;
	},
	
	jscasign : function(ca_login_time){
		try{
			jQuery.support.cors = true;
			var json_obj = {};
			var _nsrsbh;
			var _cert;
			var port='8000';
			var json_port = CASigner.getport();
			var _flag = json_port['flag'];
			if(_flag != undefined && _flag != ""&&_flag=='1'){
				_cert = json_port['cert'];
				port = json_port['port'];
				//console.log("jscasign port="+port);
				$.ajax({
					url:'http://127.0.0.1:'+port+'/caclient',
					type:'post',
					data:'{"url":"SOF_GetCertInfoLoc","Cert":"'+_cert+'","type":31}',
					async:false,
					dataType:"json",
					success:function(jsonData) {
						//console.log("jsonData.resultCode="+jsonData.resultCode);
						if (jsonData.resultCode == "0") {
							_nsrsbh = jsonData.UserCertInfo;
							//console.log("jscasign 31="+_nsrsbh);
							$.ajax({
								url:'http://127.0.0.1:'+port+'/caclient',
								type:'post',
								data:'{"url":"SOF_GetCertInfoLoc","Cert":"'+_cert+'","type":30}',
								async:false,
								dataType:"json",
								success:function(jsonData) {
									//console.log("jsonData.resultCode="+jsonData.resultCode);
									if (jsonData.resultCode == "0") {
										var _dsswglm= jsonData.UserCertInfo;
										//console.log("jscasign 30="+_dsswglm);
										if (_nsrsbh != undefined && _nsrsbh != "" && _nsrsbh.length >= 15) {
											json_obj["loginmode"] = '02';
										} else if (_dsswglm != undefined && _dsswglm != "" && (_dsswglm.length == 7 || _dsswglm.length == 10 || _dsswglm.length >= 15)) {
											_nsrsbh = _dsswglm
											json_obj["loginmode"] = '03';
										}
										if(_nsrsbh != undefined && _nsrsbh != ""){
											$.ajax({
												url:'http://127.0.0.1:'+port+'/caclient',
												type:'post',
												data:'{"url":"SOF_SignData","Cert":"'+_cert+'","InData":"'+_nsrsbh+ca_login_time+'"}',
												async:false,
												dataType:"json",
												success:function(jsonData) {
													if (jsonData.resultCode == "0") {
														json_obj["cacert"] = jsonData.Cert;
														json_obj["causername"] = _nsrsbh;
														json_obj["signature"] = jsonData.SignData;
													}else{
														layerHandler.alert("登录时使用江苏CA签名失败，请联系电子税务局服务人员。错误代码："+jsonData.resultCode+":"+jsonData.resultMsg);
														return;
													}
												},
												error:function (XMLHttpRequest, textStatus, errorThrown) {
													layerHandler.alert('江苏CA SignData 异常'+textStatus);
													return;
												}
											});
										}else{
											layerHandler.alert("您的CA设备中用户信息不正确，请去当地江苏CA网点进行更正。如有疑问可联系江苏CA客服，025-96010。");
											return;
										}
									}else{
										layerHandler.alert("江苏CA GetUserInfo 30失败"+jsonData.resultCode+":"+jsonData.resultMsg);
										return;
									}
								},
								error:function (XMLHttpRequest, textStatus, errorThrown) {
									layerHandler.alert('江苏CA GetUserInfo 30异常'+textStatus);
									return;
								}
							});
						}else{
							layerHandler.alert("江苏CA GetUserInfo 31失败"+jsonData.resultCode+":"+jsonData.resultMsg);
							return;
						}
					},
					error:function (XMLHttpRequest, textStatus, errorThrown) {
						layerHandler.alert('江苏CA GetUserInfo 31异常'+textStatus);
						return;
					}
				});
			}else if(_flag != undefined && _flag != ""&&_flag=='0'){
				layerHandler.alert("江苏CA login失败："+json_port['error']);
				return;
			}else{
				layerHandler.alert('江苏CA检测失败，请使用最新版本360极速模式、谷歌Chrome或火狐Firefox浏览器打开本系统。 ');
				return;
			}
		}catch (e){
			layerHandler.alert("登录时使用江苏CA操作异常，异常信息：" + e+"。可能原因及解决方法如下:<br/>"+"1、江苏CA行助手未安装或安装后控件未注册成功。请点击【江苏CA驱动】下载安装 。<br/>"+"2、可联系江苏CA客服，025-96010。");
			return;
		}
		return json_obj;
	},
	
	zjcasign : function(zjcaObj,ca_login_time){
		var json_obj = {};
		var afterSingnStr = new String("");
		var dwFlags = 0x400000;
		var algid = new String("SHA1withRSA");
		var ret = 0;
		zjcaObj.ReadCert(2, dwFlags);
		ret = zjcaObj.ErrCode;
		if (ret != 0) {
			layerHandler.alert("读取总局CA证书失败,请检查CA设备是否插好或驱动是否正确安装。");
			return;
		}
		var cert = zjcaObj.strResult;
		zjcaObj.getCertInfo(cert, 71);
		var nsrsbh = zjcaObj.strResult;
		zjcaObj.GetCertInfo(cert, 1);
		var serialNum = zjcaObj.strResult;
		zjcaObj.Sign(nsrsbh+ca_login_time, 0, algid, dwFlags);
		if (zjcaObj.ErrCode != 0) {
			return;
		} else {
			afterSingnStr = zjcaObj.strResult;
			json_obj["loginmode"] = '01';
			json_obj["cacert"] = cert;
			json_obj["causername"] = nsrsbh;
			json_obj["signature"] = afterSingnStr;
		}
		return json_obj;
	},
	
	cacheck : function(zjcaObj,ca_login_time){
		var code = -1;
		var bfz = "JSCA_CA";
		var nsrsbh = "";
		var bz = 0;
		var catcherror = "N";
		try {
			zjcaObj.CheckKey();
			code = zjcaObj.ErrCode;
			if (code == "167") {
				layerHandler.alert("没有检测到CA设备，请插入CA设备。");
				return;
			}
			var dwFlags = 0x400000;
			zjcaObj.ReadCert(2, dwFlags);
			ret = zjcaObj.ErrCode;
			if (ret != 0) {
				layerHandler.alert("读取CA证书失败,请检查CA设备是否插好或驱动是否正确安装。");
				return;
			}
			var cert = zjcaObj.strResult;
			zjcaObj.GetCertInfo(cert, 71);
			if (code != 0) {
				layerHandler.alert("读取CA纳税人信息失败,请检查CA设备是否插好或驱动是否正确安装。");
				return;
			} else {
				nsrsbh = zjcaObj.strResult;
				if (nsrsbh == "") {
					bz = 2;
				} else {
					bz = 1;
				}
			}
			bfz = zjcaObj.GetCertInfo(cert, 9);
			code1 = zjcaObj.ErrCode;
			if (code1 != 0) {
				layerHandler.alert("读取CA颁发者信息失败,请检查CA设备是否插好或驱动是否正确安装。");
				return;
			} else {
				bfz = zjcaObj.strResult;
			}
		} catch (e) {
			catcherror = "Y";
		}
		if ((code == 0 && (bfz == "JSCA_CA" || bfz == "GXCA_RSA" || bfz == "JSGXCA_SM2")) || code == -1 || bz == 2) {
			if(JsgxcaBase.isIE() && JsgxcaBase.isExistGxca()){
				//console.log("enter jsgxcasign4IE");
				return CASigner.jsgxcasign4IE(ca_login_time);
			}else if(JsgxcaBase.isGxca){
				//console.log("enter jsgxcasign");
				return CASigner.jsgxcasign(ca_login_time);
			}else{
				//console.log("enter jscasign");
				return CASigner.jscasign(ca_login_time);
			}
		}else {
			//console.log("enter zjcasign");
			return CASigner.zjcasign(zjcaObj,ca_login_time);
		}
	}
};