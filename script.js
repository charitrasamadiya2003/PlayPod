const songs = [
  {
    id: 1,
    name: "Kyun-Talha Anjum",
    file: "Songs/1.mp3",
    cover: "cover/cover1.png",
    liked: false,
  },
  {
    id: 2,
    name: "Malal-Anmol A",
    file: "Songs/2.mp3",
    cover: "cover/cover1.png",
    liked: false,
  },
  {
    id: 3,
    name: "Love City-MC Insane",
    file: "Songs/3.mp3",
    cover: "cover/cover1.png",
    liked: false,
  },
  {
    id: 4,
    name: "Phir Kyu-Itz Akrit",
    file: "Songs/4.mp3",
    cover: "cover/cover1.png",
    liked: false,
  },
  {
    id: 5,
    name: "Phir Kyu-The RDX",
    file: "Songs/5.mp3",
    cover: "cover/cover1.png",
    liked: false,
  },
  {
    id: 6,
    name: "Promises-Kalam Ink",
    file: "Songs/6.mp3",
    cover: "cover/cover1.png",
    liked: false,
  },
  {
    id: 7,
    name: "Regret-Kalam Ink",
    file: "Songs/7.mp3",
    cover: "cover/cover1.png",
    liked: false,
  },
  {
    id: 8,
    name: "Sahiba 2.0-The UK07 Rider",
    file: "Songs/8.mp3",
    cover: "cover/cover1.png",
    liked: false,
  },
  {
    id: 9,
    name: "HeartBreak Kid-Talha Anjum",
    file: "Songs/9.mp3",
    cover: "cover/cover1.png",
    liked: false,
  },
];

const songList = document.querySelector(".songList");
const audio = new Audio();
let index = 0;

/* LOAD FAVORITES */
const savedLikes = JSON.parse(localStorage.getItem("likedSongs")) || [];
songs.forEach((song) => (song.liked = savedLikes.includes(song.id)));

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progressBar");
const gif = document.getElementById("gif");
const currentSong = document.getElementById("currentSong");
const time = document.getElementById("time");

/* BUILD SONG LIST (SAFE) */
if (songList) {
  songs.forEach((song, i) => {
    const div = document.createElement("div");
    div.className = "songItem";

    div.innerHTML = `
      <img src="${song.cover}">
      <span>${song.name}</span>
      <div class="rightControls">
        <span class="duration">--:--</span>
        <i class="fa-heart ${song.liked ? "fas liked" : "far"}"></i>
      </div>
    `;

    div.onclick = (e) => {
      if (!e.target.classList.contains("fa-heart")) {
        playSong(i);
      }
    };

    const heart = div.querySelector(".fa-heart");
    heart.onclick = () => toggleLike(song, heart);

    songList.appendChild(div);

    const temp = new Audio(song.file);
    temp.onloadedmetadata = () => {
      div.querySelector(".duration").innerText = formatTime(temp.duration);
    };
  });

  /* INITIAL LOAD */
  audio.src = songs[0].file;
  if (currentSong) currentSong.innerText = songs[0].name;
}

/* PLAYER FUNCTIONS */
function playSong(i) {
  index = i;
  audio.src = songs[i].file;
  audio.play();
  updateUI();
}

function updateUI() {
  document.querySelectorAll(".songItem").forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });

  if (playBtn) playBtn.className = "fas fa-pause-circle";
  if (gif) gif.style.opacity = 1;
  if (currentSong) currentSong.innerText = songs[index].name;
}

/* CONTROLS */
if (playBtn) {
  playBtn.onclick = () => {
    if (audio.paused) {
      audio.play();
      playBtn.className = "fas fa-pause-circle";
      if (gif) gif.style.opacity = 1;
    } else {
      audio.pause();
      playBtn.className = "fas fa-play-circle";
      if (gif) gif.style.opacity = 0;
    }
  };
}

if (nextBtn) nextBtn.onclick = () => playSong((index + 1) % songs.length);
if (prevBtn)
  prevBtn.onclick = () => playSong((index - 1 + songs.length) % songs.length);

audio.addEventListener("ended", () => {
  playSong((index + 1) % songs.length);
});

/* PROGRESS */
audio.ontimeupdate = () => {
  if (!progress || !time) return;

  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  time.innerText = `${formatTime(audio.currentTime)} / ${formatTime(
    audio.duration
  )}`;
};

if (progress) {
  progress.oninput = () => {
    audio.currentTime = (progress.value * audio.duration) / 100;
  };
}

function formatTime(sec) {
  if (isNaN(sec)) return "00:00";
  let m = Math.floor(sec / 60);
  let s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}

/* FAVORITES */
function toggleLike(song, heart) {
  song.liked = !song.liked;
  heart.classList.toggle("fas", song.liked);
  heart.classList.toggle("far", !song.liked);
  heart.classList.toggle("liked", song.liked);

  const likedIds = songs.filter((s) => s.liked).map((s) => s.id);
  localStorage.setItem("likedSongs", JSON.stringify(likedIds));
}

/* THEME TOGGLE */
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
  if (themeToggle) themeToggle.innerText = "☀️";
}

if (themeToggle) {
  themeToggle.onclick = () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    themeToggle.innerText = isLight ? "☀️" : "🌙";
  };
}
/* SEARCH */
const search = document.getElementById("search");
if (search) {
  search.oninput = () => {
    document.querySelectorAll(".songItem").forEach((item) => {
      item.style.display = item.innerText
        .toLowerCase()
        .includes(search.value.toLowerCase())
        ? "flex"
        : "none";
    });
  };
}

/* RECENTLY PLAYED */
function saveRecent(song) {
  let recent = JSON.parse(localStorage.getItem("recentSongs")) || [];
  recent = [song, ...recent.filter((s) => s !== song)].slice(0, 5);
  localStorage.setItem("recentSongs", JSON.stringify(recent));
}
