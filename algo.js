let searchbar = document.getElementById("recherche")
let container = document.querySelector(".recipes-wrapper")
let selectIngr = document.getElementById("select-ingredient")
let selectUst = document.getElementById("select-ustensiles")
let selectApp = document.getElementById("select-appareil")
let tagContainer = document.getElementById("tagSpan")
let filteredArray = []
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
        filteredArray = completeData
        let resultat = [] // = Résultat de la recherche non filtré (= avec doublons)
        // fonction qui effectue la recherche sur le fichier json et renvoi les valeurs trouvées
        function search(recherche, typ) { return filteredArray.filter(item => item[typ].includes(recherche)) }
        function search2(recherche, typ) { return  filteredArray.filter(item => item[typ].filter(it => it.ingredient.includes(recherche)).length > 0) }
        function search3(recherche, typ) { return  filteredArray.filter(item => item[typ].filter(it => it.includes(recherche)).length > 0) }
        // opérations = vérifier que la valeur entrée est dans les noms si oui, enleve l'objet du filteredArray et l'ajoute au résultat. 
        // Quand plus aucun élément ne correspond ==> procède à la recherche sur la description pour chaque element restant. 
        // Quand plus aucun élément ne correspond ==> procède à la recherche sur les ingrédients sur les éléments restants
        // on push les valeurs trouvées par le search dans un tableau résultat
        function searchPush(recherche, typ) {
            for (let elt of (search(recherche, typ))) {
                resultat.push(elt)
            }
        }
        function searchPush2(recherche, typ) {
            for (let elt of (search2(recherche, typ))) {
                resultat.push(elt)
            }
        }
        function searchPush3(recherche, typ) {
            for (let elt of (search3(recherche, typ))) {
                resultat.push(elt)
            }
        }
        // SELECT BOX PAR DEFAUT
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
        // Select BOX Ingrédients par defaut
        function defaultSelectIng(liste) {
            let arrayTest = []
            for (let i in completeData) {
                for (let x in completeData[i].ingredients)
                    arrayTest.push(completeData[i].ingredients[x].ingredient)
            }
            creationOption(liste, arrayTest)
            selectIngr.value = ""
        }
        // Select Box Appliance par defaut
        function defaultSelectApp(liste) {
            let arrayTest = []
            for (let i in completeData) {
                arrayTest.push(completeData[i].appliance)
            }
            creationOption(liste, arrayTest)
            selectApp.value = ""
        }
        // Select BOX Ustensils par defaut
        function defaultSelectUst(liste) {
            let arrayTest = []
            for (let i in completeData) {
                for (let x in completeData[i].ustensils) {
                    arrayTest.push(completeData[i].ustensils[x])
                }
            }
            creationOption(liste, arrayTest)
            selectUst.value=""
        }
        // Reset selectBox display
        function resetSearch() {
            datalistApp.innerHTML = ""
            datalistIngr.innerHTML = ""
            datalistUst.innerHTML = ""
            container.innerHTML=""
            filteredArray = completeData
            defaultSelectIng(datalistIngr)
            defaultSelectUst(datalistUst)
            defaultSelectApp(datalistApp)
        }

        defaultSelectIng(datalistIngr)
        defaultSelectUst(datalistUst)
        defaultSelectApp(datalistApp)

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
        }
        // fonction qui affiche les résultats, vide les data list et les remplis avec les mots clés correspondants à l'entrée de l'utilisateur
        function filterAffichage() {
            for (elt of filteredArray) {
                affiche(elt)
            }
            if(filteredArray.length === 0){
                emptyResponse()
            }
            datalistApp.innerHTML = ""
            datalistIngr.innerHTML = ""
            datalistUst.innerHTML = ""
            optionsAppliance()
            optionsIngredients()
            optionsUstensiles()
        }
        function optionsAppliance() {
            let arrayAppliance = []
            for (let i in filteredArray) {
                arrayAppliance.push(filteredArray[i].appliance)
            }
            let items = arrayAppliance.filter(function (ele, pos) {
                return arrayAppliance.indexOf(ele) == pos;
            })
            
            for (let x of items) {
                let option = document.createElement("option")
                option.textContent = x
                datalistApp.appendChild(option)
            }
        }
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
                let option = document.createElement("option")
                option.textContent = x
                datalistIngr.appendChild(option)
            }
        }

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
                let option = document.createElement("option")
                option.textContent = x
                datalistUst.appendChild(option)
            }
        }

        // Fonction qui gère la création et affichage du tag quand un mot clé est selectionné dans une datalist
        function displaytag(tag, color) {
            let btntag = document.createElement("span")
            btntag.textContent = tag
            let tagX = document.createElement("button")
            tagX.textContent = "X"
            btntag.style.backgroundColor= color
            tagContainer.appendChild(btntag)
            btntag.appendChild(tagX)
            tagX.classList.add("xbutton")
            tagX.style.backgroundColor = color
            btntag.classList.add("tagButton")
            btntag.onclick = () => {
                tagContainer.removeChild(btntag)
                resetSearch()
            }
        }
        // cas où il n'y a pas de résultat
        function emptyResponse () {
            let response = document.createElement("span")
            response.textContent="Votre recherche ne correspond à aucune réponse. Essayez autre chose ..."
            container.appendChild(response)
        }
        // RECHERCHES // INPUTS.
        // searchBar search / 3 charactères dans la barre de recherche principale (reste à enlever les espaces)
        searchbar.onkeydown = () => {
            container.innerHTML = ""
            if (searchbar.value.length > 2) {
                filterData(searchbar.value)
                filterAffichage(searchbar.value)
            }
            else if (searchbar.value.length < 2) {
                resetSearch()
            }
        }

        let selectors = [selectIngr, selectApp , selectUst]
        let backgroundColors = ["#3282F7", "#68D9A4", "#ED6454"]

        // onchange
        for (let i in selectors) {
            selectors[i].onchange = () => {
                container.innerHTML = ""
                if(selectors[i].value !== ""){ // à demander si bonne pratique
                    filterData(selectors[i].value)
                    filterAffichage(selectors[i].value)
                    displaytag(selectors[i].value, backgroundColors[i])
                }
            }
        }
    })

    .catch(function (error) {
        console.log(error);
    });