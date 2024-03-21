
//初期〇ターン
let isOddTurn = true;
/*
//リセットイベント
*/
function initializeEvent() {
  isOddTurn = true;
  for (let i = 1;i <= 100; i++) {
    let square = document.getElementById(i);
    square.innerText = "";
    square.disabled = false;
    square.classList.remove("white", "black")
  }
}

/*
//マス目クリックイベント
*/
function clickSquare(i) {
  let targetSquare = i.target;
  if (isOddTurn === true) {
    targetSquare.innerText = "●";
    targetSquare.classList.add("white")
  } else {  
    targetSquare.innerText = "●"
    targetSquare.classList.add("black")
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
