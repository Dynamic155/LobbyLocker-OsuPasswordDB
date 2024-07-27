const cartDiv = document.getElementById('chart-div')
const canvas = document.getElementById('chart')
const fx = (x, a, b, c) => 1/( a + Math.pow( Math.E, -(x/b) + c ))
/** @type {CanvasRenderingContext2D} */
var ctx;


function drawSlice(x, y, radius, startAngle, endAngle, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x + Math.cos(startAngle) * radius, y + Math.sin(startAngle) * radius)
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.lineTo(x, y)
    ctx.lineTo(x + Math.cos(startAngle) * radius, y + Math.sin(startAngle) * radius)
    ctx.fill()
    ctx.closePath()
}

function drawChart(x, y, radius, items, rotation = 0) {
    var totalWeight = 0
    for (let i = 0; i < items.length; i++) {
        totalWeight += items[i].weight
    }
    var previous = 0
    const totalAngle = Math.PI*2
    for (let i = 0; i < items.length; i++) {
        const element = items[i]
        const angle = totalAngle * (element.weight/totalWeight)
        drawSlice(x, y, radius, rotation + previous, rotation + previous + angle, element.color)
        previous += angle
    }

    // border
    ctx.strokeStyle = "#2b2e36"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.stroke()
    ctx.closePath
}

async function main() {
    const size = { w: cartDiv.clientWidth, h: cartDiv.clientHeight}

    const newCanvas = document.createElement('canvas')
    newCanvas.setAttribute("width", size.w)
    newCanvas.setAttribute("height", size.h)
    newCanvas.setAttribute("id", "canva")
    cartDiv.innerHTML = newCanvas.outerHTML

    const c = /** @type {HTMLCanvasElement} */ (document.getElementById("canva"));
    ctx = (c.getContext("2d"));
    const stats = await getStat() 
    var rot = 0
    var i = 0
    setInterval(() => {
        i++
        rot += fx(i, 5, 60, 5)
        ctx.clearRect(0, 0, size.w, size.h) 
        drawChart(size.w/2, size.h/2, size.w/2 * 0.9, stats, rot/800)
    }, 10);
}

async function getStat() {
    const response = await fetch('http://127.0.0.1:8989/passwords')
    const data = await response.json()

    // sort list
    var passwords = []
    for (let i = 0; i < data.length; i++) {
        const passwd = data[i].passwd;
        const index = passwords.lastIndexOf(passwd)
        if (index === -1) {
            passwords.push(passwd)
            continue
        }
        passwords.splice(index, 0, passwd)
    }

    // count password occurrences
    var countedPasswords = []
    var count = 0
    for (let i = 1; i < passwords.length + 1; i++) {
        count++
        if (passwords[i - 1] === passwords[i]) continue
        countedPasswords.push({ weight: count, id: passwords[i - 1] })
        count = 0
    }

    // coloring
    const startColor = "#c1cfec";
    const endColor = "#596885";

    const startRGB = [
        parseInt(startColor.slice(1, 3), 16),
        parseInt(startColor.slice(3, 5), 16),
        parseInt(startColor.slice(5, 7), 16) 
    ];

    const endRGB = [
        parseInt(endColor.slice(1, 3), 16),  
        parseInt(endColor.slice(3, 5), 16),  
        parseInt(endColor.slice(5, 7), 16)   
    ];

    const ratios = {
        red: (endRGB[0] - startRGB[0]) / countedPasswords.length,
        green: (endRGB[1] - startRGB[1]) / countedPasswords.length,
        blue: (endRGB[2] - startRGB[2]) / countedPasswords.length
    };

    for (let i = 0; i < countedPasswords.length; i++) {
        const element = countedPasswords[i];
        const r = parseInt((startRGB[0] + ratios.red * i).toFixed(0)).toString(16).padStart(2, '0');
        const g = parseInt((startRGB[1] + ratios.green * i).toFixed(0)).toString(16).padStart(2, '0');
        const b = parseInt((startRGB[2] + ratios.blue * i).toFixed(0)).toString(16).padStart(2, '0');
        element.color = `#${r}${g}${b}`;
    }

    return countedPasswords
}

main()
