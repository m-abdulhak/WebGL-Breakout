var keyState = {}; 

class GameController{
    constructor(scene){
        this.scene = scene;

        
        this.platformSpeed = [5,0,0];
        
        window.addEventListener('keydown', this.keyDown, true);    
        window.addEventListener('keyup', this.keyUp, true);  
    }

    checkCollisions(){
    }

    keyDown(e){
        keyState[e.keyCode || e.which] = true;
    }

    keyUp(e){
        keyState[e.keyCode || e.which] = false;
    }
    
    checkControls(time){
        var dir = [-cameraPosition[0]+target[0],
                        -cameraPosition[1]+target[1],
                        -cameraPosition[2]+target[2],
                        0];
    
        var normDir = normalize(dir);
        var translateVec = multByScalar(normDir,5);

        if (keyState[37]){
            scene.movePlatformLeft(this.platformSpeed);
        }    
        if (keyState[39]){
            scene.movePlatformRight(this.platformSpeed);
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