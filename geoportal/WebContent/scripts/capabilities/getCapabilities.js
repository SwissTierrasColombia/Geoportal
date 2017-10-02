

/**
 * Temp get all capa
 */
function loadAllCapabilitiesFromConfig(jsonObject, okFn) {
	var WMSCapabilities = createCapabilitiesObj(jsonObject.layers);

	if (Utils.associativeArraySize(WMSCapabilities) === 0) {
		okFn();
		return;
	} 
	
	$.each(WMSCapabilities, function(url, capa){
		doGetCapabilities_JQ(url, function(capabilities){
			// Imposta le capabilities nella lista WMSCapabilities per l'url corrente
			WMSCapabilities[url] = capabilities;
			
			// Se capabilities completate esegue la funzione 
			// di callback di success
			if( !Utils.isInArray("todo", WMSCapabilities) ) {
				okFn(WMSCapabilities);
			}
		}, function() {
			// Imposta le capabilities nella lista WMSCapabilities per l'url corrente
			WMSCapabilities[url] = null;
			
			// Se capabilities completate esegue la funzione 
			// di callback di success
			// Qui probabilmente sar� necessario specificare una funzione di
			// "pseudo fail":
			// - dovr� considerare il recupero delle capabilities completato ma dovr�
			//   segnalare per quali url no � stato in grado di recuperare le capabilities
			//   (FAIL SU GLI URL SPECIFICI)
			if( !Utils.isInArray("todo", WMSCapabilities) )
				okFn(WMSCapabilities);
		});
	});
}

// Crea l'oggetto lista capabilities
// Per ciascun url viene definito un valore di capabilities
// Inizialmente valore capabilities impostato a "todo"
function createCapabilitiesObj(layers) {
	var capaObj = {};
	
	$.each(layers, function(index, layer){
		if(layer.url && !capaObj.hasOwnProperty(layer.url)) {
			capaObj[layer.url] = "todo";
		}
	});
	
	return capaObj;
}

/**
 * Performs the GetCapabilities using the OL GET Request
 * 
 * @param url
 *            Server URL
 * @param okFn
 *            Function that is called upon success
 * @param failFn
 *            (Optional). Callback function called if the request fails
 */
function doGetCapabilities_JQ(url, okFn, failFn) {
	var format = new OpenLayers.Format.WMSCapabilities({
		version : "1.3.0"
	});

	$.ajax({
		url: url,	
		type: "GET",
		cache: false,
		useProxy: true,
		timeout: AJAX_TIMEOUT,
		dataType: "xml",
		data: {
			SERVICE : "WMS",
			VERSION : "1.3.0",
			REQUEST : "GetCapabilities"
		}
	}).done(function(request, textStatus, jqXHR) {
		var doc = jqXHR.responseXML;
		if (!doc || !doc.documentElement) {
			doc = jqXHR.responseText;
		}
		var capabilities = format.read(doc);
		okFn(capabilities);
	}).fail(function(jqXHR, textStatus, error) {
		OpenLayers.Console.error("...error...");

		//If the error callback function has been specified, let's call it.
		//Otherwhise we show a standard Log
		if (!Utils.isNullOrUndefined(failFn)) {
			failFn(jqXHR, textStatus, error);
		} else {
			var title = LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title");
			var text = LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Text");
			AlertDialog.createOkDefaultDialog(title, text);
		}
	});
	
}

/**
 * Performs the GetCapabilities using the OL GET Request
 * 
 * @param url
 *            Server URL
 * @param okFn
 *            Function that is called upon success
 * @param failFn
 *            (Optional). Callback function called if the request fails
 */
//function doGetCapabilities(url, okFn, failFn) {
//	var format = new OpenLayers.Format.WMSCapabilities({
//		version : "1.3.0"
//	});
//
//	OpenLayers.Request.GET({
//		url : url,
//		params : {
//			SERVICE : "WMS",
//			VERSION : "1.3.0",
//			REQUEST : "GetCapabilities"
//		},
//		success : function(request) {
//			var doc = request.responseXML;
//			if (!doc || !doc.documentElement) {
//				doc = request.responseText;
//			}
//			var capabilities = format.read(doc);
//			
//			//Test that the capabilites do not contain error(s)
//			if (!Utils.isNullOrUndefined(capabilities.error)) {
//				//If the error callback function has been specified, let's call it.
//				//Otherwhise we show a standard Log
//				if (!Utils.isNullOrUndefined(failFn)) {
//					failFn();
//				} else {
//					var title = LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title");
//					var text = LocaleManager.getKey("GetCapabilities_Exception_Text");
//					AlertDialog.createOkDefaultDialog(title, text);
//				}
//				return;
//			}
//			
//			//If everything is fine, call the okFn
//			okFn(capabilities);	
//			
//		},
//		failure : function() {
//			OpenLayers.Console.error("...error...");
//
//			//If the error callback function has been specified, let's call it.
//			//Otherwhise we show a standard Log
//			if (!Utils.isNullOrUndefined(failFn)) {
//				failFn();
//			} else {
//				var title = LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title");
//				var text = LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Text");
//				AlertDialog.createOkDefaultDialog(title, text);
//			}
//		}
//	});
//}

/**
 * Performs a GET CAPABILITIES to the specified url.
 * 
 * @deprecated
 */
function doGetCapabilitiesTest(url) {

	var format = new OpenLayers.Format.WMSCapabilities({
		version : "1.3.0"
	});

	OpenLayers.Request.GET({
		url : url,
		params : {
			SERVICE : "WMS",
			VERSION : "1.3.0",
			REQUEST : "GetCapabilities"
		},
		success : function(request) {
			var doc = request.responseXML;
			if (!doc || !doc.documentElement) {
				doc = request.responseText;
			}
			var capabilities = format.read(doc);
			var layers = capabilities.capability.layers;
			var layersStr = "";
			for (var i = 0; i < layers.length; i++) {
				if (layers[i].name && layers[i].name != "") {
					layersStr = layersStr + "," + layers[i].name;
				}
			}
			// OpenLayers.Console.debug(layersStr);
			//alert(layersStr);
		},
		failure : function() {
			OpenLayers.Console.error("...error...");
		}
	});
}