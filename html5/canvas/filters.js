(function (){
	Filters = {};
	
	Filters.getCanvas = function (width, height){
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		return document.body.appendChild(canvas);
	};

	Filters.getPixels = function (img){
		var c = this.getCanvas(img.width, img.height);
		if (c.getContext) {
			var ctx = c.getContext('2d');
			ctx.drawImage(img, 0, 0);
			return ctx.getImageData(0,0, img.width, img.height);
		}
	};

	Filters.filterImage = function (filter, image, argv) {
		var args = [this.getPixels(image)];

		for (var i=2; i<(arguments && arguments.length || 0); i++) {
			args.push(arguments[i]);
		}
		return filter.apply(null, args);
	}

	Filters.grayscale = function (pixels, args){
		var data = pixels.data;
		for (var i = 0; i < data.length; i+=4) {
			var r = data[i];
			var g = data[i+1];
			var b = data[i+2];
			// 灰度公式
			var v = 0.2126*r + 0.7152*g + 0.0722*b;
			data[i] = data[i+1] = data[i+2] = v;
		}

		return pixels;
	}

	Filters.brightness = function(pixels, adjustment) {
		var data = pixels.data;
		for (var i = 0; i < data.length; i+=4) {
			data[i] += adjustment;
			data[i+1] += adjustment; 
			data[i+2] += adjustment;
		}

		return pixels;
	};

	Filters.threshold = function(pixels, threshold_val) {
		var data = pixels.data;
		for (var i = 0; i < data.length; i+=4) {
			var r = data[i];
			var g = data[i+1];
			var b = data[i+2];
			// 灰度公式
			var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold_val) ? 255:0;
			data[i] = data[i+1] = data[i+2] = v;
		}
		return pixels;
	};





	Filters.tmpCanvas = document.createElement('canvas');
	Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

	Filters.createImageData = function(w,h) {
	  return this.tmpCtx.createImageData(w,h);
	};

	// 锐化
	Filters.convolute = function(pixels, weights, opaque) {
	  var side = Math.round(Math.sqrt(weights.length));
	  var halfSide = Math.floor(side/2);
	  var src = pixels.data;
	  var sw = pixels.width;
	  var sh = pixels.height;
	  // pad output by the convolution matrix
	  var w = sw;
	  var h = sh;
	  var output = Filters.createImageData(w, h);
	  var dst = output.data;
	  // go through the destination image pixels
	  var alphaFac = opaque ? 1 : 0;
	  for (var y=0; y<h; y++) {
	    for (var x=0; x<w; x++) {
	      var sy = y;
	      var sx = x;
	      var dstOff = (y*w+x)*4;
	      // calculate the weighed sum of the source image pixels that
	      // fall under the convolution matrix
	      var r=0, g=0, b=0, a=0;
	      for (var cy=0; cy<side; cy++) {
	        for (var cx=0; cx<side; cx++) {
	          var scy = sy + cy - halfSide;
	          var scx = sx + cx - halfSide;
	          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
	            var srcOff = (scy*sw+scx)*4;
	            var wt = weights[cy*side+cx];
	            r += src[srcOff] * wt;
	            g += src[srcOff+1] * wt;
	            b += src[srcOff+2] * wt;
	            a += src[srcOff+3] * wt;
	          }
	        }
	      }
	      dst[dstOff] = r;
	      dst[dstOff+1] = g;
	      dst[dstOff+2] = b;
	      dst[dstOff+3] = a + alphaFac*(255-a);
	    }
	  }
	  return output;
	};

	window.Filters = Filters;
})();