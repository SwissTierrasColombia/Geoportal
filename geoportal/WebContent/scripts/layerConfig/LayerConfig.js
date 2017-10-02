/**
 * LayerConfig Class
 */
function LayerConfig(layerConfig) {
	this.layerConfig = layerConfig;
};

LayerConfig.prototype.getId = function() {
	return this.layerConfig.id;
};

LayerConfig.prototype.getPosition = function() {
	return this.layerConfig.position;
};

LayerConfig.prototype.getSource = function() {
	return this.layerConfig.source;
};

LayerConfig.prototype.getCapabilities = function() {
	return this.layerConfig.capabilities;
};

LayerConfig.prototype.getTitle = function() {
	return this.layerConfig.title;
};

LayerConfig.prototype.getName = function() {
	return this.layerConfig.name;
};

LayerConfig.prototype.getDescription = function() {
	return this.layerConfig.description;
};

LayerConfig.prototype.getResponsible = function() {
	return this.layerConfig.responsible;
};

LayerConfig.prototype.isExternal = function() {
	
	//By default it is external!
	var external = true;
	
	if (!Utils.isNullOrUndefined(this.layerConfig.external)) {
		external = this.layerConfig.external;
	}
	return external;
};

LayerConfig.prototype.isDownloadable = function() {
	return this.layerConfig.downloadable;
};

LayerConfig.prototype.getBounds = function() {
	return this.layerConfig.bounds;
};

LayerConfig.prototype.getUrl = function() {
	return this.layerConfig.url;
};

LayerConfig.prototype.getCacheUrl = function() {
	return this.layerConfig.cacheUrl;
};

LayerConfig.prototype.getCacheWorkspace = function() {
	return this.layerConfig.cacheWorkspace;
};

LayerConfig.prototype.getSldUrl = function() {
	return this.layerConfig.sldUrl;
};

LayerConfig.prototype.getWfsUrl = function() {
	return this.layerConfig.wfsUrl;
};

LayerConfig.prototype.getWcsUrl = function() {
	return this.layerConfig.wcsUrl;
};

LayerConfig.prototype.getMetadataUrl = function() {
	return this.layerConfig.metadataUrl;
};

LayerConfig.prototype.getGroup = function() {
	return this.layerConfig.group;
};

LayerConfig.prototype.isEnabled = function() {
	return this.layerConfig.enabled;
};

LayerConfig.prototype.showInfoDialog = function() {
	return this.layerConfig.showInfoDialog;
};

LayerConfig.prototype.getOpenLayersOptions = function() {
	return this.layerConfig.olOptions;
};

LayerConfig.prototype.getWMSOptions = function() {
	return this.layerConfig.wmsOptions;
};

LayerConfig.prototype.getFormat = function() {
	return this.layerConfig.wmsOptions.format;
};

LayerConfig.prototype.getAttributeNameForInfo = function() {
	return this.layerConfig.attributeNameForInfo;
};

LayerConfig.prototype.getReferenceDate = function() {
	return this.layerConfig.referenceDate;
};

LayerConfig.prototype.getSection = function() {
	return this.layerConfig.section;
};

/**
 * This is set in the configuration and defines if the Search on this layer is enabled or not.
 */
LayerConfig.prototype.isWfsSearchEnabled = function() {
	
	//By default it is false
	var searchEnabled = false;
	
	if (!Utils.isNullOrUndefined(this.layerConfig.wfsSearchEnabled)) {
		searchEnabled = this.layerConfig.wfsSearchEnabled;
	}
	return searchEnabled;
};

/**
 * This is used in the data download (WFS getFeature).
 * If the WFSGetFeature is not available, the download is not possible.
 * @returns
 */
LayerConfig.prototype.isWFSGetFeatureAvailable = function() {
	return this.layerConfig.WFSGetFeatureAvailable;
};

LayerConfig.prototype.setWFSGetFeatureAvailable = function(value) {
	this.layerConfig.WFSGetFeatureAvailable = value;
};

LayerConfig.prototype.setAttributesNotAvailableCause = function(cause) {
	this.layerConfig.setAttributesNotAvailableCause = cause;
};

LayerConfig.prototype.getAttributesNotAvailableCause = function() {
	return this.layerConfig.getAttributesNotAvailableCause;
};

LayerConfig.prototype.setAttributesAvailable = function(value) {
	this.layerConfig.attributesAvailable = value;
};

/**
 * This is used in the WFS Search: if attributes are not available, search on the layer
 * is not possible.
 * @returns
 */
LayerConfig.prototype.isAttributesAvailable = function() {
	return this.layerConfig.attributesAvailable;
};

LayerConfig.prototype.getAttributes = function() {
	return this.layerConfig.attributes;
};

LayerConfig.prototype.setAttributes = function(attributes) {
	return this.layerConfig.attributes = attributes;
};

LayerConfig.prototype.getDefaultOpacity = function() {
	var olOptions = this.getOpenLayersOptions();
	if (!Utils.isNullOrUndefined(olOptions)) {
		return olOptions.opacity;
	}
	return null;
};

LayerConfig.prototype.getBbox = function(layerName) {
	
	var bbox = new Object();
	
	/*
	 * If this layer config has the capabilities associated
	 * (probably it is a WMS)
	 */
	if (!Utils.isNullOrUndefined(this.getCapabilities())) {
		var capabilities = this.getCapabilities().capability;
		$.each(capabilities.layers, function(index, layer) {
			if (layerName === layer.name) {
				if (layer.llbbox[0] && layer.llbbox[0] != "")
					bbox.minx = layer.llbbox[0];
				if (layer.llbbox[1] && layer.llbbox[1] != "")
					bbox.miny = layer.llbbox[1];
				if (layer.llbbox[2] && layer.llbbox[2] != "")
					bbox.maxx = layer.llbbox[2];
				if (layer.llbbox[3] && layer.llbbox[3] != "")
					bbox.maxy = layer.llbbox[3];

				return false;
			}
		});

		return bbox;	
	}
	
	/*
	 * If it is a KML, get the Bbox from the bounds...
	 */
	if (this.getSource() === "kml") {
		return this.getBounds();
	}
	
};

LayerConfig.prototype.hasLegend = function() {
	var res = false;
	if (this.layerConfig.source === "wms" || this.layerConfig.source === "wms_multi_layer") {
		res = true;
	}
	
	return res;
};

LayerConfig.prototype.isReferenceLayerForAlert = function() {
	var res = false;
	if (this.layerConfig.referenceLayerForAlerts === true) {
		res = true;
	}
	return res;
};

LayerConfig.prototype.exportToJson = function() {
	var jsonExport = {};
	var listToExport = ["source", "title", "url", "name", "enabled", "wmsOptions", "olOptions", "group", "layerData"];
	$.each(this.layerConfig, function(key, val){
		if (Utils.isInArrayAsBool(key, listToExport)) {
			jsonExport[key] = val;
		}
	});
	return jsonExport;
};


/**
 * WMSMultiLayerConfig - extends LayerConfig...
 */
function WMSMultiLayerConfig(layerConfig) {
	this.layerConfig = layerConfig;
};
WMSMultiLayerConfig.prototype = Object.create(LayerConfig.prototype);

WMSMultiLayerConfig.prototype.getTitle = function() {
	return null;
};

WMSMultiLayerConfig.prototype.getName = function() {
	return null;
};

WMSMultiLayerConfig.prototype.isEnabled = function() {
	return null;
};

WMSMultiLayerConfig.prototype.getWMSOptions = function() {
	return this.layerConfig.wmsOptions;
};

WMSMultiLayerConfig.prototype.getWMSOptions = function() {
	return this.layerConfig.wmsOptions;
};

WMSMultiLayerConfig.prototype.getLayerData = function() {
	return this.layerConfig.layerData;
};

WMSMultiLayerConfig.prototype.getLayerDataByLayerName = function(layerName) {
	var layerDataFound = null;
	$.each(this.layerConfig.layerData, function(key, value) {
		var name_i = $.trim(value.name);
		if (layerName === name_i) {
			layerDataFound = value;
			return false;
		}
	});
	return layerDataFound;
};

/**
 * Given a layerConfig for a WMS_MULTI, it retrieves the ENABLED layer names.
 */
WMSMultiLayerConfig.prototype.getEnabledLayerNamesForWMSMulti = function() {
	var names = "";
	var numNames = 0;

	/*
	 * Cycle through the layerData element and getting all the names.
	 */
	$.each(this.layerConfig.layerData, function(key, value) {
		var name_i = $.trim(value.name);

		var enabled_i = value.enabled;

		// Skip if it is not true
		if (!Utils.isTrue(enabled_i)) {
			return;
		}

		if (numNames > 0) {
			names += ",";
		}
		names += name_i;

		numNames++;
	});

	// Return the names
	return names;
};

/**
 * Given a layerConfig for a WMS_MULTI, it retrieves ALL the layer names.
 */
WMSMultiLayerConfig.prototype.getAllLayerNamesForWMSMulti = function() {
	var names = "";
	var numNames = 0;

	/*
	 * Cycle through the layerData element and getting all the names.
	 */
	$.each(this.layerConfig.layerData, function(key, value) {
		var name_i = $.trim(value.name);

		if (numNames > 0) {
			names += ",";
		}
		names += name_i;

		numNames++;
	});

	// Return the names
	return names;
};

/**
 * Given a layerConfig for a WMS_MULTI, it retrieves ALL the layer names.
 */
WMSMultiLayerConfig.prototype.getAllLayerNamesAsListForWMSMulti = function() {
	var names = new Array();

	/*
	 * Cycle through the layerData element and getting all the names.
	 */
	$.each(this.layerConfig.layerData, function(key, value) {
		var name_i = $.trim(value.name);
		names.push(name_i);
	});

	// Return the names
	return names;
};
WMSMultiLayerConfig.prototype.getAttributes = function(layerName) {
	var layerData = this.getLayerDataByLayerName(layerName);
	return layerData.attributes;
};

WMSMultiLayerConfig.prototype.setAttributesForLayer = function(attributes, layerName) {
	var layerData = this.getLayerDataByLayerName(layerName);
	layerData.attributes = attributes;
};

/**
 * Forse da togliere???
 */
WMSMultiLayerConfig.prototype.getNameByTitle = function(title) {
	var name = null;
	$.each(this.layerConfig.layerData, function(key, value) {
		var title_i = $.trim(value.title);
		if ($.trim(title) === title_i) {
			// Found
			name = value.name;
			return;
		}
	});
	return name;
};