#### v1.1.1

 - Fixed typos.
 - Moved contribution guidelines from README to a separate file.

### v1.1.0

 - Added initialisation system:
	- Will **initialize automatically** if loaded in the browser.
	- Will not immediately break if loaded in a non-browser environment such as Node.

 - Added <code>viewstat.init()</code>:
	- Initializes the library. This can only be done in the browser.

 - Added <code>viewstat.isInitialized()</code>:
	- Determines if the library has been initialized yet. This can be run outside the browser.

 - Fixed <code>viewstat.screen.getRefreshRate()</code> and <code>viewstat.screen.analyzeRefreshRateAccuracy()</code> test cases.

 - Fixed broken commonjs (<code>require</code>) import path.
