/**
 * @author sagen
 */
var Setup = function(){

    
    
    // Reads css and sets config
    this.setConfigFromCSS = function(){
        var styleSheet = null;
        for (var x = 0; x < document.styleSheets.length; x++) {
            if (document.styleSheets[x].title == 'tetris') {
                styleSheet = document.styleSheets[x];
                break;
            }
        }
        
        var cssRuleCounter = 0;
        var propertiesSet = false;
        do {
            var cssRule = false;
            if (styleSheet.cssRules) {
                cssRule = styleSheet.cssRules[cssRuleCounter];
            }
            else 
                if (styleSheet.rules) {
                    cssRule = styleSheet.rules[cssRuleCounter];
                }
            if (cssRule && cssRule.selectorText.toLowerCase() == "div.backgroundblock") {
                config.setWidthFromBlock(cssRule.style.width);
                config.setHeightFromBlock(cssRule.style.height);
                config.bgColor = cssRule.style.backgroundColor;
                propertiesSet = true;
                break;
            }
            cssRuleCounter++;
        }
        while (cssRule);
        if (!propertiesSet) {
            config.setWidthFromBlock(20);
            config.setHeightFromBlock(20);
            config.bgColor = "#FFFFFF";
        }
        
    }
    
    
    this.draw = function(){
    
        var mainDiv = document.createElement("DIV");
        mainDiv.id = "board";
        mainDiv.style.height = config.fullHeight + "px";
        mainDiv.style.width = config.fullWidth + "px";
        //mainDiv.style.backgroundColor = config.bgColor;
        mainDiv.style.zIndex = 1;
		
		var overlayDiv = document.createElement("DIV");
		overlayDiv.id = "overlay";
		overlayDiv.style.height = mainDiv.style.height;
		overlayDiv.style.width = mainDiv.style.width;
		overlayDiv.style.zIndex = 2;
		var overlayInner = '<h1>Satris</h1><h1 id="gameOver">GAME OVER</h1>';
		overlayInner += '<table id="keyMap"><tr><td class="kmKey">Space</td><td>Start<br />Pause<br />Continue</td></tr><tr><td class="kmKey">R</td><td>Reset</td></tr><tr><td class="kmKey">&larr; &rarr;</td><td>Move</td></tr><tr><td class="kmKey">&uarr;</td><td>Rotate</td></tr>';
		overlayInner += '<tr><td class="kmKey">&darr;</td><td>Drop</td></tr></table>';
		overlayInner += '<div id="buttonWrapper"><div id="startButton" class="overlayButton" onclick="gamePlay.pauseOrStart();">Start</div><div id="continueButton" class="overlayButton" onclick="gamePlay.pauseOrStart();">Continue</div><div onclick="gamePlay.reset();gamePlay.pauseOrStart();" id="restartButton" class="overlayButton">Restart</div></div>';
			
		overlayDiv.innerHTML = overlayInner;
		
        
		var preDiv = document.createElement("DIV");
        preDiv.id = "preview";
        preDiv.style.height = (config.blockHeight * config.previewRows) + "px";
        preDiv.style.width = (config.blockWidth * config.previewCols) + "px";
        preDiv.style.left = (config.fullWidth + 25) + "px";
        //preDiv.style.backgroundColor = config.bgColor;
        
		var preContainer = document.createElement("DIV");
		preContainer.id = "previewContainer";
		preContainer.style.height = (parseInt(preDiv.style.height) - config.blockHeight) + "px";
		preContainer.style.width = (parseInt(preDiv.style.width) - config.blockWidth) + "px";
		
		preContainer.style.backgroundColor = preDiv.style.backgroundColor;
		preDiv.appendChild(preContainer);
        
		var statsWrap = document.createElement("DIV");
		statsWrap.id = "statsWrap";
		statsWrap.style.top = (config.blockHeight * config.previewRows + 30) + "px";
		statsWrap.style.left = (config.fullWidth + 25) + "px";
		statsWrap.style.width = preDiv.style.width;
		statsWrap.innerHTML = '<table><tr><td class="statDesc">Score:</td><td><span id="scoreNum">0</span></td></tr><tr><td class="statDesc">Level:</td><td><span id="levelNum">1</span></td></tr></table>';
        
        
        for (var x = 0; x < config.cols; x++) {
			gpc.blockRefs[x] = [];
            for (var y = 0; y < config.rows; y++) {
                var oneBlock = document.createElement("DIV");
                oneBlock.className = "backgroundBlock";
                oneBlock.style.position = "absolute";
                oneBlock.style.left = (x * config.blockWidth) + "px";
                oneBlock.style.top = (y * config.blockHeight) + "px";
                oneBlock.id = "block" + x + "-" + y;
                mainDiv.appendChild(oneBlock);
				gpc.blockRefs[x][y] = oneBlock;
            }
        }
        
        
		for (var x = 0; x < config.previewCols - 1; x++) {
            for (var y = 0; y < config.previewRows - 1; y++) {
                var preBlock = document.createElement("DIV");
                preBlock.className = "backgroundBlock";
                preBlock.style.position = "absolute";
                preBlock.style.left = (x * config.blockWidth) + "px";
                preBlock.style.top = (y * config.blockHeight) + "px";
                preBlock.id = "preBlock" + x + "-" + y;
                preContainer.appendChild(preBlock);
            }
        }
		
        
        var wrapper = document.getElementById(config.wrapper);
        
        wrapper.appendChild(mainDiv);
		wrapper.appendChild(overlayDiv);
        wrapper.appendChild(preDiv);
        wrapper.appendChild(statsWrap);

		gpc.scoreSpan = document.getElementById("scoreNum");
        
    }
	
	this.clearModel = function(){
		window.clearTimeout(gpc.timer);
		gpc = new GameState();
		//document.getElementById("startPauseButton").value = "Start";
	}
    
    this.clear = function(){
        document.getElementById('wrapper').innerHTML = '';
    }
    
    
    
}
