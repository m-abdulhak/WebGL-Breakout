var keyState = {}; 
var started = false;
var lost = false;
var won = false;
var score = 0;
var lives = 2;

var platformSpeed = [0,0,0];
var minBallSpeed = 30;
var maxBallSpeed = 400;
var ballAngularSpeedRate = 10;

class GameController{
    constructor(scene){
        this.scene = scene;
        
        window.addEventListener('keydown', this.keyDown, true);    
        window.addEventListener('keyup', this.keyUp, true);  
    }

    updateGame(time){
        this.checkWon();
        this.setAngularSpeeds();
        this.checkControls(time);
        this.checkCollisions();
        this.checkReplaceLostBall();
    }

    checkWon(){
        if(this.scene.blocks.length<1){
            showEndGameScreen();
        }
    }

    setAngularSpeeds(){
        this.scene.ball.angularSpeed[2] = this.scene.ball.speed[0]/ballAngularSpeedRate;
        this.scene.platform.angularSpeed[1] = platformSpeed[0];
    }

    checkCollisions(){
        try{
            this.checkBlockBallCollision();
            this.checkPlatformBallCollision();
            this.checkBallUnderPlatform();
        } catch(error){
            console.log("Game is still loading!")
        }
    }

    checkBlockBallCollision(){
        let indexesToDelete = [];

        for (let index = 0; index < this.scene.blocks.length; index++) {
            const block = this.scene.blocks[index];
            
            if(block.collidesWithSphere(this.scene.ball)){
                this.increaseScore();
                indexesToDelete.push(block._Id);
                this.scene.ball.bounceOffCube(block);
                break;
            }             
        }

        const indexSet = new Set(indexesToDelete)

        this.scene.objects = this.scene.objects.filter((object, i) => !indexSet.has(object._Id));
        this.scene.blocks = this.scene.blocks.filter((object, i) => !indexSet.has(object._Id));
    }

    checkPlatformBallCollision(){
        const ball = this.scene.ball;
        const plat = this.scene.platform;

        if(ball.hasGravity){
            return;
        }

        if(plat.collidesWithSphere(ball)){
            ball.speed[0] = (ball.speed[0]*3+platformSpeed[0])/4;
            ball.speed[1] = 100;

            if(Math.abs(ball.speed[0])<minBallSpeed){
                ball.speed[0] = ball.speed[0] > 0 ? minBallSpeed:-minBallSpeed;
            }
            if(Math.abs(ball.speed[0])>maxBallSpeed){
                ball.speed[0] = ball.speed[0] > 0 ? maxBallSpeed:-maxBallSpeed;
            }
        }
    }

    checkBallUnderPlatform(){
        const ball = this.scene.ball;
        const plat = this.scene.platform;

        if(ball.position[1] < plat.position[1]){
            if(!ball.hasGravity){
                this.endTurn();
            }
        }
    }

    checkReplaceLostBall(){
        const scene = this.scene;
        const ball = this.scene.ball;

        if(ball.hasGravity && ball.stopped() && !lost){
            scene.replaceBall();
        }
    }

    endTurn(){      
        const ball = this.scene.ball;

        ball.enableGravity();
        ball.isTransparent = true;

        this.decreaseLives();
    }

    increaseScore(){
        score = score + 1;
    }

    decreaseLives(){
        lives = lives - 1;
        if(lives<0){
            this.endGame();
        }
    }

    endGame(){
        lost = true;
        showEndGameScreen();
    }

    movePlatformRight(movement){
        try {
            this.scene.platform.position[0] += movement;
        } catch (error) {
            console.log("Please wait while the game is loading!")
        }
    }
    
    movePlatformLeft(movement){
        try {
            this.scene.platform.position[0] -= movement;
        } catch (error) {
            console.log("Please wait while the game is loading!")
        }
    }

    keyDown(e){
        keyState[e.keyCode || e.which] = true;
        
        if(lost){
            return;
        }

        if (e.keyCode == 37){
            platformSpeed[0] = -this.scene.platformBaseSpeed[0]*200;
        }    
        if (e.keyCode == 39){
            platformSpeed[0] = this.scene.platformBaseSpeed[0]*200; 
        }

        if(!started || this.scene.ball.stopped()){
            started = true;
            this.scene.ball.speed = [80, 100, 0];
        }

        setTimeScale(e.shiftKey);
    }

    keyUp(e){
        if((lost || won) && e.keyCode =='R'.charCodeAt(0)){
            location.reload();
        }

        keyState[e.keyCode || e.which] = false;

        if(lost){
            return;
        }

        if (e.keyCode == 37 || e.keyCode == 39){
            platformSpeed = [0, 0, 0]; 
        }

        setTimeScale(e.shiftKey);
    }
    
    checkControls(time){
        
        if(lost){
            return;
        }
        
        var dir = [-cameraPosition[0]+target[0],
                        -cameraPosition[1]+target[1],
                        -cameraPosition[2]+target[2],
                        0];
    
        var normDir = normalize(dir);
        var translateVec = multByScalar(normDir,5);

        if (keyState[37]){
            this.movePlatformLeft(this.scene.platformBaseSpeed[0]);
        }    
        if (keyState[39]){
            this.movePlatformRight(this.scene.platformBaseSpeed[0]);
        }
        if(keyState['W'.charCodeAt(0)]){
            cameraPosition = vecAdd(cameraPosition,translateVec);
            target = vecAdd(target,translateVec);
            orthoscale *= .99; 
            moveSpotLight(0,0);
        }
        if(keyState['S'.charCodeAt(0)]){
            cameraPosition = vecAdd(cameraPosition,multByScalar(translateVec,-1));
            target = vecAdd(target,multByScalar(translateVec,-1));
            orthoscale *= 1.01;
            moveSpotLight(0,0);
        }
        if(keyState['A'.charCodeAt(0)]){
            var newDir = rotateY(normDir,-3.1415/180);
            target = vecAdd(cameraPosition,newDir);
            moveSpotLight(0,0);
        }
        if(keyState['D'.charCodeAt(0)]){
            var newDir = rotateY(normDir,3.1415/180);
            target = vecAdd(cameraPosition,newDir);
            moveSpotLight(0,0);
        }
        if(keyState['E'.charCodeAt(0)]){
            var dirInCamerCoor = normalize(vecMatProduct(normDir,cameraMatrix));
            var newDirInCamerCoor = normalize(rotateX([dirInCamerCoor[0],dirInCamerCoor[1],dirInCamerCoor[2]],-3.1415/180));
            var newDir = normalize(vecMatProduct(newDirInCamerCoor,m4.inverse(cameraMatrix)));
            if(newDir[1]<0.8){
                target = vecAdd(cameraPosition,newDir);
            }
            moveSpotLight(0,0);
        }
        if(keyState['Q'.charCodeAt(0)]){
            var dirInCamerCoor = normalize(vecMatProduct(normDir,cameraMatrix));
            var newDirInCamerCoor = normalize(rotateX([dirInCamerCoor[0],dirInCamerCoor[1],dirInCamerCoor[2]],3.1415/180));
            var newDir = normalize(vecMatProduct(newDirInCamerCoor,m4.inverse(cameraMatrix)));
            if(newDir[1]>-0.8){
                target = vecAdd(cameraPosition,newDir);
            }
            moveSpotLight(0,0);
        }
    } 
}

var setTimeScale = function(shift){
    if(shift){
        gameTimeScale = 10;
    } else{
        gameTimeScale = 1;
    }
}

var showEndGameScreen = function(){
    score += lives*5;
    lives = 0;
    document.getElementById("end-screen").classList.remove("hidden");
    if(lost){
        document.getElementById("game-result").innerHTML = "Lost!";
        document.getElementById("game-result").classList.add("red");
    } else{
        won = true;
        document.getElementById("game-result").innerHTML = "Won!";
        document.getElementById("game-result").classList.add("key");
    }
}