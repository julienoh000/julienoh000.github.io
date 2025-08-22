const cartTotalText = document.querySelector("#cartTotal");
let cartTotal = 0;

let shoppingCart = [
  { name: "t-shirt", price: 20 },
  { name: "jeans", price: 50 },
  { name: "sneakers", price: 80 },
  { name: "backpack", price: 30 },
];

function addToCartTotal(item) {
  console.log("item added", item.name);
  console.log("item price:", item.price);
  cartTotal = cartTotal + item.price;
  console.log("running total:", cartTotal);
}

function calculateCart() {
  shoppingCart.forEach(addToCartTotal);
}

function checkDiscount() {
  if (cartTotal > 100) {
    cartTotal - cartTotal * 0.9;
  }
  cartTotalText.textContent - cartTotal;
}

if (cartTotal > 100) {
  cartTotal = cartTotal * 0.9;
}

console.log("Your cart total is :", cartTotal);
