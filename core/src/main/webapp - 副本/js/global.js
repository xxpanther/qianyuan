
function getallwidth(){
	var cloasTree=window.screen.height-210;
    if ($.browser.msie) {
		cloasTree = window.screen.height - 218;
	} else {
		cloasTree = window.screen.height - 255;
	}
    if(cloasTree<645){
    	cloasTree=645;
    }
//	var content_left=window.screen.width-296;
//    $("#message_left").css("width",content_left);
//	$("#message_content").css("width",content_left-200);
//    $("#message_content2").css("width",content_left);
//	$("#message_content").css("height",cloasTree);
//    $("#message_content2").css("height",cloasTree);
    $(".containerbox").css("height",cloasTree);
	// $("#message_left #closeTree, #infosearch").css("height",cloasTree);

	$("#index_body_container").css("height",cloasTree);
	// $(".iframe_tab_container").parents("#index_body_container").css("height","auto");
//	$("#myappIframe").css("height",cloasTree-20);
//	$("#message_left .content_leftTree").css("height",cloasTree-8);
//	$("#content_message #leftTree").css("right","10px");
//	$("#content_message #closeTree").css("right","260px");
//	$("#content_message #closeTree").css("height",cloasTree);
	// console.log(content_left)
	// alert(content_left-200)

}
/*  index  */
function nav_hover(id){
	$(".headmenu #mylist ul li").removeClass("active-left");
	$("#"+id+"").addClass('active-left');
	$(".headmenu #mylist ul li:not(.active-left)").css("color","#7ecef4");
	$("#"+id+"").css("color","#fff");
}
function getindex(){
	var screenWidth=window.screen.width;
    var content_left1=screenWidth-400;//#div_right 360   left 25 right 15
    // var content_left2=screenWidth-330;//           300        15       15
    // var content_left3=screenWidth-10;// 左右 各留5px
    if(screenWidth>1024){
    	$("#content #leftTree").css("right","40px");
    	$("#content #content_left").css("width",content_left1);	
    	// console.log("screenWidth:"+screenWidth+" content_left: "+content_left1);

    }else if(screenWidth>800){
		$("#content #leftTree").css("right","40px");
		// $("#content #content_left").css("width",content_left2);	
		// console.log("screenWidth:"+screenWidth+" content_left: "+content_left2);

    }else{
    	$("#content #leftTree").css("right","40px");
		// $("#content #content_left").css("width",content_left3);	
		// console.log("screenWidth:"+screenWidth+" content_left: "+content_left3);
    }
  
}
	$(window).resize(function(){
		//getindex();
		//getallwidth();
		// closeTrNew();
	});
/* 图片左右滚动 */
function imgroll(){
	var content_main=$('#content_left').width();	     
      var v_width =content_main*0.92;          
        var len = $('#content_list').find("dl").length;   
        var img_item =$("#content_information dl");
        var item_width =180+2*5; //min-width
        var page = 1;  
        var i = Math.ceil(v_width / item_width)-1; //每版放i个图片  
        img_item.css({
        	"margin":"0px  "+(v_width/i-180)*0.5+"px"
        	});
        item_width =180+(v_width/i-180);
        var d_width = Math.ceil(item_width * len); 
        $("#content_list .content").width(d_width);
        
		 if(len <= i){
			 $(".prev").hide();
			 $(".next").hide();
		 }else{
			 $(".prev").show();
			 $(".next").show();	 
			}

 

    //向后 按钮  
    $(".next").click(function(){ 
    	//绑定click事件 
         var content = $("#content_list");   
         var content_list = $("#content_list .content");  
         var v_width = content.width();  
         var len = content.find("dl").length;  
         var page_count  ;   //只要不是整数，就往大的方向取最小的整数  
         if(i==2){
        	 page_count = Math.ceil(len / i) 
        	 
         }
         else{
        	// alert(Math.ceil(len /(v_width / 200))+"next")
        	 page_count = Math.ceil(len /(v_width / item_width)) 
         }
         if( !content_list.is(":animated") ){    //判断"内容展示区域"是否正在处于动画  
              if( page == page_count ){  //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。  
                content_list.animate({ left : '0px'}, "slow"); //通过改变left值，跳转到第一个版面  
                page = 1;  
              }else{  
                content_list.animate({ left : '-='+v_width }, "slow");  //通过改变left值，达到每次换一个版面  
                page++;  
             }  
         }  
   });  
    //往前 按钮  
    $(".prev").click(function(){  
         var content = $("div#content_list");   
         var content_list = $("#content_list .content");  
         var v_width = content.width();  
         var len = content.find("dl").length;  
         var page_count=0  ;   //只要不是整数，就往大的方向取最小的整数  
         if(i==2){
        	 page_count = Math.ceil(len / i) 
        	 
         }
         else{
        	// alert(Math.ceil(len /(v_width / 200))+"pre")
        	 page_count = Math.ceil(len /(v_width / item_width)) 
         }
         if(!content_list.is(":animated") ){    //判断"内容展示区域"是否正在处于动画  
             if(page == 1 ){  //已经到第一个版面了,如果再向前，必须跳转到最后一个版面。  
                content_list.animate({ left : '-='+v_width*(page_count-1) }, "slow");  
                page = page_count;  
            }else{  
                content_list.animate({ left : '+='+v_width }, "slow");  
                page--;  
            }  
        }  
    }); 
    //向后 按钮  
 /*   $(".next_0121010").click(function(){    //绑定click事件  
         var content = $("#content_list_0121010");   
         var content_list = $("#content_list_0121010 .content");  
         var v_width = content.width();  
         var len = content.find("dl").length;  
         var page_count = Math.ceil(len / i) ;   //只要不是整数，就往大的方向取最小的整数  
         if( !content_list.is(":animated") ){    //判断"内容展示区域"是否正在处于动画  
              if( page == page_count ){  //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。  
                content_list.animate({ left : '0px'}, "slow"); //通过改变left值，跳转到第一个版面  
                page = 1;  
              }else{  
                content_list.animate({ left : '-='+v_width }, "slow");  //通过改变left值，达到每次换一个版面  
                page++;  
             }  
         }  
   });*/  
    //往前 按钮  

	}
	
	
function getUlWidth(){
	theHeight=window.screen.height;
	theWidth=window.screen.width;
	
	$("#mylist ul").css({
		"width":theWidth-386
	});
	$(".top_left").css({
		"width":theWidth-500
	});
	
	
}




	

/*  消息中心右边树  */
$(".closeTr").click(function(){
	if ($(this).parents(".iframe_tab_container").length>0) {
		var $message_left =$(this).parents(".iframe_tab_container").find("#message_left");
	    var $message_content =$(this).parents(".iframe_tab_container").find("#message_content");
	    var $leftTree =$(this).parents(".iframe_tab_container").find("#leftTree");
	    var $closeTree =$(this).parents(".iframe_tab_container").find("#closeTree");
	    var $closeTr =$(this).parents(".iframe_tab_container").find(".closeTr");
	    var visible= $leftTree.is(":visible");
	    var index_left=window.screen.width-296;
	    if(!visible){
	        
	        $leftTree.show("600");
	        $closeTree.css("right","260px");
	        $closeTr.css("background","url('"+staticPath+"css/images/rignt_click.png') no-repeat ")
	        $message_left.css("width",index_left);
	        $message_left.css("right","290px");
	        $message_content.css("width",index_left-200);
	        $("#message_content2").css("width",index_left);
	    
	    }else{
	        $leftTree.hide("600");
	        $closeTree.css("right","0");
	        $closeTr.css("background","url('"+staticPath+"css/images/rignt_click_1.png') no-repeat ")
	        $message_left.css("width",  window.screen.width-30);
	        $message_left.css({"right":"30px","left":"auto"});
	        $message_content.css("width",window.screen.width-230);
	        $("#message_content2").css("width",window.screen.width);
	     
	    }
	}else{
		closeTrNew();
	}
    
});

function closeTrNew(){

    var visible= $("#leftTree").is(":visible");
    var index_left=window.screen.width-296;
    if(!visible){
        
        $("#leftTree").show("600");
        $("#closeTree").css("right","260px");
        $(".closeTr").css("background","url('"+staticPath+"css/images/rignt_click.png') no-repeat ")
        $("#message_left").css("width",index_left);
        $("#message_left").css("right","290px");
        $("#message_content").css("width",index_left-200);
        $("#message_content2").css("width",index_left);
    
    }else{
        $("#leftTree").hide("600");
        $("#closeTree").css("right","0");
        $(".closeTr").css("background","url('"+staticPath+"css/images/rignt_click_1.png') no-repeat ")
        $("#message_left").css("width", window.screen.width-30);
        $("#message_left").css({"right":"30px","left":"auto"});
        $("#message_content").css("width",window.screen.width-230);
        $("#message_content2").css("width",window.screen.width);
     
    }
    // $("#jqGrid").datagrid('resize');
    // $(window.frames["testiframe"].document).find("#jqGriduser").show();
}

/* 首页右下角accordion效果 */
function accordion(id){
	
	$("#"+id).parents(".accordion").find(".Calendar_top").addClass('b-radius');
	$("#"+id+"").parent(".toollist").find("ul").slideDown();
	$("#"+id+"").removeClass('b-radius');
	$("#"+id).parents(".accordion").find(".b-radius").parent(".toollist").find("ul").slideUp();

	
	}


/* 登陆 */
function open_login(){
	$("#midLogin").show();
	$(".window-mask").show();
	
	
	}
	function back(){
	$("#midLogin").hide();
	$(".window-mask").hide();
	
	
	}	

function select_show(id){
      $("#"+id+"").parent().find(".selectul").hide();
	  $("#"+id+"").find("ul").show();
	
	}
function select_this_show(this_){
	
    $(this_).parent().find(".selectul").hide();
    $(this_).children(".selectul").show();
}
function select_this_hide(this_){
	 $(this_).parent().find(".selectul").hide();
	
}

function select_hide(id){
	$("#"+id+"").find("ul").hide();
	
}
	
function select_showfirst(id){
	
		$("#"+id+"").parent("#news_select").find("ul").slideDown();
	
	}
function datetime_show(id){
	
		$("#"+id+"").find(".datetime_show").show();
	}	
function datetime_hide(id){
	
		$("#"+id+"").find(".datetime_show").hide();
	}
function inform_close(id){
	
	$("#"+id+"").parent("#message_inform").hide();
	
}
function inform_this_close(this_){
	
	$(this_).parent("#message_inform").hide();
	
}
		
function selectall(id){
	var checkbox=$("#"+id+"").parents("#message_content").find("#message_detial ul li input");
	if(checkbox.attr("checked")){
	checkbox.removeAttr("checked");
	$("#"+id+"").removeAttr("checked");
	}
	else{
		checkbox.attr("checked","checked");
		$("#"+id+"").attr("checked","checked");
		};
	
	
	}
function selectallli(id){
	var checkbox=$("#"+id+"").parents("#message_content").find("#message_detial ul li input");

		checkbox.attr("checked","checked");
	
	$("#"+id+"").parent("ul").hide();
	
	
	}
	
function selectnot(id){

		var checkbox=$("#"+id+"").parents("#message_content").find("#message_detial ul li input");
	checkbox.each(function(){
		if($(this).prop("checked")){
			
			$(this).removeAttr("checked","checked");
			
			}
		else{
			
			$(this).attr("checked","checked");
			}
		});
		$("#"+id+"").parent("ul").hide();
		};
function app_show(id){
	
	$("#"+id+"").parent('dl').find(".out_div").show();
	};
	
function addinex(id){
	var text=$("#"+id);
	if(text.text()==" + 添加到首页"){
	
		text.text(" - 从首页移除");
		}
		else{
	
		text.text(" + 添加到首页");	
			}
	
	}
	
function move_app(id){
	var text=$("#"+id);
	
		
    text.parent(".appdetial_content").parent(".out_div").hide();
	
		}
function open_file(){
	$("#newfile").show();
	$(".window-mask").show();
}

function backfile(){
	
	$("#newfile").hide();
	$(".window-mask").hide();
	}


function hidemm(){
	
	$("#div_user_info").hide();
	
}
function showmm(){
	
	$("#div_user_info").show();
	
}
function showupdate(id){
		$("#"+id+"").parent('.top_information').parent('#baseinformation').find("#notupdate").hide();
		$("#"+id+"").parent('.top_information').parent('#baseinformation').find("#canupdate").show();
	}
function hideupdate(id){
		$("#"+id+"").parent('.bottom_button').parent('#canupdate').hide();
		$("#"+id+"").parent('.bottom_button').parent('#canupdate').parent('.otherinformation').find("#notupdate").show();
	}



/* 显示应用删除div */
function showdel_app() {
	alert("showdel_app");
	$("#del_applist").show();
	$("#app_list").hide();

}
/* 隐藏应用删除div */
function hidedel_app() {

	$("#del_applist").hide();
	$("#app_list").show();
}
/* 移除某个应用div */
function move_application(id) {
	$("#" + id + "").parent('dt').parent('dl').hide();
}
//敲回车换行

document.onkeydown = function(e)
{
var event = arguments[0]||window.event;
if(event.keyCode == 13)

	{event.keyCode=9;}
if(event.which == 13)

{event.which=9;}
};
$(function(){
$(".content dl dt img, .app_list dl dt img:first").css({"width":"50px","height":"50px"});
$('.title ul li').click(function () {
    var cur = $(this), tabul = cur.parent(), cont =cur.parents('.title').next(), i = tabul.children().index(cur);
    tabul.children().removeClass('on');
    cur.addClass('on');
    cont.children().addClass('hide');
    cont.children().eq(i).removeClass('hide');
	
});
$('.box-caption ul.news_link li').hover(function () {
    var cur = $(this), tabul = cur.parent(), cont =cur.parents('.box-caption').next(), i = tabul.children().index(cur);
    tabul.children().removeClass('on');
    cur.addClass('on');
    cont.children().addClass('hide');
    cont.children().eq(i).removeClass('hide');
	
});
$("#tab li").first().addClass("on").siblings().removeClass("on");
	$("#center > div").first().show().siblings().hide();
	$("#tab li").click(function(){
	var index = $("#tab li").index(this);
	$(this).addClass("on").siblings().removeClass("on");
$("#center > div").eq(index).show().siblings().hide();
});	
});

function showImg(B){var A=$(".ad").height();$(".slider").stop(true,false).animate({top:-A*B},1000);$(".num li").removeClass("on").eq(B).addClass("on")}function scrollimg(){var B=$(".num > li").length;var C=0;var A;$(".num li").mouseover(function(){C=$(".num li").index(this);showImg(C)}).eq(0).mouseover();$(".ad").hover(function(){clearInterval(A)},function(){A=setInterval(function(){showImg(C);C++;if(C==B){C=0}},3000)}).trigger("mouseleave")};