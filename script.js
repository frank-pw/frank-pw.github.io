const heroSub = document.getElementById('hero-sub');
const text = "musica, libri, videogiochi, zen, la mia malattia, e tutto quello che mi passa per la testa — senza filtri.";
let index = 0;

function typeWriter() {
  if (!heroSub) return;

  if (index < text.length) {
    heroSub.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWriter, 50);
  } else {
    heroSub.innerHTML += '<span class="cursor">|</span>';
  }
}

if (heroSub) {
  typeWriter();
}

(function () {
  const target = document.getElementById("jp-typewriter-word");
  if (!target) return;

  const words = ["silenzio", "vuoto", "suono", "conforto"];
  const typeDelay = 110;
  const deleteDelay = 70;
  const holdAfterType = 1400;
  const holdAfterDelete = 450;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      charIndex += 1;
      target.textContent = currentWord.slice(0, charIndex);

      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(tick, holdAfterType);
        return;
      }

      setTimeout(tick, typeDelay);
      return;
    }

    charIndex -= 1;
    target.textContent = currentWord.slice(0, charIndex);

    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(tick, holdAfterDelete);
      return;
    }

    setTimeout(tick, deleteDelay);
  }

  tick();
})();

const heroImage = document.querySelector(".hero-image");
if (heroImage) {
  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 20;
    const y = (event.clientY / window.innerHeight - 0.5) * 14;
    heroImage.style.transform = `translate(${x}px, ${y}px)`;
  });
}

const reveals = document.querySelectorAll(".reveal");
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
reveals.forEach((el) => obs.observe(el));

const showMoreBtn = document.getElementById('show-more-btn');
if (showMoreBtn) {
  const allPosts = document.querySelectorAll('.post-item');
  const hiddenPosts = [];
  allPosts.forEach((post, index) => {
    if (index >= 12) {
      post.classList.add('hidden-post');
      hiddenPosts.push(post);
    }
  });

  if (hiddenPosts.length === 0) {
    showMoreBtn.style.display = 'none';
  }

  showMoreBtn.addEventListener('click', () => {
    hiddenPosts.forEach((post) => {
      post.classList.remove('hidden-post');
      obs.observe(post);
    });
    showMoreBtn.style.display = 'none';
  });
}

// Petali di papavero
(function () {
  const canvas = document.getElementById('papaveri-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const wrap = canvas.parentElement;

  function resize() {
    canvas.width = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);

  const COLORS = [
    [200, 28, 20], [185, 18, 12], [222, 52, 36],
    [160, 18,  8], [210, 40, 25],
  ];

  function mkPetal() {
    const [r, g, b] = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * canvas.width,
      y: -16 - Math.random() * 40,
      w: 5 + Math.random() * 7,
      h: 9 + Math.random() * 13,
      vy: 0.55 + Math.random() * 1.1,
      vx: (Math.random() - 0.5) * 0.5,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.035,
      sway: Math.random() * Math.PI * 2,
      swayV: 0.016 + Math.random() * 0.012,
      swayR: 0.4 + Math.random() * 1.2,
      a: 0.55 + Math.random() * 0.35,
      r, g, b,
    };
  }

  const petals = [];
  let raf = null;
  let running = false;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (petals.length < 24 && Math.random() < 0.045) petals.push(mkPetal());

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.sway += p.swayV;
      p.x += p.vx + Math.sin(p.sway) * p.swayR;
      p.y += p.vy;
      p.rot += p.rotV;

      const fade = Math.min(1, (canvas.height - p.y) / 60, p.y / 18 + 0.2);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.a * Math.max(0, fade);
      ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.y > canvas.height + 20) petals.splice(i, 1);
    }

    if (running) raf = requestAnimationFrame(draw);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !running) {
        running = true;
        draw();
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
  }, { threshold: 0.15 });

  io.observe(wrap);
})();

// Share button functionality
const shareBtn = document.querySelector('.share-btn');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copiato negli appunti!');
      }).catch(err => {
        console.log('Error copying:', err);
      });
    }
  });
}
