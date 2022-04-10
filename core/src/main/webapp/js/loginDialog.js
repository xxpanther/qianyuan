function loadTable(data){
	$("#nsrxxtbody").html("");
	var tbody = document.getElementById('nsrxxtbody');
	for (var i = 0; i < data.length; i++) {
		var trow = getDataRow(data[i],i);
		tbody.appendChild(trow);
	}
}
function loadSsdlryTable(data){
	$("#ssryxx_tbody").html("");
	var tbody = $("#ssryxx_tbody");
	for (var i = 0; i < data.length; i++) {
		var trow = getSsdlryDataRow(data[i],i);
		tbody.append(trow);
	}
}

function getSsdlryDataRow(user, i) {
	var str = '<tr ';
	if(i % 2 == 1){
		str += 'style="background-color:#e2edfc;"';
	}
	str += ' ><td>' + (i+1) + '</td><td><input type="radio" name="ssdlryRadio"  xm="' + user.xm + '" zjhm="' + user.zjhm + '"value="' + user.shxydm + 
		'" style="cursor: pointer;"></td><td title="' + user.xm +'" style="cursor: pointer;">'+ (!user.xm?'':user.xm) +'</td><td title="' + user.zjlx + '" style="cursor: pointer;">'
		+ (!user.zjlx?'':user.zjlx) + '</td><td title="' + user.zjhm + '" style="cursor: pointer;">' + (!user.zjhm?'':user.zjhm) + '</td></tr>';
	return str;
}
function loadDlyhqyxxTable(data) {
	$("#dlyhqyxx_tbody").html("");
	var tbody = $("#dlyhqyxx_tbody");
	for (var i = 0; i < data.length; i++) {
		var trow = getDlyhqyxxDataRow(data[i],i);
		tbody.append(trow);
	}
}

function getDlyhqyxxDataRow(user, i) {
	var str = '<tr ';
	if(i % 2 == 1){
		str += 'style="background-color:#e2edfc;"';
	}
	str += ' ><td>' + (i+1) + '</td><td><input type="radio" name="dlyhqyRadio"  djxh="'+user.djxh+'"  value="' + user.nsrsbh + 
		'" style="cursor: pointer;"></td><td title="' + user.nsrsbh +'" style="cursor: pointer;">' 
		+ user.nsrsbh +'</td><td title="' + user.nsrmc +'" style="cursor: pointer;">' 
		+ user.nsrmc + '</td><td title="' + user.swjgmc + '" style="cursor: pointer;">'
		+ user.swjgmc + '</td><td title="' + user.jbr_sf + '" style="cursor: pointer;">' + user.jbr_sf + '</td></tr>';
	return str;
}
function getDataRow(h,i) {
	var row = document.createElement('tr');
	if(i%2==1){
		row.setAttribute("style","background-color:#e2edfc;");
	}
	var xhCell = document.createElement('td');
	xhCell.innerHTML = i+1;
	row.appendChild(xhCell);
	
	var radioCell = document.createElement('td');
	row.appendChild(radioCell);
	var btnRadio = document.createElement('input');
	btnRadio.setAttribute('type', 'radio');
	btnRadio.setAttribute('name', 'nsrxxradio');
	btnRadio.setAttribute('value', h.djxh+','+h.dsdjxh);
	btnRadio.onclick = function() {
	}
	$(btnRadio).css("cursor", 'pointer');  
	radioCell.appendChild(btnRadio);
	
	var nsrmcCell = document.createElement('td');
	nsrmcCell.innerHTML = h.nsrmc;
	$(nsrmcCell).attr("title", h.nsrmc);
	$(nsrmcCell).css("cursor", 'pointer');  
	row.appendChild(nsrmcCell);
	
	var djlxmcCell = document.createElement('td');
	djlxmcCell.innerHTML = h.kzztdjlxmc;
	row.appendChild(djlxmcCell);
	
	var swjgmcCell = document.createElement('td');
	swjgmcCell.innerHTML = h.swjgmc;
	$(swjgmcCell).attr("title", h.swjgmc);
	$(swjgmcCell).css("cursor", 'pointer');
	row.appendChild(swjgmcCell);
	
	var ztCell = document.createElement('td');
	ztCell.innerHTML = h.nsrztmc;
	row.appendChild(ztCell);

	return row; //返回tr数据	 
}

function openKhxz(){
	$(".page4 iframe").attr("src",_DZSWJ_URL+"/sso/static/khxz.html?v=1.4");
	$.layer({
	    type: 1,
	    area: ["auto", "auto"],
	  	title: false,	
	    bgcolor: "#fff",
	    shade:false,
	    border:[0],
	    move:'.moveempty',
	    fadeIn:200,
	    page: {
	    	dom: ".page4"
	    },
	    end:function(){
		}
	});
}
$(".close_dialog").click(function(){
	$(this).parent().parent(".mask").hide();
})
$("#tsxx_sure_btn").click(function(){
	$(".page10").hide();
	layer.closeAll();
})
$(".change_type").click(function(){
	$(".page8").find(".content").toggle();
	if($(".msg_yzm").is(":hidden")){
		getQrcode();
		$("#loginmode").val("06");
	} else {
		clearInterval(timer_qr);
		$("#loginmode").val("05");
	}
})

