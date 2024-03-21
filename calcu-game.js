
const target = document.getElementsByClassName("level");
for(let i = 0; i < target.length; i++) {
  target[i].addEventListener("click",{name:i, handleEvent:selectMenu});
}

function selectMenu(level) {
  const menu = document.getElementsByClassName("menu");
  const area = document.getElementById("answerArea");

  area.style.display = "block";
  menu[0].style.display = "none";
}



const startBtn = document.getElementById("start"); 
startBtn.addEventListener("click",start)

function start(){
    document.getElementById("answer").focus();
    problem();
}

function problem(){
document.getElementById("expressionLeft").value = Math.floor(Math.random() * 50) + 1;
document.getElementById("expressionRight").value = Math.floor(Math.random() * 50) + 1;
document.getElementById("answer").value = "";
}

function judge(){
  a = Number(document.getElementById("expressionLeft").value);
  b = Number(document.getElementById("expressionRight").value);
  c = Number(document.getElementById("answer").value);
}
