$.fn.extend({
    fenye: function (json) {
        json = $.extend({
            fenye: "fenye",
            first_page: ".first_page",//属性加"."表示加类，不加表示text文本内容
            prev_btn: ".prev_btn",//属性加"."表示加类，不加表示text文本内容
            next_btn: ".next_btn",//属性加"."表示加类，不加表示text文本内容
            last_page: ".last_page",//属性加"."表示加类，不加表示text文本内容
            go_btn: ".go_bth",//属性加"."表示加类，不加表示text文本内容
            go_page: ".go_page",
            leftNum: 3,//左边显示数量
            rightNum: 3,//右边显示数量
            middleNum: 3,//中间数量
            total: 100,//数据总条数
            pages_num:undefined,//总页数，如果有设置，则不用条数计算页数
            pageSize: 10,//每页的显示条数
            start_page: 1,//开始页码
            activeClass: "curr",
            callback: function (ind,pages,size) { }
        }, json);
        $(this).empty();
        if (json.pages_num>=0) {
            if (json.pages_num > 0) {
                var total_pages = json.pages_num

            } else {
                return false;

            }

        }else {
            var total_pages = Math.ceil(json.total / json.pageSize);
        }

        //初创节点
        $(this).addClass(json.fenye);
        $(this).append("<span first_page class='" + (json.first_page.indexOf(".") == 0 ? json.first_page.substr(1) : "") + "'></span>")
        $(this).find("[first_page]").text(json.first_page.indexOf(".") < 0 ? json.first_page : "首页");
        $(this).append("<span prev_btn class='" + (json.prev_btn.indexOf(".") == 0 ? json.prev_btn.substr(1) : "") + "'></span>")
        $(this).find("[prev_btn]").text(json.prev_btn.indexOf(".") < 0 ? json.prev_btn : "上一页");
        $(this).append("<div left_pages class='left_pages'></div>");
        $(this).append("<div left_ellipsis class='left_ellipsis'>...</div>");
        $(this).append("<div middle_pages class='middle_pages'></div>")
        $(this).append("<div right_ellipsis class='right_ellipsis'>...</div>");
        $(this).append("<div right_pages class='right_pages'></div>");
        $(this).append("<span next_btn class='" + (json.next_btn.indexOf(".") == 0 ? json.next_btn.substr(1) : "") + "'></span>")
        $(this).find("[next_btn]").text(json.next_btn.indexOf(".") < 0 ? json.next_btn : "下一页");
        $(this).append("<span last_page class='" + (json.last_page.indexOf(".") == 0 ? json.last_page.substr(1) : "") + "'></span>")
        $(this).find("[last_page]").text(json.last_page.indexOf(".") < 0 ? json.last_page : "末页");
        $(this).append("<input type='text' go_page value='1'/>");
        $(this).find("[go_page]").addClass(json.go_page.substr(1));
        $(this).append("<button type='button' go_btn class='" + (json.go_btn.indexOf(".") == 0 ? json.go_btn.substr(1) : "") + "'></button>");
        $(this).find("[go_btn]").text(json.go_btn.indexOf(".") < 0 ? json.go_btn : "跳转");

        var fenye = $(this);
        var prev_btn = $(this).find("[prev_btn]");
        var next_btn = $(this).find("[next_btn]");
        var first_page = $(this).find("[first_page]");
        var last_page = $(this).find("[last_page]");
        var left_boxs = $(this).find("[left_pages]");
        var middle_boxs = $(this).find("[middle_pages]");
        var right_boxs = $(this).find("[right_pages]");
        var left_ellipsis = $(this).find("[left_ellipsis]");
        var right_ellipsis = $(this).find("[right_ellipsis]");
        var go_btn = $(this).find("[go_btn]");
        var go_page = $(this).find("[go_page]");
        

       
        l_num = json.leftNum <= total_pages ? json.leftNum : total_pages;
        while (l_num>0) {

            if (l_num == json.start_page) {
                left_boxs.prepend("<a class='" + json.activeClass + "'>" + l_num + "</a>");
            } else {
                left_boxs.prepend("<a>" + l_num + "</a>");
            }
            l_num--;
        }
        r_num = json.leftNum + json.rightNum <= total_pages ? json.rightNum : total_pages - json.leftNum;
        while (r_num>0) {

            if ((total_pages - r_num + 1) == json.start_page) {
                right_boxs.append("<a class='" + json.activeClass + "'>" + (total_pages - r_num + 1) + "</a>");
            } else {
                right_boxs.append("<a>" + (total_pages - r_num + 1) + "</a>");
            }
            r_num--;
        }
        var min = left_boxs.find("a:last-child").text() - 0;
        var max = right_boxs.find("a").length ? right_boxs.find("a:first-child").text() - 0 : total_pages - 0;

      
        /*前后省略号处理*/
         if(max>min+1)
         {
         	left_ellipsis.addClass("show");
         }
         function set_ellipsis() {
            if (middle_boxs.find("a").length) {
                if (middle_boxs.find("a:first-child").text() - min > 1) {
                    left_ellipsis.addClass("show");

                } else {

                    left_ellipsis.removeClass("show");
                }
                if (max - middle_boxs.find("a:last-child").text() > 1) {
                    right_ellipsis.addClass("show");
                } else {

                    right_ellipsis.removeClass("show");
                }

            } 

        };
 
        /*绑定事件*/
        fenye.on("click", "a", function () {
            fenye.find("a").removeClass(json.activeClass);
            $(this).addClass(json.activeClass);
            var curr=$(this).text();
            if(curr<=min||curr>=max)
            {
            	middle_boxs.empty();
            }
            json.callback && json.callback(curr,total_pages, json.pageSize)

        })
        fenye.on("click","span[first_page]",function(){
        	fenye.find("a").removeClass(json.activeClass);
            fenye.find("a").eq(0).addClass(json.activeClass);
            var curr=fenye.find("a."+json.activeClass).text();
            if(curr<=min||curr>=max)
            {
            	middle_boxs.empty();
            }
            set_ellipsis();
            json.callback && json.callback(curr,total_pages, json.pageSize)
        })
        fenye.on("click","span[last_page]",function(){
        	
        	fenye.find("a").removeClass(json.activeClass);
            fenye.find("a:contains(" + total_pages + ")").addClass(json.activeClass);
	        var curr=fenye.find("a."+json.activeClass).text();
            if(curr<=min||curr>=max)
            {
            	middle_boxs.empty();
            }
            set_ellipsis();
            json.callback && json.callback(curr,total_pages, json.pageSize)
	
        })

        fenye.on("click","span[next_btn]",function(){
        	var ind = fenye.find("a").index(fenye.find("a." + json.activeClass));
            var curr = fenye.find("a." + json.activeClass).text() - 0 + 1;

            if (fenye.find("a").eq(ind + 1).length) {
                if (curr > min && curr < max) {
                    if (middle_boxs.find("a:contains(" + curr + "):first").length == 0) {
                        mid_num = min + (json.middleNum - 0) < max ? json.middleNum : max - curr;
                        middle_boxs.empty();
                        var page = curr;
                        while (mid_num > 0) {
                            if (page < max) {
                                middle_boxs.append("<a>" + page + "</a>");
                                page++;


                            } else {
                                break;
                            }

                            mid_num--;
                        }

                    }

                }
                set_ellipsis();
                fenye.find("a").removeClass(json.activeClass);
                fenye.find("a:contains(" + curr + "):first").addClass(json.activeClass);
               
                var curr=fenye.find("a."+json.activeClass).text();
	            if(curr<=min||curr>=max)
	            {
	            	middle_boxs.empty();
	            }
	             json.callback && json.callback(curr,total_pages, json.pageSize);
	           

            };

        	
        	
        })
        fenye.on("click","span[prev_btn]",function(){
        	
        	var ind = fenye.find("a").index(fenye.find("a." + json.activeClass));
            var curr = fenye.find("a." + json.activeClass).text() - 1;
           
            if (ind > 0 && fenye.find("a").eq(ind - 1).length) {
                if (curr > min && curr < max) {
                    if (middle_boxs.find("a:contains(" + curr + "):first").length == 0) {
                        mid_num = min + (json.middleNum - 0) < max ? json.middleNum : max - curr;
                        middle_boxs.empty();
                        var page = curr;
                        while (mid_num > 0) {
                            if (page < max) {
                                middle_boxs.prepend("<a>" + page + "</a>");
                                page--;

                            } else {
                                break;
                            }
                            mid_num--;
                        }


                    }
                }
                set_ellipsis();
                fenye.find("a").removeClass(json.activeClass);
                fenye.find("a:contains(" + curr + "):first").addClass(json.activeClass);
                json.callback && json.callback(curr,total_pages, json.pageSize);
                if(curr<=min||curr>=max)
	            {
	            	middle_boxs.empty();
	            }
	             json.callback && json.callback(curr,total_pages, json.pageSize);


            };
        	
        	
        	
        })
         fenye.on("click","[go_btn]",function(){
         	
         	    if (go_page.val() <= total_pages && go_page.val() > 0) {
                var curr = go_page.val();
                if (curr > min && curr < max) {

                    if (middle_boxs.find("a:contains(" + curr + "):first").length == 0) {
                        mid_num = min + (json.middleNum - 0) < max ? json.middleNum : max - curr;
                        middle_boxs.empty();
                        var page = curr;
                        while (mid_num > 0) {
                            if (page < max) {
                                middle_boxs.append("<a>" + page + "</a>");
                                page++;

                            } else {
                                break;
                            }
                            mid_num--;
                        }


                    }
                }
                set_ellipsis();
                fenye.find("a").removeClass(json.activeClass);
                fenye.find("a:contains(" + curr + "):first").addClass(json.activeClass);
                 json.callback && json.callback(curr,total_pages, json.pageSize)

            } else {
                go_alert2("超出页数范围，请重新输入！")
            }

         })

    }

})

/*分页版ajax 2017-6-16*/
//json参数
//param=>url: ajax 请求路径
//param=>data: ajax 请求data
//param=>callback: ajax 请求回调,主要用于更新VUE数据，刷新页面
//param=>pages_data: string字符串 ，用以拼接获取ajax res返回数据格式获取总页数的格式，比如.data.totalpages拼接为res.data.totalpages
//param=>fenye_style: json 这里用于对分页初始化
//param=>currPage_name: "p" 设置ajax请求data中表示当前页码的属性名 ，默认为"p"
 //$(".fenye").fenye_ajax({})举例


    $.fn.extend({
        fenye_ajax: function (json) {
            //数据初始化
            json = $.extend({
                url: "",
                data: {},
                pages_data: "",
                currPage_name: "page",//表示当前页的参数名
                callback: undefined,
                fenye_style: {}
            }, json)

            var doms = $(this);
            var func = json.callback;
            $.ajax({
                type: "POST",
                url: json.url,
                data: json.data,
                dataType: "json",
                success: function (res) {
                    var pages = eval("res" + json.pages_data);
                    typeof func == "function" && func(res);
                    var p_name = json["currPage_name"];
                    doms.fenye($.extend({
                        pages_num: pages,
                        callback: function (ind, pages, size) {
                            var obj = {};
                            obj[p_name] = ind;
                            
                            $.ajax({
                                type: "POST",
                                url: json.url,
                                data: $.extend(json.data, obj),
                                dataType: "json",
                                success: function (res) {
                                    typeof func == "function" && func(res);
                                }

                            })

                        }
                    }, json.fenye_style))
                }
            })

        }


    })






