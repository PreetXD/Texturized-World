// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'precision mediump float;\n' +
    'attribute vec2 a_UV;\n' +
    'varying vec2 v_UV;\n' +
    'attribute vec3 a_Normal;\n' +
    'varying vec3 v_Normal;\n' +
    'attribute vec4 a_Position;\n' +
    'varying vec4 v_VertPos;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_GlobalRotateMatrixHor;\n' +
    'uniform mat4 u_GlobalRotateMatrixVer;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ProjectionMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrixHor *u_GlobalRotateMatrixVer * u_ModelMatrix * a_Position;\n' +
    '  v_UV = a_UV;\n' +
    '  v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));\n' +
    //'  v_Normal = a_Normal;\n' +
    '  v_VertPos = u_ModelMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec2 v_UV;\n' +
    'varying vec3 v_Normal;\n' +
    'uniform vec4 u_FragColor;\n' + // uniform変数
    'uniform vec3 u_cameraPos;\n' +
    'uniform vec3 u_lightPos;\n' +
    'varying vec4 v_VertPos;\n' +
    'uniform sampler2D u_Sampler0;\n' +
    'uniform sampler2D u_Sampler1;\n' +
    'uniform sampler2D u_Sampler2;\n' +
    'uniform sampler2D u_Sampler3;\n' +
    'uniform int u_whichTexture;\n' +
    'uniform bool u_lightOn;\n' +
    'void main() {\n' +
    '  if(u_whichTexture == -3){\n' + //color
    '    gl_FragColor = vec4((v_Normal+1.0)/2.0,1.0);\n' +
    '  }\n' +
    '  else if(u_whichTexture == -2){\n' + //color
    '    gl_FragColor = u_FragColor;\n' +
    '  }\n' +
    '  else if(u_whichTexture == -1){\n' + //uv debug
    '    gl_FragColor = vec4(v_UV, 1, 1);\n' +
    '  }\n' +
    '  else if(u_whichTexture == 0){\n' + //texture 0 = sky
    '    gl_FragColor = texture2D(u_Sampler0, v_UV);\n' +
    '  }\n' +
    '  else if(u_whichTexture == 1){\n' + //texture 1 = dirt
    '    gl_FragColor = texture2D(u_Sampler1, v_UV);\n' +
    '  }\n' +
    '  else if(u_whichTexture == 2){\n' + //texture 2 = floor
    '    gl_FragColor = texture2D(u_Sampler2, v_UV);\n' +
    '  }\n' +
    '  else if(u_whichTexture == 3){\n' + //texture 3 = grass
    '    gl_FragColor = texture2D(u_Sampler3, v_UV);\n' +
    '  }\n' +
    '  else{\n' + //red
    '    gl_FragColor = vec4(1,1,.2,1);\n' +
    '  }\n' +
    '  vec3 lightVector = u_lightPos - vec3(v_VertPos);\n' +
    '  float r = length(lightVector);\n' +
    // '  if(r < 1.0){\n' +
    // '    gl_FragColor = vec4(1,0,0,1);\n' +
    // '  } else if (r<2.0){\n' +
    // '    gl_FragColor = vec4(0,1,0,1);\n' +
    // '  }\n' +
    //'  gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);\n' +
    '  vec3 L = normalize(lightVector);\n' +
    '  vec3 N = normalize(v_Normal);\n' +
    '  float nDotL = max(dot(N,L), 0.0);\n' +
    '  vec3 R = reflect(-L, N);\n' +
    '  vec3 E = normalize(u_cameraPos - vec3(v_VertPos));\n' +
    '  float specular = pow(max(dot(E,R), 0.0), 5.0);\n' +
    '  vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;\n' +
    '  vec3 ambient = vec3(gl_FragColor) * 0.3;\n' +
    '  if(u_lightOn){\n' +
    '    if(u_whichTexture == 0){\n' +
    '      gl_FragColor = vec4(specular + diffuse + ambient, 1.0);\n' +
    '    } else {\n' +
    '      gl_FragColor = vec4(diffuse + ambient, 1.0);\n' +
    '    }\n' +
    '  }\n' +
    '}\n';


// global variabales
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrixHor;
let u_GlobalRotateMatrixVer;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_NormalMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
// user selected color and size
let g_globalAngleHor = 0;
let g_globalAngleVer = 0;
//animation
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;
//camera
let g_Camera = new Camera();
let g_normalOn = false;
let g_lightPos = [0, 1, -2];
let g_lightOn = true;

function main() {

    setupWebGL();

    connectVariablestoGLSL();

    addActionForHTMLUI();

    // Register function (event handler) to be called on a mouse press
    // canvas.onmousedown = click;
    // canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev); } };

    document.onkeydown = keydown;

    initTextures();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.viewport(25, 100, canvas.width, canvas.height);

    //Render
    renderAllShapes();

    requestAnimationFrame(tick);
}

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    //flag to not make laggy
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablestoGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
        console.log('Failed to get storage location of u_lightPos');
        return;
    }

    u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
    if (!u_lightOn) {
        console.log('Failed to get storage location of u_lightOn');
        return;
    }

    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_lightPos) {
        console.log('Failed to get storage location of u_cameraPos');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log("Failed to get storage location of u_ModelMatrix");
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log("Failed to get storage location of u_ViewMatrix");
        return;
    }

    u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_NormalMatrix) {
        console.log("Failed to get storage location of u_NormalMatrix");
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log("Failed to get storage location of u_ProjectionMatrix");
        return;
    }

    u_GlobalRotateMatrixHor = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrixHor');
    if (!u_GlobalRotateMatrixHor) {
        console.log("Failed to get storage location of u_GlobalRotateMatrixHor");
        return;
    }

    u_GlobalRotateMatrixVer = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrixVer');
    if (!u_GlobalRotateMatrixVer) {
        console.log("Failed to get storage location of u_GlobalRotateMatrixVer");
        return;
    }

    // Get the storage location of u_Sampler
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return false;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_Sampler2');
        return false;
    }

    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler3) {
        console.log('Failed to get the storage location of u_Sampler3');
        return false;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get storage of u_whichTexture');
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements)
}

function addActionForHTMLUI() {
    //slider function for size
    document.getElementById("angleSlideHor").addEventListener("mousemove", function() {
        g_globalAngleHor = this.value;
        renderAllShapes();
    });

    document.getElementById("angleSlideVer").addEventListener("mousemove", function() {
        g_globalAngleVer = this.value;
        renderAllShapes();
    });
    document.getElementById("lightSlideX").addEventListener("mousemove", function(ev) {
        if (ev.buttons == 1) {
            g_lightPos[0] = this.value / 100;
        }
        renderAllShapes();
    });

    document.getElementById("lightSlideY").addEventListener("mousemove", function(ev) {
        if (ev.buttons == 1) {
            g_lightPos[1] = this.value / 100;
        }
        renderAllShapes();
    });
    document.getElementById("lightSlideZ").addEventListener("mousemove", function(ev) {
        if (ev.buttons == 1) {
            g_lightPos[2] = this.value / 100;
        }
        renderAllShapes();
    });

    document.getElementById("normalOn").onclick = function() { g_normalOn = true; };
    document.getElementById("normalOff").onclick = function() { g_normalOn = false; };
    document.getElementById("lightOn").onclick = function() { g_lightOn = true; };
    document.getElementById("lightOff").onclick = function() { g_lightOn = false; };
}

function initTextures() {
    var image1 = new Image(); // Create the image object
    if (!image1) {
        console.log('Failed to create the image object');
        return false;
    }
    // Register the event handler to be called on loading an image
    image1.onload = function() { sendImageToTEXTURE0(image1); };
    // Tell the browser to load an image
    image1.src = 'sky.jpg';

    var image2 = new Image();
    if (!image2) {
        console.log('Failed to create image2');
        return false;
    }
    image2.onload = function() { sendImageToTEXTURE1(image2); };
    image2.src = 'dirt.png';

    var image3 = new Image();
    if (!image3) {
        console.log('Failed to create image3');
        return false;
    }
    image3.onload = function() { sendImageToTEXTURE2(image3); };
    image3.src = 'floor.png'

    var image4 = new Image();
    if (!image4) {
        console.log('Failed to create image4');
        return false;
    }
    image4.onload = function() { sendImageToTEXTURE3(image4); };
    image4.src = 'grass.png'

    return true;
}

function sendImageToTEXTURE0(image) {
    var texture = gl.createTexture(); // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendImageToTEXTURE1(image) {
    var texture1 = gl.createTexture(); // Create a texture object
    if (!texture1) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture1);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler1, 1);

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendImageToTEXTURE2(image) {
    var texture2 = gl.createTexture(); // Create a texture object
    if (!texture2) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE2);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture2);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler2, 2);

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendImageToTEXTURE3(image) {
    var texture3 = gl.createTexture(); // Create a texture object
    if (!texture3) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE3);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture3);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler3, 3);

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}

let g_map = [ //32x32
    [8, 8, 7, 8, 7, 6, 5, 6, 7, 8, 6, 7, 8, 7, 6, 2, 3, 4, 4, 5, 6, 7, 8, 7, 7, 5, 6, 7, 8, 7, 6, 5],
    [8, 5, 6, 7, 8, 2, 3, 5, 5, 6, 6, 7, 7, 6, 5, 2, 2, 3, 4, 4, 4, 5, 5, 4, 6, 6, 5, 6, 7, 8, 2, 3],
    [8, 3, 2, 3, 6, 6, 3, 4, 5, 6, 7, 8, 4, 4, 3, 2, 3, 4, 5, 6, 3, 0, 0, 5, 6, 6, 3, 2, 3, 6, 6, 3],
    [8, 4, 6, 4, 6, 7, 8, 5, 5, 6, 7, 0, 0, 0, 0, 5, 4, 2, 4, 0, 0, 0, 0, 0, 6, 6, 4, 6, 4, 6, 7, 8],
    [4, 4, 6, 7, 7, 7, 4, 3, 6, 6, 0, 0, 0, 0, 0, 4, 4, 3, 6, 6, 0, 0, 0, 0, 0, 5, 4, 6, 7, 7, 7, 4],
    [3, 5, 4, 3, 2, 4, 6, 4, 5, 6, 7, 0, 0, 0, 0, 3, 5, 8, 8, 5, 0, 0, 0, 0, 0, 0, 6, 5, 4, 3, 2, 6],
    [6, 6, 7, 8, 8, 6, 7, 6, 6, 6, 7, 8, 0, 0, 0, 4, 4, 6, 8, 6, 0, 0, 0, 4, 3, 2, 4, 6, 4, 5, 6, 7],
    [4, 3, 4, 6, 8, 8, 6, 4, 5, 6, 7, 0, 0, 0, 0, 3, 3, 5, 7, 5, 0, 0, 0, 3, 4, 6, 8, 8, 6, 4, 5, 6],
    [5, 6, 7, 6, 7, 5, 6, 4, 3, 6, 0, 0, 0, 0, 0, 0, 2, 3, 5, 0, 0, 0, 0, 0, 5, 6, 7, 6, 7, 5, 6, 5],
    [3, 4, 5, 6, 7, 8, 7, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 6, 7, 5, 6, 6],
    [4, 5, 6, 7, 8, 7, 6, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 4, 5, 5],
    [7, 8, 7, 6, 5, 6, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6],
    [8, 7, 5, 6, 7, 6, 5, 3, 0, 0, 0, 0, 0, 6, 6, 6, 6, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 7],
    [6, 8, 7, 6, 8, 7, 8, 6, 0, 0, 0, 0, 5, 7, 7, 7, 7, 6, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
    [7, 6, 6, 4, 5, 4, 7, 5, 0, 0, 0, 0, 6, 7, 8, 8, 7, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 7],
    [6, 4, 5, 6, 5, 4, 4, 3, 0, 0, 0, 0, 6, 7, 8, 8, 7, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6],
    [6, 6, 5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 6, 7, 7, 7, 7, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7],
    [5, 4, 5, 0, 0, 0, 0, 5, 4, 0, 0, 0, 5, 6, 6, 6, 6, 5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5],
    [4, 3, 2, 0, 0, 0, 0, 4, 3, 0, 0, 0, 0, 4, 4, 5, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4],
    [3, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 4, 3, 4, 5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 0, 0, 7, 6, 5, 6, 6],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 6],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 0, 0, 0, 0, 5, 6, 7],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 7, 0, 0, 0, 0, 6, 7, 8],
    [4, 4, 5, 6, 6, 8, 8, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8],
    [5, 4, 5, 6, 7, 8, 7, 6, 5, 4, 0, 0, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 5, 4, 5, 6, 7, 8, 7, 6, 5, 4],
    [6, 3, 2, 3, 6, 6, 3, 4, 5, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 3, 2, 3, 6, 6, 3, 4, 5],
    [6, 4, 6, 4, 6, 7, 8, 7, 6, 6, 0, 0, 0, 0, 6, 7, 6, 0, 0, 0, 0, 0, 0, 0, 6, 4, 6, 4, 6, 7, 8, 7],
    [4, 4, 6, 7, 7, 7, 4, 3, 4, 6, 0, 0, 0, 6, 7, 7, 6, 0, 0, 0, 0, 0, 0, 0, 4, 4, 6, 7, 7, 7, 4, 3],
    [3, 5, 4, 3, 2, 4, 6, 4, 3, 0, 0, 0, 0, 5, 6, 8, 7, 0, 0, 0, 0, 0, 0, 3, 5, 4, 3, 2, 4, 6, 5, 4],
    [6, 6, 7, 8, 8, 6, 7, 6, 2, 3, 4, 5, 0, 4, 7, 8, 7, 0, 0, 0, 0, 0, 7, 6, 6, 7, 8, 8, 6, 7, 6, 3],
    [4, 3, 4, 6, 8, 8, 6, 4, 3, 4, 5, 6, 7, 4, 6, 7, 6, 7, 8, 7, 5, 6, 5, 4, 3, 4, 6, 8, 8, 6, 4, 5]
];

function drawMap() {
    for (x = 0; x < 16; x++) {
        for (y = 0; y < 16; y++) {
            if (g_map[x][y] == 1) {
                var body = new Cube();
                body.textureNum = 3;
                body.color = [1, 1, 1, 1];
                body.matrix.scale(.4, .4, .4);
                body.matrix.translate(x - 16, -.75, y - 16);
                body.renderFast();
            }
            if (g_map[x][y] == 2) {
                var body = new Cube();
                body.textureNum = 1;
                body.color = [1, 1, 1, 1];
                body.matrix.scale(.4, .4, .4);
                body.matrix.translate(x - 16, -.75, y - 16);
                body.renderFast();
                var body2 = new Cube();
                body2.textureNum = 3;
                body2.color = [1, 1, 1, 1];
                body2.matrix.scale(.4, .4, .4);
                body2.matrix.translate(x - 16, 0, y - 16);
                body2.renderFast();
            }
            if (g_map[x][y] == 3) {
                var body = new Cube();
                body.textureNum = 1;
                body.color = [1, 1, 1, 1];
                body.matrix.scale(.4, .4, .4);
                body.matrix.translate(x - 16, -.75, y - 16);
                body.renderFast();
                var body2 = new Cube();
                body2.textureNum = 1;
                body2.color = [1, 1, 1, 1];
                body2.matrix.scale(.4, .4, .4);
                body2.matrix.translate(x - 16, 0, y - 16);
                body2.renderFast();
                var body3 = new Cube();
                body3.textureNum = 3;
                body3.color = [1, 1, 1, 1];
                body3.matrix.scale(.4, .4, .4);
                body3.matrix.translate(x - 16, .75, y - 16);
                body3.renderFast();
            }
            if (g_map[x][y] == 4) {
                var body = new Cube();
                body.textureNum = 1;
                body.color = [1, 1, 1, 1];
                body.matrix.scale(.4, .4, .4);
                body.matrix.translate(x - 16, -.75, y - 16);
                body.renderFast();
                var body2 = new Cube();
                body2.textureNum = 1;
                body2.color = [1, 1, 1, 1];
                body2.matrix.scale(.4, .4, .4);
                body2.matrix.translate(x - 16, 0, y - 16);
                body2.renderFast();
                var body3 = new Cube();
                body3.textureNum = 1;
                body3.color = [1, 1, 1, 1];
                body3.matrix.scale(.4, .4, .4);
                body3.matrix.translate(x - 16, .75, y - 16);
                body3.renderFast();
                var body4 = new Cube();
                body4.textureNum = 3;
                body4.color = [1, 1, 1, 1];
                body4.matrix.scale(.4, .4, .4);
                body4.matrix.translate(x - 16, 1.5, y - 16);
                body4.renderFast();
            }
            if (g_map[x][y] == 5) {
                var body = new Cube();
                body.textureNum = 1;
                body.color = [1, 1, 1, 1];
                body.matrix.scale(.4, .4, .4);
                body.matrix.translate(x - 16, -.75, y - 16);
                body.renderFast();
                var body2 = new Cube();
                body2.textureNum = 1;
                body2.color = [1, 1, 1, 1];
                body2.matrix.scale(.4, .4, .4);
                body2.matrix.translate(x - 16, 0, y - 16);
                body2.renderFast();
                var body3 = new Cube();
                body3.textureNum = 1;
                body3.color = [1, 1, 1, 1];
                body3.matrix.scale(.4, .4, .4);
                body3.matrix.translate(x - 16, .75, y - 16);
                body3.renderFast();
                var body4 = new Cube();
                body4.textureNum = 1;
                body4.color = [1, 1, 1, 1];
                body4.matrix.scale(.4, .4, .4);
                body4.matrix.translate(x - 16, 1.5, y - 16);
                body4.renderFast();
                var body5 = new Cube();
                body5.textureNum = 3;
                body5.color = [1, 1, 1, 1];
                body5.matrix.scale(.4, .4, .4);
                body5.matrix.translate(x - 16, 2.25, y - 16);
                body5.renderFast();
            }
            if (g_map[x][y] == 6) {
                var body = new Cube();
                body.textureNum = 1;
                body.color = [1, 1, 1, 1];
                body.matrix.scale(.4, .4, .4);
                body.matrix.translate(x - 16, -.75, y - 16);
                body.renderFast();
                var body2 = new Cube();
                body2.textureNum = 1;
                body2.color = [1, 1, 1, 1];
                body2.matrix.scale(.4, .4, .4);
                body2.matrix.translate(x - 16, 0, y - 16);
                body2.renderFast();
                var body3 = new Cube();
                body3.textureNum = 1;
                body3.color = [1, 1, 1, 1];
                body3.matrix.scale(.4, .4, .4);
                body3.matrix.translate(x - 16, .75, y - 16);
                body3.renderFast();
                var body4 = new Cube();
                body4.textureNum = 1;
                body4.color = [1, 1, 1, 1];
                body4.matrix.scale(.4, .4, .4);
                body4.matrix.translate(x - 16, 1.5, y - 16);
                body4.renderFast();
                var body5 = new Cube();
                body5.textureNum = 1;
                body5.color = [1, 1, 1, 1];
                body5.matrix.scale(.4, .4, .4);
                body5.matrix.translate(x - 16, 2.25, y - 16);
                body5.renderFast();
                var body6 = new Cube();
                body6.textureNum = 3;
                body6.color = [1, 1, 1, 1];
                body6.matrix.scale(.4, .4, .4);
                body6.matrix.translate(x - 16, 3, y - 16);
                body6.renderFast();
            }
            if (g_map[x][y] == 7) {
                var body = new Cube();
                body.textureNum = 1;
                body.color = [1, 1, 1, 1];
                body.matrix.scale(.4, .4, .4);
                body.matrix.translate(x - 16, -.75, y - 16);
                body.renderFast();
                var body2 = new Cube();
                body2.textureNum = 1;
                body2.color = [1, 1, 1, 1];
                body2.matrix.scale(.4, .4, .4);
                body2.matrix.translate(x - 16, 0, y - 16);
                body2.renderFast();
                var body3 = new Cube();
                body3.textureNum = 1;
                body3.color = [1, 1, 1, 1];
                body3.matrix.scale(.4, .4, .4);
                body3.matrix.translate(x - 16, .75, y - 16);
                body3.renderFast();
                var body4 = new Cube();
                body4.textureNum = 1;
                body4.color = [1, 1, 1, 1];
                body4.matrix.scale(.4, .4, .4);
                body4.matrix.translate(x - 16, 1.5, y - 16);
                body4.renderFast();
                var body5 = new Cube();
                body5.textureNum = 1;
                body5.color = [1, 1, 1, 1];
                body5.matrix.scale(.4, .4, .4);
                body5.matrix.translate(x - 16, 2.25, y - 16);
                body5.renderFast();
                var body6 = new Cube();
                body6.textureNum = 1;
                body6.color = [1, 1, 1, 1];
                body6.matrix.scale(.4, .4, .4);
                body6.matrix.translate(x - 16, 3, y - 16);
                body6.renderFast();
                var body7 = new Cube();
                body7.textureNum = 3;
                body7.color = [1, 1, 1, 1];
                body7.matrix.scale(.4, .4, .4);
                body7.matrix.translate(x - 16, 3.75, y - 16);
                body7.renderFast();
            }
            if (g_map[x][y] == 8) {
                var body = new Cube();
                body.textureNum = 1;
                body.color = [1, 1, 1, 1];
                body.matrix.scale(.4, .4, .4);
                body.matrix.translate(x - 16, -.75, y - 16);
                body.renderFast();
                var body2 = new Cube();
                body2.textureNum = 1;
                body2.color = [1, 1, 1, 1];
                body2.matrix.scale(.4, .4, .4);
                body2.matrix.translate(x - 16, 0, y - 16);
                body2.renderFast();
                var body3 = new Cube();
                body3.textureNum = 1;
                body3.color = [1, 1, 1, 1];
                body3.matrix.scale(.4, .4, .4);
                body3.matrix.translate(x - 16, .75, y - 16);
                body3.renderFast();
                var body4 = new Cube();
                body4.textureNum = 1;
                body4.color = [1, 1, 1, 1];
                body4.matrix.scale(.4, .4, .4);
                body4.matrix.translate(x - 16, 1.5, y - 16);
                body4.renderFast();
                var body5 = new Cube();
                body5.textureNum = 1;
                body5.color = [1, 1, 1, 1];
                body5.matrix.scale(.4, .4, .4);
                body5.matrix.translate(x - 16, 2.25, y - 16);
                body5.renderFast();
                var body6 = new Cube();
                body6.textureNum = 1;
                body6.color = [1, 1, 1, 1];
                body6.matrix.scale(.4, .4, .4);
                body6.matrix.translate(x - 16, 3, y - 16);
                body6.renderFast();
                var body7 = new Cube();
                body7.textureNum = 1;
                body7.color = [1, 1, 1, 1];
                body7.matrix.scale(.4, .4, .4);
                body7.matrix.translate(x - 16, 3.75, y - 16);
                body7.renderFast();
                var body8 = new Cube();
                body8.textureNum = 3;
                body8.color = [1, 1, 1, 1];
                body8.matrix.scale(.4, .4, .4);
                body8.matrix.translate(x - 16, 4.25, y - 16);
                body8.renderFast();
            }
        }
    }
}

function keydown(ev) {
    if (ev.keyCode == 68) { // d key
        g_Camera.moveRight();
    }
    if (ev.keyCode == 65) { // a 
        g_Camera.moveLeft();
    }
    if (ev.keyCode == 83) { // s
        g_Camera.moveBack();
    }
    if (ev.keyCode == 87) { // w
        g_Camera.moveForward();
    }
    if (ev.keyCode == 81) { // q
        g_Camera.panLeft();
    }
    if (ev.keyCode == 69) { // e
        g_Camera.panRight();
    }
    // toggle for fly
    if (document.getElementById('fly').checked) {
        if (ev.keyCode == 32) {
            g_Camera.moveUp();
        }
        if (ev.keyCode == 17) {
            g_Camera.moveDown();
        }
    }

    renderAllShapes();
    //console.log(ev.keyCode);
}

function renderAllShapes() {

    var startTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width / canvas.height, .1, 1000);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(g_Camera.eye.elements[0], g_Camera.eye.elements[1], g_Camera.eye.elements[2],
        g_Camera.at.elements[0], g_Camera.at.elements[1], g_Camera.at.elements[2],
        g_Camera.up.elements[0], g_Camera.up.elements[1], g_Camera.up.elements[2]); //(eye, at, up)
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    // pass matrix to u_ModelMatrix attribute
    var globalRotMatHor = new Matrix4().rotate(g_globalAngleHor, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrixHor, false, globalRotMatHor.elements);

    var globalRotMatVer = new Matrix4().rotate(g_globalAngleVer, 1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrixVer, false, globalRotMatVer.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

    gl.uniform3f(u_cameraPos, g_Camera.eye.elements[0], g_Camera.eye.elements[1], g_Camera.eye.elements[2]);

    gl.uniform1i(u_lightOn, g_lightOn);

    var light = new Cube();
    light.textureNum = -2;
    light.color = [2, 2, 0, 1];
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(-.2, -.2, -.2);
    light.matrix.translate(-.5, -15, -.5);
    light.renderFast();

    var floor = new Cube();
    floor.color = [0, 1, 0, 1];
    floor.textureNum = 2;
    if (g_normalOn) {
        floor.textureNum = -3;
    }
    floor.matrix.translate(0, -.25, 0); //
    floor.matrix.scale(17, 0, 17);
    floor.matrix.translate(-.5, 0, -.5);
    floor.normalMatrix.setInverseOf(floor.matrix).transpose();
    floor.renderFast();

    var sky = new Cube();
    sky.textureNum = -2;
    if (document.getElementById('sky').checked) {
        sky.textureNum = 0;
    }
    if (g_normalOn) {
        sky.textureNum = -3;
    }
    sky.color = [0.37, .62, .62, 1];
    sky.matrix.scale(-100, -100, -100);
    sky.matrix.translate(-.5, -.5, -.5);
    sky.normalMatrix.setInverseOf(sky.matrix).transpose();
    sky.renderFast();

    var sp1 = new Sphere();
    sp1.textureNum = 0;
    if (g_normalOn) {
        sp1.textureNum = -3;
    }
    sp1.color = [1, 1, 1, 1];
    sp1.matrix.scale(.6, .6, .6);
    sp1.matrix.translate(-.25, 6, -.5);
    sp1.render();

    drawMap();

    var duration = performance.now() - startTime;
    sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration), "numdot");
}

function tick() {
    g_seconds = performance.now() / 1000.0 - g_startTime;
    updateAnimationAngles();
    renderAllShapes();
    requestAnimationFrame(tick);
}

function sendTextToHTML(text, htmlID) {
    var htmlElem = document.getElementById(htmlID);
    if (!htmlElem) {
        conosle.log("Failed to get " + htmlID + " from HTML.");
        return;
    }
    htmlElem.innerHTML = text;
}

function click(ev) {
    let [x, y] = convertCoordinatesEventToGL(ev);
    renderAllShapes();
}

function updateAnimationAngles() {
    g_lightPos[0] = 10 * Math.cos(.5 * g_seconds);
}