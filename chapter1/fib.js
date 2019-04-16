
const fib = nb => {
  if(nb === 1  ) {
      return 1;
  }
  else if(nb === 2 ) {
      return 1;
  }
  else
      return fib(nb - 1) + fib(nb -2);
};

let res = [];
const showFib = n => {
    if(n  === 0) return res;
    else {
        res.unshift(fib(n));
        showFib(n - 1);
    }
};

let nb = parseInt(process.argv[2]);
showFib(nb);
console.log(res);