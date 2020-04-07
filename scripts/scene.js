class Scene{
    constructor(gl, programInfo, textureObjects){
        this.gl = gl;
        this.programInfo = programInfo;
        this.ShapeFactory = new ShapeFactory(gl,programInfo);
        this.Positions = {
            "Center" : [2.5,2.5,0.8],
            "TopLeft" : [1,4,0.8],
            "TopRight" : [4,4,0.8],
            "BottomLeft" : [1,1,0.8],
            "BottomRight" : [4,1,0.8]};
        this.textureObjects = textureObjects;
        this.lights = [];
        this.createLights();
        this.objects = [];
        this.createObjects();
    }

    getPosition(position){
        const stepSize = [30, 30, 30];
        return [position[0]*stepSize[0],position[1]*stepSize[1],position[2]*stepSize[2]];
    }

    createObjects (){
        var sF = this.ShapeFactory;
        
        const arcade = {
            depth: 50,
            width: 30,
            height: 20,
            frontHeight: 20,
            zShift : -1.1,
            posScale:10
        }
        
        this.createArcade(sF, arcade, sF.Materials.Mirror, this.textureObjects[1]);

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

    createArcade(sF, arcade, material, texture){
        const depth = arcade.depth;
        const width = arcade.width;
        const height = arcade.height;
        const frontHeight = arcade.frontHeight;
        const zShift = arcade.zShift;    
        const posScale = arcade.posScale;

        let properties = sF.getDefaultsWith({"name": "Plane", "scaleLimit": [100000,100000,100000], "material": material, "hasShadow": false});

        // back side
        var position = [0, 0, zShift];
        var parameters = {...properties};
        parameters.size = [width, height, .1];
        this.objects.push(sF.createShape(sF.Shapes.Plane, position, sF.Colors.Gray, parameters, this, texture));

        // front side
        var position = [0, (-height+frontHeight)*posScale, depth*2*posScale+zShift];
        var parameters = {...properties};
        parameters.size = [];
        var parameters = sF.getDefaultsWith({"name": "Plane", "size":[width,frontHeight,.1], "scaleLimit": [100000,100000,100000], "material": sF.Materials.Mirror, "hasShadow": false});
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this, this.textureObjects[1]));

        // left side
        position = [-width*posScale, 0, depth*posScale+zShift];
        var parameters = {...properties};
        parameters.size = [.1,height,depth];
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this, this.textureObjects[1]));

        // right side
        position = [width*posScale, 0, depth*posScale+zShift];
        var parameters = {...properties};
        parameters.size = [.1,height,depth];
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this, this.textureObjects[1]));

        // top side
        position = [0, height*posScale, depth*posScale+zShift];
        var parameters = {...properties};
        parameters.size = [width,.1,depth];
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this, this.textureObjects[1]));

        // top side
        position = [0, -height*posScale, depth*posScale+zShift];
        var parameters = {...properties};
        parameters.size = [width,.1,depth];
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this, this.textureObjects[1]));

        this.createLights();
        
        // Attach lights
        // position = [0,0, depth*posScale*1.98];
        // parameters = sF.getDefaultsWith({"size":[.1,.1,.1], "scaleLimit": [10000,10000,10000], "speed":[0,0,0], "positionLimits" : {"Max": [1000, 1000,1000] , "Min": [-1000, -1000,-1000]}, "material": sF.Materials.Light , "isLight": true, "lightIndex": 0, "hasShadow": false});
        // this.objects.push(sF.createShape(sF.Shapes.Sphere, position, sF.Colors.Glowing,parameters, this, this.textureObjects[1]));
        
        // position = [width*posScale*2, height*posScale,48.9];
        // parameters = sF.getDefaultsWith({"size":[.1,.1,.1], "scaleLimit": [10000,10000,10000], "speed":[0,0,0], "positionLimits" : {"Max": [1000, 1000,1000] , "Min": [-1000, -1000,-1000]}, "material": sF.Materials.Light , "isLight": true, "lightIndex": 1, "hasShadow": false});
        // this.objects.push(sF.createShape(sF.Shapes.Sphere, position, sF.Colors.Glowing,parameters, this, this.textureObjects[1]));
        
        // position = [-width*posScale*0.99, height*posScale*.99,0];
        // parameters = sF.getDefaultsWith({"size":[.1,.1,.1], "scaleLimit": [10000,10000,10000], "speed":[0,50,0], "positionLimits" : {"Max": [width*posScale*0.999, height*posScale*0.999,depth*posScale] , "Min": [-width*posScale*0.999, -height*posScale*0.999, 0]}, "material": sF.Materials.Light , "isLight": true, "lightIndex": 2, "hasShadow": false});
        // this.objects.push(sF.createShape(sF.Shapes.Sphere, position, sF.Colors.Glowing,parameters, this, this.textureObjects[1]));
        
        // position = [0,0, depth*posScale*1.98];
        // parameters = sF.getDefaultsWith({"size":[.1,.1,.1], "scaleLimit": [10000,10000,10000], "speed":[0,0,0], "positionLimits" : {"Max": [1000, 1000,1000] , "Min": [-1000, -1000,-1000]}, "material": sF.Materials.Light , "isLight": true, "lightIndex": 3, "hasShadow": false});
        // this.objects.push(sF.createShape(sF.Shapes.Sphere, position, sF.Colors.Glowing,parameters, this, this.textureObjects[1]));
    }

    createLights(){
        this.createLight([0, 0, 48.9, 1.0]);
        this.createLight([30, 30, 0, 1.0]);
        this.createLight([-30, 30, 0, 1.0]);
        this.createLight([0, 30, 0, 1.0]);
        this.createLight([70, 70, 220, 0.0], [1.0, 1.0, 1.0],{ specular:.1, diffuse:0.05, ambient:0.005}, [0., 0., -1.0]);
        this.spotLight = this.lights[4];
    }

    createLight(position=[0, 0, 0], color=[1.0, 1.0, 1.0], properties={specular: 0.3, diffuse: .8, ambient: 0.005}, direction = [0, 0, 0]){
        var light = new Light(  position, 
                                direction, 
                                color, 
                                properties);
        this.lights.push(light);
        return light;
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
}
