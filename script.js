const images = [
  { src: "images/image1.png", caption: "One Punch Man" },
  { src: "images/image2.png", caption: "Black Clover" },
  { src: "images/image3.png", caption: "Vinland Saga" },
  { src: "images/image4.png", caption: "Monster" },
  { src: "images/image5.png", caption: "Bleach" },
  { src: "images/image6.png", caption: "Berserk" },
];

const track = document.getElementById("track");
function makeSlide({ src, caption }) {
  const fig = document.createElement("figure");
  fig.className = "slide";
  const img = document.createElement("img");
  img.src = src;
  img.alt = caption;
  const cap = document.createElement("figcaption");
  cap.className = "caption";
  cap.textContent = caption;
  fig.appendChild(img);
  fig.appendChild(cap);
  img.addEventListener("click", () => openPopup(src, caption));
  return fig;
}
images.forEach((item) => track.appendChild(makeSlide(item)));

let index = 0;
function go(i) {
  const slides = [...track.children];
  if (!slides.length) return;
  index = (i + slides.length) % slides.length;
  const el = slides[index];
  const left = el.offsetLeft;
  track.scrollTo({ left, behavior: "smooth" });
  localStorage.setItem("albumScrollIndex", index);
}
function next() {
  go(index + 1);
}
function prev() {
  go(index - 1);
}
document.getElementById("next").addEventListener("click", next);
document.getElementById("prev").addEventListener("click", prev);

let autoTimer = null;
let manualScrolling = false;

function startAuto() {
  if (autoTimer || manualScrolling) return;
  autoTimer = setInterval(next, 2600);
}
function stopAuto() {
  clearInterval(autoTimer);
  autoTimer = null;
}

track.addEventListener("scroll", () => {
  manualScrolling = true;
  stopAuto();
  clearTimeout(track._scrollTimeout);
  track._scrollTimeout = setTimeout(() => {
    manualScrolling = false;
    startAuto();
  }, 4000);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => (e.isIntersecting ? startAuto() : stopAuto()));
  },
  { threshold: 0.6 }
);
observer.observe(track);

window.addEventListener("load", () => {
  const saved = parseInt(localStorage.getItem("albumScrollIndex"), 10);
  if (!isNaN(saved)) go(saved);
  else go(0);
});

const popup = document.createElement("div");
popup.id = "popup";
popup.innerHTML = `<div class="popup-inner"><img src=""><div class="popup-caption"></div></div>`;
document.body.appendChild(popup);
popup.addEventListener("click", () => {
  popup.classList.remove("show");
});

function openPopup(src, caption) {
  const img = popup.querySelector("img");
  const cap = popup.querySelector(".popup-caption");
  img.src = src;
  cap.textContent = caption;
  popup.classList.add("show");
}

