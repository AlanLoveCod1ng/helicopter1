// @ts-check
export {};

// somewhere in your program you'll want a line
// that looks like:



const rotorWidth = 3
const rotorLength = 40


const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
let scoreText = document.getElementById("score");
const context = canvas.getContext("2d");
function drawCopter(initialX, initialY, initialAngel, currentTime){
    //draw body
    context.save();
        //draw body
        context.translate(initialX,initialY);
        context.rotate(initialAngel);

        context.fillStyle = "blue";
        // context.fillRect(-frontLength/2,-frontWidth/2,frontLength,frontWidth);
            drawBody();
            //draw right top arm
            // drawArm(frontLength/2,-frontWidth/2, -Math.PI/4,currentTime/100);
            drawArm(0,0, Math.PI/2,currentTime/100, true);
            //draw right bottom arm
            drawArm(-40,5, Math.PI*2.2/4,currentTime/75, false);
            //draw left top arm
            drawArm(0,0, -Math.PI/2,currentTime/50, true);
            //draw left bot arm
            drawArm(-40,-5, -Math.PI*2.2/4,currentTime/25, false);
    context.restore()
}
function drawArm(initialX, initialY, initialAngel, rotorAngle, isTop){
    let armWidth = 5
    let armLength = 20
    if(!isTop){
        armLength = 10
    }
    context.save();
        //draw arm
        context.translate(initialX,initialY)
        context.rotate(initialAngel)

        context.fillStyle = "green";
        context.fillRect(0,-armWidth/2,armLength,armWidth);
            //draw rotor
            drawRotor(armLength, 0, rotorAngle);
    context.restore();
}
function drawRotor(initialX, initialY, angle){
    context.save();
        //draw rotor
        context.translate(initialX, initialY);
        context.rotate(angle);
        context.fillStyle = "red";
        context.fillRect(-rotorLength/2,-rotorWidth/2,rotorLength,rotorWidth);
    context.restore();
}

function drawBody(){
    context.save();
    context.rotate(-Math.PI/2);
    context.beginPath();
    context.moveTo(5,20);
    context.lineTo(15,10);
    context.lineTo(15,-10);
    context.lineTo(5,-15);
    context.lineTo(5,-35);
    context.lineTo(10,-40);
    context.lineTo(-10,-40);
    context.lineTo(-5,-35);
    context.lineTo(-5,-15);
    context.lineTo(-15,-10);
    context.lineTo(-15,10);
    context.lineTo(-5,20);
    context.closePath();
    context.fillStyle = "black";
    context.fill();
    context.restore();
}

//0 represent right, 1 represent bottom, 2 represent left, 3 represent up
let direction = 0;
let squareSpeed = performance.now()/10;
let currentDistance = 0;
let currentX = 50;
let currentY = 50;
function squareMove(){
    if(direction===0){
        context.save();
            currentX+= squareSpeed;
            context.translate(currentX,currentY);
            currentDistance+=squareSpeed;
            drawCopter(0, 0, 0, performance.now());
        context.restore();
    }
    else if(direction===1){
        context.save();
            currentY+=squareSpeed;
            context.translate(currentX,currentY);
            currentDistance+=squareSpeed;
            drawCopter(0, 0, Math.PI/2, performance.now());
        context.restore();
    }
    else if(direction===2){
        context.save();
            currentX-=squareSpeed;
            context.translate(currentX,currentY);
            currentDistance+=squareSpeed;
            drawCopter(0, 0, Math.PI, performance.now());
        context.restore();
    }
    else if(direction===3){
        context.save();
            currentY-=squareSpeed;
            context.translate(currentX,currentY);
            currentDistance+=squareSpeed;
            drawCopter(0, 0, -Math.PI/2, performance.now());
        context.restore();
    }
    if(currentDistance>=500){
        currentDistance = currentDistance%500;
        direction = (direction+1)%4;
    }
}

let currentEventX = 100
let currentEventY = 100
let targetEventX = -1
let targetEventY = -1
let currentMoveAngle = 0;
let leftDistance = 0
canvas.onclick = function(event){
    targetEventX = event.clientX;
    targetEventY = event.clientY
    leftDistance = Math.pow(Math.pow(targetEventX - currentEventX,2)+Math.pow(targetEventY - currentEventY,2),0.5)
}

let rectX = -1;
let rectY = -1;
let score = 0;
function generateCircle(){
    if(rectX<0&&rectY<0){
        rectX = Math.random()*canvas.width
        rectY = Math.random()*canvas.height
    }
    context.save();
    context.fillStyle = "black";
    context.arc(rectX, rectY, 10, 0, Math.PI*2,false);
    context.fill();
    context.restore();
    if(Math.pow(rectX - currentEventX,2)+Math.pow(rectY - currentEventY,2)<200){
        rectX = -1;
        rectY = -1;
        score++;
    }
}


// and you will want to make an animation loop with something like:
/**
 * the animation loop gets a timestamp from requestAnimationFrame
 * 
 * @param {DOMHighResTimeStamp} timestamp 
 */
function loop(timestamp) {
    context.clearRect(0,0,canvas.width,canvas.height);
    //circle path
    context.save();
    context.translate(canvas.width/2, canvas.height/2);
        context.save();
        //draw first copter
        context.rotate(performance.now()/400);
        context.translate(0,-100);
            //a copter is flying around this one.
            context.save();
            //draw second copter
            context.rotate(performance.now()/100);
            context.translate(80,0);
            drawCopter(0, 0, Math.PI/2, performance.now());
            context.restore();
        //
        drawCopter(0, 0, 0, performance.now());
        context.restore();

    context.restore();
    //square path
    context.save();
        squareMove();
    context.restore();
    
    //mouse event
    context.save()
        if(targetEventX>=0&&targetEventY>=0){
            currentMoveAngle = Math.atan((targetEventY-currentEventY)/(targetEventX-currentEventX));
            if(targetEventX<currentEventX){
                currentMoveAngle+=Math.PI
            }
            currentEventX+=squareSpeed*Math.cos(currentMoveAngle);
            currentEventY+=squareSpeed*Math.sin(currentMoveAngle);
            leftDistance-=squareSpeed;
        }
        context.translate(currentEventX,currentEventY);
        if(leftDistance<=0){
            targetEventX = -1;
            targetEventY = -1;
        }
        drawCopter(0, 0, currentMoveAngle, performance.now());
    context.restore();
    
    context.save();
    generateCircle();
    context.restore();
    scoreText.innerHTML = "Score:"+score;

    window.requestAnimationFrame(loop);
};

// and then you would start the loop with:
window.requestAnimationFrame(loop);

    //     //
    //     context.beginPath();
    //     context.lineWidth = 1;
    //     context.strokeStyle = 'black';
    //     context.moveTo(-canvas.width / 2, 0);
    //     context.lineTo(canvas.width / 2, 0);
    //     context.moveTo(0, -canvas.height / 2);
    //     context.lineTo(0, canvas.height / 2);
    //     context.stroke();
    // //