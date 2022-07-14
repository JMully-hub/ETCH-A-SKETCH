function colorChange(){
    selectedColor = document.querySelector('input[name="color"]:checked').value;
}

function getGridSize(){
    gridSize = gridSlider.value;
    refreshGrid();
    runMain();
}

function refreshGrid() {
    while (sketchContainer.firstChild) {
        sketchContainer.removeChild(sketchContainer.firstChild);
    }
    
}

function runMain(){
    for (let row = 0; row < gridSize; row++){
        let newRow = document.createElement('div');
        newRow.setAttribute('style', 'display: grid; column-gap: 1px;');
        newRow.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        for (let square = 0; square < gridSize; ++square){
            let newSquare = document.createElement('div');
            newSquare.setAttribute('style', 'background-color: white;')
            
            const colorSquare = () =>{
                // colors
                if (selectedColor === 'rainbow'){ 
                    color = rainbowColors[Math.floor(Math.random()*rainbowColors.length)]
                }else{
                    color = selectedColor;
                }

                // water color effect (adds 10% to opacity on each pass)
                if (color !== 'white' && waterColorCB.checked){ // not white (eraser)
                        if (newSquare.style.opacity !== ''){
                            newOpacity = parseFloat(newSquare.style.opacity) + 0.1;
                        }else{
                            newOpacity = 0.1
                        }
                        newSquare.setAttribute('style', `background-color: ${color}; opacity: ${newOpacity};`);
                    }else{
                        newSquare.setAttribute('style', `background-color: ${color};`);
                }
            };
            //colorSquare called for both mousedown and mouseover, otherwise wont color the first clicked square
            newSquare.addEventListener('mousedown', colorSquare); 
            newSquare.addEventListener('mouseover', function(){
                if (mouseIsDown){
                    colorSquare();
                }
            });
            newRow.appendChild(newSquare);
        }
        sketchContainer.appendChild(newRow);
    }

}

const sketchContainer = document.querySelector('#sketchContainer');

const gridSlider = document.getElementById('gridSize')
let output = document.getElementById('sliderOutput');
let gridSize = gridSlider.value;
output.innerHTML = gridSize + " x " + gridSize; // display default on start

let selectedColor = 'black'; // default starting color
let color;

const waterColorCB = document.querySelector('#waterColor');

gridSlider.oninput = function() { // update the slider output value
    output.innerHTML = this.value + " x " + this.value;
    }

rainbowColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
document.getElementById('colorSelector').addEventListener('change', colorChange);
document.getElementById('gridSize').addEventListener('change', getGridSize);

let mouseIsDown = false; 
document.addEventListener('mousedown', function(){mouseIsDown = true});
document.addEventListener('mouseup', function(){mouseIsDown = false});

document.body.setAttribute('ondragstart', "return false;"); // stop dragging behaviour

// Animation  -shake the etch a sketch and clear the sketch
document.getElementById('shake').addEventListener('click', function(){
    document.getElementById('sketchWrapper').setAttribute('style', 'animation: shake 0.5s;')
    refreshGrid();
    runMain();
});
// once animation ended, remove the animation so it can be called again
document.getElementById('sketchWrapper').addEventListener('animationend', function(){
    document.getElementById('sketchWrapper').removeAttribute('style', 'animation: shake 0.5s;')
});


runMain();

// use keyboard?
const keyboardModeCB = document.querySelector('#keyboardCB');
keyboardModeCB.addEventListener('change', initKeyBoardMode);

const sketchRightDiv = document.getElementById('sketchRight')
const sketchLeftDiv = document.getElementById('sketchLeft')

let currentSquarePosition;

function initKeyBoardMode(){
    if (this.checked){
        refreshGrid();
        runMain();
        sketchRightDiv.innerText = "Click anywhere on the grid as the starting point for the keyboard";
        sketchRightDiv.setAttribute('style', "display: block;")
        
        function keyBoardHelper(event){
            sketchRightDiv.setAttribute('style', "display: none;")
            sketchContainer.removeEventListener('click', keyBoardHelper);
            sketchContainer.setAttribute('style', 'pointer-events: none'); // remove mouse input, keyboard only
            sketchLeftDiv.innerText = "Tap the arrow keys to draw!\n\nUnselect keyboard mode to use the mouse again.";
            sketchLeftDiv.setAttribute('style', "display: block;");

            // not single clicked a square but dragged accross the grid
            if (window.getComputedStyle(event.target, null).display !== 'block'){ 
                sketchLeftDiv.innerText = "Click a single square to start.\n\nRe-select keyboard mode to try again.";
                return;
            }
            currentSquarePosition = event.target;

            // prevent arrow controlling of buttons if changed or clicked during keyboard mode
            window.addEventListener("keydown", function(e) {
                if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
                    e.preventDefault();
                }
            }, false);

            document.addEventListener('keyup', function(event){
                sendKeys(currentSquarePosition, event);
            }, false);
        }
        
        sketchContainer.addEventListener('click', keyBoardHelper)
        
    }else{
        sketchRightDiv.setAttribute('style', "display: none;")
        sketchLeftDiv.setAttribute('style', "display: none;")
        sketchContainer.setAttribute('style', 'pointer-events: auto'); // reinstate mouse input
        document.removeEventListener('keyup', sendKeys)
    }
}

function sendKeys(thisSquare, event){
    switch (event.code){
        case 'ArrowUp':
            arrowUp(thisSquare);
            break;
        case 'ArrowDown':
            arrowDown(thisSquare)
            break;
        case 'ArrowLeft':
            arrowLeft(thisSquare)
            break;
        case 'ArrowRight':
            arrowRight(thisSquare)
            break;
    }
}


// node to the left is just previous sibling
function arrowLeft(thisSquare){ 
    if(thisSquare.previousSibling !== null){
        currentSquarePosition = thisSquare.previousSibling;
        keyBoardColor(currentSquarePosition);
    }
}


// node to the right is just next sibling
function arrowRight(thisSquare){ 
    if(thisSquare.nextSibling !== null){
        currentSquarePosition = thisSquare.nextSibling;
        keyBoardColor(currentSquarePosition);
    }
}

// node above, get current index in relation to parent. Get parent's previous sibling,
// then use the same index to get their correseponding child (node above)
function arrowUp(thisSquare){
    nodeIndex = Array.prototype.indexOf.call(thisSquare.parentNode.children, thisSquare);
    if (thisSquare.parentNode.previousSibling !== null){
        nodeAbove = thisSquare.parentNode.previousSibling.children[nodeIndex];
        currentSquarePosition = nodeAbove;
        keyBoardColor(currentSquarePosition);
    }
}

// node below, get current index in relation to parent. Get parent's next sibling,
// then use the same index to get their correseponding child (node below)
function arrowDown(thisSquare){
    nodeIndex = Array.prototype.indexOf.call(thisSquare.parentNode.children, thisSquare);
    if (thisSquare.parentNode.nextSibling !== null){
        nodeBelow = thisSquare.parentNode.nextSibling.children[nodeIndex];
        currentSquarePosition = nodeBelow;
        keyBoardColor(currentSquarePosition);
    }

}


function keyBoardColor(thisSquare){

        // colors
        if (selectedColor === 'rainbow'){ 
            color = rainbowColors[Math.floor(Math.random()*rainbowColors.length)]
        }else{
            color = selectedColor;
        }

        // water color effect (adds 10% to opacity on each pass)
        if (color !== 'white' && waterColorCB.checked){ // not white (eraser)
                if (thisSquare.style.opacity !== ''){
                    newOpacity = parseFloat(square.style.opacity) + 0.1;
                }else{
                    newOpacity = 0.1
                }
                thisSquare.setAttribute('style', `background-color: ${color}; opacity: ${newOpacity};`);
            }else{
                thisSquare.setAttribute('style', `background-color: ${color};`);
        }
    };

// todo: on finer grids, the keyup event is shading 3 divs at a time - bug
// todo: remove keyboard mode check on grid resize or "shake"
// todo: tidy code.
// todo: css