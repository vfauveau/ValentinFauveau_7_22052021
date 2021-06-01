let searchbar = document.getElementById("recherche")
let container = document.querySelector(".recipes-wrapper")
let selectIngr = document.getElementById("select-ingredient")
let selectUst = document.getElementById("select-ustensiles")
let selectApp = document.getElementById("select-appareil")
let tagContainer = document.getElementById("tagSpan")
let arrayRecherche = []
let datalistIngr = document.getElementById("data-list-ingredient")
let datalistApp = document.getElementById("data-list-appareil")
let datalistUst = document.getElementById("data-list-ustensiles")
// clear array
function clearArray(array) {
    array.length = 0
}
// affichage des recettes
function affiche(recette) {
    let parent = document.createElement("div")
    let texteContainer = document.createElement("div")
    let img = document.createElement("img")
    let generalInfo = document.createElement("p")
    let bloctexte = document.createElement("div")
    let time = document.createElement("strong")
    let title = document.createElement("h3")
    let descr = document.createElement("p")
    let liste = document.createElement("ul")
    title.textContent = recette.name
    time.textContent = recette.time + "min"
    descr.textContent = recette.description
    for (let ingr of recette.ingredients) {
        let li = document.createElement("li")
        // création des ingrédients dans la liste
        let strong = document.createElement("strong")
        strong.textContent = ingr.ingredient + " " + (ingr.quantity ? ingr.quantity : "") + " " + (ingr.unit ? ingr.unit : "")
        li.appendChild(strong)
        liste.appendChild(li)
    }
    container.appendChild(parent)
    parent.appendChild(img)
    bloctexte.appendChild(liste)
    bloctexte.appendChild(descr)
    generalInfo.appendChild(title)
    generalInfo.appendChild(time)
    texteContainer.appendChild(generalInfo)
    texteContainer.appendChild(bloctexte)
    parent.appendChild(texteContainer)
    bloctexte.classList.add("recipe-descr-list")
    descr.classList.add("description")
    generalInfo.classList.add("recipe-title")
    parent.classList.add("recipe-container")
    texteContainer.classList.add("recipe-text-container")
}

fetch("recipes.json")
    .then((resp) => resp.json())
    .then(function (data) {
        let completeData = data.recipes
        arrayRecherche = [].concat(completeData)
        let resultat = []

        function reset() {
            arrayRecherche = [].concat(completeData)
            clearArray(resultat)
            container.innerHTML = ""
            datalistApp.innerHTML = ""
            datalistIngr.innerHTML = ""
            datalistUst.innerHTML = ""
            defaultSelectIng(datalistIngr)
            defaultSelectUst(datalistUst)
            defaultSelectApp(datalistApp)
        }
        // fonction de recherche qui cycle dans les éléments et les élimine de la base de données si ils sont validés
        // on effectue 5 recherches (ingredients, nom, ustensiles, appliance, description des recettes)
        function recherche(recherche) {
            for (let x in arrayRecherche) {
                if (arrayRecherche[x].appliance.includes(recherche)) {
                    resultat.push(arrayRecherche[x])
                    arrayRecherche.splice(x, 1)
                }
                if (arrayRecherche[x].name.includes(recherche)) {
                    resultat.push(arrayRecherche[x])
                    arrayRecherche.splice(x, 1)
                }
                if (arrayRecherche[x].description.includes(recherche)) {
                    resultat.push(arrayRecherche[x])
                    arrayRecherche.splice(x, 1)
                }
                for (let i in arrayRecherche[x].ingredients) {
                    if (arrayRecherche[x].ingredients[i].ingredient.includes(recherche)) {
                        resultat.push(arrayRecherche[x])
                        arrayRecherche.splice(x, 1)
                    }
                }
                for (let elt of arrayRecherche[x].ustensils) {
                    if (elt.includes(recherche)) {
                        resultat.push(arrayRecherche[x])
                        arrayRecherche.splice(x, 1)
                    }
                }
            }
            console.log(completeData)
            console.log(arrayRecherche)
            return resultat
        }
        // Fonction qui gère la création et affichage du tag quand un mot clé est selectionné dans une datalist
        function displaytag(tag, color) {
            let btntag = document.createElement("span")
            btntag.textContent = tag
            let tagX = document.createElement("button")
            tagX.textContent = "X"
            btntag.style.backgroundColor = color
            tagContainer.appendChild(btntag)
            btntag.appendChild(tagX)
            tagX.classList.add("xbutton")
            tagX.style.backgroundColor = color
            btntag.classList.add("tagButton")
            btntag.onclick = () => {
                tagContainer.removeChild(btntag)
                reset()
            }
        }
        function emptyResponse() {
            let response = document.createElement("span")
            response.classList.add("spanErreur")
            response.textContent = "Votre recherche ne correspond à aucune de nos recettes. Essayez autre chose ..."
            container.appendChild(response)
        }
        function creationOption(liste, array) {
            let items = array.filter(function (ele, pos) {
                return array.indexOf(ele) == pos;
            })
            for (let elt of items) {
                let option = document.createElement("option")
                option.textContent = elt;
                liste.appendChild(option)
            }
            clearArray(array)
        }
        function defaultSelectIng() {
            let arrayTest = []
            for (let i in completeData) {
                for (let x in completeData[i].ingredients)
                    arrayTest.push(completeData[i].ingredients[x].ingredient)
            }
            creationOption(datalistIngr, arrayTest)
            selectIngr.value = ""
        }
        // Select Box Appliance par defaut
        function defaultSelectApp() {
            let arrayTest = []
            for (let i in completeData) {
                arrayTest.push(completeData[i].appliance)
            }
            creationOption(datalistApp, arrayTest)
            selectApp.value = ""
        }
        // Select BOX Ustensils par defaut
        function defaultSelectUst() {
            let arrayTest = []
            for (let i in completeData) {
                for (let x in completeData[i].ustensils) {
                    arrayTest.push(completeData[i].ustensils[x])
                }
            }
            creationOption(datalistUst, arrayTest)
            selectUst.value = ""
        }
        defaultSelectIng(datalistIngr)
        defaultSelectApp(datalistApp)
        defaultSelectUst(datalistUst)
        // fonction qui affiche les résultats et options filtrées
        function filterAffichage(resultat) {
            for (elt of resultat) {
                affiche(elt)
            }
            if (resultat.length === 0) {
                emptyResponse()
            }
            datalistApp.innerHTML = ""
            datalistIngr.innerHTML = ""
            datalistUst.innerHTML = ""
        }

        // evenements barre de recherche
        searchbar.onkeydown = () => {
            if (searchbar.value.length > 2) {
                container.innerHTML = ""
                recherche(searchbar.value)
                filterAffichage(resultat)
            }
            else if (searchbar.value.length < 2) {
                reset()
            }
        }
        // gestions des sélecteurs de tags
        let selectors = [selectIngr, selectApp, selectUst]
        let backgroundColors = ["#3282F7", "#68D9A4", "#ED6454"]
        // onchange
        for (let i in selectors) {
            selectors[i].onchange = () => {
                container.innerHTML = ""
                if (selectors[i].value !== "") {
                    recherche(selectors[i].value)
                    displaytag(selectors[i].value, backgroundColors[i])
                }
            }
        }
    })
    .catch(function (error) {
        console.log(error);
    });


    /////////////////////////// A faire gestions des tags ou reprendre celle de l'autre programme
