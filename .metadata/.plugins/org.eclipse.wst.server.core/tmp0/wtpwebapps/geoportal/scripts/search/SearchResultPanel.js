var searchResultPanel = null;
var SearchResultPanel = function(map, callbacks) {

	this.searchPanelMainDiv = $("#searchResultPanel");
	
	var self = this;
	
	/*
	 * Clear the search result panel
	 */
	this.clearSearchResultPanel = function() {
		
		/*
		 * If there are pending searches the user should be notified and asked.
		 * TODO
		 */
		
		this.searchPanelMainDiv.empty();
		
		//Hide "Clear All" Btn
		$("#search_result_panel_clear_all_cont").addClass("custom-hidden");
		
		searchP.menuSearchHide();
	};
	
	this.buildLayerResultDiv = function(layerTitle, errorMessage) {
		var resultElement = null;
		
		if (!Utils.isNullOrUndefined(errorMessage)) {
			resultElement = $("<div>").attr("class", "search-results-layer").append(
				$("<div>").attr("class", "search-results-error").text(errorMessage),
				$("<div>").attr("class", "search-results-layer-name").text(layerTitle)				
			);
		}
		
		else
		{
			resultElement = $("<div>").attr("class", "search-results-layer").append(
				$("<div>").attr("class", "search-results-tools"),
				$("<div>").attr("class", "search-results-number-and-loading")
				.append(
						$("<div>").attr("class", "search-results-number"),
						$("<div>").attr("class", "search-results-loading fa fa-spinner fa-spin")
				),
				$("<div>").attr("class", "search-results-layer-name").text(layerTitle)
			);
		}
		
		return resultElement;
	};
	
	this.buildIconShowResults = function(clickFn) {
		var icon = $("<div>").attr({"class": "menu-activate-layer fa-stack"}).append(
			$("<i>").attr("class", "fa fa-info fa-stack-1x"),
			$("<i>").attr("class", "fa fa-square-o fa-stack-2x")
		);
			
		icon.click(function(e) {
			e.stopPropagation();
			
			/*
			 * If this button is "disabled",
			 * dont do anything.
			 */
			if (self.isShowResultButtonDisabled($(this))) {
				return;
			}
			
			self.disableAllShowResults();
			clickFn(icon);
		});
		
		return icon;
	};
	
	/*
	 * Adds the search to the search result panel
	 */
	this.addSearchNotPossibleToSearchResultPanel = function(layerId, layerTitle) {

		var resultElement = this.buildLayerResultDiv(layerTitle, LocaleManager.getKey("SearchResultPanel_Search_Not_Available"));
		resultElement.data("id", layerId);
		resultElement.data("title", layerTitle);
		
		
		$("#searchResultPanel").append(resultElement);
		
		//Show "Clear All" Btn
		$("#search_result_panel_clear_all_cont").removeClass("custom-hidden");
	};
	
	/*
	 * Adds the search to the search result panel
	 */
	this.addSearchToSearchResultPanel = function(layerId, layerTitle, searchParameters) {

		var resultElement = this.buildLayerResultDiv(layerTitle);
		resultElement.data("id", layerId);
		resultElement.data("title", layerTitle);
		resultElement.data("searchParameters", searchParameters);
		
		$("#searchResultPanel").append(resultElement);
		
		//Show "Clear All" Btn
		$("#search_result_panel_clear_all_cont").removeClass("custom-hidden");
	};
	
	this.disableAllShowResults = function() {
		this.searchPanelMainDiv.find(".menu-activate-layer").addClass("btn-search-results-disabled");
	};
	
	this.enableAllShowResults = function() {
		this.searchPanelMainDiv.find(".menu-activate-layer").removeClass("btn-search-results-disabled");
	};
	
	this.isShowResultButtonDisabled = function(btn) {
		return btn.hasClass("btn-search-results-disabled");
	};
	
	this.addResultToSearchResultPanel = function(layerId, hitsNumber) {
		var resultAndLoadingDiv = this.findResultsNumberAndLoadingDivForResult(layerId);
		
		if (Utils.isNullOrUndefined(resultAndLoadingDiv)) {
			return;
		}
		
		resultAndLoadingDiv.find(".search-results-number").text(hitsNumber);
		
		//Remove loading icon...
		var loadingIcon = resultAndLoadingDiv.find(".search-results-loading");
		loadingIcon.removeClass("fa fa-spinner fa-spin fa-2x");
		loadingIcon.addClass("custom-hidden");
		
		
		//Attach Expand button to the tools..
		var resultToolsDiv = this.findResultToolsDivForResult(layerId);
		var iconExpand = this.buildIconShowResults(
			function(btn){
				//alert('clicked');
				//Aggiunto per spegnere Search Panel...
				searchP.deactivate();
				
				//Get parent
				var layerDIV = btn.closest(".search-results-layer");
				var layerId = layerDIV.data("id");
				var searchParameters = layerDIV.data("searchParameters");
				var layerTitle = layerDIV.data("title");

				featureGridPanel.startLoading(layerId, layerTitle, searchParameters, hitsNumber, function(success){
					//CallbackFn...
					//Reactivate the icons....
					self.enableAllShowResults();
				});
			}
		);
		
		resultToolsDiv.append(iconExpand);
		
	};
	
	this.removeResultFromSearchResultPanel = function(layerId) {
		var resultDIV = this.findResultLayerByDataProperty("id", layerId);
		resultDIV.remove();
	};
	
	this.findResultToolsDivForResult = function(layerId) {
		var resultDIV = this.findResultLayerByDataProperty("id", layerId);
		
		var resultAndLoadingDiv = resultDIV.find(".search-results-tools");
		return resultAndLoadingDiv;
	};
	
	this.findResultsNumberAndLoadingDivForResult = function(layerId) {
		var resultDIV = this.findResultLayerByDataProperty("id", layerId);
		
		if (Utils.isNullOrUndefined(resultDIV)) {
			return null;
		}
		
		var resultAndLoadingDiv = resultDIV.find(".search-results-number-and-loading");
		return resultAndLoadingDiv;
	};
	
	this.findResultLayerByDataProperty = function(dataPropertyName, dataPropertyValue) {
		var foundResultDIV = null;
		
		var results = $("#searchResultPanel .search-results-layer");
		
		$.each(results, function(idx, resultDIV) {
			
			var prop = $(resultDIV).data(dataPropertyName);
			if (dataPropertyValue === prop) {
				foundResultDIV = $(resultDIV);
				return false; //cycle break;
			}
			return true; //next iteration
		});
		
		return foundResultDIV;
	};
	
	/*
	 * Adds the search results to the search result panel
	 */
	this.addSearchResultsToSearchResultPanelOLD = function(layerTitle, features) {

		// Add features to the layer
		this.vLayer.addFeatures(features);

		var resultElement = $("<div>").attr("class", "seacrh-results-layer")
				.append(
						$("<div>").attr("class", "seacrh-results-layer-name")
								.text(layerTitle));

		for (var j = 0; j < features.length; j++) {

			var feature = features[j];

			var result_i = buildFeatureInfoDiv(feature);

			// Add feature FID to the result block
			result_i.data("fid", feature.fid);
			
			var onClickCallback = this._callbacks["onclick"];
			result_i.click(function() {
				var fid = $(this).data("fid");
				//alert('clicked ' + fid);
				
				if (!Utils.isNullOrUndefined(onClickCallback)) {
					onClickCallback(fid);
				}
			});

			resultElement.append(result_i);
		}

		$("#searchResultPanel").append(resultElement);

	};
	
	
//	/*
//	 * Callbacks:
//	 * onclick: called when a feature is clicked
//	 */
//	
//	this._callbacks = callbacks;
//	this.isLayerVisible = true;
//	
//	/*
//	 * Stores the vector layer containing the results
//	 */
//	this.vLayer = new OpenLayers.Layer.Vector("search results", {
//		displayInLayerSwitcher : false,
//		//styleMap : testStyleMap,
//		styleMap: StyleManager.getRedlineStyle(),
//		projection : new OpenLayers.Projection(map.getProjection()),
//		print: false
//
//	});
//	
//	map.addLayer(this.vLayer);
//
//	
//
//	/*
//	 * Toggles on and off the result layer
//	 */
//	this.toggleLayer = function() {
//		var textButton = null;
//		if (this.isLayerVisible) {
//			textButton = LocaleManager.getKey("SearchResultPanel_Results_Layer_Show");
//		} else {
//			textButton = LocaleManager.getKey("SearchResultPanel_Results_Layer_Hide");
//		}
//		
//		$("#search_result_panel_show_vector_btn").text(textButton);
//		this.vLayer.setVisibility(!this.isLayerVisible);
//		this.isLayerVisible = !this.isLayerVisible;
//	};
//	
//	/*
//	 * Creates the show vector result button
//	 */
//	this.createShowResultsInMapButtons = function(clickFn) {
//		var buttonText = LocaleManager.getKey("SearchResultPanel_Results_Layer_Hide");
//		
//		var showVectorBtn = $("<button>", {
//			id : "search_result_panel_show_vector_btn"
//		}).text(buttonText).click(clickFn);
//		
//		$("#searchResultPanel").append(showVectorBtn);
//	};
//
//	/*
//	 * Zooms to a specific feature
//	 */
//	this.zoomToFeature = function(fid) {
//		var feature = this.vLayer.getFeatureByFid(fid);
//		map.zoomToExtent(feature.geometry.getBounds(), closest=true);
//		
//		//If layer is not display, display it
//		if (!this.isLayerVisible) {
//			this.toggleLayer();
//		}
//	};
};