/**
 * LayerConfigCatalog class
 */

// Ref: http://phrogz.net/JS/classes/OOPinJS.html
// Ref:
// http://stackoverflow.com/questions/6799103/how-to-set-javascript-private-variables-in-constructor
function LayerConfigCatalog() {

	/**
	 * This object stores the JSON configuration of the whole map.
	 */
	var _toolConfig;
	var _mapConfig;
	var _groupConfig;

	this._layersConfig = new Array();

	this._referenceLayersForAlert = new Array();
	
	// var _allConfigJSON;

	var _id = 0;

	this._createNewId = function() {
		var id = _id;
		_id++;
		return id;
	};

	/**
	 * Initial load from JSON 
	 */
	this.loadConfigFromJSON = function(allConfigJSON, capabilitiesList, describeFeatureList) {
		// _allConfigJSON = allConfigJSON;
		_toolConfig = allConfigJSON.tools;
		_mapConfig = allConfigJSON.map;
		_groupConfig = allConfigJSON.layersGroups;

		var tempLayerConfig = allConfigJSON.layers;

		/*
		 * For the layers, it automatically creates an ID and all the other
		 * stuff...
		 */
		for (var j = 0; j < tempLayerConfig.length; j++) {
			var layerConfig_i = tempLayerConfig[j];
			
			// Se il layer prevede una getCapabilities (se presente) la imposta nell'oggetto 
			// layerConfig_i
			if(layerConfig_i.url) {
				if(capabilitiesList[layerConfig_i.url] == null)
					continue;
				else
					layerConfig_i.capabilities = capabilitiesList[layerConfig_i.url];
			}

			layerConfig_i.id = this._createNewId();

			var lc = null;
			if (layerConfig_i.source === "wms_multi_layer") {
				//WMS_MULTI Layer
				lc = new WMSMultiLayerConfig(layerConfig_i);
				
				var describeFeature_url = describeFeatureList[layerConfig_i.url];
				lc = LayerConfigCatalog.addDescribeFeatureToLayerConfig(lc, describeFeature_url);
				
// 				MOVED TO LayerConfigCatalog.addDescribeFeatureToLayerConfig				
//				var names = lc.getAllLayerNamesAsListForWMSMulti();
//				for(var z=0; z < names.length; z++) {
//					var name = names[z];
//					var featureDesc = new DescribeFeatureParser(describeFeature_url).getDescribeFeatureConfig(name);
//					lc.setAttributesForLayer(featureDesc, name);
//				}		
				
			} else {
				//WMS Single Layer
				lc = new LayerConfig(layerConfig_i);
				
				if(layerConfig_i.url) {
					
					var describeFeatureObjectFor_url = null;
					/*
					 * If the describe feature list is specified, let's try
					 * to get the describefeatureObject url.
					 * Otherwise the object is left null.
					 */
					if (!Utils.isNullOrUndefined(describeFeatureList)) {
						describeFeatureObjectFor_url = describeFeatureList[layerConfig_i.url];
					}
					//var describeFeatureObjectFor_url = describeFeatureList[layerConfig_i.url];
					
					lc = LayerConfigCatalog.addDescribeFeatureToLayerConfig(lc, describeFeatureObjectFor_url);
					
//					/*
//					 * Check if the describeObject retrieved from the server is valid or not.
//					 * For instance, the WFS server could be switched off.
//					 */
//					if (Utils.isNullOrUndefined(describeFeatureObjectFor_url) || !Utils.isNullOrUndefined(describeFeatureObjectFor_url.error)) {
//						//Error
//						lc.setWFSGetFeatureAvailable(false);
//						
//						//It is likely that the WFS server does not work.
//						lc.setAttributesAvailable(false);
//						
//						if (!Utils.isNullOrUndefined(describeFeatureObjectFor_url)) {
//							lc.setAttributesNotAvailableCause(describeFeatureObjectFor_url.error);
//						}
//					} else {
//						//No error...
//						var featureDesc = new DescribeFeatureParser(describeFeatureObjectFor_url).getDescribeFeatureConfig(name);
//						
//						//It is likely that the WFS server is on.
//						lc.setWFSGetFeatureAvailable(true);
//						
//						lc.setAttributesAvailable(true);
//						lc.setAttributes(featureDesc);
//					}
				}
			}

			if (lc.isReferenceLayerForAlert()) {
				this._referenceLayersForAlert.push(lc);
			}
			
			this._layersConfig.push(lc);

		}
	};

	/**
	 * Get reference layers for Alerts 
	 */
	this.getReferenceLayerForAlert = function() {
		var res = null;
		if (this._referenceLayersForAlert.length > 0) {
			res = this._referenceLayersForAlert[0];
		}
		return res;
	};
	
	/**
	 * Adds a layerConfig to the Config.
	 */
	this.addLayerToConfig = function(lc) {

		// Creates an ID
		lc.layerConfig.id = this._createNewId();
		this._layersConfig.push(lc);
	};

	/**
	 * Removes a layerConfig from the Config.
	 */
	this.removeLayerFromConfig = function(id) {
		var found = false;
		var j = 0;
		while (j < this._layersConfig.length) {
			var layerConf = this._layersConfig[j];
			if (layerConf.getId() === id) {
				found = true;
				break;
			}
			j++;
		}
		if (found) {
			this._layersConfig.splice(j, 1);
			return true;
		}
		return false;
	};

	/**
	 * Returns the layer config
	 */
	this.getLayerConfigs = function() {
		//return this._layersConfig;
		//Returns only those without publish = false
		var publishableLayerConfig = new Array();
		
		$.each(this._layersConfig, function(key, layerConfig_i){
			if (layerConfig_i.layerConfig.publish === false) {
				//Continue to cycle
				return true;
			}
			publishableLayerConfig.push(layerConfig_i);
		});
		
		return publishableLayerConfig;
	};

	/**
	 * Returns a layerConfig by Id
	 */
	this.getLayerConfigById = function(id) {
		for (var j = 0; j < this._layersConfig.length; j++) {
			var layerConf = this._layersConfig[j];
			if (layerConf.getId() === id) {
				return layerConf;
			}
		}
		return null;
	};

	/**
	 * Returns the map config
	 */
	this.getMapConfig = function() {
		return _mapConfig;
	};

	/**
	 * Returns the tools config
	 */
	this.getToolConfig = function() {
		return _toolConfig;
	};

	/**
	 * Returns the groups config
	 */
	this.getGroupConfig = function() {
		return _groupConfig;
	};
	
	this.existsLayerForGroup = function(groupName) {
		for (var j = 0; j < this._layersConfig.length; j++) {
			var layerConf = this._layersConfig[j];
			if (layerConf.getGroup() === groupName) {
				return true;
			}
		}
		return false;

	};
};

LayerConfigCatalog.addDescribeFeatureToLayerConfig = function(lc, describeFeat) {
	
	if(!lc.getUrl()) {
		return;
	}
	
	if (lc.getSource() === "wms_multi_layer") {
		//WMS_MULTI Layer
		
		var names = lc.getAllLayerNamesAsListForWMSMulti();
		for(var z=0; z < names.length; z++) {
			var name = names[z];
			var featureDesc = new DescribeFeatureParser(describeFeat).getDescribeFeatureConfig(name);
			lc.setAttributesForLayer(featureDesc, name);
		}	
	}
	else  {
		//WMS Single Layer
	
		/*
		 * Check if the describeObject retrieved from the server is valid or not.
		 * For instance, the WFS server could be switched off.
		 */
		if (Utils.isNullOrUndefined(describeFeat) || !Utils.isNullOrUndefined(describeFeat.error)) {
			//Error
			lc.setWFSGetFeatureAvailable(false);
			
			//It is likely that the WFS server does not work.
			lc.setAttributesAvailable(false);
			
			if (!Utils.isNullOrUndefined(describeFeat)) {
				lc.setAttributesNotAvailableCause(describeFeat.error);
			}
		} else {
			//No error...
			var featureDesc = new DescribeFeatureParser(describeFeat).getDescribeFeatureConfig(lc.getName());
			
			//It is likely that the WFS server is on.
			lc.setWFSGetFeatureAvailable(true);
			
			lc.setAttributesAvailable(true);
			lc.setAttributes(featureDesc);
		}
	}

	return lc;
};