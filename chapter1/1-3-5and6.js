const crypto = require("crypto");

//A real modulo function
const mod = (a, n) => {
    let modulo = BigInt(BigInt(a) % BigInt(n));
    //let modulo = a % n;
    return modulo < 0n ? modulo + n : modulo;
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
    str() {
        return `x=${this.x.toString(16)},  y=${this.y.toString(16)}`
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
        if(p1.x === 0n && p1.y === 0n ) return p2;
        else if(p2.x === 0n && p2.y === 0n) return p1;
        else if(p1.x === p2.x && p1.y === p2.y) {
            return this.double(p1);
        }
        else {
            //I am messing too much with commutativity. This is not commutative so i am forcing the comunatiivity myself
            let min;
            let max;
            if(p2.x > p1.x) {
                max = p2;
                min = p1;
            } else {
                max = p1;
                min = p2;
            }
            let s = mod((max.y - min.y) * modinv(max.x - min.x, this.P), this.P);
            let x3 = mod((s ** 2n - max.x - min.x), this.P);
            let y3 = mod(s * ( min.x - x3)  - min.y, this.P);
            return new Point(x3, y3 );
        }
    }

    //Using double and add algorithm
    mul(point, n){
        let bin = BigInt(n).toString(2);
        let res = new Point(0n, 0n); //infinite ??
        for(let i = 0; i < bin.length; ++i){
            res = this.double(res);
            if(bin[i] === "1"){
                res = this.add(res, point);
            }
        }
        return res;
    }
    mulGby(n) {
        return this.mul(this.G, n);
    }
    double(point) {
        if(point.x === 0n && point.y === 0n) return point;
        let s = mod((((3n * (point.x) ** 2n + this.a) % this.P) *  modinv((2n * point.y), this.P)), this.P);
        let xr = mod((s ** 2n - 2n * point.x), this.P) ;
        let yr = mod((s * (point.x - xr) - point.y), this.P);
        return (new Point(xr, yr));
    }
}

class Secp256k1 extends EllipticCurve{
    constructor(){
        const a = 0;
        const b = 7;
        const P = 2n ** 256n - 2n ** 32n - 977n;
        const G = new Point(55066263022277343669578718895168534326250603453777594175500187360389116729240n,
            32670510020758816978083085130507043184471273380659243275938904335757337482424n);
        super(0, 7, P, G);
    }
    //randomly generate a private key
    getPrivKey(){

    }
    //generate a public key
    getPubKey(privKey){
        return this.mulGby(privKey);
    }
}

const SECP256K1 = new Secp256k1();
console.log(SECP256K1.str());
console.log(SECP256K1.mulGby(112233445566778899112233445566778899n).str());
console.log(SECP256K1.mulGby(BigInt('0xAA5E28D6A97A2479A65527F7290311A3624D4CC0FA1578598EE3C2613BF99522')).str());
