function copyOf(obj) {
    return JSON.parse(JSON.stringify(obj));		
}

function degToRad(d){

    return d * Math.PI / 180;
}

function vecAdd(v1,v2){
    var resV = [];
    for (var i = 0; i < v1.length; i++) {
        resV[i] = v1[i]+v2[i];
    }
    return resV;
}

function multByScalar(v1,scalar) {
    var resV = [];
    for (var i = 0; i < v1.length; i++) {
        resV[i] = v1[i]*scalar;
    }
    return resV;
}

function vecMatProduct(vec,mat){
    if(vec.length<4)
        vec.push(0);

    var result = [ 
    vec[0]*mat[0]+vec[1]*mat[1]+vec[2]*mat[2]+vec[3]*mat[3],
    vec[0]*mat[4+0]+vec[1]*mat[4+1]+vec[2]*mat[4+2]+vec[3]*mat[4+3],
    vec[0]*mat[8+0]+vec[1]*mat[8+1]+vec[2]*mat[8+2]+vec[3]*mat[8+3],
    vec[0]*mat[12+0]+vec[1]*mat[12+1]+vec[2]*mat[12+2]+vec[3]*mat[12+3]
    ];


    return result;
}

function normalize(dir){
    var length = Math.sqrt(dir[0]*dir[0]+dir[1]*dir[1]+dir[2]*dir[2]);
    var normalized = [dir[0]/length,dir[1]/length,dir[2]/length];
    normalized = dir.length == 4 ? normalized.concat(dir[3]) : normalized;

    return length != 0 ? normalized : dir;
}

function rotateZ(vec, theta){
    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    return [	vec[0]*cos+vec[1]*sin,
                -vec[0]*sin+vec[1]*cos,
                vec[2]
                ];
}

function rotateY(vec, theta){
    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    return [	vec[0]*cos-vec[2]*sin,
                vec[1],
                vec[0]*sin+vec[2]*cos
                ];
}

function rotateX(vec, theta){
    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    return [	vec[0],
                vec[1]*cos+vec[2]*sin,
                -vec[1]*sin+vec[2]*cos
                ];
}
