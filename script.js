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
    "Čísla 0-10": Array.from({length: 11}, (_, i) => i.toString()),
    "Čísla 0-20": Array.from({length: 21}, (_, i) => i.toString())
};

// Načtení vlastních kategorií z lokální paměti
const savedCategories = JSON.parse(localStorage.getItem('wheelCustomCategories')) || {};
Object.assign(questionSets, savedCategories);

let currentSetName = "Základní";
let misfortunes = questionSets[currentSetName];

// Ostré barvy - motivy
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

let currentTheme = 'default';
let colors = themeColors[currentTheme];

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

function drawWheel() {
    // Zvýšené rozlišení (baseSize) pro větší kvalitu na desktopech
    const baseSize = 800;
    const scale = window.devicePixelRatio || 1;
    
    canvas.width = baseSize * scale;
    canvas.height = baseSize * scale;
    
    ctx.scale(scale, scale);

    const numSegments = misfortunes.length;
    const arc = (Math.PI * 2) / numSegments;
    const centerX = baseSize / 2;
    const centerY = baseSize / 2;
    const radius = centerX - 15; // malý okraj

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
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.stroke();

        // Nakreslení textu
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "center"; // Změna na středové zarovnání
        ctx.textBaseline = "middle";
        
        const segmentColor = colors[i % colors.length];
        const textColor = getContrastColor(segmentColor);
        ctx.fillStyle = textColor;
        
        // Dynamická velikost písma - přepočteno na nové rozlišení 800px
        const fontSize = numSegments > 10 ? 22 : 28;
        ctx.font = `bold ${fontSize}px 'Outfit', sans-serif`;
        ctx.shadowColor = textColor === '#FFFFFF' ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.7)";
        ctx.shadowBlur = textColor === '#FFFFFF' ? 8 : 4;
        
        const text = misfortunes[i];
        const maxWidth = radius - 110; // Volný prostor pro text směrem do středu
        const words = text.split(' ');
        let line = '';
        let lines = [];
        
        // Zalamování textu na více řádků
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
        
        // Spočítáme skutečnou maximální šířku řádku v tomto bloku, 
        // aby blok textu mohl být jako celek nalepený na vnějším okraji
        let actualMaxWidth = 0;
        for (let j = 0; j < lines.length; j++) {
            const w = ctx.measureText(lines[j].trim()).width;
            if (w > actualMaxWidth) actualMaxWidth = w;
        }

        // Vykreslení řádků (vertikálně i horizontálně vycentrované kousek od okraje)
        const lineHeight = fontSize + 6;
        const totalHeight = lines.length * lineHeight;
        const startY = -(totalHeight / 2) + (lineHeight / 2);
        
        // Cílový pravý okraj bloku je radius - 45. Střed textu bude tedy posunut o polovinu jeho šířky doleva.
        const textCenterX = radius - 45 - (actualMaxWidth / 2);
        
        for(let j = 0; j < lines.length; j++) {
            ctx.fillText(lines[j].trim(), textCenterX, startY + (j * lineHeight));
        }
        
        ctx.restore();
    }
    
    // Vnitřní kruh (střed kola)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = currentTheme === 'folklore' ? '#FFFFFF' : (currentTheme === 'circus' ? '#FFFFFF' : '#1a1a2e');
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = currentTheme === 'folklore' ? '#d32f2f' : (currentTheme === 'circus' ? '#ff0055' : '#FF3366');
    ctx.stroke();
    
    // Malý ozdobný středový bod
    ctx.beginPath();
    ctx.arc(centerX, centerY, 13, 0, Math.PI * 2);
    ctx.fillStyle = currentTheme === 'folklore' ? '#1565C0' : (currentTheme === 'circus' ? '#0099FF' : '#FF3366');
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

    // Náhodná doba točení (4.5 až 8.5 vteřin)
    const spinDurationS = 4.5 + (Math.random() * 4);
    const spinDurationMs = Math.round(spinDurationS * 1000);

    // Počet otáček navázaný zhruba na dobu trvání (aspoň 4)
    const extraSpins = Math.floor(spinDurationS) + 1;
    const randomAngle = Math.floor(Math.random() * 360);
    
    const targetRotation = currentRotation + (extraSpins * 360) + randomAngle;
    
    // Spočítat, kolik dílků kolo celkem mine, a nastavit adekvátní počet "tiků"
    const rotationDiff = targetRotation - currentRotation;
    const segmentsPassed = Math.floor(rotationDiff / (360 / misfortunes.length));
    simulateWheelTicks(spinDurationMs, segmentsPassed);

    // CSS Animace s HW akcelerací
    canvas.style.transition = `transform ${spinDurationS}s cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
    canvas.style.transform = `rotate(${targetRotation}deg) translateZ(0)`;

    // Naslouchat přesně na moment, kdy CSS animace opravdu skončí
    canvas.addEventListener('transitionend', function onSpinEnd() {
        // Okamžitě odstraníme posluchač, aby se nevolal víckrát
        canvas.removeEventListener('transitionend', onSpinEnd);
        
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
    });
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
            
            // Zavřít menu po výběru vždy
            toggleMenu(false);
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

// --- Logika pro výběr vzhledu (Themes) ---
const themeList = document.getElementById('themeList');
if (themeList) {
    const themeItems = themeList.querySelectorAll('li');
    themeItems.forEach(li => {
        li.tabIndex = 0;
        
        const selectTheme = () => {
            if (isSpinning) return;
            currentTheme = li.getAttribute('data-theme');
            colors = themeColors[currentTheme];
            
            // Změna třídy na body
            document.body.className = currentTheme === 'default' ? '' : `theme-${currentTheme}`;
            
            // Obarvení aktivní položky v menu
            themeItems.forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            
            // Překreslení kola
            drawWheel();
            
            // Zavřít menu po výběru
            toggleMenu(false);
        };
        
        li.addEventListener('click', selectTheme);
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') selectTheme();
        });
    });
}

// --- Logika pro vlastní kategorii ---
const customModal = document.getElementById('customModal');
const createCustomBtn = document.getElementById('createCustomBtn');
const saveCustomBtn = document.getElementById('saveCustomBtn');
const cancelCustomBtn = document.getElementById('cancelCustomBtn');
const customNameInput = document.getElementById('customName');
const customItemsContainer = document.getElementById('customItemsContainer');

function createCustomRow(placeholderIndex) {
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

function addCustomRow() {
    const count = customItemsContainer.children.length + 1;
    const { row, input } = createCustomRow(count);
    customItemsContainer.appendChild(row);
    input.focus();
    customItemsContainer.scrollTop = customItemsContainer.scrollHeight;
}

if (createCustomBtn) {
    createCustomBtn.addEventListener('click', () => {
        customItemsContainer.innerHTML = ''; // Vyčištění
        addCustomRow(); // Přidá první řádek
        customModal.classList.remove('hidden');
        customNameInput.focus();
        
        // Zavřít menu po kliknutí
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
        
        // Přidání a aktivování nové sady
        questionSets[name] = items;
        currentSetName = name;
        misfortunes = questionSets[name];
        
        // Uložení do lokální paměti (localStorage)
        const savedCategoriesObj = JSON.parse(localStorage.getItem('wheelCustomCategories')) || {};
        savedCategoriesObj[name] = items;
        localStorage.setItem('wheelCustomCategories', JSON.stringify(savedCategoriesObj));
        
        // Aktualizace UI
        populateMenu();
        drawWheel();
        
        // Zavření a vyčištění
        customModal.classList.add('hidden');
        customNameInput.value = '';
        
        // Zavřít menu po výběru
        toggleMenu(false);
    });
}

// --- Logika pro INFO modal ---
const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeInfoBtn = document.getElementById('closeInfoBtn');
const infoModalList = document.getElementById('infoModalList');
const infoModalTitle = document.getElementById('infoModalTitle');

if (infoBtn) {
    infoBtn.addEventListener('click', () => {
        // Naplnit data
        infoModalTitle.textContent = currentSetName;
        
        let listHTML = '<ul>';
        misfortunes.forEach(item => {
            listHTML += `<li>• ${item}</li>`;
        });
        listHTML += '</ul>';
        
        infoModalList.innerHTML = listHTML;
        
        // Zobrazit
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
        // Vyčistit předchozí případné sharedCategory parametry, aby se neřetězily
        url.searchParams.delete('sharedCategory');
        url.searchParams.set('sharedCategory', encoded);
        const link = url.toString();
        
        // Zkusíme použít moderní Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(link).then(() => {
                const originalText = shareCategoryBtn.textContent;
                shareCategoryBtn.textContent = 'Zkopírováno!';
                setTimeout(() => { shareCategoryBtn.textContent = originalText; }, 2000);
            }).catch(err => {
                prompt('Nepodařilo se zkopírovat odkaz automaticky. Zkopírujte si ho ručně:', link);
            });
        } else {
            // Fallback pro starší prohlížeče nebo in-app prohlížeče
            prompt('Zkopírujte si tento odkaz pro sdílení:', link);
        }
    });
}

// --- Zpracování sdílené kategorie z URL ---
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedEncoded = urlParams.get('sharedCategory');
    if (sharedEncoded) {
        try {
            const decodedStr = decodeURIComponent(atob(sharedEncoded));
            const sharedData = JSON.parse(decodedStr);
            
            if (sharedData && sharedData.name && Array.isArray(sharedData.items) && sharedData.items.length >= 2) {
                // Přidáme do localStorage
                const savedCategoriesObj = JSON.parse(localStorage.getItem('wheelCustomCategories')) || {};
                savedCategoriesObj[sharedData.name] = sharedData.items;
                localStorage.setItem('wheelCustomCategories', JSON.stringify(savedCategoriesObj));
                
                // Aktivovat do paměti
                questionSets[sharedData.name] = sharedData.items;
                currentSetName = sharedData.name;
                misfortunes = questionSets[sharedData.name];
                
                // Přečistit URL bez znovunačtení stránky
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('sharedCategory');
                window.history.replaceState({}, document.title, newUrl.toString());
                
                alert(`Kategorie "${sharedData.name}" byla úspěšně importována!`);
                
                populateMenu();
                drawWheel();
            }
        } catch(e) {
            console.error("Chyba při načítání sdílené kategorie:", e);
            alert("Odkaz na sdílenou kategorii je neplatný nebo poškozený.");
        }
    }
});
