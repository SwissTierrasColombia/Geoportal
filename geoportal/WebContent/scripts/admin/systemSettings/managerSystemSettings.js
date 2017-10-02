var mSystemSettings = {
	
	getDataFromPage: function() {
		var settings = new Object();
		
		settings.proxyUrl = $("#proxy-input").val();
		settings.printServletUrl = $("#printservlet-url-input").val();
		settings.geoserverUrl = $("#geoserver-url-input").val();
		settings.geonetworkUrl = $("#geonetwork-url-input").val();
		settings.searchMaxResultForLayer = $("#max-num-feature-search-per-layer-input").val();
		settings.ajaxTimeout = $("#ajax-timeout-input").val();
		settings.ajaxPrintTimeout =$("#ajax-timeout-print-input").val(); 
		settings.printImagesFolder = $("#printservlet-images-folder-input").val();
		settings.featureInfoHyperlinkField = $("#featureInfoHyperlinkField-input").val();
		settings.maxNumberOfSelectedLayers = $("#max-num-selected-layers-input").val();
		settings.alertsLegendImageUrl = $("#alerts-legend-imageurl-input").val();
		settings.redlinesLegendImageUrl = $("#redlines-legend-imageurl-input").val();
		
		settings.alertsLayerName = $("#alerts-geoserver-layername-input").val();
		settings.alertsDownloadUsername = $("#alerts-geoserver-username-input").val();
		settings.alertsDownloadPassword = $("#alerts-geoserver-password-input").val();
		
		return settings;
	},
	
	populatePage: function(data) {
		$("#proxy-input").val(data.proxyUrl);
		$("#printservlet-url-input").val(data.printServletUrl);
		$("#geoserver-url-input").val(data.geoserverUrl);
		$("#geonetwork-url-input").val(data.geonetworkUrl);
		$("#max-num-feature-search-per-layer-input").val(data.searchMaxResultForLayer);
		$("#ajax-timeout-input").val(data.ajaxTimeout);
		$("#ajax-timeout-print-input").val(data.ajaxPrintTimeout);
		$("#printservlet-images-folder-input").val(data.printImagesFolder);
		$("#featureInfoHyperlinkField-input").val(data.featureInfoHyperlinkField);
		$("#max-num-selected-layers-input").val(data.maxNumberOfSelectedLayers);
		$("#alerts-legend-imageurl-input").val(data.alertsLegendImageUrl);
		$("#redlines-legend-imageurl-input").val(data.redlinesLegendImageUrl);
		$("#alerts-geoserver-layername-input").val(data.alertsLayerName);
		$("#alerts-geoserver-username-input").val(data.alertsDownloadUsername);
		$("#alerts-geoserver-password-input").val(data.alertsDownloadPassword);
		
	},
	
	requests: {		
		
		getData: function() {
			
			//Reset validator
			if(validator) {
				validator.reset();
			}
			
			Utils.ajaxCallSynch("./systemConfig", "POST", "json", {
				oper: "systemConfigs"
			}, function(response) {				
				if(response.success) {
					mSystemSettings.populatePage(response.result);
				}
			});
		},
		
		saveData: function() {
			var isValid = validator.valid();
			if(!isValid) {
				return;
			}
			
			var settings = mSystemSettings.getDataFromPage();
			Utils.ajaxCallSynch("./systemConfig", "POST", "json", {
				oper: "saveSystemConfigs",
				settings: JSON.stringify(settings) 
			}, function(response) {				
				if(response.success) {
					AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Item_ConfigSystem"), LocaleManager.getKey("Manager_Config_Saved_Ok"), "info", function() {
						//Reload
						mSystemSettings.requests.getData();
					});
				}
			});
		}
		
	}
};