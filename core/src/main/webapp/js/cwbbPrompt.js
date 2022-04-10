$(function(){
  var sbzlid=$("#sb_zlid").val();
  //进入报表页面，若为财务报表，在页面工具栏下增加提示信息
  if(sbzlid!=undefined&&sbzlid!=""&&sbzlid!=null){
	  if(sbzlid.substring(0,3)=='298'){
		  var sp='<div style="margin-top:15px;"><span style="font-size: 14px;font-weight: bold;color:red">&nbsp;&nbsp;&nbsp;友情提示:如果系统带出的初始化数据与实际不符，可作废上期报表修改重报后再填报本期。</span></div>';
		  if($(".etaxTBar").text().length == 0){
			  $(".etaxTBar").after(sp);
		  }
	  }else if(sbzlid.substring(0,3)=='398'){
		  var sp='<div style="margin-top:15px;"><span style="font-size: 14px;font-weight: bold;color:red">&nbsp;&nbsp;&nbsp;友情提示:因系统切换，部分财务报表历史数据没有迁移，请自行填写上年度相关数据。</span></div>';
		  if($(".etaxTBar").text().length == 0){
			  $(".etaxTBar").after(sp);
		  }
	  }
  }
});