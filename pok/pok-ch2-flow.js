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
var speaking = "speaking-elice"; //use and change this for the portrait animations

const scenes_with_dialogs = [];

const all_txt = {scene_19:
                  ["※「マルス, is that you?",
                   "※「It's me, your sister エリス.",
                   "※「Oh, I have missed you so.",
                   "※「Look at how you've grown. Father would be so proud!"],
                 scene_20:
                 ["※「Hey, I'm トムス.",
                  "※「Thanks for freeing me from that cell.",
                  "※「I'm hungry! Is it time to eat yet?"],
                 scene_27:
                 ["※「Prince マルス, take a close look at this peculiar symbol: ー",
                  "※「It resembles a mere straight horizontal line, but there is much more about it than it looks like.",
                  "※「Apparently, when it comes after another vowel, it makes the vowel sound longer."],
                 scene_29:
                 ["※「My name is トーマス.",
                  "※「I was just practicing with my bow.",
                  "※「I have a debt of gratitude with Prince マルス, and I have to repay it by taking down enemy after enemy."],
                 scene_30:
                 ["※「You must be Prince マルス!",
                  "※「I am エスト, from Macedon.",
                  "※「We finally get to meet!"],
                 scene_38:
                 ["※「Prince マルス, more and more allies will join your side through this long path.",
                  "※「However, do not neglect your duties as their leader.",
                  "※「If you don't give them the attention they need, their names and faces may fall into oblivion after some time."]
                };

// ----[ GENERAL ]----

var scene = 1; //scene index
var speed = 40;
var can_do_drill = true;

const drill_answers = {"13": ['chi', 'ri'],  //key is scene number
                       "18": ['ma', 'mu']};

var current_drill_answer = [];
var ki = 1; //kana index, for drills that write words

// -----[ SOUNDS AND MUSIC ]-----

var sound_to = new Audio('../sounds/to.mp3');
var sound_tou = new Audio('../sounds/tou.mp3');
var sound_mu = new Audio('../sounds/mu.mp3');
var sound_e = new Audio('../sounds/e.mp3');
var sound_ee = new Audio('../sounds/ee.mp3');
var sound_ri = new Audio('../sounds/ri.mp3');

var sound_click = new Audio('../sounds/click.mp3');
var sound_hit = new Audio('../sounds/hit.mp3');
var sound_miss = new Audio('../sounds/miss.mp3');

var music_encounter = new Audio('../sounds/encounter.mp3');
music_encounter.loop = true;
var music_victory = new Audio('../sounds/victory.mp3');
music_victory.loop = true;

document.getElementById("sound-to").onclick=async ()=>{sound_to.play();}
document.getElementById("sound-to2").onclick=async ()=>{sound_to.play();}
document.getElementById("sound-tou").onclick=async ()=>{sound_tou.play();}
document.getElementById("sound-mu").onclick=async ()=>{sound_mu.play();}
document.getElementById("sound-e").onclick=async ()=>{sound_e.play();}
document.getElementById("sound-e2").onclick=async ()=>{sound_e.play();}
document.getElementById("sound-ee").onclick=async ()=>{sound_ee.play();}
document.getElementById("sound-ri").onclick=async ()=>{sound_ri.play();}

// -----[ CANVAS ]-----
var canvas_1 = new handwriting.Canvas(document.getElementById("canvas-1"), 4);
var canvas_2 = new handwriting.Canvas(document.getElementById("canvas-2"), 4);
var canvas_3 = new handwriting.Canvas(document.getElementById("canvas-3"), 4);
var canvas_4 = new handwriting.Canvas(document.getElementById("canvas-4"), 4);

var canvas_14 = new handwriting.Canvas(document.getElementById("canvas-14"), 4);
var canvas_15 = new handwriting.Canvas(document.getElementById("canvas-15"), 4);
var canvas_16 = new handwriting.Canvas(document.getElementById("canvas-16"), 4);
var canvas_17 = new handwriting.Canvas(document.getElementById("canvas-17"), 4);

var canvas_25 = new handwriting.Canvas(document.getElementById("canvas-25"), 4);
var canvas_26 = new handwriting.Canvas(document.getElementById("canvas-26"), 4);

var canvas_35 = new handwriting.Canvas(document.getElementById("canvas-35"), 4);
var canvas_36 = new handwriting.Canvas(document.getElementById("canvas-36"), 4);

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
  if (word[ki-1] == "ー" && canvas.trace.length == 1) {//if it's "ー"
        sound_hit.play();
        document.getElementById("scene-" + num + "-kana-" + ki).innerHTML = "ー";;
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
  }
  else if (data[0] == word[ki-1]) {//correct character
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
    let txt = all_txt["scene_" + sc];
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
  let txt = all_txt["scene_" + scene];
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
    localStorage.setItem("nav-ch3", true);

    //adds units to roster
    if (localStorage.getItem("units") === null) {
      localStorage.setItem("units", "Marth,Matthis,Elice,Dolph,Tomas,Est")
    } else {
      var units = localStorage.getItem("units");
      var unitsArr = units.split(",");
      if (!unitsArr.contains("Elice")) {
        units += ",Elice,Dolph,Tomas,Est";
        localStorage.setItem("units", units)
      }
    }
    
    //adds katakan to scroll
    if (localStorage.getItem("katakana") === null) {
      localStorage.setItem("katakana", "MA,RU,SU,CHI,TO,MU,E,RI")
    } else {
      var katakana = localStorage.getItem("katakana");
      var katakanaArr = katakana.split(",");
      if (!katakanaArr.contains("TO")) {
        katakana += ",TO,MU,E,RI";
        localStorage.setItem("katakana", katakana)
      }
    }
}

// -----------------------------[ NEXT PART ]----------------------------
function nextPart() {
    document.getElementById("next-part").style.display = "block";

    if (scene == 38) { //saving everything after final scene
      saveLocalStorage();
    }

    //clicking on "NEXT" function
    document.getElementById("next-part").onclick=async ()=>{
      if (scene == 19 && document.getElementById("stats-recruit-19").style.display == "none") {
        sound_click.play();
        document.getElementById("click-to-proceed-19").style.borderImageWidth = 0;
        document.getElementById("flow-text-scene-19").innerHTML = "";
        document.getElementById("stats-recruit-19").style.display = "block";
      }
      else if (scene == 20 && document.getElementById("stats-recruit-20").style.display == "none") {
        sound_click.play();
        document.getElementById("click-to-proceed-20").style.borderImageWidth = 0;
        document.getElementById("flow-text-scene-20").innerHTML = "";
        document.getElementById("stats-recruit-20").style.display = "block";
      }
      else if (scene == 29 && document.getElementById("stats-recruit-29").style.display == "none") {
        sound_click.play();
        document.getElementById("click-to-proceed-29").style.borderImageWidth = 0;
        document.getElementById("flow-text-scene-29").innerHTML = "";
        document.getElementById("stats-recruit-29").style.display = "block";
      }
      else if (scene == 30 && document.getElementById("stats-recruit-30").style.display == "none") {
        sound_click.play();
        document.getElementById("click-to-proceed-30").style.borderImageWidth = 0;
        document.getElementById("flow-text-scene-30").innerHTML = "";
        document.getElementById("stats-recruit-30").style.display = "block";
      }
      else if (scene == 38) { //next chapter
        window.location.href = "./pok-ch3.html";
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
          speaking = "speaking-elice";
          music_encounter.play();
          setTimeout(typeWriter, 1000);
        }
        //Recruitment: Dolph
        else if (scene == 20) {
            speaking = "speaking-dolph";
             setTimeout(typeWriter, 1000);
        }
        //New mechanic: long vowel
        else if (scene == 27) {
            speaking = "speaking-gotoh";
            setTimeout(typeWriter, 1000);
        }
        //New mechanic: long vowel 2
        else if (scene == 28) {
            nextPart();
        }
        //Recruitment: Tomas
        else if (scene == 29) {
            speaking = "speaking-tomas";
            music_encounter.play();
            setTimeout(typeWriter, 1000);
        }
        //Recruitment: Est
        else if (scene == 30) {
            speaking = "speaking-est";
            setTimeout(typeWriter, 1000);
        }
        //Final scene: Gotoh speaks
        else if (scene == 38) {
          speaking = "speaking-gotoh";
          music_victory.play();
          document.getElementById("next-part").innerHTML = "TO CHAPTER 3";
          setTimeout(typeWriter, 1000);
        }
        else {
            music_encounter.pause();
            music_encounter.currentTime = 0;
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
  if (current_drill_answer.includes("rect1")) {
    document.getElementById("drill-answer").innerHTML = "Well done!";
    nextPart();
  }
}

// -----------------------------[ CANVAS ]----------------------------

// scene 1: ト
canvas_1.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_1, "ト", 2, "1");});

// scene 2: ム
canvas_2.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_2, "ム", 2, "2");});

// scene 3: エ
canvas_3.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_3, "エ", 3, "3");});

// scene 4: リ
canvas_4.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_4, "リ", 2, "4");});

// scene 14: エ
canvas_14.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_14, "エ", 3, "14");});

// scene 15: ト
canvas_15.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_15, "ト", 2, "15");});

// scene 16: リ
canvas_16.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_16, "リ", 2, "16");});

// scene 17: ム
canvas_17.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasCorrection(data, canvas_17, "ム", 2, "17");});

// scene 25: エリス drill
canvas_25.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasWord(data, canvas_25, "エリス", "25");});

// scene 26: トムス drill
canvas_26.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasWord(data, canvas_26, "トムス", "26");});

// scene 35: トーマス drill
canvas_35.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasWord(data, canvas_35, "トーマス", "35");});

// scene 36: エスト drill
canvas_36.setCallBack(function(data, err) {
    if (err) throw err;
    else canvasWord(data, canvas_36, "エスト", "36");});

function showHint() {
  document.getElementById("back-kana-" + scene).style.visibility = "visible";
}

// -----------------------------[ BEGINS FIRST SCENE AFTER LOAD ]----------------------------
window.addEventListener('load', function () {
  document.getElementById("scene-1").className += " fade-in";
})