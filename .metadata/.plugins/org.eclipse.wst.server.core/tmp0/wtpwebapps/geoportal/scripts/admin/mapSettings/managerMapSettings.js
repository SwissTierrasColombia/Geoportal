var mMapSettings = {
	
	getDataFromPage: function() {
		var settings = new Object();
		
		settings.projection = $("#projection-input").val();
		settings.units = $("#units-input").val();
		
		
		//Set mapscale if it is a valid value
		var maxScale = $("#default-maxscale-input").val();
		if (Utils.isFloat(maxScale)) {
			settings.maxScale = maxScale;	
		}
		
		settings.zoom = $("#default-zoomlevel-input").val();
		settings.centerx = $("#centerx-input").val();
		settings.centery = $("#centery-input").val();
		
		settings.defaultExtentMinX = $("#minx-input").val();
		settings.defaultExtentMinY = $("#miny-input").val();
		settings.defaultExtentMaxX = $("#maxx-input").val();
		settings.defaultExtentMaxY = $("#maxy-input").val();
		
		settings.showOverview = $("#show_overview").is(":checked");
		settings.dotsPerInch = $("#dots-per-inch-input").val();
		if (settings.dotsPerInch.trim() == "") {
			settings.dotsPerInch = null;
		}
		
		/*
		 * Custom scales / resolutions radio
		 */
		var enableCustomScalesResolutionsVal = "";
		var selectedRadio = $("input[type='radio'][name='enable_custom_scales_resolutions']:checked");
		if (selectedRadio.length > 0) {
			enableCustomScalesResolutionsVal = selectedRadio.val();
		}
		settings.enableCustomScalesResolutions = enableCustomScalesResolutionsVal;
		
		settings.customScales = this.getScalesFromPage();
		settings.customResolutions  = this.getResolutionsFromPage(); 
		
		return settings;
	},
	
	refreshDataButtons: function() {
		var numScalesSelected = $("#list_scales .ui-selected").length;
		if (numScalesSelected > 0) {
			$("#scales-delete").show();
		}
		else {
			$("#scales-delete").hide();
		}
		
		var numResolutionsSelected = $("#list_resolutions .ui-selected").length;
		if (numResolutionsSelected > 0) {
			$("#resolutions-delete").show();
		}
		else {
			$("#resolutions-delete").hide();
		}
	},
	
	populatePage: function(settings) {
		$("#projection-input").val(settings.projection);
		$("#units-input").val(settings.units);
		
		$("#default-maxscale-input").val(settings.maxScale);
		
//		$("#default-zoomlevel-input").val(settings.zoom);
//		$("#centerx-input").val(settings.centerx);
//		$("#centery-input").val(settings.centery);
		
		$("#minx-input").val(settings.defaultExtentMinX);
		$("#miny-input").val(settings.defaultExtentMinY);
		$("#maxx-input").val(settings.defaultExtentMaxX);
		$("#maxy-input").val(settings.defaultExtentMaxY);
		
		$("#show_overview").prop('checked', settings.showOverview);
		
		$("#dots-per-inch-input").val(settings.dotsPerInch);
		
		/*
		 * Scales / resolutions radio
		 */
		$("input[type='radio'][name='enable_custom_scales_resolutions']").prop("checked", false);
		
		if (settings.enableCustomScalesResolutions === "scales") {
			$("#custom_sr_scales").prop("checked", true);
		}
		else if (settings.enableCustomScalesResolutions === "resolutions") {
			$("#custom_sr_resolutions").prop("checked", true);
		}
		else {
			$("#custom_sr_none").prop("checked", true);
		}
		
		/*
		 * Populate scales
		 */
		var scaleList = settings.customScales;
		this.populateScales(scaleList);
		
		/*
		 * Populate resolutions
		 */
		var resolutionList = settings.customResolutions;
		this.populateResolutions(resolutionList);
		
	},
	
	populateScales: function(scaleArray) {
		mMapSettings.refreshDataButtons();
		var list = $("#list_scales");
		list.empty();
		
		if (!Utils.isNullOrUndefined(scaleArray)) {
			Utils.populateListFromArray($("#list_scales"), scaleArray, "scale");
			$(list).selectable({
				stop: function() {
					mMapSettings.refreshDataButtons();
				}
			});
		}
	},
	
	getScalesFromPage: function() {
		var scales = [];
		$("#list_scales li").each(function(k,v){
			var textValue = $(v).text();
			var intValue = parseInt(textValue);
			scales.push(intValue);
		});
		
		return scales;
	},
	
	deleteScale: function() {
		$("#list_scales .ui-selected").remove();
	},
	
	addScale: function() {
		var newValue = $("#scale-input").val();
		
		/*
		 * Test that the value is an integer
		 */
		if (!Utils.isInt(newValue)) {
			AlertDialog.createOkDefaultDialog(LocaleManager.getKey("General_Error"), LocaleManager.getKey("Manager_Map_Settings_CustomScale_Integer"), "warning");
			return;
		}
		
		var currentScaleList = this.getScalesFromPage();
		$("#scale-input").val("");
		
		currentScaleList.push(parseInt(newValue));
		Utils.orderArrayNumber(currentScaleList);
		
		this.populateScales(currentScaleList);
	},
	
	populateResolutions: function(resolutionArray) {
		mMapSettings.refreshDataButtons();
		var list = $("#list_resolutions");
		list.empty();
		if (!Utils.isNullOrUndefined(resolutionArray)) {
			Utils.populateListFromArray($("#list_resolutions"), resolutionArray, "resolution");
			$(list).selectable({
				stop: function() {
					mMapSettings.refreshDataButtons();
				}
			});	
		}
	},
	
	getResolutionsFromPage: function() {
		var resolutions = [];
		$("#list_resolutions li").each(function(k,v){
			var textValue = $(v).text();
			var floatValue = parseFloat(textValue);
			resolutions.push(floatValue);
		});
		
		return resolutions;
	},
	
	deleteResolution: function() {
		$("#list_resolutions .ui-selected").remove();
	},
	
	addResolution: function() {
		var newValue = $("#resolution-input").val();
		
		/*
		 * Test that the value is a float
		 */
		if (!Utils.isFloat(newValue)) {
			AlertDialog.createOkDefaultDialog(LocaleManager.getKey("General_Error"), LocaleManager.getKey("Manager_Map_Settings_CustomResolution_Float"), "warning");
			return;
		}
		
		var currentResolutionList = this.getResolutionsFromPage();
		$("#resolution-input").val("");
		
		currentResolutionList.push(parseFloat(newValue));
		Utils.orderArrayNumber(currentResolutionList);
		
		this.populateResolutions(currentResolutionList);
	},
	
	requests: {		
		
		getData: function() {
			
			//Reset validator
			if(validator) {
				validator.reset();
			}
			
			Utils.ajaxCallSynch("./mapConfig", "POST", "json", {
				oper: "mapSettings"
			}, function(response) {				
				if(response.success) {
					mMapSettings.populatePage(response.result);
				}
			});
		},
		
		saveData: function() {
			var isValid = validator.valid();
			if(!isValid) {
				return;
			}
			
			var settings = mMapSettings.getDataFromPage();
			Utils.ajaxCallSynch("./mapConfig", "POST", "json", {
				oper: "saveMapSettings",
				settings: JSON.stringify(settings) 
			}, function(response) {				
				if(response.success) {
					AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Item_ConfigSystem"), LocaleManager.getKey("Manager_Config_Saved_Ok"), "info", function() {
						//Reload
						mMapSettings.requests.getData();
					});
				}
			});
		}
		
	}
};