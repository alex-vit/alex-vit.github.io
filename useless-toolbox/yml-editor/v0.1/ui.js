var dictionary = {};
var filesRemaining = 0;

var dropBox = document.getElementById("drop");
var dictTable = document.getElementById("dict-table");

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
        td.dataset.lang = lang;
        td.dataset.key = key;
		if (dictionary[key][lang]) {
			td.innerText = dictionary[key][lang];
		}
        tr.appendChild(td);
    });
}

function render(e) {
    console.log("All done.");
    
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
//            console.log(e.target.result.split("\n")[0]);
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