var quotes = [];
var storedQuotes = [];

var sorted = 0;
var maxSorted = 0;

var sortItemArray = [];

var indexA = 0;
var indexB = 0;

var prevBetter = [];
var prevWorse = [];

var prevIndexA = [];
var prevIndexB = [];

var rawBulkInput = "";
var bulkSplitChar = "\n";

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

function changeInputType()
{
  if(document.getElementById("inputType").checked){
    hide("individualEntry");
    show("bulkEntry");
  }else{
    show("individualEntry");
    hide("bulkEntry");
  }
}

function clearItems() {
    //Delete all the quotes
    var parent = document.getElementById("quoteParent");
    var entry = document.getElementById("quoteEntry").cloneNode(true);
    var div = document.createElement('DIV');
    div.innerHTML = '<li style="padding-right: 5%;" id="quoteTemplate" class="collection-item blue lighten-5"><span id="qText" style="position: relative; left: 1%;">Quote Text</span><span style="position: absolute; right: 1%;"><span><a id="linkCursor" onclick="returnToEditQuote(this.parentNode.parentNode.parentNode.children[0].innerHTML); this.parentNode.parentNode.parentNode.remove();"><i class="material-icons">edit</i></a></span><span><a id="linkCursor" onclick="this.parentNode.parentNode.parentNode.remove();"><i class="material-icons">delete</i></a></span></span></li>';
    var elements = div.firstChild;

    parent.innerHTML = "";
    parent.appendChild(entry);
    parent.appendChild(elements);
}

function submitBulkItems() {
    var quote = document.getElementById("textarea2").value;
    if (!isNullOrWhitespace(quote)) {
        rawBulkInput = document.getElementById("textarea2").value;
        document.getElementById("textarea2").value = "";
        document.getElementById("textarea2").style.height = "23px";
        scrollTo(0,0);
        parseBulkQuotes();
    }
}

function parseBulkQuotes() {
    var bulkText = rawBulkInput;
    var splitChar = bulkSplitChar;
    var splitQuotes = bulkText.split(splitChar);
    for (var i = 0; i < splitQuotes.length; i++) {
        var quoteText = splitQuotes[i];
        if (!isNullOrWhitespace(quoteText)) {
            quoteText.replace(/(<([^>]+)>)/ig, "");
            createNewQuote(quoteText);
        }
    }
}

function setBulkSplit(sChar) {
    bulkSplitChar = sChar;
}

function getCombination()
{
    maxSorted = ((sortItemArray.length * sortItemArray.length) - sortItemArray.length) / 2;
    //maxSorted = sortItemArray.length * sortItemArray.length;
    //Calculate the progress bar
    var wid = (100 / maxSorted) * sorted;
    document.getElementById("progressBar").style.width = wid.toString() + "%";

    if(sorted < maxSorted){

      if(sorted > 0){
        document.getElementById("undoBtn").style.display = "inherit";
      }else{
        document.getElementById("undoBtn").style.display = "none";
      }

    document.getElementById("sortCounter").textContent = sorted.toString() + "/" + maxSorted.toString();

    if(indexB == indexA)
    {
      if(indexB + 1 < quotes.length){
          indexB++;
      }else{
          console.log("Time to update the A value");
          if(indexA + 1 < quotes.length){
            indexA++;
            indexB = indexA;
            if(indexB + 1 < quotes.length){
              indexB++;
            }else{
              console.log("Out of combinations to check.");
            }
          }else{
            console.log("Out of combinations to check.");
          }
      }
    }

    //Reference items by name because the array index is used for sorting
    var itemA = "";
    var itemB = "";

    itemA = quotes[indexA];
    itemB = quotes[indexB];

    var idA = indexA;
    var idB = indexB;

    //First button sets itemA as preferred over itemB, and vice versa.
    document.getElementById("sortItem1").textContent = quotes[indexA];
    document.getElementById("sortItem1").onclick = function(){ sortCombination(itemA,itemB,idA,idB); };

    document.getElementById("sortItem2").textContent = quotes[indexB];
    document.getElementById("sortItem2").onclick = function(){ sortCombination(itemB,itemA,idA,idB); };

    if(indexB + 1 < quotes.length){
        indexB++;
    }else{
        console.log("Time to update the A value");
        if(indexA + 1 < quotes.length){
          indexA++;
          indexB = indexA;
          if(indexB + 1 < quotes.length){
            indexB++;
          }else{
            console.log("Out of combinations to check.");
          }
        }else{
          console.log("Out of combinations to check.");
        }
    }

    }else{
        hide('sortDiv');
        show('resultDiv');
        printResults();
    }
}

function sortCombination(better, worse,idA,idB)
{
    //Calculate the progress bar
    var wid = (100 / maxSorted) * sorted;
    document.getElementById("progressBar").style.width = wid.toString() + "%";

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

    //Set the previous index values
    prevIndexA.push(idA);
    prevIndexB.push(idB);

    //Have to set the value BEFORE MOVING
    sortItemArray[betterIndex][1]++;

    //Dont do anythign with the index's now!
    sorted ++;
    //Calculate the progress bar
    var wid = (100 / maxSorted) * sorted;
    document.getElementById("progressBar").style.width = wid.toString() + "%";

    prevBetter.push(better);
    prevWorse.push(worse);

    getCombination();
}

function undoCombination()
{
    if(sorted - 1 >= 0){
      var better = prevBetter.pop();
      var worse = prevWorse.pop();

      //Calculate the progress bar
      var wid = (100 / maxSorted) * sorted;
      document.getElementById("progressBar").style.width = wid.toString() + "%";

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

      sortItemArray[betterIndex][1] --;
      sorted --;
      //Calculate the progress bar
      var wid = (100 / maxSorted) * sorted;
      document.getElementById("progressBar").style.width = wid.toString() + "%";

      indexB = prevIndexB.pop();
      indexA = prevIndexA.pop();
      console.log("Restored indexA:" + indexA + " indexB: " + indexB + " better: " + better.toString() + " worse: " + worse.toString());

      getCombination();
  }
}

function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
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

function continueToSort()
{
  var qCount = 0;
  //Get amount of entered quotesvar parent = document.getElementById("quoteParent");
  NodeList.prototype.forEach = Array.prototype.forEach
  var children = document.getElementById("quoteParent").childNodes;
  children.forEach(function (t) {
      if (t.id == "quoteTemplate") {
          if (t.style.display == "inherit") {
              qCount ++;
          }
      }
  });
  //Hide or show the continue button
  if(qCount >= 2){
    storeQuotes();
    hide('importDiv');
    show('sortDiv');
    getCombination();
  }else{
    alert("Please input at least two things to sort.");
  }
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

    //Sort by values
    sortItemArray.sort(compareSecondColumn);

    //Add the quote to the individual section
    var parent = document.getElementById("resultList");
    var title = document.getElementById("resultTitle").cloneNode(true);
    var newQuote = document.getElementById("resultItemTemplate").cloneNode(true);

    parent.innerHTML = "";
    parent.appendChild(title);
    parent.appendChild(newQuote);

    var rank = 1;

    for(var i = sortItemArray.length - 1; i >= 0; i--){

        var newQuote = document.getElementById("resultItemTemplate").cloneNode(true);
        newQuote.style.display = 'inherit';

        var quoteText = sortItemArray[i][0];
        var amount = sortItemArray[i][1].toString();

        newQuote.innerText = rank + ". " + quoteText.replace(/(<([^>]+)>)/ig, "") + " (" + amount + " pts.)";
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

    //Shuffle the items's input
    shuffle(quotes);

		for(var i = 0; i < quotes.length; i++){
			sortItemArray[i] = [quotes[i],0];
		}

		sorted = 0;
    indexA = 0;
    indexB = 0;
    }
    else {
        alert("Please update to a newer browser to continue.");
        // Sorry! No Web Storage support..
    }
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
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
