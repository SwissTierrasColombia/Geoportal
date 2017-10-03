/**
 * UserPermission class
 */
function UserPermission(userPermission){
	this.userPermission = userPermission;
};

/**
 * Check if the current user has the permission
 */
UserPermission.prototype.hasPermission = function(permission) {
	if (!Utils.isNullOrUndefined(this.userPermission)) {
		for (var j=0; j < this.userPermission.permissions.length; j++) {
			if (this.userPermission.permissions[j] === permission)
				return true;
		}	
	}
	return false;
};
