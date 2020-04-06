// Light options elements
var lightIntensitySliders = document.getElementsByClassName("lightIntensitySlider");
var lightSelectionSlider = document.getElementById("light-selection-slider");
var lightPropertiesSliders = document.getElementsByClassName("lightPropertiesSlider");
var selectedLight = lightSelectionSlider.value;

// Materials options elements
var shapeSelectionSlider = document.getElementById("shape-selection-slider");
var matrialPropertiesSliders = document.getElementsByClassName("materialPropertySlider");
var selectedShape = shapeSelectionSlider.value; 

document.onkeydown = function(e) {
    var dir = [-cameraPosition[0]+target[0],
                    -cameraPosition[1]+target[1],
                    -cameraPosition[2]+target[2],
                    0];

    var normDir = normalize(dir);

    if (e.which >= '1'.charCodeAt(0) && e.which <= '9'.charCodeAt(0)){
        scene.toggleAnimation(e.which-48);
    }
    else if (e.which == 'W'.charCodeAt(0)){ // Forward
        cameraPosition = vecAdd(cameraPosition,normDir);
        target = vecAdd(target,normDir);
        orthoscale *= .99; 
        moveSpotLight(0,0);
    }
    else if (e.which == 'S'.charCodeAt(0)){ // Back
        cameraPosition = vecAdd(cameraPosition,multByScalar(normDir,-1));
        target = vecAdd(target,multByScalar(normDir,-1));
        orthoscale *= 1.01;
        moveSpotLight(0,0);
    }
    else if (e.which == 'A'.charCodeAt(0)){ // left
        var newDir = rotateY(normDir,-0.2);
        target = vecAdd(cameraPosition,newDir);
        moveSpotLight(0,0);
    }
    else if (e.which == 'D'.charCodeAt(0)){ // right
        var newDir = rotateY(normDir,0.2);
        target = vecAdd(cameraPosition,newDir);
        moveSpotLight(0,0);
    }
    else if (e.which == 'E'.charCodeAt(0)){ // up
        var dirInCamerCoor = normalize(vecMatProduct(normDir,cameraMatrix));
        var newDirInCamerCoor = normalize(rotateX([dirInCamerCoor[0],dirInCamerCoor[1],dirInCamerCoor[2]],-0.2));
        var newDir = normalize(vecMatProduct(newDirInCamerCoor,m4.inverse(cameraMatrix)));
        if(newDir[1]<0.8){
            target = vecAdd(cameraPosition,newDir);
        }
        moveSpotLight(0,0);
    }
    else if (e.which == 'Q'.charCodeAt(0)){ // down
        var dirInCamerCoor = normalize(vecMatProduct(normDir,cameraMatrix));
        var newDirInCamerCoor = normalize(rotateX([dirInCamerCoor[0],dirInCamerCoor[1],dirInCamerCoor[2]],0.2));
        var newDir = normalize(vecMatProduct(newDirInCamerCoor,m4.inverse(cameraMatrix)));
        if(newDir[1]>-0.8){
            target = vecAdd(cameraPosition,newDir);
        }
        moveSpotLight(0,0);
    }
    else if (e.which == 'O'.charCodeAt(0)){
        console.log('Orthographic');
        view = viewTypes['Orthographic'];
    }
    else if (e.which == 'P'.charCodeAt(0)){
        console.log('Perspective');
        view = viewTypes['Perspective'];
    }
    else if (e.which == 'X'.charCodeAt(0)){
        var dis = document.getElementById("sidebar").style.display ;
        document.getElementById("sidebar").style.display = dis != "none" ? "none":"block";
    }
    else if (e.which == 'M'.charCodeAt(0)){
        lightPosition[2][0] += 10;
    }
    else if (e.which == 'B'.charCodeAt(0)){
        lightPosition[2][0] -= 10;
    }
    else if (e.which == 'H'.charCodeAt(0)){
        lightPosition[2][1] += 10;
    }
    else if (e.which == 'N'.charCodeAt(0)){
        lightPosition[2][1] -= 10;
    }
    else if (e.which == 'J'.charCodeAt(0)){
        lightPosition[2][2] += 10;
        lightPosition[2][2] = Math.max(lightPosition[2][2],0);
    }
    else if (e.which == 'G'.charCodeAt(0)){
        lightPosition[2][2] -= 10;
        lightPosition[2][2] = Math.max(lightPosition[2][2],0);
    }
    else if (e.which == 'F'.charCodeAt(0)){
        shadingMode = (shadingMode+1)%3;
        var shadingSpans = document.getElementsByClassName("shading");
        for (let index = 0; index < shadingSpans.length; index++) {
            var element = shadingSpans[index];
            if(index == shadingMode){
                element.classList.add("active");
            } else{
                element.classList.remove("active");
            }
        }
    }
    else if (e.which == 'Z'.charCodeAt(0)){
        //lightPosition[0] = cameraPosition[0];
        //lightPosition[1] = cameraPosition[1];
        //lightPosition[2] = cameraPosition[2];
        console.log(cameraPosition,lightPosition);
    }
    else if(e.keyCode == 32){
        paused = !paused;
        var pause_screen = document.getElementById("pause-screen") ;

        if(paused){
            pause_screen.classList.remove("hidden");
        }else{
            pause_screen.classList.add("hidden");
        }
    }
    else if(e.keyCode == 38){
        spotlightInnerLimit = Math.max(0.4,spotlightInnerLimit-0.005)
        spotlightOuterLimit = Math.max(0.2,spotlightOuterLimit-0.005)
    }
    else if(e.keyCode == 40){
        spotlightInnerLimit = Math.min(0.999,spotlightInnerLimit+0.005)
        spotlightOuterLimit = Math.min(0.95,spotlightOuterLimit+0.005)
    }
};

document.onmousemove = function( event ) {
    moveSpotLight((event.pageX/gl.canvas.clientWidth - 0.5)*3.14/4, (event.pageY/gl.canvas.clientHeight-0.5)*3.14/4);
};

var updateLights = function () {
    lightSpecular = [multByScalar(lightColor[0], lightProperties[0][0]), multByScalar(lightColor[1], lightProperties[1][0]), multByScalar(lightColor[2], lightProperties[2][0]), multByScalar(lightColor[3], lightProperties[3][0]), multByScalar(lightColor[4], lightProperties[4][0])];
    lightDiffuse = [multByScalar(lightColor[0], lightProperties[0][1]), multByScalar(lightColor[1], lightProperties[1][1]), multByScalar(lightColor[2], lightProperties[2][1]), multByScalar(lightColor[3], lightProperties[3][1]), multByScalar(lightColor[4], lightProperties[4][1])];
    lightAmbient = [multByScalar(lightColor[0], lightProperties[0][2]), multByScalar(lightColor[1], lightProperties[1][2]), multByScalar(lightColor[2],lightProperties[2][2]), multByScalar(lightColor[3], lightProperties[3][2]), multByScalar(lightColor[4], lightProperties[4][2])];
}

var updateLightProperties = function(){			
    var lightIndex = lightSelectionSlider.value;
    lightProperties[lightIndex][0] = document.getElementById("specular-intensity-slider").value;
    lightProperties[lightIndex][1] = document.getElementById("diffuse-intensity-slider").value;
    lightProperties[lightIndex][2] = document.getElementById("ambient-intensity-slider").value;
    lightColor[lightIndex][0] = document.getElementById("red-intensity-slider").value;
    lightColor[lightIndex][1] = document.getElementById("green-intensity-slider").value;
    lightColor[lightIndex][2] = document.getElementById("blue-intensity-slider").value;
    updateLights();
}

var updateLightPropertiesSliders = function(lightIndex){
    document.getElementById("selected-light-label").textContent = document.getElementsByClassName("light-intensity-title")[lightIndex].textContent;
    document.getElementById("specular-intensity-slider").value = lightProperties[lightIndex][0];
    document.getElementById("diffuse-intensity-slider").value = lightProperties[lightIndex][1];
    document.getElementById("ambient-intensity-slider").value = lightProperties[lightIndex][2];
    document.getElementById("red-intensity-slider").value = lightColor[lightIndex][0];
    document.getElementById("green-intensity-slider").value = lightColor[lightIndex][1];
    document.getElementById("blue-intensity-slider").value = lightColor[lightIndex][2];
}

var selectedLightChanged = function() {
    var selectedLight = lightSelectionSlider.value;
    updateLightPropertiesSliders(selectedLight);
}

var lightIntensitySlidersChanged = function() {
    for (let index = 0; index < lightIntensitySliders.length; index++) {
        const element = lightIntensitySliders[index];
        lightColor[index] = multByScalar(lightColorBase[index], lightIntensitySliders[index].value);				
    }
    updateLights();
    selectedLightChanged();
}
        
var updateMaterialProperties = function(){			
    var shapeIndex = shapeSelectionSlider.value;
    scene.objects[shapeIndex].materialSpecular[0] = document.getElementById("specular-property-slider").value;
    scene.objects[shapeIndex].materialSpecular[1] = document.getElementById("specular-property-slider").value;
    scene.objects[shapeIndex].materialSpecular[2] = document.getElementById("specular-property-slider").value;
    scene.objects[shapeIndex].materialAmbient[0] = document.getElementById("diffuse-property-slider").value;
    scene.objects[shapeIndex].materialAmbient[1] = document.getElementById("diffuse-property-slider").value;
    scene.objects[shapeIndex].materialAmbient[2] = document.getElementById("diffuse-property-slider").value;
    scene.objects[shapeIndex].materialDiffuse[0] = document.getElementById("ambient-property-slider").value;
    scene.objects[shapeIndex].materialDiffuse[1] = document.getElementById("ambient-property-slider").value;
    scene.objects[shapeIndex].materialDiffuse[2] = document.getElementById("ambient-property-slider").value;
    scene.objects[shapeIndex].materialShininess = document.getElementById("shineness-property-slider").value;
    scene.objects[shapeIndex].color[0] = document.getElementById("red-property-slider").value;
    scene.objects[shapeIndex].color[1] = document.getElementById("green-property-slider").value;
    scene.objects[shapeIndex].color[2] = document.getElementById("blue-property-slider").value;
}

var updateMaterialPropertiesSliders = function(shapeIndex){
    document.getElementById("selected-shape-label").textContent = scene.objects[shapeIndex].name;
    document.getElementById("specular-property-slider").value = scene.objects[shapeIndex].materialSpecular[0];
    document.getElementById("diffuse-property-slider").value = scene.objects[shapeIndex].materialAmbient[0];
    document.getElementById("ambient-property-slider").value = scene.objects[shapeIndex].materialDiffuse[0];
    document.getElementById("shineness-property-slider").value = scene.objects[shapeIndex].materialShininess;
    document.getElementById("red-property-slider").value = scene.objects[shapeIndex].color[0];
    document.getElementById("green-property-slider").value = scene.objects[shapeIndex].color[1];
    document.getElementById("blue-property-slider").value = scene.objects[shapeIndex].color[2];
}

var selectedShapeChanged = function() {
    var selectedShape = shapeSelectionSlider.value;
    updateMaterialPropertiesSliders(selectedShape);
}

// Linking HTML elements to changed functions
lightSelectionSlider.oninput = selectedLightChanged;
for (let index = 0; index < lightPropertiesSliders.length; index++) {
    lightPropertiesSliders[index].oninput = updateLightProperties;
}

for (let index = 0; index < lightIntensitySliders.length; index++) {
    lightIntensitySliders[index].oninput = lightIntensitySlidersChanged;
}

shapeSelectionSlider.oninput = selectedShapeChanged;
for (let index = 0; index < matrialPropertiesSliders.length; index++) {
    matrialPropertiesSliders[index].oninput = updateMaterialProperties;
}
