const sketchContainer = document.querySelector('#sketchContainer');


sketchContainer.style.width = '530px'
sketchContainer.style.height = '530px'

const gridSize = 20;

for (let row = 0; row < gridSize; row++){
    let newRow = document.createElement('div');
    newRow.setAttribute('style', 'display: grid; column-gap: 1px;');
    newRow.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    for (let square = 0; square < gridSize; square++){
        let newSquare = document.createElement('div');
        newSquare.setAttribute('style', 'background-color: white;')
        newRow.appendChild(newSquare);
    }
    sketchContainer.appendChild(newRow);
}