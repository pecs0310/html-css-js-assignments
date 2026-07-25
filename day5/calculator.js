function start() {
  const expression = prompt("계산식을 입력하세요.(예: 1 + 1 * 4)");
  if (expression === null) return;

  const result = calculate(expression);
  console.log("결과:", result);
}

function calculate(expression) {
  const tokens = tokenize(expression);
  const afterMulDiv = resolveMulDiv(tokens);
  return resolveAddSub(afterMulDiv);
}

// "1 + 2 + 3 * 5" -> [1, "+", 2, "+", 3, "*", 5]
function tokenize(expression) {
  return expression
    .trim()
    .split(/\s+/)
    .map((token) => (isOperator(token) ? token : Number(token)));
}

function isOperator(token) {
  return token === "+" || token === "-" || token === "*" || token === "/";
}

// 곱셈/나눗셈을 먼저 계산해서 덧셈/뺄셈만 남은 토큰 배열로 축약
function resolveMulDiv(tokens) {
  const result = [tokens[0]];

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const operand = tokens[i + 1];

    if (operator === "*") {
      result[result.length - 1] *= operand;
    } else if (operator === "/") {
      result[result.length - 1] /= operand;
    } else {
      result.push(operator, operand);
    }
  }

  return result;
}

// 남은 덧셈/뺄셈을 순서대로 계산
function resolveAddSub(tokens) {
  let total = tokens[0];

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const operand = tokens[i + 1];

    if (operator === "+") {
      total += operand;
    } else if (operator === "-") {
      total -= operand;
    }
  }

  return total;
}
