const canvas = document.querySelector("canvas")
// Aqui estou dando contexto ao canvas
const ctx = canvas.getContext("2d")

const score = document.querySelector('.score--value')
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector('.btn-play')

const audio = new Audio("../asserts/audio.mp3")

const size = 30;

const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition]

const increamentScore = () => {
    score.innerText = parseInt(score.innerText) + 1
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId


//função para desenhar comida
const drawfood = () => {
    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}


//Função para desenha a cobrinha
const drawSnake = () => {
    ctx.fillStyle = "#ddd";
    snake.forEach((position, index) => {

        if (index == snake.length - 1) {
            ctx.fillStyle = "purple";
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}

//função que move a cobra
const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}


// Essa função checa se a cobra comeu 

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        increamentScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        //Esse while garante que a comida não vaiser criada em cima da cobrinha
        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()

    }
}

//Essa função vai checar as colisões

const checkColision = () => {
const head = snake[snake.length - 1]
const canvasLimit = canvas.width - size
const neckIndex = snake.length - 2

const wallColision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

const selfColision = snake.find((position, index) => {
return index <neckIndex && position.x == head.x && position.y == head.y
})

if (wallColision || selfColision){
    gameOver()
    
}
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter ="blur(2px)"
}

//Looping do jogo
const gameloop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawfood()
    drawGrid()
    moveSnake()
    drawSnake()
    checkEat()
    checkColision()

    loopId = setTimeout(() => {
        gameloop()
    }, 300)
}
gameloop()

//movimentação com as setas
document.addEventListener("keydown", ({ key }) => {

    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }
    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }
    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})

