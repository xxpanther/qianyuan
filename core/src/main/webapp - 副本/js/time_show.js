function time_show() {
	$('.date_has_event').each(function() {
		// options
		var distance = 10;
		var time = 200;
		var hideDelay = 50;

		var hideDelayTimer = null;

		// tracker
		var beingShown = false;
		var shown = false;

		var trigger = $(this);
		// var popup = $('.events ul', this).css('opacity', 0);
		var popup = $('.events .onload', this).css('opacity', 0);
		// set the mouseover and mouseout on both element
		$([ trigger.get(0), popup.get(0) ]).mouseover(function() {
			popup.find("strong").parent().parent().find("div:gt(0)").remove();
			popup.find("strong").parent().parent().append(window.dateItem);
			// stops the hide event if we move from the trigger to the popup
			// element
			if (hideDelayTimer)
				clearTimeout(hideDelayTimer);

			// don't trigger the animation again if we're being shown, or
			// already visible
			if (beingShown || shown) {
				return;
			} else {
				beingShown = true;

				// reset position of popup box
				popup.css({
					top : -20,
					left : -244,
					display : 'block' // brings the popup back in to view
				})

				// (we're using chaining on the popup) now animate it's opacity
				// and position
				.animate({
					top : '+=' + distance + 'px',
					opacity : 1
				}, time, 'swing', function() {
					// once the animation is complete, set the tracker variables
					beingShown = false;
					shown = true;
				});

			}
		}).mouseout(function() {
			// reset the timer if we get fired again - avoids double animations
			if (hideDelayTimer)
				clearTimeout(hideDelayTimer);

			// store the timer so that it can be cleared in the mouseover if
			// required
			hideDelayTimer = setTimeout(function() {
				hideDelayTimer = null;
				popup.animate({
					top : '-=' + distance + 'px',
					opacity : 0
				}, time, 'swing', function() {
					// once the animate is complete, set the tracker variables
					shown = false;
					// hide the popup entirely after the effect (opacity alone
					// doesn't do the job)
					popup.css('display', 'none');
				});
			}, hideDelay);
			popup.find("strong").parent().parent().find("div:gt(0)").remove();
		});
	});
}

var m_taxCalendar = {};

function loadTaxCalendar(cal) {
	var nYear = parseInt(cal.Year);
	$.ajax({
		url : '/portal/queryapi/query_taxcalendar.do?year=' + nYear + "&month="
				+ cal.Month,
		type : 'GET',
		dataType : 'json',
		cache : false,
		timeout : 20000,
		success : function(json) {
			if (json.RESULT == "0000") {
				// m_taxCalendar["y_" + nYear] = json
				showDate(cal, json['DATA']);
				for (var i = 0; i < $(".scroller_content").length; i++) {
					$("#" + $(".scroller_content")[i].id).mCustomScrollbar({
						scrollButtons : {
							enable : false,
							scrollType : "stepped"
						},
						keyboard : {
							scrollType : "stepped"
						},
						mouseWheel : {
							scrollAmount : 5
						},
						theme : "rounded-dark",
						autoExpandScrollbar : true,
						snapAmount : 10,
						snapOffset : 5

					});
				}
			} else {
				// alert(json.MSG)
				$("#idCalendarDays1").html("加载征期");
				$("#idCalendarDays2").html("日历失败");
			}
		},
		error : function(req, textStatus, errorThrow) {
			// alert("加载征期日历失败" + errorThrow)
			$("#idCalendarDays1").html("加载征期");
			$("#idCalendarDays2").html("日历失败");
		}
	});
}

function refreshTaxCalendar(cal) {
	loadTaxCalendar(cal);

}

function showTaxCalendar(cal, rData) {
	var nYear = parseInt(cal.Year);
	var nMonth = parseInt(cal.Month);
	var data = rData;
	if (!data) {
		return;
	}

	var qMinDay = 31;
	var zMaxDay = 0;
	var ret = {};
	  for(var i=0;i<data.length;i++){
		var it = data[i];
		var arrq = it.sbqx.split('-');
		var arrz = it.sbqx.split('-');

		var qMonth = Number(arrq[1]);
		var zMonth = Number(arrz[1]);
		var qDay = 31;
		var zDay = 0;
		if ((parseInt(arrq[0]) == nYear && qMonth == nMonth)
				|| (parseInt(arrz[0]) == nYear && zMonth == nMonth)) {
			// 在这个期间内：
			if (qMonth == nMonth) {
				// qDay = parseInt(arrq[2]);
				qDay = 1;
			}

			if (zMonth == nMonth) {
				zDay = parseInt(arrz[2]);
			} else if (nMonth == 4 || nMonth == 6 || nMonth == 9
					|| nMonth == 11) {
				zDay = 30;
			} else if (nMonth == 2) {
				if (nMonth % 400 == 0 || (nMonth % 4 == 0 && nMonth % 100 != 0))
					zDay = 29;
				else
					zDay = 28;
			}

			for (var j = qDay; j <= zDay; j++) {
				var obj = ret["day" + j];
				if (!obj) {
					ret["day" + j] = {
						"day" : j,
						"items" : []
					};
					obj = ret["day" + j];
				}

				obj.items[obj.items.length] = {
					"type" : it.nsqx_mc,
					"text" : it.sb_xm
				};
			}
		}

		if (qDay < qMinDay) {
			qMinDay = qDay;
		}
		if (zDay > zMaxDay) {
			zMaxDay = zDay;
		}
	}
	// var tipPre = "<div class='events'><ul>";
	var tipPre = "<div class='events'><div class='onload' style='cursor: default;'>";
	var nCount = 0;
	for (var j = qMinDay; j <= zMaxDay; j++) {
		var obj = ret["day" + j];
		if (!obj) {
			continue;
		}

		var sDate = nYear + "年" + nMonth + "月" + j + "日";
		// var tip = tipPre + "<li><strong>" + sDate + "</strong></li>";
		var tip = tipPre + "<div id='dv_scroll" + nYear + nMonth + j
				+ "' class='scroller_content'><div><strong>" + sDate
				+ "</strong></div>";
		for (var k = 0; k < obj.items.length; k++) {
			var it = obj.items[k];
			// tip += "<li><strong>" + it.type + ":</strong><a style=\"border:
			// 0px;width: 80%;height: 10px;text-align: left;display: block;\"
			// href='javascript:doGotoApp(\"5411272141125351015\");'>" + it.text
			// + "</a></li>";
			tip += "<div><a style=\"border: 0px;width: 80%;height: 10px;text-align: left;\" href='javascript:doGotoApp(\"5411272141125351015\");'>"
					+ it.text + "（" + it.type + "）" + "</a></div>";
		}

		// tip += "</ul></div>";
		tip += "</div>";
		tip += "</div></div>";
		// var txt = "<a id='day"+j+"' class='thisday'>"+ j + "</a>";
		var txt = "<a id='day" + j + "' class='thisday'>" + j + "</a>";

		$(cal.Days[j]).html(txt + tip);
		$(".thisday").parent("td").addClass("date_has_event");
		nCount++;
	}

	if (nCount > 0) {
		time_show();

		// 离申报期还有多少天？
		var dtMin = new Date(nYear, nMonth - 1, qMinDay);
		var dtMax = new Date(nYear, nMonth - 1, zMaxDay);
		var dtTody = new Date();
		if (dtTody >= dtMin && dtTody <= dtMax) {
			$("#idCalendarDays1").html("今天正在");
			$("#idCalendarDays2").html("申报期内");
		} else if (dtTody < dtMin) {
			days = parseInt((dtMin - dtTody) / 1000 / 60 / 60 / 24);
			$("#idCalendarDays1").html("离申报期还");
			$("#idCalendarDays2").html("有<span>" + days + "</span>天");
		} else {
			days = Math.ceil((dtTody - dtMax) / 1000 / 60 / 60 / 24)- 1;
			$("#idCalendarDays1").html("超过本月申报");
			$("#idCalendarDays2").html("期<span>" + days + "</span>天");
		}
	} else {
		$("#idCalendarDays1").html("本月还未");
		$("#idCalendarDays2").html("设置申报期");
	}

}
function showDate(cal, rData) {
	var nYear = parseInt(cal.Year);
	var nMonth = parseInt(cal.Month);
	var data = !rData?[]:rData;
	
	var qMinDay = 31;
	var zMaxDay = 0;
	window.dateItem =  "<div><a style=\"border: 0px;width: 80%;height: 10px;text-align: left;\" href='javascript:doGotoApp(\"5411272141125351015\");'>"
		+ "月" + "（默认申报）" + "</a></div>";
	var qDay = 1;
	var zDay = 15;
	function temp(day){
		qDay = 1;
		zDay = day?day:15;
			for (var j = qDay; j <= zDay; j++) {
				var tipPre = "<div class='events'><div class='onload' style='cursor: default;'>";
				var sDate = nYear + "年" + nMonth + "月" + j + "日";
				// var tip = tipPre + "<li><strong>" + sDate + "</strong></li>";
				var tip = tipPre + "<div id='dv_scroll" + nYear + nMonth + j
				+ "' class='scroller_content'><div><strong>" + sDate
				+ "</strong></div>";
				tip += "</div>";
				tip += "</div></div>";
				var txt = "<a id='day" + j + "' class='thisday'>" + j + "</a>";
				
				$(cal.Days[j]).html(txt + tip);
				$(".thisday").parent("td").addClass("date_has_event");
			}
		
	}
	for(var i=0;i<data.length;i++){
		var it = data[i];
		var arrz = it.sbqx.split('-');
			temp(parseInt(arrz[2]));
			window.dateItem += "<div><a style=\"border: 0px;width: 80%;height: 10px;text-align: left;\" href='javascript:doGotoApp(\"5411272141125351015\");'>"
				+ it.nsqx_mc + "（" + it.sb_xm + "）" + "</a></div>";
			
	}
	if(data.length==0){
		temp(15);
	}
//	$(".scroller_content").append(item);
	if (zDay-qDay > 0) {
		time_show();
		
		// 离申报期还有多少天？
		var dtMin = new Date(nYear, nMonth - 1, qDay);
		var dtMax = new Date(nYear, nMonth - 1, zDay);
		var dtTody = new Date();
		if (dtTody >= dtMin && dtTody <= dtMax) {
			$("#idCalendarDays1").html("今天正在");
			$("#idCalendarDays2").html("申报期内");
		} else if (dtTody < dtMin) {
			days = parseInt((dtMin - dtTody) / 1000 / 60 / 60 / 24);
			$("#idCalendarDays1").html("离申报期还");
			$("#idCalendarDays2").html("有<span>" + days + "</span>天");
		} else {
			days = Math.ceil((dtTody - dtMax) / 1000 / 60 / 60 / 24) - 1;
			$("#idCalendarDays1").html("超过本月申报");
			$("#idCalendarDays2").html("期<span>" + days + "</span>天");
		}
	} else {
		$("#idCalendarDays1").html("本月还未");
		$("#idCalendarDays2").html("设置申报期");
	}
	
}
