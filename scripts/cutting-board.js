//length of cutting animation if added (in ms), also delay on item revert
var cuttingTime = 1000;
$( init );
function init() {
  $('.item').draggable({
  	containment: 'window',
  	revert: function () {
        $(this).delay(cuttingTime);
        return true
    }
  });
  $('.cut').droppable({
  	accept: '.item',
  	drop: handleDropEvent,
  	hoverClass: 'drop-hover',
  	tolerance: 'pointer'
  });
}
function handleDropEvent(event, ui) {
  ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
  //setTransformOrigin($(this).parent()[0], ui.draggable[0]);
  //ui.draggable.css("transform",'rotateX(45deg)');
  //$(this).parent().
  ui.draggable.html("dropped");
}

function setTransformOrigin(elem_ref, elem_to_set) {
	//assuming transform origin is center bottom -- will make this more general later
	//gets elem_to_set's height and width, and position, and use them to set transform origin wrt ref
	//left= 
	var ref = elem_ref.getBoundingClientRect();
	var set = elem_to_set.getBoundingClientRect();
	var y = (ref.bottom - set.top) / set.height * 100;
	var x = ((ref.left + ref.width /2) - set.left) / set.width * 100;
	$(elem_to_set).css('transform-origin', x + '% ' + y + '%');
}