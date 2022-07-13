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
const keyboardMode = document.querySelector('#keyboardCheck');
keyboardMode.addEventListener('change', startKeyBoardMode);

const sketchRightDiv = document.getElementById('sketchRight')
const sketchLeftDiv = document.getElementById('sketchLeft')

function startKeyBoardMode(){
    if (this.checked){
        refreshGrid();
        runMain();
        sketchRightDiv.innerText = "Click anywhere on the grid as the starting point for the keyboard";
        sketchRightDiv.setAttribute('style', "display: block;")
        
        const keyBoardHelper = () =>{
            sketchRightDiv.setAttribute('style', "display: none;")
            sketchContainer.removeEventListener('click', keyBoardHelper);
            sketchContainer.setAttribute('style', 'pointer-events: none'); // remove mouse input, keyboard only
            sketchLeftDiv.innerText = "Tap the arrow keys to draw!\n\nUnselect keyboard mode to use the mouse again.";
            sketchLeftDiv.setAttribute('style', "display: block;")
        }
        sketchContainer.addEventListener('click', keyBoardHelper)
        
    }else{
        sketchRightDiv.setAttribute('style', "display: none;")
        sketchLeftDiv.setAttribute('style', "display: none;")
        sketchContainer.setAttribute('style', 'pointer-events: auto'); // reinstate mouse input
    }
}

