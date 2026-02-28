// /public/js/gallery.js

function getJsonFromScriptTag(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing <script id="${id}"> JSON data tag`);
  const text = el.textContent?.trim();
  if (!text) throw new Error(`Empty JSON in <script id="${id}">`);
  return JSON.parse(text);
}

const images = getJsonFromScriptTag("gallery-images"); // Array of image filenames
const folder = getJsonFromScriptTag("gallery-folder"); // Current folder name

const mainImage = document.getElementById("main-image");
const thumbnailGallery = document.getElementById("thumbnail-gallery"); // Thumbnail container
const thumbnailFolderName = "thumbnails";
let currentIndex = 0;

if (!mainImage) throw new Error("Missing #main-image element in DOM");
if (!thumbnailGallery) throw new Error("Missing #thumbnail-gallery element in DOM");

// Function to shuffle the images array (Fisher–Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Shuffle the images before displaying them
shuffleArray(images);

// Function to update the main image
function updateMainImage(index) {
  if (index >= 0 && index < images.length) {
    mainImage.src = `/images/${folder}/${images[index]}`;
    mainImage.alt = images[index];
    mainImage.decoding = "async";
    mainImage.fetchPriority = "high";

    // restart animation cleanly
    mainImage.classList.remove("visible");
    mainImage.classList.remove("fade-in");
    // force reflow so the animation restarts
    void mainImage.offsetWidth;
    mainImage.classList.add("fade-in");

    mainImage.onload = () => {
      mainImage.classList.add("visible");
    };

    // If cached and already complete, ensure it's visible
    if (mainImage.complete) {
      mainImage.classList.add("visible");
    }

    currentIndex = index;
  }
}

// Function to render thumbnails
function renderThumbnails() {
  thumbnailGallery.innerHTML = ""; // Clear existing thumbnails

  images.forEach((image, index) => {
    const thumbnail = document.createElement("img");
    thumbnail.src = `/images/${folder}/${thumbnailFolderName}/${image}`;
    thumbnail.alt = image;
    thumbnail.loading = "lazy";
    thumbnail.decoding = "async";
    thumbnail.fetchPriority = "low";
    thumbnail.classList.add("thumbnail");
    thumbnail.addEventListener("click", () => updateMainImage(index));
    thumbnailGallery.appendChild(thumbnail);
  });
}

// Event listener for arrow keys
document.addEventListener("keydown", (event) => {
  if (!images.length) return;

  if (event.key === "ArrowRight") {
    const nextIndex = (currentIndex + 1) % images.length;
    updateMainImage(nextIndex);
  } else if (event.key === "ArrowLeft") {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    updateMainImage(prevIndex);
  }
});

// Initialize the gallery
if (Array.isArray(images) && images.length) {
  renderThumbnails();
  updateMainImage(0);
} else {
  console.warn("No images provided to gallery.js");
}