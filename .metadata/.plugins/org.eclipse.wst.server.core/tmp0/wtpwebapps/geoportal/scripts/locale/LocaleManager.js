/* 
 * REF:
 * http://stackoverflow.com/questions/7694501/class-static-method-in-javascript
 */

/**
 * Class LocaleManager.
 * Sets the locale and gets a localized version of the messages
 */
function LocaleManager() {
};

LocaleManager.getDateFormat = function() {
	//JQuery date picker
	return "dd-mm-yy";
};


/**
 * Default locale is ES
 */
LocaleManager.locale = "es";

/**
 * Sets the locale
 */
LocaleManager.setLocale = function(language) {
	LocaleManager.locale = language;
};

/**
 * Gets the locale
 */
LocaleManager.getCurrentLocale = function() {
	return LocaleManager.locale;
};

/**
 * Gets the localized version of the message
 */
LocaleManager.getKey = function(key) {
	if (LocaleManager.locale === "en") {
		return LANG_EN[key];
	} else if (LocaleManager.locale === "es") {
		return LANG_ES[key];
	}
};

/**
 * 
 * @param lang
 * @returns
 */
LocaleManager.refreshLocale = function() {
	var localizedElements = $(".localizedElement");
	if (localizedElements.length == 0) {
		return null;
	}
	$.each(localizedElements, function(key, val) {
		var element = $(val);
		LocaleManager.refreshLocalizedElement(element);
	});
};

/**
 * 
 * @param lang
 * @returns
 */
LocaleManager.refreshLocalizedElement = function(element) {
	var localeKey = element.data("locale_key");
	var localeRef = element.data("locale_ref");
	
	var localizedString = LocaleManager.getKey(localeKey);
	
	if (localeRef === "text") {
		if (element.is("button") && element.is(':data(uiButton)')) {
			//Jquery button.
			element.button("option", "label", localizedString);
		}
		else {
			element.text(localizedString);
		}
	}
	else if (localeRef === "title") {
		element.attr("title", localizedString);
	}
	else if (localeRef === "text_title") {
		element.text(localizedString);
		element.attr("title", localizedString);
	}
};