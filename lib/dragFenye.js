/*上下拉回弹效果*/
$("head").append('<style>[_scrollDom]{overflow:auto}.drag_box{overflow:auto}._nothing{position:relative;line-height:45px;text-align:center}._nothing em{display:none}._nothing:before{content:"没有更多了";display:inline-block}._upDrag{position:relative;line-height:45px;text-align:center}._upDrag em{display:none}._upDrag:before{content:"上拉加载更多";display:inline-block}._upDrag:after{content:"↑";display:inline-block;font-size:20px}._refresh{text-align:center;line-height:40px;overflow:hidden}._refresh i{font-size:20px}._refresh:before{display:inline-block;content:"下拉刷新"}._refresh_end{text-align:center}._loading{position:relative;line-height:45px;display:block;animation:1s run infinite;text-align:center;color:inherit}._loading:after{content:"正在加载..."}._loading em{display:inline-block;vertical-align:middle;width:20px;height:20px;position:relative;animation:1s loading infinite;margin-right:5px}._loading em:after{content:"";position:absolute;left:0;top:0;border:3px solid transparent;border-top-color:currentcolor;border-left-color:currentcolor;border-bottom-color:currentcolor;border-radius:50%;-webkit-animation:1s loader-05 linear infinite;animation:1s loader-05 linear infinite;width:100%;height:100%;display:inline-block;box-sizing:border-box}._loading em:before{position:absolute;left:0;top:0;content:"";width:20px;height:20px;display:inline-block;border:3px solid currentcolor;opacity:.2;border-radius:50%;width:100%;height:100%;box-sizing:border-box}@-webkit-keyframes loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>')
var json = {};
var _drag_tag = true;//是否可以拉动的标识
var startX =0;
var startY =0;
function touchstart_func() {
   
    var e = arguments[0];
    var touch = e.touches[0]; //获取第一个触点
    var x = touch.pageX; //页面触点X坐标
    var y = touch.pageY; //页面触点Y坐标
    //记录触点初始位置
    startX = x;
    startY = y;

}
function touchmove_func() {
  
    var e = arguments[0];
    var touch = e.touches[0]; //获取第一个触点
    var x = touch.pageX; //页面触点X坐标
    var y = touch.pageY; //页面触点Y坐标
    endX = x;
    endY = y;
    var abs = Math.abs(y - startY);
   
    if (abs > 0 && abs < 50 && (y - startY) < 0) {
   
        var scrollDom = $(e.target).parents("[_scrollDom]");
        this.style.cssText = "transition:1s cubic-bezier(.1, .57, .1, 1); -webkit-transition: 1s cubic-bezier(.1, .57, .1, 1); -webkit-transform: translate(0px, " + (y - startY) + "px) translateZ(0px);";
        e.preventDefault();
    } else {
        unbindDrag($(e.target));

    }
}
function touchend_func() {

    var e = arguments[0]; 
    this.style.cssText = "transition:300ms cubic-bezier(.1, .57, .1, 1); -webkit-transition: 300ms cubic-bezier(.1, .57, .1, 1);  -webkit-transform: translate(0px,0px) translateZ(0px);";
    
    var scrollDom = $(e.target).parents("[_scrollDom]");
  
    if (endY - startY > 30) {
        json.downDragFunc && json.downDragFunc(scrollDom.find("[_initdom]"));
    } else if (startY - endY > 30) {
        json.upDragFunc && json.upDragFunc(scrollDom.find("[_initdom]"));
        e.preventDefault();
    }

}
function bindDrag(dragDom) {
    var startX, startY, endX, endY;
    dragDom[0].addEventListener('touchstart', touchstart_func, false);
    dragDom[0].addEventListener('touchmove', touchmove_func, false);
    dragDom[0].addEventListener('touchend', touchend_func, false);
};
function unbindDrag(dragDom) {
    var startX, startY, endX, endY;
    dragDom[0].removeEventListener('touchstart', touchstart_func, false);
    dragDom[0].removeEventListener('touchmove', touchmove_func, false);
    dragDom[0].removeEventListener('touchend', touchend_func, false);
}

$.fn.extend({
    dragBounce: function (options) {

        json = $.extend({
            upDragFunc: undefined,//上拉加载回调
            downDragFunc: undefined,//下拉刷新回调
            upDragStart: undefined,
            downDragStart: undefined,
            dragBlock: true,//设定模式，true是每次都是拉动整体触发分页，false是拉动底部"加载更多"的文字区域触发分页
        }, options);
  
        var container = $(this)[0];
        var last_child = $(container).find(">*:last-child");
        if (json.dragBlock) {
            bindDrag($(container));
            var scrollDom = $(this).parents("[_scrollDom]").eq(0);
            scrollDom.scroll(function () {
               
                if ($(container).attr("_drag_tag") == "true" && $(container).offset().top - $(this).offset().top + $(container).height() <= $(this)[0].offsetHeight+2) {
                    
                    bindDrag($(container));

                } else {
                    unbindDrag($(container));
                }


            });


        } else {
            bindDrag(last_child);

        };



        
    }
});
/*上拉刷新，下拉加载*/
//json参数{data:~~,ajaxFunc:~~}
$.fn.extend({

    dragFenye: function (json) {
   
        $(this).attr("_initDom", "");//增加标识
        
        var _addParam = this.dragFenye.prototype.extraParam || {}//用于拓展每个项目需要传的ajax的参数值
         //当data为数组，结构为[{name:xxx,value:xxx},{name:xxx,value:xxx}]时的处理
         if(json.data instanceof Array)
         {
         
         	var item_obj={};
         	json.data.forEach(function(item,index,ary){
         		item_obj[item.name]=item.value
         	});
         	json.data=item_obj;

         }
        
        var param = $.extend({
            url: "",
            data: {},
            rows_string: "",//这里为字符串,用以拼接ajax回调返回参数中的VUE刷新变量所需的数组，如res+".data",".data"即为参数
            updateVue: undefined,//这里应为Vue变量字符串，用eval解析为真实的Vue变量并赋值
            method: "post",
            dataType: "json",
            async: false,
            disableUp: false,
            disableDown: false,
            ajax_success: undefined,//一定要返回新的数据data,用于每次请求后有二级请求的
            page_txt: "page",//表示当前页数的属性字符串
            rows_txt: "rows",//表示当前页请求数据条数的属性字符串
            dragBlock: true,//设定模式，true是每次都是拉动整体触发分页，false是拉动底部"加载更多"的文字区域触发分页
            scrollDom:"body",//设置相对滚动的区域
            end_verification: 0,
            start_verification:0,
            pageRows:5//当data为数组，结构为[{name:xxx,value:xxx},{name:xxx,value:xxx}]时，单独传一个每页条数的
            
        }, json);
       
        var scrollDom = $(this).parents(param.scrollDom).eq(0);
        scrollDom.attr("_scrollDom","");//关联滚动区域
        param.per_ajaxNum = param.data[param.rows_txt];//增加保存每次请求条数的初始数据
       
        var obj = {};
        obj[param.page_txt] = param.data["page"];
        obj[param.rows_txt] = param.data["rows"];
        param.data = $.extend(obj, param.data);
        //this.dragFenye.prototype.ajaxParam = param;
        if ($(this).parent(".drag_box").length == 0) {
            $(this).wrap("<div class='drag_box'></div>");
            var drag_dom = $(this).parent();
            

        } else {
            var drag_dom = $(this).parent();
            drag_dom.find(">div:first-child").remove();
            drag_dom.find(">div:last-child").remove();
        }

        drag_dom.prepend("<div></div>");
        drag_dom.append("<div><em></em></div>");
        drag_dom.attr("_drag_tag",true);//设置当前dom区域为可拖动的
        var drag_disabled = true;
        //清空之前初始化数据
        

        var this_dom = $(this);
        this_dom.data("ajaxParam", param);
        var first_fenye=true;//首次进来
        function get_list(obj,dom) {
           
            if (obj && dom) {
                var json = obj;
                var drag_dom = dom;
            } else {
                return;
            }
       
            $.ajax($.extend( {
                url: json.url,
                data: json.data,
                dataType: json.dataType,
                method: json.method,
                async: json.async,
                success: function (res) {
                	 if (!res) return;
                	 if(param.data.page<2)
                	 {
                	 	eval(param.updateVue + "=[]");
                	 }
                    
                    if (typeof json.updateVue == "string") {
                        var add_data = eval("res" + json.rows_string);
                        
                        var vue_data = eval(json.updateVue);
                        if (typeof json.ajax_success == "function") {
                            var res = json.ajax_success(res);
                            var ajax_dataNum = add_data.length;
                        } else {
                            var ajax_dataNum = add_data.length;
                        };
                        var vue_dataNum = vue_data.length;
                        if (ajax_dataNum == json.per_ajaxNum) {
                     
                            while (add_data.length)
                            {
                                vue_data.push(add_data.shift());
                            }
                            var vue_app = eval(json.updateVue.split(".")[0]);//渲染新增
                            vue_app.$nextTick(function () {
                                drag_disabled = false;
                                drag_dom.find(">*:last-child").attr("class", "_upDrag");
                               
                                if (drag_dom.offset().top - scrollDom.offset().top + drag_dom.height()> scrollDom[0].offsetHeight) {
                                    drag_dom[0].removeEventListener('touchstart', touchstart_func, false);
                                    drag_dom[0].removeEventListener('touchmove', touchmove_func, false);
                                    drag_dom[0].removeEventListener('touchend', touchend_func, false);

                                }
                               // drag_dom[0].style.cssText = "transition:300ms cubic-bezier(.1, .57, .1, 1); -webkit-transition: 300ms cubic-bezier(.1, .57, .1, 1);  -webkit-transform: translate(0px,0px) translateZ(0px);";
                            })


                        } else if (0 < ajax_dataNum && ajax_dataNum < json.per_ajaxNum) {
                       
                     
                            while (add_data.length) {
                                vue_data.push(add_data.shift());
                            }
                            var vue_app = eval(json.updateVue.split(".")[0]);//渲染新增
                            vue_app.$nextTick(function () {
                               
                                drag_dom.find(">*:last-child").attr("class", "_nothing");
                                drag_dom[0].removeEventListener('touchstart', touchstart_func, false);
                                drag_dom[0].removeEventListener('touchmove', touchmove_func, false);
                                drag_dom[0].removeEventListener('touchend', touchend_func, false);
                               
                            });
                           // drag_dom[0].style.cssText = "transition:300ms cubic-bezier(.1, .57, .1, 1); -webkit-transition: 300ms cubic-bezier(.1, .57, .1, 1);  -webkit-transform: translate(0px,0px) translateZ(0px);";
                            drag_dom.attr("_drag_tag",false);
                            drag_disabled = false;
                     
                        } else if (ajax_dataNum == 0 && vue_dataNum != 0) {
                        	
                        
                            drag_dom.find(">*:last-child").attr("class", "_nothing");
                            drag_dom[0].removeEventListener('touchstart', touchstart_func, false);
                            drag_dom[0].removeEventListener('touchmove', touchmove_func, false);
                            drag_dom[0].removeEventListener('touchend', touchend_func, false);
                            //drag_dom[0].style.cssText = "transition:300ms cubic-bezier(.1, .57, .1, 1); -webkit-transition: 300ms cubic-bezier(.1, .57, .1, 1);  -webkit-transform: translate(0px,0px) translateZ(0px);";
                            drag_dom.attr("_drag_tag", false);
                            drag_disabled = false;
                        } else if (vue_dataNum==0) {
                            drag_dom.find(">*:last-child").hide();
                            drag_dom[0].removeEventListener('touchstart', touchstart_func, false);
                            drag_dom[0].removeEventListener('touchmove', touchmove_func, false);
                            drag_dom[0].removeEventListener('touchend', touchend_func, false);
                            //drag_dom[0].style.cssText = "transition:300ms cubic-bezier(.1, .57, .1, 1); -webkit-transition: 300ms cubic-bezier(.1, .57, .1, 1);  -webkit-transform: translate(0px,0px) translateZ(0px);";
                            drag_dom.attr("_drag_tag", false);
                            drag_disabled = false;

                        }

                         
                    }

                }
               
            }, _addParam));

           
        };
     
        get_list(param, drag_dom);
       

        var pages = param.data[param.page_txt];
        drag_dom.dragBounce({
            upDragFunc: function (this_dom) {
             
                var param = this_dom.data("ajaxParam");
                if (!drag_disabled) {
                    param.data[param.page_txt]++;
                    this_dom.siblings("*:last-child").attr("class", "_loading");
                    drag_disabled = true;
                    setTimeout(function () { get_list(param, this_dom.parents(".drag_box").eq(0)); }, 1000)

                }
            },
            dragBlock: param.dragBlock

        })


    }
    ,
    fenye_addParam: function (json)//用于拓展分页ajax每次请求增加的一些默认参数
    {
        this.dragFenye.prototype.extraParam = json;
    },
    fenye_update: function (json) {
        
        var param = $(this).data("ajaxParam");
        param.data[param.rows_txt] = param.per_ajaxNum;
        param.data[param.page_txt] = 1;
        $(this).parents(param.scrollDom).scrollTop(0);
        if (json) {
            $.extend(param, json)
        };
        this.dragFenye(param);
    
    }

})

//$(".list").fenye_addParam({xxx:aaa,yyy:bbb})//每个项目封装的ajax往往添加了很多特殊的参数需要拓展进来		

//初始化效果例如
//	$(".list").dragFenye({
//  url:~~~,
// 	data:{page:1,rows:10},
// 	rows_string:".data",//获取ajax返回数据中所需数组信息的字符串
// 	updateVue:"page_data.list",//VUE变量赋值的字符串
//})



























