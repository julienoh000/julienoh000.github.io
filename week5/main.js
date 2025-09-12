// variables
// this is how we find an element
const documentBody = document.querySelector("body");
console.log(documentBody);

const myName = "Julie";
let myHungriness = 0.3;
console.log(myHungriness);
myHungriness = 0.5;
console.log(myHungriness);

// console.log() sends massage to browser console
console.log("hello");

let stepNumber = 4;
console.log("Taking step:", stepNumber, "... i think");

// let name = prompt("What's your name?");

// strings
let firstName = "Julie";
let surname = "Noh";
let quote = "This is a 'quote'";
console.log(quote);
let nameString = `My full name 

is ${firstName} ${surname}`;
console.log(nameString);

//type conversion
let myAge = 20;
let timePass = "5";
let updatedAge = myAge + parseInt(timePass);

// math + - = / *

console.log(updatedAge);

// arrays
let myPets = ["spot", "joey", "charlie", "lola"];

console.log(myPets);
console.log(myPets[0]);

//conditionals

const a = 10;
let b = "10";
let setToBlue = false;

if (!setToBlue) {
  documentBody.style.backgroundColor = "red";
} else {
  documentBody.style.backgroundColor = "blue";
}

// for loop
for (let steps = 0; steps < 5; steps++) {
  console.log("Steps taken", steps);
}

// for each

const numbers = [12, 14, 8, 6];
let total = 0;

function totalNumbers(item) {
  total = total + item;
  console.log("item price", item, "running total", total);
}

numbers.forEach(totalNumbers);

console.log("final total", total);

let hiddenVariable = "?";
/// functions
function tellMeHowHungryIAm() {
  console.log(hiddenVariable);
}

console.log(hiddenVariable);

function addTwoNumbers(a, b) {
  let addTotal = a + b;
  return addTotal;
}

let numberTotal = addTwoNumbers(3, 4);
let diffTotal = addTwoNumbers(12, 50);
console.log(numberTotal, diffTotal);
