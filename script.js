const colorsChoice = document.querySelector("#colorsChoice")
const game = document.querySelector('#game')
const cursor = document.querySelector('#cursor')
const media = document.querySelector('#media')

game.width = 1200
game.height = 600
const gridCellSize = 10

const ctx = game.getContext('2d');
const gridCtx = game.getContext('2d');

const colorList = ["#FFFFFF",
    "#FFEBEE", "#FCE4EC", "#F3E5F5", "#B39DDB", "#9FA8DA", "#90CAF9", "#81D4FA", "#80DEEA",
    "#4DB6AC", "#66BB6A", "#9CCC65", "#CDD3C9", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722",
    "#A1887F", "#E0E0E0", "#90A4AE", "#000"]

let CurrentColorChoice = colorList[9]

const firebaseConfig = {
    apiKey: "AIzaSyAN8qsATSFFWYs3ztAfAlLDuj6PqWcpNvc",
    authDomain: "pixels-war-ffe2d.firebaseapp.com",
    projectId: "pixels-war-ffe2d",
    storageBucket: "pixels-war-ffe2d.appspot.com",
    messagingSenderId: "255969941905",
    appId: "1:255969941905:web:ff1f098e1257e6359b6230"
};
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

colorList.forEach(color => {
    const colorItem = document.createElement('div')
    colorItem.style.backgroundColor = color
    // colorItem.style.display = "inline-block"
    // colorItem.style.margin = "20px"

    colorItem.addEventListener('click', () => {
        CurrentColorChoice = color

        // colorItem.innerHTML = `<i class="fa-solid fa-check"></i>`

        // setTimeout(() => {
        //     colorItem.innerHTML = ''
        // }, 1000)
    })

    colorsChoice.appendChild(colorItem)
})

function createPixel(x, y, color) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x, y, gridCellSize, gridCellSize)
}


function addPixelIntoGame() {
    const x = cursor.offsetLeft
    const y = cursor.offsetTop - game.offsetTop

    createPixel(x, y, CurrentColorChoice)



    const pixel = {
        x, y,
        color: CurrentColorChoice
    }

    const pixelRef = db.collection('pixels').doc(`${pixel.x}-${pixel.y}`)
    pixelRef.set(pixel, { merge: true })
}
cursor.addEventListener('click', function (event) {
    addPixelIntoGame()
})
game.addEventListener('click', function () {
    addPixelIntoGame()
})


function drawGrids(ctx, width, height, cellWidth, cellHeight) {
    ctx.beginPath()
    ctx.strokeStyle = "#ccc"

    for (let i = 0; i < width; i++) {
        ctx.moveTo(i * cellWidth, 0)
        ctx.lineTo(i * cellWidth, height)
    }
    for (let i = 0; i < height; i++) {
        ctx.moveTo(0, i * cellHeight)
        ctx.lineTo(width, i * cellHeight)
    }
    ctx.stroke()
}
drawGrids(gridCtx, game.width, game.height, gridCellSize, gridCellSize)

game.addEventListener('mousemove', function (event) {
    const cursorLeft = event.clientX - (cursor.offsetWidth / 2) + 1
    const cursorTop = event.clientY - (cursor.offsetHeight / 2) + 1

    cursor.style.left = Math.floor(cursorLeft / gridCellSize) * gridCellSize + "px"
    cursor.style.top = Math.floor(cursorTop / gridCellSize) * gridCellSize + "px"
})

db.collection('pixels').onSnapshot(function (querySnapshot) {
    querySnapshot.docChanges().forEach(function (change) {
        console.log(change.doc.data())
        const { x, y, color } = change.doc.data()

        createPixel(x, y, color)
    })
})