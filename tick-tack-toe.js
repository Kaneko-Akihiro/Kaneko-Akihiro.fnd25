
//初期〇ターン
let isOddTurn = true;
/*
//リセットイベント
*/
function initializeEvent() {
  isOddTurn = true;
  for (let i = 1;i <= 9; i++) {
    let square = document.getElementById(i);
    square.innerText = "";
    square.disabled = false;
    square.classList.remove("maru", "batsu")
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
  console.log(isOddTurn);
}

const target = document.getElementsByClassName("square");

for(let i = 0; i < target.length; i++) {
  target[i].addEventListener("click",{name:i, handleEvent:clickSquare});
}
