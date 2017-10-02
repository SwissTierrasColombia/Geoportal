/**
 * MenuButtons class
 */
function MenuButtons() {
};

MenuButtons.featureInfoComponentClicked = function() {
	
	/*
	 * If the button is already active, deactivate it and return.
	 */
	var enabled = $("#gis_getFeatureInfoBtn").hasClass('btn-active');

	if (enabled) {
		controls.WMSGetFeatureInfo.deactivate();
		controls.KMLFeatureInfo.deactivate();
		return;
	}
	
	/*
	 * Get the selected layer.
	 * If no layer is selected, deactivate the controls and return. 
	 */
	var selectedMenuItem = selectedLayerTree.getSelectedLayer();
	
	if (Utils.isNullOrUndefined(selectedMenuItem)) {
		controls.WMSGetFeatureInfo.deactivate();
		controls.KMLFeatureInfo.deactivate();
		
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Warning_Title"), 
			LocaleManager.getKey("AlertDialog_Warning_LayerNoSelected")
		);
		return;
	}
	

	var id = selectedMenuItem.data("id");
	// var title = selectedMenuItem.data("title");
	var layerConfig = catalog.getLayerConfigById(id);
	
	if (layerConfig.getSource() == "wms") {
		
		/* ******************
		 * WMS GETFEATUREINFO 
		 * ******************/
		var wmsList = [];
		
		var isDrillDown = false;
		if (isDrillDown) {
			/*
			 * DRILL DOWN
			 * Get all the ENABLED layers in the menu
			 */
			
			var enabledLayers = selectedLayerTree.getVisibleLayers();
			$.each(enabledLayers, function(index, item) {
				var layerOL = $(item).data("layerOL");
				wmsList.push(layerOL);
			});
		}
		else {
			/*
			 * NO DRILL DOWN
			 * Get only the selected layer
			 */
			var layerOL = selectedMenuItem.data("layerOL");
			wmsList.push(layerOL);
		}
		
		// Activate WMS GetFeatureInfo control.
		controls.WMSGetFeatureInfo.activate(wmsList);
	}
	else if (layerConfig.getSource() == "kml") {
		
		var kmlLayerOL = selectedMenuItem.data("layerOL");
		
		// Activate KMLFeatureInfo control.
		controls.KMLFeatureInfo.activate(kmlLayerOL);
	}
	else {
		// Return with error!
		AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Warning_Title"), 
				LocaleManager.getKey("AlertDialog_Warning_LayerWmsNoSelected")
		);
		return;
	}
};

MenuButtons.downloadButtonClicked = function() {
	/*
	 * Get the selected layer
	 */
	var selectedMenuItem = selectedLayerTree.getSelectedLayer();
	
	//If nothing is selected, show an error and return
	if (Utils.isNullOrUndefined(selectedMenuItem)) {
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Warning_Title"), 
			LocaleManager.getKey("AlertDialog_Warning_LayerNoSelected")
		);
		return;
	}

	var id = selectedMenuItem.data("id");
	var layerConfig = catalog.getLayerConfigById(id);
	if (layerConfig.getSource() !== "wms" && layerConfig.getSource() !== "wms_multi_layer") {
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Warning_Title"), 
			LocaleManager.getKey("AlertDialog_Warning_LayerWmsNoSelected")
		);
		return;
	}

	//If the layer is not downloadable, show an error and return
	if (!Utils.isTrue(layerConfig.isDownloadable())) {
		AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Warning_Title"), 
				LocaleManager.getKey("AlertDialog_Warning_LayerWmsNoDownloadable")
		);
		return;
	}
	
	//Test if the GetFeature is active or not.
	if (layerConfig.isWFSGetFeatureAvailable() !== true) {
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Warning_Title"), 
			LocaleManager.getKey("Download_Layer_Not_Available")
		);
		return;
	}
	
	var url = layerConfig.getUrl();
	var featureName = layerConfig.getName();
	
	AlertDialog.createConfirmDefaultDialog(
		LocaleManager.getKey("Base_Panel_Download"),
		LocaleManager.getKey("Base_Panel_Download_Confirm") + " " + layerConfig.getTitle(),
		function() {
			new DataDownloader().downloadZip(url, featureName);		
		}
	);
};