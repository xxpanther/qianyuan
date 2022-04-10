/*
功能：检测是否安装打印控件
使用：docheckprint()，配置<OBJECT>对象来识别打印机
返回值：0为成功非0失败
作者：wwd
*/
function docheckprint(){  

	var iret = -1;

	try
	{
		iret = CAPlugins.CheckPrint();	
	}
	catch(e)
	{ 
		return -2;  
		
	} 

	return iret;
}

//将7月转换为07月,将4天换成04
function timeChange(_moth){
	 var _moth=_moth.toString();
	 if(_moth.length==1){
	    return "0"+_moth;
	 }else{
		 return _moth;
	 }
}

function sjgszh(_time){
	return _time.split(" ")[0];
}

/*
功能：打印 税务登记信息 单位纳税人
规格：A4
使用：Print_swdjxx(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd*/
function Print_swdjxx(strTmp,iPreview,print_dwnsr_jc,print_dwnsr_zc,print_dwnsr_fz )
{
	var jsondata = {};

	var main = {};
	print_dwnsr_jc=print_dwnsr_jc.body;
	//1.单位纳税人基础信息((print_dwnsr_jc.==null||print_dwnsr_jc.==undefined)?"":print_dwnsr_jc.);
	main["nsrsbh"] 		= ((print_dwnsr_jc.nsrsbh==null||print_dwnsr_jc.nsrsbh==undefined)?"":print_dwnsr_jc.nsrsbh);//"纳税人识别号";
	main["nsrmc"] 		= ((print_dwnsr_jc.nsrmc==null||print_dwnsr_jc.nsrmc==undefined)?"":print_dwnsr_jc.nsrmc);//"纳税人名称";
	
	main["djzclx"]   = ((print_dwnsr_jc.djzclxmc==null||print_dwnsr_jc.djzclxmc==undefined)?"":print_dwnsr_jc.djzclxmc);//"登记注册类型";
	main["pzsljg"] 	 = ((print_dwnsr_jc.pzsljg==null||print_dwnsr_jc.pzsljg==undefined)?"":print_dwnsr_jc.pzsljg);//"批准设立机关";
	main["zzjgdm"] 	 = ((print_dwnsr_jc.zzjgdm==null||print_dwnsr_jc.zzjgdm==undefined)?"":print_dwnsr_jc.zzjgdm);//"组织机构代码";
	main["pzslzm_wjh"] 	 = ((print_dwnsr_jc.pzwh==null||print_dwnsr_jc.pzwh==undefined)?"":print_dwnsr_jc.pzwh);//"批准设立证明或文件号";

	main["kyrq"] 	= ((print_dwnsr_jc.kyslrq==null||print_dwnsr_jc.kyslrq==undefined)?"":sjgszh(print_dwnsr_jc.kyslrq));//"开业（设立）日期";
	main["scjyqx"] 	    = (((print_dwnsr_jc.scjyqxq == null || print_dwnsr_jc.scjyqxq == undefined) ? "" : DataTime(print_dwnsr_jc.scjyqxq))
			+((print_dwnsr_jc.scjyqxz == null || print_dwnsr_jc.scjyqxz == undefined||print_dwnsr_jc.scjyqxz =="") ? "至今" : "至"+ DataTime(print_dwnsr_jc.scjyqxz)));//"生产经营期限";

	main["zzmc"] 	= ((print_dwnsr_jc.zzmc==null||print_dwnsr_jc.zzmc==undefined)?"":print_dwnsr_jc.zzmc);//"证照名称";
	main["zzhm"]    = ((print_dwnsr_jc.zzhm==null||print_dwnsr_jc.zzhm==undefined)?"":print_dwnsr_jc.zzhm);//"证照号码";
	main["zcdz"] 	= ((print_dwnsr_jc.zcdz==null||print_dwnsr_jc.zcdz==undefined)?"":print_dwnsr_jc.zcdz);//"注册地址";
	main["zc_yzbm"] 	= ((print_dwnsr_jc.zcdyb==null||print_dwnsr_jc.zcdyb==undefined)?"":print_dwnsr_jc.zcdyb);//"邮政编码";
	main["zc_lxdh"] 	= ((print_dwnsr_jc.zcddhhm==null||print_dwnsr_jc.zcddhhm==undefined)?"":print_dwnsr_jc.zcddhhm);//"联系电话";

	main["scjydz"] 	= ((print_dwnsr_jc.scjydz==null||print_dwnsr_jc.scjydz==undefined)?"":print_dwnsr_jc.scjydz);//"生产经营地址";
	main["sc_yzbm"] 	 = ((print_dwnsr_jc.scjydyb==null||print_dwnsr_jc.scjydyb==undefined)?"":print_dwnsr_jc.scjydyb);//"邮政编码";
	main["sc_lxdh"] 	 = ((print_dwnsr_jc.scjyddhhm==null||print_dwnsr_jc.scjyddhhm==undefined)?"":print_dwnsr_jc.scjyddhhm);//"联系电话";
	main["hsfs"]     = ((print_dwnsr_jc.hsfcmc==null||print_dwnsr_jc.hsfcmc==undefined)?"":print_dwnsr_jc.hsfcmc);//"核算方式";

	main["cyrs"] 		 = ((print_dwnsr_jc.cyrs==null||print_dwnsr_jc.cyrs==undefined)?"":print_dwnsr_jc.cyrs);//"从业人数";
	main["wjrs"] 	 = ((print_dwnsr_jc.wjrs==null||print_dwnsr_jc.wjrs==undefined)?"":print_dwnsr_jc.wjrs);//"其中外籍人数";
	main["dwxz"] 	 = ((print_dwnsr_jc.dwxzmc==null||print_dwnsr_jc.dwxzmc==undefined)?"":print_dwnsr_jc.dwxzmc);//"单位性质";

	main["wzwz"] 	 = ((print_dwnsr_jc.wzwz==null||print_dwnsr_jc.wzwz==undefined)?"":print_dwnsr_jc.wzwz);//"网站网址";
	main["gjhy"] 	     = ((print_dwnsr_jc.gjhy==null||print_dwnsr_jc.gjhy==undefined)?"":print_dwnsr_jc.gjhy);//"国际行业";
	main["sykjzd"] 		 = ((print_dwnsr_jc.sykjzdmc==null||print_dwnsr_jc.sykjzdmc==undefined)?"":print_dwnsr_jc.sykjzdmc);//"适用会计制度";

	main["jyfw"]			 = ((print_dwnsr_jc.jyfw==null||print_dwnsr_jc.jyfw==undefined)?"":print_dwnsr_jc.jyfw);//"经营范围";
	main["fddbr_xm"] 	     = ((print_dwnsr_jc.fddbrmc==null||print_dwnsr_jc.fddbrmc==undefined)?"":print_dwnsr_jc.fddbrmc);//"法定代表人姓名";
	main["cwfzr_xm"] 		 = ((print_dwnsr_jc.cwfzrmc==null||print_dwnsr_jc.cwfzrmc==undefined)?"":print_dwnsr_jc.cwfzrmc);//"财务负责人姓名";
	main["bsr_xm"] 		     = ((print_dwnsr_jc.bsrmc==null||print_dwnsr_jc.bsrmc==undefined)?"":print_dwnsr_jc.bsrmc);//"办税人姓名";

	main["fddbr_sfz"] 	    = ((print_dwnsr_jc.frzl==null||print_dwnsr_jc.frzl==undefined)?"":print_dwnsr_jc.frzl);//"法定代表人身份证";
	main["cwfzr_sfz"] 		= ((print_dwnsr_jc.cwfzrzl==null||print_dwnsr_jc.cwfzrzl==undefined)?"":print_dwnsr_jc.cwfzrzl);//"财务负责人身份证";
	main["bsr_sfz"]         = ((print_dwnsr_jc.bsrzl==null||print_dwnsr_jc.bsrzl==undefined)?"":print_dwnsr_jc.bsrzl);//"办税人身份证";

	main["fddbr_hm"] 	     = ((print_dwnsr_jc.frzjhm==null||print_dwnsr_jc.frzjhm==undefined)?"":print_dwnsr_jc.frzjhm);//"法定代表人号码";
	main["cwfzr_hm"] 		 = ((print_dwnsr_jc.cwfrzzjhm==null||print_dwnsr_jc.cwfrzzjhm==undefined)?"":print_dwnsr_jc.cwfrzzjhm);//"财务负责人号码";
	main["bsr_hm"] 		     = ((print_dwnsr_jc.bsrzjhm==null||print_dwnsr_jc.bsrzjhm==undefined)?"":print_dwnsr_jc.bsrzjhm);//"办税人号码";

	main["fddbr_gddh"] 	    = ((print_dwnsr_jc.frgddh==null||print_dwnsr_jc.frgddh==undefined)?"":print_dwnsr_jc.frgddh);//"法定代表人固定电话";
	main["cwfzr_gddh"] 		= ((print_dwnsr_jc.cwfzrdhhm==null||print_dwnsr_jc.cwfzrdhhm==undefined)?"":print_dwnsr_jc.cwfzrdhhm);//"财务负责人固定电话";
	main["bsr_gddh"] 		= ((print_dwnsr_jc.bsrdhhm==null||print_dwnsr_jc.bsrdhhm==undefined)?"":print_dwnsr_jc.bsrdhhm);//"办税人固定电话";

	main["fddbr_yddh"] 	    = ((print_dwnsr_jc.fryddhhm==null||print_dwnsr_jc.fryddhhm==undefined)?"":print_dwnsr_jc.fryddhhm);//"法定代表人移动电话";
	main["cwfzr_yddh"] 		= ((print_dwnsr_jc.cwfzryddhhm==null||print_dwnsr_jc.cwfzryddhhm==undefined)?"":print_dwnsr_jc.cwfzryddhhm);//"财务负责人移动电话";
	main["bsr_yddh"] 		= ((print_dwnsr_jc.bsryddhhm==null||print_dwnsr_jc.bsryddhhm==undefined)?"":print_dwnsr_jc.bsryddhhm);//"办税人移动电话";


	main["fddbr_dzyx"] 	    = ((print_dwnsr_jc.frdzyx==null||print_dwnsr_jc.frdzyx==undefined)?"":print_dwnsr_jc.frdzyx);//"法定代表人邮箱";
	main["cwfzr_dzyx"] 		= ((print_dwnsr_jc.cwfzrdzyx==null||print_dwnsr_jc.cwfzrdzyx==undefined)?"":print_dwnsr_jc.cwfzrdzyx);//"财务负责人邮箱";
	main["bsr_dzyx"] 		= ((print_dwnsr_jc.bsrdzyx==null||print_dwnsr_jc.bsrdzyx==undefined)?"":print_dwnsr_jc.bsrdzyx);//"办税人邮箱";

	main["swdlrmc"] 		= ((print_dwnsr_jc.swdlrmc==null||print_dwnsr_jc.swdlrmc==undefined)?"":print_dwnsr_jc.swdlrmc);//"税务代理人名称";
	main["nsrsbh_2"] 		= ((print_dwnsr_jc.swdlrnsrsbh==null||print_dwnsr_jc.swdlrnsrsbh==undefined)?"":print_dwnsr_jc.swdlrnsrsbh);//"纳税人识别号";
	main["lxdh"] 			= ((print_dwnsr_jc.swdlrdhhm==null||print_dwnsr_jc.swdlrdhhm==undefined)?"":print_dwnsr_jc.swdlrdhhm);//"联系电话";
	main["dzyx"] 			= ((print_dwnsr_jc.swdlrdzyx==null||print_dwnsr_jc.swdlrdzyx==undefined)?"":print_dwnsr_jc.swdlrdzyx);//"电子邮箱";

	
	//2.单位纳税人注册信息((datas[].==null||datas[].undefined)?"":undefined)
	var item = [];
	if(print_dwnsr_zc!=null){
	main["zczb_tzze"] 	    = ((print_dwnsr_jc.je==null||print_dwnsr_jc.je==undefined)?"":print_dwnsr_jc.je);//"注册资本或投资总额";
	main["bz"] 				= ((print_dwnsr_jc.zbmc==null||print_dwnsr_jc.zbmc==undefined)?"":print_dwnsr_jc.zbmc);//"币种";

	var datas=print_dwnsr_zc.body.list;
	if(datas.length==undefined){
		list=0;
	}else{
		list=datas.length;
	}
	for (var i = 0;i < list;i++ )//三行
	{
		data=datas[i];
		item[i]=new Array();  
		item[i][0] = ((data.tzfmc==null||data.tzfmc==undefined)?"":data.tzfmc);//'投资方名称';
		item[i][1] = ((data.tzfxzmc==null||data.tzfxzmc==undefined)?"":data.tzfxzmc);//'投资方经济性质';
		item[i][2] = ((data.tzje==null||data.tzje==undefined)?"":data.tzje);//'投资金额';
		item[i][3] = ((data.bzmc==null||data.bzmc==undefined)?"":data.bzmc);//'投资币种';
		item[i][4] = ((data.tzbl==null||data.tzbl==undefined)?"":data.tzbl);//'投资比例';
		item[i][5] = ((data.zrrtzbl==null||data.zrrtzbl==undefined)?"":data.zrrtzbl);//'自然人投资比例';
		item[i][6] = ((data.wztzbl==null||data.wztzbl==undefined)?"":data.wztzbl);//'外资投资比例';
		item[i][7] = ((data.gytzbl==null||data.gytzbl==undefined)?"":data.gytzbl);//'国有投资比例';
		item[i][8] = ((data.zjzl==null||data.zjzl==undefined)?"":data.zjzl);//'身份证件种类';
		item[i][9] = ((data.zjhm==null||data.zjhm==undefined)?"":data.zjhm);//'身份证件号码';
		item[i][10] = ((data.gj==null||data.gj==undefined)?"":data.gj);//'国籍或地址';
		}	
	}
	//3.

	var item2 = [];
	if(print_dwnsr_fz!=null){
		var datas=print_dwnsr_fz.body.list;
		if(datas.length==undefined){
			list=0;
		}else{
			list=datas.length;
		}
		for (var i = 0;i < 3;i++ )//三行
		{
			var data=datas[i];
			item2[i]=new Array();  
			item2[i][0] =((data.fzjgmc==null||data.fzjgmc==undefined)?"":data.fzjgmc) ;//'分支机构名称';
			item2[i][1] = ((data.zcdz==null||data.zcdz==undefined)?"":data.zcdz);//'注册地址';
			item2[i][2] = ((data.nsrsbh==null||data.nsrsbh==undefined)?"":data.nsrsbh);//'纳税人识别号';
		}
		main["zjgmc"] 	    = ((datas[0].zjgmc==null||datas[0].zjgmc==undefined)?"":datas[0].zjgmc);//"纳税人识别号";//"总机构名称";
		main["zjg_nsrsbh"] 	= ((datas[0].zjg_nsrsbh==null||datas[0].zjg_nsrsbh==undefined)?"":datas[0].zjg_nsrsbh);//"纳税人识别号";
		main["zjg_zcdz"] 	= ((datas[0].zjgzcdz==null||datas[0].zjgzcdz==undefined)?"":datas[0].zjgzcdz);//"注册地址";

		main["zjg_jyfw"] 	= ((datas[0].jyfw==null||datas[0].jyfw==undefined)?"":datas[0].jyfw);//"经营范围";
		main["zjg_frxm"] 	= ((datas[0].fddbrmc==null||datas[0].fddbrmc==undefined)?"":datas[0].fddbrmc);//"法人姓名";
		main["zjg_lxdh"] 	= ((datas[0].dhhm=null||datas[0].dhhm==undefined)?"":datas[0].dhhm);//"联系电话";
		main["zjg_yzbm"] 	= ((datas[0].yzbm=null||datas[0].yzbm==undefined)?"":datas[0].yzbm);//"邮政编码";
	}	
	jsondata["main"]    = main;
	jsondata["item"]    = item;
	jsondata["item2"]   = item2;

	var strJSON  = JSON.stringify(jsondata) ;
	//sjson.toJSONString();
	//alert(strJSON);
	//txtjson.value = strJSON;

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}





/*
功能：打印 税务登记信息 个人纳税人
规格：A4
使用：Print_swdjxx_gr(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_swdjxx_gr(strTmp,iPreview, print_gtnsr_jc,print_gtnsr_fb,print_gtnsr_hh)
{
	var jsondata = {};

	var main = {};
	print_gtnsr_jc=print_gtnsr_jc.body;
	//1.个体纳税人基础信息((print_gtnsr_jc.==null||print_gtnsr_jc.==undefined)?"":print_gtnsr_jc.)
	main["nsrsbh"] 		= ((print_gtnsr_jc.nsrsbh==null||print_gtnsr_jc.nsrsbh==undefined)?"":print_gtnsr_jc.nsrsbh);//"纳税人识别号";
	main["nsrmc"] 		= ((print_gtnsr_jc.nsrmc==null||print_gtnsr_jc.nsrmc==undefined)?"":print_gtnsr_jc.nsrmc);//"纳税人名称";
	
	main["djzclx"]   = ((print_gtnsr_jc.djzclxmc==null||print_gtnsr_jc.djzclxmc==undefined)?"":print_gtnsr_jc.djzclxmc);//"登记注册类型";
	main["pzsljg"] 	 = ((print_gtnsr_jc.pzjg==null||print_gtnsr_jc.pzjg==undefined)?"":print_gtnsr_jc.pzjg);//"批准设立机关";
	
	main["kyrq"] 	    = ((print_gtnsr_jc.kyslrq==null||print_gtnsr_jc.kyslrq==undefined)?"":sjgszh(print_gtnsr_jc.kyslrq));//"开业（设立）日期";
	
	main["scjyqxq"] 	    = ((print_gtnsr_jc.scjyqxq==null||print_gtnsr_jc.scjyqxq==undefined)?"":sjgszh(print_gtnsr_jc.scjyqxq));//"生产经营期限";
	main["scjyqxz"] 	    = ((print_gtnsr_jc.scjyqxz==null||print_gtnsr_jc.scjyqxz==undefined)?"":sjgszh(print_gtnsr_jc.scjyqxz));//"生产经营期限";
	
	main["zjmc"] 	= ((print_gtnsr_jc.zzlbmc==null||print_gtnsr_jc.zzlbmc==undefined)?"":print_gtnsr_jc.zzlbmc);//"证照名称";
	main["zzhm"]    = ((print_gtnsr_jc.zzhm==null||print_gtnsr_jc.zzhm==undefined)?"":print_gtnsr_jc.zzhm);//"证照号码";
	main["zcdz"] 	= ((print_gtnsr_jc.zcdz==null||print_gtnsr_jc.zcdz==undefined)?"":print_gtnsr_jc.zcdz);//"注册地址";
	main["zc_yzbm"] 	= ((print_gtnsr_jc.zcdyb==null||print_gtnsr_jc.zcdyb==undefined)?"":print_gtnsr_jc.zcdyb);//"邮政编码";
	main["zc_lxdh"] 	= ((print_gtnsr_jc.zcddhhm==null||print_gtnsr_jc.zcddhhm==undefined)?"":print_gtnsr_jc.zcddhhm);//"联系电话";

	main["scjydz"] 	     = ((print_gtnsr_jc.scjydz==null||print_gtnsr_jc.scjydz==undefined)?"":print_gtnsr_jc.scjydz);//"生产经营地址";
	main["sc_yzbm"] 	 = ((print_gtnsr_jc.scjydyb==null||print_gtnsr_jc.scjydyb==undefined)?"":print_gtnsr_jc.scjydyb);//"邮政编码";
	main["sc_lxdh"] 	 = ((print_gtnsr_jc.dhhm==null||print_gtnsr_jc.dhhm==undefined)?"":print_gtnsr_jc.dhhm);//"联系电话";

	main["hhrs"]         = ((print_gtnsr_jc.hhrs==null||print_gtnsr_jc.hhrs==undefined)?"":print_gtnsr_jc.hhrs);//"合伙人数";

	main["ggrs"] 		 = ((print_gtnsr_jc.ggrs==null||print_gtnsr_jc.ggrs==undefined)?"":print_gtnsr_jc.ggrs);//"从业人数";
	main["gdrs"] 	     = ((print_gtnsr_jc.gdrs==null||print_gtnsr_jc.gdrs==undefined)?"":print_gtnsr_jc.gdrs);//"其中固定人数";


	main["wzwz"] 	     = ((print_gtnsr_jc.wzwz==null||print_gtnsr_jc.wzwz==undefined)?"":print_gtnsr_jc.wzwz);//"网站网址";
	main["gbhy"] 	     = ((print_gtnsr_jc.gbhy==null||print_gtnsr_jc.gbhy==undefined)?"":print_gtnsr_jc.gbhy);//"国际行业";
	
	main["yz_mc"] 	    = ((print_gtnsr_jc.yzxm==null||print_gtnsr_jc.yzxm==undefined)?"":print_gtnsr_jc.yzxm);//"业主名称";
	main["yz_gj"] 		= ((print_gtnsr_jc.gjorhj==null||print_gtnsr_jc.gjorhj==undefined)?"":print_gtnsr_jc.gjorhj);//"国籍或户籍";
	main["yz_gddh"] 		= ((print_gtnsr_jc.gddh==null||print_gtnsr_jc.gddh==undefined)?"":print_gtnsr_jc.gddh);//"业主固定电话";
	main["yz_yddh"] 	    = ((print_gtnsr_jc.yddh==null||print_gtnsr_jc.yddh==undefined)?"":print_gtnsr_jc.yddh);//"业主移动电话";
	main["yz_dzyx"] 		= ((print_gtnsr_jc.dzyx==null||print_gtnsr_jc.dzyx==undefined)?"":print_gtnsr_jc.dzyx);//"业主电子邮箱";


	main["sfzjmc"] 		= ((print_gtnsr_jc.zjlxmc==null||print_gtnsr_jc.zjlxmc==undefined)?"":print_gtnsr_jc.zjlxmc);//"身份证件名称";
	main["zjhm"] 		= ((print_gtnsr_jc.zjhm==null||print_gtnsr_jc.zjhm==undefined)?"":print_gtnsr_jc.zjhm);//"证件号码";
	main["jyfw"] 			= ((print_gtnsr_jc.jyfm==null||print_gtnsr_jc.jyfm==undefined)?"":print_gtnsr_jc.jyfm);//"经营范围";
	
	jsondata["main"]    = main;
	
	//2.分店情况	
	var item = [];
	if(print_gtnsr_fb!=null){
		var datas=print_gtnsr_fb.body.list.item;
		if(datas.length==undefined){
			list=0;
		}else{
			list=datas.length;
		}
		for (var i = 0;i < list;i++ )//三行
		{
			var data=datas[i];
			item[i]=new Array();  
			item[i][0] = ((data.fpzlmc==null||data.fpzlmc==undefined)?"":data.fpzlmc);//'分店名称';
			item[i][1] = ((data.fpdm==undefined||data.fpdm==null)?"":data.fpdm);//'纳税人识别号';
			item[i][2] = ((data.lyrq==null||data.lyrq==undefined)?"":data.lyrq);//'地址';
			item[i][3] = ((data.lysl==null||data.lysl==undefined)?"":data.lysl);//'电话';
		}
	}
	jsondata["item"]    = item;

	//3.合伙人信息((data.==null||data.==undefined)?"":data.)
	var item2 = [];
	if(print_gtnsr_hh!=null){
		var datas=print_gtnsr_hh.body.list.item;
		if(datas.length==undefined){
			list=0;
		}else{
			list=datas.length;
		}
		for (var i = 0;i < 3;i++ )//三行
		{
			data=datas[i];
			item2[i]=new Array(); 
			item2[i][0] = ((data.fpdm==null||data.fpdm==undefined)?"":data.fpdm);//'合伙人姓名';
			item2[i][1] = ((data.fpzlmc==null||data.fpzlmc==undefined)?"":data.fpzlmc);//'国籍或地址';
			item2[i][2] = ((data.lyrq==null||data.lyrq==undefined)?"":data.lyrq);//'身份证件名称';
			item2[i][3] = ((data.lysl==null||data.lysl==undefined)?"":data.lysl);//'身份证件号码';
			item2[i][4] = ((data.lyrq==null||data.lyrq==undefined)?"":data.lyrq);//'投资金额（万元）';
			item2[i][5] = ((data.lyrq==null||data.lyrq==undefined)?"":data.lyrq);//'投资比例';
			item2[i][6] = ((data.lysl==null||data.lysl==undefined)?"":data.lysl);//'分配比例';
		}
	}
	jsondata["item2"]    = item2;


	var strJSON  = JSON.stringify(jsondata) ;
	//sjson.toJSONString();
	//alert(strJSON);
	//txtjson.value = strJSON;

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}

/*
功能：打印 发票领用结存查询
规格：A4
使用：Print_fplyjccx(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_fplyjccx(strTmp,iPreview,print_fplyjccx )
{
	var jsondata = {};

	var main = {};

	main["title"]  	= "发票领用结存查询";
	jsondata["main"]    = main;

	var item = [];
	var list=null;

	if(print_fplyjccx.length==undefined){
		list=0;
	}else{
		list=print_fplyjccx.length;
	}
	for (var i = 0;i < list;i++ )//三行
	{
		item[i]=new Array();  
		item[i][0] =((print_fplyjccx[i].fpdm == null || print_fplyjccx[i].fpdm == undefined) ? "" : print_fplyjccx[i].fpdm);
		item[i][1] =((print_fplyjccx[i].fpmc == null || print_fplyjccx[i].fpmc == undefined) ? "" : print_fplyjccx[i].fpmc);
		item[i][2] =((print_fplyjccx[i].rq == null || print_fplyjccx[i].rq == undefined) ? "" : sjgszh(print_fplyjccx[i].rq));
		item[i][3] =((print_fplyjccx[i].fpzs == null || print_fplyjccx[i].fpzs == undefined) ? "" : print_fplyjccx[i].fpzs);
		item[i][4] =((print_fplyjccx[i].fply == null || print_fplyjccx[i].fply == undefined) ? "" : print_fplyjccx[i].fply);
		item[i][5] =((print_fplyjccx[i].sysl == null || print_fplyjccx[i].sysl == undefined) ? "" : print_fplyjccx[i].sysl);

		/*item[i][0] = '增值税专用发票中文电脑版（三联）';
		item[i][1] = '25';
		item[i][2] = '100';
		item[i][3] = '100000';
		item[i][4] = '2014-11-11 12:00:00';
		item[i][5] = '有效票种';*/

		/*for (var j = 1;j < 5 ;j++ )
		{
			item[i][j] = j.toFixed(2);
		}*/

	}
	

	jsondata["item"]    = item;
	var strJSON  = JSON.stringify(jsondata) ;
		//sjson.toJSONString();
	//alert(strJSON);

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}

/*
功能：打印 发票领用资格查询
规格：A4
使用：Print_fplyzgcx(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_fplyzgcx(strTmp,iPreview ,print_fplyzgcx)
{
	var jsondata = {};
	var main = {};
	main["title"]  	= "发票领用资格查询";
	jsondata["main"]    = main;

	var item = [];
	var list=null;
	if(print_fplyzgcx.length==undefined){
		list=0;
	}else{
		list=print_fplyzgcx.length;
	}
	for (var i = 0;i < list;i++ )//三行
	{
		item[i]=new Array();
		item[i][0] = ((print_fplyzgcx[i].fpzlmc == null || print_fplyzgcx[i].fpzlmc == undefined) ? "" : print_fplyzgcx[i].fpzlmc);
		item[i][1] =((print_fplyzgcx[i].mclyzdsl == null || print_fplyzgcx[i].mclyzdsl == undefined) ? "" : print_fplyzgcx[i].mclyzdsl);
		item[i][2]=((print_fplyzgcx[i].mylyzdsl == null || print_fplyzgcx[i].mylyzdsl == undefined) ? "" : print_fplyzgcx[i].mylyzdsl);
		item[i][3]=((print_fplyzgcx[i].zgkpxe == null || print_fplyzgcx[i].zgkpxe == undefined) ? "" : print_fplyzgcx[i].zgkpxe);
		item[i][4]=((print_fplyzgcx[i].hzrq == null || print_fplyzgcx[i].hzrq == undefined) ? "" : sjgszh(print_fplyzgcx[i].hzrq));
		item[i][5]=((print_fplyzgcx[i].yxbz == 'Y') ? "有效票种" : "历史票种");
		/*item[i][0] = '增值税专用发票中文电脑版（三联）';
		item[i][1] = '25';
		item[i][2] = '100';
		item[i][3] = '100000';
		item[i][4] = '2014-11-11 12:00:00';
		item[i][5] = '有效票种';*/

		/*for (var j = 1;j < 5 ;j++ )
		{
			item[i][j] = j.toFixed(2);
		}*/

	}
	

	jsondata["item"]    = item;
	var strJSON  = JSON.stringify(jsondata) ;
		//sjson.toJSONString();
	//alert(strJSON);

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}

/*
功能：打印 申报信息查询
规格：A4
使用：Print_sbxxcx(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_sbxxcx(strTmp,iPreview,print_sbxxcx )
{
	var jsondata = {};
	
	var main = {};

	main["title"]  	= "申报信息查询";
	jsondata["main"]    = main;

	var item = [];
	var list=null;
	if(print_sbxxcx.length==undefined){
		list=0;
	}else{
		list=print_sbxxcx.length;
	}
	for (var i = 0;i < list;i++ )//三行
	{
		
		item[i]=new Array();  
		
		item[i][0] = ((print_sbxxcx[i].zsxmmc == null || print_sbxxcx[i].zsxmmc == undefined) ? "" : print_sbxxcx[i].zsxmmc);
		item[i][1] = ((print_sbxxcx[i].sbrq == null || print_sbxxcx[i].sbrq == undefined) ? "" : sjgszh(print_sbxxcx[i].sbrq));
		item[i][2] = ((print_sbxxcx[i].sssqq == null || print_sbxxcx[i].sssqq == undefined) ? "" : sjgszh(print_sbxxcx[i].sssqq));
		item[i][3] = ((print_sbxxcx[i].sssqz == null || print_sbxxcx[i].sssqz == undefined) ? "" : sjgszh(print_sbxxcx[i].sssqz));
		item[i][4] = ((print_sbxxcx[i].ybtse == null || print_sbxxcx[i].ybtse == undefined) ? "" : print_sbxxcx[i].ybtse);
		item[i][5] = ((print_sbxxcx[i].pzxh == null || print_sbxxcx[i].pzxh == undefined) ? "" : print_sbxxcx[i].pzxh);
		item[i][6] = ((print_sbxxcx[i].qk == null || print_sbxxcx[i].qk == undefined) ? "" : print_sbxxcx[i].qk);
		/*item[i][0] = print_sbxxcx[i];
		item[i][1] = '2014-11-11 12:00:00';
		item[i][2] = '2014-03-11 12:00:00';
		item[i][3] = '2014-03-31 12:00:00';
		item[i][4] = '12312';
		item[i][5] = '3200129941074084580';
		item[i][6] = '申报情况';*/
		/*for (var j = 1;j < 5 ;j++ )
		{
			item[i][j] = j.toFixed(2);
		}*/

	}
	

	jsondata["item"]    = item;
	var strJSON  = JSON.stringify(jsondata) ;
		//sjson.toJSONString();
	//alert(strJSON);

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}

/*
功能：打印 税款缴纳查询
规格：A4
使用：Print_skjncx(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_skjncx(strTmp,iPreview,print_skjncx )
{
	var jsondata = {};

	var main = {};

	main["title"]  	= "税款缴纳查询";
	jsondata["main"]    = main;

	var item = [];
	var list=null;
	if(print_skjncx.length==undefined){
		list=0;
	}else{
		list=print_skjncx.length;
	}
	for (var i = 0;i < list;i++ )//三行
	{
		item[i]=new Array();  
		item[i][0] = ((print_skjncx[i].zsxmmc == null || print_skjncx[i].zsxmmc == undefined) ? "" : print_skjncx[i].zsxmmc);
		item[i][1] =((print_skjncx[i].skssqq == null || print_skjncx[i].skssqq == undefined) ? "" : sjgszh(print_skjncx[i].skssqq));
		item[i][2] =((print_skjncx[i].skssqz == null || print_skjncx[i].skssqz == undefined) ? "" : sjgszh(print_skjncx[i].skssqz));
		item[i][3] =((print_skjncx[i].ybtse == null || print_skjncx[i].ybtse == undefined) ? "" : print_skjncx[i].ybtse);
		item[i][4] =((print_skjncx[i].rkse == null || print_skjncx[i].rkse == undefined) ? "" : print_skjncx[i].rkse);
		item[i][5] =((print_skjncx[i].rkrq == null || print_skjncx[i].rkrq == undefined) ? "" : sjgszh(print_skjncx[i].rkrq));
		
		
		/*alert(item[i][0]);
		item[i][0] = '增值税';
		item[i][1] = '2014-11-11 12:00:00';
		item[i][2] = '2014-03-11 12:00:00';
		item[i][3] = '0';
		item[i][4] = '12312';
		item[i][5] = '2013-09-10 12:00:00';*/

		/*for (var j = 1;j < 5 ;j++ )
		{
			item[i][j] = j.toFixed(2);
		}*/

	}
	

	jsondata["item"]    = item;
	var strJSON  = JSON.stringify(jsondata) ;
		//sjson.toJSONString();
	//alert(strJSON);

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}

/*
功能：打印 影像资料查询
规格：A4
使用：Print_yxzlcx(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_yxzlcx(strTmp,iPreview ,print_yxzlcx)
{
	var jsondata = {};

	var main = {};

	main["title"]  	= "影像资料查询";
	jsondata["main"]    = main;

	var item = [];
	var list=null;
	if(print_yxzlcx.rows.length==undefined){
		list=0;
	}else{
		list=print_yxzlcx.rows.length;
	}
	for (var i = 0;i < list;i++ )//三行
	{
		item[i]=new Array();  
		item[i][0] = ((print_yxzlcx.rows[i].sxdlmc==null||print_yxzlcx.rows[i].sxdlmc==undefined)?"":print_yxzlcx.rows[i].sxdlmc);
		item[i][1] = ((print_yxzlcx.rows[i].sxxlmc==null||print_yxzlcx.rows[i].sxxlmc==undefined)?"":print_yxzlcx.rows[i].sxxlmc);
		item[i][2] = ((print_yxzlcx.rows[i].tj_sj==null||print_yxzlcx.rows[i].tj_sj==undefined)?"":sjgszh(print_yxzlcx.rows[i].tj_sj));
		item[i][3] = ((print_yxzlcx.rows[i].zlmc==null||print_yxzlcx.rows[i].zlmc==undefined)?"":print_yxzlcx.rows[i].zlmc);
		item[i][4] = ((print_yxzlcx.rows[i].cj_sj==null||print_yxzlcx.rows[i].cj_sj==undefined)?"":sjgszh(print_yxzlcx.rows[i].cj_sj));
				
		/*item[i][1] = '小类';
		item[i][2] = '2014-03-11 12:00:00';
		item[i][3] = '软件产品增资税即征即退申请表';
		item[i][4] = '2014-03-11 12:00:00';*/

		/*for (var j = 1;j < 5 ;j++ )
		{
			item[i][j] = j.toFixed(2);
		}*/

	}
	

	jsondata["item"]    = item;
	var strJSON  = JSON.stringify(jsondata) ;
		//sjson.toJSONString();
	//alert(strJSON);

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}

/*
功能：打印 应报送纸质资料
规格：A4
使用：Print_ybszzzl(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_ybszzzl(strTmp,iPreview,Print_ybszzzl )
{
	var jsondata = {};

	var main = {};
	
	main["title"]  	= "应报送纸质资料";
	jsondata["main"]    = main;

	var item = [];
	var list=null;
	if(Print_ybszzzl.length==null||Print_ybszzzl.length==undefined){
		list=0;
	}else{
		list=Print_ybszzzl.length;
	}
	for (var i = 0;i < list;i++ )//三行
	{
		var data=Print_ybszzzl[i];
		item[i]=new Array();  
		item[i][0] = (i+1).toString();
		item[i][1] = ((data.sxmc==null||data.sxmc==undefined)?"":data.sxmc);//事项名称
		item[i][2] = ((data.tjsj==null||data.tjsj==undefined)?"":sjgszh(data.tjsj));//时间
		item[i][3] = ((data.zjzlmc==null||data.zjzlmc==undefined)?"":data.zjzlmc);//'应报送纸质资料名称'
		item[i][4] = ((data.zzzt==undefined||data.zzzt==null)?"":((data.zzzt=="N")?"未报送":"已报送"));//'报送资料状态'

	}
	jsondata["item"]    = item;
	var strJSON  = JSON.stringify(jsondata) ;
		//sjson.toJSONString();
	//alert(strJSON);

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}

/*
功能：打印 资格认定信息查询
规格：A4
使用：Print_zgrdzlcx(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_zgrdzlcx(strTmp,iPreview,print_zgrdxxcx )
{
	var jsondata = {};

	var main = {};

	main["title"]  	= "资格认定信息查询";
	jsondata["main"]    = main;

	var item = [];
	var list=null;
	if(print_zgrdxxcx.length==undefined){
		list=0;
	}else{
		list=print_zgrdxxcx.length;
	}
	for (var i = 0;i <list ;i++ )//三行
	{
		item[i]=new Array();
		
		item[i][0] = (print_zgrdxxcx[i].nsrdzdah==null||print_zgrdxxcx[i].nsrdzdah==undefined)?"":print_zgrdxxcx[i].nsrdzdah; 
		item[i][1] = (print_zgrdxxcx[i].nsrzg_mc==null||print_zgrdxxcx[i].nsrzg_mc==undefined)?"":print_zgrdxxcx[i].nsrzg_mc;
		item[i][2] = (print_zgrdxxcx[i].wspzxh==null||print_zgrdxxcx[i].wspzxh==undefined)?"":print_zgrdxxcx[i].wspzxh;
		//认定日期
		item[i][3] = (print_zgrdxxcx[i].rdrq==null||print_zgrdxxcx[i].rdrq==undefined)?"":sjgszh(print_zgrdxxcx[i].rdrq);
		//有效期起
		item[i][4] = (print_zgrdxxcx[i].yxq_q==null|| print_zgrdxxcx[i].yxq_q==undefined)?"": sjgszh(print_zgrdxxcx[i].yxq_q);
		//有效期至
		item[i][5] = (print_zgrdxxcx[i].yxq_z==null|| print_zgrdxxcx[i].yxq_z==undefined)?"":sjgszh(print_zgrdxxcx[i].yxq_z);

		item[i][6] = (print_zgrdxxcx[i].dkbz == 'Y' ) ? "有效" : "无效";
		/*for (var j = 1;j < 5 ;j++ )
		{
			item[i][j] = j.toFixed(2);
		}*/

	}
	

	jsondata["item"]    = item;
	var strJSON  = JSON.stringify(jsondata) ;
		//sjson.toJSONString();
	//alert(strJSON);

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}



/*
功能：打印 信用等级查询
规格：A4
使用：Print_xydjcx(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_xydjcx(strTmp,iPreview,print_fplyjccx )
{
	var jsondata = {};
	var main = {};

	main["title"]  	= "信用等级查询";
	jsondata["main"]    = main;

	var item = [];
	if(print_fplyjccx!=null||print_fplyjccx!=undefined){
		var list=null;
		if(print_fplyjccx.length==undefined){
			list=0;
		}else{
			list=print_fplyjccx.length;
		}
		for (var i = 0;i < list;i++ )//三行
		{
			data=print_fplyjccx[i];
			item[i]=new Array();  
			item[i][0] =((data.pdnd==null||data.pdnd==undefined)?"":data.pdnd) ;//'2015';
			item[i][1] =((data.pddjdm==null||data.pddjdm==undefined)?"":(data.pddjdm+"级")) ;//'增值税一般纳税人';
			item[i][2] =((data.pdrq==null||data.pdrq==undefined)?"":sjgszh(data.pdrq));//'2015-06-30';
			item[i][3] =((data.yxqq==null||data.yxqq==undefined)?"":sjgszh(data.yxqq)) ;//'增值税一般纳税人';
			item[i][4] =((data.yxqz==null||data.yxqz==undefined)?"":sjgszh(data.yxqz));//'2015-06-30';
		}	
	}
	

	jsondata["item"]    = item;
	var strJSON  = JSON.stringify(jsondata) ;
		//sjson.toJSONString();
	//alert(strJSON);

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}

/*
功能：打印 邮政信息统计查询
规格：A4
使用：Print_yzxxtjcx(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_yzxxtjcx(strTmp,iPreview,yzxxtjcx )
{
	var jsondata = {};

	var main = {};

	main["title"]  	= "邮政信息统计查询";
	jsondata["main"]    = main;

	var item = [];
	var list=null;
	if(yzxxtjcx.length==null||yzxxtjcx.length==undefined){
		list=0;
	}else{
		list=yzxxtjcx.length;
	}
	for (var i = 0;i < list;i++ )//三行
	{
		
		item[i]=new Array();  
		var data =yzxxtjcx[i];
		item[i][0] = ((data.ywdh==null || data.ywdh==undefined)?"":data.ywdh);//'邮政单号';
		item[i][1] = ((data.wfsxmc==null||data.wfsxmc==undefined)?"":data.wfsxmc);//'邮递内容';
		item[i][2] = ((data.yjzt==null||data.yjzt==undefined||data.yjzt=="")?"未妥投":data.yjzt);//'邮递状态';
		item[i][3] = ((data.scrq==null||data.scrq==undefined)?"":sjgszh(data.scrq));//'投递时间';
	}
	

	jsondata["item"]    = item;
	var strJSON  = JSON.stringify(jsondata) ;
		//sjson.toJSONString();
	//alert(strJSON);

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}


/*
功能：打印 物流信息查询
规格：A4
使用：Print_wlxxcx(),在需使用此方法的jsp页面含所需的Id，配置<OBJECT>对象来识别打印机
作者：wwd
*/
function Print_wlxxcx(strTmp,iPreview ,print_wlxxdy)
{
	var jsondata = {};

	var main = {};

	main["title"]  	= "物流信息查询";
	jsondata["main"]    = main;

	var item = [];
	var list=null;
	if(print_wlxxdy==null||print_wlxxdy==undefined){
		list=0;
	}else{
		list=print_wlxxdy.length;
	}
	for (var i = 0;i < list;i++ )//三行
	{
		data=print_wlxxdy[i];
		item[i]=new Array();  
		item[i][0] = ((data.acceptTime==null||data.acceptTime==undefined)?"":data.acceptTime);//'时间';
		item[i][1] = ((data.acceptAddress==null||data.acceptAddress==undefined)?"":data.acceptAddress);//'目前所在地';
		item[i][2] = ((data.remark==null||data.remark==undefined)?"":data.remark);//'发货';
	}
	

	jsondata["item"]    = item;
	var strJSON  = JSON.stringify(jsondata) ;
		//sjson.toJSONString();
	//alert(strJSON);

	ret = CAPlugins.PrintReport(
		strTmp,//模板文件地址
		strJSON,//打印内容
		iPreview//是否预览
	);

	if (0 == ret)
	{
		//打印成功
	}
}