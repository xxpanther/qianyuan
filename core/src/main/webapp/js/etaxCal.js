function caltb(tabid) {
    this.tabid = tabid;
    this.rules = null;
    this.empty = null;
    this.negative = true;
    this.pasteEnable = true;
    this.emptyArr = null;
    this.setRules = function (rules) {
        this.rules = rules;
    };
    this.setEmpty = function (empty) {
        this.empty = empty;
    };
    this.customrules = function () {
    };
    this.customrulesEnd = function () {
    };
    this.setEmptyArr = function (emptyArr) {
        this.emptyArr = emptyArr;
    };
}

function initCalTable(calT) {
    for (var j = 0; j < document.getElementById(calT.tabid)
			.getElementsByTagName("input").length; j++) {
        if (document.getElementById(calT.tabid).getElementsByTagName("input")[j]
				.getAttribute("cal") == "true") {
            if (document.getElementById(calT.tabid)
					.getElementsByTagName("input")[j].getAttribute("exception") == undefined) {
                document.getElementById(calT.tabid)
						.getElementsByTagName("input")[j].onchange = function (event) {
						    if (trim(this.value) != "") {
						        if (this.getAttribute("negative") == "false") {
						            if (parseFloat(this.value) < 0) {
						                this.value = "0.00";
						                
						            }
						        }
						        if (calT.negative == false
								&& this.getAttribute("negative") != "true") {
						            if (parseFloat(this.value) < 0) {
						                this.value = "0.00";
						                 
						            }
						        }
						    }
						    if (this.calObj != undefined) {
						        caltbF(eval(this.calObj),event);
						    } else {
						        caltbF(calT,event);
						    }
						};
            }
            document.getElementById(calT.tabid).getElementsByTagName("input")[j].style.imeMode = "disabled";
            document.getElementById(calT.tabid).getElementsByTagName("input")[j].onkeydown = function () {
            	
                caltbTab();
            };
            document.getElementById(calT.tabid).getElementsByTagName("input")[j].onkeypress = function (event) {
            	 
                caltbFilterChar(calT,event);
            };
            document.getElementById(calT.tabid).getElementsByTagName("input")[j].onblur = function (event) {
            	$(this).css({"text-align":"right"});
            	if($.trim(this.value)==''){
            		if($(this).attr('readOnly')=='readonly'){
            			this.value="";
            			this.setAttribute("value","");
            		}else{
                		this.value=setFormatVal(this);
                		this.setAttribute("value",setFormatVal(this));
            		}
            	}else{
            		this.setAttribute("value",this.value);
            	}
           };
            if (calT.pasteEnable == false) {
                document.getElementById(calT.tabid)
						.getElementsByTagName("input")[j].onpaste = function () {
						    return false;
						};
            } else {
                document.getElementById(calT.tabid)
						.getElementsByTagName("input")[j].onpaste = function () {
						    this.value = caltbSetformat(this);
						    this.setAttribute("value",this.value);
						};
            }
            document.getElementById(calT.tabid).getElementsByTagName("input")[j].value = sciToNumber(document
					.getElementById(calT.tabid).getElementsByTagName("input")[j].value);
            document.getElementById(calT.tabid).getElementsByTagName("input")[j].value = caltbSetformat(document
					.getElementById(calT.tabid).getElementsByTagName("input")[j]);
        }
    }
}

function caltbF(calT,e) {
	debugger;
	e=e?e:window.event;
	var curEl=e.srcElement?e.srcElement:e.target;
    calT.customrules();
    if (e != null && curEl != null) {
    	curEl.value = caltbSetformat(curEl);
    }
    for (var i = 0; i < calT.rules.length; i++) {
        if (calT.rules[i].TYPE == "0") {
            runRulesForName(calT.rules[i], calT);
        } else if (calT.rules[i].TYPE == "1") {
            runRulesForID(calT.rules[i], calT);
        } else if (calT.rules[i].TYPE == "99") {
            var exeFun = calT.rules[i].GS + "()";
            eval(exeFun);
        } else if (calT.rules[i].TYPE == "98") {
            var exeFun = calT.rules[i].GS;
            eval(exeFun);
        }
    }
    calT.customrulesEnd();
    if (calT.emptyArr != null) {
        var sum = 0;
        for (var n = 0; n < calT.emptyArr.length; n++) {
            sum = parseFloat(document.getElementsByName(calT.emptyArr[n])[0].value)
					+ parseFloat(sum);
        }
        if (sum < 1 && sum > 0) {
            for (var n = 0; n < calT.emptyArr.length; n++) {
                document.getElementsByName(calT.emptyArr[n])[0].value = 0;
                document.getElementsByName(calT.emptyArr[n])[0].value = caltbSetformat(document
						.getElementsByName(calT.emptyArr[n])[0]);
            }
        }
    }
}

function caltbTab() {
/*    var type;
    type = document.activeElement.type;
    if (type == "select-one") {
        if ((event.keyCode != 38) && (event.keyCode != 40)) {
            window.event.keyCode = 9;
        }
    } else {
        if (event.keyCode == 13) {
            window.event.keyCode = 9;
        }
    }*/
}
function runRulesForName(ruleInfo, calT) {
    var temp = ruleInfo.GS.split(" ");
    if (ruleInfo.GSLX == "X") {
        var setObj = document.getElementsByName(temp[0]);
        for (var j = 0; j < 2; j++) {
            temp.splice(0, 1);
        }
        for (var n = 0; n < setObj.length; n++) {
            var evalStr = "setObj[" + n + "].value= ";
            var cal = false;
            if(setObj[n].getAttribute("nojsbz")=="false"){
            	continue;
            }
            for (var m = 0; m < temp.length; m++) {
                if (temp[m] != "+" && temp[m] != "-" && temp[m] != "*"
						&& temp[m] != "/" && temp[m] != "%" && temp[m] != "("
						&& temp[m] != ")" && caltbCheckFloat(temp[m]) == false) {

                    var tempObj = eval("document.getElementsByName('" + temp[m]
							+ "')[" + n + "]");
                    if (tempObj == null || typeof (tempObj) == "undefined") {
                        tempObj = eval("document.getElementsByName('" + temp[m]
								+ "')[0]");
                        if (caltbTrim(tempObj.value) == "") {
                            evalStr = evalStr + "parseFloat(0.00)";
                        } else {
                            cal = true;
                            document.getElementsByName(temp[m])[0].value = sciToNumber(document
									.getElementsByName(temp[m])[0].value);
                            document.getElementsByName(temp[m])[0].value = caltbSetformat(document
									.getElementsByName(temp[m])[0]);
                            evalStr = evalStr
									+ "parseFloat(document.getElementsByName('"
									+ temp[m] + "')[0].value)";
                        }
                    } else {
                        if (caltbTrim(tempObj.value) == "") {
                            evalStr = evalStr + "parseFloat(0.00)";
                        } else {
                            cal = true;
                            document.getElementsByName(temp[m])[n].value = sciToNumber(document
									.getElementsByName(temp[m])[n].value);
                            document.getElementsByName(temp[m])[n].value = caltbSetformat(document
									.getElementsByName(temp[m])[n]);
                            evalStr = evalStr
									+ "parseFloat(document.getElementsByName('"
									+ temp[m] + "')[" + n + "].value)";
                        }
                    }
                } else {
                    evalStr = evalStr + " " + temp[m] + " ";
                }
            }
            if (cal) {
                eval(evalStr);
                setObj[n].value = caltbSetformat(setObj[n]);
                eval("setObj[n].setAttribute('value',setObj[n].value)");
                if (!calT.negative
						|| setObj[n].getAttribute("negative") == "false") {
                    if (setObj[n].getAttribute("negative") != "true") {
                        if (setObj[n].value.indexOf("-") == 0) {
                            setObj[n].value = "0.00";
                            setObj[n].setAttribute('value','0.00');
                        }
                    }
                }
                if (calT.empty != null) {
                    if (parseFloat(setObj[n].value) < 1
							&& parseFloat(setObj[n].value) > 0) {
                        for (var p = 0; p < calT.empty.length; p++) {
                            if (calT.empty[p] == setObj[n].name
									|| calT.empty[p] == setObj[n].id) {
                                setObj[n].value = "0.00";
                                setObj[n].setAttribute('value','0.00');
                                break;
                            }
                        }
                    }
                }
            } else {
                setObj[n].value = "";
            }
        }
    } else if (ruleInfo.GSLX == "Y") {
        var setObj = document.getElementsByName(temp[0])[0];
        if (setObj == null || typeof (setObj) == "undefined") {
            return;
        }
        for (var j = 0; j < 2; j++) {
            temp.splice(0, 1);
        }
        var evalStr = "setObj.value= ";
        var cal = false;
        for (var m = 0; m < temp.length; m++) {
            if (temp[m] != "+" && temp[m] != "-" && temp[m] != "*"
					&& temp[m] != "/" && temp[m] != "%" && temp[m] != "("
					&& temp[m] != ")") {
                var tempObjArr = eval("document.getElementsByName('" + temp[m]
						+ "')");
                var eSum = 0;
                for (var n = 0; n < tempObjArr.length; n++) {
                    var tempObj = tempObjArr[n];
                    if (!caltbTrim(tempObj.value) == "") {
                        cal = true;
                        tempObj.value = sciToNumber(tempObj.value);
                        tempObj.value = caltbSetformat(tempObj);
                        eSum = eSum + parseFloat(tempObj.value);
                    }
                }
                evalStr = evalStr + eSum;
            } else {
                evalStr = evalStr + " " + temp[m] + " ";
            }
        } 
        if (cal) {
            eval(evalStr);
            setObj.value = caltbSetformat(setObj);
            eval("setObj.setAttribute('value',setObj.value)");
            if (!calT.negative || setObj.getAttribute("negative") == "false") {
                if (setObj.getAttribute("negative") != "true") {
                    if (setObj.value.indexOf("-") == 0) {
                        setObj.value = "0.00";
                        setObj.setAttribute('value','0.00');
                    }
                }
            }
            if (calT.empty != null) {
                if (parseFloat(setObj.value) < 1
						&& parseFloat(setObj.value) > 0) {
                    for (var p = 0; p < calT.empty.length; p++) {
                        if (calT.empty[p] == setObj.name
								|| calT.empty[p] == setObj.id) {
                            setObj.value = "0.00";
                            setObj.setAttribute('value','0.00');
                            break;
                        }
                    }
                }
            }
        } else {
            setObj.value = "";
            setObj.setAttribute('value','');
        }

    }

}

function runRulesForID(ruleInfo, calT) {
    var temp = ruleInfo.GS.split(" ");
    var setObj = document.getElementById(temp[0]);
    for (var j = 0; j < 2; j++) {
        temp.splice(0, 1);
    }
    var evalStr = "setObj.value= ";
    var cal = false;
    if (temp.length == 1 && temp[0].indexOf("zdy") != -1) {
        evalStr = evalStr + " " + temp[0] + " ";
        cal = true;
    } else {
        for (var m = 0; m < temp.length; m++) {
            if (temp[m] != "+" && temp[m] != "-" && temp[m] != "*"
					&& temp[m] != "/" && temp[m] != "%" && temp[m] != "("
					&& temp[m] != ")" && caltbCheckFloat(temp[m]) == false) {
                var tempObj = eval("document.getElementById('" + temp[m] + "')");
                if (caltbTrim(tempObj.value) == "") {
                    evalStr = evalStr + "parseFloat(0.00)";
                } else {
                    cal = true;
                    document.getElementById(temp[m]).value = sciToNumber(document
							.getElementById(temp[m]).value);
                    document.getElementById(temp[m]).value = caltbSetformat(document
							.getElementById(temp[m]));
                    evalStr = evalStr + "parseFloat(document.getElementById('"
							+ temp[m] + "').value)";
                }
            } else {
                evalStr = evalStr + " " + temp[m] + " ";
            }
        }
    }
    
    if (cal) {
        eval(evalStr.replace(/zdy/g, ""));
        setObj.value = caltbSetformat(setObj);
        eval("setObj.setAttribute('value',setObj.value)");
        if (!calT.negative || setObj.getAttribute("negative") == "false") {
            if (setObj.getAttribute("negative") != "true") {
                if (setObj.value.indexOf("-") == 0) {
                    setObj.value = "0.00";
                    setObj.setAttribute('value','0.00');
                }
            }
        }
        if (calT.empty != null) {
            if (parseFloat(setObj.value) < 1 && parseFloat(setObj.value) > 0) {
                for (var p = 0; p < calT.empty.length; p++) {
                    if (calT.empty[p] == setObj.name
							|| calT.empty[p] == setObj.id) {
                        setObj.value = "0.00";
                        setObj.setAttribute('value','0.00');
                        break;
                    }
                }
            }
        }
    } else {
        setObj.value = "";
        setObj.setAttribute('value','');
    }

}

function caltbIsexist(s) {
    try {
        eval(s);
    } catch (e) {
        return false;
    }
    return true;
}

function caltbFilterChar(calT,e) {
	e=e?e:window.event;
	var curEl=e.srcElement?e.srcElement:e.target;
    if (curEl.getAttribute("integer") == "true") {
        if (e.keyCode == 46) {
            e.keyCode = 0;
            return;
        }
    }
    if (curEl.getAttribute("cal") == "true") {
        if (e.keyCode == 45 && calT.negative == false
				&& curEl.getAttribute("negative") != "true") {
           e.keyCode = 0;
            return;
        }
        if (e.keyCode == 45
				&& curEl.getAttribute("negative") == "false") {
            e.keyCode = 0;
            return;
        }
        if (calT.pasteEnable == false) {
            if (e.keyCode == 45
					&& curEl.value.length > 0) {
                e.keyCode = 0;
                return;
            }
        }
        if (!(((e.keyCode >= 48) && (e.keyCode <= 57))
				|| (e.keyCode == 13) || (e.keyCode == 46) || (e.keyCode == 45))) {
            e.keyCode = 0;
            return;
        }
        if (e.keyCode == 46
				&& curEl.value.indexOf(".") > 0) {
            e.keyCode = 0;
            return;
        }
        if (calT.pasteEnable == false) {
            if (e.keyCode == 45
					&& curEl.value.indexOf("-") > -1) {
                e.keyCode = 0;
                return;
            }
        }
        if (e.keyCode == 46 && curEl.value == "") {
            e.keyCode = 0;
            return;
        }
    }
}

function caltbCheckFloat(obj) {
    if (typeof (obj) == "object") {
        if (/^(\+|-)?\d+($|\.\d+$)/.test(caltbTrim(obj.value))
				&& caltbCheckFloatIn(obj.value)) {
            return true;
        }
    } else {
        if (/^(\+|-)?\d+($|\.\d+$)/.test(caltbTrim(obj))
				&& caltbCheckFloatIn(obj)) {
            return true;
        }
    }
    return false;
}

function caltbCheckFloatIn(str) {
    var n = eval("document.getElementsByName(str).length");
    if (n == 0) {
        return true;
    }
    if (str.indexOf(".") < 0) {
        if (str.length > 0) {
            if (str.substr(0, 1) == "0") {
                return false;
            }
        }
    }
    return true;
}

function caltbCheckEnglish(str) {
    if (/^[A-Za-z]+$/.test(validatorTrim(str))) {
        return true;
    }
    return false;
}

function caltbSetformat(obj) {
    if (obj.getAttribute("cal") == undefined) {
        return obj.value;
    }
    if (caltbCheckFloat(obj) == false) {
        if (obj.value.indexOf("e") == -1 && obj.value.indexOf("E") == -1) {
            return "";
        }
    }
    switch (obj.getAttribute("cal")) {
        case "true":
            if (obj.getAttribute("format") != undefined) {
                if (parseInt(obj.getAttribute("format")) < 1) {
                    if (obj.value.indexOf(".") != -1) {
                    	//mathFormat 2018-9-5 yangxq 四舍五入取整数
                    	if(obj.getAttribute("mathFormat")!=undefined ){
                    		return (Math.round(Number(obj.value)));
                    	}else{
                    		 return (parseFloat(obj.value.substr(0, obj.value
										.indexOf("."))));
                    	}
                    } else {
                        return obj.value;
                    }
                }
            }
            var format = obj.getAttribute("format") || 2;
            return caltbNumloop(obj.value, parseInt(format));
        default:
            return obj.value;
    }
}

function caltbNumloop(num, n) {
    return toFixedNum(num, n);
}
/*function caltbNumloopForHbs(num, n) {
	if((num == 0||num=="") && n == 0){
		return 0;
	}
    if (num == 0) {
        num = "0";
    }
    if (num == "") {
        return "";
    }
    if(parseFloat(num).toString().indexOf("e")>=0){//2018-10-8 yxq科学计数法
    	num = Number(Number(parseFloat(num)+1).toString().split(".")[0])-1+"."+Number(parseFloat(num)+1).toString().split(".")[1];
    } else {
    	num = (parseFloat(num) * 100) / 100;
        num = num.toString();
//    }
    if (num.indexOf(".") == "-1") {
        num = num + ".";
        for (var i = 0; i < n; i++) {
            num = num + "0";
        }
    } else if (num.split(".")[1] == "") {
        for (var i = 0; i < n; i++) {
            num = num + "0";
        }
    } else if (num.split(".")[1].length > n) {
        var num2xx = myFixedTwo(parseFloat(num),n); 
        num = Math.round(parseFloat(num) * Math.pow(10, parseInt(n)))
				/ Math.pow(10, parseFloat(n));
        if (parseFloat(num) > num2xx) {
            return num;
        } else {
            return num2xx.toFixed(n);
        }
    } else if (num.split(".")[1].length < n) {
        var tn = parseInt(n - num.split(".")[1].length);
        for (var i = 0; i < tn; i++) {
            num = num + "0";
        }
    }
    return num;
}*/
function caltbTrim(mystring) {
    try {
        var temp_string = mystring;
        while (temp_string.substring(0, 1) == " ")
            temp_string = temp_string.substring(1);
        while (temp_string
				.substring(temp_string.length - 1, temp_string.length) == " ")
            temp_string = temp_string.substring(0, temp_string.length - 1);
        return temp_string;
    } catch (e) {
        alert(e.message);
        return "";
    }
}

function sciToNumber(str) {
    if (str.indexOf("E") != -1) {
        str = str.split("E")[0]
				* Math.pow(10, str.substr(str.indexOf("E") + 1, str.length));
    }
    return str;
}

function triggerJSGS(calT){
    for (var i = 0; i < calT.rules.length; i++) {
        if (calT.rules[i].TYPE == "0") {
            runRulesForName(calT.rules[i], calT);
        } else if (calT.rules[i].TYPE == "1") {
            runRulesForID(calT.rules[i], calT);
        } else if (calT.rules[i].TYPE == "99") {
            var exeFun = calT.rules[i].GS + "()";
            eval(exeFun);
        }
    }
}
function setFormatVal(obj){
	var format=2;
    if (obj.getAttribute("format") != undefined) {
       format=parseInt(obj.getAttribute("format"));
    }
    return caltbNumloop("0.00", format);
}

/**
 * 只做四捨五入,修復google瀏覽器缺陷
 * @param num
 * @param n
 * @returns {Number}
 */
function myFixedTwo(num,n){
	debugger;
	  if($.browser.chrome||$.browser.mozilla){
	      num=num+'';
	     var domIdx=num.indexOf('.');
	     if(domIdx<0){
		  num=parseFloat(num);
//	       return new Number(num.toFixed(n));
		  return new Number(toFixedNum(num,n));
	     }else{
	       var arr=num.split('.');
	       if(arr[1].length<=n){
				num = parseFloat(num);
//				return new Number(num.toFixed(n));
				return new Number(toFixedNum(num,n));
			}else {
				num = num + "1";
				num = parseFloat(num);
//				return new Number(num.toFixed(n));
				return new Number(toFixedNum(num,n));
			}
	     }
	  }else{
		  num=num+'';
		  num = parseFloat(num);
//	     return new Number(num.toFixed(n));
		  return new Number(toFixedNum(num,n));
	  }  
}