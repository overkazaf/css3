/**
 * Author : overkazaf
 * Email  : overkazaf@gmail.com
 * QQ     : 289202839
 * Date   : 2015/8/6 20:15
 * 
 * [An stupid slideUp jQuery plugin]
 * @param  {[type]} $ []
 * @return {[type]}   []
 */
;(function ($){
	$.fn.slideUp = function (options){
		var opt = $.extend({}, $.fn.slideUp.defaults, options || {});
		return this.each(function (){
			var that = this,
				$moveObj = $(that).children(opt.animateSelector),
				$subContainers = $moveObj.find(opt.subContainer),
				srcLength = $subContainers.length,
				moveObj = $moveObj.get(0),
				top = 0,
				index = 0,
				su = {
					init : function (){
						su.bindEvents();
						su.start();
					},
					bindEvents : function (){
						$moveObj.on('mouseover', su.stop)
							    .on('mouseout', su.start);
					},
					start : function (){
						
						moveObj.timer = setInterval(function(){
							var arr = [];
							top -= opt.step;
							$moveObj.css({
								top : top
							});
							
							var $c = $moveObj.find(opt.subContainer);
							var $f = $c.eq(index);
							if (-$f.offset().top >= $f.outerHeight()){
								index++;
								$f.clone().appendTo($moveObj);

								if ($c.length >= srcLength*2) {
									// 移除
									var tmp = [];
									$c.each(function (i, el){
										if(i < srcLength){
											tmp.push(el);
										}
									});
									$.each(tmp, function (j , $el){
										$el.remove();
									});

									index -= srcLength;
									top = 0;

								}
							}
						}, opt.speed);
					},
					stop : function (){
						if (moveObj.timer) {
							clearInterval(moveObj.timer);
							moveObj.timer = null;
						}
					}
				};

			su.init();
		});

	};

	$.fn.slideUp.defaults = {
		speed 			: 30, // 动画周期
		step            : 1,  // 每秒位移
		direction       : 'vertical', // 预留接口
		animateSelector : 'ul',  // 位移元素 || jq选择器
		subContainer    : 'li'  // 列表子元素 || jq选择器
	};
})(jQuery);