var keyState = {}; 
var platformSpeed = [0,0,0];
var ballAngularSpeedRate = 10;

class GameController{
    constructor(scene){
        this.scene = scene;
        
        window.addEventListener('keydown', this.keyDown, true);    
        window.addEventListener('keyup', this.keyUp, true);  
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

        if(plat.collidesWithSphere(ball)){
            ball.speed[0] = (ball.speed[0]*2+platformSpeed[0])/3;
            ball.speed[1] = 100;

            if(Math.abs(ball.speed[0])<30){
                ball.speed[0] = ball.speed[0] > 0 ? 30:-30;
            }
            if(Math.abs(ball.speed[0])>200){
                ball.speed[0] = ball.speed[0] > 0 ? 200:-200;
            }
        }
    }

    checkBallUnderPlatform(){
        const ball = this.scene.ball;
        const plat = this.scene.platform;

        if(ball.position[1]-ball.scale[1]*10 < plat.position[1]+plat.scale[1]*10){
            plat.speed[0]=0;
            this.endTurn();
        }
    }

    endTurn(){
        console.log("lost");
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
        
        if (e.keyCode == 37){
            platformSpeed[0] = -this.scene.platformBaseSpeed[0]*200;
        }    
        if (e.keyCode == 39){
            platformSpeed[0] = this.scene.platformBaseSpeed[0]*200; 
        }

        setTimeScale(e.shiftKey);
    }

    keyUp(e){
        keyState[e.keyCode || e.which] = false;

        if (e.keyCode == 37 || e.keyCode == 39){
            platformSpeed = [0, 0, 0]; 
        }

        setTimeScale(e.shiftKey);
    }
    
    checkControls(time){
        this.scene.ball.angularSpeed[2] = this.scene.ball.speed[0]/ballAngularSpeedRate;

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