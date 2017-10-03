/**
 * LayerMenu class
 */
function LayerMenu() {
};

LayerMenu.groups = null;

/*
 * BASE LAYER (BACKGROUND) FUNCTIONS
 */
LayerMenu.addToBaseLayersMenu = function(bLayerConfig, layerOL) {
	var combo = $("#baselayers-select");

	combo.append($("<option/>", {
		"value" : bLayerConfig.getId(),
		"text" : bLayerConfig.getTitle(),
	}).data({
		"layerOl" : layerOL,
		"enabled" : bLayerConfig.isEnabled()
	}));
};

LayerMenu.isBackgroundGroup = function(groupCode) {
	var isBackground = false;
	var found = false;
	$.each(LayerMenu.groups.layersGroups, function(idx, grp) {
		if (grp.code === groupCode) {
			//Found.
			isBackground = grp.background;
			found = true;
		}
	});
	
	if (found) return isBackground;
	throw "GROUP " + groupCode + "NOT FOUND! ERROR!";
};

LayerMenu.getSelectedBasemapLayer = function() {
	var selectedOption = $("#baselayers-select option:selected");
	var selectedVal = parseInt(selectedOption.val());
	return catalog.getLayerConfigById(selectedVal);
};

LayerMenu.getSelectedBasemapLayerTitle = function() {
	var selectedOption = $("#baselayers-select option:selected");
	return selectedOption.text();
};


LayerMenu.toggleMenu = function(obj) {
	// Collassa il menù laterale
	if (obj.hasClass("expanded")) {
		obj.find("i").removeClass("fa-caret-right").addClass("fa-caret-left");
		obj.removeClass("expanded");
		
		$("#menu_header").hide();
		$("#menu_tabs").hide();	
		
		$("#rightPanel").animate({
			width: "0px"
		}, 100);
	}
	// Espande il menù laterale
	else {
		obj.addClass("expanded");
		obj.find("i").removeClass("fa-caret-left").addClass("fa-caret-right");
		
		$("#rightPanel").animate({
			width: "395px"
		}, 100, function() {
			$("#menu_header").show();
			$("#menu_tabs").show();			
		});
	}
};

LayerMenu.switchTabMenu = function(obj) {
	// Activate tab switcher button
	$(".menu-tab-switcher-item").removeClass("menu-tab-active");
	obj.addClass("menu-tab-active");
	
	// Show proper tab view
	var tabSelected = obj.data("tab");
	$(".tab-item").addClass("custom-hidden");
	$("#" + tabSelected).removeClass("custom-hidden");
};

/***********************
 * GROUPS IN THE MENU
 ***********************/
LayerMenu.loadMenuGroups = function(groupConfig) {
	
	LayerMenu.groups = {
			layersGroups : groupConfig
	};
	
	//Ordered Groups
	var orderedGroups = Utils.orderByAttribute(LayerMenu.groups.layersGroups, "position", "asc");
	
	$.each(orderedGroups, function(k, v) {
		var groupName = v.name;
		var groupCode = v.code;
		var groupTitle = v.title;
		
		/*
		 * If the groupname is the background group,
		 * don't add it to the menu
		 */
		var isBackgroundGrp = LayerMenu.isBackgroundGroup(groupCode);
		if(isBackgroundGrp) {
			return true; //goto next iteration
		}
		
		var exists = catalog.existsLayerForGroup(groupName);
		if (!exists) {
			return true; //goto next iteration
		}
		
		tree.createNewGroupInMenu(groupCode, groupTitle);
	});
};

/**
 * Add item to the Selected Layer Panel...
 */
LayerMenu._addToSelectedLayerPanel = function(menuItem) {
	
	var alreadyAdded = TreeMenu.isItemAdded(menuItem);
	
	if (alreadyAdded === true) {
		//alert("gia aggiunto");
		return;
	}
	
	/*
	 * Check if the maximum number of layers in the selected layer tree is reached or not.
	 */
	var numLayers = selectedLayerTree.getAllLayersSize();
	if ((numLayers + 1) > GLOBAL_SETTINGS.maxNumberOfSelectedLayers) {
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Warning_Title"), 
			LocaleManager.getKey("Page_Menu_Selected_Layers_Max_Size")
		);
		return;
	}
	
	TreeMenu.toggleItemMenuAddition(menuItem, true);

	var layerOL = menuItem.data("layerOL");
	var id = menuItem.data("id");
	
	var layerConfig = catalog.getLayerConfigById(id); 
	var showInformationDialog = Utils.isTrue(layerConfig.showInfoDialog());
	
	layerOL.setVisibility(true);
	map.addLayer(layerOL);
	
	LayerMenu.addToSelectedLayerMenu({
		id: id,
		layerOL: layerOL,
		enabled : true,
		hasDelete: true,
		hasLegend: false,
		showInfoBtn: showInformationDialog
	});
};


/**
 * Called when a "simple" WMS layer is checked. It sets the OpenLayers' layer
 * visibility, as well as the layer menu visibility.
 * 
 * The function references a "$(this)" object, that is the reference to the DOM
 * element the function is attached to.
 * 
 * It is attached to the "
 * <LI>" element of the menu, therefore the $(this) object references it.
 * 
 * @param event
 *            The JS event
 */
LayerMenu._singleLayerChecked = function(menuItem) {
	/*
	 * Retrieving the attached OpenLayers' layer.
	 */
	var olLayer = menuItem.data("layerOL");
	//var title = menuItem.data("title");

	/*
	 * Toggle Layer Visibility: getting the current status of the item in the
	 * menu and setting the visibility accordingly
	 */
	var currentVisibility = TreeMenu.isItemMenuEnabled(menuItem);

	if (currentVisibility) {
		TreeMenu.toggleItemMenuEnabling(menuItem, false);
		TreeMenu.toggleItemMenuSelection(menuItem, false);
	} else {
		TreeMenu.toggleItemMenuEnabling(menuItem, true);
	}

	var checkBox = menuItem.find(".toggleLayerCheckbox");
	olLayer.setVisibility(!currentVisibility);
};

LayerMenu._singleLayerClicked = function(menuItem) {
	var currentVisibility = TreeMenu.isItemMenuEnabled(menuItem);
	var selected = TreeMenu.isItemMenuSelected(menuItem);

	if (currentVisibility === true) {
		// Disabilita l'eventuale getFeature info control
		controls.deactivate(controls.WMSGetFeatureInfo);

		if (selected) {
			TreeMenu.toggleItemMenuSelection(menuItem, false);
			return;
		}
		
		// De-select all the layer and select this one
		$(selectedLayerTree.getSelectedLayer()).each(function(k, v) {
			TreeMenu.toggleItemMenuSelection($(this), false);
		});

		// Select the layer
		TreeMenu.toggleItemMenuSelection(menuItem, true);
	}
};

/**
 * Called when a "multi" WMS layer is checked. It sets the OpenLayers' layer
 * visibility, as well as the layer menu visibility.
 * 
 * The function references a "$(this)" object, that is the reference to the DOM
 * element the function is attached to.
 * 
 * It is attached to the "
 * <LI>" element of the menu, therefore the $(this) object references it.
 * 
 * @param event
 *            The JS event
 */
LayerMenu._wmsMultiLayerChecked = function(menuItem) {

	/*
	 * Getting data about the visibility.
	 */
	var oldVisibility = TreeMenu.isItemMenuEnabled(menuItem);
	if (oldVisibility) {
		TreeMenu.toggleItemMenuEnabling(itemMenu, false);
	} else {
		TreeMenu.toggleItemMenuEnabling(itemMenu, true);
	}

	//var newVisibility = !oldVisibility;

	/*
	 * Retrieving the attached OpenLayers' layer and other objects attached to
	 * the <LI> component.
	 */
	var olLayer = menuItem.data("layerOL");
	var title = menuItem.data("title");
	var id = menuItem.data("id");

	var layerConfig = catalog.getLayerConfigById(id);

	var name = layerConfig.getNameByTitle(title);

	// Retrieves all the layer names of the given WMS multi.
	//var wmsNames = layerConfig.getAllLayerNamesForWMSMulti();

	// Retrieves the layer names currently specified in the WMS shown on map.
	var currentWMSNames = olLayer.params.LAYERS;

	// Making an Array out of the currentWMSNames
	var currentWMSNameList = null;

	if (currentWMSNames === "") {
		currentWMSNameList = new Array();
	} else {
		currentWMSNameList = currentWMSNames.split(',');
	}

	// Check whether the layer that was currenly clicked is being shown or not.
	var index = $.inArray(name, currentWMSNameList);

	if (index !== -1) {
		/*
		 * Name is found in the current WMS LAYERS param. Let's remove it.
		 */
		currentWMSNameList.splice(index, 1);

	} else {
		/*
		 * Name is not found in the current WMS LAYERS param. Let's add it.
		 */
		currentWMSNameList.push(name);
	}

	// Joining the WMS LAYERS param
	var currentWMSNames_New = currentWMSNameList.join(",");

	/*
	 * If all the layers were removed from the WMS, then it must be hidden.
	 * Otherwise it must be shown.
	 */

	if (currentWMSNameList.length <= 0) {
		olLayer.setVisibility(false);
	} else {
		olLayer.setVisibility(true);
	}

	/*
	 * Merge new param in OpenLayers to refresh the map.
	 */
	olLayer.mergeNewParams({
		layers : currentWMSNames_New
	});
};

LayerMenu.showLayerInfoClickFn = function(btn, e) {
	e.stopPropagation();
	var layerLI = btn.closest("li");
	var id = $(layerLI).data("id");
	LayerInfoDialog.showLayerInfo(id);
};

/**
 * Adds a layer to the Layer Menu.
 * 
 * @param where
 *            Specifies whether the layer must go in the "background" or in the
 *            "layers" menu
 * @param layerOL
 * @param name
 */
LayerMenu.addToMenu = function (layerConfig, layerOL) {
	var where = layerConfig.getGroup();

	var parent = tree.getParentElementByCode(where);

	if (parent == null) {
		alert("no element in the menu called " + where);
		return;
	}

	/*
	 * Is external if the layer comes from another WMS.
	 * We have to know if it is external or not, because 
	 * we want to style the external links with a different style.
	 */
	var isExternal = true;
	if (!Utils.isNullOrUndefined(layerConfig.isExternal())) {
		isExternal = layerConfig.isExternal();
	}
	
	var showInformationDialog = Utils.isTrue(layerConfig.showInfoDialog());
	
	var item = LayerMenuUtils.buildLayerMenuItem_NEW({
		title: layerConfig.getTitle(), 
		deleteBtn: null,
		addZoomBtn: false,
		isExternal: isExternal, 
		zoomToClickedFn: null, 
		layerMenuItemClickedFn: null,
		showInfoBtn: showInformationDialog,
		infoBtnClickedFn : LayerMenu.showLayerInfoClickFn
	});
	
	var icon = LayerMenuUtils.createLayerMenuCheckboxForAdd(function(btn, e){
		e.stopPropagation();
		
		//If it is checked 
		var checked = true;
		if ($(btn).is(":checked")) {
			checked = false;
		}
		
		if (checked === true) {
			//Remove from selected layer
			var alreadyAdded = TreeMenu.isItemAdded(item);
			if (alreadyAdded === false) {
				//Not added, return
				return;
			}
			
			//Remove it!
			//Fetch the selectedItem LI object
			var id = $(item).data("id");
			var itemLISelected = selectedLayerTree.getItemByDataProperty("id", id);
			LayerMenu._removeFromSelectedLayerPanel(itemLISelected);
		}
		else {
			//Add to selected layer
			LayerMenu._addToSelectedLayerPanel(item);
		}
		
	});
	
	item.find(".item-layer").prepend(icon);

	/*
	 * Attaching the OpenLayers variable to the item (LI) element, for fast
	 * retrieval on click.
	 */
	item.data({
		"layerOL" : layerOL,
		"title" : layerConfig.getTitle(),
		"id" : layerConfig.getId()
	});

	TreeMenu.toggleItemMenuEnabling(item, true);
	
	tree.prependElementToGroup(where, item);
	
	//Return the newly created item
	return item;
};

LayerMenu.initOrderingSelectedLayerPanel = function() {
	var ul_selectedLayerPanel = $("#menu_layers_active .menu_item_content_list");
	
	Sorting.enable(ul_selectedLayerPanel, ".layerMenuItem", 
		function(itemLI, newPosition) {
			var numberOfBaseLayers =  map.getLayersBy("isBaseLayer", true).length;
			var layerOL = itemLI.data("layerOL");
			var all = selectedLayerTree.getAllLayers();
			var lenLayersInSelectedPanel = all.length;
			
			/*
			 * Openlayers is 0-based.
			 * The greater, the higher (top)
			 */
			var newPositionCorrectZeroBased = lenLayersInSelectedPanel - newPosition;
			map.setLayerIndex(layerOL, newPositionCorrectZeroBased + numberOfBaseLayers);
		}, "y"
	);
};


/**
 * Adds a layer to the Selected Layer Menu.
 * id, 
 * layerOL, 
 * enabled, 
 * hasDelete, 
 * hasLegend
 */
LayerMenu.addToSelectedLayerMenu = function(config) {
	var id = config.id;
	var layerOL = config.layerOL;
	var enabled = config.enabled;
	var hasDelete = config.hasDelete;
	var hasLegend = config.hasLegend;
	
	//True by default
	var showInfoBtn = true;
	
	if (!Utils.isNullOrUndefined(config.showInfoBtn)) {
		showInfoBtn = config.showInfoBtn;
	}
	
	var layerConfig = catalog.getLayerConfigById(id);
	
	var parent = $("#menu_layers_active .menu_item_content_list");

	if (parent == null) {
		alert("no element in the menu called ");
		return;
	}
	
	var deleteButton = null;
	if(hasDelete) {
		deleteButton = LayerMenuUtils.buildDeleteLayerButton(function(btn, e) {
			e.stopPropagation();
			/*
			 * If there is the same object in the Global menu, click on the
			 * Checkbox (that will trigger all the logic to remove it from the selected layer panel as well).
			 * 
			 * If it does not exist in the catalog (e.g is external), just remove it directly from the selected panel.
			 */ 
			var layerLI = btn.closest("li");
			
			var id = layerLI.data("id");
			var itemLIMenuGlobal = tree.getItemByDataProperty("id", id);
			
			if (!Utils.isNullOrUndefined(itemLIMenuGlobal)) {
				var checkBox = itemLIMenuGlobal.find(".addLayerCheckbox");
				checkBox.prop('checked', false).change();
			}
			else {
				//alert('item in global menu NOT found, remove from selected!');
				LayerMenu._removeFromSelectedLayerPanel(layerLI);	
			}
		});
	}

	/*
	 * Is external if the layer comes from another WMS
	 */
	var isExternal = true;
	
	if (!Utils.isNullOrUndefined(layerConfig.isExternal())) {
		isExternal = layerConfig.isExternal();
	}

	var item = LayerMenuUtils.buildLayerMenuItem_NEW({
		title: layerConfig.getTitle(), 
		deleteBtn: deleteButton,
		addZoomBtn: true,
		isExternal: isExternal, 
		zoomToClickedFn: function(btn, e) {
			//Zoom clicked function
			e.stopPropagation();
			var item = btn.closest("li");
			if(TreeMenu.isItemMenuEnabled(item)) {
				LayerMenu.zoomToLayer(item.data("id"), item.data("title"));
			}
		}, 
		layerMenuItemClickedFn: function(btn, e) {
			//layerMenuItemClickedFn
			e.stopPropagation();
			var item = btn.closest("li");
			LayerMenu._singleLayerClicked(item);
		},
		showInfoBtn: showInfoBtn,
		infoBtnClickedFn : LayerMenu.showLayerInfoClickFn
	});

	var transparencyDiv = LayerMenuUtils.buildTransparencyDIV(layerConfig, hasLegend);
	item.append(transparencyDiv);
	
	if (hasLegend) {
		item.append(LegendGraphics.getLegendImageLayer(layerConfig.getUrl(), layerConfig.getName()));
	}

	if (enabled) {
		TreeMenu.toggleItemMenuEnabling(item, true);
	}

	var icon = LayerMenuUtils.createLayerSelectedMenuToggleVisibilityCheckbox(function(btn, e){
		e.stopPropagation();
		
		LayerMenu._singleLayerChecked(item);
	});
	
	item.find(".item-layer").prepend(icon);

	/*
	 * Attaching the OpenLayers variable to the item (LI) element, for fast
	 * retrieval on click.
	 */
	item.data({
		"layerOL" : layerOL,
		"title" : layerConfig.getTitle(),
		"id" : layerConfig.getId()
	});

	parent.prepend(item);
	
	//Trigger height change event
	//console.log("added to active menu - trigger event");
	$(parent).trigger("heightChange");
	
	Sorting.refresh(parent);
	
	//Return the newly created item
	return item;
};

LayerMenu.addMultiLayerToMenu = function(layerConfig, layerOL, hasDelete) {

	var where = layerConfig.getGroup();
	var parent = getParentElement(where);

	if (parent == null) {
		//alert("no element in the menu called " + where);
		return;
	}

	var layerData = layerConfig.getLayerData();
	
	$.each(layerData, function(key, value) {

		var enabled = false;
		if (Utils.isTrue(value.enabled)) {
			enabled = true;
		}
		
		var deleteButton = null;
		if(hasDelete) {
			deleteButton = LayerMenuUtils.buildDeleteLayerButton(function(btn, e) {
				e.stopPropagation();
				//var layerLI = $(this).closest("li");
				var layerLI = btn.closest("li");
				deleteLayer(layerLI);
			});
		}

		var item = LayerMenuUtils.buildLayerMenuItemForWMSMulti(value.title, deleteButton,
			function(btn, e) {
				//Zoom clicked function
				e.stopPropagation();
				var item = btn.closest("li");
				if(TreeMenu.isItemMenuEnabled(item)) {
					LayerMenu.zoomToLayer(item.data("id"), item.data("title"));
				}
			}
		);
		
		if (enabled) {
			//item.addClass("enabled");
			TreeMenu.toggleItemMenuEnabling(item, true);
		}

		item.click(function(e) {
			e.stopPropagation();
			LayerMenu._singleLayerClicked($(this));
		});

		var icon =  LayerMenuUtils.createLayerSelectedMenuToggleVisibilityCheckbox(function(btn, e){
			e.stopPropagation();
			LayerMenu._wmsMultiLayerChecked(item);
		});

		item.prepend(icon);

		/*
		 * Attaching the OpenLayers variable to the item (LI) element, for fast
		 * retrieval on click.
		 */
		item.data({
			"layerOL" : layerOL,
			"title" : value.title,
			"id" : layerConfig.getId()
		});

		// Append legend to li item
		var name = layerConfig.getNameByTitle(value.title);
		item.append(LegendGraphics.getLegendImageLayer(layerConfig.getUrl(), name));
		
		parent.append(item);
	});
	
	var transparencyDiv = LayerMenuUtils.buildTransparencyDIV(layerConfig);
	parent.prepend(transparencyDiv);
};

LayerMenu.selectAndOpenLayerInMenu = function(layerLI) {
	// Expand root item menu
	var divGroup = tree.getGroupDIVFromLayer($(layerLI));
	TreeMenu.expandRootItem($(divGroup));
	
	// Activate layer if not enabled
	//TreeMenu.enableItemMenu($(layerLI));
	var itemLI = $(layerLI);
	var isAdded = TreeMenu.isItemAdded(itemLI);
	
	if (!isAdded) {
		/*
		 * Add item to selected layer menu
		 */
		var checkbox = itemLI.find(".addLayerCheckbox");
		checkbox.prop("checked", true).change();
		//LayerMenu._addToSelectedLayerPanel(itemLI);
	} else {
		//Already added.
		//Set it to visible
		var id = itemLI.data("id");
		var layerOL = itemLI.data("layerOL");
		
		var layerInSelectedPanelItem = selectedLayerTree.getItemByDataProperty("id", id);
		TreeMenu.toggleItemMenuEnabling(layerInSelectedPanelItem, true);
		layerOL.setVisibility(true);
		
		//Enable the checkbox (no events triggered).
		layerInSelectedPanelItem.find(".toggleLayerCheckbox").prop("checked", true);
	}
};

LayerMenu.getLayerLIFromMenu = function(urlToSearch, nameToSearch) {
	var foundLayerLI = null;
	
	var allLayers = tree.getAllLayers(); 
	
	$.each(allLayers, function(idx, layerLI) {
		var id = $(layerLI).data("id");
		var layerConfig = catalog.getLayerConfigById(id);
		if(layerConfig.getUrl() === urlToSearch) {
			if(layerConfig.getSource() == "wms_multi_layer") {
				layerConfigName = layerConfig.getNameByTitle(layerConfig.getTitle());
			}
			else {
				layerConfigName = layerConfig.getName();
			}
			
			//Può dare errore!
			//Da modificare!
			if (Utils.EqualsNamespaceSafe(layerConfigName, nameToSearch)) {
			//if(layerConfigName === nameToSearch.split(":")[1]) {
				foundLayerLI = layerLI;
				
				//Found, break from the for-each loop 
				return false;
			}
		}
	});
	
	return foundLayerLI;
};


/**
 * Esegue lo zoom al layer - Recupera l'oggetto layerConfig dall'id - Recupera
 * il bbox dalle capabilities dell'oggetto layerConfig
 * 
 * @param id
 *            Identificativo dell'oggetto layerConfig
 */
LayerMenu.zoomToLayer = function(id, title) {
	var layerConfig = catalog.getLayerConfigById(id);

	var layerName = null;
	if (layerConfig.getSource() === "wms_multi_layer") {
		// Multi-layer, devo recuperare il title
		layerName = layerConfig.getNameByTitle(title);
	} else if (layerConfig.getSource() === "wms") {
		// WMS Server singolo
		layerName = layerConfig.getName();
	} else {
		//alert("Error");
	}

	var bbox = layerConfig.getBbox(layerName);
	
	if (layerConfig.getSource() === "kml") {
		//Zoom to the bounding box...
		map.zoomToExtent(bbox);
		return;
	}
	
	//Else .... (wms or wms multi with bbox fetched with the capabilities...)
	var wgs84EPSG = new OpenLayers.Projection("EPSG:4326");
	var mapEPSG = new OpenLayers.Projection(map.getProjection());

	if (bbox.hasOwnProperty("minx") && bbox.hasOwnProperty("miny")
			&& bbox.hasOwnProperty("maxx") && bbox.hasOwnProperty("maxy")) {
		var boundsLayer = new OpenLayers.Bounds(bbox.minx, bbox.miny,
				bbox.maxx, bbox.maxy);
		bounds = boundsLayer.transform(wgs84EPSG, mapEPSG);

		map.zoomToExtent(bounds);
	} else {
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Warning_Title"), 
			LocaleManager.getKey("AlertDialog_Error_RetrievingBbox")
		);
	}
};


/**
 * Remove item from the Selected Layer Panel...
 * 
 * Rimuove il layer dal menù - Recupera l'oggetto layerConfig dall'id - Recupera
 * l'oggetto layer di openlayers - Rimuove il layer openlayers dalla mappa -
 * Rimuove il layer dal catalogo - Rimuove l'item layer dal menù
 * 
 * @param layerObj
 * @returns {Boolean} layerObj: oggetto "li" jquery avente i parametri del layer
 *          in "data"
 */
LayerMenu._removeFromSelectedLayerPanel = function(menuItem) {
	
	var id = menuItem.data("id");
	var layerOL = menuItem.data("layerOL");
	
	var parent = menuItem.closest("menu_tree_parent");
	
	//Abilita il menu normale
	var itemLIMenuGlobal = tree.getItemByDataProperty("id", id);
	if (!Utils.isNullOrUndefined(itemLIMenuGlobal)) {
		//Corrispondenza nella lista layer globale
		TreeMenu.toggleItemMenuAddition(itemLIMenuGlobal, false);
		
		layerOL.setVisibility(false);
	}
	else {
		// Rimuove l'oggetto configLayer dal catalogo layerConfigCatalog
		catalog.removeLayerFromConfig(id);
	}
	// Rimuove il layer dalla mappa
	map.removeLayer(layerOL);
	
	// Rimuove il layer dal menù
	menuItem.remove();
	
	//Trigger height change event
	//console.log("removed from active - trigger event");
	$(parent).trigger("heightChange");
	
	return true;
};
