/**
 * Services class
 * Retrive url of server services for ajax calls
 */
function Services() {};

/**
 * Services url constants
 * @returns {String}
 */
Services.mapConfig = "./mapConfig";
Services.layerConfig = "./layerConfig";
Services.comments = "./comments";

/**
 * Services method to retrieve url of services
 */
Services.getMapConfigUrl = function() {
	return Services.mapConfig;
};

Services.getLayerConfigUrl = function() {
	return Services.layerConfig;
};

Services.getCommentsUrl = function() {
	return Services.comments;
};