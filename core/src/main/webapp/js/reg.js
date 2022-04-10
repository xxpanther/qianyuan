var verify_username=function(obj){
	var value = $("#"+obj).val();
	 String.prototype.realLength = function()  
	 {  
	     return this.replace(/[^\x00-\xff]/g, "***").length;  
	 };  
	var reg_phone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;  
    var reg_num = /^\d+$/;  
    var reg_email = /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;  
    if (reg_num.test(value)) {  
    	//如果是手机号，那么邮箱显示
        if (value.realLength() == 11 && reg_phone.test(value)) {  
            //$("#show_code").css({'display':'block'});
            $("#show_email").css({'display':'block'});
            $("#show_mobile").css({'display':'none'});
            $("#phone").val("");
            $("#show_code").css({'display':'block'}); 
            $("#codeMsg").html("<span>*</span>手机验证码:");
            return true;  
        } else { 
        	$("#"+obj).focus();
        	$("#user_check").text("请输入正确的手机号或邮箱");
            return false;  
        }  
    }else if (value.indexOf('@') > 0) {  
        if (reg_email.test(value)) {
        	//如果显示的正确邮箱 ，则显示手机号
         $("#show_mobile").css({'display':'block'});
         $("#show_email").css({'display':'none'});
         $("#email").val("");
         $("#show_code").css({'display':'block'}); 
         $("#codeMsg").html("<span>*</span>邮箱验证码:");
         $("#user_check").text("");
            return true;  
        } else {  
         $("#"+obj).focus();
       	 $("#user_check").text("邮箱地址不正确，请重新输入");
          return false;  
        }  
    }else{
    	$("#user_check").text("请确保用户名输入的是邮箱或者手机号");
    	$("#tip_sp_img").css({'display':'none'});
    	$("#"+obj).focus();
    	 return false;  
    }

   	   
 
   
};
 var verify_password=function(obj,registerPassMsg){
	
	 var pwdValue=$("#"+obj).val();
	 //var valpassword = /^(?![a-zA-z]+$)(?!\d+$)(?![!`~@#$%-_=+^&*]+$)[a-zA-Z\d!`~@#$%-_=+^&*]+$/;
	 var valpassword = /^(?:\d+|[a-z]+)$/;
	 if(pwdValue.length>0&&pwdValue.length<8){
		 $("#"+registerPassMsg).text("密码长度不能小于8位");
		 return false;
	 }else if(pwdValue.length>20){
		 $("#"+registerPassMsg).text("密码长度不能大于20位");
		 return false;
	 }else if(pwdValue.length==0){
		 $("#"+registerPassMsg).text("密码不能为空");
		 return false;
	 }else if (valpassword.test(pwdValue)) {
		 $("#" + registerPassMsg).text("请使用数字、字母、特殊字符的任意组合，提高密码强度");
		 return false;
	 }else{
		 $("#" + registerPassMsg).text(""); 
		 return true;
	 }
 };
 var  verify_repwd=function(obj1,obj2,obj3){
	 var repwd=$("#"+obj1).val();
	 var pwd=$("#"+obj2).val();
	 if(repwd!=pwd){
		 $("#"+obj3).show();
		 $("#"+obj3).text("两次输入密码不符");
		 return false;
	 }else{
		 $("#"+obj3).text("");
		 return true;
	 }
 };
 //验证手机
 var verify_mobile = function(obj,showErrorMsg,context){
	 var value=$("#"+obj).val();
	 var test_value = /^((\(\d{2,3}\))|(\d{3}\-))?1[3,8,5]{1}\d{9}$/;
	 if(value !=""){
		 if(!test_value.test(value)){ 
			 $("#mobile_message").text("不是完整的11位手机号");
			 return false;
		 }else{
			 $("#mobile_message").text("");
			 if(checkMobileOrEmail(obj,showErrorMsg,context)) {
	        		return true;  
	         }else {
	        		return false;  
	         }
		 }
	 }else{
		 $("#mobile_message").text("");
		 return true;
	 }
     
	 
 };
 //验证手机验证码
 var verify_showCode = function(obj){
	 var value=$("#"+obj).val();
	 if(value.length==0){
		 $("#show_codeNull").text("手机验证码不能为空");
		 return false;
	 }else{
		 $("#show_codeNull").text("");
		 return true;
	 }
	 
 };
 //验证邮箱
 var verify_email = function(obj,showErrorMsg,context){
	 var email = $("#"+obj).val();
	 var reg_email = /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;  
	 if(email.length==0){
		   $("#check_email").text("");
		   return true;
	 }else  if (email.indexOf('@')>0) {  
        if (reg_email.test(email)) {  
        	$("#check_email").text("");
        	if(checkMobileOrEmail(obj,showErrorMsg,context)) {
        		return true;  
        	}else {
        		return false;  
        	}
            
        } else {  
       	 $("#check_email").text("邮箱地址不正确，请重新输入");
            return false;  
        }  
    } else{
    	$("#check_email").text("邮箱地址不正确，请重新输入");
       	return false;  
    }
	    
 };
 var checkusername=function(obj,ctx){
	 var value=$("#"+obj).val();
	 if(""==value||null==value||"null"==value||'undefined'==value||'邮箱/手机号'==value){
	 	     $("#user_check").text("账户名不能为空");
		     return false;
	 }
	 if(verify_username(obj)==true){
		 $.ajax({
   		   type: "POST",
   		   url: ctx+"/checkusername.do",
   		   dataType:'json',
   		   data: "username="+$.trim(value),
   		   success: function(msg){
   			if(msg.RESULT=="0000"){
 				  $("#user_check").text("用户名已经被占用，请重新输入");
      	 	      $("#"+obj).focus();
      	 	      $("#btnSendCode").css("background-color","#888888");
      	 	      $("#tip_sp_img").css({'display':'none'}); 
      	 	      $("#btnSendCode").attr("disabled",true);
 			      return false;
 			    }else if(msg.RESULT=="9999"){
 			    	$("#tip_sp_img").css({'display':'none'});
                    $("#user_check").text(msg.MSG);
                    $("#btnSendCode").attr("disabled",true);
                    return false;
 			    }else if(msg.RESULT="11019"){
 			       $("#btnSendCode").css("background-color","#4169E1");
 			       $("#tip_sp_img").css({'display':'block'});
                   $("#user_check").text("");
                   $("#btnSendCode").attr("disabled",false);
                   return true;
 			    }
   		   } ,
   		   error : function(data){
				 try{
					    layerHandler.alert("连接超时，请重试",function(){
							window.location.reload();
						});
				    }catch(e){
					     /* console.log(e);*/
				   }

			}
   		 });
		 return true;
	 }
		
 };
 var verify_code=function(obj,ctx){
	 var code=$("#"+obj).val();
	 var flag= "";
	 if(code.length==0){
		 $("#checkcode_message").show();
		 $("#check_code").text("验证码不能为空");
		 flag=false;
	 }else{
		 $.ajax({
			 url:ctx+"checkverifyCode.do",
			 dataType:'json',
			 type: "POST",
			 async:false,
			 data:"userCode="+code,
			 success:function(msg){
				 if(msg.return_code=='997'){ 
					    flag=false;
					    $("#checkcode_message").show();
	                	$("#check_code").text("验证码错误，请重新输入");
	                	 $("#tip_imgcode_yes").css({'display':'none'});
	                	 $("#showloginmessage").css({'display':'block'});
	                	f_getCode();
	                	$("#yzmtip").focus();
	                	 //return false;
				    }else{
				        flag= true;
					    $("#check_code").text("");
					    $("#checkcode_message").hide();
	             	    $("#tip_imgcode_yes").css({'display':'inline-block'});
	             	   $("#showloginmessage").css({'display':'none'});
				   }
			 },
		  error : function(data){
			 try{
				    layerHandler.alert("连接超时，请重试",function(){
						window.location.reload();
				});
			    }catch(e){
				     /* console.log(e);*/
			   }
		  }
		 });
		 return flag;
	 }
	 return flag;
 };
 
 //重置密码校验用户名
 var checkornalusername =function(obj,ctx){
		var value = $("#"+obj).val();
		var flag= "";
		if(value.length  == 0 || value == "请输入绑定的手机/邮箱"){
			$("#ornalusername_check").text("用户名不能为空");
			flag=false;
		}else{
		 $.ajax({
	   		   type: "POST",
	   		   url: ctx+"/checkusername.do",
	   		   dataType:'json',
	   		   async:false,
	   		   data: "username="+$.trim(value),
	   		   success: function(msg){
	   			if(msg.RESULT=="0000"){
	 				   $("#ornalusername_check").text("");
	      	 	       $("#tip_sp_img").css({'display':'block'});
	      	 	       if(msg.DATA.username != undefined) {
	      	 	    	   $("#dlm").val(msg.DATA.username);
	      	 	       }
		      	 	   if(msg.DATA.mobile != undefined) {
	   	 	    		   $("#phone").val(msg.DATA.mobile);
	   	 	    	   }else {
	   	 	    		   var test_value = /^((\(\d{2,3}\))|(\d{3}\-))?1[3,8,5]{1}\d{9}$/;
	   	 	    		   if(test_value.test(msg.DATA.username)){
	   	 	    			   $("#phone").val(msg.DATA.username);
	   	 	    		   }
	   	 	    	   }
	 			       flag=true;
	 			    }else if(msg.RESULT=="9999"){
	 			    	$("#tip_sp_img").css({'display':'none'});
	                    $("#ornalusername_check").text(msg.MSG);
	                    flag=false;
	 			    }else {
	 			       $("#tip_sp_img").css({'display':'none'});
	                   $("#ornalusername_check").text("请确保输入已绑定或已注册的手机/邮箱");
	                   $("#"+obj).focus();
	                    flag=false;
	 			    }
	   		   },
	   		error : function(data){
				 try{
					    layerHandler.alert("连接超时，请重试",function(){
							window.location.reload();
						});
				    }catch(e){
					     // console.log(e);
				   }

			}
		 
	   		 });
		 return flag;
 }
		 return flag;
 };
 
 var checkMobileOrEmail=function(obj,showErrorMsg,ctx){
	 var value=$("#"+obj).val();
	 var flag = false;
	 $.ajax({
	   type: "POST",
	   async : false,
	   url: ctx+"/checkusername.do",
	   dataType:'json',
	   data: "username="+$.trim(value),
	   success: function(msg){
		if(msg.RESULT=="0000"){
			if (value.indexOf('@') > 0) {
				$("#" + showErrorMsg).text("该邮箱已经被占用，请重新输入");
			}else {
				$("#" + showErrorMsg).text("该手机已经被占用，请重新输入");
			}
		}else if(msg.RESULT=="9999"){
                $("#" + showErrorMsg).text(msg.MSG);
		}else {
               $("#" + showErrorMsg).text("");
               flag = true;
		}
	   } 
	 });
	 return flag;
		
 };
 
 
//重置密码校验用户名
 var queryUserName = function(obj,ctx){
	 	var returnMsg=null;
		var value = $("#"+obj).val();
		var flag= "";
		if(value.length  == 0){
			 return;
		}else{
			 $.ajax({
		   		   type: "POST",
		   		   url: ctx+"/checkusername.do",
		   		   dataType:'json',
		   		   async:false,
		   		   data: "username="+$.trim(value),
		   		   success: function(msg){
		   			   if(msg.RESULT=="0000"){
			  	 	       if(msg.DATA.username != undefined) {
			  	 	    	   $("#realName").val(msg.DATA.username);
			  	 	       }  
			  	 	       
		   			   }
		   			returnMsg = msg;
		   		   },
		   		error : function(data){
					 try{
						    layerHandler.alert("服务器发生异常",function(){
								window.location.reload();
							});
					    }catch(e){
						     // console.log(e);
					   }
				}		 
	   		 });
			 return returnMsg;
		}
 };
 //js 校验验证码
 var  checkornalcode =function(obj,message){
	 var code = $("#"+obj).val();
	 if(code=="" || code == "6位有效数字"){
		 $("#"+message).text("请输入校验码");
		 return false;
	 }else{
		 $("#"+message).text("");
		 return true;
	 }
	 
	 
	 
 };

 var verify_sjyzmcode=function(obj,message,ctx){
	 var code=$("#"+obj).val();
	 var flag= "";
	 if(code=="" || code == "6位有效数字"){
		 $("#"+message).text("请输入校验码");
		 flag=false;
	 }else{
		 $.ajax({
			 url:ctx+"/checksjyzmCode.do",
			 dataType:'json',
			 type: "POST",
			 async:false,
			 data:"userCode="+code,
			 success:function(msg){
				 if(msg.return_code=='997'){
					 flag=false;
					 $("#"+message).text("验证码错误");
				 }else{
					 flag=true;
				     $("#"+message).text("");
				  }
			 },
		  error : function(data){
			 try{
				    layerHandler.alert("连接超时，请重试",function(){
						window.location.reload();
				});
			    }catch(e){
				     /* console.log(e);*/
			   }
		  }
		 });
		 return flag;
	 }
	 return flag;
 };
 
/*
 * baseinfo页面验证身份证号码
 */
 
 var checkIDcard = function(IDcard,IDshow,promptIDmessage){
	 var IDcardvalue = $("#"+IDcard).val(); 
	 var testIDcard = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
	 if(IDcardvalue.length==0){
		 //$("#"+IDshow).css({'display':'block'});
		 //$("#"+promptIDmessage).text("身份证号码不能为空");
		 return true;
	 }else if (!testIDcard.test(IDcardvalue)) {  
		 $("#"+IDshow).css({'display':'block'});
		 $("#"+promptIDmessage).text("请输入正确的身份证号");
         return false;  
      } else {  
    	 $("#"+IDshow).css({'display':'none'});
 		 $("#"+promptIDmessage).text("");
         return true;  
      }  

 };
 
	//身份证扩展方法
	var idCardNoUtil = {  
		provinceAndCitys: {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
				           31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",
			           	   45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
			           	   65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}, 
		powers: ["7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"], 
		parityBit: ["1","0","X","9","8","7","6","5","4","3","2"], 
		genders: {male:"男",female:"女"}, 
		checkAddressCode: function(addressCode){
			var check = /^[1-9]\d{5}$/.test(addressCode);
			if(!check) return false;
			if(idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0,2))]){
			    return true;
			}else{
			    return false;
			}
		}, 
				 
		checkBirthDayCode: function(birDayCode){
		   var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
		   if(!check) return false;
		   var yyyy = parseInt(birDayCode.substring(0,4),10);
		   var mm = parseInt(birDayCode.substring(4,6),10);
		   var dd = parseInt(birDayCode.substring(6),10);
		   var xdata = new Date(yyyy,mm-1,dd);
		   if(xdata > new Date()){
		      return false;//生日不能大于当前日期
		    }else if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) ){
		       return true;
		   }else{
		      return false;
		   }
		}, 
				 
		getParityBit: function(idCardNo){
		     var id17 = idCardNo.substring(0,17); 
		     var power = 0;
		     for(var i=0;i<17;i++){
		         power += parseInt(id17.charAt(i),10) * parseInt(idCardNoUtil.powers[i]);
		     } 
		     var mod = power % 11;
		     return idCardNoUtil.parityBit[mod];
		}, 
				 
		checkParityBit: function(idCardNo){
			var parityBit = idCardNo.charAt(17).toUpperCase();
			if(idCardNoUtil.getParityBit(idCardNo) == parityBit){
				return true;
			}else{
				return false;
			}
		}, 
				 
		checkIdCardNo: function(idCardNo){
			//15位和18位身份证号码的基本校验
			var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
			if(!check) return false;
			//判断长度为15位或18位
			if(idCardNo.length==15){
				return idCardNoUtil.check15IdCardNo(idCardNo);
			}else if(idCardNo.length==18){
				return idCardNoUtil.check18IdCardNo(idCardNo);
			}else{
				return false;
			}
		}, 
		 //校验15位的身份证号码
		check15IdCardNo: function(idCardNo){
			//15位身份证号码的基本校验
			var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
			if(!check) return false;
			//校验地址码
			var addressCode = idCardNo.substring(0,6);
			check = idCardNoUtil.checkAddressCode(addressCode);
			if(!check) return false;
			var birDayCode = '19' + idCardNo.substring(6,12);
			//校验日期码
			return idCardNoUtil.checkBirthDayCode(birDayCode);
		}, 
		 //校验18位的身份证号码
		check18IdCardNo: function(idCardNo){
			//18位身份证号码的基本格式校验
			var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
			if(!check) return false;
			//校验地址码
			var addressCode = idCardNo.substring(0,6);
			check = idCardNoUtil.checkAddressCode(addressCode);
			if(!check) return false;
			//校验日期码
			var birDayCode = idCardNo.substring(6,14);
			check = idCardNoUtil.checkBirthDayCode(birDayCode);
			if(!check) return false;
			//验证校检码
			return idCardNoUtil.checkParityBit(idCardNo);
		}, 
		formateDateCN: function(day){
			var yyyy =day.substring(0,4);
			var mm = day.substring(4,6);
			var dd = day.substring(6);
			return yyyy + '-' + mm +'-' + dd;
		}, 
		 //获取信息
		getIdCardInfo: function(idCardNo){
			var idCardInfo = {
					gender:"", //性别
					birthday:"" // 出生日期(yyyy-mm-dd)
			};
			if(idCardNo.length==15){
				var aday = '19' + idCardNo.substring(6,12);
				idCardInfo.birthday=idCardNoUtil.formateDateCN(aday);
				if(parseInt(idCardNo.charAt(14))%2==0){
					idCardInfo.gender=idCardNoUtil.genders.female;
				}else{
					idCardInfo.gender=idCardNoUtil.genders.male;
				}
			}else if(idCardNo.length==18){
				var aday = idCardNo.substring(6,14);
				idCardInfo.birthday=idCardNoUtil.formateDateCN(aday);
				if(parseInt(idCardNo.charAt(16))%2==0){
					idCardInfo.gender=idCardNoUtil.genders.female;
				}else{
					idCardInfo.gender=idCardNoUtil.genders.male;
				} 
			}
			return idCardInfo;
		}, 
				 
		getId15:function(idCardNo){
			if(idCardNo.length==15){
				return idCardNo;
			}else if(idCardNo.length==18){
				return idCardNo.substring(0,6) + idCardNo.substring(8,17);
			}else{
				return null;
			}
		}, 
		 
		getId18: function(idCardNo){
			if(idCardNo.length==15){
				var id17 = idCardNo.substring(0,6) + '19' + idCardNo.substring(6);
			var parityBit = idCardNoUtil.getParityBit(id17);
			return id17 + parityBit;
			}else if(idCardNo.length==18){
				return idCardNo;
			}else{
				return null;
			}
			}
		};
 
 
 
 /**
  * 禁止空格输入
  * @param e
  * @returns {Boolean}
  */
 function banInputSapce(e)
 {
     var keynum=null;
     if(window.event) // IE
     {
         keynum = e.keyCode;
     }
     else if(e.which) // Netscape/Firefox/Opera
     {
         keynum = e.which;
     }
     if(keynum == 32){
         return false;
     }
     return true;
 }
 

 
