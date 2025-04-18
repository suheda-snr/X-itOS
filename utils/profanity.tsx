import * as Profanity from "@2toad/profanity";

const finnishProfanity = ["vittu", "perkele", "saatana", "jumalauta", "helvetti", "nussi", "perse", "kuora", "paska", "kyrpä"];

const profanity = new Profanity.Profanity({ language: "en" });

export const checkProfanity = (text: string): boolean => {
    if (profanity.exists(text)) {
        return true;
    }
    const textLower = text.toLowerCase();
    return finnishProfanity.some((word) => textLower.includes(word));
};