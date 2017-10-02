/**
 * The ADD NEW WMS Dialog is shown. It accepts a Callback parameter where it is
 * possibile to specify callbacks for the events.
 * 
 * The structure is this { validUrlInserted(url) : this is called when a valid
 * URL is inserted and the user clicks "OK" }
 * 
 * 
 * @param callbacks
 * 
 * 
 * @returns
 */
function displayAddWMSDialog(validUrlInsertedCallbackFn) {

	var inputUrl = $("<input>", {
		id : "addwms_url"
	}).attr("style", "margin-left: 11px;width: 335px");

	var content = $("<div>").attr("style", "padding: 10px 5px 5px 5px;").append(LocaleManager.getKey("AddWMSDialog_URL")).append(inputUrl);

	var buttons = {};
	buttons[LocaleManager.getKey("AlertDialog_Cancel")] = function() {
		$(this).dialog("close");
	};

	buttons[LocaleManager.getKey("AlertDialog_OK")] = function() {
		var insertedUrl = $("#addwms_url").val();

		if (!Utils.isNullOrUndefined(validUrlInsertedCallbackFn)) {
			validUrlInsertedCallbackFn(insertedUrl);
		}
	};

	var dialogDiv = DialogUtils.createDialog(LocaleManager.getKey("AddWMSDialog_Title"), buttons, {
		width : 400,
		height : 140
	}, content);
	return dialogDiv;
}