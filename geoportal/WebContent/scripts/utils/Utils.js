/**
 * Utils class
 */
function Utils() {
};

///**
// * Rounds a number to the number of decimals
// * @param num
// * @param numDec
// * @returns {Number}
// */
//Alternativa a tofixed
//Utils.round = function(num, numDec) {
//	var temp = pow(num, numDec);
//	
//	return Math.round(num * temp) / temp;
//};

/**
 * Checks if the current object is null or undefined. Returns true if it is
 * either null or undefined else returns false
 */
Utils.isNullOrUndefined = function(object) {
	if ((object == null) || (typeof (object) === "undefined")) {
		return true;
	}
	return false;
};

Utils.isNotEmpty = function(string) {
	if (!Utils.isNullOrUndefined(string)) {
		if ("" != $.trim(string)) {
			return true;
		}
	}
	return false;
};

Utils.isEmpty = function(string) {
	return !Utils.isNotEmpty(string);
};

Utils.isInt = function(n) {
	//return typeof n== "number" && isFinite(n) && n%1===0;
	return !isNaN(parseFloat(n)) && isFinite(n);
};

Utils.isFloat = function(n) {
	return !isNaN(parseFloat(n));
};


Utils.isTrue = function(object) {
	if (!Utils.isNullOrUndefined(object) && object === true) {
		return true;
	}
	return false;
};


Utils.associativeArraySize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


Utils.isInArrayAsBool = function(val, arr) {
	var index = $.inArray(val, arr);
	if (index == -1) {
		return false;
	} else {
		return true;
	}
};

// Check if element exists in array
// - case list: return index if exist, false if not exists
// - case associative array: return true if value exists, false if not exists
Utils.isInArray = function(val, arr, checkParam) {
	var check = false;
	
	if(arr.length) {
		if($.inArray(val, arr) !== -1)
			check = $.inArray(val, arr).toString();
	}
	else {
		$.each(arr, function(key, value){
			if(checkParam === "key")
				compare = key;
			else
				compare = value;
			
			if(val === compare) {
				check = true;
				return false;
			}
		});
	}
	
	return check;
};

Utils.isArray = function(obj) {
	var isArray = false;
	if (obj.constructor === Array)
		isArray = true;

	return isArray;
};

/**
 * Create clone variable object
 */
Utils.clone = function(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new Object();
    for (var attr in obj) {
        if ( obj.hasOwnProperty(attr)) 
        	copy[attr] = obj[attr];
    }
    return copy;
};

/**
 *  Ritorna una feature OpenLayers dalla geometria WKT
 */
Utils.getFromWKT = function(gWkt) {
	var wkt = new OpenLayers.Format.WKT();
	var feature = wkt.read(gWkt);
	
	return feature;
};

/**
 * Ritorna la geometria in formato WKT da una openlayer geometry
 */
Utils.getGeomWKT = function(geometry) {
	var wkt = new OpenLayers.Format.WKT();
	var geom = wkt.extractGeometry(geometry);
	
	return geom;
};

Utils.escapeNamespace = function(layerName) {
	var hasPrefix = (layerName.indexOf(":") > -1 )? true : false;
	if (!hasPrefix) return layerName;
	else {
		return layerName.split(":")[1];
	}
};

Utils.EqualsNamespaceSafe = function(layerName1, layerName2) {
	var prefix1 = (layerName1.indexOf(":") > -1 )? true : false; 
	var prefix2 = (layerName2.indexOf(":") > -1 )? true : false;
	
	if (!prefix1 && !prefix2) {
		var res = layerName1 === layerName2;
		return res;
	}
	
	//else, at least 1 has a prefix, escape prefix
	var res = Utils.escapeNamespace(layerName1) === Utils.escapeNamespace(layerName2);
	return res;
};

/** ******************************************
 *  Return features from WKT geometry
 *  ******************************************/
Utils.getFeaturesFromList = function(listFeatures, labelProperty, properties) {
	var features = [];

	$.each(listFeatures, function(index, feat) {
		if (feat.hasOwnProperty("wktGeometry") && feat.wktGeometry != null) {
			// Create a feature from wkt geometry from db
			var feature = Utils.getFromWKT(feat.wktGeometry);
			
			if (!Utils.isNullOrUndefined(properties)) {
				for (var j=0; j<properties.length; j++) {
					var prop_j = properties[j];
					
					if(feat.hasOwnProperty(prop_j))
						feature = Utils.addPropertyToFeature(feature, prop_j, feat[prop_j]);
				}
			}
			if (!Utils.isNullOrUndefined(labelProperty)) {
				feature = Utils.addLabelToFeature(feature, feat[labelProperty]);
			}
			
			features.push(feature);
		} else {
			//Continue to next iteration
			return true;
		}				
	});
	
	return features;
},

/**
* Ritorna il Tipo di geometria corretto in funzione del class_name geometry 
*/
Utils.getGeomType = function(type) {
	switch (type) {
	case "Point":
		return "point";
		break;	
	case "Line":
		return "line";
		break;
	case "LineString":
		return "line";
		break;
	case "MultiLineString":
		return "line";
		break;
	case "Polygon":
		return "polygon";
		break;
	case "MultiPolygon":
		return "polygon";
		break;
	}
};

Utils.getGeomTypeForPrint = function(type) {
	switch (type) {
	case "Point":
		return "Point";
		break;	
	case "Line":
		return "Line";
		break;
	case "LineString":
		return "Line";
		break;
	case "MultiLineString":
		return "Line";
		break;
	case "Polygon":
		return "Polygon";
		break;
	case "MultiPolygon":
		return "Polygon";
		break;
	}	
};

Utils.createCloneFeature = function(feature) {
	var feat = new OpenLayers.Feature.Vector(feature.geometry.clone());
	return feat;
};

Utils.setAttributesFeature = function(feat, attrs) {
	$.each(attrs, function(key, val) {
		feat.attributes[key] = val;
	});
	
	return feat;
};

/**
 *  Return feature label if feature has one
 */
Utils.getFeatureLabel = function(feature) {
	return $.trim(feature.attributes.label);
};

/**
 *  Add label to feature
 */
Utils.addLabelToFeature = function(feature, label) {
	feature.attributes.label = label;
	feature.attributes.show = "yes";
	
	return feature;
};

/**
 *  Add property to feature
 */
Utils.addPropertyToFeature = function(feature, propertyKey, propertyValue) {
	feature.attributes[propertyKey] = propertyValue;
	
	return feature;
};

/**
 * Get pixel value from map coordinates
 */
Utils.getPixelFromMapCoords = function(point) {
	var coordX = point.x;
	var coordY = point.y;
	
	// Reproject coordinates to lonlat
	//var lonLatPoint = new OpenLayers.Geometry.Point(coordX, coordY).transform(new OpenLayers.Projection(map.getProjection()), new OpenLayers.Projection("EPSG:4326"));
	//var lonLat = new OpenLayers.LonLat(lonLatPoint.x, lonLatPoint.y);
	var lonLat = new OpenLayers.LonLat(coordX, coordY);
	var pixel = map.getPixelFromLonLat(lonLat);
	return pixel;
};

/**
 * 
 */
Utils.formatStringWithLineBreaks = function(lineLenght, originalLine) {
	label = originalLine.slice(0);
	
	//Remove duplicate spaces
	label = label.replace(/ {2,}/g,' ');
	
	
	// Create proper string label value
	// (with break line into string)
	var labelBreak = "";
	var tempLabel = label.slice(0);
	var numBreak = 1;
	for(var i = 0; i < label.length; i++) {
		if(label[i] === " ") {
			if(i > lineLenght * numBreak) {
				tempLabel = [tempLabel.slice(0, i + 1), "\n", tempLabel.slice(i + 1)].join("");
				numBreak = numBreak + 1;
			}
		}			
	}	
	labelBreak = tempLabel;
	return labelBreak;
};

/**
 * REMOVE LABEL INPUT ON MAP
 */
Utils.removeLabelInput = function() {
	$("#input-label").val("");
	$("#input-label-panel").hide();
	
	return;
};

/** *************
  * AJAX REQUEST
  * ************/
Utils.ajaxCallSynch = function(url, type, dataType, dataParams, fnOkCallBack, fnKoCallback) {
	$.ajax({
		url : url,
		async: false,
		type : type,
		dataType : dataType,
		data : dataParams
	}).done(function(response) {
		if(response.success) {
			fnOkCallBack(response);
		}
		else {
			if (!Utils.isNullOrUndefined(fnKoCallback)) {
				fnKoCallback(response);
			} else {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					response.msg,
					"error"
				);
			}
		}
	}).fail(function(jqXHR, textStatus, error){
		
		if (Utils.isEmpty(error)) {
			error = LocaleManager.getKey("Ajax_General_Error");
		}
		
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Error_Title"), 
			error,
			"error"
		);
	});
};

Utils.ajaxCall = function(url, type, dataType, dataParams, fnOkCallBack, fnKoCallback) {
	$.ajax({
		url : url,
		type : type,
		dataType : dataType,
		data : dataParams
	}).done(function(response) {
		if(response.success) {
			fnOkCallBack(response);
		}
		else {
			if (!Utils.isNullOrUndefined(fnKoCallback)) {
				fnKoCallback(response);
			} else {
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("AlertDialog_Error_Title"), 
					response.msg,
					"error"
				);
			}
		}
	}).fail(function(jqXHR, textStatus, error){
		
		if (Utils.isEmpty(error)) {
			error = LocaleManager.getKey("Ajax_General_Error");
		}
		
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Error_Title"), 
			error,
			"error"
		);
	});
};


/** ***************************
 *  Populate UL/OL with LI
 *  ***************************/
Utils.populateList = function(list, dataArray, keyName, dataKeyValue, LIvalue ) {
	//Do not empty!
	
	$.each(dataArray, function(index, item) {		
		var li = $("<li>");
		li.addClass("ui-widget-content");
		li.data( keyName, this[dataKeyValue]);
		li.text(this[LIvalue]);

		list.append(li);
	});
	
	return list;
};

Utils.populateListFromArray = function(list, array, keyName) {
	$.each(array, function(index, item) {		
		var li = $("<li>");
		li.addClass("ui-widget-content");
		li.data( keyName, item);
		li.text(item);

		list.append(li);
	});
	
	return list;
};


/** ***************************
 * Set the value of a select option
 * ***************************/
Utils.ComboSetSelectedValue = function(combobox, dataArray, valueKey) {
	if (Utils.isNullOrUndefined(dataArray[valueKey])) {
		//Nothing selected.
		return;
	}
	
	var options = combobox.find("option");
	$.each(options, function (k,v){
		if (dataArray[valueKey] == $(v).attr("value")) {
			$(v).prop("selected", true);
			return false; //exit loop
		}
	});
};

/** ***************************
 *  Populate combobox with data
 *  ***************************/
Utils.populateComboWithEmpty = function(combo, dataArray, dataKey, dataValue, extraDataKey) {
	combo.empty();
	Utils.populateCombo(combo, dataArray, dataKey, dataValue, extraDataKey);
	
	var nullOption = $("<option>", {
		"value": "",
		"text": ""
	});
	
	combo.prepend(nullOption);
};

Utils.populateCombo = function(combo, dataArray, dataKey, dataValue, extraDataKey) {
	combo.empty();
	
	$.each(dataArray, function(index, item) {		
		var option = $("<option>", {
			"value": this[dataKey],
			"text": this[dataValue]
		});
		
		if(!Utils.isNullOrUndefined(extraDataKey) && Utils.isArray(extraDataKey) && extraDataKey.length > 0) {
			for (var i = 0; i < extraDataKey.length; i++) {
				var key = extraDataKey[i];
				var value = this[key];
				option.data(key, value);
			} 
		}
		
		combo.append(option);
	});
};

/**
 *  Return default Database EPSG
 */
Utils.getDefaultDbEPSG = function() {
	return "EPSG:4326";
};

/**
 * Return row selected from a datatable
 */
Utils.getSelectedRow = function(dt) {
	var rows = dt.api().rows(".selected").data();
	if(rows.length > 0)
		return rows;
	else
		return false;
};

Utils.getNumberOfRows = function(dt) {
	var rows = dt.api().rows().data();
	return rows.length;
};

/**
 * Deselect all (visible) rows
 */
Utils.deselectAllVisibleRows = function(dt) {
	dt.find("tbody tr").removeClass("selected");
};



/**
* Get selected features from style
* Need to user beacause of on unhilighted feeature, 
* feature stay as selected into layer
*/
Utils.getSelectedFeatures = function(features) {
	var count = 0;
	$.each(features, function(index, feature){
		if(feature.renderIntent == "select")
			count = count + 1;
	});
	
	return count;
};

/**
 * Locate input label box 
 */
Utils.locateInputLabelBox = function(feature) {
	// Get selected feature centroid
	var centroid = feature.geometry.getCentroid();
	
	// Get position for input label element
	// Position is calculated by selected feature coordinates
	var pos = Utils.getPixelFromMapCoords(centroid);
	
	// Show and locate input label box at pixel returned
	$("#input-label-panel").css({top: pos.y + 15, left: pos.x + 15}).show();	
};

/**
 *  Return center of map
 */
Utils.getMapCenterPoint = function(mapObj) {
	var center = mapObj.getCenter();
	var origin = new OpenLayers.Geometry.Point(center.lon, center.lat);
	
	return origin;
};


Utils.orderArrayNumber = function(array) {
	array.sort(function(a, b){return a-b;});
};

/**
 *  Order array by attribute value
 */
Utils.orderByAttribute = function(arr, attr, dir) {
	return arr.sort(Utils.compareValues(attr, dir));
};

Utils.compareValues = function(attr, dir) {
    var sortOrder = 1;
    
    if(dir === "desc")
        sortOrder = -1;

    return function (a,b) {
        var result = (a[attr] < b[attr]) ? -1 : (a[attr] > b[attr]) ? 1 : 0;
        return result * sortOrder;
    };
};

/**
 *  Enable tooltip in the page
 */
Utils.enableTooltip = function() {
	$( document ).tooltip({
		items: ".localizedElement",
	    content: function() {
	    	var element = $( this );
	    	if(element.data("locale_ref") == "title" ) {
		    	var keyText = element.data("locale_key");
		    	var text = LocaleManager.getKey(keyText);
		    	return text;
	    	}
	    },
	    show: {
	    	duration: 50
	    },
	    hide: {
	    	duration: 20
	    }
	});
	
	return;
};

/**
 *  Clean form
 */
Utils.cleanForm = function(form) {
	// Clean input value form
	if(form) {
		$.each(form.find("input"), function(index, item){
			
			if ($(item).is(":checkbox")) {
				//Set to false
				$(item).prop('checked', false);
				
			} else {
				$(item).val("");	
			}
		});
		$.each(form.find("textarea"), function(index, item){
			$(item).val("");
		});
		
		
	}
	
	return;
};

/**
 * Close dialog
 */
Utils.closeDialogForm = function(form) {
	Utils.cleanForm(form);
	form.dialog("close");
	return;
};

/**
 * Move down element
 */
Utils.moveDown = function(element) {
	element.next().after(element);	
	return;
};

/**
 * Move up element
 */
Utils.moveUp = function(element) {
	element.prev().before(element);
	return;
};

/**
 * Get current position of item into a container
 */
Utils.getPositionItem = function(listItem, item) {
	var index = listItem.index(item);
	return (index + 1);
};


Utils.formatMandatoryFields = function(form) {
	$.each(form.find(".mandatoryFormat"), function(idx, item){
		var key = $(item).data("locale_key");
		var text = LocaleManager.getKey(key);
		text += " (*)";
		$(item).text(text);
	});
};
