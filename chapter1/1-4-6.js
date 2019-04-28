const OPERATOR = ['+', '-', '*', '/', '<', '>', '='];

// take a string in a polish synatax form and perform the calculation.
// 2 10 + => 12; 12 4 - 2 * => 16

//There is no error checking, please be gentle
const calc = str => {
    let opl = 0; // left operand
    let opr = 0; // right operand

    let stack = [];
    let input = str.split(" ");
    for(let i = 0; i < input.length; ++i) {
        if(OPERATOR.includes(input[i])) {
            let operator = input[i];
            opr = stack.pop();
            opl = stack.pop();
            let res = 0;
            switch (operator) {
                case '+':
                    res = opl + opr;
                    break;
                case '-':
                    res = opl - opr;
                    break;
                case '*':
                    res = opl * opr;
                    break;
                case '/':
                    res = opl / opr;
                    break
                case '>':
                    res = opl > opr;
                    break;
                case '<':
                    res = opl < opr;
                    break;
                case '=':
                    res = opl === opr;
                    break;
                default:
                    throw new Error('you are a real genius...');
            }
            stack.push(res);
        } else {
            stack.push(parseInt(input[i]));
        }
    }
    return stack.pop();
};

console.log(calc("1 1 +"));         // 2
console.log(calc('12 4 - 2 *'));    // 16
console.log(calc('-1 3 - 10 *'));   // -40
console.log(calc('4 2 * 8 ='));      // true