/*global $, console, alert*/
$(document).ready(function () {
    // list of items
    "use strict";
    var items_collected = 0,
        collection_counts = {"onions": 0,
                             "garlic": 0,
                             "wine": 0,
                             "mushrooms": 0,
                             "rice": 0,
                             "parmesan": 0,
                             "butter": 0,
                             "stock": 0},
        cookingStages = ['soffrito', 'tosturato', 'deglaze'],
        startTime = "new",
        animationEvent = whichAnimationEvent(),
        $body = $('body'),
    //have different links available based on state of game
        game_state = {"locked": false, "cooking": false},
        $items = $('.items');
    function Ingredient(name, state, cut, stage) {
        //ex. name = "onion"
        this.name = name;
        //ex. type = "cut"
        // may use for other thing eventually
        this.cut = cut;
        // the stage in cooking when this ingredient should be added (likely expressed as a time)
        this.stage = stage;
        // state of the ingredient
        // 0 if raw
        // 1-4 for the different cuts
        // have 1 be largest and 4 smallest
        this.state = state;
    }
    function appendItem(item) {
        //append the item --done
        //add ingredient to ingredients_collected
        if (items_collected < 10) {
            // <div class="item ingredient"> ingredient <button class="trash">remove</button></div>
            var $current_item = $('<div class="item ' + $(item).attr('id') + '"><button class="trash">remove</button>' + $(item).attr('id') + '</div>'),
                name = $(item).attr('id'),
                state = 0,
                stage = "unknown",
                cut = false;
            collection_counts[name]++;
            $items.append($current_item);
            //add ingredient data
            // check ingredient type cut=true for onions, garlic, mushrooms
            // possible stages - soffrito, tostatura, deglaze, cottura, mantecatura
            switch (name) {
            case "onions":
                cut = true;
                stage = "soffrito";
                break;
            case "mushrooms":
                cut = true;
                stage = "soffrito";
                break;
            case "garlic":
                cut = true;
                stage = "soffrito";
                break;
            case "wine":
                cut = false;
                stage = "deglaze";
                break;
            case "parmesan":
                cut = false;
                stage = "mantecatura";
                break;
            case "butter":
                cut = false;
                stage = "soffrito";
                break;
            case "rice":
                cut = false;
                stage = "tostatura";
                break;
            case "stock":
                cut = false;
                stage = "cottura";
                break;
            default:
                cut = false;
                break;
            }

            $current_item.data(new Ingredient(name, state, cut, stage));
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
        var name = $(item).parent('.item').data("name");
        collection_counts[name]--;
        $(item).parent('.item').remove();
        //increment
        items_collected--;
    }
    function collectionCheck() {
        for (var item in collection_counts ) {
            if (collection_counts[item] < 1) {
                return false;
            }
        }
        return true;
    }
    function makePopUp (innards, buttons) {
        $body.append('<div class="pop-up"></div>');
        $body.append('<div class="pop-up-overlay"></div>');
        for (var innard in innards) {
            $(".pop-up").append('<p>' + innards[innard] + '</p>');
        }
        for (var button in buttons) {
            $(".pop-up").append('<button class="' + buttons[button] + '">' + buttons[button] + '</button>');
        }
    }
    function removePopUp (){
        $('.pop-up').remove();
        $('.pop-up-overlay').remove(); 
    }
    $items.sortable();
    //add ingredients to bag when clicked on
    $('.wrapper').on('click', '.ingredient', function () {
        //append clicked ingredient to items list (opt: if list contains less than 12 items)
        //console.log("ingredient " + $(this).attr("id") + " was clicked");
        appendItem(this);
    });

    //remove an ingredient from bag
    $('.items').on('click', '.item .trash',  function () {
        removeItem(this);
    });

    
    /* -----------------------

      navigation-- view swapping -

      -------------------------*/

    //swap view div depending on href of clicked link
    //1. get href/ prevent default
    //2. get view div 
    $('.wrapper').on('click', '.nav', function (e){
        e.preventDefault();
        var href = $(this).attr('href');
        navigate(href);
        console.log(href + " nav link was clicked");
    });

    function navigate(href) {
        "use strict";
        var $view = $('#view-wrapper');
        var view_name = href.substring(1);
        if (view_name === "pot") {
            // first check they have at least one of every ingredient
            //temporary so I can skip collecting ingredients
            if (true || collectionCheck()){
                //had all ingredients
                //make pop up ask if they're sure
                //try to turn off other navigation while pop-p is up (maybe overlay div that fade in and reset its pointer-events to true or whatever)
                makePopUp(['cooking is very time sensitive, are you sure you\'re ready to proceed?'],['yes','no'])
                //if yes, load view, add second explanatory pop-up and remove first one
                $body.on('click', '.pop-up button.yes', function() {
                    console.log("clicked yes");
                    $view.load('views.html ' + href + '-view', function() {makeDroppable(view_name)});
                    $body.on(animationEvent, '.pie-timer circle', function(){
                        makePopUp([cookingStages.shift()],['start']);
                        //reset animation
                        var $pie = $('.pie-timer circle')
                        //trigger reflow
                        $pie.removeClass('run-timer');
                        $pie.width() = $pie.width();
                        $pie.removeClass('run-timer');
                        console.log('animation ended');
                    });
                    $('.pop-up').remove();
                    $('.pop-up-overlay').remove();
                    makePopUp(['drag and drop ingredients to add them to the pot','timing and order matter!', 'add first ingredient to start timer'],['ok']);
                    $body.on('click', '.pop-up button.ok', function() {
                        //start timer and remove popup
                        removePopUp();
                        makePopUp([cookingStages.shift()],['start']); 
                        $body.on('click', '.pop-up button.start', function() {
                            //start timer and remove popup
                            removePopUp();
                            console.log('pop-up-start');
                            $('.pie-timer circle').css({'animation-play-state':'running'});
                        });
                    });
                });
                // if no, remove pop-up and do nothing
                $body.on('click', '.pop-up button.no', function() {
                    console.log("clicked no");
                    removePopUp();
                });
                return;
            } else {
                //have pop up saying they still need more ingredients
                makePopUp(['sorry, you still need more ingredients before you begin cooking'],['ok']);
                $body.on('click', '.pop-up button.ok', function() {
                    console.log("clicked no");
                    $('.pop-up').remove();
                    $('.pop-up-overlay').remove();
                });
                return;
            }
            //then if they do, pop up asking if they wish to proceed

        }
        $view.load('views.html ' + href + '-view', function() {makeDroppable(view_name)});

    }

    /* -----------------------

      cutting board - making droppable, checking cut type etc.

      -------------------------*/
    function makeDroppable(view_name) {
        if (view_name === 'cutting-board') {
            $('.cut.julienne')
                .data({"cut": 2})
                .droppable({
                    accept: checkCut,
                    drop: handleDropEvent,
                    hoverClass: 'drop-hover',
                    tolerance: 'pointer'
              });
            $('.cut.brunoisette')
                .data({"cut": 4})
                .droppable({
                    accept: checkCut,
                    drop: handleDropEvent,
                    hoverClass: 'drop-hover',
                    tolerance: 'pointer'
              });
            $('.cut.vichy')
                .data({"cut": 1})
                .droppable({
                    accept: checkCut,
                    drop: handleDropEvent,
                    hoverClass: 'drop-hover',
                    tolerance: 'pointer'
              });
            $('.cut.brunoise')
                .data({"cut": 3})
                .droppable({
                    accept: checkCut,
                    drop: handleDropEvent,
                    hoverClass: 'drop-hover',
                    tolerance: 'pointer'
              });

        } else if (view_name==="pot") {
            //add pot to drop ingredients into
            //conditions for starting cooking --clicked okay, have all ingredients
            $('.pot.cooking').droppable({
                accept: '.item',
                drop: handleCookingDropEvent,
                hoverClass: 'drop-hover',
                tolerance: 'pointer'
              });
        }
    }
    //occurs when item is added to the list
    function handleDropEvent(event, ui) {
      ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
      console.log("item state: " + ui.draggable.data("state") + ", cut state: " + $(this).data("cut"));
      //console.log("ui: " + event.data("name"));
      ui.draggable.append("<p>cut type: " + $(this).data("cut") +"</p>");
      ui.draggable.data("state", $(this).data("cut"));  
    }
    function handleCookingDropEvent(event, ui) {
        console.log("entered handleCookingDropEvent function");
        //once item is added, remove istead of revert
        //have counter checking num added so far
          if(startTime==="new") {
            startTime = new Date().getTime();
          } else {
            var timeDropped = new Date().getTime();
            console.log( "Time difference: " + ( timeDropped- startTime) );
            startTime = timeDropped;
          }
        ui.draggable.remove();
    }
    function checkCut(e) {
        if (e.data("cut") === true && e.data("state") < $(this).data("cut") ) {
            return true;
        } else {
            return false;
        }
    }

    //this part is from https://davidwalsh.name/css-animation-callback
    /* From Modernizr */
    function whichAnimationEvent(){
        var t;
        var el = document.createElement('fakeelement');
        var animations = {
          'animation':'animationend',
          'OAnimation':'oAnimationEnd',
          'MozAnimation':'animationend',
          'WebkitAnimation':'webkitAnimationEnd'
        }

        for(t in animations){
            if( el.style[t] !== undefined ){
                return animations[t];
            }
        }
    }
});

