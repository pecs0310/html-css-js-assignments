const display = document.querySelector("#display");
const onOffButton = document.querySelector(".on-off");
const clearButton = document.querySelector(".clear");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const enterButton = document.querySelector(".enter");

let isOn = false;
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay(value) {
  display.value = value;
}

function resetCalculator() {
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay("0");
}

function calculate(first, second, op) {
  switch (op) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "/":
      return second === 0 ? 0 : first / second;
    default:
      return second;
  }
}

function inputDigit(digit) {
  if (waitingForSecondOperand) {
    updateDisplay(digit);
    waitingForSecondOperand = false;
    return;
  }
  updateDisplay(display.value === "0" ? digit : display.value + digit);
}

function inputDecimal() {
  if (waitingForSecondOperand) {
    updateDisplay("0.");
    waitingForSecondOperand = false;
    return;
  }
  if (!display.value.includes(".")) {
    updateDisplay(display.value + ".");
  }
}

// 이미 연산자가 눌려있는 상태에서 값을 확정하지 않고 다시 연산자를 누르면 마지막 연산자로 교체,
// 그 외에는 지금까지 입력값을 계산해서 표시하고 다음 피연산자 입력을 대기
function handleOperator(nextOperator) {
  const inputValue = parseFloat(display.value);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    updateDisplay(String(result));
    firstOperand = result;
  }

  waitingForSecondOperand = true;
  operator = nextOperator;
}

function handleEnter() {
  if (operator === null || waitingForSecondOperand) return;

  const inputValue = parseFloat(display.value);
  const result = calculate(firstOperand, inputValue, operator);
  updateDisplay(String(result));

  firstOperand = null;
  operator = null;
  waitingForSecondOperand = true;
}

onOffButton.addEventListener("click", () => {
  isOn = !isOn;
  onOffButton.classList.toggle("on", isOn);
  resetCalculator();
});

clearButton.addEventListener("click", () => {
  if (!isOn) return;
  resetCalculator();
});

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!isOn) return;
    if (button.textContent === ".") {
      inputDecimal();
    } else {
      inputDigit(button.textContent);
    }
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!isOn) return;
    handleOperator(button.textContent);
  });
});

enterButton.addEventListener("click", () => {
  if (!isOn) return;
  handleEnter();
});
