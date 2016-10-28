// list of items
var items_collected = 0;

$items = $('.items');
//add ingredients to bag when clicked on
$('.view').on('click', '.ingredient', function (){
	//append clicked ingredient to items list (opt: if list contains less than 12 items)
	console.log("ingredient " + $(this).attr("id") + " was clicked");
	appendItem(this);
});

//remove an ingredient from bag
$('.items').on('click', '.item .trash',  function (){
	removeItem(this);
});

function appendItem(item) {
	//append the item --done
	//add ingredient to ingredients_collected
	if (items_collected < 10) {
		// <div class="item ingredient"> ingredient <button class="trash">remove</button></div>
		var $current_item = $('<div class="item ' + $(item).attr('id') + '"><button class="trash">remove</button>' + $(item).attr('id') + '</div>');
		$items.append($current_item);
        //add ingredient data
		$current_item.data(new ingredient($(item).attr('id'), 'raw', 'unknown', 'unknown'));
		$current_item.draggable({
            containment: 'window',
            revert:true
        });
		//make item draggable but set to false unless in cutting-board view
		//increment
		items_collected++;
	} else {
		//temporary alert -- beautify later
		alert("sorry your bag is full");
	}
	//for debugging
	console.log($items.find('.item:last-child').data());
}

function removeItem(item) {
	//remove the item --done
	//remove ingredient to ingredients_collected
	console.log("trashing ingredient");
	$(item).parent('.item').remove();
	//increment
	items_collected--;
}

function ingredient(name, state, type, stage) {
	//ex. name = "onion"
	this.name = name;
	//ex. type = "cut"
	// may use for other thing eventually
	this.type = type;
	// the stage in cooking when this ingredient should be added (likely expressed as a time)
	this.stage = stage;
	// state of the ingredient
	// 0 if raw
	// 1-4 for the different cuts
	// have 1 be largest and 4 smallest
	this.state = state;
}

