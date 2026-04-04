// Global State
let isTappingMode = false;
let tappingType = null; // 'toxic' or 'acaan'
let tappingPhase = "normal"; // 'normal', 'random', 'force'
let forceSequence = "";
let seqIdx = 0;

// ACANN Specific State
let cardMode = false;
let cardData = "";

// --- TOXIC SETUP ---
function saveToxicValue() {
    const val = document.getElementById('force-input').value;
    if (val) {
        forceSequence = val;
        tappingType = 'toxic';
        isTappingMode = true;
        seqIdx = 0;
        document.getElementById('secret-overlay').style.display = 'none';
        updateCue();
    }
}

// --- GESTURE ENGINE ---
const calcBody = document.getElementById('calc-body');

// Long Press to open Setup
let pressTimer;
calcBody.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => {
        document.getElementById('secret-overlay').style.display = 'flex';
    }, 1500);
});

calcBody.addEventListener('touchend', () => clearTimeout(pressTimer));

// --- THE TAPPING LOGIC (The Fix is Here) ---
calcBody.addEventListener('touchstart', (e) => {
    if (!isTappingMode) return;

    // Prevent the actual button under the finger from firing
    e.preventDefault();

    if (tappingType === 'acaan' && tappingPhase === "random") {
        // Random digits for ACAAN
        currentInput += Math.floor(Math.random() * 9) + 1;
    } 
    else if (seqIdx < forceSequence.length) {
        // Force digits (Toxic or ACAAN Force phase)
        currentInput += forceSequence[seqIdx++];
        
        // AUTO-UNLOCK: If we just hit the last digit, turn off the lock
        if (seqIdx === forceSequence.length) {
            isTappingMode = false;
            document.getElementById('tap-cue').style.display = 'none';
        }
    }

    updateUI();
    updateCue();
});

// Visual Cue for the Performer
function updateCue() {
    const cue = document.getElementById('tap-cue');
    if (isTappingMode && forceSequence) {
        cue.innerText = (forceSequence.length - seqIdx);
        cue.style.display = "block";
    } else {
        cue.style.display = "none";
    }
}

// Kill switch for ACANN
function killCardMode() {
    cardMode = false;
    cardData = "";
}
