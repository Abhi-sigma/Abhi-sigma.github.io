
 //initialPositionX variable keeps track of how far is the grid form the window
// left edge and adds 6.5px that is the wooden margin of the board.

    var initialPositionX=parseInt($(".grid").position().left+6.5);
    var initialPosition={"x":initialPositionX,"y":535}
	var currentPosition={"x":0,"y":0}
	var directionReversed=false;
	var stepsLength=55;
	var boardStart=$(".grid").position().left+6.5
	var boardEnd=boardStart+$(".grid").width()-43.5;
	var firstMove=true;

	// initialise the player on the current position on board

    var player = document.querySelector(".player-avatar");
    var button=document.getElementById("roll-button");
    var reset_button=document.getElementById("reset-button");
    button.addEventListener("click",selectDiceFace);
    reset_button.addEventListener("click",reset);


    player.style.left = initialPosition.x-55+"px";
    player.style.top = initialPosition.y+"px";
    gameStart = false;


    function reset(){
    	gameStart = false;
    	currentPosition={"x":0,"y":0};
    	directionReversed=false;
    	firstMove=true;
    	initialPosition={"x":initialPositionX,"y":535};
    	player.style.left = initialPosition.x-55+"px";
        player.style.top = initialPosition.y+"px";


    }
      //initialise the player in its position


	function selectDiceFace(args){
		// initialise all the dice face to display:none
		// this makes sure all the dice face are not displayed by default
		// even if they appeared in previous rolls
		// console.log(event);
		// event.stopPropagation()
		var button=document.querySelectorAll(".roll-button")[0];
		button.style.display="none";
		var elementArray=document.querySelectorAll(".side-pic");
		elementArray.forEach(function(element){
			element.style.display="none"
		});

		if(typeof(args)===typeof(1)){
			var randomSelect=parseInt(args);
			console.log(typeof(randomSelect));
		}
		else{
			var randomSelect =Math.floor(Math.random()*7);
		}
	    // if block to avoid fail cases when roll results in 0
	    if (randomSelect>0){
			var visibleFace = elementArray[randomSelect-1];
		}

		else{
			var visibleFace = elementArray[randomSelect];
		}

	    if((visibleFace.dataset.dice == 1 || visibleFace.dataset.dice == 6) && gameStart === false){
	    	gameStart = true;
	    	player.style.left = initialPositionX+"px";
	    	firstMove = true;
	    	animateDice(visibleFace,visibleFace.dataset.dice);
	    	return
	    }
	    if(gameStart === false){
	    	animateDice(visibleFace,visibleFace.dataset.dice);
	    	return;
	    }
	    if(gameStart === true){
	    	animateDice(visibleFace,visibleFace.dataset.dice);
	    	return;
	    }
	}

	function animateDice(visibleFace,dicevalue){
		var animatingDice = document.querySelectorAll(".cube")[0];
		animatingDice.classList.add("cube-animation");
		var button=document.querySelectorAll(".roll-button")[0];
		console.log(dicevalue);
		// counter=0;
		var animationend=function(){
			if (event.animationName == "roll-dice" &&
               event.type.toLowerCase().indexOf("animationend") >= 0){
               // counter++
               // console.log(counter);
               console.log(visibleFace);
			   visibleFace.style.display="block";
			   button.style.display="block";
			   animatingDice.classList.remove("cube-animation");
			   console.log("animation fired");
			   if(gameStart === true && firstMove === true ){
			   	 firstMove=false;
			   	 animatingDice.removeEventListener("animationend",animationend);
			   	 return
			   	}
			   if(gameStart === true){
			   	  	movePlayer(parseInt(dicevalue));
			   	  	animatingDice.removeEventListener("animationend",animationend);
			   	  	return
			   	}
			    if(gameStart === false ){
	    	      console.log("Try again");
	    	       animatingDice.removeEventListener("animationend",animationend);
	    	      return

			   	};

			}
		 }
		 animatingDice.addEventListener("animationend",animationend);
		 }


	function movePlayer(steps){
		var player = document.querySelector(".player-avatar");
		console.log(+currentPosition.x+(55*steps));
		if(TopRowCheck(steps)){
			return
		};
		if(currentPosition.x+stepsLength*steps<boardEnd && directionReversed === false){
			player.style.left=+getPosition().x+(stepsLength*steps)+"px" ;
			player.style.top=getPosition().y+(0*steps)+"px" ;
			updatePosition(player.style.left,player.style.top);
			checkSnakesLadder();
			console.log("not reversed")
			return
		}
		else  {
			if(directionReversed == true){

                //on top row


				if(+currentPosition.x-(stepsLength*steps)>=initialPositionX){
					player.style.left=+getPosition().x-(55*steps)+"px" ;
					player.style.top=getPosition().y+(0*steps)+"px" ;
					updatePosition(player.style.left,player.style.top);
					checkSnakesLadder();
					console.log("reversed")
					return
				}
				else{
					directionReversed=false;
					player.style.left=initialPositionX+"px"
					var stepsTaken=Math.round((currentPosition.x - initialPositionX)/stepsLength);
					// the player.style.left calculates the position from left edge
					// so we need to sustract one so that we dont calculate the individual box
					// that the player is in.
			        var stepsLeft=+steps-stepsTaken;
			        player.style.top=(initialPosition.y-55)+"px";
			        updatePosition(initialPositionX+"px",player.style.top);
			        checkSnakesLadder();
			        console.log("reversing the reversed")
			        if(stepsLeft <=1){

			        }
			        else{
			        	// same logic here
			        	player.style.left=boardStart+stepsLength*+(stepsLeft-1)+"px";
			        	updatePosition(player.style.left,player.style.top);
			        	checkSnakesLadder();
			        	console.log("reversing the reversed else block")
			        	return

			        }
			        return
				}

			}
			//first time a direction change occurs
			else {
			directionReversed = true;
			var stepsTaken=Math.round((boardEnd-currentPosition.x)/stepsLength);
			var stepsLeft=+steps-stepsTaken;
			player.style.left= boardEnd+"px";
			player.style.top=(initialPosition.y-55)+"px";
			updatePosition(player.style.left,player.style.top);
			checkSnakesLadder();
			console.log("initial reversed");
			if(stepsLeft <= 1){
				player.style.left = boardEnd+"px";
					return
			        }
			        else{
			        	// the player doesnt count the box from where it is moving but
			        	// when the direction reverses, move to top denotes one step so we substract one from the stepsleft
			        	player.style.left=boardEnd- stepsLength*(stepsLeft-1)+"px";
			        	updatePosition(player.style.left,player.style.top);
			        	checkSnakesLadder();
			        	console.log("initial reversed else block");
			        	return

			        }
			}


		}
	}



	function getPosition(){
		return initialPosition

	}

	function updatePosition(left,bottom){
		console.log(arguments);
		var pos = getPosition();
		pos.x=parseInt(left.split("px")[0]);
		pos.y=parseInt(bottom.split("px")[0]);
		currentPosition=pos;
		// console.log(currentPosition);

	}

	function snakeLadder(){
		var rowId=535%getPosition().y;
		var columnId=(getPosition().x-126)/55
		return {
			row:rowId,
			col:columnId

		}
	}

	// function isTopRow(){
	// 	if(currentPosition.y==)

	// }

	//for each move calculate the row
	// check currentposition.x and y
	// check if equal
	// execute elevation and direction
	// updateposition

	function findRow(){
		var row = 535-currentPosition.y
		return row/55
			}

	var snakesAndLadder = {
		0:{pos:[{x: parseInt(initialPositionX+55*7), y: 535,elevation:2,direction:-2}]},
		2:{pos:[{x: parseInt(initialPositionX) , y: 425,elevation:6,direction:1}]},
		4:{pos:[
			{x: parseInt(initialPositionX+55*2), y: 315,elevation:3,direction:1},
			{x: parseInt(initialPositionX+55*3), y: 315,elevation:-2,direction:-2},
		    {x: parseInt(initialPositionX+55*5) , y: 315,elevation:-4,direction:-1},
		    {x: parseInt(initialPositionX+55*7) , y: 315,elevation:-4,direction:1},
		    {x: parseInt(initialPositionX+55*9 ) , y: 315,elevation:5,direction:0}

		    ]},
		5:{pos:[


			  {x: parseInt(initialPositionX+55*5)  , y: 260,elevation:-5,direction:1},
			  {x: parseInt(initialPositionX+55*6)  , y: 260,elevation:4,direction:1},
			  {x: parseInt(initialPositionX+55*8) , y: 260,elevation:-4,direction:1},
			  {x: parseInt(initialPositionX+55*1) , y: 260,elevation:-4,direction:2},
		  ]},
		 6:{pos:[
			  {x: parseInt(initialPositionX+55*1)  , y: 205,elevation:3,direction:3},
			  {x: parseInt(initialPositionX+55*3) , y: 205,elevation:-3,direction:1},
			  {x: parseInt(initialPositionX+55*5)  , y: 205,elevation:2,direction:1},
			  {x: parseInt(initialPositionX+55*8)  , y: 205,elevation:-3,direction:1},
		  ]},
		 7:{pos:[
		    {x: parseInt(initialPositionX+55*0) , y: 150,elevation:2,direction:0},
		    {x: parseInt(initialPositionX+55*7)  , y: 150,elevation:-7,direction:-7}
		  ]},
		 8:{pos:[
		    {x: parseInt(initialPositionX+55*2) , y: 95,elevation:-7,direction:-1},
		  ]},
		 9:{pos:[
		    {x: parseInt(initialPositionX+55*2) , y: 40,elevation:-7,direction:5},
		    {x: parseInt(initialPositionX+55*5) , y: 40,elevation:-7,direction:-2},
		    {x: parseInt(initialPositionX+55*8) , y: 40,elevation:-4,direction:1}
		  ]},





	}

	function checkSnakesLadder(){
		// run this function after 2 secs
		// update position so that you can check direction
		updatePosition(player.style.left,player.style.top);
		TopRowCheck();
		setTimeout(function(){
		var row=findRow();
		if(snakesAndLadder.hasOwnProperty(row)){
			snakesAndLadder[row].pos.forEach(function(item){
			if((item.x >= currentPosition.x-1 && item.x < currentPosition.x+1) &&
				(item.y >= currentPosition.y-1 && item.y < currentPosition.y+1)){
				player.style.top = (currentPosition.y - stepsLength * item.elevation )+"px";
			    player.style.left = (currentPosition.x + stepsLength  * item.direction) + "px";
			    updatePosition(player.style.left,player.style.top);
			    if(findRow()%2==0){
			    	directionReversed=false;
			    }
			    else{
			    	directionReversed=true;
			    }
			}
		})

		}

		},2000)

	}

	function TopRowCheck(steps){
		if(currentPosition.y<60){
			if(currentPosition.x <= initialPositionX+1 &&
				currentPosition.x >= initialPositionX+1){
				alert("home");
				reset();

			}
			if(currentPosition.x>initialPositionX){
				player.style.left=+getPosition().x-(55*steps)+"px";
				updatePosition(player.style.left,player.style.top);
				checkSnakesLadder();
				if(currentPosition.x <= initialPositionX+1 &&
				currentPosition.x >= initialPositionX+1){
					player.style.left=initialPositionX+"px";
					alert("home");
					reset();
				}
				updatePosition(player.style.left,player.style.top);
				checkSnakesLadder();
				return true
			}

					}
	}