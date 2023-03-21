// ----[ MUSIC SETTINGS ]----

function setMusicPlay(lang) {
    let toggle = localStorage.getItem('playMusic');
    if (toggle == "on") {
        localStorage.setItem('playMusic', 'off');
        if (lang == 'en') {
            document.getElementById('play-music').innerHTML = "OFF";
        } else {
            document.getElementById('play-music').innerHTML = "DESLIGADO";
        }
    } else {
        localStorage.setItem('playMusic', 'on');
        if (lang == 'en') {
            document.getElementById('play-music').innerHTML = "ON";
        } else {
            document.getElementById('play-music').innerHTML = "LIGADO";
        }
    }
}

//first music setting
if (localStorage.getItem('playMusic') === null)
{
    localStorage.setItem('playMusic', 'on');
}

// -----[ RESET MODAL ] -----
document.getElementById("reset-progress").onclick=async ()=>{
    document.getElementById("reset-modal").style.display = "block";
}
document.getElementById("reset-no").onclick = function() {
    document.getElementById("reset-modal").style.display = "none";
}

document.getElementById("reset-close").onclick = function() {
    document.getElementById("reset-modal").style.display = "none";
    document.getElementById("reset-pg-2").style.display="none";
    document.getElementById("reset-pg-1").style.display="block";
}

document.getElementById("reset-yes").onclick = function() {
    //check music
    let playMusic = localStorage.getItem('playMusic');
    localStorage.clear();
    //set music
    localStorage.setItem('playMusic', playMusic);

    document.getElementById("reset-pg-1").style.display="none";
    document.getElementById("reset-pg-2").style.display="block";
}

window.onclick = function(event) {
if (event.target == document.getElementById("reset-modal")) {
    document.getElementById("reset-modal").style.display = "none";
    document.getElementById("reset-pg-2").style.display="none";
    document.getElementById("reset-pg-1").style.display="block";
    }
}
