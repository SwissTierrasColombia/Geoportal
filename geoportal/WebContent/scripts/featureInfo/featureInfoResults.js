var featureInfoResults = {

	initialized : false,
	
	infoDialogDiv: null,
	infoDialog: null,
	
	vLayer: null,
	
//	wLayer: null,
	
	init: function() {
		 //Init del layer
		 if (!this.initialized) {
			 
			 this.infoDialogDiv = $("<div>", {
			 		title : LocaleManager.getKey("GetFeature_Info_Dialog_Title")
			 });
			 
			 this.vLayer = this.initLayer();
			 
			 map.addLayer(this.vLayer);
			 this.initialized = true;
		 }
	 },
	 
//	 createWmsLayer: function(layerName, layerUrl, fidFilter) {
//		var wLayer = new OpenLayers.Layer.WMS(layerUrl, layerUrl, {
//			LAYERS : layerName,
//			STYLES : 'prova_selected',
//			format : 'image/png8',
//			transparent : true,
//			featureid: fidFilter
//		}, {
//	        "buffer": 0,
//	        "displayOutsideMaxExtent": true,
//	        "isBaseLayer": false,
//	        "singleTile": true
//	      });
//		
//		return wLayer;
//	 },
	 
	 initLayer: function() {
		 var vLayer = new OpenLayers.Layer.Vector("featureinfolayer", {
				displayInLayerSwitcher : false,
				styleMap: StyleManager.getRedlineStyle(),
				projection : new OpenLayers.Projection(map.getProjection()),
				print: false,
				eventListeners : {
					'beforefeatureadded' : function(feature) {
						if(feature.feature.hasOwnProperty("forcedEpsg")) {
							var srid = feature.feature.forcedEpsg;
							try {
							feature.feature.geometry.transform(new OpenLayers.Projection(srid),new OpenLayers.Projection(map.getProjection()));
							} catch(e) {
								console.log('Error transforming from ' + srid + ' to ' + map.getProjection());
							}
						}
					}
				}
			});
		 vLayer.alwaysOnTop = true;
		 return vLayer; 
	 },
	 
	 parseSrsFromFeature: function(feature) {
		var srs = null;
		var srsTemp = null;
		
		var srsFound = false;
		for (field in feature) {
			/*
			 * Check if the srsName is inside a GEOM Field...
			 */
			for (geomType in feature[field]) {
				if (!Utils.isNullOrUndefined(feature[field][geomType].srsName)) {
					srsTemp = feature[field][geomType].srsName;
				}	
			}
			if (!Utils.isNullOrUndefined(srsTemp)) {
				srs = "EPSG:" + srsTemp.split("#")[1];
				srsFound = true;
			}
			
			if (srsFound === true) return srs;
		}
		return srs; 
	 },
	 
	 getEPSGByFid: function(json, fid) {
		 var srs = null;
		 
		 if (json.featureMember.length > 1) {
			 $.each(json.featureMember, function(idx, layer){
				 for (name in layer) {
					 feat = layer[name];
					 
					 if (feat.fid === fid) {
						srs = featureInfoResults.parseSrsFromFeature(feat);
						return false; 
					}					 
				 }	 
				 
			});
		 }
		 else 
		 {
			 $.each(json.featureMember, function(idx, feat){
				 
				 if (feat.fid === fid) {
					srs = featureInfoResults.parseSrsFromFeature(feat);
					return false; 
				}
			 });
		 }
		 
		return srs;
	 },
	 
	 closeDialog: function() {
		 if (!Utils.isNullOrUndefined(this.infoDialog)) {
			 this.infoDialog.dialog("close");
		 }
	 },
	 
	 /**
	  * Shows the WMS GetFeatureInfo Dialog.
	  * 
	  * @param response
	  * the WMS GetFeatureInfo response from the server in JSON format.
	  * Currently only Geoserver is tested.
	  */
	 showWMSGetFeatureInfoDialog: function(response) {
	 	
		 /*
		  * If a dialog is already open, get its position.
		  * In this way, when we open another dialog, we can put it in the same position of the old one.
		  */
		 var dialogOffset = null;
		 if (!Utils.isNullOrUndefined(this.infoDialog)) {
			 dialogOffset = this.infoDialog.closest('.ui-dialog').offset();
			 //alert("Top: " + dialogOffset.top + " Left : " + dialogOffset.left);
		 } 
		 
		this.closeDialog();
		this.init();
		
		 // Create container info response
	 	var infoDiv = $("<div>").attr({"class": "info-container"});
	 	
	 	/*
	 	 * Check that the response contains features
	 	 */
	 	if (response.features && response.features.length) {
	 		var jsonResponse = $.xml2json(response.text);
	 		
	 		$.each(response.features, function(index, feature){
	 			//Add Epsg to feature
	 			var fid = feature.fid;
	 			feature.forcedEpsg = featureInfoResults.getEPSGByFid(jsonResponse, fid);
	 			
	 			var featInfo = featureInfoResults.buildFeatureInfoDiv(feature);
	 			infoDiv.append(featInfo);
	 		});
	 	}
	 	else {
	 		/*
	 		 * Error. No feature returned or server error (eg. layer not queryable).
	 		 */
	 		return;
	 	}
	 	
	 	
	 	// Setting Dialog button 
	 	var buttons = {};
	 	buttons[LocaleManager.getKey("General_Close")] = function() {
	 		$(this).dialog("close");
	 	};
	 	
	 	var dialogOptions = {
			width : 'auto',
			height : 'auto',
			resizable: false,
			minWidth: 200,
			modal: false,
			closeFn: function(event, ui) {
	 			if (featureInfoResults.initialized) {
	 				featureInfoResults.vLayer.removeAllFeatures();
	 			}
	//		 			map.removeLayer(featureInfoResults.wLayer);
	//		 			featureInfoResults.wLayer = null;
	 			
	 			featureInfoResults.infoDialog = null;
			}
		};
	 	
	 	/*
 		 * If a dialog was already open, use its old position
		 */
	 	if (!Utils.isNullOrUndefined(dialogOffset)) {
	 		dialogOptions["position"] = [dialogOffset.left, dialogOffset.top];
	 	}
	 	
	 	// Building the Dialog
	 	this.infoDialog = DialogUtils.createDialog(LocaleManager.getKey("GetFeature_Info_Dialog_Title"), buttons, dialogOptions, infoDiv);
	 	
	 	this.infoDialog.dialog("open");
	 },
	 
	 getGidFromFid: function(fid) {
		 var splits = fid.split(".");
		 return splits[splits.length - 1];
	 },
	 
	 buildFeatureInfoDiv: function(feature) {
			var featDiv = $("<div>").attr({"class": "info-feat-cont"});
			
			var featureHeader = $("<div>").attr({"class": "info-feat-header"});
			
			//Show the title of the layer + the GID.
			var selectedLayer = selectedLayerTree.getSelectedLayer();
			var layerTitle = selectedLayer.data("title");
			var layerId = selectedLayer.data("id");
			var layerConfig = catalog.getLayerConfigById(layerId);
			var attrMapping = {};
			try{
				attrMapping = JSON.parse(layerConfig.getOpenLayersOptions().attrMapping);
			}catch(e){
				console.error(e);
			}
			var identifier = "";
			
			var attributeNameForInfo = layerConfig.getAttributeNameForInfo();
			if (!Utils.isNullOrUndefined(attributeNameForInfo)) {
				
				//Check if the property exists
				if (feature.attributes.hasOwnProperty(attributeNameForInfo)) {
					identifier = "- " + feature.attributes[attributeNameForInfo];
				}
				else {
					var gid = this.getGidFromFid(feature.fid);
					identifier = "#" + gid;
				}
			}
			else {
				//Not specified. 
				// using GID if possible (this is ok for WMS GFI)
				if (!Utils.isNullOrUndefined(feature.fid)) {
					var gid = this.getGidFromFid(feature.fid);
					identifier = "#" + gid;
				}
//				//otherwise using ID if possible (es KML)
//				else if (!Utils.isNullOrUndefined(feature.id)) {
//					identifier = "#" + id;
//				}
				//Otherwise the identifier stays empty
			}
			
			var txt = layerTitle + " " + identifier;
			
			var headerText = $("<div>").attr({"class": "info-header-text"}).text(txt);
			
			var headerIcon = $("<div>").attr({"class": "info-icon-toggle-view"}).append(
							$("<i>").attr({"class": "fa fa-caret-right"})
						).click(function(e) {
							e.stopPropagation();
							featureInfoResults.toggleViewInfoItem($(this));
						});
			
			featureHeader.append(headerIcon, headerText);
			
			var featBody = $("<div>").attr({"class": "info-feat-body custom-hidden"});
			
			//Add geometry to the body
			featBody.data("feature", feature);

			//Check if there is the HYPERLINK field
			$.each(feature.attributes, function(key, value){
				if (key === GLOBAL_SETTINGS.featureInfoHyperlinkField) {
					/*
					 * Found.
					 */
					var hyperlinkDiv = $("<div>").addClass("info-hyperlink-container").append(
							$("<div>").text(LocaleManager.getKey("GetFeature_Info_Hyperlink_Title")), 
							$("<a>").attr(
									{"href": value,
									"target": target="_blank"
							}).text(value));

					featBody.append(hyperlinkDiv);		
					
					//break
					return false;
				}
			});
			
			$.each(feature.attributes, function(key, value){
				
				/*
				 * Skip the "hyperlink" field, as it is rendered 
				 * in a different DIV 
				 */
				if (key === GLOBAL_SETTINGS.featureInfoHyperlinkField) {
					return true;
				}
				
				var rowInfo = $("<div>").attr({"class": "info-row"});
				var iconRow = $("<div>").attr({"class": "info-icon-row"}).append(
						$("<i>").attr({"class": "fa fa-circle"})
				);
				
				var field = $("<div>").attr({"class": "info-left"}).text(function(){
					if(attrMapping.hasOwnProperty('labels') && attrMapping['labels'].hasOwnProperty(key)){
						return attrMapping['labels'][key];
					}else{
						return key;
					}				
				});
				var valueField = $("<div>").attr({"class": "info-right word-wrap"}).text(value);
				
				rowInfo.append(iconRow, field, valueField);
				featBody.append(rowInfo);
			});
			
			featDiv.append(featureHeader, featBody);
			
			return featDiv;
	},
		
	toggleViewInfoItem: function(item) {
		var obj = item.closest(".info-feat-cont").find(".info-feat-body");
		
		if(!obj.is(":visible")) {
			/*
			 * Expand
			 */
			//Show feature on the map
			var feature = obj.data("feature");
			
			//Clone the feature
			var clonedFeature = feature.clone();
			clonedFeature.forcedEpsg = feature.forcedEpsg;
			
			this.vLayer.addFeatures(clonedFeature);
			
			//Zoom to feature
			//map.zoomToExtent(this.vLayer.getDataExtent());
			
//			this.wLayer = this.createWmsLayer("areas_protegidas", "http://geo-mosef.gesp.it/geoserver/icf/wms", feature.fid);
//			map.addLayer(this.wLayer);
			
			
			$(".info-feat-body").hide();
			$(".info-icon-toggle-view i").addClass("fa-caret-right").removeClass("fa-caret-down");
			item.find("i").removeClass("fa-caret-right").addClass("fa-caret-down");
			obj.slideDown("fast");
		}
		else {
			/*
			 * Collapse
			 */
			//Remove features
			this.vLayer.removeAllFeatures();
			$(".info-icon-toggle-view i").removeClass("fa-caret-down").addClass("fa-caret-right");
			$(".info-feat-body").hide();
		}
	},
	 
	/**
	 * Utility function to parse the JSON WMSGetFeatureInfo response from the server
	 * (JSON format) It returns, for each of the layers found, the DATA structure
	 * used by the GRID component.
	 * 
	 * @param response
	 *            The WMS GetFeatureInfo response from the server in JSON format
	 * @returns {} associative array containing, for each of the found layers, the
	 *          DATA structure used by the GRID component.
	 */
	parseGridDataFromResponse: function(response) {

		var rows = new Array();
		var jsonObject = $.parseJSON(response.text);

		var layers = {};

		$.each(jsonObject.features, function(k, v) {
			var feature = v;
			var layerName = v.id;

			var propertyLen = 0;
			var properties = feature.properties;

			$.each(properties, function(k, v) {
				propertyLen++;
				var prop_i = {
					cell : [ k, v ]
				};
				rows.push(prop_i);
			});

			var data = {
				total : propertyLen,
				page : 1,
				rows : rows
			};

			layers[layerName] = data;

		});
		return layers;
	},
	
	/**
	  * Shows the KML FeatureInfo Dialog.
	  * 
	  * @param kml
	  */
	 showKMLGetFeatureInfoDialog: function(kml) {
	 	
		 this.closeDialog();
		 
		 this.init();
	 	
		 // Create container info response
	 	var infoDiv = $("<div>").attr({"class": "info-container"});
	 	
	 	var featInfo = featureInfoResults.buildFeatureInfoDiv(kml.feature);
		infoDiv.append(featInfo);
	 		
	 	// Setting Dialog button 
	 	var buttons = {};
	 	buttons[LocaleManager.getKey("General_Close")] = function() {
	 		$(this).dialog("close");
	 		//Unselects the (selected) feature
	 		controls.KMLFeatureInfo.unselectAll();
	 	};
	 	
	 	// Building the Dialog
	 	this.infoDialog = DialogUtils.createDialog(LocaleManager.getKey("GetFeature_Info_Dialog_Title"), buttons, {
			width : 'auto',
			height : 'auto',
			resizable: false,
			minWidth: 200,
			modal: false,
			closeFn: function(event, ui) {
	 			featureInfoResults.infoDialog = null;
			},
			
		}, infoDiv);
	 	
	 	this.infoDialogDiv.dialog("open");
	 }
 };