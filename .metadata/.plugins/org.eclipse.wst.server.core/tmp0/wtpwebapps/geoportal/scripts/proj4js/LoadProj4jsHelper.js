function LoadProj4jsHelper(){
};

LoadProj4jsHelper.loadProjDefinitions = function() {
	
	Proj4js.defs["EPSG:4248"] = "+proj=longlat +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +no_defs";
	Proj4js.defs["EPSG:32616"] = "+proj=utm +zone=16 +datum=WGS84 +units=m +no_defs";
	Proj4js.defs["EPSG:32617"] = "+proj=utm +zone=17 +datum=WGS84 +units=m +no_defs";
	
	/*
	 * Modificati con versione di Geoserver
	 * Inizialmente erano: 
	 * +proj=utm +zone=16 +datum=NAD27 +units=m +no_defs (senza ellps e senza towgs84)
	 */
	Proj4js.defs["EPSG:26715"] = "+proj=utm +zone=15 +ellps=clrk66 +towgs84=2.478,149.752,197.726,0.526,-0.498,0.501,0.685 +units=m +no_defs";
	Proj4js.defs["EPSG:26716"] = "+proj=utm +zone=16 +ellps=clrk66 +towgs84=2.478,149.752,197.726,0.526,-0.498,0.501,0.685 +units=m +no_defs";
	Proj4js.defs["EPSG:26717"] = "+proj=utm +zone=17 +ellps=clrk66 +towgs84=2.478,149.752,197.726,0.526,-0.498,0.501,0.685 +units=m +no_defs";
	
	/*
	 * End modifica
	 */
};