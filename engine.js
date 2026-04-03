// engine.js - The Tapping Heart

var isTappingMode = false;
var tappingType = null; 
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
// This is the part that was likely blocking your '=' button
document.getElementById('calc-body').addEventListener('touchstart', (e) => {
    // 1. If we aren't tapping, do nothing and let buttons work
    if (!isTappingMode) return;

    // 2. Block the actual button press while we are tapping
    // EXCEPT for the 'C' button during ACAAN mode
    if (e.target.tagName === 'BUTTON' && !(tappingType === 'acaan' && e.target.id === 'btn-c')) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (tappingType === 'acaan' && tappingPhase === "random") {
        currentInput += Math.floor(Math.random() * 9) + 1;
    } else {
        if (seqIdx < forceSequence.length) {
            currentInput += forceSequence[seqIdx++];
            document.getElementById('tap-cue').style.display = "none";
        }
        
        // --- THE FIX ---
        // If it's Toxic Mode and we just finished the last digit, 
        // we kill isTappingMode IMMEDIATELY so the next touch (=) works.
        if (seqIdx === forceSequence.length && tappingType === 'toxic') {
            isTappingMode = false;
        }
    }
    updateUI();
}, {passive: false});
