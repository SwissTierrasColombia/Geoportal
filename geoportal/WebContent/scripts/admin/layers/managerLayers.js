var mLayers = {
	pForm: null,
	pFormConfirmDel: null,
	pSelectLayerFromWms: null,
	pSelectLayerFromWmsList: null,
	dtPanel: null,
	dt: null,
	validForm: null,
	referenceDateDatePicker: null,
	
	// Init layer manager page
	init: function() {	
		if(this.dtPanel == null) {
			this.dtPanel = $("#layers-dt");
			this.initDt();
		}
		
		if(this.pForm == null) {
			this.pForm = $("#form-dialog");
			this.validForm = new Validate({
				form: this.pForm
			});	
		}
		
		if( this.pSelectLayerFromWms == null) {
			this.pSelectLayerFromWms = $("#select-layer-fromwms");
			this.pSelectLayerFromWmsList = $("#layer-list-wms");
			
			var wmsDialogButton = {};
			wmsDialogButton[LocaleManager.getKey('General_Cancel')] = function(){
				$(this).dialog("close");
			};
			
			wmsDialogButton[LocaleManager.getKey('General_Save')] = function(){
				var selectedLayers = mLayers.pSelectLayerFromWmsList.find(".layer-item-wms.selected");
				if (selectedLayers.length != 1) {
				} else {
					var selectedLayer = selectedLayers[0];
					mLayers.setLayerInfoFromWMS($(selectedLayer));
					
					//Reset the validator...
					if(mLayers.validForm) {
						mLayers.validForm.reset();
					}
					$(this).dialog("close");
				}
			};
			
			DialogUtils.renderDialog(LocaleManager.getKey("Manager_Layer_TitleForm_DelLayer"), wmsDialogButton, {
				modal: true,
				resizable: false,
				height: 300,
				width: 450,
				closeFn: function() {
					mLayers.pSelectLayerFromWmsList.empty();
				}				
			}, this.pSelectLayerFromWms);
		}
		
		$("#layer-input-opacity").slider({
			max: 10,
			min: 0,
			step: 1,
			slide: function(event, ui) {
				
			}
		}).click(function(e){
			e.stopPropagation();
		});
		
		$("#layer-load-wms").button({
			label: "..."
		});
		
		// Load layers sources
		// Ajax call to get all layers source available
		this.requests.getLayersSources();
	},

	createAddFormPanel: function() {
		
		//Reset validator
		if(this.validForm) {
			this.validForm.reset();
		}
		
		$("#form-dialog-header").data("locale_key", "Manager_Layers_HeaderForm_Add");
		LocaleManager.refreshLocalizedElement($("#form-dialog-header"));
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Save')] = function(){
			mLayers.submitAddLayer();
		};
		
		DialogUtils.renderDialog(LocaleManager.getKey("General_TitleForm"), buttons, {
			modal: true,
			resizable: false,
			height: 470,
			width: 600,
			closeFn: function() {
				Utils.cleanForm(this.pForm);
			}
		}, this.pForm);
		
	},
	
	createUpdateFormPanel: function() {
		$("#form-dialog-header").data("locale_key", "Manager_Layers_HeaderForm_Update");
		LocaleManager.refreshLocalizedElement($("#form-dialog-header"));
		
		//Reset validator
		if(this.validForm) {
			this.validForm.reset();
		}
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Save')] = function(){
			var valid = mLayers.validForm.valid();
			if(!valid) {
				return;
			}
			
			var layerValues = mLayers.getLayerDataForm();
			mLayers.requests.updateLayer(layerValues);			
			
			$(this).dialog("close");
		};
		
		DialogUtils.renderDialog(LocaleManager.getKey("General_TitleForm"), buttons, {
			modal: true,
			resizable: false,
			height: 470,
			width: 600,
			closeFn: function() {
				Utils.cleanForm(this.pForm);
			}
		}, this.pForm);
		
		return this.pForm;
	},
	
	// Init list of Layers (datatable)
	initDt: function() {
		if(this.dt == null) {
			this.dt = this.dtPanel
			.on('search.dt', function (e) { 
				Utils.deselectAllVisibleRows(mLayers.dt);
				mLayers.toggleButtonsOnSelect();
			}).dataTable({
				"dom": '<"toolbar">frtp',
				"serverSide": false,
				"scrollX": true,
		        "scrollY": "500px",
		        "processing": true,
		        "scrollCollapse": true,
		        "paginationType": "full",
	        	"ajax": function (data, callback, settings) {	        		
	        	    Utils.ajaxCall("./layerConfig?oper=layerDetailList", "get", "json", data, function(response){
	        	    	var data = response.result;
	        	    	callback(data);
	        	    });
	        	},
		        "columns": [
		            { "data": "idLayer", "name": "idLayer", "title": "ID", "sortable": false, "visible": false},
		            { "data": "layerName", "name": "layerName", "title":  LocaleManager.getKey("Manager_Layers_Grid_Name"), "sortable": true, "visible": true },
		            { "data": "layerTitle", "name": "layerTitle", "title":  LocaleManager.getKey("Manager_Layers_Grid_Title"), "sortable": true, "visible": true },
		            { "data": "external", "name": "external", "title":  LocaleManager.getKey("Manager_Layers_Label_isExternal"), "sortable": true, "visible": true,
		            	"render": function ( data, type, row ) {
		            		return AdminUtils.getGridIconForBoolean(data);
		            }},
		            { "data": "layerDescription", "name": "layerDescription", "title":  LocaleManager.getKey("Manager_Layers_Grid_Description"), "sortable": true, "visible": true },
		            { "data": "responsible", "name": "responsible", "title":  LocaleManager.getKey("Manager_Layers_Grid_Responsible"), "sortable": true, "visible": true },
		            { "data": "metadataUuid", "name": "metadataUuid", "title":  LocaleManager.getKey("Manager_Layers_Label_MetadataUUID"), "sortable": false, "visible": false },
		            { "data": "layerSourceName", "name": "layerSourceName", "title": LocaleManager.getKey("Manager_Sources_Grid_Name"), "sortable": true, "visible": true},
		            { "data": "mode", "name": "mode", "title": "mode", "sortable": false, "visible": false },
		            { "data": "idLayerSource", "name": "idLayerSource", "title": "idLayerSource", "sortable": false, "visible": false },
		            { "data": "singleTile", "name": "singleTile", "title": LocaleManager.getKey("Manager_Layers_Grid_SingleTile"), "sortable": false, "visible": true,
		            	"render": function ( data, type, row ) {
		            		return AdminUtils.getGridIconForBoolean(data);
		            }},
		            { "data": "baseLayer", "name": "baseLayer", "title": LocaleManager.getKey("Manager_Layers_Grid_Baselayer"), "sortable": false, "visible": true,
		            	"render": function ( data, type, row ) {
		            		return AdminUtils.getGridIconForBoolean(data);
		            }},
		            { "data": "attributeNameForInfo", "name": "attributeNameForInfo", "title": LocaleManager.getKey("Manager_Layers_Grid_AttributeNameForInfo"), "sortable": true, "visible": false},
		            { "data": "sldOverrideEnabled", "name": "sldOverrideEnabled", "title": LocaleManager.getKey("Manager_Layers_Grid_Override_SldUrl"), "sortable": true, "visible": false},
		            { "data": "sldUrl", "name": "sldUrl", "title": LocaleManager.getKey("Manager_Layers_Grid_SldUrl"), "sortable": true, "visible": false},
		            
		            { "data": "wfsUrl", "name": "wfsUrl", "title": LocaleManager.getKey("Manager_Layers_Label_WfsUrl"), "sortable": true, "visible": false},
		            { "data": "wcsUrl", "name": "wcsUrl", "title": LocaleManager.getKey("Manager_Layers_Label_WcsUrl"), "sortable": true, "visible": false},
		            
		            { "data": "cacheEnabled", "name": "cacheEnabled", "title": LocaleManager.getKey("Manager_Layers_Label_CacheEnabled"), "sortable": true, "visible": true,
		            	"render": function ( data, type, row ) {
		            		return AdminUtils.getGridIconForBoolean(data);
		            }},
		            { "data": "wfsSearchEnabled", "name": "wfsSearchEnabled", "title": LocaleManager.getKey("Manager_Layers_Label_WfsSearcheEnabled"), "sortable": true, "visible": true,
		            	"render": function ( data, type, row ) {
		            		return AdminUtils.getGridIconForBoolean(data);
		            }},
		            { "data": "showInfoDialog", "name": "showInfoDialog", "title": LocaleManager.getKey("Manager_Layers_Label_ShowInfoDialog"), "sortable": true, "visible": false},
		            
		            { "data": "downloadable", "name": "downloadable", "title":  LocaleManager.getKey("Manager_Layers_Label_isDownloadable"), "sortable": true, "visible": true,
		            	"render": function ( data, type, row ) {
		            		return AdminUtils.getGridIconForBoolean(data);
		            }}
		        ]
	        	,
		        "language": {
	                "url": "scripts/locale/datatable/dt_" + LocaleManager.locale + ".lang"
	            },
	            "paginate": false
		    });
			
			mLayers.toggleButtonsOnSelect();
			this.dt.find("tbody").on('click', 'tr', function(e){
			
				if($(this).hasClass('selected')) {
					$(this).removeClass('selected');
				}
				else {
					Utils.deselectAllVisibleRows(mLayers.dt);
					$(this).addClass('selected');					
				}
				mLayers.toggleButtonsOnSelect();
			});
		}
	},
	
	// Enable proper button to enable/disable layerSource
	toggleButtonsOnSelect: function() {
		var selectedRow = Utils.getSelectedRow(this.dt)[0];
		if (!Utils.isNullOrUndefined(selectedRow)) {
			$("#layers-delete").show();
			$("#layers-update").show();
		}
		else  {
			$("#layers-delete").hide();
			$("#layers-update").hide();
		}
	},
	
	// Load layers for new insert from wms into combobox
	loadLayersFromWMS: function() {
		var wmsSelectedUrl = $("#layer-select-source").find(":selected").data("url");
		
		doGetCapabilities_JQ(wmsSelectedUrl, function(response){
			mLayers.populateListLayerWms(response.capability.layers);
			mLayers.openDialogSelectLayer();
		}, function(){
			alert("fail");
		});
	},
	
	openDialogSelectLayer: function() {
		this.pSelectLayerFromWms.dialog("open");
		return;
	},
	
	populateListLayerWms: function(layers) {
		this.pSelectLayerFromWmsList.empty();
		
		$.each(layers, function(index, layer){
			var layerItem = mLayers.buildDomLayerWms(layer);
			mLayers.pSelectLayerFromWmsList.append(layerItem);
		});
	},
	
	buildDomLayerWms: function(layer) {
		var itemLayer = $("<div>").attr({"class": "layer-item-wms"})
		.text(layer.title + " (" + layer.name + ")")
		.data(
			{"layerName": layer.name, 
			"layerTitle": layer.title,
			"layerDescription": layer["abstract"]});
		
		itemLayer.click(function(){
			var layerObj = $(this);
			
			mLayers.pSelectLayerFromWmsList.find(".layer-item-wms").removeClass("selected");
			layerObj.addClass('selected');
			//mLayers.setLayerInfoFromWMS(layerObj);
		});
		return itemLayer;
	},
	
	setLayerInfoFromWMS: function(layerObj) {
		var name = layerObj.data("layerName");
		var title = layerObj.data("layerTitle");
		var desc = layerObj.data("layerDescription");
		$("#layer-input-name").val(name);
		$("#layer-input-title").val(title);
		$("#layer-input-desc").val(desc);
		
		//Cache (if WMS default cache has been set)
	},
	
//	getBaseLayerIcon: function(active) {
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
	
	// Open dialog form insert layer
	openAddForm: function() {
		this.createAddFormPanel();
		Utils.cleanForm(this.pForm);
		
		//Set opacity to 10
		$("#layer-input-opacity").slider("value", 10);
		
		//Set the first layerSource
		mLayers.layerSourceSelected();
		
		this.pForm.dialog("open");
		
	},
	
	openUpdateForm: function() {
		this.createUpdateFormPanel();
		Utils.cleanForm(this.pForm);
		
		var selectedRow = Utils.getSelectedRow(this.dt)[0];
		this.populateDataForm(selectedRow);
		
		this.pForm.dialog("open");
	},
	
	openDialogConfirmDelLayer: function(idLayer, message, forceDelIfConfirm) {
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Confirm')] = function(){
			var idLayer = $(this).data("layerId");
			if ( idLayer != null )
				mLayers.requests.deleteLayer(idLayer, forceDelIfConfirm);
			
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).data("layerId") != null;
			$(this).dialog("close");
		};
		
		var deleteDialogConfirm = AlertDialog.buildDialog({
			isToCreate: true,
			title: LocaleManager.getKey("General_MsgConfirmTitle"),
			message: message, 
			type: "question",
			buttons: buttons
		});
		
		deleteDialogConfirm.data({"layerId": idLayer});
		deleteDialogConfirm.dialog("open");
	},
	
	openDialogConfirmUpdateLayer: function(layerValues, message) {
		
		var buttons = {};			
		buttons[LocaleManager.getKey('General_Confirm')] = function(){
			mLayers.requests.updateLayer(layerValues, true);
			
			$(this).dialog("close");
		};
		
		buttons[LocaleManager.getKey('General_Cancel')] = function(){
			$(this).data("layerId") != null;
			$(this).dialog("close");
		};
		
		AlertDialog.buildDialog({
			isToCreate: true,
			title: LocaleManager.getKey("General_MsgConfirmTitle"),
			message: message, 
			type: "question",
			buttons: buttons
		});
		
		//deleteDialogConfirm.data({"layerId": idLayer});
		//deleteDialogConfirm.dialog("open");
	},
	
	reloadGrid: function(callback, resetPaging) {
		this.dt.api().ajax.reload(callback, resetPaging);
	},
	
	getLayerDataForm: function() {
		var layerObj = new Object();
		layerObj.id = $("#layer-input-id").val();
		layerObj.name = $("#layer-input-name").val();
		layerObj.title = $("#layer-input-title").val();
		layerObj.desc = $("#layer-input-desc").val();
		layerObj.responsible = $("#layer-input-responsible").val();
		layerObj.metadataUuid = $("#layer-input-metadata_uuid").val();
		layerObj.source = $("#layer-select-source").val();
		layerObj.format = $("#layer-select-format").val();
		layerObj.isBaselayer = $("#layer-input-baselayer").is(":checked");
		
		layerObj.wfsSearchEnabled = $("#layer-input-wfsSearchEnabled").is(":checked");
		layerObj.showInfoDialog = $("#layer-input-show_info_dialog").is(':checked');
		
		//Single tile opposite of Tiled
		layerObj.singleTile = !$("#layer-input-tiled").is(":checked");
		
		layerObj.opacity = parseFloat($("#layer-input-opacity").slider("value") / 10);
		layerObj.cacheUrl = $("#layer-input-cacheurl").val();
		layerObj.cacheWorkspace = $("#layer-input-cacheworkspace").val();
		
		layerObj.cacheEnabled = $("#layer-input-cacheEnabled").is(":checked");
		layerObj.sldOverrideEnabled = $("#layer-input-attribute-override-sldurl").is(":checked");
		layerObj.sldUrl = $("#layer-input-attribute-sldurl").val();
		
		layerObj.wfsUrl = $("#layer-input-wfs_url").val();
		layerObj.wcsUrl = $("#layer-input-wcs_url").val();
		
		layerObj.external = $("#layer-input-is-external").is(":checked");
		layerObj.downloadable = $("#layer-input-downloadable").is(":checked");
		layerObj.attributeNameForInfo = $("#layer-input-attribute-name-for-info").val();
		
		layerObj.referenceDate = $("#layer-input-reference-date").val();
		
		return layerObj;
	},

	populateDataForm: function(selectedRow) {
		$("#layer-input-id").val(selectedRow.idLayer);
		$("#layer-input-name").val(selectedRow.layerName);
		$("#layer-input-title").val(selectedRow.layerTitle);
		$("#layer-input-desc").val(selectedRow.layerDescription);
		$("#layer-input-responsible").val(selectedRow.responsible);
		$("#layer-input-metadata_uuid").val(selectedRow.metadataUuid);
		$("#layer-select-source").val(selectedRow.idLayerSource);
		$("#layer-select-format").val(selectedRow.format);
		$("#layer-input-baselayer").prop('checked', selectedRow.baseLayer);
		$("#layer-input-show_info_dialog").prop('checked', selectedRow.showInfoDialog);
		
		$("#layer-input-wfsSearchEnabled").prop('checked', selectedRow.wfsSearchEnabled);
		
		//Tiled opposite of single tile
		$("#layer-input-tiled").prop('checked', !selectedRow.singleTile);
		//$("#layer-input-opacity").val(selectedRow.opacity * 10);
		$("#layer-input-opacity").slider("value", selectedRow.opacity * 10);
		$("#layer-input-cacheurl").val(selectedRow.cacheUrl);
		$("#layer-input-cacheworkspace").val(selectedRow.cacheWorkspace);
		
		$("#layer-input-cacheEnabled").prop('checked', selectedRow.cacheEnabled);
		$("#layer-input-attribute-override-sldurl").prop('checked', selectedRow.sldOverrideEnabled);
		$("#layer-input-attribute-sldurl").val(selectedRow.sldUrl);
		
		$("#layer-input-wfs_url").val(selectedRow.wfsUrl);
		$("#layer-input-wcs_url").val(selectedRow.wcsUrl);
		
		$("#layer-input-is-external").prop('checked', selectedRow.external);
		$("#layer-input-downloadable").prop('checked', selectedRow.downloadable);
		
		$("#layer-input-attribute-name-for-info").val(selectedRow.attributeNameForInfo);
		$("#layer-input-reference-date").val(selectedRow.referenceDate);
	},
	
	submitAddLayer: function() {
		var valid = mLayers.validForm.valid();
		if(!valid) {
			return;
		}
		
		var layerObj = this.getLayerDataForm();
		var isValidForm = this.validForm.valid();
		if(!isValidForm)
			return;
		
		mLayers.requests.insertLayer(layerObj);
			
		return;
	},
	
	deleteLayer: function() {
		selectedRow = Utils.getSelectedRow(this.dt)[0];
		
		if (Utils.isNullOrUndefined(selectedRow)) {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				LocaleManaget.getKey("General_No_Dt_Record_Selected"),
				"error"
			);
		}
		else {
			//Ask user if sure about deleting the layer, but dont force the deletion.
			mLayers.openDialogConfirmDelLayer(selectedRow.idLayer, LocaleManager.getKey("Manager_Layers_MsgConfirmDelete"), false);
			//mLayers.requests.deleteLayer(selectedRow.idLayer, false);
		}
	},
	
	layerSourceSelected: function() {
		var selectedLayerSource = $("#layer-select-source").find(':selected');
		var cacheUrl = selectedLayerSource.data("cacheUrl");
		$("#layer-input-cacheurl").val(cacheUrl);
	},
	
	requests: {
		getLayersSources: function() {
			Utils.ajaxCall(Services.getLayerConfigUrl(), "POST", "json", {
				oper: "layerSources"
			}, function(response) {				
				if(response.success) {
					Utils.populateCombo($("#layer-select-source"), response.result.data, "idLayerSource", "layerSourceName", ["url", "cacheUrl"]);
					
					//Set the first one
					//mLayers.layerSourceSelected();
				}
			});			
		},
	
		insertLayer: function(layerObj) {
			Utils.ajaxCall(Services.getLayerConfigUrl(), "POST", "json", {
				oper: "addWMSLayer",
				layerName: layerObj.name,
				layerTitle: layerObj.title,
				layerDescription: layerObj.desc,
				responsible: layerObj.responsible,
				metadataUuid: layerObj.metadataUuid,
				external: layerObj.external,
				downloadable: layerObj.downloadable,
				wfsSearchEnabled: layerObj.wfsSearchEnabled,
				showInfoDialog: layerObj.showInfoDialog,
				layerSourceId: layerObj.source,
				baseLayer: layerObj.isBaselayer,
				singleTile: layerObj.singleTile,
				imageFormat: layerObj.format,
				opacity: layerObj.opacity,
				cacheUrl: layerObj.cacheUrl,
				cacheWorkspace: layerObj.cacheWorkspace,
				cacheEnabled: layerObj.cacheEnabled,
				sldUrl: layerObj.sldUrl,
				sldOverrideEnabled: layerObj.sldOverrideEnabled,
				wfsUrl: layerObj.wfsUrl,
				wcsUrl: layerObj.wcsUrl,
				attributeNameForInfo: layerObj.attributeNameForInfo,
				referenceDate: layerObj.referenceDate
			}, function(response) {				
				if(response.success) {
					mLayers.reloadGrid(null, false);
					Utils.closeDialogForm(mLayers.pForm);
				}
			}, null);
		},
		
		updateLayer: function(layerObj, forceUpdate) {
			Utils.ajaxCall(Services.getLayerConfigUrl(), "POST", "json", {
				oper: "updateWMSLayer",
				forceUpdate: forceUpdate,
				layerId: layerObj.id,
				layerName: layerObj.name,
				layerTitle: layerObj.title,
				layerDescription: layerObj.desc,
				responsible: layerObj.responsible,
				metadataUuid: layerObj.metadataUuid,
				external: layerObj.external,
				downloadable: layerObj.downloadable,
				wfsSearchEnabled: layerObj.wfsSearchEnabled,
				showInfoDialog: layerObj.showInfoDialog,
				layerSourceId: layerObj.source,
				baseLayer: layerObj.isBaselayer,
				singleTile: layerObj.singleTile,
				imageFormat: layerObj.format,
				opacity: layerObj.opacity,
				cacheUrl: layerObj.cacheUrl,
				cacheWorkspace: layerObj.cacheWorkspace,
				cacheEnabled: layerObj.cacheEnabled,
				sldUrl: layerObj.sldUrl,
				sldOverrideEnabled: layerObj.sldOverrideEnabled,
				wfsUrl: layerObj.wfsUrl,
				wcsUrl: layerObj.wcsUrl,
				attributeNameForInfo: layerObj.attributeNameForInfo,
				referenceDate: layerObj.referenceDate
			}, function(response) {		
				//Ok function
				if(response.success) {
					mLayers.reloadGrid(null, false);
					Utils.closeDialogForm(mLayers.pForm);
				}
			}, function(response){
				if(!Utils.isNullOrUndefined(response.code) && 
						(response.code === "EXC_LAYER_CHANGE_TO_BASELAYER_LAYER_GROUP" ||
						 response.code === "EXC_LAYER_CHANGE_FROM_BASELAYER_LAYER_GROUP")) {
					var mess = response.msg + "\n\n" + LocaleManager.getKey("General_MsgConfirm");
					mLayers.openDialogConfirmUpdateLayer(layerObj, mess);
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
		},
		
		deleteLayer: function(layerId, forceDel) {
			Utils.ajaxCall(Services.getLayerConfigUrl(), "POST", "json", {
				oper: "deleteLayer",
				layerId: layerId,
				forceDeletion: forceDel
			}, function(response) {
				mLayers.reloadGrid(null, false);
			}, function(response) {
				if(!Utils.isNullOrUndefined(response.code) && response.code === "EXC_LAYER_DELETE_ERROR_GROUPS_USING_LAYER") {
					var mess = response.msg + "\n\n" + LocaleManager.getKey("General_MsgConfirm");
					//Show a message. Force delete if user confirms.
					mLayers.openDialogConfirmDelLayer(layerId, mess, true);
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