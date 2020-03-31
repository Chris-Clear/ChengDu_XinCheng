//数组检测某元素的索引值
Array.prototype.indexOf = function(el) {
	for(var i = 0, n = this.length; i < n; i++) {
		if(this[i] === el) {
			return i;
		}
	}
	return -1;
}

/***********Vue模板页加载***********/
function vueTemplate(id) {
	return $(window.frames['_vueTemplate'].document).find("#" + id).html();
};

function templateLoad(tp_ary, func) {
	$("body").append("<iframe name='_vueTemplate' src='../lib/vueTemplate.html' class='hide'></iframe>")
	$("[name='_vueTemplate']").load(function() {
		var template = {};
		tp_ary.forEach(function(item, index, ary) {
			template[item] = vueTemplate(item)

		})
		func && func(template);
		//移除模板iframe
		$(this).remove();

	});

}

/***VUE公共封装***/
var app = {};
var ini_data = {};
var watchjson = {};

function ini() {
	var valname = arguments[0].split("=")[0].split("[]")[0];
	if(arguments[0].indexOf('[]') < 0) {

		var val = arguments[0].split("=")[1] ? arguments[0].split("=")[1] : 0;
		ini_data[valname] = +val ? +val : val;

	} else if(arguments[0].indexOf('[]') >= 0) {

		ini_data[valname] = eval(arguments[0].split("=")[1]) || [];

		if(arguments[1] instanceof Array) {
			//建立数组和数组选中真值之间的映射
			ini_data[valname + "_map"] = {};
			arguments[1].unshift(valname);
			console.log(arguments[1]);
			watchjson[valname] = function() {
				var that = this;
				var item_ary;
				arguments[1].forEach(function(item, index, ary) {
					item_ary

				})
				that[valname].forEach(function(item, index, ary) {
					that[valname + "_map"][index] = {
						checked: false
					}

				})

			}

		}

	}

}

$("[ini]").each(function() {

	var vue_string = $(this).attr("ini");
	eval(vue_string);
	$(this)[0].removeAttribute('ini');

});

function vue_init(json) {
	var json = json;

	/**********设置一些方便使用的变量，直接使用***********/
	var date_obj = new Date();
	var today = date_obj.getFullYear() + "-" + ((date_obj.getMonth() + 1) > 9 ? (date_obj.getMonth() + 1) : ("0" + (date_obj.getMonth() + 1))) + "-" + (date_obj.getDate() > 9 ? date_obj.getDate() : ("0" + date_obj.getDate()));
	/*******加载vue模块********/
	templateLoad(["uploadimg", "wxpay", "footer_nav", "links"], function(template) {

		var vue_params = {
			el: ".main",
			components: {
				/********上传图片组件*********/
				'uploadimg': {
					template: template ? template['uploadimg'] : " ",
					props: ["num", "name", "rows", "holderimg", "autoheight", "selectmore"],
					data: function() {
						return {
							uploadUrl: "api/wx/qiniuFetch",
						}
					},
					methods: {
						uploadimg: function($event, index) {

							var that = this;
							if(navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1) {
								wx.chooseImage({
									count: $($event.target).attr("selectmore") || 1, // 默认9
									sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
									sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
									success: function(res) {
										var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
										wx.uploadImage({
											localId: localIds.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
											isShowProgressTips: 1, // 默认为1，显示进度提示
											success: function(res) {
												var serverId = res.serverId; // 返回图片的服务器端ID
												go_ajax({
													url: that.uploadUrl, //这里配置上传接口
													data: {
														serverId: serverId
													},
													success: function(res) {
														$($event.target).attr("src", res)
														$($event.target).parents("._imgShow").addClass("add");
														var input_dom = $($event.target).parents("._uploadImg").find("input[type=hidden]")
														var img_ary = input_dom.val();
														if(img_ary.length > 1) {
															img_ary = img_ary.split(",");
															img_ary.replace(index, 1, res);
															input_dom.val(img_ary.join(","))
														} else {
															input_dom.val(res)
														}
													}
												})
											}
										});
									},
									error: function() {

										alert("没有成功")
									}
								});

							} else {

								alert("只能在微信或者APP打开上传")
							}

						},
						deleImg: function($event, index, holderimg) {
							$($event.target).insertBefore($($event.target).siblings("input"));
							var input_dom = $($event.target).parents("._uploadImg").find("input[type=hidden]");
							var input_dom = $($event.target).parents("._uploadImg").find("input[type=hidden]")
							$($event.target).parents("._uploadImg").removeClass("add").find(".img img").attr("src", holderimg);
							var img_ary = input_dom.val();
							img_ary = img_ary.split(",");
							img_ary.replace(index, 1);
							input_dom.val(img_ary.join(","))
						}

					}
				},
				/********底部导航模块*********/
				'footer_nav': {
					template: template ? template['footer_nav'] : " ",
					props: ['name', 'href', 'active', 'tag', 'color'],
					data: function() {
						return {
							default_name: ["主页", "分类", '我的'],
							default_href: ["wx测试.html", "wx测试.html", "wx测试.html"],
							default_tag: "../img/footer/nav1/@png-B"
						}

					},
					methods: {
						goTo: function(url) {
							if(url) {
								location.href = url
							} else {
								location.reload()
							}

						}

					}

				},
				'links': {
					template: template ? template['links'] : " ",
					props: ['tagrule', 'name', 'links', "pad"],
				}

			},
			data: {
				/*******方便使用的变量*******/
				URLparam:URLparam,
				date: {
					today: today,
					time: today + " " + date_obj.getHours() > 9 ? date_obj.getHours() : ("0" + date_obj.getHours()) + ":" + (date_obj.getMinutes() > 9 ? date_obj.getMinutes() : ("0" + date_obj.getMinutes())) + ":" + (date_obj.getSeconds() > 9 ? date_obj.getSeconds() : ("0" + date_obj.getSeconds()))
				},
				/********动态变量********/
				data: $.extend(ini_data, {
					ajaxFunc: {}, //用于保存每个操作函数的相关ajax请求参数
					goAjax: function(json) {
						var that = this;
						var funcName = json.funcString.toString().split("(")[0].split("function")[1].trim(); //获取函数名字
						var data = {};
						if(json.ajaxKey) {
							that.ajaxFunc[funcName][json.ajaxKey].data.forEach(function(item, index, ary) {
								data[item] = that[item]
							});
							go_ajax($.extend({}, that.ajaxFunc[funcName][json.ajaxKey], {
								data: data
							}), json.dothing)
						} else {
							that.ajaxFunc[funcName].data.forEach(function(item, index, ary) {
								data[item] = that[item]
							});
							go_ajax($.extend({}, that.ajaxFunc[funcName], {
								data: data
							}), json.dothing)
						}

					}

				})
			},
			methods: {
				info: function(item) {
					console.log(item);
					return item
				},
				back: function() {
					history.back(-1);
				},
				goTo:function(href,replace){
					if(replace)
					{
						location.replace(href)
						
					}else{
						location.href=href
					}	
				}
				,
				GetUrlparam: function(name) {
					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
					var r = decodeURI(window.location.search).substr(1).match(reg);
					if(r != null) return unescape(r[2]);
					return null;

				},
				max: function max() {
					var ajaxKey = arguments[1];
					var expression = arguments[0].split(/[><=]{1,2}/);
					//判断该函数需要请求接口
					if(ajaxKey && this.ajaxFunc["max"]) {
						if(expression.length == 2) {

							if(eval(+this[expression[0]] + 1 + arguments[0].match(/[><=]{1,2}/) + (this[expression[1]] || expression[1]))) {

								this.goAjax({
									funcString: arguments.callee,
									dothing: function() {
										Vue.set(this, expression[0], this[expression[0]] + 1)
									},
									ajaxKey: ajaxKey
								})
							}

						} else if(expression.length == 1) {
							this.goAjax({
								funcString: arguments.callee,
								dothing: function() {
									Vue.set(this, expression[0], this[expression[0]] + 1)
								},
								ajaxKey: ajaxKey
							})

						};

					} else {
						if(expression.length == 2) {
							if(eval(eval("+this." + expression[0]) + 1 + arguments[0].match(/[><=]{1,2}/) + (this[expression[1]] || expression[1]))) {
								Vue.set(this, expression[0], eval("+this." + expression[0]) + 1)
							}

						} else if(expression.length == 1) {
							Vue.set(this, expression[0], this[expression[0]] + 1)

						};

					}

				},
				min: function min() {
					var ajaxKey = arguments[1];
					var expression = arguments[0].split(/[><=]{1,2}/);
					//判断该函数需要请求接口
					if(ajaxKey && this.ajaxFunc["min"]) {

						if(expression.length == 2) {

							if(eval(+this[expression[0]] - 1 + arguments[0].match(/[><=]{1,2}/) + (this[expression[1]] || expression[1]))) {

								this.goAjax({
									funcString: arguments.callee,
									dothing: function() {
										Vue.set(this, expression[0], this[expression[0]] - 1)
									},
									ajaxKey: ajaxKey
								})
							}

						} else if(expression.length == 1) {
							this.goAjax({
								funcString: arguments.callee,
								dothing: function() {
									Vue.set(this, expression[0], this[expression[0]] - 1)
								},
								ajaxKey: ajaxKey
							})

						};

					} else {

						if(expression.length == 2) {

							if(eval(+this[expression[0]] - 1 + arguments[0].match(/[><=]{1,2}/) + (this[expression[1]] || expression[1]))) {
								Vue.set(this, expression[0], this[expression[0]] - 1)
							}

						} else if(expression.length == 1) {
							Vue.set(this, expression[0], this[expression[0]] - 1)

						};

					}

				},
				setEach: function(string, val_ary) {
					var target = string.split(".");
					var i = 0;

					function runEnd(i) {
						if(target[i].test("/\S*[]/")) {

						} else if(target[i].test("/\S*{}/")) {

						} else if(target[i].test("/[\S*]|\S[^[]]*/")) {

						}

					}

					target.forEach(function(item, index, ary) {
						if(item.test()) {}

					})
				},
				compute: function(string) {
					var expression = string.split("=");
					var computeAry = expression[1].split(/([a-zA-Z0-9_-]+)/);

				},
				//上传图片功能
				uploadimg: function() {

				},
				deleimg: function() {
					alert(2222)

				}

			},
			watch: $.extend({}, watchjson)

		};
		for(var key in json) {

			if(key != "data") {
				if(typeof vue_params[key] == "object") {
					$.extend(vue_params[key], json[key])
				} else {
					vue_params[key] = json[key]

				}

			} else {

				$.extend(vue_params.data.data, json.data)
			}
		};
		if(vue_params.ajaxUrl) {

			for(item in vue_params.ajaxUrl) {
				vue_params.data.ajaxFunc[item] = vue_params.ajaxUrl[item];

			}

		}

		app = new Vue(vue_params);
		/**********加载VUE模块之后再执行页面其他js**********/
		json.templateInit && json.templateInit()

	})

}