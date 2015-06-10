/*
 * raf.js
 * https://github.com/ngryman/raf.js
 *
 * original requestAnimationFrame polyfill by Erik Möller
 * inspired from paul_irish gist and post
 *
 * Copyright (c) 2013 ngryman
 * Licensed under the MIT license.
 */

(function(window) {
	var lastTime = 0,
		vendors = ['webkit', 'moz'],
		requestAnimationFrame = window.requestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame,
		i = vendors.length;

	// try to un-prefix existing raf
	while (--i >= 0 && !requestAnimationFrame) {
		requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
		cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
	}

	// polyfill with setTimeout fallback
	// heavily inspired from @darius gist mod: https://gist.github.com/paulirish/1579671#comment-837945
	if (!requestAnimationFrame || !cancelAnimationFrame) {
		requestAnimationFrame = function(callback) {
			var now = +new Date(), nextTime = Math.max(lastTime + 16, now);
			return setTimeout(function() {
				callback(lastTime = nextTime);
			}, nextTime - now);
		};

		cancelAnimationFrame = clearTimeout;
	}

	// export to window
	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;
}(window));

/*!
 * Polyfill CSS object-fit
 * http://helloanselm.com/object-fit
 *
 * @author: Anselm Hannemann <hello@anselm-hannemann.com>
 * @author: Christian "Schepp" Schaefer <schaepp@gmx.de>
 * @version: 0.3.4
 *
 */

(function (global) {

	'use strict';

	// Storage variable
	var objectFit = {}, defaultStyleCache = {};

	objectFit._debug = false;

	objectFit.observer = null;

	objectFit.disableCrossDomain = 'false';

	objectFit.getComputedStyle = function(element, context) {
		context = context || window;

		if (context.getComputedStyle) {
			return context.getComputedStyle(element, null);
		}
		else {
			return element.currentStyle;
		}
	};

	objectFit.getDefaultComputedStyle = function(element){
		// Assume that items with a src attribute are an image and that the image
		// referenced won't change dimensions (at least while we're loaded this session).
		if (element.src && defaultStyleCache[element.src]) {
			return defaultStyleCache[element.src];
		}

		var newelement = element.cloneNode(true);
		var styles = {};
		var iframe = document.createElement('iframe');
		document.body.appendChild(iframe);
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.write('<body></body>');
		iframe.contentWindow.document.body.appendChild(newelement);
		iframe.contentWindow.document.close();

		var defaultElement = iframe.contentWindow.document.querySelectorAll(element.nodeName.toLowerCase())[0];
		var defaultComputedStyle = this.getComputedStyle(defaultElement, iframe.contentWindow);
		var value;
		var property;

		for (property in defaultComputedStyle) {
			// Filter out unneeded properties that are functions or are the "0" ~ "210" ones.
			if (typeof defaultComputedStyle[property] === "function" || parseInt(property, 10) > 0) {
				continue;
			}

			value = defaultComputedStyle[property];

			if (value !== null) {
				switch (property) {
					default:
						styles[property] = value;
					break;

					case 'width':
					case 'height':
					case 'minWidth':
					case 'minHeight':
					case 'maxWidth':
					case 'maxHeight':
					break;
				}
			}
		}

		document.body.removeChild(iframe);

		if (element.src) {
			defaultStyleCache[element.src] = styles;
		}

		return styles;
	};

	// Detects orientation
	objectFit.orientation = function(replacedElement) {
		if (replacedElement.parentNode && replacedElement.parentNode.nodeName.toLowerCase() === 'x-object-fit') {
			var width = replacedElement.naturalWidth || replacedElement.clientWidth;
			var height = replacedElement.naturalHeight || replacedElement.clientHeight;
			var parentWidth = replacedElement.parentNode.clientWidth;
			var parentHeight = replacedElement.parentNode.clientHeight;

			if (!height || width / height > parentWidth / parentHeight) {
				if (replacedElement.getAttribute('data-x-object-relation') !== 'wider') {
					replacedElement.setAttribute('data-x-object-relation','wider');
					replacedElement.className = 'x-object-fit-wider';

					if (this._debug && window.console) {
						console.log('x-object-fit-wider');
					}
				}
			} else {
				if (replacedElement.getAttribute('data-x-object-relation') !== 'taller') {
					replacedElement.setAttribute('data-x-object-relation','taller');
					replacedElement.className = 'x-object-fit-taller';

					if (this._debug && window.console) {
						console.log('x-object-fit-taller');
					}
				}
			}
		}
	};

	objectFit.process = function(args) {
		if (!args.selector || !args.replacedElements) {
			return;
		}

		// Set option objectFit.disableCrossDomain
		objectFit.disableCrossDomain = args.disableCrossDomain || 'false';

		// Set option fit-type
		args.fittype = args.fittype || 'none';

		switch (args.fittype) {
			default:
				return;

			case 'none':
			case 'fill':
			case 'contain':
			case 'cover':
			break;
		}

		// Set option replacedElements
		var replacedElements = args.replacedElements;

		if(!replacedElements.length) {
			return;
		}

		for (var i = 0, replacedElementsLength = replacedElements.length; i < replacedElementsLength; i++) {
			this.processElement(replacedElements[i], args);
		}
	};

	objectFit.processElement = function(replacedElement, args) {
		var property;
		var value;
		var replacedElementStyles = objectFit.getComputedStyle(replacedElement);
		var replacedElementDefaultStyles = objectFit.getDefaultComputedStyle(replacedElement);
		var wrapperElement = document.createElement('x-object-fit');

		if (objectFit._debug && window.console) {
			console.log('Applying to WRAPPER-------------------------------------------------------');
		}

		for (property in replacedElementStyles) {
			switch (property) {
				default:
					// Filter out unneeded properties that are functions or are the "0" ~ "210" ones.
					if (typeof replacedElementStyles[property] === "function" || parseInt(property, 10) > 0) {
						continue;
					}

					wrapperElement.style.setProperty(property, replacedElementStyles[property], "");
				break;

				case 'length':
				case 'parentRule':
				break;
			}
		}

		if (objectFit._debug && window.console) {
			console.log('Applying to REPLACED ELEMENT-------------------------------------------------------');
		}
		for (property in replacedElementDefaultStyles) {
			switch (property) {
				default:
					value = replacedElementDefaultStyles[property];

					if (objectFit._debug && window.console && value !== '') {
						console.log(property + ': ' + value);

						if (replacedElement.style[property] === undefined) {
							console.log('Indexed style properties (`' + property + '`) not supported in: ' + window.navigator.userAgent);
						}
					}

					if (replacedElement.style[property]) {
						replacedElement.style[property] = value; // should work in Firefox 35+ and all other browsers
					} else {
						replacedElement.style.property = value;
					}
				break;

				case 'length':
				case 'parentRule':
				break;
			}
		}

		wrapperElement.setAttribute('class','x-object-fit-' + args.fittype);
		replacedElement.parentNode.insertBefore(wrapperElement, replacedElement);
		wrapperElement.appendChild(replacedElement);

		objectFit.orientation(replacedElement);
	};

	objectFit.listen = function (args) {
		var scheduleId = null;
		var scheduleScan = function (disconnectListener, reconnectListener) {
			if (scheduleId) {
				window.clearTimeout(scheduleId);
			}

			scheduleId = window.setTimeout(function () {
				scanDocument(disconnectListener, reconnectListener);
				scheduleId = null;
			}, 500);
		};

		var scanDocument = function (disconnectListener, reconnectListener) {
			disconnectListener();

			for (var i = 0; i < args.length; ++i) {
				args[i].replacedElements = document.querySelectorAll(args[i].selector);
				objectFit.process(args[i]);
			}

			reconnectListener();
		};

		var domRemovedAction = function (element) {
			if (element.nodeName.toLowerCase() === 'x-object-fit') {
				element.parentNode.removeChild(element);

				if (objectFit._debug && window.console) {
					console.log('Matching node removed: ' + element.nodeName);
				}
			}
		};

		var domRemovedObserverFunction = function (element) {
			objectFit.observer.disconnect();
			domRemovedAction(element);
			objectFit.observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		};

		var domRemovedEventFunction = function (event) {
			window.removeEventListener('DOMNodeRemoved', domRemovedEventFunction, false);
			domRemovedAction(event.target.parentNode);
			window.addEventListener('DOMNodeRemoved', domRemovedEventFunction, false);
		};

		var domInsertedEventFunction = function () {
			scheduleScan(function () {
				window.removeEventListener('DOMNodeInserted', domInsertedEventFunction, false);
			}, function () {
				window.addEventListener('DOMNodeInserted', domInsertedEventFunction, false);
			});
		};


		if (window.MutationObserver) {
			if (objectFit._debug && window.console) {
				console.log('DOM MutationObserver');
			}

			this.observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.addedNodes && mutation.addedNodes.length) {
						scheduleScan(function () {
							objectFit.observer.disconnect();
						}, function () {
							objectFit.observer.observe(document.documentElement, {
								childList: true,
								subtree: true
							});
						});
					}
					if (mutation.removedNodes && mutation.removedNodes.length) {
						domRemovedObserverFunction(mutation.target);
					}
				});
			});

			this.observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		} else if (window.addEventListener) {
			if (objectFit._debug && window.console) {
				console.log('DOM Mutation Events');
			}

			window.addEventListener('DOMNodeInserted', domInsertedEventFunction, false);
			window.addEventListener('DOMNodeRemoved', domRemovedEventFunction, false);
		}
	};

	objectFit.init = function (args) {
		if (!args) {
			return;
		}

		if (!(args instanceof Array)) {
			args = [args];
		}

		var i = 0;
		var argsLength = args.length;

		for (; i < argsLength; i++) {
			args[i].replacedElements = document.querySelectorAll(args[i].selector);
			this.process(args[i]);
		}

		this.listen(args);
	};

	objectFit.polyfill = function (args) {
		if('objectFit' in document.documentElement.style === false) {
			if (objectFit._debug && window.console) {
				console.log('object-fit not natively supported');
			}

			// If the library is loaded after document onload event
			if (document.readyState === 'complete') {
				objectFit.init(args);
			} else {
				// Otherwise attach event listeners
				if (window.addEventListener) {
					window.addEventListener('load', function(){
						objectFit.init(args);
					}, false);
				} else {
					window.attachEvent('onload', function(){
						objectFit.init(args);
					});
				}
			}

			// Use a global listener and look for elements of x-object-fit. This allows
			// us to use one event listener on the page rather than adding in an additional
			// event listener on each element we process. This does mean that if we're not
			// in 'cover' or 'contain' we still attempt to process.
			var processOrientation = function () {
				var elements = document.querySelectorAll("x-object-fit > *");
				for (var i = 0; i < elements.length; ++i) {
					objectFit.orientation(elements[i]);
				}

				resizeTimer = null;
			};

			var resizeHandler = function () {
				 if (resizeTimer !== null) {
					 window.cancelAnimationFrame(resizeTimer);
				 }

				resizeTimer = window.requestAnimationFrame(processOrientation);
			};

			var resizeTimer = null;
			window.addEventListener("resize", resizeHandler, false);
			window.addEventListener("orientationchange", resizeHandler, false);
		} else {
			if (objectFit._debug && window.console) {
				console.log('object-fit natively supported');
			}
		}
	};

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = objectFit;

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {
		define([], function () { return objectFit; });

	// Export into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		global.objectFit = objectFit;
	}

}(window));
