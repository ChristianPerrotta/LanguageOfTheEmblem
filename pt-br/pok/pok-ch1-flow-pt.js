 // __   ___   ___ ___   _   ___ _    ___ ___ 
// \ \ / /_\ | _ \_ _| /_\ | _ ) |  | __/ __|
//  \ V / _ \|   /| | / _ \| _ \ |__| _|\__ \
//   \_/_/ \_\_|_\___/_/ \_\___/____|___|___/

// ----[ TEXT AND DIALOG ]----

var i = 0; // cursor position when typing text
var p = 0; //paragraph index
var t = 0; //txt index in all_txt
var stop = false; //checks to decide if stops typeWrite or not
var arrow = false; //shows flashing arrow or not
var speaking = "speaking-gotoh"; //use and change this for the portrait animations

const scenes_with_dialogs = ["1", "19", "20"];

const all_txt = {scene_1:
                  ["※「...",
                   "※「Consegues me ouvir...?",
                   "※「Eu sou o sábio Gotoh.",
                   "※「Com este dispositivo mágico, eu te guiarei pela jornada do Katakana..."],
                scene_19:
                  ["※「Eu sou マルス, Príncipe de Altea.",
                   "※「É um prazer conhecer você.",
                   "※「Assim como você, eu desejo a paz acima de tudo.",
                   "※「Se você permitir, eu posso somar às suas forças!"],
                scene_20:
                  ["※「Sou マチス. Prazer em conhecer.",
                   "※「Você viu Lena? Mesmo que fosse só mais uma vez...",
                   "※「Eu esperava poder vê-la de novo. Lena, onde será que você está?"],
                scene_28:
                  ["※「Príncipe マルス, fizeste bem em chegar até aqui.",
                   "※「Tu e teu novo aliado, マチス, devem partir e descorbri mais sobre estes símbolos de escrita, os katakana.",
                   "※「Ao viajar por este estranho mundo, encontrarás muitos que desejam fazer o mesmo.",
                   "※「Deves encontrar essas pessoas e com elas trabalhar.",
                   "※「Vou ajudar-te tambpem, comunicando por telepatia, como vim fazendo desde o começo.",
                   "　　(Pelo menos até que finalmente me tenhas encontrado...)"]};

const recruit = ["<br>ENGLISH NAME: Marth<br>JAPANESE NAME: マルス<br>CLASS: ロード (Lord)<br>" + 
                 "COUNTRY: アリティア (Altea)",
                 "<br>ENGLISH NAME: Matthis<br>JAPANESE NAME: マチス<br>CLASS: S・ナイト (Cavalier)<br>" + 
                 "COUNTRY: マケドニア (Macedon)"];

// ----[ GENERAL ]----

var scene = 1; //scene index
var speed = 40;
var can_do_drill = true;

const drill_answers = {"11": ['su', 'ru'],                    //key is scene number
                       "16": ['chi', 'chi', 'chi', 'chi'],
                       "17": ['su', 'chi', 'ma', 'ru']};

var current_drill_answer = [];
var ki = 1; //kana index, for drills that write words

// -----[ SOUNDS AND MUSIC ]-----

if (localStorage.getItem('playMusic') === null)
  {
      localStorage.setItem('playMusic', 'on');
  }
var playMusic = localStorage.getItem('playMusic');

var sound_ma = new Audio('../sounds/ma.mp3');
var sound_ru = new Audio('../sounds/ru.mp3');
var sound_su = new Audio('../sounds/su.mp3');
var sound_chi = new Audio('../sounds/chi.mp3');
var sound_click = new Audio('../sounds/click.mp3');
var sound_hit = new Audio('../sounds/hit.mp3');
var sound_miss = new Audio('../sounds/miss.mp3');

var music_encounter = new Audio('../sounds/encounter.mp3');
music_encounter.loop = true;
var music_victory = new Audio('../sounds/victory.mp3');
music_victory.loop = true;

document.getElementById("sound-ma").onclick=async ()=>{sound_ma.play();}
document.getElementById("sound-ru").onclick=async ()=>{sound_ru.play();}
document.getElementById("sound-su").onclick=async ()=>{sound_su.play();}
document.getElementById("sound-chi").onclick=async ()=>{sound_chi.play();}

// -----[ CANVAS ]-----
var canvas_2 = new handwriting.Canvas(document.getElementById("canvas-2"), 4);
var canvas_3 = new handwriting.Canvas(document.getElementById("canvas-3"), 4);
var canvas_4 = new handwriting.Canvas(document.getElementById("canvas-4"), 4);
var canvas_12 = new handwriting.Canvas(document.getElementById("canvas-12"), 4);
var canvas_13 = new handwriting.Canvas(document.getElementById("canvas-13"), 4);
var canvas_14 = new handwriting.Canvas(document.getElementById("canvas-14"), 4);
var canvas_15 = new handwriting.Canvas(document.getElementById("canvas-15"), 4);
var canvas_18 = new handwriting.Canvas(document.getElementById("canvas-18"), 4);
var canvas_25 = new handwriting.Canvas(document.getElementById("canvas-25"), 4);
var canvas_26 = new handwriting.Canvas(document.getElementById("canvas-26"), 4);

//  ___ _   _ _  _  ___ _____ ___ ___  _  _ ___ 
// | __| | | | \| |/ __|_   _|_ _/ _ \| \| / __|
// | _|| |_| | .` | (__  | |  | | (_) | .` \__ \
// |_|  \___/|_|\_|\___| |_| |___\___/|_|\_|___/

// ----------------------------- [CANVAS CORRECTION] ----------------------------

function canvasCorrection (data, canvas, kana, sc, num) {
  if (data[0] == kana) {
      //checks stroke count
      if (canvas.trace.length == sc) {
        //stroke count correct
        sound_hit.play();
        document.getElementById("drill-answer").innerHTML = "Well done!";
        nextPart();
        document.getElementById("check-canvas-" + num).onclick = "";
        document.getElementById("clear-canvas-" + num).onclick = "";
        Object.freeze(canvas);
      } else { //stroke count incorrect
        sound_miss.play();
        document.getElementById("drill-answer").innerHTML = "The character shape is correct, " + 
          "but the number of strokes is not. This katakana uses " + sc + " strokes, and you wrote it with " + 
          canvas.trace.length + ". Clear the canvas and try again, following the numbers indicating the beginning of each stroke.";
        }
      } else { //not the correct character
        sound_miss.play();
        document.getElementById("drill-answer").innerHTML = "Clear the board and try again...";
      };
}

function canvasWord (data, canvas, word, num) {
  if (data[0] == word[ki-1]) {//correct character
        sound_hit.play();
        document.getElementById("scene-" + num + "-kana-" + ki).innerHTML = data[0];
        ki++;
        if (ki > word.length) {
          document.getElementById("drill-answer").innerHTML = "Well done!";
          nextPart();
          document.getElementById("check-canvas-" + num).onclick = "";
          document.getElementById("clear-canvas-" + num).onclick = "";
          Object.freeze(canvas);
        } else {
          canvas.erase();
          document.getElementById("drill-answer").innerHTML = "Correct! Now, the next character.";
        }
  } else { //not the correct character
        sound_miss.play();
        canvas.erase();
        document.getElementById("drill-answer").innerHTML = "That is not the correct character.";
  };
}

// ----------------------------- [CLICKING ON DRILL OPTION: CLASSICAL MULTIPLE CHOICE] ----------------------------
function correct(correct_answer) {
  if (can_do_drill) {
    can_do_drill = false;
    document.getElementById("drill-answer").innerHTML = "Correct answer!";
    sound_hit.play();
    correct_answer.classList.add("active");
    nextPart();
  }
}

function incorrect() {
  if (can_do_drill) {
    document.getElementById("drill-answer").innerHTML = "The answer is incorrect. Try again.";
    sound_miss.play();
  }
}
// ----------------------------- [SELECTING DRILL OPTION] ----------------------------
function selectKana(sel, kana) {
  if (can_do_drill) {
    //if the kana was not already selected
    if (sel.classList.contains("selectable")) {
      sel.classList.remove("selectable");
      sel.classList.add("selected");
      current_drill_answer.push(kana);

    }
    //if the kana was already selected
    else {
      sel.classList.remove("selected");
      sel.classList.add("selectable");
      let index = current_drill_answer.indexOf(kana);
      current_drill_answer.splice(index, 1);
    }

    if (current_drill_answer.sort().join(',')=== drill_answers[scene.toString()].sort().join(',')) {
      can_do_drill = false;
      document.getElementById("drill-answer").innerHTML = "Correct answer!";
      sound_hit.play();
      nextPart();
    }
  }
}

// -----------------------------[ CLICKING ON DIALOG TO PROCEED ]----------------------------

async function proceedText(sc) {
    let txt = all_txt["scene_" + sc + lang];

    if (i < txt[p].length && stop == false) { //hasn't finished yet
        stop = true; //stops typewrite
        document.getElementById("flow-text-scene-" + sc).innerHTML = txt[p]; //finishes
    }
    
    else if (p < txt.length - 1) { //if there a next paragraph to show
        i = 0; //brings cursor back to initial positions
        p++; //next paragraph
        stop = false;
        document.getElementById("flow-text-scene-" + sc).innerHTML = "";

        arrow = false;
        document.getElementById("text-arrow-scene-" + sc).style.display = "none";
        typeWriter();
    }
}

// -----------------------------[ FLASHING ARROW ]----------------------------
function flashArrow () {
  if (document.getElementById("text-arrow-scene-" + scene).style.display == "none") {
    document.getElementById("text-arrow-scene-" + scene).style.display = "inline";
  }
  else {
    document.getElementById("text-arrow-scene-" + scene).style.display = "none";
  }
  if (arrow == true) {
    setTimeout(flashArrow, 200);
  }
  else {
    document.getElementById("text-arrow-scene-" + scene).style.display = "none";
  }
}

// -----------------------------[ TYPEWRITER TEXT APPEARING ]----------------------------
function typeWriter() {
  let txt = all_txt["scene_" + scene + lang];
  
  if (i < txt[p].length && stop == false) {
    document.getElementById("flow-text-scene-" + scene).innerHTML += txt[p].charAt(i);
    
    //mouth movement
    if (i % 3 == 0) { //open mouth
      document.getElementById(speaking + "1-" + scene).style.display = "none";
      document.getElementById(speaking + "2-" + scene).style.display = "block";
    }
    if (i % 6 == 0) { //close mouth
      document.getElementById(speaking + "2-" + scene).style.display = "none";
      document.getElementById(speaking + "1-" + scene).style.display = "block";
    }

    //next cursor position
    i++;

    setTimeout(typeWriter, speed);
  } else { //end of paragraph
    document.getElementById(speaking + "2-" + scene).style.display = "none";
    document.getElementById(speaking + "1-" + scene).style.display = "block";
    if (p < txt.length - 1) { //there's still a next paragraph
      arrow = true;
      setTimeout(flashArrow, 120);
    } else {
      nextPart();
      };
    }
}

// -----------------------------[ FINAL SAVE ]----------------------------

function saveLocalStorage () {
      //unlocks chapter 3
    localStorage.setItem("nav-ch2", true);

    //adds units to roster
    if (localStorage.getItem("units") === null) {
      localStorage.setItem("units", "Marth,Matthis")
    } else {
      var units = localStorage.getItem("units");
      var unitsArr = units.split(",");
      if (!unitsArr.contains("Marth")) {
        units += ",Marth,Matthis";
        localStorage.setItem("units", units)
      }
    }
    
    //adds katakan to scroll
    if (localStorage.getItem("katakana") === null) {
      localStorage.setItem("katakana", "MA,RU,SU,CHI")
    } else {
      var katakana = localStorage.getItem("katakana");
      var katakanaArr = katakana.split(",");
      if (!katakanaArr.contains("MA")) {
        katakana += ",MA,RU,SU,CHI";
        localStorage.setItem("katakana", katakana)
      }
    }
}

// -----------------------------[ NEXT PART ]----------------------------
function nextPart() {
    document.getElementById("next-part").style.display = "block";

    if (scene == 28) { //saving everything after final scene
      saveLocalStorage();
    }

    //clicking on "NEXT" function
    document.getElementById("next-part").onclick=async ()=>{
      if (scene == 19 && document.getElementById("flow-text-scene-19").innerHTML != recruit[0]) {
        sound_click.play();
        document.getElementById("click-to-proceed-19").style.borderImageWidth = 0;
        document.getElementById("flow-text-scene-19").innerHTML = recruit[0];
      }
      else if (scene == 20 && document.getElementById("flow-text-scene-20").innerHTML != recruit[1]) {
        sound_click.play();
        document.getElementById("click-to-proceed-20").style.borderImageWidth = 0;
        document.getElementById("flow-text-scene-20").innerHTML = recruit[1];
      }
      else if (scene == 28) { //next chapter
        window.location.href = "./pok-ch2.html";
      }
      else {
        sound_click.play();
        document.getElementById("scene-" + scene).style.display = "none";
        scene++;
        document.getElementById("scene-" + scene).style.display = "block";
        document.getElementById("scene-" + scene).className += " fade-in";
        document.getElementById("next-part").style.display = "none";
        //reset general parameters
        i = 0;
        p = 0;
        ki = 1;
        can_do_drill = true;
        current_drill_answer = [];
        stop = false;
        document.getElementById("drill-answer").innerHTML = "";

        //Recruitment: Marth
        if (scene == 19) {
          speaking = "speaking-marth";
          if (playMusic == 'on')
          {
            music_encounter.play();
          }
          setTimeout(typeWriter, 1000);
        } 
        //Recruitment: Matthis
        else if (scene == 20) {
          speaking = "speaking-matthis";
          if (playMusic == 'on')
          {
            music_encounter.play();
          }
          setTimeout(typeWriter, 1000);
        }
        //Final scene: Gotoh speaks
        else if (scene == 28) {
          speaking = "speaking-gotoh";
          if (playMusic == 'on')
          {
            music_victory.play();
          }
          document.getElementById("next-part").innerHTML = "TO CHAPTER 2";
          setTimeout(typeWriter, 1000);
        }
        else {
          music_encounter.pause();
        }
      }
    }
}

function highlight (rect) {
  if (!current_drill_answer.includes(rect)) {
    sound_hit.play();
    document.getElementById(rect).style.stroke = "red"
    document.getElementById(rect).style.strokeWidth = "4";
    current_drill_answer.push(rect);
  }
  if (current_drill_answer.includes("rect1") && current_drill_answer.includes("rect2")) {
    document.getElementById("drill-answer").innerHTML = "Well done!";
    nextPart();
  }
}

// -----------------------------[ CANVAS ]----------------------------

// scene 2: マ
canvas_2.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_2, "マ", 2, "2");
});

// scene 3: ル
canvas_3.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_3, "ル", 2, "3");
});

// scene 4: ス
canvas_4.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_4, "ス", 2, "4");
});

// scene 12: drill マ
canvas_12.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_12, "マ", 2, "12");
});

// scene 13: drill ス
canvas_13.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_13, "ス", 2, "13");
});

// scene 14: drill ル
canvas_14.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_14, "ル", 2, "14");
});

// scene 15: チ
canvas_15.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_15, "チ", 3, "15");
});

// scene 18: チ
canvas_18.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_18, "チ", 3, "18");
});

// scene 25: マルス drill
canvas_25.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasWord(data, canvas_25, "マルス", "25");
});

// scene 25: マチス drill
canvas_26.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasWord(data, canvas_26, "マチス", "26");
});

function showHint() {
  document.getElementById("back-kana-" + scene).style.visibility = "visible";
}

// -----------------------------[ BEGINS FIRST SCENE AFTER LOAD ]----------------------------
window.addEventListener('load', function () {
  document.getElementById("scene-1").className += " fade-in";
  setTimeout(typeWriter, 1000); //calls dialog for first scene
})