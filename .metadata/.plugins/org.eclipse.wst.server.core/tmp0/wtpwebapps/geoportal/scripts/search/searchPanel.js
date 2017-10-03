var searchP = {
	panel: null,
	button: null,
	
	menuSearchTab: null,
	menuTocTab: null,
	
	//This is used to display the bounding box when the user performs the search
	vLayer: null,
	bbox: null,
	
	init: function() {
		if(this.panel == null) {
			this.panel = $("#advance-searchwfs-panel");
			
			/**
			 *  Advance searchwfs form
			 */
			
			$("#advance-searchwfs-confirm").button({
				label: LocaleManager.getKey("Advanced_Panel_Search_Confirm")
			}).click(function() {
				searchP.requests.submit();
			});
			
			$("#advance-searchwfs-clean").button({
				label: LocaleManager.getKey("General_Clean")
			}).click(function() {
				searchP.cleanForm();
			});
			
			$("#search-bbox-deactive, #search-bbox-active").change(function(){
				searchP.bboxFilter($(this));	
				return;
			});
			
			$("#gis_FEAT_KEYWORD").keyup(function(e){
				if(e.keyCode == 13) {
					searchP.requests.submit();
				}
			});
			
			$("#search_exact").keyup(function(e){
				if(e.keyCode == 13) {
					searchP.requests.submit();
				}
			});
			
			$("#search_all_layers").keyup(function(e){
				if(e.keyCode == 13) {
					searchP.requests.submit();
				}
			});
		}
		
		if(this.button == null) {
			this.button = $("#gis_FEAT");
		}
		
		if (this.menuSearchTab == null) {
			this.menuSearchTab = $("#menu-switcher-search");
			this.menuTocTab = $("#menu-switcher-toc");
		}
		
	},

	/** ****************************************
	 *  Enable/Disable search panel
	 *  *****************************************/
	toggle: function() {
		if(!this.button.hasClass("btn-active")) {
			this.activate();
		}
		else {
			
			/*
			 * If I want to deactivate but the featureGridPanel is open,
			 * leave it open!
			 */
			this.deactivateGeneral(true);
		}
	},
	
	activate: function() {
		this.button.addClass("btn-active");
		
		this.open();
	},
	
	deactivateGeneral: function(leaveFeatureGridPanelOpen) {
		this.button.removeClass("btn-active");
		this.cleanForm();
		this.close();
		
		if (!leaveFeatureGridPanelOpen) {
			//Chiudi il pannello di dettaglio ricerca
			if (!Utils.isNullOrUndefined(featureGridPanel)) {
				featureGridPanel.closePanel();
			}	
		}
	},
	
	deactivate: function() {
		this.deactivateGeneral(false);
	},
	
	open: function() {
		this.cleanForm();
		this.panel.show();
			
	},
	
	close: function() {
		if(this.panel != null)
			this.panel.hide();
		
		if(searchP.vLayer != null)
			searchP.vLayer.removeAllFeatures();
	},
	
	cleanForm: function() {
		$("#gis_FEAT_KEYWORD").val("");
		$("#search_exact").prop("checked", false);
		$("#search-bbox-deactive").prop("checked", true);
		$("#search-bbox-active").prop("checked", false);
		$("#search_all_layers").prop("checked", false);
		$("#search-bbox-selected-text").text("");
		
		// Force the deactivation of bbox
		this.bboxFilter($("#search-bbox-deactive"));
	},
	
	bboxFilter: function(input) {
		if(input.is(":checked")) {
			if(input.val() == "bbox-deactive") {
				// Deactivate control
				if(this.vLayer != null && controls.search.instance != null) {
					// Remove bbox from vector layer
					this.vLayer.removeAllFeatures();
					
					// Deactivate control
					controls.search.deactivate();
					
					// Clean text check bbox selected
					$("#search-bbox-selected-text").text("");				
				}
				
				$("#search-bbox-panel").hide();
				$("#search-bbox-toggle-button").addClass("custom-hidden");
			}
			if(input.val() == "bbox-active")
				$("#search-bbox-panel").show();
		}
		
		return;
	},
	
	setBboxSelectedText: function() {
		$("#search-bbox-selected-text").text(LocaleManager.getKey("Advanced_Panel_Search_SearchBboxSelectedText"));
		$("#search-bbox-toggle-button").removeClass("custom-hidden");
	},
	
	toggleVisibilityBbox: function() {
		if(this.vLayer != null) {
			this.vLayer.setVisibility(!this.vLayer.getVisibility());
			
			//new visibility
			if(this.vLayer.getVisibility()) {
				//Now it is shown
				$("#search-bbox-toggle-button i").removeClass("fa-eye-slash").addClass("fa-eye");
				$("#search-bbox-toggle-button").data("locale_key", "Advanced_Panel_Search_SearchBboxHideButton");
			}
			else {
				//Now it is hidden
				$("#search-bbox-toggle-button i").removeClass("fa-eye").addClass("fa-eye-slash");
				$("#search-bbox-toggle-button").data("locale_key", "Advanced_Panel_Search_SearchBboxShowButton");
			}
			LocaleManager.refreshLocalizedElement($("#search-bbox-toggle-button"));
		}
	},
	
	getValuesForm: function() {
		var values = new Object();
			values.keyword = $("#gis_FEAT_KEYWORD").val().trim();
			values.exactmatch = $("#search_exact").is(":checked");
			values.searchAllLayers = $("#search_all_layers").is(":checked");
			values.bbox = null;
			if(this.vLayer != null && this.vLayer.features.length > 0) {
				values.bbox = this.vLayer.features[0].geometry.getBounds();
			}
			
		return values;
	},
	
	menuSearchShowAndSwitch: function() {
		this.menuSearchTab.show();
		LayerMenu.switchTabMenu(this.menuSearchTab);
	},
	
	menuSearchHide: function() {
		LayerMenu.switchTabMenu(this.menuTocTab);
		this.menuSearchTab.hide();
	},
	
	requests: {
		submit: function() {
			//General search  
			var values = searchP.getValuesForm();
			
			if (Utils.isNotEmpty(values.keyword)) {
				var search = new Search();
				
				// Get values from Search Panel
				// - Keyword
				// - Search layer: all layer or selected layer
				// - search type (excat value or not)
				// - Restricted search extent: BBOX geometry from map
				
				// searchType parameter not used at the moment
				search.searchLayers(values.keyword, {
					//maxFeatures : 100,
					matchCase: false,
					isExact: values.exactmatch,
					searchAllLayers : values.searchAllLayers,
					//searchType: searchType,
					bboxFilter : values.bbox,
					crs : map.getProjection()
				});
			}
			else {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Warning_Title"), 
					LocaleManager.getKey("AlertDialog_Warning_SearchNoKeyword")
				);
			}
		}
	},
	
	/** *****************
	  * Init vector layer
	  * *****************/ 
	initLayer: function() {
		if (this.vLayer == null) {
			this.vLayer = new OpenLayers.Layer.Vector("bboxsearch",{
				displayInLayerSwitcher : false,
				//styleMap: testStyleMap,
				styleMap: StyleManager.getRedlineStyle(),
				projection : new OpenLayers.Projection(map.getProjection()),
				eventListeners : {
					'beforefeatureadded' : function(feature) {
						searchP.vLayer.removeAllFeatures();
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
	}
};