/*
 * AjaxPrefilter class
 */
function AjaxPrefilter() {
};

AjaxPrefilter.activateProxyFilter = function(proxyURL) {
	//Set AJAX Prefilter
	$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
		if (options.crossDomain && options.useProxy === true) {

			//Build URI
			var newUrl = options.url;
			var params = options.data;
			
			if ("GET" === options.type.toUpperCase()) {
				
				/*
				 * If it is a GET request, 
				 * encode the DATA parameters in the URL
				 * and set the DATA to empty
				 */
				
				if (options.url.indexOf("?") == -1) {
					newUrl += "?" + params;
				} else {
					newUrl += "&" + params;
				}
				
				options.data = "";
			}
			
			options.url = proxyURL + encodeURIComponent(newUrl);
			options.crossDomain = false;
		  }
	});
};