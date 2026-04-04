let isTappingMode = false;
let tappingType = null; 
let forceSequence = "";
let seqIdx = 0;

// 1. LIVE START: App initializes instantly
document.addEventListener('DOMContentLoaded', () => { 
    currentInput = "0"; 
    updateUI(); 
});

const keypad = document.getElementById('keypad'); 
const dotBtn = document.getElementById('btn-dot');
const toggleBtn = document.getElementById('btn-toggle');
let pressTimer;

dotBtn.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => { calculateToxicGap(); }, 1000); //
});

toggleBtn.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => { activateAcaanMode(); }, 1000); //
});

[dotBtn, toggleBtn].forEach(b => b.addEventListener('touchend', () => clearTimeout(pressTimer)));

keypad.addEventListener('touchstart', (e) => { //
    if (!isTappingMode) return;
    e.preventDefault(); e.stopPropagation();
    
    if (seqIdx < forceSequence.length) {
        let nextDigit = forceSequence[seqIdx++];
        if (currentInput === "0") currentInput = nextDigit;
        else currentInput += nextDigit;
        
        updateUI();
        updateIndicator(forceSequence.length - seqIdx);

        if (seqIdx === forceSequence.length) {
            setTimeout(() => { exitSecretMode(); }, 1000); //
        }
    }
}, { passive: false });

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
    if (typeof killCardMode === 'function') killCardMode(); //
    document.getElementById('tap-cue').style.display = 'none';
}
