/**
 * LoadLayersUtils class
 */
function LoadLayersUtils() {
};

/**
 * Filter background layers (baselayers) from config
 */ 
LoadLayersUtils.filterBaseLayerFromConfig = function(layersConfig) {
	
	var baseLayerConfigOrdered = layersConfig.filter(function (lc) {
		var groupCode = lc.getGroup();
		var isBackgroundGrp = LayerMenu.isBackgroundGroup(groupCode);
		return isBackgroundGrp === true;
	});
	
	return baseLayerConfigOrdered;
};

/**
 * Load all layers from Config: 
 * -- in OpenLayers 
 * -- in the Menu 
 * -- base layers -
 * -- standard layers
 * 
 * @param layersConfig
 */
LoadLayersUtils.loadLayersFromConfig = function(groups, layersConfig, onSuccessFunction) {
	/*
	 * Filter background layers (baselayers) from config and load them
	 */ 
	var baseLayerConfigOrdered = LoadLayersUtils.filterBaseLayerFromConfig(layersConfig);
	
	//Order layers for the baselayer group in reverse order
	baseLayerConfigOrdered = baseLayerConfigOrdered.sort(function(a,b){
		return (a.getPosition() < b.getPosition()) ? -1 : (a.getPosition() > b.getPosition()) ? 1 : 0;
	});

	// Load them
	LoadLayersUtils.loadBaseLayersFromConfig(baseLayerConfigOrdered);
	
	/*
	 * Filter standard layers (non-baselayers) from config and load them
	 * Order and load standard layers
	 * //Order groups by position
	 */
	var orderedGroups = Utils.orderByAttribute(groups.layersGroups, "position", "asc");
	$.each(orderedGroups, function(idx, grp){
		var grpCode = grp.code;
		
		if (LayerMenu.isBackgroundGroup(grpCode)) {
			return true;
		}
		
		//Get layers for the group
		var layersConfigForGrp = layersConfig.filter(function (lc) {
			return lc.layerConfig.group === grpCode;
		});
		
		//Order layers for this group in reverse order
		var orderedLayersConfigForGrp = layersConfigForGrp.sort(function(a,b){
			return (a.getPosition() > b.getPosition()) ? -1 : (a.getPosition() < b.getPosition()) ? 1 : 0;
		});

		$.each(orderedLayersConfigForGrp, function(index, layerConfig) {
			LoadLayersUtils.loadStdLayer(layerConfig, null);
		});
		
	});

	// Call onSuccessFunction
	if (!Utils.isNullOrUndefined(onSuccessFunction)) {
		onSuccessFunction();
	}
};

/**
 * Carica un layer standard nel men� e in mappa - Controlla che il layer non sia
 * un layer di background - Aggiunge il layer al men� - Crea OpenLayers layer -
 * richiama la funzione di success
 * 
 * @param layerConfig
 * @param onSuccessFunction
 * @param hasDelete
 */
LoadLayersUtils.loadStdLayer = function(layerConfig, onSuccessFunction, hasDelete) {
	
	var olLayer = CreateLayer.createOLLayer(layerConfig);
	var enabled = false;
	var hasLegend = true;
	if (Utils.isTrue(layerConfig.isEnabled())) {
		enabled = true;
	}
	if (layerConfig.getSource() == "wms") {
		LayerMenu.addToMenu(layerConfig, olLayer, enabled, hasDelete, hasLegend);
	}

	else if (layerConfig.getSource() == "wms_multi_layer") {
		LayerMenu.addMultiLayerToMenu(layerConfig, olLayer, hasDelete);
	}

	if (!Utils.isNullOrUndefined(onSuccessFunction)) {
		onSuccessFunction();
	}

};

/*
 * Only used by WMSDialog. To be refactored.
 */
LoadLayersUtils.loadStdLayerInSelectedLayerTreeFromOutside = function(layerConfig, onSuccessFunction) {
	
	/*
	 * Check if the maximum number of layers in the selected layer tree is reached or not.
	 */
	var numLayers = selectedLayerTree.getAllLayersSize();
	if ((numLayers + 1) > GLOBAL_SETTINGS.maxNumberOfSelectedLayers) {
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Warning_Title"), 
			LocaleManager.getKey("Page_Menu_Selected_Layers_Max_Size")
		);
		return;
	}
	
	var layerOL = CreateLayer.createOLLayer(layerConfig);
	layerOL.setVisibility(true);
	map.addLayer(layerOL);
	
	LayerMenu.addToSelectedLayerMenu({
		id: layerConfig.getId(),
		layerOL: layerOL,
		enabled : true,
		hasDelete: true,
		hasLegend: false
	});
	

	if (!Utils.isNullOrUndefined(onSuccessFunction)) {
		onSuccessFunction();
	}
};

/**
 * Carica i Base layers (combo menu e mappa)
 * 
 * @param bLayers
 *            Lista oggetti baselayers - ciascun item ha due propriet�: *
 *            config: oggetto layerConfig derivante da layersConfig * olLayer:
 *            oggetto layer di openlayer
 */
LoadLayersUtils.loadBaseLayersFromConfig = function(bLayerConfigs) {
	/*
	 * Load base layers in the ComboBox...
	 */

	// Carica i baselayers in mappa
	// - Ciascun layer viene impostato come baselayers e viene nascosto
	// (la visibilità verrà impostato successivamente sul layer settato come
	// "enabled")
	// In questo modo vengono aggiunti tutti i baselayer in mappa (nelle prime
	// posizioni)
	// non curandosi di quale dovr� essere visibile
	$.each(bLayerConfigs, function(index, bLayerConfig) {
		var olLayer = CreateLayer.createOLLayer(bLayerConfig);
		LayerMenu.addToBaseLayersMenu(bLayerConfig, olLayer);
		
		map.addLayer(olLayer);
		olLayer.setVisibility(false);
		olLayer.setIsBaseLayer(true);
	});

	/*
	 * If there is at least one 'enabled' baseLayer, enable it!
	 *(it makes the baselayer visible) 
	 */
	LoadLayersUtils.enableActiveBaseLayerFromComboBox();
};


/**
 * Abilita il baselayer attivo - Ricerca nel menù a tendina il layer impostato
 * come attivo ("enabled": true) - Lo imposta come prima selezione nella combo -
 * lo imposta come attivo in mappa
 */
LoadLayersUtils.enableActiveBaseLayerFromComboBox = function() {
	var blMenu = $("#baselayers-select");
	var activeBl = null;

	// Cerca tra gli items del menù a tendina quello impostato come enabled
	$.each(blMenu.find("option"), function(index, bLayer) {
		if ($(bLayer).data("enabled")) {
			blMenu.val($(bLayer).val());
			activeBl = $(bLayer);
			return false;
		}
	});

	// Se non trova layer impostati come attivi nel menù a tendina
	// imposta il primo layer della combo come attivo
	if (activeBl == null) {
		var firstBL = $("#baselayers-select option:first");
		if (firstBL.length > 0) {
			activeBl = $(firstBL[0]);
		}
	}

	//Activate the baseLayer if itr exists
	if (!Utils.isNullOrUndefined(activeBl)) {
		LoadLayersUtils.setActiveBaseLayer(activeBl);
	}
};

/**
 * Imposta il baselayer attivo in mappa - tutti i baselayers del men� a tendina
 * vengono disabilitati (impostata la visibilit� a false) - Viene attivato il
 * bLayer specifico (selezionato)
 * 
 * @param bLayer -
 *            Oggetto jquery proveniente dalla selezione "option" - In questo
 *            modo tale metodo viene richiamato anche al change sulla select
 */
LoadLayersUtils.setActiveBaseLayer = function(bLayer) {
	var olLayer = bLayer.data("layerOl");
	var layerId = parseInt(bLayer.val());
	
	$.each($("#baselayers-select option"), function(index, layer) {
		$(layer).data("layerOl").setVisibility(false);
	});

	map.setBaseLayer(olLayer);
	map.baseLayer.setVisibility(true);

	//Get current layer Id
	
	var layerConfig = catalog.getLayerConfigById(layerId); 
	var showInformationDialog = Utils.isTrue(layerConfig.showInfoDialog()); 
	
	$("#baselayer-info-btn").empty();
	$("#baselayer-info-btn").removeClass("baselayerContainerSpanInfoDialogBtn");
	if (showInformationDialog === true) {
		$("#baselayer-info-btn").append(LayerMenuUtils.buildShowInfoLayerButton(function() {
			LayerInfoDialog.showLayerInfo(layerId);
		}));
		$("#baselayer-info-btn").addClass("baselayerContainerSpanInfoDialogBtn");
	}
};

/**
 * Loads a WMS with capabilities to the Webgis.
 * - Register layer to the catalog
 * - Adds capabilities to catalog
 * - Performs a describe feature
 * - Adds the layer to SELECTED menu
 * 
 * This is called by WMS_Dialog (ADD WMS) And by the Geonetwork
 */
LoadLayersUtils.addLayerWMSToCatalogAndWebGIS = function(wmsUrl, layerName, layerTitle, capabilities) {
	
	/*
	* Check if the server supports the current Map SRS
	* If not, display a Dialog and exit.
	*/
	var srsSupported = CapabilitiesUtils.checkIfSrsSupported(map.getProjection(), layerName,
			capabilities);

	if (!srsSupported) {
		var dlgTitle = LocaleManager.getKey("GetCapabilities_SRS_Not_Supported_Error_Dialog_Title");
		var dlgText = LocaleManager.getKey("GetCapabilities_SRS_Not_Supported_Error_Dialog_Text");
		AlertDialog.createOkDefaultDialog(dlgTitle, dlgText);
		return;
	}
	
	var layers = capabilities.capability.layers;

	// Calculate bounds...
	var bounds = null;
	$.each(layers, function(key, value) {
		var name = value.name;
		if (name !== layerName) {
			return;
		}

		var wgs84EPSG = new OpenLayers.Projection("EPSG:4326");
		var mapEPSG = new OpenLayers.Projection(map.getProjection());

		/*
		 * In Get Capabilities the LatLon BBOX is always the WGS84.
		 * corresponding to CRS 84
		 */
		var minx = value.llbbox[0];
		var miny = value.llbbox[1];
		var maxx = value.llbbox[2];
		var maxy = value.llbbox[3];

		var boundsLayer = new OpenLayers.Bounds(minx, miny, maxx, maxy);
		bounds = boundsLayer.transform(wgs84EPSG, mapEPSG);

		/*
		 * Note... This should be the correct approach, but it seems that
		 * geoserver sometimes inverts the coordinates of X and Y...
		 * 
		 * It is (maybe) related to the different implementations of GetCapabilities and GetFeature
		 * with WFS 1.0.0 and WFS 1.1.0.
		 * The first supports GML2. The second GML3.
		 * With GML3 there is an axis flipping!
		 * 
		 * Info:
		 * http://osgeo-org.1560.x6.nabble.com/WMS-and-WFS-requests-case-insensitive-td3808058.html
		 * 
		 * 
		 */
		// // Found the layer in the GetCapabilities
		// for ( var key in value.bbox) {
		// var element = value.bbox[key];
		//
		// if (element.srs.indexOf("EPSG:") != -1) {
		// // Found
		// var layerEPSG = new OpenLayers.Projection(element.srs);
		// //var layerEPSG = new OpenLayers.Projection("EPSG:4326");
		// var mapEPSG = new OpenLayers.Projection("EPSG:900913");
		//					
		// var wgs84EPSG = new OpenLayers.Projection("EPSG:4326");
		//
		// var miny = element.bbox[0];
		// var minx = element.bbox[1];
		// var maxy = element.bbox[2];
		// var maxx = element.bbox[3];
		//
		// var boundsLayer = new OpenLayers.Bounds(minx, miny, maxx,
		// maxy);
		// var boundsMap = boundsLayer.transform(layerEPSG, mapEPSG);
	});

	/*
	 * Attenzione!
	 * transparent non sempre deve essere true!!
	 * Quando non è true, sbaglia a stampare!
	 * 
	 * 
	 */
	/*
	 * Prepare the config data
	 */
	var conf = {
		// "id": catalog._createNewId(),
		"source" : "wms",
		"title" : layerTitle,
		"url" : wmsUrl,
		"name" : layerName,
		"enabled" : true,
		"capabilities" : capabilities,
		"bounds" : bounds,
		"wfsSearchEnabled": false,
		"wmsOptions" : {
			"format" : "image/png",
			"transparent" : true
		},
		"olOptions" : {
			"buffer" : 0,
			"displayOutsideMaxExtent" : true,
			"isBaseLayer" : false,
			"singleTile" : false
		},
		"group" : "layers"
	};
	
	var lc = new LayerConfig(conf);
		
	var loadLayerCallback = function(lc) {
		
		// Adds the layer to the LayerConfigCatalog
		catalog.addLayerToConfig(lc);
		
		LoadLayersUtils.loadStdLayerInSelectedLayerTreeFromOutside(lc, function() {
			
			var bounds = lc.getBounds();
			if (!Utils.isNullOrUndefined(bounds)) {
				// If bounds is not null...
				zoomToExtent(bounds, true);
			}
		});
	};
	
	//If the search is off, no need to describe the feature
	if (lc.isWfsSearchEnabled() === true) {
		
		//Do the describe feature and load the layer
		DescribeFeature.doDescribeFeature_JQ(wmsUrl, function(describeFeat){
			/*
			 * Success callback Fn.
			 * Add the describe feature results to the LayerConfig and load the layer.
			 */
			LayerConfigCatalog.addDescribeFeatureToLayerConfig(lc, describeFeat);
			
			//load the layer
			loadLayerCallback(lc);
			
		}, function(){
			/*
			 * Fail callback Fn.
			 * Try to load the layer anyway,
			 * but since the describefeature was not successful, disable the search.
			 */
			lc.layerConfig.wfsSearchEnabled = false;
			
			loadLayerCallback(lc);
		});	
	}
	else {
		//Load the layer...
		loadLayerCallback(lc);
	}
	
	
};
