class Stack {
    constructor(data = "") {
        this.data = [];
    }
    affiche () {
        let stackSize = this.data.length;
        while(stackSize > 0) {
            process.stdout.write(`${this.supprime()} `);
            stackSize--;
        }
    }

    supprime () {
        return this.data.pop();
    }
    parse(msg){
        msg = msg.split(" ");
        for(let i = 0; i < msg.length; ++i) {
            switch(msg[i]){
                case "AFFICHE":
                    this.affiche();
                    break;
                case "SUPPRIME":
                    this.supprime();
                    break;
                default: //a word
                    this.data.push(msg[i]);
            }
        }
        process.stdout.write("\n");
    }


}


const msg = "suis je Bonjour AFFICHE pile une rien SUPPRIME AFFICHE";
const stack = new Stack();
stack.parse(msg);