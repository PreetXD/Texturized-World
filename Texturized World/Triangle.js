class Triangle {
    constructor() {
        this.type = "point";
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the size of point
        gl.uniform1f(u_Size, size);

        // Draw
        var d = this.size / 200.0;
        drawTriangle([xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d]);
    }
}

function drawTriangle(vertices) {
    var n = vertices.length / 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3D(vertices) {
    var n = vertices.length / 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    gl.disableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv) {
    var n = vertices.length / 3; // The number of vertices
    //console.log(n);
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    let FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT;
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //buffer object for UV coords
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
        console.log("Failed to create uvBuffer object");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_UV);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUVN(vertices, uv, normals) {
    var n = vertices.length / 3; // The number of vertices
    //console.log(vertices);
    //console.log(n);
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    let FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT;
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //buffer object for UV coords
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
        console.log("Failed to create uvBuffer object");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_UV);

    var normalBuffer = gl.createBuffer();
    if (!normalBuffer) {
        console.log("Failed to create normalBuffer")
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Normal);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    //g_vertexBuffer = null;
}