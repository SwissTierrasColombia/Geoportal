/**
 * CreateLayer class
 */
function CreateLayer() {
};

/**
 * Crea l' OL Layer a seconda del tipo di layer - OSM - Google - WMS - WMS Multi
 * 
 * @param layerConfig
 */
CreateLayer.createOLLayer = function(layerConfig) {
	var olLayer = null;
	switch (layerConfig.getSource()) {
	case "osm":
		olLayer = CreateLayer.createOSMLayer(layerConfig);
		break;
	case "mapquest": 
		olLayer = CreateLayer.createMapQuestLayer(layerConfig);
		break;
	case "google":
		olLayer = CreateLayer.createGoogleLayer(layerConfig);
		break;
	case "bing":
		olLayer = CreateLayer.createBingLayer(layerConfig);
		break;
	case "wms":
		olLayer = CreateLayer.createWMSLayer(layerConfig);
		var enabled = false;
		if (Utils.isTrue(layerConfig.isEnabled()))
			enabled = true;
		olLayer.setVisibility(enabled);
		break;
	case "wms_multi_layer":
		olLayer = CreateLayer.createWMSMultiLayer(layerConfig);
		break;
	}

	return olLayer;
};

/**
 * Creates a OpenStreetMap Layer according the "LayerConfig" JSON configuration.
 * 
 * @param config
 * @returns {OpenLayers.Layer.OSM}
 */
CreateLayer.createOSMLayer = function(config) {
	var osmLayer = new OpenLayers.Layer.OSM(config.getTitle());
	return osmLayer;
};

CreateLayer.createMapQuestLayer = function(layerConfig) {
	var mapQuestLayer = null;
	
	var arrayMapQuestOSM = ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
	                        "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
	                        "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
	                        "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"];
	
	var arrayMapQuestAerial = ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
		                        "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
		                        "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
		                        "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"];
	
	if (layerConfig.getName() === "OPENAERIAL") {
		mapQuestLayer = new OpenLayers.Layer.OSM("MapQuest-OpenAerial", arrayMapQuestAerial);
	} else {
		mapQuestLayer = new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", arrayMapQuestOSM);
	}
	
	return mapQuestLayer;
};

CreateLayer.createBingLayer = function(layerConfig) {
	var bingMap = null;
	
	if (layerConfig.getName() === "ROAD") {
		bingMap = new OpenLayers.Layer.Bing({
            name: "Road",
            key: BING_APIKEY,
            type: "Road"
        });
	} else if (layerConfig.getName() === "HYBRID") {
		bingMap = new OpenLayers.Layer.Bing({
            name: "Hybrid",
            key: BING_APIKEY,
            type: "AerialWithLabels"
        });
	} else if (layerConfig.getName() === "AERIAL") {
		bingMap = new OpenLayers.Layer.Bing({
            name: "Aerial",
            key: BING_APIKEY,
            type: "Aerial"
        });
	}
	
	return bingMap;
};

/**
 * Creates a Google Layer, according the "LayerConfig" JSON configuration.
 * Supported types are "ROADMAP, SATELLITE, HYBRID, TERRAIN"
 * 
 * @param layerConfig
 * @returns {OpenLayers.Layer.Google}
 */
CreateLayer.createGoogleLayer = function(layerConfig) {

	var gmap = null;

	if (layerConfig.getName() === "ROADMAP") {
		gmap = new OpenLayers.Layer.Google(layerConfig.getTitle(), {
			numZoomLevels : 20,
			visibility : false
		});
	} else if (layerConfig.getName() === "SATELLITE") {
		gmap = new OpenLayers.Layer.Google(layerConfig.getTitle(), {
			type : google.maps.MapTypeId.SATELLITE,
			numZoomLevels : 20,
			visibility : false
		});
	} else if (layerConfig.getName() === "HYBRID") {
		gmap = new OpenLayers.Layer.Google(layerConfig.getTitle(), {
			type : google.maps.MapTypeId.HYBRID,
			numZoomLevels : 20,
			visibility : false
		});
	} else if (layerConfig.getName() === "TERRAIN") {
		gmap = new OpenLayers.Layer.Google(layerConfig.getTitle(), {
			type : google.maps.MapTypeId.TERRAIN,
			numZoomLevels : 20,
			visibility : false
		});
	}

	return gmap;
};

/**
 * Creates a WMS Layer according the "LayerConfig" JSON configuration.
 * 
 * @param layerConfig
 * @returns {OpenLayers.Layer.WMS}
 */
CreateLayer.createWMSLayer = function(layerConfig) {
	var olOptions = layerConfig.getOpenLayersOptions();
	if (olOptions.tileSize) {
		var xSize = olOptions.tileSize[0];
		var ySize = olOptions.tileSize[1];
		olOptions.tileSize = new OpenLayers.Size(xSize, ySize);
	}
	
	/*
	 * Handle cache URL.
	 * TODO: this must be improved.
	 * - Add "cacheEnabled" in layerConfig.
	 * - Add "add workspace prefix" to cache URL in the backend configuration. 
	 */
	var url = layerConfig.getCacheUrl();
	
	var name = "";
	if (!Utils.isNullOrUndefined(layerConfig.getCacheWorkspace())) {
		name = layerConfig.getCacheWorkspace() + ":" + layerConfig.getName();
	}
	else {
		name = layerConfig.getName();
	}
	
	var name = layerConfig.getCacheWorkspace() + ":" + layerConfig.getName();
	//var name = "mosef:" + layerConfig.getName();
	if (Utils.isNullOrUndefined(url)) {
		url = layerConfig.getUrl();
		name = layerConfig.getName();
	}

	/*
	 * If format = image/jpeg and transparent = true,
	 * Openlayers automagiccally sets the format to image/png.
	 * To disable this behavior, set noMagic=true.
	 * Ref: http://dev.openlayers.org/apidocs/files/OpenLayers/Layer/WMS-js.html  
	 */
	var WMS_PARAMS = {
		LAYERS : name,
		STYLES : '',
		format : layerConfig.getWMSOptions().format,
		transparent : layerConfig.getWMSOptions().transparent
		//_olSalt: Math.random()
	};
	
	/*
	 * Handle SLD_Override setting...
	 */
	var sldUrl = layerConfig.getSldUrl();
	if (!Utils.isNullOrUndefined(sldUrl)) {
		/*
		 * SLD url was overridden.
		 * Add this to the WMS_PARAMS...
		 * @see http://docs.geoserver.org/stable/en/user/services/wms/reference.html
		 */
		WMS_PARAMS["sld"] = sldUrl;
	}
	
	var wmsLayer = new OpenLayers.Layer.WMS(layerConfig.getTitle(), url, WMS_PARAMS, olOptions);
	return wmsLayer;
};

CreateLayer.createWMSMultiLayer = function(layerConfig) {
	var olOptions = layerConfig.getOpenLayersOptions();
	if (olOptions.tileSize) {
		var xSize = olOptions.tileSize[0];
		var ySize = olOptions.tileSize[1];
		olOptions.tileSize = new OpenLayers.Size(xSize, ySize);
		//_olSalt: Math.random()
	}
	
	var enabledLayerNames = layerConfig.getEnabledLayerNamesForWMSMulti();

	var wmsLayer = new OpenLayers.Layer.WMS(layerConfig.getUrl(), layerConfig.getUrl(), {
		LAYERS : enabledLayerNames,
		STYLES : '',
		format : layerConfig.getWMSOptions().format,
		transparent : layerConfig.getWMSOptions().transparent
	}, olOptions);

	return wmsLayer;
};