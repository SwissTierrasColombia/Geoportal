var TreeMenu = function(parentDiv) {
	
	this.parent = parentDiv;
	this.contentDiv = this.parent.find(".tab_content");
	
	this.createNewGroupInMenu = function(groupCode, groupTitle) {
		var grpMenu = this.getGroupFromMenuByCode(groupCode);
		if (grpMenu == null) {
			//Group does not exist
			grpMenu = this.buildNewGroupDIV(groupCode, groupTitle);
			
			//Append to parent
			//this.parent.append(grpMenu);
			
			//Append to contentDiv
			this.contentDiv.append(grpMenu);
		}
		
		//Trigger height change event
		//console.log("add new group - trigger event");
		$(this.parent).trigger("heightChange");
		
		return grpMenu;
	};
	
	this.buildNewGroupDIV = function(groupCode, groupTitle) {
		// If exists, add the corresponding DIV
		var group = $("<div>", {
			"id" : "menu_" + groupCode,
			"class" : "root_item"
		}).data("grp_code", groupCode);
		

		var referenceToClass = this;
		var menuTitle = $("<div>", {
			"class" : "menu_title"
		}).click(function() {
			referenceToClass.toggleMenuItemContent($(this).parents('.root_item'));
		});

		//var icon = $("<div>").addClass("root_icon root_icon_collapsed");
		var icon = this.buildIconGroupTree();
		var text = $("<div>").addClass("root_text").text(groupTitle);

		menuTitle.append(icon, text);

		var menuContent = $("<div>").addClass("menu_item_content custom-hidden")
				.append($("<ul>").addClass("menu_item_content_list"));

		group.append(menuTitle, menuContent);
		
		return group;
	};
	
	this.buildIconGroupTree = function() {
		var iconGroupIcon = $("<span>").attr({"class": "fa-stack root-tree-icon"}).append(
			$("<i>").attr({"class": "fa fa-plus fa-stack-1x"}),
			$("<i>").attr({"class": "fa fa-circle-thin fa-stack-2x"})			
		);
		
		return iconGroupIcon;
	};
	
	this.getGroupFromMenuByCode = function(groupCode) {
		var foundGroup = null;
		
		//var groupList = $("#tab_layers").find(".root_item");
		var groupList = this.parent.find(".root_item");
		$.each(groupList, function(k,grp){
			var code_i = $(grp).data("grp_code");
			if (groupCode === code_i) {
				foundGroup = grp;
				return false;
			}
		});
		
		return foundGroup;
	};
	
	this.prependElementToGroup = function(groupCode, element) {
		var par = this.getParentElementByCode(groupCode);
		par.prepend(element);
		
		//Trigger height change event
		//console.log("prepend element to group - trigger event");
		$(this.parent).trigger("heightChange");
	};
	
	
	this.getParentElementByCode = function(groupCode) {
		var parent = null;
		var search = "#menu_" + groupCode + " .menu_item_content_list";
		parent = $(search);
		return parent;
	};
	
	this.getNumberOfChildrenOfGroupDIV = function(groupObj) {
		var children = groupObj.find("li");
		return children.length;
	};
	
	this.isGroupExpanded = function(menuRootItem) {
		var elem = menuRootItem.find(".menu_item_content");
		var isVisible = elem.is(":visible");
		return isVisible;
	};
	
	/**
	 * Takes care of the unfolding/folding of the menu root items (for instance
	 * "background" and "layers" items). When one of these items is clicked, the
	 * nested menu (menu_item_content) is unfolded and is set to visible. In the
	 * same way round, when it is clicked again, it gets folded and the nested menu
	 * is set to hidden.
	 * 
	 * @param menuRootItem the "rootItem" element of the DOM.
	 */
	this.toggleMenuItemContent = function(menuRootItem) {
		var isVisible = this.isGroupExpanded(menuRootItem);

		if (isVisible) {
			TreeMenu.collapseRootItem(menuRootItem);		
		} else {
			TreeMenu.expandRootItem(menuRootItem);
		}
	};
	
	/**
	 * Gets the <Root Item> element of the group of the layer
	 */
	this.getGroupDIVFromLayer = function(layerLI) {
		return layerLI.closest(".root_item");
	};
	
	/**
	 * Gets the layers in the menu
	 * <LI> element)
	 */
	this.getAllLayers = function() {
		var selectedLayerMenuItem = this.parent.find(".layerMenuItem");
		if (selectedLayerMenuItem.length == 0) {
			return null;
		}
		return selectedLayerMenuItem;
	};

	/**
	 * Gets the number of layers in the menu
	 * <LI> element)
	 */
	this.getAllLayersSize = function() {
		var selectedLayerMenuItem = this.parent.find(".layerMenuItem");
		return selectedLayerMenuItem.length;
	};
	
	/**
	 * Gets the selected layer. Returns the menuitem (
	 * <LI> element)
	 */
	this.getSelectedLayer = function() {
		var selectedLayerMenuItem = this.parent.find(".layerMenuItem.selected");		
		if (selectedLayerMenuItem.length == 0) {
			return null;
		}
		return selectedLayerMenuItem;
	};
	
	/**
	 * Gets the visible layers. Returns the menuitem (
	 * <LI> element)
	 */
	this.getVisibleLayers = function() {
		var visibleLayerMenuItem =  this.parent.find(".layerMenuItem.enabled");
		if (visibleLayerMenuItem.length == 0) {
			return null;
		}
		return visibleLayerMenuItem;
	};
	
	this.getItemByDataProperty = function(dataPropertyName, dataPropertyValue) {
		var foundItemLI = null;
		
		var allLayers = this.getAllLayers(); 
		
		$.each(allLayers, function(idx, itemLI) {
			//var prop = $(itemLI).data("id");
			var prop = $(itemLI).data(dataPropertyName);
			if (dataPropertyValue === prop) {
				foundItemLI = $(itemLI);
				return false; //cycle break;
			}
			return true; //next iteration
		});
		
		return foundItemLI;
	};
};

TreeMenu.collapseRootItem = function(menuRootItem) {
	var elem = menuRootItem.find(".menu_item_content");
	var parent = menuRootItem.closest(".menu_tree_parent");
	
	// Fold the component
	elem.hide("fast");

	// Change the class of the "rootItem"
	var minMaxIcon = menuRootItem.find(".root-tree-icon .fa-stack-1x");
	minMaxIcon.removeClass("fa-minus");
	minMaxIcon.addClass("fa-plus");		
	
	//Trigger height change event
	//console.log("collapse group - trigger event");
	$(parent).trigger("heightChange");
};

TreeMenu.expandRootItem = function(menuRootItem) {
	var elem = menuRootItem.find(".menu_item_content");
	var parent = menuRootItem.closest(".menu_tree_parent");
	// Unfold the component
	elem.show("fast");

	// Change the class of the "rootItem"
	var minMaxIcon = menuRootItem.find(".root-tree-icon .fa-stack-1x");
	minMaxIcon.removeClass("fa-plus");
	minMaxIcon.addClass("fa-minus");
	
	//Trigger height change event
	//console.log("expand group - trigger event");
	$(parent).trigger("heightChange");
};

TreeMenu.isItemMenuEnabled = function(itemMenu) {
	return (itemMenu.hasClass("enabled"));
};

TreeMenu.enableItemMenu = function(itemMenu) {
	if (TreeMenu.isItemMenuEnabled(itemMenu)) {
		return;
	}
	TreeMenu.toggleItemMenuEnabling(itemMenu, true);
};

TreeMenu.toggleItemMenuEnabling = function(itemMenu, enable) {
	if (enable === true) {
		itemMenu.addClass('enabled');
	}
	if (enable === false) {
		itemMenu.removeClass('enabled');
	}
};

TreeMenu.isItemMenuSelected = function(itemMenu) {
	return (itemMenu.hasClass("selected"));
};

TreeMenu.toggleItemMenuSelection = function(itemMenu, select) {
	if (select === true) {
		itemMenu.addClass('selected');
	}
	if (select === false) {
		itemMenu.removeClass('selected');
	}
};

TreeMenu.isItemAdded = function(itemMenu) {
	return (itemMenu.hasClass("added"));
};

TreeMenu.toggleItemMenuAddition = function(itemMenu, add) {
	if (add === true) {
		itemMenu.addClass('added');
	}
	if (add === false) {
		itemMenu.removeClass('added');
	}
};