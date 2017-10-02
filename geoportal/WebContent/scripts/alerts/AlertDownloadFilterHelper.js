var AlertDownloadFilterHelper = function() {
	this.createDateFilterOL = function(minDate, maxDate, dateFieldName) {
		var filter = null;
		var numberConditionAdded = 0;
			
		if (Utils.isNotEmpty(minDate)) {
			//Greater than condition exists
			filter = this.createGreaterThanDateCondition(minDate, dateFieldName);
			numberConditionAdded++;
		}
		
		if (Utils.isNotEmpty(maxDate)) {
			//Less than condition exists
			var lessThanCond = this.createLessThanDateCondition(maxDate, dateFieldName);
			
			if (numberConditionAdded == 0) {
				filter = lessThanCond;
			} else {
				filter = this.addAndCondition(filter, lessThanCond);
			}
			numberConditionAdded++;
		}
		return filter;
	};
	
	this.createGreaterThanDateCondition = function(minDate, dateFieldName) {
		var greaterThanCond = new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
			property: dateFieldName,
			value: minDate
		});
		
		return greaterThanCond;
	};
	
	this.createLessThanDateCondition = function(maxDate, dateFieldName) {
		var lessThanCond = new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
			property: dateFieldName,
			value: maxDate
		});
		
		return lessThanCond;
	};
	
	this.addAndCondition = function(filter1, filter2) {
		var andFilter = new OpenLayers.Filter.Logical(
			{
				type : OpenLayers.Filter.Logical.AND,
				filters : [
					filter1,
					filter2]
		});
		
		return andFilter;
	};
};