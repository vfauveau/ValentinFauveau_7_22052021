
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
let filteredArray = []
// clear array
function clearArray(array) {
    array.length = 0
}
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
        strong.textContent = ingr.ingredient +" " + (ingr.quantity ? ingr.quantity : "") +" " + (ingr.unit ? ingr.unit : "")
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

    generalInfo.classList.add("recipe-title")
    texteContainer.classList.add("recipe-text-container")
    bloctexte.classList.add("recipe-descr-list")
    parent.classList.add("recipe-container")
    descr.classList.add("description")
}

fetch("recipes.json")
    .then((resp) => resp.json())
    .then(function (data) {
        let completeData = data.recipes
        let resultat = []
        let arrayRempli = [] // = ARRAY QUI CONTIENT LENSEMBLE DES ELEMENTS
        let tableauOptionFiltre = []
        // filtre des tableaux d'options
        function filterOption() {
            tableauOptionFiltre = arrayRempli.filter(function (ele, pos) {
                return arrayRempli.indexOf(ele) == pos;
            })
        }
        // append des tableaux d'options
        function appendOption(select, nombre) {
            for (let i = 0; i < nombre; i++) {
                let option = document.createElement("option")
                option.textContent = tableauOptionFiltre[i]
                select.appendChild(option)
            }
        }
        // ingredients
        function ingredientSelectFiller() {
            for (let i in completeData) {
                for (let x in completeData[i].ingredients) {
                    arrayRempli.push(completeData[i].ingredients[x].ingredient)
                }
            }
            filterOption()
            appendOption(selectIngr, 30)
        }
        // ustensils
        function ustensilSelectFiller() {
            clearArray(arrayRempli)
            for (let i in completeData) {
                for (let x in completeData[i].ustensils) {
                    arrayRempli.push(completeData[i].ustensils[x])
                }
            }
            filterOption()
            appendOption(selectUst, tableauOptionFiltre.length)
        }
        // Appareil
        function applianceSelectFiller() {
            clearArray(arrayRempli)
            for (let i in completeData) {
                arrayRempli.push(completeData[i].appliance)
            }
            filterOption()
            appendOption(selectApp, tableauOptionFiltre.length)
        }

        // fonction qui effectue la recherche sur le fichier json et renvoi les valeurs trouvées
        function search(recherche, typ) { return completeData.filter(item => item[typ].includes(recherche)) }
        function search2(recherche,typ) {return completeData.filter(item=>item[typ].filter(it=>it.ingredient.includes(recherche)).length>0 )}

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

        // fonction qui effectue les recherches, filtre les résultats, et les affiche dans le DOM
        function filterAndAffiche(recherche) {
            container.innerHTML = ""
            clearArray(resultat)
            searchPush(recherche ,"name")
            searchPush(recherche ,"description")
            searchPush(recherche ,"appliance")
            searchPush2(recherche ,"ingredients")
            filteredArray = resultat.filter(function (ele, pos) {
                return resultat.indexOf(ele) == pos;
            })
            for (elt of filteredArray) {
                affiche(elt)
            }
        }

        ingredientSelectFiller()
        ustensilSelectFiller()
        applianceSelectFiller()


        // RECHERCHES // INPUTS.
        // searchBar search / 3 charactères dans la barre de recherche principale (reste à enlever les espaces)
        searchbar.onkeydown = (e) => {
            container.innerHTML = ""
            if (searchbar.value.length > 2) {
                filterAndAffiche(searchbar.value)
            }
        }
        // select Appliance search
        selectApp.onchange = () => {
            container.innerHTML = ""
            filterAndAffiche(selectApp.value)
        }
        //select ustensils search
        selectUst.onchange = () => {
            container.innerHTML = ""
            filterAndAffiche(selectUst.value)
        }
        //select ingr search (pas fonctionnelle)
        selectIngr.onchange = () => {
            container.innerHTML = ""
            filterAndAffiche(selectIngr.value)
        }
    })

    .catch(function (error) {
        console.log(error);
    });