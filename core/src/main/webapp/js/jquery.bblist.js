jQuery.fn.showbbList = function (targetId) {
	debugger;
        var _seft = this;
        var targetId = $(targetId);
        $(this).on('click',function () {
            var A_top = $(this).offset().top + $(this).outerHeight(true)-8;  
            var A_left = $(this).offset().left;
            targetId.show().css({ "position": "absolute", "top": A_top + "px", "left": A_left + "px" });
        });

        targetId.find("#selectItemClose").click(function () {
            targetId.hide();
        });
        return this;
    };