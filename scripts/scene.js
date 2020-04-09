class Scene{
    constructor(gl, programInfo, textureObjects){
        // Consts
        this.LightColors = {
            "White" :   [1.0, 1.0, 1.0],
            "Red" :     [1.0, 0.1, 0.1],
            "Green" :   [0.1, 1.0, 0.1],
            "Blue" :    [0.3, 0.3, 1.0],
            "Yellow" :  [1.0, 1.0, 0.1],
            "Magneta" : [1.0, 0.1, 1.0],
            "Gray" :    [0.3, 0.3, 0.3],
            "Black" :   [0.1, 0.1, 0.1]};

        this.room = {
            depth: 50,
            width: 30,
            height: 20,
            frontHeight: 20,
            zShift : -2,
            posScale:10
        }
        
        // gameplay settings
        this.ballSize = 1;
        this.platformBaseSpeed = [5,0,0];

        this.gl = gl;
        this.programInfo = programInfo;
        this.ShapeFactory = new ShapeFactory(gl,programInfo);
        this.Positions = {
            "Center" : [2.5,2.5,0.8],
            "TopLeft" : [1,4,0.8],
            "TopRight" : [4,4,0.8],
            "BottomLeft" : [1,1,0.8],
            "BottomRight" : [4,1,0.8]};

        // Load Textures
        this.textureObjects = textureObjects;
        // TODO: Change lights texture
        this.lightsTexture = this.textureObjects[1];
        this.wallsTexture = this.textureObjects[1];
        this.ballTexture = this.textureObjects[0];
        this.blocksTexture = this.textureObjects[4];
        this.platformTexture = this.textureObjects[4];


        this.lights = [];
        this.objects = [];
        this.blocks = [];
        this.createObjects();
    }

    getPosition(position){
        const stepSize = [30, 30, 30];
        return [position[0]*stepSize[0],position[1]*stepSize[1],position[2]*stepSize[2]];
    }

    createObjects (){
        var sF = this.ShapeFactory;
        
        this.createRoom(sF.Materials.Metal);
        
        this.createRoomLights();

        this.createGameElements(sF.Materials.SuperReflective);
        
        // position = this.getPosition(this.Positions.TopLeft);
        // parameters = sF.getDefaultsWith({"name": "Cube","angularSpeed":[.1,.1,0], "material": sF.Materials.Matt});
        // this.objects.push(sF.createShape(sF.Shapes.Cube, position, sF.Colors.Red,parameters, this, this.textureObjects[6]));
        
        // position = this.getPosition(this.Positions.TopRight);
        // parameters = sF.getDefaultsWith({"name": "Pyramid", "speed":[1,1,0], "positionLimits" : {"Max": [140, 140,1000] , "Min": [100, 100,-1000]}, "angularSpeed":[-1,-1,-1],"sizeChangeRate":[1.1,1.005,1.005],"scaleLimit":[2,2,2], "material": sF.Materials.Shiny});
        // this.objects.push(sF.createShape(sF.Shapes.Pyramid, position, sF.Colors.Yellow,parameters, this, this.textureObjects[5]));

        // var position = [0, 0, 0];
        // var parameters = sF.getDefaultsWith({"name": "Sphere", "speed":[10,0,0], "positionLimits" : {"Max": [120,70,1000] , "Min": [20,40,-1000]}, "material": sF.Materials.SuperReflective});
        // this.objects.push(sF.createShape(sF.Shapes.Sphere, position, sF.Colors.Green,parameters, this, this.textureObjects[0]));

        // position = this.getPosition(this.Positions.BottomLeft);
        // parameters = sF.getDefaultsWith({"name": "Cylinder", "sizeChangeRate":[1.001,1.001,1.001], "scaleLimit": [1.2,1.2,1.2], "material": sF.Materials.Shiny});
        // this.objects.push(sF.createShape(sF.Shapes.Cylinder, position, sF.Colors.Blue,parameters, this, this.textureObjects[3]));

        // position = this.getPosition(this.Positions.BottomRight);
        // parameters = sF.getDefaultsWith({"name": "Cone", "sizeChangeRate":[0.999,0.998,0.997], "scaleLimit": [1.2,1.2,1.2]});
        // this.objects.push(sF.createShape(sF.Shapes.Cone, position, sF.Colors.Magneta,parameters, this, this.textureObjects[4]));

    }

    createRoom(material){
        var sF = this.ShapeFactory;

        const depth = this.room.depth;
        const width = this.room.width;
        const height = this.room.height;
        const frontHeight = this.room.frontHeight;
        const zShift = this.room.zShift;    
        const posScale = this.room.posScale;

        let properties = sF.getDefaultsWith({"name": "Plane", "material": material, "hasShadow": false});

        // back side
        var position = [0, 0, zShift];
        var parameters = {...properties};
        parameters.size = [width, height, .1];
        this.objects.push(sF.createShape(sF.Shapes.Plane, position, sF.Colors.Gray, parameters, this, this.wallsTexture));

        // front side
        var position = [0, (-height+frontHeight)*posScale, depth*2*posScale+zShift];
        var parameters = {...properties};
        parameters.size = [];
        var parameters = sF.getDefaultsWith({"name": "Plane", "size":[width,frontHeight,.1], "material": sF.Materials.Mirror});
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this, this.wallsTexture));

        // left side
        position = [-width*posScale, 0, depth*posScale+zShift];
        var parameters = {...properties};
        parameters.size = [.1,height,depth];
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this, this.wallsTexture));

        // right side
        position = [width*posScale, 0, depth*posScale+zShift];
        var parameters = {...properties};
        parameters.size = [.1,height,depth];
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this, this.wallsTexture));

        // top side
        position = [0, height*posScale, depth*posScale+zShift];
        var parameters = {...properties};
        parameters.size = [width,.1,depth];
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this, this.wallsTexture));

        // top side
        position = [0, -height*posScale, depth*posScale+zShift];
        var parameters = {...properties};
        parameters.size = [width,.1,depth];
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this, this.wallsTexture));
    }

    createGameElements(material){
        var sF = this.ShapeFactory;
        var room = this.room;

        const width = room.width/20;
        const height = room.height/20;
        const depth = room.depth/10;

        const yStartPos = room.height*room.posScale/2-40;
        const zPos = (depth-room.zShift*2)*room.posScale;
        const xStartPos = -(room.width-width)*room.posScale;
        const xEndtPos = (room.width-width)*room.posScale;

        for (let j = 0; j < 5; j++) {
            let xPos = xStartPos+width*room.posScale/2;
            let i = 0;
            while(xPos<xEndtPos){
                let yPos = yStartPos+j*(height*2*room.posScale+3);

                // TODO: choose different texture for each block
                let texture = this.blocksTexture;

                this.createBlock(xPos, yPos, zPos, width, height, depth, material, texture);

                xPos += width*room.posScale*2+3;
                i++;
            }   
        }

        this.createBall(0, -(room.height*3/10)*room.posScale, zPos, this.ballSize, material, this.ballTexture);

        this.createPlatform(0, (room.height*7/10)*room.posScale, zPos, width*2, height/6, depth, material, this.platformTexture);
    }

    createBlock(xPos, yPos, zPos, width, height, depth, material, texture){
        var sF = this.ShapeFactory;

        let properties = sF.getDefaultsWith({   "name": "block", 
                                                "material": material, 
                                                "hasShadow": false, 
                                                "hasTexture": true});

        var position = [xPos, yPos, zPos];
        properties.size = [width, height, depth];
        this.objects.push(sF.createShape(sF.Shapes.Cube, position, multByScalar(sF.Colors.Red,Math.random()/5+0.8), properties, this, texture));
        this.blocks.push(this.objects[this.objects.length-1])
    }

    createBall(xPos, yPos, zPos, radius, material, texture){
        var sF = this.ShapeFactory;
        var room = this.room;
        
        const frontLightPosZ = room.depth*2*room.posScale-10;

        var position = [xPos, yPos, zPos];
        var posLimits = this.getRoomLimitsFor([radius, radius, radius]);

        var parameters = sF.getDefaultsWith({   "name": "Ball", 
                                                "size": [radius, radius, radius],
                                                "speed":[0,0,0], 
                                                "angularSpeed": [0, 0, 10],
                                                "positionLimits" : posLimits, 
                                                "material": material, 
                                                "hasShadow": true,  
                                                "hasTexture": true});

        this.objects.push(sF.createShape(sF.Shapes.Sphere, position, sF.Colors.White, parameters, this, texture));
        this.ball = this.objects[this.objects.length-1];
    }
    
    createPlatform(xPos, yPos, zPos, width, height, depth, material, texture){
        var sF = this.ShapeFactory;
        var room = this.room;
        
        var posLimits = this.getRoomLimitsFor([width, height, depth]);        
        
        let properties = sF.getDefaultsWith({   "name": "Platform", 
                                                "speed":[0, 0, 0], 
                                                "positionLimits": posLimits, 
                                                "material": material, 
                                                "hasShadow": false, 
                                                "hasTexture": true});
        
        var position = [xPos, -yPos, zPos];
        var parameters = {...properties};
        parameters.size = [width, height, depth];
        
        this.objects.push(sF.createShape(sF.Shapes.Cube, position, multByScalar(sF.Colors.Red,Math.random()/5+0.8), parameters, this, texture));
        this.platform = this.objects[this.objects.length-1];
    }

    createRoomLights(){
        const room = this.room;

        const frontLightPosZ = room.depth*2*room.posScale-10;
        //const lightPosY = -(room.height*room.posScale-30);
        const lightXPos = room.width*5;
        const lightXNeg = -room.width*5;
        const lightYPos = room.height*5;
        const lightYNeg = -room.height*5;
        const lightZPos = frontLightPosZ*0.8;
        const lightZNeg = frontLightPosZ*0.2;
        const lightZMid = frontLightPosZ/2;

        const highProperties = {specular: .3, diffuse: .8, ambient: 0.005};
        const dimProperties = {specular: 0.3, diffuse: .1, ambient: 0.005};

        this.createLight([0, 0, frontLightPosZ/2, 1.0], this.LightColors.White, highProperties);
        this.createLight([lightXPos, lightYPos, lightZPos, 1.0], this.LightColors.White, highProperties);
        this.createLight([lightXPos, lightYPos, lightZNeg, 1.0], this.LightColors.White, highProperties);
        this.createLight([lightXPos, lightYNeg, lightZPos, 1.0], this.LightColors.White, highProperties);
        this.createLight([lightXPos, lightYNeg, lightZNeg, 1.0], this.LightColors.White, highProperties);
        
        // moving lights
        this.createMovingLightObject([-1, -1, -1],[0, 0, 1], dimProperties);
        this.createMovingLightObject([-1, 1, -1],[0, 0, 1], dimProperties);
        this.createMovingLightObject([1, 1, -1],[0, 0, 1], dimProperties);
        this.createMovingLightObject([1, -1, -1],[0, 0, 1], dimProperties);

        // Spotlight
        this.createLight([70, 70, 220, 0.0], [1.0, 1.0, 1.0],{specular:.0, diffuse:0.0, ambient:0.0}, [0., 0., -1.0]);
        this.spotLight = this.lights[this.lights.length-1];
    }

    createMovingLightObject(sides, speeds, properties = {specular: 0.3, diffuse: .1, ambient: 0.005}){
        let sizeLimits = this.getRoomLimitsFor([.1,.1,.1,]);
        const baseSpeeds = [-2000, -2000, -2000];
        sizeLimits.Min[2] = this.room.posScale * this.room.depth/4;

        let xPos = sides[0]*sizeLimits.Max[0];
        let yPos = sides[1]*sizeLimits.Max[1];
        let zPos = sides[2]==1? sizeLimits.Max[2]:sizeLimits.Min[2];

        let finalSpeed = [   baseSpeeds[0]*speeds[0],
                        baseSpeeds[1]*speeds[1],
                        baseSpeeds[2]*speeds[2]];

        this.createLightObject(     [xPos, yPos, zPos, 1.0], 
                                    this.LightColors.Blue, 
                                    properties, 
                                    finalSpeed,
                                    sizeLimits);
    }

    createDimLightObject(position){
        this.createLightObject( position, 
                                [1.0, 1.0, 1.0], 
                                {specular: 0.03, diffuse: .08, ambient: 0.00005}, 
                                [0, 0, 0], 
                                {"Max" : [1000, 1000, 1000],"Min" : [-1000, -1000,-1000]}, 
                                [0, 0, 0]);
    }

    createLightObject(  position = [0, 0, 0], 
                        color = [1.0, 1.0, 1.0], 
                        properties = {specular: 0.3, diffuse: .8, ambient: 0.005}, 
                        speed = [0, 0, 0], 
                        positionLimits = {"Max" : [1000, 1000, 1000],"Min" : [-1000, -1000,-1000]}, 
                        direction = [0, 0, 0]){

        var sF = this.ShapeFactory;

        var parameters = sF.getLightDefaultsWith({  "speed": speed, 
                                                    "positionLimits" : positionLimits,
                                                    "lightIndex": this.lights.length });
        
        this.createLight(position, color, properties, direction);
        
        this.objects.push(sF.createShape(sF.Shapes.Sphere, position, sF.Colors.Glowing,parameters, this, this.lightsTexture));
    }

    createLight(position=[0, 0, 0], color=[1.0, 1.0, 1.0], properties={specular: 0.3, diffuse: .8, ambient: 0.005}, direction = [0, 0, 0]){
        var light = new Light(  position, 
                                direction, 
                                color, 
                                properties);
        this.lights.push(light);
        return light;
    }


    getRoomLimitsFor(size){
        const room = this.room;
        const width = size[0];
        const height = size[1];
        const depth = size[2];

        const frontLightPosZ = room.depth*2*room.posScale-10;


        return{ "Max" : [(room.width-width)*room.posScale, (room.height-height)*room.posScale, frontLightPosZ-depth*room.posScale],
                "Min" : [-(room.width-width)*room.posScale, -(room.height-height)*room.posScale, depth*room.posScale]};
    }

    changeSpotLightDirection(direction){
        this.spotLight.direction = direction;
    }

    changeSpotLightPosition(position){
        this.spotLight.position = position;
    }

    decreaseSpotlightInnerLimit(){
        this.spotLight.spotlightInnerLimit = Math.max(0.4,this.spotLight.spotlightInnerLimit-0.005);
    }

    decreaseSpotlightOuterLimit(){
        this.spotLight.spotlightOuterLimit = Math.max(0.2,this.spotLight.spotlightOuterLimit-0.005);
    }

    increaseSpotlightInnerLimit(){
        this.spotLight.spotlightInnerLimit = Math.min(0.999,this.spotLight.spotlightInnerLimit+0.005);
    }

    increaseSpotlightOuterLimit(){
        this.spotLight.spotlightOuterLimit = Math.min(0.95,this.spotLight.spotlightOuterLimit+0.005);
    }
    
    render(time){
        var t = time /1000;
        for(const o of this.objects){
            o.update(time);
            o.draw(t);
        }
    }

    toggleAnimation(objIndex){
        this.objects[objIndex].toggleAnimation();
    }			

    removeBall(){
        const indexSet = new Set([this.ball._Id]);
        this.objects = this.objects.filter((object, i) => !indexSet.has(object._Id));
    }
}
