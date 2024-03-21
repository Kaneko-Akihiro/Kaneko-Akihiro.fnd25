function selectMenu() {
  const menu = document.getElementsByClassName("menu");
  const area = document.getElementById("answerArea");

  area.style.display = "block";
  menu[0].style.display = "none"
}

const target = document.getElementsByClassName("level");

for(let i = 0; i < target.length; i++) {
  target[i].addEventListener("click",{name:i, handleEvent:selectMenu});
}
