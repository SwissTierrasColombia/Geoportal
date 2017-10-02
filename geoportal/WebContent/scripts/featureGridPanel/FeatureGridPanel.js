var featureGridPanel = null; 
var FeatureGridPanel = function(parent) {

	var self = this;
	
	this.parent = $("#feature-grid-panel");
	
	var dialogOptions = {
		closeFn: function() {
			self.closeCallBackFn();
		},
		height: 350,
		width: 1000,
		resizable: false,
		modal: false,
		extensions: true,
		collapsable: true
	};
	
	this.dialogDiv = DialogUtils.renderDialog(LocaleManager.getKey("FeatureGridPanel_Search_Header"), {}, dialogOptions, this.parent);
	
	
//	this.header = $("#feature-grid-panel-header");
	//this.panelHeaderText = $("#feature-grid-panel-header-text");
	this.gridContainer = $("#feature-grid-panel-grid-container");
	this.panelToolbar = $("#feature-grid-panel-toolbar");
	this.zoomToBtn = $("#feature-grid-panel-toolbar-zoomto").button();
	
	this.table = null;
	this.dataTable = null;
	this.layerId = null;
	this.featureList = null;
	this.vLayer = null;
	
	this.closeCallBackFn = function() {
		this.destroyAll();
	};
	
	this.closePanel = function() {
		
		//This will eventually call this.destroyAll...
		//this.destroyAll();
		//this.parent.hide();
		this.dialogDiv.dialog("close");
		
	};
	
	
	this.destroyAll = function() {
		/*
		 * Remove existing datatable
		 */
		if (!Utils.isNullOrUndefined(this.dataTable)) {
			//This destroys the html table as well.
				this.dataTable.api().destroy(true);
		}
		
		// Empty header text...
		//this.panelHeaderText.text("");
		this.dialogDiv.dialog('option', 'title', '');
		
		//Empty grid container
		this.gridContainer.empty();
		
		//Clean featureList
		this.featureList = null;
		
		this.layerId = null;
		
		if (this.vLayer != null) {
			this.vLayer.removeAllFeatures();
			//map.remove(this.vLayer); ???
		}
		
		//Hide the max feature reached message
		this.hideMaxFeatureReachedAlert();
		
		this.toggleToolbarButtonsVisibility(false);
	};
	
	this.toggleToolbarButtons = function (enable) {
		if (enable === true) {
			this.zoomToBtn.button("enable");
		} else {
			this.zoomToBtn.button("disable");	
		}
	};
	
	this.toggleToolbarButtonsVisibility = function (visibility) {
		if (visibility === true) {
			this.zoomToBtn.show();
		}
		else {
			this.zoomToBtn.hide();
		}
	};
	
	
	this.endLoading = function() {
		//Empty grid container
		this.gridContainer.empty();
	};
	
	this.showMaxFeatureReachedAlert = function() {
		$("#feature-grid-panel-max-number-of-feature-reached").text(LocaleManager.getKey("FeatureGridPanel_Search_MaxNoResultReached"));
	};
	
	this.hideMaxFeatureReachedAlert = function() {
		$("#feature-grid-panel-max-number-of-feature-reached").empty();
	};
	
//	this.toggleShowHide = function() {
//		var isCollapsed = this.parent.hasClass("collapsed");
//		if (isCollapsed) {
//			//To show it
//			//this.expandPanel();
//			CollapseExpandPanelUtils.expandPanel(this.parent, this.header, $("#feature-grid-panel-container"), "340px");
//		}
//		else {
//			//To hide it
//			//this.collapsePanel();
//			CollapseExpandPanelUtils.collapsePanel(this.parent, this.header, $("#feature-grid-panel-container"));
//		}
//	};
	
	this.show = function() {
		this.dialogDiv.dialog("open");
	};
	
	/**
	 * This is called when clicking on the Search Result Panel.
	 * It does the GetFeature and, once the response is received, populates the grid
	 * and raises the callbackFn.
	 */
	this.startLoading = function(layerId, layerTitle, searchParameters, hitsNumber, endFnCallback) {
		//Show panel
		//this.parent.show();
		this.show();
		
		//In case, expand it.
		//CollapseExpandPanelUtils.expandPanel(this.parent, this.header, $("#feature-grid-panel-container"), "340px");
		
		this.destroyAll();
		
		/*
		 * if vector does not exist, add it
		 */
		if (this.vLayer == null) {
			var vector = new OpenLayers.Layer.Vector("search_result_vector", {
				displayInLayerSwitcher : false,
				//styleMap : testStyleMap,
				styleMap: StyleManager.getRedlineStyle(),
				projection : new OpenLayers.Projection(map.getProjection()),
				print: false
			});
			map.addLayer(vector);
			this.vLayer = vector;
			this.vLayer.alwaysOnTop = true;
		}
		
		//this.panelHeaderText.text(LocaleManager.getKey("FeatureGridPanel_Search_Header") + ": " + layerTitle);
		this.dialogDiv.dialog('option', 'title', LocaleManager.getKey("FeatureGridPanel_Search_Header") + ": " + layerTitle);
		
		var loadingIcon = $("<div>").attr("class", "featureGridPanelLoadingContainer").append($("<img>").attr("src", "images/loading2.gif"));
		this.gridContainer.append(loadingIcon);
		
		/*
		 * Content of searchParameters
			url
			layerName
			onlyHits
			layerAttributeList
			searchTerm
			searchOptions
		*/
		
		/*
		 * Perform the actual search.
		 * 
		 * The search is limited to the GLOBAL_SETTINGS.searchMaxResultForLayer params.
		 * If it is > 0 then use this limit.
		 * Else, leave it unbounded.
		 * 
		 */
		if (GLOBAL_SETTINGS.searchMaxResultForLayer > 0) {
			searchParameters.searchOptions.maxFeatures = GLOBAL_SETTINGS.searchMaxResultForLayer;
		}
		
		
		var searcher = new Search();
		var thisObject = this;
		
		/*
		 * Pass a null search token
		 * 
		 */
		searcher.searchLayer(null, searchParameters.url, searchParameters.layerName, false, searchParameters.layerAttributeList, searchParameters.searchTerm, searchParameters.searchOptions,
			function(features) {
				/*
				 * If the SearchMaxResult for layer is set,
				 * and the actual HITS exceed this simit,
				 * show the Alert. 
				 */
				if (GLOBAL_SETTINGS.searchMaxResultForLayer > 0 && 
						hitsNumber > GLOBAL_SETTINGS.searchMaxResultForLayer) {
					/*
					 * Show the message informing the user that the results are truncated.
					 */
					self.showMaxFeatureReachedAlert();
				}
		
				thisObject.endLoading();
				thisObject.toggleToolbarButtonsVisibility(true);
				thisObject.toggleToolbarButtons(false);
				
				thisObject.featureList = features;
				
				featureGridPanel.createFeatureGrid(layerId, features, function() {
					endFnCallback(true);
				});
				
			}, function() {
				//alert('error....');
				thisObject.endLoading();
				//searchResultPanel.removeResultFromSearchResultPanel(id_i);
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					LocaleManager.getKey("AlertDialog_Error_Msg_GeneralSearch")
				);
				
				//CallbackFn - success false
				if (!Utils.isNullOrUndefined(endFnCallback)) {
					endFnCallback(false);
					return;
				}
			}
		);
	};
	
	this.createFeatureGrid = function(layerId, features, gridDrawnCallback) {
		
		this.layerId = layerId;
		
		table = $("<table>").addClass("data-grid").css("width", "100%");
		this.table = table;
		
		this.gridContainer.append(table);
		
		var cols = null;
		var dataForTheGrid = null;
		
//		var layerConfig = catalog.getLayerConfigById(layerId);
//		if (layerConfig.isAttributesAvailable() === true) {
//			var attributeConfList = layerConfig.getAttributes();
//			
//			var attributes = [];
//			$.each(attributeConfList, function( index, value ) {
//				  attributes.push(value.name);
//			});
//			
//			cols = FeatureGridPanel.parseColumnsFromAttributeList(attributes);
//			dataForTheGrid = FeatureGridPanel.parseFeaturesForGridFromAttributeList(features, attributes);
//		} else {
			var res = FeatureGridPanel.parseDataForGrid(features);
			
			cols = res.columns;
			dataForTheGrid = res.gridResult;
//		}
		
		
		var dataTable = table.dataTable({
			"serverSide": false,
	        "scrollY": "200px",
	        "scrollX": true,
	        //"scrollXInner": "400%",
	        "processing": true,
	        //"scrollCollapse": true,
	        "paginationType": "full",
        	"ajax": function (data, callback, settings) {	        		
        		callback(dataForTheGrid);
        	},
        	"drawCallback": function() {
        		//Called when the datatable has been drawn.
				if (!Utils.isNullOrUndefined(gridDrawnCallback)) {
					gridDrawnCallback();
				}
        	},
        	"columns" : cols,
	        "language": {
                "url": "scripts/locale/datatable/dt_" + LocaleManager.locale + ".lang"
            }
	    });
		
		this.dataTable = dataTable;
		
		var thisObject = this;
		
		// Click event on table row
		this.table.find("tbody").on('click', 'tr', function(e){ 
			
			thisObject.vLayer.removeAllFeatures();
			
			if($(this).hasClass('selected')) {
				
				//Disable buttons
				thisObject.toggleToolbarButtons(false);
				$(this).removeClass('selected');
				
			}
			else {
				if (!e.ctrlKey) {
					//alert('rimuovere selected');
					thisObject.table.find("tbody tr").removeClass("selected");
				}
				$(this).addClass('selected');
				//Enable buttons
				thisObject.toggleToolbarButtons(true);
				
				var fid = Utils.getSelectedRow(thisObject.dataTable)[0][FeatureGridPanel.FID_CONST];
				var selectedFeature = thisObject.getFeatureByFid(fid);
				var features = [];
				features.push(selectedFeature);
				thisObject.vLayer.addFeatures(features);
			}	
		});
		
		//Dbl Click event on table row
		this.table.find("tbody").on('dblclick', 'tr', function(e){ 
			
			//Remove features from vLayer
			thisObject.vLayer.removeAllFeatures();
			
			//Remove selected row(s)
			thisObject.table.find("tbody tr").removeClass("selected");
			
			//Select current row
			$(this).addClass('selected');
			//Enable buttons
			thisObject.toggleToolbarButtons(true);
			
			//Get selected feature and add to vLayer
			var fid = Utils.getSelectedRow(thisObject.dataTable)[0][FeatureGridPanel.FID_CONST];
			var selectedFeature = thisObject.getFeatureByFid(fid);
			var features = [];
			features.push(selectedFeature);
			thisObject.vLayer.addFeatures(features);
			
			//zoom to feat (like invoking the zoom to button).
			thisObject.zoomToBtn.click();
		});
	};
	
	this.getFeatureByFid = function(fid) {
		var foundFeatures = this.featureList.filter(function (fc) {
			return fc.fid === fid;
		});
		return foundFeatures[0];
	};
	
	this.zoomToFeat = function(fid) {
		var feature = this.vLayer.getFeatureByFid(fid);
		map.zoomToExtent(feature.geometry.getBounds(), closest=true);
		//Zoom out by 1 level
		map.zoomOut();
	};
	
	this.zoomToSelected = function() {
		var selectedRows = Utils.getSelectedRow(this.dataTable);
		if (selectedRows.length == 0) return;
		
		var selected = selectedRows[0];
		var fid = selected[FeatureGridPanel.FID_CONST];
		this.zoomToFeat(fid);
		
	};
	
};


FeatureGridPanel.parseDataForGrid = function(features) {
	
	/*
	 * Determine the attribute list..,
	 */
	var attributeList = {};
	
	$.each(features, function(idx, feat){
		$.each(feat.attributes, function(key, value){
			attributeList[key] = key;
		});	
	});
	
	/*
	 * Build cols
	 */
	var columns = [];
	$.each(attributeList, function(key, value){
		var data_column = {
				data: key,
				name: key,
				title: key,
				sortable: true,
				visible: true
		};
		columns.push(data_column);
	});
	
	//Add "FID"
	columns.push({
		data: FeatureGridPanel.FID_CONST,
		name: FeatureGridPanel.FID_CONST,
		title: FeatureGridPanel.FID_CONST,
		sortable: false,
		visible: false
	});
	
	/*
	 * Build data...
	 */
	var gridResult = new Object();
	gridResult.data = [];
	
	$.each(features, function(idx, feat){
		var rowResult = {};
		$.each(attributeList, function(key, value){
			var valueOfFeat = feat.attributes[key];
			
			/*
			 *  This is necessary, as the null
			 *  breaks the datagrid
			 */ 
			if (Utils.isNullOrUndefined(valueOfFeat)) {
				valueOfFeat = "";
			}
			
			rowResult[key] = valueOfFeat;
		});	
		
		//Add FID
		rowResult[FeatureGridPanel.FID_CONST] = feat.fid;
		
		gridResult.data.push(rowResult);
	});
	
	
	var result = {
			gridResult: gridResult,
			columns: columns
	};
	
	return result;
	
};

FeatureGridPanel.FID_CONST = "##FID##";

//FeatureGridPanel.parseFeaturesForGridFromAttributeList = function(features, attributeList) {
//	
//	var data = [];
//	
//	$.each(features, function(idx, feat){
//		var rowResult = {};
//		$.each(attributeList, function(idx, value){
//			var valueOfFeat = feat.attributes[value];
//			rowResult[value] = valueOfFeat;
//		});	
//		
//		data.push(rowResult);
//	});
//	
//	var res = new Object();
//	res.data = data;
//	return res;
//};


//FeatureGridPanel.parseColumnsFromAttributeList = function(attributeList) {
//	var columns = [];
//	$.each(attributeList, function(idx, value){
//		var data_column = {
//				data: value,
//				name: value,
//				title: value,
//				sortable: true,
//				visible: true
//		};
//		columns.push(data_column);
//	});
//	
//	return columns;
//};
	
	
	