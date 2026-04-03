// Your Specific Mnemonica Stack (1-52)
const STACK = ["4C","2H","7D","3C","4H","6D","AS","5H","9S","2S","QH","3D","QC","8H","6S","5S","9H","KC","2D","JH","3S","8S","6H","10C","5D","KD","2C","3H","8D","5C","KS","JD","8C","10S","KH","JC","7S","10H","AD","4S","7H","4D","AC","9C","JS","QD","7C","QS","10D","6C","AH","9D"];

let cardMode = false;
let acaanTarget = null;
let cardValTemp = "";

function captureCardData(btn) {
    const vals = {'1':'A','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'10','back':'J','%':'Q','C':'K'};
    const suits = {'÷':'S','×':'C','-':'H','+':'D'};

    if (vals[btn]) cardValTemp = vals[btn];
    else if (suits[btn] && cardValTemp) {
        acaanTarget = STACK.indexOf(cardValTemp + suits[btn]) + 1;
        document.getElementById('tap-cue').innerText = acaanTarget;
        cardValTemp = "";
    }
}

function runAcaanStageManager() {
    if (tappingPhase === "random") {
        currentInput = ""; 
        let targetStr = acaanTarget.toString().padStart(2, '0');
        forceSequence = targetStr.split("");
        seqIdx = 0;
        tappingPhase = "forced";
    } else if (tappingPhase === "forced") {
        currentInput = "";
        killCardMode();
    }
}

function killCardMode() {
    cardMode = false;
    isTappingMode = false;
    tappingType = null;
    tappingPhase = "normal";
    acaanTarget = null;
    document.getElementById('tap-cue').style.display = "none";
}
