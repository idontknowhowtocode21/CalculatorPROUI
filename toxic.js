let targetGoal = localStorage.getItem("toxic_goal") || "100";
let pCount = 0, pTimer;

function handlePercentLogic() {
    pCount++;
    clearTimeout(pTimer);
    if (pCount === 3) {
        document.getElementById('secret-overlay').style.display = 'flex';
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
        if (typeof foundPos !== 'undefined' && foundPos !== "") {
            forceSequence = foundPos;
            tappingType = 'acaan';
        } else {
            // Convert visual symbols to math symbols
            let mathString = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
            
            // If the last character is an operator, remove it just to calculate current total
            let evalString = (['+','-','*','/'].includes(mathString.slice(-1))) ? mathString.slice(0,-1) : mathString;
            let currentTotal = eval(evalString) || 0;
            
            // Math: Target - Current = The Number they need to tap
            let gap = parseFloat(targetGoal) - currentTotal;
            
            // Use absolute value and convert to string for the tapping sequence
            forceSequence = Math.abs(gap).toString();
            tappingType = 'toxic';
        }
        isTappingMode = true; 
        seqIdx = 0; 
        updateIndicator(forceSequence.length);
    } catch (e) { 
        console.error("Toxic Error", e); 
        exitSecretMode();
    }
}
