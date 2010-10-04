/**
 * @author sagen
 */
var Util = function(){

    // Get the div on the board with given pos
    this.getBlock = function(x, y){
        return gpc.blockRefs[x][y];
        //return document.getElementById("block" + x + "-" + y);
    }
    
    // Get div on preview board with given pos
    this.getPreBlock = function(x, y){
        return document.getElementById("preBlock" + x + "-" + y);
    }
    
    // Pick a new tetrad, place it on preview board and queue it up
    this.generateNextTetrad = function(){
    
        // Pick a tetrad
        var copyFrom = Math.ceil(Math.random() * config.tetrads.length) - 1
        
        // Set css class for the next tetrad
        gpc.nextClass = "activeBlock activeType" + copyFrom;
        
        var preTetrad = []
        var highestPoint = 0;
        var prevWidth = 0;
        
        // Make a copy of the array representing tetrad
        for (var x = 0; x < config.tetrads[copyFrom].length; x++) {
            preTetrad[x] = config.tetrads[copyFrom][x].slice(0);
            gpc.nextTetrad[x] = config.tetrads[copyFrom][x].slice(0);
            
            if (preTetrad[x][1] < highestPoint) {
                highestPoint = preTetrad[x][1];
            }
            
            if (preTetrad[x][0] > prevWidth) {
                prevWidth = preTetrad[x][0];
            }
        }
        
        
        
        // Reset the preview board
        for (var x = 0; x < config.previewCols - 1; x++) {
            for (var y = 0; y < config.previewRows - 1; y++) {
                this.getPreBlock(x, y).className = "backgroundBlock";
            }
        }
        
        var addedX = Math.floor(((config.previewCols - 1) / 2) - (prevWidth / 2));
        var addedY = Math.floor((config.previewRows / 2) - (Math.abs(highestPoint) / 2));
        
        
        if ((prevWidth + 1) % 2 == 0) {
            document.getElementById("previewContainer").style.left = (config.blockWidth / 2) + "px";
            
        }
        else {
            document.getElementById("previewContainer").style.left = 0;
        }
        if (Math.abs(highestPoint) % 2 == 0) {
            document.getElementById("previewContainer").style.top = (config.blockHeight / 2) + "px";
        }
        else {
            document.getElementById("previewContainer").style.top = 0;
            
        }
        
        // Draw on preview board, setting css that is
        for (var i = 0; i < gpc.nextTetrad.length; i++) {
            //console.log(gpc.nextTetrad[i][0] - highestPoint);
            
            this.getPreBlock(gpc.nextTetrad[i][0] + addedX, gpc.nextTetrad[i][1] - highestPoint + addedY).className = gpc.nextClass;
            //console.log(x + " - " + y - highestPoint);
        
        }
        
        
        
        
        // Set the centre pos for next tetrad
        if (config.centers[copyFrom] != 0) {
            gpc.nextCenter = config.centers[copyFrom].slice(0);
            gpc.nextCenter[0] += Math.floor(config.cols / 2);
        }
        else 
            gpc.nextCenter = 0;
        
        
        var center = Math.floor(config.cols / 2);
        
        for (var i = 0; i < gpc.nextTetrad.length; i++) 
            gpc.nextTetrad[i][0] += center;
        
        
    }
    
    // Set the pos of current tetrad to busy, reset timer, line up new tetrad
    this.prepareNextTetrad = function(){
        gpc.state = gpc.STATE_ACTIVE
        //if(active.length != 0 && !isAtBottom())
        //	return;
        window.clearTimeout(gpc.timer);
        
        
        for (var x = 0; x < gpc.activeTetrad.length; x++) 
            gpc.blockBusy[gpc.activeTetrad[x][0]][gpc.activeTetrad[x][1]] = true;
        
        gpc.currentClass = gpc.nextClass;
        
        if (gpc.nextCenter != 0) 
            gpc.currentCenter = gpc.nextCenter.slice(0);
        else 
            gpc.currentCenter = 0;
        
        // Reset active tetrad
        gpc.activeTetrad = new Array();
        
        // Copy the coords from next tetrad to current
        for (var x = 0; x < gpc.nextTetrad.length; x++) {
            gpc.activeTetrad[x] = gpc.nextTetrad[x].slice(0);
        }
        
        // Check if there's rows to be cleared
        this.checkForFilledRows();
        
        // Line up the next tetrad
        this.generateNextTetrad();
    }
    
    // Check if active tetrad is on top row
    this.isAtTop = function(){
        for (var x = 0; x < gpc.activeTetrad.length; x++) 
            if (gpc.activeTetrad[x][1] < 0) 
                return true;
        return false;
    }
    
    this.updateScore = function(addScore){
        gpc.currentScore += addScore;
        gpc.scoreSpan.innerHTML = gpc.currentScore;
    }
    
    this.nextLevel = function(){
        var elm = document.getElementById("levelNum");
        elm.innerText = parseInt(elm.innerText) + 1;
    }
    
    // If active tetrad has reached bottom (or on top of busy block)
    this.isAtBottom = function(){
        for (var x = 0; x < gpc.activeTetrad.length; x++) {
            if (gpc.activeTetrad[x][1] == config.rows - 1) {
                return true;
            }
            if (gpc.activeTetrad[x][0] >= 0 && gpc.blockBusy[gpc.activeTetrad[x][0]][gpc.activeTetrad[x][1] + 1]) {
                //if(log)
                //console.log("blockBusy: " + gpc.activeTetrad[x][0] + ", " + (gpc.activeTetrad[x][1] + 1) + ": " + gpc.blockBusy[gpc.activeTetrad[x][0]][gpc.activeTetrad[x][1] + 1]);
                
                return true;
            }
            else {
                //console.log("blockBusy: " + gpc.activeTetrad[x][0] + ", " + (gpc.activeTetrad[x][1] + 1) + ": " + gpc.blockBusy[gpc.activeTetrad[x][0]][gpc.activeTetrad[x][1] + 1]);
            
            }
            
        }
        
        return false;
    }
    
    // Clears the tetrad from the board. Probably to display it somewhere else.
    this.clearActive = function(blockArr){
        if (!blockArr) {
            blockArr = gpc.activeTetrad;
        }
        for (var x = 0; x < blockArr.length; x++) {
            if (blockArr[x][1] > -1) {
                this.getBlock(blockArr[x][0], blockArr[x][1]).className = "backgroundBlock"; // Poff
            }
        }
    }
    
    // Draws the active tetrad
    this.drawActive = function(blockArr){
        if (!blockArr) {
            blockArr = gpc.activeTetrad;
        }
        for (var x = 0; x < blockArr.length; x++) {
            if (blockArr[x][1] > -1) {
                //console.log(active[x][1] + " - " + active[x][0]);
                this.getBlock(blockArr[x][0], blockArr[x][1]).className = gpc.currentClass;
            }
        }
    }
    
    // Checks and removes filled rows
    this.checkForFilledRows = function(){
        var found, noFound = 0;
        // Check each row
        for (var x = 0; x < gpc.blockBusy[0].length; x++) {
            found = true;
            for (var y = 0; y < gpc.blockBusy.length; y++) {
                if (!gpc.blockBusy[y][x]) {
                    found = false; // Not full
                    break;
                }
            }
            if (found) {
                ++noFound;
                this.removeRow(x); // Full
            }
        }
        
        this.updateScore(Math.pow(noFound, 3) * 100);
        this.updateProgress(noFound);
        
    }
    
    this.updateProgress = function(clearedLines){
        gpc.progressInLevel += clearedLines;
        if (gpc.progressInLevel >= 10) {
            config.intervalInc(gpc);
            //config.intervalInc.apply(gpc.interval = eval("gpc.interval " + config.intervalInc);
            //gpc.betweenInterval = eval("gpc.betweenInterval " + config.intervalInc);
            this.nextLevel();
            this.updateScore(gpc.currentLevel * 2000);
            gpc.progressInLevel = 0;
        }
    }
    
    // Blinks the row and sets a timer to clear it
    this.removeRow = function(row, i, tmpClasses){
        var i = (i == null) ? 0 : i;
        
        
        if (tmpClasses == null) 
            var tmpClasses = [];
        
        
        for (x = 0; x < config.cols; x++) {
            if (i == 0) {
                tmpClasses[x] = this.getBlock(x, row).className;
                gpc.blockBusy[x][row] = false;
            }
            
            if (i % 2 == 0) 
                this.getBlock(x, row).className = "explodingBlock";
            else 
                this.getBlock(x, row).className = tmpClasses[x];
        }
        
        var thisRef = this;
        if (i == 4) 
            var internalTimer = window.setTimeout(function(){
                thisRef.reallyRemoveRow(row);
            }, 200);
        else 
            var internalTimer = window.setTimeout(function(){
                thisRef.removeRow(row, i + 1, tmpClasses);
            }, 30);
        
        
        
    }
    
    // Actually remove the row
    this.reallyRemoveRow = function(row){
    
        for (x = 0; x < config.cols; x++) {
            this.getBlock(x, row).className = "backgroundBlock";
        }
        
        
        for (var x = 0; x < config.cols; x++) {
            for (var y = row - 1; y >= 0; y--) {
                if (gpc.blockBusy[x][y]) {
                    //console.log("y: " + y + " x: " + x);
                    gpc.blockBusy[x][y] = false; // Ikke lenger opptatt
                    gpc.blockBusy[x][y + 1] = true;
                    this.getBlock(x, y + 1).className = this.getBlock(x, y).className;
                    this.getBlock(x, y).className = "backgroundBlock"; // Empty each block
                }
            }
        }
    }
    
    this.displayOverlay = function(){
        switch (gpc.state) {
            case gpc.STATE_PAUSED:
                document.getElementById("continueButton").style.display = "block";
                document.getElementById("startButton").style.display = "none";
                document.getElementById("restartButton").style.display = "block";
                document.getElementById("gameOver").style.display = "none";
                
                break;
            case gpc.STATE_GAME_OVER:
                document.getElementById("continueButton").style.display = "none";
                document.getElementById("startButton").style.display = "none";
                document.getElementById("restartButton").style.display = "block";
                document.getElementById("gameOver").style.display = "block";
        }
        document.getElementById("overlay").style.display = "block";
    }
}


