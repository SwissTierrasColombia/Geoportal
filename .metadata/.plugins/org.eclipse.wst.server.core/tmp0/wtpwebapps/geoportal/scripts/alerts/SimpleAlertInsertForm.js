var SimpleAlertInsertForm = function(domObject, layer) {
	var self = this;
	
	this.initialized = false;
	
	this.formInsertDom = $("#alert-simple-panel-insert");
	var dialogOptions = {
		closeFn: function() {
			self.closeCallBackFn();
		},
		height: 427,
		width: 450,
		resizable: false,
		modal: false
	};
	
	this.dialogDiv = DialogUtils.renderDialog(LocaleManager.getKey("Advanced_Alerts_FormHeader_Insert"), {}, dialogOptions, this.formInsertDom);
	
	this.formValidator = new Validate({
		form: this.formInsertDom
	});
	
	// Populate combobox type alerts
	Utils.ajaxCall("./generalData", "POST", "json", {
		oper: "get",
		object: "alertTypes"
	}, function(response) {
		Utils.populateComboWithEmpty($("#simple-insert-alerts-type"), response.result, "idAlertType", "name");
	});
	
	/*
	 * Department combobox populated via WFS fetch
	 */
	$("#simple-insert-alerts-department").prop("disabled", false);
	// Populate combobox departments via WFS request
	GetFeaturesUtils.getValueListFromWFS({
		url: alerts.intersections.config.department.layerUrl,
		typeName: alerts.intersections.config.department.layerName,
		propertyName: [alerts.intersections.config.department.keyColumnName, alerts.intersections.config.department.descColumnName]
	},function(responseList){
		Utils.populateComboWithEmpty($("#simple-insert-alerts-department"), responseList, "id", "name");
		}, 
		function() {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("POPPO"), 
				LocaleManager.getKey("POPPO")
			);
		return;
	});	
	
	
	this.init = function() {
		$("#simple-alerts-insert-submit").button();	
		$("#simple-alerts-insert-cancel").button();
		
		$("#simple-insert-alerts-date").datepicker({
			changeMonth: true,
			dateFormat: LocaleManager.getDateFormat() //"yy-mm-dd"
		});
		
		this.initialized = true;
	};
	
	this.show = function() {
		if (!this.initialized) {
			this.init();
		}
		
		Utils.cleanForm(this.formInsertDom);
		
		//Select first option of combobox
		$("#simple-insert-alerts-department").val($("#simple-insert-alerts-department option:first").val());
		
		Utils.formatMandatoryFields(this.formInsertDom);
		
		//Reset validator
		if(this.formValidator) {
			this.formValidator.reset();
		}
		
		//this.formInsertDom.show();
		
		
		this.dialogDiv.dialog("open");
	};
	
	this.closeCallBackFn = function() {
		//Clean form
		Utils.cleanForm(this.formInsertDom);
		
		//Select first option of combobox
		$("#simple-insert-alerts-type").val($("#simple-insert-alerts-type option:first").val());
		
		//Select first option of combobox
		$("#simple-insert-alerts-department").val($("#simple-insert-alerts-department option:first").val());
		
		//Disable controls and empty vLayerEdit
		controls.alerts.deactivate();
		alerts.vLayerEdit.removeAllFeatures();
	};
	
	this.close = function() {
		//This wille ventually  call the closeCallbackFn...
		this.dialogDiv.dialog("close");
	};
	
	this.populateAlertAddedWithReferenceCode = function(targetDiv, referenceCode) {
		//Title
		targetDiv.find("#alert_add_template_title").text(LocaleManager.getKey("Advanced_Alerts_Label_Reference_Code_Generation_Msg_1"));
		
		//Content
		targetDiv.find("#alert_add_template_content").text(LocaleManager.getKey("Advanced_Alerts_Label_Reference_Code_Generation_Msg_2"));
		
		//Code
		targetDiv.find("#alert_add_template_codigo").text(LocaleManager.getKey("Advanced_Alerts_Label_Reference_Code_Generation_Msg_3") + ": " + referenceCode );
		
		//Set the footer (note)
		Utils.ajaxCallSynch("./alerts", "POST", "json", {
			oper: "getAlertAddedMessage"
		}, function(response) {				
			if(response.success) {
				targetDiv.find("#alert_add_template_note").text(response.result);
			}
		});
	};
	
	this._createDialogWithReferenceCode = function(referenceCode, callbackFn) {
		
//		var p1 = $("<p>").text(LocaleManager.getKey("Advanced_Alerts_Label_Reference_Code_Generation_Msg_1")).attr("style", "font-weight: bold;");
//		var p2 = $("<p>").text(LocaleManager.getKey("Advanced_Alerts_Label_Reference_Code_Generation_Msg_2"));
//		var p3 = $("<p>").text(LocaleManager.getKey("Advanced_Alerts_Label_Reference_Code_Generation_Msg_3") + ": " + referenceCode ).attr("style", "font-weight: bold;");
//		
//		var content = $("<div>").append(p1, p2, p3).attr("style", "padding:5px;");

		var targetDiv = $("<div>");
		targetDiv.load("alert_added_template.html", function() {
			self.populateAlertAddedWithReferenceCode(targetDiv, referenceCode);
		});
		
		var buttons = {};

		buttons[LocaleManager.getKey("AlertDialog_OK")] = function() {
			$(this).dialog("close");
			callbackFn();
		};

		var dialogDiv = DialogUtils.createDialog(LocaleManager.getKey("Advanced_Alerts_Alert_Added_Succesfully"), buttons, {
			width : 600,
			height : 290,
			closeFn: callbackFn
		}, targetDiv);
		
		return dialogDiv;
	};
	
	
	this.getDataForm = function() {
		
		var feature = alerts.vLayerEdit.features[0];
		if (Utils.isNullOrUndefined(feature)) {
			return;
		}
		
		var data = new Object();
		var clonedGeom = feature.geometry.clone();
		
		data.wktGeometry = Utils.getGeomWKT(clonedGeom.transform(
			new OpenLayers.Projection(feature.layer.projection.projCode),
			new OpenLayers.Projection(Utils.getDefaultDbEPSG())
		));
		
		data.submitterName = $("#simple-insert-alerts-name").val();
		data.submitterEmail = $("#simple-insert-alerts-email").val();
		data.description = $("#simple-insert-alerts-desc").val();
		data.alertTypeId = $("#simple-insert-alerts-type option:selected").val();
		
		data.geometryType = Utils.getGeomType(feature.geometry.CLASS_NAME.split(".")[2]);
		data.departmentId = $("#simple-insert-alerts-department option:selected").val();
		
		data.departmentName = $("#simple-insert-alerts-department option:selected").text();
		data.departmentCod = data.departmentId;
		
		var dateTmp = $("#simple-insert-alerts-date").val();
		if (!Utils.isEmpty(dateTmp)) {
			data.eventDateStr = dateTmp;	
		}
		else {
			data.eventDateStr = null;
		}
		data.phoneNum = $("#simple-insert-alerts-phone").val();
		data.mobileNum = $("#simple-insert-alerts-mobile").val();
		
		return data;
	};
	
	this.save = function() {
		var isValid = this.formValidator.valid();
		if (!isValid) {
			return;
		}
		
		var dataForm = this.getDataForm();
		if (dataForm == null || dataForm.wktGeometry == null) {
			/*
			 * Geometry was not inserted.
			 */
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("Advanced_Alerts_FormHeader_Insert"), 
				LocaleManager.getKey("Advanced_Alerts_FormHeader_Insert_No_Feature_Added")
			);
			return;
			
		} else if (Utils.isEmpty(dataForm.alertTypeId)) {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("Advanced_Alerts_FormHeader_Insert"),
				LocaleManager.getKey("Advanced_Alerts_Insert_No_Alert_type") 
				
			);
			return;
		}
		else if (Utils.isEmpty(dataForm.departmentId)) {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("Advanced_Alerts_FormHeader_Insert"),
				LocaleManager.getKey("Advanced_Alerts_Insert_No_Department")
			);
			return;
		}
		
		/*
		 * Test that the inserted point falls inside the selected department...
		 */
		//Useless to do a client-side intersection...
//		var pointGeom = OpenLayers.Geometry.fromWKT(dataForm.wktGeometry);
//		if (Utils.isTrue(alerts.intersections.config.department.active)) {
//			AlertsIntersectionUtils.performDepartmentsIntersection(pointGeom, dataForm.departmentId, function(){
//				self.doSave(dataForm);
//			});	
//		}
//		else {
			self.doSave(dataForm);
//		}
	};
	
	this.doSave = function(dataForm) {
		//save
		Utils.ajaxCallSynch("./alerts", "POST", "json", {
			oper: "insert",
			data: JSON.stringify(dataForm)
		}, function(response){

			var dialog = self._createDialogWithReferenceCode(response.result.referenceCode, function() {
				//Callback...
				self.close();
			});
			dialog.dialog("open");					
		});
	};
};