    
    $('body').on('click', '.select-menu', function (e) {
		//console.log($(this).find('.select-menu-ul').css("opacity"))
		//console.log($(this).find('.select-menu-ul'))
        if ($(this).find('.select-menu-ul').css("opacity") == '0') {
            app.s_index = -1
            var that = $(this);
            that.find('li').removeClass('s_choice');
			document.onkeydown = function (event) {
				var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 40) { //下
                    e.preventDefault();
                    console.log('下', that.find('li').length, app.s_index)
                    var len = that.find('li').length;
                    if (app.s_index < len-1) {
                        app.s_index++;
                        that.find('li').removeClass('s_choice');
                        that.find('li').eq(app.s_index).addClass('s_choice');
                    }
                    
				}
                if (e && e.keyCode == 38) { // 上
                    e.preventDefault();
                    console.log('上')
                    var len = that.find('li').length;
                    if (app.s_index > 0) {
                        app.s_index--;
                        that.find('li').removeClass('s_choice');
                        that.find('li').eq(app.s_index).addClass('s_choice');
                    } 
                    
                }
                if (e && e.keyCode == 13) { // 确认
                    console.log('确认')
                    var len = that.find('li').length;
                    that.find('li').eq(app.s_index).click();

                }
			};
		}
	})

	

    //		$(function(){
    //		初始化 下拉列表
    //		selectInit();
    //	})
    $('body').on('click','.select-menu',function (e) {
        e.stopPropagation()
        //var h = $(this).children('.select-menu-ul').height();
        //console.log(h)
            if ($(this).children('.select-menu-ul').css("display") === "none") {
                $(".select-menu").children('.select-menu-ul').animate({
                    opacity: "0"
                },
                    200).hide();
                //元素高度
                var h = $(this).children('.select-menu-ul').height();
                
                //距离顶部距离
                var top = $(this).offset().top;
                //文档高度
                var dom_h = $('body > div').height();
                var c = dom_h - top - 100;
                //console.log(h)
                setInterval(function () {
                    if (c < h) {
                        $(this).children('.select-menu-ul').css({ 'top': -h });
                        $(".select-menu-name").focus(function(e) {
                            //console.log(e)
                            var h = $(this).children('.select-menu-ul').height();
                            $(this).parent().children('.select-menu-ul').css({ 'top': -h + 40 });
                        });
                    };
                }, 1000)
                clearInterval()
                $(this).children('.select-menu-ul').animate({
                    opacity: "1"
                },
                    200).show();
            } else {
                $(this).children('.select-menu-ul').animate({
                    opacity: "0"
                },
                    200).hide();
            }
        });

    $("body").on('mouseenter', ".select-menu li", function (e) {
        $(this).prop("title", $(this).text());
    });
    $("body").on('mouseout', ".select-menu li", function (e) {
        $(this).prop("title", "");
    });

    $('body').on('click', '.select-menu>.select-menu-ul li', function (e) {
        //console.log('page.js；.select-menu>.select-menu-ul li');
        e.stopPropagation();
        $(this).addClass("select-this").siblings().removeClass("select-this");
        
        var name = $(this).html();
        if ($(this).attr('data-name') != undefined) {
            name = $(this).attr('data-name');
        }
        //debugger;
        $(this).parents(".select-menu").find('.select-menu-name').val(name);
        $(this).parents(".select-menu").find('.select-menu-name').html(name);
        if ($(this).parents(".select-menu").find('.select-value').length == 1) {
            if ($(this).attr('data-id') != undefined) {
                $($(this).parents(".select-menu").find('.select-value')).val($(this).attr('data-id'));
            } else {
                $($(this).parents(".select-menu").find('.select-value')).val( $(this).html());
            }
        }
        $(this).parent().animate({
            opacity: "0"
        }, 200).hide();
    });

    $("body").on("click",
        function (e) {
            e.stopPropagation();
            $(".select-menu").children('.select-menu-ul').animate({
                opacity: "0"
            },
                200).hide();
        });