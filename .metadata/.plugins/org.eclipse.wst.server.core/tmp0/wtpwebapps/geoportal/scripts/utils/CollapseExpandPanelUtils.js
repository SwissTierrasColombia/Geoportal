/**
 * CollapseExpandPanelUtils.js class
 */
function CollapseExpandPanelUtils() {
};

CollapseExpandPanelUtils.expandPanel = function(parent, header, panelToExpand, height) {
	//To show it
	parent.removeClass("collapsed");
	header.find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	panelToExpand.show();
	
	var heightInPx = "300px";
	if (!Utils.isNullOrUndefined(height)) {
		heightInPx = height;
	}
	
	parent.animate({
		height: heightInPx
	}, 100);
};

CollapseExpandPanelUtils.collapsePanel = function(parent, header, panelToCollapse) {
	//To hide it
	parent.addClass("collapsed");
	header.find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
	panelToCollapse.hide();
	
	parent.animate({
		height: "20px"
	}, 100);
};