// DOM
let searchbar = document.getElementById("recherche");
let container = document.querySelector(".recipes-wrapper");
// inputs secondaires
let inputIngr = document.getElementById("searchIngr");
let inputUst = document.getElementById("searchUst");
let inputApp = document.getElementById("searchApp");
let secondarySearchs = [inputIngr, inputApp, inputUst];
let backgroundColors = ["#3282F7", "#68D9A4", "#ED6454"];
// endroits où seront ajoutés les divers mots clés
let optionsIngr = document.getElementById("option-container-ingr");
let optionsApp = document.getElementById("option-container-app");
let optionsUst = document.getElementById("option-container-ust");
let keywordsContainer = [optionsIngr, optionsApp, optionsUst];
// containers des blocs de recherche secondaires
let ingredientContainer = document.getElementById("select-ingredient");
let applianceContainer = document.getElementById("select-appliance");
let ustensilesContainer = document.getElementById("select-ustensiles");
let optionsContainers = [ingredientContainer, applianceContainer, ustensilesContainer];
// misc
let allTags = [];
let tagContainer = document.getElementById("tagSpan");
// vide un array
function clearArray(array) {
    array.length = 0;
}
// affichage des recettes
function affiche(recette) {
    if (recette === undefined) { return }
    let parent = document.createElement("div");
    let texteContainer = document.createElement("div");
    let img = document.createElement("img");
    let generalInfo = document.createElement("p");
    let bloctexte = document.createElement("div");
    let time = document.createElement("strong");
    let timeIcon = document.createElement("i");
    let title = document.createElement("h3");
    let descr = document.createElement("p");
    let liste = document.createElement("ul");
    let timewrapper = document.createElement("span")
    title.textContent = recette.name;
    time.textContent = recette.time + " min";
    descr.textContent = recette.description;
    timeIcon.classList.add("far");
    timeIcon.classList.add("fa-clock");
    for (let ingr of recette.ingredients) {
        // création des ingrédients dans la liste
        let li = document.createElement("li");
        let strong = document.createElement("strong");
        let units = document.createElement("small")
        strong.textContent = ingr.ingredient + " : "
        units.textContent = (ingr.quantity ? ingr.quantity : "") + " " + (ingr.unit ? ingr.unit : "");
        li.appendChild(strong);
        li.appendChild(units)
        liste.appendChild(li);
    }
    container.appendChild(parent);
    parent.appendChild(img);
    bloctexte.appendChild(liste);
    bloctexte.appendChild(descr);
    generalInfo.appendChild(title);
    timewrapper.appendChild(timeIcon)
    timewrapper.appendChild(time);
    generalInfo.appendChild(timewrapper)
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
        let arrayRecherche = [].concat(recipes)
        let resultat = [];
        // RESET de l'affichage et des divers array)
        function reset() {
            arrayRecherche = [].concat(recipes)
            clearArray(resultat);
            container.innerHTML = "";
            optionsApp.innerHTML = "";
            optionsIngr.innerHTML = "";
            optionsUst.innerHTML = "";
            tagContainer.style.display = "none";
            tagContainer.innerHTML = "";
            optionsAppliance();
            optionsIngredients();
            optionsUstensiles();
        }
        // fonction de recherche qui cycle dans les éléments et les élimine de la base de données si ils sont validés
        // on effectue 5 recherches (ingredients, nom, ustensiles, appliance, description des recettes)
        function recherche(recherche) {
            recherche = recherche.toLowerCase();
            for (let x in arrayRecherche) {
                if (arrayRecherche[x].name.toLowerCase().includes(recherche)) {
                    resultat.push(arrayRecherche[x]);
                }
                if (arrayRecherche[x].description.toLowerCase().includes(recherche)) {
                    resultat.push(arrayRecherche[x]);
                }
                for (let elt of arrayRecherche[x].ingredients) {
                    if (elt.ingredient.toLowerCase().includes(recherche)) {
                        resultat.push(arrayRecherche[x]);
                    }
                }
            }
            // sort par ordre alphabétique
            resultat.sort((a, b) => a.name.localeCompare(b.name))
            arrayRecherche = Array.from(new Set(resultat))
            resultat.length = 0;
        }
        // function de recherche par mot clé sur les appareils
        function rechercheAppliance(recherche) {
            for (let x in arrayRecherche) {
                if (arrayRecherche[x].appliance.toLowerCase().includes(recherche)) {
                    resultat.push(arrayRecherche[x]);
                    arrayRecherche.splice(x, 1);
                }
            }
            resultat.sort((a, b) => a.name.localeCompare(b.name))
            arrayRecherche = Array.from(new Set(resultat))
            resultat.length = 0;
        }
        // fonction de recherche par mot clé ustensiles
        function rechercheUstensils(recherche) {
            for (let x in arrayRecherche) {
                for (let elt of arrayRecherche[x].ustensils) {
                    if (elt.toLowerCase().includes(recherche)) {
                        resultat.push(arrayRecherche[x]);
                        arrayRecherche.splice(x, 1);
                    }
                }
            }
            resultat.sort((a, b) => a.name.localeCompare(b.name))
            arrayRecherche = Array.from(new Set(resultat))
            resultat.length = 0;
        }
        // Fonction qui gère la création et affichage du tag quand un mot clé est selectionné dans une datalist
        function displaytag(tag, color) {
            if (allTags.length < 6) {
                let btntag = document.createElement("span");
                btntag.textContent = tag;
                let tagX = document.createElement("button");
                tagContainer.style.display = "inline-flex"
                tagX.textContent = "X";
                btntag.style.backgroundColor = color;
                tagContainer.appendChild(btntag);
                btntag.appendChild(tagX);
                tagX.classList.add("close-button");
                tagX.style.backgroundColor = color;
                btntag.classList.add("tagButton");
                allTags.push(tag);
            }
        }
        function emptyResponse() {
            let response = document.createElement("span");
            response.classList.add("spanErreur");
            response.textContent = "Votre recherche ne correspond à aucune de nos recettes. Essayez autre chose ...";
            container.appendChild(response);
        }

        // Fonction importante qui génère les mots clés dans le DOM

        // fonction qui affiche les résultats et options filtrées
        function filterAffichage(valeur) {
            container.innerHTML = ""
            if (arrayRecherche.length === 0) {
                emptyResponse();
            }
            for (let elt of arrayRecherche) {
                affiche(elt);
            }
            optionsApp.innerHTML = "";
            optionsIngr.innerHTML = "";
            optionsUst.innerHTML = "";
            optionsAppliance(valeur);
            optionsIngredients(valeur);
            optionsUstensiles(valeur);
        }
        function tagestion() {
            let tag = document.getElementsByClassName("tagButton");
            for (let elt of tag) {
                elt.onclick = () => {
                    allTags = allTags.filter(e => !e.includes(elt.textContent.substring(0, elt.textContent.length - 1)));
                    tagContainer.removeChild(elt);
                    for (let elt in allTags) {
                        container.innerHTML = "";
                        recherche(allTags[elt]);
                        rechercheAppliance(allTags[elt])
                        rechercheUstensils(allTags[elt])
                        filterAffichage();
                    }
                    if (allTags.length === 0) {
                        reset();
                        clearArray(tag)
                    }
                };
            }
        }
        function optionsAppliance() {
            let arrayAppliance = []
            for (let i in arrayRecherche) {
                arrayAppliance.push(arrayRecherche[i].appliance)
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
                    rechercheAppliance(option.textContent.toLowerCase());
                    filterAffichage();
                    displaytag(x, backgroundColors[1]);
                }
            }
        };
        function optionsIngredients() {
            let arrayIngredients = []
            for (let i in arrayRecherche) {
                for (let x in arrayRecherche[i].ingredients)
                    arrayIngredients.push(arrayRecherche[i].ingredients[x].ingredient)
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
                    recherche(option.textContent)
                    filterAffichage()
                    displaytag(x, backgroundColors[0])
                    for(let elt in keywordsContainer){keywordsContainer[elt].style.display="none" ;
                    if (window.matchMedia("(min-width: 600px)").matches) {
                        optionsContainers[elt].style.width = "249px"
                      } else {
                        optionsContainers[elt].style.width = "90%"
                      }}
                }
            }
        };

        function optionsUstensiles() {
            let arrayUstensiles = [];
            // On récupère les éléments trovués dans un array
            for (let i in arrayRecherche) {
                for (let x in arrayRecherche[i].ustensils) {
                    arrayUstensiles.push(arrayRecherche[i].ustensils[x]);
                }
            }
            // on filtre les doublons dans les elements trouvés
            let items = arrayUstensiles.filter(function (ele, pos) {
                return arrayUstensiles.indexOf(ele) == pos;
            })
            // on affiche les éléments restants
            for (let x of items) {
                let option = document.createElement("span");
                option.textContent = x;
                option.classList.add("options");
                optionsUst.appendChild(option);
                option.onclick=()=>{
                    rechercheUstensils(option.textContent);
                    filterAffichage();
                    displaytag(x, backgroundColors[2]);
                }
            }
        };
        // Fonction qui gère la création et affichage du tag quand un mot clé est selectionné dans une datalist
        function displaytag(tag, color) {
            // creation et génération des tags
            let btntag = document.createElement("span");
            btntag.classList.add("tagButton");
            btntag.textContent = tag;
            let closeTag = document.createElement("button");
            btntag.style.backgroundColor = color;
            tagContainer.appendChild(btntag);
            btntag.appendChild(closeTag);
            closeTag.classList.add("close-button");
            closeTag.style.backgroundColor = color;
            closeTag.textContent = "X";
            tagContainer.style.display="inline-flex";
            btntag.onclick=()=>{
                tagContainer.removeChild(btntag)
                if(tagContainer.children.length === 0){
                    tagContainer.style.display="none"
                    reset();
                }
                else{
                    for(let elt in tagContainer.children){
                        if(tagContainer.children[elt].textContent != undefined){
                            arrayRecherche = recipes;
                            resultat = [];
                            recherche(tagContainer.children[elt].textContent.slice(0,-1).toLowerCase());
                            if(arrayRecherche.length === 0){rechercheAppliance(tagContainer.children[elt].textContent.slice(0,-1).toLowerCase())};
                            if(arrayRecherche.length === 0){rechercheUstensils(tagContainer.children[elt].textContent.slice(0,-1).toLowerCase())};
                            filterAffichage()
                        }
                    }
                }
            }
        };
        // creation des options par defaut
        optionsAppliance();
        optionsIngredients();
        optionsUstensiles();
        // evenement bouton barre de recherche
        searchButton.onclick = () => {
            if (searchbar.value.length > 2) {
                container.innerHTML = "";
                recherche(searchbar.value);
                filterAffichage();
            }
        };
        // evenements barre de recherche
        searchbar.onkeydown = () => {
            if (searchbar.value.length > 2) {
                container.innerHTML = "";
                recherche(searchbar.value);
                filterAffichage();
            }
            else if (searchbar.value.length < 3) {
                reset();
            }
        };

        for (let i in secondarySearchs) {
            secondarySearchs[i].onkeydown = () => {
                container.innerHTML = "";
                if (secondarySearchs[i].value.length > 2) {
                    if (i == 0) {
                        recherche(secondarySearchs[i].value.toLowerCase())
                        filterAffichage(secondarySearchs[i].value.toLowerCase());
                    }
                    if (i == 1) {
                        rechercheAppliance(secondarySearchs[i].value.toLowerCase())
                        filterAffichage(secondarySearchs[i].value.toLowerCase());
                    }
                    if (i == 2) {
                        rechercheUstensils(secondarySearchs[i].value.toLowerCase())
                        filterAffichage(secondarySearchs[i].value.toLowerCase());
                    }
                }
                else {
                    reset()
                }
            };
        }
        let arrows = document.querySelectorAll(".arrow")
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
    })
    .catch(function (error) {
        console.log(error);
    });
