/*手机滑动事件封装*/
var touchMove=(function(){
	var startx,starty;
		//获得角度
	    function getAngle(angx, angy) {
	        return Math.atan2(angy, angx) * 180 / Math.PI;
	    };
	 
	    //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
	    function getDirection(startx, starty, endx, endy) {
	        var angx = endx - startx;
	        var angy = endy - starty;
	        var result = {"status":0,"x":0,"y":0};
	 
	        //如果滑动距离太短
	        if (Math.abs(angx) < 70 && Math.abs(angy) < 70) {
	            return result;
	        }
	 
	        var angle = getAngle(angx, angy);
	        if (angle >= -135 && angle <= -45) {
	            result = {"status":1,"x":angx,"y":angy};
	        } else if (angle > 45 && angle < 135) {
	            result = {"status":2,"x":angx,"y":angy};;
	        } else if ((angle >= 160 && angle <= 180) || (angle >= -180 && angle < -160)) {
	            result = {"status":3,"x":angx,"y":angy};;
	        } else if (angle >= -20 && angle <= 20) {
	            result = {"status":4,"x":angx,"y":angy};;
	        }else{
	        	result={"status":0,"x":0,"y":0};
	        	
	        }
	        return result;
	    };





	   $.fn.extend({
	   	  touchStart:function(e){
	   	  	  
	   	  		startx = e.touches[0].pageX;
		        starty = e.touches[0].pageY;
	   	  	
	   	  	
	   	  },
	   	  touchEnd:function(e){
	   	         var that=$(this);

	   	  	     var endx, endy;
		    	 endx = e.changedTouches[0].pageX;
	             endy = e.changedTouches[0].pageY;
		    	var direction = getDirection(startx, starty, endx, endy);
		    		var json={
					     up_func:function(){
					     	that.touchEnd.prototype.param.up_func(that,{"x":direction.x,"y":direction.y})
					     },
					     down_func:function(){
					        that.touchEnd.prototype.param.down_func(that,{"x":direction.x,"y":direction.y})
					     },
					     left_func:function(){
					     	that.touchEnd.prototype.param.left_func(that,{"x":direction.x,"y":direction.y})
					     },
					     right_func:function(){
					     	that.touchEnd.prototype.param.right_func(that,{"x":direction.x,"y":direction.y})
					     }
				   };
		    
		        switch (direction.status) {
		            case 0:
		                break;
		            case 1:
		                typeof  json.up_func=="function"&&json.up_func()
		                break;
		            case 2:
		                typeof  json.down_func=="function"&&json.down_func()
		                break;
		            case 3:
		                typeof  json.left_func=="function"&&json.left_func()
		                break;
		            case 4:
		                typeof  json.right_func=="function"&&json.right_func()
		                break;
		            default:
		        }
	   	  	
	   	  	
	   	  	
	   	  	
	   	  },
	   	
	   	
	   	  stopDrag:function(){
	   	  	var that=this;
	   	  	$(this).each(function(){
	   	  		$(this)[0].removeEventListener("touchstart",that.touchStart, false);
				$(this)[0].removeEventListener("touchend", that.touchEnd, false);
	   	  	})
	   	  },
		 touchDrag:function(param){
		 	var that=this;
			$(this).each(function(){
				var dom=$(this);
				that.touchEnd.prototype.param=param;
			    dom[0].addEventListener("touchstart",that.touchStart, false);
				dom[0].addEventListener("touchend", that.touchEnd, false);

			});
			
		}

	})

})()








