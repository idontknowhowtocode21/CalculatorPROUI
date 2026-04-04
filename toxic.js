let targetGoal = localStorage.getItem("toxic_goal") || "100";
let pCount = 0, pTimer;

function handlePercentLogic() {
    pCount++;
    clearTimeout(pTimer);
    if (pCount === 3) {
        document.getElementById('secret-overlay').style.display = 'flex'; //
        pCount = 0;
    } else {
        pTimer = setTimeout(() => {
            for(let i=0; i<pCount; i++) { appendChar('%'); }
            updateUI(); pCount = 0;
        }, 400);
    }
}

function saveToxicValue() {
    const val = document.getElementById('force-input').value;
    if (val) { targetGoal = val; localStorage.setItem("toxic_goal", val); }
    document.getElementById('secret-overlay').style.display = 'none';
}

function calculateToxicGap() {
    try {
        // Check if an ACAAN position is locked
        if (typeof foundPos !== 'undefined' && foundPos !== "") { 
            forceSequence = foundPos;
            tappingType = 'acaan';
        } else {
            let cleanInput = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
            let lastChar = currentInput.slice(-1);
            let evalInput = (['+','-','*','/'].includes(cleanInput.slice(-1))) ? cleanInput.slice(0,-1) : cleanInput;
            let currentTotal = eval(evalInput) || 0;
            let gap = lastChar === '+' ? parseFloat(targetGoal) - currentTotal : (lastChar === '×' ? parseFloat(targetGoal) / currentTotal : targetGoal);
            forceSequence = Math.abs(gap).toString();
            tappingType = 'toxic';
        }
        isTappingMode = true; seqIdx = 0; updateIndicator(forceSequence.length); //
    } catch (e) { console.error("Math Error"); }
}
