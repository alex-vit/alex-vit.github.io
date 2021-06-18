var LANGUAGES = ['en', 'et', 'lt', 'lv', 'ru'];
var SEPARATOR = ': "';

function supportedLanguage(lang) {
    if (LANGUAGES.indexOf(lang) < 0) {
        return false;
    } else {
        return true;
    }
}

function parseAndInsert(dictionary, text) {
    var lines = text.split("\n");
    var lang = lines[0][0] + lines[0][1];
    
    if (!supportedLanguage(lang)) {
        console.log("Unsupported language: " + lang);
        return dictionary;
    }
    
    for (var i = 1; i < lines.length - 1; i++) {
        var line = lines[i].trim();
		
		if (!line) {continue;}
		
        var tokens = line.split(SEPARATOR);
        var key = tokens[0];
        var value = tokens[1].substring(0, tokens[1].length - 1);
        
        if (dictionary[key] === undefined) {
            dictionary[key] = {};
        }
        
        dictionary[key][lang] = value;
    }
    
    return dictionary;
}
