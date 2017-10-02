/**
 * Utility function to add a new WMS (Url, Name) to the dropdown list
 * 
 * @param url
 *            Url of the WMS
 * @param name
 *            Logical name of the WMS
 */
function appendToWMSSelectBox(url, name) {
	var selectBox = $("#wmsList");

	var option = $("<option>", {
		name : url
	}).html(name);
	selectBox.append(option);
}

function refreshCapabilitiesForSelectedWMS(capabilities) {
	var selectedOption = $("#wmsList").find(":selected");
	selectedOption.data({
		"capabilities" : capabilities
	});
}

/**
 * Utility function to get the selected WMS (Url, Name)
 * 
 * Returns this object: { url = ".....", name = "....." }
 * 
 * @returns Returns a JSON with these parameters: {url: "...", name: "..."}
 */
function getSelectedWMSFromDropdownList() {
	var selOpt = $("#wmsList").find(":selected");
	var text = selOpt.text();
	var name = selOpt.attr("name");

	var res = {
		url : text,
		name : name,
		capabilities : selOpt.data("capabilities")
	};

	return res;
}

/**
 * Utility function to retrieve the selected row of a grid.
 * 
 * @param obj
 *            The GRID
 * @returns the selected ROW
 */
function _getSelectedRowFromGRID(obj) {
	var row = null;
	$(".trSelected", obj).each(function(k, v) {
		row = v;
		return;
	});
	return row;
}

/**
 * Shows the WMS Dialog.
 */
function showWMSDialog() {

	/*
	 * Gets the list of the available WMS servers via an AJAX call
	 */
	$.ajax({
		//url : "config/wms_list.json",
		url : "./systemConfig",
		type : "GET",
		dataType : "json",
		cache : false,
		data: {
			oper: "exportExternalWmsServersAsJson"
		}
	}).done(function(jsonObject) {

		/*
		 * Once the list of available WMS servers is fetched, each item is added
		 * to the WMS Select Box
		 */

		$.each(jsonObject.wms_list, function(k, v) {
			var url = v.url;
			var name = v.name;
			appendToWMSSelectBox(url, name);
		});

		// Get the selected wms from the select-box and load its layers...
		var selOpt = $("#wmsList").find(":selected");

		var text = selOpt.text();
		var name = selOpt.attr("name");
		loadCapabilitiesIntoGrid(name, grid, function() {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("AlertDialog_Error_Msg_GetCapabilities_error")
			);
		});

	}).fail(function() {
		//Error fetching the list
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Error_Title"), 
			LocaleManager.getKey("AlertDialog_Error_Msg_GetCapabilities_fail")
		);
	});

	/*
	 * Build the grid
	 */
	var outerGridContainer = $("<div>", {
			id : "wms_grid_container"
	});
	
	var grid = $("<div>");
	outerGridContainer.append(grid);

	/*
	 * Build the WMS select Box
	 */
	var selectBox = $("<select id='wmsList'>").change(function() {
		/*
		 * When an item in the select box is selected, a GET CAPABILITIES
		 * request is triggered and the corresponding layers are loaded in the
		 * WMS grid.
		 */

		// Show loading panel
		var ttt = outerGridContainer.find(".flexigrid");
		var lp = new LoadingPanel(ttt, LocaleManager.getKey("Loading"), false);
		lp.addLoading();

		var selOpt = $(this).find(":selected");
		var text = selOpt.text();
		var name = selOpt.attr("name");
		loadCapabilitiesIntoGrid(name, grid, function() {
			//Error.
			//Removing loading panel
			lp.removeLoading();
			
			//Showing an alert...
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title"), 
				LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Text")
			);
		});
	});

	/*
	 * Build the ADD NEW WMS Server Button
	 */
	var addWMSButton = $("<button>", {
		id : "wms_addWMS"
	}).text(LocaleManager.getKey("WMS_Add_New")).button().click(function() {

		/*
		 * When the button is clicked, a new Dialog is shown.
		 */
		var newDialog = null;

		/*
		 * This function is called when the URL is inserted and validated
		 * against the Javascript validator. A GETCAPABILITIES is triggered.
		 * 
		 * If successful, the server is added to the WMS Server Dropdown list If
		 * it fails, an error is displayed.
		 */
		var validUrlInsertedCallbackFn = function(url) {
			/*
			 * Test whether the URL is valid and corresponds to a WMS Server...
			 */
			doGetCapabilities(url, function(capabilities) {

				/*
				 * Adding the WMS to the list of WMS...
				 */
				appendToWMSSelectBox(url, url);
				refreshCapabilitiesForSelectedWMS(capabilities);

				/*
				 * Close dialog
				 */
				newDialog.dialog("close");

			}, function(err) {
				/*
				 * Error: the GETCapabilities call has FAILED.
				 */
				alert("error connecting to the server....");
			});
		};
		/*
		 * Create the new WMS Server dialog passing the callbacks and open the
		 * dialog
		 */
		newDialog = displayAddWMSDialog(validUrlInsertedCallbackFn);
		newDialog.dialog("open");
	});

	/*
	 * Building the WMS Dialog
	 */
	var WMSDialogContent = $("<div>").append(
				$("<div>").attr("style", "padding:5px;").append(
						LocaleManager.getKey("WMSDialog_SelectWMS_Label"), selectBox, addWMSButton)
				, outerGridContainer);

	var dialogButtons = {};

	dialogButtons[LocaleManager.getKey("WMSDialog_Button_AddLayer")] = function() {
		addLayerClicked(grid);
	};

	dialogButtons[LocaleManager.getKey("WMSDialog_Button_Done")] = function() {
		dialogDiv.dialog("close");
	};

	var dialogDiv = DialogUtils.createDialog(LocaleManager.getKey("WMSDialog_Title"),
		dialogButtons, {
			width : 700,
			height : 350,
			resizable : false
		}, WMSDialogContent);

	// Building the Grid
	grid.flexigrid({
		colModel : [ {
			display : LocaleManager.getKey("WMSDialog_Grid_Title"),
			name : 'title',
			width : 430,
			sortable : true,
			align : 'left'
		}, {
			// display : 'Value',
			display : LocaleManager.getKey("WMSDialog_Grid_Id"),
			name : 'id',
			width : 200,
			sortable : true,
			align : 'left'
		} ],
		dataType : 'json',
		singleSelect : true,
		height : 178,
		//width: 650,
		id : "pippo"
	});

	/*
	 * Add click function to grid. When a row is selected, the corresponding
	 * layer is registered in the Catalog and added to the map.
	 */
	grid.dblclick(function(event) {
		addLayerClicked($(this));
	});

	/*
	 * WMSDialog is shown
	 */
	dialogDiv.dialog("open");

}

function addLayerClicked(grid) {
	// Get selected row
	var row = _getSelectedRowFromGRID(grid);

	// Get layer Title and Name
	var layerTitle = $('td[abbr="title"] >div', row).html();
	var layerName = $('td[abbr="id"] >div', row).html();

	// Get selected WMS Server from the dropdown
	var selectedWMSServer = getSelectedWMSFromDropdownList();
	var capabilities = selectedWMSServer.capabilities;

	// /*
	// * Check if the server supports the current Map SRS
	// */
	var srsSupported = checkIfSrsSupported(map.getProjection(), layerName,
			capabilities);

	if (srsSupported) {
		// Add to the WebGIS...
		addLayerWMSToCatalogAndWebGIS(selectedWMSServer.name, layerName,
				layerTitle, capabilities);
	} else {
		var dlgTitle = LocaleManager
				.getKey("GetCapabilities_SRS_Not_Supported_Error_Dialog_Title");
		var dlgText = LocaleManager
				.getKey("GetCapabilities_SRS_Not_Supported_Error_Dialog_Text");
		AlertDialog.createOkDefaultDialog(dlgTitle, dlgText);
	}
}

/*
 * TEMP function
 */
function addLayerWMSToCatalogAndWebGIS(wmsUrl, layerName, layerTitle,
		capabilities) {

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

	var conf = {
		// "id": catalog._createNewId(),
		"source" : "wms",
		"title" : layerTitle,
		"url" : wmsUrl,
		"name" : layerName,
		"enabled" : true,
		"capabilities" : capabilities,
		"bounds" : bounds,
		"wmsOptions" : {
			"format" : "image/png",
			"transparent" : true
		},
		"olOptions" : {
			"buffer" : 0,
			"displayOutsideMaxExtent" : true,
			"isBaseLayer" : false,
			"singleTile" : true
		},
		"group" : "layers"
	};

	var layerConfig_i = new LayerConfig(conf);

	// Adds the layer to the LayerConfigCatalog
	catalog.addLayerToConfig(layerConfig_i);
	
	LoadLayersUtils.loadStdLayerInSelectedLayerTreeFromOutside(layerConfig_i, function() {
		
		var bounds = layerConfig_i.getBounds();
		if (!Utils.isNullOrUndefined(bounds)) {
			// If bounds is not null...
			zoomToExtent(bounds, true);
		}
	});
}

/**
 * Performs a GET CAPABILITIES to the specified URL and loads the results in the
 * GRID
 * 
 * @param url
 *            The url of the server (eg: http://localhost:8080/geoserver/wms
 * @param grid
 *            The Grid object
 */
function loadCapabilitiesIntoGrid(url, grid, successOrFailFn) {
	doGetCapabilities(url, function(capabilities) {

		// Refresh the capabilities for the selected WMS
		refreshCapabilitiesForSelectedWMS(capabilities);

		var tableRows = new Array();

		var layers = capabilities.capability.layers;

		$.each(layers, function(key, value) {
			var title = value.title;
			var name = value.name;
			var prop_i = {
				cell : [ title, name ]
			};

			tableRows.push(prop_i);
		});

		var data = {
			total : tableRows.length,
			page : 1,
			rows : tableRows
		};

		grid.flexAddData(data);
		grid.flexReload();

		//Capabilities added to grid. Removing loading panel
		if (!Utils.isNullOrUndefined(successOrFailFn)) {
			successOrFailFn();	
		}
		
	}, function() {
		/*
		 * Error getting the capabilities or server timeout...
		 * Removing loading panel
		 */
		if (!Utils.isNullOrUndefined(successOrFailFn)) {
			successOrFailFn();	
		}
	});
}