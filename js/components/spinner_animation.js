const spinner = document.getElementById('spinner');
const numDots = 6;
const radius = 20;

for (let i = 0; i < numDots; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot', `dot-${i}`);
    const angle = (i / numDots) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    spinner.appendChild(dot);
}
