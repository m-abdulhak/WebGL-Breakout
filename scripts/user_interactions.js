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
    if (e.which >= '1'.charCodeAt(0) && e.which <= '9'.charCodeAt(0)){
        scene.toggleAnimation(e.which-48);
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
        scene.mainLights[0].position[0] += 10;
    }
    else if (e.which == 'B'.charCodeAt(0)){
        scene.mainLights[0].position[0] -= 10;
    }
    else if (e.which == 'H'.charCodeAt(0)){
        scene.mainLights[0].position[1] += 10;
    }
    else if (e.which == 'N'.charCodeAt(0)){
        scene.mainLights[0].position[1] -= 10;
    }
    else if (e.which == 'J'.charCodeAt(0)){
        scene.mainLights[0].position[2] += 10;
        scene.mainLights[0].position[2] = Math.max(scene.mainLights[0].position[2],0);
    }
    else if (e.which == 'G'.charCodeAt(0)){
        scene.mainLights[0].position[2] -= 10;
        scene.mainLights[0].position[2] = Math.max(scene.mainLights[0].position[2],0);
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
        //console.log(cameraPosition,lightPosition);
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
        scene.decreaseSpotlightInnerLimit();
        scene.decreaseSpotlightOuterLimit();
    }
    else if(e.keyCode == 40){
        scene.increaseSpotlightInnerLimit();
        scene.increaseSpotlightOuterLimit();
    }
    else if(e.keyCode == 'R'.charCodeAt(0)){
        cameraPosition = defCameraPosition;
        target = defTarget;
    }
    else if(e.keyCode == 'L'.charCodeAt(0)){
        soundBackground.muted = !soundBackground.muted;
    }
};

document.onmousemove = function( event ) {
    moveSpotLight((event.pageX/gl.canvas.clientWidth - 0.5)*3.14/4, (event.pageY/gl.canvas.clientHeight-0.5)*3.14/4);
};

var updateLightProperties = function(){		
    if(scene !== undefined){
        var lightIndex = lightSelectionSlider.value;

        var newLightProperties = {  specular: document.getElementById("specular-intensity-slider").value, 
                                    diffuse: document.getElementById("diffuse-intensity-slider").value, 
                                    ambient: document.getElementById("ambient-intensity-slider").value};
        
        var newLightColor = [   document.getElementById("red-intensity-slider").value, 
                                document.getElementById("green-intensity-slider").value, 
                                document.getElementById("blue-intensity-slider").value];
        
        scene.changeLightsProperties(lightIndex, newLightProperties);
        scene.changeLightsColor(lightIndex, newLightColor);
    }	
}

var selectedLightChanged = function() {
    var selectedLight = lightSelectionSlider.value;
    updateLightPropertiesSliders(selectedLight);
}

var updateLightPropertiesSliders = function(lightIndex){	
    if(scene !== undefined){
        document.getElementById("selected-light-label").textContent = document.getElementsByClassName("light-intensity-title")[lightIndex].textContent;
        document.getElementById("specular-intensity-slider").value = scene.lightElements[lightIndex][0].properties.specular;
        document.getElementById("diffuse-intensity-slider").value = scene.lightElements[lightIndex][0].properties.diffuse;
        document.getElementById("ambient-intensity-slider").value = scene.lightElements[lightIndex][0].properties.ambient;
        document.getElementById("red-intensity-slider").value = scene.lightElements[lightIndex][0].color[0];
        document.getElementById("green-intensity-slider").value = scene.lightElements[lightIndex][0].color[1];
        document.getElementById("blue-intensity-slider").value = scene.lightElements[lightIndex][0].color[2];
    }	
}

var lightIntensitySlidersChanged = function() {	
    if(scene !== undefined){
        for (let index = 0; index < lightIntensitySliders.length; index++) {
            scene.changeLightsIntensity(index, lightIntensitySliders[index].value);				
        }
        selectedLightChanged();
    }	
}
        
var updateMaterialProperties = function(){			
    var shapeIndex = shapeSelectionSlider.value;
    scene.changeElementsProperties(
        shapeIndex,
        document.getElementById("specular-property-slider").value,
        document.getElementById("diffuse-property-slider").value,
        document.getElementById("ambient-property-slider").value,
        document.getElementById("shineness-property-slider").value
    );
}

var updateMaterialPropertiesSliders = function(shapeIndex){
    document.getElementById("selected-shape-label").textContent = scene.elements[shapeIndex][0].name;
    document.getElementById("specular-property-slider").value = scene.elements[shapeIndex][0].materialSpecular[0];
    document.getElementById("diffuse-property-slider").value = scene.elements[shapeIndex][0].materialAmbient[0];
    document.getElementById("ambient-property-slider").value = scene.elements[shapeIndex][0].materialDiffuse[0];
    document.getElementById("shineness-property-slider").value = scene.elements[shapeIndex][0].materialShininess;
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

var moveSpotLight = function (diffX, diffY) {
    if(scene !== undefined){
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

        scene.changeSpotLightDirection([newDir[0],newDir[1],newDir[2]]);
        scene.changeSpotLightPosition([cameraPosition[0], cameraPosition[1], cameraPosition[2], 0.0]);
    }
}

var upadeteUiWithGameState = function(){
    document.getElementById("life-label").innerHTML = lives;
    document.getElementById("score-label").innerHTML = score;
}