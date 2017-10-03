/**
 * AdminUtils class
 */
function AdminUtils() {
};

AdminUtils.getGridIconForBoolean = function(active) {
	if(active)
		//icon = "fa fa-times fa-2x";
		//icon = "fa fa-check-circle fa-2x";
		icon = "fa fa-check-square-o fa-medium";
	else
		//icon = "fa fa-check fa-2x";
		icon = "fa fa-square-o fa-medium";
	
	var iconActive = '<div><i class="'+ icon +'"></i></div>';
	return iconActive;
};