
//*表单前端验证JS 2017-2-11 qqmao1984*/
//只验证设置了required 属性的表单元素,设置了use-val属性则可以提交默认值
//动态添加的表单依然有效，通过计时器随时自动对新增的form 绑定事件
//表单需要匹配的正则模式，可以加match=正则，可以设置默认几种自定义的模式，模式名字随便起,match="yourname"即可。

        //生成样式
        $("head").append("<style>[required][waiting-change].error{ background-color: #f93; color:#fff}select[required][waiting-change].error{color:red; background-color: initial;}</style>")

        //自定义匹配正则模式
        var match_mode = {
            "mail":/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            "tel": /^0?1[3|4|5|8][0-9]\d{8}$/,
            "number": /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/,
        };
        function form_check(forms,event) {
            
          
     
                var form_parent = forms||$(event.target).parents("form");
                console.log(form_parent);
                return false;
            
                 form_parent.find("[required]").attr("waiting-change", "").change(function () {
                    //删除之前的错误提示样式
                    $(this).removeClass("error");
                    //如果不等于默认值
                    if ($(this)[0].nodeName.toLocaleLowerCase() == "select") {

                        if ($(this).val() == $(this).find("option:first").val()) {
                            $(this).attr("waiting-change", "");
                            return;
                        }
                        else {
                            this.removeAttribute("waiting-change");

                        }

                    }
                    if ($(this).val() != this.defaultValue) {

                        //不等于默认值，如果设置匹配正则
                        if ($(this).attr("match") != undefined) {
                            //如果匹配模式有自定义
                            if (match_mode[$(this).attr("match")] != undefined) {
                                var Reg = match_mode[$(this).attr("match")];

                                //如果匹配模式没有自定义
                            } else {

                                eval("var Reg=" + $(this).attr("match"));
                            }

                            //测试值是否配置模式
                            if (Reg.test($(this).val())) {

                                this.removeAttribute("waiting-change");


                            } else {

                                $(this).attr("waiting-change", "");

                            };

                            //不等于默认值，如果没有设置匹配正则	
                        } else {

                            this.removeAttribute("waiting-change")

                        }
                        //判断二次输入密码是否一致
                        if ($(this).prop("type") == "password") {

                            var ind = form_parent.find("[required]").index($(this));

                            if (form_parent.find("[required]").eq(ind - 1).prop("type") == "password" && form_parent.find("[required]").eq(ind - 1).val() != "") {

                                if ($(this).val() != form_parent.find("[required]").eq(ind - 1).val()) {
                                    $(this).attr("waiting-change", "");
                                    go_alert2("二次密码输入不一致")

                                } else {
                                    this.removeAttribute("waiting-change");
                                    form_parent.find("[required]").eq(ind - 1)[0].removeAttribute("waiting-change");

                                }

                            } else if (form_parent.find("[required]").eq(ind + 1).prop("type") == "password" && form_parent.find("[required]").eq(ind + 1).val() != "") {

                                if ($(this).val() != form_parent.find("[required]").eq(ind + 1).val()) {
                                    $(this).attr("waiting-change", "");
                                    go_alert2("二次密码输入不一致")


                                } else {
                                    this.removeAttribute("waiting-change");
                                    form_parent.find("[required]").eq(ind + 1)[0].removeAttribute("waiting-change");

                                }

                            }
                        }

                        //和默认值一样
                    } else {

                        $(this).attr("waiting-change", "");

                    };


                });
                //提交前验证,禁止错误提交
                $(this).find("[type=submit],[type=image]").click(function (e) {
                    var form_dom = $(this).parents("form");
                    if (form_dom.find("[required][waiting-change]").not("[use-val]").length) {

                        var check_selects = form_dom.find("select[required][waiting-change]").not("[use-val]");
                        if (check_selects.length) {

                            //针对select下拉改变值不触发change ,再判断是不是初始值，如果都改变了就提交表单
                            var tag = true;
                            check_selects.each(function () {

                                if ($(this).val() == $(this).find("option:first").val()) {

                                    tag = false;
                                }

                            });

                            if (tag) {
                                if (form_dom.find("[required][waiting-change]:not('select')").length) {

                                    form_dom.find("[required][waiting-change]:not('select')").addClass("error");
                                    e.preventDefault();
                                } else {

                                    form_dom.submit();
                                }

                            } else {
                                form_dom.find("[required][waiting-change]").not("[use-val]").addClass("error");
                                e.preventDefault();

                            }


                        } else {
                            form_dom.find("[required][waiting-change]").not("[use-val]").addClass("error");
                            e.preventDefault()

                        }

                    }
                    else {

                        form_dom.submit();
                        e.preventDefault()

                    }

                })

      

        };




  


