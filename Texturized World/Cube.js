class Cube {
    constructor() {
        this.type = "cube";
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum = 0;
    }
    render() {
        // var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the size of point
        // gl.uniform1f(u_Size, size);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)

        // uv = [r,g] b is set in fragment shader
        // front of cube
        drawTriangle3DUVN([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0], [0, 0, -1, 0, 0, -1, 0, 0, -1]); // with  test haha s s
        drawTriangle3DUVN([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1], [0, 0, -1, 0, 0, -1, 0, 0, -1]);

        gl.uniform4f(u_FragColor, rgba[0] * .85, rgba[1] * .85, rgba[2] * .85, rgba[3]);

        // top of cube
        drawTriangle3DUVN([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1], [0, 1, 0, 0, 1, 0, 0, 1, 0]);
        drawTriangle3DUVN([0, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0], [0, 1, 0, 0, 1, 0, 0, 1, 0]);

        gl.uniform4f(u_FragColor, rgba[0] * .65, rgba[1] * .65, rgba[2] * .65, rgba[3]);

        //left side
        drawTriangle3DUVN([0, 1, 0, 0, 1, 1, 0, 0, 0], [1, 1, 0, 1, 1, 0], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
        drawTriangle3DUVN([0, 1, 1, 0, 0, 1, 0, 0, 0], [0, 1, 0, 0, 1, 0], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);

        gl.uniform4f(u_FragColor, rgba[0] * .45, rgba[1] * .45, rgba[2] * .45, rgba[3]);

        //back side
        drawTriangle3DUVN([0, 1, 1, 1, 1, 1, 1, 0, 1], [0, 1, 1, 1, 1, 0], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
        drawTriangle3DUVN([0, 1, 1, 1, 0, 1, 0, 0, 1], [0, 1, 1, 0, 0, 0], [0, 0, 1, 0, 0, 1, 0, 0, 1]);

        gl.uniform4f(u_FragColor, rgba[0] * .65, rgba[1] * .65, rgba[2] * .65, rgba[3]);

        //right side 
        drawTriangle3DUVN([1, 1, 0, 1, 1, 1, 1, 0, 1], [0, 1, 1, 1, 1, 0], [1, 0, 0, 1, 0, 0, 1, 0, 0]);
        drawTriangle3DUVN([1, 0, 1, 1, 0, 0, 1, 1, 0], [1, 0, 0, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1, 0, 0]);

        gl.uniform4f(u_FragColor, rgba[0] * .25, rgba[1] * .25, rgba[2] * .25, rgba[3]);

        //bottom
        drawTriangle3DUVN([0, 0, 0, 1, 0, 0, 1, 0, 1], [1, 1, 0, 1, 0, 0], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
        drawTriangle3DUVN([0, 0, 0, 0, 0, 1, 1, 0, 1], [1, 1, 1, 0, 0, 0], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
    }
    renderFast() {
        // var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the size of point
        // gl.uniform1f(u_Size, size);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        var allverts = [];
        var alluv = [];
        var allnorms = [];

        // uv = [r,g] b is set in fragment shader
        // front of cube
        allverts = allverts.concat([0, 0, 0, 1, 1, 0, 1, 0, 0]);
        alluv = alluv.concat([0, 0, 1, 1, 1, 0]);
        allnorms = allnorms.concat([0, 0, -1, 0, 0, -1, 0, 0, -1]);

        allverts = allverts.concat([0, 0, 0, 0, 1, 0, 1, 1, 0]);
        alluv = alluv.concat([0, 0, 0, 1, 1, 1]);
        allnorms = allnorms.concat([0, 0, -1, 0, 0, -1, 0, 0, -1]);

        //gl.uniform4f(u_FragColor, rgba[0] * .85, rgba[1] * .85, rgba[2] * .85, rgba[3]);

        // top of cube
        allverts = allverts.concat([0, 1, 0, 0, 1, 1, 1, 1, 1]);
        alluv = alluv.concat([0, 0, 0, 1, 1, 1]);
        allnorms = allnorms.concat([0, 1, 0, 0, 1, 0, 0, 1, 0]);

        allverts = allverts.concat([0, 1, 0, 1, 1, 1, 1, 1, 0]);
        alluv = alluv.concat([0, 0, 1, 1, 1, 0]);
        allnorms = allnorms.concat([0, 1, 0, 0, 1, 0, 0, 1, 0]);

        //gl.uniform4f(u_FragColor, rgba[0] * .65, rgba[1] * .65, rgba[2] * .65, rgba[3]);

        //left side
        allverts = allverts.concat([0, 1, 0, 0, 1, 1, 0, 0, 0]);
        alluv = alluv.concat([1, 1, 0, 1, 1, 0]);
        allnorms = allnorms.concat([-1, 0, 0, -1, 0, 0, -1, 0, 0]);

        allverts = allverts.concat([0, 1, 1, 0, 0, 1, 0, 0, 0]);
        alluv = alluv.concat([0, 1, 0, 0, 1, 0]);
        allnorms = allnorms.concat([-1, 0, 0, -1, 0, 0, -1, 0, 0]);

        //gl.uniform4f(u_FragColor, rgba[0] * .45, rgba[1] * .45, rgba[2] * .45, rgba[3]);

        //back side
        allverts = allverts.concat([0, 1, 1, 1, 1, 1, 1, 0, 1]);
        alluv = alluv.concat([0, 1, 1, 1, 1, 0]);
        allnorms = allnorms.concat([0, 0, 1, 0, 0, 1, 0, 0, 1]);

        allverts = allverts.concat([0, 1, 1, 1, 0, 1, 0, 0, 1]);
        alluv = alluv.concat([0, 1, 1, 0, 0, 0]);
        allnorms = allnorms.concat([0, 0, 1, 0, 0, 1, 0, 0, 1]);

        //gl.uniform4f(u_FragColor, rgba[0] * .65, rgba[1] * .65, rgba[2] * .65, rgba[3]);

        //right side 
        allverts = allverts.concat([1, 1, 0, 1, 1, 1, 1, 0, 1]);
        alluv = alluv.concat([0, 1, 1, 1, 1, 0]);
        allnorms = allnorms.concat([1, 0, 0, 1, 0, 0, 1, 0, 0]);

        allverts = allverts.concat([1, 0, 1, 1, 0, 0, 1, 1, 0]);
        alluv = alluv.concat([1, 0, 0, 0, 0, 1]);
        allnorms = allnorms.concat([1, 0, 0, 1, 0, 0, 1, 0, 0]);

        //gl.uniform4f(u_FragColor, rgba[0] * .25, rgba[1] * .25, rgba[2] * .25, rgba[3]);

        //bottom
        allverts = allverts.concat([0, 0, 0, 1, 0, 0, 1, 0, 1]);
        alluv = alluv.concat([1, 1, 0, 1, 0, 0]);
        allnorms = allnorms.concat([0, -1, 0, 0, -1, 0, 0, -1, 0]);

        allverts = allverts.concat([0, 0, 0, 0, 0, 1, 1, 0, 1]);
        alluv = alluv.concat([1, 1, 1, 0, 0, 0]);
        allnorms = allnorms.concat([0, -1, 0, 0, -1, 0, 0, -1, 0]);

        //loadUV(alluv);
        drawTriangle3DUVN(allverts, alluv, allnorms);
    }

    test() {
        var rgba = this.color;
        //var size = this.size;
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the size of point
        // gl.uniform1f(u_Size, size);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        const positions = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
        ];
        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

        const textureCoordinates = [
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Back
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Top
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Bottom
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.DYNAMIC_DRAW);

        const indices = [
            0, 1, 2, 0, 2, 3, // front
            4, 5, 6, 4, 6, 7, // back
            8, 9, 10, 8, 10, 11, // top
            12, 13, 14, 12, 14, 15, // bottom
            16, 17, 18, 16, 18, 19, // right
            20, 21, 22, 20, 22, 23, // left
        ];
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_UV);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}