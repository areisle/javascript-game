//# of ingredients needed for dish = 7
// let person "carry" up to 10 ingredients --this number will likely change later
// store type and states of items in bag
/* session storage like a dictionary, 
but only numbers or string so wil have to parse data stored 
-- store as json and use JSON.parse(localStorage.getItem("key")) to retrieve
		and localStorage.setItem( "objectname", JSON.stringify(object)) to store */
// if not using ajax, items bag will need to be reloaded from local storage every time page refreshes

/* creates an ingredient object */
function item(name, state, type, stage) {
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
//list of items that have been collected
var items_collect = [];
/* when item gets collected, create new object for that item, 
and add item to items_collect and have its position correspond to index */





