/*
 * Esempio di uso...
 * AlertDialog.createOkDialog({
		title: "TITOLO",
		message: "messaggio",
		okButton: true,
		okFn : function() {
			alert('ok_clicked');
			$(this).dialog("close");
		},
		cancelButton: true,
		cancelFn : function() {
			alert('no_clicked');
			$(this).dialog("close");
		}
	});
 */

function AlertDialog() {
};

AlertDialog.configurationError = "Error constructing AlertDialog.";

/**
 * Creates a Dialog with a OK and CANCEL button. Clicking OK closes the dialog and calls
 * the specified OK callback function
 * okFn (Optional)
 */
AlertDialog.createConfirmDefaultDialog = function(title, messageText, okFn, noFn) {
	var buttons = {};			
	buttons[LocaleManager.getKey('General_Confirm')] = function(){
		if (!Utils.isNullOrUndefined(okFn)) {
			okFn();
		}
		$(this).dialog("close");
	};
	
	buttons[LocaleManager.getKey('General_Cancel')] = function(){
		if (!Utils.isNullOrUndefined(noFn)) {
			noFn();
		}
		$(this).dialog("close");
	};
	
	var dialogConfirm = AlertDialog.buildDialog({
		isToCreate: true,
		title: title,
		message: messageText, 
		type: "question",
		buttons: buttons
	});
	
	return dialogConfirm;
};

/**
 * Creates a Dialog with a OK button. Clicking OK closes the dialog and calls
 * the specified OK callback function
 * okFn (Optional)
 */
AlertDialog.createOkDefaultDialog = function(title, messageText, type, okFn) {
//	var isErrorDialog = false;
//	if (!Utils.isNullOrUndefined(okFn))
//		isErrorDialog = isError;
	
	AlertDialog.createOkDialog({
		title : title,
		message : messageText,
		okButton : true,
		type: type,
		okFn : okFn
	});
};

/**
 * Create a dialog without an existing dialog div
 * It creates a div and passes it to build dialog with dic created
 * @param alertConfig
 */
AlertDialog.createOkDialog = function(alertConfig) {
	alertConfig.isToCreate = true;
	AlertDialog.buildDialog(alertConfig);
};

/**
 * Create dialog confirm
 * Accepted parameters of configDialog:
 * - Element: Jquery element dialog
 * - Title: title of dialog
 * - Message: message into dialog
 * - Type: question - info - error - checked
 * - Buttons: buttons of dialog and functions
 * 
 * @param configDialog
 * @returns
 */
AlertDialog.buildDialog = function(configDialog) {
	var typeDialog = "";
	var autoOpen = false;
	var typeIcon = "ui-icon-check";
	var dialogButtons = configDialog.buttons;
	var dialogObj = configDialog.element;
	
	if (Utils.isNullOrUndefined(dialogObj)) {
		dialogObj = $("<div>");
	}
	
	if( ! Utils.isNullOrUndefined(configDialog.isToCreate) &&  configDialog.isToCreate) {
		autoOpen = configDialog.isToCreate;
	}
	
	if( Utils.isNullOrUndefined(dialogButtons)) {
		dialogButtons = {};
		dialogButtons[LocaleManager.getKey("AlertDialog_OK")] = function(){
			if ( ! Utils.isNullOrUndefined(configDialog.okFn) )
				configDialog.okFn();
			$(this).dialog("close");
		};
	}
	
	switch (configDialog.type) {
		case "info":
			typeIcon: "ui-icon-info";
			break;
		case "checked":
			typeIcon: "ui-icon-check";
			break;
		case "error":
			typeDialog = "ui-state-error";
			typeIcon = "ui-icon-alert";
			break;
		case "question":
			typeIcon = "ui-icon-help";
	}
	
	var content = $("<p>").append(
		$("<div>", {"class": "ui-icon-left"}).append(
			$("<span>", {"class": "ui-icon " + typeIcon}),
			$("<div>", {"class": "message-dialog"}).html(configDialog.message)
		)
	);
	
	dialogObj.addClass(typeDialog).append(content);
	
	dialogObj.dialog({
		title: configDialog.title,
		autoOpen: autoOpen,
		modal : true,
		resizable: false,
		close : function(event, ui) {
			if (configDialog.isToCreate)
				$(this).dialog('destroy').remove();
		},
		buttons : dialogButtons
	});
	
	return dialogObj;
};