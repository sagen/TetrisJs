/**
 * @author sagen
 */



var Listeners = function(){


	this.keyUp = function(e){
		var keyID = (window.event) ? event.keyCode : e.keyCode;
		//console.log("Key up");
		var direction = null;
		switch(keyID){
			case 40:
				gpc.downKeyPressed = false;
				if(gpc.state != gpc.STATE_ACTIVE)
					return;
				gamePlay.next(true);
				break;
			case 37:
				direction = config.MOVE_LEFT;
			case 38:
				if(direction == null)
					direction = config.MOVE_ROTATE;
			case 39:
				if(direction == null)
					direction = config.MOVE_RIGHT;
				gpc.moveKeyPressed[direction] = false;
				window.clearTimeout(gpc.movingTimer[direction]);
				break;
		}
	}
	
	this.whileDownKey = function(){
		if(!gpc.downKeyPressed)
			return
		
		if(config.keyDownInterval >= gpc.interval)
			return;
			
			
		var thisRef = this;
		if(gpc.state == gpc.STATE_WAIT_TETRAD){ // sleep waiting for next tetrad
			//console.log("waiting");
			var internalTimer = window.setTimeout(function(){thisRef.whileDownKey();}, 10);
			return;
		}
			
		if(gpc.state != gpc.STATE_ACTIVE)
			return;

			
		
		window.clearTimeout(gpc.timer); // Avoid having 2 timers in same var
	
		gamePlay.next(false)
		gamePlay.skipDown();
		if(gpc.state != gpc.STATE_ACTIVE){
			this.whileDownKey();
			return;
		}
			
			
		gpc.timer = window.setTimeout(function(){thisRef.whileDownKey();}, config.keyDownInterval);
	
	
	
	}
	
	this.continuousMove = function(direction){
		if(!gpc.moveKeyPressed[direction])
			return;
		if(direction == config.MOVE_ROTATE){
			gamePlay.rotate();
		}else{
			gamePlay.move(direction);
		}
		var thisRef = this;
		window.clearTimeout(gpc.movingTimer[direction]);
		gpc.movingTimer[direction] = window.setTimeout(function(){thisRef.continuousMove(direction);}, config.MOVE_INTERVAL[direction]);
	}
	
	
	this.checkKey = function(e){
			
				
				
		   // IE/Fx
		   var keyID = (window.event) ? event.keyCode : e.keyCode;
		   var direction = null;
		   switch (keyID) {
		   		case 37: // Left arrow
		   			direction = config.MOVE_LEFT;
				case 39: // Right arrow
					if(direction == null)
						direction = config.MOVE_RIGHT;
				case 38: // Up arrow
					if(direction == null)
						direction = config.MOVE_ROTATE;
						
					if(gpc.moveKeyPressed[direction] || (gpc.state != gpc.STATE_ACTIVE && gpc.state != gpc.STATE_WAIT_TETRAD))
						return;
					gpc.moveKeyPressed[direction] = true;
					listeners.continuousMove(direction);
					break;
				case 40: // Down arrow
					if (gpc.downKeyPressed || (gpc.state != gpc.STATE_ACTIVE && gpc.state != gpc.STATE_WAIT_TETRAD)) 
						return;
					gpc.downKeyPressed = true;
					listeners.whileDownKey();	
					break;
				case 32: // Space
					gamePlay.pauseOrStart();
					break;
				case 82: // r
					gamePlay.reset();
					gamePlay.start();
					break;
												
			}
			// disable scroll
			if (keyID <= 40 && keyID >= 37 && e && e.preventDefault) {
				e.preventDefault();
			}else if(keyID <= 40 && keyID >= 37 && event){
				event.returnValue = false;
			}
			

	}
}

var Debugger = function(){
	this.checkLostBusy = function(){
		if(gpc.state == gpc.STATE_ACTIVE || gpc.state == gpc.STATE_WAIT_TETRAD)
			for(var x = 0; x < gpc.blockBusy.length; x++){
				
					
				for(var i = 0; i < gpc.blockBusy[x].length; i++){
					if(gpc.blockBusy[x][i] && !gpc.blockBusy[x][i + 1] && i < config.rows - 1 && !gpc.blockBusy[x + 1][i] && !gpc.blockBusy[x - 1][i])
						console.log("Error, a block with no block at x + 1: x: " + x + " i: " + i);
				
					if(gpc.blockBusy[x][i] && helpers.getBlock(x, i).className.toLowerCase().indexOf("backgroundblock") != -1){

							console.log("Error, busy block with wrong css class: x: " + x + " i: " + i);
					}
						
					if(!gpc.blockBusy[x][i] && helpers.getBlock(x, i).className.toLowerCase().indexOf("backgroundblock") == -1)
						var found = false;
						for(var y = 0; y < gpc.activeTetrad.length; y++){
							if(gpc.activeTetrad[y][0] == x && gpc.activeTetrad[y][1] == i){
								found = true;
								break;
							}
						}
				}
			}
		var thisRef = this;
		var debugTimer = setTimeout(function(){thisRef.checkLostBusy();}, 1000);
	}
}

var start = function(){
	window.console = window.console || {};
	
		//window.console.log = function(){};
	
	if(window.opera !== undefined)
		console.log = opera.postError;
	
	
	config    = new Config();
	setup     = new Setup();
	gpc       = new GameState();
	helpers   = new Util();
	gamePlay  = new GamePlay();
	listeners = new Listeners(); 
	
	
	
	setup.setConfigFromCSS();
	setup.draw();
	
	//debug = new Debugger();
	//debug.checkLostBusy();
	
	if (window.document.addEventListener) {
   		window.document.addEventListener("keydown", listeners.checkKey, false);
		window.document.addEventListener("keyup", listeners.keyUp, false);
	} else {
   		window.document.attachEvent("onkeydown", listeners.checkKey);
		window.document.attachEvent("onkeyup", listeners.keyUp);
	}
	//window.document.onkeydown = listeners.checkKey;
	//window.document.onkeyup   = listeners.keyUp;
}