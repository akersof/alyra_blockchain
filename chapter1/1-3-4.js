const crypto = require("crypto");
class EllipticCurve {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        if( 4 * (Math.pow(a, 3)) + 27 * (Math.pow(b, 2)) === 0) throw new Error("Not a valid elliptic curve");
    }
    eq(curve){
        return (this.a === curve.a && this.b === curve.b);
    }
    testPoint(abs, ord){
        if(Math.pow(ord, 2) === (Math.pow(abs, 3) + abs * this.a   + this.b))
            return true;
    }
    str(){
        return `y^2 = x^3 + ${this.a}x + ${this.b}`;
    }
    f(x) {
        return Math.sqrt(Math.pow(x, 3) + this.a * x + this.b);
    }

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
const a = 10;
const b = 11;

const curve = new EllipticCurve(a, b);
const Xg = parseInt(crypto.randomBytes(1).toString('hex'), 16);
const Yg = curve.f(Xg);
console.log('Gx=',Xg ,'Gy=', Yg);
console.log(`G is on ellipitc curve?: ${curve.testPoint(Xg, Yg)}`);

