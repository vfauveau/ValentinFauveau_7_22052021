let searchbar = document.getElementById("recherche");
let container = document.querySelector(".recipes-wrapper");
let searchButton = document.getElementById("searchButton");
// barres de recherches secondaires
let selectIngr = document.getElementById("searchIngr");
let selectUst = document.getElementById("searchUst");
let selectApp = document.getElementById("searchApp");
let selectors = [selectIngr, selectApp, selectUst];
// couleurs
let backgroundColors = ["#3282F7", "#68D9A4", "#ED6454"];
let tagContainer = document.getElementById("tagSpan");
let filteredArray = [];
let allTags = [];
// blocs d'options;
let optionsIngr = document.getElementById("option-container-ingr");
let optionsApp = document.getElementById("option-container-app");
let optionsUst = document.getElementById("option-container-ust");
let keywordsContainer = [optionsIngr, optionsApp, optionsUst];
let ingredientContainer = document.getElementById("select-ingredient");
let applianceContainer = document.getElementById("select-appliance");
let ustensilesContainer = document.getElementById("select-ustensiles");
let optionsContainers = [ingredientContainer, applianceContainer, ustensilesContainer];


// clear array
function clearArray(array) {
    array.length = 0
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
        filteredArray = recipes;
        let resultat = [] ;
        // = Résultat de la recherche non filtré (= avec doublons)
        function search(recherche, typ) { return filteredArray.filter(item => item[typ].includes(recherche)) };
        function search2(recherche, typ) { return filteredArray.filter(item => item[typ].filter(it => it.ingredient.includes(recherche)).length > 0) };
        function search3(recherche, typ) { return filteredArray.filter(item => item[typ].filter(it => it.includes(recherche)).length > 0) };
        function searchPush(recherche, typ) {
            for (let elt of (search(recherche, typ))) {
                resultat.push(elt)
            };
        };
        function searchPush2(recherche, typ) {
            for (let elt of (search2(recherche, typ))) {
                resultat.push(elt)
            }
        };
        function searchPush3(recherche, typ) {
            for (let elt of (search3(recherche, typ))) {
                resultat.push(elt)
            }
        };
        // Reset selectBox display
        function resetSearch() {
            optionsApp.innerHTML = ""
            optionsIngr.innerHTML = ""
            optionsUst.innerHTML = ""
            container.innerHTML = ""
            filteredArray = recipes
            tagContainer.innerHTML = ""
            optionsAppliance()
            optionsIngredients()
            optionsUstensiles()
            clearArray(allTags)
        };
        // remplissage et affichage par défaut des sélecteurs de tag
        optionsAppliance();
        optionsIngredients();
        optionsUstensiles();
        // fonction qui effectue les recherches, filtre les résultats et renvoi le tableau de résultat.
        function filterData(recherche) {
            container.innerHTML = ""
            searchPush(recherche, "name")
            searchPush(recherche, "description")
            searchPush(recherche, "appliance")
            searchPush2(recherche, "ingredients")
            searchPush3(recherche, "ustensils")
            filteredArray = resultat.filter(function (ele, pos) {
                return resultat.indexOf(ele) == pos;
            })
            clearArray(resultat)
            return filteredArray
        };
        // fonction qui affiche les résultats, vide les data list et les remplis avec les mots clés correspondants à l'entrée de l'utilisateur
        function filterAffichage() {
            filteredArray.sort((a, b) => a.name.localeCompare(b.name));
            for (elt of filteredArray) {
                affiche(elt);
            }
            if (filteredArray.length === 0) {
                emptyResponse();
            }
            optionsApp.innerHTML = "";
            optionsIngr.innerHTML = "";
            optionsUst.innerHTML = "";
            optionsAppliance();
            optionsIngredients();
            optionsUstensiles();
        };
        function optionsAppliance() {
            let arrayAppliance = []
            for (let i in filteredArray) {
                arrayAppliance.push(filteredArray[i].appliance)
            }
            let items = arrayAppliance.filter(function (ele, pos) {
                return arrayAppliance.indexOf(ele) == pos;
            })
            for(let x of items){
                let option = document.createElement("span");
                option.classList.add("options");
                option.textContent = x;
                optionsApp.appendChild(option);
                option.onclick=()=>{
                    filterData(option.textContent);
                    filterAffichage();
                    displaytag(x, backgroundColors[1]);
                }
            }
        };
        function optionsIngredients() {
            let arrayIngredients = []
            for (let i in filteredArray) {
                for (let x in filteredArray[i].ingredients)
                    arrayIngredients.push(filteredArray[i].ingredients[x].ingredient)
            }
            let items = arrayIngredients.filter(function (ele, pos) {
                return arrayIngredients.indexOf(ele) == pos;
            })
                for (let x of items) {
                let option = document.createElement("span")
                option.textContent = x
                option.classList.add("options")
                optionsIngr.appendChild(option)
                option.onclick=()=>{
                    filterData(option.textContent)
                    filterAffichage()
                    displaytag(x, backgroundColors[0])
                }
            }
        };

        function optionsUstensiles() {
            let arrayUstensiles = []
            // On récupère les éléments trovués dans un array
            for (let i in filteredArray) {
                for (let x in filteredArray[i].ustensils) {
                    arrayUstensiles.push(filteredArray[i].ustensils[x])
                }
            }
            // on filtre les doublons dans les elements trouvés
            let items = arrayUstensiles.filter(function (ele, pos) {
                return arrayUstensiles.indexOf(ele) == pos;
            })

            // on affiche les éléments restants
            for (let x of items) {
                let option = document.createElement("span")
                option.textContent = x
                option.classList.add("options")
                optionsUst.appendChild(option)
                option.onclick=()=>{
                    filterData(option.textContent)
                    filterAffichage()
                    displaytag(x, backgroundColors[2])
                }
            }
        };
        // Fonction qui gère la création et affichage du tag quand un mot clé est selectionné dans une datalist
        function displaytag(tag, color) {
            // creation et génération des tags
            let btntag = document.createElement("span")
            btntag.classList.add("tagButton")
            btntag.textContent = tag
            allTags.push(tag)
            let closeTag = document.createElement("button")
            btntag.style.backgroundColor = color
            tagContainer.appendChild(btntag);
            btntag.appendChild(closeTag)
            closeTag.classList.add("close-button");
            closeTag.style.backgroundColor = color;
            closeTag.textContent = "X"
            tagContainer.style.display="inline-flex"
        };
        // cas où il n'y a pas de résultat
        function emptyResponse() {
            let response = document.createElement("span")
            response.classList.add("row")
            response.classList.add("emptyresp")
            response.textContent = "Votre recherche ne correspond à aucune réponse. Essayez autre chose ..."
            container.appendChild(response)
        };
        // RECHERCHES // INPUTS.
        // searchBar search / 3 charactères dans la barre de recherche principale (reste à enlever les espaces)
        searchbar.onkeydown = () => {
            container.innerHTML = "";
            if (searchbar.value.length > 2) {
                filterData(searchbar.value);
                filterAffichage(searchbar.value);
            }
            else if (searchbar.value.length <= 2) {
                resetSearch();
            }
        }
        searchButton.onclick = () => {
            container.innerHTML = "";
            filterData(searchbar.value);
            filterAffichage(searchbar.value);
        }

        let arrows = document.querySelectorAll(".arrow");
        let arrowBooleen = true;
        for (let arrow in arrows) {
            arrows[arrow].onclick = () => {
                if (arrowBooleen == true) {
                    arrows[arrow].removeChild(arrows[arrow].lastChild);
                    let arrowdown = document.createElement("i")
                    arrowdown.classList.add("fas")
                    arrowdown.classList.add("fa-angle-down")
                    arrows[arrow].appendChild(arrowdown)
                    if (window.matchMedia("(min-width: 600px)").matches) {
                        optionsContainers[arrow].style.width = "400px"
                      } else {
                        optionsContainers[arrow].style.width = "90%"
                      }

                    keywordsContainer[arrow].style.display = "flex"
                    return arrowBooleen = false;
                }
                else {
                    arrows[arrow].removeChild(arrows[arrow].lastChild);
                    let arrowUp = document.createElement("i")
                    arrowUp.classList.add("fas")
                    arrowUp.classList.add("fa-angle-up")
                    arrows[arrow].appendChild(arrowUp)
                    keywordsContainer[arrow].style.display = "none"
                    if (window.matchMedia("(min-width: 600px)").matches) {
                        optionsContainers[arrow].style.width = "249px"
                      } else {
                        optionsContainers[arrow].style.width = "90%"
                      }
                    return arrowBooleen = true;
                }
            }
        };
        let array = [] ;
        for(let searchbar in selectors){
            selectors[searchbar].onkeydown=()=>{
                clearArray(array)
                if(selectors[searchbar].value.length > 2){
                    for(let i = 0 ; i < keywordsContainer[searchbar].children.length ;i++){
                        array.push(keywordsContainer[searchbar].children[i].textContent.toLowerCase());
                    }
                    array = array.filter(e => e.includes(selectors[searchbar].value.toLowerCase()));
                    keywordsContainer[searchbar].innerHTML="";
                    for(let elt of array){
                        let span = document.createElement("span");
                        span.textContent = elt.toLowerCase();
                        span.classList.add("options");
                        keywordsContainer[searchbar].appendChild(span);
                        span.onclick=()=>{
                            displaytag(elt, backgroundColors[searchbar])
                        }
                    }
                }
                if(selectors[searchbar].value.length < 2){
                    resetSearch()
                }
            }
        }
    })

    .catch(function (error) {
        console.log(error);
    });