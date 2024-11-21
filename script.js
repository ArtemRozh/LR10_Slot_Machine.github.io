const slots1 = document.querySelectorAll(".slot-row:nth-child(2) .slot");
const slots2 = document.querySelectorAll(".slot-row:nth-child(4) .slot");
const slots3 = document.querySelectorAll(".slot-row:nth-child(6) .slot");
const drawBtn = document.getElementById("drawBtn");
const overlay = document.getElementById("overlay");
const verdict = document.getElementById("verdict");
const lowerContaier = document.getElementById("lowerContaier");
const playerName = document.getElementById("playerName");
let globalSpins = 0, globalCount = 0, totalInARow = 0, totalCount = 0;
let isTyping = false;

let slotImages = [
    { value: 1, imgPath: "IMG/orange.png" },
    { value: 2, imgPath: "IMG/grape.png" },
    { value: 3, imgPath: "IMG/cherries.png" },
    { value: 4, imgPath: "IMG/watermelon.png" },
    { value: 5, imgPath: "IMG/bar.png" },
    { value: 6, imgPath: "IMG/diamond.png" },
    { value: 7, imgPath: "IMG/777.png" }
];
let availableImages = slotImages.slice();
let res = [ ];

let tempName = prompt("Введіть ваше ім'я. До 23 символів. Якщо не вміщується викорстовуйте абревіатури");
if(tempName === null || tempName.trim() === "" || tempName.length >= 24){
    playerName.innerHTML = "Default Player";
    tempName = "Default Player";
} else{
    playerName.innerHTML = tempName.trim();
}


function slotSpin(slots, delay){
    let totalSpins = 0;

    slots.forEach((slot) => {
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            let image = slot.querySelector("img");
            image.src = availableImages[Math.floor(Math.random() * availableImages.length)].imgPath;
            spinCount++;

            if (spinCount >= 30 + delay) {
                clearInterval(spinInterval);
                let index = Math.floor(Math.random() * availableImages.length);
                image.src = availableImages[index].imgPath;

                res.push(availableImages[index].value);
                availableImages.splice(index,1);

                totalSpins++;
                if(totalSpins === 3){
                    availableImages = slotImages.slice();
                    whenDone();
                }
            }
        }, 50);
    });
}

function addAnimation(lines){
    const someLines = document.querySelectorAll(lines);
    someLines.forEach((line) => {
        line.classList.add("glow");
    });
}

function removeAnimation(lines){
    const someLines = document.querySelectorAll(lines);
    someLines.forEach((line) => {
        line.classList.remove("glow");
    });
}

function removeAllAnimation(){
    removeAnimation(".red");
    removeAnimation(".gold");
    removeAnimation(".blue");
    removeAnimation(".green");
    removeAnimation(".purple");
}

function whenDone(){
    globalSpins++;


    if(globalSpins === 3){
		if((res[0] === res[3]) && (res[3] === res[6])){
            addAnimation(".red");
            totalInARow++;
		}
        if((res[1] === res[4]) && (res[4] === res[7])){
			addAnimation(".gold");
            totalInARow++;
		}
        if((res[2] === res[5]) && (res[5] === res[8])){
			addAnimation(".blue");
            totalInARow++;
		}
        if((res[0] === res[4]) && (res[4] === res[8])){
			addAnimation(".green");
            totalInARow++;
		}
        if((res[6] === res[4]) && (res[4] === res[2])){
            addAnimation(".purple");
            totalInARow++;
		}

        drawBtn.disabled = false;
        globalSpins = 0;
        res = [];

        if(globalCount === 3){
            totalCount++;
            gameEnd();
        }

    }
}

function gameEnd(){
    overlay.style.display = "flex";
    let speechAdd;
    if(totalInARow === 0){
        speechAdd = "Жодного в ряд! Програш.";
    } else {
        speechAdd = `Перемога! ${totalInARow} раз в ряд`;
    }
    let victorySpeech = `Кінець гри!<br>
    <hr class="divider">
    ${speechAdd}<br>
    Спроба номер ${totalCount}<br>
    <hr class="divider">
    Натисність будь де щоб почати знов....
    `;

    typeWriter("verdict", victorySpeech, 35);
}

overlay.addEventListener('click', function() {
    if (isTyping) {  
        resetGame(); 
    }
});

function resetGame(){
    overlay.style.display = "none";
    globalCount = 0;
    totalInARow = 0;

    lowerContaier.innerText = `${globalCount} з 3`
}

drawBtn.addEventListener("click", ()=>{
    removeAllAnimation();

    slotSpin(slots1, 0);
    slotSpin(slots2, 20);
    slotSpin(slots3, 40);
    drawBtn.disabled = true;

    globalCount++;
    lowerContaier.innerText = `${globalCount} з 3`

});

function typeWriter(elementId, text, speed) {
    let i = 0;
    let element = document.getElementById(elementId);

    element.innerHTML = '';

    let interval = setInterval(function () {
        if (i < text.length) {
            let current = text[i];
            if (current === '<') {
                let tagEndIndex = text.indexOf('>', i);
                let tag = text.substring(i, tagEndIndex + 1);
                element.innerHTML += tag; 
                i = tagEndIndex + 1;
            } else {
                element.innerHTML = text.substring(0, i + 1);
                i++;
            }
        } else {
            clearInterval(interval);
            isTyping = true;
        }
    }, speed);
}
