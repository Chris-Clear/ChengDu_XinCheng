/*
 * lCalendar日期控件
 * 
 * 作者：黄磊
 * 
 * 邮箱：xfhxbb@yeah.net
 * 
 * Copyright 2016
 * 
 * 创建于：2016-01-08
 */
window.lCalendar = (function() {

	var MobileCalendar = function() {
		this.gearDate;
		this.minY = 1900;
		this.minM = 1,
		this.minD = 1,
		this.maxY = 2099,
		this.maxM = 12,
		this.maxD = 31
	}

	MobileCalendar.prototype = {
		init: function(params) {
			this.type = params.type;
			this.trigger = document.querySelector(params.trigger);
			this.minute_unit=params.minute_unit;
			this.hour_unit=params.hour_unit;
			this.space_minutes=params.space_minutes;
			this.init_date=params.init_date;
			if (this.trigger.getAttribute("data-lcalendar") != null) {
				var arr = this.trigger.getAttribute("data-lcalendar").split(',');
				var minArr = arr[0].split('-');
				this.minY = ~~minArr[0];
				this.minM = ~~minArr[1];
				this.minD = ~~minArr[2];
				$(this.trigger).data("default_minY",~~minArr[0])
				$(this.trigger).data("default_minM",~~minArr[1])
				$(this.trigger).data("default_minD",~~minArr[2])
			
				if(minArr.length==5)
				{
				
					this.minH = ~~minArr[3];
					this.minS = ~~minArr[4];
			
					$(this.trigger).data("default_minH",~~minArr[3])
				    $(this.trigger).data("default_minS",~~minArr[4])
				}

				var maxArr = arr[1].split('-');
				this.maxY = ~~maxArr[0];
				this.maxM = ~~maxArr[1];
				this.maxD = ~~maxArr[2];
				$(this.trigger).data("default_maxY",~~maxArr[0])
				$(this.trigger).data("default_maxM",~~maxArr[1])
				$(this.trigger).data("default_maxD",~~maxArr[2])
				
				if(maxArr.length==5)
				{
					this.minH = ~~maxArr[3];
					this.minS = ~~maxArr[4];	
					$(this.trigger).data("default_maxH",~~maxArr[3])
				    $(this.trigger).data("default_maxS",~~maxArr[4])
				}
				
				
			}
            this.callback=params.callback;
			this.date_format=params.date_format;
			this.bindEvent(this.type);
		},
		bindEvent: function(type) {
			var _self = this;
			//检测起止时间是否更新，如果更新则保存新值
			function refreshDateSpace(){
				
				if(_self.trigger.getAttribute("data-lcalendar"))
				{
					var arr=_self.trigger.getAttribute("data-lcalendar").split(",");
					var minArr = arr[0].split('-');
					_self.minY = ~~minArr[0];
					_self.minM = ~~minArr[1];
					_self.minD = ~~minArr[2];
					if(minArr.length==5)
					{
						_self.minH = ~~minArr[3];
					    _self.minS = ~~minArr[4];
					}
			
					var maxArr = arr[1].split('-');
					_self.maxY = ~~maxArr[0];
					_self.maxM = ~~maxArr[1];
					_self.maxD = ~~maxArr[2];
					if(maxArr.length==5)
					{
						_self.maxH = ~~maxArr[3];
					    _self.maxS = ~~maxArr[4];
					}
	
				}

			}
			
			//呼出日期插件
			function popupDate(e) {
				
				 refreshDateSpace()
				_self.gearDate = document.createElement("div");
				if($(".gearDate").length==0)
				{
					
					_self.gearDate.className = "gearDate";
					_self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
						'<div class="date_btn_box">' +
						'<div class="date_btn lcalendar_cancel">取消</div>' +
						'<div class="date_btn lcalendar_finish">确定</div>' +
						'</div>' +
						'<div class="date_roll_mask">' +
						'<div class="date_roll">' +
						'<div>' +
						'<div class="gear date_yy" data-datetype="date_yy"></div>' +
						'<div class="date_grid">' +
						'<div>年</div>' +
						'</div>' +
						'</div>' +
						'<div>' +
						'<div class="gear date_mm" data-datetype="date_mm"></div>' +
						'<div class="date_grid">' +
						'<div>月</div>' +
						'</div>' +
						'</div>' +
						'<div>' +
						'<div class="gear date_dd" data-datetype="date_dd"></div>' +
						'<div class="date_grid">' +
						'<div>日</div>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>';
					document.body.appendChild(_self.gearDate);
	
				}

				dateCtrlInit();
				var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
				lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
				var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
				lcalendar_finish.addEventListener('touchstart', finishMobileDate);
				var date_yy = _self.gearDate.querySelector(".date_yy");
				var date_mm = _self.gearDate.querySelector(".date_mm");
				var date_dd = _self.gearDate.querySelector(".date_dd");
				date_yy.addEventListener('touchstart', gearTouchStart);
				date_mm.addEventListener('touchstart', gearTouchStart);
				date_dd.addEventListener('touchstart', gearTouchStart);
				date_yy.addEventListener('touchmove', gearTouchMove);
				date_mm.addEventListener('touchmove', gearTouchMove);
				date_dd.addEventListener('touchmove', gearTouchMove);
				date_yy.addEventListener('touchend', gearTouchEnd);
				date_mm.addEventListener('touchend', gearTouchEnd);
				date_dd.addEventListener('touchend', gearTouchEnd);
			}
			//初始化年月日插件默认值
			function dateCtrlInit() {
			
				var date = new Date();
				var dateArr = {
					yy: date.getFullYear(),
					mm: date.getMonth(),
					dd: date.getDate() - 1
				};
				if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(_self.trigger.value)) {
					rs = _self.trigger.value.match(/(^|-)\d{1,4}/g);
					dateArr.yy = rs[0] - _self.minY;
					dateArr.mm = rs[1].replace(/-/g, "") - 1;
					dateArr.dd = rs[2].replace(/-/g, "") - 1;
				} else {
			         
				     if(_self.init_date=="today")
				     {
				     	dateArr.yy=0
				     	
				     }else if(_self.init_date.defaultDate){
	                    
				     	
				     	dateArr.yy=_self.init_date.defaultDate.split("-")[0]-_self.minY;
				     	if(dateArr.yy<0)
				     	{
				     		
				     		dateArr.yy=$(_self.trigger).attr("data-lcalendar").split(",")[0].split("-")[0]-_self.minY;
				     		
				     	}
				        
				     	if(_self.init_date.startDate)
				     	{
				   
				     		dateArr.mm=_self.init_date.defaultDate.split("-")[1]-_self.minM;
				     	    dateArr.dd=_self.init_date.defaultDate.split("-")[2].split(" ")[0]-_self.minD;

				     	  
				     	}else{
				     		dateArr.mm=_self.init_date.defaultDate.split("-")[1]-1;
				     	    dateArr.dd=_self.init_date.defaultDate.split("-")[2]-1;

				     	}
				     	

				     }else{
				     	
			
				     		dateArr.yy=dateArr.yy-_self.minY;
				     		if($(_self.trigger).attr("start-date")=="")
				     		{
				     			var ind=$("[date-choice]").index($(_self.trigger));
				     			if($("[date-choice]").eq(ind+1).val())
				     			{
				     					var dateAry=$(_self.trigger).attr("data-lcalendar").split(",")[1].split("-");
								     	dateArr.yy=dateAry[0]-_self.minY;
								     	dateArr.mm=dateAry[1]-1;
								     	dateArr.dd=dateAry[2]-1;
								     
				     				
				     			}
				     			
				     		}else if($(_self.trigger).attr("end-date")=="")
				     		{
				     			
				     			var ind=$("[date-choice]").index($(_self.trigger));
				     			if($("[date-choice]").eq(ind-1).val())
				     			{
				     					var dateAry=$(_self.trigger).attr("data-lcalendar").split(",")[0].split("-");
								     	dateArr.yy=dateAry[0]-_self.minY;
								     	dateArr.mm=dateAry[1]-1;
								     	dateArr.dd=dateAry[2]-1;

				     			}

				     		}
				     		

				     }
				
			
				}
		
				_self.gearDate.querySelector(".date_yy").setAttribute("val",dateArr.yy );
				_self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
				_self.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
				setDateGearTooth();
			}

			
			//呼出日期+时间插件
			function popupDateTime(e) {
			      
			     refreshDateSpace()
			     if($(".gearDatetime").length==0)
			     {
			     _self.gearDate = document.createElement("div");
				_self.gearDate.className = "gearDatetime";
				_self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
					'<div class="date_btn_box">' +
					'<div class="date_btn lcalendar_cancel">取消</div>' +
					'<div class="date_btn lcalendar_finish">确定</div>' +
					'</div>' +
					'<div class="date_roll_mask">' +
					'<div class="datetime_roll">' +
					'<div>' +
					'<div class="gear date_yy" data-datetype="date_yy"></div>' +
					'<div class="date_grid">' +
					'<div>年</div>' +
					'</div>' +
					'</div>' +
					'<div>' +
					'<div class="gear date_mm" data-datetype="date_mm"></div>' +
					'<div class="date_grid">' +
					'<div>月</div>' +
					'</div>' +
					'</div>' +
					'<div>' +
					'<div class="gear date_dd" data-datetype="date_dd"></div>' +
					'<div class="date_grid">' +
					'<div>日</div>' +
					'</div>' +
					'</div>' +
					'<div>' +
					'<div class="gear time_hh" data-datetype="time_hh"></div>' +
					'<div class="date_grid">' +
					'<div>时</div>' +
					'</div>' +
					'</div>' +
					'<div>' +
					'<div class="gear time_mm" data-datetype="time_mm"></div>' +
					'<div class="date_grid">' +
					'<div>分</div>' +
					'</div>' +
					'</div>' +
					'</div>' + //date_roll
					'</div>' + //date_roll_mask
					'</div>';
				    document.body.appendChild(_self.gearDate);
			     	
			     	
			     	
			     }
			     
			     
				
				dateTimeCtrlInit();
				var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
				lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
				var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
				lcalendar_finish.addEventListener('touchstart', finishMobileDateTime);
				var date_yy = _self.gearDate.querySelector(".date_yy");
				var date_mm = _self.gearDate.querySelector(".date_mm");
				var date_dd = _self.gearDate.querySelector(".date_dd");
				var time_hh = _self.gearDate.querySelector(".time_hh");
				var time_mm = _self.gearDate.querySelector(".time_mm");
				date_yy.addEventListener('touchstart', gearTouchStart);
				date_mm.addEventListener('touchstart', gearTouchStart);
				date_dd.addEventListener('touchstart', gearTouchStart);
				time_hh.addEventListener('touchstart', gearTouchStart);
				time_mm.addEventListener('touchstart', gearTouchStart);
				date_yy.addEventListener('touchmove', gearTouchMove);
				date_mm.addEventListener('touchmove', gearTouchMove);
				date_dd.addEventListener('touchmove', gearTouchMove);
				time_hh.addEventListener('touchmove', gearTouchMove);
				time_mm.addEventListener('touchmove', gearTouchMove);
				date_yy.addEventListener('touchend', gearTouchEnd);
				date_mm.addEventListener('touchend', gearTouchEnd);
				date_dd.addEventListener('touchend', gearTouchEnd);
				time_hh.addEventListener('touchend', gearTouchEnd);
				time_mm.addEventListener('touchend', gearTouchEnd);
			}
			//初始化年月日时分插件默认值
			function dateTimeCtrlInit() {
	
				if($(_self.trigger).val()=="")
				{
					var item_ary=$(_self.trigger).attr("data-lcalendar").split(",")[0].split("-");
				}else{
					var string_ary=$(_self.trigger).val().split(" ");
					var item_ary=[string_ary[0].split("-")[0],string_ary[0].split("-")[1],string_ary[0].split("-")[2]]
					if(string_ary.length>1)
					{
						item_ary.push(string_ary[1].split(":")[0]);
						item_ary.push(string_ary[1].split(":")[1])
						
					}
				}
				
				var date = new Date();
				var dateArr = {
					yy: date.getFullYear(),
					mm: date.getMonth(),
					dd: date.getDate() - 1,
					hh: item_ary[3]||date.getHours(),
					mi: item_ary[4]||date.getMinutes()
				};

				if (/^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}$/.test(_self.trigger.value)) {
				
					rs = _self.trigger.value.match(/(^|-|\s|:)\d{1,4}/g);
				   
					dateArr.yy = rs[0] - _self.minY;
					dateArr.mm = rs[1].replace(/-/g, "") - 1;
					dateArr.dd = rs[2].replace(/-/g, "") - 1;
					dateArr.hh = parseInt(rs[3].replace(/\s0?/g, ""));
					dateArr.mi = parseInt(rs[4].replace(/:0?/g, ""));
				} else {
				
			
					if(_self.init_date=="today")
				     {
				     	dateArr.yy=0
				     	
				     }else if(_self.init_date.defaultDate){
	             
				        var dateAry=$(_self.trigger).attr("data-lcalendar").split(",")[0].split(/\W/);
				     	dateArr.yy=_self.init_date.defaultDate.split("-")[0]-_self.minY;
				     	if(dateArr.yy<0)
				     	{
				     		dateArr.yy=$(_self.trigger).attr("data-lcalendar").split(",")[0].split("-")[0]-_self.minY;
				     		
				     	}
				     
				     	if(_self.init_date.startDate)
				     	{
				  
				     		dateArr.mm=_self.init_date.defaultDate.split(/\W/)[1]-_self.minM;
				     	    dateArr.dd=_self.init_date.defaultDate.split(/\W/)[2]-_self.minD;

				     	}else{
				     		
				     		dateArr.mm=_self.init_date.defaultDate.split(/\W/)[1]-1;
				     	    dateArr.dd=_self.init_date.defaultDate.split(/\W/)[2]-1;

				     	}
				     	
	     		        dateArr.hh=dateAry[3];
				        dateArr.mi=dateAry[4];


				     }else{
				     	
				   
                        dateArr.yy=dateArr.yy-_self.minY;
				     	if($(_self.trigger).attr("start-date")=="")
			     		{
			     			var ind=$("[date-choice]").index($(_self.trigger));
			     			if($("[date-choice]").eq(ind+1).val())
			     			{
			     					var dateAry=$(_self.trigger).attr("data-lcalendar").split(",")[1].split(/\W/);
							     	dateArr.yy=dateAry[0]-_self.minY;
							     	dateArr.mm=dateAry[1]-1;
							     	dateArr.dd=dateAry[2]-1;
							        dateArr.hh=dateAry[3];
							        dateArr.mi=dateAry[4];
				
	     				
			     			}
			     			
			     		}else if($(_self.trigger).attr("end-date")=="")
			     		{
			     			
			     			var ind=$("[date-choice]").index($(_self.trigger));
			     			if($("[date-choice]").eq(ind-1).val())
			     			{
			     					var dateAry=$(_self.trigger).attr("data-lcalendar").split(",")[0].split(/\W/);
							     	dateArr.yy=dateAry[0]-_self.minY;
							     	dateArr.mm=dateAry[1]-1;
							     	dateArr.dd=dateAry[2]-1;
		                            dateArr.hh=dateAry[3];
							        dateArr.mi=dateAry[4];
				

			     			}

			     		}else{
			     			        dateArr.hh=dateAry[3];
							        dateArr.mi=dateAry[4];
			     			
			     			
			     		}
			     		
				     	 	
				     }
				
				}
		      
				_self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
				_self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
				_self.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
			
             
				setDateGearTooth();
				var num1=Math.floor(24/_self.hour_unit);
				_self.gearDate.querySelector(".time_hh").setAttribute("val", Math.floor(dateArr.hh/_self.hour_unit)>=num1?0:Math.floor(dateArr.hh/_self.hour_unit));
				var num2=Math.floor(60/_self.minute_unit);
				_self.gearDate.querySelector(".time_mm").setAttribute("val", Math.ceil(dateArr.mi/_self.minute_unit)>=num2?0:Math.ceil(dateArr.mi/_self.minute_unit));
				setTimeGearTooth();
			
			}
			//呼出时间插件
			function popupTime(e) {

				 refreshDateSpace()
				_self.gearDate = document.createElement("div");
				_self.gearDate.className = "gearDate";
				_self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
					'<div class="date_btn_box">' +
					'<div class="date_btn lcalendar_cancel">取消</div>' +
					'<div class="date_btn lcalendar_finish">确定</div>' +
					'</div>' +
					'<div class="date_roll_mask">' +
					'<div class="time_roll">' +
					'<div>' +
					'<div class="gear time_hh" data-datetype="time_hh"></div>' +
					'<div class="date_grid">' +
					'<div>时</div>' +
					'</div>' +
					'</div>' +
					'<div>' +
					'<div class="gear time_mm" data-datetype="time_mm"></div>' +
					'<div class="date_grid">' +
					'<div>分</div>' +
					'</div>' +
					'</div>' +
					'<div>' +
					'<div class="gear time_ss" data-datetype="time_ss"></div>' +
					'<div class="date_grid">' +
					'<div>秒</div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>';
				document.body.appendChild(_self.gearDate);
				timeCtrlInit();
				var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
				lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
				var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
				lcalendar_finish.addEventListener('touchstart', finishMobileTime);
				var time_hh = _self.gearDate.querySelector(".time_hh");
				var time_mm = _self.gearDate.querySelector(".time_mm");
				var time_ss = _self.gearDate.querySelector(".time_ss");
				time_hh.addEventListener('touchstart', gearTouchStart);
				time_mm.addEventListener('touchstart', gearTouchStart);
				time_ss.addEventListener('touchstart', gearTouchStart);

				time_hh.addEventListener('touchmove', gearTouchMove);
				time_mm.addEventListener('touchmove', gearTouchMove);
				time_ss.addEventListener('touchmove', gearTouchMove);

				time_hh.addEventListener('touchend', gearTouchEnd);
				time_mm.addEventListener('touchend', gearTouchEnd);
				time_ss.addEventListener('touchend', gearTouchEnd);


			}
			//初始化时分插件默认值
			function timeCtrlInit() {
				var d = new Date();
				var e = {
					hh: d.getHours(),
					mm: d.getMinutes(),
					ss: d.getSeconds()
				};
				if (/^\d{2}:\d{2}:\d{2}$/.test(_self.trigger.value)) {
					rs = _self.trigger.value.match(/(^|:)\d{2}/g);
					e.hh = parseInt(rs[0].replace(/^0?/g, ""));
					e.mm = parseInt(rs[1].replace(/:0?/g, ""));
					e.ss = parseInt(rs[2].replace(/:0?/g, ""));
				}
				
				//alert(e.ss);   测试用
				_self.gearDate.querySelector(".time_hh").setAttribute("val", e.hh);
				_self.gearDate.querySelector(".time_mm").setAttribute("val", e.mm);
				_self.gearDate.querySelector(".time_ss").setAttribute("val", e.ss);
				setTimeGearTooth();
			}
			

			//重置日期节点个数
			function setDateGearTooth() {
		
				var passY = _self.maxY - _self.minY + 1;
				var date_yy = _self.gearDate.querySelector(".date_yy");
				var itemStr = "";
				if (date_yy && date_yy.getAttribute("val")) {
					//得到年份的值
					var yyVal = parseInt(date_yy.getAttribute("val"));
					//p 当前节点前后需要展示的节点个数
					for (var p = 0; p <= passY - 1; p++) {
						itemStr += "<div class='tooth'>" + (_self.minY + p) + "</div>";
					}
					date_yy.innerHTML = itemStr;
					var top = Math.floor(parseFloat(date_yy.getAttribute('top')));
					if (!isNaN(top)) {
						top % 2 == 0 ? (top = top) : (top = top + 1);
						top > 8 && (top = 8);
						var minTop = 8 - (passY - 1) * 2;
						top < minTop && (top = minTop);
						date_yy.style["-webkit-transform"] = 'translate3d(0,' + top + 'em,0)';
						date_yy.setAttribute('top', top + 'em');
						yyVal = Math.abs(top - 8) / 2;
						date_yy.setAttribute("val", yyVal);
					} else {
						date_yy.style["-webkit-transform"] = 'translate3d(0,' + (8 - yyVal * 2) + 'em,0)';
						date_yy.setAttribute('top', 8 - yyVal * 2 + 'em');
					}
				} else {
					return;
				}
				var date_mm = _self.gearDate.querySelector(".date_mm");
				
				if (date_mm && date_mm.getAttribute("val")) {
					itemStr = "";
					//得到月份的值
					var mmVal = parseInt(date_mm.getAttribute("val"));
					var maxM = 11;
					var minM = 0;
					//当年份到达最大值
					if (yyVal == passY - 1) {
						maxM = _self.maxM - 1;
					}
					//当年份到达最小值
					if (yyVal == 0) {
						minM = _self.minM - 1;
					}
					//p 当前节点前后需要展示的节点个数
					for (var p = 0; p < maxM - minM + 1; p++) {
						itemStr += "<div class='tooth'>" + (minM + p + 1) + "</div>";
					}
					date_mm.innerHTML = itemStr;
					if (mmVal > maxM) {
						mmVal = maxM;
						date_mm.setAttribute("val", mmVal);
					} else if (mmVal < minM) {
						mmVal = minM;
						date_mm.setAttribute("val", mmVal);
					}
	  
					date_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - (mmVal - minM) * 2) + 'em,0)';
					date_mm.setAttribute('top', 8 - (mmVal - minM) * 2 + 'em');
				} else {
					return;
				}
				var date_dd = _self.gearDate.querySelector(".date_dd");
				if (date_dd && date_dd.getAttribute("val")) {
					itemStr = "";
					//得到日期的值
					var ddVal = parseInt(date_dd.getAttribute("val"));
					//返回月份的天数
					var maxMonthDays = calcDays(yyVal, mmVal);
					//p 当前节点前后需要展示的节点个数
					var maxD = maxMonthDays - 1;
					var minD = 0;
					//当年份月份到达最大值
					if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
						maxD = _self.maxD - 1;
					}
					//当年、月到达最小值
					if (yyVal == 0 && _self.minM == mmVal + 1) {
						minD = _self.minD - 1;
					}
					for (var p = 0; p < maxD - minD + 1; p++) {
						itemStr += "<div class='tooth'>" + (minD + p + 1) + "</div>";
					}
					date_dd.innerHTML = itemStr;
					if (ddVal > maxD) {
						ddVal = maxD;
						date_dd.setAttribute("val", ddVal);
					} else if (ddVal < minD) {
						ddVal = minD;
						date_dd.setAttribute("val", ddVal);
					}
					date_dd.style["-webkit-transform"] = 'translate3d(0,' + (8 - (ddVal - minD) * 2) + 'em,0)';
					date_dd.setAttribute('top', 8 - (ddVal - minD) * 2 + 'em');
				} else {
					return;
				}
			}
			//重置时间节点个数
			function setTimeGearTooth(target) {
				//$(target).attr("val")&&console.log($(target).attr("val"));
				if(_self.minH>=0&&_self.minS>=0)
				{
	
					
					var min_serialNumber=_self.minY+""+(_self.minM>9?_self.minM:("0"+_self.minM))+""+(_self.minD>9?_self.minD:("0"+_self.minD))+""+(_self.minH>9?_self.minH:("0"+_self.minH))+""+(_self.minS>9?_self.minS:("0"+_self.minS));
					var max_serialNumber=_self.maxY+""+(_self.maxM>9?_self.maxM:("0"+_self.maxM))+""+(_self.maxD>9?_self.maxD:("0"+_self.maxD))+""+(_self.maxH>9?_self.maxH:("0"+_self.maxH))+""+(_self.maxS>9?_self.maxS:("0"+_self.maxS));

				
				}else{
					var min_serialNumber=_self.minY+""+(_self.minM>9?_self.minM:("0"+_self.minM))+""+(_self.minD>9?_self.minD:("0"+_self.minD))+"0000"
					var max_serialNumber=_self.maxY+""+(_self.maxM>9?_self.maxM:("0"+_self.maxM))+""+(_self.maxD>9?_self.maxD:("0"+_self.maxD))+"0000"
				}
				 var yy=$(".gear.date_yy").children().eq($(".gear.date_yy").attr("val")).text();
				 var mm=(+$(".gear.date_mm").attr("val")+1);
				 var dd=(+$(".gear.date_dd").attr("val")+1);
				 
	             
				 var pre_serialNumber=yy+(mm>9?mm:"0"+mm)+(dd>9?dd:"0"+dd);
		      
				var time_hh = _self.gearDate.querySelector(".time_hh");
				var time_mm = _self.gearDate.querySelector(".time_mm");
               
               
				
				if (time_hh && time_hh.getAttribute("val")) {
					var i = "";
					var hhVal = parseInt(time_hh.getAttribute("val"));
			
					var time_unit1=_self.hour_unit;
					//var last_minute=(Math.floor(60/_self.minute_unit)-1)*_self.minute_unit;

					for (var g = 0,k = 0; g <= 23; g+=time_unit1,k++) {
					
						 
						var item_number=pre_serialNumber+(g>9?g:("0"+g)).toString();
						 
                         for(var n=0;n<60;n+=_self.minute_unit)
                         {
                    	var item_number2=item_number+(n>9?n:"0"+n);

                         	if(min_serialNumber<=item_number2&&max_serialNumber>=item_number2)
                         	{
                         	     
                         	     
                         		i += "<div class='tooth'>" + g + "</div>";
                         		break;
                         	}

                         }
                          
					
					}
					
					time_hh.innerHTML = i;
					var time_obj=new Date();
					
                        function checkHas(int){
                        	var result=false;
                        	$(time_hh).children().each(function(){
                        	   if($(this).text()==int*_self.hour_unit)
                        	   {
                        	   	result=true;
                        	   	return false;
                        	   	
                        	   }	
                        	})
                        	return result;

                        }
                    
                        while(!checkHas(hhVal)&&hhVal<=23)
                        {
                        	
                            
                        	hhVal++
                        }
                      $(time_hh).children().each(function(){
                    
                      	if($(this).text()==hhVal*_self.hour_unit)
                      	{    
                      		var ind=$(time_hh).children().index($(this));
                      		time_hh.style["-webkit-transform"] = 'translate3d(0,' + (8 - ind* 2)+ 'em,0)';
					        time_hh.setAttribute('top', (8 - ind * 2) + 'em');
                      		return false
                      	}

                      })
                        
                    

				    $(time_hh).attr("val",hhVal);

				} else {
					return
				}

		        /*********************处理分钟**********************/
		        var hh_val=$(time_hh).attr("val")*_self.hour_unit;
				pre_serialNumber+=hh_val>9?hh_val:("0"+hh_val);

				if (time_mm && time_mm.getAttribute("val")) {
			
					
					var i = "";

					var time_unit2=_self.minute_unit;
					 
					for (var g = 0,k=0; g <= 59; g+=time_unit2,k++) {
						var item_number=pre_serialNumber+(g>9?g:("0"+g));
						if(min_serialNumber<=item_number&&max_serialNumber>=item_number)
						{
                  
							i += "<div class='tooth'>" + g + "</div>";
						}
	
					}
			        var time_obj=new Date();
					time_mm.innerHTML = i;
					if(target&&!$(target).hasClass("time_mm"))
				    {
				    	
				    	$(time_mm).attr("val",$(time_mm).children().eq(0).text()/_self.minute_unit)
				    	
				    }
					var mmVal = parseInt(time_mm.getAttribute("val"));

                      $(time_mm).children().each(function(){
                    
                      	if($(this).text()==mmVal*_self.minute_unit)
                      	{    
                      		var ind=$(time_mm).children().index($(this));
                      		time_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - ind* 2)+ 'em,0)';
					        time_mm.setAttribute('top', (8 - ind * 2) + 'em');
					        $(time_mm).val(ind);
                      		return false
                      	}

                      })
				} else {
					return
				}
				
				var time_ss = _self.gearDate.querySelector(".time_ss");
				if (time_ss && time_ss.getAttribute("val")) {
					var i = "";
					var mmVal = parseInt(time_ss.getAttribute("val"));
					for (var g = 0; g <= 59; g++) {
						i += "<div class='tooth'>" + g + "</div>";
					}
					time_ss.innerHTML = i;
					time_ss.style["-webkit-transform"] = 'translate3d(0,' + (8 - mmVal * 2) + 'em,0)';
					time_ss.setAttribute('top', 8 - mmVal * 2 + 'em');
				} else {
					return
				}
			}
			//求月份最大天数
			function calcDays(year, month) {
				if (month == 1) {
					year += _self.minY;
					if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 4000 != 0)) {
						return 29;
					} else {
						return 28;
					}
				} else {
					if (month == 3 || month == 5 || month == 8 || month == 10) {
						return 30;
					} else {
						return 31;
					}
				}
			}
			//触摸开始
			function gearTouchStart(e) {
				e.preventDefault();
				var target = e.target;
				while (true) {
					if (!target.classList.contains("gear")) {
						target = target.parentElement;
					} else {
						break
					}
				}
				clearInterval(target["int_" + target.id]);
				target["old_" + target.id] = e.targetTouches[0].screenY;
				target["o_t_" + target.id] = (new Date()).getTime();
				var top = target.getAttribute('top');
				if (top) {
					target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
				} else {
					target["o_d_" + target.id] = 0;
				}
			}
			//手指移动
			function gearTouchMove(e) {
				e.preventDefault();
				var target = e.target;
				while (true) {
					if (!target.classList.contains("gear")) {
						target = target.parentElement;
					} else {
						break
					}
				}
				target["new_" + target.id] = e.targetTouches[0].screenY;
				target["n_t_" + target.id] = (new Date()).getTime();
				//var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / target.clientHeight;
				var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / 370;
				target["pos_" + target.id] = target["o_d_" + target.id] + f;
				target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
				target.setAttribute('top', target["pos_" + target.id] + 'em');
			}
			//离开屏幕
			function gearTouchEnd(e) {
				e.preventDefault();
				var target = e.target;
				while (true) {
					if (!target.classList.contains("gear")) {
						target = target.parentElement;
					} else {
						break;
					}
				}
				var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
				if (Math.abs(flag) <= 0.2) {
					target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
				} else {
					if (Math.abs(flag) <= 0.5) {
						target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
					} else {
						target["spd_" + target.id] = flag / 2;
					}
				}
				if (!target["pos_" + target.id]) {
					target["pos_" + target.id] = 0;
				}
				rollGear(target);
			}
			//缓动效果
			function rollGear(target) {
				var d = 0;
				var stopGear = false;
				var passY = _self.maxY - _self.minY + 1;
				clearInterval(target["int_" + target.id]);
				target["int_" + target.id] = setInterval(function() {
					var pos = target["pos_" + target.id];
					var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
					pos += speed;
					if (Math.abs(speed) > 0.1) {} else {
						speed = 0.1;
						var b = Math.round(pos / 2) * 2;
						if (Math.abs(pos - b) < 0.02) {
							stopGear = true;
						} else {
							if (pos > b) {
								pos -= speed
							} else {
								pos += speed
							}
						}
					}
					if (pos > 8) {
						pos = 8;
						stopGear = true;
					}
					switch (target.dataset.datetype) {
						case "date_yy":
							var minTop = 8 - (passY - 1) * 2;
							if (pos < minTop) {
								pos = minTop;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "date_mm":
							var date_yy = _self.gearDate.querySelector(".date_yy");
							//得到年份的值
							var yyVal = parseInt(date_yy.getAttribute("val"));
							var maxM = 11;
							var minM = 0;
							//当年份到达最大值
							if (yyVal == passY - 1) {
								maxM = _self.maxM - 1;
							}
							//当年份到达最小值
							if (yyVal == 0) {
								minM = _self.minM - 1;
							}
							var minTop = 8 - (maxM - minM) * 2;
							if (pos < minTop) {
								pos = minTop;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2 + minM;
								
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "date_dd":
							var date_yy = _self.gearDate.querySelector(".date_yy");
							var date_mm = _self.gearDate.querySelector(".date_mm");
							//得到年份的值
							var yyVal = parseInt(date_yy.getAttribute("val"));
							//得到月份的值
							var mmVal = parseInt(date_mm.getAttribute("val"));
							//返回月份的天数
							var maxMonthDays = calcDays(yyVal, mmVal);
							var maxD = maxMonthDays - 1;
							var minD = 0;
							//当年份月份到达最大值
							if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
								maxD = _self.maxD - 1;
							}
							//当年、月到达最小值
							if (yyVal == 0 && _self.minM == mmVal + 1) {
								minD = _self.minD - 1;
							}
							var minTop = 8 - (maxD - minD) * 2;
							if (pos < minTop) {
								pos = minTop;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2 + minD;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "time_hh":
//							if (pos < -38) {
//								pos = -38;
//								stopGear = true;
//							}
                            var num=$(target).children().length;
							if (pos < -(num*2-10)) {
								pos = -(num*2-10);
								stopGear = true;
							}

							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2;
							
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "time_mm":
//							if (pos < -110) {
//								pos = -110;
//								stopGear = true;
//							}
                            var num=$(target).children().length;
							if (pos < -(num*2-10)) {
								pos = -(num*2-10);
								stopGear = true;
							}

							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2;
								
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "time_ss":
                            var num=$(target).children().length;
							if (pos < -(num*2-10)) {
								pos = -(num*2-10);
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						default:
					}
					target["pos_" + target.id] = pos;
				
					target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
					target.setAttribute('top', pos + 'em');
					d++;
				}, 30);
			}
			//控制插件滚动后停留的值
			function setGear(target, val) {
                
				val = Math.round(val);

				
				var len=$(target).children().length;
				
				if (/date/.test(target.dataset.datetype)) {
			
					target.setAttribute("val", val);
					setDateGearTooth();
					setTimeGearTooth(target);
				
				} else {
					
					if($(target).hasClass("time_hh"))
					{
						
						//target.setAttribute("val", val+Math.floor(24/_self.hour_unit)-len);
						target.setAttribute("val",$(target).children().eq(val).text()/_self.hour_unit)
					}else if($(target).hasClass("time_mm")){

						//target.setAttribute("val", val+Math.floor(60/_self.minute_unit)-len);
						target.setAttribute("val",$(target).children().eq(val).text()/_self.minute_unit)
						
					}else{
						target.setAttribute("val", val);
					}
					console.log($(target).attr("val"));
					setTimeGearTooth(target);
					
				}
			}
			//取消
			function closeMobileCalendar(e) {
				e.preventDefault();
				var evt = new CustomEvent('input');
				_self.trigger.dispatchEvent(evt);
				document.body.removeChild(_self.gearDate);
			}
			//日期确认
			function finishMobileDate(e) {
	          
				var passY = _self.maxY - _self.minY + 1;
				var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
				var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
                var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
				
		         if($(_self.trigger).attr("start-date")=="")
		         {
		         	 var this_ind=$("[date-choice]").index($(_self.trigger));
		         	 var end_target=$("[date-choice]").eq(this_ind+1);
		         	 var curr_space=end_target.attr("data-lcalendar").split(",");
		         	 var endtarget_obj=new Date((date_yy % passY + _self.minY),date_mm-1,date_dd).valueOf()+_self.space_minutes*60*1000;
		             endtarget_obj=new Date(endtarget_obj);
		             curr_space[0]=endtarget_obj.getFullYear()+"-"+(endtarget_obj.getMonth()+1)+"-"+endtarget_obj.getDate()+"-0-0"
		            
		            end_target.attr("data-lcalendar",curr_space.join(","));
		         	 date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
					 date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
		             _self.trigger.value = (date_yy % passY + _self.minY) + _self.date_format[2] + date_mm + _self.date_format[5] + date_dd;
		             $(_self.trigger).change();
		         }else if($(_self.trigger).attr("end-date")==""){

		         	 var this_ind=$("[date-choice]").index($(_self.trigger));
		         	 var start_target=$("[date-choice]").eq(this_ind-1);
		         	 var curr_space=start_target.attr("data-lcalendar").split(",");
		         	 var starttarget_obj=new Date((date_yy % passY + _self.minY),date_mm-1,date_dd).valueOf()-_self.space_minutes*60*1000;
		             starttarget_obj=new Date(starttarget_obj);
		             curr_space[1]=starttarget_obj.getFullYear()+"-"+(starttarget_obj.getMonth()+1)+"-"+starttarget_obj.getDate()+"-0-0"
		             start_target.attr("data-lcalendar",curr_space.join(","));
		             date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
					 date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
		             _self.trigger.value = (date_yy % passY + _self.minY) + _self.date_format[2] + date_mm + _self.date_format[5] + date_dd;
		         }else{
		         	
		         	_self.trigger.value = (date_yy % passY + _self.minY) + _self.date_format[2] + date_mm + _self.date_format[5] + date_dd;
		         	$(_self.trigger).change();
		         }
		         _self.callback&&_self.callback(_self.trigger.value);
				closeMobileCalendar(e);
			}
			//日期时间确认
			function finishMobileDateTime(e) {
				var passY = _self.maxY - _self.minY + 1;
				var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
				var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
				date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
				var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
				date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
				var hh_val=parseInt(Math.round(_self.gearDate.querySelector(".time_hh").getAttribute("val")));
				var hh_dom=$(_self.gearDate.querySelector(".time_hh"));
				//var time_hh = hh_dom.children().eq(hh_val-(Math.floor(24/_self.hour_unit)-hh_dom.children().length)).text();
				var time_hh=hh_val*_self.hour_unit;
				time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
				var mm_val = parseInt(Math.round(_self.gearDate.querySelector(".time_mm").getAttribute("val")));
				var mm_dom=$(_self.gearDate.querySelector(".time_mm"));
				//var time_mm=mm_dom.children().eq(mm_val-(Math.floor(60/_self.minute_unit)-mm_dom.children().length)).text();
				time_mm=mm_val*_self.minute_unit
				time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
				
				_self.trigger.value = (date_yy % passY + _self.minY) + _self.date_format[2] + date_mm + _self.date_format[5] + date_dd + " " + (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm;
                $(_self.trigger).change();

			 if($(_self.trigger).attr("start-date")=="")
			 {
			 	 var this_ind=$("body [start-date],body [end-date]").index($(_self.trigger))
			 	 var time_ary=_self.trigger.value.split(" ");
			 	 time_ary.push("00:00");
			 	 var start_obj=new Date(time_ary[0].split("-")[0],time_ary[0].split("-")[1]-1,time_ary[0].split("-")[2],time_ary[1].split(":")[0],time_ary[1].split(":")[1]).valueOf();
			     start_obj=new Date(start_obj+_self.space_minutes*60*1000);
			    var string= $("body [start-date],body [end-date]").eq(this_ind+1).attr("data-lcalendar").split(",");
			        string[0]=start_obj.getFullYear()+"-"+(+start_obj.getMonth()+1)+"-"+start_obj.getDate()+"-"+start_obj.getHours()+"-"+start_obj.getMinutes();
			 	    string=string.join(",");
			 	    $("body [start-date],body [end-date]").eq(this_ind+1).attr("data-lcalendar",string);
			 }else if($(_self.trigger).attr("end-date")==""){
			 	 var this_ind=$("body [start-date],body [end-date]").index($(_self.trigger));
			 	 var time_ary=_self.trigger.value.split(" ");
			 	 time_ary.push("00:00");
			 	  var end_obj=new Date(time_ary[0].split("-")[0],time_ary[0].split("-")[1]-1,time_ary[0].split("-")[2],time_ary[1].split(":")[0],time_ary[1].split(":")[1]).valueOf();
			     end_obj=new Date(end_obj-_self.space_minutes*60*1000);
			     var string= $("body [start-date],body [end-date]").eq(this_ind-1).attr("data-lcalendar").split(",");
				     
				      string[1]=end_obj.getFullYear()+"-"+(+end_obj.getMonth()+1)+"-"+end_obj.getDate()+"-"+end_obj.getHours()+"-"+end_obj.getMinutes();
			          string=string.join(",");
			          $("body [start-date],body [end-date]").eq(this_ind-1).attr("data-lcalendar",string);
			 }else{
			 	
			 	_self.trigger.value = (date_yy % passY + _self.minY) + _self.date_format[2] + date_mm + _self.date_format[5] + date_dd + " " + (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm;
			    $(_self.trigger).change();
			 }


		        _self.callback&&_self.callback(_self.trigger.value);
				closeMobileCalendar(e);
			}
			//时间确认
			function finishMobileTime(e) {
				var time_hh = parseInt(Math.round(_self.gearDate.querySelector(".time_hh").getAttribute("val")));
				time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
				var time_mm = parseInt(Math.round(_self.gearDate.querySelector(".time_mm").getAttribute("val")));
				time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
				
				var time_ss = parseInt(Math.round(_self.gearDate.querySelector(".time_ss").getAttribute("val")));
				time_ss = time_ss > 9 ? time_ss : '0' + time_ss;
				
				
				_self.trigger.value = (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm+ (time_ss.length < 2 ? ":0" : ":") + time_ss;
                $(_self.trigger).change();
                _self.callback&&_self.callback(_self.trigger.value);
				closeMobileCalendar(e);
			}
			_self.trigger.addEventListener('click', {
				"date": popupDate,
				"datetime": popupDateTime,
				"time": popupTime
			}[type]);
		}
	}
	return MobileCalendar;
})()



/**
 * LArea移动端城市选择控件
 * 
 * version:1.7.2
 * 
 * author:黄磊
 * 
 * git:https://github.com/xfhxbb/LArea
 * 
 * Copyright 2016
 * 
 * Licensed under MIT
 * 
 * 最近修改于： 2016-6-12 16:47:41
 * 
 * 2017-8-28 修改版 qqmao1984，可同时模拟时刻选择
 */
//var LAreaData=[{"id":"2","name":"\u5317\u4eac\u5e02","child":[{"id":"2288","name":"\u4e1c\u57ce\u533a"},{"id":"2301","name":"\u5927\u5174\u533a"},{"id":"2300","name":"\u660c\u5e73\u533a"},{"id":"2299","name":"\u987a\u4e49\u533a"},{"id":"2298","name":"\u901a\u5dde\u533a"},{"id":"2297","name":"\u623f\u5c71\u533a"},{"id":"2296","name":"\u95e8\u5934\u6c9f\u533a"},{"id":"2295","name":"\u6d77\u6dc0\u533a"},{"id":"2294","name":"\u77f3\u666f\u5c71\u533a"},{"id":"2293","name":"\u4e30\u53f0\u533a"},{"id":"2292","name":"\u671d\u9633\u533a"},{"id":"2291","name":"\u5ba3\u6b66\u533a"},{"id":"2290","name":"\u5d07\u6587\u533a"},{"id":"2289","name":"\u897f\u57ce\u533a"},{"id":"2051","name":"\u5ef6\u5e86\u53bf","child":[{"id":"2099","name":"\u5ef6\u5e86\u9547"},{"id":"2100","name":"\u6c38\u5b81\u9547"},{"id":"2101","name":"\u5eb7\u5e84\u9547"},{"id":"2102","name":"\u5927\u6986\u6811\u9547"},{"id":"2103","name":"\u4e95\u5e84\u9547"},{"id":"2104","name":"\u516b\u8fbe\u5cad\u9547"}]},{"id":"2050","name":"\u5e73\u8c37\u53bf","child":[{"id":"2079","name":"\u5e73\u8c37\u9547"},{"id":"2096","name":"\u5927\u534e\u5c71\u9547"},{"id":"2095","name":"\u590f\u5404\u5e84\u9547"},{"id":"2094","name":"\u9a6c\u574a\u9547"},{"id":"2093","name":"\u5218\u5bb6\u5e97\u9547"},{"id":"2092","name":"\u91d1\u6d77\u6e56\u9547"},{"id":"2091","name":"\u5cea\u53e3\u9547"},{"id":"2090","name":"\u9a6c\u660c\u8425\u9547"},{"id":"2089","name":"\u5357\u72ec\u4e50\u6cb3\u9547"},{"id":"2088","name":"\u5c71\u4e1c\u5e84\u9547"},{"id":"2087","name":"\u738b\u8f9b\u5e84\u9547"},{"id":"2086","name":"\u4e1c\u9ad8\u6751\u9547"},{"id":"2085","name":"\u5927\u5174\u5e84\u9547"},{"id":"2084","name":"\u6ee8\u6cb3\u5de5\u4e1a\u5f00\u53d1\u533a"},{"id":"2083","name":"\u5174\u8c37\u5de5\u4e1a\u5f00\u53d1\u533a"},{"id":"2082","name":"\u6768\u5bb6\u6865\u9547"},{"id":"2081","name":"\u91d1\u8c37\u5de5\u4e1a\u5f00\u53d1\u533a"},{"id":"2080","name":"\u91d1\u6d77\u5de5\u4e1a\u5f00\u53d1\u533a"},{"id":"2097","name":"\u5cea\u5c71\u9547"}]},{"id":"2049","name":"\u5bc6\u4e91\u53bf","child":[{"id":"2069","name":"\u5bc6\u4e91\u9547"},{"id":"2070","name":"\u5341\u91cc\u5821\u9547"},{"id":"2071","name":"\u6cb3\u5357\u5be8\u9547"},{"id":"2072","name":"\u897f\u7530\u5404\u5e84"},{"id":"2073","name":"\u6eaa\u7fc1\u5e84"},{"id":"2074","name":"\u5bc6\u4e91\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"2075","name":"\u592a\u5e08\u5c6f\u9547"},{"id":"2076","name":"\u5317\u5e84\u9547"},{"id":"2077","name":"\u7a46\u5bb6\u6b32\u9547"}]},{"id":"2302","name":"\u6000\u67d4\u533a"}]},{"id":"20","name":"\u5e7f\u4e1c\u7701","child":[{"id":"5977","name":"\u4ece\u5316\u5e02"},{"id":"5976","name":"\u589e\u57ce\u5e02"},{"id":"246","name":"\u6cb3\u6e90\u5e02","child":[{"id":"4205","name":"\u548c\u5e73\u53bf"},{"id":"4206","name":"\u8fde\u5e73\u53bf","child":[{"id":"4875","name":"\u5fe0\u4fe1\u9547"}]},{"id":"4209","name":"\u5e02\u533a","child":[{"id":"4210","name":"\u6e90\u57ce\u533a  "},{"id":"4211","name":"\u9ad8\u65b0\u533a "},{"id":"4212","name":"\u65b0\u5e02\u533a "},{"id":"4213","name":"\u6e90\u5357\u9547 "},{"id":"4214","name":"\u4e1c\u57d4\u9547 "},{"id":"4215","name":"\u6e90\u897f\u9547 "},{"id":"4216","name":"\u57d4\u524d\u9547"}]},{"id":"455","name":"\u4e1c\u6e90\u53bf","child":[{"id":"4854","name":"\u798f\u65b0\u5de5\u4e1a\u56ed"},{"id":"943","name":"\u4ed9\u5858\u9547"}]},{"id":"456","name":"\u7d2b\u91d1\u53bf","child":[{"id":"4904","name":"\u57ce\u5357\u9547 "},{"id":"4905","name":"\u7d2b\u57ce\u9547 "},{"id":"4906","name":"\u9644\u57ce\u9547\u4e2d\u5fc3 "},{"id":"4907","name":"\u4e4c\u77f3\u9547\u4e2d\u5fc3 "},{"id":"944","name":"\u53e4\u7af9\u9547"},{"id":"945","name":"\u4e34\u6c5f\u9547"}]},{"id":"457","name":"\u9f99\u5ddd\u53bf","child":[{"id":"946","name":"\u8001\u9686\u9547"},{"id":"947","name":"\u9640\u57ce\u9547"},{"id":"948","name":"\u9644\u57ce\u9547"}]}]},{"id":"247","name":"\u9633\u6c5f\u5e02","child":[{"id":"4230","name":"\u6c5f\u57ce\u533a "},{"id":"459","name":"\u9633\u6625\u5e02","child":[{"id":"4940","name":"\u5730\u8c46\u5c97\u5f00\u53d1\u533a "},{"id":"4932","name":"\u725b\u8ff3\u6865\u5f00\u53d1\u533a "},{"id":"4933","name":"\u57ce\u5317\u5de5\u4e1a\u533a"},{"id":"4934","name":"\u9ece\u6e56\u5de5\u4e1a\u533a"},{"id":"4935","name":"\u57ce\u5357\u7ba1\u7406\u533a "},{"id":"4936","name":"\u65b0\u4e91\u7ba1\u7406\u533a "},{"id":"4937","name":"\u6cf0\u5b89\u7ba1\u7406\u533a "},{"id":"4938","name":"\u77f3\u4e0a\u7ba1\u7406\u533a "},{"id":"4939","name":"\u4e2d\u6717\u7ba1\u7406\u533a "},{"id":"4931","name":"\u7ad9\u6e2f\u8def\u6c11\u8425\u5f00\u53d1\u533a "},{"id":"4930","name":"\u5c16\u5c97\u5cad\u5f00\u53d1\u533a"},{"id":"4929","name":"\u5347\u5e73\u7ba1\u7406\u533a "},{"id":"4928","name":"\u5408\u5c97\u7ba1\u7406\u533a "},{"id":"4926","name":"\u6cb3\u897f\u7ba1\u7406\u533a "},{"id":"4927","name":"\u5927\u5b89\u7ba1\u7406\u533a "},{"id":"951","name":"\u6625\u6e7e\u9547"},{"id":"952","name":"\u5408\u6c34\u9547"},{"id":"953","name":"\u9642\u9762\u9547"},{"id":"954","name":"\u9a6c\u6c34\u9547"},{"id":"955","name":"\u8c2d\u6c34\u9547"},{"id":"950","name":"\u6625\u57ce\u9547"}]},{"id":"460","name":"\u9633\u4e1c\u53bf","child":[{"id":"4896","name":"\u90a3\u5473\u5de5\u4e1a\u533a "},{"id":"956","name":"\u4e1c\u57ce\u9547"},{"id":"957","name":"\u5408\u5c71\u9547"},{"id":"958","name":"\u5317\u60ef\u9547"},{"id":"959","name":"\u7ea2\u4e30\u9547"},{"id":"960","name":"\u96c5\u97f6\u9547"},{"id":"962","name":"\u90a3\u970d\u5de5\u4e1a\u533a"}]},{"id":"461","name":"\u9633\u897f\u53bf","child":[{"id":"963","name":"\u7ec7\u8d21\u9547"},{"id":"964","name":"\u5858\u53e3\u9547"}]}]},{"id":"248","name":"\u6e05\u8fdc\u5e02","child":[{"id":"4232","name":"\u8fde\u5c71\u58ee\u65cf\u7476\u65cf\u81ea\u6cbb\u53bf "},{"id":"462","name":"\u6e05\u57ce\u533a","child":[{"id":"965","name":"\u9644\u57ce\u9547"},{"id":"966","name":"\u6a2a\u8377\u9547"},{"id":"967","name":"\u6d32\u5fc3\u9547"},{"id":"968","name":"\u9f99\u5858\u9547"},{"id":"969","name":"\u77f3\u89d2\u9547"},{"id":"970","name":"\u6e90\u6f6d\u9547"}]},{"id":"463","name":"\u8fde\u5dde\u5e02","child":[{"id":"971","name":"\u8fde\u5dde\u9547"}]},{"id":"464","name":"\u82f1\u5fb7\u5e02","child":[{"id":"4899","name":"\u671b\u57e0\u9547 "},{"id":"4898","name":"\u5927\u7ad9\u9547 "},{"id":"4900","name":"\u4e91\u5cad\u9547 "},{"id":"4897","name":"\u82f1\u57ce\u9547 "},{"id":"4901","name":"\u6d5b\u6d38\u9547 "},{"id":"4902","name":"\u4e1c\u534e\u9547 "}]},{"id":"465","name":"\u6e05\u65b0\u53bf","child":[{"id":"972","name":"\u592a\u548c\u9547"},{"id":"973","name":"\u6d04\u6f9c\u9547"},{"id":"974","name":"\u5c71\u5858\u9547"},{"id":"975","name":"\u592a\u5e73\u9547"},{"id":"976","name":"\u98de\u6765\u5ce1\u9547"}]},{"id":"466","name":"\u4f5b\u5188\u53bf","child":[{"id":"978","name":"\u77f3\u89d2\u9547"},{"id":"979","name":"\u6c34\u5934\u9547"},{"id":"980","name":"\u4e09\u516b\u9547"},{"id":"981","name":"\u6c64\u5858\u9547"},{"id":"982","name":"\u9f99\u5c71\u9547"},{"id":"983","name":"\u8ff3\u5934\u9547"},{"id":"984","name":"\u70df\u5cad\u9547"}]},{"id":"467","name":"\u9633\u5c71\u53bf","child":[{"id":"4941","name":"\u57ce\u5357\u533a"},{"id":"985","name":"\u57ce\u5317\u533a"}]},{"id":"468","name":"\u8fde\u5357\u7476\u65cf\u81ea\u6cbb\u53bf ","child":[{"id":"987","name":"\u4e09\u6c5f\u9547"}]}]},{"id":"249","name":"\u4e1c\u839e\u5e02","child":[{"id":"6050","name":"\u671b\u725b\u58a9\u9547"},{"id":"6036","name":"\u9ec4\u6c5f\u9547"},{"id":"6037","name":"\u6e05\u6eaa\u9547"},{"id":"6038","name":"\u5858\u53a6\u9547"},{"id":"6039","name":"\u51e4\u5c97\u9547"},{"id":"6040","name":"\u864e\u95e8\u9547"},{"id":"6041","name":"\u539a\u8857\u9547"},{"id":"6042","name":"\u6c99\u7530\u9547"},{"id":"6043","name":"\u9053\u6ed8\u9547"},{"id":"6044","name":"\u6d2a\u6885\u9547"},{"id":"6045","name":"\u9ebb\u6d8c\u9547"},{"id":"6046","name":"\u4e2d\u5802\u9547"},{"id":"6047","name":"\u9ad8\u57d7\u9547"},{"id":"6048","name":"\u6a1f\u6728\u5934\u9547"},{"id":"6049","name":"\u5927\u5cad\u5c71\u9547"},{"id":"6035","name":"\u5927\u6717\u9547"},{"id":"6034","name":"\u5bee\u6b65\u9547"},{"id":"6003","name":"\u957f\u5b89\u9547"},{"id":"6005","name":"\u8336\u5c71\u9547"},{"id":"6018","name":"\u77f3\u78a3\u9547"},{"id":"6026","name":"\u77f3\u9f99\u9547"},{"id":"6027","name":"\u77f3\u6392\u9547"},{"id":"6028","name":"\u4f01\u77f3\u9547"},{"id":"6029","name":"\u6a2a\u6ca5\u9547"},{"id":"6030","name":"\u6865\u5934\u9547"},{"id":"6031","name":"\u8c22\u5c97\u9547"},{"id":"6032","name":"\u4e1c\u5751\u9547"},{"id":"6033","name":"\u5e38\u5e73\u9547"},{"id":"472","name":"\u839e\u57ce\u533a"},{"id":"471","name":"\u4e07\u6c5f\u533a"},{"id":"470","name":"\u5357\u57ce\u533a"},{"id":"469","name":"\u4e1c\u57ce\u533a"}]},{"id":"250","name":"\u4e2d\u5c71\u5e02","child":[{"id":"473","name":"\u77f3\u5c90\u533a"},{"id":"474","name":"\u4e1c\u533a"},{"id":"475","name":"\u897f\u533a"},{"id":"476","name":"\u5357\u533a"},{"id":"477","name":"\u4e94\u6842\u5c71\u533a"},{"id":"478","name":"\u706b\u70ac\u5f00\u53d1\u533a"}]},{"id":"251","name":"\u6f6e\u5dde\u5e02","child":[{"id":"846","name":"\u6e58\u6865\u533a"},{"id":"847","name":"\u67ab\u6eaa\u533a"},{"id":"988","name":"\u6f6e\u5b89\u53bf","child":[{"id":"990","name":"\u5eb5\u57e0\u9547"},{"id":"1004","name":"\u5b98\u5858\u9547"},{"id":"1003","name":"\u94c1\u94fa\u9547"},{"id":"1002","name":"\u78f7\u6eaa\u9547"},{"id":"1001","name":"\u610f\u6eaa\u9547"},{"id":"1000","name":"\u6865\u4e1c\u9547"},{"id":"999","name":"\u6c5f\u4e1c\u9547"},{"id":"998","name":"\u9f99\u6e56\u9547"},{"id":"997","name":"\u4e1c\u51e4\u9547"},{"id":"996","name":"\u51e4\u5858\u9547"},{"id":"995","name":"\u6d6e\u6d0b\u9547"},{"id":"994","name":"\u6c99\u6eaa\u9547"},{"id":"993","name":"\u91d1\u77f3\u9547"},{"id":"992","name":"\u5f69\u5858\u9547"},{"id":"1005","name":"\u53e4\u5df7\u9547"}]},{"id":"1006","name":"\u9976\u5e73\u53bf","child":[{"id":"4888","name":"\u8054\u9976\u9547 "},{"id":"1007","name":"\u9976\u5e73\u53bf\u57ce"},{"id":"1008","name":"\u9ec4\u5c97\u9547"},{"id":"1009","name":"\u94b1\u4e1c\u9547"},{"id":"1010","name":"\u4e95\u6d32\u9547"},{"id":"1011","name":"\u9ad8\u5802\u9547"}]}]},{"id":"252","name":"\u63ed\u9633\u5e02","child":[{"id":"4942","name":"\u6995\u57ce\u533a"},{"id":"4943","name":"\u6e14\u6e56\u7ecf\u6d4e\u5f00\u53d1\u8bd5\u9a8c\u533a "},{"id":"4944","name":"\u4e1c\u5c71\u533a "},{"id":"483","name":"\u63ed\u4e1c\u53bf","child":[{"id":"1014","name":"\u63ed\u4e1c\u53bf\u57ce"},{"id":"1025","name":"\u5730\u90fd\u9547"},{"id":"1024","name":"\u57d4\u7530\u9547"},{"id":"1023","name":"\u6842\u5cad\u9547"},{"id":"1022","name":"\u767d\u5854\u9547"},{"id":"1021","name":"\u9716\u76d8\u9547"},{"id":"1020","name":"\u6708\u57ce\u9547"},{"id":"1019","name":"\u65b0\u4ea8\u9547"},{"id":"1018","name":"\u9521\u573a\u9547"},{"id":"1017","name":"\u70ae\u53f0\u9547"},{"id":"1016","name":"\u8bd5\u9a8c\u533a"},{"id":"1015","name":"\u66f2\u6eaa\u9547"},{"id":"1027","name":"\u4e91\u8def\u9547"}]},{"id":"485","name":"\u666e\u5b81\u5e02","child":[{"id":"1029","name":"\u6d41\u6c99\u9547"},{"id":"1044","name":"\u5357\u6eaa\u9547"},{"id":"1043","name":"\u666e\u4fa8\u533a"},{"id":"1042","name":"\u8d64\u5c97\u9547"},{"id":"1041","name":"\u6d2a\u9633\u9547"},{"id":"1040","name":"\u5927\u575d\u9547"},{"id":"1039","name":"\u71ce\u539f\u9547"},{"id":"1038","name":"\u6c60\u5c3e\u9547"},{"id":"1037","name":"\u6eaa\u5357\u9547"},{"id":"1036","name":"\u6885\u5858\u9547"},{"id":"1035","name":"\u91cc\u6e56\u9547"},{"id":"1033","name":"\u5927\u5357\u5c71"},{"id":"1032","name":"\u519b\u57e0\u9547"},{"id":"1031","name":"\u4e0b\u67b6\u5c71"},{"id":"1030","name":"\u5360\u9647\u9547"},{"id":"1045","name":"\u5e7f\u592a\u9547"}]},{"id":"486","name":"\u63ed\u897f\u53bf","child":[{"id":"1046","name":"\u63ed\u897f\u53bf\u57ce"},{"id":"1055","name":"\u4eac\u6eaa\u56ed\u9547"},{"id":"1054","name":"\u5357\u5c71\u9547"},{"id":"1053","name":"\u7070\u5be8\u9547"},{"id":"1052","name":"\u9f99\u6f6d\u9547"},{"id":"1051","name":"\u51e4\u6c5f\u9547"},{"id":"1050","name":"\u68c9\u6e56\u9547"},{"id":"1049","name":"\u576a\u4e0a\u9547"},{"id":"1048","name":"\u91d1\u548c\u9547"},{"id":"1047","name":"\u6cb3\u5a46\u9547"},{"id":"1056","name":"\u4e94\u7ecf\u5bcc\u9547"}]},{"id":"487","name":"\u60e0\u6765\u53bf","child":[{"id":"1057","name":"\u60e0\u6765\u53bf\u57ce"},{"id":"1058","name":"\u60e0\u57ce\u9547"},{"id":"1059","name":"\u795e\u6cc9\u9547"},{"id":"1060","name":"\u9686\u6c5f\u9547"},{"id":"1061","name":"\u6eaa\u897f\u9547"},{"id":"1062","name":"\u8475\u6f6d\u9547"},{"id":"1063","name":"\u534e\u6e56\u9547"},{"id":"1064","name":"\u4e1c\u9647\u9547"}]}]},{"id":"253","name":"\u4e91\u6d6e\u5e02","child":[{"id":"4233","name":"\u90c1\u5357\u53bf "},{"id":"4234","name":"\u4e91\u5b89\u53bf "},{"id":"552","name":"\u5e02\u533a","child":[{"id":"4945","name":"\u4e91\u57ce\u533a"},{"id":"1212","name":"\u4e91\u57ce\u9547"},{"id":"1213","name":"\u9ad8\u5cf0\u9547"},{"id":"1214","name":"\u6cb3\u53e3\u9547"},{"id":"1215","name":"\u5b89\u5858\u9547"}]},{"id":"553","name":"\u7f57\u5b9a\u5e02","child":[{"id":"1216","name":"\u7f57\u57ce\u9547"},{"id":"1217","name":"\u9644\u57ce\u9547"},{"id":"1218","name":"\u7d20\u9f99\u9547"},{"id":"1219","name":"\u56f4\u5e95\u9547"}]},{"id":"554","name":"\u65b0\u5174\u53bf","child":[{"id":"1220","name":"\u65b0\u57ce\u9547"},{"id":"1221","name":"\u8f66\u5c97\u9547"},{"id":"1222","name":"\u4e1c\u57ce\u9547"}]}]},{"id":"245","name":"\u6c55\u5c3e\u5e02","child":[{"id":"4946","name":"\u9646\u6cb3\u53bf "},{"id":"449","name":"\u5e02\u533a","child":[{"id":"910","name":"\u9a6c\u5bab\u9547"},{"id":"911","name":"\u4e1c\u6d8c\u9547"},{"id":"915","name":"\u6377\u80dc\u9547"},{"id":"914","name":"\u7ea2\u8349\u9547"},{"id":"912","name":"\u7530\u4e7e\u9547"},{"id":"913","name":"\u906e\u6d6a\u9547"},{"id":"916","name":"\u7ea2\u6d77\u6e7e"}]},{"id":"909","name":"\u6d77\u4e30\u53bf","child":[{"id":"926","name":"\u6d77\u57ce\u9547"},{"id":"934","name":"\u9676\u6cb3\u9547"},{"id":"933","name":"\u53ef\u5858\u9547"},{"id":"932","name":"\u8d64\u5751\u9547"},{"id":"931","name":"\u516c\u5e73\u9547"},{"id":"930","name":"\u540e\u95e8\u9547"},{"id":"929","name":"\u6885\u9647\u9547"},{"id":"928","name":"\u9644\u57ce\u9547"},{"id":"927","name":"\u57ce\u4e1c\u9547"},{"id":"935","name":"\u83b2\u82b1\u5c71\u9547"}]},{"id":"907","name":"\u9646\u4e30\u5e02","child":[{"id":"917","name":"\u4e1c\u6d77\u9547"},{"id":"924","name":"\u6cb3\u897f\u9547"},{"id":"923","name":"\u6cb3\u4e1c\u9547"},{"id":"922","name":"\u5357\u5858\u9547"},{"id":"921","name":"\u5185\u6e56\u9547"},{"id":"920","name":"\u57ce\u4e1c\u9547"},{"id":"919","name":"\u7532\u5b50\u9547"},{"id":"908","name":"\u535a\u7f8e\u9547"},{"id":"918","name":"\u78a3\u77f3\u9547"},{"id":"925","name":"\u6f6d\u897f\u9547"}]}]},{"id":"244","name":"\u6885\u5dde\u5e02","child":[{"id":"4224","name":"\u6885\u6c5f\u533a "},{"id":"4225","name":"\u5927\u57d4\u53bf "},{"id":"4227","name":"\u4e94\u534e\u53bf "},{"id":"4228","name":"\u5e73\u8fdc\u53bf "},{"id":"4229","name":"\u8549\u5cad\u53bf "},{"id":"489","name":"\u5174\u5b81\u5e02","child":[{"id":"4895","name":"\u53f6\u5858\u9547 "},{"id":"1076","name":"\u6c38\u548c\u9547"},{"id":"1075","name":"\u5b81\u4e2d\u9547"},{"id":"1074","name":"\u6ce5\u9642\u9547"},{"id":"1073","name":"\u575c\u9642\u9547"},{"id":"1072","name":"\u5b81\u65b0\u9547"},{"id":"1071","name":"\u798f\u5174\u9547"},{"id":"1070","name":"\u65b0\u9642\u9547"},{"id":"1069","name":"\u5174\u57ce\u9547"},{"id":"1068","name":"\u6c34\u53e3\u9547"},{"id":"1067","name":"\u65b0\u5729\u9547"},{"id":"1077","name":"\u5201\u574a\u9547"}]},{"id":"490","name":"\u4e30\u987a\u53bf","child":[{"id":"1078","name":"\u4e30\u987a\u53bf\u57ce"},{"id":"1079","name":"\u6c64\u5751\u9547"},{"id":"1080","name":"\u6c64\u5357\u9547"},{"id":"1081","name":"\u9644\u57ce\u9547"}]},{"id":"491","name":"\u6885\u53bf","child":[{"id":"4880","name":"\u65b0\u53bf\u57ce "},{"id":"4884","name":"\u7572\u6c5f\u9547 "},{"id":"4883","name":"\u7a0b\u6c5f\u9547 "},{"id":"4882","name":"\u6276\u5927\u5de5\u4e1a\u56ed\u533a "},{"id":"4881","name":"\u534e\u4fa8\u57ce"},{"id":"4885","name":"\u57ce\u4e1c\u9547 "},{"id":"4886","name":"\u6c34\u8f66\u9547 "}]}]},{"id":"243","name":"\u60e0\u5dde\u5e02","child":[{"id":"4873","name":"\u60e0\u9633\u533a"},{"id":"4872","name":"\u60e0\u57ce\u533a "},{"id":"1082","name":"\u535a\u7f57\u53bf","child":[{"id":"1083","name":"\u6cf0\u7f8e\u9547"},{"id":"1093","name":"\u9ebb\u9642\u9547"},{"id":"1092","name":"\u6768\u4fa8\u9547"},{"id":"1091","name":"\u6768\u6751\u9547"},{"id":"1090","name":"\u89c2\u97f3\u9601\u9547"},{"id":"1089","name":"\u5e73\u5b89\u9547"},{"id":"1088","name":"\u77f3\u575d\u9547"},{"id":"1087","name":"\u516c\u5e84\u9547"},{"id":"1085","name":"\u7f57\u9633\u9547"},{"id":"1094","name":"\u67cf\u5858\u9547"}]},{"id":"1095","name":"\u60e0\u4e1c\u53bf"},{"id":"1107","name":"\u9f99\u95e8\u53bf","child":[{"id":"4879","name":"\u94c1\u5c97\u9547 "},{"id":"4878","name":"\u5929\u5802\u5c71\u9547 "},{"id":"4877","name":"\u5e73\u9675\u9547 "},{"id":"4876","name":"\u738b\u576a\u9547 "},{"id":"1108","name":"\u9f99\u57ce\u9547"}]}]},{"id":"234","name":"\u6df1\u5733\u5e02","child":[{"id":"501","name":"\u7f57\u6e56\u533a"},{"id":"502","name":"\u798f\u7530\u533a"},{"id":"503","name":"\u76d0\u7530\u533a"},{"id":"504","name":"\u5357\u5c71\u533a"},{"id":"505","name":"\u5b9d\u5b89\u533a"},{"id":"506","name":"\u9f99\u5c97\u533a"}]},{"id":"235","name":"\u73e0\u6d77\u5e02","child":[{"id":"507","name":"\u9999\u5dde\u533a"},{"id":"508","name":"\u91d1\u6e7e\u533a"},{"id":"509","name":"\u6597\u95e8\u533a"}]},{"id":"236","name":"\u6c55\u5934\u5e02","child":[{"id":"4042","name":"\u5357\u6fb3\u53bf "},{"id":"510","name":"\u9f99\u6e56\u533a"},{"id":"511","name":"\u6fe0\u6c5f\u533a"},{"id":"512","name":"\u91d1\u5e73\u533a"},{"id":"513","name":"\u6f84\u6d77\u533a"},{"id":"514","name":"\u6f6e\u9633\u533a"},{"id":"515","name":"\u6f6e\u5357\u533a"}]},{"id":"237","name":"\u97f6\u5173\u5e02","child":[{"id":"4043","name":"\u65b0\u4e30\u53bf "},{"id":"524","name":"\u5357\u96c4\u5e02","child":[{"id":"4887","name":"\u53e4\u5e02\u9547"},{"id":"1145","name":"\u96c4\u6d32\u9547"},{"id":"1146","name":"\u5168\u5b89\u9547"}]},{"id":"523","name":"\u7fc1\u6e90\u53bf","child":[{"id":"1143","name":"\u5b98\u6e21\u9547"}]},{"id":"522","name":"\u59cb\u5174\u53bf","child":[{"id":"4894","name":"\u987f\u5c97\u9547 "},{"id":"4893","name":"\u57ce\u5357\u9547 "},{"id":"4892","name":"\u592a\u5e73\u9547 "}]},{"id":"521","name":"\u4ec1\u5316\u53bf","child":[{"id":"4891","name":"\u8463\u5858\u9547 "},{"id":"4890","name":"\u51e1\u53e3\u9547 "},{"id":"4889","name":"\u4ec1\u5316\u9547 "}]},{"id":"520","name":"\u4e73\u6e90\u7476\u65cf\u81ea\u6cbb\u53bf","child":[{"id":"1136","name":"\u4e73\u57ce\u9547"},{"id":"1137","name":"\u4faf\u516c\u6e21\u9547"},{"id":"1138","name":"\u9644\u57ce\u9547"}]},{"id":"519","name":"\u4e50\u660c\u5e02","child":[{"id":"1132","name":"\u4e50\u57ce\u9547"},{"id":"1133","name":"\u6cb3\u5357\u9547"},{"id":"1134","name":"\u957f\u6765\u9547"},{"id":"1135","name":"\u5317\u4e61\u9547"}]},{"id":"518","name":"\u66f2\u6c5f\u533a"},{"id":"517","name":"\u6d48\u6c5f\u533a"},{"id":"516","name":"\u6b66\u6c5f\u533a"}]},{"id":"238","name":"\u4f5b\u5c71\u5e02","child":[{"id":"525","name":"\u7985\u57ce\u533a"},{"id":"526","name":"\u5357\u6d77\u533a"},{"id":"527","name":"\u9ad8\u660e\u533a"},{"id":"528","name":"\u4e09\u6c34\u533a"},{"id":"529","name":"\u987a\u5fb7\u5e02"}]},{"id":"239","name":"\u6c5f\u95e8\u5e02","child":[{"id":"530","name":"\u84ec\u6c5f\u533a"},{"id":"531","name":"\u6c5f\u6d77\u533a"},{"id":"532","name":"\u65b0\u4f1a\u533a"},{"id":"533","name":"\u5f00\u5e73\u5e02","child":[{"id":"1147","name":"\u957f\u6c99\u533a"},{"id":"1157","name":"\u82cd\u57ce\u9547"},{"id":"1156","name":"\u9f99\u80dc\u9547"},{"id":"1155","name":"\u6c99\u5858\u9547"},{"id":"1154","name":"\u5858\u53e3\u9547"},{"id":"1153","name":"\u8d64\u574e\u9547"},{"id":"1152","name":"\u6c34\u4e95\u9547"},{"id":"1151","name":"\u6708\u5c71\u9547"},{"id":"1150","name":"\u6c99\u5c97"},{"id":"1149","name":"\u6c34\u53e3\u9547"},{"id":"1148","name":"\u4e09\u57e0\u533a"},{"id":"1158","name":"\u767e\u5408\u9547"}]},{"id":"534","name":"\u53f0\u5c71\u5e02","child":[{"id":"1160","name":"\u53f0\u57ce\u9547"},{"id":"1170","name":"\u5927\u6c5f\u9547"},{"id":"1169","name":"\u516c\u76ca\u9547"},{"id":"1168","name":"\u6597\u5c71\u9547"},{"id":"1167","name":"\u4e09\u5408\u9547"},{"id":"1166","name":"\u56db\u4e5d\u9547"},{"id":"1165","name":"\u51b2\u848c\u9547"},{"id":"1164","name":"\u5e7f\u6d77\u9547"},{"id":"1163","name":"\u7aef\u82ac\u9547"},{"id":"1162","name":"\u6c34\u6b65\u9547"},{"id":"1161","name":"\u9644\u57ce\u9547"},{"id":"1171","name":"\u4e09\u516b\u9547"}]},{"id":"535","name":"\u6069\u5e73\u5e02","child":[{"id":"1172","name":"\u6069\u57ce\u9547"},{"id":"1173","name":"\u725b\u6c5f\u9547"},{"id":"1174","name":"\u4e1c\u6210\u9547"},{"id":"1175","name":"\u541b\u5802\u9547"},{"id":"1176","name":"\u5723\u5802\u9547"},{"id":"1177","name":"\u6c5f\u6d32\u9547"},{"id":"1178","name":"\u6c99\u6e56\u9547"},{"id":"1179","name":"\u5927\u69d0\u9547"}]},{"id":"536","name":"\u9e64\u5c71\u5e02"}]},{"id":"240","name":"\u6e5b\u6c5f\u5e02","child":[{"id":"537","name":"\u8d64\u574e\u533a"},{"id":"545","name":"\u96f7\u5dde\u5e02","child":[{"id":"1189","name":"\u96f7\u57ce\u9547"}]},{"id":"544","name":"\u5ec9\u6c5f\u5e02","child":[{"id":"1185","name":"\u5ec9\u57ce\u9547"},{"id":"1186","name":"\u4e5d\u6d32\u6c5f\u5f00\u53d1\u533a"},{"id":"1187","name":"\u77f3\u57ce\u9547"},{"id":"1188","name":"\u6cb3\u5507\u9547"}]},{"id":"543","name":"\u5434\u5ddd\u5e02","child":[{"id":"1181","name":"\u6885\u5f55\u9547"},{"id":"1182","name":"\u5858\u5c3e\u9547"},{"id":"1183","name":"\u535a\u94fa\u9547"},{"id":"1184","name":"\u5927\u5c71\u6c5f\u9547"}]},{"id":"542","name":"\u9042\u6eaa\u53bf","child":[{"id":"1180","name":"\u9042\u57ce\u9547"}]},{"id":"541","name":"\u6e5b\u6c5f\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"540","name":"\u5761\u5934\u533a"},{"id":"539","name":"\u9ebb\u7ae0\u533a"},{"id":"538","name":"\u971e\u5c71\u533a"},{"id":"546","name":"\u5f90\u95fb\u53bf","child":[{"id":"1190","name":"\u5f90\u57ce\u9547"}]}]},{"id":"241","name":"\u8302\u540d\u5e02","child":[{"id":"4217","name":"\u8302\u5357\u533a "},{"id":"4218","name":"\u8302\u6e2f\u533a "},{"id":"548","name":"\u5316\u5dde\u5e02","child":[{"id":"1194","name":"\u6cb3\u4e1c\u533a"},{"id":"1195","name":"\u6cb3\u897f\u533a"},{"id":"1196","name":"\u4e1c\u5c71\u533a"},{"id":"1197","name":"\u4e0b\u90ed\u5f00\u53d1\u533a"},{"id":"1198","name":"\u9274\u6c5f\u5f00\u53d1\u533a"}]},{"id":"549","name":"\u9ad8\u5dde\u5e02","child":[{"id":"4855","name":"\u77f3\u9f13\u9547 "},{"id":"4856","name":"\u4f4e\u5761\u7ba1\u7406\u533a "},{"id":"1199","name":"\u4e2d\u5c71\u533a"},{"id":"1200","name":"\u5357\u6e56\u533a"},{"id":"1201","name":"\u897f\u5cb8\u533a"},{"id":"1202","name":"\u5c71\u7f8e\u533a"},{"id":"1203","name":"\u77f3\u4ed4\u5cad\u533a"},{"id":"1204","name":"\u91d1\u5c71\u5f00\u53d1\u533a"}]},{"id":"550","name":"\u4fe1\u5b9c\u5e02","child":[{"id":"1205","name":"\u4e1c\u9547\u9547"},{"id":"1206","name":"\u6c60\u578c\u9547"}]},{"id":"551","name":"\u7535\u767d\u53bf","child":[{"id":"1207","name":"\u6c34\u4e1c\u9547"},{"id":"1208","name":"\u4e03\u8ff3\u9547"},{"id":"1209","name":"\u9648\u6751\u9547"},{"id":"1210","name":"\u5357\u6d77\u9547"}]}]},{"id":"242","name":"\u8087\u5e86\u5e02","child":[{"id":"4219","name":"\u7aef\u5dde\u533a "},{"id":"4220","name":"\u9f0e\u6e56\u533a "},{"id":"4222","name":"\u6000\u96c6\u53bf "},{"id":"4223","name":"\u5c01\u5f00\u53bf"},{"id":"4903","name":"\u5927\u65fa\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a "},{"id":"497","name":"\u9ad8\u8981\u5e02","child":[{"id":"1114","name":"\u86ac\u5c97\u9547"},{"id":"1126","name":"\u56de\u9f99"},{"id":"1125","name":"\u83b2\u5858\u9547"},{"id":"1124","name":"\u86df\u5858\u9547"},{"id":"1123","name":"\u767d\u8bf8\u9547"},{"id":"1122","name":"\u5c0f\u6e58\u9547"},{"id":"1121","name":"\u767d\u571f\u9547"},{"id":"1120","name":"\u91d1\u5229\u9547"},{"id":"1119","name":"\u91d1\u6e21\u9547"},{"id":"1117","name":"\u65b0\u6865\u9547"},{"id":"1116","name":"\u9a6c\u5b89\u9547"},{"id":"1115","name":"\u5357\u5cb8\u9547"},{"id":"1127","name":"\u5927\u6e7e\u9547"}]},{"id":"498","name":"\u56db\u4f1a\u5e02"},{"id":"499","name":"\u5e7f\u5b81\u53bf","child":[{"id":"1128","name":"\u5357\u8857\u9547"},{"id":"1129","name":"\u77f3\u6da7\u9547"}]},{"id":"500","name":"\u5fb7\u5e86\u53bf","child":[{"id":"1130","name":"\u5fb7\u57ce\u9547"},{"id":"1131","name":"\u65b0\u5729\u9547"}]}]},{"id":"233","name":"\u5e7f\u5dde\u5e02","child":[{"id":"4853","name":"\u4ece\u5316\u5e02"},{"id":"419","name":"\u5929\u6cb3\u533a"},{"id":"428","name":"\u5357\u6c99\u533a"},{"id":"427","name":"\u841d\u5c97\u533a"},{"id":"426","name":"\u756a\u79ba\u533a"},{"id":"425","name":"\u82b1\u90fd\u533a"},{"id":"424","name":"\u9ec4\u57d4\u533a"},{"id":"423","name":"\u767d\u4e91\u533a"},{"id":"422","name":"\u8354\u6e7e\u533a"},{"id":"421","name":"\u6d77\u73e0\u533a"},{"id":"420","name":"\u8d8a\u79c0\u533a"},{"id":"430","name":"\u589e\u57ce\u5e02"}]}]},{"id":"21","name":"\u5e7f\u897f\u58ee\u65cf\u81ea\u6cbb\u533a","child":[{"id":"254","name":"\u5357\u5b81\u5e02","child":[{"id":"6017","name":"\u4e94\u8c61\u65b0\u533a"},{"id":"4050","name":"\u6a2a\u53bf "},{"id":"4049","name":"\u5bbe\u9633\u53bf "},{"id":"4048","name":"\u4e0a\u6797\u53bf "},{"id":"4047","name":"\u9a6c\u5c71\u53bf "},{"id":"4046","name":"\u9686\u5b89\u53bf "},{"id":"4045","name":"\u6b66\u9e23\u53bf "},{"id":"4044","name":"\u9095\u5b81\u533a  "},{"id":"559","name":"\u9752\u79c0\u533a"},{"id":"558","name":"\u826f\u5e86\u533a"},{"id":"557","name":"\u5174\u5b81\u533a"},{"id":"556","name":"\u6c5f\u5357\u533a"},{"id":"555","name":"\u897f\u4e61\u5858\u533a"}]},{"id":"266","name":"\u6765\u5bbe\u5e02","child":[{"id":"4121","name":"\u5174\u5bbe\u533a "},{"id":"4122","name":"\u5ffb\u57ce\u53bf "},{"id":"4123","name":"\u8c61\u5dde\u53bf "},{"id":"4124","name":"\u6b66\u5ba3\u53bf "},{"id":"4125","name":"\u91d1\u79c0\u7476\u65cf\u81ea\u6cbb\u53bf "},{"id":"4126","name":"\u5408\u5c71\u5e02 "}]},{"id":"265","name":"\u6cb3\u6c60\u5e02","child":[{"id":"4110","name":"\u91d1\u57ce\u6c5f\u533a  "},{"id":"4119","name":"\u5927\u5316\u7476\u65cf\u81ea\u6cbb\u53bf "},{"id":"4118","name":"\u90fd\u5b89\u7476\u65cf\u81ea\u6cbb\u53bf "},{"id":"4117","name":"\u5df4\u9a6c\u7476\u65cf\u81ea\u6cbb\u53bf "},{"id":"4116","name":"\u73af\u6c5f\u6bdb\u5357\u65cf\u81ea\u6cbb\u53bf "},{"id":"4115","name":"\u7f57\u57ce\u4eeb\u4f6c\u65cf\u81ea\u6cbb\u53bf "},{"id":"4114","name":"\u4e1c\u5170\u53bf "},{"id":"4113","name":"\u51e4\u5c71\u53bf "},{"id":"4112","name":"\u5929\u5ce8\u53bf "},{"id":"4111","name":"\u5357\u4e39\u53bf "},{"id":"4120","name":"\u5b9c\u5dde\u5e02 "}]},{"id":"264","name":"\u8d3a\u5dde\u5e02","child":[{"id":"4106","name":"\u516b\u6b65\u533a "},{"id":"4107","name":"\u662d\u5e73\u53bf "},{"id":"4108","name":"\u949f\u5c71\u53bf "},{"id":"4109","name":"\u5bcc\u5ddd\u7476\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"263","name":"\u767e\u8272\u5e02","child":[{"id":"4094","name":"\u53f3\u6c5f\u533a "},{"id":"4104","name":"\u897f\u6797\u53bf "},{"id":"4103","name":"\u7530\u6797\u53bf "},{"id":"4102","name":"\u4e50\u4e1a\u53bf "},{"id":"4101","name":"\u51cc\u4e91\u53bf "},{"id":"4100","name":"\u90a3\u5761\u53bf "},{"id":"4099","name":"\u9756\u897f\u53bf "},{"id":"4098","name":"\u5fb7\u4fdd\u53bf "},{"id":"4097","name":"\u5e73\u679c\u53bf "},{"id":"4096","name":"\u7530\u4e1c\u53bf "},{"id":"4095","name":"\u7530\u9633\u53bf  "},{"id":"4105","name":"\u9686\u6797\u5404\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"262","name":"\u7389\u6797\u5e02","child":[{"id":"4088","name":"\u7389\u5dde\u533a  "},{"id":"4089","name":"\u5bb9\u53bf "},{"id":"4090","name":"\u9646\u5ddd\u53bf "},{"id":"4091","name":"\u535a\u767d\u53bf "},{"id":"4092","name":"\u5174\u4e1a\u53bf "},{"id":"4093","name":"\u5317\u6d41\u5e02 "},{"id":"5914","name":"\u798f\u7ef5\u533a"}]},{"id":"261","name":"\u8d35\u6e2f\u5e02","child":[{"id":"4083","name":"\u6e2f\u5317\u533a "},{"id":"4084","name":"\u6e2f\u5357\u533a  "},{"id":"4085","name":"\u8983\u5858\u533a "},{"id":"4086","name":"\u5e73\u5357\u53bf "},{"id":"4087","name":"\u6842\u5e73\u5e02 "}]},{"id":"260","name":"\u94a6\u5dde\u5e02","child":[{"id":"4079","name":"\u94a6\u5357\u533a "},{"id":"4080","name":"\u94a6\u5317\u533a "},{"id":"4081","name":"\u7075\u5c71\u53bf "},{"id":"4082","name":"\u6d66\u5317\u53bf "}]},{"id":"259","name":"\u9632\u57ce\u6e2f\u5e02","child":[{"id":"4075","name":"\u6e2f\u53e3\u533a "},{"id":"4076","name":"\u9632\u57ce\u533a "},{"id":"4077","name":"\u4e0a\u601d\u53bf "},{"id":"4078","name":"\u4e1c\u5174\u5e02 "}]},{"id":"258","name":"\u5317\u6d77\u5e02","child":[{"id":"4071","name":"\u6d77\u57ce\u533a "},{"id":"4072","name":"\u94f6\u6d77\u533a "},{"id":"4073","name":"\u94c1\u5c71\u6e2f\u533a "},{"id":"4074","name":"\u5408\u6d66\u53bf "}]},{"id":"257","name":"\u68a7\u5dde\u5e02","child":[{"id":"4068","name":"\u85e4\u53bf "},{"id":"4069","name":"\u8499\u5c71\u53bf "},{"id":"4070","name":"\u5c91\u6eaa\u5e02 "},{"id":"564","name":"\u957f\u6d32\u533a"},{"id":"565","name":"\u4e07\u79c0\u533a"},{"id":"566","name":"\u789f\u5c71\u533a"},{"id":"567","name":"\u82cd\u68a7\u53bf","child":[{"id":"1226","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1227","name":"\u9f99\u5729\u9547"}]}]},{"id":"256","name":"\u6842\u6797\u5e02","child":[{"id":"4067","name":"\u606d\u57ce\u7476\u65cf\u81ea\u6cbb\u53bf "},{"id":"4066","name":"\u8354\u6d66\u53bf "},{"id":"4065","name":"\u5e73\u4e50\u53bf "},{"id":"4064","name":"\u8d44\u6e90\u53bf "},{"id":"4063","name":"\u9f99\u80dc\u5404\u65cf\u81ea\u6cbb\u53bf "},{"id":"4062","name":"\u704c\u9633\u53bf "},{"id":"4061","name":"\u6c38\u798f\u53bf "},{"id":"4060","name":"\u5174\u5b89\u53bf  "},{"id":"4059","name":"\u5168\u5dde\u53bf "},{"id":"4057","name":"\u9633\u6714\u53bf "},{"id":"574","name":"\u4e34\u6842\u53bf","child":[{"id":"1224","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1225","name":"\u4e34\u6842\u9547"}]},{"id":"573","name":"\u7075\u5ddd\u53bf","child":[{"id":"5913","name":"\u7075\u5ddd\u9547"},{"id":"1223","name":"\u516b\u91cc\u8857\u7ecf\u6d4e\u5f00\u53d1\u533a"}]},{"id":"572","name":"\u96c1\u5c71\u533a"},{"id":"571","name":"\u8c61\u5c71\u533a"},{"id":"570","name":"\u79c0\u5cf0\u533a"},{"id":"569","name":"\u53e0\u5f69\u533a"},{"id":"568","name":"\u4e03\u661f\u533a"}]},{"id":"255","name":"\u67f3\u5dde\u5e02","child":[{"id":"4056","name":"\u4e09\u6c5f\u4f97\u65cf\u81ea\u6cbb\u53bf "},{"id":"4055","name":"\u878d\u6c34\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4054","name":"\u878d\u5b89\u53bf "},{"id":"4053","name":"\u9e7f\u5be8\u53bf "},{"id":"4052","name":"\u67f3\u57ce\u53bf  "},{"id":"4051","name":"\u67f3\u6c5f\u53bf ","child":[{"id":"5911","name":"\u57fa\u9686\u5f00\u53d1\u533a"},{"id":"5912","name":"\u5f00\u53d1\u533a "}]},{"id":"563","name":"\u9c7c\u5cf0\u533a"},{"id":"562","name":"\u67f3\u5357\u533a"},{"id":"561","name":"\u57ce\u4e2d\u533a"},{"id":"560","name":"\u67f3\u5317\u533a"}]},{"id":"267","name":"\u5d07\u5de6\u5e02","child":[{"id":"4127","name":"\u6c5f\u6d32\u533a "},{"id":"4128","name":"\u6276\u7ee5\u53bf  "},{"id":"4129","name":"\u5b81\u660e\u53bf "},{"id":"4130","name":"\u9f99\u5dde\u53bf "},{"id":"4131","name":"\u5927\u65b0\u53bf "},{"id":"4132","name":"\u5929\u7b49\u53bf "},{"id":"4133","name":"\u51ed\u7965\u5e02 "}]}]},{"id":"22","name":"\u6d77\u5357\u7701","child":[{"id":"5997","name":"\u6d0b\u6d66\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"4143","name":"\u743c\u4e2d\u9ece\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4142","name":"\u4fdd\u4ead\u9ece\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4141","name":"\u9675\u6c34\u9ece\u65cf\u81ea\u6cbb\u53bf "},{"id":"4140","name":"\u4e34\u9ad8\u53bf "},{"id":"4139","name":"\u4e50\u4e1c\u9ece\u65cf\u81ea\u6cbb\u53bf "},{"id":"4138","name":"\u5b9a\u5b89\u53bf "},{"id":"4137","name":"\u6f84\u8fc8\u53bf "},{"id":"4136","name":"\u660c\u6c5f\u9ece\u65cf\u81ea\u6cbb\u53bf "},{"id":"4135","name":"\u5c6f\u660c\u53bf "},{"id":"4134","name":"\u767d\u6c99\u9ece\u65cf\u81ea\u6cbb\u53bf  "},{"id":"2042","name":"\u4e94\u6307\u5c71\u5e02"},{"id":"2041","name":"\u4e1c\u65b9\u5e02"},{"id":"2040","name":"\u510b\u5dde\u5e02"},{"id":"2039","name":"\u743c\u6d77\u5e02"},{"id":"2038","name":"\u6587\u660c\u5e02"},{"id":"2037","name":"\u4e07\u5b81\u5e02"},{"id":"2036","name":"\u4e09\u4e9a\u5e02"},{"id":"268","name":"\u6d77\u53e3\u5e02","child":[{"id":"575","name":"\u9f99\u534e\u533a"},{"id":"576","name":"\u743c\u5c71\u533a"},{"id":"577","name":"\u7f8e\u5170\u533a"},{"id":"578","name":"\u79c0\u82f1\u533a"},{"id":"579","name":"\u6e2f\u6fb3\u5f00\u53d1\u533a"}]}]},{"id":"23","name":"\u91cd\u5e86\u5e02","child":[{"id":"2544","name":"\u4e07\u5dde\u533a"},{"id":"2573","name":"\u57ab\u6c5f\u53bf"},{"id":"2572","name":"\u4e30\u90fd\u53bf"},{"id":"2571","name":"\u57ce\u53e3\u53bf "},{"id":"2570","name":"\u6881\u5e73\u53bf"},{"id":"2569","name":"\u74a7\u5c71\u53bf","child":[{"id":"5915","name":"\u9752\u6760\u9547"}]},{"id":"2568","name":"\u8363\u660c\u53bf"},{"id":"2567","name":"\u5927\u8db3\u53bf"},{"id":"2566","name":"\u94dc\u6881\u53bf"},{"id":"2574","name":"\u6b66\u9686\u53bf"},{"id":"2575","name":"\u5fe0\u53bf"},{"id":"2583","name":"\u9149\u9633\u571f\u5bb6\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf"},{"id":"2582","name":"\u79c0\u5c71\u571f\u5bb6\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf"},{"id":"2581","name":"\u77f3\u67f1\u571f\u5bb6\u65cf\u81ea\u6cbb\u53bf"},{"id":"2580","name":"\u5deb\u6eaa\u53bf"},{"id":"2579","name":"\u5deb\u5c71\u53bf"},{"id":"2578","name":"\u5949\u8282\u53bf"},{"id":"2577","name":"\u4e91\u9633\u53bf"},{"id":"2576","name":"\u5f00\u53bf"},{"id":"2565","name":"\u6f7c\u5357\u53bf"},{"id":"2564","name":"\u7da6\u6c5f\u53bf"},{"id":"2553","name":"\u5317\u789a\u533a"},{"id":"2552","name":"\u5357\u5cb8\u533a"},{"id":"2550","name":"\u6c99\u576a\u575d\u533a"},{"id":"2549","name":"\u6c5f\u5317\u533a"},{"id":"2548","name":"\u5927\u6e21\u53e3\u533a"},{"id":"2547","name":"\u6e1d\u4e2d\u533a"},{"id":"2551","name":"\u4e5d\u9f99\u5761\u533a"},{"id":"2545","name":"\u6daa\u9675\u533a"},{"id":"2554","name":"\u4e07\u76db\u533a"},{"id":"2555","name":"\u53cc\u6865\u533a"},{"id":"2563","name":"\u5357\u5ddd\u533a"},{"id":"2562","name":"\u6c38\u5ddd\u533a"},{"id":"2561","name":"\u5408\u5ddd\u533a"},{"id":"2560","name":"\u6c5f\u6d25\u533a"},{"id":"2559","name":"\u957f\u5bff\u533a"},{"id":"2558","name":"\u9ed4\u6c5f\u533a"},{"id":"2557","name":"\u5df4\u5357\u533a"},{"id":"2556","name":"\u6e1d\u5317\u533a"},{"id":"2584","name":"\u5f6d\u6c34\u82d7\u65cf\u571f\u5bb6\u65cf\u81ea\u6cbb\u53bf"}]},{"id":"24","name":"\u56db\u5ddd\u7701","child":[{"id":"5981","name":"\u897f\u660c\u5e02"},{"id":"284","name":"\u5e7f\u5b89\u5e02"},{"id":"285","name":"\u8fbe\u5dde\u5e02"},{"id":"286","name":"\u7709\u5c71\u5e02","child":[{"id":"6024","name":"\u6d2a\u96c5\u53bf"},{"id":"6062","name":"\u5f6d\u5c71\u53bf"},{"id":"607","name":"\u7709\u5c71\u5e02\u533a"},{"id":"1262","name":"\u4e1c\u5761\u533a"}]},{"id":"287","name":"\u96c5\u5b89\u5e02","child":[{"id":"5998","name":"\u8365\u7ecf\u53bf"},{"id":"6020","name":"\u77f3\u68c9\u53bf"},{"id":"6064","name":"\u540d\u5c71\u533a"},{"id":"6070","name":"\u6c49\u6e90\u53bf"},{"id":"608","name":"\u96e8\u57ce\u533a"}]},{"id":"288","name":"\u5df4\u4e2d\u5e02","child":[{"id":"5994","name":"\u5357\u6c5f\u53bf"},{"id":"6054","name":"\u5df4\u5dde\u533a"}]},{"id":"289","name":"\u8d44\u9633\u5e02"},{"id":"290","name":"\u963f\u575d\u85cf\u65cf\u7f8c\u65cf\u81ea\u6cbb\u5dde"},{"id":"291","name":"\u7518\u5b5c\u85cf\u65cf\u81ea\u6cbb\u5dde"},{"id":"292","name":"\u51c9\u5c71\u5f5d\u65cf\u81ea\u6cbb\u5dde"},{"id":"283","name":"\u5b9c\u5bbe\u5e02","child":[{"id":"5928","name":"\u5357\u5cb8"},{"id":"4204","name":"\u5c4f\u5c71\u53bf "},{"id":"4203","name":"\u5174\u6587\u53bf "},{"id":"4202","name":"\u7b60\u8fde\u53bf "},{"id":"4201","name":"\u73d9\u53bf "},{"id":"4200","name":"\u9ad8\u53bf "},{"id":"4199","name":"\u957f\u5b81\u53bf "},{"id":"4198","name":"\u6c5f\u5b89\u53bf "},{"id":"4197","name":"\u5357\u6eaa\u53bf "},{"id":"612","name":"\u5b9c\u5bbe\u53bf","child":[{"id":"1263","name":"\u67cf\u6eaa\u9547"}]},{"id":"611","name":"\u6c5f\u5317\u533a"},{"id":"610","name":"\u76d0\u576a\u575d\u533a"},{"id":"609","name":"\u7fe0\u5c4f\u533a"}]},{"id":"282","name":"\u5357\u5145\u5e02","child":[{"id":"4191","name":"\u5357\u90e8\u53bf  "},{"id":"4192","name":"\u8425\u5c71\u53bf "},{"id":"4193","name":"\u84ec\u5b89\u53bf "},{"id":"4194","name":"\u4eea\u9647\u53bf "},{"id":"4195","name":"\u897f\u5145\u53bf "},{"id":"4196","name":"\u9606\u4e2d\u5e02 "},{"id":"613","name":"\u987a\u5e86\u533a"},{"id":"614","name":"\u9ad8\u576a\u533a"},{"id":"615","name":"\u5609\u9675\u533a"}]},{"id":"273","name":"\u81ea\u8d21\u5e02","child":[{"id":"4150","name":"\u8363\u53bf "},{"id":"4151","name":"\u5bcc\u987a\u53bf "},{"id":"619","name":"\u6c47\u4e1c\u65b0\u533a"},{"id":"620","name":"\u81ea\u6d41\u4e95\u533a"},{"id":"621","name":"\u5927\u5b89\u533a"},{"id":"623","name":"\u8d21\u4e95\u533a"},{"id":"624","name":"\u6cbf\u6ee9\u533a"}]},{"id":"274","name":"\u6500\u679d\u82b1\u5e02","child":[{"id":"4152","name":"\u4e1c\u533a "},{"id":"4153","name":"\u897f\u533a "},{"id":"4154","name":"\u4ec1\u548c\u533a "},{"id":"4155","name":"\u7c73\u6613\u53bf "},{"id":"4156","name":"\u76d0\u8fb9\u53bf "}]},{"id":"275","name":"\u6cf8\u5dde\u5e02","child":[{"id":"4157","name":"\u5408\u6c5f\u53bf "},{"id":"4158","name":"\u53d9\u6c38\u53bf "},{"id":"4159","name":"\u53e4\u853a\u53bf "},{"id":"625","name":"\u6c5f\u9633\u533a"},{"id":"629","name":"\u6cf8\u53bf","child":[{"id":"1268","name":"\u798f\u96c6\u9547"}]},{"id":"627","name":"\u9f99\u9a6c\u6f6d\u533a"},{"id":"628","name":"\u7eb3\u6eaa\u533a"}]},{"id":"276","name":"\u5fb7\u9633\u5e02","child":[{"id":"4160","name":"\u4e2d\u6c5f\u53bf"},{"id":"4161","name":"\u7f57\u6c5f\u53bf"},{"id":"5925","name":"\u5929\u5143\u5f00\u53d1\u533a"},{"id":"5926","name":"\u65cc\u6e56\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"630","name":"\u65cc\u9633\u533a"},{"id":"633","name":"\u5e7f\u6c49\u5e02","child":[{"id":"1273","name":"\u5c0f\u6c49\u9547"},{"id":"1274","name":"\u96d2\u57ce\u9547"},{"id":"1275","name":"\u65b0\u4e30\u9547"},{"id":"1276","name":"\u4e07\u798f\u9547"},{"id":"1277","name":"\u5317\u5916\u4e61"},{"id":"1278","name":"\u5411\u9633\u9547"},{"id":"1279","name":"\u897f\u5916\u4e61"},{"id":"1280","name":"\u4e1c\u5357\u4e61"}]},{"id":"634","name":"\u7ef5\u7af9\u5e02","child":[{"id":"6077","name":"\u7389\u6cc9\u9547"},{"id":"1281","name":"\u5251\u5357\u9547"},{"id":"1282","name":"\u6e05\u9053\u9547"},{"id":"1283","name":"\u4e1c\u5317\u9547"},{"id":"1284","name":"\u897f\u5357\u9547"}]},{"id":"635","name":"\u4ec0\u90a1\u5e02","child":[{"id":"1285","name":"\u65b9\u4ead\u9547"},{"id":"1286","name":"\u56de\u6f9c\u9547"},{"id":"1287","name":"\u7682\u89d2\u9547"},{"id":"1288","name":"\u5143\u77f3\u9547"}]}]},{"id":"277","name":"\u7ef5\u9633\u5e02","child":[{"id":"4167","name":"\u76d0\u4ead\u53bf "},{"id":"4163","name":"\u5e73\u6b66\u53bf"},{"id":"4166","name":"\u6893\u6f7c\u53bf "},{"id":"4164","name":"\u5b89\u53bf"},{"id":"4165","name":"\u5317\u5ddd\u53bf "},{"id":"5927","name":"\u9ad8\u65b0\u533a"},{"id":"640","name":"\u6c5f\u6cb9\u5e02","child":[{"id":"1294","name":"\u6c5f\u6cb9\u5e02\u533a"}]},{"id":"639","name":"\u6e38\u4ed9\u533a"},{"id":"638","name":"\u6daa\u57ce\u533a"},{"id":"637","name":"\u7ecf\u5f00\u533a"},{"id":"641","name":"\u4e09\u53f0\u53bf","child":[{"id":"1295","name":"\u53bf\u57ce\u4e2d\u5fc3"}]}]},{"id":"278","name":"\u5e7f\u5143\u5e02","child":[{"id":"4168","name":"\u5e02\u4e2d\u533a "},{"id":"4169","name":"\u5143\u575d\u533a "},{"id":"4170","name":"\u671d\u5929\u533a "},{"id":"4171","name":"\u65fa\u82cd\u53bf "},{"id":"4172","name":"\u9752\u5ddd\u53bf "},{"id":"4173","name":"\u5251\u9601\u53bf "},{"id":"4174","name":"\u82cd\u6eaa\u53bf "}]},{"id":"279","name":"\u9042\u5b81\u5e02","child":[{"id":"4175","name":"\u5b89\u5c45\u533a "},{"id":"4176","name":"\u84ec\u6eaa\u53bf "},{"id":"4177","name":"\u5c04\u6d2a\u53bf "},{"id":"4178","name":"\u5927\u82f1\u53bf "},{"id":"642","name":"\u8239\u5c71\u533a"}]},{"id":"280","name":"\u5185\u6c5f\u5e02","child":[{"id":"4179","name":"\u5a01\u8fdc\u53bf  "},{"id":"4180","name":"\u8d44\u4e2d\u53bf "},{"id":"643","name":"\u5e02\u4e2d\u533a"},{"id":"644","name":"\u4e1c\u5174\u533a"},{"id":"645","name":"\u9686\u660c\u53bf","child":[{"id":"1297","name":"\u53bf\u57ce\u4e2d\u5fc3"}]}]},{"id":"281","name":"\u4e50\u5c71\u5e02","child":[{"id":"4190","name":"\u5ce8\u7709\u5c71\u5e02 "},{"id":"4189","name":"\u9a6c\u8fb9\u5f5d\u65cf\u81ea\u6cbb\u53bf "},{"id":"4188","name":"\u5ce8\u8fb9\u5f5d\u65cf\u81ea\u6cbb\u53bf "},{"id":"4187","name":"\u6c90\u5ddd\u53bf "},{"id":"4186","name":"\u5939\u6c5f\u53bf  "},{"id":"4185","name":"\u4e95\u7814\u53bf "},{"id":"4184","name":"\u728d\u4e3a\u53bf "},{"id":"4183","name":"\u91d1\u53e3\u6cb3\u533a "},{"id":"4181","name":"\u6c99\u6e7e\u533a  "},{"id":"618","name":"\u5e02\u4e2d\u533a"},{"id":"617","name":"\u4e94\u901a\u6865\u533a"},{"id":"616","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"272","name":"\u6210\u90fd\u5e02","child":[{"id":"6004","name":"\u6210\u90fd\u9ad8\u65b0\u533a"},{"id":"4144","name":"\u9752\u767d\u6c5f\u533a"},{"id":"4145","name":"\u91d1\u5802\u53bf","child":[{"id":"5917","name":"\u8001\u57ce\u533a"},{"id":"5918","name":"\u65b0\u57ce\u533a"}]},{"id":"4146","name":"\u5927\u9091\u53bf","child":[{"id":"5919","name":"\u664b\u539f\u9547"},{"id":"5920","name":"\u738b\u6cd7\u9547"},{"id":"5921","name":"\u5b89\u4ec1\u9547"},{"id":"5922","name":"\u82cf\u5bb6\u9547"}]},{"id":"4147","name":"\u6d66\u6c5f\u53bf"},{"id":"4148","name":"\u5f6d\u5dde\u5e02 "},{"id":"4149","name":"\u909b\u5d03\u5e02 ","child":[{"id":"5923","name":"\u53bf\u57ce"},{"id":"5924","name":"\u5b89\u5b81\u9547\u4e2d\u5fc3 "}]},{"id":"606","name":"\u65b0\u6d25\u53bf","child":[{"id":"6069","name":"\u4e94\u6d25\u9547"},{"id":"1257","name":"\u65b0\u5e73\u9547"},{"id":"1258","name":"\u9093\u53cc\u9547"},{"id":"1259","name":"\u82b1\u6865\u9547"},{"id":"1260","name":"\u5174\u4e50\u9547"},{"id":"1261","name":"\u82b1\u6e90\u9547"}]},{"id":"605","name":"\u5d07\u5dde\u5e02","child":[{"id":"5916","name":"\u5e02\u533a"}]},{"id":"604","name":"\u90fd\u6c5f\u5830\u5e02","child":[{"id":"1247","name":"\u704c\u53e3\u9547"},{"id":"1248","name":"\u5e78\u798f\u9547"},{"id":"1249","name":"\u80e5\u5bb6\u9547"},{"id":"1250","name":"\u84b2\u9633\u9547"},{"id":"1251","name":"\u7389\u5802\u9547"},{"id":"1252","name":"\u4e2d\u5174\u9547"},{"id":"1253","name":"\u9752\u57ce\u5c71\u9547"},{"id":"1254","name":"\u77f3\u7f8a\u9547"},{"id":"1255","name":"\u805a\u6e90\u9547"}]},{"id":"603","name":"\u90eb\u53bf","child":[{"id":"1241","name":"\u7280\u6d66\u9547"},{"id":"1242","name":"\u7ea2\u5149\u9547"},{"id":"1243","name":"\u90eb\u7b80\u9547"},{"id":"1244","name":"\u56e2\u7ed3\u9547"},{"id":"1245","name":"\u5b89\u9756\u9547"},{"id":"1246","name":"\u5fb7\u6e90\u9547"}]},{"id":"602","name":"\u53cc\u6d41\u53bf","child":[{"id":"1231","name":"\u4e1c\u5347\u9547"},{"id":"1239","name":"\u9ec4\u6c34\u9547"},{"id":"1238","name":"\u5f6d\u9547"},{"id":"1237","name":"\u516c\u5174\u9547"},{"id":"1236","name":"\u673a\u573a\u5de5\u4e1a\u533a"},{"id":"1235","name":"\u6587\u661f\u9547"},{"id":"1234","name":"\u534e\u9633\u9547"},{"id":"1233","name":"\u4e2d\u548c\u9547"},{"id":"1232","name":"\u4e5d\u6c5f\u9547"},{"id":"1240","name":"\u9ec4\u7532\u9547"}]},{"id":"594","name":"\u9752\u7f8a\u533a"},{"id":"595","name":"\u91d1\u725b\u533a"},{"id":"596","name":"\u6210\u534e\u533a"},{"id":"597","name":"\u9526\u6c5f\u533a"},{"id":"598","name":"\u6e29\u6c5f\u533a"},{"id":"599","name":"\u65b0\u90fd\u533a"},{"id":"600","name":"\u9f99\u6cc9\u9a7f\u533a"},{"id":"601","name":"\u6210\u90fd\u9ad8\u65b0\u897f\u533a"},{"id":"592","name":"\u6b66\u5019\u533a"}]}]},{"id":"25","name":"\u8d35\u5dde\u7701","child":[{"id":"5985","name":"\u5174\u4e49\u5e02"},{"id":"5984","name":"\u51ef\u91cc\u5e02"},{"id":"5983","name":"\u90fd\u5300\u5e02"},{"id":"301","name":"\u9ed4\u5357\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde","child":[{"id":"4308","name":"\u90fd\u5300\u5e02  "},{"id":"4318","name":"\u60e0\u6c34\u53bf "},{"id":"4317","name":"\u9f99\u91cc\u53bf "},{"id":"4316","name":"\u957f\u987a\u53bf "},{"id":"4315","name":"\u7f57\u7538\u53bf  "},{"id":"4314","name":"\u5e73\u5858\u53bf "},{"id":"4313","name":"\u72ec\u5c71\u53bf "},{"id":"4312","name":"\u74ee\u5b89\u53bf "},{"id":"4311","name":"\u8d35\u5b9a\u53bf "},{"id":"4310","name":"\u8354\u6ce2\u53bf "},{"id":"4309","name":"\u798f\u6cc9\u5e02 "},{"id":"4319","name":"\u4e09\u90fd\u6c34\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"300","name":"\u9ed4\u4e1c\u5357\u82d7\u65cf\u4f97\u65cf\u81ea\u6cbb\u5dde","child":[{"id":"4284","name":"\u51ef\u91cc\u5e02 "},{"id":"4298","name":"\u9ebb\u6c5f\u53bf "},{"id":"4297","name":"\u96f7\u5c71\u53bf "},{"id":"4296","name":"\u4ece\u6c5f\u53bf "},{"id":"4295","name":"\u6995\u6c5f\u53bf "},{"id":"4294","name":"\u9ece\u5e73\u53bf "},{"id":"4293","name":"\u53f0\u6c5f\u53bf "},{"id":"4292","name":"\u5251\u6cb3\u53bf "},{"id":"4291","name":"\u9526\u5c4f\u53bf "},{"id":"4290","name":"\u5929\u67f1\u53bf "},{"id":"4289","name":"\u5c91\u5de9\u53bf "},{"id":"4288","name":"\u9547\u8fdc\u53bf "},{"id":"4287","name":"\u4e09\u7a57\u53bf "},{"id":"4286","name":"\u65bd\u79c9\u53bf "},{"id":"4285","name":"\u9ec4\u5e73\u53bf "},{"id":"4299","name":"\u4e39\u5be8\u53bf "}]},{"id":"299","name":"\u9ed4\u897f\u5357\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde","child":[{"id":"4300","name":"\u5174\u4e49\u5e02 "},{"id":"4301","name":"\u5174\u4ec1\u53bf "},{"id":"4302","name":"\u666e\u5b89\u53bf "},{"id":"4303","name":"\u6674\u9686\u53bf "},{"id":"4304","name":"\u8d1e\u4e30\u53bf "},{"id":"4305","name":"\u671b\u8c1f\u53bf "},{"id":"4306","name":"\u518c\u4ea8\u53bf "},{"id":"4307","name":"\u5b89\u9f99\u53bf "}]},{"id":"298","name":"\u6bd5\u8282\u5730\u533a","child":[{"id":"4276","name":"\u6bd5\u8282\u5e02  "},{"id":"4277","name":"\u5927\u65b9\u53bf "},{"id":"4278","name":"\u9ed4\u897f\u53bf "},{"id":"4279","name":"\u91d1\u6c99\u53bf "},{"id":"4280","name":"\u7ec7\u91d1\u53bf "},{"id":"4281","name":"\u7eb3\u96cd\u53bf "},{"id":"4282","name":"\u5a01\u5b81\u5f5d\u65cf\u56de\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4283","name":"\u8d6b\u7ae0\u53bf "}]},{"id":"297","name":"\u94dc\u4ec1\u5730\u533a","child":[{"id":"4266","name":"\u94dc\u4ec1\u5e02  "},{"id":"4274","name":"\u677e\u6843\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4273","name":"\u6cbf\u6cb3\u571f\u5bb6\u65cf\u81ea\u6cbb\u53bf "},{"id":"4272","name":"\u5fb7\u6c5f\u53bf "},{"id":"4271","name":"\u5370\u6c5f\u571f\u5bb6\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4270","name":"\u601d\u5357\u53bf "},{"id":"4269","name":"\u77f3\u9621\u53bf "},{"id":"4268","name":"\u7389\u5c4f\u4f97\u65cf\u81ea\u6cbb\u53bf "},{"id":"4267","name":"\u6c5f\u53e3\u53bf "},{"id":"4275","name":"\u4e07\u5c71\u7279\u533a "}]},{"id":"296","name":"\u5b89\u987a\u5e02","child":[{"id":"4260","name":"\u897f\u79c0\u533a "},{"id":"4261","name":"\u5e73\u575d\u53bf "},{"id":"4262","name":"\u666e\u5b9a\u53bf "},{"id":"4263","name":"\u9547\u5b81\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4264","name":"\u5173\u5cad\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4265","name":"\u7d2b\u4e91\u82d7\u65cf\u5e03\u4f9d\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"295","name":"\u9075\u4e49\u5e02","child":[{"id":"4246","name":"\u7ea2\u82b1\u5c97\u533a "},{"id":"4258","name":"\u8d64\u6c34\u5e02 "},{"id":"4257","name":"\u4e60\u6c34\u53bf "},{"id":"4256","name":"\u4f59\u5e86\u53bf "},{"id":"4255","name":"\u6e44\u6f6d\u53bf "},{"id":"4254","name":"\u51e4\u5188\u53bf "},{"id":"4253","name":"\u52a1\u5ddd\u4ee1\u4f6c\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf"},{"id":"4252","name":"\u9053\u771f\u4ee1\u4f6c\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4251","name":"\u6b63\u5b89\u53bf "},{"id":"4250","name":"\u7ee5\u9633\u53bf "},{"id":"4249","name":"\u6850\u6893\u53bf "},{"id":"4248","name":"\u9075\u4e49\u53bf "},{"id":"4247","name":"\u6c47\u5ddd\u533a "},{"id":"4259","name":"\u4ec1\u6000\u5e02 "}]},{"id":"294","name":"\u516d\u76d8\u6c34\u5e02","child":[{"id":"4242","name":"\u949f\u5c71\u533a "},{"id":"4243","name":"\u516d\u679d\u7279\u533a "},{"id":"4244","name":"\u6c34\u57ce\u53bf "},{"id":"4245","name":"\u76d8\u53bf "}]},{"id":"293","name":"\u8d35\u9633\u5e02","child":[{"id":"5930","name":"\u91d1\u9633\u56fd\u5bb6\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a"},{"id":"5929","name":"\u91d1\u9633\u65b0\u533a"},{"id":"4241","name":"\u6e05\u9547\u5e02 "},{"id":"4240","name":"\u4fee\u6587\u53bf "},{"id":"4239","name":"\u606f\u70fd\u53bf "},{"id":"4238","name":"\u5f00\u9633\u53bf "},{"id":"4237","name":"\u767d\u4e91\u533a "},{"id":"4236","name":"\u4e4c\u5f53\u533a "},{"id":"4235","name":"\u82b1\u6eaa\u533a  "},{"id":"648","name":"\u5c0f\u6cb3\u533a"},{"id":"647","name":"\u5357\u660e\u533a"},{"id":"646","name":"\u4e91\u5ca9\u533a"}]}]},{"id":"26","name":"\u4e91\u5357\u7701","child":[{"id":"5986","name":"\u666f\u6d2a\u5e02"},{"id":"2585","name":"\u666e\u6d31\u5e02","child":[{"id":"4371","name":"\u601d\u8305\u533a "},{"id":"4379","name":"\u6f9c\u6ca7\u62c9\u795c\u65cf\u81ea\u6cbb\u53bf"},{"id":"4378","name":"\u5b5f\u8fde\u50a3\u65cf\u62c9\u795c\u65cf\u4f64\u65cf\u81ea\u6cbb\u53bf  "},{"id":"4377","name":"\u6c5f\u57ce\u54c8\u5c3c\u65cf\u5f5d\u65cf\u81ea\u6cbb\u53bf"},{"id":"4376","name":"\u9547\u6c85\u5f5d\u65cf\u54c8\u5c3c\u65cf\u62c9\u795c\u65cf\u81ea\u6cbb\u53bf  "},{"id":"4375","name":"\u666f\u8c37\u50a3\u65cf\u5f5d\u65cf\u81ea\u6cbb\u53bf "},{"id":"4374","name":"\u666f\u4e1c\u5f5d\u65cf\u81ea\u6cbb\u53bf "},{"id":"4373","name":"\u58a8\u6c5f\u54c8\u5c3c\u65cf\u81ea\u6cbb\u53bf "},{"id":"4372","name":"\u5b81\u6d31\u54c8\u5c3c\u65cf\u5f5d\u65cf\u81ea\u6cbb\u53bf "},{"id":"4380","name":"\u897f\u76df\u4f64\u65cf\u81ea\u6cbb\u53bf"}]},{"id":"317","name":"\u8fea\u5e86\u5dde","child":[{"id":"4444","name":"\u9999\u683c\u91cc\u62c9\u53bf "},{"id":"4445","name":"\u5fb7\u94a6\u53bf "},{"id":"4446","name":"\u7ef4\u897f\u5088\u50f3\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"316","name":"\u6012\u6c5f\u5dde","child":[{"id":"4440","name":"\u6cf8\u6c34\u53bf  "},{"id":"4441","name":"\u798f\u8d21\u53bf "},{"id":"4442","name":"\u8d21\u5c71\u72ec\u9f99\u65cf\u6012\u65cf\u81ea\u6cbb\u53bf "},{"id":"4443","name":"\u5170\u576a\u767d\u65cf\u666e\u7c73\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"315","name":"\u5fb7\u5b8f\u5dde","child":[{"id":"4435","name":"\u745e\u4e3d\u5e02 "},{"id":"4436","name":"\u6f5e\u897f\u5e02 "},{"id":"4437","name":"\u6881\u6cb3\u53bf "},{"id":"4438","name":"\u76c8\u6c5f\u53bf "},{"id":"4439","name":"\u9647\u5ddd\u53bf "}]},{"id":"314","name":"\u5927\u7406\u5dde","child":[{"id":"4423","name":"\u5927\u7406\u5e02  "},{"id":"4433","name":"\u5251\u5ddd\u53bf "},{"id":"4432","name":"\u6d31\u6e90\u53bf "},{"id":"4431","name":"\u4e91\u9f99\u53bf "},{"id":"4430","name":"\u6c38\u5e73\u53bf "},{"id":"4429","name":"\u5dcd\u5c71\u5f5d\u65cf\u56de\u65cf\u81ea\u6cbb\u53bf "},{"id":"4428","name":"\u5357\u6da7\u5f5d\u65cf\u81ea\u6cbb\u53bf "},{"id":"4427","name":"\u5f25\u6e21\u53bf "},{"id":"4426","name":"\u5bbe\u5ddd\u53bf "},{"id":"4425","name":"\u7965\u4e91\u53bf "},{"id":"4424","name":"\u6f3e\u6fde\u5f5d\u65cf\u81ea\u6cbb\u53bf "},{"id":"4434","name":"\u9e64\u5e86\u53bf "}]},{"id":"313","name":"\u695a\u96c4\u5dde","child":[{"id":"4413","name":"\u695a\u96c4\u5e02 "},{"id":"4421","name":"\u6b66\u5b9a\u53bf "},{"id":"4420","name":"\u5143\u8c0b\u53bf "},{"id":"4419","name":"\u6c38\u4ec1\u53bf "},{"id":"4418","name":"\u5927\u59da\u53bf "},{"id":"4417","name":"\u59da\u5b89\u53bf "},{"id":"4416","name":"\u5357\u534e\u53bf "},{"id":"4415","name":"\u725f\u5b9a\u53bf "},{"id":"4414","name":"\u53cc\u67cf\u53bf  "},{"id":"4422","name":"\u7984\u4e30\u53bf "}]},{"id":"312","name":"\u897f\u53cc\u7248\u7eb3\u5dde","child":[{"id":"4410","name":"\u666f\u6d2a\u5e02 "},{"id":"4411","name":"\u52d0\u6d77\u53bf "},{"id":"4412","name":"\u52d0\u814a\u53bf "}]},{"id":"311","name":"\u7ea2\u6cb3\u5dde","child":[{"id":"4397","name":"\u4e2a\u65e7\u5e02  "},{"id":"4408","name":"\u7eff\u6625\u53bf "},{"id":"4407","name":"\u91d1\u5e73\u82d7\u65cf\u7476\u65cf\u50a3\u65cf\u81ea\u6cbb\u53bf "},{"id":"4406","name":"\u7ea2\u6cb3\u53bf "},{"id":"4405","name":"\u5143\u9633\u53bf "},{"id":"4404","name":"\u6cf8\u897f\u53bf "},{"id":"4403","name":"\u5f25\u52d2\u53bf "},{"id":"4402","name":"\u77f3\u5c4f\u53bf "},{"id":"4401","name":"\u5efa\u6c34\u53bf "},{"id":"4400","name":"\u5c4f\u8fb9\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4399","name":"\u8499\u81ea\u53bf "},{"id":"4398","name":"\u5f00\u8fdc\u5e02 "},{"id":"4409","name":"\u6cb3\u53e3\u7476\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"310","name":"\u6587\u5c71\u5dde","child":[{"id":"4389","name":"\u6587\u5c71\u53bf  "},{"id":"4390","name":"\u781a\u5c71\u53bf "},{"id":"4391","name":"\u897f\u7574\u53bf "},{"id":"4392","name":"\u9ebb\u6817\u5761\u53bf "},{"id":"4393","name":"\u9a6c\u5173\u53bf "},{"id":"4394","name":"\u4e18\u5317\u53bf "},{"id":"4395","name":"\u5e7f\u5357\u53bf "},{"id":"4396","name":"\u5bcc\u5b81\u53bf "}]},{"id":"309","name":"\u4e34\u6ca7\u5e02","child":[{"id":"4381","name":"\u4e34\u7fd4\u533a "},{"id":"4382","name":"\u51e4\u5e86\u53bf  "},{"id":"4383","name":"\u4e91\u53bf "},{"id":"4384","name":"\u6c38\u5fb7\u53bf "},{"id":"4385","name":"\u9547\u5eb7\u53bf "},{"id":"4386","name":"\u53cc\u6c5f\u81ea\u6cbb\u53bf "},{"id":"4387","name":"\u803f\u9a6c\u50a3\u65cf\u4f64\u65cf\u81ea\u6cbb\u53bf "},{"id":"4388","name":"\u6ca7\u6e90\u4f64\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"307","name":"\u4e3d\u6c5f\u5e02","child":[{"id":"4366","name":"\u53e4\u57ce\u533a  "},{"id":"4367","name":"\u7389\u9f99\u7eb3\u897f\u65cf\u81ea\u6cbb\u53bf "},{"id":"4368","name":"\u6c38\u80dc\u53bf "},{"id":"4369","name":"\u534e\u576a\u53bf "},{"id":"4370","name":"\u5b81\u8497\u5f5d\u65cf\u81ea\u6cbb\u53bf"}]},{"id":"306","name":"\u662d\u901a\u5e02","child":[{"id":"4355","name":"\u662d\u9633\u533a "},{"id":"4364","name":"\u5a01\u4fe1\u53bf "},{"id":"4363","name":"\u5f5d\u826f\u53bf "},{"id":"4362","name":"\u9547\u96c4\u53bf "},{"id":"4361","name":"\u7ee5\u6c5f\u53bf "},{"id":"4360","name":"\u6c38\u5584\u53bf "},{"id":"4359","name":"\u5927\u5173\u53bf "},{"id":"4358","name":"\u76d0\u6d25\u53bf "},{"id":"4357","name":"\u5de7\u5bb6\u53bf "},{"id":"4356","name":"\u9c81\u7538\u53bf "},{"id":"4365","name":"\u6c34\u5bcc\u53bf "}]},{"id":"305","name":"\u4fdd\u5c71\u5e02","child":[{"id":"4350","name":"\u9686\u9633\u533a "},{"id":"4351","name":"\u65bd\u7538\u53bf "},{"id":"4352","name":"\u817e\u51b2\u53bf "},{"id":"4353","name":"\u9f99\u9675\u53bf "},{"id":"4354","name":"\u660c\u5b81\u53bf "}]},{"id":"304","name":"\u7389\u6eaa\u5e02","child":[{"id":"4342","name":"\u6c5f\u5ddd\u53bf "},{"id":"4341","name":"\u7ea2\u5854\u533a  "},{"id":"4343","name":"\u6f84\u6c5f\u53bf "},{"id":"4344","name":"\u901a\u6d77\u53bf "},{"id":"4345","name":"\u534e\u5b81\u53bf "},{"id":"4346","name":"\u6613\u95e8\u53bf "},{"id":"4347","name":"\u5ce8\u5c71\u5f5d\u65cf\u81ea\u6cbb\u53bf  "},{"id":"4348","name":"\u65b0\u5e73\u5f5d\u65cf\u50a3\u65cf\u81ea\u6cbb\u53bf "},{"id":"4349","name":"\u5143\u6c5f\u54c8\u5c3c\u65cf\u5f5d\u65cf\u50a3\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"303","name":"\u66f2\u9756\u5e02","child":[{"id":"4330","name":"\u9e92\u9e9f\u533a "},{"id":"4331","name":"\u9a6c\u9f99\u53bf "},{"id":"4332","name":"\u9646\u826f\u53bf  "},{"id":"4333","name":"\u5e08\u5b97\u53bf "},{"id":"4334","name":"\u7f57\u5e73\u53bf "},{"id":"4335","name":"\u5bcc\u6e90\u53bf "},{"id":"4336","name":"\u4f1a\u6cfd\u53bf "},{"id":"4337","name":"\u6cbe\u76ca\u53bf "},{"id":"4338","name":"\u5ba3\u5a01\u5e02 "}]},{"id":"302","name":"\u6606\u660e\u5e02","child":[{"id":"4329","name":"\u5b89\u5b81\u5e02 "},{"id":"4328","name":"\u5bfb\u7538\u56de\u65cf\u5f5d\u65cf\u81ea\u6cbb\u53bf "},{"id":"4327","name":"\u7984\u529d\u5f5d\u65cf\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4326","name":"\u5d69\u660e\u53bf "},{"id":"4325","name":"\u77f3\u6797\u5f5d\u65cf\u81ea\u6cbb\u53bf "},{"id":"4324","name":"\u5b9c\u826f\u53bf "},{"id":"4323","name":"\u5bcc\u6c11\u53bf  "},{"id":"4322","name":"\u664b\u5b81\u53bf "},{"id":"4321","name":"\u5448\u8d21\u53bf "},{"id":"4320","name":"\u4e1c\u5ddd\u533a "},{"id":"654","name":"\u6606\u660e\u5e02\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"653","name":"\u6606\u660e\u5e02\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"652","name":"\u897f\u5c71\u533a"},{"id":"651","name":"\u5b98\u6e21\u533a"},{"id":"650","name":"\u76d8\u9f99\u533a"},{"id":"649","name":"\u4e94\u534e\u533a"}]}]},{"id":"27","name":"\u897f\u85cf\u81ea\u6cbb\u533a","child":[{"id":"318","name":"\u62c9\u8428\u5e02","child":[{"id":"4447","name":"\u57ce\u5173\u533a "},{"id":"4448","name":"\u6797\u5468\u53bf "},{"id":"4449","name":"\u5f53\u96c4\u53bf "},{"id":"4450","name":"\u5c3c\u6728\u53bf "},{"id":"4451","name":"\u66f2\u6c34\u53bf "},{"id":"4452","name":"\u5806\u9f99\u5fb7\u5e86\u53bf "},{"id":"4453","name":"\u8fbe\u5b5c\u53bf "},{"id":"4454","name":"\u58a8\u7af9\u5de5\u5361\u53bf "}]},{"id":"319","name":"\u660c\u90fd\u5730\u533a","child":[{"id":"4455","name":"\u660c\u90fd\u53bf  "},{"id":"4464","name":"\u6d1b\u9686\u53bf "},{"id":"4463","name":"\u8292\u5eb7\u53bf "},{"id":"4462","name":"\u5de6\u8d21\u53bf "},{"id":"4461","name":"\u516b\u5bbf\u53bf "},{"id":"4460","name":"\u5bdf\u96c5\u53bf "},{"id":"4459","name":"\u4e01\u9752\u53bf "},{"id":"4458","name":"\u7c7b\u4e4c\u9f50\u53bf "},{"id":"4457","name":"\u8d21\u89c9\u53bf "},{"id":"4456","name":"\u6c5f\u8fbe\u53bf "},{"id":"4465","name":"\u8fb9\u575d\u53bf "}]},{"id":"320","name":"\u5c71\u5357\u5730\u533a","child":[{"id":"4466","name":"\u4e43\u4e1c\u53bf "},{"id":"4476","name":"\u9519\u90a3\u53bf "},{"id":"4475","name":"\u9686\u5b50\u53bf "},{"id":"4474","name":"\u52a0\u67e5\u53bf "},{"id":"4473","name":"\u6d1b\u624e\u53bf  "},{"id":"4472","name":"\u63aa\u7f8e\u53bf"},{"id":"4471","name":"\u66f2\u677e\u53bf "},{"id":"4470","name":"\u743c\u7ed3\u53bf "},{"id":"4469","name":"\u6851\u65e5\u53bf "},{"id":"4468","name":"\u8d21\u560e\u53bf "},{"id":"4467","name":"\u624e\u56ca\u53bf "},{"id":"4477","name":"\u6d6a\u5361\u5b50\u53bf "}]},{"id":"321","name":"\u65e5\u5580\u5219\u5730\u533a","child":[{"id":"4478","name":"\u65e5\u5580\u5219\u5e02 "},{"id":"4494","name":"\u8428\u560e\u53bf "},{"id":"4493","name":"\u8042\u62c9\u6728\u53bf "},{"id":"4492","name":"\u5409\u9686\u53bf "},{"id":"4491","name":"\u4e9a\u4e1c\u53bf "},{"id":"4490","name":"\u4ef2\u5df4\u53bf "},{"id":"4489","name":"\u5b9a\u7ed3\u53bf "},{"id":"4488","name":"\u5eb7\u9a6c\u53bf "},{"id":"4487","name":"\u4ec1\u5e03\u53bf "},{"id":"4486","name":"\u767d\u6717\u53bf "},{"id":"4485","name":"\u8c22\u901a\u95e8\u53bf "},{"id":"4484","name":"\u6602\u4ec1\u53bf  "},{"id":"4483","name":"\u62c9\u5b5c\u53bf "},{"id":"4482","name":"\u8428\u8fe6\u53bf "},{"id":"4481","name":"\u5b9a\u65e5\u53bf "},{"id":"4480","name":"\u6c5f\u5b5c\u53bf "},{"id":"4479","name":"\u5357\u6728\u6797\u53bf "},{"id":"4495","name":"\u5c97\u5df4\u53bf "}]},{"id":"322","name":"\u90a3\u66f2\u5730\u533a","child":[{"id":"4496","name":"\u62c9\u8428\u5e02 "},{"id":"4497","name":"\u660c\u90fd\u5730\u533a "},{"id":"4498","name":"\u5c71\u5357\u5730\u533a  "},{"id":"4499","name":"\u65e5\u5580\u5219\u5730\u533a "},{"id":"4500","name":"\u90a3\u66f2\u5730\u533a "},{"id":"4501","name":"\u963f\u91cc\u5730\u533a "},{"id":"4502","name":"\u6797\u829d\u5730\u533a "}]},{"id":"323","name":"\u963f\u91cc\u5730\u533a","child":[{"id":"4503","name":"\u666e\u5170\u53bf "},{"id":"4504","name":"\u672d\u8fbe\u53bf "},{"id":"4505","name":"\u5676\u5c14\u53bf "},{"id":"4506","name":"\u65e5\u571f\u53bf "},{"id":"4507","name":"\u9769\u5409\u53bf "},{"id":"4508","name":"\u6539\u5219\u53bf "},{"id":"4509","name":"\u63aa\u52e4\u53bf "}]},{"id":"324","name":"\u6797\u829d\u5730\u533a","child":[{"id":"4510","name":"\u6797\u829d\u53bf "},{"id":"4511","name":"\u5de5\u5e03\u6c5f\u8fbe\u53bf "},{"id":"4512","name":"\u7c73\u6797\u53bf "},{"id":"4513","name":"\u58a8\u8131\u53bf "},{"id":"4514","name":"\u6ce2\u5bc6\u53bf "},{"id":"4515","name":"\u5bdf\u9685\u53bf "},{"id":"4516","name":"\u6717\u53bf "}]}]},{"id":"28","name":"\u9655\u897f\u7701","child":[{"id":"325","name":"\u897f\u5b89\u5e02","child":[{"id":"4520","name":"\u6237\u53bf "},{"id":"4519","name":"\u5468\u81f3\u53bf "},{"id":"4518","name":"\u84dd\u7530\u53bf "},{"id":"4517","name":"\u4e34\u6f7c\u533a "},{"id":"1305","name":"\u960e\u826f\u533a"},{"id":"1304","name":"\u6d2a\u5e86\u9547"},{"id":"1303","name":"\u7530\u738b\u9547"},{"id":"1302","name":"\u4e09\u6865\u9547"},{"id":"672","name":"\u9ad8\u9675\u53bf","child":[{"id":"1306","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1307","name":"\u4e34\u6f7c\u533a"}]},{"id":"669","name":"\u957f\u5b89\u533a"},{"id":"668","name":"\u897f\u5b89\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"667","name":"\u96c1\u5854\u533a"},{"id":"666","name":"\u672a\u592e\u533a"},{"id":"665","name":"\u705e\u6865\u533a"},{"id":"664","name":"\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a"},{"id":"663","name":"\u83b2\u6e56\u533a"},{"id":"662","name":"\u7891\u6797\u533a"},{"id":"661","name":"\u65b0\u57ce\u533a"}]},{"id":"333","name":"\u5b89\u5eb7\u5e02","child":[{"id":"4594","name":"\u6c49\u6ee8\u533a "},{"id":"4602","name":"\u65ec\u9633\u53bf "},{"id":"4601","name":"\u9547\u576a\u53bf "},{"id":"4600","name":"\u5e73\u5229\u53bf "},{"id":"4599","name":"\u5c9a\u768b\u53bf "},{"id":"4598","name":"\u7d2b\u9633\u53bf "},{"id":"4597","name":"\u5b81\u9655\u53bf "},{"id":"4596","name":"\u77f3\u6cc9\u53bf "},{"id":"4595","name":"\u6c49\u9634\u53bf "},{"id":"4603","name":"\u767d\u6cb3\u53bf "}]},{"id":"332","name":"\u6986\u6797\u5e02","child":[{"id":"4582","name":"\u6986\u9633\u533a  "},{"id":"4592","name":"\u6e05\u6da7\u53bf "},{"id":"4591","name":"\u5434\u5821\u53bf "},{"id":"4590","name":"\u4f73\u53bf "},{"id":"4589","name":"\u7c73\u8102\u53bf"},{"id":"4588","name":"\u7ee5\u5fb7\u53bf "},{"id":"4587","name":"\u5b9a\u8fb9\u53bf "},{"id":"4586","name":"\u9756\u8fb9\u53bf "},{"id":"4585","name":"\u6a2a\u5c71\u53bf "},{"id":"4584","name":"\u5e9c\u8c37\u53bf "},{"id":"4583","name":"\u795e\u6728\u53bf "},{"id":"4593","name":"\u5b50\u6d32\u53bf "}]},{"id":"331","name":"\u6c49\u4e2d\u5e02","child":[{"id":"4571","name":"\u6c49\u53f0\u533a "},{"id":"4580","name":"\u7559\u575d\u53bf "},{"id":"4579","name":"\u9547\u5df4\u53bf "},{"id":"4578","name":"\u7565\u9633\u53bf "},{"id":"4577","name":"\u5b81\u5f3a\u53bf "},{"id":"4576","name":"\u52c9\u53bf "},{"id":"4575","name":"\u897f\u4e61\u53bf "},{"id":"4574","name":"\u6d0b\u53bf "},{"id":"4573","name":"\u57ce\u56fa\u53bf "},{"id":"4572","name":"\u5357\u90d1\u53bf "},{"id":"4581","name":"\u4f5b\u576a\u53bf "}]},{"id":"330","name":"\u5ef6\u5b89\u5e02","child":[{"id":"4558","name":"\u5b9d\u5854\u533a "},{"id":"4569","name":"\u9ec4\u9f99\u53bf "},{"id":"4568","name":"\u5b9c\u5ddd\u53bf "},{"id":"4567","name":"\u6d1b\u5ddd\u53bf "},{"id":"4566","name":"\u5bcc\u53bf "},{"id":"4565","name":"\u7518\u6cc9\u53bf  "},{"id":"4564","name":"\u5434\u8d77\u53bf"},{"id":"4563","name":"\u5fd7\u4e39\u53bf "},{"id":"4562","name":"\u5b89\u585e\u53bf "},{"id":"4561","name":"\u5b50\u957f\u53bf "},{"id":"4560","name":"\u5ef6\u5ddd\u53bf "},{"id":"4559","name":"\u5ef6\u957f\u53bf "},{"id":"4570","name":"\u9ec4\u9675\u53bf "}]},{"id":"329","name":"\u6e2d\u5357\u5e02","child":[{"id":"4547","name":"\u4e34\u6e2d\u533a "},{"id":"4556","name":"\u97e9\u57ce\u5e02 "},{"id":"4555","name":"\u5bcc\u5e73\u53bf "},{"id":"4554","name":"\u767d\u6c34\u53bf "},{"id":"4553","name":"\u84b2\u57ce\u53bf "},{"id":"4552","name":"\u6f84\u57ce\u53bf "},{"id":"4551","name":"\u5408\u9633\u53bf "},{"id":"4550","name":"\u5927\u8354\u53bf "},{"id":"4549","name":"\u6f7c\u5173\u53bf "},{"id":"4548","name":"\u534e\u53bf "},{"id":"4557","name":"\u534e\u9634\u5e02 "}]},{"id":"328","name":"\u54b8\u9633\u5e02","child":[{"id":"4546","name":"\u5174\u5e73\u5e02 "},{"id":"4545","name":"\u6b66\u529f\u53bf "},{"id":"4544","name":"\u6df3\u5316\u53bf "},{"id":"4543","name":"\u65ec\u9091\u53bf "},{"id":"4542","name":"\u957f\u6b66\u53bf "},{"id":"4541","name":"\u5f6c\u53bf "},{"id":"4540","name":"\u6c38\u5bff\u53bf  "},{"id":"4539","name":"\u793c\u6cc9\u53bf "},{"id":"4538","name":"\u4e7e\u53bf "},{"id":"4537","name":"\u6cfe\u9633\u53bf "},{"id":"4536","name":"\u4e09\u539f\u53bf "},{"id":"4534","name":"\u6768\u51cc\u533a "},{"id":"671","name":"\u79e6\u90fd\u533a"},{"id":"670","name":"\u6e2d\u57ce\u533a"}]},{"id":"327","name":"\u5b9d\u9e21\u5e02","child":[{"id":"4533","name":"\u592a\u767d\u53bf "},{"id":"4532","name":"\u51e4\u53bf "},{"id":"4528","name":"\u6276\u98ce\u53bf "},{"id":"4527","name":"\u7709\u53bf "},{"id":"4526","name":"\u51e4\u7fd4\u53bf "},{"id":"4530","name":"\u5343\u9633\u53bf "},{"id":"4531","name":"\u9e9f\u6e38\u53bf "},{"id":"4529","name":"\u9647\u53bf "},{"id":"1299","name":"\u4e03\u4e00\u65b0\u533a"},{"id":"659","name":"\u5c90\u5c71\u53bf","child":[{"id":"1308","name":"\u8521\u5bb6\u5761\u9547"}]},{"id":"658","name":"\u897f\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u5c55\u533a"},{"id":"657","name":"\u9648\u4ed3\u533a"},{"id":"656","name":"\u91d1\u53f0\u533a"},{"id":"655","name":"\u6e2d\u6ee8\u533a"}]},{"id":"326","name":"\u94dc\u5ddd\u5e02","child":[{"id":"4522","name":"\u738b\u76ca\u533a "},{"id":"4523","name":"\u5370\u53f0\u533a "},{"id":"4524","name":"\u8000\u5dde\u533a "},{"id":"4525","name":"\u5b9c\u541b\u53bf "}]},{"id":"334","name":"\u5546\u6d1b\u5e02","child":[{"id":"4604","name":"\u5546\u5dde\u533a "},{"id":"4605","name":"\u6d1b\u5357\u53bf "},{"id":"4606","name":"\u4e39\u51e4\u53bf "},{"id":"4607","name":"\u5546\u5357\u53bf "},{"id":"4608","name":"\u5c71\u9633\u53bf "},{"id":"4609","name":"\u9547\u5b89\u53bf "},{"id":"4610","name":"\u67de\u6c34\u53bf "}]}]},{"id":"29","name":"\u7518\u8083\u7701","child":[{"id":"335","name":"\u5170\u5dde\u5e02","child":[{"id":"4612","name":"\u7ea2\u53e4\u533a "},{"id":"4613","name":"\u6c38\u767b\u53bf "},{"id":"4614","name":"\u768b\u5170\u53bf "},{"id":"4615","name":"\u6986\u4e2d\u53bf "},{"id":"673","name":"\u57ce\u5173\u533a"},{"id":"674","name":"\u4e03\u91cc\u6cb3\u533a"},{"id":"675","name":"\u5b89\u5b81\u533a"},{"id":"676","name":"\u897f\u56fa\u533a"}]},{"id":"347","name":"\u4e34\u590f\u81ea\u6cbb\u5dde","child":[{"id":"4678","name":"\u4e34\u590f\u53bf "},{"id":"4679","name":"\u5eb7\u4e50\u53bf "},{"id":"4680","name":"\u6c38\u9756\u53bf  "},{"id":"4681","name":"\u5e7f\u6cb3\u53bf "},{"id":"4682","name":"\u548c\u653f\u53bf "},{"id":"4683","name":"\u4e1c\u4e61\u65cf\u81ea\u6cbb\u53bf"},{"id":"4684","name":"\u79ef\u77f3\u5c71\u81ea\u6cbb\u53bf"}]},{"id":"346","name":"\u9647\u5357\u5e02","child":[{"id":"4669","name":"\u6b66\u90fd\u533a  "},{"id":"4670","name":"\u6210\u53bf "},{"id":"4671","name":"\u6587\u53bf "},{"id":"4672","name":"\u5b95\u660c\u53bf "},{"id":"4673","name":"\u5eb7\u53bf "},{"id":"4674","name":"\u897f\u548c\u53bf "},{"id":"4675","name":"\u793c\u53bf "},{"id":"4676","name":"\u5fbd\u53bf "},{"id":"4677","name":"\u4e24\u5f53\u53bf "}]},{"id":"345","name":"\u5b9a\u897f\u5e02","child":[{"id":"4662","name":"\u5b89\u5b9a\u533a  "},{"id":"4663","name":"\u901a\u6e2d\u53bf "},{"id":"4664","name":"\u9647\u897f\u53bf "},{"id":"4665","name":"\u6e2d\u6e90\u53bf "},{"id":"4666","name":"\u4e34\u6d2e\u53bf "},{"id":"4667","name":"\u6f33\u53bf "},{"id":"4668","name":"\u5cb7\u53bf "}]},{"id":"344","name":"\u5e86\u9633\u5e02","child":[{"id":"4654","name":"\u897f\u5cf0\u533a "},{"id":"4655","name":"\u5e86\u57ce\u53bf "},{"id":"4656","name":"\u73af\u53bf "},{"id":"4657","name":"\u534e\u6c60\u53bf "},{"id":"4658","name":"\u5408\u6c34\u53bf "},{"id":"4659","name":"\u6b63\u5b81\u53bf "},{"id":"4660","name":"\u5b81\u53bf "},{"id":"4661","name":"\u9547\u539f\u53bf "}]},{"id":"343","name":"\u9152\u6cc9\u5e02","child":[{"id":"4647","name":"\u8083\u5dde\u533a  "},{"id":"4648","name":"\u91d1\u5854\u53bf "},{"id":"4649","name":"\u74dc\u5dde\u53bf "},{"id":"4650","name":"\u8083\u5317\u8499\u53e4\u65cf\u81ea\u6cbb\u53bf "},{"id":"4651","name":"\u963f\u514b\u585e\u54c8\u8428\u514b\u65cf\u81ea\u6cbb\u53bf "},{"id":"4652","name":"\u7389\u95e8\u5e02 "},{"id":"4653","name":"\u6566\u714c\u5e02 "}]},{"id":"342","name":"\u5e73\u51c9\u5e02","child":[{"id":"4640","name":"\u5d06\u5cd2\u533a "},{"id":"4641","name":"\u6cfe\u5ddd\u53bf "},{"id":"4642","name":"\u7075\u53f0\u53bf "},{"id":"4643","name":"\u5d07\u4fe1\u53bf "},{"id":"4644","name":"\u534e\u4ead\u53bf "},{"id":"4645","name":"\u5e84\u6d6a\u53bf "},{"id":"4646","name":"\u9759\u5b81\u53bf "}]},{"id":"341","name":"\u5f20\u6396\u5e02","child":[{"id":"4634","name":"\u7518\u5dde\u533a "},{"id":"4635","name":"\u8083\u5357\u88d5\u56fa\u65cf\u81ea\u6cbb\u53bf "},{"id":"4636","name":"\u6c11\u4e50\u53bf "},{"id":"4637","name":"\u4e34\u6cfd\u53bf  "},{"id":"4638","name":"\u9ad8\u53f0\u53bf "},{"id":"4639","name":"\u5c71\u4e39\u53bf "}]},{"id":"340","name":"\u6b66\u5a01\u5e02","child":[{"id":"4630","name":"\u51c9\u5dde\u533a "},{"id":"4631","name":"\u6c11\u52e4\u53bf "},{"id":"4632","name":"\u53e4\u6d6a\u53bf "},{"id":"4633","name":"\u5929\u795d\u85cf\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"339","name":"\u5929\u6c34\u5e02","child":[{"id":"4623","name":"\u79e6\u5dde\u533a "},{"id":"4624","name":"\u9ea6\u79ef\u533a "},{"id":"4625","name":"\u6e05\u6c34\u53bf "},{"id":"4626","name":"\u79e6\u5b89\u53bf "},{"id":"4627","name":"\u7518\u8c37\u53bf "},{"id":"4628","name":"\u6b66\u5c71\u53bf "},{"id":"4629","name":"\u5f20\u5bb6\u5ddd\u56de\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"338","name":"\u767d\u94f6\u5e02","child":[{"id":"4618","name":"\u767d\u94f6\u533a "},{"id":"4619","name":"\u5e73\u5ddd\u533a "},{"id":"4620","name":"\u9756\u8fdc\u53bf "},{"id":"4621","name":"\u4f1a\u5b81\u53bf "},{"id":"4622","name":"\u666f\u6cf0\u53bf"}]},{"id":"337","name":"\u91d1\u660c\u5e02","child":[{"id":"4616","name":"\u91d1\u5ddd\u533a "},{"id":"4617","name":"\u6c38\u660c\u53bf "}]},{"id":"336","name":"\u5609\u5cea\u5173\u5e02"},{"id":"348","name":"\u7518\u5357\u81ea\u6cbb\u5dde","child":[{"id":"4685","name":"\u5408\u4f5c\u5e02 "},{"id":"4686","name":"\u4e34\u6f6d\u53bf  "},{"id":"4687","name":"\u5353\u5c3c\u53bf "},{"id":"4688","name":"\u821f\u66f2\u53bf "},{"id":"4689","name":"\u8fed\u90e8\u53bf "},{"id":"4690","name":"\u739b\u66f2\u53bf "},{"id":"4691","name":"\u788c\u66f2\u53bf "},{"id":"4692","name":"\u590f\u6cb3\u53bf "}]}]},{"id":"30","name":"\u9752\u6d77\u7701","child":[{"id":"349","name":"\u897f\u5b81\u5e02","child":[{"id":"4693","name":"\u57ce\u4e1c\u533a "},{"id":"4694","name":"\u57ce\u4e2d\u533a "},{"id":"4695","name":"\u57ce\u897f\u533a "},{"id":"4696","name":"\u57ce\u5317\u533a "},{"id":"4697","name":"\u5927\u901a\u56de\u65cf\u571f\u65cf\u81ea\u6cbb\u53bf "},{"id":"4698","name":"\u6e5f\u4e2d\u53bf "},{"id":"4699","name":"\u6e5f\u6e90\u53bf "}]},{"id":"350","name":"\u6d77\u4e1c\u5730\u533a","child":[{"id":"4700","name":"\u5e73\u5b89\u53bf  "},{"id":"4701","name":"\u6c11\u548c\u56de\u65cf\u571f\u65cf\u81ea\u6cbb\u53bf "},{"id":"4702","name":"\u4e50\u90fd\u53bf "},{"id":"4703","name":"\u4e92\u52a9\u571f\u65cf\u81ea\u6cbb\u53bf "},{"id":"4704","name":"\u5316\u9686\u56de\u65cf\u81ea\u6cbb\u53bf "},{"id":"4705","name":"\u5faa\u5316\u6492\u62c9\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"351","name":"\u6d77\u5317\u81ea\u6cbb\u5dde","child":[{"id":"4706","name":"\u95e8\u6e90\u56de\u65cf\u81ea\u6cbb\u53bf "},{"id":"4707","name":"\u7941\u8fde\u53bf "},{"id":"4708","name":"\u6d77\u664f\u53bf "},{"id":"4709","name":"\u521a\u5bdf\u53bf "}]},{"id":"352","name":"\u9ec4\u5357\u81ea\u6cbb\u5dde","child":[{"id":"4710","name":"\u540c\u4ec1\u53bf "},{"id":"4711","name":"\u5c16\u624e\u53bf "},{"id":"4712","name":"\u6cfd\u5e93\u53bf "},{"id":"4713","name":"\u6cb3\u5357\u8499\u53e4\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"353","name":"\u6d77\u5357\u81ea\u6cbb\u5dde","child":[{"id":"4714","name":"\u540c\u4ec1\u53bf "},{"id":"4715","name":"\u5c16\u624e\u53bf "},{"id":"4716","name":"\u6cfd\u5e93\u53bf "},{"id":"4717","name":"\u6cb3\u5357\u8499\u53e4\u65cf\u81ea\u6cbb\u53bf "},{"id":"6001","name":"\u5171\u548c\u53bf"},{"id":"6065","name":"\u8d35\u5fb7\u53bf"},{"id":"6066","name":"\u8d35\u5357\u53bf"},{"id":"6067","name":"\u540c\u5fb7\u53bf"},{"id":"6068","name":"\u5174\u6d77\u53bf"}]},{"id":"354","name":"\u679c\u6d1b\u81ea\u6cbb\u5dde","child":[{"id":"4718","name":"\u739b\u6c81\u53bf "},{"id":"4719","name":"\u73ed\u739b\u53bf "},{"id":"4720","name":"\u7518\u5fb7\u53bf "},{"id":"4721","name":"\u8fbe\u65e5\u53bf "},{"id":"4722","name":"\u4e45\u6cbb\u53bf "},{"id":"4723","name":"\u739b\u591a\u53bf "}]},{"id":"355","name":"\u7389\u6811\u81ea\u6cbb\u5dde","child":[{"id":"4724","name":"\u7389\u6811\u53bf "},{"id":"4725","name":"\u6742\u591a\u53bf  "},{"id":"4726","name":"\u79f0\u591a\u53bf "},{"id":"4727","name":"\u6cbb\u591a\u53bf "},{"id":"4728","name":"\u56ca\u8c26\u53bf "},{"id":"4729","name":"\u66f2\u9ebb\u83b1\u53bf "}]},{"id":"356","name":"\u6d77\u897f\u81ea\u6cbb\u5dde","child":[{"id":"4730","name":"\u6d77\u897f\u8499\u53e4\u65cf\u85cf\u65cf\u81ea\u6cbb\u5dde\u76f4\u8f96 "},{"id":"4731","name":"\u683c\u5c14\u6728\u5e02 "},{"id":"4732","name":"\u5fb7\u4ee4\u54c8\u5e02 "},{"id":"4733","name":"\u4e4c\u5170\u53bf "},{"id":"4734","name":"\u90fd\u5170\u53bf "},{"id":"4735","name":"\u5929\u5cfb\u53bf "}]}]},{"id":"31","name":"\u5b81\u590f\u56de\u65cf\u81ea\u6cbb\u533a","child":[{"id":"2586","name":"\u4e2d\u536b\u5e02","child":[{"id":"4754","name":"\u6c99\u5761\u5934\u533a "},{"id":"4755","name":"\u4e2d\u5b81\u53bf "},{"id":"4756","name":"\u6d77\u539f\u53bf "}]},{"id":"357","name":"\u94f6\u5ddd\u5e02","child":[{"id":"4736","name":"\u5174\u5e86\u533a "},{"id":"4737","name":"\u897f\u590f\u533a "},{"id":"4738","name":"\u91d1\u51e4\u533a "},{"id":"4739","name":"\u6c38\u5b81\u53bf "},{"id":"4740","name":"\u8d3a\u5170\u53bf "},{"id":"4741","name":"\u7075\u6b66\u5e02 "}]},{"id":"358","name":"\u77f3\u5634\u5c71\u5e02","child":[{"id":"4742","name":"\u5927\u6b66\u53e3\u533a "},{"id":"4743","name":"\u60e0\u519c\u533a "},{"id":"4744","name":"\u5e73\u7f57\u53bf "}]},{"id":"2043","name":"\u5434\u5fe0\u5e02","child":[{"id":"4745","name":"\u5229\u901a\u533a "},{"id":"4746","name":"\u76d0\u6c60\u53bf "},{"id":"4747","name":"\u540c\u5fc3\u53bf "},{"id":"4748","name":"\u9752\u94dc\u5ce1\u5e02 "},{"id":"6059","name":"\u7ea2\u5bfa\u5821\u533a"}]},{"id":"360","name":"\u56fa\u539f\u5e02","child":[{"id":"4749","name":"\u539f\u5dde\u533a "},{"id":"4750","name":"\u897f\u5409\u53bf "},{"id":"4751","name":"\u9686\u5fb7\u53bf "},{"id":"4752","name":"\u6cfe\u6e90\u53bf "},{"id":"4753","name":"\u5f6d\u9633\u53bf "}]}]},{"id":"32","name":"\u65b0\u7586\u7ef4\u543e\u5c14\u81ea\u6cbb\u533a ","child":[{"id":"5988","name":"\u4f0a\u5b81\u5e02","child":[{"id":"5995","name":"\u970d\u57ce\u53bf","child":[{"id":"5996","name":"\u970d\u5c14\u679c\u65af\u53e3\u5cb8"}]}]},{"id":"2587","name":"\u77f3\u6cb3\u5b50\u5e02 "},{"id":"2588","name":"\u963f\u62c9\u5c14\u5e02"},{"id":"2589","name":"\u56fe\u6728\u8212\u514b\u5e02"},{"id":"2590","name":"\u4e94\u5bb6\u6e20\u5e02"},{"id":"5987","name":"\u5e93\u5c14\u52d2\u5e02"},{"id":"375","name":"\u963f\u52d2\u6cf0\u5730\u533a","child":[{"id":"4838","name":"\u963f\u52d2\u6cf0\u5e02 "},{"id":"4839","name":"\u5e03\u5c14\u6d25\u53bf "},{"id":"4840","name":"\u5bcc\u8574\u53bf "},{"id":"4841","name":"\u798f\u6d77\u53bf "},{"id":"4842","name":"\u54c8\u5df4\u6cb3\u53bf "},{"id":"4843","name":"\u9752\u6cb3\u53bf "},{"id":"4844","name":"\u5409\u6728\u4e43\u53bf "}]},{"id":"374","name":"\u5854\u57ce\u5730\u533a","child":[{"id":"4831","name":"\u5854\u57ce\u5e02 "},{"id":"4832","name":"\u4e4c\u82cf\u5e02 "},{"id":"4833","name":"\u989d\u654f\u53bf  "},{"id":"4834","name":"\u6c99\u6e7e\u53bf "},{"id":"4835","name":"\u6258\u91cc\u53bf "},{"id":"4836","name":"\u88d5\u6c11\u53bf "},{"id":"4837","name":"\u548c\u5e03\u514b\u8d5b\u5c14\u8499\u53e4\u81ea\u6cbb\u53bf "}]},{"id":"373","name":"\u4f0a\u7281\u54c8\u8428\u514b\u81ea\u6cbb\u5dde","child":[{"id":"4822","name":"\u594e\u5c6f\u5e02  "},{"id":"4823","name":"\u4f0a\u5b81\u53bf "},{"id":"4824","name":"\u5bdf\u5e03\u67e5\u5c14\u9521\u4f2f\u81ea\u6cbb\u53bf "},{"id":"4825","name":"\u970d\u57ce\u53bf "},{"id":"4826","name":"\u5de9\u7559\u53bf "},{"id":"4827","name":"\u65b0\u6e90\u53bf "},{"id":"4828","name":"\u662d\u82cf\u53bf "},{"id":"4829","name":"\u7279\u514b\u65af\u53bf "},{"id":"4830","name":"\u5c3c\u52d2\u514b\u53bf "}]},{"id":"372","name":"\u535a\u5c14\u5854\u62c9\u81ea\u6cbb\u5dde","child":[{"id":"4819","name":"\u535a\u4e50\u5e02 "},{"id":"4820","name":"\u7cbe\u6cb3\u53bf "},{"id":"4821","name":"\u6e29\u6cc9\u53bf "}]},{"id":"371","name":"\u660c\u5409\u81ea\u6cbb\u5dde","child":[{"id":"4812","name":"\u660c\u5409\u5e02 "},{"id":"4813","name":"\u961c\u5eb7\u5e02 "},{"id":"4814","name":"\u547c\u56fe\u58c1\u53bf "},{"id":"4815","name":"\u739b\u7eb3\u65af\u53bf "},{"id":"4816","name":"\u5947\u53f0\u53bf "},{"id":"4817","name":"\u5409\u6728\u8428\u5c14\u53bf "},{"id":"4818","name":"\u6728\u5792\u54c8\u8428\u514b\u81ea\u6cbb\u53bf  "}]},{"id":"363","name":"\u514b\u62c9\u739b\u4f9d\u5e02","child":[{"id":"4761","name":"\u72ec\u5c71\u5b50\u533a "},{"id":"4762","name":"\u514b\u62c9\u739b\u4f9d\u533a "},{"id":"4763","name":"\u767d\u78b1\u6ee9\u533a "},{"id":"4764","name":"\u4e4c\u5c14\u79be\u533a "}]},{"id":"364","name":"\u5410\u9c81\u756a\u5730\u533a","child":[{"id":"4765","name":"\u5410\u9c81\u756a\u5e02 "},{"id":"4766","name":"\u912f\u5584\u53bf "},{"id":"4767","name":"\u6258\u514b\u900a\u53bf "}]},{"id":"365","name":"\u54c8\u5bc6\u5730\u533a","child":[{"id":"4768","name":"\u54c8\u5bc6\u5e02 "},{"id":"4769","name":"\u5df4\u91cc\u5764\u54c8\u8428\u514b\u81ea\u6cbb\u53bf "},{"id":"4770","name":"\u4f0a\u543e\u53bf "}]},{"id":"366","name":"\u548c\u7530\u5730\u533a","child":[{"id":"4771","name":"\u548c\u7530\u53bf "},{"id":"4772","name":"\u58a8\u7389\u53bf "},{"id":"4773","name":"\u76ae\u5c71\u53bf "},{"id":"4774","name":"\u6d1b\u6d66\u53bf "},{"id":"4775","name":"\u7b56\u52d2\u53bf "},{"id":"4776","name":"\u4e8e\u7530\u53bf "},{"id":"4777","name":"\u6c11\u4e30\u53bf "}]},{"id":"367","name":"\u963f\u514b\u82cf\u5730\u533a","child":[{"id":"4778","name":"\u963f\u514b\u82cf\u5e02  "},{"id":"4779","name":"\u6e29\u5bbf\u53bf "},{"id":"4780","name":"\u5e93\u8f66\u53bf "},{"id":"4781","name":"\u6c99\u96c5\u53bf "},{"id":"4782","name":"\u65b0\u548c\u53bf "},{"id":"4783","name":"\u62dc\u57ce\u53bf "},{"id":"4784","name":"\u4e4c\u4ec0\u53bf "},{"id":"4785","name":"\u963f\u74e6\u63d0\u53bf "},{"id":"4786","name":"\u67ef\u576a\u53bf "}]},{"id":"368","name":"\u5580\u4ec0\u5e02","child":[{"id":"4787","name":"\u5580\u4ec0\u5e02  "},{"id":"4797","name":"\u5df4\u695a\u53bf "},{"id":"4796","name":"\u4f3d\u5e08\u53bf "},{"id":"4795","name":"\u5cb3\u666e\u6e56\u53bf "},{"id":"4794","name":"\u9ea6\u76d6\u63d0\u53bf "},{"id":"4793","name":"\u53f6\u57ce\u53bf "},{"id":"4792","name":"\u838e\u8f66\u53bf "},{"id":"4791","name":"\u6cfd\u666e\u53bf "},{"id":"4790","name":"\u82f1\u5409\u6c99\u53bf "},{"id":"4789","name":"\u758f\u52d2\u53bf "},{"id":"4788","name":"\u758f\u9644\u53bf "},{"id":"4798","name":"\u5854\u4ec0\u5e93\u5c14\u5e72\u5854\u5409\u514b\u81ea\u6cbb\u53bf "}]},{"id":"369","name":"\u514b\u5b5c\u52d2\u82cf\u67ef\u5c14\u514b\u5b5c\u81ea\u6cbb\u5dde","child":[{"id":"4799","name":"\u963f\u56fe\u4ec0\u5e02 "},{"id":"4800","name":"\u963f\u514b\u9676\u53bf "},{"id":"4801","name":"\u963f\u5408\u5947\u53bf "},{"id":"4802","name":"\u4e4c\u6070\u53bf "}]},{"id":"370","name":"\u5df4\u97f3\u90ed\u695e\u81ea\u6cbb\u5dde","child":[{"id":"4803","name":"\u5e93\u5c14\u52d2\u5e02 "},{"id":"4804","name":"\u8f6e\u53f0\u53bf "},{"id":"4805","name":"\u5c09\u7281\u53bf "},{"id":"4806","name":"\u82e5\u7f8c\u53bf "},{"id":"4807","name":"\u4e14\u672b\u53bf "},{"id":"4808","name":"\u7109\u8006\u56de\u65cf\u81ea\u6cbb\u53bf "},{"id":"4809","name":"\u548c\u9759\u53bf "},{"id":"4810","name":"\u548c\u7855\u53bf "},{"id":"4811","name":"\u535a\u6e56\u53bf "}]},{"id":"362","name":"\u4e4c\u9c81\u6728\u9f50\u5e02","child":[{"id":"4757","name":"\u5934\u5c6f\u6cb3\u533a "},{"id":"4758","name":"\u8fbe\u5742\u57ce\u533a "},{"id":"4759","name":"\u7c73\u4e1c\u533a "},{"id":"4760","name":"\u4e4c\u9c81\u6728\u9f50\u53bf "},{"id":"677","name":"\u5929\u5c71\u533a"},{"id":"678","name":"\u6c99\u4f9d\u5df4\u514b\u533a"},{"id":"679","name":"\u65b0\u5e02\u533a"},{"id":"680","name":"\u6c34\u78e8\u6c9f\u533a"}]}]},{"id":"33","name":"\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a","child":[{"id":"2593","name":"\u65b0\u754c","child":[{"id":"2606","name":"\u6c99\u7530\u533a"},{"id":"2605","name":"\u897f\u8d21\u533a"},{"id":"2604","name":"\u5317\u533a"},{"id":"2607","name":"\u5927\u57d4\u533a"},{"id":"2608","name":"\u79bb\u5c9b\u533a","child":[{"id":"5936","name":"\u5927\u5c7f\u5c71\u9999\u6e2f\u56fd\u9645\u673a\u573a"},{"id":"5937","name":"\u4e1c\u6d8c"},{"id":"5939","name":"\u6109\u666f\u6e7e"}]},{"id":"2609","name":"\u8475\u9752\u533a"},{"id":"2610","name":"\u8343\u6e7e\u533a"},{"id":"2611","name":"\u5c6f\u95e8\u533a"},{"id":"2612","name":"\u5143\u6717\u533a"}]},{"id":"2592","name":"\u4e5d\u9f99","child":[{"id":"2603","name":"\u89c2\u5858\u533a"},{"id":"2602","name":"\u9ec4\u5927\u4ed9\u533a"},{"id":"2601","name":"\u6df1\u6c34\u57d7\u533a"},{"id":"2600","name":"\u6cb9\u5c16\u65fa\u533a"},{"id":"2599","name":"\u4e5d\u9f99\u57ce\u533a"}]},{"id":"2591","name":"\u9999\u6e2f\u5c9b","child":[{"id":"2598","name":"\u6e7e\u4ed4\u533a"},{"id":"2597","name":"\u5357\u533a"},{"id":"2596","name":"\u4e1c\u533a"},{"id":"2595","name":"\u4e2d\u897f\u533a "}]}]},{"id":"34","name":"\u53f0\u6e7e\u7701","child":[{"id":"394","name":"\u53f0\u5317\u5e02"},{"id":"407","name":"\u5f70\u5316\u53bf","child":[{"id":"5949","name":"\u53bf\u4e2d\u5fc3"}]},{"id":"408","name":"\u5357\u6295\u53bf","child":[{"id":"5950","name":"\u8349\u5c6f"}]},{"id":"409","name":"\u4e91\u6797\u53bf","child":[{"id":"5951","name":"\u53bf\u4e2d\u5fc3"}]},{"id":"410","name":"\u5609\u4e49\u53bf","child":[{"id":"5953","name":"\u53bf\u4e2d\u5fc3"}]},{"id":"411","name":"\u53f0\u5357\u53bf","child":[{"id":"5954","name":"\u53bf\u4e2d\u5fc3"}]},{"id":"412","name":"\u9ad8\u96c4\u53bf","child":[{"id":"5956","name":"\u53bf\u4e2d\u5fc3"}]},{"id":"413","name":"\u5c4f\u4e1c\u53bf"},{"id":"414","name":"\u6f8e\u6e56\u53bf"},{"id":"415","name":"\u53f0\u4e1c\u53bf"},{"id":"406","name":"\u53f0\u4e2d\u53bf","child":[{"id":"5948","name":"\u53bf\u4e2d\u5fc3"}]},{"id":"405","name":"\u82d7\u6817\u53bf","child":[{"id":"5947","name":"\u53bf\u4e2d\u5fc3"}]},{"id":"404","name":"\u65b0\u7af9\u53bf","child":[{"id":"5946","name":"\u53bf\u4e2d\u5fc3"}]},{"id":"395","name":"\u9ad8\u96c4\u5e02"},{"id":"396","name":"\u57fa\u9686\u5e02"},{"id":"397","name":"\u53f0\u4e2d\u5e02"},{"id":"398","name":"\u53f0\u5357\u5e02"},{"id":"399","name":"\u65b0\u7af9\u5e02"},{"id":"400","name":"\u5609\u4e49\u5e02"},{"id":"401","name":"\u53f0\u5317\u53bf","child":[{"id":"5940","name":"\u53bf\u4e2d\u5fc3"}]},{"id":"402","name":"\u5b9c\u5170\u53bf"},{"id":"403","name":"\u6843\u56ed\u53bf"},{"id":"416","name":"\u82b1\u83b2\u53bf"}]},{"id":"19","name":"\u6e56\u5357\u7701","child":[{"id":"219","name":"\u957f\u6c99\u5e02","child":[{"id":"681","name":"\u5cb3\u9e93\u533a"},{"id":"682","name":"\u5f00\u798f\u533a"},{"id":"683","name":"\u5929\u5fc3\u533a"},{"id":"684","name":"\u8299\u84c9\u533a"},{"id":"685","name":"\u96e8\u82b1\u533a"},{"id":"686","name":"\u6d4f\u9633\u5e02","child":[{"id":"1311","name":"\u5e02\u4e2d\u5fc3"},{"id":"1312","name":"\u6dee\u5ddd\u529e\u4e8b\u5904"},{"id":"1313","name":"\u96c6\u91cc\u529e\u4e8b\u5904"},{"id":"1314","name":"\u8377\u82b1\u529e\u4e8b\u5904"},{"id":"1315","name":"\u5173\u53e3\u529e\u4e8b\u5904"},{"id":"1316","name":"\u6c38\u5b89\u9547"},{"id":"1317","name":"\u5317\u76db\u9547"},{"id":"1318","name":"\u6c5f\u80cc\u9547"}]},{"id":"687","name":"\u5b81\u4e61\u53bf","child":[{"id":"5900","name":"\u7389\u6f6d\u9547"},{"id":"5901","name":"\u5b81\u4e61\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5902","name":"\u56de\u9f99\u94fa\u9547"},{"id":"5903","name":"\u590f\u94ce\u94fa\u9547"},{"id":"5904","name":"\u91d1\u5dde\u65b0\u533a"}]},{"id":"688","name":"\u671b\u57ce\u53bf","child":[{"id":"1320","name":"\u57ce\u5173\u9547"},{"id":"1321","name":"\u9ad8\u5cad\u5858\u9547"},{"id":"1322","name":"\u9ec4\u91d1\u4e61"},{"id":"1323","name":"\u96f7\u950b\u9547"}]},{"id":"689","name":"\u957f\u6c99\u53bf","child":[{"id":"5905","name":"\u661f\u6c99\u9547"},{"id":"1324","name":"\u6994\u68a8\u9547"},{"id":"1325","name":"\u66ae\u4e91\u9547"},{"id":"1326","name":"\u5b89\u6c99\u9547"}]}]},{"id":"231","name":"\u5a04\u5e95\u5e02","child":[{"id":"4032","name":"\u51b7\u6c34\u6c5f\u5e02 "},{"id":"4030","name":"\u53cc\u5cf0\u53bf "},{"id":"4031","name":"\u65b0\u5316\u53bf "},{"id":"4033","name":"\u6d9f\u6e90\u5e02 "},{"id":"5910","name":"\u7ecf\u6d4e\u5f00\u53d1\u533a "},{"id":"690","name":"\u5a04\u661f\u533a"}]},{"id":"230","name":"\u6000\u5316\u5e02","child":[{"id":"5909","name":"\u57ce\u4e1c\u65b0\u533a"},{"id":"4029","name":"\u6d2a\u6c5f\u5e02 "},{"id":"4028","name":"\u901a\u9053\u4f97\u65cf\u81ea\u6cbb\u53bf "},{"id":"4027","name":"\u9756\u5dde\u82d7\u65cf\u4f97\u65cf\u81ea\u6cbb\u53bf "},{"id":"4026","name":"\u82b7\u6c5f\u4f97\u65cf\u81ea\u6cbb\u53bf "},{"id":"4025","name":"\u65b0\u6643\u4f97\u65cf\u81ea\u6cbb\u53bf "},{"id":"4024","name":"\u9ebb\u9633\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"4023","name":"\u4f1a\u540c\u53bf "},{"id":"4022","name":"\u6e86\u6d66\u53bf "},{"id":"4021","name":"\u8fb0\u6eaa\u53bf "},{"id":"4020","name":"\u6c85\u9675\u53bf  "},{"id":"4019","name":"\u4e2d\u65b9\u53bf "},{"id":"694","name":"\u6e56\u5929\u5f00\u53d1\u533a"},{"id":"693","name":"\u6cb3\u897f\u5f00\u53d1\u533a"},{"id":"692","name":"\u9e64\u57ce\u533a"}]},{"id":"229","name":"\u6c38\u5dde\u5e02","child":[{"id":"4018","name":"\u6c5f\u534e\u7476\u65cf\u81ea\u6cbb\u53bf "},{"id":"4017","name":"\u65b0\u7530\u53bf "},{"id":"4016","name":"\u84dd\u5c71\u53bf "},{"id":"4015","name":"\u5b81\u8fdc\u53bf "},{"id":"4014","name":"\u6c5f\u6c38\u53bf "},{"id":"4013","name":"\u9053\u53bf "},{"id":"4012","name":"\u53cc\u724c\u53bf "},{"id":"4011","name":"\u4e1c\u5b89\u53bf "},{"id":"4010","name":"\u7941\u9633\u53bf "},{"id":"696","name":"\u96f6\u9675\u533a"},{"id":"695","name":"\u51b7\u6c34\u6ee9\u533a"}]},{"id":"228","name":"\u90f4\u5dde\u5e02","child":[{"id":"4009","name":"\u5b89\u4ec1\u53bf "},{"id":"4008","name":"\u6842\u4e1c\u53bf "},{"id":"4007","name":"\u6c5d\u57ce\u53bf "},{"id":"4006","name":"\u4e34\u6b66\u53bf "},{"id":"4005","name":"\u5609\u79be\u53bf "},{"id":"4004","name":"\u6c38\u5174\u53bf "},{"id":"4002","name":"\u6842\u9633\u53bf "},{"id":"4003","name":"\u5b9c\u7ae0\u53bf "},{"id":"699","name":"\u8d44\u5174\u5e02","child":[{"id":"1327","name":"\u8d44\u5174\u5e02\u533a"},{"id":"1328","name":"\u9ca4\u9c7c\u6c5f\u9547"},{"id":"1329","name":"\u4e1c\u6c5f\u9547"}]},{"id":"698","name":"\u82cf\u4ed9\u533a"},{"id":"697","name":"\u5317\u6e56\u533a"}]},{"id":"227","name":"\u76ca\u9633\u5e02","child":[{"id":"3998","name":"\u5357\u53bf "},{"id":"3999","name":"\u6843\u6c5f\u53bf "},{"id":"4000","name":"\u5b89\u5316\u53bf "},{"id":"4001","name":"\u6c85\u6c5f\u5e02 "},{"id":"5907","name":"\u671d\u9633\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5908","name":"\u9f99\u5cad\u5de5\u4e1a\u533a "},{"id":"700","name":"\u8d6b\u5c71\u533a"},{"id":"701","name":"\u8d44\u9633\u533a"},{"id":"702","name":"\u9ad8\u65b0\u533a"}]},{"id":"226","name":"\u5f20\u5bb6\u754c\u5e02","child":[{"id":"3994","name":"\u6c38\u5b9a\u533a "},{"id":"3995","name":"\u6b66\u9675\u6e90\u533a "},{"id":"3996","name":"\u6148\u5229\u53bf "},{"id":"3997","name":"\u6851\u690d\u53bf "}]},{"id":"225","name":"\u5e38\u5fb7\u5e02","child":[{"id":"3993","name":"\u6d25\u5e02\u5e02 "},{"id":"3992","name":"\u77f3\u95e8\u53bf "},{"id":"3991","name":"\u4e34\u6fa7\u53bf "},{"id":"3990","name":"\u6fa7\u53bf "},{"id":"3989","name":"\u6c49\u5bff\u53bf  "},{"id":"3988","name":"\u5b89\u4e61\u53bf "},{"id":"708","name":"\u6843\u6e90\u53bf","child":[{"id":"5906","name":"\u6cb3\u4f0f\u9547"},{"id":"1333","name":"\u6f33\u6c5f\u9547"}]},{"id":"707","name":"\u5fb7\u5c71\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"706","name":"\u9f0e\u57ce\u533a"},{"id":"705","name":"\u6b66\u9675\u533a"}]},{"id":"224","name":"\u5cb3\u9633\u5e02","child":[{"id":"3987","name":"\u4e34\u6e58\u5e02 "},{"id":"3986","name":"\u6c68\u7f57\u5e02 "},{"id":"3985","name":"\u5e73\u6c5f\u53bf "},{"id":"3984","name":"\u6e58\u9634\u53bf "},{"id":"3982","name":"\u5cb3\u9633\u53bf "},{"id":"3983","name":"\u534e\u5bb9\u53bf "},{"id":"712","name":"\u5cb3\u9633\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"711","name":"\u541b\u5c71\u533a"},{"id":"710","name":"\u4e91\u6eaa\u533a"},{"id":"709","name":"\u5cb3\u9633\u697c\u533a"}]},{"id":"223","name":"\u90b5\u9633\u5e02","child":[{"id":"3981","name":"\u5317\u5854\u533a "},{"id":"3980","name":"\u6b66\u5188\u5e02 "},{"id":"3979","name":"\u57ce\u6b65\u82d7\u65cf\u81ea\u6cbb\u53bf "},{"id":"3978","name":"\u65b0\u5b81\u53bf "},{"id":"3977","name":"\u7ee5\u5b81\u53bf "},{"id":"3976","name":"\u6d1e\u53e3\u53bf "},{"id":"3975","name":"\u9686\u56de\u53bf "},{"id":"3974","name":"\u90b5\u9633\u53bf  "},{"id":"3973","name":"\u65b0\u90b5\u53bf "},{"id":"716","name":"\u90b5\u4e1c\u53bf","child":[{"id":"1338","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"714","name":"\u53cc\u6e05\u533a"},{"id":"713","name":"\u5927\u7965\u533a"}]},{"id":"222","name":"\u8861\u9633\u5e02","child":[{"id":"3972","name":"\u5e38\u5b81\u5e02 "},{"id":"3971","name":"\u8012\u9633\u5e02 "},{"id":"3970","name":"\u7941\u4e1c\u53bf "},{"id":"3968","name":"\u8861\u5c71\u53bf "},{"id":"3967","name":"\u8861\u5357\u53bf "},{"id":"3969","name":"\u8861\u4e1c\u53bf "},{"id":"3965","name":"\u5357\u5cb3\u533a "},{"id":"721","name":"\u8861\u9633\u53bf","child":[{"id":"1340","name":"\u897f\u6e21\u9547"}]},{"id":"720","name":"\u84b8\u6e58\u533a"},{"id":"719","name":"\u77f3\u9f13\u533a"},{"id":"718","name":"\u73e0\u6656\u533a"},{"id":"717","name":"\u96c1\u5cf0\u533a"}]},{"id":"221","name":"\u6e58\u6f6d\u5e02","child":[{"id":"3964","name":"\u97f6\u5c71\u5e02 "},{"id":"722","name":"\u96e8\u6e56\u533a"},{"id":"723","name":"\u5cb3\u5858\u533a"},{"id":"724","name":"\u6e58\u4e61\u5e02","child":[{"id":"1341","name":"\u5e02\u533a"}]},{"id":"725","name":"\u6e58\u6f6d\u53bf","child":[{"id":"1342","name":"\u5929\u6613\u5de5\u4e1a\u56ed"},{"id":"1343","name":"\u6613\u4fd7\u6cb3\u9547"}]}]},{"id":"220","name":"\u682a\u6d32\u5e02","child":[{"id":"3961","name":"\u6538\u53bf "},{"id":"3962","name":"\u8336\u9675\u53bf "},{"id":"3963","name":"\u708e\u9675\u53bf "},{"id":"727","name":"\u5929\u5143\u533a"},{"id":"728","name":"\u77f3\u5cf0\u533a"},{"id":"729","name":"\u82a6\u677e\u533a"},{"id":"730","name":"\u8377\u5858\u533a"},{"id":"731","name":"\u91b4\u9675\u5e02","child":[{"id":"1345","name":"\u5e02\u4e2d\u5fc3"},{"id":"1346","name":"\u5609\u6811\u4e61"},{"id":"1347","name":"\u738b\u4ed9\u9547"},{"id":"1348","name":"\u6d66\u53e3\u9547"},{"id":"1349","name":"\u4e1c\u5bcc\u9547"},{"id":"1350","name":"\u6cd7\u6c7e\u9547"},{"id":"1351","name":"\u5b59\u5bb6\u6e7e\u4e61"}]},{"id":"732","name":"\u682a\u6d32\u53bf","child":[{"id":"1352","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1353","name":"\u6e0c\u53e3\u9547"}]}]},{"id":"232","name":"\u6e58\u897f\u81ea\u6cbb\u5dde","child":[{"id":"4034","name":"\u5409\u9996\u5e02  "},{"id":"4035","name":"\u6cf8\u6eaa\u53bf "},{"id":"4036","name":"\u51e4\u51f0\u53bf "},{"id":"4037","name":"\u82b1\u57a3\u53bf "},{"id":"4038","name":"\u4fdd\u9756\u53bf "},{"id":"4039","name":"\u53e4\u4e08\u53bf "},{"id":"4040","name":"\u6c38\u987a\u53bf "},{"id":"4041","name":"\u9f99\u5c71\u53bf "}]}]},{"id":"18","name":"\u6e56\u5317\u7701","child":[{"id":"5891","name":"\u5341\u5830\u5e02","child":[{"id":"5892","name":"\u5f20\u6e7e\u533a"},{"id":"5893","name":"\u8305\u7bad\u533a"},{"id":"5894","name":"\u90e7\u53bf \u200e  "},{"id":"5895","name":"\u90e7\u897f\u53bf "},{"id":"5896","name":"\u200e\u7af9\u5c71\u53bf \u200e "},{"id":"5897","name":"\u7af9\u6eaa\u53bf \u200e "},{"id":"5898","name":"\u623f\u53bf \u200e"},{"id":"5899","name":"\u4e39\u6c5f\u53e3\u5e02 \u200e "}]},{"id":"3907","name":"\u5929\u95e8\u5e02 "},{"id":"2543","name":"\u6069\u65bd\u571f\u5bb6\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde","child":[{"id":"3953","name":"\u6069\u65bd\u5e02  "},{"id":"3954","name":"\u5229\u5ddd\u5e02 "},{"id":"3955","name":"\u5efa\u59cb\u53bf "},{"id":"3956","name":"\u5df4\u4e1c\u53bf "},{"id":"3957","name":"\u5ba3\u6069\u53bf "},{"id":"3958","name":"\u54b8\u4e30\u53bf "},{"id":"3959","name":"\u6765\u51e4\u53bf "},{"id":"3960","name":"\u9e64\u5cf0\u53bf "}]},{"id":"3906","name":"\u6f5c\u6c5f\u5e02 "},{"id":"2542","name":"\u4ed9\u6843\u5e02","child":[{"id":"5887","name":"\u4ed9\u6843\u57ce\u533a"},{"id":"5888","name":"\u4ed9\u6843\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5889","name":"\u4ed9\u6843\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5890","name":"\u5f6d\u573a\u9547"}]},{"id":"2541","name":"\u795e\u519c\u67b6\u6797\u533a"},{"id":"217","name":"\u968f\u5dde\u5e02","child":[{"id":"3944","name":"\u5e7f\u6c34\u5e02 "},{"id":"745","name":"\u66fe\u90fd\u533a"}]},{"id":"216","name":"\u54b8\u5b81\u5e02","child":[{"id":"3939","name":"\u5609\u9c7c\u53bf "},{"id":"3940","name":"\u901a\u57ce\u53bf "},{"id":"3941","name":"\u5d07\u9633\u53bf "},{"id":"3942","name":"\u901a\u5c71\u53bf "},{"id":"3943","name":"\u8d64\u58c1\u5e02 "},{"id":"750","name":"\u54b8\u5b89\u533a"}]},{"id":"215","name":"\u9ec4\u5188\u5e02","child":[{"id":"3938","name":"\u6b66\u7a74\u5e02 "},{"id":"3937","name":"\u9ebb\u57ce\u5e02 "},{"id":"3936","name":"\u9ec4\u6885\u53bf "},{"id":"3935","name":"\u8572\u6625\u53bf "},{"id":"3934","name":"\u6d60\u6c34\u53bf "},{"id":"3933","name":"\u82f1\u5c71\u53bf "},{"id":"3932","name":"\u7f57\u7530\u53bf  "},{"id":"3931","name":"\u7ea2\u5b89\u53bf "},{"id":"3930","name":"\u56e2\u98ce\u53bf "},{"id":"752","name":"\u9ec4\u5dde\u533a"}]},{"id":"214","name":"\u5b5d\u611f\u5e02","child":[{"id":"3929","name":"\u6c49\u5ddd\u5e02 "},{"id":"3928","name":"\u5b89\u9646\u5e02 "},{"id":"3927","name":"\u5e94\u57ce\u5e02 "},{"id":"3924","name":"\u5b5d\u660c\u53bf "},{"id":"3925","name":"\u5927\u609f\u53bf "},{"id":"3926","name":"\u4e91\u68a6\u53bf "},{"id":"756","name":"\u5b5d\u611f\u5f00\u53d1\u533a"},{"id":"755","name":"\u5b5d\u5357\u5f00\u53d1\u533a"},{"id":"754","name":"\u5357\u5927\u5f00\u53d1\u533a"},{"id":"753","name":"\u5b5d\u5357\u533a"}]},{"id":"213","name":"\u9102\u5dde\u5e02","child":[{"id":"3922","name":"\u6881\u5b50\u6e56\u533a "},{"id":"3923","name":"\u534e\u5bb9\u533a "},{"id":"757","name":"\u9102\u57ce\u533a"}]},{"id":"212","name":"\u8346\u95e8\u5e02","child":[{"id":"3920","name":"\u4eac\u5c71\u53bf "},{"id":"3921","name":"\u6c99\u6d0b\u53bf "},{"id":"758","name":"\u4e1c\u5b9d\u533a"},{"id":"759","name":"\u6387\u5200\u533a"},{"id":"760","name":"\u949f\u7965\u5e02","child":[{"id":"1360","name":"\u90e2\u4e2d\u9547"}]}]},{"id":"211","name":"\u5b9c\u660c\u5e02","child":[{"id":"3918","name":"\u4e94\u5cf0\u571f\u5bb6\u65cf\u81ea\u6cbb\u53bf "},{"id":"3917","name":"\u957f\u9633\u571f\u5bb6\u65cf\u81ea\u6cbb\u53bf "},{"id":"3916","name":"\u79ed\u5f52\u53bf "},{"id":"3915","name":"\u5174\u5c71\u53bf  "},{"id":"3914","name":"\u8fdc\u5b89\u53bf "},{"id":"3919","name":"\u5f53\u9633\u5e02"},{"id":"766","name":"\u5937\u9675\u533a"},{"id":"765","name":"\u897f\u9675\u7ecf\u6d4e\u53d1\u5c55\u56ed\u533a"},{"id":"1363","name":"\u70b9\u519b\u533a"},{"id":"1364","name":"\u679d\u6c5f\u5e02","child":[{"id":"1367","name":"\u9a6c\u5e97\u9547"},{"id":"1366","name":"\u5e02\u4e2d\u5fc3"},{"id":"1368","name":"\u6c5f\u53e3\u9547"},{"id":"1369","name":"\u8463\u5e02\u9547"},{"id":"1370","name":"\u95ee\u5b89\u9547"},{"id":"1371","name":"\u59da\u6e2f\u9547"},{"id":"1372","name":"\u4ed9\u5973\u9547"},{"id":"1373","name":"\u4e03\u661f\u53f0\u9547"}]},{"id":"1365","name":"\u5b9c\u90fd\u5e02","child":[{"id":"1374","name":"\u9646\u57ce\u9547"}]},{"id":"764","name":"\u5b9c\u660c\u5f00\u53d1\u533a"},{"id":"763","name":"\u7307\u4ead\u533a"},{"id":"762","name":"\u897f\u9675\u533a"},{"id":"761","name":"\u4f0d\u5bb6\u5c97\u533a"}]},{"id":"210","name":"\u8346\u5dde\u5e02","child":[{"id":"3909","name":"\u76d1\u5229\u53bf "},{"id":"3908","name":"\u516c\u5b89\u53bf "},{"id":"3913","name":"\u677e\u6ecb\u5e02 "},{"id":"3910","name":"\u6c5f\u9675\u53bf "},{"id":"3911","name":"\u77f3\u9996\u5e02 "},{"id":"3912","name":"\u6d2a\u6e56\u5e02 "},{"id":"769","name":"\u8346\u5dde\u533a"},{"id":"770","name":"\u6c99\u5e02\u533a"}]},{"id":"208","name":"\u8944\u9633\u5e02","child":[{"id":"3904","name":"\u8001\u6cb3\u53e3\u5e02 "},{"id":"3905","name":"\u5b9c\u57ce\u5e02 "},{"id":"3903","name":"\u4fdd\u5eb7\u53bf "},{"id":"3902","name":"\u8c37\u57ce\u53bf "},{"id":"3901","name":"\u5357\u6f33\u53bf  "},{"id":"778","name":"\u6a0a\u57ce\u533a"},{"id":"779","name":"\u8944\u57ce\u533a"},{"id":"1382","name":"\u67a3\u9633\u5e02","child":[{"id":"1383","name":"\u5e02\u4e2d\u5fc3"}]},{"id":"1377","name":"\u8944\u5dde\u533a"}]},{"id":"207","name":"\u9ec4\u77f3\u5e02","child":[{"id":"3900","name":"\u9633\u65b0\u53bf "},{"id":"5886","name":"\u9ec4\u91d1\u5c71\u5f00\u53d1\u533a"},{"id":"781","name":"\u9ec4\u77f3\u6e2f\u533a"},{"id":"783","name":"\u897f\u585e\u5c71\u533a"},{"id":"784","name":"\u94c1\u5c71\u533a"},{"id":"785","name":"\u4e0b\u9646\u533a"},{"id":"786","name":"\u5927\u51b6\u5e02","child":[{"id":"1384","name":"\u5e02\u4e2d\u5fc3"}]}]},{"id":"206","name":"\u6b66\u6c49\u5e02","child":[{"id":"5885","name":"\u4e1c\u6e56\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"3899","name":"\u65b0\u6d32\u533a "},{"id":"3898","name":"\u6c49\u5357\u533a"},{"id":"743","name":"\u4e1c\u897f\u6e56\u533a"},{"id":"742","name":"\u9ec4\u9642\u533a"},{"id":"741","name":"\u8521\u7538\u533a"},{"id":"740","name":"\u6c5f\u590f\u533a"},{"id":"739","name":"\u6c49\u9633\u533a"},{"id":"738","name":"\u9752\u5c71\u533a"},{"id":"737","name":"\u6d2a\u5c71\u533a"},{"id":"736","name":"\u6b66\u660c\u533a"},{"id":"735","name":"\u785a\u53e3\u533a"},{"id":"734","name":"\u6c5f\u5cb8\u533a"},{"id":"733","name":"\u6c5f\u6c49\u533a"}]}]},{"id":"3","name":"\u5929\u6d25\u5e02","child":[{"id":"2304","name":"\u548c\u5e73\u533a"},{"id":"2321","name":"\u84df\u53bf","child":[{"id":"2323","name":"\u84df\u53bf\u5f00\u53d1\u533a"},{"id":"2335","name":"\u793c\u660e\u5e84\u4e61"},{"id":"2334","name":"\u522b\u5c71\u9547"},{"id":"2333","name":"\u90a6\u5747\u9547"},{"id":"2332","name":"\u5b98\u5e84\u9547"},{"id":"2331","name":"\u51fa\u5934\u5cad\u9547"},{"id":"2330","name":"\u4e0b\u7a9d\u5934\u9547"},{"id":"2329","name":"\u7a7f\u82b3\u5cea\u4e61"},{"id":"2328","name":"\u4e1c\u8d75\u5404\u5e84\u4e61"},{"id":"2327","name":"\u6768\u6d25\u5e84\u9547"},{"id":"2326","name":"\u4e0a\u4ed3\u9547"},{"id":"2325","name":"\u9a6c\u4f38\u6865\u9547"},{"id":"2324","name":"\u57ce\u5173\u9547"},{"id":"2336","name":"\u4e0b\u4ed3\u9547"}]},{"id":"2320","name":"\u9759\u6d77\u53bf","child":[{"id":"4948","name":"\u9759\u6d77\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"4958","name":"\u6768\u6210\u5e84\u9547 "},{"id":"4957","name":"\u5b50\u7259\u9547 "},{"id":"4956","name":"\u56e2\u6cca\u9547 "},{"id":"4954","name":"\u9648\u5b98\u5c6f\u9547 "},{"id":"4953","name":"\u53cc\u5858\u9547 "},{"id":"4952","name":"\u6881\u5934\u9547 "},{"id":"4951","name":"\u72ec\u6d41\u9547 "},{"id":"4950","name":"\u5927\u90b1\u5e84\u9547 "},{"id":"4949","name":"\u5927\u4e30\u5806\u9547 "},{"id":"4955","name":"\u6cbf\u5e84\u9547 "},{"id":"4947","name":"\u9759\u6d77\u9547 "},{"id":"4959","name":"\u5510\u5b98\u5c6f\u9547 "}]},{"id":"2319","name":"\u5b81\u6cb3\u53bf","child":[{"id":"2338","name":"\u5b81\u6cb3\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"2339","name":"\u82a6\u53f0\u9547"}]},{"id":"2318","name":"\u5b9d\u577b\u533a"},{"id":"2317","name":"\u6b66\u6e05\u533a"},{"id":"2316","name":"\u5317\u8fb0\u533a"},{"id":"2315","name":"\u6d25\u5357\u533a"},{"id":"2314","name":"\u897f\u9752\u533a"},{"id":"2313","name":"\u4e1c\u4e3d\u533a"},{"id":"2312","name":"\u5927\u6e2f\u533a"},{"id":"2311","name":"\u6c49\u6cbd\u533a"},{"id":"2310","name":"\u5858\u6cbd\u533a"},{"id":"2309","name":"\u7ea2\u6865\u533a"},{"id":"2308","name":"\u6cb3\u5317\u533a"},{"id":"2307","name":"\u5357\u5f00\u533a"},{"id":"2306","name":"\u6cb3\u897f\u533a"},{"id":"2305","name":"\u6cb3\u4e1c\u533a"},{"id":"6025","name":"\u6ee8\u6d77\u65b0\u533a"}]},{"id":"4","name":"\u6cb3\u5317\u7701","child":[{"id":"6053","name":"\u9075\u5316\u5e02"},{"id":"2341","name":"\u5f20\u5bb6\u53e3\u5e02","child":[{"id":"2459","name":"\u6865\u4e1c\u533a"},{"id":"2474","name":"\u5d07\u793c\u53bf"},{"id":"2473","name":"\u8d64\u57ce\u53bf"},{"id":"2472","name":"\u6dbf\u9e7f\u53bf"},{"id":"2471","name":"\u6000\u6765\u53bf"},{"id":"2470","name":"\u4e07\u5168\u53bf"},{"id":"2469","name":"\u6000\u5b89\u53bf"},{"id":"2468","name":"\u9633\u539f\u53bf"},{"id":"2467","name":"\u851a\u53bf"},{"id":"2466","name":"\u5c1a\u4e49\u53bf"},{"id":"2465","name":"\u6cbd\u6e90\u53bf"},{"id":"2464","name":"\u5eb7\u4fdd\u53bf"},{"id":"2463","name":"\u5f20\u5317\u53bf"},{"id":"2462","name":"\u5ba3\u5316\u53bf"},{"id":"2461","name":"\u4e0b\u82b1\u56ed\u533a"},{"id":"2460","name":"\u6865\u897f\u533a"},{"id":"6015","name":"\u5ba3\u5316\u533a"}]},{"id":"2340","name":"\u627f\u5fb7\u5e02","child":[{"id":"2448","name":"\u53cc\u6865\u533a"},{"id":"2457","name":"\u5bbd\u57ce\u6ee1\u65cf\u81ea\u6cbb\u53bf"},{"id":"2456","name":"\u4e30\u5b81\u6ee1\u65cf\u81ea\u6cbb\u53bf"},{"id":"2455","name":"\u9686\u5316\u53bf"},{"id":"2454","name":"\u6ee6\u5e73\u53bf"},{"id":"2453","name":"\u5e73\u6cc9\u53bf"},{"id":"2452","name":"\u5174\u9686\u53bf"},{"id":"2451","name":"\u627f\u5fb7\u53bf"},{"id":"2450","name":"\u9e70\u624b\u8425\u5b50\u77ff\u533a"},{"id":"2449","name":"\u53cc\u6ee6\u533a"},{"id":"2458","name":" \u56f4\u573a\u6ee1\u65cf\u8499\u53e4\u65cf\u81ea\u6cbb\u53bf "}]},{"id":"47","name":"\u8861\u6c34\u5e02","child":[{"id":"4976","name":"\u8861\u6c34\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"2446","name":"\u5180\u5dde\u5e02"},{"id":"2445","name":"\u961c\u57ce\u53bf"},{"id":"2444","name":"\u666f\u53bf"},{"id":"2443","name":"\u6545\u57ce\u53bf"},{"id":"2441","name":"\u9976\u9633\u53bf"},{"id":"2440","name":"\u6b66\u5f3a\u53bf"},{"id":"2439","name":"\u6b66\u9091\u53bf"},{"id":"2438","name":"\u67a3\u5f3a\u53bf"},{"id":"2437","name":"\u6843\u57ce\u533a"},{"id":"2447","name":"\u6df1\u5dde\u5e02"},{"id":"1815","name":"\u5b89\u5e73\u53bf","child":[{"id":"1816","name":"\u53bf\u57ce\u4e2d\u5fc3"}]}]},{"id":"46","name":"\u5eca\u574a\u5e02","child":[{"id":"2434","name":"\u6c38\u6e05\u53bf"},{"id":"2432","name":"\u5b89\u6b21\u533a"},{"id":"2433","name":"\u5e7f\u9633\u533a"},{"id":"1695","name":"\u5927\u5382\u56de\u65cf\u81ea\u6cbb\u53bf","child":[{"id":"1696","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"1693","name":"\u4e09\u6cb3\u5e02","child":[{"id":"1694","name":"\u5e02\u533a"}]},{"id":"1691","name":"\u56fa\u5b89\u53bf","child":[{"id":"1692","name":"\u725b\u9a7c\u9547"}]},{"id":"1689","name":"\u5927\u57ce\u53bf","child":[{"id":"2124","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1690","name":"\u4e1c\u961c\u6469\u914d\u5de5\u4e1a\u56ed\u533a"}]},{"id":"1686","name":"\u6587\u5b89\u53bf","child":[{"id":"1687","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1688","name":"\u65b0\u9547"}]},{"id":"1683","name":"\u9999\u6cb3\u53bf","child":[{"id":"1684","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1685","name":"\u6dd1\u9633\u9547"}]},{"id":"1665","name":"\u9738\u5dde\u5e02","child":[{"id":"1667","name":"\u5317\u57ce\u533a"},{"id":"1681","name":"\u80dc\u82b3\u5f00\u53d1\u533a"},{"id":"1680","name":"\u80dc\u82b3\u9547"},{"id":"1679","name":"\u4e1c\u6bb5\u5f00\u53d1\u533a"},{"id":"1678","name":"\u4e1c\u6bb5"},{"id":"1677","name":"\u5802\u4e8c\u91cc\u9547"},{"id":"1676","name":"\u8f9b\u7ae0\u4e61"},{"id":"1675","name":"\u5c94\u6cb3\u96c6\u4e61"},{"id":"1674","name":"\u5357\u5b5f\u9547"},{"id":"1673","name":"\u4e1c\u6768\u5e84\u4e61"},{"id":"1672","name":"\u714e\u837c\u94fa\u9547"},{"id":"1671","name":"\u5eb7\u4ed9\u5e84\u4e61"},{"id":"1670","name":"\u9738\u5dde\u9547"},{"id":"1669","name":"\u4fe1\u5b89\u9547"},{"id":"1668","name":"\u5357\u57ce\u533a"},{"id":"1682","name":"\u4e2d\u53e3\u4e61"}]}]},{"id":"45","name":"\u6ca7\u5dde\u5e02","child":[{"id":"2420","name":"\u65b0\u534e\u533a"},{"id":"2430","name":"\u4efb\u4e18\u5e02"},{"id":"2429","name":"\u5b5f\u6751\u56de\u65cf\u81ea\u6cbb\u53bf"},{"id":"2428","name":"\u732e\u53bf"},{"id":"2427","name":"\u5434\u6865\u53bf"},{"id":"2426","name":"\u5357\u76ae\u53bf","child":[{"id":"4972","name":"\u5218\u516b\u91cc\u4e61"},{"id":"4973","name":"\u51af\u5bb6\u53e3\u9547"},{"id":"4974","name":"\u57ce\u5173\u9547"},{"id":"4975","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"2425","name":"\u8083\u5b81\u53bf"},{"id":"2424","name":"\u76d0\u5c71\u53bf"},{"id":"2423","name":"\u6d77\u5174\u53bf"},{"id":"2422","name":"\u4e1c\u5149\u53bf"},{"id":"2421","name":"\u8fd0\u6cb3\u533a"},{"id":"4971","name":"\u6ca7\u5dde\u5e02\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a "},{"id":"2431","name":"\u6cb3\u95f4\u5e02 "},{"id":"1711","name":"\u6cca\u5934\u5e02","child":[{"id":"1712","name":"\u5e02\u4e2d\u5fc3"},{"id":"1713","name":"\u6cca\u5934\u5de5\u4e1a\u56ed"}]},{"id":"1708","name":"\u6ca7\u53bf","child":[{"id":"1709","name":"\u7eb8\u623f\u5934\u5de5\u4e1a\u533a"},{"id":"1710","name":"\u859b\u5b98\u5c6f\u4e61"}]},{"id":"1703","name":"\u9752\u53bf","child":[{"id":"2122","name":"\u76d8\u53e4\u9547"},{"id":"1704","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1705","name":"\u9a6c\u5382\u9547"},{"id":"1706","name":"\u5174\u6d4e\u9547"}]},{"id":"1701","name":"\u9ec4\u9a85\u5e02","child":[{"id":"1702","name":"\u5e02\u4e2d\u5fc3"}]}]},{"id":"42","name":"\u4fdd\u5b9a\u5e02 ","child":[{"id":"2404","name":"\u65b0\u5e02\u533a"},{"id":"2406","name":"\u5357\u5e02\u533a"},{"id":"2409","name":"\u6d9e\u6c34\u53bf"},{"id":"2410","name":"\u961c\u5e73\u53bf"},{"id":"2411","name":"\u5510\u53bf"},{"id":"2413","name":"\u6d9e\u6e90\u53bf"},{"id":"2414","name":"\u671b\u90fd\u53bf"},{"id":"2415","name":"\u6613\u53bf"},{"id":"2416","name":"\u66f2\u9633\u53bf"},{"id":"2417","name":"\u987a\u5e73\u53bf"},{"id":"2418","name":"\u535a\u91ce\u53bf"},{"id":"5989","name":"\u767d\u6c9f\u53bf"},{"id":"2405","name":"\u5317\u5e02\u533a"},{"id":"6061","name":"\u9ad8\u5f00\u533a"},{"id":"1757","name":"\u5b89\u56fd\u5e02","child":[{"id":"1758","name":"\u5e02\u533a"}]},{"id":"1718","name":"\u8821\u53bf(\u91cc\u53bf)","child":[{"id":"2119","name":"\u57ce\u5173\u9547(\u8821\u543e\u9547)"},{"id":"2120","name":"\u767e\u5c3a\u9547"},{"id":"1719","name":"\u7559\u53f2\u9547"},{"id":"1720","name":"\u8f9b\u5174\u9547"},{"id":"1721","name":"\u664b\u5e84\u4e61"},{"id":"1722","name":"\u90a2\u5357\u4e61"}]},{"id":"1723","name":"\u9ad8\u9633\u53bf","child":[{"id":"4968","name":"\u57ce\u5357\u5f00\u53d1\u533a "},{"id":"4969","name":"\u5357\u6c99\u5de5\u4e1a\u533a "},{"id":"4970","name":"\u5317\u6c99\u5de5\u4e1a\u533a "},{"id":"1725","name":"\u66f2\u63d0\u4e61"},{"id":"1726","name":"\u664b\u5e84\u4e61"},{"id":"1727","name":"\u90a2\u5357\u4e61"}]},{"id":"1728","name":"\u96c4\u53bf","child":[{"id":"1729","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1730","name":"\u57ce\u5173\u9547"},{"id":"1731","name":"\u9f99\u6e7e\u4e61"},{"id":"1732","name":"\u661d\u5c97\u9547"},{"id":"1733","name":"\u6731\u5404\u5e84\u4e61"},{"id":"1734","name":"\u96c4\u5dde\u9547"},{"id":"1735","name":"\u9f99\u6e7e\u9547"},{"id":"1736","name":"\u5927\u8425\u9547"}]},{"id":"1737","name":"\u9ad8\u7891\u5e97\u5e02","child":[{"id":"1738","name":"\u5e02\u533a"},{"id":"1739","name":"\u767d\u6c9f\u9547"}]},{"id":"1740","name":"\u5bb9\u57ce\u53bf","child":[{"id":"1741","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"1742","name":"\u5b89\u65b0\u53bf","child":[{"id":"1743","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1744","name":"\u4e09\u53f0\u9547"},{"id":"1745","name":"\u5c0f\u91cc\u9547"}]},{"id":"1746","name":"\u5f90\u6c34\u53bf","child":[{"id":"1747","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"1748","name":"\u5b9a\u5dde\u5e02","child":[{"id":"1749","name":"\u5e02\u533a"}]},{"id":"1750","name":"\u6ee1\u57ce\u53bf","child":[{"id":"1751","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"1752","name":"\u5b9a\u5174\u53bf","child":[{"id":"1754","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"1755","name":"\u6dbf\u5dde\u5e02","child":[{"id":"1756","name":"\u5e02\u533a"}]},{"id":"1759","name":"\u6e05\u82d1\u53bf","child":[{"id":"1760","name":"\u95eb\u5e84\u4e61"}]}]},{"id":"41","name":"\u90a2\u53f0\u5e02 ","child":[{"id":"2388","name":"\u6865\u4e1c\u533a"},{"id":"2402","name":"\u4e34\u897f\u53bf"},{"id":"2401","name":"\u5a01\u53bf"},{"id":"2400","name":"\u5e73\u4e61\u53bf"},{"id":"2399","name":"\u5e7f\u5b97\u53bf"},{"id":"2397","name":"\u5de8\u9e7f\u53bf"},{"id":"2396","name":"\u5357\u548c\u53bf"},{"id":"2395","name":"\u4efb\u53bf"},{"id":"2394","name":"\u9686\u5c27\u53bf"},{"id":"2393","name":"\u67cf\u4e61\u53bf"},{"id":"2392","name":"\u5185\u4e18\u53bf"},{"id":"2391","name":"\u4e34\u57ce\u53bf"},{"id":"2390","name":"\u90a2\u53f0\u53bf"},{"id":"2389","name":"\u6865\u897f\u533a"},{"id":"2403","name":"\u6c99\u6cb3\u5e02 "},{"id":"1772","name":"\u65b0\u6cb3\u53bf","child":[{"id":"1773","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"1770","name":"\u5357\u5bab\u5e02","child":[{"id":"1771","name":"\u6bb5\u82a6\u5934\u5de5\u4e1a\u533a"}]},{"id":"1767","name":"\u6e05\u6cb3\u53bf","child":[{"id":"1768","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1769","name":"\u738b\u5b98\u5e84\u4e61"}]},{"id":"1765","name":"\u5b81\u664b\u53bf","child":[{"id":"1766","name":"\u897f\u57ce\u5f00\u53d1\u533a"}]}]},{"id":"40","name":"\u90af\u90f8\u5e02 ","child":[{"id":"2370","name":"\u90af\u5c71\u533a"},{"id":"2383","name":"\u5e7f\u5e73\u53bf"},{"id":"2381","name":"\u90b1\u53bf"},{"id":"2382","name":"\u9e21\u6cfd\u53bf"},{"id":"2384","name":"\u9986\u9676\u53bf"},{"id":"2385","name":"\u9b4f\u53bf"},{"id":"2386","name":"\u66f2\u5468\u53bf"},{"id":"2387","name":"\u6b66\u5b89\u5e02"},{"id":"4965","name":"\u90af\u90f8\u5e02\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a "},{"id":"2379","name":"\u80a5\u4e61\u53bf"},{"id":"2378","name":"\u78c1\u53bf"},{"id":"2377","name":"\u6d89\u53bf"},{"id":"2371","name":"\u4e1b\u53f0\u533a"},{"id":"2372","name":"\u590d\u5174\u533a"},{"id":"2373","name":"\u5cf0\u5cf0\u77ff\u533a"},{"id":"2374","name":"\u90af\u90f8\u53bf"},{"id":"2375","name":"\u4e34\u6f33\u53bf"},{"id":"2376","name":"\u5927\u540d\u53bf"},{"id":"4966","name":"\u9a6c\u5e84\u5de5\u4e1a\u533a "},{"id":"1782","name":"\u6c38\u5e74\u53bf","child":[{"id":"1783","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1784","name":"\u4e34\u6d3a\u5173\u9547"}]},{"id":"1780","name":"\u6210\u5b89\u53bf","child":[{"id":"1781","name":"\u53bf\u57ce\u4e2d\u5fc3"}]}]},{"id":"39","name":"\u79e6\u7687\u5c9b\u5e02 ","child":[{"id":"4964","name":"\u79e6\u7687\u5c9b\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"2366","name":"\u6d77\u6e2f\u533a"},{"id":"2367","name":"\u5c71\u6d77\u5173\u533a"},{"id":"2368","name":"\u5317\u6234\u6cb3\u533a"},{"id":"2369","name":"\u5362\u9f99\u53bf"},{"id":"6072","name":"\u9752\u9f99\u6ee1\u65cf\u81ea\u6cbb\u53bf"},{"id":"1790","name":"\u660c\u9ece\u53bf","child":[{"id":"1791","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"1792","name":"\u629a\u5b81\u53bf","child":[{"id":"2118","name":"\u7559\u5b88\u8425\u9547"},{"id":"1793","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1794","name":"\u6986\u5173\u9547"}]}]},{"id":"38","name":"\u5510\u5c71\u5e02","child":[{"id":"4962","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"2364","name":"\u9075\u5316\u5e02"},{"id":"2363","name":"\u5510\u6d77\u53bf"},{"id":"2362","name":"\u8fc1\u897f\u53bf"},{"id":"2361","name":"\u4e50\u4ead\u53bf"},{"id":"2360","name":"\u6ee6\u5357\u53bf"},{"id":"2359","name":"\u6ee6\u53bf"},{"id":"2358","name":"\u4e30\u6da6\u533a"},{"id":"2357","name":"\u4e30\u5357\u533a"},{"id":"2356","name":"\u5f00\u5e73\u533a"},{"id":"2355","name":"\u53e4\u51b6\u533a"},{"id":"2354","name":"\u8def\u5317\u533a"},{"id":"2353","name":"\u8def\u5357\u533a"},{"id":"2365","name":"\u8fc1\u5b89\u5e02"},{"id":"1802","name":"\u7389\u7530\u53bf","child":[{"id":"4963","name":"\u77f3\u81fc\u7a9d\u9547"},{"id":"1803","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1804","name":"\u6797\u5357\u4ed3\u9547"},{"id":"1806","name":"\u9e26\u9e3f\u6865\u9547"},{"id":"1807","name":"\u6768\u5bb6\u677f\u6865\u9547"},{"id":"1808","name":"\u7ea2\u6865\u9547"}]}]},{"id":"37","name":"\u77f3\u5bb6\u5e84\u5e02","child":[{"id":"2342","name":"\u6865\u4e1c\u533a"},{"id":"2344","name":"\u65b0\u534e\u533a"},{"id":"2345","name":"\u88d5\u534e\u533a"},{"id":"2346","name":"\u957f\u5b89\u533a"},{"id":"2347","name":"\u4e95\u9649\u53bf"},{"id":"2348","name":"\u884c\u5510\u53bf"},{"id":"2349","name":"\u9ad8\u9091\u53bf"},{"id":"2350","name":"\u6df1\u6cfd\u53bf"},{"id":"2351","name":"\u8d5e\u7687\u53bf"},{"id":"2352","name":"\u5e73\u5c71\u53bf"},{"id":"2343","name":"\u6865\u897f\u533a"},{"id":"4961","name":"\u77f3\u5bb6\u5e84\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a "},{"id":"1652","name":"\u5143\u6c0f\u53bf","child":[{"id":"1653","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"1613","name":"\u9e7f\u6cc9\u5e02","child":[{"id":"2108","name":"\u9e7f\u6cc9\u5e02\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"1615","name":"\u4e0a\u5e84\u9547"},{"id":"1616","name":"\u94dc\u51b6\u9547"},{"id":"1617","name":"\u5bfa\u5bb6\u5e84\u9547"}]},{"id":"1618","name":"\u8f9b\u96c6\u5e02","child":[{"id":"2109","name":"\u7530\u5e84\u4e61"},{"id":"2110","name":"\u951a\u8425\u5236\u9769\u5de5\u4e1a\u533a"}]},{"id":"1620","name":"\u664b\u5dde\u5e02","child":[{"id":"1622","name":"\u9a6c\u4e8e\u9547"},{"id":"1623","name":"\u4e1c\u5353\u5bbf\u4e61"},{"id":"1624","name":"\u4e1c\u5bfa\u5415\u4e61"},{"id":"1625","name":"\u603b\u5341\u5e84\u9547"},{"id":"1626","name":"\u4e1c\u91cc\u5e84\u4e61"},{"id":"1627","name":"\u69d0\u6811\u9547"},{"id":"1628","name":"\u7941\u5e95\u9547"}]},{"id":"1629","name":"\u65b0\u4e50\u5e02","child":[{"id":"1631","name":"\u957f\u5bff\u9547"},{"id":"1632","name":"\u627f\u5b89\u94fa\u9547"}]},{"id":"1633","name":"\u6b63\u5b9a\u53bf","child":[{"id":"1635","name":"\u8bf8\u798f\u5c6f\u9547"},{"id":"1636","name":"\u65b0\u57ce\u94fa\u9547"},{"id":"1637","name":"\u5357\u725b\u9547"}]},{"id":"1638","name":"\u65e0\u6781\u53bf","child":[{"id":"1639","name":"\u65e0\u6781\u9547(\u57ce\u5173\u9547)"},{"id":"1640","name":"\u5f20\u6bb5\u56fa\u9547"},{"id":"1641","name":"\u90dd\u5e84\u9547"},{"id":"1642","name":"\u4e1c\u5019\u574a\u9547"}]},{"id":"1643","name":"\u85c1\u57ce\u5e02","child":[{"id":"1644","name":"\u5e02\u533a"},{"id":"1645","name":"\u826f\u6751\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"1646","name":"\u683e\u57ce\u53bf","child":[{"id":"1648","name":"\u697c\u5e95\u9547"},{"id":"1649","name":"\u7aa6\u59aa\u9547"}]},{"id":"1650","name":"\u7075\u5bff\u53bf","child":[{"id":"1651","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"1654","name":"\u8d75\u53bf","child":[{"id":"1655","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1656","name":"\u65b0\u5be8\u5e97\u5de5\u4e1a\u533a"},{"id":"1657","name":"\u56fa\u57ce\u5de5\u4e1a\u533a"}]}]}]},{"id":"5","name":"\u5c71\u897f\u7701","child":[{"id":"2484","name":"\u4e34\u6c7e\u5e02","child":[{"id":"2828","name":"\u5c27\u90fd\u533a "},{"id":"2843","name":"\u4faf\u9a6c\u5e02"},{"id":"2842","name":"\u6c7e\u897f\u53bf"},{"id":"2841","name":"\u84b2\u53bf"},{"id":"2840","name":"\u6c38\u548c\u53bf"},{"id":"2839","name":"\u96b0\u53bf"},{"id":"2838","name":"\u5927\u5b81\u53bf"},{"id":"2837","name":"\u4e61\u5b81\u53bf"},{"id":"2836","name":"\u5409\u53bf"},{"id":"2835","name":"\u6d6e\u5c71\u53bf"},{"id":"2834","name":"\u5b89\u6cfd\u53bf"},{"id":"2833","name":"\u53e4\u53bf"},{"id":"2832","name":"\u6d2a\u6d1e\u53bf"},{"id":"2831","name":"\u8944\u6c7e\u53bf"},{"id":"2830","name":"\u7ffc\u57ce\u53bf"},{"id":"2829","name":"\u66f2\u6c83\u53bf"},{"id":"2844","name":"\u970d\u5dde\u5e02"}]},{"id":"2483","name":"\u5415\u6881\u5e02","child":[{"id":"2815","name":"\u79bb\u77f3\u533a"},{"id":"2826","name":"\u5b5d\u4e49\u5e02"},{"id":"2825","name":"\u4ea4\u53e3\u53bf"},{"id":"2824","name":"\u4e2d\u9633\u53bf"},{"id":"2823","name":"\u65b9\u5c71\u53bf"},{"id":"2822","name":"\u5c9a\u53bf"},{"id":"2821","name":"\u77f3\u697c\u53bf"},{"id":"2820","name":"\u67f3\u6797\u53bf"},{"id":"2819","name":"\u4e34\u53bf"},{"id":"2818","name":"\u5174\u53bf"},{"id":"2817","name":"\u4ea4\u57ce\u53bf"},{"id":"2816","name":"\u6587\u6c34\u53bf"},{"id":"2827","name":"\u6c7e\u9633\u5e02"}]},{"id":"2482","name":"\u5ffb\u5dde\u5e02","child":[{"id":"2800","name":"\u5ffb\u5e9c\u533a"},{"id":"2813","name":"\u504f\u5173\u53bf"},{"id":"2812","name":"\u4fdd\u5fb7\u53bf"},{"id":"2811","name":"\u6cb3\u66f2\u53bf"},{"id":"2810","name":"\u5ca2\u5c9a\u53bf"},{"id":"2809","name":"\u4e94\u5be8\u53bf"},{"id":"2807","name":"\u795e\u6c60\u53bf"},{"id":"2806","name":"\u9759\u4e50\u53bf"},{"id":"2805","name":"\u5b81\u6b66\u53bf"},{"id":"2804","name":"\u7e41\u5cd9\u53bf"},{"id":"2803","name":"\u4ee3\u53bf"},{"id":"2802","name":"\u4e94\u53f0\u53bf"},{"id":"2801","name":"\u5b9a\u8944\u53bf"},{"id":"2814","name":"\u539f\u5e73\u5e02"}]},{"id":"2481","name":"\u8fd0\u57ce\u5e02","child":[{"id":"2787","name":"\u76d0\u6e56\u533a"},{"id":"2798","name":"\u6c38\u6d4e\u5e02"},{"id":"2797","name":"\u82ae\u57ce\u53bf"},{"id":"2796","name":"\u5e73\u9646\u53bf"},{"id":"2795","name":"\u590f\u53bf"},{"id":"2794","name":"\u57a3\u66f2\u53bf"},{"id":"2793","name":"\u7edb\u53bf"},{"id":"2792","name":"\u65b0\u7edb\u53bf"},{"id":"2791","name":"\u7a37\u5c71\u53bf"},{"id":"2790","name":"\u95fb\u559c\u53bf"},{"id":"2789","name":"\u4e07\u8363\u53bf"},{"id":"2788","name":"\u4e34\u7317\u53bf"},{"id":"2799","name":"\u6cb3\u6d25\u5e02"}]},{"id":"2479","name":"\u6714\u5dde\u5e02","child":[{"id":"2781","name":"\u6714\u57ce\u533a"},{"id":"2782","name":"\u5e73\u9c81\u533a"},{"id":"2783","name":"\u5c71\u9634\u53bf"},{"id":"2784","name":"\u5e94\u53bf"},{"id":"2785","name":"\u53f3\u7389\u53bf"},{"id":"2786","name":"\u6000\u4ec1\u53bf"}]},{"id":"2478","name":"\u664b\u57ce\u5e02","child":[{"id":"2775","name":"\u57ce\u533a"},{"id":"2776","name":"\u6c81\u6c34\u53bf"},{"id":"2777","name":"\u9633\u57ce\u53bf"},{"id":"2778","name":"\u9675\u5ddd\u53bf"},{"id":"2779","name":"\u6cfd\u5dde\u53bf"},{"id":"2780","name":"\u9ad8\u5e73\u5e02"}]},{"id":"2477","name":"\u957f\u6cbb\u5e02","child":[{"id":"2763","name":"\u957f\u6cbb\u53bf"},{"id":"2774","name":"\u6f5e\u57ce\u5e02"},{"id":"2773","name":"\u6c81\u6e90\u53bf"},{"id":"2772","name":"\u6c81\u53bf"},{"id":"2771","name":"\u6b66\u4e61\u53bf"},{"id":"2770","name":"\u957f\u5b50\u53bf"},{"id":"2769","name":"\u58f6\u5173\u53bf"},{"id":"2767","name":"\u9ece\u57ce\u53bf"},{"id":"2766","name":"\u5e73\u987a\u53bf"},{"id":"2765","name":"\u5c6f\u7559\u53bf"},{"id":"2764","name":"\u8944\u57a3\u53bf"},{"id":"6022","name":"\u57ce\u533a"}]},{"id":"2476","name":"\u9633\u6cc9\u5e02","child":[{"id":"2760","name":"\u77ff\u533a"},{"id":"2761","name":"\u5e73\u5b9a\u53bf"},{"id":"2762","name":"\u76c2\u53bf"}]},{"id":"2475","name":"\u5927\u540c\u5e02","child":[{"id":"2740","name":"\u77ff\u533a"},{"id":"2749","name":"\u5927\u540c\u53bf"},{"id":"2748","name":"\u5de6\u4e91\u53bf"},{"id":"2747","name":"\u6d51\u6e90\u53bf"},{"id":"2746","name":"\u7075\u4e18\u53bf"},{"id":"2745","name":"\u5e7f\u7075\u53bf"},{"id":"2744","name":"\u5929\u9547\u53bf"},{"id":"2743","name":"\u9633\u9ad8\u53bf"},{"id":"2742","name":"\u65b0\u8363\u533a"},{"id":"2741","name":"\u5357\u90ca\u533a"},{"id":"6006","name":"\u57ce\u533a"}]},{"id":"54","name":"\u664b\u4e2d\u5e02","child":[{"id":"2759","name":"\u4ecb\u4f11\u5e02"},{"id":"2758","name":"\u7075\u77f3\u53bf"},{"id":"2757","name":"\u5e73\u9065\u53bf"},{"id":"2756","name":"\u7941\u53bf"},{"id":"2755","name":"\u592a\u8c37\u53bf"},{"id":"2754","name":"\u5bff\u9633\u53bf"},{"id":"2753","name":"\u6614\u9633\u53bf"},{"id":"2752","name":"\u548c\u987a\u53bf"},{"id":"2751","name":"\u5de6\u6743\u53bf"},{"id":"2750","name":"\u6986\u793e\u53bf"},{"id":"1871","name":"\u6986\u6b21\u533a"}]},{"id":"48","name":"\u592a\u539f\u5e02","child":[{"id":"4977","name":"\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a "},{"id":"2739","name":"\u53e4\u4ea4\u5e02"},{"id":"2738","name":"\u5a04\u70e6\u53bf"},{"id":"2737","name":"\u9633\u66f2\u53bf"},{"id":"2736","name":"\u6e05\u5f90\u53bf"},{"id":"2735","name":"\u664b\u6e90\u533a"},{"id":"1869","name":"\u5c16\u8349\u576a\u533a"},{"id":"1868","name":"\u4e07\u67cf\u6797\u533a"},{"id":"1867","name":"\u674f\u82b1\u5cad\u533a"},{"id":"1866","name":"\u5c0f\u5e97\u533a"},{"id":"1865","name":"\u8fce\u6cfd\u533a"}]}]},{"id":"6","name":"\u5185\u8499\u53e4\u81ea\u6cbb\u533a","child":[{"id":"2129","name":"\u547c\u548c\u6d69\u7279\u5e02","child":[{"id":"2848","name":"\u6b66\u5ddd\u53bf"},{"id":"4980","name":"\u5982\u610f\u5f00\u53d1\u533a"},{"id":"4979","name":"\u91d1\u6865\u5f00\u53d1\u533a"},{"id":"4978","name":"\u91d1\u5ddd\u5f00\u53d1\u533a"},{"id":"2138","name":"\u548c\u6797\u683c\u5c14\u53bf","child":[{"id":"2141","name":"\u76db\u4e50\u5de5\u4e1a\u56ed\u533a"}]},{"id":"2130","name":"\u65b0\u57ce\u533a"},{"id":"2131","name":"\u8d5b\u7f55\u533a"},{"id":"2847","name":"\u6258\u514b\u6258\u53bf"},{"id":"2133","name":"\u56de\u6c11\u533a"},{"id":"2846","name":"\u571f\u9ed8\u7279\u5de6\u65d7"},{"id":"2845","name":"\u65b0\u57ce\u533a"},{"id":"2136","name":"\u7389\u6cc9\u533a"},{"id":"4981","name":"\u9e3f\u76db\u9ad8\u79d1\u6280\u56ed\u533a"}]},{"id":"2495","name":"\u963f\u62c9\u5584\u76df","child":[{"id":"2939","name":"\u963f\u62c9\u5584\u5de6\u65d7"},{"id":"2940","name":"\u963f\u62c9\u5584\u53f3\u65d7"},{"id":"2941","name":"\u989d\u6d4e\u7eb3\u65d7"}]},{"id":"2494","name":"\u9521\u6797\u90ed\u52d2\u76df","child":[{"id":"2926","name":"\u4e8c\u8fde\u6d69\u7279\u5e02"},{"id":"2937","name":"\u6b63\u84dd\u65d7"},{"id":"2936","name":"\u6b63\u9576\u767d\u65d7"},{"id":"2935","name":"\u9576\u9ec4\u65d7"},{"id":"2934","name":"\u592a\u4ec6\u5bfa\u65d7"},{"id":"2933","name":"\u897f\u4e4c\u73e0\u7a46\u6c81\u65d7"},{"id":"2932","name":"\u4e1c\u4e4c\u73e0\u7a46\u6c81\u65d7"},{"id":"2931","name":"\u82cf\u5c3c\u7279\u53f3\u65d7"},{"id":"2929","name":"\u82cf\u5c3c\u7279\u5de6\u65d7"},{"id":"2928","name":"\u963f\u5df4\u560e\u65d7"},{"id":"2927","name":"\u9521\u6797\u6d69\u7279\u5e02"},{"id":"2938","name":"\u591a\u4f26\u53bf"}]},{"id":"2493","name":"\u5174\u5b89\u76df","child":[{"id":"2920","name":"\u4e4c\u5170\u6d69\u7279\u5e02 "},{"id":"2921","name":"\u963f\u5c14\u5c71\u5e02"},{"id":"2922","name":"\u79d1\u5c14\u6c81\u53f3\u7ffc\u524d\u65d7"},{"id":"2923","name":"\u79d1\u5c14\u6c81\u53f3\u7ffc\u4e2d\u65d7"},{"id":"2924","name":"\u624e\u8d49\u7279\u65d7"},{"id":"2925","name":"\u7a81\u6cc9\u53bf"}]},{"id":"2492","name":"\u4e4c\u5170\u5bdf\u5e03\u5e02","child":[{"id":"2909","name":"\u96c6\u5b81\u533a"},{"id":"2918","name":"\u56db\u5b50\u738b\u65d7"},{"id":"2917","name":"\u5bdf\u54c8\u5c14\u53f3\u7ffc\u540e\u65d7"},{"id":"2916","name":"\u5bdf\u54c8\u5c14\u53f3\u7ffc\u4e2d\u65d7"},{"id":"2915","name":"\u5bdf\u54c8\u5c14\u53f3\u7ffc\u524d\u65d7"},{"id":"2914","name":"\u51c9\u57ce\u53bf"},{"id":"2913","name":"\u5174\u548c\u53bf"},{"id":"2912","name":"\u5546\u90fd\u53bf"},{"id":"2911","name":"\u5316\u5fb7\u53bf"},{"id":"2910","name":"\u5353\u8d44\u53bf"},{"id":"2919","name":"\u4e30\u9547\u5e02"}]},{"id":"2491","name":"\u5df4\u5f66\u6dd6\u5c14\u5e02","child":[{"id":"2902","name":"\u4e34\u6cb3\u533a"},{"id":"2903","name":"\u4e94\u539f\u53bf"},{"id":"2904","name":"\u78f4\u53e3\u53bf"},{"id":"2905","name":"\u4e4c\u62c9\u7279\u524d\u65d7"},{"id":"2906","name":"\u4e4c\u62c9\u7279\u4e2d\u65d7"},{"id":"2907","name":"\u4e4c\u62c9\u7279\u540e\u65d7"},{"id":"2908","name":"\u676d\u9526\u540e\u65d7 "},{"id":"5993","name":"\u4e34\u6cb3\u5e02"}]},{"id":"2490","name":"\u547c\u4f26\u8d1d\u5c14\u5e02","child":[{"id":"2889","name":"\u6d77\u62c9\u5c14\u533a"},{"id":"2900","name":"\u989d\u5c14\u53e4\u7eb3\u5e02"},{"id":"2899","name":"\u624e\u5170\u5c6f\u5e02"},{"id":"2898","name":"\u7259\u514b\u77f3\u5e02"},{"id":"2897","name":"\u6ee1\u6d32\u91cc\u5e02"},{"id":"2896","name":"\u65b0\u5df4\u5c14\u864e\u53f3\u65d7"},{"id":"2895","name":"\u65b0\u5df4\u5c14\u864e\u5de6\u65d7"},{"id":"2894","name":"\u9648\u5df4\u5c14\u864e\u65d7"},{"id":"2893","name":"\u9102\u6e29\u514b\u65cf\u81ea\u6cbb\u65d7"},{"id":"2892","name":"\u9102\u4f26\u6625\u81ea\u6cbb\u65d7"},{"id":"2891","name":"\u83ab\u529b\u8fbe\u74e6\u8fbe\u65a1\u5c14\u65cf\u81ea\u6cbb\u65d7"},{"id":"2890","name":"\u963f\u8363\u65d7"},{"id":"2901","name":"\u6839\u6cb3\u5e02"}]},{"id":"2489","name":"\u9102\u5c14\u591a\u65af\u5e02","child":[{"id":"2881","name":"\u4e1c\u80dc\u533a "},{"id":"2882","name":"\u8fbe\u62c9\u7279\u65d7"},{"id":"2883","name":"\u51c6\u683c\u5c14\u65d7"},{"id":"2884","name":"\u9102\u6258\u514b\u524d\u65d7"},{"id":"2885","name":"\u9102\u6258\u514b\u65d7"},{"id":"2886","name":"\u676d\u9526\u65d7"},{"id":"2887","name":"\u4e4c\u5ba1\u65d7"},{"id":"2888","name":"\u4f0a\u91d1\u970d\u6d1b\u65d7"}]},{"id":"2488","name":"\u901a\u8fbd\u5e02","child":[{"id":"2873","name":"\u79d1\u5c14\u6c81\u533a"},{"id":"2874","name":"\u79d1\u5c14\u6c81\u5de6\u7ffc\u4e2d\u65d7"},{"id":"2875","name":"\u79d1\u5c14\u6c81\u5de6\u7ffc\u540e\u65d7"},{"id":"2876","name":"\u5f00\u9c81\u53bf"},{"id":"2877","name":"\u5e93\u4f26\u65d7"},{"id":"2878","name":"\u5948\u66fc\u65d7"},{"id":"2879","name":"\u624e\u9c81\u7279\u65d7"},{"id":"2880","name":"\u970d\u6797\u90ed\u52d2\u5e02"}]},{"id":"2487","name":"\u8d64\u5cf0\u5e02","child":[{"id":"2861","name":"\u7ea2\u5c71\u533a"},{"id":"2872","name":"\u6556\u6c49\u65d7"},{"id":"2871","name":"\u5b81\u57ce\u53bf"},{"id":"2870","name":"\u5580\u5587\u6c81\u65d7"},{"id":"2869","name":"\u7fc1\u725b\u7279\u65d7"},{"id":"2868","name":"\u514b\u4ec0\u514b\u817e\u65d7"},{"id":"2867","name":"\u6797\u897f\u53bf"},{"id":"2866","name":"\u5df4\u6797\u53f3\u65d7"},{"id":"2865","name":"\u5df4\u6797\u5de6\u65d7"},{"id":"2864","name":"\u963f\u9c81\u79d1\u5c14\u6c81\u65d7"},{"id":"2863","name":"\u677e\u5c71\u533a"},{"id":"2862","name":"\u5143\u5b9d\u5c71\u533a"},{"id":"6023","name":"\u65b0\u57ce\u533a"}]},{"id":"2486","name":"\u4e4c\u6d77\u5e02","child":[{"id":"2858","name":"\u6d77\u52c3\u6e7e\u533a"},{"id":"2859","name":"\u6d77\u5357\u533a"},{"id":"2860","name":"\u4e4c\u8fbe\u533a"}]},{"id":"2485","name":"\u5305\u5934\u5e02","child":[{"id":"2849","name":"\u4e1c\u6cb3\u533a"},{"id":"2850","name":"\u6606\u90fd\u4ed1\u533a"},{"id":"2851","name":"\u9752\u5c71\u533a"},{"id":"2852","name":"\u77f3\u62d0\u533a"},{"id":"2853","name":"\u767d\u4e91\u77ff\u533a"},{"id":"2854","name":"\u4e5d\u539f\u533a"},{"id":"2855","name":"\u571f\u9ed8\u7279\u53f3\u65d7"},{"id":"2856","name":"\u56fa\u9633\u53bf"},{"id":"2857","name":"\u8fbe\u5c14\u7f55\u8302\u660e\u5b89\u8054\u5408\u65d7"}]},{"id":"5982","name":"\u4e4c\u5170\u6d69\u7279\u5e02"}]},{"id":"7","name":"\u8fbd\u5b81\u7701","child":[{"id":"5975","name":"\u6d77\u57ce\u5e02"},{"id":"5974","name":"\u5317\u7968\u5e02"},{"id":"2498","name":"\u671d\u9633\u5e02","child":[{"id":"3020","name":"\u53cc\u5854\u533a"},{"id":"3021","name":"\u9f99\u57ce\u533a"},{"id":"3022","name":"\u671d\u9633\u53bf"},{"id":"3023","name":"\u5efa\u5e73\u53bf"},{"id":"3024","name":"\u5580\u5587\u6c81\u5de6\u7ffc\u8499\u53e4\u65cf\u81ea\u6cbb\u53bf"},{"id":"3025","name":"\u5317\u7968\u5e02"},{"id":"3026","name":"\u51cc\u6e90\u5e02"}]},{"id":"2496","name":"\u961c\u65b0\u5e02","child":[{"id":"3014","name":"\u6d77\u5dde\u533a"},{"id":"3015","name":"\u65b0\u90b1\u533a"},{"id":"3016","name":"\u592a\u5e73\u533a"},{"id":"3017","name":"\u7ec6\u6cb3\u533a"},{"id":"3018","name":"\u961c\u65b0\u8499\u53e4\u65cf\u81ea\u6cbb\u53bf"},{"id":"3019","name":"\u5f70\u6b66\u53bf"}]},{"id":"87","name":"\u846b\u82a6\u5c9b\u5e02","child":[{"id":"3008","name":"\u8fde\u5c71\u533a "},{"id":"3009","name":"\u9f99\u6e2f\u533a"},{"id":"3010","name":"\u5357\u7968\u533a"},{"id":"3011","name":"\u7ee5\u4e2d\u53bf"},{"id":"3012","name":"\u5efa\u660c\u53bf"},{"id":"1991","name":"\u5174\u57ce\u5e02","child":[{"id":"1992","name":"\u5e02\u533a"}]}]},{"id":"85","name":"\u94c1\u5cad\u5e02","child":[{"id":"3002","name":"\u6e05\u6cb3\u533a"},{"id":"3003","name":"\u94c1\u5cad\u53bf"},{"id":"3004","name":"\u897f\u4e30\u53bf"},{"id":"3005","name":"\u660c\u56fe\u53bf"},{"id":"3006","name":"\u8c03\u5175\u5c71\u5e02"},{"id":"3007","name":"\u5f00\u539f\u5e02"},{"id":"1887","name":"\u94f6\u5dde\u533a"}]},{"id":"84","name":"\u76d8\u9526\u5e02","child":[{"id":"3000","name":"\u53cc\u53f0\u5b50\u533a"},{"id":"3001","name":"\u5174\u9686\u53f0\u533a"},{"id":"4988","name":"\u76d8\u9526\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"4989","name":"\u8fbd\u6cb3\u6cb9\u7530\u9ad8\u65b0\u4ea7\u4e1a\u56ed "},{"id":"1894","name":"\u5927\u6d3c\u53bf","child":[{"id":"1895","name":"\u7530\u5bb6\u9547"}]},{"id":"1896","name":"\u76d8\u5c71\u53bf","child":[{"id":"1897","name":"\u76d8\u5c71\u53bf\u7ecf\u6d4e\u5f00\u53d1\u533a"}]}]},{"id":"83","name":"\u8fbd\u9633\u5e02","child":[{"id":"2995","name":"\u767d\u5854\u533a"},{"id":"2996","name":"\u6587\u5723\u533a"},{"id":"2997","name":"\u5b8f\u4f1f\u533a"},{"id":"4987","name":"\u8fbd\u9633\u5e02\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a"},{"id":"2999","name":"\u592a\u5b50\u6cb3\u533a"},{"id":"1904","name":"\u706f\u5854\u5e02","child":[{"id":"1905","name":"\u706f\u5854\u5e02\u533a"}]},{"id":"1906","name":"\u8fbd\u9633\u53bf","child":[{"id":"1907","name":"\u5170\u5bb6\u9547"},{"id":"1908","name":"\u9996\u5c71\u9547"}]}]},{"id":"81","name":"\u8425\u53e3\u5e02","child":[{"id":"2991","name":"\u897f\u5e02\u533a"},{"id":"2992","name":"\u9c85\u9c7c\u5708\u533a"},{"id":"2990","name":"\u7ad9\u524d\u533a"},{"id":"2993","name":"\u8001\u8fb9\u533a"},{"id":"2994","name":"\u76d6\u5dde\u5e02"},{"id":"1917","name":"\u5927\u77f3\u6865\u5e02","child":[{"id":"1918","name":"\u5927\u77f3\u6865\u5e02\u533a"}]}]},{"id":"80","name":"\u9526\u5dde\u5e02","child":[{"id":"2989","name":"\u5317\u9547\u5e02"},{"id":"2988","name":"\u51cc\u6d77\u5e02"},{"id":"2987","name":"\u4e49\u53bf"},{"id":"2986","name":"\u9ed1\u5c71\u53bf"},{"id":"4986","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a "},{"id":"1923","name":"\u51cc\u6cb3\u65b0\u533a"},{"id":"1922","name":"\u51cc\u5357\u65b0\u533a"},{"id":"1921","name":"\u592a\u548c\u533a"},{"id":"1920","name":"\u51cc\u6cb3\u533a"},{"id":"1919","name":"\u53e4\u5854\u533a"}]},{"id":"79","name":"\u4e39\u4e1c\u5e02","child":[{"id":"2981","name":"\u5143\u5b9d\u533a"},{"id":"2982","name":"\u632f\u5174\u533a"},{"id":"2983","name":"\u632f\u5b89\u533a"},{"id":"2984","name":"\u5bbd\u7538\u6ee1\u65cf\u81ea\u6cbb\u53bf"},{"id":"2985","name":"\u51e4\u57ce\u5e02"},{"id":"1929","name":"\u4e1c\u6e2f\u5e02","child":[{"id":"1930","name":"\u5927\u4e1c\u533a"},{"id":"1931","name":"\u5317\u4e95\u5b50\u9547"},{"id":"1932","name":"\u957f\u5c71\u5b50\u9547"},{"id":"1933","name":"\u6c64\u6c60\u9547"}]}]},{"id":"78","name":"\u672c\u6eaa\u5e02","child":[{"id":"2977","name":"\u6eaa\u6e56\u533a "},{"id":"2978","name":"\u5357\u82ac\u533a"},{"id":"2979","name":"\u672c\u6eaa\u6ee1\u65cf\u81ea\u6cbb\u53bf"},{"id":"2980","name":"\u6853\u4ec1\u6ee1\u65cf\u81ea\u6cbb\u53bf"},{"id":"1934","name":"\u5e73\u5c71\u533a"},{"id":"1935","name":"\u660e\u5c71\u533a"}]},{"id":"77","name":"\u629a\u987a\u5e02","child":[{"id":"2976","name":"\u6e05\u539f\u6ee1\u65cf\u81ea\u6cbb\u53bf "},{"id":"2975","name":"\u65b0\u5bbe\u6ee1\u65cf\u81ea\u6cbb\u53bf"},{"id":"4985","name":"\u629a\u987a\u7ecf\u6d4e\u5f00\u53d1\u533a "},{"id":"1943","name":"\u80dc\u5229\u5f00\u53d1\u533a"},{"id":"1942","name":"\u4e1c\u6d32\u533a"},{"id":"1941","name":"\u9ad8\u6e7e\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"1940","name":"\u674e\u77f3\u7ecf\u6d4e\u5f00\u53d1"},{"id":"1939","name":"\u629a\u987a\u53bf"},{"id":"1938","name":"\u671b\u82b1\u533a"},{"id":"1937","name":"\u65b0\u629a\u533a"},{"id":"1936","name":"\u987a\u57ce\u533a"}]},{"id":"76","name":"\u978d\u5c71\u5e02","child":[{"id":"2969","name":"\u94c1\u4e1c\u533a"},{"id":"4984","name":"\u978d\u5c71\u7ecf\u6d4e\u5f00\u53d1\u533a(\u897f\u533a)"},{"id":"2970","name":"\u94c1\u897f\u533a"},{"id":"2971","name":"\u7acb\u5c71\u533a"},{"id":"2972","name":"\u5343\u5c71\u533a"},{"id":"2973","name":"\u53f0\u5b89\u53bf"},{"id":"2974","name":"\u5cab\u5ca9\u6ee1\u65cf\u81ea\u6cbb\u53bf"},{"id":"1952","name":"\u6d77\u57ce\u5e02","child":[{"id":"2143","name":"\u6bdb\u7941\u9547"},{"id":"2144","name":"\u897f\u56db\u9547"},{"id":"2145","name":"\u94c1\u897f\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"1955","name":"\u5174\u6d77\u7ba1\u7406\u533a"},{"id":"1971","name":"\u738b\u77f3\u9547"},{"id":"1970","name":"\u65d7\u53e3\u9547"},{"id":"1969","name":"\u803f\u5e84"},{"id":"1968","name":"\u9a8c\u519b\u9547"},{"id":"1967","name":"\u4e1c\u56db\u9547"},{"id":"1966","name":"\u4e2d\u5c0f\u9547"},{"id":"1965","name":"\u611f\u738b\u9547"},{"id":"1964","name":"\u897f\u67f3\u9547"},{"id":"1953","name":"\u6d77\u5dde\u7ba1\u7406\u533a"},{"id":"1961","name":"\u5927\u5c6f\u9547"},{"id":"1960","name":"\u7518\u6cc9\u9547"},{"id":"1959","name":"\u4e8c\u9053\u6cb3"},{"id":"1958","name":"\u5357\u53f0\u9547"},{"id":"1957","name":"\u516b\u91cc\u9547"},{"id":"1956","name":"\u54cd\u5802\u7ba1\u7406\u533a"},{"id":"1963","name":"\u725b\u5e84\u9547"}]}]},{"id":"75","name":"\u5927\u8fde\u5e02","child":[{"id":"4982","name":"\u4e2d\u5c71\u533a"},{"id":"2949","name":"\u5e84\u6cb3\u5e02 "},{"id":"2948","name":"\u957f\u6d77\u53bf"},{"id":"2947","name":"\u91d1\u5dde\u533a"},{"id":"2946","name":"\u65c5\u987a\u53e3\u533a"},{"id":"2945","name":"\u7518\u4e95\u5b50\u533a"},{"id":"2944","name":"\u6c99\u6cb3\u53e3\u533a "},{"id":"2943","name":"\u897f\u5c97\u533a"},{"id":"4983","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"1981","name":"\u74e6\u623f\u5e97\u5e02","child":[{"id":"1982","name":"\u5e02\u533a"}]},{"id":"1979","name":"\u666e\u5170\u5e97\u5e02","child":[{"id":"1980","name":"\u5e02\u533a"}]}]},{"id":"74","name":"\u6c88\u9633\u5e02","child":[{"id":"6074","name":"\u6c88\u5317\u65b0\u533a"},{"id":"6071","name":"\u8fbd\u4e2d\u53bf"},{"id":"1886","name":"\u5f20\u58eb\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u5357\u533a"},{"id":"1885","name":"\u5f20\u58eb\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"1884","name":"\u6c88\u9633\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"1883","name":"\u65b0\u57ce\u5b50\u533a"},{"id":"1882","name":"\u9053\u4e49\u5f00\u53d1\u533a"},{"id":"1881","name":"\u4e8e\u6d2a\u533a"},{"id":"1880","name":"\u82cf\u5bb6\u5c6f\u533a"},{"id":"1879","name":"\u6d51\u5357\u65b0\u533a"},{"id":"1878","name":"\u4e1c\u9675\u533a"},{"id":"1877","name":"\u6c88\u6cb3\u533a"},{"id":"1876","name":"\u94c1\u897f\u65b0\u533a"},{"id":"1875","name":"\u94c1\u897f\u533a"},{"id":"1874","name":"\u7687\u59d1\u533a","child":[{"id":"3038","name":"\u5317\u9675"},{"id":"3039","name":"\u5317\u884c"},{"id":"3040","name":"\u8fbd\u5927"},{"id":"3041","name":"\u5854\u6e7e"},{"id":"3042","name":"\u5c0f\u767d\u697c"}]},{"id":"1873","name":"\u548c\u5e73\u533a","child":[{"id":"3031","name":"\u5317\u5e02\u573a"},{"id":"3032","name":"\u9a6c\u8def\u6e7e"},{"id":"3033","name":"\u5357\u6e56\u516c\u56ed"},{"id":"3034","name":"\u5357\u5e02"},{"id":"3035","name":"\u592a\u539f\u8857"},{"id":"3036","name":"\u4e94\u91cc\u6cb3"},{"id":"3037","name":"\u897f\u5854"}]},{"id":"1872","name":"\u5927\u4e1c\u533a","child":[{"id":"3027","name":"\u5927\u4e1c\u5e7f\u573a"},{"id":"3028","name":"\u5927\u4e1c\u8def"},{"id":"3029","name":"\u4e1c\u5854"},{"id":"3030","name":"\u4e1c\u7ad9"}]},{"id":"6016","name":"\u65b0\u6c11\u5e02"}]}]},{"id":"8","name":"\u5409\u6797\u7701","child":[{"id":"6052","name":"\u8212\u5170\u5e02"},{"id":"5973","name":"\u5ef6\u5409\u5e02"},{"id":"5972","name":"\u901a\u5316\u5e02","child":[{"id":"6008","name":"\u6885\u6cb3\u53e3\u5e02"},{"id":"6009","name":"\u4e1c\u660c\u533a"},{"id":"6010","name":"\u4e8c\u9053\u6c5f\u533a"},{"id":"6011","name":"\u901a\u5316\u53bf"},{"id":"6012","name":"\u8f89\u5357\u53bf"},{"id":"6013","name":"\u67f3\u6cb3\u53bf"},{"id":"6014","name":"\u96c6\u5b89\u5e02"}]},{"id":"5971","name":"\u767d\u5c71\u5e02","child":[{"id":"5990","name":"\u6c5f\u6e90\u53bf"},{"id":"6002","name":"\u9756\u5b87\u53bf"},{"id":"6019","name":"\u629a\u677e\u53bf"}]},{"id":"2507","name":"\u5ef6\u8fb9\u671d\u9c9c\u65cf\u81ea\u6cbb\u5dde","child":[{"id":"3077","name":"\u5b89\u56fe\u53bf "},{"id":"3076","name":"\u6c6a\u6e05\u53bf "},{"id":"3075","name":"\u548c\u9f99\u5e02 "},{"id":"3074","name":"\u9f99\u4e95\u5e02 "},{"id":"3073","name":"\u73f2\u6625\u5e02 "},{"id":"3072","name":"\u6566\u5316\u5e02 "},{"id":"3071","name":"\u56fe\u4eec\u5e02 "},{"id":"3070","name":"\u5ef6\u5409\u5e02 "}]},{"id":"2506","name":"\u767d\u57ce\u5e02","child":[{"id":"3069","name":"\u5927\u5b89\u5e02 "},{"id":"3068","name":"\u6d2e\u5357\u5e02 "},{"id":"3067","name":"\u901a\u6986\u53bf "},{"id":"3066","name":"\u9547\u8d49\u53bf "},{"id":"3065","name":"\u6d2e\u5317\u533a "}]},{"id":"2505","name":"\u677e\u539f\u5e02","child":[{"id":"3064","name":"\u6276\u4f59\u53bf "},{"id":"3063","name":"\u4e7e\u5b89\u53bf "},{"id":"3062","name":"\u957f\u5cad\u53bf "},{"id":"3061","name":"\u524d\u90ed\u5c14\u7f57\u65af\u8499\u53e4\u65cf\u81ea\u6cbb\u53bf "},{"id":"3060","name":"\u5b81\u6c5f\u533a "}]},{"id":"2503","name":"\u5174\u534e\u4e61","child":[{"id":"3059","name":"\u96c6\u5b89\u5e02 "},{"id":"3058","name":"\u6885\u6cb3\u53e3\u5e02 "},{"id":"3057","name":"\u67f3\u6cb3\u53bf "},{"id":"3056","name":"\u8f89\u5357\u53bf "},{"id":"3055","name":"\u901a\u5316\u53bf "},{"id":"3054","name":"\u4e8c\u9053\u6c5f\u533a "},{"id":"3053","name":"\u4e1c\u660c\u533a "}]},{"id":"2502","name":"\u8fbd\u6e90\u5e02"},{"id":"2501","name":"\u8fbd\u6e90\u5e02","child":[{"id":"3052","name":"\u4e1c\u8fbd\u53bf "},{"id":"3051","name":"\u4e1c\u4e30\u53bf  "},{"id":"3050","name":"\u897f\u5b89\u533a "},{"id":"3049","name":"\u9f99\u5c71\u533a "}]},{"id":"2500","name":"\u56db\u5e73\u5e02","child":[{"id":"3043","name":"\u94c1\u897f\u533a"},{"id":"3048","name":"\u53cc\u8fbd\u5e02"},{"id":"3047","name":"\u516c\u4e3b\u5cad\u5e02 "},{"id":"3046","name":"\u4f0a\u901a\u6ee1\u65cf\u81ea\u6cbb\u53bf "},{"id":"3045","name":"\u68a8\u6811\u53bf "},{"id":"3044","name":"\u94c1\u4e1c\u533a "}]},{"id":"89","name":"\u5409\u6797\u5e02","child":[{"id":"2002","name":"\u8239\u8425\u533a"},{"id":"2003","name":"\u660c\u9091\u533a"},{"id":"2004","name":"\u4e30\u6ee1\u533a"},{"id":"2005","name":"\u9f99\u6f6d\u533a"},{"id":"2006","name":"\u9ad8\u65b0\u533a"}]},{"id":"88","name":"\u957f\u6625\u5e02","child":[{"id":"6058","name":"\u4e5d\u53f0\u5e02"},{"id":"6055","name":"\u6986\u6811\u5e02"},{"id":"5991","name":"\u519c\u5b89\u53bf"},{"id":"2001","name":"\u6c7d\u8f66\u4ea7\u4e1a\u5f00\u53d1\u533a"},{"id":"2000","name":"\u51c0\u6708\u65c5\u6e38\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"1999","name":"\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a"},{"id":"1998","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"1997","name":"\u4e8c\u9053\u533a"},{"id":"1996","name":"\u5357\u5173\u533a"},{"id":"1995","name":"\u7eff\u56ed\u533a"},{"id":"1994","name":"\u671d\u9633\u533a"},{"id":"1993","name":"\u5bbd\u57ce\u533a"}]}]},{"id":"9","name":"\u9ed1\u9f99\u6c5f\u7701","child":[{"id":"2520","name":"\u5927\u5174\u5b89\u5cad\u5730\u533a","child":[{"id":"3187","name":"\u52a0\u683c\u8fbe\u5947\u533a "},{"id":"3188","name":"\u677e\u5cad\u533a "},{"id":"3189","name":"\u65b0\u6797\u533a "},{"id":"3190","name":"\u547c\u4e2d\u533a "},{"id":"3191","name":"\u547c\u739b\u53bf "},{"id":"3192","name":"\u5854\u6cb3\u53bf "},{"id":"3193","name":"\u6f20\u6cb3\u53bf "}]},{"id":"2519","name":"\u7ee5\u5316\u5e02","child":[{"id":"3177","name":"\u5317\u6797\u533a "},{"id":"3185","name":"\u8087\u4e1c\u5e02 "},{"id":"3184","name":"\u5b89\u8fbe\u5e02 "},{"id":"3183","name":"\u7ee5\u68f1\u53bf "},{"id":"3182","name":"\u660e\u6c34\u53bf "},{"id":"3181","name":"\u5e86\u5b89\u53bf "},{"id":"3180","name":"\u9752\u5188\u53bf "},{"id":"3179","name":"\u5170\u897f\u53bf "},{"id":"3178","name":"\u671b\u594e\u53bf "},{"id":"3186","name":"\u6d77\u4f26\u5e02 "}]},{"id":"2518","name":"\u9ed1\u6cb3\u5e02","child":[{"id":"3171","name":"\u7231\u8f89\u533a "},{"id":"3172","name":"\u5ae9\u6c5f\u53bf "},{"id":"3173","name":"\u900a\u514b\u53bf "},{"id":"3174","name":"\u5b59\u5434\u53bf "},{"id":"3175","name":"\u5317\u5b89\u5e02 "},{"id":"3176","name":"\u4e94\u5927\u8fde\u6c60\u5e02 "}]},{"id":"2517","name":"\u7261\u4e39\u6c5f\u5e02","child":[{"id":"3161","name":"\u4e1c\u5b89\u533a "},{"id":"3169","name":"\u5b81\u5b89\u5e02 "},{"id":"3168","name":"\u6d77\u6797\u5e02 "},{"id":"3167","name":"\u7ee5\u82ac\u6cb3\u5e02 "},{"id":"3166","name":"\u6797\u53e3\u53bf "},{"id":"3165","name":"\u4e1c\u5b81\u53bf "},{"id":"3164","name":"\u897f\u5b89\u533a "},{"id":"3163","name":"\u7231\u6c11\u533a "},{"id":"3162","name":"\u9633\u660e\u533a "},{"id":"3170","name":"\u7a46\u68f1\u5e02 "}]},{"id":"2516","name":"\u4e03\u53f0\u6cb3\u5e02","child":[{"id":"3157","name":"\u65b0\u5174\u533a "},{"id":"3158","name":"\u6843\u5c71\u533a "},{"id":"3159","name":"\u8304\u5b50\u6cb3\u533a "},{"id":"3160","name":"\u52c3\u5229\u53bf "}]},{"id":"2515","name":"\u4f73\u6728\u65af\u5e02","child":[{"id":"3148","name":"\u5411\u9633\u533a "},{"id":"3149","name":"\u524d\u8fdb\u533a "},{"id":"3150","name":"\u4e1c\u98ce\u533a "},{"id":"3151","name":"\u6866\u5357\u53bf "},{"id":"3152","name":"\u6866\u5ddd\u53bf "},{"id":"3153","name":"\u6c64\u539f\u53bf "},{"id":"3154","name":"\u629a\u8fdc\u53bf "},{"id":"3155","name":"\u540c\u6c5f\u5e02 "},{"id":"3156","name":"\u5bcc\u9526\u5e02 "}]},{"id":"2513","name":"\u4f0a\u6625\u5e02","child":[{"id":"3144","name":"\u7ea2\u661f\u533a "},{"id":"3146","name":"\u5609\u836b\u53bf "},{"id":"3131","name":"\u4f0a\u6625\u533a "},{"id":"3132","name":"\u5357\u5c94\u533a "},{"id":"3133","name":"\u53cb\u597d\u533a "},{"id":"3134","name":"\u897f\u6797\u533a "},{"id":"3135","name":"\u7fe0\u5ce6\u533a "},{"id":"3136","name":"\u65b0\u9752\u533a "},{"id":"3137","name":"\u7f8e\u6eaa\u533a "},{"id":"3138","name":"\u91d1\u5c71\u5c6f\u533a "},{"id":"3139","name":"\u4e94\u8425\u533a "},{"id":"3140","name":"\u4e4c\u9a6c\u6cb3\u533a "},{"id":"3141","name":"\u6c64\u65fa\u6cb3\u533a "},{"id":"3142","name":"\u5e26\u5cad\u533a "},{"id":"3143","name":"\u4e4c\u4f0a\u5cad\u533a "},{"id":"3145","name":"\u4e0a\u7518\u5cad\u533a "},{"id":"3147","name":"\u94c1\u529b\u5e02 "}]},{"id":"2511","name":"\u53cc\u9e2d\u5c71\u5e02","child":[{"id":"3130","name":"\u9976\u6cb3\u53bf"},{"id":"3129","name":"\u5b9d\u6e05\u53bf "},{"id":"3128","name":"\u53cb\u8c0a\u53bf "},{"id":"3127","name":"\u96c6\u8d24\u53bf "},{"id":"3126","name":"\u5b9d\u5c71\u533a "},{"id":"3125","name":"\u56db\u65b9\u53f0\u533a  "},{"id":"3124","name":"\u5cad\u4e1c\u533a "},{"id":"3123","name":"\u5c16\u5c71\u533a "}]},{"id":"2510","name":"\u9e64\u5c97\u5e02","child":[{"id":"3122","name":"\u7ee5\u6ee8\u53bf "},{"id":"3121","name":"\u841d\u5317\u53bf "},{"id":"3120","name":"\u5174\u5c71\u533a "},{"id":"3119","name":"\u4e1c\u5c71\u533a "},{"id":"3118","name":"\u5174\u5b89\u533a "},{"id":"3117","name":"\u5357\u5c71\u533a "},{"id":"3116","name":"\u5de5\u519c\u533a "},{"id":"3115","name":"\u5411\u9633\u533a "}]},{"id":"2509","name":"\u9e21\u897f\u5e02","child":[{"id":"3114","name":"\u5bc6\u5c71\u5e02 "},{"id":"3113","name":"\u864e\u6797\u5e02 "},{"id":"3112","name":"\u9e21\u4e1c\u53bf "},{"id":"3111","name":"\u9ebb\u5c71\u533a "},{"id":"3110","name":"\u57ce\u5b50\u6cb3\u533a "},{"id":"3109","name":"\u68a8\u6811\u533a "},{"id":"3108","name":"\u6ef4\u9053\u533a "},{"id":"3107","name":"\u6052\u5c71\u533a "},{"id":"3106","name":"\u9e21\u51a0\u533a  "}]},{"id":"2508","name":"\u9f50\u9f50\u54c8\u5c14\u5e02","child":[{"id":"3091","name":"\u5efa\u534e\u533a "},{"id":"3093","name":"\u6602\u6602\u6eaa\u533a "},{"id":"3094","name":"\u5bcc\u62c9\u5c14\u57fa\u533a "},{"id":"3095","name":"\u78be\u5b50\u5c71\u533a"},{"id":"3096","name":"\u6885\u91cc\u65af\u8fbe\u65a1\u5c14\u65cf\u533a "},{"id":"3097","name":"\u9f99\u6c5f\u53bf "},{"id":"3098","name":"\u4f9d\u5b89\u53bf "},{"id":"3099","name":"\u6cf0\u6765\u53bf "},{"id":"3100","name":"\u7518\u5357\u53bf "},{"id":"3101","name":"\u5bcc\u88d5\u53bf "},{"id":"3102","name":"\u514b\u5c71\u53bf "},{"id":"3103","name":"\u514b\u4e1c\u53bf "},{"id":"3104","name":"\u62dc\u6cc9\u53bf "},{"id":"3105","name":"\u8bb7\u6cb3\u5e02 "},{"id":"3090","name":"\u9f99\u6c99\u533a "},{"id":"3092","name":"\u94c1\u950b\u533a "}]},{"id":"102","name":"\u5927\u5e86\u5e02","child":[{"id":"6078","name":"\u675c\u5c14\u4f2f\u7279\u8499\u53e4\u65cf\u81ea\u6cbb\u53bf"},{"id":"6063","name":"\u5927\u540c\u533a"},{"id":"6057","name":"\u8087\u5dde\u53bf"},{"id":"6007","name":"\u8087\u6e90\u53bf"},{"id":"2015","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"2014","name":"\u7ea2\u5c97\u533a"},{"id":"2013","name":"\u91c7\u6cb9\u516d\u5382"},{"id":"2012","name":"\u5587\u561b\u7538\u9547"},{"id":"2011","name":"\u5367\u91cc\u5c6f"},{"id":"2010","name":"\u4e59\u70ef"},{"id":"2009","name":"\u9f99\u51e4\u533a"},{"id":"2008","name":"\u8ba9\u6e56\u8def\u533a"},{"id":"2007","name":"\u8428\u5c14\u56fe\u533a"}]},{"id":"97","name":"\u54c8\u5c14\u6ee8\u5e02","child":[{"id":"3087","name":"\u5c1a\u5fd7\u5e02 "},{"id":"3079","name":"\u963f\u57ce\u533a "},{"id":"3080","name":"\u4f9d\u5170\u53bf "},{"id":"3081","name":"\u65b9\u6b63\u53bf "},{"id":"3082","name":"\u5bbe\u53bf "},{"id":"3083","name":"\u5df4\u5f66\u53bf "},{"id":"3084","name":"\u6728\u5170\u53bf "},{"id":"3085","name":"\u901a\u6cb3\u53bf "},{"id":"3088","name":"\u4e94\u5e38\u5e02 "},{"id":"3089","name":"\u5ef6\u5bff\u53bf"},{"id":"3078","name":"\u547c\u5170\u533a "},{"id":"2023","name":"\u53cc\u57ce\u5e02","child":[{"id":"4993","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"4992","name":"\u53cc\u57ce\u9547"},{"id":"4994","name":"\u65b0\u57ce\u533a "}]},{"id":"2022","name":"\u677e\u5317\u533a"},{"id":"2021","name":"\u5e73\u623f\u533a"},{"id":"2019","name":"\u9999\u574a\u533a"},{"id":"2018","name":"\u9053\u5916\u533a"},{"id":"2017","name":"\u9053\u91cc\u533a"},{"id":"2016","name":"\u5357\u5c97\u533a"}]}]},{"id":"10","name":"\u4e0a\u6d77\u5e02","child":[{"id":"2522","name":"\u5f90\u6c47\u533a"},{"id":"2538","name":"\u5d07\u660e\u53bf","child":[{"id":"4995","name":"\u57ce\u6865\u9547 "},{"id":"4996","name":"\u65b0\u6cb3\u9547"}]},{"id":"2537","name":"\u5949\u8d24\u533a"},{"id":"2536","name":"\u5357\u6c47\u533a"},{"id":"2535","name":"\u9752\u6d66\u533a"},{"id":"2534","name":"\u677e\u6c5f\u533a"},{"id":"2533","name":"\u91d1\u5c71\u533a"},{"id":"2532","name":"\u6d66\u4e1c\u65b0\u533a"},{"id":"2531","name":"\u5609\u5b9a\u533a"},{"id":"2530","name":"\u5b9d\u5c71\u533a"},{"id":"2529","name":"\u95f5\u884c\u533a"},{"id":"2528","name":"\u6768\u6d66\u533a"},{"id":"2527","name":"\u8679\u53e3\u533a"},{"id":"2526","name":"\u95f8\u5317\u533a"},{"id":"2525","name":"\u666e\u9640\u533a"},{"id":"2524","name":"\u9759\u5b89\u533a"},{"id":"2523","name":"\u957f\u5b81\u533a"},{"id":"2521","name":"\u9ec4\u6d66\u533a"},{"id":"2539","name":"\u5362\u6e7e\u533a"}]},{"id":"11","name":"\u6c5f\u82cf\u7701","child":[{"id":"111","name":"\u5357\u4eac\u5e02","child":[{"id":"3194","name":"\u7384\u6b66\u533a "},{"id":"3205","name":"\u6ea7\u6c34\u53bf "},{"id":"3204","name":"\u516d\u5408\u533a "},{"id":"3203","name":"\u6c5f\u5b81\u533a "},{"id":"3202","name":"\u96e8\u82b1\u53f0\u533a "},{"id":"3201","name":"\u6816\u971e\u533a "},{"id":"3200","name":"\u6d66\u53e3\u533a "},{"id":"3199","name":"\u4e0b\u5173\u533a "},{"id":"3198","name":"\u9f13\u697c\u533a "},{"id":"3197","name":"\u5efa\u90ba\u533a "},{"id":"3196","name":"\u79e6\u6dee\u533a "},{"id":"3195","name":"\u767d\u4e0b\u533a "},{"id":"3206","name":"\u9ad8\u6df3\u53bf ","child":[{"id":"4997","name":"\u6df3\u6eaa\u9547 "},{"id":"4998","name":"\u9ad8\u6df3\u7ecf\u6d4e\u5f00\u53d1\u533a"}]}]},{"id":"122","name":"\u6cf0\u5dde\u5e02","child":[{"id":"2203","name":"\u6d77\u9675\u533a"},{"id":"2207","name":"\u9ad8\u6e2f\u533a"},{"id":"3256","name":"\u9756\u6c5f\u5e02 "},{"id":"3257","name":"\u6cf0\u5174\u5e02 ","child":[{"id":"5130","name":"\u6cf0\u5174\u9547"},{"id":"5141","name":"\u8fc7\u8239\u9547"},{"id":"5140","name":"\u5927\u751f\u9547"},{"id":"5139","name":"\u4e03\u5729\u9547"},{"id":"5138","name":"\u848b\u534e\u9547"},{"id":"5137","name":"\u5f20\u6865\u9547"},{"id":"5136","name":"\u9ec4\u6865\u9547"},{"id":"5135","name":"\u6eaa\u6865\u9547"},{"id":"5134","name":"\u6cb3\u5931\u9547"},{"id":"5133","name":"\u5ba3\u5821\u9547"},{"id":"5132","name":"\u59da\u738b\u9547"},{"id":"5131","name":"\u9a6c\u7538\u9547"},{"id":"5142","name":"\u5206\u754c\u9547"}]},{"id":"3258","name":"\u59dc\u5830\u5e02 ","child":[{"id":"5143","name":"\u59dc\u5830\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5144","name":"\u59dc\u5830\u9547"},{"id":"5145","name":"\u82cf\u9648\u9547"},{"id":"5146","name":"\u6865\u5934\u9547"},{"id":"5147","name":"\u6c88\u9ad8\u9547"},{"id":"5148","name":"\u738b\u77f3\u9547"},{"id":"5149","name":"\u6881\u5f90\u9547"},{"id":"5150","name":"\u5a04\u5e84\u9547"},{"id":"5151","name":"\u767d\u7c73\u9547"}]},{"id":"3259","name":"\u5174\u5316\u5e02"}]},{"id":"121","name":"\u9547\u6c5f\u5e02","child":[{"id":"3250","name":"\u4eac\u53e3\u533a "},{"id":"3251","name":"\u6da6\u5dde\u533a "},{"id":"3252","name":"\u4e39\u5f92\u533a "},{"id":"3253","name":"\u4e39\u9633\u5e02 "},{"id":"3254","name":"\u626c\u4e2d\u5e02 "},{"id":"3255","name":"\u53e5\u5bb9\u5e02 ","child":[{"id":"5127","name":"\u8881\u5df7\u9547"},{"id":"5128","name":"\u8305\u5c71\u9547"},{"id":"5129","name":"\u8305\u897f\u9547"}]}]},{"id":"120","name":"\u626c\u5dde\u5e02","child":[{"id":"2199","name":"\u7ef4\u626c\u533a"},{"id":"2200","name":"\u5e7f\u9675\u533a"},{"id":"2201","name":"\u5f00\u53d1\u533a"},{"id":"2202","name":"\u9097\u6c5f\u533a"},{"id":"3246","name":"\u5b9d\u5e94\u53bf "},{"id":"3247","name":"\u4eea\u5f81\u5e02 ","child":[{"id":"5118","name":"\u5927\u4eea\u9547"},{"id":"5120","name":"\u80e5\u6d66\u9547"},{"id":"5121","name":"\u65b0\u57ce\u9547"},{"id":"5122","name":"\u65b0\u96c6\u9547"},{"id":"5123","name":"\u9a6c\u96c6\u9547"},{"id":"5124","name":"\u6734\u5e2d\u9547"},{"id":"5125","name":"\u5218\u96c6\u9547"},{"id":"5126","name":"\u8c22\u96c6\u9547"}]},{"id":"3248","name":"\u9ad8\u90ae\u5e02 ","child":[{"id":"5117","name":"\u9ad8\u90ae\u9547"}]},{"id":"3249","name":"\u6c5f\u90fd\u5e02 ","child":[{"id":"5090","name":"\u4ed9\u5973\u9547"},{"id":"5105","name":"\u6cf0\u5b89\u9547"},{"id":"5106","name":"\u6768\u5e84\u9547"},{"id":"5107","name":"\u771f\u6b66\u9547"},{"id":"5108","name":"\u5636\u9a6c\u9547"},{"id":"5109","name":"\u6ee8\u6e56\u9547"},{"id":"5110","name":"\u6d66\u5934\u9547"},{"id":"5111","name":"\u4e01\u4f19\u9547"},{"id":"5112","name":"\u5bcc\u6c11\u9547"},{"id":"5113","name":"\u5c0f\u7eaa\u9547"},{"id":"5114","name":"\u9ad8\u5f90\u9547"},{"id":"5104","name":"\u5434\u6865\u9547"},{"id":"5103","name":"\u66f9\u738b\u9547"},{"id":"5102","name":"\u90b5\u4f2f\u9547"},{"id":"5091","name":"\u5f20\u7eb2\u9547"},{"id":"5092","name":"\u7816\u6865\u9547"},{"id":"5100","name":"\u6b63\u8c0a\u9547"},{"id":"5094","name":"\u660c\u677e\u9547"},{"id":"5095","name":"\u5b9c\u9675\u9547"},{"id":"5096","name":"\u53cc\u6c9f\u9547"},{"id":"5097","name":"\u5927\u6865\u9547"},{"id":"5098","name":"\u82b1\u8361\u9547"},{"id":"5099","name":"\u4e03\u91cc\u9547"},{"id":"5101","name":"\u8c22\u6865\u9547"},{"id":"5115","name":"\u6a0a(\u51e1)\u5ddd\u9547"}]}]},{"id":"119","name":"\u76d0\u57ce\u5e02","child":[{"id":"3239","name":"\u6ee8\u6d77\u53bf "},{"id":"3243","name":"\u4e1c\u53f0\u5e02 ","child":[{"id":"5076","name":"\u4e1c\u53f0\u9547"},{"id":"5084","name":"\u5ec9\u8d3b\u9547"},{"id":"5083","name":"\u4e94\u70c8\u9547"},{"id":"5082","name":"\u5934\u7076\u9547"},{"id":"5081","name":"\u5ec9\u8d3b\u9547"},{"id":"5080","name":"\u4e94\u70c8\u9547"},{"id":"5079","name":"\u6881\u579b\u9547"},{"id":"5078","name":"\u5b89\u4e30\u9547"},{"id":"5077","name":"\u5bcc\u5b89\u9547 "},{"id":"5085","name":"\u65f6\u5830\u9547"}]},{"id":"3242","name":"\u5efa\u6e56\u53bf ","child":[{"id":"5086","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"5087","name":"\u8fd1\u6e56\u9547"},{"id":"5088","name":"\u6c5f\u82cf\u7701\u5efa\u6e56\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5089","name":"\u5efa\u9633\u9547"}]},{"id":"3241","name":"\u5c04\u9633\u53bf "},{"id":"3240","name":"\u961c\u5b81\u53bf "},{"id":"2198","name":"\u76d0\u90fd\u533a"},{"id":"2197","name":"\u4ead\u6e56\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"2196","name":"\u4ead\u6e56\u533a"},{"id":"3238","name":"\u54cd\u6c34\u53bf "},{"id":"3244","name":"\u5927\u4e30\u5e02 ","child":[{"id":"5068","name":"\u767d\u9a79\u9547"},{"id":"5069","name":"\u5218\u5e84\u9547"},{"id":"5070","name":"\u65b0\u4e30\u9547"},{"id":"5071","name":"\u5927\u4e2d\u9547"},{"id":"5072","name":"\u897f\u56e2\u9547"},{"id":"5073","name":"\u5927\u9f99\u9547"},{"id":"5074","name":"\u88d5\u534e\u9547"},{"id":"5075","name":"\u5c0f\u6d77\u9547 "}]}]},{"id":"118","name":"\u6dee\u5b89\u5e02","child":[{"id":"2190","name":"\u6dee\u9634\u533a"},{"id":"2287","name":"\u91d1\u6e56\u53bf"},{"id":"2192","name":"\u6e05\u6d66\u533a"},{"id":"2286","name":"\u76f1\u7719\u53bf"},{"id":"2194","name":"\u6e05\u6cb3\u533a"},{"id":"2195","name":"\u695a\u5dde\u533a"},{"id":"2285","name":"\u6d2a\u6cfd\u53bf"},{"id":"2283","name":"\u6d9f\u6c34\u53bf","child":[{"id":"2284","name":"\u53bf\u57ce"}]},{"id":"5067","name":"\u6dee\u9634\u533a\u5f00\u53d1\u533a"}]},{"id":"117","name":"\u8fde\u4e91\u6e2f\u5e02","child":[{"id":"2182","name":"\u65b0\u6d66\u533a"},{"id":"3236","name":"\u704c\u4e91\u53bf"},{"id":"3235","name":"\u4e1c\u6d77\u53bf","child":[{"id":"5062","name":"\u4e1c\u6d77\u5f00\u53d1\u533a(\u4e1c)"},{"id":"5063","name":"\u4e1c\u6d77\u5f00\u53d1\u533a(\u897f)"},{"id":"5064","name":"\u725b\u5c71\u9547"},{"id":"5065","name":"\u9a7c\u5cf0\u9547"},{"id":"5066","name":"\u77f3\u69b4\u9547"}]},{"id":"3234","name":"\u8d63\u6986\u53bf","child":[{"id":"5055","name":"\u9752\u53e3\u9547"},{"id":"5056","name":"\u6d77\u6d0b\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5057","name":"\u8d63\u6986\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5058","name":"\u8d63\u6986\u897f\u5173\u5de5\u4e1a\u533a"},{"id":"5061","name":"\u6d77\u5934\u9547"}]},{"id":"2189","name":"\u8fde\u4e91\u533a"},{"id":"2188","name":"\u8fde\u4e91\u6e2f\u56fd\u5bb6\u7ecf\u6d4e\u8fdb\u51fa\u53e3\u52a0\u5de5\u533a"},{"id":"2186","name":"\u8fde\u4e91\u6e2f\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"2185","name":"\u6d66\u5357\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"2184","name":"\u6d77\u5dde\u533a"},{"id":"3237","name":"\u704c\u5357\u53bf"}]},{"id":"116","name":"\u5357\u901a\u5e02","child":[{"id":"5001","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"2250","name":"\u6d77\u5b89\u53bf","child":[{"id":"2252","name":"\u6d77\u5b89\u9547"},{"id":"2253","name":"\u80e1\u96c6\u9547"},{"id":"2254","name":"\u66f2\u5858\u9547"},{"id":"2255","name":"\u53cc\u697c\u9547"},{"id":"2256","name":"\u9686\u653f\u9547"},{"id":"2257","name":"\u57ce\u4e1c\u9547"},{"id":"2258","name":"\u674e\u5821\u9547"},{"id":"2259","name":"\u4e01\u6240\u9547"},{"id":"2260","name":"\u897f\u573a\u9547"}]},{"id":"2261","name":"\u5982\u4e1c\u53bf","child":[{"id":"5002","name":"\u5982\u4e1c\u79c1\u8425\u5de5\u4e1a\u56ed"},{"id":"2271","name":"\u66f9\u57e0\u9547"},{"id":"2270","name":"\u996e\u6cc9\u9547"},{"id":"2269","name":"\u5175\u623f\u9547"},{"id":"2268","name":"\u5c94\u6cb3\u9547"},{"id":"2267","name":"\u6f6e\u6865\u9547"},{"id":"2266","name":"\u9a6c\u5858\u9547"},{"id":"2265","name":"\u5982\u4e1c\u7ecf\u6d4e\u5f00\u53d1\u533a\u65b0\u533a"},{"id":"2264","name":"\u8001\u73af\u9547"},{"id":"2263","name":"\u6398\u6e2f\u9547"},{"id":"5003","name":"\u9648\u9ad8\u5de5\u4e1a\u56ed"}]},{"id":"2272","name":"\u542f\u4e1c\u5e02 ","child":[{"id":"2273","name":"\u6c47\u9f99\u9547"},{"id":"2274","name":"\u6c11\u4e3b\u9547"},{"id":"2275","name":"\u65b0\u6e2f\u9547"},{"id":"2276","name":"\u5317\u65b0\u9547"},{"id":"2277","name":"\u9ec4\u4ed3\u9547"},{"id":"2278","name":"\u60e0\u840d\u9547"},{"id":"2279","name":"\u5929\u6c7e\u9547"},{"id":"2280","name":"\u5415\u56db\u6e2f\u9547"}]},{"id":"2281","name":"\u5982\u768b\u5e02","child":[{"id":"5004","name":"\u5982\u57ce\u9547 "},{"id":"5015","name":"\u957f\u6c5f\u9547"},{"id":"5014","name":"\u4e1c\u9648\u9547"},{"id":"5013","name":"\u90ed\u56ed\u9547"},{"id":"5012","name":"\u77f3\u5e84\u9547"},{"id":"5011","name":"\u4e0b\u539f\u9547 "},{"id":"5010","name":"\u767d\u84b2\u9547"},{"id":"5009","name":"\u4e01\u5830\u9547"},{"id":"5008","name":"\u4e5d\u534e\u9547"},{"id":"5007","name":"\u67f4\u6e7e\u9547 "},{"id":"5006","name":"\u6843\u56ed\u9547 "},{"id":"5005","name":"\u6797\u6893\u9547 "},{"id":"5016","name":"\u5982\u768b\u6e2f\u7ecf\u6d4e\u5f00\u53d1\u533a"}]},{"id":"3230","name":"\u5d07\u5ddd\u533a "},{"id":"3231","name":"\u6e2f\u95f8\u533a "},{"id":"3232","name":"\u901a\u5dde\u5e02 ","child":[{"id":"5017","name":"\u91d1\u6c99\u9547"},{"id":"5034","name":"\u5f00\u6c99\u5c9b"},{"id":"5033","name":"\u4e94\u63a5\u9547"},{"id":"5032","name":"\u5e73\u4e1c\u9547"},{"id":"5031","name":"\u5e73\u6f6e\u9547"},{"id":"5030","name":"\u897f\u4ead\u9547"},{"id":"5029","name":"\u5f20\u829d\u5c71\u9547"},{"id":"5028","name":"\u5174\u4e1c\u9547"},{"id":"5027","name":"\u5ddd\u6e2f\u9547"},{"id":"5026","name":"\u6b63\u573a\u9547"},{"id":"5025","name":"\u59dc\u7076\u9547"},{"id":"5024","name":"\u6a2a\u6e2f\u9547"},{"id":"5023","name":"\u5174\u4ec1\u9547"},{"id":"5022","name":"\u5218\u6865\u9547"},{"id":"5021","name":"\u56db\u5b89\u9547"},{"id":"5020","name":"\u5148\u950b\u9547"},{"id":"5019","name":"\u8881\u7076\u9547"},{"id":"5018","name":"\u4e94\u7532\u9547"},{"id":"5035","name":"\u5341\u603b\u9547"}]},{"id":"3233","name":"\u6d77\u95e8\u5e02 ","child":[{"id":"5036","name":"\u6d77\u95e8\u9547"},{"id":"5053","name":"\u6b63\u4f59\u9547 "},{"id":"5052","name":"\u6811\u52cb\u9547"},{"id":"5051","name":"\u4f59\u4e1c\u9547"},{"id":"5050","name":"\u5305\u573a\u9547"},{"id":"5049","name":"\u56db\u7532\u9547"},{"id":"5048","name":"\u516d\u5321\u9547"},{"id":"5047","name":"\u60a6\u6765\u9547"},{"id":"5046","name":"\u6c5f\u6ee8\u9547"},{"id":"5045","name":"\u5e38\u4e50\u9547"},{"id":"5044","name":"\u4e09\u5382\u9547"},{"id":"5043","name":"\u5fb7\u80dc\u9547"},{"id":"5042","name":"\u5e73\u5c71\u9547"},{"id":"5041","name":"\u745e\u7965\u9547"},{"id":"5040","name":"\u4e09\u548c\u9547"},{"id":"5039","name":"\u5929\u8865\u9547"},{"id":"5038","name":"\u4e09\u661f\u9547"},{"id":"5037","name":"\u6d77\u95e8\u9547\u5f00\u53d1\u533a"},{"id":"5054","name":"\u5929\u6c7e\u9547 "}]}]},{"id":"115","name":"\u82cf\u5dde\u5e02","child":[{"id":"2245","name":"\u5e38\u719f\u5e02"},{"id":"3229","name":"\u76f8\u57ce\u533a"},{"id":"3228","name":"\u5434\u4e2d\u533a "},{"id":"3227","name":"\u864e\u4e18\u533a "},{"id":"3226","name":"\u91d1\u960a\u533a"},{"id":"3225","name":"\u5e73\u6c5f\u533a "},{"id":"3224","name":"\u6ca7\u6d6a\u533a  "},{"id":"2249","name":"\u592a\u4ed3\u5e02"},{"id":"2248","name":"\u5434\u6c5f\u5e02"},{"id":"2247","name":"\u6606\u5c71\u5e02"},{"id":"2246","name":"\u5f20\u5bb6\u6e2f\u5e02"},{"id":"6073","name":"\u82cf\u5dde\u5de5\u4e1a\u56ed\u533a"}]},{"id":"114","name":"\u5e38\u5dde\u5e02","child":[{"id":"2228","name":"\u91d1\u575b\u5e02"},{"id":"2229","name":"\u6ea7\u9633\u5e02","child":[{"id":"2231","name":"\u6ea7\u57ce\u9547"},{"id":"2243","name":"\u793e\u6e1a\u9547"},{"id":"2242","name":"\u524d\u9a6c\u9547"},{"id":"2241","name":"\u7af9\u7ba6\u9547"},{"id":"2240","name":"\u8336\u4ead\u9547"},{"id":"2239","name":"\u6234\u57e0\u9547"},{"id":"2238","name":"\u5929\u76ee\u6e56\u9547"},{"id":"2237","name":"\u6606\u4ed1\u5f00\u53d1\u533a"},{"id":"2236","name":"\u57ed\u5934\u9547"},{"id":"2235","name":"\u6e05\u5b89\u9547"},{"id":"2234","name":"\u6768\u5e84\u9547"},{"id":"2233","name":"\u540e\u516d\u9547"},{"id":"2232","name":"\u4e0a\u9ec4\u9547"},{"id":"2244","name":"\u5468\u57ce\u9547"}]},{"id":"3219","name":"\u5929\u5b81\u533a "},{"id":"3220","name":"\u949f\u697c\u533a "},{"id":"3221","name":"\u621a\u5885\u5830\u533a "},{"id":"3222","name":"\u65b0\u5317\u533a "},{"id":"3223","name":"\u6b66\u8fdb\u533a"}]},{"id":"113","name":"\u5f90\u5dde\u5e02","child":[{"id":"2176","name":"\u4e5d\u91cc\u533a"},{"id":"3218","name":"\u6c9b\u53bf "},{"id":"3217","name":"\u4e30\u53bf"},{"id":"3216","name":"\u8d3e\u6c6a\u533a "},{"id":"3215","name":"\u90b3\u5dde\u5e02 "},{"id":"3214","name":"\u65b0\u6c82\u5e02 "},{"id":"2181","name":"\u94dc\u5c71\u65b0\u533a"},{"id":"2180","name":"\u6cc9\u5c71\u533a"},{"id":"2179","name":"\u4e91\u9f99\u533a"},{"id":"2178","name":"\u9f13\u697c\u533a"},{"id":"3213","name":"\u7762\u5b81\u53bf "},{"id":"5000","name":"\u91d1\u5c71\u6865\u5f00\u53d1\u533a"}]},{"id":"112","name":"\u65e0\u9521\u5e02","child":[{"id":"2226","name":"\u5b9c\u5174\u5e02"},{"id":"2227","name":"\u6c5f\u9634\u5e02"},{"id":"3207","name":"\u5d07\u5b89\u533a "},{"id":"3208","name":"\u5357\u957f\u533a "},{"id":"3209","name":"\u5317\u5858\u533a "},{"id":"3210","name":"\u9521\u5c71\u533a "},{"id":"3211","name":"\u60e0\u5c71\u533a "},{"id":"3212","name":"\u6ee8\u6e56\u533a "},{"id":"4999","name":"\u65b0\u533a"}]},{"id":"123","name":"\u5bbf\u8fc1\u5e02","child":[{"id":"3263","name":"\u6cd7\u6d2a\u53bf "},{"id":"3260","name":"\u5bbf\u57ce\u533a "},{"id":"2212","name":"\u5bbf\u8c6b\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"3261","name":"\u6cad\u9633\u53bf "},{"id":"2214","name":"\u5bbf\u8c6b\u533a"},{"id":"3262","name":"\u6cd7\u9633\u53bf "},{"id":"5152","name":"\u5e02\u533a"},{"id":"5153","name":"\u5bbf\u8fc1\u7ecf\u6d4e\u5f00\u53d1\u533a"}]}]},{"id":"12","name":"\u6d59\u6c5f\u7701","child":[{"id":"5966","name":"\u4f59\u59da\u5e02"},{"id":"5964","name":"\u4e50\u6e05\u5e02"},{"id":"5965","name":"\u4e49\u4e4c\u5e02"},{"id":"5962","name":"\u6d77\u5b81\u5e02"},{"id":"5961","name":"\u5949\u5316\u5e02"},{"id":"5960","name":"\u6148\u6eaa\u5e02"},{"id":"134","name":"\u4e3d\u6c34\u5e02","child":[{"id":"3345","name":"\u83b2\u90fd\u533a  "},{"id":"3346","name":"\u9752\u7530\u53bf ","child":[{"id":"5403","name":"\u9e64\u57ce\u9547"},{"id":"5404","name":"\u6e29\u6eaa\u9547"}]},{"id":"3347","name":"\u7f19\u4e91\u53bf "},{"id":"3348","name":"\u9042\u660c\u53bf "},{"id":"3349","name":"\u677e\u9633\u53bf "},{"id":"3350","name":"\u4e91\u548c\u53bf ","child":[{"id":"5402","name":"\u4e91\u548c\u9547"}]},{"id":"3351","name":"\u5e86\u5143\u53bf "},{"id":"3352","name":"\u666f\u5b81\u7572\u65cf\u81ea\u6cbb\u53bf "},{"id":"3353","name":"\u9f99\u6cc9\u5e02 "}]},{"id":"133","name":"\u53f0\u5dde\u5e02","child":[{"id":"3336","name":"\u6912\u6c5f\u533a  "},{"id":"3337","name":"\u9ec4\u5ca9\u533a "},{"id":"3338","name":"\u8def\u6865\u533a "},{"id":"3339","name":"\u7389\u73af\u53bf ","child":[{"id":"5375","name":"\u73e0\u6e2f\u9547\uff08\u57ce\u5173\u9547\uff09"},{"id":"5376","name":"\u574e\u95e8\u9547"},{"id":"5377","name":"\u9648\u5c7f\u9547"},{"id":"5378","name":"\u666e\u5357\u5de5\u4e1a\u533a"},{"id":"5379","name":"\u6e05\u6e2f\u9547"},{"id":"5380","name":"\u695a\u95e8\u9547"},{"id":"5381","name":"\u82a6\u84b2\u9547"},{"id":"5382","name":"\u5e72\u6c5f\u9547 "}]},{"id":"3340","name":"\u5929\u53f0\u53bf ","child":[{"id":"5383","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"5384","name":"\u5766\u5934\u5de5\u4e1a\u533a"}]},{"id":"3341","name":"\u4e09\u95e8\u53bf"},{"id":"3342","name":"\u4ed9\u5c45\u53bf ","child":[{"id":"5385","name":"\u57ce\u5173\u9547"},{"id":"5386","name":"\u4e0b\u5404\u9547"},{"id":"5387","name":"\u5b98\u8def\u9547"}]},{"id":"3343","name":"\u6e29\u5cad\u5e02 ","child":[{"id":"5395","name":"\u677e\u95e8\u9547"},{"id":"5396","name":"\u7bac\u6a2a\u9547"},{"id":"5397","name":"\u65b0\u6cb3\u9547"},{"id":"5398","name":"\u6e29\u5ce4\u9547"},{"id":"5399","name":"\u6ee8\u6d77\u9547"},{"id":"5400","name":"\u57ce\u5357\u9547"},{"id":"5401","name":"\u575e\u6839\u9547"}]},{"id":"3344","name":"\u4e34\u6d77\u5e02","child":[{"id":"5388","name":"\u4e1c\u584d\u9547"},{"id":"5389","name":"\u6cbf\u6c5f\u9547"},{"id":"5390","name":"\u6d8c\u6cc9\u9547"},{"id":"5391","name":"\u5c24\u6eaa\u9547"},{"id":"5392","name":"\u675c\u6865\u9547"},{"id":"5393","name":"\u767d\u6c34\u6d0b\u9547"},{"id":"5394","name":"\u53cc\u6e2f\u9547"},{"id":"6060","name":"\u5e02\u533a"}]}]},{"id":"132","name":"\u821f\u5c71\u5e02","child":[{"id":"3332","name":"\u5b9a\u6d77\u533a "},{"id":"3333","name":"\u666e\u9640\u533a "},{"id":"3334","name":"\u5cb1\u5c71\u53bf "},{"id":"3335","name":"\u5d4a\u6cd7\u53bf "},{"id":"5373","name":"\u4e1c\u6e2f\u5f00\u53d1\u533a"},{"id":"5374","name":"\u6d66\u897f\u5f00\u53d1\u533a"}]},{"id":"131","name":"\u8862\u5dde\u5e02","child":[{"id":"3326","name":"\u67ef\u57ce\u533a "},{"id":"3327","name":"\u8862\u6c5f\u533a "},{"id":"3328","name":"\u5e38\u5c71\u53bf ","child":[{"id":"5363","name":"\u5929\u9a6c\u9547"}]},{"id":"3329","name":"\u5f00\u5316\u53bf "},{"id":"3330","name":"\u9f99\u6e38\u53bf ","child":[{"id":"5364","name":"\u9f99\u6e38\u9547"},{"id":"5365","name":"\u57ce\u5357\u5de5\u4e1a\u533a"},{"id":"5366","name":"\u7075\u6c5f\u5de5\u4e1a\u533a"},{"id":"5367","name":"\u57ce\u5317\u5de5\u4e1a\u533a"},{"id":"5368","name":"\u5c0f\u5357\u6d77\u9547"},{"id":"5369","name":"\u6e56\u9547\u9547"}]},{"id":"3331","name":"\u6c5f\u5c71\u5e02 ","child":[{"id":"5370","name":"\u4e0a\u4f59\u9547"},{"id":"5371","name":"\u8d3a\u6751\u9547"},{"id":"5372","name":"\u57ce\u5357\u5de5\u4e1a\u533a"}]}]},{"id":"130","name":"\u91d1\u534e\u5e02","child":[{"id":"3317","name":"\u5a7a\u57ce\u533a "},{"id":"3318","name":"\u91d1\u4e1c\u533a "},{"id":"3319","name":"\u6b66\u4e49\u53bf ","child":[{"id":"5335","name":"\u6850\u7434\u9547"},{"id":"5336","name":"\u6cc9\u6eaa\u9547"},{"id":"5337","name":"\u5c65\u5766\u9547"},{"id":"5338","name":"\u738b\u5b85\u9547"},{"id":"5339","name":"\u767d\u6d0b\u6e21\u5de5\u4e1a\u533a"},{"id":"5340","name":"\u767e\u82b1\u5c71\u5de5\u4e1a\u533a"},{"id":"5341","name":"\u6df1\u5858\u5de5\u4e1a\u533a"},{"id":"5342","name":"\u725b\u80cc\u91d1\u5de5\u4e1a\u533a"}]},{"id":"3320","name":"\u6d66\u6c5f\u53bf ","child":[{"id":"5343","name":"\u6d66\u9633\u9547"},{"id":"5344","name":"\u9ec4\u5b85\u9547"},{"id":"5345","name":"\u767d\u9a6c\u9547"},{"id":"5346","name":"\u90d1\u5b85\u9547"},{"id":"5347","name":"\u90d1\u5bb6\u575e\u9547"},{"id":"5348","name":"\u5ca9\u5934\u9547"}]},{"id":"3321","name":"\u78d0\u5b89\u53bf ","child":[{"id":"5349","name":"\u53bf\u57ce\u4e2d\u5fc3"}]},{"id":"3322","name":"\u5170\u6eaa\u5e02 ","child":[{"id":"5350","name":"\u539a\u4ec1\u9547"},{"id":"5351","name":"\u9ec4\u5e97\u9547"},{"id":"5352","name":"\u9999\u6eaa\u9547"},{"id":"5353","name":"\u9a6c\u6da7\u9547"}]},{"id":"3323","name":"\u4e49\u4e4c\u5e02 "},{"id":"3324","name":"\u4e1c\u9633\u5e02 ","child":[{"id":"5354","name":"\u5e02\u533a"},{"id":"5355","name":"\u6a2a\u5e97\u9547"},{"id":"5356","name":"\u6e56\u6eaa\u9547"},{"id":"5357","name":"\u6b4c\u5c71\u9547"},{"id":"5358","name":"\u5357\u9a6c\u9547"},{"id":"5359","name":"\u5dcd\u5c71\u9547"},{"id":"5360","name":"\u5343\u7965\u9547"},{"id":"5361","name":"\u753b\u6c34\u9547"},{"id":"5362","name":"\u9a6c\u5b85\u9547"}]},{"id":"3325","name":"\u6c38\u5eb7\u5e02 "}]},{"id":"129","name":"\u7ecd\u5174\u5e02","child":[{"id":"3311","name":"\u8d8a\u57ce\u533a "},{"id":"3312","name":"\u7ecd\u5174\u53bf "},{"id":"3313","name":"\u65b0\u660c\u53bf ","child":[{"id":"5277","name":"\u57ce\u5173\u9547"},{"id":"5278","name":"\u62d4\u8305\u9547"},{"id":"5279","name":"\u6885\u6e1a\u9547"},{"id":"5280","name":"\u6f84\u6f6d\u9547"},{"id":"5281","name":"\u5112\u5c99\u9547"}]},{"id":"3314","name":"\u8bf8\u66a8\u5e02 ","child":[{"id":"5282","name":"\u57ce\u5173\u9547"},{"id":"5295","name":"\u5b89\u534e\u9547"},{"id":"5296","name":"\u5e94\u5e97\u8857\u9547"},{"id":"5297","name":"\u76f4\u57e0\u9547"},{"id":"5298","name":"\u6b21\u575e\u9547"},{"id":"5299","name":"\u540c\u5c71\u9547"},{"id":"5300","name":"\u8d75\u5bb6\u9547"},{"id":"5301","name":"\u6e44\u6c60\u9547"},{"id":"5302","name":"\u749c\u5c71\u9547"},{"id":"5303","name":"\u724c\u5934\u9547"},{"id":"5304","name":"\u91cc\u6d66\u9547"},{"id":"5294","name":"\u962e\u5e02\u9547"},{"id":"5293","name":"\u5e97\u53e3\u9547"},{"id":"5283","name":"\u4e09\u90fd\u9547"},{"id":"5284","name":"\u5927\u5510\u9547"},{"id":"5285","name":"\u8349\u5854\u9547"},{"id":"5286","name":"\u4e94\u4e00\u9547"},{"id":"5287","name":"\u5c71\u4e0b\u6e56\u9547"},{"id":"5288","name":"\u6c5f\u85fb\u9547"},{"id":"5289","name":"\u4e94\u6cc4\u9547"},{"id":"5290","name":"\u67ab\u6865\u9547"},{"id":"5291","name":"\u53cc\u6865\u9547"},{"id":"5292","name":"\u8857\u4ead\u9547"},{"id":"5305","name":"\u738b\u5bb6\u4e95\u9547"}]},{"id":"3315","name":"\u4e0a\u865e\u5e02 ","child":[{"id":"5306","name":"\u767e\u5b98\u9547"},{"id":"5320","name":"\u4e0a\u6d66\u9547"},{"id":"5319","name":"\u6c38\u548c\u9547"},{"id":"5318","name":"\u6c64\u6d66\u9547"},{"id":"5317","name":"\u4e1c\u5173\u9547"},{"id":"5316","name":"\u6ca5\u6d77\u9547"},{"id":"5315","name":"\u4e30\u60e0\u9547"},{"id":"5314","name":"\u6881\u6e56\u9547"},{"id":"5313","name":"\u9053\u589f\u9547"},{"id":"5312","name":"\u677e\u53a6\u9547"},{"id":"5311","name":"\u8c22\u5858\u9547"},{"id":"5310","name":"\u9a7f\u4ead\u9547"},{"id":"5309","name":"\u5c0f\u8d8a\u9547"},{"id":"5308","name":"\u76d6\u5317\u9547"},{"id":"5307","name":"\u957f\u5858\u9547"},{"id":"5321","name":"\u7ae0\u9547"}]},{"id":"3316","name":"\u5d4a\u5dde\u5e02 ","child":[{"id":"5322","name":"\u57ce\u5173\u9547"},{"id":"5333","name":"\u4e09\u754c\u9547"},{"id":"5332","name":"\u77f3\u78fa\u9547"},{"id":"5331","name":"\u5bcc\u6da6\u9547"},{"id":"5330","name":"\u5d07\u4ec1\u9547"},{"id":"5329","name":"\u9ec4\u6cfd\u9547"},{"id":"5328","name":"\u5f00\u5143\u9547"},{"id":"5327","name":"\u535a\u6d4e\u9547"},{"id":"5326","name":"\u7518\u9716\u9547"},{"id":"5325","name":"\u957f\u4e50\u9547"},{"id":"5324","name":"\u86df\u9547"},{"id":"5323","name":"\u57ce\u4e1c\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5334","name":"\u4ed9\u5ca9\u9547"}]}]},{"id":"128","name":"\u6e56\u5dde\u5e02","child":[{"id":"3306","name":"\u5434\u5174\u533a "},{"id":"3307","name":"\u5357\u6d54\u533a "},{"id":"3308","name":"\u5fb7\u6e05\u53bf "},{"id":"3309","name":"\u957f\u5174\u53bf "},{"id":"3310","name":"\u5b89\u5409\u53bf ","child":[{"id":"5267","name":"\u5b5d\u4e30\u9547"},{"id":"5275","name":"\u826f\u670b\u9547"},{"id":"5274","name":"\u9ad8\u79b9\u9547"},{"id":"5273","name":"\u676d\u5793\u9547"},{"id":"5272","name":"\u7ae0\u6751\u9547"},{"id":"5271","name":"\u62a5\u798f\u9547"},{"id":"5270","name":"\u6653\u5885\u9547"},{"id":"5269","name":"\u6885\u6eaa\u9547"},{"id":"5268","name":"\u5929\u8352\u576a\u9547"},{"id":"5276","name":"\u9123\u5434\u9547"}]}]},{"id":"127","name":"\u5609\u5174\u5e02","child":[{"id":"3299","name":"\u5357\u6e56\u533a "},{"id":"3300","name":"\u79c0\u6d32\u533a  "},{"id":"3301","name":"\u5609\u5584\u53bf "},{"id":"3302","name":"\u6d77\u76d0\u53bf "},{"id":"3303","name":"\u6d77\u5b81\u5e02 "},{"id":"3304","name":"\u5e73\u6e56\u5e02 "},{"id":"3305","name":"\u6850\u4e61\u5e02 "}]},{"id":"126","name":"\u6e29\u5dde\u5e02","child":[{"id":"3288","name":"\u9e7f\u57ce\u533a  "},{"id":"3297","name":"\u745e\u5b89\u5e02 ","child":[{"id":"5218","name":"\u5b89\u9633\u65b0\u533a"},{"id":"5236","name":"\u6f6e\u57fa\u9547"},{"id":"5235","name":"\u9676\u5c71\u9547"},{"id":"5234","name":"\u9a6c\u5c7f\u9547"},{"id":"5233","name":"\u7f57\u51e4\u9547"},{"id":"5232","name":"\u4ed9\u964d\u9547"},{"id":"5231","name":"\u98de\u4e91\u9547"},{"id":"5229","name":"\u4e1c\u5c71\u9547"},{"id":"5228","name":"\u573a\u6865\u9547"},{"id":"5227","name":"\u6d77\u5b89\u9547"},{"id":"5226","name":"\u4e0a\u671b\u9547"},{"id":"5225","name":"\u6850\u6d66\u9547"},{"id":"5224","name":"\u9c8d\u7530\u9547"},{"id":"5223","name":"\u57ce\u5173\u9547"},{"id":"5222","name":"\u6c40\u7530\u9547"},{"id":"5221","name":"\u8398\u584d\u9547"},{"id":"5220","name":"\u78a7\u5c71\u9547"},{"id":"5219","name":"\u5858\u4e0b\u9547"},{"id":"5237","name":"\u6e56\u5cad\u9547"}]},{"id":"3296","name":"\u6cf0\u987a\u53bf "},{"id":"3295","name":"\u6587\u6210\u53bf "},{"id":"3294","name":"\u82cd\u5357\u53bf ","child":[{"id":"5246","name":"\u9f99\u6e2f\u9547"},{"id":"5247","name":"\u91d1\u4e61\u9547"},{"id":"5248","name":"\u94b1\u5e93\u9547"},{"id":"5249","name":"\u82a6\u6d66\u9547"},{"id":"5250","name":"\u5b9c\u5c71\u9547"},{"id":"5251","name":"\u671b\u91cc\u9547"},{"id":"5252","name":"\u7075\u6eaa\u9547"},{"id":"5253","name":"\u6e56\u524d\u9547"}]},{"id":"3293","name":"\u5e73\u9633\u53bf ","child":[{"id":"5254","name":"\u90d1\u697c\u9547"},{"id":"5265","name":"\u5b8b\u57e0\u9547"},{"id":"5264","name":"\u5b8b\u6865\u9547"},{"id":"5263","name":"\u9ebb\u6b65\u9547"},{"id":"5262","name":"\u6ed5\u86df\u9547"},{"id":"5261","name":"\u8427\u6c5f\u9547"},{"id":"5260","name":"\u94b1\u4ed3\u9547"},{"id":"5259","name":"\u6606\u9633\u9547"},{"id":"5258","name":"\u9ccc\u6c5f\u9547"},{"id":"5257","name":"\u6986\u579f\u9547"},{"id":"5256","name":"\u4e0b\u5b8b\u5de5\u4e1a\u56ed"},{"id":"5255","name":"\u6c34\u5934\u9547"},{"id":"5266","name":"\u51e4\u5367\u9547"}]},{"id":"3292","name":"\u6c38\u5609\u53bf ","child":[{"id":"5238","name":"\u6865\u5934\u9547"},{"id":"5239","name":"\u74ef\u5317\u9547"},{"id":"5241","name":"\u4e0a\u5858\u9547"},{"id":"5242","name":"\u4e0b\u5858\u9547"},{"id":"5243","name":"\u6c99\u5934\u9547"},{"id":"5244","name":"\u4e4c\u725b\u9547"},{"id":"5245","name":"\u6865\u4e0b\u9547"}]},{"id":"3291","name":"\u6d1e\u5934\u53bf "},{"id":"3290","name":"\u74ef\u6d77\u533a "},{"id":"3289","name":"\u9f99\u6e7e\u533a "},{"id":"3298","name":"\u4e50\u6e05\u5e02 ","child":[{"id":"5197","name":"\u4e50\u6210\u9547"},{"id":"5216","name":"\u6e56\u96fe\u9547"},{"id":"5215","name":"\u8299\u84c9\u9547"},{"id":"5214","name":"\u6e05\u6c5f\u9547"},{"id":"5213","name":"\u767d\u77f3\u9547"},{"id":"5212","name":"\u5357\u5858\u9547"},{"id":"5211","name":"\u84b2\u6b67\u9547"},{"id":"5210","name":"\u9ec4\u534e\u9547"},{"id":"5209","name":"\u77f3\u5e06\u9547"},{"id":"5207","name":"\u8c61\u9633\u9547"},{"id":"5206","name":"\u78d0\u77f3\u9547"},{"id":"5204","name":"\u6de1\u6eaa\u9547"},{"id":"5203","name":"\u7fc1\u579f\u9547"},{"id":"5202","name":"\u8679\u6865\u9547"},{"id":"5201","name":"\u4e50\u57ce\u9547"},{"id":"5200","name":"\u4e03\u91cc\u6e2f\u9547"},{"id":"5199","name":"\u67f3\u5e02\u9547"},{"id":"5198","name":"\u5317\u767d\u8c61\u9547"},{"id":"5217","name":"\u5927\u8346\u9547"}]}]},{"id":"125","name":"\u5b81\u6ce2\u5e02","child":[{"id":"3277","name":"\u6d77\u66d9\u533a "},{"id":"3286","name":"\u6148\u6eaa\u5e02 "},{"id":"3285","name":"\u4f59\u59da\u5e02 "},{"id":"3284","name":"\u5b81\u6d77\u53bf ","child":[{"id":"5185","name":"\u5b81\u6d77\u65b0\u5174\u5de5\u4e1a\u56ed\u533a"},{"id":"5194","name":"\u529b\u6d0b\u9547"},{"id":"5193","name":"\u524d\u7ae5\u9547"},{"id":"5192","name":"\u5c94\u8def\u9547"},{"id":"5191","name":"\u5f3a\u80f6\u9547"},{"id":"5190","name":"\u6df1\u5733\u9547"},{"id":"5189","name":"\u9ec4\u575b\u9547"},{"id":"5188","name":"\u5927\u4f73\u4f55\u9547"},{"id":"5187","name":"\u897f\u5e97\u9547"},{"id":"5186","name":"\u5b81\u6d77\u79d1\u6280\u56ed\u533a"},{"id":"5196","name":"\u957f\u8857\u9547"}]},{"id":"3283","name":"\u8c61\u5c71\u53bf ","child":[{"id":"5179","name":"\u4e39\u57ce\u9547"},{"id":"5180","name":"\u5927\u5f90\u9547"},{"id":"5182","name":"\u5899\u5934\u9547"},{"id":"5183","name":"\u897f\u5468\u9547"},{"id":"5184","name":"\u77f3\u6d66\u9547"}]},{"id":"3282","name":"\u911e\u5dde\u533a "},{"id":"3281","name":"\u9547\u6d77\u533a "},{"id":"3280","name":"\u5317\u4ed1\u533a "},{"id":"3279","name":"\u6c5f\u5317\u533a  "},{"id":"3278","name":"\u6c5f\u4e1c\u533a "},{"id":"3287","name":"\u5949\u5316\u5e02"}]},{"id":"124","name":"\u676d\u5dde\u5e02","child":[{"id":"3266","name":"\u6c5f\u5e72\u533a "},{"id":"3275","name":"\u5bcc\u9633\u5e02 "},{"id":"3274","name":"\u5efa\u5fb7\u5e02 ","child":[{"id":"5172","name":"\u5e72\u6f6d\u9547"},{"id":"5173","name":"\u5b89\u4ec1\u9547"},{"id":"5174","name":"\u6d0b\u6eaa\u8857\u9053"},{"id":"5175","name":"\u6885\u57ce\u9547"},{"id":"5176","name":"\u6768\u6751\u6865\u9547"},{"id":"5177","name":"\u4e0b\u6daf\u9547"}]},{"id":"3273","name":"\u6df3\u5b89\u53bf ","child":[{"id":"5178","name":"\u5343\u5c9b\u6e56\u9547"}]},{"id":"3272","name":"\u6850\u5e90\u53bf ","child":[{"id":"5161","name":"\u6d0b\u6d32\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5170","name":"\u767e\u6c5f\u9547"},{"id":"5169","name":"\u5bcc\u6625\u6c5f\u9547"},{"id":"5168","name":"\u51e4\u5ddd\u9547"},{"id":"5167","name":"\u5206\u6c34\u9547"},{"id":"5166","name":"\u6c5f\u5357\u9547"},{"id":"5165","name":"\u65b9\u57e0\u5f00\u53d1\u533a"},{"id":"5164","name":"\u6a2a\u6751\u9547"},{"id":"5163","name":"\u53cc\u6e56\u5f00\u53d1\u533a"},{"id":"5162","name":"\u6850\u5e90\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5171","name":"\u7476\u7433\u9547"}]},{"id":"3271","name":"\u4f59\u676d\u533a "},{"id":"3270","name":"\u8427\u5c71\u533a "},{"id":"3269","name":"\u6ee8\u6c5f\u533a "},{"id":"3268","name":"\u897f\u6e56\u533a "},{"id":"3267","name":"\u62f1\u5885\u533a "},{"id":"3265","name":"\u4e0b\u57ce\u533a "},{"id":"3264","name":"\u4e0a\u57ce\u533a "},{"id":"3276","name":"\u4e34\u5b89\u5e02 ","child":[{"id":"5154","name":"\u4e34\u5b89\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5155","name":"\u9ad8\u8679\u9547"},{"id":"5156","name":"\u85fb\u6eaa\u9547"},{"id":"5157","name":"\u4e8e\u6f5c\u9547"},{"id":"5158","name":"\u6a2a\u7548\u9547"},{"id":"5159","name":"\u660c\u5316\u9547"},{"id":"5160","name":"\u592a\u9633\u9547"}]}]}]},{"id":"13","name":"\u5b89\u5fbd\u7701","child":[{"id":"135","name":"\u5408\u80a5\u5e02","child":[{"id":"3354","name":"\u7476\u6d77\u533a "},{"id":"5407","name":"\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5406","name":"\u5faa\u73af\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5405","name":"\u9ad8\u65b0\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"3360","name":"\u80a5\u897f\u53bf ","child":[{"id":"5411","name":"\u6843\u82b1\u5de5\u4e1a\u56ed\u533a"},{"id":"5412","name":"\u5357\u5c97\u9547"}]},{"id":"3359","name":"\u80a5\u4e1c\u53bf ","child":[{"id":"5409","name":"\u80a5\u4e1c\u65b0\u57ce\u5f00\u53d1\u533a"},{"id":"5410","name":"\u5e97\u57e0\u9547"}]},{"id":"3358","name":"\u957f\u4e30\u53bf ","child":[{"id":"5408","name":"\u53cc\u51e4\u5de5\u4e1a\u56ed\u533a "}]},{"id":"3357","name":"\u5305\u6cb3\u533a "},{"id":"3356","name":"\u8700\u5c71\u533a "},{"id":"3355","name":"\u5e90\u9633\u533a "},{"id":"6021","name":"\u8499\u57ce\u53bf"}]},{"id":"150","name":"\u6c60\u5dde\u5e02","child":[{"id":"3447","name":"\u8d35\u6c60\u533a "},{"id":"3448","name":"\u4e1c\u81f3\u53bf "},{"id":"3449","name":"\u77f3\u53f0\u53bf "},{"id":"3450","name":"\u9752\u9633\u53bf "}]},{"id":"149","name":"\u4eb3\u5dde\u5e02","child":[{"id":"3443","name":"\u8c2f\u57ce\u533a "},{"id":"3444","name":"\u6da1\u9633\u53bf "},{"id":"3445","name":"\u8499\u57ce\u53bf "},{"id":"3446","name":"\u5229\u8f9b\u53bf "}]},{"id":"148","name":"\u516d\u5b89\u5e02","child":[{"id":"3436","name":"\u91d1\u5b89\u533a "},{"id":"3437","name":"\u88d5\u5b89\u533a "},{"id":"3438","name":"\u5bff\u53bf "},{"id":"3439","name":"\u970d\u90b1\u53bf "},{"id":"3440","name":"\u8212\u57ce\u53bf "},{"id":"3441","name":"\u91d1\u5be8\u53bf "},{"id":"3442","name":"\u970d\u5c71\u53bf "},{"id":"5443","name":"\u516d\u5b89\u7ecf\u6d4e\u5f00\u53d1\u533a"}]},{"id":"147","name":"\u5de2\u6e56\u5e02","child":[{"id":"3431","name":"\u5c45\u5de2\u533a "},{"id":"3432","name":"\u5e90\u6c5f\u53bf "},{"id":"3433","name":"\u65e0\u4e3a\u53bf "},{"id":"3434","name":"\u542b\u5c71\u53bf "},{"id":"3435","name":"\u548c\u53bf "},{"id":"5442","name":"\u5c45\u5de2\u533a\u6c11\u8425\u7ecf\u6d4e\u56ed"}]},{"id":"146","name":"\u5bbf\u5dde\u5e02","child":[{"id":"3426","name":"\u57c7\u6865\u533a "},{"id":"3427","name":"\u7800\u5c71\u53bf "},{"id":"3428","name":"\u8427\u53bf "},{"id":"3429","name":"\u7075\u74a7\u53bf "},{"id":"3430","name":"\u6cd7\u53bf "}]},{"id":"145","name":"\u961c\u9633\u5e02","child":[{"id":"3418","name":"\u988d\u5dde\u533a  "},{"id":"3419","name":"\u988d\u4e1c\u533a "},{"id":"3420","name":"\u988d\u6cc9\u533a "},{"id":"3421","name":"\u4e34\u6cc9\u53bf "},{"id":"3422","name":"\u592a\u548c\u53bf "},{"id":"3423","name":"\u961c\u5357\u53bf "},{"id":"3424","name":"\u988d\u4e0a\u53bf "},{"id":"3425","name":"\u754c\u9996\u5e02 "}]},{"id":"144","name":"\u6ec1\u5dde\u5e02","child":[{"id":"3410","name":"\u7405\u740a\u533a "},{"id":"3411","name":"\u5357\u8c2f\u533a  "},{"id":"3412","name":"\u6765\u5b89\u53bf "},{"id":"3413","name":"\u5168\u6912\u53bf "},{"id":"3414","name":"\u5b9a\u8fdc\u53bf "},{"id":"3415","name":"\u51e4\u9633\u53bf "},{"id":"3416","name":"\u5929\u957f\u5e02 "},{"id":"3417","name":"\u660e\u5149\u5e02 "},{"id":"5441","name":"\u6ec1\u5dde\u5e02\u7ecf\u6d4e\u5f00\u53d1\u533a"}]},{"id":"143","name":"\u9ec4\u5c71\u5e02","child":[{"id":"3403","name":"\u5c6f\u6eaa\u533a "},{"id":"3404","name":"\u9ec4\u5c71\u533a "},{"id":"3405","name":"\u5fbd\u5dde\u533a "},{"id":"3406","name":"\u6b59\u53bf "},{"id":"3407","name":"\u4f11\u5b81\u53bf "},{"id":"3408","name":"\u9edf\u53bf "},{"id":"3409","name":"\u7941\u95e8\u53bf "}]},{"id":"142","name":"\u5b89\u5e86\u5e02","child":[{"id":"3392","name":"\u8fce\u6c5f\u533a "},{"id":"5437","name":"\u5434\u5480\u5de5\u4e1a\u56ed"},{"id":"5436","name":"\u5b89\u5e86\u957f\u6c5f\u5927\u6865\u7efc\u5408\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5435","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"3402","name":"\u6850\u57ce\u5e02 ","child":[{"id":"5439","name":"\u6850\u57ce\u6c11\u8425\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5440","name":"\u5e02\u533a"}]},{"id":"3401","name":"\u5cb3\u897f\u53bf "},{"id":"3400","name":"\u671b\u6c5f\u53bf "},{"id":"3399","name":"\u5bbf\u677e\u53bf "},{"id":"3398","name":"\u592a\u6e56\u53bf "},{"id":"3397","name":"\u6f5c\u5c71\u53bf "},{"id":"3396","name":"\u679e\u9633\u53bf "},{"id":"3395","name":"\u6000\u5b81\u53bf "},{"id":"3394","name":"\u5b9c\u79c0\u533a "},{"id":"3393","name":"\u5927\u89c2\u533a "},{"id":"5438","name":"\u5927\u65fa\u5de5\u4e1a\u56ed"}]},{"id":"141","name":"\u94dc\u9675\u5e02","child":[{"id":"3389","name":"\u94dc\u5b98\u5c71\u533a "},{"id":"3390","name":"\u72ee\u5b50\u5c71\u533a "},{"id":"3391","name":"\u94dc\u9675\u53bf ","child":[{"id":"5432","name":"\u91d1\u660c\u5de5\u4e1a\u56ed"},{"id":"5433","name":"\u5e0c\u671b\u5de5\u4e1a\u56ed "}]},{"id":"5999","name":"\u90ca\u533a"}]},{"id":"140","name":"\u6dee\u5317\u5e02","child":[{"id":"3385","name":"\u675c\u96c6\u533a "},{"id":"3386","name":"\u76f8\u5c71\u533a "},{"id":"3387","name":"\u70c8\u5c71\u533a "},{"id":"3388","name":"\u6fc9\u6eaa\u53bf "}]},{"id":"139","name":"\u9a6c\u978d\u5c71\u5e02","child":[{"id":"3381","name":"\u91d1\u5bb6\u5e84\u533a "},{"id":"3382","name":"\u82b1\u5c71\u533a "},{"id":"3383","name":"\u96e8\u5c71\u533a "},{"id":"3384","name":"\u5f53\u6d82\u53bf ","child":[{"id":"5425","name":"\u5f53\u6d82\u5de5\u4e1a\u56ed"},{"id":"5426","name":"\u59d1\u5b70\u9547"},{"id":"5427","name":"\u535a\u671b\u9547"},{"id":"5428","name":"\u4e39\u9633\u9547"},{"id":"5429","name":"\u56f4\u5c4f\u9547"},{"id":"5430","name":"\u5411\u5c71\u9547"},{"id":"5431","name":"\u970d\u91cc\u9547"}]},{"id":"5424","name":"\u9a6c\u978d\u5c71\u7ecf\u6d4e\u5f00\u53d1\u533a "}]},{"id":"138","name":"\u6dee\u5357\u5e02","child":[{"id":"3375","name":"\u5927\u901a\u533a "},{"id":"3376","name":"\u7530\u5bb6\u5eb5\u533a "},{"id":"3377","name":"\u8c22\u5bb6\u96c6\u533a "},{"id":"3378","name":"\u516b\u516c\u5c71\u533a "},{"id":"3379","name":"\u6f58\u96c6\u533a "},{"id":"3380","name":"\u51e4\u53f0\u53bf "},{"id":"6051","name":"\u94b1\u6c5f\u533a"}]},{"id":"137","name":"\u868c\u57e0\u5e02","child":[{"id":"3368","name":"\u9f99\u5b50\u6e56\u533a "},{"id":"3369","name":"\u868c\u5c71\u533a "},{"id":"3370","name":"\u79b9\u4f1a\u533a "},{"id":"3371","name":"\u6dee\u4e0a\u533a "},{"id":"3372","name":"\u6000\u8fdc\u53bf "},{"id":"3373","name":"\u4e94\u6cb3\u53bf "},{"id":"3374","name":"\u56fa\u9547\u53bf "},{"id":"5422","name":"\u868c\u57e0\u65b0\u57ce\u5f00\u53d1\u533a"},{"id":"5423","name":"\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a"}]},{"id":"136","name":"\u829c\u6e56\u5e02","child":[{"id":"3361","name":"\u955c\u6e56\u533a "},{"id":"3362","name":"\u5f0b\u6c5f\u533a "},{"id":"3363","name":"\u9e20\u6c5f\u533a "},{"id":"3364","name":"\u4e09\u5c71\u533a "},{"id":"3365","name":"\u829c\u6e56\u53bf ","child":[{"id":"5415","name":"\u6e7e\u6c9a\u9547"},{"id":"5416","name":"\u4e09\u9c81\u5de5\u4e1a\u56ed"}]},{"id":"3366","name":"\u7e41\u660c\u53bf ","child":[{"id":"5417","name":"\u7e41\u9633\u9547"},{"id":"5418","name":"\u5b59\u6751\u9547"},{"id":"5419","name":"\u9ec4\u6d52\u9547"},{"id":"5420","name":"\u5ce8\u5c71\u5de5\u4e1a\u56ed\u533a"},{"id":"5421","name":"\u7e41\u660c\u53bf\u5de5\u4e1a\u56ed\u533a"}]},{"id":"3367","name":"\u5357\u9675\u53bf "},{"id":"5413","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5414","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"151","name":"\u5ba3\u57ce\u5e02","child":[{"id":"3451","name":"\u5ba3\u5dde\u533a "},{"id":"3452","name":"\u90ce\u6eaa\u53bf "},{"id":"3453","name":"\u5e7f\u5fb7\u53bf ","child":[{"id":"5450","name":"\u6843\u5dde\u9547"},{"id":"5451","name":"\u5e7f\u5fb7\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5452","name":"\u90b1\u6751\u9547"}]},{"id":"3454","name":"\u6cfe\u53bf "},{"id":"3455","name":"\u7ee9\u6eaa\u53bf "},{"id":"3456","name":"\u65cc\u5fb7\u53bf "},{"id":"3457","name":"\u5b81\u56fd\u5e02 ","child":[{"id":"5446","name":"\u5b81\u56fd\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5447","name":"\u5b81\u56fd\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5448","name":"\u6c6a\u6eaa\u9547"},{"id":"5449","name":"\u6cb3\u6ca5\u6eaa\u9547"}]},{"id":"5444","name":"\u5ba3\u57ce\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5445","name":"\u5ba3\u5dde\u5de5\u4e1a\u533a"}]}]},{"id":"14","name":"\u798f\u5efa\u7701","child":[{"id":"5980","name":"\u77f3\u72ee\u5e02"},{"id":"5979","name":"\u664b\u6c5f\u5e02"},{"id":"5978","name":"\u798f\u6e05\u5e02"},{"id":"160","name":"\u5b81\u5fb7\u5e02","child":[{"id":"3534","name":"\u8549\u57ce\u533a "},{"id":"3535","name":"\u971e\u6d66\u53bf ","child":[{"id":"5595","name":"\u677e\u57ce\u9547"},{"id":"5596","name":"\u6843\u6e90\u5de5\u4e1a\u56ed\u533a"},{"id":"5597","name":"\u4e09\u6c99\u9547"}]},{"id":"3536","name":"\u53e4\u7530\u53bf ","child":[{"id":"5598","name":"\u65b0\u57ce\u9547"},{"id":"5599","name":"\u677e\u5409\u4e61\u4e2d\u5fc3"},{"id":"5600","name":"\u6e56\u6ee8\u4e61\u4e2d\u5fc3 "}]},{"id":"3537","name":"\u5c4f\u5357\u53bf ","child":[{"id":"5601","name":"\u53e4\u5cf0\u9547"},{"id":"5602","name":"\u5c4f\u57ce\u4e61"}]},{"id":"3538","name":"\u5bff\u5b81\u53bf ","child":[{"id":"5603","name":"\u6e05\u6e90\u4e61"},{"id":"5604","name":"\u9ccc\u9633\u9547"}]},{"id":"3539","name":"\u5468\u5b81\u53bf ","child":[{"id":"5605","name":"\u72ee\u57ce\u9547"},{"id":"5606","name":"\u6d66\u6e90\u9547"}]},{"id":"3540","name":"\u67d8\u8363\u53bf ","child":[{"id":"5607","name":"\u53cc\u57ce\u9547"},{"id":"5608","name":"\u5c98\u5c71\u6d0b\u5de5\u4e1a\u533a"},{"id":"5609","name":"\u4e1c\u6e90\u4e61"}]},{"id":"3541","name":"\u798f\u5b89\u5e02 ","child":[{"id":"5610","name":"\u97e9\u57ce\u9547"},{"id":"5611","name":"\u79e6\u6eaa\u6d0b\u5de5\u4e1a\u533a"},{"id":"5612","name":"\u5742\u4e2d\u5de5\u4e1a\u533a"},{"id":"5613","name":"\u5c0f\u6eaa\u8fb9\u5de5\u4e1a\u533a"},{"id":"5614","name":"\u5357\u90ca\u5de5\u4e1a\u533a"},{"id":"5615","name":"\u6d0b\u8fb9"},{"id":"5616","name":"\u9633\u5934"},{"id":"5617","name":"\u5ca9\u6e56\u5f00\u53d1\u533a"},{"id":"5618","name":"\u7f57\u6c5f\u5f00\u53d1\u533a"}]},{"id":"3542","name":"\u798f\u9f0e\u5e02 ","child":[{"id":"5619","name":"\u6850\u57ce\u9547"},{"id":"5620","name":"\u6d41\u7f8e\u5f00\u53d1\u533a"},{"id":"5621","name":"\u9f99\u5c71\u5f00\u53d1\u533a"},{"id":"5622","name":"\u6e29\u5dde\u5de5\u4e1a\u56ed\u533a"},{"id":"5623","name":"\u661f\u706b\u5de5\u4e1a\u56ed\u533a"},{"id":"5624","name":"\u79e6\u5c7f\u9547"},{"id":"5625","name":"\u5e97\u4e0b\u9547"}]}]},{"id":"159","name":"\u9f99\u5ca9\u5e02","child":[{"id":"3527","name":"\u65b0\u7f57\u533a "},{"id":"3528","name":"\u957f\u6c40\u53bf "},{"id":"3529","name":"\u6c38\u5b9a\u53bf "},{"id":"3530","name":"\u4e0a\u676d\u53bf "},{"id":"3531","name":"\u6b66\u5e73\u53bf "},{"id":"3532","name":"\u8fde\u57ce\u53bf "},{"id":"3533","name":"\u6f33\u5e73\u5e02 "}]},{"id":"158","name":"\u5357\u5e73\u5e02","child":[{"id":"3517","name":"\u5ef6\u5e73\u533a "},{"id":"3525","name":"\u5efa\u74ef\u5e02 "},{"id":"3524","name":"\u6b66\u5937\u5c71\u5e02 ","child":[{"id":"5588","name":"\u5d07\u5b89\u9547"},{"id":"5589","name":"\u9ad8\u901f\u677f\u9547"},{"id":"5590","name":"\u5174\u7530\u9547"},{"id":"5591","name":"\u65b0\u6751\u9547"}]},{"id":"3523","name":"\u90b5\u6b66\u5e02 ","child":[{"id":"5585","name":"\u6c34\u5317\u9547"},{"id":"5586","name":"\u4e0b\u6c99\u9547"},{"id":"5587","name":"\u90ca\u57ce\u9547"}]},{"id":"3522","name":"\u653f\u548c\u53bf ","child":[{"id":"5580","name":"\u677e\u6e90\u5de5\u4e1a\u533a"},{"id":"5581","name":"\u9e64\u90fd\u5cad\u5de5\u4e1a\u533a"},{"id":"5582","name":"\u718a\u5c71\u9547"},{"id":"5583","name":"\u94c1\u5c71\u9547"},{"id":"5584","name":"\u4e1c\u5cf0\u9547"}]},{"id":"3521","name":"\u677e\u6eaa\u53bf ","child":[{"id":"5579","name":"\u677e\u6e90\u9547"}]},{"id":"3520","name":"\u5149\u6cfd\u53bf ","child":[{"id":"5578","name":"\u676d\u5ddd\u9547 "}]},{"id":"3519","name":"\u6d66\u57ce\u53bf ","child":[{"id":"5576","name":"\u5357\u6d66\u9547"},{"id":"5577","name":"\u83b2\u5858\u9547"}]},{"id":"3518","name":"\u987a\u660c\u53bf ","child":[{"id":"5574","name":"\u6c34\u5357\u9547"},{"id":"5575","name":"\u53cc\u6eaa\u9547"}]},{"id":"3526","name":"\u5efa\u9633\u5e02 ","child":[{"id":"5592","name":"\u6f6d\u57ce\u9547"},{"id":"5593","name":"\u7ae5\u6e38\u9547"},{"id":"5594","name":"\u9ebb\u6c99\u9547"}]}]},{"id":"157","name":"\u6f33\u5dde\u5e02","child":[{"id":"3506","name":"\u8297\u57ce\u533a "},{"id":"3515","name":"\u534e\u5b89\u53bf ","child":[{"id":"5572","name":"\u4e30\u5c71\u9547"}]},{"id":"3514","name":"\u5e73\u548c\u53bf ","child":[{"id":"5569","name":"\u5c0f\u6eaa\u9547"},{"id":"5570","name":"\u5c71\u683c\u9547"},{"id":"5571","name":"\u6587\u5cf0\u9547"}]},{"id":"3513","name":"\u5357\u9756\u53bf ","child":[{"id":"5564","name":"\u9756\u57ce\u9547"},{"id":"5565","name":"\u5c71\u57ce\u9547"},{"id":"5566","name":"\u91d1\u5c71\u9547"},{"id":"5567","name":"\u9f99\u5c71\u9547"},{"id":"5568","name":"\u4e30\u7530\u9547 "}]},{"id":"3512","name":"\u4e1c\u5c71\u53bf ","child":[{"id":"5561","name":"\u94dc\u9675\u9547"},{"id":"5562","name":"\u897f\u57d4\u9547"},{"id":"5563","name":"\u4e1c\u5c71\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"3511","name":"\u957f\u6cf0\u53bf ","child":[{"id":"5555","name":"\u9648\u5df7\u9547"},{"id":"5556","name":"\u6b66\u5b89\u9547"},{"id":"5557","name":"\u5174\u6cf0\u5de5\u4e1a\u533a"},{"id":"5558","name":"\u5ca9\u6eaa\u5de5\u4e1a\u533a"},{"id":"5559","name":"\u5b98\u5c71\u5de5\u4e1a\u533a "},{"id":"5560","name":"\u4e0a\u8521"}]},{"id":"3510","name":"\u8bcf\u5b89\u53bf ","child":[{"id":"5553","name":"\u5357\u8bcf\u9547"},{"id":"5554","name":"\u6df1\u6865\u9547"}]},{"id":"3509","name":"\u6f33\u6d66\u53bf ","child":[{"id":"5545","name":"\u957f\u6865\u9547"},{"id":"5546","name":"\u65e7\u9547"},{"id":"5547","name":"\u7ee5\u5b89\u9547"},{"id":"5548","name":"\u76d8\u9640\u9547"},{"id":"5549","name":"\u6e56\u897f\u9547"},{"id":"5550","name":"\u4f5b\u6619\u9547"},{"id":"5551","name":"\u6df1\u571f\u9547"},{"id":"5552","name":"\u8d64\u6e56\u9547"}]},{"id":"3508","name":"\u4e91\u9704\u53bf ","child":[{"id":"5542","name":"\u4e91\u9675\u9547"},{"id":"5543","name":"\u5e38\u5c71\u5de5\u4e1a\u533a"},{"id":"5544","name":"\u4e03\u661f\u5de5\u4e1a\u533a"}]},{"id":"3507","name":"\u9f99\u6587\u533a "},{"id":"3516","name":"\u9f99\u6d77\u5e02 "}]},{"id":"156","name":"\u6cc9\u5dde\u5e02","child":[{"id":"3494","name":"\u9ca4\u57ce\u533a  "},{"id":"3504","name":"\u664b\u6c5f\u5e02 "},{"id":"3503","name":"\u77f3\u72ee\u5e02 "},{"id":"3502","name":"\u91d1\u95e8\u53bf "},{"id":"3501","name":"\u5fb7\u5316\u53bf ","child":[{"id":"5538","name":"\u9f99\u6d54\u9547"},{"id":"5539","name":"\u6d54\u4e2d\u9547"},{"id":"5540","name":"\u4e09\u73ed\u9547"},{"id":"5541","name":"\u76d6\u5fb7\u9547"}]},{"id":"3500","name":"\u6c38\u6625\u53bf ","child":[{"id":"5530","name":"\u6843\u57ce\u9547"},{"id":"5531","name":"\u4e94\u91cc\u8857\u9547"},{"id":"5532","name":"\u5cb5\u5c71\u9547"},{"id":"5533","name":"\u77f3\u9f13\u9547"},{"id":"5534","name":"\u4e1c\u5e73\u9547"},{"id":"5535","name":"\u4e1c\u5173\u9547"},{"id":"5536","name":"\u8fbe\u57d4\u9547"},{"id":"5537","name":"\u84ec\u58f6\u9547"}]},{"id":"3499","name":"\u5b89\u6eaa\u53bf ","child":[{"id":"5525","name":"\u51e4\u57ce\u9547"},{"id":"5526","name":"\u57ce\u53a2\u9547"},{"id":"5527","name":"\u5b98\u6865\u9547"},{"id":"5528","name":"\u9f99\u95e8\u9547"},{"id":"5529","name":"\u5c1a\u537f\u9547"}]},{"id":"3498","name":"\u60e0\u5b89\u53bf ","child":[{"id":"5520","name":"\u8096\u539d\u9547"},{"id":"5521","name":"\u5d07\u6b66\u9547"},{"id":"5522","name":"\u5f20\u5742\u9547"},{"id":"5523","name":"\u4e1c\u6865\u9547"},{"id":"5524","name":"\u5c71\u971e\u9547"}]},{"id":"3497","name":"\u6cc9\u6e2f\u533a "},{"id":"3496","name":"\u6d1b\u6c5f\u533a "},{"id":"3495","name":"\u4e30\u6cfd\u533a "},{"id":"3505","name":"\u5357\u5b89\u5e02 ","child":[{"id":"5517","name":"\u6c38\u6625\u53bf"},{"id":"5518","name":"\u5b89\u6eaa\u53bf"},{"id":"5519","name":"\u5fb7\u5316\u53bf"}]}]},{"id":"155","name":"\u4e09\u660e\u5e02","child":[{"id":"3482","name":"\u6885\u5217\u533a "},{"id":"3492","name":"\u5efa\u5b81\u53bf "},{"id":"3491","name":"\u6cf0\u5b81\u53bf "},{"id":"3490","name":"\u5c06\u4e50\u53bf ","child":[{"id":"5514","name":"\u6c34\u5357\u9547"},{"id":"5515","name":"\u53e4\u955b\u9547"},{"id":"5516","name":"\u5317\u5c71\u5de5\u4e1a\u56ed\u533a "}]},{"id":"3489","name":"\u6c99\u53bf ","child":[{"id":"5506","name":"\u6c34\u4e1c\u5de5\u4e1a\u56ed"},{"id":"5507","name":"\u4e09\u660e\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a"},{"id":"5508","name":"\u91d1\u53e4\u5f00\u53d1\u533a"},{"id":"5509","name":"\u9752\u5dde\u9547"}]},{"id":"3488","name":"\u5c24\u6eaa\u53bf ","child":[{"id":"5510","name":"\u57ce\u5173\u9547"},{"id":"5511","name":"\u897f\u57ce\u9547"}]},{"id":"3487","name":"\u5927\u7530\u53bf "},{"id":"3486","name":"\u5b81\u5316\u53bf "},{"id":"3485","name":"\u6e05\u6d41\u53bf "},{"id":"3484","name":"\u660e\u6eaa\u53bf ","child":[{"id":"5512","name":"\u96ea\u950b\u9547"},{"id":"5513","name":"\u57ce\u5173\u4e61"}]},{"id":"3483","name":"\u4e09\u5143\u533a "},{"id":"3493","name":"\u6c38\u5b89\u5e02 ","child":[{"id":"5503","name":"\u5c3c\u845b\u5f00\u53d1\u533a"},{"id":"5504","name":"\u8d21\u5ddd\u9547"},{"id":"5505","name":"\u66f9\u8fdc\u9547"}]}]},{"id":"154","name":"\u8386\u7530\u5e02","child":[{"id":"3477","name":"\u57ce\u53a2\u533a "},{"id":"3478","name":"\u6db5\u6c5f\u533a "},{"id":"3479","name":"\u8354\u57ce\u533a "},{"id":"3480","name":"\u79c0\u5c7f\u533a "},{"id":"3481","name":"\u4ed9\u6e38\u53bf "}]},{"id":"153","name":"\u53a6\u95e8\u5e02","child":[{"id":"3471","name":"\u601d\u660e\u533a  "},{"id":"3472","name":"\u6d77\u6ca7\u533a "},{"id":"3473","name":"\u6e56\u91cc\u533a "},{"id":"3474","name":"\u96c6\u7f8e\u533a "},{"id":"3475","name":"\u540c\u5b89\u533a "},{"id":"3476","name":"\u7fd4\u5b89\u533a "}]},{"id":"152","name":"\u798f\u5dde\u5e02","child":[{"id":"3458","name":"\u9f13\u697c\u533a  "},{"id":"3469","name":"\u798f\u6e05\u5e02 ","child":[{"id":"5478","name":"\u878d\u57ce\u9547"},{"id":"5494","name":"\u6c5f\u955c\u9547"},{"id":"5493","name":"\u6c99\u57d4\u9547"},{"id":"5492","name":"\u4e09\u5c71\u9547"},{"id":"5491","name":"\u9ad8\u5c71\u9547"},{"id":"5490","name":"\u6e2f\u5934\u9547"},{"id":"5489","name":"\u4e1c\u5f20\u9547"},{"id":"5488","name":"\u65b0\u539d\u9547"},{"id":"5487","name":"\u6d77\u53e3\u9547"},{"id":"5486","name":"\u6e14\u6eaa\u9547"},{"id":"5485","name":"\u9633\u4e0b\u9547"},{"id":"5484","name":"\u4e0a\u8ff3\u9547"},{"id":"5483","name":"\u57ce\u5934\u9547"},{"id":"5482","name":"\u97f3\u897f\u9547"},{"id":"5481","name":"\u5883\u6d0b\u9547"},{"id":"5480","name":"\u9f99\u7530\u9547"},{"id":"5479","name":"\u5b8f\u8def\u9547"},{"id":"5495","name":"\u6c5f\u9634\u9547"}]},{"id":"3468","name":"\u5e73\u6f6d\u53bf "},{"id":"3467","name":"\u6c38\u6cf0\u53bf ","child":[{"id":"5475","name":"\u6a1f\u57ce\u9547"},{"id":"5476","name":"\u57ce\u5cf0\u9547"},{"id":"5477","name":"\u6e05\u51c9\u9547 "}]},{"id":"3466","name":"\u95fd\u6e05\u53bf ","child":[{"id":"5469","name":"\u6885\u57ce\u9547"},{"id":"5470","name":"\u6885\u6eaa\u9547"},{"id":"5471","name":"\u6c60\u56ed\u9547"},{"id":"5472","name":"\u767d\u6a1f\u9547"},{"id":"5473","name":"\u5742\u4e1c\u9547"},{"id":"5474","name":"\u767d\u4e2d\u9547"}]},{"id":"3465","name":"\u7f57\u6e90\u53bf ","child":[{"id":"5468","name":"\u51e4\u5c71\u9547"}]},{"id":"3464","name":"\u8fde\u6c5f\u53bf ","child":[{"id":"5462","name":"\u51e4\u57ce\u9547"},{"id":"5463","name":"\u6556\u6c5f\u9547"},{"id":"5464","name":"\u742f\u5934\u9547"},{"id":"5465","name":"\u6c5f\u5357\u9547"},{"id":"5466","name":"\u6d66\u53e3\u9547"},{"id":"5467","name":"\u4e1c\u6e56\u9547"}]},{"id":"3463","name":"\u95fd\u4faf\u53bf ","child":[{"id":"5453","name":"\u7518\u8517\u9547"},{"id":"5454","name":"\u8346\u6eaa\u9547"},{"id":"5455","name":"\u767d\u6c99\u9547"},{"id":"5456","name":"\u9752\u53e3\u9547"},{"id":"5457","name":"\u5357\u5c7f\u9547"},{"id":"5458","name":"\u5357\u901a\u9547"},{"id":"5459","name":"\u7965\u8c26\u9547"},{"id":"5460","name":"\u5c1a\u5e72\u9547"},{"id":"5461","name":"\u4e0a\u8857\u9547"}]},{"id":"3462","name":"\u664b\u5b89\u533a "},{"id":"3461","name":"\u9a6c\u5c3e\u533a "},{"id":"3460","name":"\u4ed3\u5c71\u533a "},{"id":"3459","name":"\u53f0\u6c5f\u533a "},{"id":"3470","name":"\u957f\u4e50\u5e02 ","child":[{"id":"5496","name":"\u7389\u7530\u9547"},{"id":"5497","name":"\u677e\u4e0b\u9547"},{"id":"5498","name":"\u6885\u82b1\u9547"},{"id":"5499","name":"\u8425\u524d\u9547"},{"id":"5500","name":"\u6f6d\u5934\u9547"},{"id":"5501","name":"\u6587\u6b66\u7802\u9547"},{"id":"5502","name":"\u53e4\u69d0\u9547"},{"id":"6075","name":"\u91d1\u5cf0\u9547"}]}]}]},{"id":"15","name":"\u6c5f\u897f\u7701","child":[{"id":"161","name":"\u5357\u660c\u5e02","child":[{"id":"3543","name":"\u4e1c\u6e56\u533a  "},{"id":"5627","name":"\u7ea2\u8c37\u6ee9\u65b0\u533a"},{"id":"5626","name":"\u5357\u660c\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"3551","name":"\u8fdb\u8d24\u53bf "},{"id":"3550","name":"\u5b89\u4e49\u53bf "},{"id":"3549","name":"\u65b0\u5efa\u53bf ","child":[{"id":"5631","name":"\u957f\u9675\u9547"},{"id":"5632","name":"\u660c\u5317\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5633","name":"\u86df\u6865\u9547"}]},{"id":"3548","name":"\u5357\u660c\u53bf ","child":[{"id":"5629","name":"\u5c0f\u5170\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5630","name":"\u8fde\u5858\u9547"}]},{"id":"3547","name":"\u9752\u5c71\u6e56\u533a "},{"id":"3546","name":"\u6e7e\u91cc\u533a "},{"id":"3545","name":"\u9752\u4e91\u8c31\u533a "},{"id":"3544","name":"\u897f\u6e56\u533a "},{"id":"5628","name":"\u7ea2\u89d2\u6d32\u533a"}]},{"id":"170","name":"\u629a\u5dde\u5e02","child":[{"id":"3619","name":"\u4e34\u5ddd\u533a "},{"id":"3628","name":"\u4e1c\u4e61\u53bf "},{"id":"3627","name":"\u8d44\u6eaa\u53bf "},{"id":"3626","name":"\u91d1\u6eaa\u53bf "},{"id":"3625","name":"\u5b9c\u9ec4\u53bf "},{"id":"3624","name":"\u4e50\u5b89\u53bf "},{"id":"3623","name":"\u5d07\u4ec1\u53bf "},{"id":"3622","name":"\u5357\u4e30\u53bf "},{"id":"3621","name":"\u9ece\u5ddd\u53bf "},{"id":"3620","name":"\u5357\u57ce\u53bf "},{"id":"3629","name":"\u5e7f\u660c\u53bf "}]},{"id":"169","name":"\u5b9c\u6625\u5e02","child":[{"id":"3609","name":"\u8881\u5dde\u533a "},{"id":"3618","name":"\u9ad8\u5b89\u5e02 "},{"id":"3617","name":"\u6a1f\u6811\u5e02 "},{"id":"3616","name":"\u4e30\u57ce\u5e02 "},{"id":"3615","name":"\u94dc\u9f13\u53bf "},{"id":"3614","name":"\u9756\u5b89\u53bf "},{"id":"3613","name":"\u5b9c\u4e30\u53bf "},{"id":"3612","name":"\u4e0a\u9ad8\u53bf "},{"id":"3611","name":"\u4e07\u8f7d\u53bf "},{"id":"3610","name":"\u5949\u65b0\u53bf "},{"id":"5637","name":"\u9a6c\u738b\u5858\u7ecf\u6d4e\u5f00\u53d1\u533a "}]},{"id":"168","name":"\u5409\u5b89\u5e02","child":[{"id":"3596","name":"\u5409\u5dde\u533a "},{"id":"3607","name":"\u6c38\u65b0\u53bf "},{"id":"3606","name":"\u5b89\u798f\u53bf "},{"id":"3605","name":"\u4e07\u5b89\u53bf "},{"id":"3604","name":"\u9042\u5ddd\u53bf "},{"id":"3603","name":"\u6cf0\u548c\u53bf "},{"id":"3602","name":"\u6c38\u4e30\u53bf "},{"id":"3601","name":"\u65b0\u5e72\u53bf "},{"id":"3600","name":"\u5ce1\u6c5f\u53bf "},{"id":"3599","name":"\u5409\u6c34\u53bf "},{"id":"3598","name":"\u5409\u5b89\u53bf "},{"id":"3597","name":"\u9752\u539f\u533a "},{"id":"3608","name":"\u4e95\u5188\u5c71\u5e02 "}]},{"id":"167","name":"\u8d63\u5dde\u5e02","child":[{"id":"3578","name":"\u7ae0\u8d21\u533a  "},{"id":"3594","name":"\u745e\u91d1\u5e02 "},{"id":"3593","name":"\u77f3\u57ce\u53bf "},{"id":"3592","name":"\u5bfb\u4e4c\u53bf "},{"id":"3591","name":"\u4f1a\u660c\u53bf "},{"id":"3590","name":"\u5174\u56fd\u53bf "},{"id":"3589","name":"\u4e8e\u90fd\u53bf "},{"id":"3588","name":"\u5b81\u90fd\u53bf "},{"id":"3587","name":"\u5168\u5357\u53bf "},{"id":"3586","name":"\u5b9a\u5357\u53bf "},{"id":"3585","name":"\u9f99\u5357\u53bf "},{"id":"3584","name":"\u5b89\u8fdc\u53bf "},{"id":"3583","name":"\u5d07\u4e49\u53bf "},{"id":"3582","name":"\u4e0a\u72b9\u53bf "},{"id":"3581","name":"\u5927\u4f59\u53bf "},{"id":"3580","name":"\u4fe1\u4e30\u53bf "},{"id":"3579","name":"\u8d63\u53bf "},{"id":"3595","name":"\u5357\u5eb7\u5e02 "}]},{"id":"166","name":"\u9e70\u6f6d\u5e02","child":[{"id":"3575","name":"\u6708\u6e56\u533a "},{"id":"3576","name":"\u4f59\u6c5f\u53bf "},{"id":"3577","name":"\u8d35\u6eaa\u5e02 "}]},{"id":"165","name":"\u65b0\u4f59\u5e02","child":[{"id":"3573","name":"\u6e1d\u6c34\u533a "},{"id":"3574","name":"\u5206\u5b9c\u53bf "},{"id":"5636","name":"\u9ad8\u65b0\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"164","name":"\u4e5d\u6c5f\u5e02","child":[{"id":"3561","name":"\u5e90\u5c71\u533a "},{"id":"5634","name":"\u4e5d\u6c5f\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"3572","name":"\u745e\u660c\u5e02 "},{"id":"3571","name":"\u5f6d\u6cfd\u53bf "},{"id":"3570","name":"\u6e56\u53e3\u53bf "},{"id":"3569","name":"\u90fd\u660c\u53bf "},{"id":"3568","name":"\u661f\u5b50\u53bf  "},{"id":"3567","name":"\u5fb7\u5b89\u53bf "},{"id":"3566","name":"\u6c38\u4fee\u53bf "},{"id":"3565","name":"\u4fee\u6c34\u53bf "},{"id":"3564","name":"\u6b66\u5b81\u53bf "},{"id":"3563","name":"\u4e5d\u6c5f\u53bf "},{"id":"3562","name":"\u6d54\u9633\u533a "},{"id":"5635","name":"\u5171\u9752\u5f00\u653e\u5f00\u53d1\u533a"}]},{"id":"163","name":"\u840d\u4e61\u5e02","child":[{"id":"3556","name":"\u5b89\u6e90\u533a "},{"id":"3557","name":"\u6e58\u4e1c\u533a "},{"id":"3558","name":"\u83b2\u82b1\u53bf "},{"id":"3559","name":"\u4e0a\u6817\u53bf "},{"id":"3560","name":"\u82a6\u6eaa\u53bf "}]},{"id":"162","name":"\u666f\u5fb7\u9547\u5e02","child":[{"id":"3552","name":"\u660c\u6c5f\u533a "},{"id":"3553","name":"\u73e0\u5c71\u533a "},{"id":"3554","name":"\u6d6e\u6881\u53bf "},{"id":"3555","name":"\u4e50\u5e73\u5e02 "}]},{"id":"171","name":"\u4e0a\u9976\u5e02","child":[{"id":"3630","name":"\u4fe1\u5dde\u533a "},{"id":"3641","name":"\u5fb7\u5174\u5e02 "},{"id":"3640","name":"\u5a7a\u6e90\u53bf "},{"id":"3639","name":"\u4e07\u5e74\u53bf "},{"id":"3638","name":"\u9131\u9633\u53bf "},{"id":"3637","name":"\u4f59\u5e72\u53bf "},{"id":"3636","name":"\u5f0b\u9633\u53bf "},{"id":"3635","name":"\u6a2a\u5cf0\u53bf "},{"id":"3634","name":"\u94c5\u5c71\u53bf "},{"id":"3633","name":"\u7389\u5c71\u53bf "},{"id":"3632","name":"\u5e7f\u4e30\u53bf ","child":[{"id":"5641","name":"\u53bf\u57ce"}]},{"id":"3631","name":"\u4e0a\u9976\u53bf ","child":[{"id":"5639","name":"\u65ed\u65e5\u9547"},{"id":"5640","name":"\u4e0a\u9976\u53bf\u5de5\u4e1a\u56ed "}]},{"id":"5638","name":"\u4e0a\u9976\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"}]}]},{"id":"16","name":"\u5c71\u4e1c\u7701","child":[{"id":"172","name":"\u6d4e\u5357\u5e02","child":[{"id":"3642","name":"\u5386\u4e0b\u533a  "},{"id":"3651","name":"\u7ae0\u4e18\u5e02 ","child":[{"id":"5647","name":"\u5201\u9547"},{"id":"5655","name":"\u67a3\u56ed\u9547"},{"id":"5654","name":"\u7ee3\u60e0\u9547"},{"id":"5653","name":"\u57e0\u6751\u9547"},{"id":"5652","name":"\u660e\u6c34\u9547"},{"id":"5651","name":"\u660e\u6c34\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5650","name":"\u7ae0\u4e18\u5e02\u5f00\u53d1\u533a"},{"id":"5649","name":"\u65ed\u5347\u9547"},{"id":"5648","name":"\u53cc\u5c71\u9547"},{"id":"5656","name":"\u76f8\u516c\u5e84\u9547"}]},{"id":"3650","name":"\u5546\u6cb3\u53bf "},{"id":"3649","name":"\u6d4e\u9633\u53bf ","child":[{"id":"5643","name":"\u53bf\u57ce\u533a"},{"id":"5644","name":"\u6d4e\u5317\u5f00\u53d1\u533a"},{"id":"5645","name":"\u5d14\u5be8\u9547"},{"id":"5646","name":"\u56de\u6cb3\u9547"}]},{"id":"3648","name":"\u5e73\u9634\u53bf "},{"id":"3647","name":"\u957f\u6e05\u533a "},{"id":"3646","name":"\u5386\u57ce\u533a "},{"id":"3645","name":"\u5929\u6865\u533a "},{"id":"3644","name":"\u69d0\u836b\u533a "},{"id":"3643","name":"\u5e02\u4e2d\u533a "},{"id":"5642","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"187","name":"\u6ee8\u5dde\u5e02","child":[{"id":"3767","name":"\u6ee8\u57ce\u533a  "},{"id":"3768","name":"\u60e0\u6c11\u53bf "},{"id":"3769","name":"\u9633\u4fe1\u53bf ","child":[{"id":"5848","name":"\u9633\u4fe1\u5f00\u53d1\u533a"}]},{"id":"3770","name":"\u65e0\u68e3\u53bf "},{"id":"3771","name":"\u6cbe\u5316\u53bf "},{"id":"3772","name":"\u535a\u5174\u53bf ","child":[{"id":"5845","name":"\u53bf\u57ce"},{"id":"5846","name":"\u5e97\u5b50\u9547"},{"id":"5847","name":"\u6e56\u6ee8\u9547"}]},{"id":"3773","name":"\u90b9\u5e73\u53bf "}]},{"id":"186","name":"\u804a\u57ce\u5e02","child":[{"id":"3759","name":"\u4e1c\u660c\u5e9c\u533a  "},{"id":"3760","name":"\u9633\u8c37\u53bf "},{"id":"3761","name":"\u8398\u53bf "},{"id":"3762","name":"\u830c\u5e73\u53bf "},{"id":"3763","name":"\u4e1c\u963f\u53bf ","child":[{"id":"5841","name":"\u987e\u5b98\u5c6f\u9547"},{"id":"5842","name":"\u4e1c\u963f\u79d1\u6280\u5de5\u4e1a\u56ed"}]},{"id":"3764","name":"\u51a0\u53bf "},{"id":"3765","name":"\u9ad8\u5510\u53bf ","child":[{"id":"5844","name":"\u53bf\u4e2d\u5fc3"}]},{"id":"3766","name":"\u4e34\u6e05\u5e02 ","child":[{"id":"5843","name":"\u5e02\u4e2d\u5fc3"}]},{"id":"5840","name":"\u804a\u57ce\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"185","name":"\u5fb7\u5dde\u5e02","child":[{"id":"3748","name":"\u5fb7\u57ce\u533a  "},{"id":"5829","name":"\u5546\u8d38\u5f00\u53d1\u533a"},{"id":"5828","name":"\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"3758","name":"\u79b9\u57ce\u5e02 ","child":[{"id":"5833","name":"\u5e02\u533a"},{"id":"5834","name":"\u79b9\u57ce\u5f00\u53d1\u533a"}]},{"id":"3757","name":"\u4e50\u9675\u5e02 "},{"id":"3756","name":"\u6b66\u57ce\u53bf "},{"id":"3755","name":"\u590f\u6d25\u53bf "},{"id":"3754","name":"\u5e73\u539f\u53bf "},{"id":"3753","name":"\u9f50\u6cb3\u53bf ","child":[{"id":"5835","name":"\u53bf\u57ce"},{"id":"5836","name":"\u9f50\u6cb3\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5837","name":"\u7ecf\u6d4e\u5f00\u53d1\u533a\u897f\u533a"}]},{"id":"3752","name":"\u4e34\u9091\u53bf "},{"id":"3751","name":"\u5e86\u4e91\u53bf "},{"id":"3750","name":"\u5b81\u6d25\u53bf ","child":[{"id":"5832","name":"\u53bf\u57ce"}]},{"id":"3749","name":"\u9675\u53bf ","child":[{"id":"5838","name":"\u53bf\u57ce"},{"id":"5839","name":"\u9675\u897f\u5f00\u53d1\u533a"}]},{"id":"5830","name":"\u5929\u8862\u533a"}]},{"id":"184","name":"\u4e34\u6c82\u5e02","child":[{"id":"3736","name":"\u5170\u5c71\u533a  "},{"id":"3746","name":"\u8499\u9634\u53bf ","child":[{"id":"5823","name":"\u53bf\u57ce"},{"id":"5824","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"3745","name":"\u8392\u5357\u53bf "},{"id":"3744","name":"\u5e73\u9091\u53bf "},{"id":"3743","name":"\u8d39\u53bf "},{"id":"3742","name":"\u82cd\u5c71\u53bf "},{"id":"3741","name":"\u6c82\u6c34\u53bf ","child":[{"id":"5822","name":"\u53bf\u57ce"}]},{"id":"3740","name":"\u90ef\u57ce\u53bf "},{"id":"3739","name":"\u6c82\u5357\u53bf ","child":[{"id":"5819","name":"\u53bf\u57ce"},{"id":"5820","name":"\u5927\u5e84\u9547\u4e2d\u5fc3"},{"id":"5821","name":"\u94dc\u4e95\u9547\u4e2d\u5fc3 "}]},{"id":"3738","name":"\u6cb3\u4e1c\u533a "},{"id":"3737","name":"\u7f57\u5e84\u533a "},{"id":"3747","name":"\u4e34\u6cad\u53bf ","child":[{"id":"5827","name":"\u53bf\u57ce"}]}]},{"id":"183","name":"\u83b1\u829c\u5e02","child":[{"id":"3734","name":"\u83b1\u57ce\u533a "},{"id":"3735","name":"\u94a2\u57ce\u533a "},{"id":"5817","name":"\u83b1\u57ce\u7ecf\u6d4e\u5f00\u53d1\u533a"}]},{"id":"182","name":"\u65e5\u7167\u5e02","child":[{"id":"3730","name":"\u4e1c\u6e2f\u533a "},{"id":"3731","name":"\u5c9a\u5c71\u533a "},{"id":"3732","name":"\u4e94\u83b2\u53bf ","child":[{"id":"5816","name":"\u53bf\u57ce"}]},{"id":"3733","name":"\u8392\u53bf "},{"id":"5812","name":"\u65e5\u7167\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5813","name":"\u65b0\u5e02\u533a"},{"id":"5814","name":"\u8001\u5e02\u533a "}]},{"id":"181","name":"\u5a01\u6d77\u5e02","child":[{"id":"3726","name":"\u73af\u7fe0\u533a "},{"id":"3727","name":"\u6587\u767b\u5e02 ","child":[{"id":"5793","name":"\u5e02\u533a"},{"id":"5794","name":"\u5317\u90ca\u9547"},{"id":"5795","name":"\u6587\u767b\u8425\u9547"},{"id":"5796","name":"\u82d8\u5c71\u9547"},{"id":"5797","name":"\u5317\u6548\u9547"},{"id":"5798","name":"\u7c73\u5c71\u9547"},{"id":"5799","name":"\u6587\u57ce\u9547"}]},{"id":"3728","name":"\u8363\u6210\u5e02 ","child":[{"id":"5800","name":"\u5e02\u533a"},{"id":"5801","name":"\u77f3\u5c9b\u9547"},{"id":"5802","name":"\u864e\u5c71\u9547"},{"id":"5803","name":"\u4e0a\u5e84\u9547"},{"id":"5804","name":"\u6ed5\u5bb6\u9547"},{"id":"5805","name":"\u5d16\u5934\u9547"}]},{"id":"3729","name":"\u4e73\u5c71\u5e02 ","child":[{"id":"5806","name":"\u5e02\u533a"},{"id":"5807","name":"\u590f\u6751\u9547"},{"id":"5808","name":"\u4e73\u5c71\u53e3\u9547"},{"id":"5809","name":"\u91d1\u5cad\u5f00\u53d1\u533a"},{"id":"5810","name":"\u767d\u6c99\u6ee9\u9547"},{"id":"5811","name":"\u6d77\u9633\u6240\u9547"}]},{"id":"5791","name":"\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a"},{"id":"5792","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"180","name":"\u6cf0\u5b89\u5e02","child":[{"id":"3720","name":"\u6cf0\u5c71\u533a "},{"id":"3721","name":"\u5cb1\u5cb3\u533a "},{"id":"3722","name":"\u5b81\u9633\u53bf "},{"id":"3723","name":"\u4e1c\u5e73\u53bf "},{"id":"3724","name":"\u65b0\u6cf0\u5e02 "},{"id":"3725","name":"\u80a5\u57ce\u5e02 ","child":[{"id":"5786","name":"\u65b0\u57ce\u9547"},{"id":"5787","name":"\u80a5\u57ce\u9ad8\u65b0\u5f00\u53d1\u533a"},{"id":"5788","name":"\u738b\u74dc\u5e97\u9547"},{"id":"5789","name":"\u8001\u57ce\u9547"},{"id":"5790","name":"\u5e02\u533a"}]}]},{"id":"179","name":"\u6d4e\u5b81\u5e02","child":[{"id":"3708","name":"\u5e02\u4e2d\u533a  "},{"id":"3719","name":"\u90b9\u57ce\u5e02 ","child":[{"id":"5785","name":"\u5e02\u4e2d\u5fc3"}]},{"id":"3718","name":"\u5156\u5dde\u5e02 "},{"id":"3717","name":"\u66f2\u961c\u5e02 "},{"id":"3716","name":"\u6881\u5c71\u53bf "},{"id":"3715","name":"\u6cd7\u6c34\u53bf "},{"id":"3714","name":"\u6c76\u4e0a\u53bf "},{"id":"3713","name":"\u5609\u7965\u53bf ","child":[{"id":"5783","name":"\u53bf\u57ce"},{"id":"5784","name":"\u5609\u7965\u7ecf\u6d4e\u5f00\u53d1\u533a "}]},{"id":"3712","name":"\u91d1\u4e61\u53bf "},{"id":"3711","name":"\u9c7c\u53f0\u53bf "},{"id":"3710","name":"\u5fae\u5c71\u53bf "},{"id":"3709","name":"\u4efb\u57ce\u533a "},{"id":"5782","name":"\u6d4e\u5b81\u5e02\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a"}]},{"id":"178","name":"\u6f4d\u574a\u5e02","child":[{"id":"3696","name":"\u6f4d\u57ce\u533a "},{"id":"3707","name":"\u660c\u9091\u5e02 ","child":[{"id":"5774","name":"\u5e02\u533a"},{"id":"5775","name":"\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5776","name":"\u67f3\u7583\u9547"},{"id":"5777","name":"\u56f4\u5b50\u9547"},{"id":"5778","name":"\u4ed3\u8857\u9547"},{"id":"5779","name":"\u5b8b\u5e84\u9547"},{"id":"5780","name":"\u53cc\u53f0\u9547"},{"id":"5781","name":"\u996e\u9a6c\u9547"}]},{"id":"3706","name":"\u9ad8\u5bc6\u5e02 ","child":[{"id":"5768","name":"\u5bc6\u6c34\u8857\u529e"},{"id":"5769","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5770","name":"\u67cf\u57ce\u9547"},{"id":"5771","name":"\u59da\u54e5\u5e84\u9547"},{"id":"5772","name":"\u59dc\u5e84\u9547"},{"id":"5773","name":"\u590f\u5e84\u9547"}]},{"id":"3705","name":"\u5b89\u4e18\u5e02 ","child":[{"id":"5762","name":"\u5e02\u533a"},{"id":"5763","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5764","name":"\u5d16\u5934\u5de5\u4e1a\u56ed\u533a"},{"id":"5765","name":"\u5218\u5bb6\u5c27\u9547"},{"id":"5766","name":"\u5173\u738b\u9547"},{"id":"5767","name":"\u666f\u829d\u9547"}]},{"id":"3704","name":"\u5bff\u5149\u5e02 ","child":[{"id":"5752","name":"\u5e02\u533a"},{"id":"5760","name":"\u53f0\u5934\u9547"},{"id":"5759","name":"\u4e0a\u53e3\u9547"},{"id":"5758","name":"\u6d77\u5316\u5f00\u53d1\u533a"},{"id":"5757","name":"\u5019\u9547"},{"id":"5756","name":"\u7a3b\u7530\u9547"},{"id":"5755","name":"\u7559\u5415\u9547"},{"id":"5754","name":"\u5bd2\u6865\u9547"},{"id":"5753","name":"\u5bff\u5149\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5761","name":"\u5316\u9f99\u9547"}]},{"id":"3703","name":"\u8bf8\u57ce\u5e02 ","child":[{"id":"5743","name":"\u5e02\u533a"},{"id":"5744","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1"},{"id":"5745","name":"\u8f9b\u5174\u9547"},{"id":"5746","name":"\u660c\u57ce\u9547"},{"id":"5747","name":"\u5415\u6807\u9547"},{"id":"5748","name":"\u6731\u89e3\u9547"},{"id":"5749","name":"\u7bad\u53e3\u9547"},{"id":"5750","name":"\u4e5d\u53f0\u9547"},{"id":"5751","name":"\u76f8\u5dde\u9547"}]},{"id":"3702","name":"\u9752\u5dde\u5e02 ","child":[{"id":"5742","name":"\u5e02\u533a"}]},{"id":"3701","name":"\u660c\u4e50\u53bf ","child":[{"id":"5735","name":"\u53bf\u57ce"},{"id":"5736","name":"\u660c\u4e50\u5f00\u53d1\u533a"},{"id":"5737","name":"\u660c\u4e50\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5738","name":"\u6731\u5218\u9547"},{"id":"5739","name":"\u4e94\u56fe\u9547"},{"id":"5740","name":"\u4e54\u5b98\u9547"},{"id":"5741","name":"\u5510\u543e\u9547"}]},{"id":"3700","name":"\u4e34\u6710\u53bf ","child":[{"id":"5731","name":"\u53bf\u57ce"},{"id":"5732","name":"\u4e1c\u57ce\u533a"},{"id":"5733","name":"\u8425\u5b50\u9547\u4e2d\u5fc3"},{"id":"5734","name":"\u4e34\u6710\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"3699","name":"\u594e\u6587\u533a "},{"id":"3698","name":"\u574a\u5b50\u533a "},{"id":"3697","name":"\u5bd2\u4ead\u533a "},{"id":"5730","name":"\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u533a"}]},{"id":"177","name":"\u70df\u53f0\u5e02","child":[{"id":"3684","name":"\u829d\u7f58\u533a "},{"id":"3695","name":"\u6d77\u9633\u5e02 ","child":[{"id":"5726","name":"\u5e02\u533a"},{"id":"5727","name":"\u6d77\u9633\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5728","name":"\u6d77\u9633\u57ce\u533a"},{"id":"5729","name":"\u6d77\u9633\u5f00\u53d1\u533a"}]},{"id":"3694","name":"\u6816\u971e\u5e02 ","child":[{"id":"5724","name":"\u677e\u5c71\u9547"},{"id":"5725","name":"\u6843\u6751\u9547"}]},{"id":"3693","name":"\u62db\u8fdc\u5e02 ","child":[{"id":"5723","name":"\u5e02\u533a"}]},{"id":"3692","name":"\u84ec\u83b1\u5e02 ","child":[{"id":"5721","name":"\u5e02\u4e2d\u5fc3"},{"id":"5722","name":"\u84ec\u83b1\u7ecf\u6d4e\u5f00\u53d1\u533a "}]},{"id":"3691","name":"\u83b1\u5dde\u5e02 ","child":[{"id":"5713","name":"\u83b1\u5dde\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5714","name":"\u864e\u5934\u5d16\u9547\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5715","name":"\u5927\u539f\u9547"},{"id":"5716","name":"\u7a0b\u90ed\u9547"},{"id":"5717","name":"\u5357\u5341\u91cc\u9547"},{"id":"5718","name":"\u83b1\u5dde\u9547"},{"id":"5719","name":"\u6c99\u6cb3\u9547"},{"id":"5720","name":"\u8def\u65fa\u9547"}]},{"id":"3690","name":"\u83b1\u9633\u5e02 ","child":[{"id":"5712","name":"\u7167\u65fa\u5e84\u9547"}]},{"id":"3689","name":"\u9f99\u53e3\u5e02 ","child":[{"id":"5709","name":"\u9f99\u53e3\u6e2f\u5f00\u53d1\u533a"},{"id":"5710","name":"\u6843\u6751\u9547"},{"id":"5711","name":"\u677e\u5c71\u9547"}]},{"id":"3688","name":"\u957f\u5c9b\u53bf "},{"id":"3687","name":"\u83b1\u5c71\u533a "},{"id":"3686","name":"\u725f\u5e73\u533a "},{"id":"3685","name":"\u798f\u5c71\u533a "},{"id":"5708","name":"\u70df\u53f0\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"}]},{"id":"176","name":"\u4e1c\u8425\u5e02","child":[{"id":"3679","name":"\u4e1c\u8425\u533a "},{"id":"3680","name":"\u6cb3\u53e3\u533a "},{"id":"3681","name":"\u57a6\u5229\u53bf ","child":[{"id":"5703","name":"\u53bf\u57ce"}]},{"id":"3682","name":"\u5229\u6d25\u53bf "},{"id":"3683","name":"\u5e7f\u9976\u53bf ","child":[{"id":"5704","name":"\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5705","name":"\u5927\u738b\u9547"},{"id":"5706","name":"\u7a3b\u5e84\u9547"}]},{"id":"5701","name":"\u897f\u57ce"},{"id":"5702","name":"\u4e1c\u57ce"}]},{"id":"175","name":"\u67a3\u5e84\u5e02","child":[{"id":"3673","name":"\u5e02\u4e2d\u533a "},{"id":"3674","name":"\u859b\u57ce\u533a "},{"id":"3675","name":"\u5cc4\u57ce\u533a "},{"id":"3676","name":"\u53f0\u513f\u5e84\u533a "},{"id":"3677","name":"\u5c71\u4ead\u533a "},{"id":"3678","name":"\u6ed5\u5dde\u5e02 "},{"id":"5700","name":"\u65b0\u57ce\u533a"}]},{"id":"174","name":"\u6dc4\u535a\u5e02","child":[{"id":"3665","name":"\u6dc4\u5ddd\u533a  "},{"id":"3666","name":"\u5f20\u5e97\u533a "},{"id":"3667","name":"\u535a\u5c71\u533a "},{"id":"3668","name":"\u4e34\u6dc4\u533a "},{"id":"3669","name":"\u5468\u6751\u533a "},{"id":"3670","name":"\u6853\u53f0\u53bf "},{"id":"3671","name":"\u9ad8\u9752\u53bf ","child":[{"id":"5698","name":"\u53bf\u57ce"},{"id":"5699","name":"\u9ad8\u57ce\u9547"}]},{"id":"3672","name":"\u6c82\u6e90\u53bf "}]},{"id":"173","name":"\u9752\u5c9b\u5e02","child":[{"id":"3652","name":"\u5e02\u5357\u533a "},{"id":"3663","name":"\u80f6\u5357\u5e02 ","child":[{"id":"5686","name":"\u5e02\u533a"},{"id":"5687","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5688","name":"\u9690\u73e0\u9547"},{"id":"5689","name":"\u738b\u53f0\u9547"},{"id":"5690","name":"\u7075\u5c71\u536b\u9547"},{"id":"5691","name":"\u79ef\u7c73\u5d16\u9547"},{"id":"5692","name":"\u94c1\u5c71\u9547"},{"id":"5693","name":"\u5927\u73e0\u5c71\u9547"}]},{"id":"3662","name":"\u5e73\u5ea6\u5e02 ","child":[{"id":"5679","name":"\u5e02\u533a"},{"id":"5680","name":"\u5e73\u5ea6\u5e02\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5681","name":"\u5357\u6751\u9547"},{"id":"5682","name":"\u65b0\u6cb3\u5de5\u4e1a\u56ed"},{"id":"5683","name":"\u7070\u57e0\u5de5\u4e1a\u56ed"},{"id":"5684","name":"\u957f\u4e50\u5de5\u4e1a\u56ed"},{"id":"5685","name":"\u5e97\u5b50\u5de5\u4e1a\u56ed"}]},{"id":"3661","name":"\u5373\u58a8\u5e02 ","child":[{"id":"5670","name":"\u5373\u58a8\u5e02\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5671","name":"\u84dd\uff08\u5170\uff09\u6751\u9547"},{"id":"5672","name":"\u9f99\u6cc9\u9547"},{"id":"5673","name":"\u5357\u6cc9\u9547"},{"id":"5674","name":"\u666e\u4e1c\u9547"},{"id":"5675","name":"\u6bb5\u6cca\u5c9a\u9547"},{"id":"5676","name":"\u534e\u5c71\u9547"},{"id":"5677","name":"\u7075\u5c71\u9547"},{"id":"5678","name":"\u5927\u4fe1\u9547"}]},{"id":"3660","name":"\u80f6\u5dde\u5e02 ","child":[{"id":"5657","name":"\u675c\u6751\u9547"},{"id":"5668","name":"\u6d0b\u6cb3\u9547"},{"id":"5667","name":"\u674e\u54e5\u5e84\u9547"},{"id":"5666","name":"\u80f6\u83b1\u9547"},{"id":"5665","name":"\u80f6\u5317\u9547"},{"id":"5664","name":"\u80f6\u897f\u9547"},{"id":"5663","name":"\u94fa\u96c6\u9547"},{"id":"5662","name":"\u80f6\u4e1c\u9547"},{"id":"5661","name":"\u9a6c\u5e97\u9547"},{"id":"5660","name":"\u4e5d\u9f99\u9547"},{"id":"5659","name":"\u8425\u6d77\u9547"},{"id":"5658","name":"\u5f20\u5e94\u9547"},{"id":"5669","name":"\u5e02\u533a"}]},{"id":"3659","name":"\u57ce\u9633\u533a  "},{"id":"3658","name":"\u674e\u6ca7\u533a "},{"id":"3656","name":"\u9ec4\u5c9b\u533a "},{"id":"3655","name":"\u56db\u65b9\u533a "},{"id":"3654","name":"\u5d02\u5c71\u533a "},{"id":"3653","name":"\u5e02\u5317\u533a  "},{"id":"3664","name":"\u83b1\u897f\u5e02 ","child":[{"id":"5694","name":"\u83b1\u897f\u7ecf\u6d4e\u5f00\u53d1\u533a"},{"id":"5695","name":"\u59dc\u5c71\u9547"},{"id":"5696","name":"\u674e\u6743\u5e84\u9547"},{"id":"5697","name":"\u5468\u683c\u5e84\u9547"}]}]},{"id":"188","name":"\u83cf\u6cfd\u5e02","child":[{"id":"3774","name":"\u7261\u4e39\u533a  "},{"id":"3775","name":"\u66f9\u53bf "},{"id":"3776","name":"\u5355\u53bf "},{"id":"3777","name":"\u6210\u6b66\u53bf "},{"id":"3778","name":"\u5de8\u91ce\u53bf "},{"id":"3779","name":"\u90d3\u57ce\u53bf "},{"id":"3780","name":"\u9104\u57ce\u53bf "},{"id":"3781","name":"\u5b9a\u9676\u53bf "},{"id":"3782","name":"\u4e1c\u660e\u53bf "}]}]},{"id":"17","name":"\u6cb3\u5357\u7701","child":[{"id":"189","name":"\u90d1\u5dde\u5e02","child":[{"id":"5851","name":"\u90d1\u4e1c\u65b0\u533a"},{"id":"5850","name":"\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a"},{"id":"5849","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"3786","name":"\u5de9\u4e49\u5e02 "},{"id":"3785","name":"\u4e2d\u725f\u53bf  ","child":[{"id":"5857","name":"\u57ce\u5173\u9547"},{"id":"5858","name":"\u4e5d\u9f99\u9547"}]},{"id":"3783","name":"\u60e0\u6d4e\u533a "},{"id":"3784","name":"\u767b\u5c01\u5e02 "},{"id":"1403","name":"\u65b0\u5bc6\u5e02","child":[{"id":"1405","name":"\u57ce\u5173\u9547"},{"id":"1406","name":"\u6765\u96c6\u9547"},{"id":"1407","name":"\u8d85\u5316\u9547"},{"id":"1408","name":"\u8881\u5e84\u4e61"}]},{"id":"1398","name":"\u8365\u9633\u5e02","child":[{"id":"5853","name":"\u8c6b\u9f99\u9547"},{"id":"5852","name":"\u8365\u9633\u4e94\u9f99\u5de5\u4e1a\u533a"},{"id":"5854","name":"\u4e54\u697c\u9547"},{"id":"5855","name":"\u738b\u6751\u9547"},{"id":"1399","name":"\u5e02\u4e2d\u5fc3"}]},{"id":"1391","name":"\u65b0\u90d1\u5e02","child":[{"id":"1392","name":"\u57ce\u5173\u4e61"},{"id":"1393","name":"\u673a\u573a\u6e2f\u533a"},{"id":"1394","name":"\u859b\u5e97\u9547"},{"id":"1395","name":"\u548c\u5e84\u9547"},{"id":"1396","name":"\u65b0\u6751\u9547"},{"id":"1397","name":"\u9f99\u6e56\u9547"}]},{"id":"1387","name":"\u4e0a\u8857\u533a"},{"id":"1386","name":"\u4e2d\u539f\u533a"},{"id":"1385","name":"\u4e8c\u4e03\u533a"},{"id":"788","name":"\u7ba1\u57ce\u56de\u65cf\u533a"},{"id":"787","name":"\u91d1\u6c34\u533a"}]},{"id":"205","name":"\u9a7b\u9a6c\u5e97\u5e02","child":[{"id":"5883","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a\uff08\u5357\u533a\uff09"},{"id":"5882","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a\uff08\u5317\u533a\uff09"},{"id":"3897","name":"\u65b0\u8521\u53bf "},{"id":"3896","name":"\u9042\u5e73\u53bf "},{"id":"3895","name":"\u6c5d\u5357\u53bf "},{"id":"3894","name":"\u6ccc\u9633\u53bf "},{"id":"3893","name":"\u786e\u5c71\u53bf "},{"id":"3892","name":"\u6b63\u9633\u53bf "},{"id":"3891","name":"\u5e73\u8206\u53bf "},{"id":"3889","name":"\u897f\u5e73\u53bf  "},{"id":"3890","name":"\u4e0a\u8521\u53bf "},{"id":"1542","name":"\u9a7f\u57ce\u533a"}]},{"id":"204","name":"\u5468\u53e3\u5e02","child":[{"id":"5881","name":"\u7ecf\u6d4e\u5f00\u53d1\u533a\u5317\u533a"},{"id":"3888","name":"\u9879\u57ce\u5e02 "},{"id":"3887","name":"\u9e7f\u9091\u53bf "},{"id":"3886","name":"\u592a\u5eb7\u53bf "},{"id":"3885","name":"\u6dee\u9633\u53bf "},{"id":"3884","name":"\u90f8\u57ce\u53bf "},{"id":"3883","name":"\u6c88\u4e18\u53bf  "},{"id":"3882","name":"\u5546\u6c34\u53bf "},{"id":"3880","name":"\u6276\u6c9f\u53bf "},{"id":"3881","name":"\u897f\u534e\u53bf "},{"id":"1409","name":"\u5ddd\u6c47\u533a"}]},{"id":"203","name":"\u4fe1\u9633\u5e02","child":[{"id":"3879","name":"\u606f\u53bf "},{"id":"3878","name":"\u6dee\u6ee8\u53bf "},{"id":"3877","name":"\u6f62\u5ddd\u53bf "},{"id":"3876","name":"\u56fa\u59cb\u53bf "},{"id":"3875","name":"\u5546\u57ce\u53bf "},{"id":"3874","name":"\u65b0\u53bf "},{"id":"3873","name":"\u5149\u5c71\u53bf "},{"id":"3872","name":"\u7f57\u5c71\u53bf "},{"id":"1413","name":"\u5e73\u6865\u533a"},{"id":"1412","name":"\u6d49\u6cb3\u533a"}]},{"id":"202","name":"\u5546\u4e18\u5e02","child":[{"id":"5880","name":"\u5546\u4e18\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"3871","name":"\u6c38\u57ce\u5e02 "},{"id":"3870","name":"\u590f\u9091\u53bf "},{"id":"3869","name":"\u865e\u57ce\u53bf "},{"id":"3868","name":"\u67d8\u57ce\u53bf "},{"id":"3867","name":"\u5b81\u9675\u53bf "},{"id":"3866","name":"\u7762\u53bf "},{"id":"3865","name":"\u6c11\u6743\u53bf "},{"id":"1417","name":"\u6881\u56ed\u533a"},{"id":"1416","name":"\u7762\u9633\u533a"}]},{"id":"201","name":"\u5357\u9633\u5e02","child":[{"id":"3855","name":"\u65b9\u57ce\u53bf "},{"id":"3864","name":"\u9093\u5dde\u5e02 "},{"id":"3863","name":"\u6850\u67cf\u53bf "},{"id":"3862","name":"\u65b0\u91ce\u53bf "},{"id":"3861","name":"\u5510\u6cb3\u53bf "},{"id":"3860","name":"\u793e\u65d7\u53bf "},{"id":"3859","name":"\u6dc5\u5ddd\u53bf "},{"id":"3858","name":"\u5185\u4e61\u53bf "},{"id":"3857","name":"\u9547\u5e73\u53bf "},{"id":"3856","name":"\u897f\u5ce1\u53bf  "},{"id":"3854","name":"\u5357\u53ec\u53bf "},{"id":"5879","name":"\u9ad8\u65b0\u533a"},{"id":"1423","name":"\u5367\u9f99\u533a"},{"id":"1422","name":"\u5b9b\u57ce\u533a"}]},{"id":"200","name":"\u4e09\u95e8\u5ce1\u5e02","child":[{"id":"3849","name":"\u6e11\u6c60\u53bf "},{"id":"3848","name":"\u6e56\u6ee8\u533a  "},{"id":"3850","name":"\u9655\u53bf "},{"id":"3851","name":"\u5362\u6c0f\u53bf "},{"id":"3852","name":"\u4e49\u9a6c\u5e02 "},{"id":"3853","name":"\u7075\u5b9d\u5e02 "}]},{"id":"199","name":"\u6f2f\u6cb3\u5e02","child":[{"id":"3847","name":"\u4e34\u988d\u53bf "},{"id":"3846","name":"\u821e\u9633\u53bf  "},{"id":"5878","name":"\u53cc\u9f99\u6587\u666f\u5f00\u53d1\u533a"},{"id":"5877","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5876","name":"\u53cc\u6c47\u5de5\u4e1a\u533a"},{"id":"1426","name":"\u6e90\u6c47\u533a"},{"id":"1429","name":"\u90fe\u57ce\u533a"},{"id":"1432","name":"\u53ec\u9675\u533a"}]},{"id":"198","name":"\u8bb8\u660c\u5e02","child":[{"id":"3845","name":"\u8944\u57ce\u53bf "},{"id":"3844","name":"\u9122\u9675\u53bf "},{"id":"1435","name":"\u9b4f\u90fd\u533a"},{"id":"1437","name":"\u8bb8\u660c\u53bf","child":[{"id":"1438","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1439","name":"\u534a\u622a\u6cb3\u4e61"},{"id":"1440","name":"\u67aa\u6746\u5218\u9547"},{"id":"1441","name":"\u5c06\u5b98\u6c60\u9547"},{"id":"1442","name":"\u5c1a\u96c6\u9547"},{"id":"1443","name":"\u9093\u5e84\u4e61"},{"id":"1444","name":"\u848b\u674e\u96c6\u9547"},{"id":"1445","name":"\u4e03\u91cc\u5e97\u4e61"}]},{"id":"1446","name":"\u957f\u845b\u5e02","child":[{"id":"1447","name":"\u5e02\u533a"},{"id":"1448","name":"\u548c\u5c1a\u6865\u9547"},{"id":"1449","name":"\u79d1\u6280\u5de5\u4e1a\u56ed\u533a"},{"id":"1450","name":"\u9ec4\u6cb3\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"1451","name":"\u57ce\u4e1c\u5f00\u53d1\u533a"},{"id":"1452","name":"\u540e\u6cb3\u9547"},{"id":"1453","name":"\u589e\u798f\u4e61"},{"id":"1454","name":"\u5927\u5468\u9547"},{"id":"1455","name":"\u8001\u57ce\u9547"}]},{"id":"1456","name":"\u79b9\u5dde\u5e02","child":[{"id":"1457","name":"\u5e02\u533a"},{"id":"1458","name":"\u891a\u6cb3\u9547"}]}]},{"id":"197","name":"\u6fee\u9633\u5e02","child":[{"id":"3839","name":"\u6e05\u4e30\u53bf "},{"id":"3840","name":"\u5357\u4e50\u53bf "},{"id":"3841","name":"\u8303\u53bf "},{"id":"3842","name":"\u53f0\u524d\u53bf "},{"id":"3843","name":"\u6fee\u9633\u53bf "},{"id":"5872","name":"\u9ad8\u65b0\u6280\u672f\u4ea7\u4e1a\u5f00\u53d1\u533a"},{"id":"1459","name":"\u534e\u9f99\u533a"}]},{"id":"196","name":"\u5b89\u9633\u5e02","child":[{"id":"3836","name":"\u6ed1\u53bf "},{"id":"3838","name":"\u6797\u5dde\u5e02 "},{"id":"3837","name":"\u5185\u9ec4\u53bf "},{"id":"3835","name":"\u6c64\u9634\u53bf "},{"id":"5871","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"1465","name":"\u9f99\u5b89\u533a"},{"id":"1464","name":"\u6587\u5cf0\u533a"},{"id":"1467","name":"\u5b89\u9633\u53bf","child":[{"id":"1468","name":"\u53bf\u57ce\u4e2d\u5fc3"},{"id":"1469","name":"\u67cf\u5e84\u9547"},{"id":"1470","name":"\u5317\u8499\u5de5\u4e1a\u533a"}]},{"id":"1463","name":"\u5317\u5173\u533a"},{"id":"1462","name":"\u6bb7\u90fd\u533a"}]},{"id":"195","name":"\u65b0\u4e61\u5e02","child":[{"id":"3824","name":"\u7ea2\u65d7\u533a "},{"id":"5863","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"3834","name":"\u8f89\u53bf\u5e02 ","child":[{"id":"5865","name":"\u5b5f\u5e84\u9547"},{"id":"5870","name":"\u5e02\u57ce\u533a"},{"id":"5867","name":"\u767e\u6cc9\u9547"},{"id":"5868","name":"\u80e1\u6865\u9547"},{"id":"5869","name":"\u957f\u6625\u9547"}]},{"id":"3832","name":"\u957f\u57a3\u53bf "},{"id":"3831","name":"\u5c01\u4e18\u53bf "},{"id":"3830","name":"\u5ef6\u6d25\u53bf "},{"id":"3829","name":"\u539f\u9633\u53bf "},{"id":"3828","name":"\u83b7\u5609\u53bf "},{"id":"3827","name":"\u7267\u91ce\u533a "},{"id":"3826","name":"\u51e4\u6cc9\u533a "},{"id":"3825","name":"\u536b\u6ee8\u533a  "},{"id":"5864","name":"\u5c0f\u5e97\u5de5\u4e1a\u533a"},{"id":"1481","name":"\u65b0\u4e61\u53bf","child":[{"id":"1483","name":"\u5c0f\u5180\u9547"}]},{"id":"1484","name":"\u536b\u8f89\u5e02","child":[{"id":"1485","name":"\u53ca\u6c34\u9547"},{"id":"1486","name":"\u5510\u5e84\u9547"},{"id":"1487","name":"\u540e\u6cb3\u9547"},{"id":"1488","name":"\u5f20\u6b66\u5e97"},{"id":"1489","name":"\u9ec4\u571f\u5c97"}]}]},{"id":"194","name":"\u9e64\u58c1\u5e02","child":[{"id":"3823","name":"\u6dc7\u53bf "},{"id":"3819","name":"\u9e64\u5c71\u533a "},{"id":"3822","name":"\u6d5a\u53bf "},{"id":"5862","name":"\u91d1\u5c71\u5de5\u4e1a\u533a"},{"id":"1495","name":"\u6dc7\u6ee8\u533a"},{"id":"1497","name":"\u5c71\u57ce\u533a"}]},{"id":"193","name":"\u7126\u4f5c\u5e02","child":[{"id":"3818","name":"\u5b5f\u5dde\u5e02 "},{"id":"3817","name":"\u6c81\u9633\u5e02 "},{"id":"3816","name":"\u6e29\u53bf "},{"id":"3815","name":"\u6b66\u965f\u53bf "},{"id":"3814","name":"\u535a\u7231\u53bf "},{"id":"3813","name":"\u4fee\u6b66\u53bf  "},{"id":"1502","name":"\u9a6c\u6751\u533a"},{"id":"1501","name":"\u4e2d\u7ad9\u533a"},{"id":"1500","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"1499","name":"\u5c71\u9633\u533a"},{"id":"1498","name":"\u89e3\u653e\u533a"}]},{"id":"192","name":"\u5e73\u9876\u5c71\u5e02","child":[{"id":"3812","name":"\u6c5d\u5dde\u5e02 "},{"id":"3811","name":"\u821e\u94a2\u5e02 "},{"id":"3810","name":"\u90cf\u53bf "},{"id":"3809","name":"\u9c81\u5c71\u53bf "},{"id":"3808","name":"\u53f6\u53bf "},{"id":"3807","name":"\u5b9d\u4e30\u53bf "},{"id":"5861","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"3806","name":"\u77f3\u9f99\u533a "},{"id":"1506","name":"\u536b\u4e1c\u533a"},{"id":"1505","name":"\u6e5b\u6cb3\u533a"},{"id":"1503","name":"\u65b0\u534e\u533a"}]},{"id":"191","name":"\u6d1b\u9633\u5e02","child":[{"id":"5860","name":"\u7ecf\u6d4e\u6280\u672f\u5f00\u53d1\u533a"},{"id":"5859","name":"\u9ad8\u65b0\u6280\u672f\u5f00\u53d1\u533a"},{"id":"3805","name":"\u4f0a\u5ddd\u53bf "},{"id":"3804","name":"\u6d1b\u5b81\u53bf "},{"id":"3803","name":"\u6c5d\u9633\u53bf "},{"id":"3802","name":"\u5d69\u53bf "},{"id":"3801","name":"\u683e\u5ddd\u53bf "},{"id":"3800","name":"\u5b5f\u6d25\u53bf  "},{"id":"3799","name":"\u6d1b\u9f99\u533a "},{"id":"3798","name":"\u5409\u5229\u533a "},{"id":"3797","name":"\u6da7\u897f\u533a "},{"id":"3796","name":"\u897f\u5de5\u533a "},{"id":"3795","name":"\u8001\u57ce\u533a  "},{"id":"1864","name":"\u700d\u6cb3\u56de\u65cf\u533a"},{"id":"1526","name":"\u5b9c\u9633\u53bf","child":[{"id":"1527","name":"\u767d\u6751\u5de5\u4e1a\u56ed"}]},{"id":"1517","name":"\u5043\u5e08\u5e02","child":[{"id":"1519","name":"\u57ce\u5173\u9547"},{"id":"1520","name":"\u5cb3\u6f6d\u9547"},{"id":"1521","name":"\u9996\u9633\u5c71\u9547"},{"id":"1522","name":"\u9099\u5cad\u4e61"},{"id":"1523","name":"\u5316\u4e61"},{"id":"1524","name":"\u8bf8\u845b\u9547"},{"id":"1525","name":"\u7fdf\u9547\u9547"}]},{"id":"1515","name":"\u65b0\u5b89\u53bf","child":[{"id":"1516","name":"\u6d1b\u65b0\u5de5\u4e1a\u533a"}]}]},{"id":"190","name":"\u5f00\u5c01\u5e02","child":[{"id":"3788","name":"\u987a\u6cb3\u56de\u65cf\u533a "},{"id":"3793","name":"\u5170\u8003\u53bf"},{"id":"3792","name":"\u675e\u53bf "},{"id":"3791","name":"\u91d1\u660e\u533a "},{"id":"3790","name":"\u79b9\u738b\u53f0\u533a "},{"id":"3789","name":"\u9f13\u697c\u533a "},{"id":"3787","name":"\u9f99\u4ead\u533a  "},{"id":"3794","name":"\u901a\u8bb8\u53bf "},{"id":"1536","name":"\u5c09\u6c0f\u53bf","child":[{"id":"1537","name":"\u57ce\u5173\u9547"},{"id":"1538","name":"\u5f20\u5e02\u9547"}]},{"id":"1534","name":"\u5f00\u5c01\u53bf","child":[{"id":"5856","name":"\u9ec4\u9f99\u5de5\u4e1a\u533a"},{"id":"1535","name":"\u53bf\u57ce\u4e2d\u5fc3"}]}]},{"id":"2045","name":"\u6d4e\u6e90\u5e02","child":[{"id":"5884","name":"\u5e02\u533a"}]}]},{"id":"2046","name":"\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a","child":[{"id":"5935","name":"\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a "}]}];


var LAreaData = [{ "id": "510000", "name": "四川省", "child": [{ "id": "510100", "name": "成都市", "child": [{ "id": "510104", "name": "锦江区" }, { "id": "510105", "name": "青羊区" }, { "id": "510106", "name": "金牛区" }, { "id": "510107", "name": "武侯区" }, { "id": "510108", "name": "成华区" }, { "id": "510112", "name": "龙泉驿区" }, { "id": "510113", "name": "青白江区" }, { "id": "510114", "name": "新都区" }, { "id": "510115", "name": "温江区" }, { "id": "510116", "name": "双流区" }, { "id": "510117", "name": "郫都区" }, { "id": "510121", "name": "金堂县" }, { "id": "510129", "name": "大邑县" }, { "id": "510131", "name": "蒲江县" }, { "id": "510132", "name": "新津县" }, { "id": "510181", "name": "都江堰市" }, { "id": "510182", "name": "彭州市" }, { "id": "510183", "name": "邛崃市" }, { "id": "510184", "name": "崇州市" }, { "id": "510185", "name": "简阳市" }] }, { "id": "510300", "name": "自贡市", "child": [{ "id": "510302", "name": "自流井区" }, { "id": "510303", "name": "贡井区" }, { "id": "510304", "name": "大安区" }, { "id": "510311", "name": "沿滩区" }, { "id": "510321", "name": "荣县" }, { "id": "510322", "name": "富顺县" }] }, { "id": "510400", "name": "攀枝花市", "child": [{ "id": "510402", "name": "东区" }, { "id": "510403", "name": "西区" }, { "id": "510411", "name": "仁和区" }, { "id": "510421", "name": "米易县" }, { "id": "510422", "name": "盐边县" }] }, { "id": "510500", "name": "泸州市", "child": [{ "id": "510502", "name": "江阳区" }, { "id": "510503", "name": "纳溪区" }, { "id": "510504", "name": "龙马潭区" }, { "id": "510521", "name": "泸县" }, { "id": "510522", "name": "合江县" }, { "id": "510524", "name": "叙永县" }, { "id": "510525", "name": "古蔺县" }] }, { "id": "510600", "name": "德阳市", "child": [{ "id": "510603", "name": "旌阳区" }, { "id": "510604", "name": "罗江区" }, { "id": "510623", "name": "中江县" }, { "id": "510681", "name": "广汉市" }, { "id": "510682", "name": "什邡市" }, { "id": "510683", "name": "绵竹市" }] }, { "id": "510700", "name": "绵阳市", "child": [{ "id": "510703", "name": "涪城区" }, { "id": "510704", "name": "游仙区" }, { "id": "510705", "name": "安州区" }, { "id": "510722", "name": "三台县" }, { "id": "510723", "name": "盐亭县" }, { "id": "510725", "name": "梓潼县" }, { "id": "510726", "name": "北川羌族自治县" }, { "id": "510727", "name": "平武县" }, { "id": "510781", "name": "江油市" }] }, { "id": "510800", "name": "广元市", "child": [{ "id": "510802", "name": "利州区" }, { "id": "510811", "name": "昭化区" }, { "id": "510812", "name": "朝天区" }, { "id": "510821", "name": "旺苍县" }, { "id": "510822", "name": "青川县" }, { "id": "510823", "name": "剑阁县" }, { "id": "510824", "name": "苍溪县" }] }, { "id": "510900", "name": "遂宁市", "child": [{ "id": "510903", "name": "船山区" }, { "id": "510904", "name": "安居区" }, { "id": "510921", "name": "蓬溪县" }, { "id": "510922", "name": "射洪县" }, { "id": "510923", "name": "大英县" }] }, { "id": "511000", "name": "内江市", "child": [{ "id": "511002", "name": "市中区" }, { "id": "511011", "name": "东兴区" }, { "id": "511024", "name": "威远县" }, { "id": "511025", "name": "资中县" }, { "id": "511083", "name": "隆昌市" }] }, { "id": "511100", "name": "乐山市", "child": [{ "id": "511102", "name": "市中区" }, { "id": "511111", "name": "沙湾区" }, { "id": "511112", "name": "五通桥区" }, { "id": "511113", "name": "金口河区" }, { "id": "511123", "name": "犍为县" }, { "id": "511124", "name": "井研县" }, { "id": "511126", "name": "夹江县" }, { "id": "511129", "name": "沐川县" }, { "id": "511132", "name": "峨边彝族自治县" }, { "id": "511133", "name": "马边彝族自治县" }, { "id": "511181", "name": "峨眉山市" }] }, { "id": "511300", "name": "南充市", "child": [{ "id": "511302", "name": "顺庆区" }, { "id": "511303", "name": "高坪区" }, { "id": "511304", "name": "嘉陵区" }, { "id": "511321", "name": "南部县" }, { "id": "511322", "name": "营山县" }, { "id": "511323", "name": "蓬安县" }, { "id": "511324", "name": "仪陇县" }, { "id": "511325", "name": "西充县" }, { "id": "511381", "name": "阆中市" }] }, { "id": "511400", "name": "眉山市", "child": [{ "id": "511402", "name": "东坡区" }, { "id": "511403", "name": "彭山区" }, { "id": "511421", "name": "仁寿县" }, { "id": "511423", "name": "洪雅县" }, { "id": "511424", "name": "丹棱县" }, { "id": "511425", "name": "青神县" }] }, { "id": "511500", "name": "宜宾市", "child": [{ "id": "511502", "name": "翠屏区" }, { "id": "511503", "name": "南溪区" }, { "id": "511521", "name": "宜宾县" }, { "id": "511523", "name": "江安县" }, { "id": "511524", "name": "长宁县" }, { "id": "511525", "name": "高县" }, { "id": "511526", "name": "珙县" }, { "id": "511527", "name": "筠连县" }, { "id": "511528", "name": "兴文县" }, { "id": "511529", "name": "屏山县" }] }, { "id": "511600", "name": "广安市", "child": [{ "id": "511602", "name": "广安区" }, { "id": "511603", "name": "前锋区" }, { "id": "511621", "name": "岳池县" }, { "id": "511622", "name": "武胜县" }, { "id": "511623", "name": "邻水县" }, { "id": "511681", "name": "华蓥市" }] }, { "id": "511700", "name": "达州市", "child": [{ "id": "511702", "name": "通川区" }, { "id": "511703", "name": "达川区" }, { "id": "511722", "name": "宣汉县" }, { "id": "511723", "name": "开江县" }, { "id": "511724", "name": "大竹县" }, { "id": "511725", "name": "渠县" }, { "id": "511781", "name": "万源市" }] }, { "id": "511800", "name": "雅安市", "child": [{ "id": "511802", "name": "雨城区" }, { "id": "511803", "name": "名山区" }, { "id": "511822", "name": "荥经县" }, { "id": "511823", "name": "汉源县" }, { "id": "511824", "name": "石棉县" }, { "id": "511825", "name": "天全县" }, { "id": "511826", "name": "芦山县" }, { "id": "511827", "name": "宝兴县" }] }, { "id": "511900", "name": "巴中市", "child": [{ "id": "511902", "name": "巴州区" }, { "id": "511903", "name": "恩阳区" }, { "id": "511921", "name": "通江县" }, { "id": "511922", "name": "南江县" }, { "id": "511923", "name": "平昌县" }] }, { "id": "512000", "name": "资阳市", "child": [{ "id": "512002", "name": "雁江区" }, { "id": "512021", "name": "安岳县" }, { "id": "512022", "name": "乐至县" }] }, { "id": "513200", "name": "阿坝藏族羌族自治州", "child": [{ "id": "513201", "name": "马尔康市" }, { "id": "513221", "name": "汶川县" }, { "id": "513222", "name": "理县" }, { "id": "513223", "name": "茂县" }, { "id": "513224", "name": "松潘县" }, { "id": "513225", "name": "九寨沟县" }, { "id": "513226", "name": "金川县" }, { "id": "513227", "name": "小金县" }, { "id": "513228", "name": "黑水县" }, { "id": "513230", "name": "壤塘县" }, { "id": "513231", "name": "阿坝县" }, { "id": "513232", "name": "若尔盖县" }, { "id": "513233", "name": "红原县" }] }, { "id": "513300", "name": "甘孜藏族自治州", "child": [{ "id": "513301", "name": "康定市" }, { "id": "513322", "name": "泸定县" }, { "id": "513323", "name": "丹巴县" }, { "id": "513324", "name": "九龙县" }, { "id": "513325", "name": "雅江县" }, { "id": "513326", "name": "道孚县" }, { "id": "513327", "name": "炉霍县" }, { "id": "513328", "name": "甘孜县" }, { "id": "513329", "name": "新龙县" }, { "id": "513330", "name": "德格县" }, { "id": "513331", "name": "白玉县" }, { "id": "513332", "name": "石渠县" }, { "id": "513333", "name": "色达县" }, { "id": "513334", "name": "理塘县" }, { "id": "513335", "name": "巴塘县" }, { "id": "513336", "name": "乡城县" }, { "id": "513337", "name": "稻城县" }, { "id": "513338", "name": "得荣县" }] }, { "id": "513400", "name": "凉山彝族自治州", "child": [{ "id": "513401", "name": "西昌市" }, { "id": "513422", "name": "木里藏族自治县" }, { "id": "513423", "name": "盐源县" }, { "id": "513424", "name": "德昌县" }, { "id": "513425", "name": "会理县" }, { "id": "513426", "name": "会东县" }, { "id": "513427", "name": "宁南县" }, { "id": "513428", "name": "普格县" }, { "id": "513429", "name": "布拖县" }, { "id": "513430", "name": "金阳县" }, { "id": "513431", "name": "昭觉县" }, { "id": "513432", "name": "喜德县" }, { "id": "513433", "name": "冕宁县" }, { "id": "513434", "name": "越西县" }, { "id": "513435", "name": "甘洛县" }, { "id": "513436", "name": "美姑县" }, { "id": "513437", "name": "雷波县" }] }] }, { "id": "110000", "name": "北京市", "child": [{ "id": "110000", "name": "北京市", "child": [{ "id": "110101", "name": "东城区" }, { "id": "110102", "name": "西城区" }, { "id": "110105", "name": "朝阳区" }, { "id": "110106", "name": "丰台区" }, { "id": "110107", "name": "石景山区" }, { "id": "110108", "name": "海淀区" }, { "id": "110109", "name": "门头沟区" }, { "id": "110111", "name": "房山区" }, { "id": "110112", "name": "通州区" }, { "id": "110113", "name": "顺义区" }, { "id": "110114", "name": "昌平区" }, { "id": "110115", "name": "大兴区" }, { "id": "110116", "name": "怀柔区" }, { "id": "110117", "name": "平谷区" }, { "id": "110118", "name": "密云区" }, { "id": "110119", "name": "延庆区" }] }] }, { "id": "120000", "name": "天津市", "child": [{ "id": "120000", "name": "天津市", "child": [{ "id": "120101", "name": "和平区" }, { "id": "120102", "name": "河东区" }, { "id": "120103", "name": "河西区" }, { "id": "120104", "name": "南开区" }, { "id": "120105", "name": "河北区" }, { "id": "120106", "name": "红桥区" }, { "id": "120110", "name": "东丽区" }, { "id": "120111", "name": "西青区" }, { "id": "120112", "name": "津南区" }, { "id": "120113", "name": "北辰区" }, { "id": "120114", "name": "武清区" }, { "id": "120115", "name": "宝坻区" }, { "id": "120116", "name": "滨海新区" }, { "id": "120117", "name": "宁河区" }, { "id": "120118", "name": "静海区" }, { "id": "120119", "name": "蓟州区" }] }] }, { "id": "130000", "name": "河北省", "child": [{ "id": "130100", "name": "石家庄市", "child": [{ "id": "130102", "name": "长安区" }, { "id": "130104", "name": "桥西区" }, { "id": "130105", "name": "新华区" }, { "id": "130107", "name": "井陉矿区" }, { "id": "130108", "name": "裕华区" }, { "id": "130109", "name": "藁城区" }, { "id": "130110", "name": "鹿泉区" }, { "id": "130111", "name": "栾城区" }, { "id": "130121", "name": "井陉县" }, { "id": "130123", "name": "正定县" }, { "id": "130125", "name": "行唐县" }, { "id": "130126", "name": "灵寿县" }, { "id": "130127", "name": "高邑县" }, { "id": "130128", "name": "深泽县" }, { "id": "130129", "name": "赞皇县" }, { "id": "130130", "name": "无极县" }, { "id": "130131", "name": "平山县" }, { "id": "130132", "name": "元氏县" }, { "id": "130133", "name": "赵县" }, { "id": "130181", "name": "辛集市" }, { "id": "130183", "name": "晋州市" }, { "id": "130184", "name": "新乐市" }] }, { "id": "130200", "name": "唐山市", "child": [{ "id": "130202", "name": "路南区" }, { "id": "130203", "name": "路北区" }, { "id": "130204", "name": "古冶区" }, { "id": "130205", "name": "开平区" }, { "id": "130207", "name": "丰南区" }, { "id": "130208", "name": "丰润区" }, { "id": "130209", "name": "曹妃甸区" }, { "id": "130223", "name": "滦县" }, { "id": "130224", "name": "滦南县" }, { "id": "130225", "name": "乐亭县" }, { "id": "130227", "name": "迁西县" }, { "id": "130229", "name": "玉田县" }, { "id": "130281", "name": "遵化市" }, { "id": "130283", "name": "迁安市" }] }, { "id": "130300", "name": "秦皇岛市", "child": [{ "id": "130302", "name": "海港区" }, { "id": "130303", "name": "山海关区" }, { "id": "130304", "name": "北戴河区" }, { "id": "130306", "name": "抚宁区" }, { "id": "130321", "name": "青龙满族自治县" }, { "id": "130322", "name": "昌黎县" }, { "id": "130324", "name": "卢龙县" }] }, { "id": "130400", "name": "邯郸市", "child": [{ "id": "130402", "name": "邯山区" }, { "id": "130403", "name": "丛台区" }, { "id": "130404", "name": "复兴区" }, { "id": "130406", "name": "峰峰矿区" }, { "id": "130407", "name": "肥乡区" }, { "id": "130408", "name": "永年区" }, { "id": "130423", "name": "临漳县" }, { "id": "130424", "name": "成安县" }, { "id": "130425", "name": "大名县" }, { "id": "130426", "name": "涉县" }, { "id": "130427", "name": "磁县" }, { "id": "130430", "name": "邱县" }, { "id": "130431", "name": "鸡泽县" }, { "id": "130432", "name": "广平县" }, { "id": "130433", "name": "馆陶县" }, { "id": "130434", "name": "魏县" }, { "id": "130435", "name": "曲周县" }, { "id": "130481", "name": "武安市" }] }, { "id": "130500", "name": "邢台市", "child": [{ "id": "130502", "name": "桥东区" }, { "id": "130503", "name": "桥西区" }, { "id": "130521", "name": "邢台县" }, { "id": "130522", "name": "临城县" }, { "id": "130523", "name": "内丘县" }, { "id": "130524", "name": "柏乡县" }, { "id": "130525", "name": "隆尧县" }, { "id": "130526", "name": "任县" }, { "id": "130527", "name": "南和县" }, { "id": "130528", "name": "宁晋县" }, { "id": "130529", "name": "巨鹿县" }, { "id": "130530", "name": "新河县" }, { "id": "130531", "name": "广宗县" }, { "id": "130532", "name": "平乡县" }, { "id": "130533", "name": "威县" }, { "id": "130534", "name": "清河县" }, { "id": "130535", "name": "临西县" }, { "id": "130581", "name": "南宫市" }, { "id": "130582", "name": "沙河市" }] }, { "id": "130600", "name": "保定市", "child": [{ "id": "130602", "name": "竞秀区" }, { "id": "130606", "name": "莲池区" }, { "id": "130607", "name": "满城区" }, { "id": "130608", "name": "清苑区" }, { "id": "130609", "name": "徐水区" }, { "id": "130623", "name": "涞水县" }, { "id": "130624", "name": "阜平县" }, { "id": "130626", "name": "定兴县" }, { "id": "130627", "name": "唐县" }, { "id": "130628", "name": "高阳县" }, { "id": "130629", "name": "容城县" }, { "id": "130630", "name": "涞源县" }, { "id": "130631", "name": "望都县" }, { "id": "130632", "name": "安新县" }, { "id": "130633", "name": "易县" }, { "id": "130634", "name": "曲阳县" }, { "id": "130635", "name": "蠡县" }, { "id": "130636", "name": "顺平县" }, { "id": "130637", "name": "博野县" }, { "id": "130638", "name": "雄县" }, { "id": "130681", "name": "涿州市" }, { "id": "130682", "name": "定州市" }, { "id": "130683", "name": "安国市" }, { "id": "130684", "name": "高碑店市" }] }, { "id": "130700", "name": "张家口市", "child": [{ "id": "130702", "name": "桥东区" }, { "id": "130703", "name": "桥西区" }, { "id": "130705", "name": "宣化区" }, { "id": "130706", "name": "下花园区" }, { "id": "130708", "name": "万全区" }, { "id": "130709", "name": "崇礼区" }, { "id": "130722", "name": "张北县" }, { "id": "130723", "name": "康保县" }, { "id": "130724", "name": "沽源县" }, { "id": "130725", "name": "尚义县" }, { "id": "130726", "name": "蔚县" }, { "id": "130727", "name": "阳原县" }, { "id": "130728", "name": "怀安县" }, { "id": "130730", "name": "怀来县" }, { "id": "130731", "name": "涿鹿县" }, { "id": "130732", "name": "赤城县" }] }, { "id": "130800", "name": "承德市", "child": [{ "id": "130802", "name": "双桥区" }, { "id": "130803", "name": "双滦区" }, { "id": "130804", "name": "鹰手营子矿区" }, { "id": "130821", "name": "承德县" }, { "id": "130822", "name": "兴隆县" }, { "id": "130824", "name": "滦平县" }, { "id": "130825", "name": "隆化县" }, { "id": "130826", "name": "丰宁满族自治县" }, { "id": "130827", "name": "宽城满族自治县" }, { "id": "130828", "name": "围场满族蒙古族自治县" }, { "id": "130881", "name": "平泉市" }] }, { "id": "130900", "name": "沧州市", "child": [{ "id": "130902", "name": "新华区" }, { "id": "130903", "name": "运河区" }, { "id": "130921", "name": "沧县" }, { "id": "130922", "name": "青县" }, { "id": "130923", "name": "东光县" }, { "id": "130924", "name": "海兴县" }, { "id": "130925", "name": "盐山县" }, { "id": "130926", "name": "肃宁县" }, { "id": "130927", "name": "南皮县" }, { "id": "130928", "name": "吴桥县" }, { "id": "130929", "name": "献县" }, { "id": "130930", "name": "孟村回族自治县" }, { "id": "130981", "name": "泊头市" }, { "id": "130982", "name": "任丘市" }, { "id": "130983", "name": "黄骅市" }, { "id": "130984", "name": "河间市" }] }, { "id": "131000", "name": "廊坊市", "child": [{ "id": "131002", "name": "安次区" }, { "id": "131003", "name": "广阳区" }, { "id": "131022", "name": "固安县" }, { "id": "131023", "name": "永清县" }, { "id": "131024", "name": "香河县" }, { "id": "131025", "name": "大城县" }, { "id": "131026", "name": "文安县" }, { "id": "131028", "name": "大厂回族自治县" }, { "id": "131081", "name": "霸州市" }, { "id": "131082", "name": "三河市" }] }, { "id": "131100", "name": "衡水市", "child": [{ "id": "131102", "name": "桃城区" }, { "id": "131103", "name": "冀州区" }, { "id": "131121", "name": "枣强县" }, { "id": "131122", "name": "武邑县" }, { "id": "131123", "name": "武强县" }, { "id": "131124", "name": "饶阳县" }, { "id": "131125", "name": "安平县" }, { "id": "131126", "name": "故城县" }, { "id": "131127", "name": "景县" }, { "id": "131128", "name": "阜城县" }, { "id": "131182", "name": "深州市" }] }] }, { "id": "140000", "name": "山西省", "child": [{ "id": "140100", "name": "太原市", "child": [{ "id": "140105", "name": "小店区" }, { "id": "140106", "name": "迎泽区" }, { "id": "140107", "name": "杏花岭区" }, { "id": "140108", "name": "尖草坪区" }, { "id": "140109", "name": "万柏林区" }, { "id": "140110", "name": "晋源区" }, { "id": "140121", "name": "清徐县" }, { "id": "140122", "name": "阳曲县" }, { "id": "140123", "name": "娄烦县" }, { "id": "140181", "name": "古交市" }] }, { "id": "140200", "name": "大同市", "child": [{ "id": "140212", "name": "新荣区" }, { "id": "140213", "name": "平城区" }, { "id": "140214", "name": "云冈区" }, { "id": "140215", "name": "云州区" }, { "id": "140221", "name": "阳高县" }, { "id": "140222", "name": "天镇县" }, { "id": "140223", "name": "广灵县" }, { "id": "140224", "name": "灵丘县" }, { "id": "140225", "name": "浑源县" }, { "id": "140226", "name": "左云县" }] }, { "id": "140300", "name": "阳泉市", "child": [{ "id": "140302", "name": "城区" }, { "id": "140303", "name": "矿区" }, { "id": "140311", "name": "郊区" }, { "id": "140321", "name": "平定县" }, { "id": "140322", "name": "盂县" }] }, { "id": "140400", "name": "长治市", "child": [{ "id": "140402", "name": "城区" }, { "id": "140411", "name": "郊区" }, { "id": "140421", "name": "长治县" }, { "id": "140423", "name": "襄垣县" }, { "id": "140424", "name": "屯留县" }, { "id": "140425", "name": "平顺县" }, { "id": "140426", "name": "黎城县" }, { "id": "140427", "name": "壶关县" }, { "id": "140428", "name": "长子县" }, { "id": "140429", "name": "武乡县" }, { "id": "140430", "name": "沁县" }, { "id": "140431", "name": "沁源县" }, { "id": "140481", "name": "潞城市" }] }, { "id": "140500", "name": "晋城市", "child": [{ "id": "140502", "name": "城区" }, { "id": "140521", "name": "沁水县" }, { "id": "140522", "name": "阳城县" }, { "id": "140524", "name": "陵川县" }, { "id": "140525", "name": "泽州县" }, { "id": "140581", "name": "高平市" }] }, { "id": "140600", "name": "朔州市", "child": [{ "id": "140602", "name": "朔城区" }, { "id": "140603", "name": "平鲁区" }, { "id": "140621", "name": "山阴县" }, { "id": "140622", "name": "应县" }, { "id": "140623", "name": "右玉县" }, { "id": "140681", "name": "怀仁市" }] }, { "id": "140700", "name": "晋中市", "child": [{ "id": "140702", "name": "榆次区" }, { "id": "140721", "name": "榆社县" }, { "id": "140722", "name": "左权县" }, { "id": "140723", "name": "和顺县" }, { "id": "140724", "name": "昔阳县" }, { "id": "140725", "name": "寿阳县" }, { "id": "140726", "name": "太谷县" }, { "id": "140727", "name": "祁县" }, { "id": "140728", "name": "平遥县" }, { "id": "140729", "name": "灵石县" }, { "id": "140781", "name": "介休市" }] }, { "id": "140800", "name": "运城市", "child": [{ "id": "140802", "name": "盐湖区" }, { "id": "140821", "name": "临猗县" }, { "id": "140822", "name": "万荣县" }, { "id": "140823", "name": "闻喜县" }, { "id": "140824", "name": "稷山县" }, { "id": "140825", "name": "新绛县" }, { "id": "140826", "name": "绛县" }, { "id": "140827", "name": "垣曲县" }, { "id": "140828", "name": "夏县" }, { "id": "140829", "name": "平陆县" }, { "id": "140830", "name": "芮城县" }, { "id": "140881", "name": "永济市" }, { "id": "140882", "name": "河津市" }] }, { "id": "140900", "name": "忻州市", "child": [{ "id": "140902", "name": "忻府区" }, { "id": "140921", "name": "定襄县" }, { "id": "140922", "name": "五台县" }, { "id": "140923", "name": "代县" }, { "id": "140924", "name": "繁峙县" }, { "id": "140925", "name": "宁武县" }, { "id": "140926", "name": "静乐县" }, { "id": "140927", "name": "神池县" }, { "id": "140928", "name": "五寨县" }, { "id": "140929", "name": "岢岚县" }, { "id": "140930", "name": "河曲县" }, { "id": "140931", "name": "保德县" }, { "id": "140932", "name": "偏关县" }, { "id": "140981", "name": "原平市" }] }, { "id": "141000", "name": "临汾市", "child": [{ "id": "141002", "name": "尧都区" }, { "id": "141021", "name": "曲沃县" }, { "id": "141022", "name": "翼城县" }, { "id": "141023", "name": "襄汾县" }, { "id": "141024", "name": "洪洞县" }, { "id": "141025", "name": "古县" }, { "id": "141026", "name": "安泽县" }, { "id": "141027", "name": "浮山县" }, { "id": "141028", "name": "吉县" }, { "id": "141029", "name": "乡宁县" }, { "id": "141030", "name": "大宁县" }, { "id": "141031", "name": "隰县" }, { "id": "141032", "name": "永和县" }, { "id": "141033", "name": "蒲县" }, { "id": "141034", "name": "汾西县" }, { "id": "141081", "name": "侯马市" }, { "id": "141082", "name": "霍州市" }] }, { "id": "141100", "name": "吕梁市", "child": [{ "id": "141102", "name": "离石区" }, { "id": "141121", "name": "文水县" }, { "id": "141122", "name": "交城县" }, { "id": "141123", "name": "兴县" }, { "id": "141124", "name": "临县" }, { "id": "141125", "name": "柳林县" }, { "id": "141126", "name": "石楼县" }, { "id": "141127", "name": "岚县" }, { "id": "141128", "name": "方山县" }, { "id": "141129", "name": "中阳县" }, { "id": "141130", "name": "交口县" }, { "id": "141181", "name": "孝义市" }, { "id": "141182", "name": "汾阳市" }] }] }, { "id": "150000", "name": "内蒙古自治区", "child": [{ "id": "150100", "name": "呼和浩特市", "child": [{ "id": "150102", "name": "新城区" }, { "id": "150103", "name": "回民区" }, { "id": "150104", "name": "玉泉区" }, { "id": "150105", "name": "赛罕区" }, { "id": "150121", "name": "土默特左旗" }, { "id": "150122", "name": "托克托县" }, { "id": "150123", "name": "和林格尔县" }, { "id": "150124", "name": "清水河县" }, { "id": "150125", "name": "武川县" }] }, { "id": "150200", "name": "包头市", "child": [{ "id": "150202", "name": "东河区" }, { "id": "150203", "name": "昆都仑区" }, { "id": "150204", "name": "青山区" }, { "id": "150205", "name": "石拐区" }, { "id": "150206", "name": "白云鄂博矿区" }, { "id": "150207", "name": "九原区" }, { "id": "150221", "name": "土默特右旗" }, { "id": "150222", "name": "固阳县" }, { "id": "150223", "name": "达尔罕茂明安联合旗" }] }, { "id": "150300", "name": "乌海市", "child": [{ "id": "150302", "name": "海勃湾区" }, { "id": "150303", "name": "海南区" }, { "id": "150304", "name": "乌达区" }] }, { "id": "150400", "name": "赤峰市", "child": [{ "id": "150402", "name": "红山区" }, { "id": "150403", "name": "元宝山区" }, { "id": "150404", "name": "松山区" }, { "id": "150421", "name": "阿鲁科尔沁旗" }, { "id": "150422", "name": "巴林左旗" }, { "id": "150423", "name": "巴林右旗" }, { "id": "150424", "name": "林西县" }, { "id": "150425", "name": "克什克腾旗" }, { "id": "150426", "name": "翁牛特旗" }, { "id": "150428", "name": "喀喇沁旗" }, { "id": "150429", "name": "宁城县" }, { "id": "150430", "name": "敖汉旗" }] }, { "id": "150500", "name": "通辽市", "child": [{ "id": "150502", "name": "科尔沁区" }, { "id": "150521", "name": "科尔沁左翼中旗" }, { "id": "150522", "name": "科尔沁左翼后旗" }, { "id": "150523", "name": "开鲁县" }, { "id": "150524", "name": "库伦旗" }, { "id": "150525", "name": "奈曼旗" }, { "id": "150526", "name": "扎鲁特旗" }, { "id": "150581", "name": "霍林郭勒市" }] }, { "id": "150600", "name": "鄂尔多斯市", "child": [{ "id": "150602", "name": "东胜区" }, { "id": "150603", "name": "康巴什区" }, { "id": "150621", "name": "达拉特旗" }, { "id": "150622", "name": "准格尔旗" }, { "id": "150623", "name": "鄂托克前旗" }, { "id": "150624", "name": "鄂托克旗" }, { "id": "150625", "name": "杭锦旗" }, { "id": "150626", "name": "乌审旗" }, { "id": "150627", "name": "伊金霍洛旗" }] }, { "id": "150700", "name": "呼伦贝尔市", "child": [{ "id": "150702", "name": "海拉尔区" }, { "id": "150703", "name": "扎赉诺尔区" }, { "id": "150721", "name": "阿荣旗" }, { "id": "150722", "name": "莫力达瓦达斡尔族自治旗" }, { "id": "150723", "name": "鄂伦春自治旗" }, { "id": "150724", "name": "鄂温克族自治旗" }, { "id": "150725", "name": "陈巴尔虎旗" }, { "id": "150726", "name": "新巴尔虎左旗" }, { "id": "150727", "name": "新巴尔虎右旗" }, { "id": "150781", "name": "满洲里市" }, { "id": "150782", "name": "牙克石市" }, { "id": "150783", "name": "扎兰屯市" }, { "id": "150784", "name": "额尔古纳市" }, { "id": "150785", "name": "根河市" }] }, { "id": "150800", "name": "巴彦淖尔市", "child": [{ "id": "150802", "name": "临河区" }, { "id": "150821", "name": "五原县" }, { "id": "150822", "name": "磴口县" }, { "id": "150823", "name": "乌拉特前旗" }, { "id": "150824", "name": "乌拉特中旗" }, { "id": "150825", "name": "乌拉特后旗" }, { "id": "150826", "name": "杭锦后旗" }] }, { "id": "150900", "name": "乌兰察布市", "child": [{ "id": "150902", "name": "集宁区" }, { "id": "150921", "name": "卓资县" }, { "id": "150922", "name": "化德县" }, { "id": "150923", "name": "商都县" }, { "id": "150924", "name": "兴和县" }, { "id": "150925", "name": "凉城县" }, { "id": "150926", "name": "察哈尔右翼前旗" }, { "id": "150927", "name": "察哈尔右翼中旗" }, { "id": "150928", "name": "察哈尔右翼后旗" }, { "id": "150929", "name": "四子王旗" }, { "id": "150981", "name": "丰镇市" }] }, { "id": "152200", "name": "兴安盟", "child": [{ "id": "152201", "name": "乌兰浩特市" }, { "id": "152202", "name": "阿尔山市" }, { "id": "152221", "name": "科尔沁右翼前旗" }, { "id": "152222", "name": "科尔沁右翼中旗" }, { "id": "152223", "name": "扎赉特旗" }, { "id": "152224", "name": "突泉县" }] }, { "id": "152500", "name": "锡林郭勒盟", "child": [{ "id": "152501", "name": "二连浩特市" }, { "id": "152502", "name": "锡林浩特市" }, { "id": "152522", "name": "阿巴嘎旗" }, { "id": "152523", "name": "苏尼特左旗" }, { "id": "152524", "name": "苏尼特右旗" }, { "id": "152525", "name": "东乌珠穆沁旗" }, { "id": "152526", "name": "西乌珠穆沁旗" }, { "id": "152527", "name": "太仆寺旗" }, { "id": "152528", "name": "镶黄旗" }, { "id": "152529", "name": "正镶白旗" }, { "id": "152530", "name": "正蓝旗" }, { "id": "152531", "name": "多伦县" }] }, { "id": "152900", "name": "阿拉善盟", "child": [{ "id": "152921", "name": "阿拉善左旗" }, { "id": "152922", "name": "阿拉善右旗" }, { "id": "152923", "name": "额济纳旗" }] }] }, { "id": "210000", "name": "辽宁省", "child": [{ "id": "210100", "name": "沈阳市", "child": [{ "id": "210102", "name": "和平区" }, { "id": "210103", "name": "沈河区" }, { "id": "210104", "name": "大东区" }, { "id": "210105", "name": "皇姑区" }, { "id": "210106", "name": "铁西区" }, { "id": "210111", "name": "苏家屯区" }, { "id": "210112", "name": "浑南区" }, { "id": "210113", "name": "沈北新区" }, { "id": "210114", "name": "于洪区" }, { "id": "210115", "name": "辽中区" }, { "id": "210123", "name": "康平县" }, { "id": "210124", "name": "法库县" }, { "id": "210181", "name": "新民市" }] }, { "id": "210200", "name": "大连市", "child": [{ "id": "210202", "name": "中山区" }, { "id": "210203", "name": "西岗区" }, { "id": "210204", "name": "沙河口区" }, { "id": "210211", "name": "甘井子区" }, { "id": "210212", "name": "旅顺口区" }, { "id": "210213", "name": "金州区" }, { "id": "210214", "name": "普兰店区" }, { "id": "210224", "name": "长海县" }, { "id": "210281", "name": "瓦房店市" }, { "id": "210283", "name": "庄河市" }] }, { "id": "210300", "name": "鞍山市", "child": [{ "id": "210302", "name": "铁东区" }, { "id": "210303", "name": "铁西区" }, { "id": "210304", "name": "立山区" }, { "id": "210311", "name": "千山区" }, { "id": "210321", "name": "台安县" }, { "id": "210323", "name": "岫岩满族自治县" }, { "id": "210381", "name": "海城市" }] }, { "id": "210400", "name": "抚顺市", "child": [{ "id": "210402", "name": "新抚区" }, { "id": "210403", "name": "东洲区" }, { "id": "210404", "name": "望花区" }, { "id": "210411", "name": "顺城区" }, { "id": "210421", "name": "抚顺县" }, { "id": "210422", "name": "新宾满族自治县" }, { "id": "210423", "name": "清原满族自治县" }] }, { "id": "210500", "name": "本溪市", "child": [{ "id": "210502", "name": "平山区" }, { "id": "210503", "name": "溪湖区" }, { "id": "210504", "name": "明山区" }, { "id": "210505", "name": "南芬区" }, { "id": "210521", "name": "本溪满族自治县" }, { "id": "210522", "name": "桓仁满族自治县" }] }, { "id": "210600", "name": "丹东市", "child": [{ "id": "210602", "name": "元宝区" }, { "id": "210603", "name": "振兴区" }, { "id": "210604", "name": "振安区" }, { "id": "210624", "name": "宽甸满族自治县" }, { "id": "210681", "name": "东港市" }, { "id": "210682", "name": "凤城市" }] }, { "id": "210700", "name": "锦州市", "child": [{ "id": "210702", "name": "古塔区" }, { "id": "210703", "name": "凌河区" }, { "id": "210711", "name": "太和区" }, { "id": "210726", "name": "黑山县" }, { "id": "210727", "name": "义县" }, { "id": "210781", "name": "凌海市" }, { "id": "210782", "name": "北镇市" }] }, { "id": "210800", "name": "营口市", "child": [{ "id": "210802", "name": "站前区" }, { "id": "210803", "name": "西市区" }, { "id": "210804", "name": "鲅鱼圈区" }, { "id": "210811", "name": "老边区" }, { "id": "210881", "name": "盖州市" }, { "id": "210882", "name": "大石桥市" }] }, { "id": "210900", "name": "阜新市", "child": [{ "id": "210902", "name": "海州区" }, { "id": "210903", "name": "新邱区" }, { "id": "210904", "name": "太平区" }, { "id": "210905", "name": "清河门区" }, { "id": "210911", "name": "细河区" }, { "id": "210921", "name": "阜新蒙古族自治县" }, { "id": "210922", "name": "彰武县" }] }, { "id": "211000", "name": "辽阳市", "child": [{ "id": "211002", "name": "白塔区" }, { "id": "211003", "name": "文圣区" }, { "id": "211004", "name": "宏伟区" }, { "id": "211005", "name": "弓长岭区" }, { "id": "211011", "name": "太子河区" }, { "id": "211021", "name": "辽阳县" }, { "id": "211081", "name": "灯塔市" }] }, { "id": "211100", "name": "盘锦市", "child": [{ "id": "211102", "name": "双台子区" }, { "id": "211103", "name": "兴隆台区" }, { "id": "211104", "name": "大洼区" }, { "id": "211122", "name": "盘山县" }] }, { "id": "211200", "name": "铁岭市", "child": [{ "id": "211202", "name": "银州区" }, { "id": "211204", "name": "清河区" }, { "id": "211221", "name": "铁岭县" }, { "id": "211223", "name": "西丰县" }, { "id": "211224", "name": "昌图县" }, { "id": "211281", "name": "调兵山市" }, { "id": "211282", "name": "开原市" }] }, { "id": "211300", "name": "朝阳市", "child": [{ "id": "211302", "name": "双塔区" }, { "id": "211303", "name": "龙城区" }, { "id": "211321", "name": "朝阳县" }, { "id": "211322", "name": "建平县" }, { "id": "211324", "name": "喀喇沁左翼蒙古族自治县" }, { "id": "211381", "name": "北票市" }, { "id": "211382", "name": "凌源市" }] }, { "id": "211400", "name": "葫芦岛市", "child": [{ "id": "211402", "name": "连山区" }, { "id": "211403", "name": "龙港区" }, { "id": "211404", "name": "南票区" }, { "id": "211421", "name": "绥中县" }, { "id": "211422", "name": "建昌县" }, { "id": "211481", "name": "兴城市" }] }] }, { "id": "220000", "name": "吉林省", "child": [{ "id": "220100", "name": "长春市", "child": [{ "id": "220102", "name": "南关区" }, { "id": "220103", "name": "宽城区" }, { "id": "220104", "name": "朝阳区" }, { "id": "220105", "name": "二道区" }, { "id": "220106", "name": "绿园区" }, { "id": "220112", "name": "双阳区" }, { "id": "220113", "name": "九台区" }, { "id": "220122", "name": "农安县" }, { "id": "220182", "name": "榆树市" }, { "id": "220183", "name": "德惠市" }] }, { "id": "220200", "name": "吉林市", "child": [{ "id": "220202", "name": "昌邑区" }, { "id": "220203", "name": "龙潭区" }, { "id": "220204", "name": "船营区" }, { "id": "220211", "name": "丰满区" }, { "id": "220221", "name": "永吉县" }, { "id": "220281", "name": "蛟河市" }, { "id": "220282", "name": "桦甸市" }, { "id": "220283", "name": "舒兰市" }, { "id": "220284", "name": "磐石市" }] }, { "id": "220300", "name": "四平市", "child": [{ "id": "220302", "name": "铁西区" }, { "id": "220303", "name": "铁东区" }, { "id": "220322", "name": "梨树县" }, { "id": "220323", "name": "伊通满族自治县" }, { "id": "220381", "name": "公主岭市" }, { "id": "220382", "name": "双辽市" }] }, { "id": "220400", "name": "辽源市", "child": [{ "id": "220402", "name": "龙山区" }, { "id": "220403", "name": "西安区" }, { "id": "220421", "name": "东丰县" }, { "id": "220422", "name": "东辽县" }] }, { "id": "220500", "name": "通化市", "child": [{ "id": "220502", "name": "东昌区" }, { "id": "220503", "name": "二道江区" }, { "id": "220521", "name": "通化县" }, { "id": "220523", "name": "辉南县" }, { "id": "220524", "name": "柳河县" }, { "id": "220581", "name": "梅河口市" }, { "id": "220582", "name": "集安市" }] }, { "id": "220600", "name": "白山市", "child": [{ "id": "220602", "name": "浑江区" }, { "id": "220605", "name": "江源区" }, { "id": "220621", "name": "抚松县" }, { "id": "220622", "name": "靖宇县" }, { "id": "220623", "name": "长白朝鲜族自治县" }, { "id": "220681", "name": "临江市" }] }, { "id": "220700", "name": "松原市", "child": [{ "id": "220702", "name": "宁江区" }, { "id": "220721", "name": "前郭尔罗斯蒙古族自治县" }, { "id": "220722", "name": "长岭县" }, { "id": "220723", "name": "乾安县" }, { "id": "220781", "name": "扶余市" }] }, { "id": "220800", "name": "白城市", "child": [{ "id": "220802", "name": "洮北区" }, { "id": "220821", "name": "镇赉县" }, { "id": "220822", "name": "通榆县" }, { "id": "220881", "name": "洮南市" }, { "id": "220882", "name": "大安市" }] }, { "id": "222400", "name": "延边朝鲜族自治州", "child": [{ "id": "222401", "name": "延吉市" }, { "id": "222402", "name": "图们市" }, { "id": "222403", "name": "敦化市" }, { "id": "222404", "name": "珲春市" }, { "id": "222405", "name": "龙井市" }, { "id": "222406", "name": "和龙市" }, { "id": "222424", "name": "汪清县" }, { "id": "222426", "name": "安图县" }] }] }, { "id": "230000", "name": "黑龙江省", "child": [{ "id": "230100", "name": "哈尔滨市", "child": [{ "id": "230102", "name": "道里区" }, { "id": "230103", "name": "南岗区" }, { "id": "230104", "name": "道外区" }, { "id": "230108", "name": "平房区" }, { "id": "230109", "name": "松北区" }, { "id": "230110", "name": "香坊区" }, { "id": "230111", "name": "呼兰区" }, { "id": "230112", "name": "阿城区" }, { "id": "230113", "name": "双城区" }, { "id": "230123", "name": "依兰县" }, { "id": "230124", "name": "方正县" }, { "id": "230125", "name": "宾县" }, { "id": "230126", "name": "巴彦县" }, { "id": "230127", "name": "木兰县" }, { "id": "230128", "name": "通河县" }, { "id": "230129", "name": "延寿县" }, { "id": "230183", "name": "尚志市" }, { "id": "230184", "name": "五常市" }] }, { "id": "230200", "name": "齐齐哈尔市", "child": [{ "id": "230202", "name": "龙沙区" }, { "id": "230203", "name": "建华区" }, { "id": "230204", "name": "铁锋区" }, { "id": "230205", "name": "昂昂溪区" }, { "id": "230206", "name": "富拉尔基区" }, { "id": "230207", "name": "碾子山区" }, { "id": "230208", "name": "梅里斯达斡尔族区" }, { "id": "230221", "name": "龙江县" }, { "id": "230223", "name": "依安县" }, { "id": "230224", "name": "泰来县" }, { "id": "230225", "name": "甘南县" }, { "id": "230227", "name": "富裕县" }, { "id": "230229", "name": "克山县" }, { "id": "230230", "name": "克东县" }, { "id": "230231", "name": "拜泉县" }, { "id": "230281", "name": "讷河市" }] }, { "id": "230300", "name": "鸡西市", "child": [{ "id": "230302", "name": "鸡冠区" }, { "id": "230303", "name": "恒山区" }, { "id": "230304", "name": "滴道区" }, { "id": "230305", "name": "梨树区" }, { "id": "230306", "name": "城子河区" }, { "id": "230307", "name": "麻山区" }, { "id": "230321", "name": "鸡东县" }, { "id": "230381", "name": "虎林市" }, { "id": "230382", "name": "密山市" }] }, { "id": "230400", "name": "鹤岗市", "child": [{ "id": "230402", "name": "向阳区" }, { "id": "230403", "name": "工农区" }, { "id": "230404", "name": "南山区" }, { "id": "230405", "name": "兴安区" }, { "id": "230406", "name": "东山区" }, { "id": "230407", "name": "兴山区" }, { "id": "230421", "name": "萝北县" }, { "id": "230422", "name": "绥滨县" }] }, { "id": "230500", "name": "双鸭山市", "child": [{ "id": "230502", "name": "尖山区" }, { "id": "230503", "name": "岭东区" }, { "id": "230505", "name": "四方台区" }, { "id": "230506", "name": "宝山区" }, { "id": "230521", "name": "集贤县" }, { "id": "230522", "name": "友谊县" }, { "id": "230523", "name": "宝清县" }, { "id": "230524", "name": "饶河县" }] }, { "id": "230600", "name": "大庆市", "child": [{ "id": "230602", "name": "萨尔图区" }, { "id": "230603", "name": "龙凤区" }, { "id": "230604", "name": "让胡路区" }, { "id": "230605", "name": "红岗区" }, { "id": "230606", "name": "大同区" }, { "id": "230621", "name": "肇州县" }, { "id": "230622", "name": "肇源县" }, { "id": "230623", "name": "林甸县" }, { "id": "230624", "name": "杜尔伯特蒙古族自治县" }] }, { "id": "230700", "name": "伊春市", "child": [{ "id": "230702", "name": "伊春区" }, { "id": "230703", "name": "南岔区" }, { "id": "230704", "name": "友好区" }, { "id": "230705", "name": "西林区" }, { "id": "230706", "name": "翠峦区" }, { "id": "230707", "name": "新青区" }, { "id": "230708", "name": "美溪区" }, { "id": "230709", "name": "金山屯区" }, { "id": "230710", "name": "五营区" }, { "id": "230711", "name": "乌马河区" }, { "id": "230712", "name": "汤旺河区" }, { "id": "230713", "name": "带岭区" }, { "id": "230714", "name": "乌伊岭区" }, { "id": "230715", "name": "红星区" }, { "id": "230716", "name": "上甘岭区" }, { "id": "230722", "name": "嘉荫县" }, { "id": "230781", "name": "铁力市" }] }, { "id": "230800", "name": "佳木斯市", "child": [{ "id": "230803", "name": "向阳区" }, { "id": "230804", "name": "前进区" }, { "id": "230805", "name": "东风区" }, { "id": "230811", "name": "郊区" }, { "id": "230822", "name": "桦南县" }, { "id": "230826", "name": "桦川县" }, { "id": "230828", "name": "汤原县" }, { "id": "230881", "name": "同江市" }, { "id": "230882", "name": "富锦市" }, { "id": "230883", "name": "抚远市" }] }, { "id": "230900", "name": "七台河市", "child": [{ "id": "230902", "name": "新兴区" }, { "id": "230903", "name": "桃山区" }, { "id": "230904", "name": "茄子河区" }, { "id": "230921", "name": "勃利县" }] }, { "id": "231000", "name": "牡丹江市", "child": [{ "id": "231002", "name": "东安区" }, { "id": "231003", "name": "阳明区" }, { "id": "231004", "name": "爱民区" }, { "id": "231005", "name": "西安区" }, { "id": "231025", "name": "林口县" }, { "id": "231081", "name": "绥芬河市" }, { "id": "231083", "name": "海林市" }, { "id": "231084", "name": "宁安市" }, { "id": "231085", "name": "穆棱市" }, { "id": "231086", "name": "东宁市" }] }, { "id": "231100", "name": "黑河市", "child": [{ "id": "231102", "name": "爱辉区" }, { "id": "231121", "name": "嫩江县" }, { "id": "231123", "name": "逊克县" }, { "id": "231124", "name": "孙吴县" }, { "id": "231181", "name": "北安市" }, { "id": "231182", "name": "五大连池市" }] }, { "id": "231200", "name": "绥化市", "child": [{ "id": "231202", "name": "北林区" }, { "id": "231221", "name": "望奎县" }, { "id": "231222", "name": "兰西县" }, { "id": "231223", "name": "青冈县" }, { "id": "231224", "name": "庆安县" }, { "id": "231225", "name": "明水县" }, { "id": "231226", "name": "绥棱县" }, { "id": "231281", "name": "安达市" }, { "id": "231282", "name": "肇东市" }, { "id": "231283", "name": "海伦市" }] }, { "id": "232700", "name": "大兴安岭地区", "child": [{ "id": "232701", "name": "漠河市" }, { "id": "232721", "name": "呼玛县" }, { "id": "232722", "name": "塔河县" }] }] }, { "id": "310000", "name": "上海市", "child": [{ "id": "310000", "name": "上海市", "child": [{ "id": "310101", "name": "黄浦区" }, { "id": "310104", "name": "徐汇区" }, { "id": "310105", "name": "长宁区" }, { "id": "310106", "name": "静安区" }, { "id": "310107", "name": "普陀区" }, { "id": "310109", "name": "虹口区" }, { "id": "310110", "name": "杨浦区" }, { "id": "310112", "name": "闵行区" }, { "id": "310113", "name": "宝山区" }, { "id": "310114", "name": "嘉定区" }, { "id": "310115", "name": "浦东新区" }, { "id": "310116", "name": "金山区" }, { "id": "310117", "name": "松江区" }, { "id": "310118", "name": "青浦区" }, { "id": "310120", "name": "奉贤区" }, { "id": "310151", "name": "崇明区" }] }] }, { "id": "320000", "name": "江苏省", "child": [{ "id": "320100", "name": "南京市", "child": [{ "id": "320102", "name": "玄武区" }, { "id": "320104", "name": "秦淮区" }, { "id": "320105", "name": "建邺区" }, { "id": "320106", "name": "鼓楼区" }, { "id": "320111", "name": "浦口区" }, { "id": "320113", "name": "栖霞区" }, { "id": "320114", "name": "雨花台区" }, { "id": "320115", "name": "江宁区" }, { "id": "320116", "name": "六合区" }, { "id": "320117", "name": "溧水区" }, { "id": "320118", "name": "高淳区" }] }, { "id": "320200", "name": "无锡市", "child": [{ "id": "320205", "name": "锡山区" }, { "id": "320206", "name": "惠山区" }, { "id": "320211", "name": "滨湖区" }, { "id": "320213", "name": "梁溪区" }, { "id": "320214", "name": "新吴区" }, { "id": "320281", "name": "江阴市" }, { "id": "320282", "name": "宜兴市" }] }, { "id": "320300", "name": "徐州市", "child": [{ "id": "320302", "name": "鼓楼区" }, { "id": "320303", "name": "云龙区" }, { "id": "320305", "name": "贾汪区" }, { "id": "320311", "name": "泉山区" }, { "id": "320312", "name": "铜山区" }, { "id": "320321", "name": "丰县" }, { "id": "320322", "name": "沛县" }, { "id": "320324", "name": "睢宁县" }, { "id": "320381", "name": "新沂市" }, { "id": "320382", "name": "邳州市" }] }, { "id": "320400", "name": "常州市", "child": [{ "id": "320402", "name": "天宁区" }, { "id": "320404", "name": "钟楼区" }, { "id": "320411", "name": "新北区" }, { "id": "320412", "name": "武进区" }, { "id": "320413", "name": "金坛区" }, { "id": "320481", "name": "溧阳市" }] }, { "id": "320500", "name": "苏州市", "child": [{ "id": "320505", "name": "虎丘区" }, { "id": "320506", "name": "吴中区" }, { "id": "320507", "name": "相城区" }, { "id": "320508", "name": "姑苏区" }, { "id": "320509", "name": "吴江区" }, { "id": "320581", "name": "常熟市" }, { "id": "320582", "name": "张家港市" }, { "id": "320583", "name": "昆山市" }, { "id": "320585", "name": "太仓市" }] }, { "id": "320600", "name": "南通市", "child": [{ "id": "320602", "name": "崇川区" }, { "id": "320611", "name": "港闸区" }, { "id": "320612", "name": "通州区" }, { "id": "320623", "name": "如东县" }, { "id": "320681", "name": "启东市" }, { "id": "320682", "name": "如皋市" }, { "id": "320684", "name": "海门市" }, { "id": "320685", "name": "海安市" }] }, { "id": "320700", "name": "连云港市", "child": [{ "id": "320703", "name": "连云区" }, { "id": "320706", "name": "海州区" }, { "id": "320707", "name": "赣榆区" }, { "id": "320722", "name": "东海县" }, { "id": "320723", "name": "灌云县" }, { "id": "320724", "name": "灌南县" }] }, { "id": "320800", "name": "淮安市", "child": [{ "id": "320803", "name": "淮安区" }, { "id": "320804", "name": "淮阴区" }, { "id": "320812", "name": "清江浦区" }, { "id": "320813", "name": "洪泽区" }, { "id": "320826", "name": "涟水县" }, { "id": "320830", "name": "盱眙县" }, { "id": "320831", "name": "金湖县" }] }, { "id": "320900", "name": "盐城市", "child": [{ "id": "320902", "name": "亭湖区" }, { "id": "320903", "name": "盐都区" }, { "id": "320904", "name": "大丰区" }, { "id": "320921", "name": "响水县" }, { "id": "320922", "name": "滨海县" }, { "id": "320923", "name": "阜宁县" }, { "id": "320924", "name": "射阳县" }, { "id": "320925", "name": "建湖县" }, { "id": "320981", "name": "东台市" }] }, { "id": "321000", "name": "扬州市", "child": [{ "id": "321002", "name": "广陵区" }, { "id": "321003", "name": "邗江区" }, { "id": "321012", "name": "江都区" }, { "id": "321023", "name": "宝应县" }, { "id": "321081", "name": "仪征市" }, { "id": "321084", "name": "高邮市" }] }, { "id": "321100", "name": "镇江市", "child": [{ "id": "321102", "name": "京口区" }, { "id": "321111", "name": "润州区" }, { "id": "321112", "name": "丹徒区" }, { "id": "321181", "name": "丹阳市" }, { "id": "321182", "name": "扬中市" }, { "id": "321183", "name": "句容市" }] }, { "id": "321200", "name": "泰州市", "child": [{ "id": "321202", "name": "海陵区" }, { "id": "321203", "name": "高港区" }, { "id": "321204", "name": "姜堰区" }, { "id": "321281", "name": "兴化市" }, { "id": "321282", "name": "靖江市" }, { "id": "321283", "name": "泰兴市" }] }, { "id": "321300", "name": "宿迁市", "child": [{ "id": "321302", "name": "宿城区" }, { "id": "321311", "name": "宿豫区" }, { "id": "321322", "name": "沭阳县" }, { "id": "321323", "name": "泗阳县" }, { "id": "321324", "name": "泗洪县" }] }] }, { "id": "330000", "name": "浙江省", "child": [{ "id": "330100", "name": "杭州市", "child": [{ "id": "330102", "name": "上城区" }, { "id": "330103", "name": "下城区" }, { "id": "330104", "name": "江干区" }, { "id": "330105", "name": "拱墅区" }, { "id": "330106", "name": "西湖区" }, { "id": "330108", "name": "滨江区" }, { "id": "330109", "name": "萧山区" }, { "id": "330110", "name": "余杭区" }, { "id": "330111", "name": "富阳区" }, { "id": "330112", "name": "临安区" }, { "id": "330122", "name": "桐庐县" }, { "id": "330127", "name": "淳安县" }, { "id": "330182", "name": "建德市" }] }, { "id": "330200", "name": "宁波市", "child": [{ "id": "330203", "name": "海曙区" }, { "id": "330205", "name": "江北区" }, { "id": "330206", "name": "北仑区" }, { "id": "330211", "name": "镇海区" }, { "id": "330212", "name": "鄞州区" }, { "id": "330213", "name": "奉化区" }, { "id": "330225", "name": "象山县" }, { "id": "330226", "name": "宁海县" }, { "id": "330281", "name": "余姚市" }, { "id": "330282", "name": "慈溪市" }] }, { "id": "330300", "name": "温州市", "child": [{ "id": "330302", "name": "鹿城区" }, { "id": "330303", "name": "龙湾区" }, { "id": "330304", "name": "瓯海区" }, { "id": "330305", "name": "洞头区" }, { "id": "330324", "name": "永嘉县" }, { "id": "330326", "name": "平阳县" }, { "id": "330327", "name": "苍南县" }, { "id": "330328", "name": "文成县" }, { "id": "330329", "name": "泰顺县" }, { "id": "330381", "name": "瑞安市" }, { "id": "330382", "name": "乐清市" }] }, { "id": "330400", "name": "嘉兴市", "child": [{ "id": "330402", "name": "南湖区" }, { "id": "330411", "name": "秀洲区" }, { "id": "330421", "name": "嘉善县" }, { "id": "330424", "name": "海盐县" }, { "id": "330481", "name": "海宁市" }, { "id": "330482", "name": "平湖市" }, { "id": "330483", "name": "桐乡市" }] }, { "id": "330500", "name": "湖州市", "child": [{ "id": "330502", "name": "吴兴区" }, { "id": "330503", "name": "南浔区" }, { "id": "330521", "name": "德清县" }, { "id": "330522", "name": "长兴县" }, { "id": "330523", "name": "安吉县" }] }, { "id": "330600", "name": "绍兴市", "child": [{ "id": "330602", "name": "越城区" }, { "id": "330603", "name": "柯桥区" }, { "id": "330604", "name": "上虞区" }, { "id": "330624", "name": "新昌县" }, { "id": "330681", "name": "诸暨市" }, { "id": "330683", "name": "嵊州市" }] }, { "id": "330700", "name": "金华市", "child": [{ "id": "330702", "name": "婺城区" }, { "id": "330703", "name": "金东区" }, { "id": "330723", "name": "武义县" }, { "id": "330726", "name": "浦江县" }, { "id": "330727", "name": "磐安县" }, { "id": "330781", "name": "兰溪市" }, { "id": "330782", "name": "义乌市" }, { "id": "330783", "name": "东阳市" }, { "id": "330784", "name": "永康市" }] }, { "id": "330800", "name": "衢州市", "child": [{ "id": "330802", "name": "柯城区" }, { "id": "330803", "name": "衢江区" }, { "id": "330822", "name": "常山县" }, { "id": "330824", "name": "开化县" }, { "id": "330825", "name": "龙游县" }, { "id": "330881", "name": "江山市" }] }, { "id": "330900", "name": "舟山市", "child": [{ "id": "330902", "name": "定海区" }, { "id": "330903", "name": "普陀区" }, { "id": "330921", "name": "岱山县" }, { "id": "330922", "name": "嵊泗县" }] }, { "id": "331000", "name": "台州市", "child": [{ "id": "331002", "name": "椒江区" }, { "id": "331003", "name": "黄岩区" }, { "id": "331004", "name": "路桥区" }, { "id": "331022", "name": "三门县" }, { "id": "331023", "name": "天台县" }, { "id": "331024", "name": "仙居县" }, { "id": "331081", "name": "温岭市" }, { "id": "331082", "name": "临海市" }, { "id": "331083", "name": "玉环市" }] }, { "id": "331100", "name": "丽水市", "child": [{ "id": "331102", "name": "莲都区" }, { "id": "331121", "name": "青田县" }, { "id": "331122", "name": "缙云县" }, { "id": "331123", "name": "遂昌县" }, { "id": "331124", "name": "松阳县" }, { "id": "331125", "name": "云和县" }, { "id": "331126", "name": "庆元县" }, { "id": "331127", "name": "景宁畲族自治县" }, { "id": "331181", "name": "龙泉市" }] }] }, { "id": "340000", "name": "安徽省", "child": [{ "id": "340100", "name": "合肥市", "child": [{ "id": "340102", "name": "瑶海区" }, { "id": "340103", "name": "庐阳区" }, { "id": "340104", "name": "蜀山区" }, { "id": "340111", "name": "包河区" }, { "id": "340121", "name": "长丰县" }, { "id": "340122", "name": "肥东县" }, { "id": "340123", "name": "肥西县" }, { "id": "340124", "name": "庐江县" }, { "id": "340181", "name": "巢湖市" }] }, { "id": "340200", "name": "芜湖市", "child": [{ "id": "340202", "name": "镜湖区" }, { "id": "340203", "name": "弋江区" }, { "id": "340207", "name": "鸠江区" }, { "id": "340208", "name": "三山区" }, { "id": "340221", "name": "芜湖县" }, { "id": "340222", "name": "繁昌县" }, { "id": "340223", "name": "南陵县" }, { "id": "340225", "name": "无为县" }] }, { "id": "340300", "name": "蚌埠市", "child": [{ "id": "340302", "name": "龙子湖区" }, { "id": "340303", "name": "蚌山区" }, { "id": "340304", "name": "禹会区" }, { "id": "340311", "name": "淮上区" }, { "id": "340321", "name": "怀远县" }, { "id": "340322", "name": "五河县" }, { "id": "340323", "name": "固镇县" }] }, { "id": "340400", "name": "淮南市", "child": [{ "id": "340402", "name": "大通区" }, { "id": "340403", "name": "田家庵区" }, { "id": "340404", "name": "谢家集区" }, { "id": "340405", "name": "八公山区" }, { "id": "340406", "name": "潘集区" }, { "id": "340421", "name": "凤台县" }, { "id": "340422", "name": "寿县" }] }, { "id": "340500", "name": "马鞍山市", "child": [{ "id": "340503", "name": "花山区" }, { "id": "340504", "name": "雨山区" }, { "id": "340506", "name": "博望区" }, { "id": "340521", "name": "当涂县" }, { "id": "340522", "name": "含山县" }, { "id": "340523", "name": "和县" }] }, { "id": "340600", "name": "淮北市", "child": [{ "id": "340602", "name": "杜集区" }, { "id": "340603", "name": "相山区" }, { "id": "340604", "name": "烈山区" }, { "id": "340621", "name": "濉溪县" }] }, { "id": "340700", "name": "铜陵市", "child": [{ "id": "340705", "name": "铜官区" }, { "id": "340706", "name": "义安区" }, { "id": "340711", "name": "郊区" }, { "id": "340722", "name": "枞阳县" }] }, { "id": "340800", "name": "安庆市", "child": [{ "id": "340802", "name": "迎江区" }, { "id": "340803", "name": "大观区" }, { "id": "340811", "name": "宜秀区" }, { "id": "340822", "name": "怀宁县" }, { "id": "340824", "name": "潜山县" }, { "id": "340825", "name": "太湖县" }, { "id": "340826", "name": "宿松县" }, { "id": "340827", "name": "望江县" }, { "id": "340828", "name": "岳西县" }, { "id": "340881", "name": "桐城市" }] }, { "id": "341000", "name": "黄山市", "child": [{ "id": "341002", "name": "屯溪区" }, { "id": "341003", "name": "黄山区" }, { "id": "341004", "name": "徽州区" }, { "id": "341021", "name": "歙县" }, { "id": "341022", "name": "休宁县" }, { "id": "341023", "name": "黟县" }, { "id": "341024", "name": "祁门县" }] }, { "id": "341100", "name": "滁州市", "child": [{ "id": "341102", "name": "琅琊区" }, { "id": "341103", "name": "南谯区" }, { "id": "341122", "name": "来安县" }, { "id": "341124", "name": "全椒县" }, { "id": "341125", "name": "定远县" }, { "id": "341126", "name": "凤阳县" }, { "id": "341181", "name": "天长市" }, { "id": "341182", "name": "明光市" }] }, { "id": "341200", "name": "阜阳市", "child": [{ "id": "341202", "name": "颍州区" }, { "id": "341203", "name": "颍东区" }, { "id": "341204", "name": "颍泉区" }, { "id": "341221", "name": "临泉县" }, { "id": "341222", "name": "太和县" }, { "id": "341225", "name": "阜南县" }, { "id": "341226", "name": "颍上县" }, { "id": "341282", "name": "界首市" }] }, { "id": "341300", "name": "宿州市", "child": [{ "id": "341302", "name": "埇桥区" }, { "id": "341321", "name": "砀山县" }, { "id": "341322", "name": "萧县" }, { "id": "341323", "name": "灵璧县" }, { "id": "341324", "name": "泗县" }] }, { "id": "341500", "name": "六安市", "child": [{ "id": "341502", "name": "金安区" }, { "id": "341503", "name": "裕安区" }, { "id": "341504", "name": "叶集区" }, { "id": "341522", "name": "霍邱县" }, { "id": "341523", "name": "舒城县" }, { "id": "341524", "name": "金寨县" }, { "id": "341525", "name": "霍山县" }] }, { "id": "341600", "name": "亳州市", "child": [{ "id": "341602", "name": "谯城区" }, { "id": "341621", "name": "涡阳县" }, { "id": "341622", "name": "蒙城县" }, { "id": "341623", "name": "利辛县" }] }, { "id": "341700", "name": "池州市", "child": [{ "id": "341702", "name": "贵池区" }, { "id": "341721", "name": "东至县" }, { "id": "341722", "name": "石台县" }, { "id": "341723", "name": "青阳县" }] }, { "id": "341800", "name": "宣城市", "child": [{ "id": "341802", "name": "宣州区" }, { "id": "341821", "name": "郎溪县" }, { "id": "341822", "name": "广德县" }, { "id": "341823", "name": "泾县" }, { "id": "341824", "name": "绩溪县" }, { "id": "341825", "name": "旌德县" }, { "id": "341881", "name": "宁国市" }] }] }, { "id": "350000", "name": "福建省", "child": [{ "id": "350100", "name": "福州市", "child": [{ "id": "350102", "name": "鼓楼区" }, { "id": "350103", "name": "台江区" }, { "id": "350104", "name": "仓山区" }, { "id": "350105", "name": "马尾区" }, { "id": "350111", "name": "晋安区" }, { "id": "350112", "name": "长乐区" }, { "id": "350121", "name": "闽侯县" }, { "id": "350122", "name": "连江县" }, { "id": "350123", "name": "罗源县" }, { "id": "350124", "name": "闽清县" }, { "id": "350125", "name": "永泰县" }, { "id": "350128", "name": "平潭县" }, { "id": "350181", "name": "福清市" }] }, { "id": "350200", "name": "厦门市", "child": [{ "id": "350203", "name": "思明区" }, { "id": "350205", "name": "海沧区" }, { "id": "350206", "name": "湖里区" }, { "id": "350211", "name": "集美区" }, { "id": "350212", "name": "同安区" }, { "id": "350213", "name": "翔安区" }] }, { "id": "350300", "name": "莆田市", "child": [{ "id": "350302", "name": "城厢区" }, { "id": "350303", "name": "涵江区" }, { "id": "350304", "name": "荔城区" }, { "id": "350305", "name": "秀屿区" }, { "id": "350322", "name": "仙游县" }] }, { "id": "350400", "name": "三明市", "child": [{ "id": "350402", "name": "梅列区" }, { "id": "350403", "name": "三元区" }, { "id": "350421", "name": "明溪县" }, { "id": "350423", "name": "清流县" }, { "id": "350424", "name": "宁化县" }, { "id": "350425", "name": "大田县" }, { "id": "350426", "name": "尤溪县" }, { "id": "350427", "name": "沙县" }, { "id": "350428", "name": "将乐县" }, { "id": "350429", "name": "泰宁县" }, { "id": "350430", "name": "建宁县" }, { "id": "350481", "name": "永安市" }] }, { "id": "350500", "name": "泉州市", "child": [{ "id": "350502", "name": "鲤城区" }, { "id": "350503", "name": "丰泽区" }, { "id": "350504", "name": "洛江区" }, { "id": "350505", "name": "泉港区" }, { "id": "350521", "name": "惠安县" }, { "id": "350524", "name": "安溪县" }, { "id": "350525", "name": "永春县" }, { "id": "350526", "name": "德化县" }, { "id": "350527", "name": "金门县" }, { "id": "350581", "name": "石狮市" }, { "id": "350582", "name": "晋江市" }, { "id": "350583", "name": "南安市" }] }, { "id": "350600", "name": "漳州市", "child": [{ "id": "350602", "name": "芗城区" }, { "id": "350603", "name": "龙文区" }, { "id": "350622", "name": "云霄县" }, { "id": "350623", "name": "漳浦县" }, { "id": "350624", "name": "诏安县" }, { "id": "350625", "name": "长泰县" }, { "id": "350626", "name": "东山县" }, { "id": "350627", "name": "南靖县" }, { "id": "350628", "name": "平和县" }, { "id": "350629", "name": "华安县" }, { "id": "350681", "name": "龙海市" }] }, { "id": "350700", "name": "南平市", "child": [{ "id": "350702", "name": "延平区" }, { "id": "350703", "name": "建阳区" }, { "id": "350721", "name": "顺昌县" }, { "id": "350722", "name": "浦城县" }, { "id": "350723", "name": "光泽县" }, { "id": "350724", "name": "松溪县" }, { "id": "350725", "name": "政和县" }, { "id": "350781", "name": "邵武市" }, { "id": "350782", "name": "武夷山市" }, { "id": "350783", "name": "建瓯市" }] }, { "id": "350800", "name": "龙岩市", "child": [{ "id": "350802", "name": "新罗区" }, { "id": "350803", "name": "永定区" }, { "id": "350821", "name": "长汀县" }, { "id": "350823", "name": "上杭县" }, { "id": "350824", "name": "武平县" }, { "id": "350825", "name": "连城县" }, { "id": "350881", "name": "漳平市" }] }, { "id": "350900", "name": "宁德市", "child": [{ "id": "350902", "name": "蕉城区" }, { "id": "350921", "name": "霞浦县" }, { "id": "350922", "name": "古田县" }, { "id": "350923", "name": "屏南县" }, { "id": "350924", "name": "寿宁县" }, { "id": "350925", "name": "周宁县" }, { "id": "350926", "name": "柘荣县" }, { "id": "350981", "name": "福安市" }, { "id": "350982", "name": "福鼎市" }] }] }, { "id": "360000", "name": "江西省", "child": [{ "id": "360100", "name": "南昌市", "child": [{ "id": "360102", "name": "东湖区" }, { "id": "360103", "name": "西湖区" }, { "id": "360104", "name": "青云谱区" }, { "id": "360105", "name": "湾里区" }, { "id": "360111", "name": "青山湖区" }, { "id": "360112", "name": "新建区" }, { "id": "360121", "name": "南昌县" }, { "id": "360123", "name": "安义县" }, { "id": "360124", "name": "进贤县" }] }, { "id": "360200", "name": "景德镇市", "child": [{ "id": "360202", "name": "昌江区" }, { "id": "360203", "name": "珠山区" }, { "id": "360222", "name": "浮梁县" }, { "id": "360281", "name": "乐平市" }] }, { "id": "360300", "name": "萍乡市", "child": [{ "id": "360302", "name": "安源区" }, { "id": "360313", "name": "湘东区" }, { "id": "360321", "name": "莲花县" }, { "id": "360322", "name": "上栗县" }, { "id": "360323", "name": "芦溪县" }] }, { "id": "360400", "name": "九江市", "child": [{ "id": "360402", "name": "濂溪区" }, { "id": "360403", "name": "浔阳区" }, { "id": "360404", "name": "柴桑区" }, { "id": "360423", "name": "武宁县" }, { "id": "360424", "name": "修水县" }, { "id": "360425", "name": "永修县" }, { "id": "360426", "name": "德安县" }, { "id": "360428", "name": "都昌县" }, { "id": "360429", "name": "湖口县" }, { "id": "360430", "name": "彭泽县" }, { "id": "360481", "name": "瑞昌市" }, { "id": "360482", "name": "共青城市" }, { "id": "360483", "name": "庐山市" }] }, { "id": "360500", "name": "新余市", "child": [{ "id": "360502", "name": "渝水区" }, { "id": "360521", "name": "分宜县" }] }, { "id": "360600", "name": "鹰潭市", "child": [{ "id": "360602", "name": "月湖区" }, { "id": "360603", "name": "余江区" }, { "id": "360681", "name": "贵溪市" }] }, { "id": "360700", "name": "赣州市", "child": [{ "id": "360702", "name": "章贡区" }, { "id": "360703", "name": "南康区" }, { "id": "360704", "name": "赣县区" }, { "id": "360722", "name": "信丰县" }, { "id": "360723", "name": "大余县" }, { "id": "360724", "name": "上犹县" }, { "id": "360725", "name": "崇义县" }, { "id": "360726", "name": "安远县" }, { "id": "360727", "name": "龙南县" }, { "id": "360728", "name": "定南县" }, { "id": "360729", "name": "全南县" }, { "id": "360730", "name": "宁都县" }, { "id": "360731", "name": "于都县" }, { "id": "360732", "name": "兴国县" }, { "id": "360733", "name": "会昌县" }, { "id": "360734", "name": "寻乌县" }, { "id": "360735", "name": "石城县" }, { "id": "360781", "name": "瑞金市" }] }, { "id": "360800", "name": "吉安市", "child": [{ "id": "360802", "name": "吉州区" }, { "id": "360803", "name": "青原区" }, { "id": "360821", "name": "吉安县" }, { "id": "360822", "name": "吉水县" }, { "id": "360823", "name": "峡江县" }, { "id": "360824", "name": "新干县" }, { "id": "360825", "name": "永丰县" }, { "id": "360826", "name": "泰和县" }, { "id": "360827", "name": "遂川县" }, { "id": "360828", "name": "万安县" }, { "id": "360829", "name": "安福县" }, { "id": "360830", "name": "永新县" }, { "id": "360881", "name": "井冈山市" }] }, { "id": "360900", "name": "宜春市", "child": [{ "id": "360902", "name": "袁州区" }, { "id": "360921", "name": "奉新县" }, { "id": "360922", "name": "万载县" }, { "id": "360923", "name": "上高县" }, { "id": "360924", "name": "宜丰县" }, { "id": "360925", "name": "靖安县" }, { "id": "360926", "name": "铜鼓县" }, { "id": "360981", "name": "丰城市" }, { "id": "360982", "name": "樟树市" }, { "id": "360983", "name": "高安市" }] }, { "id": "361000", "name": "抚州市", "child": [{ "id": "361002", "name": "临川区" }, { "id": "361003", "name": "东乡区" }, { "id": "361021", "name": "南城县" }, { "id": "361022", "name": "黎川县" }, { "id": "361023", "name": "南丰县" }, { "id": "361024", "name": "崇仁县" }, { "id": "361025", "name": "乐安县" }, { "id": "361026", "name": "宜黄县" }, { "id": "361027", "name": "金溪县" }, { "id": "361028", "name": "资溪县" }, { "id": "361030", "name": "广昌县" }] }, { "id": "361100", "name": "上饶市", "child": [{ "id": "361102", "name": "信州区" }, { "id": "361103", "name": "广丰区" }, { "id": "361121", "name": "上饶县" }, { "id": "361123", "name": "玉山县" }, { "id": "361124", "name": "铅山县" }, { "id": "361125", "name": "横峰县" }, { "id": "361126", "name": "弋阳县" }, { "id": "361127", "name": "余干县" }, { "id": "361128", "name": "鄱阳县" }, { "id": "361129", "name": "万年县" }, { "id": "361130", "name": "婺源县" }, { "id": "361181", "name": "德兴市" }] }] }, { "id": "370000", "name": "山东省", "child": [{ "id": "370100", "name": "济南市", "child": [{ "id": "370102", "name": "历下区" }, { "id": "370103", "name": "市中区" }, { "id": "370104", "name": "槐荫区" }, { "id": "370105", "name": "天桥区" }, { "id": "370112", "name": "历城区" }, { "id": "370113", "name": "长清区" }, { "id": "370114", "name": "章丘区" }, { "id": "370124", "name": "平阴县" }, { "id": "370125", "name": "济阳县" }, { "id": "370126", "name": "商河县" }] }, { "id": "370200", "name": "青岛市", "child": [{ "id": "370202", "name": "市南区" }, { "id": "370203", "name": "市北区" }, { "id": "370211", "name": "黄岛区" }, { "id": "370212", "name": "崂山区" }, { "id": "370213", "name": "李沧区" }, { "id": "370214", "name": "城阳区" }, { "id": "370215", "name": "即墨区" }, { "id": "370281", "name": "胶州市" }, { "id": "370283", "name": "平度市" }, { "id": "370285", "name": "莱西市" }] }, { "id": "370300", "name": "淄博市", "child": [{ "id": "370302", "name": "淄川区" }, { "id": "370303", "name": "张店区" }, { "id": "370304", "name": "博山区" }, { "id": "370305", "name": "临淄区" }, { "id": "370306", "name": "周村区" }, { "id": "370321", "name": "桓台县" }, { "id": "370322", "name": "高青县" }, { "id": "370323", "name": "沂源县" }] }, { "id": "370400", "name": "枣庄市", "child": [{ "id": "370402", "name": "市中区" }, { "id": "370403", "name": "薛城区" }, { "id": "370404", "name": "峄城区" }, { "id": "370405", "name": "台儿庄区" }, { "id": "370406", "name": "山亭区" }, { "id": "370481", "name": "滕州市" }] }, { "id": "370500", "name": "东营市", "child": [{ "id": "370502", "name": "东营区" }, { "id": "370503", "name": "河口区" }, { "id": "370505", "name": "垦利区" }, { "id": "370522", "name": "利津县" }, { "id": "370523", "name": "广饶县" }] }, { "id": "370600", "name": "烟台市", "child": [{ "id": "370602", "name": "芝罘区" }, { "id": "370611", "name": "福山区" }, { "id": "370612", "name": "牟平区" }, { "id": "370613", "name": "莱山区" }, { "id": "370634", "name": "长岛县" }, { "id": "370681", "name": "龙口市" }, { "id": "370682", "name": "莱阳市" }, { "id": "370683", "name": "莱州市" }, { "id": "370684", "name": "蓬莱市" }, { "id": "370685", "name": "招远市" }, { "id": "370686", "name": "栖霞市" }, { "id": "370687", "name": "海阳市" }] }, { "id": "370700", "name": "潍坊市", "child": [{ "id": "370702", "name": "潍城区" }, { "id": "370703", "name": "寒亭区" }, { "id": "370704", "name": "坊子区" }, { "id": "370705", "name": "奎文区" }, { "id": "370724", "name": "临朐县" }, { "id": "370725", "name": "昌乐县" }, { "id": "370781", "name": "青州市" }, { "id": "370782", "name": "诸城市" }, { "id": "370783", "name": "寿光市" }, { "id": "370784", "name": "安丘市" }, { "id": "370785", "name": "高密市" }, { "id": "370786", "name": "昌邑市" }] }, { "id": "370800", "name": "济宁市", "child": [{ "id": "370811", "name": "任城区" }, { "id": "370812", "name": "兖州区" }, { "id": "370826", "name": "微山县" }, { "id": "370827", "name": "鱼台县" }, { "id": "370828", "name": "金乡县" }, { "id": "370829", "name": "嘉祥县" }, { "id": "370830", "name": "汶上县" }, { "id": "370831", "name": "泗水县" }, { "id": "370832", "name": "梁山县" }, { "id": "370881", "name": "曲阜市" }, { "id": "370883", "name": "邹城市" }] }, { "id": "370900", "name": "泰安市", "child": [{ "id": "370902", "name": "泰山区" }, { "id": "370911", "name": "岱岳区" }, { "id": "370921", "name": "宁阳县" }, { "id": "370923", "name": "东平县" }, { "id": "370982", "name": "新泰市" }, { "id": "370983", "name": "肥城市" }] }, { "id": "371000", "name": "威海市", "child": [{ "id": "371002", "name": "环翠区" }, { "id": "371003", "name": "文登区" }, { "id": "371082", "name": "荣成市" }, { "id": "371083", "name": "乳山市" }] }, { "id": "371100", "name": "日照市", "child": [{ "id": "371102", "name": "东港区" }, { "id": "371103", "name": "岚山区" }, { "id": "371121", "name": "五莲县" }, { "id": "371122", "name": "莒县" }] }, { "id": "371200", "name": "莱芜市", "child": [{ "id": "371202", "name": "莱城区" }, { "id": "371203", "name": "钢城区" }] }, { "id": "371300", "name": "临沂市", "child": [{ "id": "371302", "name": "兰山区" }, { "id": "371311", "name": "罗庄区" }, { "id": "371312", "name": "河东区" }, { "id": "371321", "name": "沂南县" }, { "id": "371322", "name": "郯城县" }, { "id": "371323", "name": "沂水县" }, { "id": "371324", "name": "兰陵县" }, { "id": "371325", "name": "费县" }, { "id": "371326", "name": "平邑县" }, { "id": "371327", "name": "莒南县" }, { "id": "371328", "name": "蒙阴县" }, { "id": "371329", "name": "临沭县" }] }, { "id": "371400", "name": "德州市", "child": [{ "id": "371402", "name": "德城区" }, { "id": "371403", "name": "陵城区" }, { "id": "371422", "name": "宁津县" }, { "id": "371423", "name": "庆云县" }, { "id": "371424", "name": "临邑县" }, { "id": "371425", "name": "齐河县" }, { "id": "371426", "name": "平原县" }, { "id": "371427", "name": "夏津县" }, { "id": "371428", "name": "武城县" }, { "id": "371481", "name": "乐陵市" }, { "id": "371482", "name": "禹城市" }] }, { "id": "371500", "name": "聊城市", "child": [{ "id": "371502", "name": "东昌府区" }, { "id": "371521", "name": "阳谷县" }, { "id": "371522", "name": "莘县" }, { "id": "371523", "name": "茌平县" }, { "id": "371524", "name": "东阿县" }, { "id": "371525", "name": "冠县" }, { "id": "371526", "name": "高唐县" }, { "id": "371581", "name": "临清市" }] }, { "id": "371600", "name": "滨州市", "child": [{ "id": "371602", "name": "滨城区" }, { "id": "371603", "name": "沾化区" }, { "id": "371621", "name": "惠民县" }, { "id": "371622", "name": "阳信县" }, { "id": "371623", "name": "无棣县" }, { "id": "371625", "name": "博兴县" }, { "id": "371626", "name": "邹平县" }] }, { "id": "371700", "name": "菏泽市", "child": [{ "id": "371702", "name": "牡丹区" }, { "id": "371703", "name": "定陶区" }, { "id": "371721", "name": "曹县" }, { "id": "371722", "name": "单县" }, { "id": "371723", "name": "成武县" }, { "id": "371724", "name": "巨野县" }, { "id": "371725", "name": "郓城县" }, { "id": "371726", "name": "鄄城县" }, { "id": "371728", "name": "东明县" }] }] }, { "id": "410000", "name": "河南省", "child": [{ "id": "410100", "name": "郑州市", "child": [{ "id": "410102", "name": "中原区" }, { "id": "410103", "name": "二七区" }, { "id": "410104", "name": "管城回族区" }, { "id": "410105", "name": "金水区" }, { "id": "410106", "name": "上街区" }, { "id": "410108", "name": "惠济区" }, { "id": "410122", "name": "中牟县" }, { "id": "410181", "name": "巩义市" }, { "id": "410182", "name": "荥阳市" }, { "id": "410183", "name": "新密市" }, { "id": "410184", "name": "新郑市" }, { "id": "410185", "name": "登封市" }] }, { "id": "410200", "name": "开封市", "child": [{ "id": "410202", "name": "龙亭区" }, { "id": "410203", "name": "顺河回族区" }, { "id": "410204", "name": "鼓楼区" }, { "id": "410205", "name": "禹王台区" }, { "id": "410212", "name": "祥符区" }, { "id": "410221", "name": "杞县" }, { "id": "410222", "name": "通许县" }, { "id": "410223", "name": "尉氏县" }, { "id": "410225", "name": "兰考县" }] }, { "id": "410300", "name": "洛阳市", "child": [{ "id": "410302", "name": "老城区" }, { "id": "410303", "name": "西工区" }, { "id": "410304", "name": "瀍河回族区" }, { "id": "410305", "name": "涧西区" }, { "id": "410306", "name": "吉利区" }, { "id": "410311", "name": "洛龙区" }, { "id": "410322", "name": "孟津县" }, { "id": "410323", "name": "新安县" }, { "id": "410324", "name": "栾川县" }, { "id": "410325", "name": "嵩县" }, { "id": "410326", "name": "汝阳县" }, { "id": "410327", "name": "宜阳县" }, { "id": "410328", "name": "洛宁县" }, { "id": "410329", "name": "伊川县" }, { "id": "410381", "name": "偃师市" }] }, { "id": "410400", "name": "平顶山市", "child": [{ "id": "410402", "name": "新华区" }, { "id": "410403", "name": "卫东区" }, { "id": "410404", "name": "石龙区" }, { "id": "410411", "name": "湛河区" }, { "id": "410421", "name": "宝丰县" }, { "id": "410422", "name": "叶县" }, { "id": "410423", "name": "鲁山县" }, { "id": "410425", "name": "郏县" }, { "id": "410481", "name": "舞钢市" }, { "id": "410482", "name": "汝州市" }] }, { "id": "410500", "name": "安阳市", "child": [{ "id": "410502", "name": "文峰区" }, { "id": "410503", "name": "北关区" }, { "id": "410505", "name": "殷都区" }, { "id": "410506", "name": "龙安区" }, { "id": "410522", "name": "安阳县" }, { "id": "410523", "name": "汤阴县" }, { "id": "410526", "name": "滑县" }, { "id": "410527", "name": "内黄县" }, { "id": "410581", "name": "林州市" }] }, { "id": "410600", "name": "鹤壁市", "child": [{ "id": "410602", "name": "鹤山区" }, { "id": "410603", "name": "山城区" }, { "id": "410611", "name": "淇滨区" }, { "id": "410621", "name": "浚县" }, { "id": "410622", "name": "淇县" }] }, { "id": "410700", "name": "新乡市", "child": [{ "id": "410702", "name": "红旗区" }, { "id": "410703", "name": "卫滨区" }, { "id": "410704", "name": "凤泉区" }, { "id": "410711", "name": "牧野区" }, { "id": "410721", "name": "新乡县" }, { "id": "410724", "name": "获嘉县" }, { "id": "410725", "name": "原阳县" }, { "id": "410726", "name": "延津县" }, { "id": "410727", "name": "封丘县" }, { "id": "410728", "name": "长垣县" }, { "id": "410781", "name": "卫辉市" }, { "id": "410782", "name": "辉县市" }] }, { "id": "410800", "name": "焦作市", "child": [{ "id": "410802", "name": "解放区" }, { "id": "410803", "name": "中站区" }, { "id": "410804", "name": "马村区" }, { "id": "410811", "name": "山阳区" }, { "id": "410821", "name": "修武县" }, { "id": "410822", "name": "博爱县" }, { "id": "410823", "name": "武陟县" }, { "id": "410825", "name": "温县" }, { "id": "410882", "name": "沁阳市" }, { "id": "410883", "name": "孟州市" }] }, { "id": "410900", "name": "濮阳市", "child": [{ "id": "410902", "name": "华龙区" }, { "id": "410922", "name": "清丰县" }, { "id": "410923", "name": "南乐县" }, { "id": "410926", "name": "范县" }, { "id": "410927", "name": "台前县" }, { "id": "410928", "name": "濮阳县" }] }, { "id": "411000", "name": "许昌市", "child": [{ "id": "411002", "name": "魏都区" }, { "id": "411003", "name": "建安区" }, { "id": "411024", "name": "鄢陵县" }, { "id": "411025", "name": "襄城县" }, { "id": "411081", "name": "禹州市" }, { "id": "411082", "name": "长葛市" }] }, { "id": "411100", "name": "漯河市", "child": [{ "id": "411102", "name": "源汇区" }, { "id": "411103", "name": "郾城区" }, { "id": "411104", "name": "召陵区" }, { "id": "411121", "name": "舞阳县" }, { "id": "411122", "name": "临颍县" }] }, { "id": "411200", "name": "三门峡市", "child": [{ "id": "411202", "name": "湖滨区" }, { "id": "411203", "name": "陕州区" }, { "id": "411221", "name": "渑池县" }, { "id": "411224", "name": "卢氏县" }, { "id": "411281", "name": "义马市" }, { "id": "411282", "name": "灵宝市" }] }, { "id": "411300", "name": "南阳市", "child": [{ "id": "411302", "name": "宛城区" }, { "id": "411303", "name": "卧龙区" }, { "id": "411321", "name": "南召县" }, { "id": "411322", "name": "方城县" }, { "id": "411323", "name": "西峡县" }, { "id": "411324", "name": "镇平县" }, { "id": "411325", "name": "内乡县" }, { "id": "411326", "name": "淅川县" }, { "id": "411327", "name": "社旗县" }, { "id": "411328", "name": "唐河县" }, { "id": "411329", "name": "新野县" }, { "id": "411330", "name": "桐柏县" }, { "id": "411381", "name": "邓州市" }] }, { "id": "411400", "name": "商丘市", "child": [{ "id": "411402", "name": "梁园区" }, { "id": "411403", "name": "睢阳区" }, { "id": "411421", "name": "民权县" }, { "id": "411422", "name": "睢县" }, { "id": "411423", "name": "宁陵县" }, { "id": "411424", "name": "柘城县" }, { "id": "411425", "name": "虞城县" }, { "id": "411426", "name": "夏邑县" }, { "id": "411481", "name": "永城市" }] }, { "id": "411500", "name": "信阳市", "child": [{ "id": "411502", "name": "浉河区" }, { "id": "411503", "name": "平桥区" }, { "id": "411521", "name": "罗山县" }, { "id": "411522", "name": "光山县" }, { "id": "411523", "name": "新县" }, { "id": "411524", "name": "商城县" }, { "id": "411525", "name": "固始县" }, { "id": "411526", "name": "潢川县" }, { "id": "411527", "name": "淮滨县" }, { "id": "411528", "name": "息县" }] }, { "id": "411600", "name": "周口市", "child": [{ "id": "411602", "name": "川汇区" }, { "id": "411621", "name": "扶沟县" }, { "id": "411622", "name": "西华县" }, { "id": "411623", "name": "商水县" }, { "id": "411624", "name": "沈丘县" }, { "id": "411625", "name": "郸城县" }, { "id": "411626", "name": "淮阳县" }, { "id": "411627", "name": "太康县" }, { "id": "411628", "name": "鹿邑县" }, { "id": "411681", "name": "项城市" }] }, { "id": "411700", "name": "驻马店市", "child": [{ "id": "411702", "name": "驿城区" }, { "id": "411721", "name": "西平县" }, { "id": "411722", "name": "上蔡县" }, { "id": "411723", "name": "平舆县" }, { "id": "411724", "name": "正阳县" }, { "id": "411725", "name": "确山县" }, { "id": "411726", "name": "泌阳县" }, { "id": "411727", "name": "汝南县" }, { "id": "411728", "name": "遂平县" }, { "id": "411729", "name": "新蔡县" }] }] }, { "id": "420000", "name": "湖北省", "child": [{ "id": "420100", "name": "武汉市", "child": [{ "id": "420102", "name": "江岸区" }, { "id": "420103", "name": "江汉区" }, { "id": "420104", "name": "硚口区" }, { "id": "420105", "name": "汉阳区" }, { "id": "420106", "name": "武昌区" }, { "id": "420107", "name": "青山区" }, { "id": "420111", "name": "洪山区" }, { "id": "420112", "name": "东西湖区" }, { "id": "420113", "name": "汉南区" }, { "id": "420114", "name": "蔡甸区" }, { "id": "420115", "name": "江夏区" }, { "id": "420116", "name": "黄陂区" }, { "id": "420117", "name": "新洲区" }] }, { "id": "420200", "name": "黄石市", "child": [{ "id": "420202", "name": "黄石港区" }, { "id": "420203", "name": "西塞山区" }, { "id": "420204", "name": "下陆区" }, { "id": "420205", "name": "铁山区" }, { "id": "420222", "name": "阳新县" }, { "id": "420281", "name": "大冶市" }] }, { "id": "420300", "name": "十堰市", "child": [{ "id": "420302", "name": "茅箭区" }, { "id": "420303", "name": "张湾区" }, { "id": "420304", "name": "郧阳区" }, { "id": "420322", "name": "郧西县" }, { "id": "420323", "name": "竹山县" }, { "id": "420324", "name": "竹溪县" }, { "id": "420325", "name": "房县" }, { "id": "420381", "name": "丹江口市" }] }, { "id": "420500", "name": "宜昌市", "child": [{ "id": "420502", "name": "西陵区" }, { "id": "420503", "name": "伍家岗区" }, { "id": "420504", "name": "点军区" }, { "id": "420505", "name": "猇亭区" }, { "id": "420506", "name": "夷陵区" }, { "id": "420525", "name": "远安县" }, { "id": "420526", "name": "兴山县" }, { "id": "420527", "name": "秭归县" }, { "id": "420528", "name": "长阳土家族自治县" }, { "id": "420529", "name": "五峰土家族自治县" }, { "id": "420581", "name": "宜都市" }, { "id": "420582", "name": "当阳市" }, { "id": "420583", "name": "枝江市" }] }, { "id": "420600", "name": "襄阳市", "child": [{ "id": "420602", "name": "襄城区" }, { "id": "420606", "name": "樊城区" }, { "id": "420607", "name": "襄州区" }, { "id": "420624", "name": "南漳县" }, { "id": "420625", "name": "谷城县" }, { "id": "420626", "name": "保康县" }, { "id": "420682", "name": "老河口市" }, { "id": "420683", "name": "枣阳市" }, { "id": "420684", "name": "宜城市" }] }, { "id": "420700", "name": "鄂州市", "child": [{ "id": "420702", "name": "梁子湖区" }, { "id": "420703", "name": "华容区" }, { "id": "420704", "name": "鄂城区" }] }, { "id": "420800", "name": "荆门市", "child": [{ "id": "420802", "name": "东宝区" }, { "id": "420804", "name": "掇刀区" }, { "id": "420822", "name": "沙洋县" }, { "id": "420881", "name": "钟祥市" }, { "id": "420882", "name": "京山市" }] }, { "id": "420900", "name": "孝感市", "child": [{ "id": "420902", "name": "孝南区" }, { "id": "420921", "name": "孝昌县" }, { "id": "420922", "name": "大悟县" }, { "id": "420923", "name": "云梦县" }, { "id": "420981", "name": "应城市" }, { "id": "420982", "name": "安陆市" }, { "id": "420984", "name": "汉川市" }] }, { "id": "421000", "name": "荆州市", "child": [{ "id": "421002", "name": "沙市区" }, { "id": "421003", "name": "荆州区" }, { "id": "421022", "name": "公安县" }, { "id": "421023", "name": "监利县" }, { "id": "421024", "name": "江陵县" }, { "id": "421081", "name": "石首市" }, { "id": "421083", "name": "洪湖市" }, { "id": "421087", "name": "松滋市" }] }, { "id": "421100", "name": "黄冈市", "child": [{ "id": "421102", "name": "黄州区" }, { "id": "421121", "name": "团风县" }, { "id": "421122", "name": "红安县" }, { "id": "421123", "name": "罗田县" }, { "id": "421124", "name": "英山县" }, { "id": "421125", "name": "浠水县" }, { "id": "421126", "name": "蕲春县" }, { "id": "421127", "name": "黄梅县" }, { "id": "421181", "name": "麻城市" }, { "id": "421182", "name": "武穴市" }] }, { "id": "421200", "name": "咸宁市", "child": [{ "id": "421202", "name": "咸安区" }, { "id": "421221", "name": "嘉鱼县" }, { "id": "421222", "name": "通城县" }, { "id": "421223", "name": "崇阳县" }, { "id": "421224", "name": "通山县" }, { "id": "421281", "name": "赤壁市" }] }, { "id": "421300", "name": "随州市", "child": [{ "id": "421303", "name": "曾都区" }, { "id": "421321", "name": "随县" }, { "id": "421381", "name": "广水市" }] }, { "id": "422800", "name": "恩施土家族苗族自治州", "child": [{ "id": "422801", "name": "恩施市" }, { "id": "422802", "name": "利川市" }, { "id": "422822", "name": "建始县" }, { "id": "422823", "name": "巴东县" }, { "id": "422825", "name": "宣恩县" }, { "id": "422826", "name": "咸丰县" }, { "id": "422827", "name": "来凤县" }, { "id": "422828", "name": "鹤峰县" }] }] }, { "id": "430000", "name": "湖南省", "child": [{ "id": "430100", "name": "长沙市", "child": [{ "id": "430102", "name": "芙蓉区" }, { "id": "430103", "name": "天心区" }, { "id": "430104", "name": "岳麓区" }, { "id": "430105", "name": "开福区" }, { "id": "430111", "name": "雨花区" }, { "id": "430112", "name": "望城区" }, { "id": "430121", "name": "长沙县" }, { "id": "430181", "name": "浏阳市" }, { "id": "430182", "name": "宁乡市" }] }, { "id": "430200", "name": "株洲市", "child": [{ "id": "430202", "name": "荷塘区" }, { "id": "430203", "name": "芦淞区" }, { "id": "430204", "name": "石峰区" }, { "id": "430211", "name": "天元区" }, { "id": "430212", "name": "渌口区" }, { "id": "430223", "name": "攸县" }, { "id": "430224", "name": "茶陵县" }, { "id": "430225", "name": "炎陵县" }, { "id": "430281", "name": "醴陵市" }] }, { "id": "430300", "name": "湘潭市", "child": [{ "id": "430302", "name": "雨湖区" }, { "id": "430304", "name": "岳塘区" }, { "id": "430321", "name": "湘潭县" }, { "id": "430381", "name": "湘乡市" }, { "id": "430382", "name": "韶山市" }] }, { "id": "430400", "name": "衡阳市", "child": [{ "id": "430405", "name": "珠晖区" }, { "id": "430406", "name": "雁峰区" }, { "id": "430407", "name": "石鼓区" }, { "id": "430408", "name": "蒸湘区" }, { "id": "430412", "name": "南岳区" }, { "id": "430421", "name": "衡阳县" }, { "id": "430422", "name": "衡南县" }, { "id": "430423", "name": "衡山县" }, { "id": "430424", "name": "衡东县" }, { "id": "430426", "name": "祁东县" }, { "id": "430481", "name": "耒阳市" }, { "id": "430482", "name": "常宁市" }] }, { "id": "430500", "name": "邵阳市", "child": [{ "id": "430502", "name": "双清区" }, { "id": "430503", "name": "大祥区" }, { "id": "430511", "name": "北塔区" }, { "id": "430521", "name": "邵东县" }, { "id": "430522", "name": "新邵县" }, { "id": "430523", "name": "邵阳县" }, { "id": "430524", "name": "隆回县" }, { "id": "430525", "name": "洞口县" }, { "id": "430527", "name": "绥宁县" }, { "id": "430528", "name": "新宁县" }, { "id": "430529", "name": "城步苗族自治县" }, { "id": "430581", "name": "武冈市" }] }, { "id": "430600", "name": "岳阳市", "child": [{ "id": "430602", "name": "岳阳楼区" }, { "id": "430603", "name": "云溪区" }, { "id": "430611", "name": "君山区" }, { "id": "430621", "name": "岳阳县" }, { "id": "430623", "name": "华容县" }, { "id": "430624", "name": "湘阴县" }, { "id": "430626", "name": "平江县" }, { "id": "430681", "name": "汨罗市" }, { "id": "430682", "name": "临湘市" }] }, { "id": "430700", "name": "常德市", "child": [{ "id": "430702", "name": "武陵区" }, { "id": "430703", "name": "鼎城区" }, { "id": "430721", "name": "安乡县" }, { "id": "430722", "name": "汉寿县" }, { "id": "430723", "name": "澧县" }, { "id": "430724", "name": "临澧县" }, { "id": "430725", "name": "桃源县" }, { "id": "430726", "name": "石门县" }, { "id": "430781", "name": "津市市" }] }, { "id": "430800", "name": "张家界市", "child": [{ "id": "430802", "name": "永定区" }, { "id": "430811", "name": "武陵源区" }, { "id": "430821", "name": "慈利县" }, { "id": "430822", "name": "桑植县" }] }, { "id": "430900", "name": "益阳市", "child": [{ "id": "430902", "name": "资阳区" }, { "id": "430903", "name": "赫山区" }, { "id": "430921", "name": "南县" }, { "id": "430922", "name": "桃江县" }, { "id": "430923", "name": "安化县" }, { "id": "430981", "name": "沅江市" }] }, { "id": "431000", "name": "郴州市", "child": [{ "id": "431002", "name": "北湖区" }, { "id": "431003", "name": "苏仙区" }, { "id": "431021", "name": "桂阳县" }, { "id": "431022", "name": "宜章县" }, { "id": "431023", "name": "永兴县" }, { "id": "431024", "name": "嘉禾县" }, { "id": "431025", "name": "临武县" }, { "id": "431026", "name": "汝城县" }, { "id": "431027", "name": "桂东县" }, { "id": "431028", "name": "安仁县" }, { "id": "431081", "name": "资兴市" }] }, { "id": "431100", "name": "永州市", "child": [{ "id": "431102", "name": "零陵区" }, { "id": "431103", "name": "冷水滩区" }, { "id": "431121", "name": "祁阳县" }, { "id": "431122", "name": "东安县" }, { "id": "431123", "name": "双牌县" }, { "id": "431124", "name": "道县" }, { "id": "431125", "name": "江永县" }, { "id": "431126", "name": "宁远县" }, { "id": "431127", "name": "蓝山县" }, { "id": "431128", "name": "新田县" }, { "id": "431129", "name": "江华瑶族自治县" }] }, { "id": "431200", "name": "怀化市", "child": [{ "id": "431202", "name": "鹤城区" }, { "id": "431221", "name": "中方县" }, { "id": "431222", "name": "沅陵县" }, { "id": "431223", "name": "辰溪县" }, { "id": "431224", "name": "溆浦县" }, { "id": "431225", "name": "会同县" }, { "id": "431226", "name": "麻阳苗族自治县" }, { "id": "431227", "name": "新晃侗族自治县" }, { "id": "431228", "name": "芷江侗族自治县" }, { "id": "431229", "name": "靖州苗族侗族自治县" }, { "id": "431230", "name": "通道侗族自治县" }, { "id": "431281", "name": "洪江市" }] }, { "id": "431300", "name": "娄底市", "child": [{ "id": "431302", "name": "娄星区" }, { "id": "431321", "name": "双峰县" }, { "id": "431322", "name": "新化县" }, { "id": "431381", "name": "冷水江市" }, { "id": "431382", "name": "涟源市" }] }, { "id": "433100", "name": "湘西土家族苗族自治州", "child": [{ "id": "433101", "name": "吉首市" }, { "id": "433122", "name": "泸溪县" }, { "id": "433123", "name": "凤凰县" }, { "id": "433124", "name": "花垣县" }, { "id": "433125", "name": "保靖县" }, { "id": "433126", "name": "古丈县" }, { "id": "433127", "name": "永顺县" }, { "id": "433130", "name": "龙山县" }] }] }, { "id": "440000", "name": "广东省", "child": [{ "id": "440100", "name": "广州市", "child": [{ "id": "440103", "name": "荔湾区" }, { "id": "440104", "name": "越秀区" }, { "id": "440105", "name": "海珠区" }, { "id": "440106", "name": "天河区" }, { "id": "440111", "name": "白云区" }, { "id": "440112", "name": "黄埔区" }, { "id": "440113", "name": "番禺区" }, { "id": "440114", "name": "花都区" }, { "id": "440115", "name": "南沙区" }, { "id": "440117", "name": "从化区" }, { "id": "440118", "name": "增城区" }] }, { "id": "440200", "name": "韶关市", "child": [{ "id": "440203", "name": "武江区" }, { "id": "440204", "name": "浈江区" }, { "id": "440205", "name": "曲江区" }, { "id": "440222", "name": "始兴县" }, { "id": "440224", "name": "仁化县" }, { "id": "440229", "name": "翁源县" }, { "id": "440232", "name": "乳源瑶族自治县" }, { "id": "440233", "name": "新丰县" }, { "id": "440281", "name": "乐昌市" }, { "id": "440282", "name": "南雄市" }] }, { "id": "440300", "name": "深圳市", "child": [{ "id": "440303", "name": "罗湖区" }, { "id": "440304", "name": "福田区" }, { "id": "440305", "name": "南山区" }, { "id": "440306", "name": "宝安区" }, { "id": "440307", "name": "龙岗区" }, { "id": "440308", "name": "盐田区" }, { "id": "440309", "name": "龙华区" }, { "id": "440310", "name": "坪山区" }, { "id": "440311", "name": "光明区" }] }, { "id": "440400", "name": "珠海市", "child": [{ "id": "440402", "name": "香洲区" }, { "id": "440403", "name": "斗门区" }, { "id": "440404", "name": "金湾区" }] }, { "id": "440500", "name": "汕头市", "child": [{ "id": "440507", "name": "龙湖区" }, { "id": "440511", "name": "金平区" }, { "id": "440512", "name": "濠江区" }, { "id": "440513", "name": "潮阳区" }, { "id": "440514", "name": "潮南区" }, { "id": "440515", "name": "澄海区" }, { "id": "440523", "name": "南澳县" }] }, { "id": "440600", "name": "佛山市", "child": [{ "id": "440604", "name": "禅城区" }, { "id": "440605", "name": "南海区" }, { "id": "440606", "name": "顺德区" }, { "id": "440607", "name": "三水区" }, { "id": "440608", "name": "高明区" }] }, { "id": "440700", "name": "江门市", "child": [{ "id": "440703", "name": "蓬江区" }, { "id": "440704", "name": "江海区" }, { "id": "440705", "name": "新会区" }, { "id": "440781", "name": "台山市" }, { "id": "440783", "name": "开平市" }, { "id": "440784", "name": "鹤山市" }, { "id": "440785", "name": "恩平市" }] }, { "id": "440800", "name": "湛江市", "child": [{ "id": "440802", "name": "赤坎区" }, { "id": "440803", "name": "霞山区" }, { "id": "440804", "name": "坡头区" }, { "id": "440811", "name": "麻章区" }, { "id": "440823", "name": "遂溪县" }, { "id": "440825", "name": "徐闻县" }, { "id": "440881", "name": "廉江市" }, { "id": "440882", "name": "雷州市" }, { "id": "440883", "name": "吴川市" }] }, { "id": "440900", "name": "茂名市", "child": [{ "id": "440902", "name": "茂南区" }, { "id": "440904", "name": "电白区" }, { "id": "440981", "name": "高州市" }, { "id": "440982", "name": "化州市" }, { "id": "440983", "name": "信宜市" }] }, { "id": "441200", "name": "肇庆市", "child": [{ "id": "441202", "name": "端州区" }, { "id": "441203", "name": "鼎湖区" }, { "id": "441204", "name": "高要区" }, { "id": "441223", "name": "广宁县" }, { "id": "441224", "name": "怀集县" }, { "id": "441225", "name": "封开县" }, { "id": "441226", "name": "德庆县" }, { "id": "441284", "name": "四会市" }] }, { "id": "441300", "name": "惠州市", "child": [{ "id": "441302", "name": "惠城区" }, { "id": "441303", "name": "惠阳区" }, { "id": "441322", "name": "博罗县" }, { "id": "441323", "name": "惠东县" }, { "id": "441324", "name": "龙门县" }] }, { "id": "441400", "name": "梅州市", "child": [{ "id": "441402", "name": "梅江区" }, { "id": "441403", "name": "梅县区" }, { "id": "441422", "name": "大埔县" }, { "id": "441423", "name": "丰顺县" }, { "id": "441424", "name": "五华县" }, { "id": "441426", "name": "平远县" }, { "id": "441427", "name": "蕉岭县" }, { "id": "441481", "name": "兴宁市" }] }, { "id": "441500", "name": "汕尾市", "child": [{ "id": "441502", "name": "城区" }, { "id": "441521", "name": "海丰县" }, { "id": "441523", "name": "陆河县" }, { "id": "441581", "name": "陆丰市" }] }, { "id": "441600", "name": "河源市", "child": [{ "id": "441602", "name": "源城区" }, { "id": "441621", "name": "紫金县" }, { "id": "441622", "name": "龙川县" }, { "id": "441623", "name": "连平县" }, { "id": "441624", "name": "和平县" }, { "id": "441625", "name": "东源县" }] }, { "id": "441700", "name": "阳江市", "child": [{ "id": "441702", "name": "江城区" }, { "id": "441704", "name": "阳东区" }, { "id": "441721", "name": "阳西县" }, { "id": "441781", "name": "阳春市" }] }, { "id": "441800", "name": "清远市", "child": [{ "id": "441802", "name": "清城区" }, { "id": "441803", "name": "清新区" }, { "id": "441821", "name": "佛冈县" }, { "id": "441823", "name": "阳山县" }, { "id": "441825", "name": "连山壮族瑶族自治县" }, { "id": "441826", "name": "连南瑶族自治县" }, { "id": "441881", "name": "英德市" }, { "id": "441882", "name": "连州市" }] }, { "id": "441900", "name": "东莞市", "child": [] }, { "id": "442000", "name": "中山市", "child": [] }, { "id": "445100", "name": "潮州市", "child": [{ "id": "445102", "name": "湘桥区" }, { "id": "445103", "name": "潮安区" }, { "id": "445122", "name": "饶平县" }] }, { "id": "445200", "name": "揭阳市", "child": [{ "id": "445202", "name": "榕城区" }, { "id": "445203", "name": "揭东区" }, { "id": "445222", "name": "揭西县" }, { "id": "445224", "name": "惠来县" }, { "id": "445281", "name": "普宁市" }] }, { "id": "445300", "name": "云浮市", "child": [{ "id": "445302", "name": "云城区" }, { "id": "445303", "name": "云安区" }, { "id": "445321", "name": "新兴县" }, { "id": "445322", "name": "郁南县" }, { "id": "445381", "name": "罗定市" }] }] }, { "id": "450000", "name": "广西壮族自治区", "child": [{ "id": "450100", "name": "南宁市", "child": [{ "id": "450102", "name": "兴宁区" }, { "id": "450103", "name": "青秀区" }, { "id": "450105", "name": "江南区" }, { "id": "450107", "name": "西乡塘区" }, { "id": "450108", "name": "良庆区" }, { "id": "450109", "name": "邕宁区" }, { "id": "450110", "name": "武鸣区" }, { "id": "450123", "name": "隆安县" }, { "id": "450124", "name": "马山县" }, { "id": "450125", "name": "上林县" }, { "id": "450126", "name": "宾阳县" }, { "id": "450127", "name": "横县" }] }, { "id": "450200", "name": "柳州市", "child": [{ "id": "450202", "name": "城中区" }, { "id": "450203", "name": "鱼峰区" }, { "id": "450204", "name": "柳南区" }, { "id": "450205", "name": "柳北区" }, { "id": "450206", "name": "柳江区" }, { "id": "450222", "name": "柳城县" }, { "id": "450223", "name": "鹿寨县" }, { "id": "450224", "name": "融安县" }, { "id": "450225", "name": "融水苗族自治县" }, { "id": "450226", "name": "三江侗族自治县" }] }, { "id": "450300", "name": "桂林市", "child": [{ "id": "450302", "name": "秀峰区" }, { "id": "450303", "name": "叠彩区" }, { "id": "450304", "name": "象山区" }, { "id": "450305", "name": "七星区" }, { "id": "450311", "name": "雁山区" }, { "id": "450312", "name": "临桂区" }, { "id": "450321", "name": "阳朔县" }, { "id": "450323", "name": "灵川县" }, { "id": "450324", "name": "全州县" }, { "id": "450325", "name": "兴安县" }, { "id": "450326", "name": "永福县" }, { "id": "450327", "name": "灌阳县" }, { "id": "450328", "name": "龙胜各族自治县" }, { "id": "450329", "name": "资源县" }, { "id": "450330", "name": "平乐县" }, { "id": "450381", "name": "荔浦市" }, { "id": "450332", "name": "恭城瑶族自治县" }] }, { "id": "450400", "name": "梧州市", "child": [{ "id": "450403", "name": "万秀区" }, { "id": "450405", "name": "长洲区" }, { "id": "450406", "name": "龙圩区" }, { "id": "450421", "name": "苍梧县" }, { "id": "450422", "name": "藤县" }, { "id": "450423", "name": "蒙山县" }, { "id": "450481", "name": "岑溪市" }] }, { "id": "450500", "name": "北海市", "child": [{ "id": "450502", "name": "海城区" }, { "id": "450503", "name": "银海区" }, { "id": "450512", "name": "铁山港区" }, { "id": "450521", "name": "合浦县" }] }, { "id": "450600", "name": "防城港市", "child": [{ "id": "450602", "name": "港口区" }, { "id": "450603", "name": "防城区" }, { "id": "450621", "name": "上思县" }, { "id": "450681", "name": "东兴市" }] }, { "id": "450700", "name": "钦州市", "child": [{ "id": "450702", "name": "钦南区" }, { "id": "450703", "name": "钦北区" }, { "id": "450721", "name": "灵山县" }, { "id": "450722", "name": "浦北县" }] }, { "id": "450800", "name": "贵港市", "child": [{ "id": "450802", "name": "港北区" }, { "id": "450803", "name": "港南区" }, { "id": "450804", "name": "覃塘区" }, { "id": "450821", "name": "平南县" }, { "id": "450881", "name": "桂平市" }] }, { "id": "450900", "name": "玉林市", "child": [{ "id": "450902", "name": "玉州区" }, { "id": "450903", "name": "福绵区" }, { "id": "450921", "name": "容县" }, { "id": "450922", "name": "陆川县" }, { "id": "450923", "name": "博白县" }, { "id": "450924", "name": "兴业县" }, { "id": "450981", "name": "北流市" }] }, { "id": "451000", "name": "百色市", "child": [{ "id": "451002", "name": "右江区" }, { "id": "451021", "name": "田阳县" }, { "id": "451022", "name": "田东县" }, { "id": "451023", "name": "平果县" }, { "id": "451024", "name": "德保县" }, { "id": "451026", "name": "那坡县" }, { "id": "451027", "name": "凌云县" }, { "id": "451028", "name": "乐业县" }, { "id": "451029", "name": "田林县" }, { "id": "451030", "name": "西林县" }, { "id": "451031", "name": "隆林各族自治县" }, { "id": "451081", "name": "靖西市" }] }, { "id": "451100", "name": "贺州市", "child": [{ "id": "451102", "name": "八步区" }, { "id": "451103", "name": "平桂区" }, { "id": "451121", "name": "昭平县" }, { "id": "451122", "name": "钟山县" }, { "id": "451123", "name": "富川瑶族自治县" }] }, { "id": "451200", "name": "河池市", "child": [{ "id": "451202", "name": "金城江区" }, { "id": "451203", "name": "宜州区" }, { "id": "451221", "name": "南丹县" }, { "id": "451222", "name": "天峨县" }, { "id": "451223", "name": "凤山县" }, { "id": "451224", "name": "东兰县" }, { "id": "451225", "name": "罗城仫佬族自治县" }, { "id": "451226", "name": "环江毛南族自治县" }, { "id": "451227", "name": "巴马瑶族自治县" }, { "id": "451228", "name": "都安瑶族自治县" }, { "id": "451229", "name": "大化瑶族自治县" }] }, { "id": "451300", "name": "来宾市", "child": [{ "id": "451302", "name": "兴宾区" }, { "id": "451321", "name": "忻城县" }, { "id": "451322", "name": "象州县" }, { "id": "451323", "name": "武宣县" }, { "id": "451324", "name": "金秀瑶族自治县" }, { "id": "451381", "name": "合山市" }] }, { "id": "451400", "name": "崇左市", "child": [{ "id": "451402", "name": "江州区" }, { "id": "451421", "name": "扶绥县" }, { "id": "451422", "name": "宁明县" }, { "id": "451423", "name": "龙州县" }, { "id": "451424", "name": "大新县" }, { "id": "451425", "name": "天等县" }, { "id": "451481", "name": "凭祥市" }] }] }, { "id": "460000", "name": "海南省", "child": [{ "id": "460100", "name": "海口市", "child": [{ "id": "460105", "name": "秀英区" }, { "id": "460106", "name": "龙华区" }, { "id": "460107", "name": "琼山区" }, { "id": "460108", "name": "美兰区" }] }, { "id": "460200", "name": "三亚市", "child": [{ "id": "460202", "name": "海棠区" }, { "id": "460203", "name": "吉阳区" }, { "id": "460204", "name": "天涯区" }, { "id": "460205", "name": "崖州区" }] }, { "id": "460300", "name": "三沙市", "child": [] }, { "id": "460400", "name": "儋州市", "child": [] }] }, { "id": "500000", "name": "重庆市", "child": [{ "id": "500000", "name": "重庆市", "child": [{ "id": "500101", "name": "万州区" }, { "id": "500102", "name": "涪陵区" }, { "id": "500103", "name": "渝中区" }, { "id": "500104", "name": "大渡口区" }, { "id": "500105", "name": "江北区" }, { "id": "500106", "name": "沙坪坝区" }, { "id": "500107", "name": "九龙坡区" }, { "id": "500108", "name": "南岸区" }, { "id": "500109", "name": "北碚区" }, { "id": "500110", "name": "綦江区" }, { "id": "500111", "name": "大足区" }, { "id": "500112", "name": "渝北区" }, { "id": "500113", "name": "巴南区" }, { "id": "500114", "name": "黔江区" }, { "id": "500115", "name": "长寿区" }, { "id": "500116", "name": "江津区" }, { "id": "500117", "name": "合川区" }, { "id": "500118", "name": "永川区" }, { "id": "500119", "name": "南川区" }, { "id": "500120", "name": "璧山区" }, { "id": "500151", "name": "铜梁区" }, { "id": "500152", "name": "潼南区" }, { "id": "500153", "name": "荣昌区" }, { "id": "500154", "name": "开州区" }, { "id": "500155", "name": "梁平区" }, { "id": "500156", "name": "武隆区" }, { "id": "500229", "name": "城口县" }, { "id": "500230", "name": "丰都县" }, { "id": "500231", "name": "垫江县" }, { "id": "500233", "name": "忠县" }, { "id": "500235", "name": "云阳县" }, { "id": "500236", "name": "奉节县" }, { "id": "500237", "name": "巫山县" }, { "id": "500238", "name": "巫溪县" }, { "id": "500240", "name": "石柱土家族自治县" }, { "id": "500241", "name": "秀山土家族苗族自治县" }, { "id": "500242", "name": "酉阳土家族苗族自治县" }, { "id": "500243", "name": "彭水苗族土家族自治县" }] }] }, { "id": "520000", "name": "贵州省", "child": [{ "id": "520100", "name": "贵阳市", "child": [{ "id": "520102", "name": "南明区" }, { "id": "520103", "name": "云岩区" }, { "id": "520111", "name": "花溪区" }, { "id": "520112", "name": "乌当区" }, { "id": "520113", "name": "白云区" }, { "id": "520115", "name": "观山湖区" }, { "id": "520121", "name": "开阳县" }, { "id": "520122", "name": "息烽县" }, { "id": "520123", "name": "修文县" }, { "id": "520181", "name": "清镇市" }] }, { "id": "520200", "name": "六盘水市", "child": [{ "id": "520201", "name": "钟山区" }, { "id": "520203", "name": "六枝特区" }, { "id": "520221", "name": "水城县" }, { "id": "520281", "name": "盘州市" }] }, { "id": "520300", "name": "遵义市", "child": [{ "id": "520302", "name": "红花岗区" }, { "id": "520303", "name": "汇川区" }, { "id": "520304", "name": "播州区" }, { "id": "520322", "name": "桐梓县" }, { "id": "520323", "name": "绥阳县" }, { "id": "520324", "name": "正安县" }, { "id": "520325", "name": "道真仡佬族苗族自治县" }, { "id": "520326", "name": "务川仡佬族苗族自治县" }, { "id": "520327", "name": "凤冈县" }, { "id": "520328", "name": "湄潭县" }, { "id": "520329", "name": "余庆县" }, { "id": "520330", "name": "习水县" }, { "id": "520381", "name": "赤水市" }, { "id": "520382", "name": "仁怀市" }] }, { "id": "520400", "name": "安顺市", "child": [{ "id": "520402", "name": "西秀区" }, { "id": "520403", "name": "平坝区" }, { "id": "520422", "name": "普定县" }, { "id": "520423", "name": "镇宁布依族苗族自治县" }, { "id": "520424", "name": "关岭布依族苗族自治县" }, { "id": "520425", "name": "紫云苗族布依族自治县" }] }, { "id": "520500", "name": "毕节市", "child": [{ "id": "520502", "name": "七星关区" }, { "id": "520521", "name": "大方县" }, { "id": "520522", "name": "黔西县" }, { "id": "520523", "name": "金沙县" }, { "id": "520524", "name": "织金县" }, { "id": "520525", "name": "纳雍县" }, { "id": "520526", "name": "威宁彝族回族苗族自治县" }, { "id": "520527", "name": "赫章县" }] }, { "id": "520600", "name": "铜仁市", "child": [{ "id": "520602", "name": "碧江区" }, { "id": "520603", "name": "万山区" }, { "id": "520621", "name": "江口县" }, { "id": "520622", "name": "玉屏侗族自治县" }, { "id": "520623", "name": "石阡县" }, { "id": "520624", "name": "思南县" }, { "id": "520625", "name": "印江土家族苗族自治县" }, { "id": "520626", "name": "德江县" }, { "id": "520627", "name": "沿河土家族自治县" }, { "id": "520628", "name": "松桃苗族自治县" }] }, { "id": "522300", "name": "黔西南布依族苗族自治州", "child": [{ "id": "522301", "name": "兴义市" }, { "id": "522322", "name": "兴仁县" }, { "id": "522323", "name": "普安县" }, { "id": "522324", "name": "晴隆县" }, { "id": "522325", "name": "贞丰县" }, { "id": "522326", "name": "望谟县" }, { "id": "522327", "name": "册亨县" }, { "id": "522328", "name": "安龙县" }] }, { "id": "522600", "name": "黔东南苗族侗族自治州", "child": [{ "id": "522601", "name": "凯里市" }, { "id": "522622", "name": "黄平县" }, { "id": "522623", "name": "施秉县" }, { "id": "522624", "name": "三穗县" }, { "id": "522625", "name": "镇远县" }, { "id": "522626", "name": "岑巩县" }, { "id": "522627", "name": "天柱县" }, { "id": "522628", "name": "锦屏县" }, { "id": "522629", "name": "剑河县" }, { "id": "522630", "name": "台江县" }, { "id": "522631", "name": "黎平县" }, { "id": "522632", "name": "榕江县" }, { "id": "522633", "name": "从江县" }, { "id": "522634", "name": "雷山县" }, { "id": "522635", "name": "麻江县" }, { "id": "522636", "name": "丹寨县" }] }, { "id": "522700", "name": "黔南布依族苗族自治州", "child": [{ "id": "522701", "name": "都匀市" }, { "id": "522702", "name": "福泉市" }, { "id": "522722", "name": "荔波县" }, { "id": "522723", "name": "贵定县" }, { "id": "522725", "name": "瓮安县" }, { "id": "522726", "name": "独山县" }, { "id": "522727", "name": "平塘县" }, { "id": "522728", "name": "罗甸县" }, { "id": "522729", "name": "长顺县" }, { "id": "522730", "name": "龙里县" }, { "id": "522731", "name": "惠水县" }, { "id": "522732", "name": "三都水族自治县" }] }] }, { "id": "530000", "name": "云南省", "child": [{ "id": "530100", "name": "昆明市", "child": [{ "id": "530102", "name": "五华区" }, { "id": "530103", "name": "盘龙区" }, { "id": "530111", "name": "官渡区" }, { "id": "530112", "name": "西山区" }, { "id": "530113", "name": "东川区" }, { "id": "530114", "name": "呈贡区" }, { "id": "530115", "name": "晋宁区" }, { "id": "530124", "name": "富民县" }, { "id": "530125", "name": "宜良县" }, { "id": "530126", "name": "石林彝族自治县" }, { "id": "530127", "name": "嵩明县" }, { "id": "530128", "name": "禄劝彝族苗族自治县" }, { "id": "530129", "name": "寻甸回族彝族自治县" }, { "id": "530181", "name": "安宁市" }] }, { "id": "530300", "name": "曲靖市", "child": [{ "id": "530302", "name": "麒麟区" }, { "id": "530303", "name": "沾益区" }, { "id": "530304", "name": "马龙区" }, { "id": "530322", "name": "陆良县" }, { "id": "530323", "name": "师宗县" }, { "id": "530324", "name": "罗平县" }, { "id": "530325", "name": "富源县" }, { "id": "530326", "name": "会泽县" }, { "id": "530381", "name": "宣威市" }] }, { "id": "530400", "name": "玉溪市", "child": [{ "id": "530402", "name": "红塔区" }, { "id": "530403", "name": "江川区" }, { "id": "530422", "name": "澄江县" }, { "id": "530423", "name": "通海县" }, { "id": "530424", "name": "华宁县" }, { "id": "530425", "name": "易门县" }, { "id": "530426", "name": "峨山彝族自治县" }, { "id": "530427", "name": "新平彝族傣族自治县" }, { "id": "530428", "name": "元江哈尼族彝族傣族自治县" }] }, { "id": "530500", "name": "保山市", "child": [{ "id": "530502", "name": "隆阳区" }, { "id": "530521", "name": "施甸县" }, { "id": "530523", "name": "龙陵县" }, { "id": "530524", "name": "昌宁县" }, { "id": "530581", "name": "腾冲市" }] }, { "id": "530600", "name": "昭通市", "child": [{ "id": "530602", "name": "昭阳区" }, { "id": "530621", "name": "鲁甸县" }, { "id": "530622", "name": "巧家县" }, { "id": "530623", "name": "盐津县" }, { "id": "530624", "name": "大关县" }, { "id": "530625", "name": "永善县" }, { "id": "530626", "name": "绥江县" }, { "id": "530627", "name": "镇雄县" }, { "id": "530628", "name": "彝良县" }, { "id": "530629", "name": "威信县" }, { "id": "530681", "name": "水富市" }] }, { "id": "530700", "name": "丽江市", "child": [{ "id": "530702", "name": "古城区" }, { "id": "530721", "name": "玉龙纳西族自治县" }, { "id": "530722", "name": "永胜县" }, { "id": "530723", "name": "华坪县" }, { "id": "530724", "name": "宁蒗彝族自治县" }] }, { "id": "530800", "name": "普洱市", "child": [{ "id": "530802", "name": "思茅区" }, { "id": "530821", "name": "宁洱哈尼族彝族自治县" }, { "id": "530822", "name": "墨江哈尼族自治县" }, { "id": "530823", "name": "景东彝族自治县" }, { "id": "530824", "name": "景谷傣族彝族自治县" }, { "id": "530825", "name": "镇沅彝族哈尼族拉祜族自治县" }, { "id": "530826", "name": "江城哈尼族彝族自治县" }, { "id": "530827", "name": "孟连傣族拉祜族佤族自治县" }, { "id": "530828", "name": "澜沧拉祜族自治县" }, { "id": "530829", "name": "西盟佤族自治县" }] }, { "id": "530900", "name": "临沧市", "child": [{ "id": "530902", "name": "临翔区" }, { "id": "530921", "name": "凤庆县" }, { "id": "530922", "name": "云县" }, { "id": "530923", "name": "永德县" }, { "id": "530924", "name": "镇康县" }, { "id": "530925", "name": "双江拉祜族佤族布朗族傣族自治县" }, { "id": "530926", "name": "耿马傣族佤族自治县" }, { "id": "530927", "name": "沧源佤族自治县" }] }, { "id": "532300", "name": "楚雄彝族自治州", "child": [{ "id": "532301", "name": "楚雄市" }, { "id": "532322", "name": "双柏县" }, { "id": "532323", "name": "牟定县" }, { "id": "532324", "name": "南华县" }, { "id": "532325", "name": "姚安县" }, { "id": "532326", "name": "大姚县" }, { "id": "532327", "name": "永仁县" }, { "id": "532328", "name": "元谋县" }, { "id": "532329", "name": "武定县" }, { "id": "532331", "name": "禄丰县" }] }, { "id": "532500", "name": "红河哈尼族彝族自治州", "child": [{ "id": "532501", "name": "个旧市" }, { "id": "532502", "name": "开远市" }, { "id": "532503", "name": "蒙自市" }, { "id": "532504", "name": "弥勒市" }, { "id": "532523", "name": "屏边苗族自治县" }, { "id": "532524", "name": "建水县" }, { "id": "532525", "name": "石屏县" }, { "id": "532527", "name": "泸西县" }, { "id": "532528", "name": "元阳县" }, { "id": "532529", "name": "红河县" }, { "id": "532530", "name": "金平苗族瑶族傣族自治县" }, { "id": "532531", "name": "绿春县" }, { "id": "532532", "name": "河口瑶族自治县" }] }, { "id": "532600", "name": "文山壮族苗族自治州", "child": [{ "id": "532601", "name": "文山市" }, { "id": "532622", "name": "砚山县" }, { "id": "532623", "name": "西畴县" }, { "id": "532624", "name": "麻栗坡县" }, { "id": "532625", "name": "马关县" }, { "id": "532626", "name": "丘北县" }, { "id": "532627", "name": "广南县" }, { "id": "532628", "name": "富宁县" }] }, { "id": "532800", "name": "西双版纳傣族自治州", "child": [{ "id": "532801", "name": "景洪市" }, { "id": "532822", "name": "勐海县" }, { "id": "532823", "name": "勐腊县" }] }, { "id": "532900", "name": "大理白族自治州", "child": [{ "id": "532901", "name": "大理市" }, { "id": "532922", "name": "漾濞彝族自治县" }, { "id": "532923", "name": "祥云县" }, { "id": "532924", "name": "宾川县" }, { "id": "532925", "name": "弥渡县" }, { "id": "532926", "name": "南涧彝族自治县" }, { "id": "532927", "name": "巍山彝族回族自治县" }, { "id": "532928", "name": "永平县" }, { "id": "532929", "name": "云龙县" }, { "id": "532930", "name": "洱源县" }, { "id": "532931", "name": "剑川县" }, { "id": "532932", "name": "鹤庆县" }] }, { "id": "533100", "name": "德宏傣族景颇族自治州", "child": [{ "id": "533102", "name": "瑞丽市" }, { "id": "533103", "name": "芒市" }, { "id": "533122", "name": "梁河县" }, { "id": "533123", "name": "盈江县" }, { "id": "533124", "name": "陇川县" }] }, { "id": "533300", "name": "怒江傈僳族自治州", "child": [{ "id": "533301", "name": "泸水市" }, { "id": "533323", "name": "福贡县" }, { "id": "533324", "name": "贡山独龙族怒族自治县" }, { "id": "533325", "name": "兰坪白族普米族自治县" }] }, { "id": "533400", "name": "迪庆藏族自治州", "child": [{ "id": "533401", "name": "香格里拉市" }, { "id": "533422", "name": "德钦县" }, { "id": "533423", "name": "维西傈僳族自治县" }] }] }, { "id": "540000", "name": "西藏自治区", "child": [{ "id": "540100", "name": "拉萨市", "child": [{ "id": "540102", "name": "城关区" }, { "id": "540103", "name": "堆龙德庆区" }, { "id": "540104", "name": "达孜区" }, { "id": "540121", "name": "林周县" }, { "id": "540122", "name": "当雄县" }, { "id": "540123", "name": "尼木县" }, { "id": "540124", "name": "曲水县" }, { "id": "540127", "name": "墨竹工卡县" }] }, { "id": "540200", "name": "日喀则市", "child": [{ "id": "540202", "name": "桑珠孜区" }, { "id": "540221", "name": "南木林县" }, { "id": "540222", "name": "江孜县" }, { "id": "540223", "name": "定日县" }, { "id": "540224", "name": "萨迦县" }, { "id": "540225", "name": "拉孜县" }, { "id": "540226", "name": "昂仁县" }, { "id": "540227", "name": "谢通门县" }, { "id": "540228", "name": "白朗县" }, { "id": "540229", "name": "仁布县" }, { "id": "540230", "name": "康马县" }, { "id": "540231", "name": "定结县" }, { "id": "540232", "name": "仲巴县" }, { "id": "540233", "name": "亚东县" }, { "id": "540234", "name": "吉隆县" }, { "id": "540235", "name": "聂拉木县" }, { "id": "540236", "name": "萨嘎县" }, { "id": "540237", "name": "岗巴县" }] }, { "id": "540300", "name": "昌都市", "child": [{ "id": "540302", "name": "卡若区" }, { "id": "540321", "name": "江达县" }, { "id": "540322", "name": "贡觉县" }, { "id": "540323", "name": "类乌齐县" }, { "id": "540324", "name": "丁青县" }, { "id": "540325", "name": "察雅县" }, { "id": "540326", "name": "八宿县" }, { "id": "540327", "name": "左贡县" }, { "id": "540328", "name": "芒康县" }, { "id": "540329", "name": "洛隆县" }, { "id": "540330", "name": "边坝县" }] }, { "id": "540400", "name": "林芝市", "child": [{ "id": "540402", "name": "巴宜区" }, { "id": "540421", "name": "工布江达县" }, { "id": "540422", "name": "米林县" }, { "id": "540423", "name": "墨脱县" }, { "id": "540424", "name": "波密县" }, { "id": "540425", "name": "察隅县" }, { "id": "540426", "name": "朗县" }] }, { "id": "540500", "name": "山南市", "child": [{ "id": "540502", "name": "乃东区" }, { "id": "540521", "name": "扎囊县" }, { "id": "540522", "name": "贡嘎县" }, { "id": "540523", "name": "桑日县" }, { "id": "540524", "name": "琼结县" }, { "id": "540525", "name": "曲松县" }, { "id": "540526", "name": "措美县" }, { "id": "540527", "name": "洛扎县" }, { "id": "540528", "name": "加查县" }, { "id": "540529", "name": "隆子县" }, { "id": "540530", "name": "错那县" }, { "id": "540531", "name": "浪卡子县" }] }, { "id": "540600", "name": "那曲市", "child": [{ "id": "540602", "name": "色尼区" }, { "id": "540621", "name": "嘉黎县" }, { "id": "540622", "name": "比如县" }, { "id": "540623", "name": "聂荣县" }, { "id": "540624", "name": "安多县" }, { "id": "540625", "name": "申扎县" }, { "id": "540626", "name": "索县" }, { "id": "540627", "name": "班戈县" }, { "id": "540628", "name": "巴青县" }, { "id": "540629", "name": "尼玛县" }, { "id": "540630", "name": "双湖县" }] }, { "id": "542500", "name": "阿里地区", "child": [{ "id": "542521", "name": "普兰县" }, { "id": "542522", "name": "札达县" }, { "id": "542523", "name": "噶尔县" }, { "id": "542524", "name": "日土县" }, { "id": "542525", "name": "革吉县" }, { "id": "542526", "name": "改则县" }, { "id": "542527", "name": "措勤县" }] }] }, { "id": "610000", "name": "陕西省", "child": [{ "id": "610100", "name": "西安市", "child": [{ "id": "610102", "name": "新城区" }, { "id": "610103", "name": "碑林区" }, { "id": "610104", "name": "莲湖区" }, { "id": "610111", "name": "灞桥区" }, { "id": "610112", "name": "未央区" }, { "id": "610113", "name": "雁塔区" }, { "id": "610114", "name": "阎良区" }, { "id": "610115", "name": "临潼区" }, { "id": "610116", "name": "长安区" }, { "id": "610117", "name": "高陵区" }, { "id": "610118", "name": "鄠邑区" }, { "id": "610122", "name": "蓝田县" }, { "id": "610124", "name": "周至县" }] }, { "id": "610200", "name": "铜川市", "child": [{ "id": "610202", "name": "王益区" }, { "id": "610203", "name": "印台区" }, { "id": "610204", "name": "耀州区" }, { "id": "610222", "name": "宜君县" }] }, { "id": "610300", "name": "宝鸡市", "child": [{ "id": "610302", "name": "渭滨区" }, { "id": "610303", "name": "金台区" }, { "id": "610304", "name": "陈仓区" }, { "id": "610322", "name": "凤翔县" }, { "id": "610323", "name": "岐山县" }, { "id": "610324", "name": "扶风县" }, { "id": "610326", "name": "眉县" }, { "id": "610327", "name": "陇县" }, { "id": "610328", "name": "千阳县" }, { "id": "610329", "name": "麟游县" }, { "id": "610330", "name": "凤县" }, { "id": "610331", "name": "太白县" }] }, { "id": "610400", "name": "咸阳市", "child": [{ "id": "610402", "name": "秦都区" }, { "id": "610403", "name": "杨陵区" }, { "id": "610404", "name": "渭城区" }, { "id": "610422", "name": "三原县" }, { "id": "610423", "name": "泾阳县" }, { "id": "610424", "name": "乾县" }, { "id": "610425", "name": "礼泉县" }, { "id": "610426", "name": "永寿县" }, { "id": "610428", "name": "长武县" }, { "id": "610429", "name": "旬邑县" }, { "id": "610430", "name": "淳化县" }, { "id": "610431", "name": "武功县" }, { "id": "610481", "name": "兴平市" }, { "id": "610482", "name": "彬州市" }] }, { "id": "610500", "name": "渭南市", "child": [{ "id": "610502", "name": "临渭区" }, { "id": "610503", "name": "华州区" }, { "id": "610522", "name": "潼关县" }, { "id": "610523", "name": "大荔县" }, { "id": "610524", "name": "合阳县" }, { "id": "610525", "name": "澄城县" }, { "id": "610526", "name": "蒲城县" }, { "id": "610527", "name": "白水县" }, { "id": "610528", "name": "富平县" }, { "id": "610581", "name": "韩城市" }, { "id": "610582", "name": "华阴市" }] }, { "id": "610600", "name": "延安市", "child": [{ "id": "610602", "name": "宝塔区" }, { "id": "610603", "name": "安塞区" }, { "id": "610621", "name": "延长县" }, { "id": "610622", "name": "延川县" }, { "id": "610623", "name": "子长县" }, { "id": "610625", "name": "志丹县" }, { "id": "610626", "name": "吴起县" }, { "id": "610627", "name": "甘泉县" }, { "id": "610628", "name": "富县" }, { "id": "610629", "name": "洛川县" }, { "id": "610630", "name": "宜川县" }, { "id": "610631", "name": "黄龙县" }, { "id": "610632", "name": "黄陵县" }] }, { "id": "610700", "name": "汉中市", "child": [{ "id": "610702", "name": "汉台区" }, { "id": "610703", "name": "南郑区" }, { "id": "610722", "name": "城固县" }, { "id": "610723", "name": "洋县" }, { "id": "610724", "name": "西乡县" }, { "id": "610725", "name": "勉县" }, { "id": "610726", "name": "宁强县" }, { "id": "610727", "name": "略阳县" }, { "id": "610728", "name": "镇巴县" }, { "id": "610729", "name": "留坝县" }, { "id": "610730", "name": "佛坪县" }] }, { "id": "610800", "name": "榆林市", "child": [{ "id": "610802", "name": "榆阳区" }, { "id": "610803", "name": "横山区" }, { "id": "610822", "name": "府谷县" }, { "id": "610824", "name": "靖边县" }, { "id": "610825", "name": "定边县" }, { "id": "610826", "name": "绥德县" }, { "id": "610827", "name": "米脂县" }, { "id": "610828", "name": "佳县" }, { "id": "610829", "name": "吴堡县" }, { "id": "610830", "name": "清涧县" }, { "id": "610831", "name": "子洲县" }, { "id": "610881", "name": "神木市" }] }, { "id": "610900", "name": "安康市", "child": [{ "id": "610902", "name": "汉滨区" }, { "id": "610921", "name": "汉阴县" }, { "id": "610922", "name": "石泉县" }, { "id": "610923", "name": "宁陕县" }, { "id": "610924", "name": "紫阳县" }, { "id": "610925", "name": "岚皋县" }, { "id": "610926", "name": "平利县" }, { "id": "610927", "name": "镇坪县" }, { "id": "610928", "name": "旬阳县" }, { "id": "610929", "name": "白河县" }] }, { "id": "611000", "name": "商洛市", "child": [{ "id": "611002", "name": "商州区" }, { "id": "611021", "name": "洛南县" }, { "id": "611022", "name": "丹凤县" }, { "id": "611023", "name": "商南县" }, { "id": "611024", "name": "山阳县" }, { "id": "611025", "name": "镇安县" }, { "id": "611026", "name": "柞水县" }] }] }, { "id": "620000", "name": "甘肃省", "child": [{ "id": "620100", "name": "兰州市", "child": [{ "id": "620102", "name": "城关区" }, { "id": "620103", "name": "七里河区" }, { "id": "620104", "name": "西固区" }, { "id": "620105", "name": "安宁区" }, { "id": "620111", "name": "红古区" }, { "id": "620121", "name": "永登县" }, { "id": "620122", "name": "皋兰县" }, { "id": "620123", "name": "榆中县" }] }, { "id": "620200", "name": "嘉峪关市", "child": [] }, { "id": "620300", "name": "金昌市", "child": [{ "id": "620302", "name": "金川区" }, { "id": "620321", "name": "永昌县" }] }, { "id": "620400", "name": "白银市", "child": [{ "id": "620402", "name": "白银区" }, { "id": "620403", "name": "平川区" }, { "id": "620421", "name": "靖远县" }, { "id": "620422", "name": "会宁县" }, { "id": "620423", "name": "景泰县" }] }, { "id": "620500", "name": "天水市", "child": [{ "id": "620502", "name": "秦州区" }, { "id": "620503", "name": "麦积区" }, { "id": "620521", "name": "清水县" }, { "id": "620522", "name": "秦安县" }, { "id": "620523", "name": "甘谷县" }, { "id": "620524", "name": "武山县" }, { "id": "620525", "name": "张家川回族自治县" }] }, { "id": "620600", "name": "武威市", "child": [{ "id": "620602", "name": "凉州区" }, { "id": "620621", "name": "民勤县" }, { "id": "620622", "name": "古浪县" }, { "id": "620623", "name": "天祝藏族自治县" }] }, { "id": "620700", "name": "张掖市", "child": [{ "id": "620702", "name": "甘州区" }, { "id": "620721", "name": "肃南裕固族自治县" }, { "id": "620722", "name": "民乐县" }, { "id": "620723", "name": "临泽县" }, { "id": "620724", "name": "高台县" }, { "id": "620725", "name": "山丹县" }] }, { "id": "620800", "name": "平凉市", "child": [{ "id": "620802", "name": "崆峒区" }, { "id": "620821", "name": "泾川县" }, { "id": "620822", "name": "灵台县" }, { "id": "620823", "name": "崇信县" }, { "id": "620825", "name": "庄浪县" }, { "id": "620826", "name": "静宁县" }, { "id": "620881", "name": "华亭市" }] }, { "id": "620900", "name": "酒泉市", "child": [{ "id": "620902", "name": "肃州区" }, { "id": "620921", "name": "金塔县" }, { "id": "620922", "name": "瓜州县" }, { "id": "620923", "name": "肃北蒙古族自治县" }, { "id": "620924", "name": "阿克塞哈萨克族自治县" }, { "id": "620981", "name": "玉门市" }, { "id": "620982", "name": "敦煌市" }] }, { "id": "621000", "name": "庆阳市", "child": [{ "id": "621002", "name": "西峰区" }, { "id": "621021", "name": "庆城县" }, { "id": "621022", "name": "环县" }, { "id": "621023", "name": "华池县" }, { "id": "621024", "name": "合水县" }, { "id": "621025", "name": "正宁县" }, { "id": "621026", "name": "宁县" }, { "id": "621027", "name": "镇原县" }] }, { "id": "621100", "name": "定西市", "child": [{ "id": "621102", "name": "安定区" }, { "id": "621121", "name": "通渭县" }, { "id": "621122", "name": "陇西县" }, { "id": "621123", "name": "渭源县" }, { "id": "621124", "name": "临洮县" }, { "id": "621125", "name": "漳县" }, { "id": "621126", "name": "岷县" }] }, { "id": "621200", "name": "陇南市", "child": [{ "id": "621202", "name": "武都区" }, { "id": "621221", "name": "成县" }, { "id": "621222", "name": "文县" }, { "id": "621223", "name": "宕昌县" }, { "id": "621224", "name": "康县" }, { "id": "621225", "name": "西和县" }, { "id": "621226", "name": "礼县" }, { "id": "621227", "name": "徽县" }, { "id": "621228", "name": "两当县" }] }, { "id": "622900", "name": "临夏回族自治州", "child": [{ "id": "622901", "name": "临夏市" }, { "id": "622921", "name": "临夏县" }, { "id": "622922", "name": "康乐县" }, { "id": "622923", "name": "永靖县" }, { "id": "622924", "name": "广河县" }, { "id": "622925", "name": "和政县" }, { "id": "622926", "name": "东乡族自治县" }, { "id": "622927", "name": "积石山保安族东乡族撒拉族自治县" }] }, { "id": "623000", "name": "甘南藏族自治州", "child": [{ "id": "623001", "name": "合作市" }, { "id": "623021", "name": "临潭县" }, { "id": "623022", "name": "卓尼县" }, { "id": "623023", "name": "舟曲县" }, { "id": "623024", "name": "迭部县" }, { "id": "623025", "name": "玛曲县" }, { "id": "623026", "name": "碌曲县" }, { "id": "623027", "name": "夏河县" }] }] }, { "id": "630000", "name": "青海省", "child": [{ "id": "630100", "name": "西宁市", "child": [{ "id": "630102", "name": "城东区" }, { "id": "630103", "name": "城中区" }, { "id": "630104", "name": "城西区" }, { "id": "630105", "name": "城北区" }, { "id": "630121", "name": "大通回族土族自治县" }, { "id": "630122", "name": "湟中县" }, { "id": "630123", "name": "湟源县" }] }, { "id": "630200", "name": "海东市", "child": [{ "id": "630202", "name": "乐都区" }, { "id": "630203", "name": "平安区" }, { "id": "630222", "name": "民和回族土族自治县" }, { "id": "630223", "name": "互助土族自治县" }, { "id": "630224", "name": "化隆回族自治县" }, { "id": "630225", "name": "循化撒拉族自治县" }] }, { "id": "632200", "name": "海北藏族自治州", "child": [{ "id": "632221", "name": "门源回族自治县" }, { "id": "632222", "name": "祁连县" }, { "id": "632223", "name": "海晏县" }, { "id": "632224", "name": "刚察县" }] }, { "id": "632300", "name": "黄南藏族自治州", "child": [{ "id": "632321", "name": "同仁县" }, { "id": "632322", "name": "尖扎县" }, { "id": "632323", "name": "泽库县" }, { "id": "632324", "name": "河南蒙古族自治县" }] }, { "id": "632500", "name": "海南藏族自治州", "child": [{ "id": "632521", "name": "共和县" }, { "id": "632522", "name": "同德县" }, { "id": "632523", "name": "贵德县" }, { "id": "632524", "name": "兴海县" }, { "id": "632525", "name": "贵南县" }] }, { "id": "632600", "name": "果洛藏族自治州", "child": [{ "id": "632621", "name": "玛沁县" }, { "id": "632622", "name": "班玛县" }, { "id": "632623", "name": "甘德县" }, { "id": "632624", "name": "达日县" }, { "id": "632625", "name": "久治县" }, { "id": "632626", "name": "玛多县" }] }, { "id": "632700", "name": "玉树藏族自治州", "child": [{ "id": "632701", "name": "玉树市" }, { "id": "632722", "name": "杂多县" }, { "id": "632723", "name": "称多县" }, { "id": "632724", "name": "治多县" }, { "id": "632725", "name": "囊谦县" }, { "id": "632726", "name": "曲麻莱县" }] }, { "id": "632800", "name": "海西蒙古族藏族自治州", "child": [{ "id": "632801", "name": "格尔木市" }, { "id": "632802", "name": "德令哈市" }, { "id": "632803", "name": "茫崖市" }, { "id": "632821", "name": "乌兰县" }, { "id": "632822", "name": "都兰县" }, { "id": "632823", "name": "天峻县" }] }] }, { "id": "640000", "name": "宁夏回族自治区", "child": [{ "id": "640100", "name": "银川市", "child": [{ "id": "640104", "name": "兴庆区" }, { "id": "640105", "name": "西夏区" }, { "id": "640106", "name": "金凤区" }, { "id": "640121", "name": "永宁县" }, { "id": "640122", "name": "贺兰县" }, { "id": "640181", "name": "灵武市" }] }, { "id": "640200", "name": "石嘴山市", "child": [{ "id": "640202", "name": "大武口区" }, { "id": "640205", "name": "惠农区" }, { "id": "640221", "name": "平罗县" }] }, { "id": "640300", "name": "吴忠市", "child": [{ "id": "640302", "name": "利通区" }, { "id": "640303", "name": "红寺堡区" }, { "id": "640323", "name": "盐池县" }, { "id": "640324", "name": "同心县" }, { "id": "640381", "name": "青铜峡市" }] }, { "id": "640400", "name": "固原市", "child": [{ "id": "640402", "name": "原州区" }, { "id": "640422", "name": "西吉县" }, { "id": "640423", "name": "隆德县" }, { "id": "640424", "name": "泾源县" }, { "id": "640425", "name": "彭阳县" }] }, { "id": "640500", "name": "中卫市", "child": [{ "id": "640502", "name": "沙坡头区" }, { "id": "640521", "name": "中宁县" }, { "id": "640522", "name": "海原县" }] }] }, { "id": "650000", "name": "新疆维吾尔自治区", "child": [{ "id": "650100", "name": "乌鲁木齐市", "child": [{ "id": "650102", "name": "天山区" }, { "id": "650103", "name": "沙依巴克区" }, { "id": "650104", "name": "新市区" }, { "id": "650105", "name": "水磨沟区" }, { "id": "650106", "name": "头屯河区" }, { "id": "650107", "name": "达坂城区" }, { "id": "650109", "name": "米东区" }, { "id": "650121", "name": "乌鲁木齐县" }] }, { "id": "650200", "name": "克拉玛依市", "child": [{ "id": "650202", "name": "独山子区" }, { "id": "650203", "name": "克拉玛依区" }, { "id": "650204", "name": "白碱滩区" }, { "id": "650205", "name": "乌尔禾区" }] }, { "id": "650400", "name": "吐鲁番市", "child": [{ "id": "650402", "name": "高昌区" }, { "id": "650421", "name": "鄯善县" }, { "id": "650422", "name": "托克逊县" }] }, { "id": "650500", "name": "哈密市", "child": [{ "id": "650502", "name": "伊州区" }, { "id": "650521", "name": "巴里坤哈萨克自治县" }, { "id": "650522", "name": "伊吾县" }] }, { "id": "652300", "name": "昌吉回族自治州", "child": [{ "id": "652301", "name": "昌吉市" }, { "id": "652302", "name": "阜康市" }, { "id": "652323", "name": "呼图壁县" }, { "id": "652324", "name": "玛纳斯县" }, { "id": "652325", "name": "奇台县" }, { "id": "652327", "name": "吉木萨尔县" }, { "id": "652328", "name": "木垒哈萨克自治县" }] }, { "id": "652700", "name": "博尔塔拉蒙古自治州", "child": [{ "id": "652701", "name": "博乐市" }, { "id": "652702", "name": "阿拉山口市" }, { "id": "652722", "name": "精河县" }, { "id": "652723", "name": "温泉县" }] }, { "id": "652800", "name": "巴音郭楞蒙古自治州", "child": [{ "id": "652801", "name": "库尔勒市" }, { "id": "652822", "name": "轮台县" }, { "id": "652823", "name": "尉犁县" }, { "id": "652824", "name": "若羌县" }, { "id": "652825", "name": "且末县" }, { "id": "652826", "name": "焉耆回族自治县" }, { "id": "652827", "name": "和静县" }, { "id": "652828", "name": "和硕县" }, { "id": "652829", "name": "博湖县" }] }, { "id": "652900", "name": "阿克苏地区", "child": [{ "id": "652901", "name": "阿克苏市" }, { "id": "652922", "name": "温宿县" }, { "id": "652923", "name": "库车县" }, { "id": "652924", "name": "沙雅县" }, { "id": "652925", "name": "新和县" }, { "id": "652926", "name": "拜城县" }, { "id": "652927", "name": "乌什县" }, { "id": "652928", "name": "阿瓦提县" }, { "id": "652929", "name": "柯坪县" }] }, { "id": "653000", "name": "克孜勒苏柯尔克孜自治州", "child": [{ "id": "653001", "name": "阿图什市" }, { "id": "653022", "name": "阿克陶县" }, { "id": "653023", "name": "阿合奇县" }, { "id": "653024", "name": "乌恰县" }] }, { "id": "653100", "name": "喀什地区", "child": [{ "id": "653101", "name": "喀什市" }, { "id": "653121", "name": "疏附县" }, { "id": "653122", "name": "疏勒县" }, { "id": "653123", "name": "英吉沙县" }, { "id": "653124", "name": "泽普县" }, { "id": "653125", "name": "莎车县" }, { "id": "653126", "name": "叶城县" }, { "id": "653127", "name": "麦盖提县" }, { "id": "653128", "name": "岳普湖县" }, { "id": "653129", "name": "伽师县" }, { "id": "653130", "name": "巴楚县" }, { "id": "653131", "name": "塔什库尔干塔吉克自治县" }] }, { "id": "653200", "name": "和田地区", "child": [{ "id": "653201", "name": "和田市" }, { "id": "653221", "name": "和田县" }, { "id": "653222", "name": "墨玉县" }, { "id": "653223", "name": "皮山县" }, { "id": "653224", "name": "洛浦县" }, { "id": "653225", "name": "策勒县" }, { "id": "653226", "name": "于田县" }, { "id": "653227", "name": "民丰县" }] }, { "id": "654000", "name": "伊犁哈萨克自治州", "child": [{ "id": "654002", "name": "伊宁市" }, { "id": "654003", "name": "奎屯市" }, { "id": "654004", "name": "霍尔果斯市" }, { "id": "654021", "name": "伊宁县" }, { "id": "654022", "name": "察布查尔锡伯自治县" }, { "id": "654023", "name": "霍城县" }, { "id": "654024", "name": "巩留县" }, { "id": "654025", "name": "新源县" }, { "id": "654026", "name": "昭苏县" }, { "id": "654027", "name": "特克斯县" }, { "id": "654028", "name": "尼勒克县" }] }, { "id": "654200", "name": "塔城地区", "child": [{ "id": "654201", "name": "塔城市" }, { "id": "654202", "name": "乌苏市" }, { "id": "654221", "name": "额敏县" }, { "id": "654223", "name": "沙湾县" }, { "id": "654224", "name": "托里县" }, { "id": "654225", "name": "裕民县" }, { "id": "654226", "name": "和布克赛尔蒙古自治县" }] }, { "id": "654300", "name": "阿勒泰地区", "child": [{ "id": "654301", "name": "阿勒泰市" }, { "id": "654321", "name": "布尔津县" }, { "id": "654322", "name": "富蕴县" }, { "id": "654323", "name": "福海县" }, { "id": "654324", "name": "哈巴河县" }, { "id": "654325", "name": "青河县" }, { "id": "654326", "name": "吉木乃县" }] }] }, { "id": "710000", "name": "台湾省", "child": [{ "id": "710000", "name": "台湾省", "child": [{ "id": "710000", "name": "台湾省" }] }] }, { "id": "810000", "name": "香港特别行政区", "child": [{ "id": "810000", "name": "香港特别行政区", "child": [{ "id": "810000", "name": "香港特别行政区" }] }] }, { "id": "820000", "name": "澳门特别行政区", "child": [{ "id": "820000", "name": "澳门特别行政区", "child": [{ "id": "820000", "name": "澳门特别行政区" }] }] }];

$("head").append("<style>.gearArea{position:fixed;top:0;left:0;z-index:9900;display:block;overflow:hidden;width:100%;height:100%;background-color:rgba(0,0,0,.2);font-size:10px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;-webkit-animation-fill-mode:both;animation-fill-mode:both}.area_ctrl{position:absolute;bottom:0;left:0;z-index:9901;overflow:hidden;margin:0;width:100%;height:auto;background-color:#fff;color:#000;vertical-align:middle;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.slideInUp{-webkit-animation:slideInUp .3s;animation:slideInUp .3s}@-webkit-keyframes slideInUp{from{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInUp{from{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.area_roll{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;overflow:hidden;width:100%;height:auto;background-color:transparent;-webkit-mask:-webkit-gradient(linear,0 50%,0 100%,from(#debb47),to(rgba(36,142,36,0)));-webkit-mask:-webkit-linear-gradient(top,#debb47 50%,rgba(36,142,36,0))}.area_roll>div{position:relative;float:left;overflow:hidden;height:10em;background-color:transparent;font-size:1.6em;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.area_roll>div .gear{position:absolute;z-index:9902;float:left;margin-top:4em;width:100%}.area_roll_mask{padding:0;-webkit-mask:-webkit-gradient(linear,0 40%,0 0,from(#debb47),to(rgba(36,142,36,0)));-webkit-mask:-webkit-linear-gradient(bottom,#debb47 50%,rgba(36,142,36,0))}.area_grid{position:relative;top:4em;z-index:0;box-sizing:border-box;margin:0;width:100%;height:2em;border-top:1px solid #e7e7e7;border-bottom:1px solid #e7e7e7}.area_roll>div:nth-child(3) .area_grid>div{left:42%}.area_btn{padding:.8em 1em;color:#666;text-align:center;font-size:1.6em;line-height:1em}.area_btn_box:after,.area_btn_box:before{position:absolute;z-index:15;display:block;width:100%;height:1px;background-color:#transparent;content:'';-webkit-transform:scaleY(.33);transform:scaleY(.33)}.area_btn_box{position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;background-color:#f7f7f7;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:stretch;-webkit-align-items:stretch;-ms-flex-align:stretch;align-items:stretch}.area_btn_box:before{top:0;left:0;-webkit-transform-origin:50% 20%;transform-origin:50% 20%}.area_btn_box:after{bottom:0;left:0;-webkit-transform-origin:50% 70%;transform-origin:50% 70%}.tooth{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;overflow:hidden;height:2em;text-align:center;line-height:2em;line-clamp:1;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}</style>");
window.LArea = (function() {
    var MobileArea = function() {
        this.gearArea;
        this.data;
        this.index = 0;
        this.value = [0, 0, 0];
    }
    MobileArea.prototype = {
        init: function(params) {
        
        
            this.params = params;
     
            this.trigger = document.querySelector(params.trigger);
//          if(params.getereaId){
//            this.valueTo=document.querySelector(params.valueTo);
//          }
            this.has_cityerea=params.has_cityerea;
            this.keys = params.keys;
            this.type = params.type||1;
            switch (this.type) {
                case 1://设置是否是联动模式，1是多列联动模式，other 为单列模式
                case 2:
                    break;
                case "other":
                    break;
                default:
                    throw new Error('错误提示: 没有这种数据源类型');
                    break;
            };
         
            this.bindEvent();
        },
        getData: function(callback) {
            var _self = this;
            if (typeof _self.params.data == "object") {
                _self.data = _self.params.data;
                callback();
            } else {
        
                var xhr = new XMLHttpRequest();
                xhr.open('get', _self.params.data);
                xhr.onload = function(e) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
                        var responseData = JSON.parse(xhr.responseText);
                        _self.data = responseData.data;
                        if (callback) {
                            callback()
                        };
                    }
                };
                xhr.send();
            }
        },
        bindEvent: function() {
            var _self = this;
            //呼出插件
            var cityHtml=_self.type=="other"?"":'<div><div class="gear area_city" data-areatype="area_city"></div><div class="area_grid"></div></div>';
            var countyHtml=(!_self.has_cityerea||_self.type=="other")? "":'<div><div class="gear area_county" data-areatype="area_county"></div><div class="area_grid"></div></div>';
          
            function popupArea(e) {
            	
                 
            	_self.index=0;
                _self.gearArea = document.createElement("div");
                _self.gearArea.className = "gearArea";
                _self.gearArea.innerHTML = '<div class="area_ctrl slideInUp">' +
                    '<div class="area_btn_box">' +
                    '<div class="area_btn larea_cancel">取消</div>' +
                    '<div class="area_btn larea_finish">确定</div>' +
                    '</div>' +
                    '<div class="area_roll_mask">' +
                    '<div class="area_roll">' +
                    '<div>' +
                    '<div class="gear area_province" data-areatype="area_province"></div>' +
                    '<div class="area_grid">' +
                    '</div>' +
                    '</div>' +
                     cityHtml+
                     countyHtml+
                    '</div>' +
                    '</div>' +
                    '</div>';
                    
                document.body.appendChild(_self.gearArea);
				
				for (var i = 0; i < $('.gearArea').length - 1; i++) {
                    $('.gearArea').eq(i).remove();
                }
            
                areaCtrlInit();
                var larea_cancel = _self.gearArea.querySelector(".larea_cancel");
                larea_cancel.addEventListener('touchstart', function(e) {
                    _self.close(e);
                });
                var larea_finish = _self.gearArea.querySelector(".larea_finish");
                larea_finish.addEventListener('touchstart', function(e) {
                    _self.finish(e);
                });
                var area_province = _self.gearArea.querySelector(".area_province");
                var area_city = _self.gearArea.querySelector(".area_city");
                var area_county = _self.gearArea.querySelector(".area_county");
                
                area_province.addEventListener('touchstart', gearTouchStart);
                area_city&&area_city.addEventListener('touchstart', gearTouchStart);
                area_county&&area_county.addEventListener('touchstart', gearTouchStart);
                area_province.addEventListener('touchmove', gearTouchMove);
                area_city&&area_city.addEventListener('touchmove', gearTouchMove);
                area_county&&area_county.addEventListener('touchmove', gearTouchMove);
                area_province.addEventListener('touchend', gearTouchEnd);
                area_city&&area_city.addEventListener('touchend', gearTouchEnd);
                area_county&&area_county.addEventListener('touchend', gearTouchEnd);
            }
            //初始化插件默认值
            function areaCtrlInit() {
 
                _self.gearArea.querySelector(".area_province").setAttribute("val", _self.value[0]);
                if(_self.type==1)
                {
                	_self.gearArea.querySelector(".area_city").setAttribute("val", _self.value[1]);
                	if(_self.has_cityerea)
                	{
                		_self.gearArea.querySelector(".area_county").setAttribute("val", _self.value[2]);	
                	}

                };
                switch (_self.type) {
                    case 1:
                        _self.setGearTooth(_self.data);
                        break;
                     case "other":
                        _self.setGearTooth(_self.data);
                        break;    
                        
                    case 2:
                        _self.setGearTooth(_self.data[0]);
                        break;
                }
            }
            //触摸开始
            function gearTouchStart(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                       
                    } else {
                        break
                    }
                }
                clearInterval(target["int_" + target.id]);
                target["old_" + target.id] = e.targetTouches[0].screenY;
                target["o_t_" + target.id] = (new Date()).getTime();
                var top = target.getAttribute('top');
                if (top) {
                    target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
                } else {
                    target["o_d_" + target.id] = 0;
                }
                target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
            }
            //手指移动
            function gearTouchMove(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                target["new_" + target.id] = e.targetTouches[0].screenY;
                target["n_t_" + target.id] = (new Date()).getTime();
                var f = (target["new_" + target.id] - target["old_" + target.id]) * 30 / window.innerHeight;
                target["pos_" + target.id] = target["o_d_" + target.id] + f;
                target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
                target.setAttribute('top', target["pos_" + target.id] + 'em');
                if(e.targetTouches[0].screenY<1){
                    gearTouchEnd(e);
                };
            }
            //离开屏幕
            function gearTouchEnd(e) {
            	
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
                if(!Math.abs(flag))return;//屏蔽点击后效果
                if (Math.abs(flag) <= 0.2) {
                    target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
                } else {
                    if (Math.abs(flag) <= 0.5) {
                        target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                    } else {
                        target["spd_" + target.id] = flag / 2;
                    }
                }
                if (!target["pos_" + target.id]) {
                    target["pos_" + target.id] = 0;
                }
                rollGear(target);
            }
            //缓动效果
            function rollGear(target) {
                var d = 0;
                var stopGear = false;
                function setDuration() {
                    target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
                    stopGear = true;
                }
                clearInterval(target["int_" + target.id]);
                target["int_" + target.id] = setInterval(function() {
                    var pos = target["pos_" + target.id];
                    var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
                    pos += speed;
                  
                    if (Math.abs(speed) > 0.1) {
                    	
                    }else {
                        var b = Math.round(pos / 2) * 2;
                        pos = b;
                        setDuration();
                    }
                    if (pos > 0) {
                        pos = 0;
                        setDuration();
                    }
                    var minTop = -(target.dataset.len - 1) * 2;
                    if (pos < minTop) {
                        pos = minTop;
                        setDuration();
                    }
                    if (stopGear) {
                        var gearVal = Math.abs(pos) / 2;
                        setGear(target, gearVal);
                        clearInterval(target["int_" + target.id]);
                    }
                    target["pos_" + target.id] = pos;
                    target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
                    target.setAttribute('top', pos + 'em');
                    d++;
                }, 30);
            }
            //控制插件滚动后停留的值
            function setGear(target, val) {
                val = Math.round(val);
                target.setAttribute("val", val);
                _self.index=$(".area_roll .gear").index(target);
                var item_data=_self.data;
                for(var i=0;i<_self.index;i++)
                {
                	var prev_val=$(".area_roll .gear").eq(i).attr("val");
                	 item_data=item_data[prev_val]["child"];

                }
                
                switch (_self.type) {
                    case 1:
                         _self.setGearTooth(item_data);
                        break;
                    case 2:
                     switch(target.dataset['areatype']){
                         case 'area_province':
                         _self.setGearTooth(_self.data[0]);
                             break;
                         case 'area_city':
                             var ref = target.childNodes[val].getAttribute('ref');
                             var childData=[];
                             var nextData= _self.data[2];
                             for (var i in nextData) {
                                 if(i==ref){
                                    childData = nextData[i];
                                    break;
                                 }
                             };
                        _self.index=2;
                        _self.setGearTooth(childData);
                             break;
                     }
                }
                
            }
            _self.getData(function() {
                
                _self.trigger.addEventListener('click', popupArea);
            });
        },
        //重置节点个数
        setGearTooth: function(data) {
      
            var _self = this;
            var item = data || [];
            var l = item.length;
    
            if(!$(_self.gearArea).length)return;
            var gearChild = _self.gearArea.querySelectorAll(".gear");
            if(!gearChild[_self.index])return;//如果当前滚动区域不存在，则返回
             
            var gearVal = gearChild[_self.index].getAttribute('val');
       
            var maxVal = l - 1;
            if (gearVal > maxVal) {
                gearVal = maxVal;
            }
            gearChild[_self.index].setAttribute('data-len', l);
            
            if (l > 0) {
            		
                var id = item[gearVal]?item[gearVal][this.keys['id']]:"";
                var childData;
                switch (_self.type) {
                    case 1:
                    childData = item[gearVal]?item[gearVal].child:"";
                        break;
                    case 2:
                     var nextData= _self.data[_self.index+1] 
                     for (var i in nextData) {
                         if(i==id){
                            childData = nextData[i];
                            break;
                         }
                     };
                        break;
                }
                var itemStr = "";
                for (var i = 0; i < l; i++) {
                	if(typeof item[i]!="string")
                	{
                		itemStr += "<div class='tooth'  ref='" + item[i][this.keys['id']] + "'>" + item[i][this.keys['name']] + "</div>";
                		
                	}else{
                		itemStr+="<div class='tooth'>"+item[i]+"</div>"
                	}
                    
                }
          
                
                gearChild[_self.index].innerHTML = itemStr;
                gearChild[_self.index].style["-webkit-transform"] = 'translate3d(0,' + (-gearVal * 2) + 'em,0)';
                gearChild[_self.index].setAttribute('top', -gearVal * 2 + 'em');
                gearChild[_self.index].setAttribute('val', gearVal);
                _self.index++;
                if (_self.index > 2) {
                    _self.index = 0;
                    return;
                }
               if(gearChild[_self.index]&&childData)
               {
               	_self.setGearTooth(childData);
               	
               }else if(gearChild[_self.index]){
              
               	gearChild[_self.index].innerHTML=""
               	
               }
                
            } else {
     
                gearChild[_self.index].innerHTML = "<div class='tooth'></div>";
                gearChild[_self.index].setAttribute('val', 0);
                if(_self.index==1){
                    gearChild[2].innerHTML = "<div class='tooth'></div>";
                    gearChild[2].setAttribute('val', 0);
                }
                _self.index = 0;
            }
        },
        finish: function(e) { 	
        
            var _self = this;
            var area_province = _self.gearArea.querySelector(".area_province");
            var area_city = _self.gearArea.querySelector(".area_city");
            var area_county = _self.gearArea.querySelector(".area_county");
            var provinceVal = parseInt(area_province.getAttribute("val"));
         
            var provinceText =area_province.childNodes[provinceVal].textContent;
            var provinceCode =area_province.childNodes[provinceVal].getAttribute('ref');
            if(area_city)
            {
            	var cityVal = parseInt(area_city.getAttribute("val"));
                var cityText = area_city.childNodes[cityVal]?area_city.childNodes[cityVal].textContent:"";
                var cityCode = area_city.childNodes[cityVal]?area_city.childNodes[cityVal].getAttribute('ref'):"";
                if(area_county)
                {
                	var countyVal = parseInt(area_county.getAttribute("val"));
                    var countyText = area_county.childNodes[countyVal]?area_county.childNodes[countyVal].textContent:"";
                    var countyCode = area_county.childNodes[countyVal]?area_county.childNodes[countyVal].getAttribute('ref'):"";
                }
            	
            }

            if(area_county&&cityText)
            {
            
            	   if(_self.trigger.nodeName=="INPUT")
            	   {
            	   	_self.trigger.value = provinceText + ((cityText)?(',' + cityText):(''))+ ((countyText)?(',' + countyText):(''));
            	   }else{
            	   	
            	   	_self.trigger.innerText=provinceText + ((cityText)?(',' + cityText):(''))+ ((countyText)?(',' + countyText):(''));
            	   	
            	   }

            	
            }else if(area_city&&cityCode){
                     
            	   if(_self.trigger.nodeName=="INPUT")
            	   {
	            	   	if(_self.params.isHourMinute)//是否是时刻选择
	            	   	{
	            	   		_self.trigger.value = provinceText.replace(/\W/g,"") + ((cityText)?(':' + cityText.replace(/\W/g,"")):(''));
	            	   	
	            	   		var idx=$("body [time-choice]").index($(_self.trigger));
	            	   
	            	   		if($(_self.trigger).attr("start-time")=="")
	            	   		{
	            	   			
	            	   			var paramsVal=$.extend({},$("body [time-choice]").eq(idx+1).data("setParams"));
	            	   			paramsVal.isHourMinute[0]=_self.trigger.value;
	            	   		
	            	   			$("body [time-choice]").eq(idx+1).updatedParams(paramsVal)
	            	   			
	            	   			
	            	   		}else if($(_self.trigger).attr("end-time")==""){
	            	   			
	            	   			var paramsVal=$("body [time-choice]").eq(idx-1).data("setParams");
                                paramsVal.isHourMinute[1]=_self.trigger.value;
	            	   			$("body [time-choice]").eq(idx-1).updatedParams(paramsVal)
	            	   			
	            	   		}
	            	   		
	            	   	}else{
	            	   		
	            	   		_self.trigger.value = provinceText + ((cityText)?(',' + cityText):(''));
	            	   	     $(_self.trigger).change();
	            	   	}
            	   	
            	   	
            	   
            	   }else{
            	   _self.trigger.innerText = provinceText + ((cityText)?(',' + cityText):(''));
            	   	
            	   }

            }else{
            	
            	   if(_self.trigger.nodeName=="INPUT")
            	   {
            	   _self.trigger.value=provinceText
            	    $(_self.trigger).change();
            	   }else{
            	   	_self.trigger.innerText=provinceText
            	   }

            }
          

       
            _self.value = [provinceVal, cityVal, countyVal];
            if(_self.params.getereaId||typeof _self.params.callback=="function"){
               
                $(_self.trigger).data("ereaId",provinceCode +((cityCode)?(',' + cityCode):('')) + ((countyCode)?(',' + countyCode):('')))
                  var erea_json={id:$(_self.trigger).data("ereaId"),name:_self.trigger.value||_self.trigger.innerText};
                typeof _self.params.callback=="function"&&_self.params.callback(erea_json,$(_self.trigger));
            }
            
             /**********如果是下拉选择后通过JS赋值，则手动输出change事件***********/
		      if(_self.trigger.nodeName=="INPUT"||_self.trigger.nodeName=="CHECKBOX"||_self.trigger.nodeName=="TEXTEREA"||_self.trigger.nodeName=="SELECT")
		      {
		      	$(_self.trigger).change();
		      }
            
            //看是否是日期联动模式
            _self.close(e);
        },
        close: function(e) {
            e.preventDefault();
            var _self = this;
            var evt = new CustomEvent('input');
            _self.trigger.dispatchEvent(evt);
            document.body.removeChild(_self.gearArea);
            _self.gearArea=null;
        }
    }
    return MobileArea;
})()

$.fn.extend({
	initParams:function(input_dom,params){
				   input_dom.each(function(){
		 		   var date_input=$(this);
		 		   //针对时间选择
		 		   if(date_input.attr("date-choice")=="")
		 		   {
		 		  	
				 		   	var limited_times=params.limited_minutes*60*1000||200*365*24*3600*1000;
		                   
		                    if(params.init_date=="today")
		                    {
		                    
		                    	var start_obj=new Date();
		                    }else if(params.init_date.defaultDate){
		               
		                    	var date_ary=params.init_date.defaultDate.split(/\W/);
		                    
		                         date_ary[1]=date_ary[1]-1+"";
		                        if(params.init_date.startDate)
		                        {
		                        	var start_obj=new Date(eval("new Date("+date_ary.join(",")+")")); 
		                        }else{
		                        	
		                        	var start_obj=new Date(eval("new Date("+date_ary.join(",")+").valueOf()")-100*365*24*3600*1000); 	
		                        }
		                    	
		                  
		                    }else{
		                
		                    	var start_obj=new Date();
		                    	start_obj=new Date(start_obj.getFullYear()-100,start_obj.getMonth(),start_obj.getDate());
		                    }
				 		   	if(date_input.attr("start-date")=="")
				 		   	{
				 		   	   
				 		   	        var start_time=start_obj.valueOf();
				 		   			if(params.init_date)
				 		   			{
				 		   			    
				 		   			    var end_time=start_time+limited_times;
				 		   	            var end_obj=new Date(end_time);

				 		   			}else{
				 		   				var end_time=start_time+limited_times;
				 		   	            var end_obj=new Date(end_time);
				 		   				date_input.attr("data-lcalendar",start_obj.getFullYear()-100+"-"+(start_obj.getMonth()+1)+"-"+start_obj.getDate()+"-"+start_obj.getHours()+"-"+start_obj.getMinutes()+","+end_obj.getFullYear()+"-"+(end_obj.getMonth()+1)+"-"+end_obj.getDate()+"-"+end_obj.getHours()+"-"+start_obj.getMinutes());

				 		   			}
				 		   			//查看是否结束日期有默认值
			 		   	            var idx=$("[date-choice]").index(date_input)+1;
			 		   	            if($("[date-choice]").eq(idx).val())
			 		   	            {
			 		   	        
			 		   	            	var endVal=$("[date-choice]").eq(idx).val().split(/\W/);
			 		   	         
			 		   	            	var endstring="";
			 		   	            	if(endVal.length<5)
			 		   	            	{
			 		   	            		endVal=endVal.concat(["00","00"])
			 		   	            
			 		   	            	}
			 		   	            	
			 		   	            	endVal.forEach(function(item,index,ary){
			 		   	            		ary[index]=item.replace(/^0/,"")
			 		   	            		if(index==1)
			 		   	            		{
			 		   	            			endstring+=","+(ary[index]-1);
			 		   	            		}else if(index)
			 		   	            		{
			 		   	            			endstring+=","+ary[index];
			 		   	            		}else{
			 		   	            			endstring+=ary[index];
			 		   	            		}
			 		   	            		
			 		   	            	})
			 		   	            	var endobj=new Date(eval("new Date("+endstring+").valueOf()")-params.space_minutes*60*1000);
			 		   	            	date_input.attr("data-lcalendar",start_obj.getFullYear()+"-"+(start_obj.getMonth()+1)+"-"+start_obj.getDate()+"-"+start_obj.getHours()+"-"+start_obj.getMinutes()+","+endobj.getFullYear()+"-"+(endobj.getMonth()+1)+"-"+endobj.getDate()+"-"+endobj.getHours()+"-"+endobj.getMinutes());

			 		   	            }else{
			 		   	            	date_input.attr("data-lcalendar",start_obj.getFullYear()+"-"+(start_obj.getMonth()+1)+"-"+start_obj.getDate()+"-"+start_obj.getHours()+"-"+start_obj.getMinutes()+","+end_obj.getFullYear()+"-"+(end_obj.getMonth()+1)+"-"+end_obj.getDate()+"-"+end_obj.getHours()+"-"+start_obj.getMinutes());
			 		   	            }
				 		   			
				 		   			
				 		   			
				 		   			
				 		   			
				 		   		
				 		   	}else if(date_input.attr("end-date")==""){
				 		   		var start_time=start_obj.valueOf()+params.space_minutes*60*1000;
					 		   	start_obj=new Date(start_time);
                                var end_time=start_time+limited_times;
				 		   	    var end_obj=new Date(end_time);
			 		   			if(params.init_date)
			 		   			{
			 		   				date_input.attr("data-lcalendar",start_obj.getFullYear()+"-"+(start_obj.getMonth()+1)+"-"+start_obj.getDate()+"-"+start_obj.getHours()+"-"+start_obj.getMinutes()+","+end_obj.getFullYear()+"-"+(end_obj.getMonth()+1)+"-"+end_obj.getDate()+"-"+end_obj.getHours()+"-"+start_obj.getMinutes());
			
			 		   			}else{

			 		   				date_input.attr("data-lcalendar",start_obj.getFullYear()-100+"-"+(start_obj.getMonth()+1)+"-"+start_obj.getDate()+"-"+start_obj.getHours()+"-"+start_obj.getMinutes()+","+end_obj.getFullYear()+"-"+(end_obj.getMonth()+1)+"-"+end_obj.getDate()+"-"+end_obj.getHours()+"-"+start_obj.getMinutes());
			 		   			}
			 		   			
			 		   			//查看是否开始日期有默认值
		 		   	            var idx=$("[date-choice]").index(date_input)-1;
		 		   	            if($("[date-choice]").eq(idx).val())
		 		   	            {
		 		   	              
		 		   	            	var startVal=$("[date-choice]").eq(idx).val().split(/\W/);
		 		   	            	var startstring="";
		 		   	            	if(startVal.length<5)
		 		   	            	{
		 		   	            		startVal=startVal.concat(["00","00"])
		 		   	            	}
		 		   	            	startVal.forEach(function(item,index,ary){
		 		   	            		ary[index]=item.replace(/^0/,"")
		 		   	            		if(index==1)
		 		   	            		{
		 		   	            			startstring+=","+(ary[index]-1);
		 		   	            		}else if(index)
		 		   	            		{
		 		   	            			startstring+=","+ary[index];
		 		   	            		}else{
		 		   	            			startstring+=ary[index];
		 		   	            		}
		 		   	            		
		 		   	            	})
		 		   	          
		 		   	            	var startobj=new Date(eval("new Date("+startstring+").valueOf()")+params.space_minutes*60*1000);
		 		   	            	date_input.attr("data-lcalendar",startobj.getFullYear()+"-"+(startobj.getMonth()+1)+"-"+startobj.getDate()+"-"+start_obj.getHours()+"-"+start_obj.getMinutes()+","+end_obj.getFullYear()+"-"+(end_obj.getMonth()+1)+"-"+end_obj.getDate()+"-"+end_obj.getHours()+"-"+start_obj.getMinutes());

		 		   	            }else{
		 		   	            	date_input.attr("data-lcalendar",start_obj.getFullYear()+"-"+(start_obj.getMonth()+1)+"-"+start_obj.getDate()+"-"+start_obj.getHours()+"-"+start_obj.getMinutes()+","+end_obj.getFullYear()+"-"+(end_obj.getMonth()+1)+"-"+end_obj.getDate()+"-"+end_obj.getHours()+"-"+start_obj.getMinutes());
		 		   	            }

		
				 		   	}else{
				 		   
				 		  	   //不设起止时间普通选择模式
				 		        var start_time=start_obj.valueOf();
				 		   	
				 		   		if(params.init_date)
			 		   			{
			 		   			    var end_time=start_time+limited_times;
			 		   	            var end_obj=new Date(end_time);
			 		   				date_input.attr("data-lcalendar",start_obj.getFullYear()+"-"+(start_obj.getMonth()+1)+"-"+start_obj.getDate()+"-"+start_obj.getHours()+"-"+start_obj.getMinutes()+","+end_obj.getFullYear()+"-"+(end_obj.getMonth()+1)+"-"+end_obj.getDate()+"-"+end_obj.getHours()+"-"+start_obj.getMinutes());
		
			 		   			}else{
			 		   				var end_time=start_time+limited_times;
			 		   	            var end_obj=new Date(end_time);
			 		   				date_input.attr("data-lcalendar",start_obj.getFullYear()-100+"-"+(start_obj.getMonth()+1)+"-"+start_obj.getDate()+"-"+start_obj.getHours()+"-"+start_obj.getMinutes()+","+end_obj.getFullYear()+"-"+(end_obj.getMonth()+1)+"-"+end_obj.getDate()+"-"+end_obj.getHours()+"-"+start_obj.getMinutes());

			 		   			}
				 		   		
		
				 		   	}
				 		    
				 			var calendardate= new lCalendar();
							calendardate.init($.extend({
								'trigger': "[_selectId="+date_input.attr("_selectId")+"]",
								'type': "datetime"
							},params));

		 		   	
		 		   }else{//针对非时间选择
		 
					 var json=$.extend({
					  		'keys': {
					            id: 'id',
					            name: 'name'
					        }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
					        'type': 1, //数据源类型,1为省市区数据，"other"为单列选择数据
					        'data': LAreaData //数据源
			            
					  },params);
					    var area = new LArea();
					    area.init($.extend({
					        'trigger': "[_selectId='"+input_dom.attr("_selectId")+"']", //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
					        'getereaId': true, //选择完后存储省市区ID数据到DOM里面，方便后台取值
					        'has_cityerea':true,//设置是否需要选择城市区县
					        'callback':undefined
					    },json));
					    area.value=[0,0,0];//控制初始位置，注意：该方法并不会影响到input的value
		 		   }

		 	})

	},
	
	touchSelect:function(json){

		 var input_dom=$(this);
		 input_dom.focus(function(){
		 	$(this).blur();
		 });
		 input_dom.each(function(){
		 	$(this).attr("_selectId","_id"+new Date().valueOf()+Math.floor(Math.random()*1000));
		 });
	
		 if(input_dom.attr("date-choice")!="")//针对非日期选择，但包含时刻选择
		 {
		 		//生成时间选择数据源函数
		 		function createdTime(obj)
		 		{  
		 			var json=obj
		 		
			 		var TimeData=[];
			 		var hour_unit=json.hour_unit;
					var minute_unit=json.minute_unit;
				
					var space_hours=[json.isHourMinute[0].split(":")[0]+"",json.isHourMinute[1].split(":")[0]+""]
	                var space_minutes=[json.isHourMinute[0].split(":")[1]+"",json.isHourMinute[1].split(":")[1]+""]
	
	                for(var n=0,l=0;n<=24;n+=hour_unit,l++)
	                 {

	                    var item_time1=(n>9?n:"0"+n);
	                    if(space_hours[0]<=item_time1&&item_time1<=space_hours[1])
	                    {
	                    	
	                    	TimeData.push({"id":l,"name":(n>9?n:"0"+n)+"时","child":[]})
	                 	    var ary=TimeData[TimeData.length-1]["child"];
	                 	   
	                    	for(var i=0,k=0;i<=60;i+=minute_unit,k++)
	                    	{
	                    		
	                    		var item_time2=(n>9?n:"0"+n)+""+(i>9?i:"0"+i);
	                    		if(i<60&&json.isHourMinute[0].replace(":","")<=item_time2&&item_time2<=json.isHourMinute[1].replace(":","")+space_minutes[1])
	                    		{
	                    			ary.push({"id":k,"name":(i>9?i:"0"+i)+"分"})
	                            
	                    		}
	
	                    	}
	                    	if(ary.length==0)
	                    	{
	                    		TimeData.length=TimeData.length-1;
	                    	}
	                    	
	                    }
		
	                 }
	
			 		json["data"]=TimeData
			 		json["has_cityerea"]=false;
			 		return json;
		 		}
		 		
		 		
	   
		 	if(json.isHourMinute){
		 		
		 		if(json.isHourMinute=="all")
		 		{
		 			json.isHourMinute=["00:00","24:00"]
		 		}
		 		
		 		
		 		json=$.extend({
		 			"space_time":0,//起止时间的间隔分钟数
		 			"hour_unit":1,//计算小时选择最小时数，默认1
		            "minute_unit":1,//计算分钟选择最小分钟数，默认60，计算出为60/x一分钟,
		            'keys': {
			            id: 'id',
			            name: 'name'
		            }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
		           'type': 1, //数据源类型,1为省市区数据，"other"为单列选择数据
		 		},json)
	
		 		

		 	}else{
		       
		 		json=$.extend({
		            'keys': {
			            id: 'id',
			            name: 'name'
		            }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
		           'type': 1, //数据源类型,1为省市区数据，"other"为单列选择数据
		 		},json)
		 		json["data"]=json.data||LAreaData

		 	}
	
	
		    input_dom.each(function(){
		    	var area = new LArea();
                var json2=$.extend({},json);
		    	if(json2.space_time>=0&&$(this).attr("start-time")=="")
		    	{
		    		    var itemAry=[json2.isHourMinute[1].split(":")[0].replace(/^0/,""),json2.isHourMinute[1].split(":")[1].replace(/^0/,"")]
		    		    var all_minutes=itemAry[0]*60+(+itemAry[1]);
		    		    var ind=$("[time-choice]").index($(this));
		    		    var enddom_Val=$("[time-choice]").eq(ind+1).val();
                     
	    		       if(enddom_Val&&all_minutes>enddom_Val.split(":")[0].replace(/^0/g,"")*60+(+enddom_Val.split(":")[1].replace(/^0/g,"")))
	    		       {
	    		       	 
	    		       	  all_minutes=enddom_Val.split(":")[0].replace(/^0/g,"")*60+(+enddom_Val.split(":")[1].replace(/^0/g,""))
	    		       }
		    		    
		    		    all_minutes-=json2.space_time;
                        itemAry=[Math.floor(all_minutes/60),all_minutes%60];

		    		    itemAry.forEach(function(item,index,ary){
		    		   	     ary[index]=item>9?item+"":"0"+item;
		    		    })
                       
		   
		    		    json2=$.extend({},json2,{"isHourMinute":[json2.isHourMinute[0],itemAry.join(":")]})
		    		    json2= createdTime(json2)
		    		  
		    		    
                      
		    	}else if(json2.space_time>=0&&$(this).attr("end-time")==""){
		    		
		    		    var itemAry=[json2.isHourMinute[0].split(":")[0].replace(/^0/,""),json2.isHourMinute[0].split(":")[1].replace(/^0/,"")]
		    		    var all_minutes=itemAry[0]*60+(+itemAry[1]);
		    		    var ind=$("[time-choice]").index($(this));
		    		    var startdom_Val=$("[time-choice]").eq(ind-1).val();
	    		       if(startdom_Val&&all_minutes<startdom_Val.split(":")[0].replace(/^0/g,"")*60+(+startdom_Val.split(":")[1].replace(/^0/g,"")))
	    		       {
	    		       
	    		       	  all_minutes=startdom_Val.split(":")[0].replace(/^0/g,"")*60+(+startdom_Val.split(":")[1].replace(/^0/g,""))
	    		       }
		    		    all_minutes+=json2.space_time;
		    		    
		    	
                        itemAry=[Math.floor(all_minutes/60),all_minutes%60];
		    		     
		    		    itemAry.forEach(function(item,index,ary){
		    		   	     ary[index]=item>9?item+"":"0"+item;
		    		    })
		    		   
		    	
		    		    json2=$.extend({},json2,{"isHourMinute":[itemAry.join(":"),json2.isHourMinute[1]]})
                        json2= createdTime(json2);
                     
                     
		    	}else if(json.isHourMinute){
		    		
                      	json2= createdTime(json2)

		    	};

		    	$(this).data("setParams",$.extend({},json2));
	
		    	var params=$.extend({
			        'trigger': "[_selectId='"+$(this).attr("_selectId")+"']", //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
			        'getereaId': true, //选择完后存储省市区ID数据到DOM里面，方便后台取值
			        'has_cityerea':true,//设置是否需要选择城市区县
			        'callback':undefined
			    },json2);
			    
			    var init_position=[0,0,0];//计算默认值初始化位置
			    if($(this).val())
			    {
			
			    	if(json2.isHourMinute)
			    	{
			    		var pt=$(this).val().split(":");
			    		pt=[pt[0]+"时",pt[1]+"分"];
			    	}else{
			    		var pt=$(this).val().split(",");
			    	}
			    
			    	json2.data.forEach(function(item,index,ary){

			    	     var i=0;
			    	     var obj=json2.data.slice(0);
                         while(pt.length)
                         {
                         	var  val=pt.shift();
                         	obj.forEach(function(it,idx,ary2){
                         		if(it==val||it.name==val)
                         		{
                         			init_position[i++]=idx;
                         			obj=it.child;
                         			return false;
                         		}
                         	})
                         	
                         }
 	
			    	     	
			    	})
			    	
			    };
            
		    	area.init(params);
			    area.value=init_position;//控制初始位置，注意：该方法并不会影响到input的value
         	    
		    })
             
		 	
		 }else if(input_dom.attr("date-choice")==""){//针对日期选择
        
		 	$("head").append('<style>.gearDate,.gearDatetime,.gearTime{font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;background-color:rgba(0,0,0,0.2);display:block;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9900;overflow:hidden;-webkit-animation-fill-mode:both;animation-fill-mode:both}.date_ctrl{vertical-align:middle;background-color:white;color:#363837;margin:0;height:auto;width:100%;position:absolute;left:0;bottom:0;z-index:9901;overflow:hidden;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.slideInUp{animation:slideInUp .3s ease-in;-webkit-animation:slideInUp .3s ease-in}@-webkit-keyframes slideInUp{from{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.date_roll,.datetime_roll,.time_roll{display:-webkit-box;width:100%;height:auto;overflow:hidden;font-weight:bold;background-color:transparent;-webkit-mask:-webkit-gradient(linear,0% 50%,0% 100%,from(#debb47),to(rgba(36,142,36,0)));-webkit-mask:-webkit-linear-gradient(top,#debb47 50%,rgba(36,142,36,0))}.date_roll>div,.datetime_roll>div,.time_roll>div{font-size:2.3em;height:6em;float:left;background-color:transparent;position:relative;overflow:hidden;-webkit-box-flex:4}.date_roll_mask{-webkit-mask:-webkit-gradient(linear,0% 40%,0% 0,from(#debb47),to(rgba(36,142,36,0)));-webkit-mask:-webkit-linear-gradient(bottom,#debb47 50%,rgba(36,142,36,0));padding:0 0 3em 0}.date_roll>div:nth-child(2){-webkit-box-flex:2}.date_roll>div:nth-child(1),.datetime_roll>div:nth-child(1){-webkit-box-flex:4}.datetime_roll>div:first-child{-webkit-box-flex:6}.datetime_roll>div:last-child{-webkit-box-flex:6}.date_grid{position:relative;top:2em;width:100%;height:2em;margin:0;box-sizing:border-box;z-index:0;border-top:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6}.date_grid>div{color:#000;position:absolute;right:0;top:0;font-size:.8em;line-height:2.5em}.date_roll>div:nth-child(3) .date_grid>div{left:42%}.datetime_roll>div .date_grid>div{right:0}.datetime_roll>div:first-child .date_grid>div{left:auto;right:0}.datetime_roll>div:last-child .date_grid>div{left:50%}.time_roll>div:nth-child(1) .date_grid>div{right:.5em}.time_roll>div .date_grid>div{right:1em}.date_btn{color:#000;font-size:1.6em;line-height:1em;text-align:center;padding:.8em 1em;cursor:pointer}.date_btn_box{display:-webkit-box;-webkit-box-pack:justify;-webkit-box-align:stretch;border-bottom:1px solid #ccc}.gear{float:left;position:absolute;z-index:9902;width:5.5em;margin-top:-6em}.date_roll>div .gear{width:100%}.date_roll>div:nth-child(1) .gear{text-indent:20%}.date_roll>div:nth-child(2) .gear{text-indent:-20%}.date_roll>div:nth-child(3) .gear{text-indent:-55%}.datetime_roll>div .gear{width:100%;text-indent:-25%}.datetime_roll>div:first-child .gear{text-indent:-10%}.datetime_roll>div:last-child .gear{text-indent:-50%}.time_roll>div .gear{width:100%;text-align:center}.time_roll>div:nth-child(1) .gear{width:100%;text-indent:10%}.tooth{height:2em;line-height:2em;text-align:center}</style>');
		 	var params=$.extend({
		 		"type":"datetime",//可以设置三种选择类型：date,datetime,time
                "space_minutes":0,//如果有起止时间设置 ，则为间隔分钟数>1,默认为假没有
                "limited_minutes":0,//设置限选多少天(换算成分钟)以内日期，为正整数
                "date_format":"yy-mm-dd",//设置显示时间格式，可以设置为"yy年mm月dd日","yy-mm-dd","yy/mm/dd"
		 	    "callback":false,//设计回调 ，默认传回参数为当前选择值
		 	    "minute_unit":1,//设置分钟选择最小分钟数，默认1
		 	    "hour_unit":1,//设置小时选择最小时数，默认1

		 	},json);
		    
	 	     $(this).initParams(input_dom,params);
 
		 }
         $(this).data("setParams",params)

	},
	updatedParams:function(json,default_val){
	
	   if($(this).attr("time-choice")=="")
	   {

            $(this).each(function(){
            	var params=$.extend($(this).data("setParams"),json);
				var dom=$(this).clone();
				dom.insertAfter($(this));
				$(this).remove();
				if(default_val){dom.val(default_val)}
				dom.touchSelect(params);

            });
	   }else{
   		   	$(this).val("");
			var params=$.extend($(this).data("setParams"),json);
			$(this).each(function(){
				var dom=$(this).clone();
				dom.insertAfter($(this));	
			});
			if(default_val)
			{
              $(this).next().val(default_val);	
			}
			$(this).next().touchSelect(params);
			$(this).remove();

	   }

	}

})

//$("[date-choice]").touchSelect({})







