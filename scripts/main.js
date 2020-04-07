"use strict";

var game;
var scene;
var paused = false;
var shadingMode = 0;

var cameraPosition = [0, 30, 900];
var target = [cameraPosition[0], cameraPosition[1], cameraPosition[2]-1];
var up = [0, 10, 0];
var cameraMatrix = [];
var viewMatrix = [];
var projectionMatrix = [];
var orthoscale = 1;
var fov = 30;

var viewTypes = {'Orthographic':0,'Perspective':1};
var view = viewTypes['Perspective'];

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
    console.log(gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
    console.log(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
    

    // setup GLSL program
    var programInfo = webglUtils.createProgramInfo(gl, ["3d-vertex-shader", "3d-fragment-shader"]);

    linkTextures();

    scene = new Scene(gl, programInfo, textureObjects);
    game = new GameController(scene);

    selectedLightChanged();		
    lightIntensitySlidersChanged();
    selectedShapeChanged();

    requestAnimationFrame(render);

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
            game.checkControls(time);
            game.checkCollisions();
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
    var fieldOfViewRadians = degToRad(fov);
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    return m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
}

var textureUrls = [
    "https://raw.githubusercontent.com/m-abdulhak/ImageHosting/master/1k/TexturesCom_Paint_Chipped_1K_albedo.png",
    "https://raw.githubusercontent.com/m-abdulhak/ImageHosting/master/1k/TexturesCom_Scifi_Panel_1K_height.png",
    "https://raw.githubusercontent.com/m-abdulhak/ImageHosting/master/4k/Fabric_Craft_01_ambientocclusion.jpg",
    "https://raw.githubusercontent.com/m-abdulhak/ImageHosting/master/4k/Fabric_denim_01_basecolor.jpg",
    "https://raw.githubusercontent.com/m-abdulhak/ImageHosting/master/4k/Fabric_laces_01_basecolor.jpg",
    "https://raw.githubusercontent.com/m-abdulhak/ImageHosting/master/4k/Fabric_valvet_01_basecolor.jpg",
    "https://raw.githubusercontent.com/m-abdulhak/ImageHosting/master/4k/Fabric_linen_01_basecolor.jpg"];
var textureImages = [];
var textureObjects = [];

var loadTextures = function(){
    textureUrls.forEach(textureUrl => {
        var textureImage = new Image();
        textureImage.crossOrigin = "";
        requestCORSIfNotSameOrigin(textureImage, textureUrl);
        textureImage.src = textureUrl;
        textureImages.push(textureImage);
        
        textureImage.addEventListener('load', function() {
            if(textureImages.length == textureUrls.length){
                var texturesDowloaded = true;
                textureImages.forEach(image => {
                    if(!image.complete){
                        texturesDowloaded = false;
                    }
                });
                if(texturesDowloaded){
                    main();
                }
            }
        });        
    });
}

var linkTextures = function(){
    textureImages.forEach(textureImage => {
        // Create a texture.
        var texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Fill the texture with a 1x1 black pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                    new Uint8Array([0, 0, 0, 255]));
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, textureImage);
        
        gl.generateMipmap(gl.TEXTURE_2D);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        textureObjects.push(texture);
    });
}

// This is needed if the images are not on the same domain
// NOTE: The server providing the images must give CORS permissions
// in order to be able to use the image with WebGL. Most sites
// do NOT give permission.
// See: http://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html
function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
      img.crossOrigin = "";
    }
  }

window.onload = loadTextures();
