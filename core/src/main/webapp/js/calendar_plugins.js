/**
 * 日历控件加载
 */
var UI_calendar = function(){
	
	var options = null;
	
	options = {
		pid : "",					//父id
		location : "",				//当前域名地址
		init : function(_options){
			options = $.extend(true, {}, options, _options);
			
			// 构建视图
			options.render(options);
		},
		render : function(_options){
			var opt = _options;
			
			var _str = "";
			_str += "<div class='Calendar'>";
			_str += "	<div class='Calendar_top'>";
			_str += "		<span class='Calendar_title'>征期日历</span>";
			_str += "		<span id='idCalendarPre'><img src='"+staticPath+"/css/images/left-jt.png' width='9' height='11'> </span>";
			_str += "		<span class='Calendar_input'>";
			_str += "			<span id='idCalendarMonth'></span>月<span id='idCalendarYear'></span>";
			_str += "		</span>";
			_str += "		<span id='idCalendarNext'><img src='"+staticPath+"/css/images/right-jt.png' width='7' height='11'></span>";
			_str += "	</div>";
			_str += "	<table cellspacing='0'>";
			_str += "		<thead><tr><td>星期日</td><td>星期一</td><td>星期二</td><td>星期三</td><td>星期四</td><td>星期五</td><td>星期六</td></tr></thead>";
			_str += "		<tbody id='idCalendar'></tbody>";
			_str += "	</table>";
			_str += "</div>";
			
			$(opt.pid).append(_str);
		}
	};
	
	return {
		init : options.init
	};
}();


/*
			<div class="Calendar">
				<div class="Calendar_top">
					<span class="Calendar_title">征期日历</span> 
					<span id="idCalendarPre"><img src="${ctx }/css/images/left-jt.png" width="9" height="11"> </span> 
					<span class="Calendar_input"> 
						<span id="idCalendarMonth"></span>月<span id="idCalendarYear"></span>
					</span>
					<span id="idCalendarNext">
					<img src="${ctx }/css/images/right-jt.png" width="7" height="11"> </span>
				</div>
				<table cellspacing="0">
					<thead>
						<tr>
							<td>星期日</td>
							<td>星期一</td>
							<td>星期二</td>
							<td>星期三</td>
							<td>星期四</td>
							<td>星期五</td>
							<td>星期六</td>
						</tr>
					</thead>
					<tbody id="idCalendar">
					</tbody>
				</table>
			</div>
*/