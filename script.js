let currentPage = 0;
const pages = document.querySelectorAll(".page");
const book = document.getElementById("card-book");
const welcome = document.getElementById("welcome-screen");
let pageChanging = false;

function showPage(index) {
  if (pageChanging) return;
  const nextIndex = (index + pages.length) % pages.length;
  if (nextIndex === currentPage && pages[currentPage]?.classList.contains("active")) return;
  const current = document.querySelector(".page.active");
  pageChanging = true;

  if (current) {
    current.classList.add("page-leaving");
    window.setTimeout(() => {
      current.classList.remove("active", "page-leaving");
      activatePage(nextIndex);
    }, 240);
  } else {
    activatePage(nextIndex);
  }
}

function activatePage(index) {
  currentPage = index;
  pages.forEach((page, i) => {
    page.classList.remove("page-leaving");
    page.classList.toggle("active", i === currentPage);
  });
  document.getElementById("pageNumber").textContent = `${currentPage + 1} / ${pages.length}`;
  pageChanging = false;
}

function nextPage() { showPage(currentPage + 1); }
function prevPage() { showPage(currentPage - 1); }
function restart() { showPage(0); }

const music = document.getElementById("bgMusic");

function openCard() {
  // Đảm bảo nhạc phát khi người dùng bấm mở thiệp
  if (music.paused) {
    music.play().catch(() => {});
  }
  welcome.classList.add("leaving");
  window.setTimeout(() => {
    welcome.style.display = "none";
    book.classList.add("open");
    currentPage = -1;
    pageChanging = false;
    showPage(0);
  }, 650);
}

function backToWelcome() {
  if (pageChanging) return;
  book.classList.remove("open");
  welcome.style.display = "flex";
  welcome.classList.remove("leaving");
  pages.forEach((page, i) => page.classList.toggle("active", i === 0));
  pages.forEach(page => page.classList.remove("page-leaving"));
  currentPage = 0;
  document.getElementById("pageNumber").textContent = `1 / ${pages.length}`;
}

// Cố gắng tự động phát nhạc ngay khi vào trang
window.addEventListener("load", () => {
  music.play().catch(() => {});
});

// Phát nhạc ngay khi có bất kỳ thao tác chạm/click đầu tiên (đề phòng trình duyệt chặn autoplay)
document.addEventListener("pointerdown", function startMusicOnce() {
  if (music.paused) {
    music.play().catch(() => {});
  }
}, { once: true });

// Điều khiển vuốt trên điện thoại: vuốt lên để sang trang, vuốt xuống để quay lại.
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
book.addEventListener("touchstart", (event) => {
  if (!book.classList.contains("open")) return;
  if (event.target.closest("button, input, textarea, a")) return;
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchStartTime = Date.now();
}, { passive: true });

book.addEventListener("touchend", (event) => {
  if (!book.classList.contains("open") || !touchStartTime) return;
  if (event.target.closest("button, input, textarea, a")) {
    touchStartTime = 0;
    return;
  }
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  const elapsed = Date.now() - touchStartTime;
  touchStartTime = 0;
  if (elapsed > 700) return;
  if (Math.abs(dy) > 65 && Math.abs(dy) > Math.abs(dx) * 1.15) {
    if (dy < 0) nextPage();
    else prevPage();
  }
}, { passive: true });

const emojis = ["💗", "💖", "💜", "💙", "💛", "💚", "❤️", "🤍", "✨"];
function createHeart() {
  const layer = document.getElementById("floatingHearts");
  const h = document.createElement("span");
  h.className = "floating-heart";
  h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  h.style.left = Math.random() * 100 + "%";
  h.style.fontSize = (12 + Math.random() * 24) + "px";
  const duration = 6 + Math.random() * 7;
  h.style.animationDuration = duration + "s";
  layer.appendChild(h);
  window.setTimeout(() => h.remove(), duration * 1000);
}
window.setInterval(createHeart, 280);

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
function resizeStars() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: Math.min(220, Math.floor(window.innerWidth / 4)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + .2,
    a: Math.random() * 6,
    speed: Math.random() * .014 + .003
  }));
}
function drawStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const s of stars) {
    s.a += s.speed;
    const alpha = .25 + (Math.sin(s.a) + 1) * .35;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,235,255,${alpha})`;
    ctx.shadowBlur = s.r > 1.2 ? 9 : 0;
    ctx.shadowColor = "#e9a8ff";
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
window.addEventListener("resize", resizeStars);
resizeStars();
drawStars();
showPage(0);