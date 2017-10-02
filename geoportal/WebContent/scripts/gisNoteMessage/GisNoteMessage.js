/**
 * GisNoteMessage class
 */
function GisNoteMessage() {
};

GisNoteMessage.forceClose = function() {
	$("#gis_information_popup").hide();
};

GisNoteMessage.gisNoteMessageClicked = function() {
	var popupVisibility = $("#gis_information_popup").is(":visible");
	
	if (popupVisibility === true) {
		$("#gis_information_popup").hide();
	}
	else {
		$("#gis_information_popup").html(GENERAL_SETTINGS.informationMessage);
		$("#gis_information_popup").show();
	}
};