const isIphone = navigator.userAgent.toLowerCase().includes("iphone")
const isAndroid = navigator.userAgent.toLowerCase().includes("android")
const isMobile = isIphone || isAndroid
const width = (isMobile) ? window.screen.width * window.devicePixelRatio : 750
const height = (isMobile) ? window.screen.height * window.devicePixelRatio : 1334
// TODO make offset customizable
const imageTop = height * ((isIphone) ? .31 : .35)
const iPhoneSEOverlay = "overlay/iphone-se.png";
const iPhoneTallOverlay = "overlay/iphone-tall.png";
const overlay = getScreenOverlay()

let canvas = undefined
let ctx = undefined
const image = new Image

const state = {
    background: "#000000",
    imageFile: undefined,
    drawOverlay: true,
}

const onLoaded = (event) => {
    const canvas = document.getElementById("canvas")
    onCanvasCreated(canvas)

    const imageInput = document.getElementById("image-file")
    imageInput.onchange = event => setImageFile(event.target.files[0])
    state.imageFile = imageInput.files[0]
    // canvas.onclick = () => imageInput.click()
    canvas.addEventListener("click", () => imageInput.click())

    const backgroundInput = document.getElementById("background-color")
    state.background = randomColor()
    backgroundInput.value = state.background
    backgroundInput.onchange = event => setBackgroundColor(event.target.value)

    document.getElementById("download-button").onclick = downloadWallpaper

    render()
}

const onCanvasCreated = c => {
    canvas = c
    const widthRatio = width / height
    console.log(`calc(var(--height) * ${widthRatio})`)
    canvas.style.width = `calc(var(--height) * ${widthRatio})`

    canvas.width = width
    canvas.height = height
    ctx = canvas.getContext("2d")
}

const setBackgroundColor = color => {
    state.background = color
    render()
}

const setImageFile = file => {
    state.imageFile = file
    render()
}

const setDrawImageBackground = draw => {
    state.drawImageBackground = draw
    render()
}

const render = () =>
    drawBackground(state.background)
        .then(() => drawImageWithBackground(state.imageFile, "#ffffff", true))
        .then(() => drawLockScreenOverlay(state.drawOverlay))

const drawBackground = async background => {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const drawImageWithBackground = (file, background, drawBackground) => new Promise(resolve => {
    if (file) {
        image.onload = () => {
            const dw = canvas.width
            const dh = dw * image.height / image.width
            if (drawBackground) {
                ctx.fillStyle = background
                ctx.fillRect(0, imageTop, dw, dh)
            }
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, imageTop, dw, dh)
            resolve()
        }
        image.src = URL.createObjectURL(file)
        URL.revokeObjectURL(file)
    } else {
        resolve()
    }
})

function getScreenOverlay() {
    const tallAspectRatio = Math.round(19.5 / 9 * 100)
    const seAspectRatio = Math.round(16 / 9 * 100)
    const currentAspectRatio = Math.round(height / width * 100)
    const tallDiff = Math.abs(currentAspectRatio - tallAspectRatio)
    const seDiff = Math.abs(currentAspectRatio - seAspectRatio)
    const isTall = tallDiff < seDiff
    return isTall ? iPhoneTallOverlay : iPhoneSEOverlay;
}

const drawLockScreenOverlay = draw => new Promise(resolve => {
    if (draw) {
        image.onload = () => {
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)
            resolve()
        }
        image.src = overlay
    } else {
        resolve()
    }
})

const downloadWallpaper = () => {
    const lastDrawOverlay = state.drawOverlay
    new Promise(resolve => {
        state.drawOverlay = false
        resolve()
    })
        .then(render)
        .then(() => {
            var link = document.createElement('a')
            link.download = 'qr-wallpaper.png'
            link.href = canvas.toDataURL()
            link.click();
        })
        .then(() => state.drawOverlay = lastDrawOverlay)
        .then(render)
}

const colors = [
    "#DDA0DD",
    "#FFC0CB",
    "#B0E0E6",
    "#4169E1",
    "#F4A460",
    "#2E8B57",
    "#A0522D",
    "#708090",
    "#D2B48C",
]
function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)]
}

document.addEventListener("DOMContentLoaded", onLoaded);
