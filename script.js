const colorsChoice = document.querySelector("#colorsChoice")
const game = document.querySelector('#game')
const cursor = document.querySelector('#cursor')
const media = document.querySelector('#media')
const cadenas = document.querySelector('#cadenas')

game.width = 1200
game.height = 600
const gridCellSize = 10

const ctx = game.getContext('2d');
const gridCtx = game.getContext('2d');

const colorList = ["#FFFFFF",
    "#FFEBEE", "#FCE4EC", "#F3E5F5", "#B39DDB", "#9FA8DA", "#90CAF9", "#81D4FA", "#80DEEA", "#5E86B8", "#508CC8", "#2F3476",
    "#4DB6AC", "#66BB6A", "#9CCC65", "#CDD3C9", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#B30000",
    "#D80000", "#A1887F", "#E0E0E0", "#90A4AE", "#000"]

let CurrentColorChoice = colorList[9]

const firebaseConfig = {
    apiKey: "AIzaSyD1IEp3iUqIQfocAYIfdSjWhEoKveK4d1s",
    authDomain: "pixelwar-ea6c7.firebaseapp.com",
    projectId: "pixelwar-ea6c7",
    storageBucket: "pixelwar-ea6c7.appspot.com",
    messagingSenderId: "745550461521",
    appId: "1:745550461521:web:c567275ceec7a9fc175670"
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

const delay = 10000; // 10s
let lastExecution = 0;

function checkTime_addPixel() {
    if ((lastExecution + delay) < Date.now()) {
        addPixelIntoGame()
        lastExecution = Date.now()
    }
}


function addPixelIntoGame() {
    const x = cursor.offsetLeft
    const y = cursor.offsetTop - game.offsetTop

    createPixel(x, y, CurrentColorChoice)


    const n = CTN(x, y)
    db.collection("pixels").doc("pixels").update({
        [n]: CurrentColorChoice,
    })


    countdown(delay)
    cadenas.style.display = "flex";
    setTimeout(() => { cadenas.style.display = "none" }, delay);
    document.getElementById("countdown").innerHTML = '10 secondes'


}
cursor.addEventListener('click', function (event) {
    checkTime_addPixel()
})
game.addEventListener('click', function () {
    checkTime_addPixel()
})


function drawGrids(ctx, width, height, cellWidth, cellHeight) {
    ctx.beginPath()
    ctx.strokeStyle = "#ccc"

    for (let i = 0; i < width; i++) {
        ctx.moveTo(i * cellWidth, 0)
        ctx.lineTo(i * cellWidth, height)
    }
    for (let i = 0; i < height + 1; i++) {
        ctx.moveTo(0, i * cellHeight)
        ctx.lineTo(width, i * cellHeight)
    }
    ctx.stroke()
}
drawGrids(gridCtx, game.width, game.height, gridCellSize, gridCellSize)

game.addEventListener('mousemove', function (event) {
    const cursorLeft = event.clientX - (cursor.offsetWidth / 2) + 5
    const cursorTop = event.clientY - (cursor.offsetHeight / 2) + 5

    cursor.style.left = Math.floor(cursorLeft / gridCellSize) * gridCellSize + "px"
    cursor.style.top = Math.floor(cursorTop / gridCellSize) * gridCellSize + "px"
})




function countdown(delay) {
    var timeleft = delay / 1000;
    var downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
            // document.getElementById("countdown").innerHTML = "Finished";
        } else {
            document.getElementById("countdown").innerHTML = timeleft - 1 + " secondes";
        }
        timeleft -= 1;
    }, 1000);
}


function CTN(x, y) {
    return x / 10 + (y / 10) * 120
}

function NTC(n) {
    const y = Math.floor(n / 120)
    const x = n - 120 * y
    return [10 * x, 10 * y]
}


db.collection('pixels').get().then(function (querySnapshot) {
    querySnapshot.docChanges().forEach(function (change) {
        console.log(typeof change.doc.data())
        for (const [n, color] of Object.entries(change.doc.data())) {
            // console.log(n)
            // console.log(color)
            // console.log(n)

            const [x, y] = NTC(Number(n))
            // console.log(x, y)

            createPixel(x, y, color)
        }
    })
})


// for (let i = 3000; i < 4000; i++) {
//     db.collection("pixels").doc("pixels").update({
//         [i]: "#B39DDB",
//     })
// }