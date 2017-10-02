var LoadingPanel = function(obj, text, isModal) {
	
	this._obj = obj;
	this._text = text;
	this._isModal = isModal;
	
	this.CLASS_WHITE = "loading-container-white";
	this.CLASS_NO_WHITE = "loading-container";
	
	//Restituisce l'oggetto Jquery con immagine loading
	this.getLoading = function() {
		var text = this._text;
		
		var span = $("<span class='loading-span'>");
		
		var loading = $("<div>").attr("class", this.CLASS_WHITE).append(
				$("<div>").attr("class", "loading").append(
						$("<div>").attr("class", "txt-container").append(span,
								$("<span class='loading-text'>").text(text)),
						$("<div>").attr("class", "img-container").append(span,
								$("<img>").attr("src", "images/loading2.gif"))));

		return loading;
	};
	
	// Aggiunge l'oggetto loading all'elemento obj
	this.addLoading = function() {
		/*
		 * if(!text) text = "";
		 */

		if (Utils.isTrue(this._isModal)) {
			if (this._obj.find(".loading").length > 0)
				this.removeLoading();
			var lp = this.getLoading();
			this._obj.prepend(lp);	
		}
		else {
			this._obj.hide();
			var lp = this.getLoading();
			this._obj.before(lp);
		}
	};

	// Rimuove l'oggetto loading dall'elemento obj
	this.removeLoading = function() {
		
		if (Utils.isTrue(this._isModal)) { 
			this._obj.find(".loading-container-white").remove();	
		}
		else {
			var lp = this._obj.siblings(".loading-container-white");
			lp.remove();
			this._obj.show();		
		}
	};
};

var loadingDialog = {
	instance: null,
	panel: null,
	
	init: function() {
		if(this.panel == null) {
			this.panel = $("#loading-panel");
		}
		if(this.instance == null) {
			this.instance = this.panel.dialog({
				autoOpen: false,
				dialogClass: "loading-dialog-panel",
				closeOnEscape: false,
				draggable: false,
		        width: 200,
		        minHeight: 100,
		        modal: true,
		        buttons: {},
		        resizable: false,
		        open: function() {
		            // scrollbar fix for IE
		            $('body').css('overflow','hidden');
		        },
		        close: function() {
		            // reset overflow
		            $('body').css('overflow','auto');
		        }
			});
		}	
	},

	open: function(title, msg) {
		this.init();
		var image = $("<div>").attr({"class": "image-loading"}).append(
			$("<img>").attr({"src": "images/loading2.gif" })
		);
		var text = $("<div>").attr({"class": "text-loading"}).text(msg);
		
		var content = $("<div>").attr({"class": "loading-content"}).append(
			text,
			image			
		);
		
		this.panel.html(content);
		this.panel.dialog("option", "title", title);
		this.panel.dialog("open");
	},
	
	close: function() {
		if(this.instance != null) 
			this.panel.dialog("close");
	}
};

var loadingImage = function(panel, stat) {
	if(!stat) {
		panel.find(".image-loading-panel").remove();
	}
	else {
		if(panel) {
			var imgLoading = $("<div>").attr({"class": "image-loading-panel"}).append(
				$("<img>").attr({"src": "images/loading2.gif" })
			);
			
			panel.append(imgLoading);
		}
	}
};