/**
 * Print_Configuration class
 */
function Print_Configuration() {
};

Print_Configuration.loadConfigFromMapfish = function(okFn, failFn) {
	$.ajax({
		//url: "../print-servlet-mod2/pdf/info.json",
		url: PRINT_SERVLET_URL + "/pdf/info.json",
		type: "GET",
		cache: false,
		useProxy: true,
		timeout: AJAX_TIMEOUT,
		dataType: "json"
	}).done(function(request, textStatus, jqXHR) {
		var printConfigJSON = jqXHR.responseJSON;
		okFn(printConfigJSON);
	}).fail(function(jqXHR, textStatus, error) {
		var url ='xxx';
		OpenLayers.Console.error("Error " + url);
		// If the error callback function has been specified, let's
		// call it.
		// Otherwhise we show a standard Log
		if (!Utils.isNullOrUndefined(failFn)) {
			failFn();
		} else {
			var title = LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Title");
			var text = LocaleManager.getKey("GetCapabilities_Server_Connection_Error_Dialog_Text");
			AlertDialog.createOkDefaultDialog(title, text);
		}
	});
};

/*
 * Default...
 */
Print_Configuration.outputFileName = "print";

/*
 * These values must be also defined in the 
 * YAML configuration file of
 * PrintServlet (MapFish Print)
 */
//Print_Configuration.scales = [
//    {"value": 5000, "text": "1:5000"},
//    {"value": 10000, "text": "1:10000"},
//    {"value": 25000, "text": "1:25000"},
//    {"value": 50000, "text": "1:50000"},
//    {"value": 100000, "text": "1:100000"},
//    {"value": 200000, "text": "1:200000"},
//    {"value": 500000, "text": "1:500000"},
//    {"value": 1000000, "text": "1:1000000"},
//    {"value": 2000000, "text": "1:2000000"},
//    {"value": 3000000, "text": "1:3000000"},
//    {"value": 4000000, "text": "1:4000000"}
//];

/*
 * These values must be also defined in the 
 * YAML configuration file of
 * PrintServlet (MapFish Print)
 */
Print_Configuration.layoutsOverride = [
    {"value": "A4 landscape", "text": "A4 horizontal"},
    {"value": "A4 portrait", "text": "A4 vertical"},
    {"value": "Letter landscape", "text": "Carta horizontal"},
    {"value": "Letter portrait", "text": "Carta vertical"},
    {"value": "Oficio landscape", "text": "Oficio horizontal"},
    {"value": "Oficio portrait", "text": "Oficio vertical"},
    {"value": "A3 landscape", "text": "A3 horizontal"},
    {"value": "A3 portrait", "text": "A3 vertical"}
];

/*
 * These values must be also defined in the 
 * YAML configuration file of
 * PrintServlet (MapFish Print)
 */
Print_Configuration.dpiOverride = [
   //{"value": 254, "text": "254"},
   {"value": 190, "text": "190"},
   {"value": 127, "text": "127"},
   {"value": 56, "text": "56"}
];

Print_Configuration.outputFormatOverride = [
   {"value": "pdf", "text": "Pdf"},
   {"value": "png", "text": "Png"}
];