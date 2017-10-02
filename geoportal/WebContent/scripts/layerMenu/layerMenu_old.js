var groups = null;

function isBackgroundGroup(groupCode) {
	var isBackground = false;
	var found = false;
	$.each(groups.layersGroups, function(idx, grp) {
		if (grp.code === groupCode) {
			//Found.
			isBackground = grp.background;
			found = true;
		}
	});
	
	if (found) return isBackground;
	throw "GROUP " + groupCode + "NOT FOUND! ERROR!";
}

function toggleMenu(obj) {
	// Collassa il men� laterale
	if (obj.hasClass("expanded")) {
		obj.find("img").attr("src", images.menu.expand);
		obj.removeClass("expanded");
		$("#menu_tabs").hide("slide", {
			direction : "right"
		}, 130);
		$("#menu_header").hide("slide", {
			direction : "right"
		}, 130);
		obj.addClass("img-collapse-right");
		$("#menu_toggle").data({"locale_key": "General_Expand"});
	}
	// Espande il men� laterale
	else {
		obj.addClass("expanded");
		obj.find("img").attr("src", images.menu.collapse);
		$("#menu_header").show("slide", {
			direction : "right"
		}, 130);
		$("#menu_tabs").show("slide", {
			direction : "right"
		}, 130);
		obj.removeClass("img-collapse-right");
		$("#menu_toggle").data({"locale_key": "General_Collapse"});
	}
}

function toggleGcatalog(obj) {
	// Collassa il men� laterale
	if (obj.hasClass("expanded")) {
		obj.find("img").attr("src", images.menu.collapse);
		obj.removeClass("expanded");
		$("#gcatalog_layers").hide("slide", {
			direction : "left"
		}, 130);
		$("#gcatalog_header").hide("slide", {
			direction : "left"
		}, 130);
		obj.addClass("img-collapse-left");
		$("#gcatalog_toggle").attr("title",
				LocaleManager.getKey("Page_Menu_Tooltip_Panel_Toggle_Expand"));
	}
	// Espande il men� laterale
	else {
		obj.addClass("expanded");
		obj.find("img").attr("src", images.menu.expand);
		$("#gcatalog_header").show("slide", {
			direction : "left"
		}, 130);
		$("#gcatalog_layers").show("slide", {
			direction : "left"
		}, 130);
		obj.removeClass("img-collapse-left");
		$("#gcatalog_toggle")
				.attr(
						"title",
						LocaleManager
								.getKey("Page_Menu_Tooltip_Panel_Toggle_Collapse"));
	}
}

function loadMenuGroups() {
	
	//Ordered Groups
	var orderedGroups = Utils.orderByAttribute(groups.layersGroups, "position", "asc");
	
	var parent = $("#tab_layers");
	
	$.each(orderedGroups, function(k, v) {
		var groupName = v.name;
		var groupCode = v.code;
		var groupTitle = v.title;
		
		/*
		 * If the groupname is the background group,
		 * don't add it to the menu
		 */
		var isBackgroundGrp = isBackgroundGroup(groupCode);
		if(isBackgroundGrp) {
			return true; //goto next iteration
		}
		
		var exists = catalog.existsLayerForGroup(groupName);
		if (!exists) {
			return; // //goto next iteration
		}

		createNewGroupInMenu(groupCode, groupTitle);
	});
}

function createNewGroupInMenu(groupCode, groupTitle) {
	var parent = $("#tab_layers");
	
	var grpMenu = getGroupFromMenuByCode(groupCode);
	if (grpMenu == null) {
		//Group does not exist
		grpMenu = buildNewGroupDIV(groupCode, groupTitle);
		//Append to parent
		parent.append(grpMenu);
	}
	return grpMenu;
}

function buildNewGroupDIV(groupCode, groupTitle) {
	// If exists, add the corresponding DIV
	var group = $("<div>", {
		"id" : "menu_" + groupCode,
		"class" : "root_item"
	}).data("grp_code", groupCode);
	

	var menuTitle = $("<div>", {
		"class" : "menu_title"
	}).click(function() {
		toggleMenuItemContent($(this).parents('.root_item'));
	});

	var icon = $("<div>").addClass("root_icon root_icon_collapsed");
	var text = $("<div>").addClass("root_text").text(groupTitle);

	menuTitle.append(icon, text);

	var menuContent = $("<div>").addClass("menu_item_content custom-hidden")
			.append($("<ul>").addClass("menu_item_content_list"));

	group.append(menuTitle, menuContent);
	
	return group;
}

function getGroupFromMenuByCode(groupCode) {
	var foundGroup = null;
	
	var groupList = $("#tab_layers").find(".root_item");
	$.each(groupList, function(k,grp){
		var code_i = $(grp).data("grp_code");
		if (groupCode === code_i) {
			foundGroup = grp;
			return false;
		}
	});
	
	return foundGroup;
}

function toggleWMSLayersMenu(turnOn) {
	var isHidden = $("#menu_layers").hasClass("custom-hidden");

	if (turnOn && isHidden) {
		$("#menu_layers").removeClass("custom-hidden");
	}
	if (!turnOn && !isHidden) {
		$("#menu_layers").addClass("custom-hidden");
	}
}

function refreshWMSLayersMenuVisibility() {
	var numberOfChildren = $("#menu_layers .menu_item_content_list li").length;
	if (numberOfChildren > 0) {
		toggleWMSLayersMenu(true);
	} else {
		toggleWMSLayersMenu(false);
	}
}


/**
 * Gets the <Root Item> element of the group of the layer
 */
function getGroupDIVFromLayer(layerLI) {
	return layerLI.closest(".root_item");
}


/**
 * Gets the layers in the menu
 * <LI> element)
 */
function getAllLayers() {
	var selectedLayerMenuItem = $("#tab_layers .layerMenuItem");
	if (selectedLayerMenuItem.length == 0) {
		return null;
	}
	return selectedLayerMenuItem;
}

/**
 * Gets the selected layer. Returns the menuitem (
 * <LI> element)
 */
function getSelectedLayer() {
	var selectedLayerMenuItem = $("#tab_layers .layerMenuItem.selected");		
	if (selectedLayerMenuItem.length == 0) {
		return null;
	}
	return selectedLayerMenuItem;
}


/**
 * Gets the visible layers. Returns the menuitem (
 * <LI> element)
 */
function getVisibleLayers() {
	var visibleLayerMenuItem = $("#tab_layers .layerMenuItem.enabled");
	if (visibleLayerMenuItem.length == 0) {
		return null;
	}
	return visibleLayerMenuItem;
}

function getSelectedBasemapLayer() {
	var selectedOption = $("#baselayers-select option:selected");
	var selectedVal = parseInt(selectedOption.val());
	return catalog.getLayerConfigById(selectedVal);
}

/**
 * Gets the parent DOM
 * <LI> element
 * 
 * @param where
 *            Either "background" or "layers".
 * @returns
 */
function getParentElement(where, layerConfig) {
	var parent = null;

	if (where === "background") {
		parent = $("#menu_backgound .menu_item_content_list");
	} else {
		var search = "#menu_" + where + " .menu_item_content_list";
		parent = $(search);
	}

	return parent;
}

/**
 * Creates the Icon for the layer shown on the Layer Menu
 * 
 * @returns
 */
function createIcon() {
	var icon = $("<div>").attr("class", "menu-toggle-layer").append(
			$("<img>").attr("src", "./images/layer_selected.png"));
	return icon;
}

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
function _singleLayerChecked(menuItem) {
	// e.preventDefault();

	/*
	 * Retrieving the attached OpenLayers' layer.
	 */
	var olLayer = menuItem.data("layerOL");
	// var isBaseLayer = olLayer.isBaseLayer;

	var title = menuItem.data("title");
	// alert("Title: " + title);

	/*
	 * Toggle Layer Visibility: getting the current status of the item in the
	 * menu and setting the visibility accordingly
	 */

	var currentVisibility = menuItem.hasClass('enabled');

	if (currentVisibility) {
		menuItem.removeClass('enabled');
		menuItem.removeClass("selected");
	} else {
		menuItem.addClass('enabled');

		/*
		 * if (isBaseLayer) { var menuBackgroundContentList =
		 * getParentElement("background");
		 * 
		 * $.each(menuBackgroundContentList.find("li"), function(k, value) { var
		 * li = $(value); if (li.text() !== title) {
		 * $(value).removeClass('enabled'); } }); }
		 */
	}

	/* if (!isBaseLayer) { */
	olLayer.setVisibility(!currentVisibility);
	/* } */

	/*
	 * if (isBaseLayer && !currentVisibility) {
	 * olLayer.setVisibility(!currentVisibility); map.setBaseLayer(olLayer); }
	 */

}

function enableItemMenu(item) {
	if(item.hasClass("enable"))
		return;
	item.addClass('enabled');
}

function _singleLayerClicked(menuItem) {
	var currentVisibility = menuItem.hasClass('enabled');
	var selected = menuItem.hasClass('selected');

	if (currentVisibility === true) {
		// Disabilita l'eventuale getFeature info control
		controls.deactivate(controls.WMSGetFeatureInfo);

		if (selected) {
			menuItem.removeClass("selected");
			return;
		}

		// De-select all the layer and select this one
		$("#tab_layers .selected").each(function(k, v) {
			$(this).removeClass("selected");
		});

		// Select the layer
		$(menuItem).addClass("selected");
	}
}

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
function _wmsMultiLayerChecked(menuItem) {

	/*
	 * Getting data about the visibility.
	 */
	var oldVisibility = menuItem.hasClass('enabled');
	if (oldVisibility) {
		menuItem.removeClass('enabled');
	} else {
		menuItem.addClass('enabled');
	}

	var newVisibility = !oldVisibility;

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
	var wmsNames = layerConfig.getAllLayerNamesForWMSMulti();

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

		/*
		 * Testing that the newVisibility of the later is effectively set to
		 * FALSE
		 */
/*		if (newVisibility != false) {
			alert("ERRORRRREEEEE di visibility");
		}*/

	} else {
		/*
		 * Name is not found in the current WMS LAYERS param. Let's add it.
		 */
		currentWMSNameList.push(name);

		/*
		 * Testing that the newVisibility of the later is effectively set to
		 * TRUE
		 */
/*		if (newVisibility != true) {
			alert("ERRORRRREEEEE di visibility");
		}*/
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
}

/**
 * Adds a layer to the Layer Menu.
 * 
 * @param where
 *            Specifies whether the layer must go in the "background" or in the
 *            "layers" menu
 * @param layerOL
 * @param name
 */
function addToMenu(layerConfig, layerOL, enabled, hasDelete, hasLegend) {
	var where = layerConfig.getGroup();

	var parent = getParentElement(where, layerConfig);

	if (parent == null) {
		alert("no element in the menu called " + where);
		return;
	}
	
	var deleteButton = null;
	if(hasDelete) {
		deleteButton = $("<div>").append(
			$("<img>").attr("src", "images/delete11.png")
		).click(function(e) {
			e.stopPropagation();
			var layerLI = $(this).closest("li"); 
			deleteLayer(layerLI);
		});
	}

	var item = $("<li>").attr({"class" : "layerMenuItem"}).append(
					$("<div>").attr({"class": "item-layer"}).append(
						$("<div>").attr("class", "item-text word-wrap").text(layerConfig.getTitle()),
						$("<div>").attr("class", "menu-actions").append(
							$("<div>").append(
								$("<img>").attr("src", "images/search1.png")
							).click(function(e) {
								e.stopPropagation();
								var item = $(this).closest("li");
								if (item.hasClass("enabled"))
									zoomToLayer(item.data("id"), item.data("title"));
							}),
							deleteButton
						)					
					).click(function(e) {
						e.stopPropagation();
						_singleLayerClicked($(this).closest("li"));
					})
	);
	
	item.append(buildTransparencyDIV(layerConfig, hasLegend));
	
	if (hasLegend) {
		item.append(LegendGraphics.getLegendImageLayer(layerConfig.getUrl(), layerConfig.getName()));
	}

	if (enabled) {
		item.addClass("enabled");
	}

	var icon = createIcon();
	icon.click(function(e) {
		e.stopPropagation();
		_singleLayerChecked(item);
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

	//parent.append(item);
	parent.prepend(item);
	
	//Return the newly created item
	return item;
}

function addToBLMenu(bLayerConfig, layerOL) {
	var combo = $("#baselayers-select");

	combo.append($("<option/>", {
		"value" : bLayerConfig.getId(),
		"text" : bLayerConfig.getTitle(),
	}).data({
		"layerOl" : layerOL,
		"enabled" : bLayerConfig.isEnabled()
	}));

	return true;
}

function addMultiLayerToMenu(layerConfig, layerOL, hasDelete) {

	var where = layerConfig.getGroup();
	var parent = getParentElement(where, layerConfig);

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
			deleteButton = $("<div>").append(
				$("<img>").attr("src", "images/delete11.png")
			).click(function(e) {
				e.stopPropagation();
				var layerLI = $(this).closest("li");
				deleteLayer(layerLI);
			});
		}

		var item = $("<li>").attr({"class" : "layerMenuItem"}).append(
				$("<div>").attr("class", "item-text word-wrap").text(value.title),
				$("<div>").attr("class", "menu-actions").append(
					$("<div>").append(
						$("<img>").attr("src", "images/search1.png")).click(function(e) {
							e.stopPropagation();
							var item = $(this).closest("li");
							if (item.hasClass("enabled"))
								zoomToLayer(item.data("id"),
									item.data("title"));
						}),
						deleteButton
					),
					buildToggleLegendImgBtn(true)
				);
		
		if (enabled) {
			item.addClass("enabled");
		}

		item.click(function(e) {
			e.stopPropagation();
			_singleLayerClicked($(this));
		});

		var icon = createIcon();
		icon.click(function(e) {
			e.stopPropagation();
			_wmsMultiLayerChecked(item);
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
	
	//
	parent.prepend(buildTransparencyDIV(layerConfig));
}

function selectAndOpenLayerInMenu(layerLI) {
	// Expand root item menu
	var divGroup = getGroupDIVFromLayer($(layerLI));
	expandRootItem($(divGroup).find(".menu_item_content"), $(divGroup));
	
	// Activate layer if not enabled
	enableItemMenu($(layerLI));				
	var olLayer = $(layerLI).data("layerOL");
	olLayer.setVisibility(true);
}

function getLayerLIFromMenu(urlToSearch, nameToSearch) {
	var foundLayerLI = null;
	
	$.each(getAllLayers(), function(idx, layerLI) {
		var id = $(layerLI).data("id");
		var layerConfig = catalog.getLayerConfigById(id);
		if(layerConfig.getUrl() === urlToSearch) {
			if(layerConfig.getSource() == "wms_multi_layer") {
				layerConfigName = layerConfig.getNameByTitle(layerConfig.getTitle());
			}
			else {
				layerConfigName = layerConfig.getName();
			}
			
			//Pu� dare errore!
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
}

/**
 * Takes care of the unfolding/folding of the menu root items (for instance
 * "background" and "layers" items). When one of these items is clicked, the
 * nested menu (menu_item_content) is unfolded and is set to visible. In the
 * same way round, when it is clicked again, it gets folded and the nested menu
 * is set to hidden.
 * 
 * @param menuRootItem
 *            the "rootItem" element of the DOM.
 */
function toggleMenuItemContent(menuRootItem) {
	var elem = menuRootItem.find(".menu_item_content");
	var isVisible = elem.is(":visible");

	if (isVisible) {
		collapseRootItem(elem, menuRootItem);		
	} else {
		expandRootItem(elem, menuRootItem);
	}
}

function expandRootItem(elem, menuRootItem) {
	// Unfold the component
	elem.show("fast");

	// Change the class of the "rootItem"
	var minMaxIcon = menuRootItem.find(".root_icon");
	minMaxIcon.removeClass("root_icon_collapsed");
	minMaxIcon.addClass("root_icon_expanded");
}

function collapseRootItem(elem, menuRootItem) {
	// Fold the component
	elem.hide("fast");

	// Change the class of the "rootItem"
	var minMaxIcon = menuRootItem.find(".root_icon");
	minMaxIcon.removeClass("root_icon_expanded");
	minMaxIcon.addClass("root_icon_collapsed");		
}

/**
 * Esegue lo zoom al layer - Recupera l'oggetto layerConfig dall'id - Recupera
 * il bbox dalle capabilities dell'oggetto layerConfig
 * 
 * @param id
 *            Identificativo dell'oggetto layerConfig
 */
function zoomToLayer(id, title) {
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
}

/**
 * Rimuove il layer dal men� - Recupera l'oggetto layerConfig dall'id - Recupera
 * l'oggetto layer di openlayers - Rimuove il layer openlayers dalla mappa -
 * Rimuove il layer dal catalogo - Rimuove l'item layer dal men�
 * 
 * @param layerObj
 * @returns {Boolean} layerObj: oggetto "li" jquery avente i parametri del layer
 *          in "data"
 */
function deleteLayer(layerObj) {
	var id = layerObj.data("id");
	var olLayer = layerObj.data("layerOL");

	// Rimuove il layer dalla mappa
	map.removeLayer(olLayer);

	// Rimuove l'oggetto configLayer dal catalogo layerConfigCatalog
	catalog.removeLayerFromConfig(id);

	var groupObj = getGroupDIVFromLayer(layerObj);

	// Rimuove il layer dal men�
	layerObj.remove();
	
	//Se il gruppo � vuoto, lo cancella
	if (getNumberOfChildrenOfGroupDIV(groupObj) === 0) {
		groupObj.remove();
	}
	refreshWMSLayersMenuVisibility();

	return true;
}


function getNumberOfChildrenOfGroupDIV(groupObj) {
	var children = groupObj.find("li");
	return children.length;
}

/**
 *  Return layer transparencu slider
 */
function buildTransparencyDIV(layerConfig, showLegendIcon) {
	var extraClass = "";
	var isMulti = false;
	
	if(layerConfig.getSource() == "wms_multi_layer") {
		extraClass = "item-transparency-multi";
		isMulti = true;
	}
	
	var toolT = $("<div>").attr({"class": "item-transparency " + extraClass});
	
	
	var toolTText = $("<div>").attr({"class": "item-transparency-text"}).text(LocaleManager.getKey("Page_Menu_Transparency_Label"));
	var cSlider = $("<div>").attr({"class": "item-slider-container"});
	var slider = $("<div>").attr({"class": "item-slider-transparency"});
		slider.slider({
			max: 10,
			min: 0,
			step: 1,
			slide: function(event, ui) {
				var olLayer = null;
				if(layerConfig.getSource() == "wms_multi_layer")
					olLayer = $(this).closest(".root_item").find("li:first").data("layerOL");
				else
					olLayer = $(this).closest("li").data("layerOL");
				if(olLayer)
					olLayer.setOpacity(ui.value / 10);
			}
		}).click(function(e){
			e.stopPropagation();
		});

	cSlider.append(slider);
	
	if(!Utils.isNullOrUndefined(layerConfig.getDefaultOpacity())) {
		slider.slider("value", layerConfig.getDefaultOpacity() * 10);
	}
	else {
		slider.slider("value", 10);
	}
	
	// Add item to transparency panel
	// Add toggle legend on right side of panel (near slider bar)
	if(isMulti) {
		toolT.append(toolTText, cSlider);
	}
	else {
		if (showLegendIcon === true) {
			toolT.append(toolTText, buildToggleLegendImgBtn(), cSlider);	
		}
		else {
			toolT.append(toolTText, cSlider);
		}
	}
	return toolT;
		
}

/**
 *  Return legend toggle image button
 */
function buildToggleLegendImgBtn(isMulti) {
	var extraClass = "";
	
	if(isMulti)
		extraClass = "item-toggle-legend-multi";
	
	var toggleLeg = $("<div>").attr({"class": "item-toggle-legend " + extraClass, "title": LocaleManager.getKey("showLegend")}).append(
						$("<i>").attr({"class": "fa fa-photo fa-lg"})
					).click(function(){
						toggleLegend($(this).closest("li").find(".legendItem"));
					});
	
	return toggleLeg;
}