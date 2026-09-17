const SITE = {
  name: "Jeremy's Dog",
  symbol: "Scout",
  chain: "arc",
  ca: "0x9934db0C05f8184D527Eef336f2639a02CCf1698",
  pair: "0x66ceaca66c20b5b04e7a1cc5ab1be0afb9375d093eea7956bf9c8df8b4592123",
  x: "https://x.com/ScoutCircleDog",
  explorer: "https://explorer.arc.io",
  dexBase: "https://dexscreener.com/arc",
  uniBase: "https://app.uniswap.org/swap?chain=arc",
};

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function dexUrl() {
  return SITE.pair ? `${SITE.dexBase}/${SITE.pair}` : SITE.dexBase;
}

function uniUrl() {
  return SITE.ca ? `${SITE.uniBase}&outputCurrency=${SITE.ca}` : SITE.uniBase;
}

function scanUrl() {
  return SITE.ca ? `${SITE.explorer}/address/${SITE.ca}` : SITE.explorer;
}

function wireLinks() {
  const dex = dexUrl();
  document.querySelectorAll("[data-link='dex']").forEach((el) => el.setAttribute("href", dex));
  document.querySelectorAll("[data-link='uni']").forEach((el) => el.setAttribute("href", uniUrl()));
  document.querySelectorAll("[data-link='scan']").forEach((el) => el.setAttribute("href", scanUrl()));
  document.querySelectorAll("[data-link='x']").forEach((el) => el.setAttribute("href", SITE.x));

  const frame = document.getElementById("dex-frame");
  if (frame) frame.src = `${dex}?embed=1&theme=light&info=0`;

  const label = SITE.ca || "Contract pending on Arc";
  document.querySelectorAll("[data-ca]").forEach((el) => {
    el.textContent = label;
  });
  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.dataset.copy = SITE.ca;
  });
}

async function copyCa(btn) {
  const tip = btn.querySelector(".ca-tip");
  if (!btn.dataset.copy) {
    if (tip) tip.textContent = "Soon";
    setTimeout(() => { if (tip) tip.textContent = "Copy"; }, 1200);
    return;
  }
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    if (tip) tip.textContent = "Copied";
  } catch (err) {
    if (tip) tip.textContent = "Failed";
  }
  setTimeout(() => { if (tip) tip.textContent = "Copy"; }, 1400);
}

function nav() {
  const bar = document.getElementById("nav");
  const menu = document.getElementById("menu");
  const onScroll = () => bar.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  menu.addEventListener("click", () => {
    const open = bar.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  document.getElementById("links").addEventListener("click", () => {
    bar.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  });
}

function reveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (reduce) {
    nodes.forEach((n) => n.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "80px 0px" });
  nodes.forEach((n) => io.observe(n));
  setTimeout(() => {
    nodes.forEach((n) => n.classList.add("in"));
  }, 1200);
}

function spotlight() {
  const spot = document.getElementById("spot");
  if (!spot || reduce) return;
  let x = window.innerWidth * 0.7;
  let y = 180;
  let tx = x;
  let ty = y;
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });
  const tick = () => {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    spot.style.left = `${x}px`;
    spot.style.top = `${y}px`;
    requestAnimationFrame(tick);
  };
  tick();
}

function drift() {
  const canvas = document.getElementById("drift");
  if (!canvas || reduce) return;
  const ctx = canvas.getContext("2d");
  const motes = [];
  const strands = [];
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 48; i += 1) {
    motes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      v: Math.random() * 0.28 + 0.08,
      a: Math.random() * 0.45 + 0.12,
    });
  }
  for (let i = 0; i < 10; i += 1) {
    strands.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      l: Math.random() * 90 + 40,
      rot: Math.random() * Math.PI,
      v: Math.random() * 0.18 + 0.04,
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    motes.forEach((m) => {
      m.y -= m.v;
      if (m.y < -10) {
        m.y = canvas.height + 10;
        m.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(154, 122, 56, ${m.a})`;
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });
    strands.forEach((s) => {
      s.x += Math.sin(s.rot) * s.v;
      s.y -= s.v * 0.35;
      s.rot += 0.004;
      if (s.y < -80) {
        s.y = canvas.height + 40;
        s.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.strokeStyle = "rgba(26, 21, 16, 0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(s.l * 0.4, 8, s.l, 0);
      ctx.stroke();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  };
  draw();
}

function magnets() {
  if (reduce) return;
  document.querySelectorAll(".magnet").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const box = el.getBoundingClientRect();
      const dx = (e.clientX - box.left - box.width / 2) * 0.18;
      const dy = (e.clientY - box.top - box.height / 2) * 0.18;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

function pawMarks() {
  if (reduce) return;
  document.addEventListener("click", (e) => {
    if (e.target.closest("a, button, iframe")) return;
    const mark = document.createElement("span");
    mark.className = "click-paw";
    mark.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:18px;height:18px;
      margin:-9px 0 0 -9px;border-radius:50%;pointer-events:none;z-index:30;
      background:radial-gradient(circle at 30% 30%, #c4a15a, transparent 70%);
      animation:pawpop 700ms ease forwards;
    `;
    document.body.appendChild(mark);
    setTimeout(() => mark.remove(), 720);
  });
  const style = document.createElement("style");
  style.textContent = "@keyframes pawpop{to{transform:scale(2.4);opacity:0}}";
  document.head.appendChild(style);
}

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", () => copyCa(btn));
});

wireLinks();
nav();
reveal();
spotlight();
drift();
magnets();
pawMarks();

const jump = new URLSearchParams(window.location.search).get("section");
if (jump) {
  const target = document.getElementById(jump);
  if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
}
