const chapters = ["nav-ch1", "nav-ch2"];

for (let i = 0; i < chapters.length; i++) {
    if (localStorage.getItem(chapters[i]) != null) {
        document.getElementById(chapters[i]).classList.remove("locked");
    }
    //if found a locked chapter, break the for-loop
    else break;
}