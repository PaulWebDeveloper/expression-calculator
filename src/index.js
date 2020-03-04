function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  let countBrackets = 0;

  checkBrackets(expr);
  expr = removeSpaces(expr);
  countBrackets = countRoundBrackets(countBrackets, expr);

  while (countBrackets--) {
    expr = parenthesesAll(expr);
  }

  expr = computeExpression(expr);
  return Number(expr);
}

function checkBrackets(expr) {
  let leftCount = 0, rightCount = 0;

  expr.split('').filter(el => {
    if (el == '(') leftCount++;
    if (el == ')') rightCount++;
  });

  if (leftCount !== rightCount) 
    throw Error('ExpressionError: Brackets must be paired');
}


function removeSpaces(str) {
  return str.split('').filter(el => el != ' ').join('');
}


function countRoundBrackets(count,expr) {
  for (let i = 0; i < expr.length; i++) if (expr[i] == '(') count++;
  return count;
}


function replaceTwoMinus(expr) { 
  return expr.split('')
    .map((item, i, arr) => item === '+' && arr[i+1] === '-' ? '' : item)
    .map((item, i, arr) => item === '-' && arr[i+1] === '-' ? '+' : item)
    .map((item, i, arr) => item === '-' && arr[i-1] === '+' ? '' : item)
    .join('');
}


function computeExpression(str) {
  let newStr = '';
  let arrSign = [];
  let j = 0;

  str = replaceTwoMinus(str).split('')

  for (let i = 0; i < str.length; i++) {
    if ((str[i] =='+' || str[i] =='-') && str[i-1] != '*' && str[i-1] != '/') {
      arrSign[j] = str[i];
      str[i] = ' ';
      j++;
    }
  }

  str = str.join('');

  do {
    let substr = '';

    for (let i = 0; i < str.length; i++) {
      if (str[i] != ' ') substr += str[i];
      else break;
    }

    str = str.replace((substr + ' '),'');
    substr = calculateMultiplyDivide(substr);

    newStr += substr;
    newStr = calculateExprSubStr(newStr);
    if (arrSign.length > 0) newStr += arrSign.shift();

  } while(j--);

  return newStr;
}


function calculateMultiplyDivide(substr) {
  let countSign = 0;
  
  for (let i = 0; i < substr.length; i++) {
    if (/^[\+\-\*\/]/.test(substr[i])) countSign++;
    if (/^[\+\-\*\/]/.test(substr[i]) && substr[i+1] == '-') countSign--;
  }

  while (countSign--) {
    substr = calculateExprSubStr(substr);
  }

  return substr;
}


function calculateExprSubStr(exprsubstr) {
  let a = '', b = '', sign;
  let p = 0

  if (exprsubstr[0] == '-') a += '-';

  for (let i = 0; i < exprsubstr.length; i++) {
    if (/^[0-9\.]/.test(exprsubstr[i]) && !sign) a += exprsubstr[i];
    if (/^[\+\-\*\/]/.test(exprsubstr[i]) && i && !sign) sign = exprsubstr[i];
     
    if (sign && exprsubstr[i+1] == '-' && !b) b += '-';
    if (/^[0-9\.]/.test(exprsubstr[i]) && sign) b += exprsubstr[i];
     
    p = i + 1;
    if (sign && /^[\*\/]/.test(exprsubstr[i+1])) break;
   }

  let value = calculate(a ,sign, b);
  let res = exprsubstr.slice(0, p);
  exprsubstr = exprsubstr.replace(res, value);

  return exprsubstr;  
}


function calculate(a, sign, b) {
  if (sign == '/' && b == 0) throw Error('TypeError: Division by zero.');

  switch (sign) {
    case '+': return Number(a) + Number(b);
    case '-': return Number(a) - Number(b);
    case '*': return Number(a) * Number(b);
    case '/': return Number(a) / Number(b);
    default: return Number(a);
  }
}


function parenthesesAll(str) {
  let count = 0;
  
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '(') count++;
    if (str[i] == ')') {
      str = parentheses(count,str);
      break;
    }
  }
  return str;
}


function parentheses(count, str) {
  let substr = '';
  let p = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] == '(') count--;
    if (!count && str[i] != '(' && str[i] != ')')  substr += str[i];
    if (!count && str[i] == ')') {
      p = i + 1;
      break;
    }
  }

  let value = computeExpression(substr);
  let res = str.slice((p - substr.length - 2), p);
  str = str.replace(res, value);

  return str;
}


module.exports = {
  expressionCalculator
}
