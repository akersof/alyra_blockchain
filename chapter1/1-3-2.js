class Occur {
    constructor(letter, freq = 1) {
        this.letter = letter;
        this.freq = freq;
    }
    inc() { ++this.freq;}
}

const frequency = str => {
    let result= []; //array of Occur objects
    //fill our result array;
    for(let i = 0; i < str.length; ++i) {
        let found = result.find(elem => elem.letter === str[i]);
        found ? found.inc() : result.push(new Occur(str[i]));
    }
    //sort our array in descend way.
    result.sort((elem1, elem2) => elem2.freq > elem1.freq ? 1: -1);
    //generate and return the output
    const prettyPrint= () => {
        let output = "";
        result.forEach((elem) => output += `${elem.freq} ${elem.letter}\t`);
        return output;
    };
    //generate our output;
    return prettyPrint();
};

console.log(frequency("Etre contesté, c’est être constaté"));
