var SearchFilterHelper = function(layerAttributesList) {
	this._layerAttributesList = layerAttributesList;

	this.ALLOWED_FILTER_TYPES = ["int", "string", "decimal"];
	
	this._isTypeFilterable = function(attributeType) {
		var a = Utils.isInArrayAsBool(attributeType, this.ALLOWED_FILTER_TYPES); 
		if (a)
			return true;
		return false;
	};

	this._getFilterableAttributeList = function() {
		var filteredAttributeList = new Array();

		for(var j=0; j<this._layerAttributesList.length; j++) {
			var attrib = this._layerAttributesList[j];
			
			if (this._isTypeFilterable(attrib.type)) {
				filteredAttributeList.push(attrib);
			}
		}
		return filteredAttributeList;
	};
	
	this._isCompareConditionCompatibleWithType = function(searchTerm, attributeType) {
		// Check int
		if (attributeType === "int" && !Utils.isInt(searchTerm) ) return false;
		
		// Check decimal
		if (attributeType === "decimal" && !Utils.isFloat(searchTerm) ) return false;
		
		return true;
	};
	
	
	
	this.createFilterOL = function(searchTerm, matchCase, likeSearch, bboxFilterBounds, bboxCrs) {
		var filter = null;
		var filteredAttributeList = this._getFilterableAttributeList();
		
		var numberConditionAdded = 0;
		for (var j = 0; j < filteredAttributeList.length; j++) {
			var attribute_j = filteredAttributeList[j];
			
			var isCompatibleWithType = this._isCompareConditionCompatibleWithType(searchTerm, attribute_j.type);
			if (!isCompatibleWithType) continue;
			
			if (numberConditionAdded == 0) {
				filter = this.createCompareCondition(searchTerm, attribute_j.name,
						attribute_j.type, matchCase, likeSearch);
			} else {
				filter = this.addOrCondition(searchTerm, attribute_j.name,
						attribute_j.type, filter, matchCase, likeSearch);
			}
			
			numberConditionAdded++;
		}
		
		
		/*
		 * Add the BBOX condition if specified
		 */
		if (!Utils.isNullOrUndefined(bboxFilterBounds)) {
			var andFilter = null;
			var bboxFilter = new OpenLayers.Filter.Spatial({ 
		          type: OpenLayers.Filter.Spatial.BBOX, 
		          //value: new OpenLayers.Bounds(-10031468,1399160,-9202279,1927493),
		          value: bboxFilterBounds,
		          projection: bboxCrs 
			});
			
			if (bboxFilter) {
				andFilter = new OpenLayers.Filter.Logical(
						{
							type : OpenLayers.Filter.Logical.AND,
							filters : [
									filter,
									bboxFilter]
						});
			}
			
			filter = andFilter;
		}
		
		return filter;
	};
	
	this.getCompareOperatorForType = function(attributeType) {
		var compareOperator = null;
		if (attributeType === "int") {
			compareOperator = OpenLayers.Filter.Comparison.EQUAL_TO;
		} else if (attributeType === "string") {
			compareOperator = OpenLayers.Filter.Comparison.LIKE;
		} else if (attributeType === "decimal") {
			compareOperator = OpenLayers.Filter.Comparison.EQUAL_TO;
		}
		return compareOperator;
	};
	
	this.createCompareCondition = function(searchTerm, attributeName, attributeType, matchCase, likeSearch) {
		
		var compareOperator = this.getCompareOperatorForType(attributeType);
		
		
		if (compareOperator === OpenLayers.Filter.Comparison.LIKE && likeSearch) {
			searchTerm = "*" + searchTerm + "*";
		}
		
		var compareCondition = new OpenLayers.Filter.Comparison({
			// type : OpenLayers.Filter.Comparison.EQUAL_TO,
			type : compareOperator,
			property : attributeName,
			value : searchTerm,
			matchCase: matchCase 
		});
		
		/*
		 * For matchCase:
		 * SEE http://dev.openlayers.org/docs/files/OpenLayers/Filter/Comparison-js.html
		 */
		
		return compareCondition;
	};
	
	this.addOrCondition = function(searchTerm, attributeName, attributeType, filterObject, matchCase, likeSearch) {
		var filt = new OpenLayers.Filter.Logical(
				{
					type : OpenLayers.Filter.Logical.OR,
					filters : [
							filterObject,
							this.createCompareCondition(searchTerm, attributeName, attributeType, matchCase, likeSearch) ]
				});

		return filt;
	};

};