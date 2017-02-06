/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function () {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for (var i = 0; i < this.length; i++) {
			var item = this[i];
			if (item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js??ref--2-2!./header.css", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js??ref--2-2!./header.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js??ref--2-2!./index.css", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js??ref--2-2!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js??ref--2-2!./work.css", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js??ref--2-2!./work.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "header {\n  height: 100vh;\n  width: 100%;\n  color: #ffffff;\n  font-family: 'Merienda', cursive, 'roboto', 'sans';\n  font-weight: bold;\n  background-image: url(" + __webpack_require__(13) + ");\n  background-size: cover;\n  background-position: 50% 50%;\n}\n\nheader .preloader {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  background: rgb(10, 13, 31) url(" + __webpack_require__(14) + ") no-repeat 50% 50%;\n  z-index: 100;\n}\n\nheader .cover {\n  height: 100vh;\n  width: 100%;\n  background-color: rgba(10, 13, 31, 0.8);\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n\nheader .side-bar {\n  display: none;\n  z-index: 1100;\n}\n\nheader .side-bar-icon {\n  font-size: 30px;\n  color: white;\n  margin-right: 10px;\n}\n\n/* nav bar  */\nheader > .nav-bar {\n  height: 80px;\n  width: 100%;\n  margin: 0 auto;\n  font-size: 18px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  font-family: 'Oxygen', 'sans';\n}\n\nheader > .nav-bar ul {\n  z-index: 100;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  margin-right: 100px;\n}\n\nheader > .nav-bar ul li {\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  text-align: center;\n  width: 130px;\n  cursor: pointer;\n}\n\nheader > .nav-bar ul li:after {\n  content: '';\n  background: transparent;\n  width: 0;\n  height: 2px;\n  display: block;\n  margin-top: 8px;\n  -webkit-transition: width 0.3s ease, background-color 0.3s ease;\n  transition: width 0.3s ease, background-color 0.3s ease;\n}\n\nheader > .nav-bar ul li:hover:after {\n  width: 130px;\n  background-color: white;\n}\n\n\nheader > .nav-bar ul a {\n  text-decoration: none;\n  color: white;\n  cursor: pointer;\n}\n\n/* middle bar  */\nheader .wrapper {\n  text-align: center;\n  z-index: 10;\n  height: calc(100vh - 160px);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\nheader .wrapper p {\n  z-index: 10;\n}\n\n\nheader .wrapper p > span {\n  margin: 0;\n  opacity: 0;\n  display: inline-block;\n  -webkit-transition: opacity 2.8s;\n  transition: opacity 2.8s;\n  font-size: 2rem;\n}\n\nheader .wrapper p > span.name {\n  -webkit-transition-delay: 1.3s;\n          transition-delay: 1.3s;\n}\n\nheader .wrapper p > span.profession {\n  -webkit-transition-delay: 2.5s;\n          transition-delay: 2.5s;\n}\n\nheader .wrapper.move p > span {\n  opacity: 1;\n}\n\nheader .wrapper > ul {\n  font-size: 2.4rem;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\nheader .wrapper > ul li {\n  display: inline-block;\n  opacity: 0;\n  -webkit-transition: all 1s cubic-bezier(0.03, 0.56, 0.51, 1.15);\n  transition: all 1s cubic-bezier(0.03, 0.56, 0.51, 1.15);\n  -webkit-transform: translateY(-70px);\n          transform: translateY(-70px);\n}\n\nheader .wrapper > ul li:nth-child(1) {\n  -webkit-transform: translate(-40px, 90px);\n          transform: translate(-40px, 90px);\n}\nheader .wrapper > ul li:nth-child(2) {\n  -webkit-transform: translate(40px, -90px);\n          transform: translate(40px, -90px);\n  -webkit-transition-delay: .1s;\n          transition-delay: .1s;\n}\nheader .wrapper > ul li:nth-child(3) {\n  -webkit-transform: translate(100px, -65px);\n          transform: translate(100px, -65px);\n  -webkit-transition-delay: .2s;\n          transition-delay: .2s;\n}\nheader .wrapper > ul li:nth-child(4) {\n  -webkit-transform: translate(-80px, 60px);\n          transform: translate(-80px, 60px);\n  -webkit-transition-delay: .3s;\n          transition-delay: .3s;\n}\nheader .wrapper > ul li:nth-child(5) {\n  -webkit-transform: translate(35px, 60px);\n          transform: translate(35px, 60px);\n  -webkit-transition-delay: .4s;\n          transition-delay: .4s;\n}\nheader .wrapper > ul li:nth-child(6) {\n  -webkit-transform: translate(40px, 100px);\n          transform: translate(40px, 100px);\n  -webkit-transition-delay: .5s;\n          transition-delay: .5s;\n}\nheader .wrapper > ul li:nth-child(7) {\n  -webkit-transform: translate(70px, -90px);\n          transform: translate(70px, -90px);\n  -webkit-transition-delay: .6s;\n          transition-delay: .6s;\n}\n\nheader .wrapper > ul.move li {\n  opacity: 1;\n  -webkit-transform: translateY(0px);\n          transform: translateY(0px);\n}\n\n/* Medium Devices, Desktops */\n@media only screen and (max-width : 992px) {\n  header > .nav-bar ul {\n    margin-right: 20px;\n  }\n}\n\n/* Small Devices, Tablets */\n@media only screen and (max-width : 482px) {\n  header {\n    overflow: hidden;\n  }\n\n  header > .nav-bar > ul.nav-list {\n    position: absolute;\n    top: 0;\n    width: 0;\n    display: block;\n    height: 100vh;\n    overflow: hidden;\n    background-color: rgb(10, 13, 31); \n    padding-top: 20px;\n    box-sizing: border-box;\n    font-size: 20px; \n\n    -webkit-transition: all 0.3s linear; \n\n    transition: all 0.3s linear;\n  }  \n  \n  header > .nav-bar > ul.nav-list li {\n    margin: 10px auto 0;\n    border-bottom: 1px solid rgba(255, 255, 255, .4);\n  }\n\n  header > .nav-bar > ul.nav-list li:last-child {\n    border: none;\n  }\n  header > .nav-bar ul li:hover:after {\n    width: 0;\n  }\n\n  header > .nav-bar.open > ul.nav-list {\n    width: 150px;\n  }\n  \n  header .side-bar {\n    display: block;\n    -webkit-transition: all 0.3s linear;\n    transition: all 0.3s linear;\n  }\n  \n  header nav.open .side-bar{\n    -webkit-transform: translateX(-150px);\n            transform: translateX(-150px);\n  }\n\n  header .wrapper > ul {\n    font-size: 1.65rem;\n  }\n\n  header .wrapper p > span {\n    font-size: 1.25rem;\n  }\n\n  header .wrapper p {\n    text-align: center;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "button,hr,input{overflow:visible}audio,canvas,progress,video{display:inline-block}progress,sub,sup{vertical-align:baseline}html{font-family:sans-serif;line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0} menu,article,aside,details,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}a:active,a:hover{outline-width:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{}button,select{text-transform:none}[type=submit], [type=reset],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}[hidden],template{display:none}/*# sourceMappingURL=normalize.min.css.map */", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "section.work {\n  min-height: 100vh;\n  width: 100%;\n  font-family: 'Oxygen', 'sans';\n  padding: 30px 0;\n  overflow: hidden;\n}\n\nsection.work > h1 {\n  margin: 0 auto;\n  padding: 28px 0;\n  text-align: center;\n  font-size: 2.7rem;\n  font-weight: bold;\n  color: #262c35;\n} \n\nsection.work > .container {\n  max-width: 992px;\n  margin: 20px auto;\n\n  display: -webkit-box;\n\n  display: -ms-flexbox;\n\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\nsection.work > .container .work-item {\n  height: 330px;\n  width: 440px;\n  background: #e3e3e3;\n  margin: 10px;\n  border-radius: 5px;\n  overflow: hidden;\n  position: relative;\n\n  -webkit-transition: -webkit-transform 1.0s cubic-bezier(0.13, 0.47, 0.35, 0.84);\n\n  transition: -webkit-transform 1.0s cubic-bezier(0.13, 0.47, 0.35, 0.84);\n\n  transition: transform 1.0s cubic-bezier(0.13, 0.47, 0.35, 0.84);\n\n  transition: transform 1.0s cubic-bezier(0.13, 0.47, 0.35, 0.84), -webkit-transform 1.0s cubic-bezier(0.13, 0.47, 0.35, 0.84);  \n\n  display: -webkit-box;  \n\n  display: -ms-flexbox;  \n\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n\n}\n\nsection.work > .container.animate-items .work-item {\n  -webkit-transform: translateX(0);\n          transform: translateX(0);\n}\n\nsection.work > .container.animate-items .work-item:last-child {\n  -webkit-transition-delay: 0.3s;\n          transition-delay: 0.3s;\n}\n\nsection.work > .container.animate-items .work-item:nth-child(3) {\n  -webkit-transition-delay: 0.3s;\n          transition-delay: 0.3s;\n}\n\nsection.work > .container .work-item ul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\nsection.work > .container .work-item-cover {\n  height: calc(100% - 70px);\n  width: 100%;\n  background-color: hsla(220,17%,20%,0.75);\n  position: absolute;\n  left: 0;\n  top:0;\n  display: none;\n}\n\nsection.work > .container .work-item-left {\n  -webkit-transform: translateX(-40%);\n          transform: translateX(-40%);\n}\n\nsection.work > .container .work-item-right {\n  -webkit-transform: translateX(40%);\n          transform: translateX(40%);\n}\n\nsection.work > .container .btn {\n  display: inline-block;\n  border-radius: 15px;\n  text-decoration: none;\n  background-color: #F27F7A;\n  font-size: 18px;\n  color: white;\n  padding: 15px 50px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  text-transform: capitalize;\n}\n\nsection.work > .container .work-item .desc {\n  height: 70px;\n  width: 100%;\n  background-color: #262c35;\n  color: white;\n  padding: 0 20px;\n  box-sizing: border-box;\n\n  display: -webkit-box;\n\n  display: -ms-flexbox;\n\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\nsection.work .work-item .desc span {\n  color: #e1e1e1;\n  text-transform: capitalize;\n  font-size: 1rem;\n  font-weight: bold;\n}\n\nsection.work .work-item .desc li { \n  box-sizing: border-box;\n  border: 5px solid #e1e1e1;\n  border-radius: 50%;\n  padding: 5px;\n  display: inline-block;\n}\n\nsection.work .work-item .desc li.active {\n  border-color: #F27F7A;\n  \n} \n\nsection.work .work-item .desc li:hover {\n  cursor: pointer;\n} \n\nsection.work .work-item ul.slider {\n  height: calc(100% - 70px);\n  width: calc(440px * 3);\n  overflow: hidden;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0;\n  margin: 0;\n  border: none;\n  -webkit-transition: -webkit-transform 0.3s linear;\n  transition: -webkit-transform 0.3s linear;\n  transition: transform 0.3s linear;\n  transition: transform 0.3s linear, -webkit-transform 0.3s linear; \n}\n\nsection.work .work-item ul.slider li {\n  width: 440px;\n  height: 100%;\n  display: inline-block;\n  padding: 0;\n  margin: 0;\n  background-size: cover;\n  background-position: 50% 50%;\n}\n\nsection.work .work-item ul.adhero-slider li:first-child {\n  background-image: url(" + __webpack_require__(8) + ");\n}\n\nsection.work .work-item ul.adhero-slider li:nth-child(2) {\n  background-image: url(" + __webpack_require__(9) + ");\n}\nsection.work .work-item ul.adhero-slider li:last-child {\n  background-image: url(" + __webpack_require__(10) + ");\n}\n\nsection.work .work-item ul.prezhero-slider li:first-child {\n  background-image: url(" + __webpack_require__(15) + ");\n}\n\nsection.work .work-item ul.prezhero-slider li:nth-child(2) {\n  background-image: url(" + __webpack_require__(16) + ");\n}\n\nsection.work .work-item ul.prezhero-slider li:last-child {\n  background-image: url(" + __webpack_require__(17) + ");\n}\n\nsection.work .work-item ul.channelhero-slider li:first-child {\n  background-image: url(" + __webpack_require__(11) + ");\n}\n\nsection.work .work-item ul.channelhero-slider li:last-child {\n  background-image: url(" + __webpack_require__(12) + ");\n}\n\nsection.work .work-item ul.sadili-slider li:first-child {\n  background-image: url(" + __webpack_require__(18) + ");\n}\n\nsection.work .work-item ul.sadili-slider li:nth-child(2) {\n  background-image: url(" + __webpack_require__(19) + ");\n}\n\nsection.work .work-item ul.sadili-slider li:last-child {\n  background-image: url(" + __webpack_require__(20) + ");\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "846886ece3f33dcee8fedc38890817c2.png";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "4841f971f0bf43363449249cf94c703e.png";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "7fe9869c415e8269d54a09c13764fcc2.png";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "8791cda8bed49ae15feb2f4576a33549.png";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "d1efc5aa18bf29e4d8796e851288c176.png";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "dd3df2802f5b2c4f1b85d97cff24d95e.jpg";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "0e05490d28bcb42e7bc41e20c6b3c76c.svg";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "91a9fcdb0f9358d97b4265e2364227ea.png";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "a3d83252c964ae32422bc2b240d79d83.png";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "392f02640f39a929351068794faf5e34.png";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "6b4ba53fb4beea4919ec3f331452028b.png";

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "1a0f291b63b396c690a76f85da349c98.png";

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "c83a2f1621f9b3a5b10d23428d2751a0.png";

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(3);

__webpack_require__(2);

__webpack_require__(4);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
  var list = document.querySelector('header .wrapper > ul');
  var wrapper = document.querySelector('header .wrapper');
  var navBar = document.querySelector('header .nav-bar');
  var sidebar = navBar.querySelector('.side-bar');
  var workImgListItems = document.querySelectorAll('.work .desc-list li');
  var workItemSliders = document.querySelectorAll('.work .work-item .slider');
  var workItemCovers = document.querySelectorAll('.work .work-item .work-item-cover');

  sidebar.addEventListener('click', toggleSidebar);
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', addAnimations);
  workImgListItems.forEach(function (item) {
    return item.addEventListener('click', tranformList);
  });
  workItemSliders.forEach(function (item) {
    return item.addEventListener('mouseover', mousEntered);
  });
  workItemCovers.forEach(function (item) {
    return item.addEventListener('mouseleave', mouseLeft);
  });

  window.onload = function () {
    document.querySelector("header .preloader").style.display = "none";
    animateGreeting();
  };

  function addAnimations() {
    var container = document.querySelector('section.work > .container');
    var rectOffset = container.getBoundingClientRect();
    var clientHeight = container.clientHeight;

    if (rectOffset.top <= clientHeight / 1.5) {
      container.classList.contains('animate-items') ? null : container.classList.add('animate-items');
    }
  }

  function animateGreeting() {
    setTimeout(function () {
      list.classList.add('move');
      wrapper.classList.add('move');
    }, 400);
  }

  function handleResize() {
    var width = document.body.clientWidth;

    if (navBar.classList.contains('open') && width > 480) navBar.classList.remove('open');
  }

  function toggleSidebar() {
    navBar.classList.toggle('open');
  }

  function tranformList() {
    var siblings = [].concat(_toConsumableArray(this.parentNode.children));
    var sliderName = '.' + this.dataset.name + '-slider';
    var index = parseInt(this.dataset.index);
    var width = 440;
    var degree = -(index * width);

    siblings.forEach(function (item) {
      return item.classList.contains('active') && item.classList.remove('active');
    });
    document.querySelector(sliderName).style['transform'] = 'translateX(' + degree + 'px)';
    document.querySelector(sliderName).style['-webkit-transform'] = 'translateX(' + degree + 'px)';
    this.classList.add('active');
  }

  function mousEntered() {
    this.parentNode.querySelector('.work-item-cover').style.display = 'block';
  }

  function mouseLeft() {
    this.style.display = 'none';
  }
})();

/***/ })
/******/ ]);