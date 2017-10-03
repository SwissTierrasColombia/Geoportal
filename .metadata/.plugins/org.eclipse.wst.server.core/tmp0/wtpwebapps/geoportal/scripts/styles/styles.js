/** ****************
 *  REDLINES STYLES
 *  ****************/

	var selectSymbolizer = {
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
	};
	
	var selectSymbolizerText = {
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
		};
	
	var defaultSymbolizer = {
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
	};
	
	var defaultSymbolizerText = {
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
		};

  var defaultStyle = new OpenLayers.Style();
  defaultStyle.addRules([
		new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
	            type: OpenLayers.Filter.Comparison.EQUAL_TO,
	            property: "show",
	            value: "yes",
	          }),
			symbolizer: defaultSymbolizerText,
			elseFilter: false
		}),
		new OpenLayers.Rule({
//	        symbolizer: {Text:{
//	          label: ""
//	        }},
			symbolizer: defaultSymbolizer,
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
			symbolizer: selectSymbolizerText,
			elseFilter: false
		}),
		new OpenLayers.Rule({
//	        symbolizer: {Text:{
//	          label: ""
//	        }},
			symbolizer: selectSymbolizer,
	        elseFilter: true
	    })
  ]);
  
  var testStyleMap = new OpenLayers.StyleMap(
		  {
		   "default": defaultStyle,
		   "select": selectStyle,
		   "hidden":{
				fillOpacity: 0.0,	
				strokeOpacity: 0.0
			}
		  }
		);