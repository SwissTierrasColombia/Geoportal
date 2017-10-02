jQuery.extend(jQuery.validator.messages, {
    required: "Validator_General_Message_Required",
    remote: "Please fix this field.",
    email: "Validator_General_Message_Email",
    url: "Please enter a valid URL.",
    date: "Please enter a valid date.",
    dateISO: "Please enter a valid date (ISO).",
    number: "Please enter a valid number.",
    digits: "Please enter only digits.",
    creditcard: "Please enter a valid credit card number.",
    equalTo: "Please enter the same value again.",
    accept: "Please enter a value with a valid extension.",
    maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
    minlength: jQuery.validator.format("Please enter at least {0} characters."),
    rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
    range: jQuery.validator.format("Please enter a value between {0} and {1}."),
    max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
    min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
});

var Validate = function(config) {
	var self = this;
	
	this.config = config;
	this.form = config.form;
	
	this.validator = null;
	
	this.activate = function() {
		this.validator = this.form.validate({
			messages: this.messages,
			errorClass: "validationErrorClass",
			highlight: function(element, errorClass) {
				$(element).addClass(errorClass);
			},
			unhighlight: function(element, errorClass, validClass) {
				$(element).removeClass(errorClass);
			},
			errorPlacement: function(error, element) {
				var msgKey = $(error[0]).text();
				self._removeButtonErrorValidate(element.parent().find(".btn-validate-error"));
				
				var pos = null;
				if(element.height() > 20) {
					pos = -(element.height() / 2);
				}
				var btnError = self._buildButtonErrorValidate(msgKey, pos);
				element.after(btnError);
				Utils.enableTooltip();	
			}
		});
	};
	
	this._removeButtonErrorValidate = function(btn) {
		btn.remove();
		return;
	};
	
	this._buildButtonErrorValidate = function(msgKey, pos) {
		var button = $("<span>").attr({"class": "btn-validate-error localizedElement"})
			.data({
				"locale_key": msgKey,
				"locale_ref": "title"
			});
		button.append(
			$("<i>").attr({"class": "fa fa-exclamation-triangle"})
		);
		
		if(pos)
			button.css({top: pos});
		
		return button;
	};
	
	this.valid = function() {
		return this.form.valid();
	};
	
	this.reset = function (){
		//Remove error class
		this.form.find(".validationErrorClass").removeClass("validationErrorClass");
		
		//Remove span
		this.form.find(".btn-validate-error").remove();
	};
	
	this.activate();
	
};