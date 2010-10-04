/**
 * @author sagen
 */
var GameState = function GameState(){
	
	
	this.STATE_NOT_STARTED = 0; // Game hasn't been started for the first time
	this.STATE_ACTIVE      = 1; // A tetrad is on its way down
	this.STATE_WAIT_TETRAD = 2; // A tetrad has reached bottom but can still be moved left or right. Transitions to active
	this.STATE_GAME_OVER   = 3; // There's a parked tetrad on the top row. Game over
	this.STATE_PAUSED      = 4; // User har paused the game
	

	
	this.state = this.STATE_NOT_STARTED;
	
	this.currentLevel            = 1;
	this.progressInLevel         = 0;
	
	
	this.interval        = 0; // Interval between each tetrad one-square drop. Copied from config and incremented between levels
	this.betweenInterval = 0; // Time between a tetrad hits bottom and new starts from the top. Copied from config and incremented between levels
	
	
	this.timer         = null; // Countdown until next jump down
	
	
	this.currentClass  = "";   // Which css class is the current falling tetrad using
	this.currentCenter = []    // [x,y]  from config.center for current dropping tetrad
	this.activeTetrad  = []    // Coordinates for dropping tetrad. Starts at config.tetrads and changes according to pos
	
	this.nextClass     = "";   // Next tetrad, in preview.
	this.nextCenter    = [];
	this.nextTetrad    = [];
	
	this.downKeyPressed = false;
	this.moveKeyPressed = [];
	this.moveKeyPressed[config.MOVE_LEFT]   = false;
	this.moveKeyPressed[config.MOVE_RIGHT]  = false;
	this.moveKeyPressed[config.MOVE_ROTATE] = false;
	
	this.movingTimer = [];
	this.movingTimer[config.MOVE_LEFT] = null;	
	this.movingTimer[config.MOVE_RIGHT] = null;
	this.movingTimer[config.MOVE_ROTATE] = null;
		
		
	// Occupied blocks on the board
	this.blockBusy = [];
	
	this.scoreSpan = null;
	this.currentScore = 0;
	
	
	this.blockRefs = [];
	
	// Initialize with none of the blocks occupied
	for(var x = 0; x < config.cols; x++){
		this.blockBusy[x] = [];
		for(var y = 0; y < config.rows; y++)
			this.blockBusy[x][y] = false;
	}

	
}
