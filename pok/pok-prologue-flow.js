// ----[ GENERAL VARIABLES ]----

var i = 0; //cursor position
var p = 0; //paragraph index
var speed = 40;
var stop = false;
var arrow = false;

var txt = ["※「Hello, my name is アンナ!",
           "※「Oh, right, you still can't read that, hum...",
           "※「Well, I guess I can also present myself as Anna, but just this once!",
           "※「When I showed you my name before (as アンナ), I was using a writting system called Katakana.",
           "※「It's used pretty much everywhere in any Japanese text, and that is also true "+
           "for any Fire Emblem game.",
           "※「In fact, all Fire Emblem characters have their names written using Katakana. "+
           "Pretty cool, huh?",
           "※「So, if you want to be able to read the Japanese in Fire Emblem games and other media, " +
           "you'll have to learn how to read Katakana ASAP.",
           "※「Luckily for you, I have a complete method for learning Katakana right here, " +
           "completely free of charge! ♡",
           "※「With this method, you'll be able to read any Katakana in no time!",
           "※「Not only names are written in Katakana, but also many weapons, items, spells etc.",
           "※「To fully read everything in Japanese, you'll also need Hiragana and Kanji, "+
           "but let's not worry about those for now.",
           "※「Try to focus only on learning Katakana. That'll be a huge step already.",
           "※「Oh, and don't worry about prerequisites. You need none to begin the course. " +
           "You're good to go even if you know absolutely nothing about Japanese.",
           "※「We'll also not tackle grammar at all, but a good chunk of vocabulary "+
           "from Fire Emblem: Shadow Dragon and the Blade of Light (FE1) will be taught.",
           "※「So, shall we begin?"];

document.getElementById("click-to-proceed").onclick=async ()=>{
            if (i < txt[p].length && stop == false) { //hasn't finished yet
                stop = true; //stops
                document.getElementById("flow-text").innerHTML = txt[p]; //finishes
            }
            else if (p < txt.length - 1) {
                i = 0;
                p++;
                stop = false;
                document.getElementById("flow-text").innerHTML = "";
                arrow = false;
                document.getElementById("text-arrow").style.display = "none";
                typeWriter();
            }
        };

function flashArrow () {
  if (document.getElementById("text-arrow").style.display == "none") {
    document.getElementById("text-arrow").style.display = "inline";
  }
  else {
    document.getElementById("text-arrow").style.display = "none";
  }
  if (arrow == true) {
    setTimeout(flashArrow, 200);
  }
  else {
    document.getElementById("text-arrow").style.display = "none";
  }
}

function typeWriter() {
  if (i < txt[p].length && stop == false) {
    document.getElementById("flow-text").innerHTML += txt[p].charAt(i);
    if (i % 3 == 0) { //open mouth
      document.getElementById("speaking-anna1").style.display = "none";
      document.getElementById("speaking-anna2").style.display = "block";
    }
    if (i % 6 == 0) { //close mouth
      document.getElementById("speaking-anna2").style.display = "none";
      document.getElementById("speaking-anna1").style.display = "block";
    }
    i++;

    setTimeout(typeWriter, speed);
  }
  else {
    document.getElementById("speaking-anna2").style.display = "none";
    document.getElementById("speaking-anna1").style.display = "block";
    if (p < txt.length - 1) {
      arrow = true;
      setTimeout(flashArrow, 120);
    }
    else {
      localStorage.setItem("nav-ch1", true);
      document.getElementById("next-chapter").style.display = "block";
    }
  }
}

window.addEventListener('load', function () {
  document.getElementById('prologue-1').className += " fade-in";
  setTimeout(typeWriter, 1000);
})
