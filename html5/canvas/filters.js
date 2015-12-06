(function (){
	Filter = {};
	
	Filter.getCanvas = function (width, height){
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		return document.appendChild(canvas);
	};

	Filter.pixels = function (img){
		var c = this.getCanvas(img.width, img.height);
		if (c.getContext) {
			var ctx = c.getContext('2d');
			ctx.drawImage(img, 0, 0);
			return ctx.getImageData(0,0, img.width, img.height);
		}
	};

	window.Filter = Filter;
})();