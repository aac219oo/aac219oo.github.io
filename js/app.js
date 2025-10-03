// animation
const text = document.querySelectorAll(".thePaths");

// for (let i = 0; i < text.length; i++) {
//   console.log(`text number ${i} length is ${text[i].getTotalLength()}`);
// }

const lastWord = document.querySelector("#fourteenth");
const animation = document.querySelector("div.animation");
const skipBtn = document.querySelector("button.skip_animation");

function hideAnimation() {
  animation.style =
    "transition: all 0.8s ease; opacity: 0; pointer-events: none;";
}

lastWord.addEventListener("animationend", hideAnimation);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideAnimation();
  }
});

skipBtn.addEventListener("click", hideAnimation);