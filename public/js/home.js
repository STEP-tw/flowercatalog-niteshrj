const setVisibility = function(){
  flower.style.visibility = "visible";
}
const blink = function(){
  flower.onclick = function(){
    flower.style.visibility = "hidden";
    setTimeout(setVisibility,1000);
  }
}

window.onload = blink;
