var AppID = "wxcab85192936dc5d9";
var AppSecret = "fa41c96a802c7d1a36750096fd5d87dc";

function wx_config(signature_url){
	if(!signature_url)return;
	$.getScript("http://res.wx.qq.com/open/js/jweixin-1.2.0.js", function() {
	//获取后台签名json,完成微信接口配置
	go_ajax({
		url:signature_url,
		async:false,
		data:{url:"http://yxb.lebangcloud.cn/html/wxtest_bak.html"},
		success:function(json){
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: json.appId||AppID, // 必填，公众号的唯一标识
			    timestamp:json.timestamp , // 必填，生成签名的时间戳
			    nonceStr: json.nonceStr, // 必填，生成签名的随机串
			    signature:json.signature,// 必填，签名
			    jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone","chooseImage","previewImage","uploadImage","downloadImage","chooseWXPay"] // 必填，需要使用的JS接口列表
			});

		}

	})

   })
	
	
};


//如果是微信端完成配置
if(navigator.userAgent.toLowerCase().indexOf("micromessenger")==-1)
{
	var signature_url="api/wx/get_wx_config";
	if(signature_url)
	{
		wx_config(signature_url)
		
	}
	

}









