class EllipticCurve {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        if(4*(Math.pow(a, 3)) + 27*(Math.pow(b, 2)) === 0) throw new Error("Not a valid elliptic curve");
    }
    eq(curve){
        return (this.a === curve.a && this.b === curve.b);
    }
    testPoint(abs, ord){
        if(Math.pow(ord, 2) === (Math.pow(abs, 3) + abs * this.a   + this.b))
            return true;
    }
    show(){
        return `y^2 = x^3 + ${this.a}x + ${this.b}`;
    }
}
