document.addEventListener("DOMContentLoaded", () => {
    const grid=document.querySelector('.grid');
    let squares= Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startButton = document.querySelector('#start-button');
    
    const ancho = 10;
    let newRandom = 0;
    let timerId;

    //Cargar  tetrominos con sus diferentes rotaciones
    const lTetra=[
        [1, ancho+1, ancho*2+1, 2],
        [ancho, ancho+1, ancho+2, ancho*2+2],
        [1, ancho+1, ancho*2+1, ancho*2],
        [ancho, ancho*2, ancho*2+1, ancho*2+2]
    ]; 

    const zTetra=[
        [0,ancho,ancho+1,ancho*2+1],
        [ancho+1, ancho+2,ancho*2,ancho*2+1],
        [0,ancho,ancho+1,ancho*2+1],
        [ancho+1, ancho+2,ancho*2,ancho*2+1]
    ];

    const tTetra=[
        [1,ancho,ancho+1,ancho+2],
        [1,ancho+1,ancho+2,ancho*2+1],
        [ancho,ancho+1,ancho+2,ancho*2+1],
        [1,ancho,ancho+1,ancho*2+1]
    ];

    const oTetra=[
        [0,1,ancho,ancho+1],
        [0,1,ancho,ancho+1],
        [0,1,ancho,ancho+1],
        [0,1,ancho,ancho+1]
    ];

    const iTetra=[
        [1,ancho+1,ancho*2+1,ancho*3+1],
        [ancho,ancho+1,ancho+2,ancho+3],
        [1,ancho+1,ancho*2+1,ancho*3+1],
        [ancho,ancho+1,ancho+2,ancho+3]
    ];

    const tetrominos = [lTetra, zTetra, tTetra, oTetra, iTetra];
   
    let actualPosition = 4;
    let actualRotation = 0;

    let random = Math.floor(Math.random()*tetrominos.length);
    //Seleccion del tetromino aleatoria
    let actual = tetrominos[random][actualRotation];
    //let actual = tetrominos[0][1];


    //Dibujar el tetromino en el grid

    function draw(){
        actual.forEach(index=>{
            squares[actualPosition+index].classList.add('tetromino');
        })
    }

    //draw();
//Eliminamos el tetromino del grid
    function unDraw(){
        actual.forEach(index =>{
            squares[actualPosition+index].classList.remove('tetromino');
        })
    }

    
//Mover el tetromino para abajo
//let intervalo= setInterval(moveDown, 300);
function moveDown(){
    unDraw();
    actualPosition+=ancho;
    draw();
    freeze();
}
//Congelar tetramino e iniciar nuevo tetramino
    function freeze(){
        if(actual.some(index => squares[actualPosition + index + ancho].classList.contains('taken'))) {
            actual.forEach(index => squares[actualPosition + index].classList.add('taken'));
            //Inicia nuevo tetramino
            random = newRandom;
            console.log(random);
            newRandom= Math.floor(Math.random()*tetrominos.length);
            //Seleccion del tetromino aleatoria
             actual = tetrominos[random][actualRotation];
             actualPosition = 4;
            draw();
        }

    }

    

    function moveLeft(){
        unDraw();
        const isAtLeftEdge = actual.some(index => (actualPosition + index) % ancho === 0);
        if(!isAtLeftEdge) actualPosition -= 1;

        if(actual.some(index => squares[actualPosition + index].classList.contains('taken'))) {
            actualPosition += 1;
        }
        draw();
        
    }
    function moveRigth(){
        unDraw();
        const isAtRigthEdge = actual.some(index => (actualPosition + index) % ancho === ancho-1);
        if(!isAtRigthEdge) actualPosition += 1;
        if(actual.some(index => squares[actualPosition + index].classList.contains('taken'))) {
            actualPosition -= 1;
        }
        draw();
    }

    function rotate(){
        unDraw();
        actualRotation++;
        if(actualRotation === actual.length) {
            actualRotation = 0;
        }
        actual = tetrominos[random][actualRotation];
        draw();
    }

    function control(e){
        if(e.keyCode === 37){
            moveLeft();
        }else if(e.keyCode === 39){
            moveRigth();
        }else if(e.keyCode === 40){
            moveDown();
        }else if(e.keyCode === 38){
            rotate();
        }
    }
    document.addEventListener('keyup', control);

    startButton.addEventListener('click', ()=>{
        if(!timerId){
            draw();
            timerId = true;
            intervalo = setInterval(moveDown, 300);
        }else {
            clearInterval(intervalo);
            timerId = false;
            intervalo = null;   

        }
    })
});