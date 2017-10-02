var print = {
	active : false,

	// - A4 landscape (297 x 210)mm
	// - A4 portrait (210 x 297)mm
	// - Letter landscape (279 x 216)mm
	// - Letter portrait (216 x 279)
	// - Oficio landscape (330 x 216)mm
	// - Oficio portrait (216 x 330)mm
	//@see http://es.wikipedia.org/wiki/Formato_de_papel
	
	/*
	 * NOTES:
	 * These values ARE NOT the exact A4 printsizes (or A3, A0, ..)
	 * but are the sizes of the area of the SHEET where
	 * the MAP is GOING TO BE PLACED.
	 * For instance, the A4 Landscape sheet, the MAP area is more
	 * or less 265x 135 millimiters, as the sheet also contains 
	 * an hader and a footer.
	 * 
	 * A3 is more or less 1.4 times bigger than A4.
	 */
	
    A4_Landscape_PrintSize: {
    	x: 260, //Mirko
    	y: 145 //Mirko
    },
    A4_Portrait_PrintSize: {
    	x: 175, //Mirko
    	y: 227 //Mirko
    },
    A3_Landscape_PrintSize: {
    	x: 366,
    	y: 204 
    },
    A3_Portrait_PrintSize: {
    	x: 245,
    	y: 318
    },
    Letter_Landscape_PrintSize: {
    	x: 244, 
    	y: 149 
    },
    Letter_Portrait_PrintSize: {
    	x: 187, //+7
    	y: 222 //+9
    },
    Oficio_Landscape_PrintSize: {
    	x:  295, //+6
    	y:  154 //+5
    },
    Oficio_Portrait_PrintSize: {
    	x: 186, //+6
    	y: 260 //+8
    },
		
    vLayer: null,
	panel: null,
	
	// Define conversion factors
	factors: {
		// From mm to inches
		mm2inches: 1 / 25.4
	},
	
	//scales: Print_Configuration.scales,
	
	//format: Print_Configuration.formats,
	
	//dpi: Print_Configuration.dpi,

	/** *************
	 *  Init Print 
	 *  *************/
	init: function() {
		
		if (this.vLayer == null) {
			// Inizializza il Vector layer di openlayer
			this.initLayer();
		}
		
		if(this.panel == null) {
			
			console.log("First time in Print Panel... initializing");
			Print_Configuration.loadConfigFromMapfish(function(config){
				
				// Init value settings print
				//Utils.populateCombo($("#print-layout"), config.layouts, "value", "name");
				
				Utils.populateCombo($("#print-layout"), Print_Configuration.layoutsOverride, "value", "text");
				
				//Utils.populateCombo($("#print-format"), config.outputFormats, "value", "name");
				Utils.populateCombo($("#print-format"), Print_Configuration.outputFormatOverride, "value", "text");
				
				Utils.populateCombo($("#print-scale"), config.scales, "value", "name");

				//Utils.populateCombo($("#print-dpi"), config.dpis, "value", "name");
				Utils.populateCombo($("#print-dpi"), Print_Configuration.dpiOverride, "value", "text");
				
				print.prepareMap();
			});
			
			this.panel = $("#advance-print-panel");
			this.button = $("#gis-print");
			
			//Default map title
			$("#print-title").val(LocaleManager.getKey("Print_Default_Map_Title"));
			
			// Add change scale event to zoom to scale selected
			$("#print-scale").change(function(){			
				print.createPointPolygon($("#print-layout option:selected").val(), $(this).find(":selected").val(), Utils.getMapCenterPoint(map));			
				map.zoomToScale($(this).find(":selected").val());
			});
			
			$("#print-layout").change(function(){				
				print.createPointPolygon($(this).find(":selected").val(), $("#print-scale").find(":selected").val(), Utils.getMapCenterPoint(map));			
				map.zoomToScale($("#print-scale").find(":selected").val());
			});
		}
		else {
			print.prepareMap();
		}
		
		this.openPanel();
	},
	
	prepareMap: function() {
		this.adjustScaleBasedOnCurrentVisibility();
		
		// Load print area at current scale map
		this.reloadPrintBox();
	},
	
	/**
	 * Called when the user moves the map.
	 */
	onMouseMoveOnMapEventCallBackFn: function() {
		if (print.active) {
			//print.adjustScaleBasedOnCurrentVisibility();
			print.reloadPrintBox();
		}
	},
	
	/**
	 * It sets the nearest minimun scale to map scale into combobox
	 */
	adjustScaleBasedOnCurrentVisibility: function() {
		// Set current scale to combobox scale
		var nearestMinScale = this.getNearestMinScale();
		this.setNearestScale(nearestMinScale);
	},
	
	/**
	 *  Reload print tool at current map scale.
	 *  Create print area polygon at that scale
	 *   
	 */
	reloadPrintBox: function() {
		this.createPointPolygon($("#print-layout option:selected").val(), $("#print-scale option:selected").val(), Utils.getMapCenterPoint(map));
	},
	
	/** ****************************************
	 *  Enable/Disable print tool
	 *  Init vector layer and open print panel
	 *  *****************************************/
	toggle: function(button) {	
		if(!button.hasClass("btn-active")) {
			this.activate(button);
		}
		else {
			this.deactivate(button);
		}
	},
	
	activate: function(button) {
		button.addClass("btn-active");
		this.init();	
		this.active = true;
	},
	
	deactivate: function(button) {
		if(!button)
			if(this.button == null)
				return;
			button = this.button;
		
		button.removeClass("btn-active");
		this.closePanel();
		this.resetPanelSettings();
		this.vLayer.removeAllFeatures();
		//this.cleanControls();
		this.active = false;
	},
	/** ***************************
	 *  Open redlines manager panel
	 *  ***************************/
	openPanel: function() {
		this.panel.show();
	},
	
	/** ***************************
	 *  Close redline manager panel
	 *  ***************************/
	closePanel: function() {	
		// Close tools panel
		if(this.panel != null) {
			this.panel.hide();
		}
	},
	
	/** **************************
	 *  Reset print settings panel
	 *  **************************/
	resetPanelSettings: function() {
		$.each(this.panel.find("select"), function(){
			$(this).val($(this).find("option:first").val());
		});
	},
	
	/** *****************************
	 *  Init layer to draw print area
	 *  *****************************/
	initLayer: function() {
		if (this.vLayer == null) {
			this.vLayer = new OpenLayers.Layer.Vector("print",{
				displayInLayerSwitcher : false,
				styleMap: StyleManager.getRedlineStyle(),
				projection : new OpenLayers.Projection(map.getProjection()),
				eventListeners : {
					'beforefeatureadded' : function(feature) {
/*						if(feature.feature.attributes.hasOwnProperty("epsg"))
							srid = feature.feature.attributes.epsg;
						else
							srid = feature.feature.layer.projection.projCode;
						feature.feature.geometry.transform(new OpenLayers.Projection(srid),new OpenLayers.Projection(map.getProjection()));*/
					}
				},
				print: false
			});

			/*
			 * This layer must always stay on top
			 * (see map.events.register("addlayer", map, function(obj))
			 */
			this.vLayer.alwaysOnTop = true;
			map.addLayer(this.vLayer);

			return this.vLayer;
		}
	},
	
	// Get Map to print (map config and layers)
	getMap: function() {	
		var mapObj = {
			"tools" : catalog.getToolConfig(),
			"map": this.getMapConfig(),
			"layers" : this.getLayers()
		};
		
		return mapObj;		
	},
	
	requests: {
		submit: function() {
			// Param map for submit post
			var options = print.getPrintOptions();

			// Create input hidden with param map
			var mapfishPrint = new MapfishPrint();
			mapfishPrint.doPrint({
				layout: options.layout,
				title: options.title,
				mapTitle: options.title,
				mapComment: options.comment,
				note: PRINT_SETTINGS.informationMessage,
				outputFormat: options.outputFormat,
				scale: options.scale,
				dpi: options.dpi,
				rotationAngle: options.rotationAngle,
				hasLegend: options.hasLegend
			});
		}
	},
	
	/** ****************************
	 *  Retrieve print panel options
	 *  ****************************/
	getPrintOptions: function() {
		var options = new Object();
			options.layout = $("#print-layout option:selected").val();
			options.outputFormat = $("#print-format option:selected").val();
			options.scale = $("#print-scale option:selected").val();
			options.dpi = $("#print-dpi option:selected").val();
			options.title = $("#print-title").val();
			//options.comment = $("#print-comment").val();
			options.rotationAngle = $("#print-rotation_angle").val();
			options.hasLegend = $("#print-include_legend").is(":checked");
		return options;
	},
	
	/** ***********************************************************
	 *  Return the minimum scale value nearest to current scale map
	 *  ***********************************************************/
	getNearestMinScale: function() {
		var curScale = map.getScale();
		var listScale = this.getListScales();
		var nMinScale = listScale[listScale.length - 1];
		
		//Cadili version
		for(var index=0; index < listScale.length; index++) {
			if(listScale[index] > curScale) {
				nMinScale = listScale[index];
				break;
			}
		}
		
		return nMinScale;
		
		//Mirko version
//		$.each(listScale, function(index, scale){
//			if(listScale.length > (index + 1)) {
//				if(listScale[index] < curScale && listScale[index + 1] > curScale) {
//					nMinScale = listScale[index];
//					return false; //break;
//				}
//				return true; //continue;
//			}
//			else {
//				nMinScale = listScale[index];
//				return false; //break;		
//			}
//		});
//		return nMinScale;
	},
	
	/** *******************************************************
	 *  Return the list of scale values supported by print tool
	 *  (defined into scale values array)
	 *  *******************************************************/
	getListScales: function() {
		var scales = [];
		$.each($("#print-scale option"), function(index, item) {
			scales.push($(item).val());
		});
		
		return scales;
	},
	
	/** *********************************
	 *  Set the scale into scale combobox
	 *  *********************************/
	setNearestScale: function(scale) {
		$("#print-scale").val(scale);
	},
	
	/** *************************************************************************
	 *  Create print area polygon
	 *  - format: layout format (A4 landscape, A4 portrait)
	 *  - scale: scale resize factor (polygon will be resize at this value scale)
	 *  - center: center of polygon to create
	 *  *************************************************************************/
	createPointPolygon: function(format, scale, center) {
		// Activate control to modify print area (only drag)
		//controls.print.deactivate();
		this.vLayer.removeAllFeatures();
		
		// Get points of polygon for selected format (A4..) and centered at "center"
		// (from coords in inches to map unit)
		var extentPolygon = this.getCoordsInInches(center, format);
		var pointsInMapUnit = this.getPointsInUnitMap(extentPolygon);
		
		// Build polygon from point defined and create an OL feature
		// - point to line
		// - line to polygon
		var line = new OpenLayers.Geometry.LinearRing(pointsInMapUnit);
		var polygon = new OpenLayers.Geometry.Polygon([line]);
		
		var feature = new OpenLayers.Feature.Vector(polygon);
			feature.geometry.resize(scale, center);
		
		this.vLayer.addFeatures([feature]);
		//controls.print.activate("modify");
		//controls.print.instance.modify.selectFeature(this.vLayer.features[0]);
	},
	
	/**
	 *  Return coordinates in inches depending on map center and format.
	 *  * xmin
	 *  * ymin
	 *  * xmax
	 *  * ymax
	 *  
	 *  - center: center point of polygon to use
	 *  - format: layout format
	 */
	getCoordsInInches: function(center, format) {
		var centerInch = {
			x: OpenLayers.INCHES_PER_UNIT[map.getUnits()] * center.x,
			y: OpenLayers.INCHES_PER_UNIT[map.getUnits()] * center.y
		};
		
		// Define size in inch depending on layout format
		// - A4 landscape (297 x 210)
		// - A4 portrait (210 x 297)
		var A4Inch = null;
		
		switch (format) {
			case "A4 landscape":
				A4Inch = {
					h: (this.A4_Landscape_PrintSize.y * parseFloat(this.factors.mm2inches)),
					w: (this.A4_Landscape_PrintSize.x * parseFloat(this.factors.mm2inches))
				};
			break;
			case "A4 portrait":
				A4Inch = {
					w: (this.A4_Portrait_PrintSize.x * parseFloat(this.factors.mm2inches)),
					h: (this.A4_Portrait_PrintSize.y * parseFloat(this.factors.mm2inches))
				};
			break;
			case "A3 landscape":
				A4Inch = {
					h: (this.A3_Landscape_PrintSize.y * parseFloat(this.factors.mm2inches)),
					w: (this.A3_Landscape_PrintSize.x * parseFloat(this.factors.mm2inches))
				};
			break;
			case "A3 portrait":
				A4Inch = {
					w: (this.A3_Portrait_PrintSize.x * parseFloat(this.factors.mm2inches)),
					h: (this.A3_Portrait_PrintSize.y * parseFloat(this.factors.mm2inches))
				};
			break;
			case "Letter landscape":
				A4Inch = {
					h: (this.Letter_Landscape_PrintSize.y * parseFloat(this.factors.mm2inches)),
					w: (this.Letter_Landscape_PrintSize.x * parseFloat(this.factors.mm2inches))
				};
			break;
			case "Letter portrait":
				A4Inch = {
					w: (this.Letter_Portrait_PrintSize.x * parseFloat(this.factors.mm2inches)),
					h: (this.Letter_Portrait_PrintSize.y * parseFloat(this.factors.mm2inches))
				};
			break;
			case "Oficio landscape":
				A4Inch = {
					h: (this.Oficio_Landscape_PrintSize.y * parseFloat(this.factors.mm2inches)),
					w: (this.Oficio_Landscape_PrintSize.x * parseFloat(this.factors.mm2inches))
				};
			break;
			case "Oficio portrait":
				A4Inch = {
					w: (this.Oficio_Portrait_PrintSize.x * parseFloat(this.factors.mm2inches)),
					h: (this.Oficio_Portrait_PrintSize.y * parseFloat(this.factors.mm2inches))
				};
			break;
			
			
		}
		
		// Extent of polygon in inches and centered in map center
		var extent = {
			xMin: (centerInch.x - (A4Inch.w / 2)),
			yMin: (centerInch.y - (A4Inch.h / 2)),
			xMax: (centerInch.x + (A4Inch.w / 2)),
			yMax: (centerInch.y + (A4Inch.h / 2))
		};
		
		return extent;
	},
	
	/**
	 *  Return points of polygon in map units
	 */
	getPointsInUnitMap: function(extent) {
		var xMinMap = extent.xMin / OpenLayers.INCHES_PER_UNIT[map.getUnits()];
		var yMinMap = extent.yMin / OpenLayers.INCHES_PER_UNIT[map.getUnits()];
		var xMaxMap = extent.xMax / OpenLayers.INCHES_PER_UNIT[map.getUnits()];
		var yMaxMap = extent.yMax / OpenLayers.INCHES_PER_UNIT[map.getUnits()];
		
		var points = [
			new OpenLayers.Geometry.Point(xMinMap, yMinMap),
			new OpenLayers.Geometry.Point(xMinMap, yMaxMap),
			new OpenLayers.Geometry.Point(xMaxMap, yMaxMap),
			new OpenLayers.Geometry.Point(xMaxMap, yMinMap),
		];
		
		return points;
	},
	
	/**
	 *  Retrieve visible vectors layers to print
	 */
	getVisibleVectorLayers: function() {
		var vLayers = [];
		var vectors =  map.getLayersByClass("OpenLayers.Layer.Vector");
		
		$.each(vectors, function(index, layer){
			if(layer.hasOwnProperty("print") && !layer.print)
				return true;
			
			if(layer.visibility && layer.features.length > 0) {
				vLayers.push(layer);
			}
		});
		
		return vLayers;
	}
	
};
