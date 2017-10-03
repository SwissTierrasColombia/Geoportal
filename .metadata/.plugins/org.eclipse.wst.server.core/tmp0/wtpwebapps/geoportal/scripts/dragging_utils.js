var DragUtils = {
	divClass: "drag-secure",
	activeClass: "drag-enable",
	
	buildDraggingPanel: function() {
		return $("<div>").attr("class", this.divClass);
	},
	
	addDragPanel: function(dialog) {
		dialog.closest(".ui-dialog").append(this.buildDraggingPanel());
	},
	
	enable: function(dialog) {
		if(dialog.closest(".ui-dialog").find("." + this.divClass).length === 0 )
			this.addDragPanel(dialog);
		
		dialog.closest(".ui-dialog").find("." + this.divClass).addClass(this.activeClass);
	},
	
	disable: function(dialog) {
		dialog.closest(".ui-dialog").find("." + this.divClass).removeClass(this.activeClass);
	}
};