//マス目ボタン設定
const result = document.getElementById("result");
const target = document.getElementsByClassName("square");
for(let i = 0; i < target.length; i++) {
  target[i].addEventListener("click",{name:i, handleEvent:clickSquare});
}

//初期〇ターン
let isOddTurn = true;
let count = 0;
/*
//リセットイベント
*/
function initializeEvent() {
  isOddTurn = true;
  for (let i = 1;i <= 9; i++) {
    let square = document.getElementById(i);
    square.innerText = "";
    square.disabled = false;
    square.classList.remove("circle", "cross");
    result.innerText = "";
    count = 0;
  }
}

/*
//マス目クリックイベント
*/
function clickSquare(i) {
  let targetSquare = i.target;
  if (isOddTurn === true) {
    targetSquare.innerText = "〇";
    targetSquare.classList.add("circle")
  } else {  
    targetSquare.innerText = "ｘ"
    targetSquare.classList.add("cross")
  }
  targetSquare.disabled = true;
  //ターン変更
  isOddTurn = !isOddTurn ;

  //勝敗判定
  count++;
  judge();

}

/*
//内部関数
*/

function judge() {
  if (target[0].innerText === "〇" && target[1].innerText === "〇" && target[2].innerText === "〇" ||
      target[3].innerText === "〇" && target[4].innerText === "〇" && target[5].innerText === "〇" ||
      target[6].innerText === "〇" && target[7].innerText === "〇" && target[8].innerText === "〇" ||
      target[0].innerText === "〇" && target[3].innerText === "〇" && target[6].innerText === "〇" ||
      target[1].innerText === "〇" && target[4].innerText === "〇" && target[7].innerText === "〇" ||
      target[2].innerText === "〇" && target[5].innerText === "〇" && target[8].innerText === "〇" ||
      target[0].innerText === "〇" && target[4].innerText === "〇" && target[8].innerText === "〇" ||
      target[2].innerText === "〇" && target[4].innerText === "〇" && target[6].innerText === "〇" ) {
        isEnd("〇");

  } else if (target[0].innerText === "ｘ" && target[1].innerText === "ｘ" && target[2].innerText === "ｘ" ||
  target[3].innerText === "ｘ" && target[4].innerText === "ｘ" && target[5].innerText === "ｘ" ||
  target[6].innerText === "ｘ" && target[7].innerText === "ｘ" && target[8].innerText === "ｘ" ||
  target[0].innerText === "ｘ" && target[3].innerText === "ｘ" && target[6].innerText === "ｘ" ||
  target[1].innerText === "ｘ" && target[4].innerText === "ｘ" && target[7].innerText === "ｘ" ||
  target[2].innerText === "ｘ" && target[5].innerText === "ｘ" && target[8].innerText === "ｘ" ||
  target[0].innerText === "ｘ" && target[4].innerText === "ｘ" && target[8].innerText === "ｘ" ||
  target[2].innerText === "ｘ" && target[4].innerText === "ｘ" && target[6].innerText === "ｘ"){
        isEnd("ｘ")

  } else if (count === 9) {
    isEnd("draw");
  }
}

function isEnd(winner) {
  if (winner === "draw") {
    result.innerText = "引き分け！！";
  } else {
  result.innerText = `${winner}の勝ち！！`;
  }
  for (let i = 0; i < target.length; i++) {
      target[i].disabled = true;
  }

}
