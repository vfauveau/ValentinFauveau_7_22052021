let searchbar = document.getElementById("recherche")
let container = document.getElementById("container")
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
function creaR (recette) {
    let parent = document.createElement("div")
    let texteContainer = document.createElement("div")
    let img = document.createElement("img")
    let time = document.createElement("p")
    let title = document.createElement("h3")
    let descr = document.createElement("p")
    let liste = document.createElement("ul")
    title.textContent = recette.name
    time.textContent = recette.time
    descr.textContent = recette.description
    for(let ingr of recette.ingredients){
        let li =document.createElement("li")
        // création des ingrédients dans la liste
        let strong = document.createElement("strong")
        strong.textContent= ingr.ingredient
        li.appendChild(strong)
        liste.appendChild(li)
    }
    parent.appendChild(img)
    texteContainer.appendChild(title)
    texteContainer.appendChild(time)
    texteContainer.appendChild(descr)
    texteContainer.appendChild(liste)
    parent.classList.add("recipe-container")
    parent.appendChild(texteContainer)
    container.appendChild(parent)
}
    fetch("recipes.json")
    .then((resp) => resp.json())
    .then(function(data) {
        let completeData = data.recipes
        let responseID = []
        function search(recherche,typ){return completeData = completeData.filter(item=>item[typ].includes(recherche))}

        searchbar.onchange=()=>{
            if(searchbar.value.length > 2){
                container.innerHTML = ""
                responseID = (search(searchbar.value,"name"))
                for(let elt in responseID){
                    creaR(responseID[elt])
                }
                responseID = (search(searchbar.value,"description"))
                for(let elt in responseID){
                    creaR(responseID[elt])
                }
            }
        }
        // 3 tableaux (titre de la recette, liste d'ingrédients et descriptions de la recette ?)
    })
    .catch(function(error) {
      console.log(error);
    });