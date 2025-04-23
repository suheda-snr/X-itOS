import * as Profanity from "@2toad/profanity";

const finnishProfanity = ["vittu", "perkele", "saatana", "jumalauta", "helvetti", "nussi", "perse", "kuora", "paska", "kyrpä"];

const dutchProfanity = [
    "kanker", "kut", "tering", "tyfus", "homo", "gay", "polio", "nachtaap", "neger", 
    "zwarte", "faggot", "nigga", "sukkel", "teringboef", "bledder", "eikel", "klootzak", 
    "ramdebiel", "kankerboef", "loser", "mongool", "debiel", "idioot", "zak", "kneus", 
    "randdebiel", "klaploper", "minkukel", "godver", "godverdomme", "klere", "pokke", 
    "sodemieter", "donder", "pleuris", "pest", "hoer", "slet", "trut", "wijf", "neuker", 
    "flikker", "lul", "pik", "reet", "kontneuker", "kaaskop", "buitenlander", "jodenhater", 
    "k@nk3r", "k4nk3r", "h0er", "h00r", "s|et", "fuk", "fock", "gvd", "tr**", "fl!kker", 
    "l1l", "k*t", "n**k", "z@k"
];

const profanity = new Profanity.Profanity({ language: "en" });

export const checkProfanity = (text: string): boolean => {
    if (profanity.exists(text)) {
        return true;
    }
    const textLower = text.toLowerCase();
    
    // Check against Finnish and Dutch profanity lists
    return finnishProfanity.some((word) => textLower.includes(word)) ||
           dutchProfanity.some((word) => textLower.includes(word));
};