var DragDrop = {
	enable: function(jQueryStringA, jQueryStringB, fnDrop) {
		this.enableDrag(jQueryStringA, jQueryStringB, false);
		this.enableDrop(jQueryStringA, jQueryStringB, fnDrop);	
	},
	
	enableDrag: function(source, dest) {
/*		itemA = null;
		
		if(isItemA)
			itemA = $(jQueryStringA);
		else
			itemA = $(jQueryStringA + " li");*/
		
		source.draggable({
			//connectTo: dest,
			helper: "clone",
			revert: "invalid"
/*				function(dropped) {
	             var $draggable = $(this),
	                 hasBeenDroppedBefore = $draggable.data('hasBeenDropped'),
	                 wasJustDropped = dropped && dropped[0].id == "droppable";
	             if(wasJustDropped) {
	                 return false;
	             } else {
	                 if (hasBeenDroppedBefore) {
	                     $draggable.animate({ top: 0, left: 0 }, 'fast');
	                     return false;
	                 } else {
	                     return true;
	                 }
	             }
	        }*/
		});
		
		return;
	},
	
	enableDrop: function(dest, accept, classItem) {
		dest.droppable({
			accept: accept,
			activeClass: "ui-state-targetpoint",
			hoverClass: "ui-state-targetactive",
			drop: function( event, ui ) {
				$(ui.draggable).remove();
				var item = $("<div>").attr({"class": classItem}).text($(ui.draggable).text());
				DragDrop.enableDrag($(item));
				$(this).prepend(item);
			}
		});
		
		return 
	}
};