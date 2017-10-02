var IntersectFilterHelper = function() {
	
	this.createFilterOL = function(intersectConfig, pointGeom) {
		
		var compareCondition =  new OpenLayers.Filter.Comparison({
			type : OpenLayers.Filter.Comparison.EQUAL_TO,
			property : intersectConfig.layerColumnName,
			value : intersectConfig.layerColumnValue,
		});
		
		var intersectCondition =  new OpenLayers.Filter.Spatial({ 
	          type: OpenLayers.Filter.Spatial.INTERSECTS, 
	          property: intersectConfig.intersectConfig,
	          value: pointGeom,
	          projection: intersectConfig.pointCrs
		});
		
		var andFilter = new OpenLayers.Filter.Logical(
				{
					type : OpenLayers.Filter.Logical.AND,
					filters : [
							compareCondition,
							intersectCondition ]
				});

		return andFilter;
	};
};