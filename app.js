document.addEventListener("DOMContentLoaded", () => {
    const grid=document.querySelector('.grid');
    let squares= Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startButton = document.querySelector('#start-button');
    const reloadButton = document.querySelector('#reload-button');
    const levelSelect = document.querySelector('#level-select');
    const touchArea = document.getElementById('touchArea');
 
    let levelOptionSelect;
    
    const ancho = 10;
    let newRandom = 0;
    let timerId;
    let score=0;

    const colors = [
        'purple',
        'orange',
        'red',
        'black',
        'green'
    ];

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

    //Dibujar el tetromino en el grid

    function draw(){
        actual.forEach(index=>{
            squares[actualPosition+index].classList.add('tetromino');
            squares[actualPosition+index].style.backgroundColor=colors[random];
        })
    }

//Eliminamos el tetromino del grid
    function unDraw(){
        actual.forEach(index =>{
            squares[actualPosition+index].classList.remove('tetromino');
            squares[actualPosition+index].style.backgroundColor='';
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
            //console.log(random);
            newRandom= Math.floor(Math.random()*tetrominos.length);
            //Seleccion del tetromino aleatoria
             actual = tetrominos[random][actualRotation];
             actualPosition = 4;
            draw();
            addScore();
            endGame();
           
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


    function isAtRigthEdge(){
        return actual.some(index => (actualPosition + index+1) % ancho === 0);
    }

    function isAtLeftEdge(){
        return actual.some(index => (actualPosition + index) % ancho === 0);
    }

    function checkRotatePosition(P){
        P = P || actualPosition;
        if((P+1) % ancho <4){
            if(isAtRigthEdge()){
                actualPosition += 1;
                checkRotatePosition(P);
            }
        }else if(P % ancho > 5){
            if(isAtLeftEdge()){
                actualPosition -= 1;
                checkRotatePosition(P);
            }
        }
    }

    function rotate(){
        unDraw();
        actualRotation++;
        if(actualRotation === actual.length) {
            actualRotation = 0;
        }
        actual = tetrominos[random][actualRotation];
        checkRotatePosition();
        draw();
    }

    function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }
  
      if (isMobile()) {
        
    let touchStartX = 0;
    let touchStartY = 0;

    touchArea.addEventListener('touchstart', function(event) {
      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    });

    touchArea.addEventListener('touchend', function(event) {
      const touch = event.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          moveRight();
        } else {
          moveLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          moveDown();
        } else {
          rotate();
        }
      }

      levelSelect.addEventListener('change', ()=>{
        console.log("Seleccion en evento opcioneos"+levelSelect.value);
        levelOptionSelect=levelSelect.value;
       
    });
    //Eveventos de los botones
    startButton.addEventListener('touchend', ()=>{
        if(!timerId){
            draw();
            timerId = true;
            //intervalo = setInterval(moveDown, 600);
            if(levelOptionSelect==='1'){

                intervalo = setInterval(moveDown, 600);
            }else if(levelOptionSelect==='2'){
                
                intervalo = setInterval(moveDown, 400);
            }else if(levelOptionSelect==='3'){
                
                intervalo = setInterval(moveDown, 200);
            }else{
                alert("Por favor seleccione un nivel");
                window.location.reload();
            }
        }else  {
            clearInterval(intervalo);
            timerId = false;
            intervalo = null;   

        }
    })

    reloadButton.addEventListener('touchend', ()=>{
        window.location.reload();
    })
    });

      } else {
        document.addEventListener('keyup', control);
      }
//Eventos del teclado
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
    //document.addEventListener('keyup', control);

   // const touchArea = document.getElementById('touchArea');

    
      levelSelect.addEventListener('change', ()=>{
        console.log("Seleccion en evento opcioneos"+levelSelect.value);
        levelOptionSelect=levelSelect.value;
       
    });
    //Eveventos de los botones
    startButton.addEventListener('click', ()=>{
        if(!timerId){
            draw();
            timerId = true;
            //intervalo = setInterval(moveDown, 600);
            if(levelOptionSelect==='1'){

                intervalo = setInterval(moveDown, 600);
            }else if(levelOptionSelect==='2'){
                
                intervalo = setInterval(moveDown, 400);
            }else if(levelOptionSelect==='3'){
                
                intervalo = setInterval(moveDown, 200);
            }else{
                alert("Por favor seleccione un nivel");
                window.location.reload();
            }
        }else  {
            clearInterval(intervalo);
            timerId = false;
            intervalo = null;   

        }
    })

    reloadButton.addEventListener('click', ()=>{
        window.location.reload();
    })
//Puntaje, y actualización de grid
    function addScore(){
        for (let i=0; i<199; i+=ancho){
            const row=[i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor='';
                });
                const squaresRemoved = squares.splice(i, ancho);
                squares=squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
                
            }
        }
    }

//Terminación de juego, y reinicio
    function endGame(){
        if(actual.some(index => squares[actualPosition+index].classList.contains('taken'))){
            clearInterval(intervalo);
            timerId=false;
            alert('Game Over. Score: '+score);
            scoreDisplay.innerHTML='Game over';
            startButton.setAttribute('hidden', true);
           // reloadButton.removeAttribute('hidden', false);
           
        }
    }
   
});