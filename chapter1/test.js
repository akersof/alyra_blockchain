const egcd = (b, n) => {
    let [x0, x1, y0, y1] = [1, 0, 0, 1];
    while(n !== 0) {
        [q, b, n] = [Math.floor(b / n), n, b % n]; //q global? TODO: check javascript implicit scope of variable
        [x0, x1] = [x1, x0 - q * x1];
        [y0, y1] = [y1, y0 - q * y1];
    }

    return [b, x0, y0];
};

console.log(egcd(2, 17));
