/*2017-3-1 毛宇浩*/
/*时间选择控件，需要的空元素上加date-choice属性即可,如果不需要初始化显示时间加上no-show属性即可;
元素上可以设置start-date,end-date属性可以设置是否是为开始和结束的区间选择;
参数设置startToend_days具体数字 ，可以设置开始和结束日期的间隔天数;
元素上设置ini-date='2017-3-1'可以初始化日期，如果该日期为禁选no-show或者 在开始和结束区间设定的间隔天数之外，则无效；
可以统一设置是否以限于从今天日期开始选择*/
function set_choiceDate(doms,set_json){
	
	//判断是一个参数还是两个参数 ，第一个参数可以设置针对特定的日期控件生效
	if(arguments.length==2)
	{
		var doms=doms;
	}else{
		var set_json=doms;
		var doms=$("[date-choice]");
	};
	
	if($("[date-choice]").length==0)return false;

	if($("head").find("style:last-of-type").length&&$("head").find("style:last-of-type").html().indexOf("date_choiceBox")<0)
	{
	 $("head").append('<style>.date_choiceBox{margin:30px 10px;margin-left:0;display:inline-block}.date_click{color:#333;padding:20px 10px 10px;border:3px solid #d4ced1;width:96%;position:absolute;transform:translateX(-50%);-webkit-transform:translateX(-50%);-moz-transform:translateX(-50%);-ms-transform:translateX(-50%);left:50%;z-index:3000;margin-left:0}div.choiceDiv_container{position:relative;width:0;line-height:inherit;display:inline-block;font-size:0;overflow:visible;vertical-align:top;z-index:10000}div.choiceDiv_container>.date_click{width:400px;font-size:initial;position:absolute;left:0;top:calc(100%+5px);transform:translateX(0%);-webkit-transform:translateX(0%);-moz-transform:translateX(0%);-ms-transform:translateX(0%);background-color:#fff}div.mobile_style{position:fixed;width:100%;height:100%;left:0;top:0;background-color:rgba(68,68,68,0.3);z-index:10000}div.mobile_style .date_click{bottom:.3rem}.no_mouseEvent{pointer-events:none}.no_mouseEvent div.mobile_style{pointer-events:auto}.date_click[class*="back-"]{color:#fff}.date_click[class*="back-fff"]{color:#333}.date_click *{color:inherit}.date_click .year_month{height:40px;line-height:30px;border-bottom:1px solid #474747}.date_click .year_month select{cursor:pointer;margin-right:10px;font-size:14px;background-color:inherit;padding-left:10px;padding-right:20px;border:1px solid #474747;line-height:30px;height:30px;display:inline-block}.date_click .year_month select option{line-height:30px;color:#333;cursor:pointer}.date_click span.fr em{display:inline-block;border:1px solid #474747;padding:0 12px;box-sizing:border-box;line-height:28px;font-size:12px}.date_click span.fr em+em{margin-left:10px}.date_click span.fr em.active{background-color:#ccc}.date_click .week{line-height:40px;height:40px;font-size:0;text-align:center;white-space:nowrap}.date_click .week span{font-size:12px;text-align:center;width:14%;display:inline-block}.date_click .days ul{border-left:1px solid #474747;width:100%;overflow:hidden;display:inline-block;padding-left:0}.date_click .days ul li{position:relative;border-top:1px solid #474747;display:inline-block;float:left;box-sizing:border-box;line-height:16px;width:14%;text-align:center;border-right:1px solid #474747;border-bottom:1px solid #474747;height:42px}.date_click .days ul li input[disabled]+span{color:#ddd;font-weight:500}.date_click .days ul li input[disabled]+span b{color:#ddd}.date_click .days ul li span{font-size:0;overflow:hidden}.date_click .days ul li span *{font-size:12px}.date_click .days ul li span b{display:block;font-size:13px;color:#f93;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.date_click .days ul li:empty{background-color:#dae0e0}.date_click .days ul li:nth-child(n+8){border-top:0}.date_click .days ul li span{display:block;font-size:14px;color:#c11c1c;font-weight:600;line-height:20px;cursor:pointer;height:100%;margin:0;padding:0;font-style:normal}.date_click .days ul li input[disabled]+span{cursor:initial}.date_click .days ul li span>i{display:inline-block;vertical-align:middle}.date_click .days ul li span>i:only-child{line-height:40px}.date_click .days ul li input{display:none}.date_click .days ul li input:checked+span{background-color:#ccc}.date_click[class*="back-"] .days ul li input:checked+span{background-color:#6c7b6e;color:#fff}.date_click[class*="back-"] .days ul li input:checked+span b{color:#fff}.date_click .dothing>*{line-height:30px;border:1px solid #474747;display:inline-block;padding:0 25px;margin-left:10px;cursor:pointer;font-size:12px;font-style:normal}.date_click .dothing{text-align:right;border-top:1px solid #474747;padding-top:10px;margin-top:10px}.date_click .dothing>*:active{background-color:#474747;color:#fff}.date_click:after{display:block;position:absolute;top:100%;left:0;width:100%;height:100px;background-color:transparent;content:""}</style>')
	}

	//拓展日历功能,获取今日00:00时的毫秒数
	function todayTime(){
		return new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).valueOf();
	
	}
	function stringTotime(string){
		if(string&&typeof string=="string")
		{
			if(string.indexOf("-")>0)
			{
				return new Date(string.split("-")[0],string.split("-")[1]-1,string.split("-")[2]).valueOf()
			}else if(string.indexOf("/")>0){
				return new Date(string.split("/")[0],string.split("/")[1]-1,string.split("/")[2]).valueOf()
			}
			
		}
	
	}
	function timeTostring(time)
	{
		if(time>=0)
		{
			return new Date(time).getFullYear()+"-"+(new Date(time).getMonth()+1)+"-"+new Date(time).getDate()
		}else{
			return false;
		}
		
	}
		
	//JQ拓展，判断有无某自有属性
		$.fn.extend({
			hasAttribute:function(attr){
			
				if($(this)[0].getAttribute(attr)==""||$(this)[0].getAttribute(attr))
				{
					return true;
				}else{
					return false;
				}
	
			},
			isEmptyVal:function(){
				if($(this).attr("type")=="text")
				{
					return $(this).val().trim()?true:false;
				}else{
					return $(this).text().trim()?true:false;
					
				}
		
			}
	
		})
		  var set_choiceStyle = {
		  	   /********************基础API***********************/
				"isPC": false, //是否是PC平台
				"double_calendar":false,//是否是双选择模式，即在一个日历界面选择起止日期，只适用设定起止日期的选项
				"start_year":1949,//设置可选择的最早年
				"today_start": "yes", //设置是否以今天为起始时间，主要用于初始化显示时间
				"limit_days": "no", //设置以今天为起始时间的往后限定限定天数，可以为'no'或者具体数字
				"startToend_days":0,//设置开始时间和结束时间的间隔天数，默认0，即结束时间和开始时间可以选择同一天
				/*******************************************/
				"firstDate": (function() { //初始化日期，获取当天日期
					var date_obj = new Date();
					var the_year = date_obj.getFullYear();
					var the_month = date_obj.getMonth() + 1;
					var the_weekDay = date_obj.getDate();
					return the_year + "-" + the_month + "-" + the_weekDay;
				})(),

				"choice_style": "radio", //设置选择日期为单选或者多选，值为'radio'或者'checkbox'
				"date_relativeCon": undefined, //设置日期相关的信息，默认无，默认格式为数组[],每个元素和日期一一对应
				"special_date_relativeCon": undefined, //设置特殊日期的相关信息，默认无，默认数组格式[2016/11/20-500,2016/11/27-350]一种
				"disabled_date": undefined, //单独设置的不能选择的日期，默认无，默认格式为数组例如[2016/11/20,2016/12/1,2017/1/15],[2016-11-20,2016-12-1,2017-1-15]二种格式
				"callback": undefined, //设置点击"确定"按钮后的回调函数，默认无
				"date_choice": function(doms, set_json) {
		            
					
					/*点击生成选择时间界面*/
					var that = this;
					var date_obj = new Date();
					var the_year = date_obj.getFullYear();
					var the_month = date_obj.getMonth() + 1;
					var the_weekDay = date_obj.getDay();
	                /*初始化赋值*/
					set_json = $.extend({},that,set_json);
					
					/*让存值取值更方便，统一input 或者一般dom 元素两种存值取值方式*/
					$.fn.extend({
					               	getDateVal:function(){
	
					               			if($(this).attr("type")!="text")
						               		{
						               			return $(this).text()?$(this).text():($(this).attr("ini-date")?$(this).attr("ini-date"):"");
						               		   
						               		}else{
						               			return $(this).val()?$(this).val():($(this).attr("ini-date")?$(this).attr("ini-date"):"");
						               			
						               		}
	
					               	}
					           })
					
					
	
	                //设置日期值函数
					$.fn.extend({
						setDateVal:function(string){
							//单选模式
							if(set_json.choice_style=="radio"||that.choice_style=="radio")
							{
								if($(this).hasAttribute("type"))
								{
									$(this).val(string);
								}else{
									$(this).text(string);
									
								}
								
							}else if(set_json.choice_style=="checkbox"){
								
								alert("多选模式还没搞定！")
								
							}
		
						}
	
					})
					 
					//检测指定日期的一般合法性，即如是否起始日期大于今天，是否超过限选天数内，是否在禁选日期列表里,起始时期之间的联动日期合法性则不做验证
		            function checkDateOk(date){
	                    
					   if(date&&date>=0)
					   {
					   	  date=new Date(date).getFullYear()+"-"+(new Date(date).getMonth()+1)+"-"+new Date(date).getDate();
					   }
					   
						if(date&&set_json.disabled_date)
						{
							
							var disabled_ary=set_json.disabled_date.slice(0);
							
							var check_ok=true;
							while(disabled_ary.length)
							{
						
							  var item=disabled_ary.pop().toString();
							  if(item.indexOf("/")>=0)
							  {
							  	
							     if(item==date||item.split("/").join("-")==date)
							     {
							     	check_ok=false;
							     	break;
							     }
							  }else if(item.indexOf("-")>=0){
							  	 if(item==date||item.split("-").join("/")==date)
							     {
							     	check_ok=false;
							     	break;
							     }
	
							  }
	
							}
						
							//如果没在禁选列表，则进一步判断其他合法性
							if(check_ok)
							{
								
								var date_time=stringTotime(date);
								if(set_json.today_start=="yes")
								{
			                            if(set_json.limit_days=="no"&&date_time>=todayTime())
			                            {
			                            	return true;
			                            }else if(date_time>=todayTime()&&set_json.limit_days>=0&&(todayTime()+set_json.limit_days*24*60*60*1000>=date_time)){
			                            	return true;
			                            }else{
			                            	return false;
			                            }
								}else{
									return true;
								}
	
							}else{
								return false;
								
							}
						}else{
							
								var date_time=stringTotime(date);
								if(set_json.today_start=="yes")
								{
			                            if(set_json.limit_days=="no"&&date_time>=todayTime())
			                            {
			                            	return true;
			                            }else if(date_time>=todayTime()&&set_json.limit_days>=0&&(todayTime()+set_json.limit_days*24*60*60*1000>=date_time)){
			                            	return true;
			                            }else{
			                            	return false;
			                            }
								}else{
									return true;
								}
	
						}
					}
	
	                
					/*获取初始化有效时刻*/
					function getOk_firstTime(dom){
	
								//判断是不是结束日期，若为结束日期，起始日期为起始控件初始化后日期加上设置的最小间隔天数
								if(dom.hasAttribute("end-date"))
								{
									 
									var input_ind=$("[date-choice]").index(dom);
									var start_dom=$("[date-choice]").eq(input_ind-1);
									var start_dom_val=start_dom.getDateVal();
									
	                             
								   if(checkDateOk(start_dom_val))
								   {
								   	   var ini_time=stringTotime(start_dom_val)+set_json.startToend_days* 24 * 60 * 60 * 1000;
							      
								   }else{
						         
								    	var ini_time=getOk_firstTime(start_dom)+set_json.startToend_days* 24 * 60 * 60 * 1000;
								        
								   }
								    
	                               
								}else{
									
									var ini_time=todayTime();
								
								}
				                
								//判断初始化时间，是否合法
							    if(checkDateOk(ini_time))
							    {
							      
							    	var start_time =ini_time;
							    	
							    }else{
							    	
							    	if(set_json.today_start=="yes"&&set_json.limit_days>0)
							    	{
							    		
							    		last_dayTime=todayTime()+set_json.limit_days*24*60*60*1000;
							    		while(!checkDateOk(ini_time+=24*60*60*1000))
									    	{
			                          
									    
									    		if(ini_time>last_dayTime)
									    		{
									    			
									    			ini_time=undefined
									    			break;
									    		}
									    		
									    		
									    	}
							    		
							    		
							    	}else if(set_json.today_start=="no"||set_json.limit_days=="no"){
							    		while(!checkDateOk(ini_time+=24*60*60*1000)){}
		
							    	}
							    	var start_time=ini_time;	
							  
							    }
	                            
							   //判断是否需要显示初始化日期
				            	if(start_time)
				            	{
				            		
				            		if(dom.hasAttribute("ini-date"))
				            		{
				            			
				            			var default_time=dom.attr("ini-date");
				            			
				            			if(checkDateOk(default_time)){
				            	
				            				default_time=stringTotime(default_time); 
				            				
				            				if(dom.hasAttribute("startdom_maxdate"))
				            				{
				            					
				            					
				            					var end_time=stringTotime(dom.attr("startdom_maxdate"))-set_json.startToend_days*24*60*60*1000;
				            					if(start_time<default_time&&default_time<=end_time)
				            					{
				            						
				            						start_time=default_time;
				            					
				            					}
				            				  
				            				}else if(dom.hasAttribute("enddom_mindate"))
				            				{   
				            				
				            					start_time=stringTotime(dom.attr("enddom_mindate"))+set_json.startToend_days*24*60*60*1000;
	                                            
	                                            if(start_time<default_time)
	                                            {
	                                            	start_time=default_time;
	                                           
	                                            }
	                                            
	                                            
				            				}else if(timeTostring(start_time)!=timeTostring(default_time))
				            				{
				            					 start_time=default_time;
	
				            				}
				            				
				            				
				            				
	
	
				            			}
				            
				            			return start_time;
				            		}else{
				            		
				            			return start_time;
				            		}
				            		
				            		
				            		
				       
				            	}else{
				            		
				            		 return false;
				            	}
	  
					}
				    /*文本框显示初始化日期函数*/
				    function set_firstDate(dom,start_time){
				    	    
				     	      
				     	            if(!dom.hasAttribute("no-show")&&start_time)
				     	            {
				     	            	var ini_date=new Date(start_time);
				     	            }else{
				     	            	return false;
				     	            }
				     	             
				     	     	    
				            		if(dom.hasAttribute("start-date"))
				            		{
				            			dom.setDateVal(ini_date.getFullYear()+"-"+(ini_date.getMonth()+1)+"-"+ini_date.getDate());
				            			var the_ind=$("[date-choice]").index(dom);
				            			$("[date-choice]").eq(the_ind+1).attr("enddom_mindate",dom.getDateVal())
				            			
				            		}else if(!dom.hasAttribute("end-date")){
				            		    dom.setDateVal(ini_date.getFullYear()+"-"+(ini_date.getMonth()+1)+"-"+ini_date.getDate());
//				            			var the_ind=$("[date-choice]").index(dom);
//				            			$("[date-choice]").eq(the_ind-1).attr("startdom_maxdate",dom.getDateVal())
				            		}
				     	
				     }
			
	                /*设置如果为多选模式 ，则去除开始和结束日期属性*/
					if(set_json.choice_style=="checkbox")
					{
						
						$("[date-choice]").removeAttr("start-date").removeAttr("end-date");
					}
					
					doms.each(function() {
						var dom = $(this);
						 $(this).removeAttr("startdom_maxdate").removeAttr("enddom_mindate").setDateVal("");
	             
	                     
						//设置初始日期
						set_firstDate(dom,getOk_firstTime(dom))
						dom.unbind().click(function() {
		
							 //记录当前值
                            var default_val=$(this).getDateVal();
                      
							$(this).prop("readonly",true);
							if(!$(".date_click").length) {
	
								/*是否以PC样式显示*/
								if(set_json.isPC) {
								    $('<div class="choiceDiv_container"><div class="date_click back-fff"><div class="year_month font0"><select class="year"></select><select class="month"></select></div><div class="week"><span>周日</span><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span></div><div class="days"><ul></ul></div><div class="dothing"><span class="ok">确定</span ><em class="cancel">取消</em></div></div></div>').insertBefore($(this));
	                                if($(this).css("margin-left"))
	                                {
	                                	$(".choiceDiv_container").height(this.offsetHeight).css({"margin-left":$(this).css("margin-left"),"margin-top":$(this).css("margin-top")})
	                                	$(this).css({"margin-left":"0"})
	                                }
	
								}else{
									
									
									$("html,body").addClass("no_mouseEvent");
								    
									if(set_json.double_calendar&&!set_json.isPC&&(dom.hasAttribute("start-date")||dom.hasAttribute("end-date")))
									{
										 var class_text1=dom.hasAttribute("start-date")?"active":"";
										 var class_text2=dom.hasAttribute("end-date")?"active":"";
										$("body").append( $('<div class="mobile_style"><div class="date_click back-fff"><div class="year_month font0"><select class="year"></select><select class="month"></select><span class="fr"><em class="'+class_text1+'">开始</em><em class="'+class_text2+'">结束</em></span></div><div class="week"><span>周日</span><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span></div><div class="days"><ul></ul></div><div class="dothing"><span class="ok">确定</span ><em class="cancel">取消</em></div></div></div>'))

									}
									else{
										    
                                        $("body").append( $('<div class="mobile_style"><div class="date_click back-fff"><div class="year_month font0"><select class="year"></select><select class="month"></select></div><div class="week"><span>周日</span><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span></div><div class="days"><ul></ul></div><div class="dothing"><span class="ok">确定</span ><em class="cancel">取消</em></div></div></div>'))
									}
									
	           
								}
	                       
								/*设置开始的时间年限，可以设置具体某一年，也可以设置限定为当前时间的 年份，以及往后n年*/
								var setYear = function(start) {
									$(".date_click .year_month .year").empty();
									var year = start;
									var end_year = the_year + 3;
									if(set_json.today_start == "yes" && set_json.limit_days >= 0) {
	
										var end_dateVal = todayTime() + (set_json.limit_days - 1) * 24 * 60 * 60 * 1000;
										end_year = new Date(end_dateVal).getFullYear();
									}
								    if(dom.hasAttribute("startdom_maxdate"))
		                             {
	
		                             	end_year=stringTotime(dom.attr("startdom_maxdate"))-set_json.startToend_days*24*60*60;
		                             	end_year=new Date(end_year).getFullYear(); 
		                             
		                             }
									while(year <= end_year) {
									
										$(".date_click .year_month .year").prepend('<option value="' + year + '">' + year + '</option>');
										++year;
									}
									 if(dom.getDateVal().indexOf("-")>0)
		                               {
		                               	  $(".date_click .year_month .year").find("[value=" + dom.getDateVal().split("-")[0] + "]").prop("selected", "selected");
		                               }else if(dom.getDateVal().indexOf("/")>0){
		                               	  $(".date_click .year_month .year").find("[value=" + dom.getDateVal().split("/")[0] + "]").prop("selected", "selected");
		                               }else{
		                               	  $(".date_click .year_month .year").find("[value=" + timeTostring(getOk_firstTime(dom)).split("-")[0]+ "]").prop("selected", "selected");
		                               }
	
								};
								/*设置选择月份，可以为全年12月，也可以以当前时间月份未开始的月份至本年12月份*/
								var setMonth = function(start, end) {
								
									$(".date_click .year_month .month").empty();
									var month = start;
									end_month = 12;
									if(end != undefined) {
										var end_month = end;
									}
									while(month <= end_month) {
								
										$(".date_click .year_month .month").append('<option value="' + month + '">' + month + "月" + '</option>');
										++month;
									};
									 if(dom.getDateVal().indexOf("-")>0)
		                               {
		                               	  $(".date_click .year_month .month").find("[value=" + dom.getDateVal().split("-")[1] + "]").prop("selected", "selected");
		                               }else if(dom.getDateVal().indexOf("/")>0){
		                               	  $(".date_click .year_month .month").find("[value=" + dom.getDateVal().split("/")[0] + "]").prop("selected", "selected");
		                               }else{
		                               	  $(".date_click .year_month .month").find("[value=" + timeTostring(getOk_firstTime(dom)).split("-")[1]+ "]").prop("selected", "selected");
		                               }
	
								};
								/*设置每个年月具体当月天数*/
								var setDays = function() {
								    var that_year = $(".date_click .year_month .year").val();
									var that_month = $(".date_click .year_month .month").val(); 
									var num = 0;
									var curr_month = new Date(that_year, that_month - 1, 1);
									if(that_month == 12) {
										num = 31;
									} else {
										var next_month = new Date(that_year, that_month, 1);
										num = (next_month - curr_month) / (24 * 60 * 60 * 1000);
	
									}
									$(".date_click .days ul").empty();
	
									while(num) {
									
										var i = num;
										if(set_json.date_relativeCon) {
	
											if(set_json.special_date_relativeCon) {
	
												var relative_con = set_json.special_date_relativeCon.slice(0);
												var same = false;
												while(relative_con.length) {
											
													var item_con = relative_con.pop().split("-");
													if((that_year + "/" + that_month + "/" + num) == item_con[0]) {
	
														same = true;
														break;
	
													}
	
												}
												if(same) {
	
													$(".date_click .days ul").prepend('<li class="date"><label><input type="' + set_json.choice_style + '" name="choice_day" value="' + num + '"/><span><i>' + (num--) + '</i><b>&yen;' + item_con[1] + '</b></span></label></li>');
												} else {
													$(".date_click .days ul").prepend('<li class="date"><label><input type="' + set_json.choice_style + '" name="choice_day" value="' + num + '"/><span><i>' + num + '</i><b>&yen;' + (set_json.date_relativeCon[--num] == undefined ? "" : set_json.date_relativeCon[num]) + '</b></span></label></li>');
	
												}
	
											} else {
	
												$(".date_click .days ul").prepend('<li class="date"><label><input type="' + set_json.choice_style + '" name="choice_day" value="' + num + '"/><span><i>' + num + '</i><b>&yen;' + (set_json.date_relativeCon[--num] == undefined ? "" : set_json.date_relativeCon[num]) + '</b></span></label></li>');
	
											}
	
										} else {
	
											$(".date_click .days ul").prepend('<li class="date"><label><input type="' + set_json.choice_style + '" name="choice_day" value="' + num + '"/><span><i>' + (num--) + '</i></span></label></li>');
										}
										
									}
									
									//特殊设置的不可选的日期
										if(dom.hasAttribute("startdom_maxdate")){
											$(".date_click .days ul li").each(function(){
												var ind=$(".date_click .days ul li").index($(this));
												var date_item=that_year+"-"+that_month+"-"+(ind+1);
												var max_dateTime=stringTotime(dom.attr("startdom_maxdate"))-set_json.startToend_days*24*60*60*1000;
												
												if(!checkDateOk(date_item)||stringTotime(date_item)>max_dateTime)
												{
													$(this).find("input").attr("disabled","disabled")
												}
												
											})
	
										}else if(dom.hasAttribute("enddom_mindate")){
										    $(".date_click .days ul li").each(function(){
												var ind=$(".date_click .days ul li").index($(this));
												var date_item=that_year+"-"+that_month+"-"+(ind+1);
												var min_dateTime=stringTotime(dom.attr("enddom_mindate"))+set_json.startToend_days*24*60*60*1000;
											
												if(!checkDateOk(date_item)||stringTotime(date_item)<min_dateTime)
												{
													$(this).find("input").attr("disabled","disabled")
												}
												
											})
											
										}else{
										
											$(".date_click .days ul li").each(function(){
												var ind=$(".date_click .days ul li").index($(this));
												var date_item=that_year+"-"+that_month+"-"+(ind+1);
												if(!checkDateOk(date_item))
												{
													$(this).find("input").attr("disabled","disabled")
													
												}
												
											})
	
										}
									
	                                 
									
									for(var i = 0; i < curr_month.getDay(); i++) {
										$(".date_click .days ul").prepend("<li></li>");
									}
									var all_days = 42 - $(".date_click .days ul li").length;
									for(var n = 0; n < all_days; n++) {
										$(".date_click .days ul").append("<li></li>");
									}
					                    	   
	
	
	
								};
	
								/*设置点击输入框后默认的已选择天数样式*/
	                            var set_defaultDay = function() {
								    var year = $(".date_click .year_month .year").val();
									var month = $(".date_click .year_month .month").val(); 
	                            	if(dom.attr("type")=="text")
	                            	{
	                            		var the_defaultDate=dom.val();
	                            	}else{
	                            		var the_defaultDate=dom.text();
	                            	}
	                            	if(the_defaultDate)
	                            	{
	                            		
	                            		if(year==the_defaultDate.split("-")[0]&&month==the_defaultDate.split("-")[1])
	                            		{
	                            			the_defaultDay=the_defaultDate.split("-")[2];
	                            			$(".date_click .days ul li.date").eq(the_defaultDay-1).find("input").prop("checked",true);
	                            			
	                            		}else{
	                                        
	                            			$(".date_click .days ul li.date input:not('[disabled]'):eq(0)").prop("checked",true);
	                            			
	                            		}
	                            		
	                            	}else{
	                            		if(year==new Date().getFullYear()&&month==new Date().getMonth()+1)
	                            		{
	                            			    var input_dom=$(".date_click .days ul li.date:eq("+(new Date().getDate()-1)+")").find("input:not('[disabled]')");
			                            		if(input_dom.length)
			                            		{
			                            	
			                            			input_dom.prop("checked",true)
			                            		}else{
			                            			
			                            			$(".date_click .days ul li.date input:not('[disabled]'):eq(0)").prop("checked",true);
			                            			
			                            		}
	
	                            		}else{
	                            			$(".date_click .days ul li.date input:not('[disabled]'):eq(0)").prop("checked",true);
	                            		}
	                            		
	                            		
	
	                            		
	
	                            		
	                            	}
	                            	
	                            	
	                            }
								/*初始化绑定点击时间选择事件*/
								var click_change = function() {
									$(".date_click .days li input").click(function() {
	
										if(dom.prop("type") == undefined) {
											if(set_json.choice_style == "radio") {
												dom.text($(".date_click .year_month select:first").val() + "-" + $(".date_click .year_month select:last").val() + "-" + $(".date_click .days ul li input:checked").siblings("span").text());
											} else if(set_json.choice_style.trim() == "checkbox") {
												var date_string = dom.text();
												var date_ary = date_string.split(",");
												var date_num = $(this).val();
	
												if($(this).prop("checked")) {
	
													dom.text((date_string == "" ? "" : date_string + ",") + $(".date_click .year_month select:first").val() + "-" + $(".date_click .year_month select:last").val() + "-" + date_num);
	
												} else {
													if($(".date_click .days li input:checked").length == 0) {
														$(this).prop("checked", true);
														return;
													}
													var selected_date = $(".date_click .year_month select:first").val() + "-" + $(".date_click .year_month select:last").val() + "-" + date_num;
													var new_ary = [];
													while(date_ary.length) {
											
														var item = date_ary.pop();
														if(item.trim() != selected_date.trim()) {
															new_ary.push(item);
	
														}
	
													}
	
													dom.text(new_ary.reverse().join(","));
	
												}
	
											}
	
										} else {
	
											if(set_json.choice_style.trim() == "radio") {
												dom.val($(".date_click .year_month select:first").val() + "-" + $(".date_click .year_month select:last").val() + "-" + $(".date_click .days ul li input:checked").val());
											} else if(set_json.choice_style.trim() == "checkbox") {
												var date_string = dom.val();
												var date_ary = date_string.split(",");
	
												var date_num = $(this).val();
	
												if($(this).prop("checked")) {
	
													dom.val((date_string == "" ? "" : date_string + ",") + $(".date_click .year_month select:first").val() + "-" + $(".date_click .year_month select:last").val() + "-" + date_num);
	
												} else {
	
													if($(".date_click .days li input:checked").length == 0) {
														$(this).prop("checked", true);
														return;
													}
													var selected_date = $(".date_click .year_month select:first").val() + "-" + $(".date_click .year_month select:last").val() + "-" + date_num;
													var new_ary = [];
													while(date_ary.length) {
											
														var item = date_ary.pop();
	
														if(item.trim() != selected_date.trim()) {
															new_ary.push(item);
	
														}
	
													}
													dom.val(new_ary.reverse().join(","));
	
												}
	
											}
	
										};
									
								     
	
									});
	
								}
	                             
								
	                               /*具体年月日生成函数调用*/
			                    if(set_json.today_start == "no") {
		
								var start_month=1;
								var end_month=12;
							
									if(dom.hasAttribute("startdom_maxdate"))
		                             {
		                             
		                             	setYear(set_json.start_year);
		                             	end_month=stringTotime(dom.attr("startdom_maxdate"))-set_json.startToend_days*24*60*60*1000;
		                             	end_month=new Date(end_month).getMonth()+1;
		                             	
		                             
		                             }else if(dom.hasAttribute("enddom_mindate")){
		                             
		                                start_month= stringTotime(dom.attr("enddom_mindate"))+set_json.startToend_days*24*60*60*1000;
		                             	setYear(new Date(start_month).getFullYear());
		                             	start_month=new Date(start_month).getMonth()+1;
		       
		                             }else{
		                             	setYear(set_json.start_year);
		                             }
	                           
								setMonth(start_month, end_month);
								setDays();
								set_defaultDay(the_year,start_month);
								click_change();
							} else if(set_json.today_start == "yes") {
	
								setYear(the_year);
								var start_month=timeTostring(todayTime()).split("-")[1];
								var end_month=12;
								if(set_json.limit_days >= 0) {
	
									var end_dateVal = todayTime() + set_json.limit_days * 24 * 60 * 60 * 1000;
									if((new Date(end_dateVal)).getFullYear() == the_year) {
	                                       end_month=(new Date(end_dateVal)).getMonth()+1
									
									}
	
								} 
								//防止超出起止月份
								  if(dom.hasAttribute("startdom_maxdate"))
	                                 {
	                                    var end_month=stringTotime(dom.attr("startdom_maxdate"))-set_json.startToend_days*24*60*60*1000;   
	                                 	if(end_month<end_dateVal)
	                                 	{
	                                 		end_month=new Date(end_month).getMonth()+1;
	                                 		
	                                 	}else{
	                                 		
	                                 		end_month=new Date(end_month).getMonth()+1;
	                                 		
	                                 	}
	
	                                 }else if(dom.hasAttribute("enddom_mindate")){
	                                 	
	                                 	var start_month=stringTotime(dom.attr("enddom_mindate"))+set_json.startToend_days*24*60*60*1000;  
	                                 	
	                                 	if(start_month>todayTime())
	                                 	{
	                                 		start_month=new Date(start_month).getMonth()+1;
	                                 	}
	                                 	
	                                 }
		                                /*点击设置可选月份*/
		                               if(end_month>=start_month)
		                               {
		                               	  setMonth(start_month, end_month);
		                               }else{
		                               	  setMonth(new Date().getMonth()+1,new Date().getMonth()+1)
		
		                               }
	
				                
	
									setDays();
									set_defaultDay();
									click_change();
								};
								/*选择年月后，刷新下面的天数*/
								$(".date_click .year_month select").change(function() {
							
	                              
										if(set_json.today_start == "yes" && $(this).hasClass("year") && set_json.limit_days >= 0) {
	
											var end_date = new Date(date_obj.valueOf() + set_json.limit_days * 24 * 60 * 60 * 1000);
											if(end_date.getFullYear() == date_obj.getFullYear()) {
	
												setMonth(date_obj.getMonth() + 1, end_date.getMonth() + 1)
											} else {
	
												if($(this).val() == end_date.getFullYear()) {
	
													setMonth(1, end_date.getMonth() + 1)
	
												} else if($(this).val() > date_obj.getFullYear()) {
	
													setMonth(1, 12);
												} else if($(this).val() == date_obj.getFullYear()) {
	
													setMonth(date_obj.getMonth() + 1, 12);
	
												}
	
											}
	
										} else if(set_json.today_start == "yes" && $(this).hasClass("year")) {
	
											if($(this).val() == the_year) {
												setMonth(the_month, 12);
											} else {
												setMonth(1, 12);
	
											}
	
										}
	
										var year = $(".date_click .year_month select:first").val();
										var month = $(".date_click .year_month select:last").val();
	                                  
										setDays(year, month, set_json.limit_days);
										set_defaultDay();
										click_change();
									})
								/*选择日期后，点击"确认"和"取消"的操作*/
								/*点击确定后执行的函数*/
								function choice_finish(callback){
										var year = $(".date_click .year_month select:first").val();
										var month = $(".date_click .year_month select:last").val();
										var select_day=$(".date_click .days ul li").has("input:checked").find("span i").text();
										var curr_date=year+"-"+month+"-"+select_day;
										typeof set_json.callback == "function" && set_json.callback()
	                                     if(dom[0].getAttribute("start-date")!=undefined)
	                                     {
		                                     	var curr_ind=$("[date-choice]").index(dom);
		                                     	var end_dom=$("[date-choice]").eq(++curr_ind);
		                                     	if(end_dom[0].getAttribute("end-date")!=undefined)
		                                     	{    
		                                             end_dom.attr("endDom_minDate",curr_date)
	
		                                     	}
	                                     	
	                                     }else if(dom[0].getAttribute("end-date")!=undefined){
	                                     	    var curr_ind=$("[date-choice]").index(dom);
	                                     	    var end_dom=$("[date-choice]").eq(--curr_ind);
		                                     	if(end_dom[0].getAttribute("start-date")!=undefined)
		                                     	{
		                                          
		                                             end_dom.attr("startDom_maxDate",curr_date)
		                                     		
		                                     		
		                                     	}
	
	                                     	
	                                     	
	                                     }
	                                    dom.setDateVal(curr_date);
										setTimeout(function() {
	
												if(set_json.isPC)
												{
													dom[0].style.removeProperty("margin-left");
													$(".choiceDiv_container").remove();
													
												}else{
													$(".mobile_style").remove();
													$("html,body").removeClass("no_mouseEvent");
													
												}
												//执行点击确定按钮后可能的回调
											    typeof	callback=="function"&&callback()
										}, 400)

								};
	
								$(".date_click .dothing >*").click(function() {
									if($(this).text() == "取消") {
	
										if(set_json.isPC)
										{
											dom[0].style.removeProperty("margin-left");
											$(".choiceDiv_container").remove();
										}else{
											$(".mobile_style").remove();
											
										}
										$("html,body").removeClass("no_mouseEvent");
										dom.setDateVal(default_val);
									} else {
                                        choice_finish()
									}
								});
								//双日历模式，点击起始按钮切换
								if($(".year_month span.fr em").length)
								{
							         $(".year_month span.fr em").click(function(){
							         	choice_finish(function(){
							         		    var ind=$("[date-choice]").index(dom);
							                    if(dom.hasAttribute("start-date"))
							                    {
							                    	$("[date-choice]").eq(ind+1).click()
							                    }else if(dom.hasAttribute("end-date")){
							                    	$("[date-choice]").eq(ind-1).click()
							                    }
							         		

							         	})
							         	
							         })
									
								}
	
							}
						});
	               
					});
				}
			}
			/*数据传值举例*/
		var room_con_json = {
			"normal_price": [250, 450, 350, 500, 9999, 450], //普通价格
			"special_offer": ["2016/9/10-350", "2016/11/21-119"], //特价-日期价格
			"no_choice": ["2017/2/10","2017/3/9", "2017/3/14","2017/3/20"] //禁止选择的时间

		};
		var show_price = function() {
			var ary = $("[date-choice]").val().split(",");
			var new_ary = [];
			while(ary.length) {
				var item = ary.pop().split("-");
				new_ary.push(new Date(item[0], item[1], item[2]).valueOf())
			}
			new_ary.sort();
			var start = new Date(new_ary[0]);
			var end = new Date(new_ary[new_ary.length - 1])
			$(".sureRoom-tittle span i").text(start.getMonth() + "/" + start.getDate())
			$(".sureRoom-tittle span b").text(end.getMonth() + "/" + end.getDate())
			$(".sureRoom-tittle span em").text(new_ary.length)
		}
	    //初始化
	     set_choiceStyle.date_choice(doms,set_json);
		

}

//初始化举例,具体配置请看前面默认参数设置
//	set_choiceDate({
//	    "isPC":true,
//		"today_start": "no",//是否禁选今天以前的日期
//		"limit_days": "no",//设置限选多少天以内
//		"startToend_days":0,//设置起始间隔天数
//		"choice_style": "radio",//设置选择模式
//      "double_calendar":true,//设置是否在一个界面操作起始日期选择,只针对移动端
//	});