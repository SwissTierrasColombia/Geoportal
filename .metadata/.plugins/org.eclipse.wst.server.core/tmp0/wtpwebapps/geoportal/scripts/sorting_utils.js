var Sorting = {
	refresh: function(target) {
		$(target).sortable("refresh");
	},
	
	enable: function(targets, items, sortEndCallbackFn, direction) {
		$.each(targets, function(index, target){
			Sorting.enableSort(target, items, sortEndCallbackFn, direction);
		});
		return;
	},
	
	enableSort: function(target, items, sortEndCallbackFn, direction) {
		$(target).sortable({
			placeholder: "ui-state-targetsort",
			helper:'clone',
			items: items,			
			sort: function(event, ui) {
				if(!ui.item.data('tag') && !ui.item.data('handle')) {
		            ui.item.data('tag', true);
		            //ui.item.fadeTo(400, 0.1);
					return;
		        }
			},
			stop: function(event, ui) {
				var item = ui.item;
				var newIndex = ui.item.index() + 1;
				if (!Utils.isNullOrUndefined(sortEndCallbackFn)) {
					sortEndCallbackFn(item, newIndex);
				}
			}
		});
		
		if(direction) {
			$(target).sortable("option", "axis", direction);
		}
		
		$(target).disableSelection();
		return;
	}
};