place = "generatedtext";

dictionaryList = [
	"buy",
	"sell",
	"signals",
	"prevail",
	"scale",
	"in_all_views",
	"all_views",
	"one_hour",
	"four_hour",
	"daily"
	];

function createLinks () {
	linkCode = "";
	for (i=0; i<dictionaryList.length; i++) {
		linkCode += "<a href=\"#\" onclick=\"printRandomTerm(" + dictionaryList[i] + ");\">" + dictionaryList[i] + "</a>";
	}
	return linkCode;
}

function replaceTerm(obj, term) {
	obj.innerHTML = randomTerm(term);
}

function printRandomTerm(term/*, place*/){
	document.getElementById(place).innerHTML += "<a href=\"#\" onclick=\"replaceTerm(this, " + term[0] + ");\">" + randomTerm(term) +"</a> ";
}

function randomTerm(term/*, place*/){
	return term[Math.floor(Math.random()*term.length)]; 
}