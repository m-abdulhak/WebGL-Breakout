class ShapeFactory {
    constructor (gl,programInfo){
    this.gl = gl;
    this.programInfo = programInfo;

    // Consts
    this.DefShapeSettings = {
        position : [0,0,0],
        speed : [0,0,0],
        positionLimits : {
                    "Max" : [1000, 1000, 1000],
                    "Min" : [-1000, -1000,-1000]
        },
        orientation : [0,0,0],
        angularSpeed : [0,0,0],
        size : [1,1,1],
        sizeChangeRate : [1,1,1],	
        scaleLimit: [10000000,10000000000,10000000000],			
        material: {	"materialAmbient" : [ 1.0, 1.0, 1.0 ],
            "materialDiffuse" : [ 1.0, 1.0, 1.0 ],
            "materialSpecular" : [ .3, .3, .3 ],
            "materialShininess" : 5.0},
        hasShadow:true,
        isLight: false,
        hasTexture: true,
        hasGravity: false,
        isTransparent: false};

    this.Shapes = {
        "Plane" : primitives.createCubeVertices(20),
        "Sphere" : primitives.createSphereVertices(10, 60, 60),
        "Cube" : primitives.createCubeVertices(20),
        "Pyramid" : primitives.createTruncatedConeVertices(10, 0, 20, 120, 60, true, true),
        "Cylinder" : primitives.createTruncatedConeVertices(10, 10, 20, 120, 60, true, true),
        "Cone" : primitives.createTruncatedConeVertices(10, 0, 20, 120, 60, true, true)};
    this.Colors = {
        "Red" : [1, 0.1, 0.1, 1],
        "Green" : [0.1, 1, 0.1, 1],
        "Blue" : [0.3, 0.3, 1, 1],
        "Yellow" : [1, 1, 0.1, 1],
        "Magneta" : [1, 0.1, 1, 1],
        "Gray" : [0.3, 0.3, 0.3, 1],
        "Black" : [0.1, 0.1, 0.1, 1],
        "White" : [1.0, 1.0, 1.0, 1.0],
        "Glowing" : [1, 1, 1, 1]};
    this.Materials = {
        "Matt" : {	"materialAmbient" : [ 1.0, 1.0, 1.0 ],
            "materialDiffuse" : [ 1.0, 1.0, 1.0 ],
            "materialSpecular" : [ 0.5, 0.5, 0.5 ],
            "materialShininess" : 5.0},
        "Shiny" : {	"materialAmbient" : [ 1.0, 1.0, 1.0 ],
            "materialDiffuse" : [ 1.0, 1.0, 1.0 ],
            "materialSpecular" : [ 1.0, 1.0, 1.0 ],
            "materialShininess" : 10.0},
        "Mirror" : {	"materialAmbient" : [ 1.0, 1.0, 1.0 ],
            "materialDiffuse" : [ 0.8, 0.8, 0.8 ],
            "materialSpecular" : [ 1.0, 1.0, 1.0 ],
            "materialShininess" : 10000.0},
        "Metal" : {	"materialAmbient" : [ 1.0, 1.0, 1.0 ],
            "materialDiffuse" : [ 0.8, 0.8, 0.8 ],
            "materialSpecular" : [ 0.5, 0.5, 0.5 ],
            "materialShininess" : 10000.0},
        "SuperReflective" : {	"materialAmbient" : [ 2.0, 2.0, 2.0 ],
            "materialDiffuse" : [ 1.3, 1.3, 1.3 ],
            "materialSpecular" : [ 2.0, 2.0, 2.0 ],
            "materialShininess" : 2000.0},
        "Light" : {	"materialAmbient" : [ 100.0, 100.0, 100.0 ],
            "materialDiffuse" : [ 1.0, 1.0, 1.0 ],
            "materialSpecular" : [ 100.0, 100.0, 100.0 ],
            "materialShininess" : 1.0}						
        };
        this.DefaultColor = this.Colors.Red;

        // unique object id
        this.uniqueId = 0;
    }

    getDefaultsWith(parObject){
        var settings = {...this.DefShapeSettings};
        
        for (var k in parObject) {
            if (parObject.hasOwnProperty(k)) {
                settings[k] = parObject[k];
            }
        }
        
        return settings;
    } 

    getLightDefaultsWith(parObject){        
        var settings = this.getDefaultsWith({
                            "size":[.1,.1,.1], 
                            "scaleLimit": [10000,10000,10000], 
                            "speed":[0,0,0], 
                            "positionLimits" : {    "Max": [10000,10000,10000] , 
                                                    "Min": [-10000,-10000,-10000]}, 
                            "material": this.Materials.Light, 
                            "isLight": true, 
                            "lightIndex": 0, 
                            "hasShadow": false});
        
        for (var k in parObject) {
            if (parObject.hasOwnProperty(k)) {
                settings[k] = parObject[k];
            }
        }
        
        return settings;
    }

    createShape = function(shape, location, color, parameters, scene, textureURL) {
        // print shpae info
        //console.log(shape);
        const settings = parameters == null? copyOf(this.DefShapeSettings) : copyOf(parameters);
        const col = color == null? this.defaultColor : color;
        const loc = location;

        return new WebGlObject(
            this.gl,
            this.programInfo,
            shape,
            col,
            loc,
            settings.speed,
            settings.positionLimits,
            settings.orientation,
            settings.angularSpeed,
            settings.size,
            settings.sizeChangeRate,
            settings.scaleLimit,	
            settings.material.materialAmbient,
            settings.material.materialDiffuse,
            settings.material.materialSpecular,
            settings.material.materialShininess,
            settings.hasShadow,
            settings.isLight,		
            settings.lightIndex,
            settings.name,
            scene,
            textureURL,
            settings.hasTexture,
            this.getUniqueId(),
            settings.hasGravity,
            settings.isTransparent);
    }

    getUniqueId(){
        this.uniqueId += 1;
        return this.uniqueId;
    }
}
