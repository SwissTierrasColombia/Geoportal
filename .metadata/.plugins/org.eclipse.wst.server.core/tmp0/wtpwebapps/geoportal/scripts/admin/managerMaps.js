var mMaps = {
	pGroups: null,
	pLayers: null,
	dragdropOptions: null,
	pFormAddGroup: null,
	validatorFormAddGroup: null,
	pFormModGroup: null,
	validatorFormUpdateGroup: null,
	pFormConfirmDelGroup: null,
	
	init: function() {
		this.pGroups = $("#m-groups-list");
		this.pLayers = $("#m-layers-list");
		
		if(this.pFormAddGroup == null) {
			this.pFormAddGroup = $("#form-addgroup-dialog");
			
			this.validatorFormAddGroup = new Validate({
				form: this.pFormAddGroup
			});
			
			var buttons = {};			
			buttons[LocaleManager.getKey('General_Cancel')] = function(){
				Utils.closeDialogForm(mMaps.pFormAddGroup);
			};
			
			buttons[LocaleManager.getKey('General_Save')] = function(){
				mMaps.submitAddGroup();
			};
			
			DialogUtils.renderDialog(LocaleManager.getKey("General_TitleForm"), buttons, {
				modal: false,
				resizable: false,
				height: 200,
				width: 400,
				closeFn: function() {
					Utils.cleanForm(this.pFormAddGroup);
				}
			}, this.pFormAddGroup);
		}
		
		if(this.pFormModGroup == null) {
			this.pFormModGroup = $("#form-modgroup-dialog");
			
			this.validatorFormUpdateGroup = new Validate({
				form: this.pFormModGroup
			});
			
			var buttons = {};			
			buttons[LocaleManager.getKey('General_Cancel')] = function(){		
				Utils.closeDialogForm(mMaps.pFormModGroup);
			};
			
			buttons[LocaleManager.getKey('General_Save')] = function(){
				mMaps.submitModGroup();
			};
			
			DialogUtils.renderDialog(LocaleManager.getKey("General_TitleForm"), buttons, {
				modal: false,
				resizable: false,
				height: 200,
				width: 400,
				closeFn: function() {
					Utils.cleanForm(this.pFormModGroup);
				}
			}, this.pFormModGroup);
		}
		
		if(this.pFormConfirmDelGroup == null) {			
			var buttons = {};			
			buttons[LocaleManager.getKey('General_Confirm')] = function(){
				var idGroup = $(this).data("groupId");
				if ( $(this).data("groupId") != null )
					mMaps.requests.deleteLayerGroup(idGroup, true);
				
				$(this).dialog("close");
			};
			
			buttons[LocaleManager.getKey('General_Cancel')] = function(){
				$(this).data("groupId") != null;
				$(this).dialog("close");
			};
			
			this.pFormConfirmDelGroup = AlertDialog.buildDialog({
				element: $("#form-delgroup-dialog"),
				title: LocaleManager.getKey("Manager_Maps_TitleForm_DelGroup"),
				message: LocaleManager.getKey("Manager_Maps_HeaderForm_DelGroupText"),
				type: "question",
				buttons: buttons
			});	
		}
		
		this.updateData();
	},
	
	/**
	 *  Set option to enable drag and drop on panels
	 *  - direction1: parameters for enable drag and drop from panel A to panel B
	 *  - direction2: parameters for enable drag and drop from panel B to panel A (optional)
	 *  -- source: items to drag
	 *  -- dest: container accepting drop
	 *  -- acceptDrop: restricting drop to specific items
	 *  -- onDrop: function to create new item after drop ends
	 *
	 */
	setDragDropOptionsStandard: function() {
		this.dragdropOptionsStandard = {
			direction1: {
				source: $(".row-layer-all.layer-standard"),
				dest: $(".group-standard"),
				acceptDrop: ".layer-standard",
				onDrop: function( event, ui ){
					var layer = new Object();
						layer.idLayer = $(ui.draggable).data("layerId");
						layer.layerName = $(ui.draggable).text();
				
					return mMaps.getDomLayerGroup(layer);	
				},
				//Function di check
				onDropCheck: function(okCheckFn, koCheckFn, params) {
					// Save assoc layer to group
					mMaps.requests.assocLayerToGroupLayer(okCheckFn, null, params);
				},				
				okCheck: function(response) {
					mMaps.updateData();
					return true;
				},
				koCheck: function() {
					mMaps.updateData();
					return false;
				}
			}
			,
			direction2: {
				source: $(".row-layer-group.layer-standard"),		
				dest: $(".group-standard"),
				acceptDrop: ".layer-standard",
				onDrop: function( event, ui ){
					var layer = new Object();
						layer.idLayer = $(ui.draggable).data("layerId");
						layer.layerName = $(ui.draggable).text();
					
					return mMaps.getDomLayerGroup(layer);
				},
				//Function di check
				onDropCheck: function(okCheckFn, koCheckFn, params) {
					//Chiamata, salvataggio
					mMaps.requests.assocLayerToGroupLayer(okCheckFn, null, params);
				},				
				okCheck: function(response) {
					mMaps.updateData();
					return true;
				},
				koCheck: function() {
					mMaps.updateData();
					return false;
				}
			}
		};
		
		return;
	},
	
	setDragDropOptionsBackground: function() {
		this.dragdropOptionsBackground = {
			direction1: {
				source: $(".row-layer-all.layer-background"),
				dest: $(".group-background"),
				acceptDrop: ".layer-background",
				onDrop: function( event, ui ){
					var layer = new Object();
						layer.idLayer = $(ui.draggable).data("layerId");
						layer.layerName = $(ui.draggable).text();
					
					return mMaps.getDomLayerGroup(layer);						
				},
				//Function di check
				onDropCheck: function(okCheckFn, koCheckFn, params) {
					// Save assoc layer to group
					mMaps.requests.assocLayerToGroupLayer(okCheckFn, null, params);
				},				
				okCheck: function(response) {
					mMaps.updateData();
					return true;
				},
				koCheck: function() {
					mMaps.updateData();
					return false;
				}
			}
			,
			direction2: {
				source: $(".group-layers-list .row-layer-group.layer-background"),
				dest: $(".group-background"),
				acceptDrop: ".layer-background",
				onDrop: function( event, ui ){
					var layer = new Object();
						layer.idLayer = $(ui.draggable).data("layerId");
						layer.layerName = $(ui.draggable).text();
						
					return mMaps.getDomLayerGroup(layer);
				},
				//Function di check
				onDropCheck: function(okCheckFn, koCheckFn, params) {
					//Chiamata, salvataggio
					mMaps.requests.assocLayerToGroupLayer(okCheckFn, null, params);
				},				
				okCheck: function(response) {
					mMaps.updateData();
					return true;
				},
				koCheck: function() {
					mMaps.updateData();
					return false;
				}
			}
		};
		
		return;
	},
	
	/**
	 * Create list groups panel
	 * It creates all group items and layers container for each one
	 *  
	 * @param groups
	 */
	viewAllGroups: function(groups) {
		this.pGroups.empty();
		var orderedGroups = Utils.orderByAttribute(groups, "position", "asc");
		$.each(orderedGroups, function(index, group){
			// Add dom item element group to panel
			var domGroup = mMaps.getDomGroup(group);
			mMaps.pGroups.append(domGroup);
			
			// Disable move-up and move-down icon to first layer and last layer of group
			mMaps.setMoveOrderIconsToGroup(domGroup);
		});
		
		this.requests.groupsDone = true;
		
		if(
			this.requests.groupsDone === true &&
			this.requests.layersDone === true
		) {
			this.onGroupsAndLayersLoaded();
		}
	},
	
	/**
	 * Create list layers panel
	 * @param layers
	 */
	viewAllLayers: function(layers) {
		this.pLayers.empty();
		$.each(layers, function(index, layer){
			// Add dom item element layer to panel
			mMaps.pLayers.append(mMaps.getDomLayer(layer));
		});
		
		this.requests.layersDone = true;
		
		if(
			this.requests.groupsDone === true &&
			this.requests.layersDone === true
		) {
			this.onGroupsAndLayersLoaded();
		}
	},
	
	onGroupsAndLayersLoaded: function() {
		this.setDragDropOptionsBackground();
		this.setDragDropOptionsStandard();
		DragDrop.enable(this.dragdropOptionsBackground);
		DragDrop.enable(this.dragdropOptionsStandard);
		
		Sorting.enable($("#m-groups-body"), ".row-groups-all", 
			function(item, newPosition) {
				// This is triggered when the ordering has stopped.
				var groupId = item.data("groupId");
				mMaps.requests.reorderGroup(groupId, newPosition);
			}
		);
	},
	
	/**
	 * Retutn dom element of a group item 
	 * @param group
	 * @returns
	 */
	getDomGroup: function(group) {
		var rowGroup = $("<div>").attr({"class": "row-groups-all"});
		rowGroup.append(
			this.getDomHeaderGroup(group),
			this.getDomLayersGroup(Utils.orderByAttribute(group.layerList, "position", "asc"), group.backgroundGroup)
		).data({"groupId": group.idLayerGroup, "groupName": group.layerGroupName});
		
		return rowGroup;
	},
	
	/**
	 * Return dom element header for a group
	 * @param group
	 * @returns
	 */
	getDomHeaderGroup: function(group) {
		var hGroup = $("<div>").attr({
			"class": "group-header localizedElement", 
			"data-locale_key": "General_Move_Object", 
			"data-locale_ref": "title"
		}).append(
			this.getDomHeaderGroupTitle(group),
			this.getDomHeaderGroupButtons()
		);
		return hGroup;
	},
	
	/**
	 * Return dom element title header of a group
	 * @param group
	 * @returns
	 */
	getDomHeaderGroupTitle: function(group) {
		var hTitle = $("<div>").attr({"class": "group-header-text"}).text(group.layerGroupName);
		return hTitle;
	},
	
	/**
	 * Return dom element buttons of a group
	 * @returns
	 */
	getDomHeaderGroupButtons: function() {
		var hgActs = $("<div>").attr({"class": "group-header-acts"}).append(
			$("<div>").attr({
				"class": "group-header-acts-del localizedElement", 
				"data-locale_key": "General_Delete", 
				"data-locale_ref": "title"			
			}).append($("<i>").attr({"class": "fa fa-trash-o fa-2x"}))
			.click(function(){
				var idGroup = $(this).closest(".row-groups-all").data("groupId");
				//mMaps.openDialogConfirmDelGroup(idGroup);
				mMaps.requests.deleteLayerGroup(idGroup, false);
			}),
			$("<div>").attr({
				"class": "group-header-acts-mod localizedElement", 
				"data-locale_key": "General_Modify", 
				"data-locale_ref": "title"			
			}).append($("<i>").attr({"class": "fa fa-pencil-square-o fa-2x"}))
			.click(function(){
				var group = new Object();
					group.id = $(this).closest(".row-groups-all").data("groupId");
					group.name = $(this).closest(".row-groups-all").data("groupName");
					
				mMaps.openDialogModGroup(group);
			})
		);
		
		return hgActs;
	},
	
	/**
	 * Return dom element of a container layers group
	 * @returns
	 */
	getDomLayersGroup: function(layersGroup, isBackground) {
		var layersContainer = $("<div>").attr({"class": "group-layers-list"});
		if ( layersGroup.length > 0 ) {
			$.each(layersGroup, function(index, layer){
				layersContainer.append(mMaps.getDomLayerGroup(layer));
			});
		}
		
		// Add correct class type to group layer container
		// - background type group
		// - standard type group
		if ( isBackground )
			layersContainer.addClass("group-background");
		else 
			layersContainer.addClass("group-standard");
		
		return layersContainer;
	},
	/**
	 * Return dom element of a layer group item
	 */
	getDomLayerGroup: function(layer) {		
		var rowLayerGroup = $("<div>").attr({
			"class": "row-layer-group localizedElement", 
			"data-locale_key": "Manager_Map_ReAssocLayerTooltip", 
			"data-locale_ref": "title"
		}).text(this.getLabelForLayer(layer))
		.data({"layerId": layer.idLayer, "layerPos": layer.position});
		
		rowLayerGroup.append(
			this.getDomButtonDeleteLayer(),
			this.getDomButtonOrderLayer()
		);
		if (layer.baseLayer)
			rowLayerGroup.addClass("layer-background");
		else
			rowLayerGroup.addClass("layer-standard");		
		
		return rowLayerGroup;
	},
	
	/**
	 * Return dom element of a layer item
	 * @param layer
	 * @returns
	 */
	getDomLayer: function(layer) {		
		var rowLayer = $("<div>").attr({
			"class": "row-layer-all localizedElement", 
			"data-locale_key": "Manager_Map_AssocLayerTooltip", 
			"data-locale_ref": "title"
		}).text(this.getLabelForLayer(layer))
		.data({"layerId": layer.idLayer});
		
		if (layer.baseLayer)
			rowLayer.addClass("layer-background");
		else
			rowLayer.addClass("layer-standard");
		
		return rowLayer;
	},
	
	/**
	 * Return dom element button delete layer from group
	 */
	getDomButtonDeleteLayer: function() {
		var deleteButton = $("<div>").attr({
			"class": "row-layer-group-act-delete localizedElement", 
			"data-locale_key": "Manager_Map_RemoveLayerGroup", 
			"data-locale_ref": "title"
		}).append($("<i>").attr({"class": "fa fa-unlink fa-2x"}))
		.click(function(){
			// Delete layer from group
			// - param 1: layer item
			// - param 2: group item
			mMaps.deleteLayerFromGroup($(this).closest(".row-layer-group"), $(this).closest(".row-groups-all"));
		});
		
		return deleteButton;
	},
	
	/**
	 * Return dom element button order layer
	 * - Arrow UP
	 * - Arrow DOWN
	 */
	getDomButtonOrderLayer: function() {		
		var orderButtons = $("<div>").attr({
			"class": "row-layer-group-act-order"
		}).append(
			$("<div>").attr({
				"class": "button-order-up localizedElement", 
				"data-locale_key": "General_Move_Up", 
				"data-locale_ref": "title"				
			}).append($("<i>").attr({"class": "fa fa-chevron-up fa-2x"}))
			.click(function(){
				if ( $(this).find(".button-order-up").hasClass("btn-deactivate") ) return;
				
				// Retrive id group of layer and id layer
				var layer = $(this).closest(".row-layer-group");
				var currentGroupId = $(this).closest(".row-groups-all").data("groupId");
				var layerId = layer.data("layerId");
				
				// Move item layer UP
				Utils.moveUp($(this).closest(".row-layer-group"));
				
				var layersList = $(this).closest(".group-layers-list").find(".row-layer-group");	
				
				// Retrieve new position of layer item into group
				var position = Utils.getPositionItem(layersList, layer);
				mMaps.requests.reorderLayerInLayerGroup(currentGroupId, layerId, position);
				
				// Update state of order icon buttons
				//mMaps.setMoveOrderIconsToGroup($(this).closest(".row-groups-all"));
			}),
			$("<div>").attr({
				"class": "button-order-down localizedElement", 
				"data-locale_key": "General_Move_Down", 
				"data-locale_ref": "title"
			}).append($("<i>").attr({"class": "fa fa-chevron-down fa-2x"}))
			.click(function(){
				if ( $(this).find(".button-order-down").hasClass("btn-deactivate") ) return;
				
				// Retrive id group of layer and id layer
				var layer = $(this).closest(".row-layer-group");
				var currentGroupId = $(this).closest(".row-groups-all").data("groupId");
				var layerId = layer.data("layerId");
				
				// Move item layer DOWN
				Utils.moveDown($(this).closest(".row-layer-group"));
				var layersList = $(this).closest(".group-layers-list").find(".row-layer-group");
				
				var position = Utils.getPositionItem(layersList, layer);
				mMaps.requests.reorderLayerInLayerGroup(currentGroupId, layerId, position);
				
				// Update state of order icon buttons
				//mMaps.setMoveOrderIconsToGroup($(this).closest(".row-groups-all"));
			})
		);
		
		return orderButtons;
	},
	
	getLabelForLayer: function(layer) {
		var source = "";
		if (!Utils.isNullOrUndefined(layer.layerSourceName)) {
			source = layer.layerSourceName + " - ";
		}
		return source + layer.layerTitle + ' (' + layer.layerName + ')';
	},
	
	/**
	 *  Set correct class to move buttons
	 *  - Disable first icon button of top item of list
	 *  - Disable last icon button of bottom item of list
	 */
	setMoveOrderIconsToGroup: function(domGroup) {
		// Clean all buttons deativated
		domGroup.find(".btn-deactivate").removeClass("btn-deactivate");
		
		var listLayersObj = domGroup.find(".row-layer-group");
		var firstLayer = listLayersObj[0];
		var lastlayer = listLayersObj[listLayersObj.length - 1];
		
		$(firstLayer).find(".button-order-up").addClass("btn-deactivate");
		$(lastlayer).find(".button-order-down").addClass("btn-deactivate");
		
		return;
	},

	/**
	 *  Open dialog to insert a new group
	 */
	openDialogAddGroup: function() {
		if(this.pFormAddGroup != null)
			if (this.validatorFormAddGroup != null) {
				this.validatorFormAddGroup.reset();	
			}
			
			this.pFormAddGroup.dialog("open");	
		
		return;
	},
	
	openDialogModGroup: function(group) {
		if(this.pFormModGroup != null) {
			if (this.validatorFormUpdateGroup != null) {
				this.validatorFormUpdateGroup.reset();	
			}
			
			mMaps.populateFormModGroupWidthParams(group);
			this.pFormModGroup.dialog("open");
		}
	},
	
	openDialogConfirmDelGroup: function(idGroup) {
		this.pFormConfirmDelGroup.data({"groupId": idGroup});
		this.pFormConfirmDelGroup.dialog("open");
		return;
	},
	
	populateFormModGroupWidthParams: function(group) {
		$("#group-input-id-mod").val(group.id);
		$("#group-input-name-mod").val(group.name);
		return;
	},
	
	/**
	 *  Delete layer from group
	 */
	deleteLayerFromGroup: function(layer, group) {
		var layerId = layer.data("layerId");
		var groupId = group.data("groupId");
		
		this.requests.deassocLayerToGroupLayer(layer, groupId, layerId);
	},
	
	/**
	 *  Submit New Group
	 */
	submitAddGroup: function() {
		var isValid = this.validatorFormAddGroup.valid();
		if(!isValid) {
			return;
		}
		
		var groupName = $("#group-input-name").val();
		this.requests.addNewGroup(groupName);
		return true;
	},
	
	/**
	 *  Submit Modify Group
	 */
	submitModGroup: function() {
		var isValid = this.validatorFormUpdateGroup.valid();
		if(!isValid) {
			return false;
		}
		
		var groupObj = new Object();
		groupObj.id = $("#group-input-id-mod").val();
		groupObj.name = $("#group-input-name-mod").val();
		
		this.requests.modifyGroup(groupObj);
		return true;
	},
	
	updateData: function() {
		this.requests.getGroupedLayers();
		this.requests.getLayers();
		
		return;
	},
	
	/**
	 * Requests:
	 * - getGroupedLayers: ajax call to retrieve all groups layers
	 * - getLayers: ajax call to retrieve alla layers
	 */
	requests: {
		groupsDone: false,
		layersDone: false,
		
		getGroupedLayers: function() {
			Utils.ajaxCall(Services.getMapConfigUrl(), "POST", "json", {
				oper: "layerGroupsAndLayers"
			}, function(response){
				mMaps.viewAllGroups(response.result.data);
			}); 			
		},
		
		getLayers: function() {
			Utils.ajaxCall(Services.getMapConfigUrl(), "POST", "json", {
				oper: "unAssociatedlayers"
			}, function(response){
				mMaps.viewAllLayers(response.result.data);
			}); 
		},
		
		assocLayerToGroupLayer: function(fnOkCallBack, fnKoCallback, params) {
			var layerId = params.sourceItem.data("layerId");
			var layerGroupIdDest = params.destPanel.closest(".row-groups-all").data("groupId");
			var layerGroupSourcePanel = params.sourceItem.closest(".row-groups-all");
			
			if ( layerGroupSourcePanel.length > 0 ) {
				var layerGroupIdSource = layerGroupSourcePanel.data("groupId");
				
				Utils.ajaxCall(Services.getMapConfigUrl(), "POST", "json", {
					oper: "moveLayerToLayerGroup",
					oldlayerGroupId: layerGroupIdSource,
					newLayerGroupId: layerGroupIdDest,
					layerId: layerId
				}, fnOkCallBack, fnKoCallback);						
			}
			else {
				Utils.ajaxCall(Services.getMapConfigUrl(), "POST", "json", {
					oper: "addLayerToLayerGroup",
					layerGroupId: layerGroupIdDest,
					layerId: layerId
				}, fnOkCallBack, null);				
			}
		},
		
		deassocLayerToGroupLayer: function(layerItem, layerGroupId, layerId) {			
			Utils.ajaxCall(Services.getMapConfigUrl(), "POST", "json", {
				oper: "removeLayerFromLayerGroup",
				layerGroupId: layerGroupId,
				layerId: layerId
			}, function(response){
				if(response.success)
					mMaps.updateData();
			}, null);			
		},
		
		addNewGroup: function(groupName) {
			Utils.ajaxCall(Services.getMapConfigUrl(), "POST", "json", {
				oper: "addLayerGroup",
				layerGroupName: groupName
			}, function() {
				mMaps.updateData();
				Utils.closeDialogForm(mMaps.pFormAddGroup);
			}, null);	
		},
		
		reorderLayerInLayerGroup: function(layerGroupId, layerId, position) {
			Utils.ajaxCall(Services.getMapConfigUrl(), "POST", "json", {
				oper: "reorderLayerInLayerGroup",
				layerGroupId: layerGroupId,
				layerId: layerId,
				position: position
			}, function() {
				mMaps.updateData();
			}, null);				
		}, 
		reorderGroup: function(layerGroupId, position) {
			Utils.ajaxCall(Services.getMapConfigUrl(), "POST", "json", {
				oper: "reorderLayerGroup",
				layerGroupId: layerGroupId,
				position: position
			}, function() {
				mMaps.updateData();
			}, null);				
		},
		
		deleteLayerGroup: function(layerGroupId, forceDel) {
			Utils.ajaxCall(Services.getMapConfigUrl(), "POST", "json", {
				oper: "deleteLayerGroup",
				layerGroupId: layerGroupId,
				forceDeletion: forceDel
			}, function(response) {
				mMaps.updateData();
			}, function(response) {
				if(!Utils.isNullOrUndefined(response.code) && response.code === "EXC_LAYERGROUP_DELETE_ERROR_LAYERS_ASSOCIATED") {
					mMaps.openDialogConfirmDelGroup(layerGroupId);
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
		
		modifyGroup: function(groupObj) {
			Utils.ajaxCall(Services.getMapConfigUrl(), "POST", "json", {
				oper: "updateLayerGroup",
				layerGroupId: groupObj.id,
				layerGroupName: groupObj.name
			}, function() {
				mMaps.updateData();
				Utils.closeDialogForm(mMaps.pFormModGroup);
			}, null);				
		}
	}
};