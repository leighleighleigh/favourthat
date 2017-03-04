var quotes = [];
var storedQuotes = [];

var sorted = 0;
var maxSorted = 0;

var sortedList = [];
var unsortedList = [];


var indexA = 0;
var indexB = 0;


function hide(obj) {
    var el = document.getElementById(obj);
    el.style.display = 'none';
}

function show(obj) {
    var el = document.getElementById(obj);
    el.style.display = 'inherit';
}

function isNullOrWhitespace(input) {
    if (typeof input === 'undefined' || input == null) return true;
    return input.replace(/\s/g, '').length < 1;
}

function returnToEditQuote(qText) {
    document.getElementById("textarea1").value = qText.replace(/(<([^>]+)>)/ig, "");
    document.getElementById("textarea1").scrollIntoView(false);
    document.getElementById("textarea1").focus();
}


function getCombination()
{
    maxSorted = ((sortedList.length * sortedList.length) - sortedList.length) / 2;

    if(sorted < maxSorted){

    document.getElementById("sortCounter").textContent = sorted.toString() + "/" + maxSorted.toString();

    //Make sure we arent comparing two of the same
    if(indexA == indexB){
        if(indexB + 1 < quotes.length){
            indexB ++;
        }else{
            indexB = 0;
        }
    }


    //Reference items by name because the array index is used for sorting
    var itemA = "";
    var itemB = "";

    itemA = quotes[indexA];
    itemB = quotes[indexB];


    //First button sets itemA as preferred over itemB, and vice versa.
    document.getElementById("sortItem1").textContent = quotes[indexA];
    document.getElementById("sortItem1").onclick = function(){ sortCombination(itemA,itemB); };

    document.getElementById("sortItem2").textContent = quotes[indexB];
    document.getElementById("sortItem2").onclick = function(){ sortCombination(itemB,itemA); };


    if(indexA + 1 < quotes.length){
        indexA++;
    }else{
        indexA = 0;
    }

    if(indexB + 1 < quotes.length){
        indexB++;
    }else{
        indexB = 0;
    }


    }else{
        hide('sortDiv');
        show('resultDiv');
        printResults();
    }
}

function sortCombination(higher, lower)
{
    var Hi = 0;
    var Lo = 0;

    for(var i = 0; i < sortedList.length; i++){
        if(sortedList[i] == higher){
            Hi = i;
        }
        if(sortedList[i] == lower){
            Lo = i;
        }
    }

    unsortedList[Hi]++;

    //Hard to wrap head around, as the lower index is actually preferred
    if(Hi > Lo){
        unsortedList.move(Hi,Lo);
        sortedList.move(Hi,Lo);
    }

    sorted ++;
    getCombination();
}

Array.prototype.move = function (old_index, new_index) {
    while (old_index < 0) {
        old_index += this.length;
    }
    while (new_index < 0) {
        new_index += this.length;
    }
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

function onTestChange() {
    var key = window.event.keyCode;
    // If the user has pressed enter, and was not pressing the shift key
    if (key === 13) {
        var quote = document.getElementById("textarea1").value;
        if (!isNullOrWhitespace(quote)) {
            document.getElementById("textarea1").value = "";
            createNewQuote(quote);
        }
        return false;
    }
    else {
        return true;
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function createNewQuote(qText) {
    //Add the quote to the individual section
    var parent = document.getElementById("quoteParent");
    var quoteEntryElement = document.getElementById("quoteEntry");
    var newQuote = document.getElementById("quoteTemplate").cloneNode(true);

    newQuote.style.display = 'inherit';

    var quoteText = qText;

    //Populate the individual quote
    NodeList.prototype.forEach = Array.prototype.forEach
    var children = newQuote.childNodes;
    children.forEach(function (t) {
        if (t.id == "qText") {
            t.innerHTML = quoteText.replace(/(<([^>]+)>)/ig, "");
        }
    });
    //Add it to the individual section
    insertAfter(newQuote, quoteEntryElement);
}

function printResults() {
    //Add the quote to the individual section
    var parent = document.getElementById("resultList");
    var title = document.getElementById("resultTitle");

    for(var i = 0; i < sortedList.length; i++){

        var newQuote = document.getElementById("resultItemTemplate").cloneNode(true);
        newQuote.style.display = 'inherit';

        var quoteText = sortedList[i];

        newQuote.innerText = quoteText.replace(/(<([^>]+)>)/ig, "") + " (" + unsortedList[i].toString() + ")";

        //Add it to the individual section
        insertAfter(newQuote, title);
    }
}

function storeQuotes() {
    if (typeof (Storage) !== "undefined") {
        var parent = document.getElementById("quoteParent");
        NodeList.prototype.forEach = Array.prototype.forEach
        var children = parent.childNodes;
        children.forEach(function (t) {
            if (t.id == "quoteTemplate") {
                if (t.style.display == "inherit") {
                    //Parse the quote element
                    var fullQuote = "";
                    NodeList.prototype.forEach = Array.prototype.forEach
                    var children2 = t.childNodes;
                    children2.forEach(function (c) {
                        if (c.id == "qText") {
                            fullQuote += c.innerHTML.replace(/(<([^>]+)>)/ig, "");
                        }
                    });
                    quotes.push(fullQuote);
                }
            }
        });
        localStorage.setItem("thingArray", JSON.stringify(quotes));
        sortedList = quotes;

		unsortedList = [];

		for(var i = 0; i < quotes.length; i++){
			unsortedList[i] = 0;
		}

		sorted = 0;
    }
    else {
        alert("Please update to a newer browser to continue.");
        // Sorry! No Web Storage support..
    }
}

function getStoredQuotes() {

    if (typeof (Storage) !== "undefined") {
        storedQuotes = JSON.parse(localStorage.getItem("thingArray"));

        if (storedQuotes.length != 0) {
            for (var i = 0; i < storedQuotes.length; i++) {
                createNewQuote(storedQuotes[i].toString());
            }
        }
        else {

        }
    }
    else {
        alert("Please update to a newer browser to continue.");
        // Sorry! No Web Storage support..
    }
}
