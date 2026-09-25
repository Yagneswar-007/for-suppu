// Fill these two in and the site will tell you the moment she taps "Yes".
// whatsappNumber: country code + number, digits only. "" hides the WhatsApp button.
// alertEmail: your email address. "" turns the silent email alert off.
const CONFIG = {
  whatsappNumber: "917993448696",
  alertEmail: "yagneswar2000@gmail.com",
};

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const letter = document.getElementById("letter");
const openLetter = document.getElementById("openLetter");
const yesBtn = document.getElementById("yesBtn");
const waBtn = document.getElementById("waBtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let stars = [];
let shootingStar = null;
let nextShootingStar = performance.now() + 4000;

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

function spawnShootingStar() {
  shootingStar = {
    x: Math.random() * canvas.width * 0.7,
    y: Math.random() * canvas.height * 0.4,
    len: Math.random() * 90 + 90,
    speed: Math.random() * 6 + 8,
    life: 1,
  };
}

function drawShootingStar() {
  if (!shootingStar) return;
  const { x, y, len, life } = shootingStar;
  const gradient = ctx.createLinearGradient(x, y, x - len, y - len * 0.45);
  gradient.addColorStop(0, `rgba(226, 242, 255, ${life})`);
  gradient.addColorStop(1, "rgba(226, 242, 255, 0)");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - len, y - len * 0.45);
  ctx.stroke();

  shootingStar.x += shootingStar.speed;
  shootingStar.y += shootingStar.speed * 0.45;
  shootingStar.life -= 0.012;
  if (shootingStar.life <= 0) shootingStar = null;
}

function drawStars(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    star.a += star.s;
    ctx.fillStyle = `rgba(${star.c}, ${0.28 + Math.sin(star.a) * 0.5})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!calm) {
    if (!shootingStar && now > nextShootingStar) {
      spawnShootingStar();
      nextShootingStar = now + Math.random() * 9000 + 6000;
    }
    drawShootingStar();
  }

  requestAnimationFrame(drawStars);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);

openLetter.addEventListener("click", () => {
  letter.hidden = false;
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  letter.scrollIntoView({ behavior: calm ? "auto" : "smooth" });
});

function rainHearts() {
  for (let i = 0; i < 28; i += 1) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = i % 2 ? "🤍" : "💙";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.bottom = "-20px";
    heart.style.animationDelay = `${Math.random() * 0.4}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2800);
  }
}

function notifyByEmail() {
  if (!CONFIG.alertEmail) return;
  const when = new Date().toLocaleString();
  fetch(`https://formsubmit.co/ajax/${CONFIG.alertEmail}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: "She said yes 🤍",
      message: `Suppu tapped "Yes, I'll give you a chance" on ${when}.`,
    }),
  }).catch(() => {});
}

function setupWhatsApp() {
  if (!CONFIG.whatsappNumber) return;
  const text = encodeURIComponent(
    "I read your letter… okay. One chance. 🤍"
  );
  waBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
  waBtn.hidden = false;
}

yesBtn.addEventListener("click", () => {
  rainHearts();
  notifyByEmail();
  setupWhatsApp();
  modal.hidden = false;
});

closeModal.addEventListener("click", () => {
  modal.hidden = true;
});

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(drawStars);
