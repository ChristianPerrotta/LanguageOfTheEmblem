// ----[ GENERAL VARIABLES ]----

var i = 0; //cursor position
var p = 0; //paragraph index
var speed = 40;
var stop = false;
var arrow = false;

var txt = ["※「Olá, meu nome é アンナ!",
           "※「Ah, claro, você ainda não sabe ler isso, não é...",
           "※「Bem, acho que posso me apresentar como Anna, mas só desta vez!",
           "※「Quando eu mostrei meu nome antes (como アンナ), eu estava usando um sistema de escrita chamado Katakana.",
           "※「Ele é bastante usado em praticamente todo texto japonês, e isso também vale para "+
           "qualquer jogo de Fire Emblem.",
           "※「Na verdade, todos os personagens de Fire Emblem têm seus nomes escritos usando Katakana. "+
           "Bem legal, não acha?",
           "※「Então, se você quer aprender a ler o japonês usado em Fire Emblem, seja nos jogos ou em outras mídias, " +
           "você vai precisar aprender Katakana o quanto antes.",
           "※「Mas hoje é o seu dia de sorte! Eu tenho um método completo para aprender Katakana bem aqui, " +
           "completamente de graça! ♡",
           "※「Com esse método, você vai aprender a ler Katakana num instante!",
           "※「E nomes não são os únicos escritos em Katakana. Tem também armas, itens, magias etc.",
           "※「Para conseguir ler tudo em japonês, você também vai precisar de Hiragana e Kanji, "+
           "mas é melhor não se preocupar com esses dois por agora.",
           "※「Tente focar apenas em aprender Katakana. Só isso já será um passo enorme.",
           "※「Ah, e não se preocupe com pré-requisitos. Você não precisa de nenhum para começar este curso. " +
           "Você já pode começar, mesmo que não saiba absolutamente nada de japonês.",
           "※「Nós também não vamos lidar com gramática por enquanto, mas uma boa dose de vocabulário "+
           "de Fire Emblem: Shadow Dragon and the Blade of Light (FE1) será ensinada.",
           "※「E então, vamos começar?"];

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
