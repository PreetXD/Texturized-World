class Camera {
    constructor() {
        this.eye = new Vector3([2, .25, -8]);
        this.at = new Vector3([2, .25, -1]);
        this.up = new Vector3([0, 1, 0]);
    }
    moveForward() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(.2);
        this.eye.add(f);
        this.at.add(f);
    }
    moveBack() {
        var b = new Vector3();
        b.set(this.at);
        b.sub(this.eye);
        b.normalize();
        b.mul(.2);
        this.eye.sub(b);
        this.at.sub(b);
    }
    moveLeft() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var s = new Vector3();
        s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(.2);
        this.eye.add(s);
        this.at.add(s);
    }
    moveRight() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var s = new Vector3();
        s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(.2);
        this.eye.sub(s);
        this.at.sub(s);
    }
    panLeft() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotataionMatrix = new Matrix4();
        rotataionMatrix.setRotate(10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = new Vector3();
        f_prime = rotataionMatrix.multiplyVector3(f);
        let tempEye = new Vector3();
        tempEye.set(this.eye);
        this.at = tempEye.add(f_prime);
    }
    panRight() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotataionMatrix = new Matrix4();
        rotataionMatrix.setRotate(-10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = new Vector3();
        f_prime = rotataionMatrix.multiplyVector3(f);
        let tempEye = new Vector3();
        tempEye.set(this.eye);
        this.at = tempEye.add(f_prime);
    }
    moveUp() {
        var f = new Vector3();
        this.at.elements[1] = this.at.elements[1] + .5;
        this.eye.elements[1] = this.eye.elements[1] + .5;
    }
    moveDown() {
        var f = new Vector3();
        this.at.elements[1] = this.at.elements[1] - .5;
        this.eye.elements[1] = this.eye.elements[1] - .5;
    }
}