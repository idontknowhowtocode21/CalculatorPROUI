let targetGoal = localStorage.getItem("toxic_goal") || "100";
let pCount = 0;
let pTimer;

function handlePercentLogic() {
    pCount++;
    clearTimeout(pTimer);
    
    if (pCount === 3) {
        document.getElementById('secret-overlay').style.display = 'flex';
        pCount = 0;
        // Logic: We simply return here so the 3rd '%' is never added to the screen.
        return; 
    } 

    pTimer = setTimeout(() => {
        // Only if we haven't hit 3 taps within 500ms, we add the '%' symbols.
        // For a more natural feel, we only add them if the user stopped at 1 or 2 taps.
        for(let i=0; i < pCount; i++) {
            appendChar('%');
        }
        updateUI();
        pCount = 0;
    }, 500);
}


function saveToxicValue() {
    const val = document.getElementById('force-input').value;
    if (val) {
        targetGoal = val;
        localStorage.setItem("toxic_goal", val);
    }
    document.getElementById('secret-overlay').style.display = 'none';
}

function calculateToxicGap() {
    try {
        // Evaluate current screen to get total
        let cleanInput = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        let lastChar = currentInput.slice(-1);
        
        // If screen ends in an operator, evaluate the prefix
        let evalInput = (['+','-','*','/'].includes(cleanInput.slice(-1))) ? cleanInput.slice(0,-1) : cleanInput;
        let currentTotal = eval(evalInput) || 0;
        
        let gap = 0;
        if (lastChar === '+') {
            gap = parseFloat(targetGoal) - currentTotal;
        } else if (lastChar === '×') {
            gap = parseFloat(targetGoal) / currentTotal;
        } else {
            gap = targetGoal; // Default if no operator
        }

        forceSequence = Math.abs(gap).toString();
        isTappingMode = true;
        tappingType = 'toxic';
        seqIdx = 0;
        updateIndicator(forceSequence.length);
    } catch (e) {
        console.error("Math Error");
    }
}
