/**
 * Adds the layers from geonetwork to the geoportal
 * @param layers
 */
function addLayersFromGeoNetwork(layers) {
	
	var geoportalViewActivated = false;
	
	for(var j=0; j<layers.length; j++) {
		var layer_j = layers[j];
		
		var name = layer_j[0];
		var wmsUrl = layer_j[1];
		var title = layer_j[2];
		var unknown = layer_j[3];
		
		if (geoportalViewActivated == false) {
			//switchPage($("#tabs-webgis-switcher"));
			switchWebgisGNTabs("tabs-webgis");
			geoportalViewActivated = true;
		}
		
		var layerLI = LayerMenu.getLayerLIFromMenu(wmsUrl, name);
		if(!Utils.isNullOrUndefined(layerLI)){
			LayerMenu.selectAndOpenLayerInMenu(layerLI);
		}
		else {
			addSingleWMSLayerFromGeoNetwork(name, title, wmsUrl);
		}		
	}
}

/**
 * Adds a single WMS layer to the webgis
 * @param layerName
 * @param layerTitle
 * @param serverUrl
 */
function addSingleWMSLayerFromGeoNetwork(layerName, layerTitle, serverUrl) {
	/*
	 * Try to add data from GN...
	 * Do a getCapabilities...
	 */
	doGetCapabilities_JQ(serverUrl, function(capabilities) {
		//Successful
		
		LoadLayersUtils.addLayerWMSToCatalogAndWebGIS(serverUrl, layerName, layerTitle, capabilities);
		
//		//Check if SRS supported
//		var srsSupported = checkIfSrsSupported(map.getProjection(), layerName, capabilities);
//
//		if (srsSupported) {
//			LoadLayersUtils.addLayerWMSToCatalogAndWebGIS(serverUrl, layerName, layerTitle, capabilities);
//		} else {
//			AlertDialog.createOkDefaultDialog(
//				LocaleManager.getKey("GetCapabilities_SRS_Not_Supported_Error_Dialog_Title"),
//				LocaleManager.getKey("GetCapabilities_SRS_Not_Supported_Error_Dialog_Text")
//			);
//		}
	});
}

function loadGeonetworkUrlInIframe(url, switchToPage) {
	//$("#geonetwork-container-iframe").attr("src", "http://geo-mosef.gesp.it/geonetwork/srv/spa/main.home");
	$("#geonetwork-container-iframe").attr("src", url);
	
	//See if the page needs to be switched
	if (switchToPage === true) {
		switchWebgisGNTabs("tabs-gn");
	}
}

function geonetworkLoaded() {
	//Remove GN Title
	var GNIframe = $('#geonetwork-container-iframe');
	
	try {
		var iframeContents = GNIframe.contents();
		if (!Utils.isNullOrUndefined(iframeContents)) {
			var GNHeader = iframeContents.find('#geonetwork-header-to-be-removed');
			GNHeader.remove();
		}
	} catch(e) {
		console.log('same policy error ' + e);
	}
	
	//Remove the loading icon and show the metadata icon
	$("#tabs-gn-switcher i").removeClass("fa-spinner");
	$("#tabs-gn-switcher i").removeClass("fa-spin");
	$("#tabs-gn-switcher i").addClass("fa-sitemap");
}

////TODO...
//function TESTsubmitLoginGN(user, pass) {
//	var gnUrl = null;
//	if (LocaleManager.locale === "es") {
//		gnUrl = "http://192.168.13.85:8080/http_proxy/proxy?url=" + encodeURIComponent(GEONETWORK_URL + "/j_spring_security_check");
//	}
//	else {
//		 gnUrl = GEONETWORK_URL + "/srv/eng/xml.user.login";
//	}
//	
//	$.ajax({
//		url : gnUrl,
//		type : "POST",
//		dataType : "json",
//		data : {
//			username: "admin",
//			password: "admin"
//		}
//	}).done(function(jsonObject) {
//		if (jsonObject.success === true) {
//			throw "geonetwork authentication: OK";
//		} else {
//			AlertDialog.createOkDefaultDialog(
//				LocaleManager.getKey("AlertDialog_Error_Title"), 
//				jsonObject.msg
//			);
//		}
//	}).fail(function(jqXHR, textStatus, error) {
//		AlertDialog.createOkDefaultDialog(
//			LocaleManager.getKey("AlertDialog_Error_Title"), 
//			LocaleManager.getKey("AlertDialog_Error_LogIn") + error
//		);
//		throw "error geonetwork authentication";
//	});
//	
///*	OpenLayers.Request.POST({
//		url : gnUrl,
//		data: '<?xml version="1.0" encoding="UTF-8"?><request><username>admin</username><password>admin</password></request>',
//		headers: {
//	        "Content-Type": "text/xml" //"text/xml;charset=utf-8"
//	    },
//		success : function(request) {
//			alert("OK" +  request);
//		},
//		failure : function() {
//			alert("Failure");
//		}
//	});*/
//}