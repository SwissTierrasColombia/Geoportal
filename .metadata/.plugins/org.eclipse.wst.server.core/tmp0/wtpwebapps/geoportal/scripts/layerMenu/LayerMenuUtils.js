function LayerMenuUtils() {
};

/*
 * Config elements:
 * title, 
 * deleteBtn, 
 * addZoomBtn, 
 * isExternal, 
 * zoomToClickedFn, 
 * layerMenuItemClickedFn,
 * showInfoBtn
 * infoBtnClickedFn
 * 
 */
LayerMenuUtils.buildLayerMenuItem_NEW = function(config) {
	var title = config.title;
	var deleteBtn = config.deleteBtn;
	var addZoomBtn = config.addZoomBtn;
	var isExternal = config.isExternal;
	var zoomToClickedFn = config.zoomToClickedFn;
	var layerMenuItemClickedFn = config.layerMenuItemClickedFn;
	var showInfoBtn = config.showInfoBtn;
	var infoBtnClickedFn = config.infoBtnClickedFn;
	
	
	var menuActions = $("<div>").attr("class", "menu-actions");
	
	if (!Utils.isNullOrUndefined(deleteBtn)) {
		menuActions.append(deleteBtn);
	}
	
	if (addZoomBtn === true) {
		menuActions.append(
			//deleteBtn,
			LayerMenuUtils.buildZoomToLayerButton(zoomToClickedFn)
		);
	}
	
	if (showInfoBtn === true) {
		menuActions.append(LayerMenuUtils.buildShowInfoLayerButton(infoBtnClickedFn));
	}
	
	var classToAdd = "item-text word-wrap";
	if (isExternal) {
		classToAdd += " externalWMS";
	}
	
	var layerTitleDiv = $("<div>").attr("class", classToAdd).text(title);
	
	var item = $("<li>").attr({"class" : "layerMenuItem"}).append(
			$("<div>").attr({"class": "item-layer"}).append(
				menuActions, layerTitleDiv
			).click(function(e) {
				if (!Utils.isNullOrUndefined(layerMenuItemClickedFn)) {
					layerMenuItemClickedFn($(this), e);
				}
			})
	);
	return item;
};


LayerMenuUtils.buildLayerMenuItemForWMSMulti = function(title, deleteBtn, zoomToClickedFn) {
	var item = $("<li>").attr({"class" : "layerMenuItem"}).append(
			$("<div>").attr("class", "item-text word-wrap").text(title),
			$("<div>").attr("class", "menu-actions").append(
				$("<div>").append(
					deleteButton,
					LayerMenuUtils.buildZoomToLayerButton(zoomToClickedFn)
				)
			),
			LayerMenuUtils.buildToggleLegendImgBtn(true)
	);
	
	return item;
};

/**
 *  Build layer transparency slider
 */

/**
 *  Build layer transparency slider
 */
LayerMenuUtils.buildTransparencyDIV = function(layerConfig, showLegendIcon) {
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
			toolT.append(toolTText, LayerMenuUtils.buildToggleLegendImgBtn(), cSlider);	
		}
		else {
			toolT.append(toolTText, cSlider);
		}
	}
	return toolT;
};

/**
 *  Build legend toggle image button
 */
LayerMenuUtils.buildToggleLegendImgBtn = function(isMulti) {
	var extraClass = "";
	
	if(isMulti)
		extraClass = "item-toggle-legend-multi";
	
	var toggleLeg = $("<div>").attr("class", "item-toggle-legend localizedElement " + extraClass).data({
			locale_ref: "title",
			locale_key: "showLegend"
		}).append(
			$("<i>").attr({"class": "fa fa-photo fa-lg"})
		).click(function(){
			LayerMenuUtils.toggleLegend($(this).closest("li").find(".legendItem"));
		});
	
	return toggleLeg;
};


//Toggle legend container
LayerMenuUtils.toggleLegend = function(legend) {
	if(legend.is(":visible")) {
		legend.hide();
		legend.closest("li").find(".item-toggle-legend").data({
			locale_key: "showLegend"
		});
	}
	else {
		legend.show();
		legend.closest("li").find(".item-toggle-legend").data({
			locale_key: "hideLegend"
		});
	}
};

/**
 * Creates the button to show the INFO of the layer from the menu
 * @param clickFn
 */
LayerMenuUtils.buildShowInfoLayerButton = function(clickFn) {
	var showInfoButton = $("<span>").data({
		locale_ref: "title",
		locale_key: "TOC_Layers_Show_Layer_Info_Panel"
	}).attr("class", "localizedElement").append(
		$("<i>").attr({"class": "fa fa-info-circle"})
	).click(function(e) {
		if (!Utils.isNullOrUndefined(clickFn)) {
			clickFn($(this), e);
		}
	});
	return showInfoButton;
};

/**
 * Creates the button to remove the layer from the menu
 * @param clickFn
 */
LayerMenuUtils.buildDeleteLayerButton = function(clickFn) {
	var deleteButton = $("<span>").data({
		locale_ref: "title",
		locale_key: "TOC_Layers_Remove_From_Selected_Panel"
	}).attr("class", "localizedElement").append(
		$("<i>").attr({"class": "fa fa-trash-o"})
	).click(function(e) {
		if (!Utils.isNullOrUndefined(clickFn)) {
			clickFn($(this), e);
		}
	});
	return deleteButton;
};

/**
 * Creates the button to zoom to layer extent
 * @params clickFn
 */
LayerMenuUtils.buildZoomToLayerButton = function(clickFn) {
	var zoomToButton = $("<span>").data({
		locale_ref: "title",
		locale_key: "General_ZoomToLayer_Button_Title"
	}).attr("class", "localizedElement")
	.append(
		$("<i>").attr({"class": "fa fa-search"})
	).click(function(e) {
		if (!Utils.isNullOrUndefined(clickFn)) {
			clickFn($(this), e);
		}
	});
		
	return zoomToButton;
};

/**
 * Creates the Checkbox for the layer visibility in the Selected Layer Menu
 * 
 */
LayerMenuUtils.createLayerSelectedMenuToggleVisibilityCheckbox = function(clickFn) {
	var checkBox = $("<input>").attr("type", "checkbox").prop("checked", true).addClass("toggleLayerCheckbox");
	checkBox.click(function(e) {
		if (!Utils.isNullOrUndefined(clickFn)) {
			clickFn($(this), e);
		}
	});
	return checkBox;
};

///**
// * Creates the Icon for the layer shown on the Layer Menu
// * Adds a "Activate image"
// * 
// * @returns
// */
//LayerMenuUtils.createLayerMenuIcon = function(clickFn) {
//	var iconBtn = $("<div>").attr("class", "menu-toggle-layer").append(
//			$("<img>").attr("src", "./images/layer_selected.png"));
//	iconBtn.click(function(e) {
//		if (!Utils.isNullOrUndefined(clickFn)) {
//			clickFn($(this), e);
//		}
//	});
//	return iconBtn;
//};

/*******************************
 *  CREATES THE CHECKBOX ICON
 *******************************/
/**
 * Creates the Checkbox for the layer shown on the Layer Menu
 */
LayerMenuUtils.createLayerMenuCheckboxForAdd = function(clickFn) {
	var checkBox = $("<input>").attr("type", "checkbox").addClass("addLayerCheckbox").data({
		locale_key : "TOC_Layers_Add_To_Selected_Panel",
		locale_ref: "title"
	});
	checkBox.change(function(e) {
		if (!Utils.isNullOrUndefined(clickFn)) {
			clickFn($(this), e);
		}
	});
	return checkBox;
};

/*******************************
 *  CREATES THE ADD (PLUS) ICON
 *******************************/
/**
 * Creates the Icon for the layer shown on the Layer Menu
 * Adds a "Activate image"
 * 
 * @returns
 */
//LayerMenuUtils.createLayerMenuIconForAdd = function(clickFn) {
//	var iconBtn = $("<div>").attr("class", "menu-activate-layer fa fa-plus fa-medium localizedElement").data({
//		locale_key : "TOC_Layers_Add_To_Selected_Panel",
//		locale_ref: "title"
//	});
//	
//	//.append($("<img>").attr("src", "./images/layer_selected.png"));
//	iconBtn.click(function(e) {
//		if (!Utils.isNullOrUndefined(clickFn)) {
//			clickFn($(this), e);
//		}
//	});
//	return iconBtn;
//};