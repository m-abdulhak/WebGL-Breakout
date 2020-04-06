class Scene{
    constructor(gl,programInfo){
        this.gl = gl;
        this.programInfo = programInfo;
        this.ShapeFactory = new ShapeFactory(gl,programInfo);
        this.Positions = {
            "Center" : [2.5,2.5,0.8],
            "TopLeft" : [1,4,0.8],
            "TopRight" : [4,4,0.8],
            "BottomLeft" : [1,1,0.8],
            "BottomRight" : [4,1,0.8]};
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

        var position = this.getPosition(this.Positions.Center);
        position[2]=-1.1;
        var parameters = sF.getDefaultsWith({"name": "Plane", "size":[50,50,.1], "scaleLimit": [100,100,100], "material": sF.Materials.Mirror, "hasShadow": false});
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters,this));

        position = this.getPosition(this.Positions.TopLeft);
        parameters = sF.getDefaultsWith({"name": "Cube","angularSpeed":[.1,.1,0]});
        this.objects.push(sF.createShape(sF.Shapes.Cube,position,sF.Colors.Red,parameters,this));
        
        position = this.getPosition(this.Positions.TopRight);
        parameters = sF.getDefaultsWith({"name": "Pyramid", "speed":[1,1,0], "positionLimits" : {"Max": [140, 140,1000] , "Min": [100, 100,-1000]}, "angularSpeed":[-1,-1,-1],"sizeChangeRate":[1.1,1.005,1.005],"scaleLimit":[2,2,2], "material": sF.Materials.Shiny});
        this.objects.push(sF.createShape(sF.Shapes.Pyramid,position,sF.Colors.Yellow,parameters,this));

        position = this.getPosition(this.Positions.Center);
        parameters = sF.getDefaultsWith({"name": "Sphere", "speed":[10,0,0], "positionLimits" : {"Max": [120,70,1000] , "Min": [20,40,-1000]}, "material": sF.Materials.SuperReflective});
        this.objects.push(sF.createShape(sF.Shapes.Sphere,position,sF.Colors.Green,parameters,this));


        position = this.getPosition(this.Positions.BottomLeft);
        parameters = sF.getDefaultsWith({"name": "Cylinder", "sizeChangeRate":[1.001,1.001,1.001], "scaleLimit": [1.2,1.2,1.2], "material": sF.Materials.Shiny});
        this.objects.push(sF.createShape(sF.Shapes.Cylinder,position,sF.Colors.Blue,parameters,this));

        position = this.getPosition(this.Positions.BottomRight);
        parameters = sF.getDefaultsWith({"name": "Cone", "sizeChangeRate":[0.999,0.998,0.997], "scaleLimit": [1.2,1.2,1.2]});
        this.objects.push(sF.createShape(sF.Shapes.Cone,position,sF.Colors.Magneta,parameters,this));

        // Attach lights
        position = [100,100,60];
        parameters = sF.getDefaultsWith({"size":[.1,.1,.1], "scaleLimit": [10000,10000,10000], "speed":[10,20,0], "positionLimits" : {"Max": [140, 140,1000] , "Min": [0, 0,-1000]}, "material": sF.Materials.Light , "isLight": true, "lightIndex": 0, "hasShadow": false});
        this.objects.push(sF.createShape(sF.Shapes.Sphere,position,sF.Colors.Glowing,parameters,this));
    }

    createLights(){
        this.lights = [
            new Light([70, 70, 40, 1.0 ], 
                [0.0, 0.0, 0.0], 
                [1.0, 1.0, 1.0], 
                { specular:1.0, diffuse:0.5, ambient:0.05}),

            new Light([140, 140, 80, 1.0 ], 
                [0.0, 0.0, 0.0], 
                [.9, .2, .2], 
                { specular:0.7, diffuse:0.3, ambient:0.05}),

            new Light([70, 140, 80, 1.0 ],
                [0.0, 0.0, 0.0],
                [.2, .2, .9],
                { specular:0.7, diffuse:0.3, ambient:0.05}),

            new Light([0, 140, 80, 1.0 ],
                [0.0, 0.0, 0.0],
                [.2, .9, .2],
                { specular:0.7, diffuse:0.3, ambient:0.05}),

            new Light([70, 70, 220, 0.0 ],
                [0., 0., -1.0],
                [1.0, 1.0, 1.0],
                { specular:1.0, diffuse:0.5, ambient:0.05})
        ];
        this.spotLight = this.lights[4];
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
