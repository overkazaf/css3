;(function (root, doc){
	function jLog () {
		return jLog.prototype.init();
	}

	var utils = {
		preceding : 3,
		lineno : 0,
		nextLineNumber : function () {
			var targetNumber = ++this.lineno;
			while (targetNumber.toString().length < this.preceding) {
				targetNumber = '0' + targetNumber;
			}
			return targetNumber;
		},
		css : function (obj, json) {
			for (var attr in json) {
				obj.style[attr] = json[attr];
			}
		},
		byId : function (id){
			return typeof id === 'object' ? id : doc.getElementById(id);
		}
	};

	var msgStack = [],
		msgStackTop = 0;

	jLog.prototype.init = function () {
		return {
			pushStack : function (msg) {
				msgStack[++msgStackTop] = msg;
			},
			log : function (msg) {
				this.pushStack(msg);
				var dom = utils.byId('logger');
				if (dom == null) {
					dom = document.createElement('div');
					dom.id = 'logger';
					utils.css(dom, {
						width : '400px',
						height : 'auto',
						backgroundColor : "#e5e5e5",
						padding : '5px',
						position : 'absolute',
						right : 0,
						top : 0,
						zIndex : 1004
					});
					document.body.appendChild(dom);
				}
				//console.log(dom);
				dom.innerHTML +=  utils.nextLineNumber() + ' : ' + msg + '<br />';
			},
			success : function (msg) {
				var msg = '<b style="color:green">' + msg + '</b>';
				this.log(msg);
			},
			warn : function (msg) {
				var msg = '<b style="color:yellow">' + msg + '</b>';
				this.log(msg);
			},
			error : function (msg) {
				var msg = '<b style="color:red">' + msg + '</b>';
				this.log(msg);
			}
		};
	};


	root.jLog = jLog();
})(window, document);