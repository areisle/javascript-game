// list of items
var items_collected = 0;

$items = $('.items');
$items.sortable({connectWith: ".cut"});
//add ingredients to bag when clicked on
$('.wrapper').on('click', '.ingredient', function (){
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
		//increment
		items_collected++;
		console.log($items.find('.item:last-child').data());
	} else {
		//temporary alert -- beautify later
		alert("sorry your bag is full");
	}
	//for debugging
	
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


/* -----------------------

  navigation-- view swapping -

  -------------------------*/

//swap view div depending on href of clicked link
//1. get href/ prevent default
//2. get view div and use replaceWith?
$('.wrapper').on('click', '.nav', function (e){
	e.preventDefault();
	var href = $(this).attr('href');
	navigate(href);
	console.log(href + " nav link was clicked");
});

function navigate(href) {
	//get view element
	//try doing this by having the id match the href?
	var $view = $('#view-wrapper');
	var view_name = href.substring(1);
	$view.load('views.html ' + href + '-view', function() {makeDroppable(view_name)});
	//handle adding droppable if view=cutting-board
	
	console.log('href: '+href+', $view: '+$view+', view_name: '+view_name);
}
function makeDroppable(view_name) {
    console.log("function droppable called");
    if (view_name === 'cutting-board') {
        console.log("cut: "+ $(".cut"));
        $('.cut').droppable({
            accept: '.item',
            drop: handleDropEvent,
            hoverClass: 'drop-hover',
            tolerance: 'pointer'
          });
        function handleDropEvent(event, ui) {
          ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
          //setTransformOrigin($(this).parent()[0], ui.draggable[0]);
          //ui.draggable.css("transform",'rotateX(45deg)');
          //$(this).parent().
          ui.draggable.html("dropped");
        }
    }
}
