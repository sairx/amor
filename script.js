/* ================= PERSONALIZACIÓN (edite solo esta parte) ================= */
const CONFIG = {
  NOMBRE: "Davi",
  FECHA_INICIO: "2025-01-01T00:00:00",   // desde cuándo se conocen
  MUSICA: "musica.mp3",                    // archivo en la misma carpeta (vacío = melodía suave integrada)
  HISTORIA: [                            // foto: "fotos/1.jpg" (vacío = espacio reservado)
    { titulo: "El día que nos conocimos", texto: "Escriba aquí cómo fue aquel día.", foto: "" },
    { titulo: "Nuestro primer recuerdo especial", texto: "Escriba aquí ese primer recuerdo.", foto: "" },
    { titulo: "Momentos que nunca quiero olvidar", texto: "Escriba aquí esos momentos.", foto: "" },
    { titulo: "Lo que hemos vivido", texto: "Escriba aquí lo que han vivido juntos.", foto: "" },
    { titulo: "Todo lo bonito que nos espera", texto: "Escriba aquí lo que sueña vivir con usted.", foto: "" }
  ],
  CARTA: [
    "Mi Davi:",
    "Quizás no existan palabras suficientes para explicar lo especial que es usted para mí.",
    "Quiero que sepa que desde que llegó a mi vida, muchas cosas tienen un significado diferente.",
    "Me encanta poder compartir momentos con usted, conocerla cada día un poquito más y encontrar nuevas razones para sonreír.",
    "No quiero prometerle una vida perfecta, quiero ofrecerle una vida en la que nunca falten el cariño, el respeto, la comprensión y las ganas de seguir eligiéndonos.",
    "Si pudiera volver a comenzar mil veces, en todas buscaría la manera de encontrarla nuevamente.",
    "Con muchísimo amor Su Colochito. ❤️"
  ],
  RAZONES: [                             // agregue hasta llegar a 100; el contador se ajusta solo
    "Porque su sonrisa ilumina mis días.",
    "Porque me encanta escucharla.",
    "Porque su existencia hace más bonito mi mundo.",
    "Porque usted es única.",
    "Porque hasta los días normales se vuelven especiales a su lado.",
    "Porque a su lado el tiempo se siente más bonito.",
    "Porque su voz me tranquiliza.",
    "Porque me hace querer ser mejor.",
    "Porque con usted hasta el silencio es agradable.",
    "Porque usted ilumina con tanta intensidad.",
    "Porque me regala ganas de mirar hacia adelante.",
    "Porque cuando usted ríe, mi mundo se acomoda."
  ],
  MENSAJE_SI: "Entonces prepárese, porque todavía nos quedan muchísimos recuerdos bonitos por crear."
};
/* =========================================================================== */

const $ = s => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
document.querySelectorAll("[data-nombre]").forEach(e => e.textContent = CONFIG.NOMBRE);

/* ---------- Corazones flotantes (DOM) ---------- */
function burst(n, x, y, rain) {
  for (let i = 0; i < n; i++) {
    const h = document.createElement("span");
    h.className = "fh";
    h.textContent = ["❤", "💖", "✨", "🌸", "💗"][i % 5];
    h.style.left = (rain ? Math.random() * 100 + "vw" : x + "px");
    h.style.top = (rain ? "-5vh" : y + "px");
    h.style.fontSize = 14 + Math.random() * 20 + "px";
    h.style.setProperty("--x", (Math.random() - .5) * 200 + "px");
    h.style.setProperty("--y", rain ? "110vh" : -(80 + Math.random() * 160) + "px");
    h.style.setProperty("--d", 2 + Math.random() * 2 + "s");
    document.body.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }
}

/* ---------- Escena 3D (Three.js): galaxia + corazón ---------- */
let mode = "intro";
const poses = { intro: [0, .2, 0, 1], bg: [0, 1.6, -3.5, .8], final: [0, 0, -.5, 1.5] };
const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
(function () {
  if (!window.THREE) return;
  const cv = $("#bg");
  const R = new THREE.WebGLRenderer({ canvas: cv, alpha: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(60, 1, .1, 100);
  cam.position.z = 5;
  const size = () => { R.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); };
  size(); addEventListener("resize", size);

  const tex = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "#fff"); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();

  const galaxy = new THREE.Group(); sc.add(galaxy);
  // estrellas con distinta intensidad
  const N = innerWidth < 700 ? 700 : 1400, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const pal = [[1, 1, 1], [1, .76, .87], [.7, .75, 1], [1, .85, .54]];
  for (let i = 0; i < N; i++) {
    pos.set([(Math.random() - .5) * 40, (Math.random() - .5) * 40, -Math.random() * 30 + 4], i * 3);
    const c = pal[i % 4], k = .3 + Math.random() * .7; col.set([c[0] * k, c[1] * k, c[2] * k], i * 3);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(pos, 3)); sg.setAttribute("color", new THREE.BufferAttribute(col, 3));
  galaxy.add(new THREE.Points(sg, new THREE.PointsMaterial({ size: .14, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
  // nebulosas
  [0x8a2be2, 0xff4fa3, 0x4b3bd6, 0xc44fd8, 0xff8cc6, 0x3a5bd9].forEach((c, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: c, opacity: .3, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.position.set((Math.random() - .5) * 18, (Math.random() - .5) * 12, -8 - i * 2); s.scale.setScalar(12 + Math.random() * 6); galaxy.add(s);
  });
  // planetas
  const lights = [new THREE.AmbientLight(0xffffff, .6), new THREE.PointLight(0xff7fbf, 2, 40)];
  lights[1].position.set(3, 3, 6); lights.forEach(l => sc.add(l));
  const planets = [[0xb07cff, 1, -6, 2, -9, 0], [0xff8fc7, .7, 6, -2, -8, 1], [0x6f8cff, .5, -5, -3, -5, 0]].map(([c, r, x, y, z, ring]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), new THREE.MeshStandardMaterial({ color: c, roughness: .6, emissive: c, emissiveIntensity: .25 }));
    m.position.set(x, y, z);
    if (ring) { const t = new THREE.Mesh(new THREE.TorusGeometry(r * 1.6, .04, 8, 48), new THREE.MeshBasicMaterial({ color: 0xffd98a })); t.rotation.x = 1.2; m.add(t); }
    galaxy.add(m); return m;
  });
  // corazón 3D luminoso
  const sh = new THREE.Shape();
  sh.moveTo(0, .5); sh.bezierCurveTo(0, .95, -.7, .95, -.7, .4); sh.bezierCurveTo(-.7, -.1, -.1, -.3, 0, -.8);
  sh.bezierCurveTo(.1, -.3, .7, -.1, .7, .4); sh.bezierCurveTo(.7, .95, 0, .95, 0, .5);
  const hg = new THREE.ExtrudeGeometry(sh, { depth: .35, bevelEnabled: true, bevelThickness: .14, bevelSize: .12, bevelSegments: 5, curveSegments: 20 });
  hg.center();
  const heart = new THREE.Mesh(hg, new THREE.MeshStandardMaterial({ color: 0xff4fa3, emissive: 0xff1f7a, emissiveIntensity: .55, roughness: .25, metalness: .2 }));
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xff4fa3, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(5); heart.add(halo); sc.add(heart);
  heart.scale.setScalar(1.3);
  // estela de partículas que sigue el dedo
  const T = 36, tp = new Float32Array(T * 3), tg = new THREE.BufferGeometry();
  tg.setAttribute("position", new THREE.BufferAttribute(tp, 3));
  sc.add(new THREE.Points(tg, new THREE.PointsMaterial({ size: .22, map: tex, color: 0xffd98a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  const move = e => { const p = e.touches ? e.touches[0] : e; ptr.tx = p.clientX / innerWidth * 2 - 1; ptr.ty = -(p.clientY / innerHeight * 2 - 1); };
  addEventListener("pointermove", move); addEventListener("touchmove", move, { passive: true });

  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    t += reduce ? 0 : .01;
    ptr.x += (ptr.tx - ptr.x) * .08; ptr.y += (ptr.ty - ptr.y) * .08;
    const p = poses[mode];
    heart.position.x += (p[0] - heart.position.x) * .04;
    heart.position.y += (p[1] - heart.position.y) * .04 + (reduce ? 0 : Math.sin(t * 2) * .004);
    heart.position.z += (p[2] - heart.position.z) * .04;
    const s = heart.scale.x + (p[3] * 1.3 - heart.scale.x) * .04; heart.scale.setScalar(s * (1 + (reduce ? 0 : Math.sin(t * 6) * .004)));
    heart.rotation.y = t * .8 + ptr.x * .6; heart.rotation.x = -ptr.y * .3;
    galaxy.rotation.y = t * .03 + ptr.x * .1; galaxy.rotation.x = ptr.y * .06;
    planets.forEach((m, i) => m.rotation.y += .003 * (i + 1));
    // estela
    const wx = ptr.tx * 3.4, wy = ptr.ty * 2.2;
    for (let i = T - 1; i > 0; i--) { tp[i * 3] += (tp[(i - 1) * 3] - tp[i * 3]) * .35; tp[i * 3 + 1] += (tp[(i - 1) * 3 + 1] - tp[i * 3 + 1]) * .35; tp[i * 3 + 2] = 1; }
    tp[0] += (wx - tp[0]) * .3; tp[1] += (wy - tp[1]) * .3; tp[2] = 1;
    tg.attributes.position.needsUpdate = true;
    R.render(sc, cam);
  })();
})();

/* ---------- Bienvenida ---------- */
$("#start").addEventListener("click", e => {
  $("#intro").classList.add("gone"); document.body.classList.remove("lock"); mode = "bg";
  burst(18, e.clientX, e.clientY);
  if (!playing) setMusic(true);   // si el navegador bloqueó el autoplay, empieza aquí
});

/* ---------- Aparición, progreso y navegación ---------- */
const secs = [...document.querySelectorAll("section")];
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), { threshold: .25 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));
const dots = $("#dots");
secs.forEach(s => { const a = document.createElement("a"); a.href = "#" + s.id; a.setAttribute("aria-label", s.id); dots.appendChild(a); });
const upd = () => {
  const h = document.documentElement; $("#bar").style.width = scrollY / (h.scrollHeight - innerHeight) * 100 + "%";
  let cur = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .5) cur = i; });
  [...dots.children].forEach((d, i) => d.classList.toggle("on", i === cur));
  mode = document.body.classList.contains("lock") ? "intro" : (secs[cur].id === "final" ? "final" : "bg");
};
addEventListener("scroll", upd, { passive: true }); upd();
$("#top").addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

/* ---------- Árbol que crece (canvas 2D) ---------- */
const tc = $("#tree"), tx = tc.getContext("2d");
let tprog = reduce ? 1 : 0, treeVis = false;
new IntersectionObserver(e => treeVis = e[0].isIntersecting, { threshold: .4 }).observe(tc);
function branch(x, y, l, a, d, s, t) {
  const g = clamp((t - .1 - d * .075) / .12, 0, 1); if (g <= 0) return;
  const ex = x + Math.sin(a) * l * g, ey = y - Math.cos(a) * l * g;
  tx.strokeStyle = d < 3 ? "#8b5a9e" : "#b57fb8"; tx.lineWidth = Math.max(1.2, 9 - d * 1.4); tx.lineCap = "round";
  tx.beginPath(); tx.moveTo(x, y); tx.lineTo(ex, ey); tx.stroke();
  if (g < 1) return;
  if (d < 6) {
    const j = Math.sin(s * 91.7) * .22;
    branch(ex, ey, l * .76, a - .5 + j, d + 1, s * 2, t); branch(ex, ey, l * .76, a + .5 + j, d + 1, s * 2 + 1, t);
  }
  if (d >= 4) {
    const k = clamp((t - .6) / .2, 0, 1), f = clamp((t - .78) / .15, 0, 1);
    tx.fillStyle = "rgba(190,120,255,.85)"; tx.beginPath(); tx.arc(ex, ey, 6 * k, 0, 7); tx.fill();
    if (f > 0) { tx.fillStyle = "#ff9ecb"; tx.beginPath(); tx.arc(ex + 4, ey - 3, 5 * f, 0, 7); tx.fill(); tx.fillStyle = "#ffd98a"; tx.beginPath(); tx.arc(ex + 4, ey - 3, 1.8 * f, 0, 7); tx.fill(); }
  }
}
(function drawTree(now) {
  requestAnimationFrame(drawTree);
  if (!treeVis) return;
  if (tprog < 1) tprog = Math.min(1, tprog + .0016);
  const t = tprog; tx.clearRect(0, 0, 360, 420);
  const gl = tx.createRadialGradient(180, 410, 0, 180, 410, 140); gl.addColorStop(0, "rgba(255,79,163,.35)"); gl.addColorStop(1, "transparent");
  tx.fillStyle = gl; tx.fillRect(0, 280, 360, 140);
  if (t < .1) { tx.fillStyle = "#ffd98a"; tx.beginPath(); tx.ellipse(180, 405, 5 + t * 20, 3 + t * 20, 0, 0, 7); tx.fill(); }
  branch(180, 405, 95, 0, 0, 1, t);
  if (t > .85) {
    const k = clamp((t - .85) / .1, 0, 1); tx.font = "18px serif"; tx.textAlign = "center";
    for (let i = 0; i < 9; i++) {
      const ph = (now / 3500 + i / 9) % 1;
      tx.globalAlpha = k * (1 - ph) * .9; tx.fillStyle = i % 2 ? "#ff7fbf" : "#ffd98a";
      tx.fillText("♥", 40 + i * 35 + Math.sin(now / 900 + i) * 12, 300 - ph * 280);
    }
    tx.globalAlpha = 1;
  }
  if (t >= 1) $("#treeMsg").classList.add("show");
})();

/* ---------- Carta ---------- */
let opened = false;
$("#env").addEventListener("click", async e => {
  if (opened) return; opened = true; $("#env").classList.add("open"); $("#envHint").remove();
  burst(10, e.clientX, e.clientY);
  const L = $("#letter"); await new Promise(r => setTimeout(r, reduce ? 0 : 1400)); L.hidden = false;
  L.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  for (const txt of CONFIG.CARTA) {
    const p = document.createElement("p"); L.appendChild(p);
    if (reduce) { p.textContent = txt; continue; }
    for (const ch of txt) { p.textContent += ch; await new Promise(r => setTimeout(r, 28)); }
    burst(2, innerWidth / 2 + (Math.random() - .5) * 200, innerHeight * .7);
  }
});

/* ---------- Razones ---------- */
let ri = 0; const RZ = CONFIG.RAZONES;
$("#count").textContent = `0 / ${RZ.length}`;
$("#heart").addEventListener("click", e => {
  const h = e.currentTarget; h.classList.remove("tap"); void h.offsetWidth; h.classList.add("tap");
  $("#reason").textContent = RZ[ri % RZ.length]; ri++;
  $("#count").textContent = `${Math.min(ri, RZ.length)} / ${RZ.length}` + (ri >= RZ.length ? " ✨ ¡Todas!" : "");
  burst(5, e.clientX, e.clientY);
});

/* ---------- Final ---------- */
$("#yes").addEventListener("click", e => {
  burst(reduce ? 12 : 60, 0, 0, true); burst(20, e.clientX, e.clientY);
  const m = $("#yesMsg"); m.textContent = CONFIG.MENSAJE_SI; m.hidden = false;
  $("#yes").style.display = "none";
  m.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  if (!reduce) { let n = 0; const iv = setInterval(() => { burst(14, 0, 0, true); if (++n > 4) clearInterval(iv); }, 700); }
});

/* ---------- Música (solo con toque; archivo propio o melodía integrada) ---------- */
const aud = $("#aud"), play = $("#play"), vol = $("#vol"); let ac, master, playing = false;
function pad() {
  ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = vol.value * .25; master.connect(ac.destination);
  [220, 261.63, 329.63, 392, 493.88].forEach((f, i) => {
    const o = ac.createOscillator(), g = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain();
    o.type = "sine"; o.frequency.value = f; g.gain.value = .12; l.frequency.value = .08 + i * .03; lg.gain.value = .08;
    l.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(master); o.start(); l.start();
  });
}
function setMusic(on) {
  playing = on; play.classList.toggle("on", on); play.setAttribute("aria-label", on ? "Pausar música" : "Reproducir música");
  if (CONFIG.MUSICA) {
    if (!aud.src) aud.src = CONFIG.MUSICA;
    aud.volume = vol.value;
    if (on) aud.play().catch(() => setMusic(false)); else aud.pause();
  } else { if (!ac) pad(); on ? ac.resume() : ac.suspend(); }
}
play.addEventListener("click", () => setMusic(!playing));
vol.addEventListener("input", () => { aud.volume = vol.value; if (master) master.gain.value = vol.value * .25; });

// Intento de reproducción automática al entrar a la página
if (CONFIG.MUSICA) {
  aud.src = CONFIG.MUSICA; aud.volume = vol.value;
  aud.play().then(() => { playing = true; play.classList.add("on"); })
    .catch(() => {
      // Bloqueada por el navegador: empieza con el primer toque en la página
      const go = e => {
        if (e.target.closest && e.target.closest("#music")) return;
        ["click", "touchend", "keydown"].forEach(t => removeEventListener(t, go));
        if (!playing) setMusic(true);
      };
      ["click", "touchend", "keydown"].forEach(t => addEventListener(t, go));
    });
}
