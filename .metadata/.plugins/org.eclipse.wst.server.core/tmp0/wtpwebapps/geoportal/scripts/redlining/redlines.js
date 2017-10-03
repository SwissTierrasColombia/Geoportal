

var redlines = {
	vLayer: null,
	panel: null,

	/** *************
	 *  Init redlines
	 *  *************/
	init: function() {
		if(this.panel == null)
			this.panel = $("#advance-redlines-panel");		
			
		if (this.vLayer == null) {
			// Inizializza il Vector layer di openlayer
			this.initLayer();

			// Get redlines from DB
			this.requests.getData(false);
		} else {
			redlines.openPanel();
			this.vLayer.setVisibility(true);
			//map.addLayer(this.vLayer);
			//this.reloadData(false);
		}
	},
	
	/** ****************************************
	 *  Enable/Disable redlines
	 *  Init vector layer and open manager panel
	 *  *****************************************/
	toggle: function(button) {	
		if(!button.hasClass("btn-active")) {
			this.activate(button);
		}
		else {
			if(this.panel != null) {
				if(!this.panel.is(":visible"))
					this.openPanel();
				else
					this.deactivate(button);
			}
		}
	},
	
	activate: function(button) {
		button.addClass("btn-active");
		this.init();		
	},
	
	deactivate: function(button) {
		button.removeClass("btn-active");
		this.closePanel();
		this.cleanControls();
	},

	/** ******************************************
	 *  Remove vector features from redlines layer
	 *  ******************************************/
	remove: function(clean) {
		if (this.vLayer != null) {
			if(clean)
				this.vLayer.removeAllFeatures();
			else
				this.vLayer.setVisibility(false);
				//map.removeLayer(this.vLayer);
		}
	},
	
	/** ***********************
	 *  Activate select control
	 *  ***********************/
	selectFeature: function(controlBtn) {
		if(controlBtn.hasClass("btn-active")) {
			controls.redlines.deactivate(controlBtn);
			return false;
		}
		
		// Activate select feature controls
		controls.redlines.activate(controlBtn);
	},
	
	/** *************************************************
	 *  Modifiy selected feature from vector layer
	 *  If no feature is selected it lets user select one
	 *  Activate modify control
	 *  *************************************************/
	modifyFeature: function(controlBtn) {
		if(controlBtn.hasClass("btn-active")) {
			controls.redlines.deactivate(controlBtn);
			return false;
		}
		
		if(redlines.vLayer.selectedFeatures.length > 0) {
			// Activate modify feature control
			controls.redlines.activate(controlBtn);
			// With following method it enables modify control on last selected feature
			// and unselects the others one 
			$.each(redlines.vLayer.selectedFeatures, function(index, feature){
				controls.redlines.instance.modify.selectFeature(feature);
			});		
		}
		else {
			// If there is no selected feature it enable modify control 
			// and wait for click on vector feature 
			controls.redlines.activate(controlBtn);
		}
	},
	
	/** ******************************************
	 *  Toggle buttons on select/unselect features
	 *  ******************************************/
	toggleButtons: function(button, action) {
		if(button == "delete")
			this.buttons.remove.toggle(action);
		if(button == "label")
			this.buttons.label.toggle(action);
		
		return;
	},
		
	/** ******************************************
	 *  Delete selected features from vector layer
	 *  ******************************************/
	deleteFeature: function(controlBtn) {
		if(controlBtn.hasClass("btn-disable"))
			return false;
		
		if(redlines.vLayer.selectedFeatures.length > 0) {
			var features = [];
			// Add selected features to features list
			$.each(redlines.vLayer.selectedFeatures, function(index, feature){
				features.push(feature);
			});
			// Remove features in "features list"
			this.vLayer.removeFeatures(features);
			
			// Disable toggle buttons (insert label and delete feature)
			this.toggleButtons("disable");
		}
		else {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Warning_Title"), 
				LocaleManager.getKey("AlertDialog_Warning_Edit_FeatureNotSelected")
			);
		}	
	},
	
	/** *********************************
	 * 	Add a label to a selected feature
	 *  *********************************/
	addLabel: function() {
		// Hide input label box 
		if(redlines.vLayer.selectedFeatures.length > 0) {
			// Is possible insert a label at a time so it retrieve first feature selected
			var selected = redlines.vLayer.selectedFeatures[0];
			// Get selected feature centroid
			var centroid = selected.geometry.getCentroid();
			
			// Get position for input label element
			// Position is calculated by selected feature coordinates
			var pos = Utils.getPixelFromMapCoords(centroid);
			
			// Show and locate input label box at pixel returned
			$("#input-label-panel").css({top: pos.y + 15, left: pos.x + 15}).show();		
		}
	},
	
	/** **************************************
	 *	Save input label into feature selected
	 *  **************************************/
	saveLabel: function() {
		var label = $("#input-label").val();
		Utils.removeLabelInput();

		var labelBreak = Utils.formatStringWithLineBreaks(10, label);
		
		// Add label to the selected vector feature
		if(redlines.vLayer.selectedFeatures.length > 0) {
			var selected = redlines.vLayer.selectedFeatures[0];
			
			$.each(redlines.vLayer.features, function(index, feature){
				if(selected.id == feature.id) {
					
					feature.attributes.label = labelBreak;
					feature.attributes.show = "yes";
					
					redlines.vLayer.redraw();
					controls.redlines.instance.select.unselectAll();
					
					return false;
				}
			});
		}
	},

	/** *****************
	  * Init vector layer
	  * *****************/ 
	initLayer: function() {
		if (this.vLayer == null) {
			this.vLayer = new OpenLayers.Layer.Vector("redlines",{
				displayInLayerSwitcher : false,
//				styleMap: testStyleMap,
				styleMap: StyleManager.getRedlineStyle(),
				projection : new OpenLayers.Projection(map.getProjection()),
				eventListeners : {
					'beforefeatureadded' : function(feature) {
						if(feature.feature.attributes.hasOwnProperty("epsg"))
							srid = feature.feature.attributes.epsg;
						else
							srid = feature.feature.layer.projection.projCode;
						feature.feature.geometry.transform(new OpenLayers.Projection(srid),new OpenLayers.Projection(map.getProjection()));
					}
				}
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
	
	zoomToLayer: function() {
		/*
		 * If layer is not null & it contains at least 1 feature, zoom.
		 * Otherwise, dont do anything.
		 */
		if(this.vLayer != null &&
				!Utils.isNullOrUndefined(this.vLayer.features) && this.vLayer.features.length > 0) {
			map.zoomToExtent(this.vLayer.getDataExtent());
		}		
		
	},

	/** ********************
	 *  Reload redlines data 
	 *  Requests Data DB
	 *  ********************/  
	reloadData: function(autoZoom) {
		// with true parameter passed to remove method 
		// it cleans all features in the layer before it reloads data
		this.remove(true);
		this.requests.getData(autoZoom);		
	},

	/** *****************
	 *  Redlines Requests
	 *  *****************/   
	requests: {
		/**
		 * Get redlines list from DB
		 */
		getData: function(autoZoom) {			
			Utils.ajaxCall("./redlining", "GET", "json", {
				oper : "get",
				type : "r"
			}, function(response) {
				if (response.success) {
					if (response.result.length > 0) {
						var features = Utils.getFeaturesFromList(response.result, null, ["epsg", "label", "show"]);
						if (features.length > 0) {
							// Add redline feature to vector layer
							redlines.vLayer.addFeatures(features);
							
							/*
							 * Labels get automatically drawn because there are the "label" and "show" attributes
							 * passed back from the server.
							 */
							
							if(autoZoom) {
								// If autoZoom is true fit map to added features bound
								map.zoomToExtent(redlines.vLayer.getDataExtent());
							}					
						}		
					}		
				} else {
					AlertDialog.createOkDefaultDialog(
						LocaleManager.getKey("AlertDialog_Error_Title"), 
						response.msg
					);
				}
				
				// Open redlines manager panel
				redlines.openPanel();				
			});
		},

		/**
		 * Save redlines to db
		 */		
		save: function(features) {			
			Utils.ajaxCall("./redlining", "POST", "json",  {
				oper : "save",
				type : "r",
				list : JSON.stringify(features)
			}, function(response) {
				if (response.success) {
					// Reload redlines features
					redlines.reloadData(false);
				} else {
					AlertDialog.createOkDefaultDialog(
						LocaleManager.getKey("AlertDialog_Error_Title"), 
						response.msg
					);
				}
			});
		},
		
		downloadAsKML: function() {
			
			/*
			 * If there are no feature, warn the user and abort
			 */
			if (Utils.isNullOrUndefined(redlines.vLayer) || 
					redlines.vLayer.features.length < 1) {
				
				AlertDialog.createOkDefaultDialog(
						LocaleManager.getKey("Redline_Download_Panel_Confirm_Title"), 
						LocaleManager.getKey("Redline_Download_NoFeatures")
				);
				return;
				
				
			}
			
		    var format = new OpenLayers.Format.KML({
//		        'maxDepth':10,
		    	"foldersName": "Dibujos",
		        'extractStyles': false,
		        'internalProjection': map.getProjectionObject(),
		        'externalProjection': new OpenLayers.Projection("EPSG:4326")
		    });

		    var kmlContent = format.write(redlines.vLayer.features);
			new DataDownloader().downloadText({
				fileName: "dibujos.kml",
				content: kmlContent
			});
			
		},
	},
	
	/** ***************************
	 *  Open redlines manager panel
	 *  ***************************/
	openPanel: function() {
		$("#redline-typegeoms div").removeClass("active");
		if (controls.redlines.instance == null)
			controls.redlines.init();
		else {
			controls.redlines.deactivate();
		}

		this.panel.show();
		
		return true;
	},
	
	/** ***************************
	 *  Close redline manager panel
	 *  ***************************/
	closePanel: function() {	
		// Close tools panel
		if(this.panel != null) {
			this.panel.hide();
		}
		
		// Remove text area label 
		Utils.removeLabelInput();
		
		// Deactivate button
		$("#redline-typegeoms div").removeClass("selected");	
		controls.redlines.deactivate();

	},
	
	cleanControls: function() {
		// Deactivate button
		$("#redline-typegeoms div").removeClass("selected");	
		// Remove all features relines layer
		this.remove();
		
		// Deactivate controls
		controls.redlines.deactivate();
	},

	/** *******************************************
	 *  Enable selected type of geometry for insert 
	 *  *******************************************/
	selectGeomType: function(controlBtn) {
		if(controlBtn.hasClass("btn-active")) {
			controls.redlines.deactivate(controlBtn);
			return false;
		}
		// Attiva il controllo di inserimento per il tipo di geometria
		// selezionata
		controls.redlines.activate(controlBtn);
	},

	/** *************************************************
	 *  Save all features added to redlinhes vector layer 
	 *  *************************************************/
	saveGeoms : function() {
		// Force the unselect method on modify feature (if it exists)
//		if(redlines.vLayer.selectedFeatures > 0) {
//			var selected = redlines.vLayer.selectedFeatures[0];
//			controls.redlines.instance.modify.unselectFeature(selected);
//		}
		controls.redlines.deactivate();
		
		var listGeoms = [];

		if (this.vLayer != null) {
			var features = this.vLayer.features;
			$.each(features,function(index, feature) {
				var feat = new Object();
				var cloneFeatGeom = feature.geometry.clone();
				// Set feat object for db 
				feat.geometryType = Utils.getGeomType(feature.geometry.CLASS_NAME.split(".")[2]);
				feat.wktGeometry = Utils.getGeomWKT(cloneFeatGeom.transform(
					new OpenLayers.Projection(feature.layer.projection.projCode),
					new OpenLayers.Projection(Utils.getDefaultDbEPSG())
				));
				if(feature.attributes.hasOwnProperty("label") && feature.attributes.label != "")
					feat.label = Utils.getFeatureLabel(feature);

				listGeoms.push(feat);
			});
		}
		
		redlines.requests.save(listGeoms);
	},
	
	downloadGeoms: function() {
		AlertDialog.createConfirmDefaultDialog(
			LocaleManager.getKey("Redline_Download_Panel_Confirm_Title"),
			LocaleManager.getKey("Redline_Download_Panel_Confirm_Message"),
			function() {
				redlines.requests.downloadAsKML();		
			}
		);	
	},
	
	/** **********************************************
	 *  Redlines buttons depending on selected feature
	 *  
	 *  - remove feature button
	 *  - add label feature button
	 *  **********************************************/
	buttons: {
		remove: {
			toggle: function(action) {
				switch (action) {
				case "enable":
					// Remove disable class on button
					$("#redline-ctrl-delete").removeClass("btn-disable");
					break;

				case "disable":
					// Add disable class on button
					$("#redline-ctrl-delete").addClass("btn-disable");
					break;
				}
			}
		},
		
		label: {
			toggle: function(action) {
				switch (action) {
				case "enable":
					// Remove disable class on button
					$("#redline-ctrl-label").removeClass("btn-disable");
					break;
					
				case "disable":
					// Add disable class on button
					$("#redline-ctrl-label").addClass("btn-disable");
					
					// Remove input label box
					Utils.removeLabelInput();
					break;
				}
			}
		}
	}
	
};