var globalStyles = {
		redlines: {
			//Select Symbolizer
			selectSymbolizer: {
				"Point": {
					pointRadius: 8,
				    graphicName: "circle",
				    fillColor: "#2E2EFE",
				    fillOpacity: 0.4,
				    strokeWidth: 2,
				    strokeColor: "#2E2EFE"
				},
				"Line": {
					label: "${label}",
				    strokeWidth: 3,
				    strokeOpacity: 1,
				    strokeColor: "#2E2EFE",
				    strokeDashstyle: "solid"
				},
				"Polygon": {
				    strokeWidth: 2,
				    strokeColor: "#2E2EFE",
				    fillColor: "#2E2EFE",
				    fillOpacity: 0.4
				    // 662d91
				}
			},
			//Select Text Symbolizer
			selectSymbolizerText: {
				"Point": {
					label: "${label}",
					pointRadius: 8,
				    graphicName: "circle",
				    fillColor: "#2E2EFE",
				    fillOpacity: 0.4,
				    strokeWidth: 2,
				    strokeColor: "#2E2EFE"
				},
				"Line": {
					label: "${label}",
				    strokeWidth: 3,
				    strokeOpacity: 1,
				    strokeColor: "#2E2EFE",
				    strokeDashstyle: "solid"
				},
				"Polygon": {
					label: "${label}",
				    strokeWidth: 2,
				    strokeColor: "#2E2EFE",
				    fillColor: "#2E2EFE",
				    fillOpacity: 0.4
				    // 662d91
				}
			},
			//Default Symbolizer
			defaultSymbolizer: {
				"Point": {
				    pointRadius: 8,
				    graphicName: "circle",
				    fillColor: "#ee9900",
				    fillOpacity: 0.4,
				    strokeWidth: 2,
				    strokeColor: "#ee9900"
				  },
				"Line": {
				    strokeWidth: 3,
				    strokeOpacity: 1,
				    strokeColor: "#ee9900",
				    strokeDashstyle: "solid"
				},
				"Polygon": {
				    strokeWidth: 2,
				    strokeColor: "#ee9900",
				    fillColor: "#ee9900",
				    fillOpacity: 0.4
				    // 662d91
				}
			},
			//Default Text Symbolizer
			defaultSymbolizerText: {
				"Point": {
					label: "${label}",
				    pointRadius: 8,
				    graphicName: "circle",
				    fillColor: "#ee9900",
				    fillOpacity: 0.4,
				    strokeWidth: 2,
				    strokeColor: "#ee9900"
				  },
				"Line": {
					label: "${label}",
				    strokeWidth: 3,
				    strokeOpacity: 1,
				    strokeColor: "#ee9900",
				    strokeDashstyle: "solid"
				},
				"Polygon": {
					label: "${label}",
				    strokeWidth: 2,
				    strokeColor: "#ee9900",
				    fillColor: "#ee9900",
				    fillOpacity: 0.4
				    // 662d91
				}
			}
		}
};

function StyleManager(){
};

StyleManager.getRedlineStyle = function() {
	var defaultStyle = new OpenLayers.Style();
	  defaultStyle.addRules([
			new OpenLayers.Rule({
				filter: new OpenLayers.Filter.Comparison({
		            type: OpenLayers.Filter.Comparison.EQUAL_TO,
		            property: "show",
		            value: "yes",
		          }),
				symbolizer: globalStyles.redlines.defaultSymbolizerText,
				elseFilter: false
			}),
			new OpenLayers.Rule({
//		        symbolizer: {Text:{
//		          label: ""
//		        }},
				symbolizer:globalStyles.redlines.defaultSymbolizer,
		        elseFilter: true
		    })
	  ]);
	  
	  var selectStyle = new OpenLayers.Style();
	  selectStyle.addRules([
			new OpenLayers.Rule({
				filter: new OpenLayers.Filter.Comparison({
		            type: OpenLayers.Filter.Comparison.EQUAL_TO,
		            property: "show",
		            value: "yes",
		          }),
				symbolizer: globalStyles.redlines.selectSymbolizerText,
				elseFilter: false
			}),
			new OpenLayers.Rule({
//		        symbolizer: {Text:{
//		          label: ""
//		        }},
				symbolizer: globalStyles.redlines.selectSymbolizer,
		        elseFilter: true
		    })
	  ]);
	  
	  var redlineStyleMap = new OpenLayers.StyleMap(
			  {
			   "default": defaultStyle,
			   "select": selectStyle
			  }
			);
	  return redlineStyleMap;
};


StyleManager.readSLD = function(sldName, layerName, callBackFn) {
	$.ajax({
		url : "./sld/" + sldName,
		type : "GET",
		contentType: "text/xml",
		//datatype : "xml",
		cache : false
	}).done(function(response) {
		var format = new OpenLayers.Format.SLD();
		var sld = format.read(response);
	    //style = sld.namedLayers.prova_punto_layer_name.userStyles[0];
		var userStyles = sld.namedLayers[layerName].userStyles;
	    callBackFn(userStyles);
	}).fail(function(){
		alert('fail');
	});
};

StyleManager.getDefaultStyle = function(userStyles) {
	for (var i=0; i<userStyles.length; i++) {
        var style = userStyles[i];
        if (style.isDefault) {
            return style;
        }
    }
    return null;
};

StyleManager.getStyleByName = function(userStyles, styleName) {
	for (var i=0; i<userStyles.length; i++) {
        var style = userStyles[i];
        if (style.name === styleName) {
            return style;
        }
    }
    return null;
};
