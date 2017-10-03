function exportAll() {
	//map
	var map = catalog.getMapConfig();
	
	//tools
	var tools = catalog.getToolConfig();
	
	//Get all layer configs...
	var layers = [];
	$.each(catalog.getLayerConfigs(), function(key, layerConfig_i) {
		var exp = layerConfig_i.exportToJson();
		layers.push(exp);
	});
	
	var objectToExport = {
		"tools" : tools,
		"map": map,
		"layers" : layers
	};
	
	var prova = JSON.stringify(objectToExport);
	download("json_config.txt", prova);
}

//Temp...
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}