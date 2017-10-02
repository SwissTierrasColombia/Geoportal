function departmentIntersection(pointGeom, depKey, okFn, failFn) {
	var int = new Intersect();
	int.intersectPointWithLayer(
		{
			url: alerts.intersections.config.department.layerUrl,
			pointCrs : "EPSG:4326",
			//layerCrs : "EPSG:4326",
			layerColumnName: alerts.intersections.config.department.keyColumnName,
			layerColumnValue: depKey,
			layerGeometryColumnName: alerts.intersections.config.department.geomColumnName,
			layerName: alerts.intersections.config.department.layerName
		},
		//new OpenLayers.Geometry.Point(pointX, pointY),
		pointGeom,
		function(res) {
			//alert('ok, got it right ' + res);
			var boolRes = false;
			try {
				var num = parseInt(res);
				if (num > 0) boolRes = true;
			} catch(err) {
				//pass
			}
			okFn(boolRes);
		},
		function() {
			if (!Utils.isNullOrUndefined(failFn)) {
				failFn();
			}
		}
	);
}

var Intersect = function() {
	
	this.intersectPointWithLayer = function(intersectConfig, pointGeom, okFn, failFn) {
		
		//Create instance of a intersectFilterHelper.
		var intersectFilterHelper = new IntersectFilterHelper();

		//Create a filter on the given layer
		var filterOL = intersectFilterHelper.createFilterOL(intersectConfig, pointGeom);
		var resultType = "hits";
		//var url = "http://192.168.10.72:8081/geoserver/icf/wms";
		var url = intersectConfig.url;
		var layerName = intersectConfig.layerName;
		var geometryColumnName = intersectConfig.layerGeometryColumnName;
		
		//Execute call for a getFeature
		doGetFeaturesPOST(url, {
			typeNames : layerName,
			filterOL : filterOL,
			resultType: resultType,
			geometryColumnName: geometryColumnName
		}, function(res) {
			okFn(res);
		}, function(){
			failFn();
		});
	};
};