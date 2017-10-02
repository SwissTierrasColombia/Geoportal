function LayerInfoDialog() {
};

LayerInfoDialog.populateInformationDiv = function(informationDiv, layerConfig, metadataClickFn) {
	
	//Title
	var title = layerConfig.getTitle();
	informationDiv.find("#layer_info_template_title").text(title);
	
	//Description
	var description = layerConfig.getDescription();
	informationDiv.find("#layer_info_template_description").text(description);
	
	//Legend
	if (layerConfig.hasLegend() === true) {
		
		var serverUrl = layerConfig.getUrl();
		var layerName = layerConfig.getName();
		var legendImageDiv = LegendGraphics.getLegendImageLayer(serverUrl, layerName);
		
		//Show legend
		legendImageDiv.show(); 
		informationDiv.find("#layer_info_template_legend_container").append(legendImageDiv);
	}
	else {
		informationDiv.find("#layer_info_template_legend_container").addClass("custom-hidden");
	}
	
	//Responsible
	var responsible = layerConfig.getResponsible();
	informationDiv.find("#layer_info_template_responsible_value").text(responsible);
	
	//Reference Date
	var referenceDate = layerConfig.getReferenceDate();
	informationDiv.find("#layer_info_template_reference_date_value").text(referenceDate);
	
	//WMS Source
	var wmsUrl = layerConfig.getUrl();
	informationDiv.find("#layer_info_template_wms_value").text(wmsUrl);
	
	//WFS Source
	var wfsUrl = layerConfig.getWfsUrl();
	informationDiv.find("#layer_info_template_wfs_value").text(wfsUrl);
	
	//WCS Source
	var wcsUrl = layerConfig.getWcsUrl();
	informationDiv.find("#layer_info_template_wcs_value").text(wcsUrl);
	
	//Metadata link
	var metadataUuid = layerConfig.getMetadataUrl();
	if (!Utils.isNullOrUndefined(metadataUuid)) {
		informationDiv.find("#layer_info_template_metadata_link_text").remove();
		informationDiv.find("#layer_info_template_metadata_link_btn").click(function(e){
			metadataClickFn(metadataUuid);
		});
	} else {
		informationDiv.find("#layer_info_template_metadata_link_btn").remove();
	}
	
	//Layer name
	var name = layerConfig.getName();
	informationDiv.find("#layer_info_template_name_value").text(name);
	
	/*
	 * Refresh Localized strings (labels)
	 */
	$.each(informationDiv.find(".localizedElement"), function(k,v){
		var currObj = $(this);
		LocaleManager.refreshLocalizedElement(currObj);
	});
	
};

LayerInfoDialog.showLayerInfo = function (layerId) {
	var layerConfig = catalog.getLayerConfigById(layerId);
	
	var targetDiv = $("<div>");
	targetDiv.load("layer_info_template.html", function() {
		
		var dialogDiv = DialogUtils.createDialog("Informaciones", null, {
			width: 490,
			height: 250,
			modal: false
		}, targetDiv);
		
		LayerInfoDialog.populateInformationDiv(targetDiv, layerConfig, function(metadataUuid){
			dialogDiv.dialog("close");
			var metadataLink = MetadataUtils.getMetadataUrlDetails(GEONETWORK_URL) + metadataUuid;
			//loadGeonetworkUrlInIframe(MetadataUtils.getMetadataUrlDetails(GEONETWORK_URL) + metadataLink, true);
			loadGeonetworkUrlInIframe(metadataLink, true);
		});
		
		dialogDiv.dialog("open");
	});
};