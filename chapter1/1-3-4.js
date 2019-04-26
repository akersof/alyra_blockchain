const crypto = require("crypto");

//A real modulo function
const mod = (a, n) => {
    let modulo = BigInt(BigInt(a) % BigInt(n));
    return modulo > 0n ? modulo : modulo + n;
};

//Extended Euclidean algorithm
const egcd = (b, n) => {
    let [x0, x1, y0, y1] = [1n, 0n, 0n, 1n];
    while(n !== 0n) {
        [q, b, n] = [b / n, n, b % n]; //q global? TODO: check javascript implicit scope of variable
        [x0, x1] = [x1, x0 - q * x1];
        [y0, y1] = [y1, y0 - q * y1];
    }

    return [b, x0, y0];
};

//Modular multiplicative inverse
const modinv = (b, n) => {
    return mod(egcd(b, n)[1], n);
};

const sqrt = value => {
    if (value < 0n) {
        throw 'square root of negative numbers is not supported'
    }

    if (value < 2n) {
        return value;
    }

    function newtonIteration(n, x0) {
        const x1 = ((n / x0) + x0) >> 1n;
        if (x0 === x1 || x0 === (x1 - 1n)) {
            return x0;
        }
        return newtonIteration(n, x1);
    }

    return newtonIteration(value, 1n);
};

class Point {
    constructor(x, y){
        this.x = BigInt(x);
        this.y = BigInt(y);
    }
}

// You should not never use this class, it is not secured.
// But use this class applied to secp256k1 with the SECP256K1 constant;
class EllipticCurve {
    //y^2 = x^3 + a * x + b, P is the finite Field modulus, G is the Base point
    constructor(a, b, P, G) {
        this.a = BigInt(a);
        this.b = BigInt(b);
        if(!P) throw new Error("Please provide a finite field modulus P");
        this.P = BigInt(P);
        if(!G) throw new Error("Please provide a base point on the curve");
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
    //Apply y^2 mod p = x^3 + a * x + b mod p
    f(x) {
    }
    // add point1 and point2 return the resulting point
    add(p1, p2){
        let s = mod(((p2.y - p1.y)  * modinv((p2.x - p1.x), this.P)), this.P);
        let x3 = mod((s ** 2n - p2.x - p1.x), this.P);
        let y3 = mod((s * (p1.x - x3)) - p1.y, this.P);
        return new Point(x3, y3);
    }

    //Using double and add algorithm
    mul(n, point){
        
        let tx = point.x;
        let ty = point.y;
        for(let i = 1; i < n; i++) {
        let s = mod((((3n * (tx) ** 2n + this.a) % this.P) *  modinv((2n * ty), this.P)), this.P);
        let xr = mod((s ** 2n - 2n * tx), this.P) ;
        let yr = mod((s * (tx - xr) - ty), this.P);
        tx = xr;
        ty = yr;
        //return new Point(xr, yr );
        }
        return(new Point(tx, ty));
    }
    double(point) {
        let s = mod((((3n * (point.x) ** 2n + this.a) % this.P) *  modinv((2n * point.y), this.P)), this.P);
        let xr = mod((s ** 2n - 2n * point.x), this.P) ;
        let yr = mod((s * (point.x - xr) - point.y), this.P);
        return (new Point(xr, yr));
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
let g2 = test.double(test.G);
let g4 = test.double(g2);
console.log(g4);
let g8 = test.double(g4);
console.log(g8);
//let g4 = test.add(g3, test.G);
//console.log('G4=');
//console.log(g4);
//co//ole.log(test.add(test.add(g, g), test.add(g, g)));
//console.log("mull");
//console.log(test.mul(3n, g));
//console.log("f(80):");
//console.log(test.f(80n));

