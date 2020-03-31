$.extend({
	mockajax:function(json){
		json=$.extend(json,{
				param:function(data,list,test){
			    
				     var total=list.data.length;
				      for(var key in data)
				      {
				      	   if(!test[key].test(data[key]))
				      	   return false
				      };
				     return {data:list.data.slice((data.page-1)*data.rows,data.page*data.rows),pages:Math.ceil(total/data.pages_size)};
			
				   }	
		});
	   if (!window["mockObj"])
	   {
	   	  window.mockObj={};
	   }
		window.mockObj[json.url]=$.extend({},json);
		delete window.mockObj[json.url].url;
		for(var key in json.model_data)
		{
			if(key.indexOf("|")>0)
			 {
			     var ary=key.split("|");
			     var guize=ary[1].split("@").slice(1);


			     window.mockObj[json.url][ary[0]]=[];
			     var model_data_ary=window.mockObj[json.url][ary[0]];
			      guize.forEach(function(item,index,array){
			      	  if(item>=0)
			      	  {
			      	  
			      	  	  for(var i=1;i<=item;i++)
			      	  	  {
                               if(ary.join(",").indexOf("number++")>0)
                               {
                               	 model_data_ary.push($.extend({},window.mockObj[json.url].model_data[key],{id:i}))
                               }else{
                               	 model_data_ary.push($.extend({},window.mockObj[json.url].model_data[key]))
                               	
                               }
                               
			      	  	  }
	
			      	  }

			      });
			      window.mockObj[json.url]["reponse"]={data:model_data_ary};

			 }
			
			
		}
	   
	},

	ajax:function(json){
		setTimeout(function(){
				if(!window.mockObj[json.url])
				{
					typeof json.error =="function"||json.error();
					return false;
				}else{
					var res=window.mockObj[json.url].param(json.data,window.mockObj[json.url]["reponse"],{page:/\d+/,rows:/\d+/})
				   
					if(!res)
					{
						go_alert2("参数错误")
						
					}else if(res.length==0)
					{
						go_alert2("没有数据了")
						
					}else{
						json.success(res)
					}
			
				}
			
			
			
			
			
			
		},window.mockObj[json.url].useTime||1000)
	
	}
	
	
	
	
	
	
})


