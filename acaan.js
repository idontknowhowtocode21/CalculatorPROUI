// Tamariz Mnemonica Stack
const STACK = [
    "4C","2H","7D","3C","4H","6D","AS","5H","9S","2S","QH","3D","QC",
    "8H","6S","5S","9H","KC","2D","JH","3S","8S","6H","10C","5D","KD",
    "2C","3H","8D","5C","KS","JD","8C","10S","KH","JC","7S","10H","AD",
    "4S","7H","4D","AC","9C","JS","QD","7C","QS","10D","6C","AH","9D"
];

let acaanActive = false;
let cardVal = "";
let foundPos = "";

function activateAcaanMode() {
    acaanActive = true;
    updateIndicator("•"); // Subtle ready dot
}

function captureCardData(btn) {
    if (!acaanActive) return false;

    // Secret Value Mapping
    const vals = {
        '1':'A','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'10',
        'back':'J','%':'Q','C':'K'
    };
    // Secret Suit Mapping
    const suits = {'÷':'S','×':'C','-':'H','+':'D'};

    // 1. Capture Value
    if (vals[btn]) {
        cardVal = vals[btn];
        return true; // Swallow tap
    }

    // 2. Capture Suit & Lookup
    if (suits[btn] && cardVal) {
        let cardKey = cardVal + suits[btn];
        let idx = STACK.indexOf(cardKey);
        if (idx !== -1) {
            foundPos = (idx + 1).toString();
            updateIndicator(foundPos); // Show position to performer
        }
        cardVal = "";
        return true; // Swallow tap
    }

    // 3. The "Hand-off" Trigger (Tap C to begin Force)
    if (btn === 'C' && foundPos !== "") {
        forceSequence = foundPos;
        isTappingMode = true;
        tappingType = 'acaan';
        seqIdx = 0;
        acaanActive = false;
        return true; // Swallow tap
    }

    return false;
}

function killCardMode() {
    acaanActive = false;
    cardVal = "";
    foundPos = "";
}
