var mSources = {
	pForm: null,
	dtPanel: null,
	dt: null,
	validForm: null,
	
	
	// Init WMS Layer Sources admin page
	init: function() {	
		if(this.dtPanel == null) {
			this.dtPanel = $("#sources-dt");
			this.initDt();
		}
		
		if(this.pForm == null ) {
			this.pForm = $("#form-dialog");	
			this.validForm = new Validate({
				form: this.pForm
			});	
		}
	},

	createAddFormPanel: function() {
		if(this.validForm) {
			this.validForm.reset();
		}
		
		$("#form-dialog-header").data("locale_key", "Manager_Sources_HeaderForm_Add");
		LocaleManager.refreshLocalizedElement($("#form-dialog-header"));
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			//Utils.closeDialogForm(mSources.pFormAddGroup);
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Save')] = function(){
			var valid = mSources.validForm.valid();
			if (!valid) {
				return;
			}
			
			var sourceValues = mSources.getSourceDataForm();
			mSources.requests.insertSource(sourceValues);			
			
			$(this).dialog("close");
		};
		
		DialogUtils.renderDialog(LocaleManager.getKey("General_TitleForm"), buttons, {
			modal: false,
			resizable: false,
			height: 320,
			width: 400,
			closeFn: function() {
				Utils.cleanForm(this.pForm);
			}
		}, this.pForm);
		
		return this.pForm;
	},
	
	createUpdateFormPanel: function() {
		$("#form-dialog-header").data("locale_key", "Manager_Sources_HeaderForm_Update");
		LocaleManager.refreshLocalizedElement($("#form-dialog-header"));
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			//Utils.closeDialogForm(mMaps.pFormAddGroup);
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Save')] = function(){
			var valid = mSources.validForm.valid();
			if (!valid) {
				return;
			}
			
			var sourceValues = mSources.getSourceDataForm();
			
			mSources.requests.updateSource(sourceValues);			
			
			$(this).dialog("close");
		};
		
		DialogUtils.renderDialog(LocaleManager.getKey("General_TitleForm"), buttons, {
			modal: false,
			resizable: false,
			height: 320,
			width: 400,
			closeFn: function() {
				Utils.cleanForm(this.pForm);
			}
		}, this.pForm);
		
		return this.pForm;
	},
	
	// Init list of sources (datatable)
	initDt: function() {
		if(this.dt == null) {
			this.dt = this.dtPanel
			.on('search.dt', function (e) { 
				Utils.deselectAllVisibleRows(mSources.dt);
				mSources.toggleButtonsOnSelect();
			}).dataTable({
				"dom": '<"toolbar">frtp',
				"serverSide": false,
		        "scrollY": "500px",
		        "scrollX": true,
		        "processing": true,
		        "scrollCollapse": true,
		        "paginationType": "full",
	        	"ajax": function (data, callback, settings) {	        		
	        	    Utils.ajaxCall("./layerConfig?oper=layerSources", "get", "json", data, function(response){
	        	    	var data = response.result;
	        	    	callback(data);
	        	    });
	        	},
		        "columns": [
		            { "data": "idLayerSource", "name": "idLayerSource", "title": "ID", "sortable": false, "visible": false},
		            { "data": "layerSourceName", "name": "layerSourceName", "title": LocaleManager.getKey("Manager_Sources_Grid_Name"), "sortable": true, "visible": true },
		            { "data": "layerSourceDescription", "name": "layerSourceDescription", "title": LocaleManager.getKey("Manager_Sources_Grid_Description"), "sortable": true, "visible": true },
		            { "data": "url", "name": "url", "title": "url", "sortable": false, "visible": false },
		            { "data": "cacheUrl", "name": "cacheUrl", "title": "cacheUrl", "sortable": false, "visible": false },
		            { "data": "addToExternalWmsList", "name": "addToExternalWmsList", "title": LocaleManager.getKey("Manager_Sources_Label_AddToExternalWmsList"), "sortable": false, "visible": true,
		            	"render": function ( data, type, row ) {
		            		//return mSources.getAddExternalWmsListIcon(data);
		            		return AdminUtils.getGridIconForBoolean(data);
		            }}
		        ]
	        	,
		        "language": {
	                "url": "scripts/locale/datatable/dt_" + LocaleManager.locale + ".lang"
	            },
	            "paginate": false
		    });
			
			mSources.toggleButtonsOnSelect();
			this.dt.find("tbody").on('click', 'tr', function(e){				
				if($(this).hasClass('selected')) {
					$(this).removeClass('selected');
				}
				else {
					mSources.dt.find("tbody tr").removeClass("selected");
					$(this).addClass('selected');					
				}
				mSources.toggleButtonsOnSelect();
			});
		}
	},
	
//	getAddExternalWmsListIcon: function(active) {
//		if(active)
//			//icon = "fa fa-times fa-2x";
//			icon = "fa fa-check-circle fa-2x";
//		else
//			//icon = "fa fa-check fa-2x";
//			icon = "fa fa-check-circle-o fa-2x";
//		
//		var iconActive = '<div><i class="'+ icon +'"></i></div>';
//		return iconActive;
//	},
	
	// Enable proper button to enable/disable layerSource
	toggleButtonsOnSelect: function() {
		var selectedRow = Utils.getSelectedRow(this.dt)[0];
		if (!Utils.isNullOrUndefined(selectedRow)) {
			$("#sources-delete").show();
			$("#sources-update").show();
		}
		else  {
			$("#sources-delete").hide();
			$("#sources-update").hide();
		}
	},
	
	// Open dialog form insert source
	openAddForm: function() {
		this.createAddFormPanel();
		Utils.cleanForm(this.pForm);
		this.pForm.dialog("open");
	},
	
	openUpdateForm: function() {
		this.createUpdateFormPanel();
		Utils.cleanForm(this.pForm);
		
		var selectedRow = Utils.getSelectedRow(this.dt)[0];
		this.populateDataForm(selectedRow);
		
		this.pForm.dialog("open");
	},
	
	openDialogConfirmDelSource: function(idSource, message) {
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Confirm')] = function(){
			var idSource = $(this).data("sourceId");
			if ( idSource != null )
				mSources.requests.deleteSource(true);
			
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).data("sourceId") != null;
			$(this).dialog("close");
		};
		
		var deleteDialogConfirm = AlertDialog.buildDialog({
			isToCreate: true,
			title: LocaleManager.getKey("General_MsgConfirmTitle"),
			message: message, 
			type: "question",
			buttons: buttons
		});
		
		deleteDialogConfirm.data({"sourceId": idSource});
		deleteDialogConfirm.dialog("open");		
	},
	
	getSourceDataForm: function() {
		var source = new Object();
		source.id = $("#sources-input-id").val();
		source.name = $("#sources-input-name").val();
		source.description = $("#sources-input-description").val();
		source.url = $("#sources-input-url").val();
		source.cacheUrl = $("#sources-input-cacheurl").val(); 
		source.addToExternalWmsList = $("#sources-input-add-to-external-wmslist").is(":checked");
		
		return source;
	},
	
	populateDataForm: function(selectedRow) {
		$("#sources-input-id").val(selectedRow.idLayerSource);
		$("#sources-input-name").val(selectedRow.layerSourceName);
		$("#sources-input-description").val(selectedRow.layerSourceDescription);
		$("#sources-input-url").val(selectedRow.url);
		$("#sources-input-cacheurl").val(selectedRow.cacheUrl); 
		$("#sources-input-add-to-external-wmslist").prop('checked', selectedRow.addToExternalWmsList);
	},
	
	reloadGrid: function(callback, resetPaging) {
		this.dt.api().ajax.reload(callback, resetPaging);
	},
	
	requests: {		
		insertSource: function(source) {
			Utils.ajaxCall("./layerConfig", "POST", "json", {
				oper: "addLayerSource",
				name: source.name,
				description: source.description,
				url : source.url,
				cacheUrl: source.cacheUrl,
				addToExternalWmsList: source.addToExternalWmsList
			}, function(response) {				
				if(response.success) {
					mSources.reloadGrid(null, false);
				}
			});
		},
		
		updateSource: function(source) {
			Utils.ajaxCall("./layerConfig", "POST", "json", {
				oper: "updateLayerSource",
				layerSourceId: source.id,
				name: source.name,
				description: source.description,
				url : source.url,
				cacheUrl: source.cacheUrl,
				addToExternalWmsList: source.addToExternalWmsList
			}, function(response) {				
				if(response.success) {
					mSources.reloadGrid(null, false);
				}
			});
		},
		
		deleteSource: function(forceDel) {
			var row = Utils.getSelectedRow(mSources.dt)[0];
			if(row.length == 0) {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					LocaleManaget.getKey("General_No_Dt_Record_Selected")
				);
				
				return;
			}
			
			var layerSourceId = row.idLayerSource;
			Utils.ajaxCall("./layerConfig", "POST", "json", {
				oper: "deleteLayerSource",
				layerSourceId: layerSourceId,
				forceDeletion: forceDel
			}, function(response) {			
				if(response.success) {
					mSources.reloadGrid(null, false);
				}
			}, function(response) {
				if(!Utils.isNullOrUndefined(response.code) && response.code === "EXC_LAYERSOURCE_DELETE_ERROR_LAYERS_USING_LAYERSOURCE") {
					var mess = response.msg + "\n\n" + LocaleManager.getKey("General_MsgConfirm");
					mSources.openDialogConfirmDelSource(layerSourceId, mess);
					return;
				}
				else {
					AlertDialog.createOkDefaultDialog(
						LocaleManager.getKey("AlertDialog_Error_Title"), 
						response.msg,
						"error"
					);
				}
			});		
		}
	}
};