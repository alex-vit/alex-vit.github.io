﻿var LANGUAGES = ['en', 'et', 'lt', 'lv', 'ru'];
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
        
        dictionary[key][lang] = unescape(value);
    }
    
    return dictionary;
}

/*	b64EncodeUnicode
	from https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
*/
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function dictToText(dict, lang) {
	var text = lang + ":\n";
	for (var key in dict) {
		if (dict.hasOwnProperty(key)) {
			if (!dict[key][lang]) {continue;}
			text += '  ' + key + ': "' + escape(dict[key][lang]) + '"\n';
		}
	}
	return text;
}

function escape(str) {
    return str.replace(/"/g, "\\\"");
}
function unescape(str) {
    return str.replace(/\\"/g, "\"");
}