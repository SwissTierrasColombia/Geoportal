/**
 * Function to be called when the Line-Measure button is clicked.
 */
function buttonLineMeasureClicked() {
	var enabled = ($("#gis_measureLineBtn").is(':checked'))
	/*
	 * If it is enabled, then areaControl must be disabled
	 */
	if (enabled) {
		$("#gis_measureAreaBtn").prop('checked', false);
		$("#gis_measureAreaBtn").button("refresh");
		toggleMeasureControl("polygon", false);

		showMeasureDialog(true);
	} else {
		showMeasureDialog(false);
	}

	toggleMeasureControl("line", enabled);
}

/**
 * Function to be called when the Polygon-Measure button is clicked.
 */
function buttonPolygonMeasureClicked() {
	var enabled = ($("#gis_measureAreaBtn").is(':checked'));

	/*
	 * If it is enabled, then lineControl must be disabled
	 */
	if (enabled) {
		$("#gis_measureLineBtn").prop('checked', false);
		$("#gis_measureLineBtn").button("refresh");
		toggleMeasureControl("line", false);

		showMeasureDialog(true);
	} else {
		showMeasureDialog(false);
	}

	toggleMeasureControl("polygon", enabled);
}

/**
 * Symbolizers for Line and Polygon Measures
 */
var sketchSymbolizers = {
	"Point" : {
		pointRadius : 4,
		graphicName : "square",
		fillColor : "white",
		fillOpacity : 1,
		strokeWidth : 1,
		strokeOpacity : 1,
		strokeColor : "#333333"
	},
	"Line" : {
		strokeWidth : 3,
		strokeOpacity : 1,
		strokeColor : "#c10000",
		strokeDashstyle : "dash"
	},
	"Polygon" : {
		strokeWidth : 2,
		strokeOpacity : 1,
		strokeColor : "#c10000",
		fillColor : "white",
		fillOpacity : 0.3
	}
};

var style = new OpenLayers.Style();
style.addRules([ new OpenLayers.Rule({
	symbolizer : sketchSymbolizers
}) ]);

var styleMapMeasureControls = new OpenLayers.StyleMap({
	"default" : style
});

/**
 * Shows or hides the Measure Dialog
 * 
 * @param value
 *            true or false
 */
function showMeasureDialog(value) {
	var measureDialog = $("#gis_measures");
	if (value === true && !measureDialog.is(':visible')) {
		measureDialog.text("");
		measureDialog.show();
	}

	if (value === false && measureDialog.is(':visible')) {
		measureDialog.hide();
	}
}

/**
 * Activates or Deactivates a given Measure Control
 * 
 * @param type
 *            ("line") or ("polygon")
 */
function toggleMeasureControl(type, enabled) {
	var measureControls = mapControls["measureControls"];
	for (key in measureControls) {
		var control = measureControls[key];
		if (type === key && enabled) {
			// alert("Activating " + key);
			control.activate();
		} else {
			// alert("Deactivating " + key);
			control.deactivate();
		}
	}
}

function writeAlternateMeasure(units, value, order) {
	var res = "";
	if ("" !== value) {
		res = " (" + value.toFixed(3) + " " + units;
		
		if (order === 2) {
			res = res +"&sup2;";
		}
		res = res + ")";
	}
	
	return res;
}

/**
 * Handle measurements.
 * 
 * @param event
 */
function handleMeasurements(event) {
	//var geometry = event.geometry;
	var units = event.units;
	var order = event.order;
	var measure = event.measure;
	
	var alternateMeasureUnits = "";
	var alternateMeasureValue = "";
	
	//Line measure -> always meters
	if (order === 1 && "km" === units) {
		alternateMeasureUnits = units;
		alternateMeasureValue = measure;
		
		measure = measure * 1000;
		units = "m";
	}
	
	//Area measure -> hectares
	if (order === 2 && "km" === units) {
		alternateMeasureUnits = units;
		alternateMeasureValue = measure;
		
		measure = measure * 100;
		units = "hectares";
	}
	
	if (order === 2 && "m" === units) {
		alternateMeasureUnits = units;
		alternateMeasureValue = measure;
	}
	
	var out = "";
	var alternateRes = writeAlternateMeasure(alternateMeasureUnits, alternateMeasureValue, order);
	if (order == 1) {
		out += LocaleManager.getKey("Measure_Panel_Measure_Text") + ": " + measure.toFixed(3) + " " + units + alternateRes;
	} else {
		//out += LocaleManager.getKey("Measure_Panel_Measure_Text") + ": " + measure.toFixed(3) + " " + units + "&sup2;" + alternateRes;
		out += LocaleManager.getKey("Measure_Panel_Measure_Text") + ": " + measure.toFixed(3) + " " + units + alternateRes;
	}
	
	$("#gis_measures").html(out);
}