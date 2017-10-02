
/**
 * GetFeaturesUtils class
 */
function GetFeaturesUtils() {
};

GetFeaturesUtils.getValueListFromWFS = function(configObject, okFn, failFn) {
	
	configObject["outputFormat"] = "GML2";
	
	var url = configObject.url;
	var key = configObject.propertyName[0];
	var column = configObject.propertyName[1];
		
	doGetFeaturesGET(url, configObject, function(res){
		try {
			//Build a list with key-value
			var resultList = [];
			$.each(res, function(idx, item){
				var elem = {
					id: item.data[key],
					name: item.data[column]
				};
				resultList.push(elem);
			});
		
			//Order by name
			var orderedResultList = Utils.orderByAttribute(resultList, "name", "asc");
			okFn(orderedResultList);
		} catch (exc) {
			console.log("Error fetching value list from WFS");
			failFn();
		}
	}, failFn);
};