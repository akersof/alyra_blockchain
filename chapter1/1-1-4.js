/*
    Define a Circle class and provide method for calculating area and perimeter
 */

//automated code testing on Alyra plateform needs french name
class Cercle {
    constructor(radius) {
        this.radius = radius;
    }
    perimetre() { return 2 * Math.PI * this.radius; }
    aire()  { return Math.PI * this.radius ** 2;}
}

//Testing class Cercle
let c = new Cercle(5);
console.log({aire: c.aire(), perimetre: c.perimetre()});


