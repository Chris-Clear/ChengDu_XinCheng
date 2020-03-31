/*IE9表单占位文字不显示处理的JS方案*/
		(function(){
		    if(navigator.userAgent.indexOf("MSIE")>0){   
		      if(navigator.userAgent.indexOf("MSIE 9.0")>0){
	
		      	  $("head").append($('<style type="text/css">*[placeholder]._default{color:#ccc}</style>'));
			      $("input[placeholder],textarea[placeholder]").each(function(){
			      	  
			      	 
			      	  
			      	  var default_txt=$(this).attr("placeholder").trim();
			      	  if($(this).attr("type")=="password")
			      	  {
			      	      if ((!$(this).val()) || $(this).val()==0)
			      	  	  {
			      	  	  	 $(this).attr("type","text").val(default_txt).addClass("_default");
			      	  	  }
			      	  	  
			      	  	  
			      	  	 
			      	  	  $(this).focus(function(){
				      	  	  if($(this).val().trim()==default_txt)
				      	  	  {
				      	  	  	$(this).attr("type","password").val("").removeClass("_default")	
				      	  	  }
				      	  }).blur(function(){
				      	  	  if($(this).val().trim()==""||$(this).val().trim()==default_txt)
				      	  	  {
				      	  	  	$(this).attr("type","text").val(default_txt).addClass("_default");
				      	  	  }
				      	  })
			      	  	
			      	  	
			      	  	
			      	  }else{
			      	      if ((!$(this).val()) || $(this).val() == 0)
			      	  	  {
			      	  	  	  $(this).val(default_txt).addClass("_default");
			      	  	  }
				      	  $(this).focus(function(){
				      	  	  if($(this).val().trim()==default_txt)
				      	  	  {
				      	  	  	$(this).val("").removeClass("_default")	
				      	  	  }
				      	  }).blur(function(){
				      	  	  if($(this).val().trim()==""||$(this).val().trim()==default_txt)
				      	  	  {
				      	  	  	$(this).val(default_txt).addClass("_default");
				      	  	  }
				      	  })
			      	  	
			      	  }

			      })
		        
		      }   
		    } 
      })()


