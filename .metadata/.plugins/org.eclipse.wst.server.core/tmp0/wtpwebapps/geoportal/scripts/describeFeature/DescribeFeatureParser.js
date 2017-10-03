var DescribeFeatureParser = function(describeFeatureTypeObject) {
	this._obj = describeFeatureTypeObject;

	this.getDescribeFeatureConfig = function(typeName) {
		var attributeList = new Array();

		var featureType = this.getFeatureTypeByName(typeName);
		if (!Utils.isNullOrUndefined(featureType)) {
			$.each(featureType.properties, function(key, value) {
				var elem = {};
				elem.name = value.name;
				elem.type = value.localType;
				attributeList.push(elem);
			});
		}

		return attributeList;
	};

	this.getFeatureTypeByName = function(typeName) {
		var featureType = null;
		$.each(this._obj.featureTypes, function(key, value) {
			if (value.typeName === typeName) {
				featureType = value;
				return false;	
			}
		});

		return featureType;
	};
};