function accDiv(arg1, arg2) {
	var t1 = 0, t2 = 0, r1, r2;
	try {
		t1 = arg1.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
		t2 = arg2.toString().split(".")[1].length;
	} catch (e) {
	}
	with (Math) {
		r1 = Number(arg1.toString().replace(".", ""));
		r2 = Number(arg2.toString().replace(".", ""));
		return accMul((r1 / r2), pow(10, t2 - t1));
	}
}
// 乘法
function accMul(arg1, arg2) {
	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {
	}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {
	}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))
			/ Math.pow(10, m);
}
// 加法
function accAdd(arg1, arg2) {
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return (arg1 * m + arg2 * m) / m;
}
// 减法
function Subtr(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//科学计数法number转string
function toolNumber(num_str) {
	num_str = num_str.toString();
	if (num_str.indexOf("+") != -1) {
		num_str = num_str.replace("+", "");
	}
	if (num_str.indexOf("E") != -1 || num_str.indexOf("e") != -1) {
		var resValue = "", power = "", result = null, dotIndex = 0, resArr = [], sym = "";
		var numStr = num_str.toString();
		if (numStr[0] == "-") {
			// 如果为负数，转成正数处理，先去掉‘-’号，并保存‘-’.
			numStr = numStr.substr(1);
			sym = "-";
		}
		if (numStr.indexOf("E") != -1 || numStr.indexOf("e") != -1) {
			var regExp = new RegExp(
					"^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$", "ig");
			result = regExp.exec(numStr);
			if (result != null) {
				resValue = result[2];
				power = result[5];
				result = null;
			}
			if (!resValue && !power) {
				return false;
			}
			dotIndex = resValue.indexOf(".") == -1 ? resValue.length : resValue.indexOf(".");
			resValue = resValue.replace(".", "");
			resArr = resValue.split("");
			if (Number(power) >= 0) {
				var subres = resValue.substr(dotIndex);
				power = Number(power);
				//幂数大于小数点后面的数字位数时，后面加0
				for ( var i = 0; i <= power - subres.length; i++) {
					resArr.push("0");
				}
				if (power - subres.length < 0) {
					resArr.splice(dotIndex + power, 0, ".");
				}
			} else {
				power = power.replace("-", "");
				power = Number(power);
				//幂数大于等于 小数点的index位置, 前面加0
				for ( var i = 0; i <= power - dotIndex; i++) {
					resArr.unshift("0");
				}
				var n = power - dotIndex >= 0 ? 1 : -(power - dotIndex);
				resArr.splice(n, 0, ".");
			}
		}
		resValue = resArr.join("");
		return sym + resValue;
	} else {
		return num_str;
	}
}
/**
 * 保留小數，默认四舍五入
 * @param num
 * @param rm
 * @returns
 */
function toFixedNum(num,n){
	if((num == 0||num=="") && n == 0){
		num = "0";
	}
    if (num == 0) {
        num = "0";
    }
    if (num == "") {
    	num = "0";
    }
   /* if(isNaN(num)){
    	num = "0";
    }*/
	if(isSfZero(num)){
		return new Decimal(num.toString()).toFixed(Number(n)).toString();
	}
	return new Decimal(num.toString()).toFixed(Number(n)).toString();
}
function isSfZero(str){
	if(str == null || str == "" || str == undefined || isNaN(str)){
		return true;
	}
	return false;
}