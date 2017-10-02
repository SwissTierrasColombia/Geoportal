/**
 * MetadataUtils class
 */
function MetadataUtils() {
};

MetadataUtils.getScaleFromResolution = function(resolution, unit) {
	var scale = resolution * OpenLayers.INCHES_PER_UNIT[unit] * OpenLayers.DOTS_PER_INCH;
	return scale;
};

MetadataUtils.getMetadataUrlDetails = function (geonetworkUrl) {
	if (LocaleManager.locale === "es") {
		return geonetworkUrl + "/srv/spa/metadata.show?uuid=";
	}
	else {
		return geonetworkUrl + "/srv/eng/metadata.show?uuid=";
	}
};