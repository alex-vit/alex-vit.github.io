var CSV_SEP = ";";
var YML_SEP = ': "';
var LANGS = ['en', 'lv', 'ru', 'et', 'lt'];

/* Utility functions */

function fileType(filename) {
    var tokens = filename.split('.');
    var len = tokens.length;
    
    return tokens[len - 1].toLowerCase();
}

function fileTypeSupported(fileType) {
    if (SUPPORTED_FILE_TYPES.indexOf(fileType) >= 0) {
        return true;
    } else {
        return false;
    }
}

function sameFileTypes(filenameList) {
    var fileTypeList = filenameList.map(function(name) {return fileType(name);});
    
    for (var i = 1; i < fileTypeList.length; i++) {
        if (fileTypeList[i] != fileTypeList[0]) {
            return false;
        }
    }
    
    return true;
}

function supportedLanguage(lang) {
    return (LANGS.indexOf(lang) >= 0);
}

/* Parsing functions */

function parse(dict, type, text) {
    if (type == 'yml') {
        return parseYML(dict, text);
    } else {
        return parseCSV(dict, text);
    }
}

function parseYML(dict, text) {
    var lines = text.split("\n");
    var lang = lines[0][0] + lines[0][1];
    
    if (!supportedLanguage(lang)) {
        console.log("Unsupported language: " + lang);
        return dict;
    }
    
    for (var i = 1; i < lines.length - 1; i++) {
        var line = lines[i].trim();
		
		if (!line) {continue;}
		
        var tokens = line.split(YML_SEP);
        var key = tokens[0];
        var value = tokens[1].substring(0, tokens[1].length - 1);
        
        if (dict[key] === undefined) {
            dict[key] = {};
        }
        
        dict[key][lang] = unescape(value);
    }
    
    return dict;
}

function parseCSV(dict, text) {
    var lines = text.split("\n");
    var tokens = lines[0].split(CSV_SEP);
    var langs = tokens.slice(1, tokens.length - 1);

    for (var i = 1; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) {continue;}
        
        var tokens = line.split(CSV_SEP);
        var key = tokens[0];
        var values = tokens.slice(1, tokens.length - 1);
        
        dict[key] = {};
        for (var j = 0; j < langs.length; j++) {
            var lang = langs[j];
            var value = values[j];
            dict[key][lang] = unescape(value);
        }
    }
    
    return dict;
}

/* Writing */

function dictToText(dict, type) {
    if (type == 'csv') {
        return dictToCSV(dict);
    } else {
        return dictToYMLs(dict);
    }
}

function dictToCSV(dict) {
    var text = ' ' + CSV_SEP;
    
    LANGS.forEach(function(lang){
        text += lang + CSV_SEP;
    });
    text += '\n';
    
    for (key in dict) {
        if (dict.hasOwnProperty(key)) {
            text += key + CSV_SEP;
            LANGS.forEach(function(lang){
                if (dict[key][lang] === undefined) {
                    dict[key][lang] = '';
                }
                text += dict[key][lang] + CSV_SEP;
            });
            text += '\n';
        }
    }
    
    return text;
}

function dictToYMLs(dict) {
    var ymls = {};
    
    LANGS.forEach(function(lang){
        ymls[lang] = lang + ":\n";
    });
    
    for (key in dict) {
		if (dict.hasOwnProperty(key)) {
            LANGS.forEach(function(lang){
                if (dict[key][lang]) {
                    ymls[lang] += "  " + key + ': "' + escape(dict[key][lang]) + '"\n'
                }
            });
        }
    }
    
    return ymls;
}

/* String manipulation */
function escape(str) {
    return str.replace(/"/g, "\\\"");
}
function unescape(str) {
    return str.replace(/\\"/g, "\"");
}

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
