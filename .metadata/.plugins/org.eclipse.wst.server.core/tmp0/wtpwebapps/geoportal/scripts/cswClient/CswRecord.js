var CswRecord = function(record, properties) {
	this.params = record;
	var validProperties = properties;
	
	this.getParams = function() {
		return this.params;
	};
	
	this.getProperties = function() {
		var properties = new Object();
		$.each(this.params, function(property, valueProperty) {
			if(Utils.isInArray(property, validProperties, "key") != false) {
				//propertyKey = validProperties[key];
				properties[property] = valueProperty;
			}
		});
		
		return properties;
	};
	
	// Return the proper name of property defined in this.validProperties object
	// Es.
	// - property: "description" -> property name: "Description"
	this.getPropertyName = function(key) {
		return validProperties[key];
	};
	
	// Return list of value for a specific property record
	// In a property can be more then one value
	this.getValuesProperty = function(property) {
		var valuesProperty = [];
		
		$.each(this.params[property], function(index, valueObj){
			if(property === "abstract") {
				valuesProperty.push(valueObj);
				return true;
			}
			valuesProperty.push(valueObj.value);
		});
		
		return valuesProperty;
	};
	
	this.getThumbnail = function() {
		var thumbnail = null
		$.each(this.params.URI, function(index, obj){
			if(obj.name === "thumbnail") {
				thumbnail = obj.value;
				return false;
			}
		});
		
		return thumbnail;
	};
	
	this.getTitle = function() {
		var title = null;
		
		$.each(this.params.title, function(index, obj){
			if(obj.hasOwnProperty("value") && obj.value !== "") {
				title = obj.value;
				return false;
			}
		});
		
		return title;
	};
	
	this.getUrl = function() {
		var url = null;
		
		$.each(this.params.URI, function(index, obj){
			if(obj.name !== "thumbnail" && obj.name !== "large_thumbnail") {
				url = obj.value;
				return false;
			}
		});
		
		return url;
	};
	
	this.getSource = function() {
		var source = null;
		
		$.each(this.params.source, function(index, obj) {
			if(obj.hasOwnProperty("value") && obj.value !== "") {
				source = obj.value;
				return false;
			}
		});
		
		return source;
	};
	
	this.getName = function() {
		var name = null;
		
		$.each(this.params.URI, function(index, obj) {
			if(obj.name !== "thumbnail" && obj.name !== "large_thumbnail") {
				name = obj.name;
				return false;
			}
		});
		
		return name;
	};
	
	this.getId = function() {
		return this.params.identifier[0].value;
	};
	
	this.getBbox = function() {
		var bound = null;
		
		if(
			this.params.bounds &&
			this.params.bounds.hasOwnProperty("bottom") &&
			this.params.bounds.hasOwnProperty("top") &&
			this.params.bounds.hasOwnProperty("left") &&
			this.params.bounds.hasOwnProperty("right")
		) {
			bound = this.params.bounds
		}
		
		return bound;
	};
	
	this.getEPSG = function() {
		var epsg = null;
		
		if(this.params.projection && this.params.projection != "") {
			epsg = this.params.projection.substring(
				this.params.projection.lastIndexOf('(')+1,
				this.params.projection.lastIndexOf(')')
			);
		}
		
		return epsg;
	};
	
};