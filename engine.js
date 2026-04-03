let isTappingMode = false;
let tappingType = null; // 'toxic' or 'acaan'
let tappingPhase = "normal";
let forceSequence = [];
let seqIdx = 0;

// HELPERS
function setupLong(id, cb) {
    const el = document.getElementById(id);
    let t;
    const start = (e) => { e.preventDefault(); t = setTimeout(cb, 800); };
    const stop = () => clearTimeout(t);
    el.addEventListener('touchstart', start, {passive: false});
    el.addEventListener('touchend', stop);
    el.addEventListener('mousedown', start);
    el.addEventListener('mouseup', stop);
}

// TRIGGERS
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

setupLong('btn-toggle', () => {
    if (isTappingMode) return;
    cardMode = !cardMode;
    document.getElementById('tap-cue').innerText = ".";
    document.getElementById('tap-cue').style.display = cardMode ? "block" : "none";
});

setupLong('btn-equals', () => {
    if (!cardMode || !acaanTarget) return;
    document.getElementById('tap-cue').style.display = "none";
    isTappingMode = true;
    tappingType = 'acaan';
    tappingPhase = "random";
});

// GLOBAL TAP HANDLER
document.getElementById('calc-body').addEventListener('touchstart', (e) => {
    if (!isTappingMode) return;
    e.preventDefault();

    if (tappingType === 'acaan' && tappingPhase === "random") {
        currentInput += Math.floor(Math.random() * 9) + 1;
    } else {
        if (seqIdx < forceSequence.length) {
            currentInput += forceSequence[seqIdx++];
            document.getElementById('tap-cue').style.display = "none";
        }
        // AUTO-EXIT FOR TOXIC ONLY
        if (tappingType === 'toxic' && seqIdx === forceSequence.length) {
            isTappingMode = false;
        }
    }
    updateUI();
}, {passive: false});
