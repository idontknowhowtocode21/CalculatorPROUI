let isTappingMode = false;
let tappingType = null; 
let forceSequence = "";
let seqIdx = 0;

const body = document.getElementById('calc-body');
const dotBtn = document.getElementById('btn-dot');
const toggleBtn = document.getElementById('btn-toggle');
let pressTimer;

dotBtn.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => { calculateToxicGap(); }, 1000);
});

toggleBtn.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => { activateAcaanMode(); }, 1000);
});

[dotBtn, toggleBtn].forEach(b => b.addEventListener('touchend', () => clearTimeout(pressTimer)));

body.addEventListener('touchstart', (e) => {
    if (!isTappingMode) return;
    
    if (e.target.tagName === 'BUTTON' || e.target.id === 'calc-body') {
        e.preventDefault();
        
        if (seqIdx < forceSequence.length) {
            let nextDigit = forceSequence[seqIdx++];
            if (currentInput === "0") currentInput = nextDigit;
            else currentInput += nextDigit;
            
            updateUI();
            updateIndicator(forceSequence.length - seqIdx);

            // Added the 1-second delay after the final tap
            if (seqIdx === forceSequence.length) {
                setTimeout(() => { exitSecretMode(); }, 1000);
            }
        }
    }
});

function updateIndicator(text) {
    const cue = document.getElementById('tap-cue');
    cue.innerText = text;
    cue.style.display = 'block';
}

function exitSecretMode() {
    isTappingMode = false;
    tappingType = null;
    seqIdx = 0;
    forceSequence = "";
    if (typeof killCardMode === 'function') killCardMode();
    document.getElementById('tap-cue').style.display = 'none';
}
