Track Your Calories!
====================

See it live at https://benwiley4000.github.io/calorie_tracker_backbone/.

A web app that allows you to search the Nutritionix API for foods you regularly consume, and keep track of your intake. All data storage is local (except for the images belonging to each tracked food, which are fetched from the Nutritionix server). Your data can be accessed whenever you like on your machine of choice, though it's not currently easy to transfer or access data across multiple devices.

Technologies used:

* Framework: Backbone.js (with Underscore.js)
* REST APIs: Nutritionix API 2.0 (search and autocomplete)
* Other JavaScript libraries: D3.js, MetricsGraphics.js

Instructions for running
-------------------------

Open dist/index.html in a web browser. Search autocomplete relies on the HTML5 datalist element; some browsers may not support it. See http://caniuse.com/#feat=datalist.

Instructions for building
--------------------------

1. Install Node.js.

2. Install gulp using npm: `npm install -g gulp`

3. Go to the root directory and install the gulp build dependencies: `npm install`

4. Staying in the root directory, run: `gulp`. It will continue watching the project for changes, and rebuild when appropriate.
