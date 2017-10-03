var MapfishPrint = function() {
	
	
	this.outputFileName = Print_Configuration.outputFileName;
	//this.outputFormat = "pdf";
	//this.outputFormat = "png";
	
	var self = this;
	
	this.createMapfishOsm = function() {
		var osm = {
				type: 'Osm',
				opacity: 1,
				customParams: {},
				baseURL: 'http://tile.openstreetmap.org/',
				maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
				tileSize: [256, 256],
				resolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
				              19567.87923828125, 9783.939619140625, 4891.9698095703125,
				              2445.9849047851562, 1222.9924523925781, 611.4962261962891,
				              305.74811309814453, 152.87405654907226, 76.43702827453613,
				              38.218514137268066, 19.109257068634033, 9.554628534317017,
				              4.777314267158508, 2.388657133579254, 1.194328566789627,
				              0.5971642833948135],
				extension: 'png'
		};	
		
		return osm;
	};
	
	this.createMapfishGoogle = function(googleMapType) {
		var google = {
				type : "tiledGoogle",
				opacity: 1,
				baseURL: 'http://maps.google.com/maps/api/staticmap',
				maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
				resolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
				              19567.87923828125, 9783.939619140625, 4891.9698095703125,
				              2445.9849047851562, 1222.9924523925781, 611.4962261962891,
				              305.74811309814453, 152.87405654907226, 76.43702827453613,
				              38.218514137268066, 19.109257068634033, 9.554628534317017,
				              4.777314267158508, 2.388657133579254, 1.194328566789627,
				              0.5971642833948135, 0.29858214169740677, 0.14929107084870338,
				              0.07464553542435169],
				extension: 'jpeg',
				format : "image/jpeg",
				sensor: false,
				maptype: googleMapType.toLowerCase()
		};
		return google;
	};
	
	/*
	 * Example of config for vector layers
	 */
//	this.createTestVectorLayer = function() {
//		var vec = {
//				type : "Vector",
//				styles: {
//	                "": {
//	                    "fillColor": "red",
//	                    "stroke-width": "3",
//	                    "fill-opacity": 0.6,
//	                    "label": "ppp",
//	                    "labelYOffset": "-7"
//	                } 
//				},
//				styleProperty : "_style",
//				geoJson: {
//                    "type": "FeatureCollection",
//                    "features": [
//                        {	
//                            "type": "Feature",
//                            "geometry": {
//                                "type": "Point",
//                                "coordinates": [
//                                   map.getCenter().lon,
//                                   map.getCenter().lat
//                                ]
//                            },
//                            "properties": {
////                            	"_style" : 1
////                            	"_style" : {
////                            		"pointRadius": "8",
////                				    "graphicName": "circle",
////                				    "fillColor": "#2E2EFE",
////                				    "fillOpacity": 0.4,
////                				    "strokeWidth": 2,
////                				    "strokeColor": "#2E2EFE"
////            	                }
//                            }
//                        }
//                    ]
//                }
//                
//		};
//		return vec;
//	};
	
	/**
	 *  Retrieve key properties rules
	 */
	this.getPropertiesRules = function(rules) {
		var rulesObj = {};
		for (var i = 0; i < rules.length; i++) {
			var symbolizer = rules[i].symbolizer;
			
			if(rules[i].hasOwnProperty("filter")) {
				var property = rules[i].filter.property;
				var value = rules[i].filter.value;
				
				if(rulesObj.hasOwnProperty(property)) {
					rulesObj[property][value] = symbolizer;
				}
				else {
					var rule = {};
					rule[value] = symbolizer;
					
					rulesObj[property] = rule;
				}
			}
			else if(rules[i].hasOwnProperty("elseFilter")) {
				rulesObj["elseFilter"] = symbolizer;
			}
		} 
		
		return rulesObj;
	};
	
	/**
	 *  Retrieve the property of feature to set its style
	 *  it is the attribute name defined into the rules
	 */
	this.getFeatPropertyRule = function(feature, rules) {
		var attributes = feature.attributes;
		var featProperty = null;
		for(var property in rules) {
			if(attributes.hasOwnProperty(property)) {
				featProperty = property;
				break;
			}
			else {
				featProperty = "elseFilter";
			}
		}
		
		return featProperty;
	};
	
	/**
	 *  Retrieve style of feature depending on its property value setting in rules
	 */
	this.getStyleFeatureFromRules = function(rules, propertyFeat, propertyValueFeat, typeFeat) {
		var styleFeat = null;
		
		if(propertyFeat != "elseFilter") {
			styleFeat = rules[propertyFeat][propertyValueFeat][typeFeat];
		}
		else {
			styleFeat = rules["elseFilter"][typeFeat];
		}
		
		return styleFeat;
	};
	
	/**
	 *  Retrieve feature style to print
	 *  - If a feature has a style, return the style of the feature
	 *  - If layer has rules it returns the feature style depending on rules settings (filter on specific attribute)
	 *  - If no rules is set it returns default layer style
	 */
	this.getStyleFeature = function(layer, feature) {
		var featStyle = null;
		
		if (feature.hasOwnProperty("style") && !Utils.isNullOrUndefined(feature.style)) {
			featStyle = feature.style;
			return featStyle;
		}
		
		
		// TODO
		// Here it will make a process to find proper style of feature 
		// depending on which rules begin to (only if layer has rules)
		// .....
		if(layer.styleMap.styles["default"].hasOwnProperty("rules") && layer.styleMap.styles["default"].rules.length > 0) {
			// TODO
			// Get style of feature depending on corresponding rule
			// ...
			
			// Retrive key property of rule
			var rules = this.getPropertiesRules(layer.styleMap.styles["default"].rules);
			
			// Retrive property of feature
			var propertyFeat = this.getFeatPropertyRule(feature, rules);
			var valuePropertyFeat = feature.attributes[propertyFeat];
			
			// Retrieve type geometry feature
			var typeFeat = Utils.getGeomTypeForPrint(feature.geometry.CLASS_NAME.split(".")[2]);
			
			// Get feature style from rules
			featStyle = this.getStyleFeatureFromRules(rules, propertyFeat, valuePropertyFeat, typeFeat);
		}
		else {
			// Get style Map corresponding to renderIntent key of the feature
			// Feature gets style from default layer styleMap without rules
			featStyle = layer.styleMap.styles["default"].defaultStyle;			
		}
		
		return featStyle;
	};
	
	/**
	 *  Create vector layer to print
	 *  "ret" is the list of features in GeoJson format (with style and label if exists)
	 */
	this.createPrintVector = function(ret) {
		var vector = {
				type : "Vector",
				styles: {
	                "": {
	                } 
				},
				styleProperty : "_style",
				geoJson: {
                    "type": "FeatureCollection",
                    "features": ret
                }
		};
		
		return vector;
	};
	
	/**
	 *  Retrieve all layers to print
	 *  - Vector visible layer
	 *  - WMS visible layers
	 *  - BaseLayers (Google, OSM, WMS, etc)...
	 */
	this.getLayersForPrint = function() {
		var printLayers = [];
		
		/*
		 * NOTE for vector layers:
		 * 
		 * (points and labels)
		 * http://lists.mapfish.org/pipermail/users/2013-April/003543.html
		 * 
		 * (supported style settings)
		 * http://dev.openlayers.org/docs/files/OpenLayers/Feature/Vector-js.html#OpenLayers.Feature.Vector
		 *  
		 */
		
		//Get vector layer....
		//var testVectorLayer = this.createTestVectorLayer();
		//printLayers.push(testVectorLayer);
		
		//Convert to geojson...
		//var tempVector = comments.vLayer;
		
		/*
		 * Handle VECTORS....
		 */
		// Create a GeoJson of features for each vector layer
		var vLayers = print.getVisibleVectorLayers();
		for (var i = 0; i < vLayers.length; i ++) {
			// Find feature into vLayers[i]
			var curLayer = vLayers[i];
			var features = curLayer.features;
			
			var ret = new Array();
			for (var j = 0; j < features.length; j++) {
				var feat = features[j];
				var jsonString = new OpenLayers.Format.GeoJSON().write(feat, false);
				var jsonFeat = JSON.parse(jsonString);
				var style = this.getStyleFeature(curLayer, feat);
				//var style = feat.style;
				jsonFeat.properties._style = style;
				
				if (!Utils.isNullOrUndefined(jsonFeat.properties.label)) {
					jsonFeat.properties._style.label = jsonFeat.properties.label;
					jsonFeat.properties._style.labelYOffset = "-10";
				}
				
				ret.push(jsonFeat);
			}
			
			var vector = this.createPrintVector(ret);
			
			printLayers.push(vector);
		}
		
/*		var ret = new Array();
		for(var i in tempVector.features){
			var feat = tempVector.features[i];
			var jsonString = new OpenLayers.Format.GeoJSON().write(feat, false);
			var jsonFeat = JSON.parse(jsonString);
			jsonFeat.properties._style = {
					"pointRadius": "8",
				    "graphicName": "circle",
				    "fillColor": "#2E2EFE",
				    "fillOpacity": 0.4,
				    "strokeWidth": 2,
				    "strokeColor": "#2E2EFE"
//				    "label": "ppp",
//                    "labelYOffset": "-7"
            };
			
			if (!Utils.isNullOrUndefined(jsonFeat.properties.label)) {
				jsonFeat.properties._style.label = jsonFeat.properties.label;
				jsonFeat.properties._style.labelYOffset = "-10";
			}
			
			ret.push(jsonFeat);
		}*/

		/* 
		 * HANDLE WMS SHOWN IN THE MENU
		 */
		//Get the visible layers (from menu)
		
		var visibleLayers = selectedLayerTree.getVisibleLayers();
		
		//If there are some visible layers, we print them.
		if (!Utils.isNullOrUndefined(visibleLayers)) {
			$.each(visibleLayers, function(key, visibleLayer_i) {
				var id_i = $(visibleLayer_i).data("id");
				var layerConfig_i = catalog.getLayerConfigById(id_i);
				var layerTitle = $(visibleLayer_i).data("title"); 
				var layerOL = $(visibleLayer_i).data("layerOL");
				
				var currentOpacity = layerOL.opacity;
				
				var layerName = null;
				if (layerConfig_i.getSource() === "wms" ) 
				{
					layerName = layerConfig_i.getName();
				} 
				else if (layerConfig_i.getSource() === "wms_multi_layer") 
				{
					layerName = layerConfig_i.getNameByTitle(layerTitle);
				} 
				else 
				{
					//Otherwise skipping
					return true;
				}
				
				var url = layerConfig_i.getUrl();
	
				var layerNames = [];
				layerNames.push(layerName);
				
				var layer = {
						type : "WMS",
						format : layerConfig_i.getFormat(),
						layers: layerNames,
						baseURL: url,
						opacity: currentOpacity
				};
				
				/*
				 * Attention!!!
				 * Add this to disable transparency
				 * "customParams": {"transparent" : false},
				 * 
				 * See: http://www.mapfish.org/doc/print/protocol.html
				 */
				
				printLayers.push(layer);
			});
		}
		
		
		/*
		 * HANDLE BASELAYERS
		 */
		
		var currentBaseLayer = LayerMenu.getSelectedBasemapLayer();
		if (currentBaseLayer.getSource() === "osm") {
			var osm = this.createMapfishOsm();
			printLayers.push(osm);	
		}
		else if (currentBaseLayer.getSource() === "google") {
			var googleMapType = currentBaseLayer.getName();
			var google = this.createMapfishGoogle(googleMapType);
			printLayers.push(google);
		}
		else if (currentBaseLayer.getSource() === "wms") {
			var baseMapLayerName = currentBaseLayer.getName();
			var url = currentBaseLayer.getUrl();
			
			var layerNames = [];
			layerNames.push(baseMapLayerName);
			
			var opacity = currentBaseLayer.getDefaultOpacity();
			var layer = {
					type : "WMS",
					format : currentBaseLayer.getFormat(),
					layers: layerNames,
					baseURL: url,
					opacity: opacity
			};
			
			/*
			 * Attention!!!
			 * Add this to disable transparency
			 * "customParams": {"transparent" : false},
			 * 
			 * See: http://www.mapfish.org/doc/print/protocol.html
			 */
			
			printLayers.push(layer);
		}
		else if (currentBaseLayer.getSource() === "wms_multi") {
			var baseMapLayerNames = layerConfig_i.getAllLayerNamesForWMSMulti();
			var url = layerConfig_i.getUrl();
			
			var opacity = currentBaseLayer.getDefaultOpacity();
			var layer = {
					type : "WMS",
					format : layerConfig_i.getFormat(),
					layers: baseMapLayerNames,
					baseURL: url,
					opacity: opacity
			};
			printLayers.push(layer);
		}
		
		return printLayers.reverse();
	};
	
	this.getLegendLayers = function() {
		
		var legendList = new Array();
		
		/*
		 * Vector layers
		 *  - Alerts
		 *  - Redlines
		 */
		var vectorLayers = print.getVisibleVectorLayers();
		
		//If there are some vectorLayers , add them to the legend.
		if (!Utils.isNullOrUndefined(vectorLayers)) {
			$.each(vectorLayers, function(key, vectorLayer_i) {
				var name = vectorLayer_i.name;
				var definitionLegend = self._createLegendForCustomVectorLayer(name);
				if (Utils.isNullOrUndefined(definitionLegend)) {
					//Skipping
					return true;
				}
				legendList.push(definitionLegend);
			});
		}
		
		var visibleLayers = selectedLayerTree.getVisibleLayers();
		
		//If there are some visible layers, add them to the legend.
		if (!Utils.isNullOrUndefined(visibleLayers)) {
			$.each(visibleLayers, function(key, visibleLayer_i) {
				var id_i = $(visibleLayer_i).data("id");
				var layerTitle_i = $(visibleLayer_i).data("title");
				
				var layerConfig_i = catalog.getLayerConfigById(id_i);
				var definitionLegend = self._createLegendForLayerConfig(layerConfig_i, layerTitle_i);
				if (Utils.isNullOrUndefined(definitionLegend)) {
					//Skipping
					return true;
				}
				legendList.push(definitionLegend);
			});
		}
		
		//If there is a base layer, add it to the legend list as well.
		var currentBaseLayerLC = LayerMenu.getSelectedBasemapLayer();
		if (!Utils.isNullOrUndefined(currentBaseLayerLC)) {
			var title = LayerMenu.getSelectedBasemapLayerTitle();
			var definitionLegend = self._createLegendForLayerConfig(currentBaseLayerLC, title);
			if (!Utils.isNullOrUndefined(definitionLegend)) {
				legendList.push(definitionLegend);	
			}
		}
		
		return legendList.reverse();
	};
	
	this._createLegendForCustomVectorLayer = function(layerName) {
		var defLegend = null;
		
		if ("alerts" === layerName) {
			var defLegend = new Object();
			
			//The layer name to print in the legend is the Title
			defLegend.name = "Reportes de incidencia";
			
			defLegend.classes = new Array();
			
			var legend = new Object();
			
			var urlLegend = GLOBAL_SETTINGS.alertsLegendImageUrl;
			//var urlLegend = 'file:///' + GLOBAL_SETTINGS.printImagesFolder + '/legends/denuncias.png';
			
			var legendName = "";
			var legendIconBeforeProp = false;
			
			legend.name = legendName;
			legend.icon = urlLegend;
			legend.iconBeforeName = legendIconBeforeProp;
			
			defLegend.classes.push(legend);
		}
		else if ("redlines" === layerName) {
			var defLegend = new Object();
			
			//The layer name to print in the legend is the Title
			defLegend.name = "Dibujos";
			
			defLegend.classes = new Array();
			
			var legend = new Object();
			
			//var urlLegend = "http://localhost:8080/geoportal/images/legends/dibujo.png";
			var urlLegend = GLOBAL_SETTINGS.redlinesLegendImageUrl;
			var legendName = "";
			var legendIconBeforeProp = false;
			
			legend.name = legendName;
			legend.icon = urlLegend;
			legend.iconBeforeName = legendIconBeforeProp;
			
			defLegend.classes.push(legend);
		}
		
		return defLegend;
	};
	
	this._createLegendForLayerConfig = function(layerConfig, layerTitle) {
		
		var layerName = null;
		if (layerConfig.getSource() === "wms" ) 
		{
			layerName = layerConfig.getName();
		} 
		else if (layerConfig.getSource() === "wms_multi_layer") 
		{
			layerName = layerConfig.getNameByTitle(layerTitle);
		} 
		else 
		{
			//Otherwise skipping
			return;
		}
		
		var url = layerConfig.getUrl();
		
		var defLegend = new Object();
		
		//The layer name to print in the legend is the Title
		defLegend.name = layerTitle;
		
		defLegend.classes = new Array();
		
		var legend = new Object();
		
		var urlLegend = LegendGraphics.createGetLegendGraphicUrl(url, layerName);
		var legendName = "";
		var legendIconBeforeProp = false;
		
		legend.name = legendName;
		legend.icon = urlLegend;
		legend.iconBeforeName = legendIconBeforeProp;
		
		defLegend.classes.push(legend);
		
		return defLegend;
	};
	
	
	this.getCenter = function() {
		var center = map.getCenter();
			
			var ret = [];
			ret.push(center.lon);
			ret.push(center.lat);
			
			return ret;
	};
	
	this.doPrint = function(printConfig) {
		var layout = 'A4 landscape';
		if (!Utils.isNullOrUndefined(printConfig.layout)) {
			layout = printConfig.layout;
		};
		
		var title = '';
		if (!Utils.isNullOrUndefined(printConfig.title)) {
			title = printConfig.title;
		};
		
		var mapTitle = '';
		if (!Utils.isNullOrUndefined(printConfig.mapTitle)) {
			mapTitle = printConfig.mapTitle;
		};
		
		var mapComment = '';
		if (!Utils.isNullOrUndefined(printConfig.mapComment)) {
			mapComment = printConfig.mapComment;
		};
		
		var note = '';
		if (!Utils.isNullOrUndefined(printConfig.note)) {
			note = printConfig.note;
		};
		
		var outputFormat = 'pdf';
		if (!Utils.isNullOrUndefined(printConfig.outputFormat)) {
			outputFormat = printConfig.outputFormat;
		};
		
		var scale = 4000000;
		if (!Utils.isNullOrUndefined(printConfig.scale)) {
			scale = printConfig.scale;
		};
		
		var dpi = 190;
		if (!Utils.isNullOrUndefined(printConfig.dpi)) {
			dpi = printConfig.dpi;
		};
		
		//Rotation angle (counterclockwise)
		var rotationAngle = 0;
		if (!Utils.isNullOrUndefined(printConfig.rotationAngle) &&  printConfig.rotationAngle != "") {
			rotationAngle = printConfig.rotationAngle;
		};
		
		var currentMapSrs = catalog.getMapConfig().projection;
		var units = catalog.getMapConfig().units;
		
		var legendList = this.getLegendLayers();
		var hasLegend = false;
		
		if (legendList.length > 0) {
			hasLegend = true;
		}

		/*
		 * If the user does not want the legend,
		 * don't generate it!
		 */
		if (false === printConfig.hasLegend) {
			hasLegend = false;
		}
		
		var json = {
		        layout: layout,
		        title: title,
		        srs: currentMapSrs,
		        units: units,
		        outputFilename: this.outputFileName + "." + outputFormat,
		        outputFormat: outputFormat,
		        layers: this.getLayersForPrint(),
		        rotationAngle: rotationAngle, //For the north arrow
		        note: note,
		        print_images_folder: GLOBAL_SETTINGS.printImagesFolder,
		        mapTitle: mapTitle,
		        dpi: dpi,
		        hasLegend: hasLegend,
		        pages: [
		            {	
		                center: this.getCenter(),
		                scale: scale,
		                //comment: mapComment,
		                //rotationAngle: rotationAngle, //For the map
		                rotation: rotationAngle, //For the Map
		                //print_images_folder: 'c:/print_images_data_folder',
		                data: [
		                    {id:1, name: 'blah', icon: 'icon_pan'},
		                    {id:2, name: 'blip', icon: 'icon_zoomin'}
		                ]
		            }
//		            ,
//		            {
//		                center: this.getCenter(),
//		                scale: 500000,
//		                dpi: 190,
//		                mapTitle: "Second map",
//		                comment: "This is a zoomed in version of the first map. Since the scale is more appropriate, we show the \"routes\" layer.",
//		                data: [
//		                    {id:1, name: 'blah', icon: 'icon_pan'},
//		                    {id:2, name: 'blip', icon: 'icon_zoomin'}
//		                ]
//		            }
		        ],
		        legends: legendList
/*		        legends: [
		        {
		            name: "Layer A",
		            classes: [
		            {
	                	 name: "",
	                	 icon: "http://geo-mosef.gesp.it/geoserver/mosef/wms?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=m1102va001970_hn&LEGEND_OPTIONS=forceLabels%3Aon%3BfontSize%3A10",
	                	 iconBeforeName: false
		            }
		            ]
		        },
		        {
		            name: "Layer B",
		            classes: [
		            {
	                	 name: "",
	                	 icon: "http://geo-mosef.gesp.it/geoserver/mosef/wms?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=m2501va042008_hn&LEGEND_OPTIONS=forceLabels%3Aon%3BfontSize%3A10",
	                	 iconBeforeName: false
		            }
		            ]
		        }
		        ]*/
		     };
		
		this.doMapfishPrintCall(json);
	};

	this.doMapfishPrintCall = function(json) {
		var msg = LocaleManager.getKey("Print_Wait_Message");
		loadingDialog.open("", msg);
		
		var data = JSON.stringify(json);
	    $.ajax({
	        type: 'POST',
	        //url: '../print-servlet-mod2/pdf/create.json',
	        //../print-servlet-mod2 +  /pdf/create.json
	        url: PRINT_SERVLET_URL + "/pdf/create.json",
	        data: data,
	        contentType: 'application/pdf',
	        //dataType: 'json',
	        asynch: false,
	        timeout: PRINT_TIMEOUT,
	        useProxy: true,
	        processData: false
	    }).done(function (result) {
	    	loadingDialog.close();
	        location.href = result.getURL;
	    }).fail(function(result) {
	    	alert('Print Error');
	    	loadingDialog.close();
	    });   
	};

};
