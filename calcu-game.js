
/*++++++++++++++
初期化処理
++++++++++++++++ */
function initializeEvent() {
  area.style.display = "none";
  menu[0].style.display = "block";
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
}

/*++++++++++++++
変数宣言
++++++++++++++++ */

const target = document.getElementsByClassName("level");
const menu = document.getElementsByClassName("menu");
const startBtn = document.getElementById("start"); 
const answerBox = document.getElementById("answer");
const area = document.getElementById("answerArea");
let choiceLevel = 0;
let maxNum = 0;
let score = 0;
let expression = document.getElementsByClassName("expression");

/*++++++++++++++
イベント設定処理
++++++++++++++++ */

//難易度ボタン設定
for(let i = 0; i < target.length; i++) {
  target[i].addEventListener("click",{name:i, handleEvent:selectMenu});
}

//スタートボタン設定
startBtn.addEventListener("click",start)

//キー操作設定
answerBox.addEventListener("keydown", enterKyePress);

/*++++++++++++++
　　　関数
++++++++++++++++ */

//難易度選択時処理
function selectMenu(level) {
  choiceLevel = level.target.id;
  if (choiceLevel === "1") {
    maxNum = 10;
  } else if (choiceLevel === "2") {
    maxNum = 50;
  } else if (choiceLevel === "3") {
    maxNum = 100;
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
    setTimeout(gameOver, 10000);
}

//問題作成処理
function problem(){
  document.getElementById("expressionLeft").value = Math.floor(Math.random() * maxNum) + 1;
  document.getElementById("expressionRight").value = Math.floor(Math.random() * maxNum) + 1;
  document.getElementById("answer").value = "";
  document.getElementById("judge").innerText = "";
}

//答え合わせ処理
function judge(){
  a = Number(document.getElementById("expressionLeft").value);
  b = Number(document.getElementById("expressionRight").value);
  c = Number(document.getElementById("answer").value);
  let answer = a + b;
  if (answer === c) {
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
