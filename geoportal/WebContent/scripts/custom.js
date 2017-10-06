//Proj4js.defs["EPSG:4248"] = "+proj=longlat +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +no_defs";
//Proj4js.defs["EPSG:32616"] = "+proj=utm +zone=16 +datum=WGS84 +units=m +no_defs";

LoadProj4jsHelper.loadProjDefinitions();

var catalog = new LayerConfigCatalog();

/**
 * Initial loading panel
 */
var initialLoadingPanel = null;

/**
 * Stores the tabs (Geoportal <-> Geonetwork)
 */
var topMenuTabs = null;

/**
 * Stores the user permissions
 */
var userPermissions;

/**
 * Stores the OpenLayers map.
 */
var map;

var tree;
var selectedLayerTree;

/**
 * Stores the MapControls: - NavigationHistory - ScaleBar - LoadingPanel -
 * MeasureControls
 * 
 */
var mapControls = {};

var mapExportCtrl = null;

//var groups = null; Defined in layerMenu

var configLoaded = false;
//var groupsConfigLoaded = false;

/**
 * Starts the fireworks...
 */
function loadAll() {
	
//	if (!(configLoaded === true && groupsConfigLoaded === true)) {
//		return;
//	}

	// Rimuove il loading dall'elemento
	loadingDialog.close();

	var mapConfig = catalog.getMapConfig();
	var toolsConfig = catalog.getToolConfig();

	OpenLayers.Control.DragPan.prototype.enableKinetic = false;
	//var mapDefaultExtent = new OpenLayers.Bounds(mapConfig.maxExtent[0],
	//		mapConfig.maxExtent[1], mapConfig.maxExtent[2],
	//		mapConfig.maxExtent[3]);
	
	//OpenLayers.Util.onImageLoadErrorColor = 'transparent';
	//OpenLayers.DOTS_PER_INCH = 90.71428571428572;
	var mapOptions = {
		projection : new OpenLayers.Projection(mapConfig.projection),
		units : mapConfig.units,
		// Test per ridurre il bug allo zoom con google
		zoomMethod : null,
		transitionEffect: null,
		//numZoomLevels: 21
		//maxScale: 4265.4591671058115
		//scales: [1000, 2000, 5000, 10000, 25000, 50000, 100000, 150000, 200000, 250000, 500000, 1000000, 2000000, 3000000, 4000000].reverse(),
		//resolutions: [1120.0, 839.9999999999999, 560.0, 280.0, 140.0, 70.0, 55.99999999999999, 41.99999999999999, 27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4, 0.5599999999999999, 0.27999999999999997]
        //maxResolution : 156543.0339,
		//maxExtent : mapDefaultExtent,
		//restrictedExtent: hondurasExtentXXX
		//allOverlays: true,
		//maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20103291.66,20103291.66)
	};

	/*
	 * Handle max Scale
	 * 
	 */
	if (!Utils.isNullOrUndefined(mapConfig.maxScale)) {
		mapOptions.maxScale = mapConfig.maxScale;
	}
	
	/*
	 * Handle custom scales and Dots per Inch
	 */
	if (!Utils.isNullOrUndefined(mapConfig.dotsPerInch)) {
		OpenLayers.DOTS_PER_INCH = mapConfig.dotsPerInch;
	}
	
	if (!Utils.isNullOrUndefined(mapConfig.customResolutions)) {
		//from bigger to smaller
		Utils.orderArrayNumber(mapConfig.customResolutions);
		mapOptions.resolutions = mapConfig.customResolutions.reverse();
	}
	else if (!Utils.isNullOrUndefined(mapConfig.customScales)) {
		//from bigger to smaller
		Utils.orderArrayNumber(mapConfig.customScales);
		mapOptions.scales = mapConfig.customScales.reverse();
	}
	
	map = new OpenLayers.Map('map', mapOptions);

	/*
	 * Create Layer Switcher Control
	 */
	//map.addControl(new OpenLayers.Control.LayerSwitcher());

	/*
	 * Create Navigation History Control
	 */
	var navControl = new OpenLayers.Control.NavigationHistory();

	navControl.previous.events.register("activate", null, function() {
		handleNavigationButtons();
	});
	navControl.previous.events.register("deactivate", null, function() {
		handleNavigationButtons();
	});
	navControl.next.events.register("activate", null, function() {
		handleNavigationButtons();
	});
	navControl.next.events.register("deactivate", null, function() {
		handleNavigationButtons();
	});

	navControl.activate();
	map.addControl(navControl);
	mapControls["navControl"] = navControl;
	
	// Move end event on map (zoom - pan - drag)
	map.events.register("moveend", map, function() {
		if($("#input-label-panel").is(":visible")) {
//			if(
//				(controls.comments.instance != null &&
//				 controls.comments.instance.modify.active) &&	
//				(comments.vLayer != null &&
//				 comments.vLayer.selectedFeatures.length == 1)
//			) {
//				var feature = comments.vLayer.selectedFeatures[0];
//				Utils.locateInputLabelBox(feature);
//			}
		}
		
	});

	map.events.register("move", map, function() {
		print.onMouseMoveOnMapEventCallBackFn();
	});
	
	/*
	 * Vector layers always stay on top.
	 */
	map.events.register("addlayer", map, function(obj){
		
		if (obj.layer.alwaysOnTop === true) {
			return;
		}
		
		//Vector layers always stay on top...
		var numberOfBaseLayers =  map.getLayersBy("isBaseLayer", true).length;
		
		var numLayersAttachedToMap = map.getNumLayers();
		
		//Num "always on top" layers
		//var numVectorLayers2 = map.getLayersByClass("OpenLayers.Layer.Vector").length;
		var numAlwaysOnTopLayers = map.getLayersBy("alwaysOnTop", true).length;
		
		//var layerClass = obj.layer.CLASS_NAME;
		
		if (!obj.layer.isBaseLayer) {
			var currentIndex = map.getLayerIndex(obj.layer);
			if (currentIndex > (numLayersAttachedToMap - numAlwaysOnTopLayers) - 1) {
				//Must decrease the counter, so that the vector layers always stay on top.
				map.setLayerIndex(obj.layer, numLayersAttachedToMap - numAlwaysOnTopLayers - 1);
			}
		} else {
			var newPositionCorrectZeroBased = numberOfBaseLayers - 1;
			map.setLayerIndex(obj.layer, newPositionCorrectZeroBased);
		}
	});
	
	
	/*
	 * Current scale on footer
	 */
	map.events.register("zoomend", map, function(e) {
		var currentScaleDenominator = map.getScale();
		$("#gis_current_scalebar").text(LocaleManager.getKey("Map_Current_Scale_Text") + " - 1:" + currentScaleDenominator.toFixed(0));
	});
	
	/*
	 * Mouse Position Control
	 */
	if (toolsConfig.mouseCoordinates.enabled) {
		var numDigits = toolsConfig.mouseCoordinates.numDigits;
		map.events.register("mousemove", map, function(e) {
			var position = this.events.getMousePosition(e);
			position = map.getLonLatFromPixel(e.xy);

			if (Utils.isNullOrUndefined(position)) {
				// alert('measure err');
				return;
			}

			//Transform coordinates to other coordinate system
			//position.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
			position.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:32616"));
			//position.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:900913"));
			
			$("#gis_coordinates").text('(Wgs84/Utm 16N) X: ' + position.lon.toFixed(numDigits) + ', Y: '+ position.lat.toFixed(numDigits));
			
			if(
				controls.redlines.instance != null &&
				controls.redlines.instance.modify.active &&	
				redlines.vLayer.selectedFeatures.length == 1 &&
				$("#input-label-panel").is(":visible")
			) {
				var feature = redlines.vLayer.selectedFeatures[0];
				Utils.locateInputLabelBox(feature);
			}
		});
	}

	/*
	 * Scalebar Control
	 */
	if (toolsConfig.scalebar.enabled) {
		var scalebarConfig = toolsConfig.scalebar;

		/*
		 * Get parameters
		 */
		// metric or english
		var displaySystem = scalebarConfig.displaySystem;
		var divisions = scalebarConfig.divisions;
		var subdivisions = scalebarConfig.subdivisions;
		var singleLine = scalebarConfig.singleLine;

		var scaleBar = new OpenLayers.Control.ScaleBar({
			displaySystem : displaySystem,
			divisions : divisions,
			subdivisions : subdivisions,
			singleLine : singleLine
		});

		// scalebar.update();
		map.addControl(scaleBar);
		mapControls["scaleBar"] = scaleBar;
	}

	/*
	 * LoadingPanel Control
	 */
	toolsConfig.loadingPanel.enabled = true;
	if (toolsConfig.loadingPanel.enabled) {
		var loadingPanel = new OpenLayers.Control.LoadingPanel();
		map.addControl(loadingPanel);
		// show the control
		//loadingPanel.maximizeControl();
	}

	/*
	 * Measure Controls
	 */
	if (toolsConfig.measures.enabled) {
		var measureControls = {
			line : new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
				persist : true,
				handlerOptions : {
					layerOptions : {
						styleMap : styleMapMeasureControls
					}
				}
			}),
			polygon : new OpenLayers.Control.Measure(
					OpenLayers.Handler.Polygon, {
						persist : true,
						handlerOptions : {
							layerOptions : {
								styleMap : styleMapMeasureControls
							}
						}
					})
		};
		var control;
		for ( var key in measureControls) {
			control = measureControls[key];
			control.events.on({
				"measure" : handleMeasurements,
				"measurepartial" : handleMeasurements
			});
			map.addControl(control);
		}
		mapControls["measureControls"] = measureControls;
	}
	
	// /*
	// * Cache Write Control
	// */
	// var cacheWriteControl = new OpenLayers.Control.CacheWrite({
	// autoActivate : true,
	// imageFormat : "image/png",
	// eventListeners : {
	// //alert("cache full");
	// }
	// }
	// });
	// map.addControl(cacheWriteControl);
	//
	// /*
	// * Cache read control
	// */
	// var cacheReadControl = new OpenLayers.Control.CacheRead();
	// map.addControl(cacheReadControl);
	
	// Create Menu....
	LayerMenu.loadMenuGroups(catalog.getGroupConfig());

	var layerConfigs = catalog.getLayerConfigs();
	
	/*
	 * Load layers from config
	 */
	LoadLayersUtils.loadLayersFromConfig(LayerMenu.groups, layerConfigs);

	/*
	 * Center map
	 */
	zoomToDefaultMapCenter();
	
	/*
	 * Overview Control
	 */
	if (toolsConfig.overview.enabled) {
		gisOverview.showButton();
		
		/*
		 * Note:
		 * the layer must be "baselayer = true" (or no value)
		 * If it is baselayer = true, it will hang
		 * (wrapdate exception) 
		 */
		/*
		 * To get the Overview
		 * http://geo-mosef.gesp.it/geoserver/mosef/wms?STYLES=&
		 * LAYERS=mosef%3Am1103va002001_hn&FORMAT=image%2Fpng&
		 * SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&
		 * SRS=EPSG%3A4326&BBOX=-89.573364,12.961736,-82.827759,16.699348&WIDTH=600&HEIGHT=300
		 */
		var hondurasExtent = new OpenLayers.Bounds(-89.573364, 12.961736, -82.827759, 16.69934);
		hondurasExtent = hondurasExtent.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
		
		var overviewImage = new OpenLayers.Layer.Image(
		        'Panoramica',
		        './images/overview/mosef-m1103va002001_hn_overview.png',
		        hondurasExtent,
		        new OpenLayers.Size(300, 150),
		        {numZoomLevels: 1, alwaysInRange: true }
		    );
		
		
		var overviewMapOptions = {
		   projection: new OpenLayers.Projection(mapConfig.projection),
		   units: "m",
		   numZoomLevels: 1,
		   maxExtent: hondurasExtent,
           restrictedExtent: hondurasExtent,		   
		 };
		
		var overviewControl = new OpenLayers.Control.OverviewMap({
    	  div: document.getElementById('gis-map-overview'),
    	  size: new OpenLayers.Size(300,150),
	      layers: [overviewImage],
	      mapOptions: overviewMapOptions
		});
      
		map.addControl(overviewControl);

	}
	
	/*
	 * Create ResultPanel
	 */
	searchResultPanel = new SearchResultPanel(map, {
		"onclick": function(fid){
			searchResultPanel.zoomToFeature(fid);
		}}
	);
}

function zoomToDefaultMapCenter() {
	var mapConfig = catalog.getMapConfig();
	
	/*
	 * Zoom to the default map center.
	 * Test that the config has been setup.
	 */
//	if (!Utils.isNullOrUndefined(mapConfig.center) && !Utils.isNullOrUndefined(mapConfig.projection) &&
//			map.layers.length > 0) {
//		map.setCenter(new OpenLayers.LonLat(mapConfig.center[0],
//				mapConfig.center[1]).transform(new OpenLayers.Projection(
//				mapConfig.projection), map.getProjectionObject()), mapConfig.zoom);	
//		
//	}
	 if (!Utils.isNullOrUndefined(mapConfig.defaultExtent)) {
		 var bounds = new OpenLayers.Bounds(mapConfig.defaultExtent);
		 bounds = bounds.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
		 map.zoomToExtent(bounds);
	}
}

/**
 * 
 */
function zoomToExtent(bounds, closestZoomLevel) {
	map.zoomToExtent(bounds, closestZoomLevel);
};

/**
 * Retrieves the Configuration Object (JSON) with all the configuration for the
 * map.
 * 
 * In case of an error in retrieving or applying the configuration, an exception
 * is raised with the description of the error
 * 
 */
function getConfig(callbackFn) {
	try {
		var customConfig = getUrlParameter('config');
		var url = customConfig ? customConfig : Services.mapConfig;
		$.ajax({
			url : url,
			type : "GET",
			dataType : "json",
			cache : false,
			data : {
				oper : 'exportConfigAsJson'
			}
		}).done(function(jsonObject) {

			//Open notes
			GisNoteMessage.gisNoteMessageClicked();
			
			/*
			 * Show initial message
			 */
			if (!Utils.isNullOrUndefined(jsonObject.general.showInitialMessage) && jsonObject.general.showInitialMessage === true) {
				AlertDialog.createOkDefaultDialog(
						"Bienvenidos", 
						jsonObject.general.initialMessage
				);
			}
			
			var capabilitiesLoaded = false;
			var describeFeaturesLoaded = false;

			var capabilitiesResults = null;
			var describeLayersResults = null;

			loadAllCapabilitiesFromConfig(jsonObject, function(capabilitiesList) {
				capabilitiesResults = capabilitiesList;
				capabilitiesLoaded = true;

				if (capabilitiesLoaded && describeFeaturesLoaded) {
					catalog.loadConfigFromJSON(jsonObject,capabilitiesResults, describeLayersResults);
					configLoaded = true;
					callbackFn();
				}
			});

			DescribeFeature.loadAllDescribeFeatureFromConfig(jsonObject, function(describeLayersList) {
				describeLayersResults = describeLayersList;
				describeFeaturesLoaded = true;

				if (capabilitiesLoaded && describeFeaturesLoaded) {
					catalog.loadConfigFromJSON(jsonObject, capabilitiesResults, describeLayersResults);
					configLoaded = true;
					callbackFn();
				}
			});
		}).fail(function(a, b, c) {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("Configuration_Retrieve_Fail")
			);
			throw LocaleManager.getKey("Configuration_Retrieve_Fail");
		}).error(function() {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("Configuration_Retrieve_Error")
			);
			throw LocaleManager.getKey("Configuration_Retrieve_Error");
		});
	} catch (err) {
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Error_Title"), 
			err
		);
		throw err;
	}
}

 function adjustTocHeight() {
	//Panel Height
	var docHeight = $(window).height();
	var mainPanelHeight = docHeight - $("#toolbar").height() - $("#topbanner").height() - $("#footer").height() - 100;
	
	if (gisOverview.isShown()) {
		var overviewHeight = $("#gis-map-overview").height();
		mainPanelHeight -= overviewHeight;
		//console.log('Overview height: ' + overviewHeight);
		//console.log('Correct height: ' + correctHeight);
	}
	//$("#tab_toc").css("max-height", mainPanelHeight + "px");
	
	//Set max height to Search panel
	$("#tab_search").css("max-height", mainPanelHeight + "px");
	
	var scrollCatalog = $("#tab_layers .tab_content");
	var scrollActive = $("#menu_layers_active .menu_item_content");
	
	//Title heights
	var titleActiveLayerHeight = $("#menu_layers_active .menu_title").outerHeight();
	var titleCatalogLayerHeight = $("#tab_layers .menu_title.catalogLayerTitle").outerHeight();
	
	//Paddings
	var paddingActiveLayer = 10;
	var paddingCatalogLayer = 10;
	
	/*
	 * Altezze
	 */
	var activeLayerPanelScrollHeight = scrollActive.prop("scrollHeight");
	var catalogLayerPanelScrollHeight = scrollCatalog.prop("scrollHeight");
	var activeLayerPanelHeight = activeLayerPanelScrollHeight + titleActiveLayerHeight + paddingActiveLayer;
	var catalogLayerPanelHeight = catalogLayerPanelScrollHeight + titleCatalogLayerHeight + paddingCatalogLayer;
	
	
	var halfHeight = mainPanelHeight / 2;
	
	//Se sono entrambe superiori a halfHeight, setto il 50% a ciascuno
	if (activeLayerPanelHeight >= halfHeight && catalogLayerPanelHeight >= halfHeight) {
		//console.log("entrambi > 50%");
		//Active
		scrollActive.css("max-height", (halfHeight - titleActiveLayerHeight) + "px");
		
		//Catalog
		scrollCatalog.css("max-height", (halfHeight - titleCatalogLayerHeight) + "px");
	}
	else if (activeLayerPanelHeight < halfHeight && catalogLayerPanelHeight < halfHeight){
		//console.log("entrambi < 50%");
		scrollActive.css("max-height", "none");
		scrollCatalog.css("max-height", "none");
	}
	else {
		if (activeLayerPanelHeight > catalogLayerPanelHeight) {
			//console.log("titleCatalogLayerHeight < 50% e activeLayerPanelHeight > 50%");
			scrollCatalog.css("max-height", "none");
			scrollActive.css("max-height", mainPanelHeight - catalogLayerPanelHeight - titleActiveLayerHeight);
		} 
		else {
			//console.log("activeLayerPanelHeight < 50% e titleCatalogLayerHeight > 50%");
			scrollActive.css("max-height", "none");
			scrollCatalog.css("max-height", mainPanelHeight - activeLayerPanelHeight - titleCatalogLayerHeight);
		}
	}
	
}

 //Window resize event
$(window).resize(adjustTocHeight);

$(document).ready(function() {
	
	adjustTocHeight();
	
	//Activate AJAXProxyFilter
	AjaxPrefilter.activateProxyFilter(OL_PROXY_URL);
	
	//do locale....
	LocaleManager.refreshLocale();
	//Set the locale combo...
	var currentLocale = LocaleManager.getCurrentLocale();
	$("#language-selector").val(currentLocale);
	
	//init MenuTree
	tree = new TreeMenu($("#tab_layers"));
	$("#tab_layers").bind("heightChange", function(){
		adjustTocHeight();
	});
	
	selectedLayerTree = new TreeMenu($("#tab_layers_active"));
	$("#tab_layers_active").bind("heightChange", function(){
		adjustTocHeight();
	});
	
	//init FeatureGridPanel
	featureGridPanel = new FeatureGridPanel();
	
	//init Sorting in selectedLayerPanel...
	LayerMenu.initOrderingSelectedLayerPanel();
	
	//init search panel
	searchP.init();
	
	// init search panel
	//searchResultPanel.init();
	
	$.ajax({
		url : "login",
		type : "GET",
		dataType : "json",
		data : {
			oper : "currentUser"
		},
		cache : false
	}).done(function(jsonObject) {
		if (jsonObject.success === true) {
			/*
			 * It is not possible to login anymore, so the login button must
			 * be disabled
			 */
			$("gis_login").prop('disabled', true);

			/*
			 * Username and password are hidden
			 */
			$("#login_username,#login_password").prop('disabled', true).hide();
			//$("#login_password").prop('disabled', true).hide();
			$("#login_username_label, #login_password_label").hide();
			
			$("#logged-welcome")
				.text(LocaleManager.getKey("AlertDialog_Info_LoggedWelcome") + jsonObject.result.username)
				.addClass("logged-welcome-visible");

			$("#gis_login").hide();
			$("#gis_logout").show();

			userPermissions = new UserPermission(jsonObject.result);
		} 
		init();
	});
	
});

function init() {

	/*
	 * Set the OpenLayers Proxy to bypass the Same Origin Policy issue.
	 */
	OpenLayers.ProxyHost = OL_PROXY_URL;

	/*
	 * Call the getConfig function to get the Webgis configuration and specify
	 * the callback function to call when the configuration is retrieved and
	 * parsed.
	 */
	try {
/*		initialLoadingPanel = new LoadingPanel($("#tabsWebgisGN"),
				LocaleManager.getKey("Loading"), true);
		initialLoadingPanel.addLoading();*/
		
		loadingDialog.open("", LocaleManager.getKey("Loading"));
		getConfig(loadAll);
		
	} catch (err) {
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Error_Title"), 
			LocaleManager.getKey("Configuration_Init_Error")
		);
	}
}

/*
 * Loads the openlayers toolbar
 */
$(function() {

	/*
	 * Creates the VIEW and SEARCH tabs in the upper menu and localizes them
	 */

	$("#tab_webgis").text(LocaleManager.getKey("Tab_Menu_Webgis"));
	$("#tab_gn").text(LocaleManager.getKey("Tab_Menu_Geonetwork"));

	//topMenuTabs = $('#tabsWebgisGN').tabs();
	$("a.tabref").click(function() {
		if ($(this).text() === "View") {
			// Hide Geonetwork
			$("#tabs-gn").addClass("custom-hidden");
			// Show Webgis
			$("#tabs-webgis").removeClass("custom-hidden");

		} else {
			// Hide Webgis
			$("#tabs-webgis").addClass("custom-hidden");
			// Show Geonetwork
			$("#tabs-gn").removeClass("custom-hidden");
		}
	});

	//$("#gis_WMSDialog").click(function() {
	//	//showWMSDialog();
	//	//addWmsDialog.showWMSDialog();
	//});

	/*
	 * NAVIGATION TOOLBAR
	 */
	$("#gis_prevBtn").click(function() {
		// SE posso andare indietro, vado
		if (mapControls.navControl.previous.active) {
			mapControls.navControl.previousTrigger();
		}

	});

	$("#gis_nextBtn").click(function() {
		// SE posso andare avanti, vado
		if (mapControls.navControl.next.active) {
			mapControls.navControl.nextTrigger();
		}
	});

	/*
	 * GIS LOGOUT
	 */
	$("#gis_logout").button().click(function() {
		
		$.ajax({
			url : "login",
			type : "GET",
			dataType : "json",
			cache : false,
			data : {
				oper : "logout"
			}
		}).done(function(jsonObject) {
			if (jsonObject.success === true) {
				location.reload(true);
			} else {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Warning_Title"), 
					jsonObject.msg
				);
			}

		}).fail(function(jqXHR, textStatus, error) {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("AlertDialog_Error_LogOut") + error
			);
			throw "error logout";
		}).error(function(jqXHR, textStatus, error) {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("AlertDialog_Error_LogOut") + error
			);
		});
	});

	/*
	 * GIS LOGIN
	 */
	$("#gis_login").button().click(function() {
		
		LoginUtils.submitLogin();
	});
	
	/** ************************************
	 *  Enable "Enter press" to submit login
	 *  ************************************/
	$("#login_username, #login_password").keyup(function(e){
		if(e.keyCode == 13) {
			if($("#login_username").val() != "" && $("#login_password").val() != "")
				LoginUtils.submitLogin();
		}
	});

	
	/**
	 * Redlines
	 */
	/*
	 * MAX EXTENT BUTTON
	 */
	$("#gis_maxExtentBtn").click(function() {
		zoomToDefaultMapCenter();
	});

	/*
	 * GET FEATURE INFO BUTTON
	 */
	$("#gis_getFeatureInfoBtn").click(MenuButtons.featureInfoComponentClicked);

	/*
	 * DOWNLOAD BUTTON
	 */
	$("#gis_downloadBtn").click(MenuButtons.downloadButtonClicked);
	
	/*
	 * MEASURE BUTTONS
	 */
	$("#gis_measureLineBtn").click(function() {
		var enabled = $(this).hasClass('btn-active');

		if (enabled) {
			controls.measure.deactivate("line");
			return;
		}
		controls.measure.activate("line");
		/*
		 * AlertDialog.createOkDefaultDialog("measure line", "measure line",
		 * buttonLineMeasureClicked);
		 */
	});

	$("#gis_measureAreaBtn").click(function() {
		var enabled = $(this).hasClass('btn-active');

		if (enabled) {
			controls.measure.deactivate("polygon");
			return;
		}
		controls.measure.activate("polygon");
		/*
		 * AlertDialog.createOkDefaultDialog("measure area", "measure area",
		 * buttonPolygonMeasureClicked);
		 */
	});
	
	/**
	 * Define change event on baselayer select box - On change set new baselayer
	 * for the map
	 */
	$("#baselayers-select").change(function() {
		LoadLayersUtils.setActiveBaseLayer($(this).find("option:selected"));
	});

	/**
	 * Define "Enter press" on input label
	 * - if select or modify redlines control is active it enables function on redlines
	 * - if select or modify redlines control is active it enables function on redlines
	 */
	$("#input-label").keyup(function(e) {
		if (e.keyCode == 13) {
			saveLabel();
		}
	});
	
	/*
	 * MAP COPYRIGHT INFORMATION BUTTON
	 */
	$("#gis_information_message").click(function() {
		GisNoteMessage.gisNoteMessageClicked();
	});
	
	/**
	 * Save labels button
	 */
	$("#save-label-button").button();
	
	/**
	 * 	Search Panel - Bbox manager minipanel buttons
	 */
	$("#search-bbox-select-button").button();
	$("#search-bbox-toggle-button").button();
	
	/**
	 * 	CSW Catalog Panel - Bbox manager minipanel buttons
	 */
	$("#csw-catalog-bbox-select-button").button();
	$("#csw-catalog-bbox-toggle-button").button();
	
	
	/**
	 *  Submit Print
	 */
	$("#print-submit").button();
	$("#print-reload").button();
	
	/**
	 * 	Alerts buttons panel form (dialog grid)
	 */
	$("#data-grid-insert-submit").button();
	$("#data-grid-update-submit").button();
	$("#data-grid-update-cancel").button();
	$("#data-grid-insert-cancel").button();
	
	$("#alerts-update-modgeom").button();
	$("#alerts-point-insert").button();
	$("#simple-alerts-point-insert").button();
	//$("#alerts-update-modgeomtype").button();
	
	$(".status-actions").button();
	
	$("#goto-coordinates-btn").button();
	
	/**
	 *  Init tooltip 
	 */
	Utils.enableTooltip();

});



function changeGlobalLanguage(selectBoxElem) {
	var selectedValue = selectBoxElem.find(":selected").val();
	
	//Perform an ajax request to change the language server-side...
	Utils.ajaxCall("./login", "POST", "json", 
		{
			oper: "setLanguage",
			language: selectedValue
		}, function() {
			//OK... change also the client-side
			LocaleManager.setLocale(selectedValue);
			LocaleManager.refreshLocale();
			
			//Reload the iframe...
			if ("es" === selectedValue) {
				//$("#geonetwork-container-iframe").attr("src", "http://geo-mosef.gesp.it/geonetwork/srv/spa/main.home");
				loadGeonetworkUrlInIframe(GEONETWORK_URL + "/srv/spa/main.home", false);
			} else {
				//$("#geonetwork-container-iframe").attr("src", "http://geo-mosef.gesp.it/geonetwork/srv/eng/main.home");
				loadGeonetworkUrlInIframe(GEONETWORK_URL + "/srv/eng/main.home", false);
			}
		}, function() {
			//Error, show error dialog.
			AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					LocaleManager.getKey("Change_Language_Error")
			);
		});
}

/**
 * Switch between webgis page and geonetwork page
 * @param switcherDiv
 */
function switchPage(switcherDiv) {
	var page = switcherDiv.data("page");
	switchWebgisGNTabs(page);
}

function switchWebgisGNTabs(pageName) {
	// Hide all divs in switch (webgis e geonetwork)
	$(".webgisGNTabs").hide();
	
	if (pageName === "tabs-gn") {
		//I am showing GN
		
		//Hiding all ui-dialogs
		$("body").find(".ui-dialog").addClass("geonetworkDialogHidden");
	}
	else if (pageName === "tabs-webgis") {
		//Showing all the ui-dialogs previously hidden (if any)
		$("body").find(".geonetworkDialogHidden").removeClass("geonetworkDialogHidden");
	}
	
	$("#" + pageName).show();
}

/**
 * Navigation control handle
 */
function handleNavigationButtons() {
	if (mapControls.navControl.next.active) {
		$("#gis_nextBtn").removeClass("btn-disable");
	} else {
		$("#gis_nextBtn").addClass("btn-disable");
	}

	if (mapControls.navControl.previous.active) {
		$("#gis_prevBtn").removeClass("btn-disable");
	} else {
		$("#gis_prevBtn").addClass("btn-disable");
	}
}

/**
 * Save label depending on wich controls is activated
 */
function saveLabel() {
	if(controls.redlines.instance != null && (controls.redlines.instance.select.active || controls.redlines.instance.modify.active))
		redlines.saveLabel();
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};