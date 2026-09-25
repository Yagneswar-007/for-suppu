const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const letter = document.getElementById("letter");
const openLetter = document.getElementById("openLetter");
const yesBtn = document.getElementById("yesBtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + 0.2,
    a: Math.random(),
    s: Math.random() * 0.02 + 0.004,
    c: Math.random() > 0.25 ? "255, 255, 255" : "147, 197, 253",
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    star.a += star.s;
    ctx.fillStyle = `rgba(${star.c}, ${0.28 + Math.sin(star.a) * 0.5})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

openLetter.addEventListener("click", () => {
  letter.hidden = false;
  letter.scrollIntoView({ behavior: "smooth" });
});

yesBtn.addEventListener("click", () => {
  for (let i = 0; i < 28; i += 1) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = i % 2 ? "🤍" : "💙";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.bottom = "-20px";
    heart.style.animationDelay = `${Math.random() * 0.4}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2600);
  }
  modal.hidden = false;
});

closeModal.addEventListener("click", () => {
  modal.hidden = true;
});

window.addEventListener("resize", resize);
resize();
drawStars();
