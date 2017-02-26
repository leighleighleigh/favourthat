var quotes = [];
var storedQuotes = [];

var sortIndex = 0;
var compareIndex = 0;

var sorted = 0;
var maxSorted = 0;

var sortedList = [];

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
    
    
    document.getElementById("sortItem1").textContent = quotes[sortIndex];
    document.getElementById("sortItem1").onclick = function(){ sortCombination(quotes[sortIndex],quotes[compareIndex]); };
    
    if(compareIndex == sortIndex){
        if(compareIndex + 1 < quotes.length){
            compareIndex++;
        }else{
            compareIndex = 0;
        }
    }    
    
    document.getElementById("sortItem2").textContent = quotes[compareIndex];
    document.getElementById("sortItem2").onclick = function(){ sortCombination(quotes[compareIndex],quotes[sortIndex]); };
    
    if(sortIndex + 1 < quotes.length){
            sortIndex++;
        }else{
            sortIndex = 0;
    }
    
    if(compareIndex + 1 < quotes.length){
            compareIndex++;
        }else{
            compareIndex = 0;
    }
        
    }else{
        hide('sortDiv');
        show('resultDiv');
        printResults();
    }
}

function sortCombination(above, below)
{
    var aboveIndex = 0;
    var belowIndex = 0;
    
    for(var i = 0; i < sortedList.length; i++){
        if(sortedList[i] == above){
            aboveIndex = i;
        }
        if(sortedList[i] == below){
            belowIndex = i;
        }
    }
    
    sortedList.move(belowIndex,aboveIndex);
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
    
    for(var i = sortedList.length - 1; i >= 0; i--){
        
        var newQuote = document.getElementById("resultItemTemplate").cloneNode(true);
        newQuote.style.display = 'inherit';
        
        var quoteText = sortedList[i];

        newQuote.innerText = (i + 1).toString() + ". " + quoteText.replace(/(<([^>]+)>)/ig, "");

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
