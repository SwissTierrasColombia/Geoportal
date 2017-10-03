/**
 * DialogUtils class
 */
function DialogUtils() {
};

DialogUtils.renderDialog = function(title, buttons, options, dialogDiv) {
	var width = 700;
	var height = 350;
	var autoOpen= false;
	var modal = true;
	var resizable = true;
	
	if (!Utils.isNullOrUndefined(options)) {
		if (!Utils.isNullOrUndefined(options.width)) {
			width = options.width;
		}
		if (!Utils.isNullOrUndefined(options.height)) {
			height = options.height;
		}
		if (!Utils.isNullOrUndefined(options.autoOpen)) {
			autoOpen = options.autoOpen;
		}
		if (!Utils.isNullOrUndefined(options.modal)) {
			modal = options.modal;
		}
		if (!Utils.isNullOrUndefined(options.resizable)) {
			resizable = options.resizable;
		}
	}
	
	
	var dialogOptions = {
		autoOpen : autoOpen,
		title: title,
		modal : modal,
		width : width,
		height : height,
		modal : modal,
		resizable: resizable,
		close : function(event, ui) {
			if (!Utils.isNullOrUndefined(options.closeFn)) {
				options.closeFn();	
			}
			$(this).dialog('close');
		},
		buttons : buttons	
	};
	
	options.dragsafe = true;
	if (options.dragsafe === true) {
		dialogOptions["dragStart"] = function() {
			DragUtils.enable($(this));
		};
		dialogOptions["dragStop"] = function() {
			DragUtils.disable($(this));
		};
	}
	
	/*
	 * Building the Dialog
	 */
	dialogDiv.dialog(dialogOptions);

	
	var collapsable = false;
	//var dblClickEvebt = 'collapse';
	
	if (!Utils.isNullOrUndefined(options.collapsable)) {
		collapsable = options.collapsable;
	}
	
	if (!Utils.isNullOrUndefined(options.extensions) && options.extensions === true) {
	/*
	 * If specified, adds the extensions

	 * https://github.com/ROMB/jquery-dialogextend
	 */
		dialogDiv.dialogExtend({
	        //"closable" : true,
	        //"maximizable" : collapsable,
	        "minimizable" : collapsable
	        //"collapsable" : collapsable,
	        //"dblclick" : dblClickEvebt
	        //"titlebar" : "transparent",
	//        "icons" : {
	//          "close" : "ui-icon-circle-close",
	//          "maximize" : "ui-icon-circle-plus",
	//          "minimize" : "ui-icon-circle-minus",
	//          "collapse" : "ui-icon-triangle-1-s",
	//          "restore" : "ui-icon-bullet"
	//        }
	      });
	}
	
	return dialogDiv;
};


DialogUtils.createDialog = function(title, buttons, options, dialogContentDiv) {
	/*
	 * Create a containing dialog (DIV)
	 */
	var dialogDiv = $("<div>", {
		title : title
	});

	
	var width = 700;
	var height = 350;
	var autoOpen= false;
	var modal = true;
	var resizable = true;
	if (!Utils.isNullOrUndefined(options)) {
		if (!Utils.isNullOrUndefined(options.width)) {
			width = options.width;
		}
		if (!Utils.isNullOrUndefined(options.height)) {
			height = options.height;
		}
		if (!Utils.isNullOrUndefined(options.autoOpen)) {
			autoOpen = options.autoOpen;
		}
		if (!Utils.isNullOrUndefined(options.modal)) {
			modal = options.modal;
		}
		if (!Utils.isNullOrUndefined(options.resizable)) {
			resizable = options.resizable;
		}
	}
	
	
	
	
	/*
	 * Building the Dialog
	 */
	var dialogOptions= { 
		autoOpen : autoOpen,
		modal : modal,
		width : width,
		height : height,
		resizable: resizable,
		close : function(event, ui) {
			if (!Utils.isNullOrUndefined(options.closeFn)) {
				options.closeFn();	
			}
			$(this).dialog('destroy').remove();
		},
		buttons : buttons,
	};
	
	if (!Utils.isNullOrUndefined(options.position)) {
		dialogOptions["position"] = options.position;
	}
	
	
	options.dragsafe = true;
	
	if (options.dragsafe === true) {
		dialogOptions["dragStart"] = function() {
			DragUtils.enable($(this));
		};
		dialogOptions["dragStop"] = function() {
			DragUtils.disable($(this));
		};
	}

	dialogDiv.dialog(
		dialogOptions
	);
	
	dialogDiv.append(dialogContentDiv);

	return dialogDiv;
};