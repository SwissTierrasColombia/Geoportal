
/**
 * Performs the GetFeature
 * 
 * @param url
 *            Server URL
 * @param okFn
 *            Function that is called upon success
 * @param failFn
 *            (Optional). Callback function called if the request fails
 */
function doGetFeaturesGET(url, configObject, okFn, failFn) {
	var format = new OpenLayers.Format.GML.v2();
	// outputFormat : "text/xml; subtype=gml/2.1.2",

	var params = {
		SERVICE : "WFS",
		VERSION : "1.1.0", // 2.0.0
		REQUEST : "GetFeature",
		outputFormat : "GML2"
		//maxFeatures : 100
	};

	if (configObject.typeNames) {
		params.typeNames = configObject.typeNames;
	}

	//Needed by data downloader
	if (configObject.typeName) {
		params.typeName = configObject.typeName;
	}
	
	//Needed by data downloader
	if (configObject.outputFormat) {
		params.outputFormat = configObject.outputFormat;
	}
	
	//??
	if (configObject.propertyNames) {
		params.propertyNames = configObject.propertyNames;
	}

	if (configObject.propertyName) {
		params.propertyName = configObject.propertyName;
	}
	
	if (configObject.filterOL) {
		
		//Constructing XML from the filterOL OpenLayers object
		var node = new OpenLayers.Format.Filter({
			version : "1.1.0"
		}).write(configObject.filterOL);
		var xml = new OpenLayers.Format.XML().write(node);
		
		params.filter = xml;
	}

	//Performing Request
	OpenLayers.Request.GET({
		url : url,
		params : params,
		success : function(request) {
			var doc = request.responseXML;
			if (!doc || !doc.documentElement) {
				doc = request.responseText;
			}

			format.extractAttributes = true;
			var features = format.read(doc);

			okFn(features);

		},
		failure : function() {
			OpenLayers.Console.error("...error...");
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("AlertDialog_Error_RetrievingFeature")
			);

			// If the error callback function has been specified, let's
			// call it.
			// Otherwhise we show a standard Log
			if (!Utils.isNullOrUndefined(failFn)) {
				failFn();
			}
		}
	});
}

/**
 * Performs the GetFeature
 * 
 * @param url
 *            Server URL
 * @param okFn
 *            Function that is called upon success
 * @param failFn
 *            (Optional). Callback function called if the request fails
 */
function doGetFeaturesPOST(url, configObject, okFn, failFn) {
	
	var epsgProjection = catalog.getMapConfig().projection;
	
	//FeatureTypes
	var featureTypes = configObject.typeNames;
	
	//default
	var geometryColumnName = "geom";
	
	if (!Utils.isNullOrUndefined(configObject.geometryColumnName)) {
		geometryColumnName = configObject.geometryColumnName;
	}
	
	var format = new OpenLayers.Format.GML.v2({
		featureType: featureTypes,
		geometryName: geometryColumnName,
		srsName: epsgProjection //Default map projection 
	});
	
	
	var wfsOutputFormat = "text/xml; subtype=gml/2.1.2"; //application/json
	var service = "WFS";
	var wfsVersion = "1.1.0";
	var filterVersion = "1.1.0";
	var postContentType = "text/xml;charset=utf-8";
	
	//Max features
	var maxFeatures = null;
	if (!Utils.isNullOrUndefined(configObject.maxFeatures)) {
		maxFeatures = configObject.maxFeatures;
	}
	
//	var workspace = "mosef";
//	var featureNS = "http://mosef";
	
	var xmlRequestHeader = '<wfs:GetFeature\n' 
		+ ' service="' + service + '"\n'
		+ ' version="' + wfsVersion + '"\n '
		+ ' outputFormat="' + wfsOutputFormat +'"\n ';
	
	if (maxFeatures) {
		xmlRequestHeader += ' maxFeatures="' + maxFeatures + '"\n ';
	}
	
	/*
	 * Check if the query must retrieve only the HITS or the actual FEATURES
	 */
	var resultType = "results"; //default
	var isHitsOnly = false;
	if (configObject.resultType === "hits") {
		resultType = "hits"; //hits for instance
		isHitsOnly = true;
	}
	xmlRequestHeader += ' resultType="' + resultType + '"\n ';
	
	
//	if (configObject.bboxFilter) {
//		xmlRequestHeader += ' bbox="' + configObject.bboxFilter + '"\n ';
//		xmlRequestHeader += ' crs="' + configObject.crs + '"\n ';
//	}
	
	
	xmlRequestHeader += ' xmlns:wfs="http://www.opengis.net/wfs"\n'
		//+ ' xmlns:' + workspace + '="' + featureNS + '"' //This should be required for strict standard compliancy
		+ '>\n'
		+ '  <wfs:Query typeName="' + featureTypes + '" srsName="' + epsgProjection + '">\n';
	
	/*
	 * Convert Openlayers Filters to XML
	 */
	if (configObject.filterOL) {
		//Constructing XML from the filterOL OpenLayers object
		var node = new OpenLayers.Format.Filter({
			version : filterVersion
		}).write(configObject.filterOL);
		var xml = new OpenLayers.Format.XML().write(node);
		
		xmlRequestHeader += xml;
	}
	xmlRequestHeader += '    </wfs:Query>\n';
	xmlRequestHeader += '</wfs:GetFeature>';
	
	var successFunction = function(request) {
		var doc = request.responseXML;
		if (!doc || !doc.documentElement) {
			doc = request.responseText;
		}

		if (isHitsOnly) {
			var res = request.responseText.match(/numberOfFeatures="([0-9]+)"/);
			var numberOfFeatures = res[1];
			okFn(numberOfFeatures);
		} else {
			format.extractAttributes = true;
			var features = format.read(doc);

			okFn(features);	
		}
	};
	
	//Performing Request
	OpenLayers.Request.POST({
		url : url,
		data: xmlRequestHeader,
		headers: {
	        "Content-Type": postContentType //"text/xml;charset=utf-8"
	    },
		success : function(request) {
			successFunction(request);
		},
		failure : function() {
			OpenLayers.Console.error("...error...");
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("AlertDialog_Error_RetrievingFeature")
			);

			// If the error callback function has been specified, let's
			// call it.
			if (!Utils.isNullOrUndefined(failFn)) {
				failFn();
			}
		}
	});
}