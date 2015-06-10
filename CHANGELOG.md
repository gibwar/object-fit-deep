# Changelog

### HEAD

### 0.4.2-deep (June 10th, 2015)
* Removed `element.closest()` polyfill as it's not needed anymore.
* Removed `getMatchedCSSRules` polyfill since it's dreadfully slow and Chrome is depreciating it in Chrome 41. It seems
that `getComputedStyle` is close enough for my purposes.
* Moved the resize event handler to a global level, reducing the number of listeners when a large number of elements
are replaced
* Added default style caching for image elements. It assumes that the image retrieved won't change during this session.
This drastically speeds up when replacing multiple elements with the same image.
* Filters out CSS2Property things that can cause Firefox 31 to error out on.
* Changed to a scanning model when elements are inserted. The previous model would miss deeply nested elements that
would've matched had it looked. This also allows for multiple mutations to occur before processing them in a vague
attempt to keep somewhat 'responsive'.

### 0.4.2 (June, 8th, 2015)
* Use [external `element.closest()` polyfill](https://github.com/jonathantneal/closest) via npm (#30), small performance win
* Use [external rAF polyfill](https://github.com/ngryman/raf.js) via npm (#30)

### 0.4.1 (February, 24th, 2015)
* Optimize Performance (+28%) (#22)

### 0.4.0 (February, 23th, 2015)
* Add option `disableCrossDomain: 'true'` to ignore external stylesheets (CORS/CSP) (#7, #15)

### 0.3.7 (January, 26th, 2015)
* Update README with latest browser developments
* Don’t test for `matchMedia` when it isn’t supported (#22)
* Update usage of indexed style properties regarding [latest Firefox implementation](https://bugzilla.mozilla.org/show_bug.cgi?id=958887)

### 0.3.6 (November, 25th, 2014)
* Remove unnneeded postinstall script in npm (#14).

### 0.3.5 (October, 24th, 2014)
* Fixed a few minor code issues
* Update polyfill.rAF.js to not include moz prefix anymore
* Minor update on the getMatchedCSSRule.js
* Re-indented the files, stick to code style
* Use utf-8 in test html
* Added correct path for 'main'

### 0.3.4 (August, 8th, 2014)
* Fix array-detection of arguments in `objectFill.init (#10) thanks to [@xax](https://github.com/xax)

### 0.3.3 (May, 27th, 2014)
* Extended fix for Firefox (#5)

### 0.3.2 (May, 27th, 2014)

* Fix for Firefox
* Add AMD definition in core JavaScript

### 0.3.1 (January 23rd, 2014)

* Enabled polyfill to initialize after load when being fetched asynchronously

### 0.3.0 (November 24th, 2013)

* Initial Release
