"use strict";

var scene;
var paused = false;
var shadingMode = 0;

var cameraPosition = [70, 70, 220];
var target = [cameraPosition[0], cameraPosition[1], cameraPosition[2]-1];
var up = [0, 100, 0];
var cameraMatrix = [];
var viewMatrix = [];
var projectionMatrix = [];
var orthoscale = 1;

var viewTypes = {'Orthographic':0,'Perspective':1};
var view = viewTypes['Perspective'];
    
// My Lighting 
// Lighting
// vec4
// TODO: Refactor into class
var lightPosition = [	[70, 70, 40, 1.0 ], 
                        [140, 140, 80, 1.0 ], 
                        [70, 140, 80, 1.0 ], 
                        [0, 140, 80, 1.0 ], 
                        [70, 70, 220, 0.0 ]];

var lightDirection = [	[0.0, 0.0, 0.0], 
                        [0.0, 0.0, 0.0], 
                        [0.0, 0.0, 0.0], 
                        [0.0, 0.0, 0.0], 
                        [0., 0., -1.0]];

var lightColorBase = [	[1.0, 1.0, 1.0], 
                        [.9, .2, .2], 
                        [.2, .2, .9], 
                        [.2, .9, .2], 
                        [1.0, 1.0, 1.0]];

var lightColor = [...lightColorBase];

// Specular, Diffuse, Ambient Intensities
var lightProperties = [	[1.0, 0.5, 0.05], 
                        [0.7, 0.3, 0.05], 
                        [0.7, 0.3, 0.05], 
                        [0.7, 0.3, 0.05], 
                        [1.0, 0.5, 0.05]];

var lightSpecular = [multByScalar(lightColor[0], lightProperties[0][0]), multByScalar(lightColor[1], lightProperties[1][0]), multByScalar(lightColor[2], lightProperties[2][0]), multByScalar(lightColor[3], lightProperties[3][0]), multByScalar(lightColor[4], lightProperties[4][0])];
var lightDiffuse = [multByScalar(lightColor[0], lightProperties[0][1]), multByScalar(lightColor[1], lightProperties[1][1]), multByScalar(lightColor[2], lightProperties[2][1]), multByScalar(lightColor[3], lightProperties[3][1]), multByScalar(lightColor[4], lightProperties[4][1])];
var lightAmbient = [multByScalar(lightColor[0], lightProperties[0][2]), multByScalar(lightColor[1], lightProperties[1][2]), multByScalar(lightColor[2],lightProperties[2][2]), multByScalar(lightColor[3], lightProperties[3][2]), multByScalar(lightColor[4], lightProperties[4][2])];

var spotlightOuterLimit = 0.8;
var spotlightInnerLimit = 0.9;

// Shadows
var xyPlaneShadowsTransformationMatrix = [];

var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    if (!gl) {
        return;
    }

    gl.getExtension('OES_standard_derivatives');
    console.log(gl.getParameter(gl.VERSION));
    console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    console.log(gl.getParameter(gl.VENDOR));

    // setup GLSL program
    var programInfo = webglUtils.createProgramInfo(gl, ["3d-vertex-shader", "3d-fragment-shader"]);

    //objects = createObjects(gl,programInfo);
    scene = new Scene(gl,programInfo);
    scene.createObjects();

    requestAnimationFrame(render);

    selectedLightChanged();		
    lightIntensitySlidersChanged();
    selectedShapeChanged();

    // Draw the scene.
    function render(time) {
        var t = time /1000;

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // Clear the canvas AND the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Compute the projection matrix
        projectionMatrix = getProjectionMatrix(gl);
        
        // Compute the camera's matrix using look at.
        cameraMatrix = m4.lookAt(cameraPosition, target, up);

        // Make a view matrix from the camera matrix.
        viewMatrix = m4.inverse(cameraMatrix);

        // ------ Draw Objects --------
        if(!paused){
            scene.render(time);
        }

        requestAnimationFrame(render);
    }

}

var getProjectionMatrix = function(gl){
    var ret = setViewPerspective(gl);
    var elPers = document.getElementById("perspective") ;
    var elOrtho = document.getElementById("ortho") ;

    if(view == viewTypes['Perspective']){
        ret = setViewPerspective(gl);
        elPers.classList.add("active");
        elOrtho.classList.remove("active");
    }else{
        ret = setViewOrtho(gl);
        elPers.classList.remove("active");
        elOrtho.classList.add("active");
    }

    return ret;
}

var setViewOrtho = function (gl) {
    var near = -1;
    var far = 10000;
    var radius = 1.0;

    var target_width = 120.0 * orthoscale;
    var target_height = 200.0 * orthoscale;

    var A = target_width / target_height; // target aspect ratio 
    var V = gl.canvas.clientWidth / gl.canvas.clientHeight;


    var mat = [];

    // calculate V as above
    if (V >= A) {
        // wide viewport, use full height
        mat = m4.orthographic(-V/A * target_width/2.0, V/A * target_width/2.0, -target_height/2.0, target_height/2.0,  near, far);
    } else {
        // tall viewport, use full width
        mat = m4.orthographic(-target_width/2.0, target_width/2.0, -A/V*target_height/2.0, A/V*target_height/2.0,  near, far);
    }

    return mat;
}

var setViewPerspective = function (gl) {
    var fieldOfViewRadians = degToRad(60);
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    return m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
}

var moveSpotLight = function (diffX, diffY) {
    var dir = [-cameraPosition[0]+target[0],
                    -cameraPosition[1]+target[1],
                    -cameraPosition[2]+target[2],
                    0];

    var normDir = normalize(dir);

    var diff = [diffX,diffY];
    var dirInCamerCoor = normalize(vecMatProduct(normDir,cameraMatrix));

    var newDirInCamerCoor = rotateX([dirInCamerCoor[0],dirInCamerCoor[1],dirInCamerCoor[2]],diff[1]);
    var newDirInCamerCoor = rotateY([newDirInCamerCoor[0],newDirInCamerCoor[1],newDirInCamerCoor[2]],diff[0]);
    var newDir = normalize(vecMatProduct(newDirInCamerCoor,m4.inverse(cameraMatrix)));

    //console.log("CamerDir:",normDir);
    //console.log("dirInCamerCoor:",dirInCamerCoor);
    //console.log("diff:",diff);
    //console.log("CamerDir:",newDir);
    //console.log("===================================");

    lightDirection[4] = [newDir[0],newDir[1],newDir[2]];
    lightPosition[4] = [cameraPosition[0], cameraPosition[1], cameraPosition[2], 0.0] ;
}

window.onload = main();
