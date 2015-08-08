/**
 * 
 */
function byId(id){
	return id instanceof Object ? id : document.getElementById(id);
}

function byClass(sClass, oParent){
	oParent = oParent || document;
    var aResult=[];
    var aEle=oParent.getElementsByTagName('*');

    var re=new RegExp("\\b" + sClass + "\\b","g");
    for(var i=0, l=aEle.length; i<l; i++){
        if(aEle[i].className.search(re) != -1){
            aResult.push(aEle[i]);
        }
    }
    return aResult;
}

function hasClass (sClass, type) {
	var cls = byClass(sClass),
		r = [],
		re = new RegExp("(^|\\s)"+ name +"(\\s|$)"),
		elems = byTag(type || '*');

		for (var j=0; j<elems.length; j++) {
			if (re.test(elems[j].className)) r.push(elems[j]);
		}

	return r;
}

function byTag (tagName, oParent){
	oParent = oParent || document;
	return oParent.getElementsByTagName(tagName);
}

/* dom query */
function prev (elem) {
	do {
		elem = elem.previousSibling;
	} while (elem && elem.nodeType != 1);
	return elem;
}

function next (elem) {
	do {
		elem = elem.nextSilbling;
	} while (elem && elem.nodeType != 1);
	return elem;
}

function first (elem) {
	elem = elem.firstChild;
	return elem && elem.firstChild.nodeType != 1 ? next(elem) : elem;
}

function last (elem){
	elem = elem.lastChild;
	return elem && elem.lastChild.nodeType != 1 ? prev(elem) : elem;
}

/* find ancestor */
function parent (elem, level) {
	level = level || 1;
	for (var i=0; i<level; i++) {
		if (elem != null) elem = elem.parentNode();
	}
	return elem;
}


/* listen to the dom ready function */
function domReady (f){
	if (domReady.done) return f();

	if (domReady.timer) {
		domReady.ready.push(f);
	} else {
		domReady.ready = [ f ];
		addEvent('window', 'load', isDomReady);
		domReady.timer = setInterval(isDomReady, 13);
	}
}

function addEvent (elem, type, handler) {
	if (!isFunction(handler)) {
		return;
	}
	if (!handler.$$guid) handler.$$guid = addEvent.guid++;
	if (!elem.events) elem.events = {};

	var handlers = elem.events[type];

	if (!handlers) {
		handlers = elem.events[type] = {};

		if (elem['on' + type]) {
			handlers[0] = elem['on' + type];
		}
	}

	handlers[handler.$$guid] = handler;
	elem['on' + type] = handleEvent;
}

addEvent.guid = 1;

function removeEvent(elem, type, handler){
	if (elem.events && elem.events[type]) {
		if (handler && handler.$$guid){
			delete elem.events[type][handler.$$guid];
		} else {
			elem.events[type] = {};
		}
	}
}

function handleEvent(event){
	var retVal = true;

	event = event || fixEvent(window.event);
	var handlers = this.events[event.type];

	for (var i in handlers) {
		this.$$handleEvent = handlers[i];

		if (this.$$handleEvent(event) === false) {
			retVal = false;
		}
	}

	return retVal;
}

function fixEvent (event) {
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
}

fixEvent.preventDefault = function (){
	this.returnValue = false;
}

fixEvent.stopPropagation = function (){
	this.cancelBubble = true;
}


function isDomReady () {
	if (domReady.done) return false;

	if (document && document.getElementsByName && document.getElementById && document.body) {
		clearInterval(domReady.timer);
		domReady.timer = null;
		domReady.done = true;
		for (var i=0; i<domReady.ready.length; i++) {
			domReady.ready[i]();
		}
	} 
}


function isFunction (fn){
	return Object.prototype.toString.call(fn) === '[object Function]'
}

/* search text */

function text(e){
	var t = "";
	e = e.childNodes || e;
	for (var j=0; j<e.length; e++) {
		t += e[j].nodeType != 1 ? e[j].nodeValue : text(e[j].childNodes)
	}

	return t;
}

function hasAttr (el, attr) {
	return el.getAttribute(attr) != null;
}

function attr (elem, name, value) {
	if (!name || name.constructor != string) return '';

	name = {'for' : 'htmlFor', 'class' : 'className'}[name] || name;
	if (typeof value != 'undefined') {
		elem[name] = value;

		if (elem.setAttribute) {
			elem.setAttribute(name, value);
		}
	}

	return elem[name] || elem.getAttribute(name) || '';
 }

 function create(elem, sClass){
 	var el = document.createElement(elem);
 	if(sClass){
 		el.className = sClass;
 	}
 	return el;
 }

 function appendElem (elem, oParent, sClass) {
 	return oParent.appendChild(create(elem, sClass));
 }

 function html (elem, h) {
 	elem.innerHTML = h;
 }

/* recursivlly empty children nodes under a given parent node */
 function empty (parentNode) {
 	while (parentNode.firstChild) {
 		remove(parentNode.firstChild);
 	}
 }

 function remove (node){
 	if (node) node.parentNode.removeChild(node);
 }


 function stopBubble (e){
 	if (e && e.stopPropagation) {
 		e.stopPropagation();
 	} else {
 		window.event.cancelBubble = true;
 	}
 }

function preventDefault (e) {
	if (e && e.preventDefault) {
		e.preventDefault();
	} else {
		window.event.returnValue = false;
	}
	return false;
}

function isArray(elems){
	return Object.prototype.toString.call(elems) === '[object Array]';
}

function isArrayLike (o) {
	if (o &&                                // o is not null, undefined, etc.
        typeof o === 'object' &&            // o is an object
        isFinite(o.length) &&               // o.length is a finite number
        o.length >= 0 &&                    // o.length is non-negative
        o.length===Math.floor(o.length) &&  // o.length is an integer
        o.length < 4294967296) {// o.length < 2^32
        	return true;// Then o is array-like
    } else {
        return false; 
    }
}

function forEach(elems, callback){
	if (elems) {
		if (isArray(elems)){
			
			for (var i=0,l=elems.length; i<l; i++) {
				callback.call(elems, i, elems[i]);
			}
		} else {
			for (var attr in elems) {
				callback.call(elems, attr, elems[attr]);
			}
		}
	} else {
		throw new Error('Null object passed into forEach function');
	}
}





/*  Animation related */
function slideToggle (obj) {
	var tarH = css(obj, 'height');
	if (tarH === 0) {
		obj.style.display = 'block';
		buffer(obj, {'height': 180});
	} else {
		buffer(obj, {'height': 0}, null, function(){obj.style.display = 'none';});
		
	}
}
function css(obj, attr, val){
	if (arguments.length == 2) {
		return parseFloat(obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, null)[attr]);
	} else {
		switch (attr){
			case 'width':
			case 'height':
			case 'padding-left':
			case 'padding-right':
			case 'padding-bottom':
			case 'padding-top':
				val = Math.max(val, 0);
			case 'left':
			case 'top':
			case 'margin-left':
			case 'margin-right':
			case 'margin-top':
			case 'margin-bottom':
				obj.style[attr] = val + 'px';
				break;
			case 'opacity':
				obj.style.opacity = val;
				obj.style.filter = 'alpha(opacity:'+(val*100)+')';
				break;
			default : 
				obj.style[attr] = val;
		}

		return function (attr_in, attr_val){css(obj, attr_in, attr_val);};
	}
}


/* a tiny animate function */
function buffer (obj, json, fnDuring, fnEnd, fs){
	clearInterval(obj.timer);
	obj.timer = setInterval(function (){
		var isEnd = true;
		for (var attr in json) {
			var cur,
				speed = 0;

			cur = css(obj, attr);
			speed = (json[attr] - cur) / 7;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

			if (json[attr] != cur) {
				isEnd = false;
			}

			if (fnDuring)fnDuring.call(obj);

			css(obj, attr, cur + speed);
		}

		if (isEnd) {
			clearInterval(obj.timer);
			obj.timer = null;
			fnEnd && fnEnd.call(obj);
		}
	}, fs || 20);
}

function addClass (elem, sClass) {
	var cls = elem.className;
	if (cls) {
		sClass = cls + ' ' + sClass;
	}
	elem.className = sClass;
}

function filteredByClass (arr, sClass) {
	var ret = [];
	for (var i=0; i<arr.length; i++) {
		var s = arr[i].className;
		if (s && s.indexOf(sClass) >= 0) {
			ret.push(arr[i]);
		}
	}

	return ret;
}

// function flex (obj, json, fnDuring, fnEnd){
// 	if(!obj.oSpeed)obj.oSpeed = {};

// 	obj.timer = setInterval(function (){
// 		var isEnd = true,
// 			maxSpeed = 65;
// 		for (var attr in json) {
// 			if(!obj.oSpeed[attr])obj.oSpeed[attr] = 0;
			

// 			if (obj.oSpeed[attr])
// 		}

// 		if (isEnd){
// 			clearInterval(obj.timer);
// 			obj.timer = null;
// 			fnEnd && fnEnd.call(obj);
// 		}
// 	}, 50);
// }

window.debug = true;
function log (k, v) {
	if (window.debug){
		return v ? console.log(k, v) : console.log(k);
	}
}