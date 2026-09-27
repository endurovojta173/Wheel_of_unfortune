const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultModal = document.getElementById('resultModal');
const resultText = document.getElementById('resultText');
const closeModalBtn = document.getElementById('closeModalBtn');

// --- Sidebar menu elements ---
const menuToggleBtn = document.getElementById('menuToggleBtn');
const sidebar = document.getElementById('sidebar');
const menuOverlay = document.getElementById('menuOverlay');
const setList = document.getElementById('setList');

// --- Custom Confirm Modal ---
const confirmModal = document.getElementById('confirmModal');
const confirmModalText = document.getElementById('confirmModalText');
const confirmYesBtn = document.getElementById('confirmYesBtn');
const confirmNoBtn = document.getElementById('confirmNoBtn');
let pendingConfirmAction = null;

if (confirmYesBtn && confirmNoBtn) {
    confirmNoBtn.addEventListener('click', () => {
        confirmModal.classList.add('hidden');
        pendingConfirmAction = null;
    });
    
    confirmYesBtn.addEventListener('click', () => {
        confirmModal.classList.add('hidden');
        if (pendingConfirmAction) {
            pendingConfirmAction();
            pendingConfirmAction = null;
        }
    });
}

function showConfirm(text, callback) {
    if (!confirmModal) return;
    confirmModalText.textContent = text;
    pendingConfirmAction = callback;
    confirmModal.classList.remove('hidden');
}

// Question sets
const questionSets = {
    "Základní": [
        "Udělej 10 poctivých dřepů!",
        "Stůj dalších 5 kol na jedné noze",
        "Ukaž svou 3. nejnovější fotku/video z galerie",
        "Sundeš si na 5 kol jeden kus oblečení",
        "Nech si od někoho namalovat něco malého fixou",
        "Zpívej všechno, co řekneš, po další 2 kola",
        "Předveď pantomimu na zadané téma",
        "Napodobuj zvíře podle volby ostatních po další 3 kola",
        "Zkus rozesmát osobu naproti tobě (máš 30 vteřin)",
        "Mluv 3 další kola s cizím přízvukem",
        "Další 3 kola o sobě mluv pouze ve 3. osobě",
        "Vyměň si na jedno kolo oblečení s někým dalším",
        "Zazpívej refrén své nejoblíbenější písničky",
        "Ukaž všem svoje poslední vyhledávání na Instagramu",
        "Zavři oči a hádej předmět, který ti dají do ruky"
    ],
    "Odvážné výzvy (Hardcore)": [
        "Řekni legendární hlášku s co největším nasazením",
        "Sundej si jeden libovolný kus oblečení na dalších 5 kol",
        "Sundej si kus oblečení ze spodní části těla na dalších 5 kol",
        "Sundej si kus oblečení z horní části těla na dalších 5 kol",
        "Udělej komínek",
        "Udělej most a vydrž v něm 15 vteřin",
        "Nech si na sebe něco napsat fixou",
        "Všichni si dají pivo",
        "Dej si panáka",
        "Všichni si dají panáka",
        "Sněz syrový stroužek česneku",
        "Přečti nahlas svou poslední konverzaci s rodiči",
        "Zatanči svůdný tanec pro nejbližší předmět v místnosti",
        "Nech si od někoho zkontrolovat historii v prohlížeči v mobilu",
        "Olízni vlastní loket (nebo se o to aspoň minutu upřímně snaž)",
        "Lehni si na zem a nech někoho, ať tě přeskočí",
        "Sněz plnou lžíci kečupu bez zapíjení",
        "Zazpíváš část písně dle našeho výběru",
        "Olízni si palec u nohy",
        "Se zavřenýma očima olízni něco, co ti dají k puse"
    ],
    "Čísla 0-10": Array.from({ length: 11 }, (_, i) => i.toString()),
    "Čísla 0-20": Array.from({ length: 21 }, (_, i) => i.toString())
};

// Load custom categories from local storage
const savedCategories = JSON.parse(localStorage.getItem('wheelCustomCategories')) || {};
Object.assign(questionSets, savedCategories);

let currentSetName = "Základní";
let misfortunes = questionSets[currentSetName];

// Sharp colors - themes
const themeColors = {
    default: [
        '#FF3366', '#1A1A2E', '#E94560', '#16213E',
        '#FF2E63', '#0F3460', '#FF0055', '#2A2A4A'
    ],
    circus: [
        '#FF0000', '#FF9900', '#FFEA00', '#33CC33',
        '#0099FF', '#9900FF'
    ],
    folklore: [
        '#D32F2F', '#FFFFFF', '#1976D2', '#FFFFFF',
        '#388E3C', '#FFFFFF', '#FBC02D', '#FFFFFF'
    ]
};

let currentTheme = localStorage.getItem('wheelTheme') || 'default';
let colors = themeColors[currentTheme];
if (currentTheme !== 'default') {
    document.body.className = `theme-${currentTheme}`;
}

function getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 2), 16);
    const b = parseInt(hex.substring(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#1a1a1a' : '#FFFFFF';
}

let currentRotation = 0;
let isSpinning = false;
let spinHistory = [];

function drawWheel() {
    // Increased resolution (baseSize) for better quality on desktops
    const baseSize = 800;
    const scale = window.devicePixelRatio || 1;

    canvas.width = baseSize * scale;
    canvas.height = baseSize * scale;

    ctx.scale(scale, scale);

    const numSegments = misfortunes.length;
    const arc = (Math.PI * 2) / numSegments;
    const centerX = baseSize / 2;
    const centerY = baseSize / 2;
    const radius = centerX - 15; // small margin

    ctx.clearRect(0, 0, baseSize, baseSize);

    for (let i = 0; i < numSegments; i++) {
        const angle = i * arc;

        // Segment fill
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
        ctx.fill();

        // Segment border
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "center"; // Change to center alignment
        ctx.textBaseline = "middle";

        const segmentColor = colors[i % colors.length];
        const textColor = getContrastColor(segmentColor);
        ctx.fillStyle = textColor;

        // Dynamic font size - recalculated for new 800px resolution
        const fontSize = numSegments > 10 ? 22 : 28;
        ctx.font = `bold ${fontSize}px 'Outfit', sans-serif`;
        ctx.shadowColor = textColor === '#FFFFFF' ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.7)";
        ctx.shadowBlur = textColor === '#FFFFFF' ? 8 : 4;

        const text = misfortunes[i];
        const maxWidth = radius - 110; // Free space for text towards the center
        const words = text.split(' ');
        let line = '';
        let lines = [];

        // Text wrapping for multiple lines
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        // Calculate the actual maximum line width in this block,
        // so the block of text as a whole can be aligned to the outer edge
        let actualMaxWidth = 0;
        for (let j = 0; j < lines.length; j++) {
            const w = ctx.measureText(lines[j].trim()).width;
            if (w > actualMaxWidth) actualMaxWidth = w;
        }

        // Render lines (vertically and horizontally centered near the edge)
        const lineHeight = fontSize + 6;
        const totalHeight = lines.length * lineHeight;
        const startY = -(totalHeight / 2) + (lineHeight / 2);

        // Target right edge of the block is radius - 45. Center of text is shifted left by half its width.
        const textCenterX = radius - 45 - (actualMaxWidth / 2);

        for (let j = 0; j < lines.length; j++) {
            ctx.fillText(lines[j].trim(), textCenterX, startY + (j * lineHeight));
        }

        ctx.restore();
    }

    // Inner circle (center of the wheel)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = currentTheme === 'folklore' ? '#FFFFFF' : (currentTheme === 'circus' ? '#FFFFFF' : '#1a1a2e');
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = currentTheme === 'folklore' ? '#d32f2f' : (currentTheme === 'circus' ? '#ff0055' : '#FF3366');
    ctx.stroke();

    // Small decorative center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 13, 0, Math.PI * 2);
    ctx.fillStyle = currentTheme === 'folklore' ? '#1565C0' : (currentTheme === 'circus' ? '#0099FF' : '#FF3366');
    ctx.fill();
}

// Web Audio API context
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

    osc.type = 'sine'; // Short, muted ticking sound
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
    const now = audioCtx.currentTime;
    
    // Random selection of one of the three fanfares
    const choice = Math.floor(Math.random() * 3);
    
    if (choice === 0) {
        // --- 1. Epic brass fanfare (Ta-ta-ta-DAAA!) ---
        const times = [0, 0.15, 0.30, 0.50];
        
        function playEpicTone(freq, time, duration, isLast) {
            const detunes = [-5, 0, 5]; 
            detunes.forEach(detune => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth'; 
                osc.frequency.value = freq;
                osc.detune.value = detune;
                const maxGain = 0.05; 
                
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(maxGain, time + 0.02); 
                
                if (!isLast) {
                    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
                } else {
                    gain.gain.setValueAtTime(maxGain, time + duration * 0.4);
                    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
                }
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(time);
                osc.stop(time + duration + 0.1);
            });
        }

        playEpicTone(392.00, now + times[0], 0.1, false);
        playEpicTone(392.00, now + times[1], 0.1, false);
        playEpicTone(392.00, now + times[2], 0.1, false);
        
        playEpicTone(261.63, now + times[3], 2.5, true); 
        playEpicTone(523.25, now + times[3], 2.5, true); 
        playEpicTone(659.25, now + times[3], 2.5, true); 
        playEpicTone(783.99, now + times[3], 2.5, true); 
        
    } else if (choice === 1) {
        // --- 2. Retro 8-bit fanfare (TadadaDAAA) ---
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const times = [0, 0.12, 0.24, 0.36];
        
        const gainNode = audioCtx.createGain();
        gainNode.connect(audioCtx.destination);
        gainNode.gain.setValueAtTime(0, now);
        
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        osc1.type = 'square';
        osc2.type = 'square';
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        
        for(let i = 0; i < 4; i++) {
            osc1.frequency.setValueAtTime(notes[i], now + times[i]);
            osc2.frequency.setValueAtTime(notes[i] * 1.005, now + times[i]);
            
            if (i < 3) {
                gainNode.gain.setValueAtTime(0.15, now + times[i]);
                gainNode.gain.linearRampToValueAtTime(0, now + times[i] + 0.1);
            } else {
                gainNode.gain.setValueAtTime(0.15, now + times[i]);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + times[i] + 1.5);
            }
        }
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.0);
        osc2.stop(now + 2.0);
        
    } else {
        // --- 3. Cavalry Charge ---
        // Melody: Da-da-da-DAAA, da-DAAAA!
        const G4 = 392.00, C5 = 523.25, E5 = 659.25, G5 = 783.99;
        const notes = [G4, C5, E5, G5, E5, G5];
        const times = [0, 0.15, 0.30, 0.45, 0.8, 1.0];
        const durs =  [0.1, 0.1, 0.1, 0.25, 0.1, 1.5];
        
        function playTrumpet(freq, time, duration, isLast) {
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            // Mix of sawtooth and triangle for a softer, but punchy trumpet sound
            osc1.type = 'triangle'; 
            osc2.type = 'sawtooth';
            osc1.frequency.value = freq;
            osc2.frequency.value = freq;
            
            const maxGain = 0.08;
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(maxGain, time + 0.02);
            
            if (!isLast) {
                gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            } else {
                gain.gain.setValueAtTime(maxGain, time + duration * 0.4);
                gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            }
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc1.start(time);
            osc2.start(time);
            osc1.stop(time + duration + 0.1);
            osc2.stop(time + duration + 0.1);
        }
        
        for (let i = 0; i < 6; i++) {
            playTrumpet(notes[i], now + times[i], durs[i], i === 5);
        }
    }
}

function simulateWheelTicks() {
    let lastSegmentIndex = -1;

    function step() {
        if (!isSpinning) return;

        // Get actual rotation from CSS
        const style = window.getComputedStyle(canvas);
        const matrix = style.getPropertyValue('transform');
        let currentAngle = 0;
        
        if (matrix !== 'none') {
            const values = matrix.split('(')[1].split(')')[0].split(',');
            const a = parseFloat(values[0]);
            const b = parseFloat(values[1]);
            currentAngle = Math.atan2(b, a) * (180 / Math.PI);
        }
        
        if (currentAngle < 0) currentAngle += 360;

        const degreesPerSegment = 360 / misfortunes.length;
        // Our wheel draws from 3 o'clock (0°), pointer is at the top (-90° / 270°)
        let pointerAngle = (270 - currentAngle + 360) % 360;
        const currentSegmentIndex = Math.floor(pointerAngle / degreesPerSegment);

        if (currentSegmentIndex !== lastSegmentIndex && lastSegmentIndex !== -1) {
            playTick();
        }

        if (currentSegmentIndex !== lastSegmentIndex) {
            const subHeaderText = document.getElementById('subHeaderText');
            if (subHeaderText) {
                subHeaderText.textContent = misfortunes[currentSegmentIndex];
            }
            lastSegmentIndex = currentSegmentIndex;
        }

        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function spinWheel() {
    if (isSpinning) return;

    initAudio(); // Wake up audio on click

    isSpinning = true;
    spinBtn.disabled = true;

    // Random spin duration (6.5 to 11.5 seconds for more tension)
    const spinDurationS = 6.5 + (Math.random() * 5);
    const spinDurationMs = Math.round(spinDurationS * 1000);

    // Number of spins tied to duration with an added layer of randomness
    const extraSpins = Math.floor(spinDurationS * 1.1) + Math.floor(Math.random() * 4);
    const randomAngle = Math.floor(Math.random() * 360);

    const targetRotation = currentRotation + (extraSpins * 360) + randomAngle;

    // Calculate target rotation
    const rotationDiff = targetRotation - currentRotation;
    simulateWheelTicks();

    // CSS Animation with HW acceleration
    canvas.style.transition = `transform ${spinDurationS}s cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
    canvas.style.transform = `rotate(${targetRotation}deg) translateZ(0)`;

    // Listen for the exact moment the CSS animation truly ends
    canvas.addEventListener('transitionend', function onSpinEnd() {
        // Immediately remove listener so it doesn't fire multiple times
        canvas.removeEventListener('transitionend', onSpinEnd);

        isSpinning = false;
        spinBtn.disabled = false;

        // Save current angle and normalize
        currentRotation = targetRotation;
        const normalizedRotation = currentRotation % 360;

        const degreesPerSegment = 360 / misfortunes.length;
        // Our wheel draws from 3 o'clock (0°), pointer is at the top (-90° / 270°)
        let pointerAngle = (270 - normalizedRotation + 360) % 360;
        const winningIndex = Math.floor(pointerAngle / degreesPerSegment);
        
        const subHeaderText = document.getElementById('subHeaderText');
        if (subHeaderText) {
            subHeaderText.textContent = misfortunes[winningIndex];
        }

        const winningText = misfortunes[winningIndex];
        spinHistory.push(winningText);
        updateHistoryUI();

        showResult(winningText);
    });
}

function showResult(text) {
    resultText.textContent = text;
    resultModal.classList.remove('hidden');

    // Focus the button in the modal (for tvOS remote and keyboard)
    setTimeout(() => closeModalBtn.focus(), 100);

    playMisfortuneSound(); // Play dramatic winning sound

    // Dark / dangerous confetti effect
    if (window.confetti) {
        const duration = 2000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(function () {
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
    // Return focus to main button after closing modal
    setTimeout(() => spinBtn.focus(), 100);
});

// --- HISTORY ---
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const historyModalList = document.getElementById('historyModalList');

function updateHistoryUI() {
    if (spinHistory.length === 0) {
        historyModalList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px 0;">Zatím nikdo netrpěl. Zatoč kolem!</div>';
        return;
    }
    let html = '<ol style="padding-left: 20px; margin: 0; color: var(--text-main);">';
    spinHistory.forEach((item) => {
        html += `<li style="padding: 5px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">${item}</li>`;
    });
    html += '</ol>';
    historyModalList.innerHTML = html;
}

if (historyBtn) {
    historyBtn.addEventListener('click', () => {
        updateHistoryUI();
        historyModal.classList.remove('hidden');
    });
}

if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener('click', () => {
        historyModal.classList.add('hidden');
    });
}

spinBtn.addEventListener('click', spinWheel);

// Ensure correct redraw when resizing window/changing orientation on mobile
window.addEventListener('resize', drawWheel);

// Initial render
drawWheel();

// Set initial focus for tvOS and keyboard navigation
setTimeout(() => spinBtn.focus(), 500);

// --- Sidebar menu logic ---
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
    const defaultSets = ['Základní', 'Odvážné výzvy (Hardcore)', 'Čísla 0-10', 'Čísla 0-20'];
    
    Object.keys(questionSets).forEach(setName => {
        const li = document.createElement('li');
        li.tabIndex = 0; // For remotes and keyboards
        
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        
        const labelSpan = document.createElement('span');
        labelSpan.textContent = setName;
        li.appendChild(labelSpan);

        if (!defaultSets.includes(setName)) {
            const actionsContainer = document.createElement('div');
            actionsContainer.style.display = 'flex';
            actionsContainer.style.alignItems = 'center';

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
            editBtn.title = 'Upravit kategorii';
            editBtn.style.background = 'transparent';
            editBtn.style.border = 'none';
            editBtn.style.cursor = 'pointer';
            editBtn.style.color = 'var(--text-main)';
            editBtn.style.padding = '5px';
            editBtn.style.marginLeft = '10px';
            editBtn.style.opacity = '0.7';
            editBtn.style.display = 'flex';
            editBtn.style.alignItems = 'center';
            editBtn.style.justifyContent = 'center';
            editBtn.style.transition = 'opacity 0.2s, transform 0.2s';
            
            editBtn.addEventListener('mouseenter', () => {
                editBtn.style.opacity = '1';
                editBtn.style.transform = 'scale(1.2)';
                editBtn.style.color = '#33ccff';
            });
            editBtn.addEventListener('mouseleave', () => {
                editBtn.style.opacity = '0.7';
                editBtn.style.transform = 'scale(1)';
                editBtn.style.color = 'var(--text-main)';
            });

            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu(false);
                
                editingCategoryName = setName;
                if (customModalTitle) customModalTitle.textContent = 'Upravit kolo';
                saveCustomBtn.textContent = 'Uložit';
                customNameInput.value = setName;
                customItemsContainer.innerHTML = '';
                
                const items = questionSets[setName];
                items.forEach(item => addCustomRow(item));
                
                // Add one empty row at the end for easy addition
                addCustomRow();
                
                customModal.classList.remove('hidden');
                customNameInput.focus();
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
            deleteBtn.title = 'Smazat kategorii';
            deleteBtn.style.background = 'transparent';
            deleteBtn.style.border = 'none';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.color = '#ff3366'; // Red color
            deleteBtn.style.padding = '5px';
            deleteBtn.style.marginLeft = '5px';
            deleteBtn.style.opacity = '0.7';
            deleteBtn.style.display = 'flex';
            deleteBtn.style.alignItems = 'center';
            deleteBtn.style.justifyContent = 'center';
            deleteBtn.style.transition = 'opacity 0.2s, transform 0.2s';
            
            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.opacity = '1';
                deleteBtn.style.transform = 'scale(1.2)';
            });
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.opacity = '0.7';
                deleteBtn.style.transform = 'scale(1)';
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent category selection
                
                // Close menu so it doesn't block the delete modal
                toggleMenu(false);
                
                showConfirm(`Opravdu chcete smazat vlastní kategorii "${setName}"?`, () => {
                    // Delete from list
                    delete questionSets[setName];
                    
                    // Delete from localStorage
                    const savedCategoriesObj = JSON.parse(localStorage.getItem('wheelCustomCategories')) || {};
                    delete savedCategoriesObj[setName];
                    localStorage.setItem('wheelCustomCategories', JSON.stringify(savedCategoriesObj));
                    
                    // If the user deleted the currently active category, return them to Basic
                    if (currentSetName === setName) {
                        currentSetName = 'Základní';
                        misfortunes = questionSets[currentSetName];
                        drawWheel();
                    }
                    
                    // Redraw menu
                    populateMenu();
                });
            });

            actionsContainer.appendChild(editBtn);
            actionsContainer.appendChild(deleteBtn);
            li.appendChild(actionsContainer);
        }

        if (setName === currentSetName) {
            li.classList.add('active');
        }

        const selectSet = () => {
            if (isSpinning) return;
            currentSetName = setName;
            misfortunes = questionSets[setName];

            // Highlight active item
            document.querySelectorAll('.set-list li').forEach(el => el.classList.remove('active'));
            li.classList.add('active');

            // Immediate wheel redraw for new text set
            drawWheel();

            // Always close menu after selection
            toggleMenu(false);
        };

        li.addEventListener('click', selectSet);
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') selectSet();
        });

        setList.appendChild(li);
    });
}

// Sidebar menu initialization
populateMenu();

// --- Theme selection logic ---
const themeList = document.getElementById('themeList');
if (themeList) {
    const themeItems = themeList.querySelectorAll('li');
    
    // Restore active item based on loaded theme
    themeItems.forEach(li => {
        if (li.getAttribute('data-theme') === currentTheme) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });

    themeItems.forEach(li => {
        li.tabIndex = 0;

        const selectTheme = () => {
            if (isSpinning) return;
            currentTheme = li.getAttribute('data-theme');
            colors = themeColors[currentTheme];
            
            // Save to localStorage
            localStorage.setItem('wheelTheme', currentTheme);

            // Change class on body
            document.body.className = currentTheme === 'default' ? '' : `theme-${currentTheme}`;

            // Highlight active item in menu
            themeItems.forEach(el => el.classList.remove('active'));
            li.classList.add('active');

            // Redraw wheel
            drawWheel();

            // Close menu after selection
            toggleMenu(false);
        };

        li.addEventListener('click', selectTheme);
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') selectTheme();
        });
    });
}

// --- Custom category logic ---
const customModal = document.getElementById('customModal');
const customModalTitle = document.getElementById('customModalTitle');
const createCustomBtn = document.getElementById('createCustomBtn');
const saveCustomBtn = document.getElementById('saveCustomBtn');
const cancelCustomBtn = document.getElementById('cancelCustomBtn');
const customNameInput = document.getElementById('customName');
const customItemsContainer = document.getElementById('customItemsContainer');
let editingCategoryName = null;

function createCustomRow(placeholderIndex, initialValue = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-item-wrapper';

    const label = document.createElement('div');
    label.className = 'input-label';
    label.textContent = `Položka ${placeholderIndex}`;

    const row = document.createElement('div');
    row.className = 'custom-item-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'custom-input item-input';
    input.placeholder = `...`;
    input.value = initialValue;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustomRow();
        }
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'add-row-btn';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', () => {
        addCustomRow();
    });

    row.appendChild(input);
    row.appendChild(addBtn);

    wrapper.appendChild(label);
    wrapper.appendChild(row);

    return { row: wrapper, input };
}

function addCustomRow(initialValue = '') {
    const count = customItemsContainer.children.length + 1;
    const { row, input } = createCustomRow(count, initialValue);
    customItemsContainer.appendChild(row);
    if (!initialValue) {
        input.focus();
    }
    customItemsContainer.scrollTop = customItemsContainer.scrollHeight;
}

if (createCustomBtn) {
    createCustomBtn.addEventListener('click', () => {
        editingCategoryName = null;
        if (customModalTitle) customModalTitle.textContent = 'Vytvořit kolo';
        saveCustomBtn.textContent = 'Vytvořit';
        customNameInput.value = '';
        customItemsContainer.innerHTML = ''; // Clear
        addCustomRow(); // Add first row
        customModal.classList.remove('hidden');
        customNameInput.focus();

        // Close menu on click
        toggleMenu(false);
    });
}

if (cancelCustomBtn) {
    cancelCustomBtn.addEventListener('click', () => {
        customModal.classList.add('hidden');
    });
}

if (saveCustomBtn) {
    saveCustomBtn.addEventListener('click', () => {
        const name = customNameInput.value.trim();
        const inputs = Array.from(customItemsContainer.querySelectorAll('.item-input'));
        const items = inputs.map(i => i.value.trim()).filter(i => i !== '');

        if (!name) {
            alert('Zadejte název kategorie!');
            return;
        }
        if (items.length < 2) {
            alert('Kolo musí mít alespoň 2 vyplněné položky.');
            return;
        }

        const savedCategoriesObj = JSON.parse(localStorage.getItem('wheelCustomCategories')) || {};

        if (editingCategoryName && editingCategoryName !== name) {
            // Delete old category if renamed
            delete questionSets[editingCategoryName];
            delete savedCategoriesObj[editingCategoryName];
            if (currentSetName === editingCategoryName) {
                currentSetName = name;
            }
        }

        // Add and activate new set
        questionSets[name] = items;
        if (currentSetName === name || editingCategoryName) {
            currentSetName = name;
            misfortunes = questionSets[name];
        }

        // Save to local storage
        savedCategoriesObj[name] = items;
        localStorage.setItem('wheelCustomCategories', JSON.stringify(savedCategoriesObj));

        // Update UI
        populateMenu();
        drawWheel();

        // Close and clear
        customModal.classList.add('hidden');
        customNameInput.value = '';
        editingCategoryName = null;

        // Close menu after selection
        toggleMenu(false);
    });
}

// --- INFO modal logic ---
const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeInfoBtn = document.getElementById('closeInfoBtn');
const infoModalList = document.getElementById('infoModalList');
const infoModalTitle = document.getElementById('infoModalTitle');

if (infoBtn) {
    infoBtn.addEventListener('click', () => {
        // Populate data
        infoModalTitle.textContent = currentSetName;

        let listHTML = '<ul>';
        misfortunes.forEach(item => {
            listHTML += `<li>• ${item}</li>`;
        });
        listHTML += '</ul>';

        infoModalList.innerHTML = listHTML;

        // Show
        infoModal.classList.remove('hidden');
    });
}

if (closeInfoBtn) {
    closeInfoBtn.addEventListener('click', () => {
        infoModal.classList.add('hidden');
    });
}

const shareCategoryBtn = document.getElementById('shareCategoryBtn');
if (shareCategoryBtn) {
    shareCategoryBtn.addEventListener('click', () => {
        const dataToShare = { name: currentSetName, items: misfortunes };
        const encoded = btoa(encodeURIComponent(JSON.stringify(dataToShare)));

        const url = new URL(window.location.href);
        // Clear previous sharedCategory params so they don't chain
        url.searchParams.delete('sharedCategory');
        url.searchParams.set('sharedCategory', encoded);
        const link = url.toString();

        // Try to use modern Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
            navigator.clipboard.writeText(link).then(() => {
                const originalText = shareCategoryBtn.textContent;
                shareCategoryBtn.textContent = 'Zkopírováno!';
                setTimeout(() => { shareCategoryBtn.textContent = originalText; }, 2000);
            }).catch(err => {
                prompt('Nepodařilo se zkopírovat odkaz automaticky. Zkopírujte si ho ručně:', link);
            });
        } else {
            // Fallback for older or in-app browsers
            prompt('Zkopírujte si tento odkaz pro sdílení:', link);
        }
    });
}

// --- Process shared category from URL ---
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedEncoded = urlParams.get('sharedCategory');
    if (sharedEncoded) {
        try {
            const decodedStr = decodeURIComponent(atob(sharedEncoded));
            const sharedData = JSON.parse(decodedStr);

            if (sharedData && sharedData.name && Array.isArray(sharedData.items) && sharedData.items.length >= 2) {
                let importName = sharedData.name;
                const defaultSets = ['Základní', 'Odvážné výzvy (Hardcore)', 'Čísla 0-10', 'Čísla 0-20'];
                
                if (defaultSets.includes(importName)) {
                    importName = importName + ' (Kopie)';
                }

                // Add to localStorage
                const savedCategoriesObj = JSON.parse(localStorage.getItem('wheelCustomCategories')) || {};
                savedCategoriesObj[importName] = sharedData.items;
                localStorage.setItem('wheelCustomCategories', JSON.stringify(savedCategoriesObj));

                // Activate in memory
                questionSets[importName] = sharedData.items;
                currentSetName = importName;
                misfortunes = questionSets[importName];

                // Clean URL without reloading page
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('sharedCategory');
                window.history.replaceState({}, document.title, newUrl.toString());

                alert(`Kategorie "${importName}" byla úspěšně importována!`);

                populateMenu();
                drawWheel();
            }
        } catch (e) {
            console.error("Chyba při načítání sdílené kategorie:", e);
            alert("Odkaz na sdílenou kategorii je neplatný nebo poškozený.");
        }
    }
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('ServiceWorker registrace byla úspěšná s rozsahem: ', registration.scope);
      })
      .catch((err) => {
        console.log('ServiceWorker registrace selhala: ', err);
      });
  });
}

// PWA Install Button Logic
let deferredPrompt;
const installPwaBtn = document.getElementById('installPwaBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    if (installPwaBtn) {
        installPwaBtn.style.display = 'block';
    }
});

if (installPwaBtn) {
    installPwaBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            // We've used the prompt, and can't use it again, throw it away
            deferredPrompt = null;
            // Hide the button
            installPwaBtn.style.display = 'none';
        }
    });
}

window.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    if (installPwaBtn) {
        installPwaBtn.style.display = 'none';
    }
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    console.log('PWA was installed');
});
