var queue = "";
var input = 0;

function addToQueue(input) {
  queue += input;
}

function clearAll() {
  queue = "";
  input = 0;
  document.getElementById("answer").innerHTML = "0";
}

function numericButton(arg) {
  if (
    document.getElementById("answer").innerHTML === "ERROR" ||
    (document.getElementById("answer").innerHTML == "0" && arg != ".")
  ) {
    document.getElementById("answer").innerHTML = "";
  }
  addToQueue(arg);
  document.getElementById("answer").innerHTML = queue;
}

function operatorButton(arg) {
  addToQueue(arg);
  document.getElementById("answer").innerHTML = queue;
}

const precedenceRank = {
  "^": 3,
  "/": 2,
  "*": 2,

  "+": 1,
  "-": 1,
};

function calculateQueue(queue) {
  console.log(queue);
  let result = normalExpressionToPostfix(queue);
  console.log(result);
  document.getElementById("answer").innerHTML = result;
}

function normalExpressionToPostfix(expression) {
  let lastDigitIndex = 0;
  let postfixStack = [];
  let listOfSymbol = [];
  let stringOfSymbols = "^/*+-";

   // Loop through each character in the expression
  for (let i = 0; i < expression.length; i++) {
    let currentElement = expression.charAt(i);
    let indexOfCurrentElement = i;

     // If the current element is a symbol
    if (i > 0 && stringOfSymbols.includes(currentElement)) {
      
      // Extract the number before the symbol and push it to the stack
      let numberToBePushed = expression
        .substring(lastDigitIndex, indexOfCurrentElement)
        .trim();
      postfixStack.push(numberToBePushed);

       // Update indexes and handle symbols
      lastDigitIndex = indexOfCurrentElement + 1;
      insertSymbolIntopostfixStack(postfixStack, listOfSymbol, currentElement);
    } else if (i === expression.length - 1) {
       // If it's the last character, extract the last number and push it to the stack
      postfixStack.push(
        expression.substring(lastDigitIndex, indexOfCurrentElement + 1).trim()
      );
       // Empty the remaining symbols from the symbol list to the postfix stack
      emptylistOfSymbol(listOfSymbol, postfixStack);
    }
  }
   // Output the postfixStack to console
  console.log(postfixStack);

    // Perform calculations using the postfix expression
  let result = performCalculation(postfixStack);

  // Save the original expression and the result
  saveToStorage(expression, result);
  // Save the original expression and the result
  if (isNaN(result)) return "Error";
  return result;
}
// Function to insert symbols into the postfix stack based on precedence
function insertSymbolIntopostfixStack(
  postfixStack,
  listOfSymbol,
  currentElement
) {
  while (
    listOfSymbol.length > 0 &&
    precedenceRank[currentElement] <=
      precedenceRank[listOfSymbol[listOfSymbol.length - 1]]
  ) {
    postfixStack.push(listOfSymbol.pop());
  }
  listOfSymbol.push(currentElement);
}
// Function to empty the remaining symbols from the symbol list to the postfix stack
function emptylistOfSymbol(listOfSymbol, postfixStack) {
  while (listOfSymbol.length > 0) {
    postfixStack.push(listOfSymbol.pop());
  }
}
// Function to perform calculations based on the postfix expression
function performCalculation(postfixStack) {
  let numberStack = [];

   // Process each element in the postfix expression
  while (postfixStack.length > 0) {
    let firstPoppedElement = postfixStack.shift();
    // If the element is an operator, perform the corresponding operation
    if ("^/*+-".includes(firstPoppedElement)) {
      let secondNumber = parseFloat(numberStack.pop());
      let firstNumber = parseFloat(numberStack.pop());
      //console.log(secondNumber + " " + firstNumber);

       // Perform the operation based on the operator
      if (firstPoppedElement === "^")
        numberStack.push(Math.pow(firstNumber, secondNumber));
      else if (firstPoppedElement === "/")
        numberStack.push(firstNumber / secondNumber);
      else if (firstPoppedElement === "*")
        numberStack.push(firstNumber * secondNumber);
      else if (firstPoppedElement === "+")
        numberStack.push(firstNumber + secondNumber);
      else if (firstPoppedElement === "-")
        numberStack.push(firstNumber - secondNumber);
      else return "invalid operator";   // Return an error for an unknown operator
    } else {
        // If it's a number, push it to the number stack
      numberStack.push(firstPoppedElement);
    }
  }

  // Return the final result of the calculation
  return numberStack.pop();
}

function saveToStorage(expression, result) {
  localStorage.setItem(expression, result);
  sessionStorage.setItem(expression, result);
}
