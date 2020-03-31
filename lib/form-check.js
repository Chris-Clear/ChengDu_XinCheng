
//*表单前端验证JS 2018-5-25 qqmao1984*/
//只验证设置了required 属性的表单元素,设置了use-default属性则可以提交默认值不做验证
//动态添加的表单依然有效，通过计时器随时自动对新增的form 绑定事件
//表单需要匹配的正则模式，可以加match=正则，可以设置默认几种自定义的模式，模式名字随便起,match="yourname"即可。
//手机验证码按钮，用code_for="#tel"的方式与手机号输入框关联


    //生成样式
    $("head").append("<style>input[required][waiting-change].error,textarea[required][waiting-change].error,[select_ul][required][waiting-change].error,[select_more][required][waiting-change].error,select[required][waiting-change].error{ background-color: rgba(244, 84, 84, 0.11);}[required][waiting-change]._checkbox.error{color:red}</style>")

    //自定义匹配正则模式

	$.fn.extend({
		_bindCheck:function(doms,check_rule,that){
			doms.each(function(){
	                	/***********处理select_ul,select_more模拟下拉情况*************/
	                   if($(this)[0].hasAttribute("select_ul")||$(this)[0].hasAttribute("select_more")){
	                	    var default_val=$(this).find("input[type=radio]").val()
	                	   $(this).find("input[type=radio]").change(function(){
	                	   	   if($(this).val()!=default_val)
	                	   	   {
	                	   	         $(this).parents("[required]")[0].removeAttribute("waiting-change")  
	                	   	   }else{
	                	   	   	     $(this).parents("[required]").attr("waiting-change","")
	                	   	   	
	                	   	   }
	                	   	
	                	   })
	                	
	                	
	                	/******处理多选框情况*******/
	                   }else if($(this).find("input[type=checkbox]").length){
	                	   
	                	    $(this).find("input[type=checkbox]").change(function(){
	                	    	
	                	    	 var parent=$(this).parents('[required]');
	                	    	 if(parent.find("input:checked").length)
	                	    	 {
	                	    	   
	                	    	 	parent[0].removeAttribute("waiting-change")
	                	    	 }else{
	                	    	 	
	                	    	 	parent.attr("waiting-change","");	
	                	    	 }
	
	                	    })
	                		
	                		
	                	}else{
	                		            	
			                $(this).change(function () {
			                  
			                    //删除之前的错误提示样式
			                    $(this).removeClass("error");
			                    //如果不等于默认值
			                    if ($(this)[0].nodeName.toLocaleLowerCase() == "select") {
			
			                       
			                        if ($(this).val() == ($(this).find("option:first").val()||$(this).find("option:first").text())) {
			                            $(this).attr("waiting-change", "");
			                            return;
			                        }
			                        else {
			                     
			                            this.removeAttribute("waiting-change");
			
			                        }
			
			                    }else if($(this).val() != this.defaultValue) {
			
			                        //不等于默认值，如果设置匹配正则
			                        if ($(this).attr("match") != undefined) {
			                            //如果匹配模式有自定义
			                            if (check_rule[$(this).attr("match")] != undefined) {
			                                var Reg = check_rule[$(this).attr("match")];
			                              
			                                //如果匹配模式没有自定义
			                            } else {
			
			                                eval("Reg=" + $(this).attr("match"));
			                            }
			                         
			
			                            //测试值是否配置模式
			                            if (Reg.test($(this).val())) {
			                                this.removeAttribute("waiting-change");
		
			                            } else {
			
			                                $(this).attr("waiting-change", "").addClass("error");
			                                $(this).attr("alert")&&go_alert2($(this).attr("alert"))
			
			                            };
			
			                            //不等于默认值，如果没有设置匹配正则	
			                        } else {
			
			                            this.removeAttribute("waiting-change")
			
			                        }
			                         
			                        //判断二次输入密码是否一致
			                        if ($(this).attr("type") == "password") {
			                          
			                            var ind = that.find("[type=password][required]").index($(this));
			   
			                            if ((ind%2!=0)&& that.find("[type=password][required]").eq(ind - 1).val()) {
			
			                                if ($(this).val() != that.find("[type=password][required]").eq(ind - 1).val()) {
			                                    $(this).attr("waiting-change", "").addClass("error");
			                                    go_alert2("二次密码输入不一致")
			
			                                } else {
			                                    this.removeAttribute("waiting-change");
			                                    that.find("[type=password][required]").eq(ind).removeClass("error")
			                                    that.find("[type=password][required]").eq(ind - 1).removeClass("error")[0].removeAttribute("waiting-change");
			
			                                }
			
			                            } else if ((ind%2==0)&& that.find("[type=password][required]").eq(ind + 1).val()) {
			
			                                if ($(this).val() != that.find("[type=password][required]").eq(ind + 1).val()) {
			                                    $(this).attr("waiting-change", "").addClass("error");
			                                    go_alert2("二次密码输入不一致")
			
			
			                                } else {
			                                    this.removeAttribute("waiting-change");
			                                    that.find("[type=password][required]").eq(ind).removeClass("error")
			                                    that.find("[type=password][required]").eq(ind + 1).removeClass("error")[0].removeAttribute("waiting-change");
			
			                                }
			
			                            }
			                        }
			
			                        //和默认值一样
			                    } else {
			
			                        $(this).attr("waiting-change", "");
			
			                    };

			                });

	                	}
				
				
				
				
			})
			
			
		},
		check_rule:
		{
	        "mail": /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
	        "tel": /^0?1[3|4|5|8][0-9]\d{8}$/,
	        "number": /^[0-9]+$/,
	    }
		,
		form_check:function(json){
			var check_rule=this.check_rule;
			var _that=this;
		    $.extend(check_rule,json.check_rule)
            var param_obj=$.extend(json,{check_rule:check_rule})
			var page_forms = $(this).not('[binded]');
	            page_forms.each(function () {
	                var that = $(this);
	                that.attr("binded", "");
	                /**************处理验证码与手机号关联**************/
	                that.find("[code_for]").click(function(){
	                	var tel_dom=$($(this).attr("code_for"));
	                	if(tel_dom.attr('match')&&check_rule[tel_dom.attr('match')])
	                	{
	                		if(check_rule[tel_dom.attr('match')].test(tel_dom.val()))
	                		{
	                			json.codeFunc&&json.codeFunc(tel_dom.val(),$(this))
	                			
	                		}else{
	                			tel_dom.attr("alert")&&go_alert2(tel_dom.attr("alert"))
	                			
	                			
	                		}
	                		
	                	}else if(tel_dom.attr('match')){
	                		if(eval(tel_dom.attr('match')).test(tel_dom.val()))
	                		{
	                			json.codeFunc&&json.codeFunc(tel_dom.val(),$(this))
	                			
	                		}else{
	                			go_alert2(tel_dom.attr("alert"))
	                			
	                			
	                		}
	                		
	                		
	                	}else if(!tel_dom.val()){
	                		go_alert2("手机号不能为空")
	
	                	}
	                
	                
	                
	                })
	                _that._bindCheck(that.find("[required]").attr("waiting-change", ""),check_rule,_that)
	
	                //提交前验证,禁止错误提交
	                $(this).find("[type=submit],[type=image]").click(function (e) {
	                    var form_dom = that;
	                    if (form_dom.find("[required][waiting-change]").not("[use-default]").length) {
	                         
	                        var check_selects = form_dom.find("select[required][waiting-change]").not("[use-default]");
                           //针对select下拉改变值不触发change ,再判断是不是初始值，如果都改变了就提交表单
	                       if (check_selects.length) {

	                            var tag = true;
	                            check_selects.each(function () {
	
	                                if ($(this).val() == $(this).find("option:first").val()) {
	
	                                    tag = false;
	                                }
	
	                            });
	
	                            if (tag) {
	                            	
	                                if (form_dom.find("[required][waiting-change]:not('select')").length) {
	                                     
	                                    form_dom.find("[required][waiting-change]:not('select')").addClass("error");
	                                    (typeof param_obj.error=="function")&&param_obj.error();
	                                    e.preventDefault();
	                                } else {
	                                	(typeof param_obj.success=="function")&&param_obj.success(getFormData(form_dom))
	
	                                   
	                                }
	
	                            } else {
	                                form_dom.find("[required][waiting-change]").not("[use-default]").addClass("error");
	                                form_dom.find(".error input[type=checkbox]").parents(".error").addClass("_checkbox");
	                                (typeof param_obj.error=="function")&&param_obj.error();
	                                e.preventDefault();
	                            }
	
	
	                        } else {
	                            form_dom.find("[required][waiting-change]").not("[use-default]").addClass("error");
	                            (typeof param_obj.error=="function")&&param_obj.error();
	                            e.preventDefault()
	
	                        }
	                            
	                    }else {
	                    	/*******通过必填和格式验证，执行回调********/
	                       (typeof param_obj.success=="function")&&param_obj.success(getFormData(form_dom))
	                        e.preventDefault()
	
	                    }
	                    e.preventDefault()
	                })
	
	            })
		
		},
		form_update:function(){
			this._bindCheck($(this).find("[required]").attr("waiting-change", "").unbind("change"),this.check_rule,$(this));
			$(this).find("[required][waiting-change]").each(function(){
				if($(this).val()!=$(this)[0].defaultValue)
				{
					$(this).change();
				}
				
			})
				
			
		}
	})





   


