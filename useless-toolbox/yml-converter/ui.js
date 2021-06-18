var dictionary = {};
var filesRemaining = 0;
var type = '';

var dropBox = document.getElementById("drop");

function error(message) {
    alert(message);
}

function fileParsed() {
    filesRemaining--;
    if (filesRemaining == 0) {
        document.dispatchEvent(new Event("allFilesParsed"));
    }
}

function convert() {
    var files = [];
    
    if (type == 'yml') {
        var text = dictToCSV(dictionary);
        var filename = 'lang.csv';
        files.push({
            'filename': filename,
            'text': text
        });
    } else {
        //alert('create all YAMLs');
        var yamls = dictToYMLs(dictionary);
        LANGS.forEach(function(lang){
            var filename = lang + '.yml';
            var text = yamls[lang];
            files.push({
                'filename': filename,
                'text': text
            });
        });
    }
    
    files.map(triggerDownload);
}

function triggerDownload(file) {
    var a = document.createElement('a');
    a.download = file.filename;
    a.href = "data:application/octet-stream;base64,"
    + b64EncodeUnicode(file.text);
    a.dispatchEvent(new Event("click"));
}

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
    
    var files = e.dataTransfer.files;
    type = fileType(files[0].name);
    
    if ((files.length == 0)
        || (files.length == 1 && type != 'csv')
        || (files.length > 1 && (type != 'yml' || !sameFileTypes(Array.prototype.map.call(files, function(file){return fileType(file.name)}))))) {
            error("Expected 1 .csv or any number of .yml files.");
            return;
    }

    filesRemaining = files.length;
    Array.prototype.forEach.call(files, function(file){
        var reader = new FileReader();
        reader.onloadend = function(e){
            dictionary = parse(dictionary, type, e.target.result);
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

document.addEventListener("allFilesParsed", convert);
