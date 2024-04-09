
/*++++++++++++++
初期化処理
++++++++++++++++ */
function initializeEvent() {
  area.style.display = "none";
  menu[0].style.display = "none";
  opeArea[0].style.display = "block";
  document.getElementById("expressionLeft").value = "";
  document.getElementById("expressionRight").value = "";
  document.getElementById("answer").value = "";
  document.getElementById("judge").innerText = "";
  document.getElementById("score").innerText = ""; 
  choiceLevel = 0;
  maxNum = 0;
  score = 0;
  for (let i = 0; i < expression.length; i++) {
    expression[i].disabled = false;
  }
  clearTimeout(timer);
}

/*++++++++++++++
変数宣言
++++++++++++++++ */

const operator = document.getElementsByClassName("operator");
const level = document.getElementsByClassName("level");
const menu = document.getElementsByClassName("menu");
const opeArea = document.getElementsByClassName("selectOperator");
const startBtn = document.getElementById("start"); 
const answerBox = document.getElementById("answer");
const area = document.getElementById("answerArea");
let choiceLevel = 0;
let maxNum = 0;
let score = 0;
let expression = document.getElementsByClassName("expression");
let timer
/*++++++++++++++
イベント設定処理
++++++++++++++++ */

//難易度ボタン設定
for(let i = 0; i < operator.length; i++) {
  operator[i].addEventListener("click",{name:i, handleEvent:selectOperator});
}
for(let i = 0; i < level.length; i++) {
  level[i].addEventListener("click",{name:i, handleEvent:selectMenu});
}

//スタートボタン設定
startBtn.addEventListener("click",start)

//キー操作設定
answerBox.addEventListener("keydown", enterKyePress);

/*++++++++++++++
　　　関数
++++++++++++++++ */

//演算選択時処理
function selectOperator(i) {
  console.log(i)
  choiceOpe = i.target.id;
  if (choiceOpe === "+") {
    document.getElementById("operators").innerText = "　＋　";
    } else if (choiceOpe === "-") {
    document.getElementById("operators").innerText = "　－　";
  } else if (choiceOpe === "*") {
    document.getElementById("operators").innerText = "　×　";
  } else if (choiceOpe === "/") {
    document.getElementById("operators").innerText = "　÷　";
  }
  menu[0].style.display = "block";
  opeArea[0].style.display = "none";
}

//難易度選択時処理
function selectMenu(i) {
  console.log(i)
  choiceLevel = i.target.id;
  if (choiceLevel === "1") {
    leftMaxNum = 10;
    rightMaxNum = 10;
  } else if (choiceLevel === "2") {
    leftMaxNum = 50;
    rightMaxNum = 10;
  } else if (choiceLevel === "3") {
    leftMaxNum = 100;
    rightMaxNum = 10;
  }
  area.style.display = "block";
  menu[0].style.display = "none";
}

//エンターキー判別処理
function enterKyePress(event) {
  if (event.key === "Enter") {
    judge()
  }
}

//スタートボタン押下時処理
function start(){
  for (let i = 0; i < expression.length; i++) {
    expression[i].disabled = false;
  }
    document.getElementById("answer").focus();
    problem();
    score = 0;
    document.getElementById("score").innerText = ""; 
    timer = setTimeout(gameOver, 30000);
}

//問題作成処理
function problem(){
  document.getElementById("expressionLeft").value = Math.floor(Math.random() * leftMaxNum) + 1;
  document.getElementById("expressionRight").value = Math.floor(Math.random() * rightMaxNum) + 1;
  document.getElementById("answer").value = "";
  document.getElementById("judge").innerText = "";
  a = Number(document.getElementById("expressionLeft").value);
  b = Number(document.getElementById("expressionRight").value);
  if (Number.isInteger(eval(`${a} ${choiceOpe} ${b}`)) === false) {
    problem();
  }
}

//答え合わせ処理
function judge(){
  c = Number(document.getElementById("answer").value);
  // let answered = answer(a,b,choiceOpe);
  let answered = eval(`${a} ${choiceOpe} ${b}`);
  if (answered === c) {
    problem();
    document.getElementById("judge").innerText = "せいかい！";
    score += 10;
    document.getElementById("score").innerText = `スコア:${score}点`; 
  } else {
    document.getElementById("answer").value = "";
    document.getElementById("judge").innerText = "あれれ～？";
  }
}


function gameOver(){
  alert(`あなたのスコアは${score}です！`)
  for (let i = 0; i < expression.length; i++) {
    expression[i].disabled = true;
  }

}
