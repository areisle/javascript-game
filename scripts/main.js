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
        cookingStages = ['soffrito', 'tostatura', 'deglaze', 'cottura', 'mantecatura'],
        currentStage = "raw",
        startTime = "new",
        animationEvent = whichAnimationEvent(),
        $body = $('body'),
        //have different links available based on state of game
        game_state = {"locked": false, "cooking": false},
        $items = $('.items'),
        score = {'cutting':0,'timing':0};
    
    function Ingredient(name, state, cut, stage, time) {
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
        // time at which ingredient should be added
        this.time = time
    }

    function appendItem(item) {
        //append the item --done
        //add ingredient to ingredients_collected
        if (items_collected < 10) {
            // <div class="item ingredient"> ingredient <button class="trash">remove</button></div>
            var $current_item = $('<div class="item ' + $(item).attr('id') + '">' + $(item).attr('id') + '<button class="trash">remove</button></div>'),
                name = $(item).attr('id'),
                state = 0,
                stage = "unknown",
                cut = false,
                time;
            collection_counts[name]++;
            $items.prepend($current_item);
            //add ingredient data
            // check ingredient type cut=true for onions, garlic, mushrooms
            // possible stages - soffrito, tostatura, deglaze, cottura, mantecatura
            switch (name) {
            case "onions":
                cut = true;
                stage = "soffrito";
                time = 6000;
                break;
            case "mushrooms":
                cut = true;
                stage = "soffrito";
                time = 8000;
                break;
            case "garlic":
                cut = true;
                stage = "soffrito";
                time = 12000;
                break;
            case "wine":
                cut = false;
                stage = "deglaze";
                time = 2000;
                break;
            case "parmesan":
                cut = false;
                stage = "mantecatura";
                time = 4000;
                break;
            case "butter":
                cut = false;
                stage = "soffrito";
                time = 4000;
                break;
            case "rice":
                cut = false;
                stage = "tostatura";
                time = 2500;
                break;
            case "stock":
                cut = false;
                stage = "cottura";
                time = 3000;
                break;
            default:
                cut = false;
                break;
            }

            $current_item.data(new Ingredient(name, state, cut, stage, time));
            //increment
            items_collected++;
            console.log($items.find('.item:first-child').data());
        } else {
            //temporary alert -- beautify later
            alert("sorry your bag is full");
        }
        //for debugging
    }
    function getFinalScore() {
        for (var item in collection_counts){
            if (collection_counts[item] < 1){
                return 0;
            }
        }
        var finalScore = (score.cutting + score.timing)/12*100;
        return finalScore;
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
        for (var innard in innards){
            $(".pop-up").append('<p>' + innards[innard]+'</p>');
        }
        for (var button in buttons) {
            $(".pop-up").append('<button class="'+ buttons[button]+'">' + buttons[button] + '</button>');
        }
    }

    function removePopUp (){
        $('.pop-up').remove();
        $('.pop-up-overlay').remove(); 
    }
    $items.sortable({containment: '.items'});
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
    function potView() {
        // first check they have at least one of every ingredient
        //temporary so I can skip collecting ingredients
        if (collectionCheck()){
            //had all ingredients
            //make pop up ask if they're sure
            //try to turn off other navigation while pop-p is up (maybe overlay div that fade in and reset its pointer-events to true or whatever)
            makePopUp(['cooking is very time sensitive, are you sure you\'re ready to proceed?'],['yes','no']);
            $body.on('click', '.pop-up button.yes', function() {
                removePopUp();
                //switch view
                $('#view-wrapper').load('views.html #pot-view', function() {makeDroppable('pot')});
                //add next pop-up
                makePopUp(['drag and drop ingredients to add them to the pot','timing and order matter!', 'add first ingredient to start timer'],['ok']);
                $body.on('click', '.pop-up button.ok', function() {
                    removePopUp();
                    //add next pop-up ---first of the cooking stages
                    //pop-up soffrito
                    //use this to make sure all ingredients get added
                    collection_counts = {"onions": 0,
                             "garlic": 0,
                             "wine": 0,
                             "mushrooms": 0,
                             "rice": 0,
                             "parmesan": 0,
                             "butter": 0,
                             "stock": 0}
                    popUpLoop();
                });
            });
            $body.on('click', '.pop-up button.no', function() {
                removePopUp();
                //do nothing
            });
        } else {
            //have pop up saying they still need more ingredients
            makePopUp(['sorry, you still need more ingredients before you begin cooking'],['ok']);
            $body.on('click', '.pop-up button.ok', function() {
                removePopUp();
                //do nothing
            });
        }
        
    }

    function popUpLoop () {
        //base case
        console.log("pop-up-loop called");
        if (cookingStages.length === 0) {
            console.log("ended");
            //end of game stuff
            var score = getFinalScore();
            var message = ["the game is over!", "score: " + score + "%"];
            if (score === 0) {
                message.push("looks like you forgot to add something...");
            }
            makePopUp(message,['ok']);
            $body.one('click', '.pop-up button.ok', function(e) {
                removePopUp();
                //go to end of game screen
            });
            return;
        } else {
            var copy;
            //toggle for animation to make it restart
            if (((cookingStages.length) % 2) === 0) {
                copy = 0;
            } else {
                copy = 1;
            }
            console.log(cookingStages[0]);
            currentStage = cookingStages[0];
            makePopUp([cookingStages.shift()],['start']);
            
            $body.one('click', '.pop-up button.start', function(e) {
                removePopUp();
               //set up timer
                var $pie = $('.pie-timer circle');
                startTime = new Date().getTime();
                $pie.css({'animation-play-state':'running'});
                //trigger next pop-up on timer end
                $body.one(animationEvent, '.pie-timer circle', function(){
                    //reset animation -- trigger reflow by changing animation name
                    $pie.css('animation-play-state','paused');
                    if (copy===1) {
                       $pie.css('animation', 'flash-and-fill-copy 5s linear'); 
                   } else {
                        $pie.css('animation', 'flash-and-fill 5s linear');
                   }
                    $pie.css('animation-play-state','paused');
                    console.log("animation end");
                    popUpLoop();
                }); 
            });
        }
    }

    function navigate(href) {
        "use strict";
        var $view = $('#view-wrapper');
        var view_name = href.substring(1);
        if (view_name === "pot") {
            potView();
        } else {
            $view.load('views.html ' + href + '-view', function() {makeDroppable(view_name)});
        }
    }

    /* -----------------------

      cutting board - making droppable, checking cut type etc.

      -------------------------*/
    function makeDroppable(view_name) {
        $items.sortable('option','containment','.items');
        if (view_name === 'cutting-board') {
            $items.sortable('option','containment','window');
            $('.cut.julienne')
                .data({"cut": 1})
                .droppable({
                    accept: checkCut,
                    drop: handleDropEvent,
                    hoverClass: 'drop-hover',
                    tolerance: 'pointer'
              });
            $('.cut.brunoisette')
                .data({"cut": 3})
                .droppable({
                    accept: checkCut,
                    drop: handleDropEvent,
                    hoverClass: 'drop-hover',
                    tolerance: 'pointer'
              });
            $('.cut.brunoise')
                .data({"cut": 2})
                .droppable({
                    accept: checkCut,
                    drop: handleDropEvent,
                    hoverClass: 'drop-hover',
                    tolerance: 'pointer'
              });

        } else if (view_name==="pot") {
            $items.sortable('option','containment','window');
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

    //occurs when item is dropped on cutting board
    function handleDropEvent(event, ui) {
      //ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
      console.log("item state: " + ui.draggable.data("state") + ", cut state: " + $(this).data("cut"));
      //console.log("ui: " + event.data("name"));
        var cut = $(this).data("cut");
      //ui.draggable.append("<p>cut type: " + cut +"</p>");
      ui.draggable.data("state", cut);
        ui.draggable.css('background-position', 33.3*cut + '%');
    }

    function handleCookingDropEvent(event, ui) {
        //once item is added, remove istead of revert
        //have counter checking num added so far
        var timeDropped = new Date().getTime() -startTime;
        updateScore(ui.draggable,timeDropped);
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
    
    function updateScore(item, time) {
        //check stage
        console.log(currentStage);
        switch(currentStage) {
            case 'soffrito':
                if ($(item).data().name === 'onions') {
                    //onion added
                    console.log('onion added');
                    if ($(item).data().state === 2){
                        //full points on cut
                        score.cutting += 1;
                    }
                    
                } else if ($(item).data().name === 'garlic') {
                    //garlic added
                    console.log('garic added');
                    if ($(item).data().state === 3){
                        //full points on cut
                        score.cutting += 1;
                    }
                } else if ($(item).data().name === 'mushrooms') {
                    //mushrooms added
                    console.log('mushroom added');
                    if ($(item).data().state === 1){
                        //full points on cut
                        score.cutting += 1;
                    }
                } else if ($(item).data().name === 'butter') {
                    //butter added
                    console.log('butter added');
                }
                break;
            case 'tostatura':
                if ($(item).data().name === 'rice') {
                    //rice added
                }
                break;
            case 'deglaze':
                if ($(item).data().name === 'wine') {
                    //wine added
                }
                break;
            case 'cottura':
                if ($(item).data().name === 'stock') {
                    //stock added
                }
                break;
            case 'mantecatura':
                if ($(item).data().name === 'parmesan') {
                    //parmesan added
                    if ($(item).data('state') === 1) {
                        //parm was grated
                    }
                }
                break;
        }
        if (currentStage === $(item).data().stage) {
            score.cutting += (1 - Math.abs($(item).data().time - time)/15000);
           
        }
        collection_counts[$(item).data().name]++;
        console.log('cutting score: ' + score.cutting);
    }
    
    
});

