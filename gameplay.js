/**
 * @author sagen
 */
var GamePlay = function(){

	
	
	this.start = function(){
		gpc.interval = config.interval
		gpc.betweenInterval = config.betweenInterval;
		
		helpers.generateNextTetrad();
		helpers.prepareNextTetrad();
		
		var obj = this;
		gpc.timer = window.setTimeout(function(){obj.next(true);},gpc.betweenInterval);
		gpc.state = gpc.STATE_ACTIVE;
		document.getElementById("overlay").style.display = "none";
	}
	this.reset = function(){
		setup.clearModel();
		setup.clear();
		setup.setConfigFromCSS();
		setup.draw();
		
	}
	
	this.pauseOrStart = function(){
		if(gpc.state == gpc.STATE_ACTIVE){
			window.clearTimeout(gpc.timer);
			gpc.state = gpc.STATE_PAUSED;
			helpers.displayOverlay();
			//document.getElementById("startPauseButton").value = "Start";
		}else if(gpc.state == gpc.STATE_PAUSED){
			var obj = this;
			gpc.timer = window.setTimeout(function(){obj.next(true);},gpc.interval);
			gpc.state = gpc.STATE_ACTIVE;
			document.getElementById("overlay").style.display = "none";

			//document.getElementById("startPauseButton").value = "Pause";
		}else if(gpc.state == gpc.STATE_NOT_STARTED){
			this.start();
			//document.getElementById("startPauseButton").value = "Pause";
		}else if(gpc.state == gpc.STATE_GAME_OVER){
			this.reset();
			this.pauseOrStart();
		}
	}
	
	// Moves active tetrad one down
	this.next = function(setTimer){
	
		if(gpc.state != gpc.STATE_ACTIVE)
			return false;
		
		
		window.clearTimeout(gpc.timer);
		
		if (this.updateGameOverOrNext()) {
			return false;
			
		}

				
		
		var remove = [], add = [];
		var i = j = 0;
		var newActiveTetrad = [];
		for (var x = 0; x < gpc.activeTetrad.length; x++) {
			newActiveTetrad[x] = gpc.activeTetrad[x].slice(0);
			newActiveTetrad[x][1]++;
		}
		// Set the pos of active tetrad one down
		
		

		for(var x = 0; x < 4; x++){
			var needsToBeAdded = oldNeedsRemoval = true; 
			for(var y = 0; y < 4; y++){
				if(needsToBeAdded && newActiveTetrad[x][0] == gpc.activeTetrad[y][0] && newActiveTetrad[x][1] == gpc.activeTetrad[y][1]){
					needsToBeAdded = false;
				}
				
				if(oldNeedsRemoval && gpc.activeTetrad[x][0] == newActiveTetrad[y][0] && gpc.activeTetrad[x][1] == newActiveTetrad[y][1]){
					oldNeedsRemoval = false;
				}
				
				if(!(oldNeedsRemoval || needsToBeAdded)){
					break;
				}
			}
			if(needsToBeAdded){
				add[i++] = newActiveTetrad[x];
			}
			if(oldNeedsRemoval){
				remove[j++] = gpc.activeTetrad[x].slice(0);
			}
		}
		gpc.activeTetrad = newActiveTetrad;
		helpers.clearActive(remove);
		// Y of Centre is also increasing
		gpc.currentCenter[1]++;
		
		gpc.state = gpc.STATE_ACTIVE;
		
		// Draw the tetrad at the new location
		helpers.drawActive(add);
		

		// Check again for game over
		if (this.updateGameOverOrNext()) {			
			return false;
		}
		

		//Jump down in interval
		var thisRef = this;
		if (setTimer) {
			gpc.timer = window.setTimeout(function(){
				thisRef.next(true);
			}, gpc.interval)
		}
		return true;
	
	}
	
	// Checks if the tetrad is at bottom or it's game over. Triggers actions
	this.updateGameOverOrNext = function(){

		if(helpers.isAtBottom()){
			if(helpers.isAtTop()){			
				//alert("Game Over"); 
				gpc.state = gpc.STATE_GAME_OVER;
				helpers.displayOverlay();
				return true;
			}
			
			gpc.state = gpc.STATE_WAIT_TETRAD;
			//console.log("Reached bottom:");
			//helpers.isAtBottom(true);
			var thisRef = this;
			gpc.timer = window.setTimeout(function(){
		
				helpers.prepareNextTetrad();
				
				thisRef.next(true);
			}, gpc.betweenInterval);
			return true;
			//window.window.setTimeout("prepareNextTetrad()", 100);
			
		}
		return false;
	}
	
	
	this.move = function(direction){
		for(var x = 0; x < gpc.activeTetrad.length; x++){
			if(direction == config.MOVE_RIGHT && gpc.activeTetrad[x][0] == config.cols - 1)
				return;    // All the way to the right
			
			if(direction == config.MOVE_LEFT && gpc.activeTetrad[x][0] == 0)
				return;
			
			if(gpc.blockBusy[gpc.activeTetrad[x][0] + direction][gpc.activeTetrad[x][1]])
				return;    // Right is busy
		}
		
		if(gpc.state != gpc.STATE_ACTIVE && gpc.state != gpc.STATE_WAIT_TETRAD)
			return
		
	

		helpers.clearActive();
		
		// set all x's +- 1
		for(var x = 0; x < gpc.activeTetrad.length; x++){
			gpc.activeTetrad[x][0] += direction;
		}
		
		// Move centre x +- 1
		gpc.currentCenter[0] += direction;
		
		helpers.drawActive();
		
		this.setActiveIfSpace();
	}
	
	
	

	
	// Rotate active tetrad 90 degrees right
	this.rotate = function(){
		if(gpc.state != gpc.STATE_ACTIVE && gpc.state != gpc.STATE_WAIT_TETRAD)
			return
		
		if(gpc.currentCenter == 0)
			return;
			
		var tmp = []; 
		
		// [x,y] = [-y, x]
		// Save coords relative to centre (Reset centre to 0,0)
		for(var x = 0; x < gpc.activeTetrad.length; x++){
			tmp[x] = [gpc.activeTetrad[x][0] - gpc.currentCenter[0], gpc.activeTetrad[x][1] - gpc.currentCenter[1]]
			
			// Would we end up to the right or left of the board?
			if(-tmp[x][1] + gpc.currentCenter[0] < 0 || -tmp[x][1] + gpc.currentCenter[0] > config.cols - 1)
				return;
			
			// Would we end up under the baord?
			if(tmp[x][0] + gpc.currentCenter[1] > config.rows - 1)
				return
				
			// Would we crash with a busy block?			
			if(gpc.blockBusy[-tmp[x][1] + gpc.currentCenter[0]][tmp[x][0] + gpc.currentCenter[1]])
				return;

		}
		
		if(gpc.state != gpc.STATE_ACTIVE && gpc.state != gpc.STATE_WAIT_TETRAD) // Check again
			return
		
		//if(gpc.state == gpc.STATE_WAIT_TETRAD){
		//	clearTimeout(gpc.timer);
		//}		
		
		// All ok.. remove active tetrad
		helpers.clearActive();
		
		// Set new coords
		for(var x = 0; x < gpc.activeTetrad.length; x++){
			gpc.activeTetrad[x][0] = (-tmp[x][1]) + gpc.currentCenter[0];
			gpc.activeTetrad[x][1] = (tmp[x][0]) + gpc.currentCenter[1];
		}
		
	
		// Draw the tetrad at the new location
		helpers.drawActive();
		//console.log("Ferdig rotere!");
		
		
		this.setActiveIfSpace();
			
	}
	
	// If it's space under the active tetrad, move down
	this.setActiveIfSpace = function(){
		if(!helpers.isAtBottom() && gpc.state != gpc.STATE_ACTIVE){
			window.clearTimeout(gpc.timer);
			gpc.state = gpc.STATE_ACTIVE;
			var thisRef = this;
			gpc.timer = window.setTimeout(function(){thisRef.next(true);}, gpc.interval);
		}
	}
	
	
	this.skipDown = function(){
		helpers.updateScore(100);
	}
	
}