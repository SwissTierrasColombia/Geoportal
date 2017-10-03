var mAlertSettings = {
	
	addTypeForm: null,
	self: this,
	
	init: function() {
		$("#submit").button();
		$("#cancel").button();
		
		$("#submit-int").button();
		$("#cancel-int").button();
		
		if(this.addTypeForm == null) {
			this.addTypeForm = $("#form-dialog");
		}
	},
	
	getDataFromPage: function() {
		var settings = new Object();
		var selectedValue = $("#ref_layers_select option:selected").val();
		settings.referenceLayerId = selectedValue;
		
		settings.alertAddedMessage = $("#alerts-added-message-txt").val();
		return settings;
	},
	
	getIntersectionDataFromPage: function() {
		var settings = {};
		settings.department = {};
		settings.municipality = {};
		
		//Departments
		var selectedValue = $("#departments-layer-select option:selected").val();
		if (Utils.isEmpty(selectedValue)) {
			selectedValue = null;
		}
		settings.department.layerId = selectedValue;
		settings.department.keyColumnName = $("#departments-key-columnName").val();
		settings.department.descColumnName = $("#departments-desc-columnName").val();
		settings.department.geomColumnName = $("#departments-geom-columnName").val();
		settings.department.active = $("#departments-active").is(":checked");
		
		
		//Municipalities
		var selectedValue = $("#municipalities-layer-select option:selected").val();
		if (Utils.isEmpty(selectedValue)) {
			selectedValue = null;
		}
		
		settings.municipality.layerId = selectedValue;
		settings.municipality.keyColumnName = $("#municipalities-key-columnName").val();
		settings.municipality.descColumnName = $("#municipalities-desc-columnName").val();
		settings.municipality.geomColumnName = $("#municipalities-geom-columnName").val();
		settings.municipality.active = $("#municipalities-active").is(":checked");

		return settings;
	},
	
	getTypeDataFromPage: function() {
		var alertTypes = [];
		$("#list_alert_types li").each(function(k,v){
			var idAlertType = $(v).data("idAlertType");
			var name = $(v).text();
			
			var type_i = {
				idAlertType: idAlertType,
				name: name
			};
			
			alertTypes.push(type_i);
		});
		
		return alertTypes;
	},
	
	populatePage: function(data) {
		
		//Populate combo
		Utils.populateComboWithEmpty($("#ref_layers_select"), data.layerList, "idLayer", "layerTitle");
		
		$("#alerts-added-message-txt").val(data.alertAddedMessage);
		
		//Set the selected one
		mAlertSettings.setReferenceLayerSelected(data);
		
	},
	
	populatePageIntersection: function(data) {
		
		//Populate combos
		var orderedLayerList = Utils.orderByAttribute(data.layerList, "layerTitle", "asc");
		Utils.populateComboWithEmpty($("#departments-layer-select"), orderedLayerList, "idLayer", "layerTitle");
		Utils.populateComboWithEmpty($("#municipalities-layer-select"), orderedLayerList, "idLayer", "layerTitle");
		
		/*
		 * Departments
		 */
		$("#departments-key-columnName").val(data.department.keyColumnName);
		$("#departments-desc-columnName").val(data.department.descColumnName);
		$("#departments-geom-columnName").val(data.department.geomColumnName);
		$("#departments-active").prop('checked', data.department.active);
		
		//Set the selected one
		var options = $("#departments-layer-select option");
		$.each(options, function (k,v){
			if (data.department.layerId == $(v).attr("value")) {
				$(v).prop("selected", true);
				return false; //exit loop
			}
		});
		
		/*
		 * Municipalities
		 */
		$("#municipalities-key-columnName").val(data.municipality.keyColumnName);
		$("#municipalities-desc-columnName").val(data.municipality.descColumnName);
		$("#municipalities-geom-columnName").val(data.municipality.geomColumnName);
		$("#municipalities-active").prop('checked', data.municipality.active);
		
		//Set the selected one
		var options = $("#municipalities-layer-select option");
		$.each(options, function (k,v){
			if (data.municipality.layerId == $(v).attr("value")) {
				$(v).prop("selected", true);
				return false; //exit loop
			}
		});
	},
	
	refreshDataButtons: function() {
		var numSelected = $(".ui-selected").length;
		if (numSelected > 0) {
			$("#types-update").show();
			$("#types-delete").show();
		}
		else {
			$("#types-update").hide();
			$("#types-delete").hide();
		}
	},
	
	populateAlertTypes: function(data) {
		mAlertSettings.refreshDataButtons();
		
		//Populate UL
		//(list, dataArray, keyName, dataKeyValue, value)
		var list = $("#list_alert_types");
		list.empty();
		Utils.populateList($("#list_alert_types"), data, "idAlertType", "idAlertType", "name");
		$(list).selectable({
			stop: function() {
				mAlertSettings.refreshDataButtons();
			}
		});
	},
	
	setReferenceLayerSelected: function(data) {
		if (Utils.isNullOrUndefined(data.referenceLayerId)) {
			//Nothing selected.
			return;
		}
		
		var options = $("#ref_layers_select option");
		$.each(options, function (k,v){
			if (data.referenceLayerId == $(v).attr("value")) {
				$(v).prop("selected", true);
				return false; //exit loop
			}
		});
	},

	getTypeFromForm: function() {
		var typeObj = new Object();
		typeObj.idAlertType = $("#type-input-id").val();
		typeObj.name = $("#alert-type-name").val();
		
		return typeObj;
	},
	
	populateAlertTypeForm: function() {
		var typeId = $(".ui-selected").data("idAlertType");
		var name = $(".ui-selected").text();
		
		$("#type-input-id").val(typeId);
		$("#alert-type-name").val(name);
	},
	
	addNewType: function() {
		var newType = this.getTypeFromForm();
		
		var valid = validator.valid();
		if(!valid) {
			return;
		}
		
		this.requests.addAlertType(newType);
	},
	
	updateType: function() {
		var updateType = this.getTypeFromForm();
		
		var valid = validator.valid();
		if(!valid) {
			return;
		}
		
		this.requests.updateAlertType(updateType);
	},
	
	deleteType: function() {
		//$(".ui-selected").remove();
		var typeId = $(".ui-selected").data("idAlertType");
		this.requests.deleteAlertType(typeId);
	},
	
	openAddTypeForm: function() {
		this.createAddFormPanel();
		Utils.cleanForm(this.addTypeForm);
		this.addTypeForm.dialog("open");
	},
	
	createAddFormPanel: function() {
		if(this.validForm) {
			this.validForm.reset();
		}
		
		$("#form-dialog-header").data("locale_key", "Advanced_Alerts_FormHeader_Add_Type");
		LocaleManager.refreshLocalizedElement($("#form-dialog-header"));
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Save')] = function(){
			var isValid = self.validator.valid();
			if(!isValid) {
				return;
			}
			mAlertSettings.addNewType();
		};
		
		DialogUtils.renderDialog(LocaleManager.getKey("General_TitleForm"), buttons, {
			modal: true,
			resizable: false,
			height: 200,
			width: 300,
			closeFn: function() {
				Utils.cleanForm(this.addTypeForm);
			}
		}, this.addTypeForm);
		
	},
	
	openUpdateTypeForm: function() {
		Utils.cleanForm(this.addTypeForm);
		this.createUpdateFormPanel();
		this.addTypeForm.dialog("open");
	},
	
	createUpdateFormPanel: function() {
		if(this.validForm) {
			this.validForm.reset();
		}
		
		this.populateAlertTypeForm();
		
		$("#form-dialog-header").data("locale_key", "Advanced_Alerts_FormHeader_Update_Type");
		LocaleManager.refreshLocalizedElement($("#form-dialog-header"));
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Save')] = function(){
			var isValid = self.validator.valid();
			if(!isValid) {
				return;
			}
			mAlertSettings.updateType();
		};
		
		DialogUtils.renderDialog(LocaleManager.getKey("General_TitleForm"), buttons, {
			modal: true,
			resizable: false,
			height: 200,
			width: 300,
			closeFn: function() {
				Utils.cleanForm(this.addTypeForm);
			}
		}, this.addTypeForm);
		
	},
	
	requests: {		
		
		getData: function() {
			Utils.ajaxCallSynch("./alerts", "POST", "json", {
				oper: "getAlertConfiguration"
			}, function(response) {				
				if(response.success) {
					mAlertSettings.populatePage(response.result);
				}
			});
		},
		
		saveData: function() {
			var settings = mAlertSettings.getDataFromPage();
			Utils.ajaxCallSynch("./alerts", "POST", "json", {
				oper: "saveAlertConfiguration",
				referenceLayerId: settings.referenceLayerId,
				alertAddedMessage: settings.alertAddedMessage
			}, function(response) {				
				if(response.success) {
					AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Item_ConfigSystem"), LocaleManager.getKey("Manager_Config_Saved_Ok"), "info", function() {
						//Reload
						mAlertSettings.requests.getData();
					});
				}
			});
		},
		
		getIntersectionData: function() {
			Utils.ajaxCallSynch("./alerts", "POST", "json", {
				oper: "getAlertIntersectionConfiguration"
			}, function(response) {				
				if(response.success) {
					mAlertSettings.populatePageIntersection(response.result);
				}
			});
		},
		
		saveIntersectionData: function() {
			var settings = mAlertSettings.getIntersectionDataFromPage();
			Utils.ajaxCallSynch("./alerts", "POST", "json", {
				oper: "saveAlertIntersectionConfiguration",
				data: JSON.stringify(settings)
			}, function(response) {				
				if(response.success) {
					AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Item_ConfigSystem"), LocaleManager.getKey("Manager_Config_Saved_Ok"), "info", function() {
						//Reload
						mAlertSettings.requests.getIntersectionData();
					});
				}
			});
		},
		
		getTypeData: function() {
			
			//Reset validator
			if(validator) {
				validator.reset();
			}
			
			Utils.ajaxCallSynch("./generalData", "POST", "json", {
				oper: "get",
				object: "alertTypes"
			}, function(response) {				
				if(response.success) {
					mAlertSettings.populateAlertTypes(response.result);
				}
			});
		},

		updateAlertType: function(alertType) {
			Utils.ajaxCallSynch("./alerts", "POST", "json", {
				oper: "updateAlertType",
				alertType:  JSON.stringify(alertType)
			}, function(response) {				
				if(response.success) {
					AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Item_ConfigSystem"), LocaleManager.getKey("Manager_Config_Saved_Ok"), "info", function() {
						//Close form
						Utils.closeDialogForm(mAlertSettings.addTypeForm);
						
						//Reload
						mAlertSettings.requests.getTypeData();
					});
				}
			});
		},
		
		addAlertType: function(alertType) {
			Utils.ajaxCallSynch("./alerts", "POST", "json", {
				oper: "addAlertType",
				name:  alertType.name
			}, function(response) {				
				if(response.success) {
					AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Item_ConfigSystem"), LocaleManager.getKey("Manager_Config_Saved_Ok"), "info", function() {
						//Close form
						Utils.closeDialogForm(mAlertSettings.addTypeForm);
						
						//Reload
						mAlertSettings.requests.getTypeData();
					});
				}
			});
		},
		
		deleteAlertType: function(idAlertType) {
			Utils.ajaxCallSynch("./alerts", "POST", "json", {
				oper: "deleteAlertType",
				idAlertType: idAlertType
			}, function(response) {				
				if(response.success) {
					AlertDialog.createOkDefaultDialog(LocaleManager.getKey("Manager_Item_ConfigSystem"), LocaleManager.getKey("Manager_Config_Saved_Ok"), "info", function() {
						//Reload
						mAlertSettings.requests.getTypeData();
					});
				}
			});
		}
		
	}
};