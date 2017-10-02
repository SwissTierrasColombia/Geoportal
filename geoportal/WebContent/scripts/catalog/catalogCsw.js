var catalogCsw = null;
catalogCsw = {
	active: false,
	//This is used to display the bounding box when the user performs the search
	vLayer: null,
	bbox: null,
	vPanel: null,
	dialogDiv: null,
	vResultPanelBody: null,
	vSearchForm: null,
	defaultEPSG: "EPSG:4326",
	defaultThumbnail: "images/banner/logo_icf_scalata.png",
	
	/**
	 *  Add metadata property here to show it 
	 *  into results panel
	 *  - key: metadata property
	 *  - value: the name you want to visualize into panel for each property
	 *  
	 *  Define here the name with localization
	 */
	fields: {
	    //"description": LocaleManager.getKey("Metadata_Label_Description"),
	    //"date": LocaleManager.getKey("Metadata_Label_Date"),
	    "abstract": LocaleManager.getKey("Metadata_Label_Abstract")
	    //"source": LocaleManager.getKey("Metadata_Label_Source")
	},
	
	
	
	/** ****************************************
	 *  Enable/Disable CSW tool
	 *  Init vector layer and open print panel
	 *  *****************************************/
	toggle: function(button) {	
		if(!button.hasClass("btn-active")) {
			this.activate(button);
		}
		else {
			this.deactivate(button);
		}
	},
	
	activate: function(button) {
		button.addClass("btn-active");
		this.init();
		this.active = true;
		
		//Expand panel
		//CollapseExpandPanelUtils.expandPanel(this.vPanel, $("#catalog-header"), $("#csw-catalog-container"));
	},
	
	deactivate: function(button) {
		if(!button) {
			button = $('#gis_cswClientBtn');
		}
		button.removeClass("btn-active");
		this.closePanel();
		this.active = false;
	},
	
//	toggleShowHide: function() {
//		var isCollapsed = this.vPanel.hasClass("collapsed");
//		if (isCollapsed) {
//			//To show it
//			//this.expandPanel();
//			CollapseExpandPanelUtils.expandPanel(this.vPanel, $("#catalog-header"), $("#csw-catalog-container"));
//		}
//		else {
//			//To hide it
//			//this.collapsePanel();
//			CollapseExpandPanelUtils.collapsePanel(this.vPanel, $("#catalog-header"), $("#csw-catalog-container"));
//		}
//	},
	
	/**
	 *  Open panel catalog CSW
	 */
	openPanel: function() {
//		if(this.vPanel != null) {
//			this.vPanel.show();
//		}
		
		if(this.dialogDiv != null) {
			this.dialogDiv.dialog("open");
		}
		
	},
	
	closeCallbackFn: function() {
		this.cleanAll();
	},
	
	/**
	 *  Close metadata catalog panel
	 */
	closePanel: function() {
//		if(this.vPanel != null) {
//			this.cleanAll();
//			this.vPanel.hide();
//		}
		
		if(this.dialogDiv != null) {
			//This will eventually call the this.cleanAll()
			this.dialogDiv.dialog("close");
		}
		
		if (this.vLayer != null) {
			this.vLayer.removeAllFeatures();
		}
		
	},
	
	cleanAll: function(cleanSpatialFilter) {
		this.cleanSearchResults();
		this.cleanSearchParameters();
		
		if (cleanSpatialFilter === true) {
			$("#csw-search-bbox-deactive").prop("checked", true);
			catalogCsw.onSearchBBOXChange();
		}
		
	},
	
	/**
	 *  Clean results panel and values of search form
	 */
	cleanSearchResults: function() {
		//Clean search panel
		this.vResultPanelBody.empty();
		
		//Clean number of results
		LocaleManager.refreshLocalizedElement($("#catalog-results-header"));
	},
	
	/**
	 * Clean search panel
	 */
	cleanSearchParameters: function() {
		Utils.cleanForm(this.vSearchForm);
	},
	
	searchBboxToggled: function() {
		
		//Search adv active
		if($("#csw-search-bbox-active").is(":checked")) {
			$("#csw-catalog-bbox-panel").show();
		}
		else {
			// Deactivate control
			if(this.vLayer != null) {
				// Remove bbox from vector layer
				this.vLayer.removeAllFeatures();
				
				// Deactivate control
				controls.catalog.deactivate();
				
				// Clean text check bbox selected
				$("#csw-catalog-bbox-selected-text").text("");				
			}
			
			$("#csw-catalog-bbox-panel").hide();
			//$("#csw-catalog-bbox-toggle-button").addClass("custom-hidden");
		}
	},
	
	setBboxSelectedText: function() {
		$("#csw-catalog-bbox-selected-text").text(LocaleManager.getKey("Advanced_Panel_Search_SearchBboxSelectedText"));
		$("#csw-catalog-bbox-toggle-button").removeClass("custom-hidden");
	},
	
	toggleVisibilityBbox: function() {
		if(this.vLayer != null) {
			this.vLayer.setVisibility(!this.vLayer.getVisibility());
			
			//new visibility
			if(this.vLayer.getVisibility()) {
				//Now it is shown
				$("#csw-catalog-bbox-toggle-button i").removeClass("fa-eye-slash").addClass("fa-eye");
				$("#csw-catalog-bbox-toggle-button").data("locale_key", "Advanced_Panel_Search_SearchBboxHideButton");
			}
			else {
				//Now it is hidden
				$("#csw-catalog-bbox-toggle-button i").removeClass("fa-eye").addClass("fa-eye-slash");
				$("#csw-catalog-bbox-toggle-button").data("locale_key", "Advanced_Panel_Search_SearchBboxShowButton");
			}
			LocaleManager.refreshLocalizedElement($("#csw-catalog-bbox-toggle-button"));
		}
	},
	
	setSearchResultHeader: function(numResults) {
		var searchResultText = LocaleManager.getKey("Metadata_Panel_Csw_Search_Results");
		$("#catalog-results-header").text(searchResultText + " (" + numResults + ")");
	},
	
	/**
	 *  View csw request results into metadata catalog panel
	 *  - init "CswRecord" that represents record object with its properties
	 */
	viewCatalogData: function(results) {
		this.init();
		this.cleanSearchResults();
		
		this.setSearchResultHeader(results.SearchResults.numberOfRecordsMatched);
		
		$.each(results.records, function(index, record) {
			// Init CswRecord object that represents record result
			// - catalogCsw.fields is list of properties you want to show
			//   as metadata info
			var rec = new CswRecord(record, catalogCsw.fields);
			catalogCsw.vResultPanelBody.append(catalogCsw.getDomRecord(rec));
		});
		
		this.openPanel();
	},
	
	/**
	 *  Get dom element of each record found
	 */
	getDomRecord: function(record) {
		var rec = $("<div>").attr({"class": "catalog-rec"}).data({"record": record});
		var rHeader = $("<div>").attr({"class": "catalog-rec-header"}).append(
			this.getDomImageHeader(),
			this.getDomTitle(record)
			//this.getDomSource(record)
			//this.getDomButtons(record)
		);
		
		var rBody = $("<div>").attr({"class": "catalog-rec-body custom-hidden"});	
		var rBodyL = $("<div>").attr({"class": "catalog-rec-body-left"}).append(this.getDomThumbnail(record));
		var rBodyR = $("<div>").attr({"class": "catalog-rec-body-right"});
		var rBodyF = this.getDomButtons(record);
		
		// Get record details for each property of record
		// - record.getProperties() retrieves only properties set 
		//	 into CswRecord object (define in catalogCsw.fields)
		$.each(record.getProperties(), function(property, values){
			var domDetails = catalogCsw.getDomRecordDetails(record, property);
			rBodyR.append(domDetails);
		});
		
		rBody.append(rBodyL, rBodyR, rBodyF);
		rec.append(rHeader, rBody);
		
		return rec;
	},
	
	/**
	 *  Returns dom element details for each record property
	 *  - record: record object
	 *  - property: one of properties you want to show (valid properties)
	 */
	getDomRecordDetails: function(record, property) {
		
		var cDetails = $("<div>").attr({"class": "details-container"});
		var dTitle = $("<div>").attr({"class": "details-title"}).text(record.getPropertyName(property));
		
		cDetails.append(dTitle);

		var atLeastOneValueFound = false;
		
		$.each(record.getValuesProperty(property), function(index, value){
			
			if (!Utils.isNullOrUndefined(value)) {
				atLeastOneValueFound = true;
			}
			
			var cDetail = $("<div>").attr({"class": "detail-container"}).text(value);
			cDetails.append(cDetail);
		});
		
		if (!atLeastOneValueFound) {
			return null;
		}
		
		return cDetails;
	},
	
	getDomImageHeader: function() {
		var imageHeader = $("<div>").attr({"class": "header-image item"}).append(
			$("<i>").attr({"class": "fa fa-caret-right fa-2x"})
		).click(function() {
			// Identify record body
			// If visible hides it
			// If not visible shows it
			var body = $(this).closest(".catalog-rec").find(".catalog-rec-body");
			if(body.is(":visible")) {
				body.hide();
				$(this).find("i").removeClass("fa-caret-down").addClass("fa-caret-right");
			}	
			else {
				body.show();
				$(this).find("i").removeClass("fa-caret-right").addClass("fa-caret-down");
			}
		});
		return imageHeader;
	},
	
	/**
	 *  Return dom element for title of metadata record
	 */
	getDomTitle: function(record) {
		
		//If null, titleText is set to empty
		var titleText = record.getTitle();
		if (Utils.isNullOrUndefined(titleText)) {
			titleText = "";
		}
		
		var domTitle = $("<div>").attr({"class": "catalog-rec-title item"}).text(titleText);
		return domTitle;
	},
	
	/**
	 *  Return dom Element source
	 */
	getDomSource: function(record) {
		
		//If null, sourceText is set to empty
		var sourceText = record.getSource();
		if (Utils.isNullOrUndefined(sourceText)) {
			sourceText = "";
		}
		
		var domSource = $("<div>").attr({"class": "catalog-rec-source item"}).text(sourceText);
		return domSource;
	},
	
	/**
	 *  Return dom element for action buttons of each record
	 */
	getDomButtons: function(record) {
		var domButtons = $("<div>").attr({"class": "catalog-rec-buttons"});
		var addButton, detailsButton, centerButton;
		
		// BUTTON ADD: Add WMS layer of metadata to map
		var recUrl = record.getUrl();
		if(recUrl != null && recUrl != "") {
			addButton = $("<div>")
				.html(LocaleManager.getKey("Metadata_Label_Button_AddToMap"))
				.append($("<i>").attr({"class": "fa fa-external-link fa-2x"}))
				.click(function(){
					var record = $(this).parents(".catalog-rec").data("record");
					var url = recUrl;
					var name = record.getName();
					var title = record.getTitle();
					var layerLI = LayerMenu.getLayerLIFromMenu(record.getUrl(), record.getName());
					if(!Utils.isNullOrUndefined(layerLI)){
						LayerMenu.selectAndOpenLayerInMenu(layerLI);
					}
					else {
						addSingleWMSLayerFromGeoNetwork(name, title, url);
					}				
				});
		}
			
		// BUTTON DETAILS: go to detail page of metadata
		var recId = record.getId();
		if(recId != null && recId != "") {
			detailsButton = $("<div>")
				.html(LocaleManager.getKey("Metadata_Label_Button_Details"))
				.append($("<i>").attr({"class": "fa fa-info fa-2x"}))
				.click(function(){
					//var urlToOpen = "";
					//Open in a new window
					//window.open(catalogCsw.getMetadataUrlDetails() + recId);
					
					//Open in the iframe and switch the tab to the iframe
					loadGeonetworkUrlInIframe(MetadataUtils.getMetadataUrlDetails(GEONETWORK_URL) + recId, true);
				});
		}
		
		// BUTTON CENTER BBOX: go to extent of metadato
		var recBbox = record.getBbox();
		if(recBbox != null) {
			// BUTTON CENTER MAP: Zoom map at bbox of metadata
			centerButton = $("<div>")
				.html(LocaleManager.getKey("Metadata_Label_Button_CenterMap"))
				.append($("<i>").attr({"class": "fa fa-search-plus fa-2x"}))
				.click(function(){
					var bound = null;
					
					if(
						recBbox.hasOwnProperty("left") &&
						recBbox.hasOwnProperty("bottom") &&
						recBbox.hasOwnProperty("right") &&
						recBbox.hasOwnProperty("top")
					) {
						bound = catalogCsw.getProperBboxFromCSWResponse(recBbox);					
					}
					
					if (bound != null) {
						bound.transform(
							new OpenLayers.Projection(catalogCsw.defaultEPSG), 
							new OpenLayers.Projection(map.getProjection())
						);
						map.zoomToExtent(bound, true);
					}
				});
		}
		
		// Add each button to button panel (footer of metadata record)
		domButtons.append(addButton, detailsButton, centerButton);
		
		return domButtons;
	},
	
	/**
	 *  Return dom element for thumbnail
	 */
	getDomThumbnail: function(record) {
		var thumb = "";
		if(record.getThumbnail() != null) {
			thumb = record.getThumbnail();
		}
		else {
			thumb = this.defaultThumbnail;
		}
		var domThumbnail = $("<div>").attr({"class": "catalog-thumbnail"}).append(
			$("<img>").attr({"src": thumb})
		);
		
		return domThumbnail;
	},
	
	/**
	 *  Retrieve form data for csw search request
	 */
	getDataForm: function() {
		var params = new Object();
		var isExact = false;
		if($("#catalog-input-keyword").val() == ""){
			params.freeText = null;
		}
		else {
			var toSearch = $("#catalog-input-keyword").val();
			
			//var isExact = $("#catalog-search-exact").is(':checked');
			
			toSearch = toSearch.trim();
			
			if (!isExact) {
				toSearch = '*' + toSearch + '*';
			}
			
			params.freeText = toSearch; 
		}
		
//		// Date from
//		if($("#catalog-input-datefrom").val() == "") {
//			params.lastModifiedBegin == null;
//		}
//		else {
//			params.lastModifiedBegin = $("#catalog-input-datefrom").val();
//		}	
//		
//		// Date to
//		if($("#catalog-input-dateto").val() == "") {
//			params.lastModifiedEnd = null;
//		}
//		else {
//			params.lastModifiedEnd = $("#catalog-input-dateto").val();
//		}
//		
//		if($("#catalog-input-title").val() == "") {
//			params.title = null;
//		}
//		else {
//			var title = $("#catalog-input-title").val();
//			
//			if (!isExact) {
//				title = '*' + title + '*';
//			}
//			params.title = title;
//		}
		
		params.useBbox = $("#csw-search-bbox-active").is(":checked");
		
		if (params.useBbox === true) {
			var bounds = null;
			if(this.vLayer != null && this.vLayer.features.length > 0) {
				bounds = this.vLayer.features[0].geometry.getBounds();
			}
			params.bounds = bounds;
		}
		
		return params;
	},
	
	/**
	 *  Get proper bbox from CSW response
	 *  Maybe left coordinates (min x) of extent returned from CSW request
	 *  is greater than right coordinate (max x)
	 *  If so it create openlayers bound inverting the two coordinates
	 */
	getProperBboxFromCSWResponse: function(bound) {
		var bbox = null;
		if(bound.left < bound.right) {
			bbox = new OpenLayers.Bounds(
				bound.left,
				bound.bottom,
				bound.right,
				bound.top
			);				
		}
		else if(bound.left > bound.right){
			bbox = new OpenLayers.Bounds(
				bound.right,
				bound.bottom,
				bound.left,
				bound.top
			);			
		}
		
		return bbox;
	},
	
	/**
	 *  Search request to csw service
	 */
	requests: {
		getData: function() {
			var params = catalogCsw.getDataForm();
			
			// Clean panel from previus results
			catalogCsw.cleanSearchResults();
			
			// Add loading image
			loadingImage(catalogCsw.vResultPanelBody, true);
			
			var client = new CswClient({});
			client.search(params, 
				// Success function CSW request
				function(records){
					catalogCsw.viewCatalogData(records);
				}, 
				// Fail function CSW request
				function() {
					AlertDialog.createOkDefaultDialog(
						LocaleManager.getKey("AlertDialog_Error_Title"), 
						LocaleManager.getKey("Metadata_Csw_Error_Requests") 
					);
				}
			);
		}
	},
	
	/** *****************
	  * Init vector layer
	  * *****************/ 
	initLayer: function() {
		if (this.vLayer == null) {
			this.vLayer = new OpenLayers.Layer.Vector("bboxCSWsearch",{
				displayInLayerSwitcher : false,
				styleMap: StyleManager.getRedlineStyle(),
				projection : new OpenLayers.Projection(map.getProjection()),
				eventListeners : {
					'beforefeatureadded' : function(feature) {
						catalogCsw.vLayer.removeAllFeatures();
						srid = feature.feature.layer.projection.projCode;
						feature.feature.geometry.transform(new OpenLayers.Projection(srid),new OpenLayers.Projection(map.getProjection()));
					}
				}
			});
			
			/*
			 * This layer must always stay on top
			 * (see map.events.register("addlayer", map, function(obj))
			 */
			this.vLayer.alwaysOnTop = true;
			
			map.addLayer(this.vLayer);
		}
	},
	
	onSearchBBOXChange: function() {
		catalogCsw.searchBboxToggled();
	},
	
	/**
	 *  Init metadata panel
	 */
	init: function() {
		if(this.vPanel == null) {
			this.vPanel = $("#catalog");
			this.vResultPanelBody = $("#catalog-body");
			this.vSearchForm = $("#catalog-form");
			this.button = $("#gis_cswClientBtn");
			
			var dialogOptions = {
				closeFn: function() {
					catalogCsw.closeCallBackFn;
				},
				height: 315,
				width: '70%',
				resizable: false,
				modal: false,
				extensions: true,
				collapsable: true
			};
			
			this.dialogDiv = DialogUtils.renderDialog(LocaleManager.getKey("Metadata_Panel_Csw_Search"), {}, dialogOptions, this.vPanel);
			
			$("#csw-catalog-clean").button({
				label: LocaleManager.getKey("General_Clean")
			}).click(function() {
				catalogCsw.cleanAll(true);
			});
			
			$("#csw-catalog-confirm").button({
				label: LocaleManager.getKey("General_Search")
			}).click(function() {
				catalogCsw.requests.getData();
			});
			
			
//			// Init event on checkbox advanced
			$("#csw-search-bbox-deactive, #csw-search-bbox-active").change(function(){
				catalogCsw.onSearchBBOXChange();
			});
			
//			$("#catalog-input-advanced").change(function(){
//				if($(this).is(":checked")) {
//					$("#catalog-form-advanced").show();
//				}
//				else {
//					$("#catalog-form-advanced").hide();
//				}
//			});
			
//			// Init datepicker
//			$("#catalog-input-datefrom").datepicker({
//				changeMonth: true,
//				onClose: function( selectedDate ) {
//					$( "#catalog-input-dateto" ).datepicker( "option", "minDate", selectedDate );
//				}
//			});
//			$("#catalog-input-dateto").datepicker({
//				changeMonth: true,
//				onClose: function( selectedDate ) {
//					$( "#catalog-input-datefrom" ).datepicker( "option", "maxDate", selectedDate );
//				}
//			});
		}
		
		this.openPanel();
	}
};