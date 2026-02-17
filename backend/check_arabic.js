const ArabicReshaper = require('arabic-reshaper');

const text = "محمد";
const reshaped = ArabicReshaper.convertArabic(text);
const reversed = reshaped.split("").reverse().join("");

console.log("Original:", text);
console.log("Reshaped (Raw):", reshaped);
console.log("Reshaped (Char Codes):", reshaped.split('').map(c => c.charCodeAt(0).toString(16)));
console.log("Reversed:", reversed);
