function colorChange(){
    selectedColor = document.querySelector('input[name="color"]:checked').value;
}

function getGridSize(){
    gridSize = gridSlider.value;
    refreshGrid();
    makeGrid();
}

function refreshGrid() {
    while (sketchContainer.firstChild) {
        sketchContainer.removeChild(sketchContainer.firstChild);
    }
}

function colorThisSquare(thisSquare){

    // colors
    if (selectedColor === 'rainbow'){ 
        color = rainbowColors[Math.floor(Math.random()*rainbowColors.length)]
    }else{
        color = selectedColor;
    }
    // water color effect (adds 10% to opacity on each pass)
    if (color !== 'white' && waterColorCB.checked){ // not white (eraser)
            if (thisSquare.style.opacity !== ''){
                newOpacity = parseFloat(thisSquare.style.opacity) + 0.1;
            }else{
                newOpacity = 0.1
            }
            thisSquare.setAttribute('style', `background-color: ${color}; opacity: ${newOpacity};`);
        }else{
            thisSquare.setAttribute('style', `background-color: ${color};`);
    }
    previousSquare = thisSquare; // for next iteration after this square has been colored.
};

function keyDownFunc(keyEvent){
    sendSquare = currentSquarePosition
    if (sendSquare){
        sendKeys(sendSquare, keyEvent);
    }
};

function sendKeys(thisSquare, event){
    switch (event.code){
        case 'ArrowUp':
            return arrowUp(thisSquare);
        case 'ArrowDown':
            return arrowDown(thisSquare)
        case 'ArrowLeft':
            return arrowLeft(thisSquare)
        case 'ArrowRight':
            return arrowRight(thisSquare)
    }
}
// node to the left is just previous sibling
function arrowLeft(thisSquare){ 
    if(thisSquare.previousSibling !== null){ // if it has a next sibling (otherwise at edge of grid)
        currentSquarePosition = thisSquare.previousSibling;
        colorThisSquare(currentSquarePosition);
        rotateDials('left');
    }
}
// node to the right is just next sibling
function arrowRight(thisSquare){ 
    if(thisSquare.nextSibling !== null){
        currentSquarePosition = thisSquare.nextSibling;
        colorThisSquare(currentSquarePosition);
        rotateDials('right');
    }
}
// node above, get current index in relation to parent. Get parent's previous sibling,
// then use the same index to get their correseponding child (node above / previous cousin)
function arrowUp(thisSquare){
    nodeIndex = Array.prototype.indexOf.call(thisSquare.parentNode.children, thisSquare);
    if (thisSquare.parentNode.previousSibling !== null){
        nodeAbove = thisSquare.parentNode.previousSibling.children[nodeIndex];
        currentSquarePosition = nodeAbove;
        colorThisSquare(currentSquarePosition);
        rotateDials('up');
    }
}

// node below, get current index in relation to parent. Get parent's next sibling,
// then use the same index to get their correseponding child (node below/ next cousin)
function arrowDown(thisSquare){
    nodeIndex = Array.prototype.indexOf.call(thisSquare.parentNode.children, thisSquare);
    if (thisSquare.parentNode.nextSibling !== null){
        nodeBelow = thisSquare.parentNode.nextSibling.children[nodeIndex];
        currentSquarePosition = nodeBelow;
        colorThisSquare(currentSquarePosition);
        rotateDials('down');
    }

}

function turnDialsOnMouse(thisSquare){
    if (previousSquare){
        if(thisSquare === previousSquare.nextSibling){
            rotateDials('right');
            return;
        }else if(thisSquare === previousSquare.previousSibling){
            rotateDials('left');
            return;
        } 
        nodeIndex = Array.prototype.indexOf.call(thisSquare.parentNode.children, thisSquare);
        nodeBelow = () => {thisSquare.parentNode.nextSibling.children[nodeIndex] ?? null};
        nodeAbove = () => {thisSquare.parentNode.previousSibling.children[nodeIndex] ?? null};
        if (nodeBelow === previousSquare){
            rotateDials('up');
        }else{
            rotateDials('down');
        }
    }
};

function rotateDials(direction){
    switch (direction){
        case 'up':
            rightRotation += rotationDegree;
            rightDial.setAttribute('style', `transform: rotate(${rightRotation}deg);`)
            break;
        case 'down':
            rightRotation -= rotationDegree;
            rightDial.setAttribute('style', `transform: rotate(${rightRotation}deg);`)
            break;
        case 'left':
            leftRotation -= rotationDegree;
            leftDial.setAttribute('style', `transform: rotate(${leftRotation}deg);`)
            break;
        case 'right':
            leftRotation += rotationDegree;
            leftDial.setAttribute('style', `transform: rotate(${leftRotation}deg);`)
            break;
    }
}

function makeGrid(){

    // make the rows
    for (let row = 0; row < gridSize; row++){
        let newRow = document.createElement('div');
        newRow.setAttribute('style', 'display: grid; column-gap: 1px;');
        newRow.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

        // make the squares on each row
        for (let square = 0; square < gridSize; ++square){
            let newSquare = document.createElement('div');
            newSquare.setAttribute('style', 'background-color: white;')
            
            //Color each square if event listeners fired
            newSquare.addEventListener('mousedown', function(){
                turnDialsOnMouse(newSquare);
                colorThisSquare(newSquare);
                if (!keyBoardStickerShown){ // only do this once on first click on pad
                    keyBoardReminder.setAttribute('style', 'display: block;')
                    keyBoardStickerShown = true;
                    }
                currentSquarePosition = newSquare;
            }, false);
            
            newSquare.addEventListener('mouseover', function(){
                if (mouseIsDown){
                    turnDialsOnMouse(newSquare);
                    colorThisSquare(newSquare);
                    currentSquarePosition = newSquare;
                }
            }); 
            newRow.appendChild(newSquare);
        }
        sketchContainer.appendChild(newRow);
    }
}


// grid
let currentSquarePosition;
let previousSquare;
const sketchContainer = document.querySelector('#sketchContainer');
const gridSlider = document.getElementById('gridSize')
let output = document.getElementById('sliderOutput');
let gridSize = gridSlider.value;

output.innerHTML = gridSize + " x " + gridSize; // display default on start

gridSlider.oninput = function() { // update the slider output value
    output.innerHTML = this.value + " x " + this.value;
    }
document.getElementById('colorSelector').addEventListener('change', colorChange);
document.getElementById('gridSize').addEventListener('change', getGridSize);



// color
let selectedColor = 'black'; // default starting color
let color;
const waterColorCB = document.querySelector('#waterColor');
rainbowColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];



// mouse
let mouseIsDown = false; 
document.addEventListener('mousedown', function(){mouseIsDown = true});
document.addEventListener('mouseup', function(){mouseIsDown = false});
document.body.setAttribute('ondragstart', "return false;"); // stop dragging behaviour



// keyboard
document.addEventListener('keydown', keyDownFunc, false);
// prevent arrow controlling of buttons if changed or clicked during keyboard mode
window.addEventListener("keydown", function(e) { 
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);



// Animation  -shake the etch a sketch and clear the sketch
document.getElementById('shake').addEventListener('click', function(){
    document.getElementById('sketchWrapper').setAttribute('style', 'animation: shake 0.5s;')
    refreshGrid();
    makeGrid();
});
// once animation ended, remove the animation so it can be called again
document.getElementById('sketchWrapper').addEventListener('animationend', function(){
    document.getElementById('sketchWrapper').removeAttribute('style', 'animation: shake 0.5s;')
});

//dials
const leftDial = document.getElementById('leftDial');
const rightDial = document.getElementById('rightDial');
let leftRotation = 0;
let rightRotation = 0;
let rotationDegree = 10;

//keyboard reminder sticker
let keyBoardStickerShown = false;
const keyBoardReminder = document.getElementById('keyBoardReminder');

// init
window.onload(makeGrid());