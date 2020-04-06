class WebGlObject {
    constructor(gl, 
                programInfo, 
                vertices, 
                color, 
                position=[0,0,0], 
                speed=[0,0,0], 
                positionLimits = {
                    "Max" : [1000, 1000, 1000],
                    "Min" : [-1000, -1000,-1000]
                },
                orientation=[0,0,0], 
                orientationChangeRate=[0,0,0],
                size=[1,1,1],  
                sizeChangeRate=[1,1,1], 
                scaleLimit=[10,10,10],			
                materialAmbient = [ 1.0, 1.0, 1.0 ],
                materialDiffuse = [ 1.0, 1.0, 1.0 ],
                materialSpecular = [ 1.0, 1.0, 1.0 ],
                materialShininess = 20.0,
                hasShadow = true,
                isLight = false,
                lightIndex,
                name) {

        this.gl = gl;
        this.programInfo = programInfo;
        
        // Contains vertices' positions, normals, texcoords, and indices
        this.vertices = vertices;
        //console.log("vertices:",vertices);

        this.color = color;
        this.name = name;

        this.bufferInfo = this.flattenedVertices();
        this.uniforms = {	u_surfaceColor: color,
                        };
        this.position = position;
        this.positionLimits = positionLimits;
        this.rotation = orientation;
        this.scale = size;
        this.speed = speed;
        this.orientationChangeRate = orientationChangeRate;
        this.sizeChangeRate = sizeChangeRate;
        this.time = 0;
        this.scaleLimit = scaleLimit;

        this.translation = this.position;
        this.enabled = true;

        // material properties
        this.materialAmbient = materialAmbient;
        this.materialDiffuse = materialDiffuse;
        this.materialSpecular = materialSpecular;
        this.materialShininess = materialShininess;

        // Shadow
        this.hasShadow = hasShadow;
        
        // lighting
        this.isLight = isLight;
        this.lightIndex = lightIndex;

        // print buffer info
        //console.log(this.bufferInfo);
        //console.log(this);
    }

    flattenedVertices() {
        return webglUtils.createBufferInfoFromArrays(
            this.gl,
            primitives.makeRandomVertexColors(
                primitives.deindexVertices(this.vertices),
                {
                    vertsPerColor: 6,
                    rand: function(ndx, channel) {
                    return channel < 3 ? ((128 + Math.random() * 128) | 0) : 255;
                    }
                })
        );
    }

    update(time){
        const delta = (time - this.time)/1000;
        this.time = time;

        this.position = this.simulate(this.position,this.speed,delta);
        this.bounce(this.position,this.speed, this.positionLimits.Max,this.positionLimits.Min);
        this.translation = [this.position[0],this.position[1],this.position[2]];

        this.rotation = this.simulate(this.rotation,this.orientationChangeRate,delta);
        
        this.scale = this.simulateSize(this.scale,this.sizeChangeRate,delta);
        this.bounceScale(this.scaleLimit);
    }

    simulate(vector,changeRate,timeDelta){
        if(this.enabled){
            if(this.isLight) {
                lightPosition[this.lightIndex] = this.position;
                lightPosition[this.lightIndex][3] = 1;
                //console.log('islight:',this.isLight,this.position,lightPosition)
            }
            return vecAdd(vector,multByScalar(changeRate,timeDelta));
        }
        else{
            return vector;
        }
    }

    simulateSize(vector,changeRate,timeDelta){
        return this.enabled? mult(vector,changeRate):vector;
    }

    bounce(vector,changeRate,limitsHigh,limitsLow){
        for (var i = 0; i < vector.length; i++) {
            if(vector[i]>limitsHigh[i]){
                changeRate[i] = -1* changeRate[i];
                vector[i] = limitsHigh[i];
            }
            if(vector[i]<limitsLow[i]){
                changeRate[i] = -1* changeRate[i];
                vector[i] = limitsLow[i];
            }
        }
    }

    bounceScale(limits){
        var vector = this.scale;

        for (var i = 0; i < vector.length; i++) {
            if(vector[i]>limits[i]){
                this.sizeChangeRate[i] = 1/this.sizeChangeRate[i];
                vector[i] = limits[i];
            } else if(vector[i]<1/limits[i]){
                this.sizeChangeRate[i] = 1/this.sizeChangeRate[i];
                vector[i] = 1/limits[i];				
            }
        }
    }

    limitVector(vector,limits){
        var newVec = [];
        for (var i = 0; i < vector.length; i++) {
            newVec[i] = vector[i] % limits[i];
        }
        return newVec;
    }

    draw(time){

        this.gl.useProgram(this.programInfo.program);

        // Setup all the needed attributes.
        webglUtils.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);

        this.uniforms.u_matrix = this.computeMatrix(
            this.translation,
            this.rotation,
            this.scale);

        var transfMatrix = this.computeMatrix(
            m4.identity(),
            [0,0,0],
            this.rotation,
            this.scale);
            
        this.uniforms.u_shading_mode = shadingMode;
        this.uniforms.u_transformation_matrix = transfMatrix;
        this.uniforms.u_modelViewMatrix = viewMatrix;
        this.uniforms.u_projectionMatrix = projectionMatrix;
        this.uniforms.u_viewWorldPosition = cameraPosition;

        var ambientProduct = [];
        var diffuseProduct = [];
        var specularProduct = [];

        // Update my lighting parameters
        for (let index = 0; index < lightAmbient.length; index++) {
            ambientProduct[index] = mult(lightAmbient[index], this.materialAmbient);
            diffuseProduct[index] = mult(lightDiffuse[index], this.materialDiffuse);
            specularProduct[index] = mult(lightSpecular[index], this.materialSpecular);
        }
                
        this.uniforms.u_shininess = this.materialShininess;

        this.uniforms.u_shadow = 0.0;
        this.uniforms.u_spotlightInnerLimit = spotlightInnerLimit;
        this.uniforms.u_spotlightOuterLimit = spotlightOuterLimit;

        var lightPositionsLocation = this.gl.getUniformLocation(this.programInfo.program, "u_lightPositions");
        this.gl.uniform4fv(lightPositionsLocation,flatten(lightPosition));
        var lightDirectionLocation = this.gl.getUniformLocation(this.programInfo.program, "u_lightDirections");
        this.gl.uniform3fv(lightDirectionLocation,flatten(lightDirection));
        var ambientProductLocation = this.gl.getUniformLocation(this.programInfo.program, "u_ambientColors");
        this.gl.uniform3fv(ambientProductLocation,flatten(ambientProduct));
        var diffuseProductLocation = this.gl.getUniformLocation(this.programInfo.program, "u_diffuseColors");
        this.gl.uniform3fv(diffuseProductLocation,flatten(diffuseProduct));
        var specularProductLocation = this.gl.getUniformLocation(this.programInfo.program, "u_specularColors");
        this.gl.uniform3fv(specularProductLocation,flatten(specularProduct));

        // Set the uniforms we just computed
        webglUtils.setUniforms(this.programInfo, this.uniforms);

        this.gl.depthMask(true);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.bufferInfo.numElements);
        this.gl.depthMask(false);

        if(this.hasShadow && shadingMode<2){
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.DST_COLOR);

            for (let index = 0; index < lightPosition.length; index++) {
                // if light is very dim do not render its shadow
                // reduce function returns the summ of RGB intensities
                if(lightColor[index].reduce((a,b) => a + b, 0) < 0.1 || lightPosition[index][2] < 0)
                    continue;

                // model-view matrix for shadow then render
                var black = vec4(0.0, 0.0, 0.0, 1.0);
                var lightSource = lightPosition[index];
                var para1 = translate(lightSource[0], lightSource[1], lightSource[2]);
                var src = viewMatrix;
                para1[0] = [src[0],src[4],src[8],src[12]];
                para1[1] = [src[1],src[5],src[9],src[13]];
                para1[2] = [src[2],src[6],src[10],src[14]];
                para1[3] = [src[3],src[7],src[11],src[15]];
                var para2 = translate(lightSource[0], lightSource[1], lightSource[2]);
                var shadow_modelViewMatrix = mult(para1, para2);

                xyPlaneShadowsTransformationMatrix[index] = mat4();
                xyPlaneShadowsTransformationMatrix[index][3][3] = 0;
                xyPlaneShadowsTransformationMatrix[index][3][2] = -1/lightPosition[index][2];

                //console.log("modelViewMatrix:",para1,"translate:",para2,"modelViewMatrix",shadow_modelViewMatrix)
                shadow_modelViewMatrix = mult(shadow_modelViewMatrix, xyPlaneShadowsTransformationMatrix[index]);
                shadow_modelViewMatrix = mult(shadow_modelViewMatrix, translate(-lightSource[0], -lightSource[1],-lightSource[2]));
                
                this.uniforms.u_modelViewMatrix = flatten(shadow_modelViewMatrix);
                this.uniforms.u_shadow = 1.0;
                this.uniforms.u_shadow_light_index = index;
                
                webglUtils.setUniforms(this.programInfo, this.uniforms);
                this.gl.drawArrays(this.gl.TRIANGLES, 0, this.bufferInfo.numElements);					
            }
            //this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.disable(this.gl.BLEND);
        }
    }

    computeMatrix( translation, rotation, scale){
        var matrix = m4.identity();

        matrix = m4.translate(matrix,
            translation[0],
            translation[1],
            translation[2]);

        matrix = m4.xRotate(matrix, rotation[0]);

        matrix = m4.yRotate(matrix, rotation[1]);

        matrix = m4.zRotate(matrix, rotation[2]);

        matrix = m4.scale(matrix,
            scale[0],
            scale[1],
            scale[2]);

        return matrix;
    }

    toggleAnimation(){
        this.enabled = !this.enabled;
    }
}
