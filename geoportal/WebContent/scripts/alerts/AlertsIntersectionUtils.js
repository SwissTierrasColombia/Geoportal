/**
 * AlertsIntersectionUtils class
 */
function AlertsIntersectionUtils() {
};


AlertsIntersectionUtils.performDepartmentsIntersection = function(pointGeom, departmentId, callbackFn) {
	if (Utils.isTrue(alerts.intersections.config.department.active)) {
		/*
		 * Test that the inserted point falls inside the selected department...
		 */
		departmentIntersection(pointGeom, departmentId, function(res){
			if (res !== true) {
				// No intersection
				AlertDialog.createOkDefaultDialog(
					LocaleManager.getKey("Advanced_Alerts_FormHeader_Insert"), 
					LocaleManager.getKey("Advanced_Alerts_Intersection_Department_Error")
				);
				return;
			}
			
			callbackFn();
		});	
	}
	else {
		callbackFn();
	}
}; 
