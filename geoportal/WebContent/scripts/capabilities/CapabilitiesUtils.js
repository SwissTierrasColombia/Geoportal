/**
 * CapabilitiesUtils class
 */
function CapabilitiesUtils() {
};

/*
 * Check if the server supports the current Map SRS
 */
CapabilitiesUtils.checkIfSrsSupported = function(projection, layerName, capabilities) {
	
	var srsSupported = true;
	$.each(capabilities.capability.layers, function(k, v) {
		if (v.name === layerName) {
			if (!(projection in v.srs)) {
				srsSupported = false;
			}
		}
	});
	
	return srsSupported;
};