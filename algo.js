
/*
=> affiche les résultats dans l'interface.
=> les 3 selects sont mis a jour avec les résultats. (options = résultats correspondant a la searchbar)
=> utilisateur peut préciser sa recherche en utilisant un des 3 selects
=> Au fur et à mesure du remplissage les mots clés ne correspondant pas à la frappe dans le
champ disparaissent. Par exemple, si l’utilisateur entre “coco” dans la liste d’ingrédients,
seuls vont rester “noix de coco” et “lait de coco”.
L’utilisateur choisit un mot clé dans le champ
Le mot clé apparaît sous forme de tag sous la recherche principale
Les résultats de recherche sont actualisés, ainsi que les éléments disponibles dans les
champs de recherche avancée */

let searchbar = document.getElementById("recherche")
let container = document.querySelector(".recipes-wrapper")
let selectIngr = document.getElementById("select-ingredient")
let selectUst = document.getElementById("select-appareil")
let selectApp = document.getElementById("select-ustensiles")
let tagContainer = document.getElementById("tagSpan")
let filteredArray = []
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
        let resultat = [] // = Résultat de la recherche non filtré (= avec doublons)
        // fonction qui effectue la recherche sur le fichier json et renvoi les valeurs trouvées
        function search(recherche, typ) { return completeData.filter(item => item[typ].includes(recherche)) }
        function search2(recherche, typ) { return completeData.filter(item => item[typ].filter(it => it.ingredient.includes(recherche)).length > 0) }

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
        // SELECT BOX PAR DEFAUT
        function creationOption(select, array) {
            let items = array.filter(function (ele, pos) {
                return array.indexOf(ele) == pos;
            })
            for (let elt of items ) {
                let option = document.createElement("option")
                option.textContent = elt;
                select.appendChild(option)
            }
            clearArray(array)
        }
        // Select BOX Ingrédients
        function defaultSelectIng(select) {
            let arrayTest = []
            for (let i in completeData) {
                for (let x in completeData[i].ingredients)
                    arrayTest.push(completeData[i].ingredients[x].ingredient)
            }
            creationOption(select, arrayTest)
        }
        // Select Box Appliance
        function defaultSelectApp(select) {
            let arrayTest = []
            for (let i in completeData) {
                arrayTest.push(completeData[i].appliance)
            }
            creationOption(select, arrayTest)
        }
        // Select BOX Ustensils
        function defaultSelectUst(select) {
            let arrayTest = []
            for (let i in completeData) {
                for (let x in completeData[i].ustensils) {
                    arrayTest.push(completeData[i].ustensils[x])
                }
            }
            creationOption(select, arrayTest)
        }
        // Reset selectBox display
        function resetSearch() {
            selectApp.innerHTML = ""
            selectIngr.innerHTML = ""
            selectUst.innerHTML = ""
            defaultSelectIng(selectIngr)
            defaultSelectUst(selectUst)
            defaultSelectApp(selectApp)
            clearArray(filteredArray)
        }

        defaultSelectIng(selectIngr)
        defaultSelectUst(selectUst)
        defaultSelectApp(selectApp)

        // fonction qui effectue les recherches, filtre les résultats
        function filterData(recherche) {
            container.innerHTML = ""
            clearArray(resultat)
            searchPush(recherche, "name")
            searchPush(recherche, "description")
            searchPush(recherche, "appliance")
            searchPush2(recherche, "ingredients")
            filteredArray = resultat.filter(function (ele, pos) {
                return resultat.indexOf(ele) == pos;
            })
            return filteredArray
        }
        // fonction qui affiche les résultats et nettoie les select en prévision d'un ajout
        function filterAffichage () {
            for (elt of filteredArray) {
                affiche(elt)
            }
            selectApp.innerHTML=""
            selectIngr.innerHTML=""
            selectUst.innerHTML=""
            optionsAppliance ()
            optionsIngredients ()
            optionsUstensiles ()
        }
        function optionsAppliance () {
            let arrayAppliance = []
            for (let i in filteredArray) {
                arrayAppliance.push(filteredArray[i].appliance)
            }
            let items = arrayAppliance.filter(function (ele, pos) {
                return arrayAppliance.indexOf(ele) == pos;
            })
            for(let x of items){
                let option = document.createElement("option")
                option.textContent=x
                selectApp.appendChild(option)
            }
        }
        function optionsIngredients () {
            let arrayIngredients = []
            for (let i in filteredArray) {
                for (let x in filteredArray[i].ingredients)
                    arrayIngredients.push(filteredArray[i].ingredients[x].ingredient)
            }
            let items = arrayIngredients.filter(function (ele, pos) {
                return arrayIngredients.indexOf(ele) == pos;
            })
            
            for(let x of items){
                let option = document.createElement("option")
                option.textContent=x
                selectIngr.appendChild(option)
            }
        }

        function optionsUstensiles (recherche) {
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
            for(let x of items){
                let option = document.createElement("option")
                option.textContent=x
                selectUst.appendChild(option)
            }
        }

        function tagButton (select) {
            let tag = document.createElement("div")
            tag.classList.add("tagButton")
            tag.textContent = select.value
            tagContainer.appendChild(tag)
            tag.onclick=()=>{tag.style.display="none"}
            while (tagContainer.firstChild) {
                tagContainer.removeChild(tagContainer.firstChild)
            }
        }

        // RECHERCHES // INPUTS.
        // searchBar search / 3 charactères dans la barre de recherche principale (reste à enlever les espaces)
        searchbar.onkeydown = (e) => {
            container.innerHTML = ""
            if (searchbar.value.length > 2) {
                filterData(searchbar.value)
                filterAffichage()
            }
            else if (searchbar.value.length < 2) {
                resetSearch()
            }
        }



        // TO DO
        // select Appliance search
        selectApp.onchange = () => {
            container.innerHTML = ""
            tagButton(selectApp)
        }
        //select ustensils search
        selectUst.onchange = () => {
            container.innerHTML = ""
            tagButton(selectUst)

        }
        //select ingr search (pas fonctionnelle)
        selectIngr.onchange = () => {
            container.innerHTML = ""
            tagButton(selectIngr)
        }
    })
    .catch(function (error) {
        console.log(error);
    });