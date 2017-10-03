/**
 * DescribeFeature class
 */
function DescribeFeature() {
};

/**
 * Temp get all describe feature
 */
DescribeFeature.loadAllDescribeFeatureFromConfig = function(jsonObject, okFn) {
	
	var describeServerObj = DescribeFeature.createDescribeServerObj(jsonObject.layers);

	if (Utils.associativeArraySize(describeServerObj) === 0) {
		okFn();
		return;
	} 
	
	$.each(describeServerObj, function(url, ds) {
		DescribeFeature.doDescribeFeature_JQ(url, function(describeServer) {
			// OkFN
			describeServerObj[url] = describeServer;

			if (!Utils.isInArray("todo", describeServerObj)) {
				okFn(describeServerObj);
			}
		}, function() {
			// failFN

			// Imposta le capabilities nella lista WMSCapabilities per l'url
			// corrente
			describeServerObj[url] = null;

			if (!Utils.isInArray("todo", describeServerObj))
				okFn(describeServerObj);
		});
	});
};

DescribeFeature.createDescribeServerObj = function(layers) {
	var describeServerObj = {};
	$.each(layers, function(index, layer) {
		
		//If the WFS search for the layer is disabled, skip the describe feature.
		//No need to do it.
		if (layer.wfsSearchEnabled !== true) {
			//Next iteration
			return true;
		}
		
		if (layer.url && !describeServerObj.hasOwnProperty(layer.url)) {
			describeServerObj[layer.url] = "todo";
		}
	});

	return describeServerObj;
};

/**
 * Performs the DescribeFeature
 * 
 * @param url
 *            Server URL
 * @param okFn
 *            Function that is called upon success
 * @param failFn
 *            (Optional). Callback function called if the request fails
 */
DescribeFeature.doDescribeFeature_JQ = function(url, okFn, failFn) {
	var format = new OpenLayers.Format.WFSDescribeFeatureType();

	$.ajax({
		url: url,	
		type: "GET",
		cache: false,
		useProxy: true,
		timeout: AJAX_TIMEOUT,
		dataType: "xml",
		data: {
			SERVICE : "WFS",
			VERSION : "2.0.0",
			REQUEST : "DescribeFeatureType"
			//TYPENAME : typeName, // WFS 1.1.0 and earlier)
			//TYPENAMES : typeName
		}
	}).done(function(request, textStatus, jqXHR) {
		var doc = jqXHR.responseXML;
		if (!doc || !doc.documentElement) {
			doc = jqXHR.responseText;
		}
		var describeFeat = format.read(doc);
		
		if(!Utils.isNullOrUndefined(describeFeat.error)) {
			//There is an error, add the original doc...
			describeFeat.error.originalResponse = doc;
		}
		
		okFn(describeFeat);
	}).fail(function(jqXHR, textStatus, error) {
		OpenLayers.Console.error("Describe feature error " + url);
	
		// If the error callback function has been specified, let's
		// call it.
		// Otherwhise we show a standard Log
		if (!Utils.isNullOrUndefined(failFn)) {
			failFn();
		} else {
			var title = LocaleManager
					.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title");
			var text = LocaleManager
					.getKey("GetCapabilities_Server_Connection_Error_Dialog_Text");
			AlertDialog.createOkDefaultDialog(title, text);
		}
	});
};

/**
 * Performs the DescribeFeature
 * 
 * @param url
 *            Server URL
 * @param okFn
 *            Function that is called upon success
 * @param failFn
 *            (Optional). Callback function called if the request fails
 */
DescribeFeature.doDescribeFeature = function(url, okFn, failFn) {
	var format = new OpenLayers.Format.WFSDescribeFeatureType();

	OpenLayers.Request
	.GET({
		url : url,
		params : {
			SERVICE : "WFS",
			VERSION : "2.0.0",
			REQUEST : "DescribeFeatureType"
			//TYPENAME : typeName, // WFS 1.1.0 and earlier)
			//TYPENAMES : typeName
		},
		success : function(request) {
			var doc = request.responseXML;
			if (!doc || !doc.documentElement) {
				doc = request.responseText;
			}
			var describeFeat = format.read(doc);
			
			if(!Utils.isNullOrUndefined(describeFeat.error)) {
				//There is an error, add the original doc...
				describeFeat.error.originalResponse = doc;
			}
			
			okFn(describeFeat);
		},
		failure : function() {
			OpenLayers.Console.error("...error...");

			// If the error callback function has been specified, let's
			// call it.
			// Otherwhise we show a standard Log
			if (!Utils.isNullOrUndefined(failFn)) {
				failFn();
			} else {
				var title = LocaleManager
						.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title");
				var text = LocaleManager
						.getKey("GetCapabilities_Server_Connection_Error_Dialog_Text");
				AlertDialog.createOkDefaultDialog(title, text);
			}
		}
	});
};
