var alerts = {
	vLayer: null,
	vLayerEdit: null,
	fullPanel: null,
	fullPanelDialogDiv: null,
	fullPanelValidator: null,
	fullPanelGridContainer: null,
	fullPanelInsertContainer: null,
	fullPanelUpdateContainer : null,
	fullPanelDownloadContainer: null,
	
	statusDialogDiv: null,
	
	grid: null,
	dataT: null,
	pager: "#alerts-pager-grid",
	modifyGeomActive: false,
	changeGeomActive: false,
	currentForm: null,
	
	simplePanel: null,
	simpleInsertPanel: null,
	detailPanel: null,
	
	formInsert: null,
	validatorFormInsert: null,
	
	formUpdate: null,
	validatorFormUpdate: null,
	
	formDownload: null,
	
	//ReferenceLayer
	alertReferenceLayer: null,
	
	panelSizes : {
		fullPanelModify : {
			width: 450,
			height: 426
		},
		fullPanelInsert : {
			width: 450,
			height: 427
		},
		fullPanelDownload : {
			width: 450,
			height: 180
		},
		fullPanelViewGrid : {
			width: 1000,
			height: 300
		},
		changeSizePanel : {
			width: 280,
			height: 238 
		}
	},
	
	canOpenFullPanel: function() {
		var hasPermission = false;
		if (!Utils.isNullOrUndefined(userPermissions)) {
			hasPermission = userPermissions.hasPermission("ALERTS_READ");
		}
		return hasPermission;
	},
	
	simplePanelSwitchMenu: function(obj) {
		// Activate tab switcher button
		$(".simple-advance-alerts-panel-link").removeClass("simple-advance-alerts-panel-link-active");
		obj.addClass("simple-advance-alerts-panel-link-active");
		
		// Show proper tab view
		var tabSelected = obj.data("tab");
		$(".simple-advance-alerts-panel-tab-item").addClass("custom-hidden");
		$("#" + tabSelected).removeClass("custom-hidden");
	},
	
	/** ****************************************
	 *  Enable/Disable alerts
	 *  Init vector layer and open manager panel
	 *  *****************************************/
	toggle: function(button) {	
		if(!button.hasClass("btn-active")) {
			this.activate(button);
		}
		else {
			
			//Open the simple or the full panel.
			if (this.canOpenFullPanel() === true) {
				if(this.fullPanel != null) {
					if(!this.fullPanel.is(":visible")) {
						this.openFullPanel();
						this.reloadGrid(null, false);
						// Refresh grid and layer
					}				
					else {
						this.deactivate(button);				
					}				
				}	
			}
			else {
				if(this.simplePanel != null) {
					if(!this.simplePanel.is(":visible")) {
						this.openSimplePanel();
					}				
					else {
						this.deactivate(button);				
					}				
				}
			}
		}
	},
	
	activate: function(button) {
		var self = this;
		this.intersections.initIntersections(function(){
			button.addClass("btn-active");
			
			if (self.canOpenFullPanel() === true) {
				self.initFullPanel();
				self.openFullPanel();	
			}
			else {
				
				/*
				 * /If the Add panel or the verify panel are already visible, 
				 * hide them!
				 */
				self.closeNewAlertSimple();
				self.closeDetailVerifyPanel();
				
				self.initSimplePanel();
				self.openSimplePanel();
			}
		});
	},
	
	deactivate: function(button, leaveChildrenOpen) {
		button.removeClass("btn-active");
		
		if (this.canOpenFullPanel() === true) {
			this.closeFullPanel();
			this.closeStatusPanel();
			this.unselectRowsGrid();	
		}
		else {
			this.closeSimplePanel();
			
			//Close the "children panels..."
			if (leaveChildrenOpen !== true) {
				this.closeNewAlertSimple();
				this.closeDetailVerifyPanel();
			}
		}
		
		//Clean all the OLcontrols
		this.cleanControls();
	},
	
	/** ********************************
	 *  Open alerts panel (grid data)
	 *  ********************************/
	openFullPanel: function() {		
		// Open dialog alerts
		//this.fullPanel.dialog("open");
		//this.fullPanel.show();
		this.fullPanelDialogDiv.dialog("open");
		
		// Force switch to data grid
		this.doAction("viewgrid");
		
	},
	
	openSimplePanel: function() {
		//Empty the forp prior of opening it
		Utils.cleanForm(this.simplePanel);
		
		this.simplePanel.show();
	},
	
	/** ***************************
	 *  Close alerts FULL manager panel
	 *  ***************************/
	closeFullPanel: function() {
		if(this.fullPanel != null) {
			//This will eventually call the closeDialogCallbackFn
			//that will clear the geometries, deactivate the controls
			//and unselect the rows on the grid..
			this.fullPanelDialogDiv.dialog("close");
		}
	},

	closeDialogCallbackFn: function() {
		// Clean geoms selected on map
		alerts.selectGeomsOnMap([]);
		
		this.closeStatusPanel();
		this.unselectRowsGrid();
		
		// Deactivate Controls.
		controls.alerts.deactivate();
	},
	
	/** ***************************
	 *  Close alerts SIMPLE manager panel
	 *  ***************************/
	closeSimplePanel: function() {	
		// Close tools panel
		if(this.simplePanel != null) {
			//this.fullPanel.dialog("close");
			this.simplePanel.hide();
		}
		
		// Deactivate Controls AND remove geometries
		this.cleanControls();
	},
	
	
	closePanelGeneral: function(leaveChildrenOpen) {
		if (this.canOpenFullPanel() === true) {
			this.closeFullPanel();
		}
		else {
			var button = $('#gis_alertsBtn');
			this.deactivate(button, leaveChildrenOpen);
		}
	},
	
	closePanelGeneralForPrint: function() {
		if (this.canOpenFullPanel() === true) {
			this.closeFullPanel();
			
			controls.alerts.deactivate();
		}
		else {
			this.closeSimplePanel();
			
			
			this.closeNewAlertSimple();
			this.closeDetailVerifyPanel(true);

			//Clean all the OLcontrols
			this.cleanControls();
		}
	},
	
	addNewAlertSimple: function() {
		this.simpleInsertPanel.show();
		
		//Add reference layer to the map (if exists(
		this.loadReferenceLayer();
		
		//Close Advance panel
		this.closePanelGeneral(true);
	},
	
	loadReferenceLayer: function() {
		
		var layerConfig = catalog.getReferenceLayerForAlert();
		
		if (!Utils.isNullOrUndefined(layerConfig)) {
			//Reference layer exists...
			//Get LayerLI from the Menu
			var url = layerConfig.getUrl();
			var name = layerConfig.getName();
			var layerLI = LayerMenu.getLayerLIFromMenu(url, name);
			if(!Utils.isNullOrUndefined(layerLI)){
				//Select and open the layer in the menu
				LayerMenu.selectAndOpenLayerInMenu(layerLI);
				
				//Put this layer as the First in the Selected Layer Menu...
				//var id = $(layerLI).data("id");
				//moveToTopInSelectedLayerMenu(id);
			}
		}
		
	},
	
	closeNewAlertSimple: function() {
		if (!Utils.isNullOrUndefined(this.simpleInsertPanel)) {
			this.simpleInsertPanel.close();	
		}
	},
	
	closeDetailVerifyPanel: function(leaveDetailDialogGeometry) {
		if (!Utils.isNullOrUndefined(this.detailPanel)) {
			this.detailPanel.close(leaveDetailDialogGeometry);
		}
	},
	
	saveNewAlertSimple: function() {
		this.simpleInsertPanel.save();
	},
	
	addPointNewAlertSimple: function() {
		this.simpleInsertPanel.drawPoint();
	},
	
	verifyAlert: function(referenceCodeInputDom) {
		var referenceCode = referenceCodeInputDom.val();
		if (Utils.isNullOrUndefined(referenceCode) || Utils.isEmpty(referenceCode)) {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManager.getKey("Advanced_Alerts_Alert_VerifyByRefCodeInvalid")
			);
			return;
		}
		//Close Advance panel
		this.closePanelGeneral();
		
		this.requests.getAlertByRefCodeForVerification(referenceCode);
	},
	/** *************************************
	 *  Toggle between grid and actions panel 
	 *  - insert
	 *  - modify 
	 *  *************************************/
	toggleActions: function(actItem) {
		var action = actItem.data("action");
		this.doAction(action);
	},
	
	
	/** **************************************
	 *  Do the action selected from datatable
	 *  - Insert (switch to insert form)
	 *  - Update (switch to update form)
	 *  - ViewData (switch to datatable)
	 *  **************************************/
	doAction: function(action) {	
		switch (action) {
		case "modify":
			
			var self = this;
			
			
			var selected = Utils.getSelectedRow(this.dataT);
			if(!selected) {
				return;
			}
			
			var selectedAlertFeats = self.vLayer.getFeaturesByAttribute("idAlert", selected[0].idAlert);
			var selectedAlertFeat = selectedAlertFeats[0];
			var cloneFeatGeom = selectedAlertFeat.geometry.clone().transform(
					new OpenLayers.Projection(selectedAlertFeat.layer.projection.projCode),
					new OpenLayers.Projection(Utils.getDefaultDbEPSG()));
			
			var alert_x = cloneFeatGeom.x;
			var alert_y = cloneFeatGeom.y;
			
			var alertCoords = [];
			alertCoords.push({
				xAlert: alert_x,
				yAlert: alert_y
			});
			
			//Test if the user can effectively modify the alert
			//(ie verify he has all the required permissions)
			// Check if row is selected
			this.intersections.checkIfUserCanEdit(alertCoords, function(res){
				// Force select control on vLayer alerts to be disabled
				if(controls.alerts.instance != null)
					self.deactivateSelectFeature($("#alerts-selectmap"));
				
				
				// Show update form into panel
				self.fullPanelGridContainer.hide();
				self.cleanForm(self.formUpdate);
				
				$("#update-alerts-date").datepicker({
					changeMonth: true,
					dateFormat: LocaleManager.getDateFormat() //"yy-mm-dd"
				});
				
				self.populateUpdateForm(selected[0]);
				self.formUpdate.show();
				
				// Update width dialog size
				//this.fullPanel.dialog( "option", "width", 450 );
				self.fullPanelDialogDiv.dialog("option", "width", self.panelSizes.fullPanelModify.width);
				self.fullPanelDialogDiv.dialog("option", "height", self.panelSizes.fullPanelModify.height);
				
				// Select feature to modify (from grid) on map
				var selectedFeats = self.vLayer.getFeaturesByAttribute("idAlert", selected[0].idAlert);
				self.selectFeatureAlertForModify(selectedFeats[0]);
				
				// Pan to feature selected
				map.panTo(
					new OpenLayers.LonLat(selectedFeats[0].geometry.getCentroid().x, selectedFeats[0].geometry.getCentroid().y)
				);
				
				self.currentForm = "modify";				
			});
			
			break;
			
		case "insert":
			// Force select control on vLayer alerts to be disabled
			if(controls.alerts.instance != null)
				this.deactivateSelectFeature($("#alerts-selectmap"));
			
			// Show insert form into panel
			this.fullPanelGridContainer.hide();
			this.cleanForm(this.formInsert);
			
			$("#insert-alerts-date").datepicker({
				changeMonth: true,
				dateFormat: LocaleManager.getDateFormat() //"yy-mm-dd"
			});
			
			//Reset validator
			if (this.validatorFormInsert) {
				this.validatorFormInsert.reset();
			}
			
			this.formInsert.show();
			
			// Update width dialog size
			this.fullPanelDialogDiv.dialog("option", "width", this.panelSizes.fullPanelInsert.width);
			this.fullPanelDialogDiv.dialog("option", "height", this.panelSizes.fullPanelInsert.height);
			this.currentForm = "insert";
			
			break;
			
		case "download":
			
			// Show download form into panel
			this.fullPanelGridContainer.hide();
			this.cleanForm(this.formDownload);
			this.formDownload.show();
			
			// Update width dialog size
			this.fullPanelDialogDiv.dialog("option", "width", this.panelSizes.fullPanelDownload.width);
			this.fullPanelDialogDiv.dialog("option", "height", this.panelSizes.fullPanelDownload.height);
			this.currentForm = "download";
			
			break;
			
		case "selectmap":
			this.toggleSelectFeature();
			break;
			
		case "viewgrid":
			// Force select control on vLayer alerts to be disabled
			if(controls.alerts.instance != null)
				this.deactivateSelectFeature($("#alerts-selectmap"));
			
			// Show datatable section into panel
			this.formInsert.hide();
			this.formUpdate.hide();
			this.formDownload.hide();
			this.fullPanelGridContainer.show();
			
			// Update width dialog size
			this.fullPanelDialogDiv.dialog("option", "width", this.panelSizes.fullPanelViewGrid.width);
			this.fullPanelDialogDiv.dialog("option", "height", this.panelSizes.fullPanelViewGrid.height);

			// Disable all modify controls (vLayerEdit)
			this.disableModifyControls();
			
			this.currentForm = "viewgrid";
			break;
			
		default: 
			//alert("default");
		}		
	},
	
	/** **********************************************
	 *  Select control on alerts (vLayer)
	 *  Enable/Disable select feature on vLayer alerts
	 *  **********************************************/
	toggleSelectFeature: function() {
		var button = $("#alerts-selectmap");
		if(button.hasClass("btn-active-grid"))
			this.deactivateSelectFeature(button);
		else
			this.activateSelectFeature(button);
	},
	
	activateSelectFeature: function(button) {
		button.addClass("btn-active-grid");
		controls.alerts.activate(button);
		
	},
	
	deactivateSelectFeature: function(button) {
		button.removeClass("btn-active-grid");
		controls.alerts.deactivate(button);		
	},
	
	/** *************
	 *  Status panel 
	 *  *************/
	toggleStatusForm: function(button) {
		if(button.hasClass("btn-active-grid")) {
			button.removeClass("btn-active-grid");
			this.closeStatusPanel();
		}
		else {
			if(!button.hasClass("btn-grid-disable")) {
				button.addClass("btn-active-grid");
				this.openStatusPanel();
			}
		}
	},

	getIdsRows: function(rows) {
		var idsList = [];
		$.each(rows, function(index, row) {
			idsList.push(row.idAlert);
		});
		
		return idsList;
	},
	
	/** **********************************************
	 *  Open/Close status panel alerts
	 *  It lets to change status of one or more alerts
	 *  **********************************************/
	openStatusPanel: function() {
		
		var self = this;

		var selectedRows = Utils.getSelectedRow(alerts.dataT);
		
		var alertCoords = [];
		$.each(selectedRows, function(idx, row){
			
			var selectedAlertFeats = self.vLayer.getFeaturesByAttribute("idAlert", row.idAlert);
			var selectedAlertFeat = selectedAlertFeats[0];
			var cloneFeatGeom = selectedAlertFeat.geometry.clone().transform(
					new OpenLayers.Projection(selectedAlertFeat.layer.projection.projCode),
					new OpenLayers.Projection(Utils.getDefaultDbEPSG()));
			
			var alert_x = cloneFeatGeom.x;
			var alert_y = cloneFeatGeom.y;	
			alertCoords.push({
				xAlert: alert_x,
				yAlert: alert_y
			});
		});
		
		//Test if the user can effectively modify the alert
		//(ie verify he has all the required permissions)
		this.intersections.checkIfUserCanEdit(alertCoords, function(res){
			var alertIds = self.getIdsRows(selectedRows);
			$("#changestatus-alerts-id").val(alertIds);
			
			self.statusDialogDiv.dialog("open");	
		});
	},
	
	closeStatusPanel: function() {
		this.statusDialogDiv.dialog("close");
		//This will evventually call the closeStatusDialogCallbackFn 
		//and will clean the form and clear the button.
	},
	
	closeStatusDialogCallbackFn: function() {
		//Clean forms
		this.cleanForm($("#data-grid-form-status"));
		
		//Clear button...
		$("#alerts-modify-status").removeClass("btn-active-grid");
	},
	
	/** ****************
	 *  Clean form
	 *  ****************/
	cleanForm: function(form) {
		form.find("input").val("");
		form.find("textarea").val("");
		form.find("select").val(form.find("select option:first").val());
		
	},
	
	/** ****************************************
	 *  Populate update form with data retrieved 
	 *  from selected row into grid
	 *  ****************************************/
	populateUpdateForm: function(row) {
		// Clean Form update
		this.cleanForm($("#data-grid-form-update"));
		
		$("#update-alerts-name").val(row.submitterName);
		$("#update-alerts-email").val(row.submitterEmail);
		$("#update-alerts-id").val(row.idAlert);
		$("#update-alerts-desc").val(row.description);
		$("#update-alerts-type").val(row.alertTypeId);
		
		//Department
		$("#update-alerts-department").val(row.departmentCod);
		
		//Date
		$("#update-alerts-date").val(row.eventDateStr);
		
		$("#update-alerts-phone").val(row.phoneNum);
		$("#update-alerts-mobile").val(row.mobileNum);
		
		//Reset validator
		if (this.validatorFormUpdate) {
			this.validatorFormUpdate.reset();
		}
		
	},
	
	/** ******************************************
	 *  Remove vector features from alerts layer
	 *  ******************************************/
	remove: function(toClean) {
		if (this.vLayer != null) {
			if(toClean) {
				this.vLayer.removeAllFeatures();
			}
			else {
				this.vLayer.setVisibility(false);
			}
		}
	},
	
	/** ************************************************************ 
	 * 	Disable modify controls
	 * 	- Deactivate controls
	 * 	- redraw original feature on vLayer (as before enable modify)
	 * 	- remove features on vLayerEdit
	 * *************************************************************/
	disableModifyControls: function() {
		controls.alerts.deactivate();
		
		var listFeatToDisplay = this.vLayer.getFeaturesByAttribute("idAlert", parseInt($("#update-alerts-id").val()));
		$.each(listFeatToDisplay, function(index, feature){
			feature.renderIntent = 'default';
			alerts.vLayer.drawFeature(feature);
		});
		
		this.vLayerEdit.removeAllFeatures();
		
		//return;
	},
	
	/** **************
	 *  Save data form
	 *  **************/
	saveData: function(form) {
		var action = form.data("action");
		
		switch(action) {
		case "insert":
			
			var isValid = this.validatorFormInsert.valid();
			if (!isValid) {
				return;
			}
			
			var dataForm = this.getDataFormInsert();
			
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
			} else if (Utils.isEmpty(dataForm.departmentId)) {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("Advanced_Alerts_FormHeader_Insert"),
					LocaleManager.getKey("Advanced_Alerts_Insert_No_Department")
				);
				return;
			}
			
			/*
			 * Test that the inserted point falls inside the selected department...
			 */
			var pointGeom = OpenLayers.Geometry.fromWKT(dataForm.wktGeometry);
			AlertsIntersectionUtils.performDepartmentsIntersection(pointGeom, dataForm.departmentId, function(){
				// Save data for insert
				alerts.requests.save(action, dataForm);
			});
			break;
			
		case "update":
			
			var isValid = this.validatorFormUpdate.valid();
			if (!isValid) {
				return;
			}
			
			var dataForm = this.getDataFormUpdate();
			
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
			} else if (Utils.isEmpty(dataForm.departmentId)) {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("Advanced_Alerts_FormHeader_Insert"),
					LocaleManager.getKey("Advanced_Alerts_Insert_No_Department")
				);
				return;
			}
			
			/*
			 * Test that the inserted point falls inside the selected department...
			 */
			var pointGeom = OpenLayers.Geometry.fromWKT(dataForm.wktGeometry);
			AlertsIntersectionUtils.performDepartmentsIntersection(pointGeom, dataForm.departmentId, function(){
				// Save data for update
				alerts.requests.save(action, dataForm);
			});
			break;
		}
	},
	
	/** *******************
	 *  GET DATA FORMS
	 *  - Insert
	 *  - Update
	 *  ******************/
	getDataFormInsert: function() {
		var feature = alerts.vLayerEdit.features[0];
		
		if (Utils.isNullOrUndefined(feature)) {
			return;
		}
		
		var cloneFeatGeom = feature.geometry.clone();
		var data = new Object();
		data.wktGeometry = Utils.getGeomWKT(cloneFeatGeom.transform(
			new OpenLayers.Projection(feature.layer.projection.projCode),
			new OpenLayers.Projection(Utils.getDefaultDbEPSG())
		));
		
		data.submitterName = $("#insert-alerts-name").val();
		data.submitterEmail = $("#insert-alerts-email").val();
		//data.title = $("#insert-alerts-title").val();
		data.description = $("#insert-alerts-desc").val();
		data.alertTypeId = $("#insert-alerts-type option:selected").val();
		data.geometryType = Utils.getGeomType(feature.geometry.CLASS_NAME.split(".")[2]);
		data.departmentId = $("#insert-alerts-department option:selected").val();
		
		data.departmentName = $("#insert-alerts-department option:selected").text();
		data.departmentCod = data.departmentId;
		
		var dateTmp = $("#insert-alerts-date").val();
		if (!Utils.isEmpty(dateTmp)) {
			data.eventDateStr = dateTmp;	
		}
		else {
			data.eventDateStr = null;
		}
		
		data.phoneNum = $("#insert-alerts-phone").val();
		data.mobileNum = $("#insert-alerts-mobile").val();
				
		return data;
	},

	getDataFormUpdate: function() {
		var feature = alerts.vLayerEdit.features[0];
		
		if (Utils.isNullOrUndefined(feature)) {
			return;
		}
		
		var cloneFeatGeom = feature.geometry.clone();
		var data = new Object();
		data.wktGeometry = Utils.getGeomWKT(cloneFeatGeom.transform(
			new OpenLayers.Projection(feature.layer.projection.projCode),
			new OpenLayers.Projection(Utils.getDefaultDbEPSG())
		));
		
		data.submitterName = $("#update-alerts-email").val();
		data.submitterEmail = $("#update-alerts-email").val();
		data.description = $("#update-alerts-desc").val();
		data.idAlert = $("#update-alerts-id").val();
		data.alertTypeId = $("#update-alerts-type option:selected").val();
		data.geometryType = Utils.getGeomType(feature.geometry.CLASS_NAME.split(".")[2]);
		data.departmentId = $("#update-alerts-department option:selected").val();
		
		data.departmentName = $("#update-alerts-department option:selected").text();
		data.departmentCod = data.departmentId;
		
		var dateTmp = $("#update-alerts-date").val();
		if (!Utils.isEmpty(dateTmp)) {
			data.eventDateStr = dateTmp;	
		}
		else {
			data.eventDateStr = null;
		}
		
		data.phoneNum = $("#update-alerts-phone").val();
		data.mobileNum = $("#update-alerts-mobile").val();
		
		return data;
	},
	
	refreshButtonsAndGeoms: function() {
		// Toggle status of header grid buttons
		// depending if there is one or more selected rows
		alerts.toggleModifyButton();
		alerts.toggleStatusButton();
		
		var rows = Utils.getSelectedRow(alerts.dataT);
		alerts.selectGeomsOnMap(rows);
	},
	
	addFilterToDatagrid: function(idAlert) {
		this.dataTablesFilter = {
				idAlert: idAlert
		};
		this.reloadGrid(null, true);
	},
	
	removeFilterFromDataGrid: function() {
		this.dataTablesFilter = null;
		this.reloadGrid(null, true);
		
	},
	
	/** *******************
	 * 	Init DataTable Grid
	 *  *******************/
	initGrid: function() {
		if(this.fullPanel != null) {
			if(this.dataT == null) {
				this.dataT = this.grid
				.on('search.dt', function (e) { 
					Utils.deselectAllVisibleRows(alerts.dataT);
					alerts.refreshButtonsAndGeoms();
				}).dataTable({
					"serverSide": true,
			        "scrollY": "140px",
			        "scrollX": true,
			        "processing": true,
			        //"scrollCollapse": true,
			        "paginationType": "full",
		        	"ajax": function (data, callback, settings) {	        		
		        	    
		        		var callUrl = "./alerts?oper=getAll";
		        		
		        		var filterEnabled = false;
		        		if (alerts.dataTablesFilter != null) {
		        			filterEnabled = true;
		        			callUrl += "&idAlert=" + alerts.dataTablesFilter.idAlert;
		        		} 
		        		
		        		Utils.ajaxCall(callUrl, "get", "json", data, function(response){
		        	    	var data = response.result;
		        	    	callback(data);
		    				
		    				var rowNum = Utils.getNumberOfRows(alerts.dataT);
		    				if (filterEnabled && rowNum === 1) {
		    					alerts.grid.find("tbody tr").trigger("click");
		    				}
		    				else {
		    					
		    					alerts.toggleModifyButton();
			    				alerts.toggleStatusButton();		    					
		    				}
		    				
		        	    });
		        	},
			        "columns": [
			            { "data": "idAlert", "name": "idAlert", "title": "ID", "sortable": "false", "visible": false},
			            { "data": "currentStatusCod", "name": "currentStatusCod", "title": "Cod. Status", "sortable": false, "visible": false },
			            { "data": "currentStatusName", "name": "currentStatusName", "title": LocaleManager.getKey("Advanced_Alerts_Label_Status"), "sortable": true },
			            { "data": "description", "name": "description", "title": LocaleManager.getKey("Advanced_Alerts_Label_Form_Desc"), "sortable": true, "width": "250px"},
			            { "data": "alertTypeName", "name": "alertTypeName", "title": LocaleManager.getKey("Advanced_Alerts_Label_Form_Type"), "sortable": true },
			            { "data": "submitterName", "name": "submitterName", "title": LocaleManager.getKey("Advanced_Alerts_Label_Form_Name"), "sortable": true },
			            { "data": "submitterEmail", "name": "submitterEmail", "title": LocaleManager.getKey("Advanced_Alerts_Label_Form_Email"), "sortable": true },
			            { "data": "referenceCode", "name": "referenceCode", "title": LocaleManager.getKey("Advanced_Alerts_Label_Reference_Code"), "sortable": true },
			            { "data": "insertTime", "name": "insertTime", "title": LocaleManager.getKey("Advanced_Alerts_Label_Insert_Time"), "sortable": true, "width": "200px" }
			            
			        ],
			        "language": {
		                "url": "scripts/locale/datatable/dt_" + LocaleManager.locale + ".lang"
		            },
		            "order": [[ 8, "desc"]]
			    });
				//Default order by insertTime desc
				
				// Click event on table row
				this.grid.find("tbody").on('click', 'tr', function(e){ 
					if($(this).hasClass('selected')) {
						$(this).removeClass('selected');
					}
					else {
						if (!e.ctrlKey) {
							alerts.grid.find("tbody tr").removeClass("selected");
						}
						$(this).addClass('selected');
					}
					
					alerts.refreshButtonsAndGeoms();
				});
			}
		}
		
		return this.dataT;
	},
	
	loadGeomFromKMLToggled: function() {
		var isShown = $("#insert-alerts-uploadkml-div").is(":visible");
		if (isShown) {
			$("#insert-alerts-uploadkml-div").hide();
		}
		else {
			$("#insert-alerts-uploadkml-div").show();
		}
	},
	
	chooseKMLFile: function() {
		/*
		 * This will populate the TEXT with the filename
		 * And will create a "INPUT" of type FILE (choose file dialog).
		 * The id of this input will be  "insert-alerts-uploadkml-input-file"
		 */
		new KmlUploader().chooseFile($('#insert-alerts-uploadkml-input-file-text'), "insert-alerts-uploadkml-input-file");
	},
	
	uploadKMLFile: function() {
		var data = new Object();
		data.fileInput = $("#insert-alerts-uploadkml-input-file");
		data.projection = $("#insert-alerts-uploadkml-select-proj").val();
		data.extractStyles = false;
		data.extractAttributes = false;
		
		new KmlUploader().getFeaturesFromKML(data,
			function(features) {
				//alert('oooooorayy, got the feats');
				alerts.vLayerEdit.removeAllFeatures();
				alerts.vLayerEdit.addFeatures(features);
				
				var bounds = alerts.vLayerEdit.getDataExtent();
				map.zoomToExtent(bounds);
				
		}, function(){
				alert('fail');
		});
	},
	
	/** ***********************************************************
	 *  Toggle alerts modify button (enable/disable) into datatable
	 *  depending on number of selected rows
	 *  ***********************************************************/
	toggleModifyButton: function() {
		var selectedRows = Utils.getSelectedRow(this.dataT);
		if( selectedRows.length == 1){
			// Disable modify row button
			$("#alerts-modify").removeClass("btn-grid-disable");
		}
		else {
			// Enable modify row button
			$("#alerts-modify").addClass("btn-grid-disable");
		}
	},
	
	/** ********************************************
	 *  Toggle alerts modify status (button on grid)
	 *  depending on number of selected rows
	 *  ********************************************
	 */
	toggleStatusButton: function() {
		var selectedRows = Utils.getSelectedRow(this.dataT);
		if(selectedRows.length > 0) {
			$("#alerts-modify-status").removeClass("btn-grid-disable");
			$("#alerts-zoom-selected").removeClass("btn-grid-disable");
		}
		else {
			$("#alerts-modify-status").addClass("btn-grid-disable");
			$("#alerts-zoom-selected").addClass("btn-grid-disable");
			
			this.closeStatusPanel();
		}
			
	},
	
	/** ******************
	 *  Reload geoms alert
	 *  ******************/ 
	reloadGeoms: function(autoZoom) {
		this.remove(true);
		this.requests.getGeoms(autoZoom);
	},
 	
	/** *********************
	 *  Reload datatable data
	 *  *********************/
	reloadGrid: function(callback, resetPaging) {
		this.dataT.api().ajax.reload(callback, resetPaging);
	},
	
	/**
	 *  Unselect all selected grid rows
	 */
	unselectRowsGrid: function() {
		if(alerts.grid != null)
			alerts.grid.find("tbody tr").removeClass("selected");
		return;
	},
	
	downloadZip: function() {
		//Retrieve data (layername, username, password) to access the download functionality
		//var token = $("#alerts-download").data("token");
		var layerName = $("#alerts-download").data("layer_name");
		var userName = $("#alerts-download").data("username");
		var password = $("#alerts-download").data("password");
		
		var dateMin = $("#download-alerts-datefrom").val();
		var dateMax = $("#download-alerts-dateto").val();
		
		this.requests.doDownload(layerName, userName, password, dateMin, dateMax);
	},
	
	/** *****************
	 *  Alerts Requests
	 *  *****************/   
	requests: {
		/**
		 * Get alerts list from DB
		 */
		getGeoms: function(autoZoom) {
			Utils.ajaxCall("./alerts", "POST", "json", {
				oper: "getGeoms"
			}, function(response) {
				if(response.success) {
					var features = Utils.getFeaturesFromList(response.result, null, ["epsg", "idAlert", "currentStatusCod"]);
					if (features.length > 0) {
						// Add redline feature to vector layer
						alerts.vLayer.addFeatures(features);
						
						if(autoZoom) {
							// If autoZoom is true fit map to added features bound
							map.zoomToExtent(alerts.vLayer.getDataExtent());
						}
					}						
				} else {
					AlertDialog.createOkDefaultDialog(
						LocaleManager.getKey("AlertDialog_Error_Title"), 
						response.msg
					);
				}
			});
		},
		
		/**
		 * Save alerts to db
		 */
		save: function(oper, data) {						
			Utils.ajaxCall("./alerts", "POST", "json", {
				oper: oper,
				data: JSON.stringify(data)
			}, function(response){
				alerts.reloadGeoms(false);
				alerts.reloadGrid(null, false);
				alerts.doAction("viewgrid");
			});
		},
		
		doDownload: function(layerName, userName, password, dateMin, dateMax) {
			
			/*
			 * Need to convert the dates from dd-mm-yy to yy-mm-dd
			 * Using datejs library
			 * @see http://stackoverflow.com/questions/8040771/how-to-change-date-format-in-javascript
			 * @see http://datejs.com/test/parseExact/index.html
			 */
			if (Utils.isNotEmpty(dateMin)) {
				var dateMinTemp = Date.parseExact(dateMin, "dd-MM-yyyy");	
				dateMin = dateMinTemp.toString("yyyy-MM-dd");
			}
			
			if (Utils.isNotEmpty(dateMax)) {
				var dateMaxTemp = Date.parseExact(dateMax, "dd-MM-yyyy");	
				dateMax = dateMaxTemp.toString("yyyy-MM-dd");
			}
			
			var DATE_FIELD_NAME = 'insert_time';
			//var FEATURE_NAME = 'icf:vw_alerts_publish';
			var FEATURE_NAME = layerName;
			var OUTPUT_FORMAT = 'SHAPE-ZIP';
			
			/* **********************
			 * Handling Filtering...
			 * *********************/
			var helper = new AlertDownloadFilterHelper();
			
			var filterXML = null;
			
			//var filterOL = helper.createDateFilterOL('2011-04-01Z00:00:00Z', '2020-04-01Z00:00:00Z', DATE_FIELD_NAME);
			var filterOL = helper.createDateFilterOL(dateMin, dateMax, DATE_FIELD_NAME);
			var doFilter = false;			
			if (filterOL != null) {
				doFilter = true;
				var filterVersion = "1.1.0";
				
				//Constructing XML from the filterOL OpenLayers object
				var node =  new OpenLayers.Format.Filter({
						version : filterVersion
					}).write(filterOL);
				filterXML = new OpenLayers.Format.XML().write(node);
			}
			
			//Execute call for a getFeature (GET)
			var url = GEOSERVER_URL + "/icf/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + FEATURE_NAME + "&outputFormat=" + OUTPUT_FORMAT;
			
			//If filter is present, add the condition to URL
			if (doFilter) {
				url = url + "&filter=" + encodeURIComponent(filterXML);
			}
			
			var encodedUrl = encodeURIComponent(url);
			
			//This is used for Proxy Auth.
			var auth = "&user=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password) + "&single=true";
			
			//generate SALT
			//Not sure if it works
			var salt = "&_salt=" + Math.random();
			auth += salt;
			
			window.location.assign(OL_PROXY_URL + encodedUrl + auth);
			
			//Go to main page
			alerts.doAction('viewgrid');
		},
		
		/** 
		 * Get alert by ReferenceCode for verification
		 */
		getAlertByRefCodeForVerification: function(referenceCode) {
			Utils.ajaxCall("./alerts", "POST", "json", {
				oper: "getGeomByReferenceCode",
				referenceCode : referenceCode
			}, function(response){
				var data = response.result;
				alerts.detailPanel.openAndPopulateFromData(data);
			}, function() {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					LocaleManager.getKey("Advanced_Alerts_Alert_VerifyByRefCodeInvalid")
				);
				return;
			});
		}
	},
	
	/** ***************************
	 *  Clean alerts controls
	 *  Disable all alerts functions
	 *  - Hide layer
	 *  - Disable controls
	 *  ***************************/
	cleanControls: function() {	
		// Remove all features alerts layer
		this.remove();
		
		// Deactivate controls
		controls.alerts.deactivate();
	},
	
	/** ***********************
	 *  Init vector layers 
	 *  - view alerts
	 *  - modify alerts
	 *  ***********************/
	initLayers: function() {
		this.vLayer = this.initLayer("alerts");
		this.vLayerEdit = this.initLayer("alertsedit");
		
		map.addLayer(this.vLayer);
		map.addLayer(this.vLayerEdit);
		
		
		StyleManager.readSLD("alerts.sld", "alerts_sld", function(alertStyles) {
			//VLayer   
			alerts.vLayer.styleMap.styles["select"] = StyleManager.getStyleByName(alertStyles, "alerts_selected");
			alerts.vLayer.styleMap.styles["hidden"] = StyleManager.getStyleByName(alertStyles, "alerts_hidden");
			alerts.vLayer.styleMap.styles["default"] = StyleManager.getDefaultStyle(alertStyles);
			
			//VLayerEdit
			alerts.vLayerEdit.styleMap.styles["select"] = StyleManager.getStyleByName(alertStyles, "alerts_selected");
			alerts.vLayerEdit.styleMap.styles["hidden"] = StyleManager.getStyleByName(alertStyles, "alerts_hidden");
			alerts.vLayerEdit.styleMap.styles["default"] = StyleManager.getDefaultStyle(alertStyles);
			
		});
	},
	
	initLayer: function(name) {
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
	},
	
	zoomToLayer: function() {
		if(this.vLayer != null) {
			map.zoomToExtent(this.vLayer.getDataExtent());
		}		
		return;
	},
	
	zoomToSelected: function() {
		var selectedRows = Utils.getSelectedRow(alerts.dataT);
		if (selectedRows.length == 0) return;
		
		var idAlert = selectedRows[0].idAlert;
		var selectedFeat = null;
		$.each(this.vLayer.features, function(index, feat){
			if (feat.attributes.idAlert === idAlert) {
				selectedFeat = feat;
				return false;
			}
		});
		
		if (!Utils.isNullOrUndefined(selectedFeat)) {
			//map.zoomToExtent(selectedFeat.geometry.getBounds(), closest=true);
			map.panTo(selectedFeat.geometry.getBounds().getCenterLonLat());
			map.zoomTo(10);
		}
	},
	
	/** *****************************************
	 *  Select Geom On map from selected grid row
	 *  *****************************************/
	selectGeomsOnMap: function(rows) {
		var idsFeatRows = [];
		$.each(rows, function(index, row){
			idsFeatRows.push(row.idAlert);
		});
		
		// Clean style selected of all features 
		// Add style selected to feature of selected grid row
		$.each(this.vLayer.features, function(index, feat){
			feat.renderIntent = "default";
			if(Utils.isInArrayAsBool(feat.attributes.idAlert, idsFeatRows))
				feat.renderIntent = "select";
			
			alerts.vLayer.drawFeature(feat);
		});
	},
	
	/** ****************************************
	 * Select feature for modify
	 * - hide feature on vLayer
	 * - load feature to vLayerEdit (for modify)
	 * ****************************************/
	selectFeatureAlertForModify: function(feature) {		
		// Hide feature on vLayer alerts
		feature.renderIntent = 'hidden';
		this.vLayer.drawFeature(feature);
		
		// Add feature to edit layer
		var newFeature = Utils.createCloneFeature(feature);
		newFeature.renderIntent = 'select';
		this.vLayerEdit.addFeatures([newFeature]);
		this.vLayerEdit.drawFeature(newFeature);
		
		// Set same attributes of original feature of vLayer
		// to new feature on vLayerEdit
		Utils.setAttributesFeature(newFeature, feature.attributes);
		
		return;
	},
	
	/** ************************************************************
	 *  Enable/Disable modify geometry (update same geometry) 
	 *  ************************************************************/
	toggleEditModifyGeom: function(controlBtn) {
		if(controlBtn.hasClass("btn-active")) {
			this.modifyGeomActive = false;
			controls.alerts.deactivate(controlBtn);
			
			//Highlight the feature even if the Modify control is turned off.
			var listFeatToDisplay = this.vLayer.getFeaturesByAttribute("idAlert", parseInt($("#update-alerts-id").val()));
			
			this.selectFeatureAlertForModify(listFeatToDisplay[0]);
			return;
		}
		else {
			this.modifyGeomActive = true;
			this.changeGeomActive = false;
			controls.alerts.activate(controlBtn);
		}
	},
	/** *******************************************
	 *  Enable/Disable insert geometry controls 
	 *  - point
	 *  - line
	 *  - polygon 
	 *  *******************************************/
	selectGeomType: function(controlBtn) {
		if(controlBtn.hasClass("btn-active")) {
			controls.alerts.deactivate(controlBtn);
			//return false;
		}
		controls.alerts.activate(controlBtn);
	},
	
	/** ***************
	 *  STATUS ALERTS
	 *  ***************/
	status: {
		change: function(button) {
			//var selectedRows = Utils.getSelectedRow(alerts.dataT);
			var selectedAlerts = $("#changestatus-alerts-id").val();
			
			//Remove beginning and ending double quotes
			var selectedAlertIds = selectedAlerts.split(",");
			for(var i=0; i<selectedAlertIds.length; i++) { 
				selectedAlertIds[i] = +selectedAlertIds[i]; 
			}
			
			var data = new Object();
				data.status = button.data("status");
				//data.alertIds = this.getIdsRows(selectedRows);
				data.alertIds = selectedAlertIds;
				data.note = $("#alerts-status-note").val();

			Utils.ajaxCall("./alerts", "POST", "json", {
				oper: "changeStatus",
				status: data.status,
				alertIds: JSON.stringify(data.alertIds),
				note: data.note
				//data: JSON.stringify(data)
			}, function(response) {
				alerts.closeStatusPanel();
				alerts.reloadGrid();
			});
		},
	},
	
	/** *************
	 *  Init Alerts
	 *  *************/
	initFullPanel: function() {
		if(this.fullPanel == null) {
			this.fullPanel = $("#full-advance-alerts-panel");
			//this.fullPanelHeader = $("#full-advance-alerts-panel-header");
			this.fullPanelGridContainer = this.fullPanel.find(".data-grid-container");
			this.fullPanelInsertContainer = this.fullPanel.find("#data-grid-form-insert");
			this.fullPanelUpdateContainer = this.fullPanel.find("#data-grid-form-update");
			this.fullPanelDownloadContainer = this.fullPanel.find("#data-grid-form-download");
			
			this.grid = this.fullPanel.find(".data-grid");
			
			var dialogOptions = {
				closeFn: function() {
					alerts.closeDialogCallbackFn();
				},
				height: this.panelSizes.fullPanelViewGrid.height,
				width: this.panelSizes.fullPanelViewGrid.width,
				resizable: false,
				modal: false,
				extensions: true,
				collapsable: true
			};
				
			this.fullPanelDialogDiv = DialogUtils.renderDialog(LocaleManager.getKey("Advanced_Panel_Alerts"), {}, dialogOptions, this.fullPanel);
			
			this.formInsert = $("#data-grid-form-insert");
			this.validatorFormInsert = new Validate({
				form: this.formInsert
			});
			
			this.formUpdate = $("#data-grid-form-update");
			this.validatorFormUpdate = new Validate({
				form: this.formUpdate
			});
			
			this.formDownload = $("#data-grid-form-download");
			
			// Populate combobox type alerts
			Utils.ajaxCall("./generalData", "POST", "json", {
				oper: "get",
				object: "alertTypes"
			}, function(response) {
				Utils.populateComboWithEmpty($("#insert-alerts-type"), response.result, "idAlertType", "name");
				Utils.populateComboWithEmpty($("#update-alerts-type"), response.result, "idAlertType", "name");
			});

			/*
			 * Department combobox populated via WFS fetch
			 */
			GetFeaturesUtils.getValueListFromWFS({
				url: alerts.intersections.config.department.layerUrl,
				typeName: alerts.intersections.config.department.layerName,
				propertyName: [alerts.intersections.config.department.keyColumnName, alerts.intersections.config.department.descColumnName]
			},function(responseList){
				Utils.populateComboWithEmpty($("#insert-alerts-department"), responseList, "id", "name");
				Utils.populateComboWithEmpty($("#update-alerts-department"), responseList, "id", "name");
			}, function() {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("POPPO"), 
					LocaleManager.getKey("POPPO")
				);
				return;
			});	
		}
		
		//Init Change status dialog
		var changeStatusDialogOptions = {
				closeFn: function() {
					alerts.closeStatusDialogCallbackFn();
				},
				height: this.panelSizes.changeSizePanel.height,
				width: this.panelSizes.changeSizePanel.width,
				resizable: false
				//modal: true
			};
		
		this.statusDialogDiv = DialogUtils.renderDialog(LocaleManager.getKey("Advanced_Alerts_FormHeader_Status"), {}, changeStatusDialogOptions, $("#data-grid-form-status"));
		
		// Init Alerts download datepickers
		$("#download-alerts-datefrom").datepicker({
			changeMonth: true,
			onClose: function( selectedDate ) {
				$( "#download-alerts-dateto" ).datepicker( "option", "minDate", selectedDate );
			},
			dateFormat: LocaleManager.getDateFormat() //"yy-mm-dd"
		});
		$("#download-alerts-dateto").datepicker({
			changeMonth: true,
			onClose: function( selectedDate ) {
				$( "#download-alerts-datefrom" ).datepicker( "option", "maxDate", selectedDate );
			},
			dateFormat: LocaleManager.getDateFormat() //"yy-mm-dd"
		});
		
		//Init download buttons
		$("#data-grid-download-submit").button();
		$("#data-grid-download-cancel").button();
		
		
		// Init vLayerEdit if not inizialized
		if(this.vLayer == null && this.vLayerEdit == null) {
			this.initLayers();
			
			this.requests.getGeoms(true);
		}
		else
			this.vLayer.setVisibility(true);
		
		if(this.dataT == null) {
			this.initGrid();
		}
		else {
			this.reloadGrid(null, true);
		}
		
	},
	
	initSimplePanel: function() {
		if(this.simplePanel == null) {
			this.simplePanel = $("#simple-advance-alerts-panel");
			this.simpleInsertPanel = new SimpleAlertInsertForm($("#alert-simple-panel-insert"));
			this.detailPanel = new SimpleAlertDetailForm($("#alert-simple-panel-detail"));
			
			//Jquery-fy the buttons
			$("#alert-insert-new-btn").button();
			$("#alert-verify-btn").button();
		}
		
		//Init OL
		if(this.vLayer == null && this.vLayerEdit == null) {
			this.initLayers();
		}
		else {
			this.vLayer.setVisibility(true);
		}
	},
	
	/*
	 * INIT INTERSECTIONS
	 */
	intersections : {
		
		checkIfUserCanEdit: function(alertCoords, callbackFn) {
			Utils.ajaxCall("./alerts", "POST", "json", {
				oper: "checkIfUserCanEdit",
				alertCoords: JSON.stringify(alertCoords)
//				alert_x: alert_x,
//				alert_y: alert_y
			}, function(response) {
				if (Utils.isTrue(response.result)) {
					callbackFn();
				}
				else {
					AlertDialog.createOkDefaultDialog(
						LocaleManager.getKey("Advanced_Alerts_FormHeader_Update"), 
						LocaleManager.getKey("Advanced_Alerts_NoUpdatePermission_For_Department")
					);
					return;
				}
			});
		},
		
		initIntersections: function(callbackFn) {
			/*
			 * Check if the intersection configuration is already configured
			 */
			if (!Utils.isNullOrUndefined(alerts.intersections.config)) {
				//Already initialized
				callbackFn();
				return;
			}
			
			Utils.ajaxCall("./alerts", "POST", "json", {
				oper: "getAlertsIntersectionConfigurationForUser"
			}, function(response) {
				alerts.intersections.config = response.result;
				callbackFn();
			});
		},
		
		config : null
	}
};