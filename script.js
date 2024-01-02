var queue = '';
var input = 0;

function calculateQueue(value) {
  if (input !== 0) {
    input = parseFloat(input);

    addToQueue(input);
  }
  var answer = value[0];
  var dividedByZero = 0;
  for (var i = 1; i < value.length; i = i + 2) {
    switch (queue[i]) {
      case "+":
        answer += value[i + 1];
        break;
      case "-":
        answer -= value[i + 1];
        break;
      case "/":
        if (value[i + 1] === 0) dividedByZero = 1;
        else answer = answer / value[i + 1];

        break;
      case "*":
        answer = answer * value[i + 1];
        break;
    }
  }

  answer = answer.toFixed(10);
  answer = parseFloat(answer);
  localStorage.setItem(number, answer);
  if (dividedByZero === 1) {
    clearAll();
    document.getElementById("answer").innerHTML = "ERROR";
  } else {
    document.getElementById("answer").innerHTML = answer;
    input = answer;
    queue = [];
  }
}
function addToQueue(input) {
  queue += input;
}
function clearAll() {
  queue = '';
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

  if (!(arg === ".") || !input.match(/[.]/)) {
    input += arg;
    document.getElementById("answer").innerHTML += arg;
  }
}

function operatorButton(arg) {
  if (input !== 0 && input !== "-") {
    input = parseFloat(input);

    addToQueue(input);
    addToQueue(arg);

    document.getElementById("answer").innerHTML += arg;
    input = 0;
  }
  if (arg == "-" && isNaN(queue[0]) && input !== "-") {
    input = "-";

    document.getElementById("answer").innerHTML = "-";
  }
}

const precedence = {
  '^' : 3,
  '/' : 2,
  '*' : 2,
  '+' : 1,
  '-' : 1,
}

function printResult(queue) {
  console.log(queue);
  let result = infixToPostfix(queue);
  console.log(result);
  document.getElementById("answer").innerHTML = result;
}

function infixToPostfix(infixExpression) {
  let lastCharacterIndex = 0;
  let postfixExpressionList = [];
  let symbolStack = [];
  for (let i = 0; i < infixExpression.length; i++) {
    let currentElement = infixExpression.charAt(i);
    let operatorString = "^/*+-";
    let indexOfCurrentElement = i;
    if (i > 0 && !operatorString.includes(infixExpression[i-1]) && operatorString.includes(currentElement)) {
      postfixExpressionList.push(infixExpression.substring(lastCharacterIndex, indexOfCurrentElement).trim());
      lastCharacterIndex = indexOfCurrentElement + 1;
      insertSymbolIntoPostfixExpressionList(postfixExpressionList, symbolStack, currentElement);
    } else if (i === infixExpression.length - 1) {
      postfixExpressionList.push(infixExpression.substring(lastCharacterIndex, indexOfCurrentElement + 1).trim());
      emptySymbolStack(symbolStack, postfixExpressionList);
    }
  }
  console.log(postfixExpressionList);
  let result = performCalculation(postfixExpressionList);
  saveToStorage(infixExpression, result);
  if (isNaN(result)) return "Malformed Expression";
  return result;
}

function insertSymbolIntoPostfixExpressionList(postFixExpressionList, symbolStack, currentElement) {
  while (
    symbolStack.length > 0 &&
    precedence[currentElement] <=
      precedence[symbolStack[symbolStack.length - 1]]
  ) {
    postFixExpressionList.push(symbolStack.pop());
  }
  symbolStack.push(currentElement);
}

function emptySymbolStack(symbolStack, postFixExpressionList) {
  while (symbolStack.length > 0) {
    postFixExpressionList.push(symbolStack.pop());
  }
}

function performCalculation(postFixExpressionList) {
  let numberStack = [];
  while (postFixExpressionList.length > 0) {
    let firstPoppedElement = postFixExpressionList.shift();
    if ("^/*+-".includes(firstPoppedElement)) {
      let secondNumber = parseFloat(numberStack.pop());
      let firstNumber = parseFloat(numberStack.pop());
      //console.log(secondNumber + " " + firstNumber);
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
      else return "invalid operator";
    } else {
      numberStack.push(firstPoppedElement);
    }
  }
  return numberStack.pop();
}

function saveToStorage(infixExpression, result) {
  localStorage.setItem(infixExpression, result);
  sessionStorage.setItem(infixExpression, result);
}