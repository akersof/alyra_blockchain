const crypto = require("crypto");

class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class EllipticCurve {
    //y^2 = x^3 + a * x + b
    constructor(a, b) {
        this.a = a;
        this.b = b;
        if( 4 * (Math.pow(a, 3)) + 27 * (Math.pow(b, 2)) === 0) throw new Error("Not a valid elliptic curve");
    }
    // Check if 2 elliptic curve are equals
    eq(curve){
        return (this.a === curve.a && this.b === curve.b);
    }
    // Check if point is present on the elliptic curve.
    isPoint(point){
        return Math.pow(point.y, 2) === (Math.pow(point.x, 3) + point.x * this.a + this.b);

    }
    // return a the equation of the elliptic curve as string
    str(){
        let str = "y^2 = x^3";
        str = str + (this.a === 0 ? "" : ` + ${this.a}x`);
        str = str + (this.b === 0 ? "" : ` + ${this.b}`);
        return str;
    }
    //f(x) {
    //    return Math.sqrt(Math.pow(x, 3) + this.a * x + this.b);
    //}

    mul(n, Xg, Yg){
        let m = 0;
        let Xr = 0;
        let Yr = 0;
        for(let i = 1; i <= n; ++i){
            m = (3 * Xg ** 2 + this.a) / (2 * Yg);
            Xr = m ** 2 - 2 * Xg
        }

    }
}

//Input
const secp256k1 = new EllipticCurve(0, 7);


//const Xg = parseInt(crypto.randomBytes(1).toString('hex'), 16);
//const Yg = curve.f(Xg);
//console.log('Gx=',Xg ,'Gy=', Yg);
//console.log(`G is on ellipitc curve?: ${curve.testPoint(Xg, Yg)}`);

