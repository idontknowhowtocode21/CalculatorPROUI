let isTappingMode = false;
let tappingType = null; 
let forceSequence = "";
let seqIdx = 0;

document.addEventListener('DOMContentLoaded', () => { 
    updateUI(); 
});

const keypad = document.getElementById('keypad'); 
const dotBtn = document.getElementById('btn-dot');
const toggleBtn = document.getElementById('btn-toggle');
let pressTimer;

// Activation
dotBtn.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => { calculateToxicGap(); }, 1000);
});

toggleBtn.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => { activateAcaanMode(); }, 1000);
});

[dotBtn, toggleBtn].forEach(b => b.addEventListener('touchend', () => clearTimeout(pressTimer)));

// Tapping Logic
keypad.addEventListener('touchstart', (e) => {
    if (!isTappingMode) return;
    e.preventDefault(); e.stopPropagation();
    
    if (seqIdx < forceSequence.length) {
        let nextChar = forceSequence[seqIdx++].toString();
        
        if (tappingType === 'acaan') {
            // REPLACE screen for Cards
            if (seqIdx === 1) currentInput = nextChar;
            else currentInput = currentInput.toString() + nextChar;
        } else {
            // APPEND screen for Toxic Math
            currentInput = currentInput.toString() + nextChar;
        }
        
        updateUI();
        let remaining = forceSequence.length - seqIdx;
        
        if (remaining > 0) {
            updateIndicator(remaining);
        } else {
            // Instant Vanishing Peak on last tap
            updateIndicator(""); 
            isTappingMode = false; 
        }
    }
}, { passive: false });

function updateIndicator(text) {
    const cue = document.getElementById('tap-cue');
    if (!text) {
        cue.innerText = "";
        cue.style.display = 'none';
    } else {
        cue.innerText = text;
        cue.style.display = 'block';
    }
}

// Panic Reset Function (Triggered by Top Right Icon)
function exitSecretMode() {
    isTappingMode = false;
    tappingType = null;
    seqIdx = 0;
    forceSequence = "";
    if (typeof killCardMode === 'function') killCardMode(); 
    updateIndicator(""); 
    updateUI();
}
