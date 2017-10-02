var SimpleAlertDetailForm = function(domObject) {

	this.formDetailDom = domObject;
	var self = this;
	
	this.initialized = false;
	
	var vLayer = null;
	
	var dialogOptions = {
		closeFn: function() {
			self.closeCallBackFn();
		},
		height: 320,
		width: 425,
		resizable: false,
		modal: false,
		extensions: true
	};
	
	this.dialogDiv = DialogUtils.renderDialog(LocaleManager.getKey("Advanced_Alerts_FormHeader_Detail"), {}, dialogOptions, this.formDetailDom);
	
	this.init = function() {
		$("#simple-alerts-detail-cancel").button();	
		
		this.initialized = true;
	};
	
	this.show = function() {
		if (!this.initialized) {
			this.init();
		}
		
		//Open dialog
		//this.formDetailDom.show();
		this.dialogDiv.dialog("open");
	};
	
	this.closeCallBackFn = function() {
		//Render dialog content
		//Clean form
		Utils.cleanForm(this.formDetailDom);
		//this.formDetailDom.hide();
	};
	
	/*
	 * Close the dialog and remove the layer from map.
	 * The layer is not removed from map if leaveDetailDialogGeometry = true
	 */
	this.close = function(leaveDetailDialogGeometry) {
		
		this.dialogDiv.dialog("close");
		
		if (this.vLayer && leaveDetailDialogGeometry !== true) {
			map.removeLayer(this.vLayer);
			this.vLayer = null;	
		}
	};

	this.openAndPopulateFromData = function(data) {
		Utils.cleanForm(this.formDetailDom);
		
		//Set the Title of the form adding the reference id...
		var localizedHeaderText = LocaleManager.getKey("Advanced_Alerts_FormHeader_Detail");
		$("#alert-simple-panel-detail-header-title").text(localizedHeaderText+ " " + data.referenceCode);
		
		$("#simple-detail-alerts-name").val(data.submitterName);
		
		//Date
		$("#simple-detail-alerts-date").val(data.eventDateStr);
		
		$("#simple-detail-alerts-type").val(data.alertTypeName);
		
		$("#simple-detail-alerts-department").val(data.departmentName);
		$("#simple-detail-alerts-desc").val(data.description);
		$("#simple-detail-alerts-email").val(data.submitterEmail);
		
		$("#simple-detail-alerts-phone").val(data.phoneNum);
		$("#simple-detail-alerts-mobile").val(data.mobileNum);
		
		$("#simple-detail-alerts-insert-date").val(data.insertTime);
		$("#simple-detail-alerts-current-status").val(data.currentStatusName);
		//this.formDetailDom.show();
		this.show();
		
		//Load vector data
		this.loadGeometry(data);
	};
	
	this.loadGeometry = function(data) {
		if (!this.vLayer) {
			this.vLayer = this.initLayer("alert_single");
			map.addLayer(this.vLayer);
		}
		else {
			//Empty layer...
			this.vLayer.removeAllFeatures();
		}
		
		var feature = Utils.getFromWKT(data.wktGeometry);
		feature.attributes.epsg = "EPSG:4326";
		var features = [];
		features.push(feature);
		this.vLayer.addFeatures(features);
		map.zoomToExtent(this.vLayer.getDataExtent());
		
	};
	
	this.initLayer = function(name) {
		var vLayer = new OpenLayers.Layer.Vector(name,{
			displayInLayerSwitcher : false,
			//styleMap: testStyleMap,
			styleMap: new OpenLayers.StyleMap(),
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
		vLayer.alwaysOnTop = true;
		
		return vLayer;
	};
};