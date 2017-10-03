/**
 * LegendGraphics class
 */
function LegendGraphics() {
};

//function doCreateLegend() {
//	/*
//	 * For all the wms loaded in the GIS, let's add the layers... -- only WMS
//	 * for now.
//	 */
//	$.each(catalog.getLayerConfigs(), function(k, v) {
//		var source = v.source;
//		if (source !== "wms") {
//			return;
//		}
//
//		var title = v.title;
//		var name = v.name;
//		var serverUrl = v.url;
//
//		addLayerToLegend(name, title, serverUrl);
//	});
//}

/*function addLayerToLegend(layerName, layerTitle, serverUrl) {
	var url = createGetLegendGraphicUrl(serverUrl, layerName);

	var label = $("<label>", {
		"class" : "legendLabel"
	}).text(layerTitle);

	var img = $("<img>").attr("src", url);

	var containerDiv = $("<div>", {
		"class" : "legendItem"
	}).append(label, img);

	$("#legendPanel").append(containerDiv);
}*/

// INSERT LEGEND INTO MENU'
LegendGraphics.getLegendImageLayer = function(serverUrl, layerName) {
	var url = LegendGraphics.createGetLegendGraphicUrl(serverUrl, layerName);
	
	var img = $("<img>").attr("src", url);
	
	var containerDiv = $("<div>", {
		"class" : "legendItem custom-hidden"
	}).append(img);
	
	return containerDiv;
};

/**
 * Creates a ET LEGEND GRAPHICS request to the specified url.
 */
LegendGraphics.createGetLegendGraphicUrl = function(serverUrl, layerName) {

	var params = {
		service : "WMS",
		request : "GetLegendGraphic",
		format : "image/png",
		transparent: true,
		width : 20,
		height : 20,
		layer : layerName,
		SCALE : 2183910.7257279875,
		LEGEND_OPTIONS : "forceLabels:on;fontSize:10"
	};

	var paramString = "";

	var paramLen = 0;
	$.each(params, function(key, value) {
		if (paramLen > 0) {
			paramString += "&";
		}
		paramString += key + "=" + encodeURIComponent(value);

		paramLen++;
	});

	// Add salt (??)

	// Handle ? and &

	var result = serverUrl + "?" + paramString;
	return result;
};