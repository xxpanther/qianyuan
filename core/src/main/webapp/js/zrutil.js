/**
 * @author 许伟
 */
if(!this._ZRJC){
	 this._ZRJC = null;
}
(_ZRJC = function() {

	var methods = null;
	
	methods = {
		
		/**初始化方法加载器（）
		 * 
		 */
		initial : function(){
			
		},
			
		_callRemote : function(url, data, successHandler, errorHandler) {
			if (!data)
				data = {};
			if (!errorHandler)
				errorHandler = function(data) {
					/*try{
						
					}catch(e){
					}*/
					//window.location.reload();
				};

			$.ajax({
				url : url,
				type : 'post',
				data : data,
				/*async : false,*/
				async : true,
				dataType : "json",
				beforeSend : function(){
					var url=getContextPath() ;
					/*if($("#showloading:has(div)").length==""){
					$("#showloading").append("<div><img src='"+url+"/css/images/loading.gif' /></div>");
					}*/
				},
				success : function(arg) {
					if (successHandler) {
						successHandler(arg);
					}
					/*setTimeout(function(){
					//alert(window.top.$("#showloading").length());
					window.top.$("#showloading").hide();
					window.top.$(".loading_mask").hide();},2000);*/
				},
				error : errorHandler
			});
		},
		
		_asyncCallRemote : function(url, data, successHandler, errorHandler) {
			// var errorHandler;
			if (!data)
				data = {};
			if (!errorHandler)
				errorHandler = function(data) {
					//layerHandler.alert("连接超时,请重试");
					/*try{
						console.log("ajax调用异常：" + data);
					}catch(e){
						
					}*/
					//window.location.reload();
				};

			$.ajax({
				url : url,
//				contentType: "application/x-www-form-urlencoded; charset=utf-8", 
				type : 'post',
				data : data,
				async : true,
				dataType : "json",
				beforeSend : function(){
					var url=getContextPath() ;
//					if($("#showloading:has(div)").length==""){
//					$("#showloading").append("<div><img src='"+url+"/css/images/loading.gif' /></div>");
//					}
					
				},
				success : function(arg) {
					if (successHandler) {
						successHandler(arg);
					}
				/*	setTimeout(function(){
					$("#showloading").hide();
					$(".loading_mask").hide();},2000)*/
				},
				error : errorHandler
			});
		},
		
		/**
		 * 序列OBJECT内容为字符串。{'key1' : 'value1', 'key2' : 'value2'} ---> &key1=value1&key2=value2
		 * @param obj
		 */
		_serializeObject : function(obj){
			
			var str = "";
			for(var key in obj){
				str += "&" + key + "=" + methods._getValue(obj[key]);
			}
			return str;
		},
		
		/**
		 * 功能：将阿拉伯数字转换成中文数字[正负数都可]
		 * 
		 * @param dValue
		 *            dValue为数字
		 * @param maxDec
		 *            maxDec保留几位小数
		 * @returns 返回：中文数字
		 */
		AmountInWords : function(dValue, maxDec) {
			// 验证输入金额数值或数值字符串：
			dValue = dValue.toString().replace(/,/g, "");
			dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
			if (dValue == "") {
				return "零元整";
			} // （错误：金额为空！）
			else if (isNaN(dValue)) {
				return "错误：金额不是合法的数值！";
			}

			var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
			var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
			if (dValue.length > 1) {
				if (dValue.indexOf('-') == 0) {
					dValue = dValue.replace("-", "");
					minus = "负";
				} // 处理负数符号“-”
				if (dValue.indexOf('+') == 0) {
					dValue = dValue.replace("+", "");
				} // 处理前导正数符号“+”（无实际意义）
			}

			// 变量定义：
			var vInt = "";
			var vDec = ""; // 字符串：金额的整数部分、小数部分
			var resAIW; // 字符串：要输出的结果
			var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
			var digits, radices, bigRadices, decimals; // 数组：数字（0~9——零~玖）；基（十进制记数系统中每个数字位的基是10——拾,佰,仟）；大基（万,亿,兆,京,垓,杼,穰,沟,涧,正）；辅币（元以下，角/分/厘/毫/丝）。
			var zeroCount; // 零计数
			var i, p, d; // 循环因子；前一位数字；当前位数字。
			var quotient, modulus; // 整数部分计算用：商数、模数。

			// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
			var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null
					|| Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
			parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
			if (parts.length > 1) {
				vInt = parts[0];
				vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分

				if (NoneDecLen) {
					maxDec = vDec.length > 5 ? 5 : vDec.length;
				} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
				var rDec = Number("0." + vDec);
				rDec *= Math.pow(10, maxDec);
				rDec = Math.round(Math.abs(rDec));
				rDec /= Math.pow(10, maxDec); // 小数四舍五入
				var aIntDec = rDec.toString().split('.');
				if (Number(aIntDec[0]) == 1) {
					vInt = (Number(vInt) + 1).toString();
				} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
				if (aIntDec.length > 1) {
					vDec = aIntDec[1];
				} else {
					vDec = "";
				}
			} else {
				vInt = dValue;
				vDec = "";
				if (NoneDecLen) {
					maxDec = 0;
				}
			}
			if (vInt.length > 44) {
				return "错误：金额值太大了！整数位长【" + vInt.length.toString()
						+ "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
			}

			// 准备各字符数组 Prepare the characters corresponding to the digits:
			digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); // 零~玖
			radices = new Array("", "拾", "佰", "仟"); // 拾,佰,仟
			bigRadices = new Array("", "万", "亿", "兆", "京", "垓", "杼", "穰", "沟",
					"涧", "正"); // 万,亿,兆,京,垓,杼,穰,沟,涧,正
			decimals = new Array("角", "分", "厘", "毫", "丝"); // 角/分/厘/毫/丝

			resAIW = ""; // 开始处理

			// 处理整数部分（如果有）
			if (Number(vInt) > 0) {
				zeroCount = 0;
				for (i = 0; i < vInt.length; i++) {
					p = vInt.length - i - 1;
					d = vInt.substr(i, 1);
					quotient = p / 4;
					modulus = p % 4;
					if (d == "0") {
						zeroCount++;
					} else {
						if (zeroCount > 0) {
							resAIW += digits[0];
						}
						zeroCount = 0;
						resAIW += digits[Number(d)] + radices[modulus];
					}
					if (modulus == 0 && zeroCount < 4) {
						resAIW += bigRadices[quotient];
					}
				}
				resAIW += "元";
			}

			// 处理小数部分（如果有）
			for (i = 0; i < vDec.length; i++) {
				d = vDec.substr(i, 1);
				if (d != "0") {
					resAIW += digits[Number(d)] + decimals[i];
				}
			}

			// 处理结果
			if (resAIW == "") {
				resAIW = "零" + "元";
			} // 零元
			if (vDec == "") {
				resAIW += "整";
			} // ...元整
			resAIW = CN_SYMBOL + minus + resAIW; // 人民币/负......元角分/整
			return resAIW;
		},
		
		/**将数值四舍五入后格式化
		 * 
		 * @param num	数值(Number或者String)
		 * @param cent	要保留的小数位(Number)
		 * @param isThousand	是否需要千分位 0:不需要,1:需要(数值类型);
		 * @param thousandSeparator	千位符 符号 	默认 ","
		 * @returns {String}	格式的字符串,如'1,234,567.45'
		 */
		formatNumber : function(num, cent, isThousand, thousandSeparator) {
			// math.ceiling() 返回大于或等于指定数字的最小整数
			// math.floor() 返回小于或等于指定数字的最大整数
			if(methods._isNull(num+""))return num;
			num = num.toString().replace(/[^-.0123456789]/g, ''); // 过滤掉
																				// 非"-.0123456789"的所有字符
			// num = num.toString().replace(/\$|\,/g,''); //过滤掉 "$" "," 符号
			if (isNaN(num))// 检查传入数值为数值类型.
				num = "0";
			if (isNaN(cent))// 确保传入小数位为数值型数值.
				cent = 0;
			cent = parseInt(cent);
			cent = Math.abs(cent);// 求出小数位数,确保为正整数.
			if (isNaN(isThousand))// 确保传入是否需要千分位为数值类型.
				isThousand = 0;
			isThousand = parseInt(isThousand);
			if (isThousand < 0)
				isThousand = 0;
			if (isThousand >= 1) // 确保传入的数值只为0或1
				isThousand = 1;
			sign = (num == (num = Math.abs(num)));// 获取符号(正/负数)
			// Math.floor:返回小于等于其数值参数的最大整数
			num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);// 把指定的小数位先转换成整数.多余的小数位四舍五入.
			cents = num % Math.pow(10, cent); // 求出小数位数值.
			num = Math.floor(num / Math.pow(10, cent)).toString();// 求出整数位数值.
			cents = cents.toString();// 把小数位转换成字符串,以便求小数位长度.
			while (cents.length < cent) {// 补足小数位到指定的位数.
				cents = "0" + cents;
			}
			if (isThousand == 0) // 不需要千分位符.
			{
				if (cent > 0)
					return (((sign) ? '' : '-') + num + '.' + cents);
				else
					return (((sign) ? '' : '-') + num);
			}
			// 对整数部分进行千分位格式化.
			if (!thousandSeparator)
				thousandSeparator = ","; // 千位符 符号
			for ( var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
				num = num.substring(0, num.length - (4 * i + 3))
						+ thousandSeparator
						+ num.substring(num.length - (4 * i + 3));

			// return (((sign)?'':'-') + num + '.' + cents);
			if (cent > 0)
				return (((sign) ? '' : '-') + num + '.' + cents);
			else
				return (((sign) ? '' : '-') + num);
		},
	
		_getValue : function(obj){
			if(methods._isNull(obj)){
				return "";
			}
			return obj;
		},
		
		/**
		 * 对象属性替换，将obj2中的属性放入obj1中，如果obj1中存在则 替换，否则添加属性
		 * @param obj1
		 * @param obj2
		 */
		_putAll : function(obj1, obj2){
			if(!(obj1 && obj2)){
				return false;;
			}
			for(var key2 in obj2){
				obj1[key2] = obj2[key2];
			}
		},
		
		_isEmptyObject : function (obj){
			for ( var name in obj ) { 
				return false; 
			} 
			return true; 
		},
		
		/**
		 * 判断字符串是否有效
		 * @param obj
		 * @returns {Boolean}
		 */
		_isNull : function(obj){
			if(obj){
				if(typeof obj == "string" && (obj == "null" || obj == "undefined" || obj == "")){
					return true;
				}else{
					return false;
				}
			}
			return true;
		},
		
		_isnotString : function(obj){
			if(methods._isNull(obj)){
					return "";
			}
			return obj;
		},
		/**
		 * 判断value是否是 数字
		 * @param s		字符串
		 * @returns
		 */
		_isNum : function(s){
		    if (s!=null && s!=""){return !isNaN(s);}else{ return false;};
		},
		
		/**
		 * 判断对象是否是数组	
		 * @param obj
		 * @returns {Boolean}
		 */
		_isArray : function(obj){
			return Object.prototype.toString.call(obj) === '[object Array]';
		},
		/**
		 * 判断对象是否是数组	
		 * @param obj
		 * @returns {Boolean}
		 */
		_isString : function(obj){
			return Object.prototype.toString.call(obj) === '[object String]';
		},

		
		_parseJSON : function(arg){
			if(arg){
				return eval("(" + arg + ")");
			}
		},
		
		_setSearchData : function(searchMSGData){

			var eventBindHandler = function(fieldId){
//				alert(fieldId);
				var field = $("#"+fieldId);
				$("#"+fieldId).bind("blur", function(){
					if($.trim(field.val()) == ""){
						field.val(searchMSGData[fieldId]);
						//	初始化字体颜色
					}
				});
				$("#"+fieldId).bind("click", function(){
					if(field.val() == searchMSGData[fieldId]){
						field.val("");
					}
				});
			};
			
			for(fieldId in searchMSGData){
				var field = $("#"+fieldId);
				var dom_field = field[0];
				if(dom_field){
					
					var tagName = dom_field.tagName;
					var type = dom_field.type;
					if(tagName && tagName == "INPUT" && type == "text"){
	//					alert("INPUT text\t" + searchMSGData[fieldId]);
						field.attr("search_msg_value" , searchMSGData[fieldId]);
						field.val(searchMSGData[fieldId]);
						
						eventBindHandler(fieldId);
					}
//					else if(tagName == "SELECT" && type == "select-one"){
//						alert("SELECT select-one\t");
//					}
//					else if(tagName == "SELECT" && type == "select-multiple"){
//						alert("seleect select-multiple")；
//					}
//					$("#"+fieldId).val(searchMSGData.fieldId);
				}
			}
		},
		
		/**
		 * 获取查询条件值，
		 * 条件查询获取页面查询条件
		 * @param fields	所有查询条件父元素
		 */
		_getSearchData : function(fields){
			var retData = {};
			var inputs = $(fields).find("input");
			var selects = $(fields).find("select");
			$.each(inputs, function(i, item){
				var tagName = $(item)[0].tagName;
				var type = $(item)[0].type;
				
//				var feild_class = $(item).attr("class");
				var feild_id = $(item).attr("id");
				var feild_name = $(item).attr("name");
				var feild_value = $.trim($(item).attr("value"));
				if(tagName == "INPUT" && type == "text"){
					
					var feild_search = $(item).attr("search_msg_value");
					if(feild_id){
						
						/* easyUI特殊处理 start***
						 * 原因：easyui在生成日期控件的时候 默认将有id属性的input框隐藏，
						 * 并生成一个name属性的input替换*********/
						try{
							feild_value = $("#"+feild_id).datebox('getValue');
						}catch(e){}
						/* *****end*******/

						if(!feild_value || (feild_value && feild_value == feild_search)){
							feild_value = "";
						}
						
						retData[feild_id] = feild_value;
					}
				}else if(tagName == "INPUT" && type == "radio"){

				}else if(tagName == "INPUT" && type == "checkbox"){
					// 多选框 返回选中 input的value属性 数组
					if(feild_name){
						if(!retData[feild_name]){
							retData[feild_name] = methods._getCheckboxVal(feild_name);
						}
					}
				}else{
				}
			});
			$.each(selects, function(i, item){
//				var feild_class = $(item).attr("class");
				var feild_id = $(item).attr("id");
				var feild_value = $(item).find("option:selected").val();
//				var feild_search = $(item).attr("search_msg_value");
				
//				if(!feild_value || (feild_value && feild_value == feild_search)){
				if(!feild_value){
					feild_value = "";
				}
				retData[feild_id] = feild_value;
			});
			
			if(true && retData){
				var log = "";
				for(fl in retData){
					log += fl + ":\t" + retData[fl] + "\n";
				}
//				alert(log);
			}
			
			return retData;
		},
		
		/**
		 * 根据id 赋值
		 * @param data
		 * @param parentField	所有赋值的父对象（可不写，默认根据id赋值）
		 */
		_setInputData : function(data, parentField){
			
			if(parentField){

				for(var item in data){
					var tmp = $(parentField).find("#"+item);
					if(tmp[0]){
						var tagName = $(tmp)[0].tagName;
						var type = $(tmp)[0].type;
						if(tagName == "INPUT" || tagName == "TEXTAREA"){
							
							$(tmp[0]).val(methods._getValue(data[item]));
							
						}else if(tagName == "SELECT"){
							try{
								$(tmp[0]).val(methods._getValue(data[item]));
							}catch(e){
							}
//							$("." + selector).find("option[value='" + data[item] + "']").attr("selected",true);
						}else if(tagName == "SELECT"){
							try{
								$(tmp[0]).val(methods._getValue(data[item]));
							}catch(e){
							}
//							$("." + selector).find("option[value='" + data[item] + "']").attr("selected",true);
						}else{
							$(tmp[0]).text(methods._getValue(data[item]));
						}
					}else{
						//radio赋值
						try{
							$("input:radio[name='"+item+"'][value='"+data[item]+"']").attr('checked','true');
						}catch(e){
							
						};
					}
				}
				
				
			}else{
				for(var item in data){
					if($("#"+item)[0]){
						$("#"+item).val(methods._getValue(data[item]));
					}
				}
			}
		},
		
		/**
		 * 获取页面输入数据，
		 * 将页面输入框的数据 转换objec对象返回
		 * @param fields	所有查询条件父元素
		 */
		_getInputData : function(parentField){
			var retData = {};
			var inputs = $(parentField).find("input");
			var selects = $(parentField).find("select");
			var textareas = $(parentField).find("textarea");
			
			$.each(inputs, function(i, item){
				var tagName = $(item)[0].tagName;
				var type = $(item)[0].type;
				var feild_id = $(item).attr("id");
				var feild_name = $(item).attr("name");
				if(tagName == "INPUT" && (type == "text" || type == "password")
					|| tagName == "TEXTAREA"){
	//				var feild_class = $(item).attr("class");
					var feild_value = $.trim($(item).attr("value"));
					
					if(feild_id){
						if(!feild_value){
							feild_value = "";
						}
						/* easyUI特殊处理 start***
						 * 原因：easyui在生成日期控件的时候 默认将有id属性的input框隐藏，
						 * 并生成一个name属性的input替换*********/
						try{
							feild_value = $("#"+feild_id).datebox('getValue');
						}catch(e){}
						/* *****end*******/
						
						retData[feild_id] = feild_value;
					}
					if(feild_name){
//						alert(3)
					}
				}else if(tagName == "INPUT" && type == "radio"){
					//带优化
					retData[feild_name] = $('input:radio[name="'+feild_name+'"]:checked').val();
				}else if(tagName == "INPUT" && type == "checkbox"){

					// 多选框 返回选中 input的value属性 数组
					if(feild_name){
						if(!retData[feild_name]){
							retData[feild_name] = methods._getCheckboxVal(feild_name);
						}
					}
				}else{
					if(feild_id){
						retData[feild_id] = ZRJC.getValue($(feild_id));	//其它情况 至获取value属性 
					}
				}
			});
			$.each(textareas, function(i, item){
				var tagName = $(item)[0].tagName;
//				var type = $(item)[0].type;
				if(tagName == "TEXTAREA"){
	//				var feild_class = $(item).attr("class");
					var feild_id = $(item).attr("id");
					var feild_value = $.trim($(item).attr("value"));
					if(feild_id){
						if(!feild_value){
							feild_value = "";
						}
						retData[feild_id] = feild_value;
					}
				}
			});
			$.each(selects, function(i, item){
				var feild_id = $(item).attr("id");
				var feild_name = $(item).attr("name");
				
				var feild_value = $(item).find("option:selected").val();
				
				if(!feild_value){
					feild_value = "";
				}
				if(!methods._isNull(feild_id)){
					retData[feild_id] = feild_value;
				}else if(!methods._isNull(feild_name)){
					retData[feild_name] = feild_value;
				}
			});
			
			if(false && retData){
				var log = "";
				for(fl in retData){
					log += fl + ":\t" + retData[fl] + "\n";
				}
				alert(log);
			}
			
			return retData;
		},
	
		/**
		 * 获取复选框 选中 对象value字符串，以","分割
		 * @param field_name
		 * @returns
		 */
		_getCheckboxVal : function(field_name){
			var str = null;
			$("input[name="+field_name+"][type=checkbox]").each(function(i){
				var field = $(this);
				if(field.is(":checked")){
					var field_val = field.attr("value");
					str = str ? (str += "," + field_val) : field_val;
				}
			});
			str = str ? str : "";
			return str;
		},
		
		_log : function(jsonData , txt){
			if(jsonData){
				
				var log = getLog(jsonData);
				
				var div = $("#zrcj_log_div_id");
				if(!div[0]){
//					data-options='region:'south',border:false'
					div = $("<div id='zrcj_log_div_id' ></div>");
					var text = $("<textarea id='zrcj_log_textarea_id' rows='20' cols='120'></textarea>");
					div.append(text);
					
					$("body").css({"overflow":"auto"});
					$("body").append(div);
//					$('#zrcj_log_div_id').layout('south');
					


				}
				
				var title =  "";
				if(txt){
					title = "\n*****************************************"
						  + "\n*******************" + txt + "***********"
						  + "\n****************************************\n";
				}else{
					title = "\n*****************************************"
						  + "\n****************************************\n";
				}
				log = title + log;
				
				var text_val = $("#zrcj_log_textarea_id").val();

				if(text_val && text_val.length > 0){
					text_val += log;
				}else{
					text_val = log;
				}
				$("#zrcj_log_textarea_id").val(text_val);
				$("#zrcj_log_textarea_id").css({"z-index" : 1000});
			}
			
			function getLog(jsonData){
				var _msg = "";
				
				if(methods._isString(jsonData)){
					_msg += jsonData;
				}else{
					for(obj in jsonData){
						if(methods._isString(obj)){
							_msg += "\t" + obj + "\t:\t" + jsonData[obj] + "\n";
							
//						if(methods._isArray(jsonData[obj])){
//							var len = (jsonData[obj]).length;
//							log += "\n" +obj + "\t:\t" ; 
//							for(var i=0; i<len;i++){
//								log += "\t\t" + getLog(jsonData[obj][i]);
//							}
//						}
						}
					}
				}
				return _msg;
			}
		},
	
		/*
		 	var date = new Date();
			date.setFullYear(2014, 0, 31);
			var test = null;
			test = ZRJC.designatedDate(1);
//			test = ZRJC.nextMonthDate(date);
//			test = ZRJC.lastMonthDate(date);
			alert(test);
		 */
		/**
		 * 获取指定日期相隔的日期
		 * 	例如： 当前日期后20天
		 * 		   _getDate(20, new Date()) 或者 _getDate(20)
		 * 		   _getDate() 当前日期
		 * @param num			整数类型
		 * @param comparDate	比较日期 (不指定默认为当前日期)
		 * @param fromat		格式化类型（暂未定义，默认yyyy-MM-dd）
		 * @returns String yyyy-MM-dd
		 */
		_getDate : function(options){
//		_getDate : function(num, comparDate, format){
			var num = null;
			var comparDate = null;
			var format = null;
			/* **********/
			// 根据参数 获取日期
			if(options){
				num = options.num;
				comparDate = options.comparDate;
				format = options.format;
				
				var target_date = options.target_date;
				//获取当月第一天
				if(target_date == "MonthFirstDay"){
					var _t_date = options.date ? options.date : new Date();
					_t_date.setDate(1);
					comparDate = _t_date;
				}else if(target_date == "MonthLastDay"){
					var _t_date = options.date ? options.date : new Date();
					_t_date.setDate(1); //第一天
					var endDate = new Date(_t_date);
					endDate.setMonth(_t_date.getMonth()+1);
					endDate.setDate(0);
					comparDate = endDate;
				}
				
				else {
					var _t_date = options.date ? options.date : new Date();
					comparDate = _t_date;
				}
			}
			/* **********/
			
			if(!num){
				num = 0;
			}
			if(!comparDate){
				comparDate = new Date();
			}
//			if(!format){
//				format = true;
//			}
			
//			var date1 = new Date();
			var time = comparDate.getTime();
			var cha = 1000*60*60*24 * num;
			time += cha;
			
			return methods.getTimeFormat(time, format);
		},
		
		getDate : function(date, format){
			date = date ? date : new Date();
			return methods._getDate({"date" : date, "format" : format});
		},
		
		getMonthFirstDate : function(date){
			date = date ? date : new Date();
			return methods._getDate({"target_date" : "MonthFirstDay", "date" : date});
		},
		getMonthLastDate : function(date){
			date = date ? date : new Date();
			return methods._getDate({"target_date" : "MonthLastDay", "date" : date});
		},
		
		/**
		 * 获取指定月份的上一个月份的今天
		 * @param thisDate
		 * @returns
		 */
		getLastMonthDate : function(thisDate){
			if(!thisDate){
				thisDate = new Date();
			}
        	
    		return methods._getNextOrLastMonthDate(thisDate, false);
		},
		
		/**
		 * 获取指定月份的下一个月份的今天
		 * @param thisDate
		 * @returns
		 */
		getNextMonthDate : function(thisDate){
			if(!thisDate){
				thisDate = new Date();
			}
			
    		return methods._getNextOrLastMonthDate(thisDate, true);
		},
		
		/**
		 * 获取指定 上月份或者下一个月份日期
		 * @param thisDate	当前月份（为空表示，当前月份）
		 * @param flag		true: 下一个月份; false：上一个月份
		 * @returns time 	时间戳
		 */
		_getNextOrLastMonthDate : function(thisDate, flag, format){

			if(!thisDate){
				thisDate = new Date();
			}
			
        	var year = thisDate.getFullYear();
        	var month = thisDate.getMonth();
        	var day = thisDate.getDate();
//			alert( "传入参数：" + methods.getTimeFormat(thisDate.getTime()))
//        	alert("传入参数：" + year + "-" + month + "-" + day);
        	
    		var targetDate = new Date(thisDate);

			if (flag) {
				if(month == 0){
					if (day > 28) {
						if (_isRunYear(year)) {
							targetDate.setDate(29);
						}else{
							targetDate.setDate(28);
						}
					}else{
						targetDate.setDate(day);
					}
				}else{
					if (!_is31Month(month + 1)  && day > 30) {
						if(month != 0){
							targetDate.setDate(30);
						}else{
							targetDate.setDate(day);
						}
					}else{
						targetDate.setDate(day);
					}
				}
				
				//12月份跨年处理
				if(month == 11){
					targetDate.setFullYear(year + 1, 0, targetDate.getDate());
				}else{
					targetDate.setFullYear(year, month+1);
				}
			} else {
				if(month == 2){
					if (day > 28) {
						if (_isRunYear(year)) {
							targetDate.setDate(29);
						}else{
							targetDate.setDate(28);
						}
					}else{
						targetDate.setDate(day);
					}
				}else{
					if (!_is31Month(month - 1)  && day > 30) {
						if(month != 0){
							targetDate.setDate(30);
						}
					}else{
						targetDate.setDate(day);
					}
				}
				
				//一月份跨年处理
				if(month == 0){
					targetDate.setFullYear(year - 1, 11, targetDate.getDate());
				}else{
					targetDate.setMonth(thisDate.getMonth() - 1);
				}
			}
//				alert("1--->:" + targetDate.getFullYear() + "-" + targetDate.getMonth() + "-" + targetDate.getDate())
//			alert("目标日期：" + targetDate.getFullYear() + "-" + targetDate.getMonth() + "-" + targetDate.getDate()
//					+ " " + targetDate.getHours() + ":" +targetDate.getMinutes() + ":" + targetDate.getSeconds());
			var time = targetDate.getTime();
			return methods.getTimeFormat(time, format);
			
			function _isRunYear(year){
				var yy = year;
				if ((yy % 4 == 0 && yy % 100 != 0)
						|| (yy % 100 == 0 && yy % 400 == 0)) {
					return true;
				}
				return false;
			}
			
			function _is31Month(month){
				if(month == 4 || month == 6 || month == 9 || month == 12){
					return true;
				}
				return false;
			}
		},
		
		/**
		 * 数字时间戳转换成日期时间函数
		 * @param time		为传入的数字时间戳，如果数字时间戳先前作了/1000运算，请先*1000再传入
		 * @param format	格式化类型（暂未定义，默认yyyy-MM-dd）
		 * @returns {String}
		 */
		getTimeFormat : function(time, format){
			if(!format){
				format = true;
			}else{
				format = format.toLocaleUpperCase();
			}

		    var date = new Date(time);
		    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		    var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		    var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		    var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		    
		    
		    if(format == "yyyymm"){
		    	return date.getFullYear() + month;
		    }
		    else if(format || format == "yyyy-mm-dd"){
		    	//返回格式：yyyy-MM-dd
		    	return date.getFullYear() + "-" + month + "-" + currentDate;
		    }else{
		    	//返回格式：yyyy-MM-dd hh:mm:ss
		    	return date.getFullYear() + "-" + month + "-" + currentDate+" "+hh + ":" + mm + ":" + ss;
		    }
		},
		
		serialize : function(){
			
		},
		/**
		 * 浏览器 打开新窗口
		 * @param url
		 */
		openNewWindow : function(url){
			
			var winName = "newWindow";
			var awidth = screen.availWidth; 	// 窗口宽度,需要设置
			var aheight = screen.availHeight; 	// 窗口高度,需要设置
			var winParams = 'height=' + aheight
						+ ', width=' + awidth
						+ ', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no';

			var win = window.open(url, winName, winParams);

			win.focus(); //新窗口获得焦点
		},
		
		
		/**
		 * 判断{RESULT='String', MSG='String', DATA=数据}
		 * @param obj
		 * @returns {Boolean}
		 */
		_isOperationSuccessful : function(obj){
			if(!obj){
				return false;
			}
			if(obj.RESULT == "0000"){
				return true;
			}
			return false;
		},
		/**
		 * @param obj {RESULT='String', MSG='String', DATA=数据}
		 * @returns RESULT
		 */
		_getOperationCode : function(obj){
			return obj.RESULT;
		},
		/**
		 * @param obj {RESULT='String', MSG='String', DATA=数据}
		 * @returns MSG
		 */
		_getOperationMsg : function(obj){
			return obj.MSG;
		},
		/**
		 * @param obj {RESULT='String', MSG='String', DATA=数据}
		 * @returns DATA=数据
		 */
		_getOperationData : function(obj){
			return obj.DATA;
		}
		
		
	};
	
	return {
		ajaxCall : methods._callRemote,
		asyncCallRemote : methods._asyncCallRemote,
		AmountInWords : methods.AmountInWords,
		formatNumber : methods.formatNumber,
		isNull : methods._isNull,
	    isnotString : methods._isnotString,
		
		
		isNum : methods._isNum,
		isArray : methods._isArray,
		isEmptyObject : methods._isEmptyObject,
		
		getValue : methods._getValue,
		parseJSON : methods._parseJSON,
		log : methods._log,
		
		serializeObject : methods._serializeObject,
		openNewWindow : methods.openNewWindow,
		
		isOperationSuccessful : methods._isOperationSuccessful,
		getOperationCode : methods._getOperationCode,
		getOperationMsg : methods._getOperationMsg,
		getOperationData : methods._getOperationData,
		
		putAll : methods._putAll,
		getDate : methods.getDate,
		getNextMonthDate : methods.getNextMonthDate,
		getLastMonthDate : methods.getLastMonthDate,
		getMonthFirstDate : methods.getMonthFirstDate,
		getMonthLastDate : methods.getMonthLastDate,
		
		getSearchParamsData : methods._getSearchData,
		setSearchParamsData : methods._setSearchData,
		setInputParamsData : methods._setInputData,
		getInputParamsData : methods._getInputData,
		getCheckboxVal : methods._getCheckboxVal,
		getTimeFormat : methods.getTimeFormat
		
	};
}());

var ZRJC = {
		ajaxCall : _ZRJC.ajaxCall,
		asyncCallRemote : _ZRJC.asyncCallRemote,
		AmountInWords : _ZRJC.AmountInWords,
		formatNumber : _ZRJC.formatNumber,
		isNull : _ZRJC.isNull,
		isnotString : _ZRJC.isnotString,
		isNum : _ZRJC.isNum,
		isArray : _ZRJC.isArray,
		isEmptyObject : _ZRJC.isEmptyObject,
		
		/* 【判断调用是否成功】isOperationSuccessful、
		 * 【操作代码】getOperationResult、
		 * 【提示信息】getOperationMsg*/
		isOperationSuccessful : _ZRJC.isOperationSuccessful,
		getOperationCode : _ZRJC.getOperationCode,
		getOperationMsg : _ZRJC.getOperationMsg,
		getOperationData : _ZRJC.getOperationData,
		
		parseJSON : _ZRJC.parseJSON,
		log : _ZRJC.log,
		getValue : _ZRJC.getValue,
		putAll : _ZRJC.putAll,
		
		serializeObject : _ZRJC.serializeObject,
		openNewWindow : _ZRJC.openNewWindow,
		
		getDate : _ZRJC.getDate,
		getNextMonthDate : _ZRJC.getNextMonthDate,
		getLastMonthDate : _ZRJC.getLastMonthDate,
		getMonthFirstDate : _ZRJC.getMonthFirstDate,
		getMonthLastDate : _ZRJC.getMonthLastDate,
		
		
		getSearchParamsData : _ZRJC.getSearchParamsData,
		setSearchParamsData : _ZRJC.setSearchParamsData,
		setInputParamsData : _ZRJC.setInputParamsData,
		getInputParamsData : _ZRJC.getInputParamsData,
		getCheckboxVal : _ZRJC.getCheckboxVal,
		getTimeFormat : _ZRJC.getTimeFormat,
		
		
		FLAG_EMPTY : "&qnf(",	//占位符
		FLAG_DIVID : "&qnf)"	//分隔符
};
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
/*

if(!this.ZRJC){
	this.ZRJC = {
			ajaxCall : _ZRJC.ajaxCall,
			AmountInWords : _ZRJC.AmountInWords,
			formatNumber : _ZRJC.formatNumber,
			isNull : _ZRJC.isNull,
			isNum : _ZRJC.isNum,
			isArray : _ZRJC.isArray,
			isEmptyObject : _ZRJC.isEmptyObject,
			parseJSON : _ZRJC.parseJSON,
			log : _ZRJC.log,
			getValue : _ZRJC.getValue,
			putAll : _ZRJC.putAll,
			
			serializeObject : _ZRJC.serializeObject,
			openNewWindow : _ZRJC.openNewWindow,
			
			getDate : _ZRJC.getDate,
			getNextMonthDate : _ZRJC.getNextMonthDate,
			getLastMonthDate : _ZRJC.getLastMonthDate,
			getMonthFirstDate : _ZRJC.getMonthFirstDate,
			getMonthLastDate : _ZRJC.getMonthLastDate,
			
			
			getSearchParamsData : _ZRJC.getSearchParamsData,
			setSearchParamsData : _ZRJC.setSearchParamsData,
			setInputParamsData : _ZRJC.setInputParamsData,
			getInputParamsData : _ZRJC.getInputParamsData,
			getCheckboxVal : _ZRJC.getCheckboxVal,
			
			
			FLAG_EMPTY : "&qnf(",	//占位符
			FLAG_DIVID : "&qnf)"	//分隔符
	};
}
 */