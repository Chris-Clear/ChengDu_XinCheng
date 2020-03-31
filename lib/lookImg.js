//示例
//<div class="thumb" v-bind:thumblist="imgsdata.list2">
//		        <img v-for='item in imgsdata.list2' v-bind:src="item">
//		      </div>
//如果需要委托。在父级不变的地方加类"thumb"
( function(){
		 
	if ($(".thumb").length){
		$('body').append(' <div class="swiper-container" id="origin-img"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div></div>')
		  setTimeout(function(){
					  var swiper = new Swiper('#origin-img.swiper-container',{
				  zoom:true,
				  width: window.innerWidth,
				  virtual: true,
				  spaceBetween:20,
				  pagination: {
					el: '.swiper-pagination',
					type: 'fraction',
				 },
				 on:{
				   click: function(){
						 $('#origin-img').fadeOut('fast');
					  this.virtual.slides.length=0;
					  this.virtual.cache=[]; 
					  swiperStatus=false;
					 
				 },
			  },
			
			});
		  //   背景图加(bigImg)类
			  $(document).on("click",".thumb img,.thumb .bigImg",function(){
						  clickIndex=$(this).index();
			
						  //	  imglist=$(this).parent().attr('thumblist');
						  //	  imgs = imgsdata[imglist];
						  imgs = $(this).parent().attr('thumblist').split(',')
						  console.log(swiper)
						  console.log(imgs.length)
						  for(i=0;i<imgs.length;i++){
							  swiper.virtual.appendSlide('<div class="swiper-zoom-container"><img src="'+imgs[i]+'" /></div>');
						  }
						  swiper.slideTo(clickIndex);
						  $('#origin-img').fadeIn('fast');
						  swiperStatus=true;
					  
				
				
			})
		  },1500)
		  
	
   
		
  //切换图状态禁止页面缩放	
	  document.getElementById('origin-img').addEventListener('touchstart',function (event) {  
			  if(event.touches.length>1 && swiperStatus){  
				  event.preventDefault();  
			  }  
		  })  
		  var lastTouchEnd=0;  
	  document.getElementById('origin-img').addEventListener('touchend',function (event) {  
			  var now=(new Date()).getTime();  
			  if(now-lastTouchEnd<=300){  
				  event.preventDefault();  
			  }  
			  lastTouchEnd=now;  
		  },false)
  
	  document.getElementById('origin-img').addEventListener('touchmove',function(e){
		  // console.log(swiperStatus)
		  if(swiperStatus!=undefined&&swiperStatus){
			  e.preventDefault();
		  }
	  })	
	}
} )()