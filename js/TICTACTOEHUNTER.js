// mensajes del juego exmp el mensaje draw-empate, win x , win o 
const STATUS_DISPLAY = document.querySelector('.game-notification'),
  // este es el table del game que esta vacio al inicio 
  GAME_STATE = ["", "", "", "", "", "", "", "", ""],
  // convinaciones para una win
  WINNINGS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],
  // toodo esto son los diferentes cambios de texto que tenemos en el h2 que creamos en el html es un ejemplo de 
  // js moderno ejmp WIN_MESSAGE  es una manera rapida de crear un msj perzonalizado en este caso el msj es del jugador X o O a ganado 
  // Msj del ganador ya sea X- JUGADOR else O- PC
  WIN_MESSAGE = () => `El jugador ${currentPlayer} ha ganado!`,
  // Msj de draw 
  DRAW_MESSAGE = () => `El juego ha terminado en empate!`,
  // Msj de turno 
  CURRENT_PLAYER_TURN = () => `Turno del jugador ${currentPlayer}`

// con esto el juego esta activo y no quize darme dolor de cabeza asi que preferi que la pc siempre iniciara el juego
//lo siento soy muy vago lo se 
let gameActive = true,
  currentPlayer = "O"

// estas variables lo que hacen es buscar en el LS el marcador guardado para iniciar el juego apartir de ahi.
//si exiten datos en el LS iniciara el marcador desde lo existente 
let contadorX = parseInt(localStorage.getItem('contadorX')) || 0
let contadorO = parseInt(localStorage.getItem('contadorO')) || 0

// estas variables const se encargan de buscar el contador por ID anteriormente creado en el html 
const contadorXD = document.getElementById('contadorX')
const contadorOD = document.getElementById('contadorO')

// muestra los contadores al iniciar el juego 
contadorXD.innerText = contadorX
contadorOD.innerText = contadorO

// Funcion principal del juego totalmente necesaria, estuve 20min peliando con esto ni preguntes 
function main() {
  // esto utiliza la funcion  handleStatusDisplay para que los mensajes creados con STATUS_DISPLAY
  // tambien muestren el turno de cada jugador 
  handleStatusDisplay(CURRENT_PLAYER_TURN())
  // Agregamos sapos de eventos osea oyentes 
  listeners()
  // esto es por vago para que tenga logica que siempre empieze el jugador O en este caso la pc de primero 
  //anteriormente en currentPlayer asigne que siempre empieze el jugador "O" para asi lograr que la pc empieze de primero 
  if (currentPlayer === "O") {
    computerMove()
  }
}

// esta funcion se encarga de agregar dos sapos bien chismosos para cuando demos click en una de las celdas o cajas o boxes
function listeners() {
  document.querySelector('.game-container').addEventListener('click', handleCellClick) // para marcar con X cada que demos click en una de las celdas
  document.querySelector('.game-restart').addEventListener('click', handleRestartGame) //para reiniciar el juego o tablero cada q demos click
}
//esta es la funcion que toma sentido con la linea 2  para dar msj 
function handleStatusDisplay(message) {
  STATUS_DISPLAY.innerHTML = message
}

//reinicia el juego por completo para que empieze el jugador O en este caso la pc
function handleRestartGame() {
  gameActive = true
  currentPlayer = "O"
  restartGameState()
  handleStatusDisplay(CURRENT_PLAYER_TURN())
  document.querySelectorAll('.game-cell').forEach(cell => cell.innerHTML = "")
  computerMove()
}

// Qué pasa cuando hacemos clic en una celda del juego
function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target
  // Solo hacemos algo si hacemos clic en una celda del juego
  if (clickedCell.classList.contains('game-cell')) {
    const clickedCellIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell)
    // Si no hay mas celdas o si la celda esta ocupada o si el juego a terminado no pasara nada si clickeamos en una celda 
    if (GAME_STATE[clickedCellIndex] !== '' || !gameActive) {
      return false
    }
    // Jugamos en la celda y validamos el resultado
    handleCellPlayed(clickedCell, clickedCellIndex)
    handleResultValidation()
  }
}

// Ponemos la jugada en la celda
function handleCellPlayed(clickedCell, clickedCellIndex) {
  GAME_STATE[clickedCellIndex] = currentPlayer
  clickedCell.innerHTML = currentPlayer
}

// Revisamos si alguien ha ganado, si hay un empate o si el juego continúa
function handleResultValidation() {
  let roundWon = false
  for (let i = 0; i < WINNINGS.length; i++) {
    const winCondition = WINNINGS[i]
    let position1 = GAME_STATE[winCondition[0]],
      position2 = GAME_STATE[winCondition[1]],
      position3 = GAME_STATE[winCondition[2]]

    // Si alguna posición está vacía, seguimos jugando
    if (position1 === '' || position2 === '' || position3 === '') {
      continue
    }
    // si se cumple la win codition o WINNINGS uno de los jugadores a ganado
    if (position1 === position2 && position2 === position3) {
      roundWon = true
      break
    }
  }

  if (roundWon) {
    handleStatusDisplay(WIN_MESSAGE())
    gameActive = false
    updateCounter()
    return
  }

  // es del draw basicamente si no hay mas espacios en el tablero vacios y nadie a ganado es un empate y termina el juego 
  let roundDraw = !GAME_STATE.includes("")
  if (roundDraw) {
    handleStatusDisplay(DRAW_MESSAGE())
    gameActive = false
    return
  }

  // cambiamos de jugador 
  handlePlayerChange()
}

// son los cambios de jugadores 
function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X"
  handleStatusDisplay(CURRENT_PLAYER_TURN())
  if (currentPlayer === "O" && gameActive) {
    computerMove()
  }
}

// esto es la funcionalidad de la computadora 
function computerMove() {
  let availableCells = []
  for (let i = 0; i < GAME_STATE.length; i++) {
    if (GAME_STATE[i] === "") {
      availableCells.push(i)
    }
  }

  if (availableCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCells.length)
    const cellIndex = availableCells[randomIndex]
    const cell = document.querySelectorAll('.game-cell')[cellIndex]

    handleCellPlayed(cell, cellIndex)
    handleResultValidation()
  }
}

// restablecemos el tablero para volver a jugar con el btn jugar de nuevo
function restartGameState() {
  let i = GAME_STATE.length
  while (i--) {
    GAME_STATE[i] = ''
  }
}

// actualiza los marcadores  con la funcion de updateCounter 
function updateCounter() {
  if (currentPlayer === "X") {
    contadorX++
    contadorXD.innerText = contadorX
    localStorage.setItem('contadorX', contadorX)
  } else if (currentPlayer === "O") {
    contadorO++
    contadorOD.innerText = contadorO
    localStorage.setItem('contadorO', contadorO)
  }
}
function playAudio(){
document.getElementById("audio").play();
}

//start game 
main()
// mi mala praxis de NO usar ; al final de cada linea, lo siento por eso pero ya se hace costumbre 
//descubri como  usar math.random apubto de ver videos y leyendo al final pude implementarlos 
// WIN_MESSAGE, CURRENT_PLAYER_TURN aprendi a usar esto como manera rapida para agregar un msj 
//tu ve duddas sobre la implementacion del math al inicio pero luego ya pude investigar mas a fondo el tema y logre entender almenos la funcionalidad del math 
// y los requesitos minimos para q este funcione  .
// intente implementar un metodo "nuevo" o alemnos yo no conocia en el css para que el neon tuviera un efecto pero tendria que haber cambiado
// mucha parte de mi codigo y la vertdad no me apetece 
//es todo me alegra a ver tratado de cumplir sus espectativas 
// 





