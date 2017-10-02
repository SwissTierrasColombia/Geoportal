var controls = {
	/*
	 *  CONTROLLO FEATURE INFO SUL LAYER
	 */
	WMSGetFeatureInfo: {
		isControl: true,
		isToggle: true,
		instance: null,
		button: null,
		buttonId: "gis_getFeatureInfoBtn",	
		
		// Init del controllo
		// - url: url del wms
		// - layer di openlayer
		init: function(wmsLayers){
			this.button = $("#"+this.buttonId);
			/**
			 * Attenzione !!!! Ci sono molti formati diversi con cui
			 * può essere ritornata la GetFeatureInfo...
			 * 
			 * [text/plain, application/vnd.ogc.gml,
			 * application/vnd.ogc.gml/3.1.1, (GML3)
			 * application/vnd.ogc.gml (GML2)
			 * text/html,
			 * application/json
			 * 
			 * A seconda di cio che si usa --> va settato anche il
			 * formato di OpenLayers per la lettura della risposta.
			 * 
			 * Vedi http://docs.geoserver.org/latest/en/user/services/wms/reference.html
			 */
			
			// Recupera il layer selezionato
/*			var id = $(".menu_item_content_list li.selected").data("id");
			var title = $(".menu_item_content_list li.selected").text();
			var layerConfig = catalog.getLayerConfigById(id);*/
			
			var qLayer = "";
/*			if (layerConfig.getSource() === "wms_multi_layer") {
				qLayer = layerConfig.getNameByTitle(title);	
			}*/	
			
			this.instance = new OpenLayers.Control.WMSGetFeatureInfo({
				//url : url,
				//layerUrls: urls, //Optianl list of URL's
				title : 'Identify features by clicking',
				drillDown: true,
				layers : wmsLayers,
				queryVisible : true,
				//infoFormat : 'application/json',
				//format : new OpenLayers.Format.JSON,
				infoFormat : "application/vnd.ogc.gml",
				format : new OpenLayers.Format.GML.v2(),
				eventListeners : {
					getfeatureinfo : function(event) {
						// showPopup(event);
						featureInfoResults.showWMSGetFeatureInfoDialog(event);
					}
				}
			});
			
			// Aggiunge l'istanza del controllo alla mappa
			map.addControl(this.instance);
		},
		
		// Metodo di attivazione controllo
		activate: function(wmsLayers) {	
			// Deattiva tutti i controlli in toggle
			controls.deactivate();
			
			this.init(wmsLayers);
			this.instance.activate();
			
			// Attiva il tasto del controllo
			controls.buttons.activate(this.button);
		},
		
		// Metodo di deattivazione (distruzione) controllo
		deactivate: function() {
			// Deattiva il tasto
			controls.buttons.deactivate(this.button);
			
			// - Deattiva il controllo 
			// - Lo rimuove dalla mappa 
			// - Lo distrugge 
			// - Imposta l'instance a "null"
			if(this.instance != null) {
				this.instance.deactivate();
				map.removeControl(this.instance);
				this.instance.destroy();
				this.instance = null;
			}
		}
	},
	
	KMLFeatureInfo: {
		isControl: true,
		isToggle: true,
		instance: null,
		button: null,
		buttonId: "gis_getFeatureInfoBtn",
		
		unselectAll: function() {
			if (this.instance != null) {
				this.instance.unselectAll();
			}
		},
		
		// Inizializza il controllo per la selezione del KML
		init: function(kmlLayer) {	
			this.button = $("#"+this.buttonId);
			this.instance =  new OpenLayers.Control.SelectFeature(kmlLayer, {
				clickout: true, 
				toggle: true,
				multiple: false, 
				hover: false,
				box: false
			});
			
			this.instance.events.register("featurehighlighted", this.instance, function(feat) {
				featureInfoResults.showKMLGetFeatureInfoDialog(feat);
			});
			
//			this.instance.events.register("featureunhighlighted", this.instance, function(feat) {
//				featureInfoResults.showKMLGetFeatureInfoDialog(feat);
//			});
			
			// Aggiunge l'istanza del controllo alla mappa
			map.addControl(this.instance);
		},
		
		// Metodo di attivazione controllo
		activate: function(kmlLayer) {
			// Deattiva tutti i controlli in toggle
			controls.deactivate();
			
			this.init(kmlLayer);
			this.instance.activate();
			
			// Attiva il tasto del controllo
			controls.buttons.activate(this.button);
		},
		
		// Disattiva controllo
		deactivate: function() {
			// Deattiva il tasto
			controls.buttons.deactivate(this.button);
			
			// - Deattiva il controllo 
			// - Lo rimuove dalla mappa 
			// - Lo distrugge 
			// - Imposta l'instance a "null"
			if(this.instance != null) {
				this.instance.deactivate();
				map.removeControl(this.instance);
				this.instance.destroy();
				this.instance = null;
			}
		}
	},
	
	
	redlines: {
		isControl: true,
		isToggle: true,
		instance: null,
		
		// Inizializza il controllo inserimento redline
		init: function() {	
			// Inizializza il controllo per l'inserimento
			this.instance = {
				pointDraw: new OpenLayers.Control.DrawFeature(redlines.vLayer,OpenLayers.Handler.Point),
				lineDraw: new OpenLayers.Control.DrawFeature(redlines.vLayer,OpenLayers.Handler.Path),
				polygonDraw: new OpenLayers.Control.DrawFeature(redlines.vLayer,OpenLayers.Handler.Polygon),
				select: new OpenLayers.Control.SelectFeature(redlines.vLayer, {
					clickout: true, toggle: true,
					multiple: true, hover: false,
					box: true
				}),
				modify: new OpenLayers.Control.ModifyFeature(redlines.vLayer)
			};
			
			// Set modify mode
			this.instance.modify.mode = OpenLayers.Control.ModifyFeature.RESHAPE |
										OpenLayers.Control.ModifyFeature.DRAG;							
			
			this.addControlsToMap();
			this.addEventCtrls();
				
			return this.instance;
		},
		
		// Associa l'evento "feature added" al controllo "draw feature redline"
		addEventCtrls: function() {
			$.each(this.instance, function(type, control){
				if(type == "pointDraw" || type == "lineDraw" || type == "polygonDraw") {
					control.events.register("featureadded", control, function() {
						//control.deactivate();
					});
				}
				if(type == "select") {
					control.events.register("featurehighlighted", control, function() {
						// Attiva i tasti di modifica ed eliminazione
						if(redlines.vLayer.selectedFeatures.length > 1) {
							redlines.toggleButtons("delete", "enable");
							redlines.toggleButtons("label", "disable");
						}
						else if(redlines.vLayer.selectedFeatures.length == 1) {
							redlines.toggleButtons("delete", "enable");
							redlines.toggleButtons("label", "enable");							
						}
						else {
							redlines.toggleButtons("delete", "disable");
							redlines.toggleButtons("label", "disable");							
						}
					});
					control.events.register("featureunhighlighted", control, function() {
						// Attiva i tasti di modifica ed eliminazione
						var selected = Utils.getSelectedFeatures(redlines.vLayer.selectedFeatures);
						if(selected > 1) {
							redlines.toggleButtons("delete", "enable");
						}
						else if(selected == 1) {
							redlines.toggleButtons("delete", "enable");
							redlines.toggleButtons("label", "enable");	
						}
						else {
							redlines.toggleButtons("delete", "disable");
							redlines.toggleButtons("label", "disable");							
						}
					});	
				}
			});
			
			// The afterfeaturemodify event has to be register on vector layer linked to modify control
			// and not directly on control
			redlines.vLayer.events.on({
				"beforefeaturemodified": function() {
					redlines.buttons.label.toggle("enable");
				},
				"afterfeaturemodified": function() {
					redlines.buttons.label.toggle("disable");
				}
			});
		},
		
		// Aggiunge i controlli per aggiungere le redlines alla mappa
		addControlsToMap: function() {
			if(this.instance != null) {
				$.each(this.instance, function(key, control){
					map.addControl(control);
				});
			}
		},
		
		// Activate control depending on selected action
		// - Draw Point
		// - Draw Line
		// - Draw Polygon
		// - Select Feature
		// - Modify feature geaometry
		activate: function(controlBtn) {
			// Define wich control action to activate
			var action = controlBtn.data("action");
			
			// Prevent the visw of input label feature
			Utils.removeLabelInput();
			
			if(this.instance == null)
				this.init();
			
			controls.deactivate();
			
			controls.buttons.activate(controlBtn);
			this.instance[action].activate();
		},
		
		// Deattiva il controllo gestione redline
		deactivate: function(controlBtn) {
			if(controlBtn) {
				var action = controlBtn.data("action");
				this.instance[action].deactivate();
				
				controls.buttons.deactivate(controlBtn);
				redlines.toggleButtons("delete", "disable");
				redlines.toggleButtons("label", "disable");
				
				// Due to Openlyaer bug: 
				// Disable event on selectFeature control does not unselect features 
				// Need to force it
				this.instance["select"].unselectAll();
				
				return;
			}
			
			// Disable all controls
			controls.buttons.deactivate();
			if(this.instance != null) {
				$.each(this.instance, function(key, control){
					control.deactivate();
				});
				
				// Due to Openlyaer bug: 
				// Disable event on selectFeature control does not unselect features
				// Need to force it
				this.instance["select"].unselectAll();
			}
			
			redlines.toggleButtons("delete", "disable");
			redlines.toggleButtons("label", "disable");
		}
	},
	
	alerts: {
		isControl: true,
		isToggle: true,
		instance: null,
		
		// Inizializza il controllo inserimento alerts
		init: function() {	
			this.instance = {
				pointDraw: new OpenLayers.Control.DrawFeature(alerts.vLayerEdit,OpenLayers.Handler.Point),
				lineDraw: new OpenLayers.Control.DrawFeature(alerts.vLayerEdit,OpenLayers.Handler.Path),
				polygonDraw: new OpenLayers.Control.DrawFeature(alerts.vLayerEdit,OpenLayers.Handler.Polygon),
				select: new OpenLayers.Control.SelectFeature(alerts.vLayerEdit, {
					clickout: false, toggle: false,
					multiple: false, hover: false,
					box: false
				}),
				selectmap: new OpenLayers.Control.SelectFeature(alerts.vLayer, {
					clickout: true, toggle: true,
					multiple: false, hover: false,
					box: false,
					onSelect: function(feature) {
	                    alerts.addFilterToDatagrid(feature.attributes.idAlert);
	                },
	                onUnselect: function(feature) {
	                	alerts.removeFilterFromDataGrid();
	                }
				}),
				modify: new OpenLayers.Control.ModifyFeature(alerts.vLayerEdit)
			};
			
			// Set modify mode
			this.instance.modify.mode = OpenLayers.Control.ModifyFeature.RESHAPE |
										OpenLayers.Control.ModifyFeature.DRAG;
			
			this.addControlsToMap();
			this.addEventCtrls();
				
			return this.instance;
		},
		
		// Add events control modify alerts 
		addEventCtrls: function() {		
			// Need adding featureadded event on vLyerEdit 
			alerts.vLayerEdit.events.on({
				"beforefeatureadded": function() {
					alerts.vLayerEdit.removeAllFeatures();
				}
			});
			
			this.instance.selectmap.events.register("featurehighlighted", this, function(evt) {
				// Attiva i tasti di modifica ed eliminazione
				var feature = evt.feature;
			});
		},
		
		addControlsToMap: function() {
			if(this.instance != null) {
				$.each(this.instance, function(key, control){
					map.addControl(control);
				});
			}
		},
		
		// Activate control depending on selected action
		// - Draw Point
		// - Draw Line
		// - Draw Polygon
		// - Select Feature (layer edit)
		// - Select feature on map (standard layer)
		// - Modify feature geaometry
		activate: function(controlBtn) {
			controls.deactivate();	
			
			// Define wich control action to activate
			if(controlBtn) {
				action = controlBtn.data("action");
				controls.buttons.activate(controlBtn);				
			}
			
			if(this.instance == null)
				this.init();
				
			this.instance[action].activate();
		},
		
		// Deattiva il controllo gestione alerts
		deactivate: function(controlBtn) {		
			if(controlBtn) {
				var action = controlBtn.data("action");
				this.instance[action].deactivate();
				
				controls.buttons.deactivate(controlBtn);
				
				// Due to Openlyaer bug: 
				// Disable event on selectFeature control does not unselect features 
				// Need to force it
				this.instance.selectmap.unselectAll();

				return;
			}
			
			// Disable all controls
			controls.buttons.deactivate();
			if(this.instance != null) {
				$.each(this.instance, function(key, control){
					control.deactivate();
				});			
				
				$("#alerts-update-modgeom").removeClass("btn-active");
				// If change geom function is active, button to enable/disable
				// insert new geom control has to be active
				if(!alerts.changeGeomActive)
					$("#alerts-update-modgeomtype").removeClass("btn-active");
				
				// Due to Openlyaer bug: 
				// Disable event on selectFeature control does not unselect features 
				// Need to force it
				this.instance.selectmap.unselectAll();
			}
		}
 	},
	
	catalog: {
		isControl: true,
		isToggle: true,
		
		//Instance of the control.
		//instance: true,
		instance: null,
		
		init: function() {
			if(catalogCsw.vLayer == null)
				catalogCsw.initLayer();
			
			this.instance = new OpenLayers.Control.DrawFeature(catalogCsw.vLayer, OpenLayers.Handler.RegularPolygon, {
				handlerOptions: {
					sides: 4,
					angle: 0,
					snapAngle: 90,
					irregular: true,
					fixedRadius: true			
				},
			});
			
			map.addControl(this.instance);
			this.instance.events.register("featureadded", this.instance, function(extent) {
				catalogCsw.setBboxSelectedText();
				controls.catalog.deactivate();
			});
		},
		
		activate: function() {
			if(this.instance == null) {
				//Init the control..
				this.init();
			}
			
			//Deactivate all the other controls....
			controls.deactivate();
			
			//Remove all features
			catalogCsw.vLayer.removeAllFeatures();
			
			//Activate this specific control
			this.instance.activate();
		},
		
		deactivate: function() {
			//Deactivate this control..
			if(this.instance != null) {
				this.instance.deactivate();
			}
		}	
	},
	
	search: {
		isControl: true,
		isToggle: true,
		instance: null,
		options: {
			sides: 4,
			angle: 0,
			snapAngle: 90,
			irregular: true,
			fixedRadius: true			
		},
		
		init: function() {
			if(searchP.vLayer == null)
				searchP.initLayer();
			
			this.instance = new OpenLayers.Control.DrawFeature(searchP.vLayer, OpenLayers.Handler.RegularPolygon, {
				handlerOptions: this.options
			});
			
			map.addControl(this.instance);
			this.instance.events.register("featureadded", this.instance, function(extent) {
				searchP.setBboxSelectedText();
				controls.search.deactivate();
				return;
			});
			
			return this.instance;
		},
		
		activate: function() {
			if(this.instance == null) 
				this.init();
			
			controls.deactivate();
			
			searchP.vLayer.removeAllFeatures();
			this.instance.activate();
			
			return;
		},
		
		deactivate: function() {		
			if(this.instance != null) {
				this.instance.deactivate();
			}
			
			return;
		}
	},
	
	print: {
		isControl: true,
		isToggle: true,
		instance: true,
		
		deactivate: function() {
			if(print.active) {
				print.deactivate(print.button);
			}		
			return;
		}
	},
	
	measure: {
		isControl: true,
		isToggle: true,
		instance: null,
		panelViewId: "gis_measures",

		init: function() {
			this.panelView = $("#" + this.panelViewId);
			this.instance = {				
				line: {
					buttonId: "gis_measureLineBtn",
					init: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
						persist : true,
						handlerOptions : {
							layerOptions : {
								styleMap : styleMapMeasureControls
							}
						}
					})
				},
				polygon: {
					buttonId: "gis_measureAreaBtn",
					init: new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
						persist : true,
						handlerOptions : {
							layerOptions : {
								styleMap : styleMapMeasureControls
							}
						}
					})
				}
			};
			
			$.each(this.instance, function(type, control){
				control.button = $("#"+control.buttonId);
				control.init.events.on({
					"measure" : handleMeasurements,
					"measurepartial" : handleMeasurements
				});
				map.addControl(control.init);				
			});
		},
		
		activate: function(type) {
			// Deattiva tutti i controlli in toggle
			controls.deactivate();
			
			// Attiva il controllo di misura specificato (type)
			if(this.instance == null)
				this.init();
			
			if(type) {
				// Attiva il tasto del controllo
				controls.buttons.activate(this.instance[type].button);
				this.instance[type].init.activate();
			}
			
			if(this.panelView) {
				this.panelView.empty().text(LocaleManager.getKey("Measure_Panel_Measure_Text"));
				this.panelView.show();
			}
			
			return;
		},
		
		deactivate: function(type) {
			if(this.instance != null) {
				if(type) {
					controls.buttons.deactivate(this.instance[type].button);
					this.instance[type].init.deactivate();
				}
				
				$.each(this.instance, function(type, control){
					controls.buttons.deactivate(control.button);
					control.init.deactivate();
				});
			}
			
			if(this.panelView)
				this.panelView.hide();
		} 
	},

	// Disattiva tutti i controlli di tipo "toggle"
	// (controlli esclusivi)
	// - Se viene specificato un controllo deattiva solo quello specificato
	deactivate: function(ctrl) {
		if(ctrl) {
			ctrl.deactivate();
			return;
		}
			
		$.each(this, function(key, ctrl){
			if(ctrl.isControl && ctrl.isToggle && ctrl.instance != null)
				ctrl.deactivate();
		});
		
		return;
	},
	
	buttons: {
		deactivate: function(btn){
			if(btn)
				//btn.prop("checked", false);
				btn.removeClass("btn-active");
			else
				//$(".ctrlButtons").prop("checked", false);
				$(".ctrlButtons").removeClass("btn-active");
		},
		
		activate: function(btn) {
			this.deactivate();
			if(btn) {
				//btn.prop("checked", true);
				//btn.button("refresh");
				btn.addClass("btn-active");
			}
		}
	}
};