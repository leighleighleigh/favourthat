var quotes = [];
var storedQuotes = [];

var sorted = 0;
var maxSorted = 0;

var sortItemArray = [];

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
    maxSorted = ((sortItemArray.length * sortItemArray.length) - sortItemArray.length) / 2;

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

function sortCombination(better, worse)
{
    var betterIndex = 0;
    var betterValue = 0;

    var worseIndex = 0;
    var worseValue = 0;

    //Find the priority values of the two thingies
    for(var i = 0; i < sortItemArray.length; i++)
    {
      if(sortItemArray[i][0] == better){
        betterIndex = i;
        betterValue = sortItemArray[i][1];
      }
      if(sortItemArray[i][0] == worse){
        worseIndex = i;
        worseValue = sortItemArray[i][1];
      }
    }

    //Have to set the value BEFORE MOVING

    //Set the item's value in the Array
    sortItemArray[betterIndex][1] = betterValue + 1;

    //So not as low in the array (0 is best)
    if(betterIndex > worseIndex){
      sortItemArray.move2(betterIndex,worseIndex);
    }
    //Dont do anythign with the index's now!
    sorted ++;
    //Calculate the progress bar
    var wid = (100 / maxSorted) * sorted;
    document.getElementById("progressBar").style.width = wid.toString() + "%";

    var dTable = document.getElementById("debugTable");
    //var dHeader = document.getElementById("dHeader").cloneNode(true);
    //Remove all existing stuff in the debug table (from last combo run)
    //Remove all child elements
    dTable.innerHTML = "";
    //Add the header back
    //dTable.appendChild(dHeader);
    //Populate the table
    for(var i = 0; i < sortItemArray.length; i++)
    {
        var rowItem = document.createElement("TR");
        var dataItem = document.createElement("TD");
        dataItem.innerText = (i + 1) + ". " + sortItemArray[i][0].toString();
        rowItem.appendChild(dataItem);

        /*
        for(var t = 0; t < sortItemArray[i].length; t++){
            var dataItem = document.createElement("TD");
            dataItem.innerText = sortItemArray[i][t].toString();
            rowItem.appendChild(dataItem);
        }
        */

        dTable.appendChild(rowItem);
    }

    getCombination();
}

Array.prototype.move2 = function(pos1, pos2) {
   // local variables
   var i, tmp;
   // cast input parameters to integers
   pos1 = parseInt(pos1, 10);
   pos2 = parseInt(pos2, 10);
   // if positions are different and inside array
   if (pos1 !== pos2 && 0 <= pos1 && pos1 <= this.length && 0 <= pos2 && pos2 <= this.length) {
     // save element from position 1
     tmp = this[pos1];
     // move element down and shift other elements up
     if (pos1 < pos2) {
       for (i = pos1; i < pos2; i++) {
         this[i] = this[i + 1];
       }
     }
     // move element up and shift other elements down
     else {
       for (i = pos1; i > pos2; i--) {
         this[i] = this[i - 1];
       }
     }
     // put element from position 1 to destination
     this[pos2] = tmp;
   }
 }

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
    //Lets sort the items by the first column value!
    /*
    sortItemArray.sort(function(a,b) {
      return a[0] - b[0];
    });
    */
    console.log(sortItemArray);

    //Add the quote to the individual section
    var parent = document.getElementById("resultList");
    var title = document.getElementById("resultTitle");
    var rank = 1;

    for(var i = 0; i < sortItemArray.length; i++){

        var newQuote = document.getElementById("resultItemTemplate").cloneNode(true);
        newQuote.style.display = 'inherit';

        var quoteText = sortItemArray[i][0];
        var amount = " (" + sortItemArray[i][1].toString() + ")";

        newQuote.innerText = rank + ". " + quoteText.replace(/(<([^>]+)>)/ig, "");
        rank++;
        //Add it to the individual section
        parent.appendChild(newQuote);
    }
}

function storeQuotes() {

    quotes = [];
    sortItemArray = [];

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

    //Populate the multidimensional array
		sortItemArray = [];

		for(var i = 0; i < quotes.length; i++){
			sortItemArray[i] = [quotes[i],0];
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
