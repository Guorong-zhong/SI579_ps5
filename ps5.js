/**
 * Returns a list of objects grouped by some property. For example:
 * groupBy([{name: 'Steve', team:'blue'}, {name: 'Jack', team: 'red'}, {name: 'Carol', team: 'blue'}], 'team')
 *
 * returns:
 * { 'blue': [{name: 'Steve', team: 'blue'}, {name: 'Carol', team: 'blue'}],
 *    'red': [{name: 'Jack', team: 'red'}]
 * }
 *
 * @param {any[]} objects: An array of objects
 * @param {string|Function} property: A property to group objects by
 * @returns  An object where the keys representing group names and the values are the items in objects that are in that group
 */
 function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if(typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for(const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if(!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for(const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}

// Initialize DOM elements that will be used.
const outputDescription = document.querySelector('#output_description');
const wordOutput = document.querySelector('#word_output');
const showRhymesButton = document.querySelector('#show_rhymes');
const showSynonymsButton = document.querySelector('#show_synonyms');
const wordInput = document.querySelector('#word_input');
const savedWords = document.querySelector('#saved_words');

// Stores saved words.
const savedWordsArray = [];

/**
 * Makes a request to Datamuse and updates the page with the
 * results.
 * 
 * Use the getDatamuseRhymeUrl()/getDatamuseSimilarToUrl() functions to make
 * calling a given endpoint easier:
 * - RHYME: `datamuseRequest(getDatamuseRhymeUrl(), () => { <your callback> })
 * - SIMILAR TO: `datamuseRequest(getDatamuseRhymeUrl(), () => { <your callback> })
 *
 * @param {String} url
 *   The URL being fetched.
 * @param {Function} callback
 *   A function that updates the page.
 */
function datamuseRequest(url, callback) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // This invokes the callback that updates the page.
            callback(data);
        }, (err) => {
            console.error(err);
        });
}

/**
 * Gets a URL to fetch rhymes from Datamuse
 *
 * @param {string} rel_rhy
 *   The word to be rhymed with.
 *
 * @returns {string}
 *   The Datamuse request URL.
 */
function getDatamuseRhymeUrl(rel_rhy) {
    return `https://api.datamuse.com/words?${(new URLSearchParams({'rel_rhy': wordInput.value})).toString()}`;
}

/**
 * Gets a URL to fetch 'similar to' from Datamuse.
 *
 * @param {string} ml
 *   The word to find similar words for.
 *
 * @returns {string}
 *   The Datamuse request URL.
 */
function getDatamuseSimilarToUrl(ml) {
    return `https://api.datamuse.com/words?${(new URLSearchParams({'ml': wordInput.value})).toString()}`;
}

/**
 * Add a word to the saved words array and update the #saved_words `<span>`.
 *
 * @param {string} word
 *   The word to add.
 */
function addToSavedWords(word) {
    // You'll need to finish this...
    savedWordsArray.push(word);
    savedWords.textContent = savedWordsArray.join();
}

// Add additional functions/callbacks here.

const createRhymeCallback = (listOfResultss) => {
    // console.log(listOfResultss);
    // const pi = document.createElement('p');
    // pi.textContent = '...loading';
    // wordOutput.appendChild(pi);

    if(wordOutput.hasChildNodes()){
        var childs = wordOutput.childNodes; 
        for(var i = childs .length - 1; i >= 0; i--) {
        wordOutput.removeChild(childs[i]);
        }
    }
    // outputDescription.innerHTML = 'Words that rhyme with '+ wordInput.value
    if (listOfResultss.length > 0){
        wordOutput.innerHTML = '';
        const new_result = groupBy(listOfResultss, 'numSyllables');
        console.log(new_result);
        for (i in new_result){
            console.log(i);
            const h3 = document.createElement('h3');
            h3.textContent = 'Syllables: ' + i;
            wordOutput.appendChild(h3);

            for (result in new_result[i]){
                // console.log(result);
                const {word} = new_result[i][result];
                // for (num in numSyllables){
                //     const {word} = re
                // }
    
                // const span = document.createElement('span');
                const newLi = document.createElement('li');
                newLi.textContent = word;
                const btn = document.createElement('button');
                btn.setAttribute('type','button');
                btn.style.backgroundColor = 'green';
                btn.innerHTML = '(save)';
                // span.appendChild(newLi);
                // span.appendChild(btn);
                newLi.appendChild(btn);
                wordOutput.appendChild(newLi);
    
                btn.addEventListener('click', (e) => {
                    addToSavedWords(word);
                })
            }
        }
        
    }else{
        let p = document.createElement('p');
        p.textContent = 'no result';
        wordOutput.appendChild(p);
    }
    
}

const createSynonymCallback = (listOfResults) => {
    // console.log(listOfResults);
    // const pi = document.createElement('p');
    // pi.textContent = '...loading';
    // wordOutput.appendChild(pi);

    if(wordOutput.hasChildNodes()){
        var childs = wordOutput.childNodes; 
        for(var i = childs .length - 1; i >= 0; i--) {
        wordOutput.removeChild(childs[i]);
        }
    }
    // outputDescription.innerHTML = 'Words with a similar meaning to '+ wordInput.value
    if (listOfResults.length > 0){
        wordOutput.innerHTML = '';
        for (result in listOfResults){
            const {word} = listOfResults[result];
            
            // const span = document.createElement('span');
            const newLi = document.createElement('li');
            newLi.textContent = word;
            const btn = document.createElement('button');
            btn.setAttribute('type','button');
            btn.style.backgroundColor = 'green';
            btn.innerHTML = '(save)';
            // span.appendChild(newLi);
            // span.appendChild(btn);
            newLi.appendChild(btn);
            wordOutput.appendChild(newLi);

            btn.addEventListener('click', (e) => {
                addToSavedWords(word);
            })
        }
    }else{
        console.log('enetering else')
        let p = document.createElement('p');
        p.textContent = 'no result';
        wordOutput.appendChild(p);
    }
    
}

// Add event listeners here.
showRhymesButton.addEventListener('click', (e) => {
    // if(wordOutput.hasChildNodes()){
    //     var childs = wordOutput.childNodes; 
    //     for(var i = childs .length - 1; i >= 0; i--) {
    //     wordOutput.removeChild(childs[i]);
    //     }
    // }
    
    // const pi = document.createElement('p');
    // pi.textContent = '...loading';
    outputDescription.innerHTML = 'Words that rhyme with '+ wordInput.value;
    wordOutput.innerHTML = '...loading';
    datamuseRequest(getDatamuseRhymeUrl(wordInput.value), createRhymeCallback);
})

showSynonymsButton.addEventListener('click', (e) => {
    outputDescription.innerHTML = 'Words with a similar meaning to '+ wordInput.value;
    wordOutput.innerHTML = '...loading';
    datamuseRequest(getDatamuseSimilarToUrl(wordInput.value), createSynonymCallback);
})