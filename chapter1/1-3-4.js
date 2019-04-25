const crypto = require("crypto");

const mod = (a, n) => {
    let modulo = BigInt(BigInt(a) % BigInt(n));
    return modulo > 0n ? modulo : modulo + n;
};

const egcd = (b, n) => {
    let [x0, x1, y0, y1] = [1n, 0n, 0n, 1n];
    while(n !== 0n) {
        [q, b, n] = [b / n, n, b % n]; //q global? TODO: check javascript implicit scope of variable
        [x0, x1] = [x1, x0 - q * x1];
        [y0, y1] = [y1, y0 - q * y1];
    }

    return [b, x0, y0];
};

const modinv = (b, n) => {
    return mod(egcd(b, n)[1], n);
}

class Point {
    constructor(x, y){
        this.x = BigInt(x);
        this.y = BigInt(y);
    }

}


//const FINITE_FIELD =

class EllipticCurve {
    //y^2 = x^3 + a * x + b, P is the finite Field modulus, G is the Base point
    constructor(a, b, P, G) {
        this.a = BigInt(a);
        this.b = BigInt(b);
        if(!P) throw new Error("Please provide a finite field modulus P");
        this.P = BigInt(P);
        this.G = G;
        if( 4 * (Math.pow(a, 3)) + 27 * (Math.pow(b, 2)) === 0) throw new Error("Not a valid elliptic curve");
    }
    // Check if 2 elliptic curve are equals
    eq(curve){
        return (this.a === curve.a && this.b === curve.b);
    }
    // Check if point is present on the elliptic curve.
    isPoint(point){
        return (point.y ** 2n) % this.P === (point.x ** 3n + point.x * this.a + this.b) % this.P;

    }
    // return a the equation of the elliptic curve as string
    str(){
        let str = "y^2 = x^3";
        str = str + (this.a === 0n ? "" : ` + ${this.a}x`);
        str = str + (this.b === 0n ? "" : ` + ${this.b}`);
        return str;
    }
    //f(x) {
    //    return Math.sqrt(Math.pow(x, 3) + this.a * x + this.b);
    //}
    // add point1 and point2 return the resulting point
    add(p1, p2){
        let s = (p2.y - p1.y) / (p2.x - p1.x);
        let x3 = s ** 2n - p1.x - p2.x;
        let y3 = p1.y + s * (x3 - p1.x);
        return new Point(x3, y3);

    }
    //addG(point) {
    //    let s = 3n * (this.G.x) ** 2 / (2 * this.G.y)

    //}
    // multiply point by n and return the result
    mulG(n){
        let tx = this.G.x;
        let ty = this.G.y;
        for(let i = 1; i < n; i++) {
        let s = mod((((3n * (tx) ** 2n + this.a) % this.P) *  modinv((2n * ty), this.P)), this.P);
        console.log('s = ', s);
        let xr = mod((s ** 2n - 2n * tx), this.P) ;
        console.log('x = ', xr);
        let yr = mod((s * (tx - xr) - ty), this.P);
        console.log("y = ", yr);
        console.log("result: ");
        console.log(new Point(xr, yr));
        tx = xr;
        ty = yr;
        //return new Point(xr, yr );
        }
        console.log(new Point(tx, ty));
        return(new Point(tx, ty));
        }

}

//Input
/*
const P = 2n ** 256n - 2n ** 32n - 977n;
const G = new Point(55066263022277343669578718895168534326250603453777594175500187360389116729240n,
                    32670510020758816978083085130507043184471273380659243275938904335757337482424n);
const Secp256k1 = new EllipticCurve(0, 7, P, G);

console.log(Secp256k1.G);

let z = Secp256k1.mulG();
console.log(BigInt(0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798));
console.log(BigInt(0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8));
*/
//let nb = 1n;
/*for(let i = 0n; i < 256; i++) {
    nb += ;
}*/
//console.log(nb);
//let a = crypto.randomBytes(256).toString('hex');
//a = "0x" + a;
//console.log(BigInt(a));
//console.log(BigInt(a));
//console.log(BigInt(parseInt(a, 16)));
//const Xg = parseInt(crypto.randomBytes(1).toString('hex'), 16);
//const Yg = curve.f(Xg);
//console.log('Gx=',Xg ,'Gy=', Yg);
//console.log(`G is on ellipitc curve?: ${curve.testPoint(Xg, Yg)}`);
let a = 2; let b = 3;
let p = 97;
let g = new Point(3, 6);
let test = new EllipticCurve(a, b, p, g);
console.log(test.str());
console.log(test.mulG(7));

