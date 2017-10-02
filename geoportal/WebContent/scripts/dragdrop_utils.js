var DragDrop = {
	enable: function(dragdropOptions) {
		this.enableDrag(dragdropOptions.direction1.source);
		this.enableDrop(
			dragdropOptions.direction1.dest, 
			dragdropOptions.direction1.acceptDrop, 
			dragdropOptions.direction1.onDrop, 
			dragdropOptions.direction1.onDropCheck,
			dragdropOptions.direction1.okCheck,
			dragdropOptions.direction1.koCheck		
		);
		
		if(dragdropOptions.hasOwnProperty("direction2")) {
			this.enableDrag(dragdropOptions.direction2.source);
			this.enableDrop(
				dragdropOptions.direction2.dest, 
				dragdropOptions.direction2.acceptDrop, 
				dragdropOptions.direction2.onDrop,
				dragdropOptions.direction2.onDropCheck,
				dragdropOptions.direction2.okCheck,
				dragdropOptions.direction2.koCheck				
			);
		}
	},
	
	enableDrag: function(source, dest) {	
		source.draggable({
			helper: "clone",
			revert: "invalid",
			scroll: false
		});
	},
	
	enableDrop: function(dest, accept, fnCreateDroppedItem, fnCheck, fnCheckOk, fnCheckKo) {
		dest.droppable({
			accept: accept,
			activeClass: "ui-state-targetpoint",
			hoverClass: "ui-state-targetactive",
			drop: function( event, ui ) {
				// if item has been dropped in the same origin panel retrun
				if ( $(this).find($(ui.draggable)).length > 0 )
					return true;
				
				var curTarget = $( this );
				var item = fnCreateDroppedItem( event, ui );
				
				if ( fnCheck ) {
					var params = {
						sourceItem: $(ui.draggable),
						destItem: item,
						destPanel: curTarget						
					};
					
					// Exec function callback on dropped item
					fnCheck(function(response){
						$(ui.draggable).remove();
						DragDrop.enableDrag($(item));
						curTarget.append(item);
						if ( fnCheckOk )
							fnCheckOk(response);
					}, function(response){
						if ( fnCheckKo )
							fnCheckKo(response);
					}, params);					
				}
			}
		});
	}
};