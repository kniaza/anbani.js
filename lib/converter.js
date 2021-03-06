data = require('./data.js')
utils = require('./utils.js')

var convert = (str, from, to) => {
    dir = {from, to}
    utils.checkForAliases(dir)
    utils.checkForDirection(dir)
    return safeConvert(str, dir.from, dir.to)
}

var interpret = (str, to) => {
    dir = {to}
    utils.checkForAliases(dir)
    if (str != null)
        if (utils.isBicameral(dir.to))
            return convertBicameral(str, utils.detectAlphabet(str[str.length-1]), dir.to);
        else 
            return convertUnicameral(str, utils.detectAlphabet(str[str.length-1]), dir.to);
}

var convertUnicameral = (str, from, to) => {
    let converted = "";
    for (let i = 0, len = str.length; i < len; i++)
    {
        let key = data.alphabets[to][data.alphabets[from].indexOf(str[i])];
        converted += key===undefined?str[i]:key;
    }
    return converted;
}

var convertBicameral = (str, from, to) =>
{
    var rules = {
        "tfileliseuli": {
            upper : "mtavruli",
            lower : "mkhedruli"
        },

        "shanidziseuli": {
            upper : "asomtavruli",
            lower : "mkhedruli"
        },

        "khutsuri": {
            upper : "asomtavruli",
            lower : "nuskhuri"
        }
    }

    let upperScript = rules[to].upper;
    let lowerScript = rules[to].lower;

    let converted = "";
    for (let i = 0, len = str.length; i < len; i++)
    {
        let key = data.alphabets[lowerScript][data.alphabets[from].indexOf(str[i])];
        converted += key===undefined?str[i]:key;
    }
    
    // First Letter
    converted = utils.toUpperCase(converted, lowerScript, upperScript);


    let matched = converted.match(/[?.!]\s+[A-zႠ-ჰⴀ-ⴠ0-9]/g);
    if (matched != null)
    for(let i = 0; i < matched.length; i++)
    {	
        converted = converted.setCharAt(converted.indexOf(matched[i]), matched[i].substr(0,matched[i].length-1).concat(toUpperCase(matched[i][matched[i].length-1], lowerScript, upperScript)));
    }


    matched = converted.match(/[Ⴀ-ჰⴀ-ⴠ]\'/g);
    if (matched != null)
    for(let i = 0; i < matched.length; i++)
    {	
        converted = converted.setCharAt(converted.indexOf(matched[i]), toUpperCase(matched[i][0], lowerScript, upperScript), 1);
    }
    
    return converted;
}

var safeConvert = (str, from, to) => 
{
    if (str != null)
        if (!utils.isBicameral(to))
            return convertUnicameral(str, from, to);
        else
            return convertBicameral(str, from, to);
}


module.exports = {
    convert, interpret, 
}