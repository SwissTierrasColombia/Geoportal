var Search = function(configOptions) {
	
	/*
	 * Case sensitive and case insensitive searches:
	 * http://osgeo-org.1560.x6.nabble.com/WMS-and-WFS-requests-case-insensitive-td3808058.html
	 * http://jira.codehaus.org/browse/GEOS-2251
	 * http://dev.openlayers.org/docs/files/OpenLayers/Filter/Comparison-js.html
	 */
	//this._configOptions = configOptions;
	
	/**
	 * Search All Visible Layers based on
	 * a KEYWORD.
	 * 
	 * SEARCH OPTIONS
	 * 	 searchType (like || exact)
	 *   maxFeatures 
	 *   matchCase
	 *   bboxFilter
	 *   crs (to be used with bbox!)
	 */
	this.searchLayers = function(keyword, searchOptions) {
		searchResultPanel.clearSearchResultPanel();
		
//		searchResultPanel.createShowResultsInMapButtons(function(){
//			searchResultPanel.toggleLayer();
//		});
		
		/*
		 * Search Type is LIKE or EXACT
		 */
/*		if (searchOptions.searchType === "like") {
			keyword = "*" + keyword + "*";	
		}*/
		
		// Is exact match or not
//		if(!searchOptions.isExact)
//			keyword = "*" + keyword + "*";
		
		var maxFeatures = searchOptions.maxFeatures;
		var matchCase = searchOptions.matchCase;
		var bboxFilter = searchOptions.bboxFilter;
		var crs = searchOptions.crs;
		var likeSearch = null;
		
		if(searchOptions.isExact) {
			likeSearch = false;
		}
		else {
			likeSearch = true;
		}
		
		var ids = new Array();

		var layersToSearch = [];
		
		
		var visibleLayers = selectedLayerTree.getVisibleLayers();
		layersToSearch.push.apply(layersToSearch, visibleLayers);
		
		if (searchOptions.searchAllLayers === true) {
			var catalogLayers = tree.getAllLayers();
			layersToSearch.push.apply(layersToSearch, catalogLayers);
		}
		
		/*
		 * If no layers are selected, show an alert and return
		 */
		if (Utils.isNullOrUndefined(layersToSearch) || layersToSearch.length === 0) {
			AlertDialog.createOkDefaultDialog(LocaleManager.getKey("AlertDialog_Warning_Title"), 
					LocaleManager.getKey("AlertDialog_Warning_SearchNoLayersSelected"));
			return;
		}
		
		$.each(layersToSearch, function(key, layer_i) {
			var id_i = $(layer_i).data("id");
			if (ids.indexOf(id_i) == -1 ) {
				ids.push(id_i);
			}
			
		});

		/*
		 * Cycle on the visible layers.
		 * For each of them, let's do a Search.
		 */
		var searchLayer = this.searchLayer;
		var searchToken = Search.getNewSearchToken();
		
		$.each(ids, function(idx, id_i) {
			//var id_i = $(visibleLayer_i).data("id");
			var layerConfig_i = catalog.getLayerConfigById(id_i);
			
			//var layerTitle = $(visibleLayer_i).data("title");
			var layerTitle = layerConfig_i.getTitle();
			var layerName = null;
			var attributes = null;
			if (layerConfig_i.getSource() === "wms" ) 
			{
				layerName = layerConfig_i.getName();
				attributes = layerConfig_i.getAttributes();
				
			} else if (layerConfig_i.getSource() === "wms_multi_layer") 
			{
				layerName = layerConfig_i.getNameByTitle(layerTitle);
				attributes = layerConfig_i.getAttributes(layerName);
				
			} else 
			{
				//Otherwise skipping
				return true;
			}
			
			var url = layerConfig_i.getUrl();
			
			var options = {
					maxFeatures: maxFeatures,
					matchCase: matchCase,	
					bboxFilter: bboxFilter,
					crs: crs,
					likeSearch: likeSearch
			};

			var searchParameters = {
					url: url,
					layerName: layerName,
					onlyHits: true,
					layerAttributeList: attributes,
					searchTerm: keyword,
					searchOptions : options
			};
			
			/*
			 * Test if the current layer can be searched (WFS search disabled in the admin config)
			 * It it cannot, add an error to the searchResultPanel
			 */
			if (!layerConfig_i.isWfsSearchEnabled()) {
				searchResultPanel.addSearchNotPossibleToSearchResultPanel(id_i, layerTitle);
				return;
			}
			
			/*
			 * Test if the current layer has the attributes for search
			 * If it doesn't, add an error to the searchResultPanel
			 */
			if (!layerConfig_i.isAttributesAvailable()) {
				searchResultPanel.addSearchNotPossibleToSearchResultPanel(id_i, layerTitle);
				return;
			}
			
			//Add on-going search. Save the searchParameters as well.
			searchResultPanel.addSearchToSearchResultPanel(id_i, layerTitle, searchParameters);
			
			//Only hits
			searchLayer(searchToken, url, layerName, true, attributes, keyword, options,
				function(hits, token) {
					
					/*
					 * Check if the token corresponds to the last search.
					 * Otherwise skip.
					 */
					if (Search.getCurrentSearchToken() === token) {
						//alert("Found " + layerTitle + " " + hits + " token " + token);
						searchResultPanel.addResultToSearchResultPanel(id_i, hits);
						//alert('ok (' + features.length + ') ' + url + ' ' + layerName);
					}
				}, function(token) {
					/*
					 * Check if the token corresponds to the last search.
					 * Otherwise skip.
					 */
					if (Search.getCurrentSearchToken() === token) {
						searchResultPanel.removeResultFromSearchResultPanel(id_i);
						AlertDialog.createOkDefaultDialog(
							LocaleManager.getKey("AlertDialog_Error_Title"), 
							LocaleManager.getKey("AlertDialog_Error_Msg_GeneralSearch")
						);	
					}
				}
			);
			
		});
		
		//Show result panel.
		searchP.menuSearchShowAndSwitch();
		
	};
	
	/**
	 * Search for a SEARCHTERM in a given layerName.
	 * 
	 * @param url WFS server url
	 * @param layerName
	 * @param layerAttributeList
	 * @param searchTerm
	 * @param searchOptions (maxFeatures, bboxFilter, searchType (like || exact), matchCase)
	 * @param okFn
	 * @param failFn
	 */
	this.searchLayer = function(searchToken, url, layerName, onlyHits, layerAttributeList, searchTerm, searchOptions, okFn,
			failFn) {

		//searchOptions
		var maxFeatures = searchOptions.maxFeatures;
		var matchCase = searchOptions.matchCase;
		var bboxFilter = searchOptions.bboxFilter;
		var crs = searchOptions.crs;
		var likeSearch = searchOptions.likeSearch;
		
		//Create instance of a searchFilterHelper.
		var searchFilterHelper = new SearchFilterHelper(layerAttributeList);

		//Create a filter on the given layer
		var layerPropertyFilterOL = searchFilterHelper.createFilterOL(searchTerm, matchCase, likeSearch, bboxFilter, crs);

		var resultType = "results"; //By default retrieve all the features
		if (onlyHits === true) {
			//Only retrieve the HITS and not the actual results...
			resultType = "hits";
		}
		//Execute call for a getFeature
		doGetFeaturesPOST(url, {
			typeNames : layerName,
			filterOL : layerPropertyFilterOL,
			maxFeatures: maxFeatures,
			resultType: resultType
//			bboxFilter : bboxFilter,
//			crs : crs
		}, function(res) {
			okFn(res, searchToken);
		}, function(){
			failFn(searchToken);
		});
	};	
};

/*
 * Search Token to avoid errors in retrieving the responses
 * It is based on the current timestamp in milliseconds
 */
Search._search_token = 0;
Search.getNewSearchToken = function() {
	Search._search_token = new Date().getTime();
	return Search._search_token;
};
Search.getCurrentSearchToken = function() {
	return Search._search_token;
};