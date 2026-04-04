const STACK = ["4C","2H","7D","3C","4H","6D","AS","5H","9S","2S","QH","3D","QC","8H","6S","5S","9H","KC","2D","JH","3S","8S","6H","10C","5D","KD","2C","3H","8D","5C","KS","JD","8C","10S","KH","JC","7S","10H","AD","4S","7H","4D","AC","9C","JS","QD","7C","QS","10D","6C","AH","9D"];
let acaanActive = false, cardVal = "", foundPos = "";

function activateAcaanMode() {
    acaanActive = true;
    updateIndicator("•");
}

function captureCardData(btn) {
    if (!acaanActive) return false;
    const vals = {'1':'A','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'10','back':'J','%':'Q','C':'K'};
    const suits = {'÷':'S','×':'C','-':'H','+':'D'};

    if (vals[btn]) { cardVal = vals[btn]; return true; }
    
    if (suits[btn] && cardVal) {
        let idx = STACK.indexOf(cardVal + suits[btn]);
        if (idx !== -1) { 
            // LOCK AS STRING: Always 2 digits
            foundPos = (idx + 1).toString().padStart(2, '0'); 
            updateIndicator(foundPos); 
        }
        cardVal = ""; 
        return true; 
    }

    if (btn === '=') { acaanActive = false; return false; }
    return false;
}

function killCardMode() { acaanActive = false; cardVal = ""; foundPos = ""; }
