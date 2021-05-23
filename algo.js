
/*
pour chaque *Résultat* ==> afficher Nom & temps de prép / Liste avec pour chaque ingrédients, ingrédient + mesure / description de la recette
    createImage (w380px * 178px) + cadre de description (380 * 136)
*/

/* event.onchange => si search.valeur.length > 3,  ==> recherche correspondant a search.valeur :
    -dans le titre de la recette,
    -la liste des ingrédients de la recette,
    -la description de la recette.
 
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
let valeurRecherche;
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
        strong.textContent = ingr.ingredient
        li.appendChild(strong)
        liste.appendChild(li)
    }
    parent.appendChild(img)
    generalInfo.appendChild(title)
    generalInfo.appendChild(time)
    texteContainer.appendChild(generalInfo)
    texteContainer.appendChild(bloctexte)
    bloctexte.appendChild(liste)
    bloctexte.appendChild(descr)
    parent.appendChild(texteContainer)
    container.appendChild(parent)

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
        let arrayRempli = []
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
        ingredientSelectFiller()
        ustensilSelectFiller()
        applianceSelectFiller()
        /* si une valeur est entrée dans la barre de recherche, et que celle-ci vaut 3 charactères ou +
        on donne la valeur entrée à la variable valeurRecherche et on appelle la fonction search pour voir sil y a des éléments qui correspondent à la valeur recherchée.
        Puis on ajoute au tableau résultat les réponses correspondantes.
        On filtre ce tableau pour n'avoir que des éléments uniques.
        Puis on utilise la fonction d'affichage en passant les éléments du tableau résultat en paramètre.
        Le tableau résultat et l'HTML sont réininitialisés à chaque changements
        */
        function search(recherche, typ) { return completeData.filter(item => item[typ].includes(recherche)) }
        searchbar.onchange = () => {
            container.innerHTML = ""
            if (searchbar.value.length > 2) {
                container.innerHTML = ""
                clearArray(resultat)
                valeurRecherche = searchbar.value
                for (let elt of (search(valeurRecherche, "name"))) {
                    resultat.push(elt)
                }
                for (let elt of (search(valeurRecherche, "description"))) {
                    resultat.push(elt)
                }
                for (let elt of (search(valeurRecherche, "ingredients"))) {
                    resultat.push(elt)
                }
                filteredArray = resultat.filter(function (ele, pos) {
                    return resultat.indexOf(ele) == pos;
                })
                for (elt of filteredArray) {
                    affiche(elt)
                }
            }
        }

    })
    .catch(function (error) {
        console.log(error);
    });