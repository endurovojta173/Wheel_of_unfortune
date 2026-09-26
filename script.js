const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultModal = document.getElementById('resultModal');
const resultText = document.getElementById('resultText');
const closeModalBtn = document.getElementById('closeModalBtn');

// --- Prvky pro boční menu ---
const menuToggleBtn = document.getElementById('menuToggleBtn');
const sidebar = document.getElementById('sidebar');
const menuOverlay = document.getElementById('menuOverlay');
const setList = document.getElementById('setList');

// Sady otázek
const questionSets = {
    "Párty trestné (Základní)": [
        "Jaký byl tvůj největší trapas?",
        "Udělej 10 poctivých dřepů!",
        "Ukaž poslední fotku v mobilu",
        "Zatanči na 10 vteřin",
        "Platíš kávu dalšímu na řadě!",
        "Řekni fakt dobrý vtip",
        "Ukaž poslední zprávu v chatu",
        "Udělej 10 kliků!",
        "Jaký je tvůj nejhorší zlozvyk?",
        "Zavolej náhodnému kontaktu"
    ],
    "IT a Vývojáři": [
        "Smazaná produkční DB",
        "Páteční deploy spadnul",
        "Nekonečná smyčka",
        "Merge konflikt (50+)",
        "Rozlitá káva do klávesnice",
        "Spadl internet na hodinu",
        "Ztracené heslo k serveru",
        "Klient změnil zadání (v pátek)",
        "Záloha neexistuje",
        "Smazal jsi branch (master)"
    ],
    "Odvážné výzvy (Hardcore)": [
        "Sněz lžičku chilli omáčky",
        "Napiš zprávu svému šéfovi",
        "Nakresli si něco na čelo",
        "Obleč si tričko naruby",
        "Zpívej svou neoblíbenou píseň",
        "Mluv s přízvukem 10 minut",
        "Obejmi kolegu naproti",
        "Vyměň si boty s kolegou"
    ]
};

let currentSetName = "Párty trestné (Základní)";
let misfortunes = questionSets[currentSetName];

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

// Web Audio API kontext
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTick() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine'; // Kratký, tlumený zvuk tikání
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

function playMisfortuneSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    
    // Dun dun duuuun (Temný dramatický výsledek)
    osc.frequency.setValueAtTime(300, audioCtx.currentTime); 
    osc.frequency.setValueAtTime(250, audioCtx.currentTime + 0.25);
    osc.frequency.setValueAtTime(150, audioCtx.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime + 0.2);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.24);
    
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.25);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime + 0.45);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.49);
    
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2.0);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 2.0);
}

function simulateWheelTicks(duration, totalTicks) {
    let startTime = null;
    let lastTick = 0;
    
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / duration;
        
        if (progress >= 1) return;
        
        // Zpomalující křivka pro tiky, odpovídající zhruba CSS cubic-bezier(0.17, 0.67, 0.12, 0.99)
        let easeOut = 1 - Math.pow(1 - progress, 4); 
        let currentTick = Math.floor(easeOut * totalTicks);
        
        if (currentTick > lastTick) {
            playTick();
            lastTick = currentTick;
        }
        
        if (isSpinning) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

function spinWheel() {
    if (isSpinning) return;
    
    initAudio(); // Probuzení audia po kliknutí

    isSpinning = true;
    spinBtn.disabled = true;

    // Vypočítat náhodnou rotaci (4 až 7 plných otáček + náhodný úhel pro zastavení)
    const extraSpins = Math.floor(Math.random() * 4) + 4;
    const randomAngle = Math.floor(Math.random() * 360);
    
    const targetRotation = currentRotation + (extraSpins * 360) + randomAngle;
    
    // Spočítat, kolik dílků kolo celkem mine, a nastavit adekvátní počet "tiků"
    const rotationDiff = targetRotation - currentRotation;
    const segmentsPassed = Math.floor(rotationDiff / (360 / misfortunes.length));
    simulateWheelTicks(5000, segmentsPassed);

    // CSS Animace (plynulý dojezd) s HW akcelerací pro levnější TV (translateZ)
    canvas.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    canvas.style.transform = `rotate(${targetRotation}deg) translateZ(0)`;

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
    
    // Zaměřit tlačítko v modálu (pro tvOS ovladač a klávesnici)
    setTimeout(() => closeModalBtn.focus(), 100);
    
    playMisfortuneSound(); // Přehrát dramatický zvuk výhry
    
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
    // Vrátit focus na hlavní tlačítko po zavření modálu
    setTimeout(() => spinBtn.focus(), 100);
});

spinBtn.addEventListener('click', spinWheel);

// Zajištění správného překreslení při změně velikosti okna/orientace na mobilu
window.addEventListener('resize', drawWheel);

// Počáteční vykreslení
drawWheel();

// Nastavení počátečního focusu na tvOS a klávesnicové navigaci
setTimeout(() => spinBtn.focus(), 500);

// --- Logika pro boční menu ---
function toggleMenu(forceState) {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        const isClosed = !sidebar.classList.contains('mobile-open');
        const newState = forceState !== undefined ? forceState : isClosed;
        
        if (newState) {
            sidebar.classList.add('mobile-open');
            menuOverlay.classList.remove('hidden');
        } else {
            sidebar.classList.remove('mobile-open');
            menuOverlay.classList.add('hidden');
        }
    } else {
        const isCollapsed = sidebar.classList.contains('collapsed');
        const newState = forceState !== undefined ? !forceState : isCollapsed;
        
        if (newState) {
            sidebar.classList.remove('collapsed');
        } else {
            sidebar.classList.add('collapsed');
        }
    }
}

menuToggleBtn.addEventListener('click', () => toggleMenu());
menuOverlay.addEventListener('click', () => toggleMenu(false));

function populateMenu() {
    setList.innerHTML = '';
    Object.keys(questionSets).forEach(setName => {
        const li = document.createElement('li');
        li.textContent = setName;
        li.tabIndex = 0; // Pro ovladače a klávesnici
        
        if (setName === currentSetName) {
            li.classList.add('active');
        }
        
        const selectSet = () => {
            if (isSpinning) return;
            currentSetName = setName;
            misfortunes = questionSets[setName];
            
            // Obarvení aktivní položky
            document.querySelectorAll('.set-list li').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            
            // Okamžité překreslení kola pro novou sadu textů
            drawWheel();
            
            // Zavřít menu na mobilu po výběru
            if (window.innerWidth <= 768) {
                toggleMenu(false);
            }
        };
        
        li.addEventListener('click', selectSet);
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') selectSet();
        });
        
        setList.appendChild(li);
    });
}

// Inicializace postranního menu
populateMenu();
