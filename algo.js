let searchbar = document.getElementById("recherche");
let container = document.querySelector(".recipes-wrapper");
let selectIngr = document.getElementById("select-ingredient");
let selectUst = document.getElementById("select-ustensiles");
let selectApp = document.getElementById("select-appareil");
let tagContainer = document.getElementById("tagSpan");
let arrayRecherche = [];
let datalistIngr = document.getElementById("data-list-ingredient");
let datalistApp = document.getElementById("data-list-appareil");
let datalistUst = document.getElementById("data-list-ustensiles");
let allTags = [];
// clear array
function clearArray(array) {
    array.length = 0 ;
}
// affichage des recettes
function affiche(recette) {
    let parent = document.createElement("div");
    let texteContainer = document.createElement("div");
    let img = document.createElement("img");
    let generalInfo = document.createElement("p");
    let bloctexte = document.createElement("div");
    let time = document.createElement("strong");
    let title = document.createElement("h3");
    let descr = document.createElement("p");
    let liste = document.createElement("ul");
    title.textContent = recette.name;
    time.textContent = recette.time + "min";
    descr.textContent = recette.description;
    for (let ingr of recette.ingredients) {
        let li = document.createElement("li");
        // création des ingrédients dans la liste
        let strong = document.createElement("strong");
        strong.textContent = ingr.ingredient + " " + (ingr.quantity ? ingr.quantity : "") + " " + (ingr.unit ? ingr.unit : "");
        li.appendChild(strong);
        liste.appendChild(li);
    }
    container.appendChild(parent);
    parent.appendChild(img);
    bloctexte.appendChild(liste);
    bloctexte.appendChild(descr);
    generalInfo.appendChild(title);
    generalInfo.appendChild(time);
    texteContainer.appendChild(generalInfo);
    texteContainer.appendChild(bloctexte);
    parent.appendChild(texteContainer);
    bloctexte.classList.add("recipe-descr-list");
    descr.classList.add("description");
    generalInfo.classList.add("recipe-title");
    parent.classList.add("recipe-container");
    texteContainer.classList.add("recipe-text-container");
}

fetch("recipes.json")
    .then((resp) => resp.json())
    .then(function (data) {
        let recipes = data.recipes;
        arrayRecherche = [].concat(recipes);
        let resultat = [];

        function reset() {
            arrayRecherche = [].concat(recipes);
            clearArray(resultat);
            container.innerHTML = "";
            datalistApp.innerHTML = "";
            datalistIngr.innerHTML = "";
            datalistUst.innerHTML = "";
            defaultSelectIng(datalistIngr);
            defaultSelectUst(datalistUst);
            defaultSelectApp(datalistApp);
        }
        // fonction de recherche qui cycle dans les éléments et les élimine de la base de données si ils sont validés
        // on effectue 5 recherches (ingredients, nom, ustensiles, appliance, description des recettes)
        function recherche(recherche) {
            for (let x in arrayRecherche) {
                if (arrayRecherche[x].appliance.includes(recherche)) {
                    resultat.push(arrayRecherche[x]);
                    arrayRecherche.splice(x, 1);
                }
                if (arrayRecherche[x].name.includes(recherche)) {
                    resultat.push(arrayRecherche[x]);
                    arrayRecherche.splice(x, 1);
                }
                if (arrayRecherche[x].description.includes(recherche)) {
                    resultat.push(arrayRecherche[x]);
                    arrayRecherche.splice(x, 1);
                }
                for (let i in arrayRecherche[x].ingredients) {
                    if (arrayRecherche[x].ingredients[i].ingredient.includes(recherche)) {
                        resultat.push(arrayRecherche[x]);
                        arrayRecherche.splice(x, 1);
                    }
                }
                for (let elt of arrayRecherche[x].ustensils) {
                    if (elt.includes(recherche)) {
                        resultat.push(arrayRecherche[x]);
                        arrayRecherche.splice(x, 1);
                    }
                }
            }
            return resultat ;
        }
        // Fonction qui gère la création et affichage du tag quand un mot clé est selectionné dans une datalist
        function displaytag(tag, color) {
            let btntag = document.createElement("span");
            btntag.textContent = tag;
            let tagX = document.createElement("button");
            tagX.textContent = "X";
            btntag.style.backgroundColor = color;
            tagContainer.appendChild(btntag);
            btntag.appendChild(tagX);
            tagX.classList.add("close-button");
            tagX.style.backgroundColor = color;
            btntag.classList.add("tagButton");
            allTags.push(tag);
        }
        function emptyResponse() {
            let response = document.createElement("span");
            response.classList.add("spanErreur");
            response.textContent = "Votre recherche ne correspond à aucune de nos recettes. Essayez autre chose ...";
            container.appendChild(response);
        }
        function creationOption(liste, array) {
            let items = array.filter(function (ele, pos) {
                return array.indexOf(ele) == pos;
            });
            for (let elt of items) {
                let option = document.createElement("option");
                option.textContent = elt;
                liste.appendChild(option);
            }
            clearArray(array);
        }
        function defaultSelectIng() {
            let arrayTest = [];
            for (let i in recipes) {
                for (let x in recipes[i].ingredients){
                    arrayTest.push(recipes[i].ingredients[x].ingredient);
                }
            }
            creationOption(datalistIngr, arrayTest);
            selectIngr.value = "";
        }
        // Select Box Appliance par defaut
        function defaultSelectApp() {
            let arrayTest = [];
            for (let i in recipes) {
                arrayTest.push(recipes[i].appliance);
            }
            creationOption(datalistApp, arrayTest);
            selectApp.value = "";
        }
        // Select BOX Ustensils par defaut
        function defaultSelectUst() {
            let arrayTest = [];
            for (let i in recipes) {
                for (let x in recipes[i].ustensils) {
                    arrayTest.push(recipes[i].ustensils[x]);
                }
            }
            creationOption(datalistUst, arrayTest);
            selectUst.value = "";
        }
        defaultSelectIng(datalistIngr);
        defaultSelectApp(datalistApp);
        defaultSelectUst(datalistUst);
        // fonction qui affiche les résultats et options filtrées
        function filterAffichage(resultat) {
            if (resultat.length === 0) {
                emptyResponse();
            }
            for (let elt of resultat) {
                affiche(elt);
            }
            datalistApp.innerHTML = "";
            datalistIngr.innerHTML = "";
            datalistUst.innerHTML = "";
            optionsAppliance();
            optionsIngredients();
            optionsUstensiles();
        }
        function optionsAppliance() {
            let arrayAppliance = [];
            for (let i in resultat) {
                arrayAppliance.push(resultat[i].appliance);
            }
            let items = arrayAppliance.filter(function (ele, pos) {
                return arrayAppliance.indexOf(ele) == pos;
            });
            for (let x of items) {
                let option = document.createElement("option");
                option.textContent = x;
                datalistApp.appendChild(option);
            }
        }
        function optionsIngredients() {
            let arrayIngredients = [];
            for (let i in resultat) {
                for (let x in resultat[i].ingredients){
                    arrayIngredients.push(resultat[i].ingredients[x].ingredient);
                }
            }
            let items = arrayIngredients.filter(function (ele, pos) {
                return arrayIngredients.indexOf(ele) == pos;
            });
            for (let x of items) {
                let option = document.createElement("option");
                option.textContent = x;
                datalistIngr.appendChild(option);
            }
        }

        function optionsUstensiles() {
            let arrayUstensiles = [];
            // On récupère les éléments trovués da;ns un array
            for (let i in resultat) {
                for (let x in resultat[i].ustensils) {
                    arrayUstensiles.push(resultat[i].ustensils[x]);
                }
            }
            // on filtre les doublons dans les elements trouvés
            let items = arrayUstensiles.filter(function (ele, pos) {
                return arrayUstensiles.indexOf(ele) == pos;
            });
            // on affiche les éléments restants
            for (let x of items) {
                let option = document.createElement("option");
                option.textContent = x;
                datalistUst.appendChild(option);
            }
        }
        // evenement bouton barre de recherche
        searchButton.onclick = () => {
            container.innerHTML = "";
            recherche(searchbar.value);
            filterAffichage(resultat);
        };
        // evenements barre de recherche
        searchbar.onkeydown = () => {
            if (searchbar.value.length > 2) {
                container.innerHTML = "";
                recherche(searchbar.value);
                filterAffichage(resultat);
            }
            else if (searchbar.value.length < 2) {
                reset();
            }
        };
        let selectors = [selectIngr, selectApp, selectUst];
        let backgroundColors = ["#3282F7", "#68D9A4", "#ED6454"];

        // onchange
        for (let i in selectors) {
            selectors[i].onchange = () => {
                container.innerHTML = "";
                if (selectors[i].value !== "") {
                    recherche(selectors[i].value);
                    filterAffichage(resultat);
                    displaytag(selectors[i].value, backgroundColors[i]);
                    // gestions des tags
                    let tag = document.getElementsByClassName("tagButton");
                    for(let elt of tag){
                        elt.onclick=()=>{
                            allTags = allTags.filter(e => !e.includes(elt.textContent.substring(0,elt.textContent.length-1)));
                            tagContainer.removeChild(elt);
                            for(let elt in allTags){
                                filteredArray = recipes;
                                container.innerHTML ="";
                                recherche(allTags[elt]);
                                filterAffichage(allTags[elt]);
                            }
                            if(allTags.length === 0){
                                reset();
                            }
                        };
                    }
                }
            };
        }
    })
    .catch(function (error) {
        console.log(error);
    });
