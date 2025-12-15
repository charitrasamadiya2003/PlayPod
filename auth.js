const ID = "Playpod.root03B1";
const PASS = "Inspect@entropy9";
const SESSION_TIME = 30 * 60 * 1000; // 30 minutes

function playpodLogin() {
  const id = loginId.value;
  const pass = loginPassword.value;

  if (id === ID && pass === PASS) {
    localStorage.setItem("playpod_auth", "true");
    localStorage.setItem("login_time", Date.now());
    location.href = "index.html";
  } else {
    loginMsg.innerText = "Wrong credentials. Try inspecting 😉";
  }
}

function protectPlayPod() {
  const auth = localStorage.getItem("playpod_auth");
  const time = localStorage.getItem("login_time");

  if (!auth || !time || Date.now() - time > SESSION_TIME) {
    playpodLogout();
  }
}

function playpodLogout() {
  localStorage.removeItem("playpod_auth");
  localStorage.removeItem("login_time");
  location.href = "login.html";
}

// Auto redirect if already logged in
if (location.pathname.includes("login.html")) {
  if (localStorage.getItem("playpod_auth") === "true") {
    location.href = "index.html";
  }
}
