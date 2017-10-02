var CswClient = function(config) {
	
	//Set configuration data
	this.cswVersion = (config.cswVersion) ? config.cswVersion : "2.0.2";
	this.filterVersion = (config.filterVersion) ? config.filterVersion : "1.1.0";
	this.sortProperty = (config.sortProperty) ? config.sortProperty: "Title";
	this.sortOrder = (config.sortOrder) ? config.sortOrder: "ASC";
	this.limit = (config.limi) ? config.limit: 5;
	this.initialBBox = {
		minx:-100,
		miny:0,
		maxx:100,
		maxy:80
	};
	this.titleProperty = "title";
	this.lastModifiedBeginProperty = "tempExtentBegin";
	this.lastModifiedEndProperty = "tempExtentEnd";
	
	this.buildCSWRequestData = function(options) {
		this.resultType = (options.resultType) ? options.resultType : this.resultType;
		this.filterVersion = (options.filterVersion) ? options.filterVersion : this.filterVersion;
		this.filter = (options.filter) ? options.filter : this.filter;
		this.currentCatalog = (options.url) ? options.url : this.currentCatalog;
		this.sortProperty = (options.sortProperty) ? options.sortProperty : this.sortProperty;
		this.sortOrder = (options.sortOrder) ? options.sortOrder : this.sortOrder;
			
		var optionsCsw = {
			//if XDProxy is defined use it
			url : ( options.XDProxy ? options.XDProxy.url + "?" + options.XDProxy.callback + "=" + options.url : options.url), 
			resultType : "results",
			startPosition : (options.start ? options.start : 1),  
			//maxRecords : (this.limit ? this.limit : 10),
			maxRecords: 1000,
			outputFormat : "application/xml",
			outputSchema : "http://www.opengis.net/cat/csw/" + this.cswVersion
		};

		// If a filter has been specified, and the search is not to be empty 
		if (this.filter != null && ! options.emptySearch) {
			optionsCsw.Query = {
				ElementSetName : {
					value : this.resultType
					//"typeNames": "gmd:MD_Metadata"
				},
				//"typeNames": "gmd:MD_Metadata",
				Constraint : {
					version : this.filterVersion,
					Filter : this.filter
				}
			};
		} else {
			optionsCsw.Query = {
				ElementSetName : {
					value : this.resultType  
				}
			};
		}

		// Sort results by a given property 
		optionsCsw.Query.SortBy = {
			SortProperty: {
				PropertyName: {value: this.sortProperty},
				SortOrder: {value: this.sortOrder}
			}	
		}; 

		var format = new OpenLayers.Format.CSWGetRecords();
		return format.write(optionsCsw);
	};
	
	this.search = function(params, okFn, failFn) {
		// Builds individual filters
		var filters = new Array();

		// Free-text condition
		if (!Utils.isNullOrUndefined(params.freeText)) {
			var filter = new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.LIKE,
				property : "apiso:AnyText",
				value : params.freeText
			});
			filters.push(filter);
		}
		
		// Advanced search
		
		/*
		 * DC property condition. Since these properties are tokenized by
		 * GeoNetwork, the EQUAL_TO looks for individual words, not for portions
		 * of them. The use of LIKE may be less intuitive for the users, since it
		 * would imply the insertion of wildcard characters
		 */
		if (!Utils.isNullOrUndefined(params.title)) {
			/*
			 * var filter= new OpenLayers.Filter.Comparison({ type:
			 * OpenLayers.Filter.Comparison.LIKE, property: this.panel.dcProperty,
			 * value: params.dcValue } );
			 */
			 
			var filter = new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.EQUAL_TO,
				property :this.titleProperty,
				matchCase : false,
				value : params.title
			});
			filters.push(filter);
		}

		// BBOX condition
		if (Utils.isTrue(params.useBbox)) {
			//var extent = this.initialBBox;
			var bounds = null;
			bounds = params.bounds;
			
			/*
			 * If the bounds were not specified in the query, we get the
			 * current visible extent from the map
			 */
			if (bounds == null) {
				if(map){
					var bounds = map.getExtent();
				}	
			} 
			
			if (bounds != null){
				bounds = bounds.transform(
					new OpenLayers.Projection(map.getProjection()),
					new OpenLayers.Projection("EPSG:4326")
				);
			}
			var filter = new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Spatial.BBOX,
				property : "ows:BoundingBox",
				value : bounds
			});
			
			filters.push(filter);
		}

		// Last modified interval begin condition
		if (!Utils.isNullOrUndefined(params.lastModifiedBegin)) {
			var filter = new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
				property : this.lastModifiedBeginProperty,
				// ISO-8601, needed for OGC filters
				value : params.lastModifiedBegin + "T00:00:00Z"
			});
			filters.push(filter);
		}

		// Last modified interval end condition
		if (!Utils.isNullOrUndefined(params.lastModifiedEnd)) {
			var filter = new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
				property : this.lastModifiedEndProperty,
				// ISO-8601, needed for OGC filters
				value : params.lastModifiedEnd + "T23:59:59Z"
			});
			filters.push(filter);
		}
		
		// Builds the query options
		var options = {
			//url : "http://geo-mosef.gesp.it/geonetwork/srv/eng/csw",
			url : GEONETWORK_URL + "/srv/eng/csw",
            filterVersion : this.filterVersion,
			resultType : "full"
		};

		// If no filter has been set, builds the query as to select every record,
		// otherwise the conditions are applied as filters
		if (filters.length != 0) {
			options.filter = new OpenLayers.Filter.Logical({
				type : OpenLayers.Filter.Logical.AND,
				filters : filters
			});
			options.emptySearch = false;
		} else {
			options.emptySearch = true;
		}
		
		//Build request data
//		options.limit = this.config.limit;
//		options.timeout = this.config.timeout;
		var requestData = this.buildCSWRequestData(options);
		
		//Perform call
		this.doSearchCSW(options.url, requestData, okFn, failFn);
	};
	
	this.doSearchCSW = function(url, requestData, okFn, failFn) {
		var postContentType = "text/xml;charset=utf-8";
		var format = new OpenLayers.Format.CSWGetRecords();
		
		//Performing Request
		OpenLayers.Request.POST({
			url : url,
			data: requestData,
			headers: {
		        "Content-Type": postContentType
		    },
			success : function(request) {
				var doc = request.responseXML;
				if (!doc || !doc.documentElement) {
					doc = request.responseText;
				}
				var records = format.read(doc);
				okFn(records);
			},
			failure : function() {
				// If the error callback function has been specified, let's
				// call it.
				if (!Utils.isNullOrUndefined(failFn)) {
					failFn();
				}
			}
		});
	};
	
};