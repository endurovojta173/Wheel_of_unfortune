const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultModal = document.getElementById('resultModal');
const resultText = document.getElementById('resultText');
const closeModalBtn = document.getElementById('closeModalBtn');

// Pole možností, které lze jednoduše rozšiřovat a upravovat
const misfortunes = [
    "Smazaná produkční DB",
    "Páteční deploy spadnul",
    "Nekonečná smyčka",
    "Merge konflikt (50+)",
    "Rozlitá káva",
    "Spadl internet",
    "Zapomenuté heslo",
    "Klient změnil zadání"
];

// Ostré barvy - kyberpunk / tmavý styl (střídání dvou primárních barev pro kontrast)
const colors = [
    '#FF3366', '#1A1A2E', '#E94560', '#16213E', 
    '#FF2E63', '#0F3460', '#FF0055', '#2A2A4A'
];

let currentRotation = 0;
let isSpinning = false;

function drawWheel() {
    // Pro zajištění ostrého obrazu i na mobilech s vysokým DPI (Retina)
    const baseSize = 500;
    const scale = window.devicePixelRatio || 1;
    
    canvas.width = baseSize * scale;
    canvas.height = baseSize * scale;
    
    ctx.scale(scale, scale);

    const numSegments = misfortunes.length;
    const arc = (Math.PI * 2) / numSegments;
    const centerX = baseSize / 2;
    const centerY = baseSize / 2;
    const radius = centerX - 10; // malý okraj

    ctx.clearRect(0, 0, baseSize, baseSize);

    for (let i = 0; i < numSegments; i++) {
        const angle = i * arc;
        
        // Výplň segmentu
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
        ctx.fill();
        
        // Ohraničení segmentu
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.stroke();

        // Nakreslení textu
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 22px 'Outfit', sans-serif";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4;
        
        // Vykreslení textu na konkrétní pozici v rámci segmentu
        ctx.fillText(misfortunes[i], radius - 30, 0);
        ctx.restore();
    }
    
    // Vnitřní kruh (střed kola)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FF3366";
    ctx.stroke();
    
    // Malý ozdobný středový bod
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#FF3366";
    ctx.fill();
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

    // Vypočítat náhodnou rotaci (4 až 7 plných otáček + náhodný úhel pro zastavení)
    const extraSpins = Math.floor(Math.random() * 4) + 4;
    const randomAngle = Math.floor(Math.random() * 360);
    
    const targetRotation = currentRotation + (extraSpins * 360) + randomAngle;

    // CSS Animace (plynulý dojezd)
    canvas.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    canvas.style.transform = `rotate(${targetRotation}deg)`;

    // Počkat na dokončení animace (5 vteřin)
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        
        // Uložení aktuálního úhlu a normalizace
        currentRotation = targetRotation;
        const normalizedRotation = currentRotation % 360;
        
        const degreesPerSegment = 360 / misfortunes.length;
        // Naše kolo kreslí od 3 hodin (0°), šipka je nahoře (-90° / 270°)
        let pointerAngle = (270 - normalizedRotation + 360) % 360;
        const winningIndex = Math.floor(pointerAngle / degreesPerSegment);
        
        showResult(misfortunes[winningIndex]);
        
    }, 5000);
}

function showResult(text) {
    resultText.textContent = text;
    resultModal.classList.remove('hidden');
    
    // Temný / nebezpečný confetti efekt
    if (window.confetti) {
        const duration = 2000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 20 * (timeLeft / duration);
            
            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: Math.random(),
                    y: Math.random() - 0.2
                },
                colors: ['#ff3366', '#1a1a2e', '#ff0055', '#302b63'],
                ticks: 60,
                gravity: 1.2
            });
        }, 250);
    }
}

closeModalBtn.addEventListener('click', () => {
    resultModal.classList.add('hidden');
});

spinBtn.addEventListener('click', spinWheel);

// Zajištění správného překreslení při změně velikosti okna/orientace na mobilu
window.addEventListener('resize', drawWheel);

// Počáteční vykreslení
drawWheel();
