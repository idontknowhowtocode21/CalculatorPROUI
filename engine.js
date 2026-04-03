// engine.js - The Tapping Heart

var isTappingMode = false;
var tappingType = null; // 'toxic' or 'acaan'
var tappingPhase = "normal";
var forceSequence = [];
var seqIdx = 0;

// Helper for Long Press Triggers
function setupLong(id, cb) {
    const el = document.getElementById(id);
    let t;
    const start = (e) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        t = setTimeout(cb, 800); 
    };
    const stop = () => clearTimeout(t);
    
    el.addEventListener('touchstart', start, {passive: false});
    el.addEventListener('touchend', stop);
    el.addEventListener('mousedown', start);
    el.addEventListener('mouseup', stop);
}

// --- TRIGGER 1: TOXIC FORCE (.) ---
setupLong('btn-dot', () => {
    if (!toxicValue || currentInput === "" || cardMode) return;
    let last = currentInput.slice(-1);
    if (!['+', '×'].includes(last)) return;
    
    let target = parseFloat(toxicValue);
    let cur = eval(currentInput.slice(0,-1).replace(/×/g,'*').replace(/÷/g,'/'));
    let req = (last === '+') ? (target - cur).toString() : (target / cur).toFixed(4).replace(/\.?0+$/,"");
    
    forceSequence = req.split("");
    seqIdx = 0;
    isTappingMode = true;
    tappingType = 'toxic';
    tappingPhase = 'forced';
    
    document.getElementById('tap-cue').innerText = forceSequence.length;
    document.getElementById('tap-cue').style.display = "block";
});

// --- TRIGGER 2: CARD MODE (+/-) ---
setupLong('btn-toggle', () => {
    if (isTappingMode) return;
    cardMode = !cardMode;
    document.getElementById('tap-cue').innerText = ".";
    document.getElementById('tap-cue').style.display = cardMode ? "block" : "none";
});

// --- TRIGGER 3: ACAAN START (=) ---
setupLong('btn-equals', () => {
    if (!cardMode || !acaanTarget) return;
    document.getElementById('tap-cue').style.display = "none";
    isTappingMode = true;
    tappingType = 'acaan';
    tappingPhase = "random";
});

// --- GLOBAL TOUCH LISTENER ---
document.getElementById('calc-body').addEventListener('touchstart', (e) => {
    // If we aren't in a secret mode, let the buttons work normally
    if (!isTappingMode) return;

    // If the user touched a button while in Tapping Mode, stop the button from clicking
    // EXCEPT if it's the 'C' button during ACAAN
    if (e.target.tagName === 'BUTTON' && !(tappingType === 'acaan' && e.target.id === 'btn-c')) {
        e.preventDefault();
    }

    if (tappingType === 'acaan' && tappingPhase === "random") {
        // Random Demo: show digits infinitely
        currentInput += Math.floor(Math.random() * 9) + 1;
    } else {
        // Force Mode: Strictly one digit per tap
        if (seqIdx < forceSequence.length) {
            currentInput += forceSequence[seqIdx++];
            document.getElementById('tap-cue').style.display = "none";
        }
        
        // CRITICAL FIX: Unlock the keypad for the '=' button
        if (seqIdx === forceSequence.length) {
            // If it's Toxic, we kill tapping mode IMMEDIATELY so the next touch (=) works
            if (tappingType === 'toxic') {
                isTappingMode = false;
                // Leave tappingType as 'toxic' so runCalculation knows how to clean up
            }
        }
    }
    updateUI();
}, {passive: false});
