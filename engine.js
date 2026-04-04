let isTappingMode = false;
let tappingType = null; 
let forceSequence = "";
let seqIdx = 0;

const keypad = document.getElementById('keypad'); // Targeted the keypad grid
const dotBtn = document.getElementById('btn-dot');
const toggleBtn = document.getElementById('btn-toggle');
let pressTimer;

// Long Press Dot -> Toxic Force
dotBtn.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => { calculateToxicGap(); }, 1000);
});

// Long Press Toggle -> ACAAN Mode
toggleBtn.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => { activateAcaanMode(); }, 1000);
});

[dotBtn, toggleBtn].forEach(b => b.addEventListener('touchend', () => clearTimeout(pressTimer)));

// EXPANDED TAPPING ENGINE
// This now listens to the entire keypad area, including gaps
keypad.addEventListener('touchstart', (e) => {
    if (!isTappingMode) return;
    
    // Prevent the actual calculator buttons from firing
    e.preventDefault();
    e.stopPropagation();
    
    if (seqIdx < forceSequence.length) {
        let nextDigit = forceSequence[seqIdx++];
        
        // Handle leading zeros or empty screens
        if (currentInput === "0" || currentInput === "") currentInput = nextDigit;
        else currentInput += nextDigit;
        
        updateUI();
        updateIndicator(forceSequence.length - seqIdx);

        // 1-second "Lock" delay after the final tap
        if (seqIdx === forceSequence.length) {
            setTimeout(() => { exitSecretMode(); }, 1000);
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
    if (typeof killCardMode === 'function') killCardMode();
    document.getElementById('tap-cue').style.display = 'none';
}
