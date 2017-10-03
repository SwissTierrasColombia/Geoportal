var coordinates = {
	active : false,
	panel: null,
	
	init: function() {
		
		if (this.vLayer == null) {
			// Inizializza il Vector layer di openlayer
			// Serve per mostrare il punto in mappa 
			this.initLayer();
		}
		
		if(this.panel == null) {	
			this.panel = $("#advance-goto-panel");
			this.button = $("#gis_goToCoordinatesBtn");
			
			this.inputX = $("#coords-lon");
			this.inputY = $("#coords-lat");
			
			this.inputXLabel = $("#coords-lon-label");
			this.inputYLabel = $("#coords-lat-label");
			
			this.selectEpsg = $("#coords-epsg");
			
			//Register change functions
			$("#coords-epsg").change(function(){
				var selectedValue = $("#coords-epsg option:selected").val();
				
				if ("EPSG:32616" === selectedValue || "EPSG:32617" === selectedValue) {
					//X,Y
					coordinates.inputXLabel.data("locale_key", "GoTo_Coords_X");
					coordinates.inputYLabel.data("locale_key", "GoTo_Coords_Y");
				}
				else {
					//Lon, Lat
					coordinates.inputXLabel.data("locale_key", "GoTo_Coords_Lon");
					coordinates.inputYLabel.data("locale_key", "GoTo_Coords_Lat");
				}
				
				//Clean
				coordinates.inputX.val("");
				coordinates.inputY.val("");
				
				//Refresh locale
				LocaleManager.refreshLocalizedElement(coordinates.inputXLabel);
				LocaleManager.refreshLocalizedElement(coordinates.inputYLabel);
			});
		}
		
		this.openPanel();
	},
	
	initLayer: function() {
		if (this.vLayer == null) {
			this.vLayer = new OpenLayers.Layer.Vector("coordinates_pointer",{
				displayInLayerSwitcher : false,
				projection : new OpenLayers.Projection(map.getProjection()),
				print: false
			});

			/*
			 * This layer must always stay on top
			 * (see map.events.register("addlayer", map, function(obj))
			 */
			this.vLayer.alwaysOnTop = true;
			map.addLayer(this.vLayer);
		}
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
		this.resetPanel();
		this.active = false;
	},
	
	/** ***************************
	 *  Open Go To coordinates panel
	 *  ***************************/
	openPanel: function() {
		this.panel.show();
	},
	
	/** *****************************
	 *  Close Go To coordinates panel
	 *  *****************************/
	closePanel: function() {	
		
		//Empty layer
		this.vLayer.removeAllFeatures();
		
		// Close tools panel
		if(this.panel != null) {
			this.panel.hide();
		}
	},
	
	resetPanel: function() {
		Utils.cleanForm(this.panel);
	},
	
	goToCoordinates: function() {
		this.closePanel();
		
		var coords = new Object();
		coords.epsg = this.selectEpsg.val();
		coords.x = this.inputX.val();
		coords.y = this.inputY.val();
		
		if (("" == coords.x.trim()) || ("" == coords.y.trim())) {
			//No coordinates selected
			return;
		}
		
		var latlon = new OpenLayers.LonLat(coords.x, coords.y);
		
		var latlonTransformed = latlon.clone().transform(new OpenLayers.Projection(coords.epsg), map.getProjection());
		
		map.setCenter(latlonTransformed, 12);
		
		var geom = new OpenLayers.Geometry.Point(latlonTransformed.lon, latlonTransformed.lat);
		var feature = new OpenLayers.Feature.Vector(geom, {}, {
		    externalGraphic: './images/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  
		});
		   
		this.vLayer.addFeatures(feature);
	}
};