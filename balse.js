const btnBalse = document.getElementById("balse");
const imgBalse = document.getElementById("balsed");
const imgBalse2 = document.getElementById("balsed2");
const imgThankyou = document.getElementById("thankyou");

btnBalse.addEventListener("click", balse);

function balse() {
  btnBalse.style.display = "none"
  imgBalse.style.opacity = 1;
  setTimeout(balse2,3000)
}

function balse2() {
  imgBalse2.style.opacity = 1;
  setTimeout(thankyou,3000)
  imgBalse.style.display = "none";
}

const thankyou = function(){
  imgThankyou.style.opacity = 1;
  imgBalse2.style.display = "none";
}
