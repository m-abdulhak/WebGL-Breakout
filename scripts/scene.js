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
        this.objects = [];
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
        this.objects.push(sF.createShape(sF.Shapes.Plane,position,sF.Colors.Gray,parameters));

        position = this.getPosition(this.Positions.TopLeft);
        parameters = sF.getDefaultsWith({"name": "Cube","angularSpeed":[.1,.1,0]});
        this.objects.push(sF.createShape(sF.Shapes.Cube,position,sF.Colors.Red,parameters));
        
        position = this.getPosition(this.Positions.TopRight);
        parameters = sF.getDefaultsWith({"name": "Pyramid", "speed":[1,1,0], "positionLimits" : {"Max": [140, 140,1000] , "Min": [100, 100,-1000]}, "angularSpeed":[-1,-1,-1],"sizeChangeRate":[1.1,1.005,1.005],"scaleLimit":[2,2,2], "material": sF.Materials.Shiny});
        this.objects.push(sF.createShape(sF.Shapes.Pyramid,position,sF.Colors.Yellow,parameters));

        position = this.getPosition(this.Positions.Center);
        parameters = sF.getDefaultsWith({"name": "Sphere", "speed":[10,0,0], "positionLimits" : {"Max": [120,70,1000] , "Min": [20,40,-1000]}, "material": sF.Materials.SuperReflective});
        this.objects.push(sF.createShape(sF.Shapes.Sphere,position,sF.Colors.Green,parameters));


        position = this.getPosition(this.Positions.BottomLeft);
        parameters = sF.getDefaultsWith({"name": "Cylinder", "sizeChangeRate":[1.001,1.001,1.001], "scaleLimit": [1.2,1.2,1.2], "material": sF.Materials.Shiny});
        this.objects.push(sF.createShape(sF.Shapes.Cylinder,position,sF.Colors.Blue,parameters));

        position = this.getPosition(this.Positions.BottomRight);
        parameters = sF.getDefaultsWith({"name": "Cone", "sizeChangeRate":[0.999,0.998,0.997], "scaleLimit": [1.2,1.2,1.2]});
        this.objects.push(sF.createShape(sF.Shapes.Cone,position,sF.Colors.Magneta,parameters));

        // Attach lights
        position = [100,100,60];
        parameters = sF.getDefaultsWith({"size":[.1,.1,.1], "scaleLimit": [10000,10000,10000], "speed":[10,20,0], "positionLimits" : {"Max": [140, 140,1000] , "Min": [0, 0,-1000]}, "material": sF.Materials.Light , "isLight": true, "lightIndex": 0, "hasShadow": false});
        this.objects.push(sF.createShape(sF.Shapes.Sphere,position,sF.Colors.Glowing,parameters));
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
