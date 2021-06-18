var dictionary = {};
var filesRemaining = 0;
var curInputText = {};
var edited = {};
LANGUAGES.forEach(function(lang){
	edited[lang] = false;
});

var dropBox = document.getElementById("drop");
var dictTable = document.getElementById("dict-table");
var saveButton = document.getElementById("save");

function fileParsed() {
    filesRemaining--;
    if (filesRemaining == 0) {
        document.dispatchEvent(new Event("allFilesParsed"));
    }
}

function renderRowForKey(key) {
    var tr = document.createElement('tr');
    dictTable.appendChild(tr);
    
    var th = document.createElement('th');
	th.innerText = key;
    tr.appendChild(th);
    
    LANGUAGES.forEach(function(lang){
        var td = document.createElement('td');
		var input = document.createElement('div');
        input.dataset.lang = lang;
        input.dataset.key = key;
		input.contentEditable = true;
		input.onfocus = inputFocus;
		input.onkeyup = inputChange;
		input.onpaste = inputPaste;
		if (dictionary[key][lang]) {
			input.innerText = dictionary[key][lang];
		}
		td.appendChild(input);
        tr.appendChild(td);
    });
}

function render(e) {
    var tr = document.createElement('tr');
    dictTable.appendChild(tr);
    var th = document.createElement('th');
    tr.appendChild(th);
    
    LANGUAGES.forEach(function(lang){
        var th = document.createElement('th');
        th.innerText = lang;
        tr.appendChild(th);
    });
    
    for (var key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            renderRowForKey(key);
        }
    }
}

function getID(el) {
	var key = el.dataset.key,
		lang = el.dataset.lang;
	return [key + "__" + lang, key, lang];
}

function inputFocus(e) {
	var id = getID(e.target)[0];
	if (curInputText[id] === undefined) {
		curInputText[id] = e.target.innerText;
	}
}

function inputChange(e) {
	var id = getID(e.target);
	var text = e.target.innerText;
	
	dictionary[id[1]][id[2]] = text;
	
	if (text !== curInputText[id[0]]) {
		e.target.classList.add('edited');
		edited[id[2]] = true;
	} else {
		e.target.classList.remove('edited');
		edited[id[2]] = false;
	}
	console.log(edited[id[2]]);
}

function inputPaste(e) {
	setTimeout(function(){
		removeCode(e.target);
		inputChange(e);
	}, 1);
}

function removeCode(el) {
	el.innerHTML = el.innerText;
}

document.addEventListener("allFilesParsed", render);

dropBox.ondragenter = function(e){
    dropBox.style.color = "lime";
    dropBox.style.borderColor = "lime";
};

dropBox.ondragleave = function(e){
    dropBox.style.color = "silver";
    dropBox.style.borderColor = "silver";
};

dropBox.ondrop = function(e){
    e.preventDefault();
    
    dropBox.ondragleave(e);
    
    dictTable.innerHTML = "";
    
    var files = e.dataTransfer.files;
    filesRemaining = files.length;
    Array.prototype.forEach.call(files, function(file){
        var reader = new FileReader();
        reader.onloadend = function(e){
            dictionary = parseAndInsert(dictionary, e.target.result);
            fileParsed();
        };
        reader.readAsText(file);
    });
    
    
    return false;
};

dropBox.ondragover = function(e){
    e.preventDefault();
    return false;
};

saveButton.onclick = function(e){
	for (var k in edited) {
		if (edited.hasOwnProperty(k) && edited[k]) {
			var filename = k + ".yml";
			var a = document.createElement('a');
			a.download = filename;
			a.href = "data:application/octet-stream;base64,"
			+ b64EncodeUnicode(dictToText(dictionary, k));
			a.dispatchEvent(new Event("click"));
		}
	}
};