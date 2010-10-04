/**
 * @author sagen
 */

var Config = function(){
	
	this.MOVE_LEFT   = -1;
	this.MOVE_RIGHT  =  1;
	this.MOVE_ROTATE =  0;
	
	this.MOVE_INTERVAL = [];
	this.MOVE_INTERVAL[this.MOVE_LEFT]   = 100;
	this.MOVE_INTERVAL[this.MOVE_RIGHT]  = this.MOVE_INTERVAL[this.MOVE_LEFT];
	this.MOVE_INTERVAL[this.MOVE_ROTATE] = 300;
	
	
	// start coords for all tetrads
	this.tetrads = []
	this.tetrads[0] = [         // I
						[0, -4],
						[0, -3],
						[0, -2],
					 	[0, -1]
					 ];
				
	this.tetrads[1] = [          // T
						[1, -3],
						[0, -2],
						[1, -2],
						[1, -1]
					];
	
	this.tetrads[2] = [          // L
						[0, -3],
						[0, -2],
						[0, -1],
						[1, -1]
					];
					
					
	this.tetrads[3] = [          // J
						[1, -3],
						[1, -2],
						[1, -1],
						[0, -1]
					];
					
	this.tetrads[4] = [          // O
						[0, -2],
						[0, -1],
						[1, -2],
						[1, -1]	
					];
					
	this.tetrads[5] = [			// S
						[0, -1],
						[1, -2],
						[1, -1],
						[2, -2]
					];
	
	this.tetrads[6] = [			// Z
						[0, -2],
						[1, -2],
						[1, -1],
						[2, -1]
					];
					
	// Centre of tetrads to smooth the rotation++
	this.centers = [
						[0, -2], 
						[1, -2],
						[0, -2],
						[1, -2],
						0,
						[1, -1],
						[1, -2]
				   ];
					
					
	// Size of board
	this.rows            = 20;
	this.cols            = 15;
	
	this.interval        = 500; // ms between each jump down
	this.betweenInterval = 600; // ms between active tetrad lands and next begins
	this.keyDownInterval = 50;  // ms between each jump down when down arrow is pressed 
	this.minInterval     = 50;  // Limit of ms between each jump as levels decrease timings.
	this.maxLevels       = 20;  // Levels until game over
	//this.intervalInc     = " - 50";
	this.intervalInc     = function(gameState){gameState.interval -= (gameState.interval / 5);} // formula for interval decrease between levels
	
	this.previewRows     = 5;
	this.previewCols     = 5;
	
	// id of the wrapper element
	this.wrapper = 'wrapper';
	
	
	
	// Will be gathered from css
	this.styleSheet  = null;
	this.fullWidth   = 0;
	this.fullHeight  = 0;
	this.blockWidth  = 0;
	this.blockHeight = 0;
	//this.bgColor    = "#000000";
	
	
	// Set the full width based on one blocks width
	this.setWidthFromBlock = function(blockWidth){
		
		this.blockWidth = parseInt(blockWidth);
		this.fullWidth  = (parseInt(blockWidth)  * this.cols);
	}
	
	
	// Set height of board based on one blocks height 
	this.setHeightFromBlock = function(blockHeight){
		this.blockHeight = parseInt(blockHeight);
		this.fullHeight = (parseInt(blockHeight) * this.rows);
	}
}