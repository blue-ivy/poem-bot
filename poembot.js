function buildAPoem() {
    // the python project has 3 parameters,
    // n = number of gram-sentences returned
    // m = the bi,tri, or n-gram length
    // and the file(s) it should build from
    // Here, I assume 1 returned poem , gram length 4, and only my work on the site
    var me = "";
    var GRAM_LENGTH = 4;
    console.log("You have to implement this part yourself")
    //$(".poem").each( function(i) {
    //    // we want all the <br>s
    //    me += this.innerHTML;
    //});
    var tokens = me.replace( /\n/g, "" ).replace( /[.,?!]/g, " $& " ).replace( /(\s)+/g, " ").split(" ");
    for (i = 0; i < tokens.length; i++){
        tokens[i] = tokens[i].trim()
    }
    //console.log(tokens)
    // grams
    var grams = [];
    for (i = 0; i < (tokens.length - (GRAM_LENGTH - 1)); i++) {
        var temp = [];
        // dynamic gram size
        for (j = 0; j < GRAM_LENGTH; j++){
            temp.push(tokens[i + j])
        }
        grams.push(temp);
    }
    // shuffle
    grams = shuffle(grams);
    // CONSTRUCT //
    // MARKOV!!! //
    // we're going to start with grams where the first index is uppercase
    var startingPosition = getAnUppercaseIndex(grams);
    var poem = grams[startingPosition];
    // pull out added grams
    grams.splice(startingPosition, 1);
    //console.log("starting with " + poem);
    var building = 1;
    while (building > 0){
        building++;
        // the way this works, we only need to
        // match the first 2 (gram) strings,
        // then we take the last one and add it to our poem
        var prefix = poem.slice((GRAM_LENGTH - 1) * -1)
        // FUN CASE!
        // if we have 2 line breaks back to back at the end of our 'prefix'
        // lets start with a brand new gram
        if (prefix[prefix.length - 2] == prefix[prefix.length - 1] && prefix[prefix.length - 2] === "<br>"){
            var randIndex = getAnUppercaseIndex(grams)
            poem = poem.concat(grams[randIndex])
            rep = grams.splice(randIndex,1)
            //console.log("concat! " + rep)
        } else {
			// posNext array contains
			// 	0: string
			//	1: index in array (for removal)
			//	2: % match
			var posNext = [];
            for (i = 0; i < grams.length; i++) {
                var match = 0;
                // here is our closeness measurement
				// I'm using a weighted sum, where the closer the
				// matched word is to the end of the string the more
				// significant the match is. This is represented
				// by the +(index + 1) for each matched word
				// max match is factorial(GRAM_LENGTH)
                for (j = 0; j < GRAM_LENGTH; j++){
                    if (grams[i][j] == prefix[j]){
                        match += (j + 1);
                    }
                }
				// let's get crafty. I'm having problems over line breaks,
				// so lets extend our memory if we're enjambing. This is because of scenrios like:
				// 	(',', '<br>') on trigrams.
				if (prefix[prefix.length - 1] == '<br>'){
					if (match == fact(GRAM_LENGTH - 1)){
						var next = grams[i][GRAM_LENGTH - 1];
						posNext.push([next,i,match]);
					}
				} else {
					if (match > 3) {
						var next = grams[i][GRAM_LENGTH - 1];
						posNext.push([next,i,match]);
					}
				}
            }
            // if we get through the corpus and didn't find a match then we've
            // probably consumed the whole text. It would be good to back-up and
            // try again here, but for now let's just end the poem...
            if (posNext.length == 0){
                building = 0;
            } else {
				// pick one from possible next
				var selected = selectFromPossbileMatches(posNext);
				poem.push(selected[0]);
				// remove the pick
				rep = grams.splice(selected[1],1);
				//console.log("Selected: " + selected[0]);
				if (Math.random() > 0.5 && (selected[0] === "." || selected[0] === "?" || selected[0] === "!")){
					building = 0;
				}
			}
        }
    }
    console.log("poem: " + poem);
    // human readable
    var outputPoem = poem[0];
    for (i = 1; i < poem.length; i++){
        // no space before punctuation
        if(poem[i].match(/[.,?!]/g)){
            outputPoem += poem[i];
        } else {
            outputPoem += " " + poem[i];
        }
    }
    return outputPoem;
}
