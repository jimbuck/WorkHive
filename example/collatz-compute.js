
module.exports = Collatz;

function Collatz(num, step) {
  if(!step) step = 0;
  
  if(num==1)
    return step;
  else if(num % 2 == 0)
    return Collatz(num/2, step+1);
  else
    return Collatz(3*num + 1, step+1);
}