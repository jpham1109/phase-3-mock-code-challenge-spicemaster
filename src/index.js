/*** GLOBAL VARIABLES ***/
const url = 'http://localhost:3000/spiceblends'
const ingredientUrl = 'http://localhost:3000/ingredients'
const updateForm = document.querySelector('form#update-form')
const ingredientForm = document.querySelector('form#ingredient-form')
const ul = document.querySelector('ul.ingredients-list')
const body = document.body
const imagesDiv = document.querySelector('div#spice-images')

/*** HELPER FUNCTIONS ***/

const spiceBlend = (spiceBlendObj) => {
    updateForm.dataset.id = spiceBlendObj.id
    ingredientForm.dataset.id = spiceBlendObj.id
    const img = document.querySelector('img.detail-image')
    img.src = spiceBlendObj.image 

    const h2 = document.querySelector('h2.title')
    h2.textContent = spiceBlendObj.title
    
    ul.innerHTML = ''
    console.log(spiceBlendObj.ingredients)
    spiceBlendObj.ingredients.forEach(ingredient => {
        const li = document.createElement('li')
        li.dataset.id = ingredient.id
        li.textContent = ingredient.name  
        ul.append(li)
    })
}

const renderFirstBlend = () => {
    fetch (`${url}/1`)
    .then(resp => resp.json())
    .then(spiceBlendObj => {
        spiceBlend(spiceBlendObj)
    })
}

const renderOneBlend = (event) => {
    if (event.target.matches('img')){
        const id = event.target.dataset.id
        fetch (`${url}/${id}`)
        .then(resp => resp.json())
        .then(spiceBlendObj => {
            spiceBlend(spiceBlendObj)
        })
    }   
}

const renderAllBlend = () => {
    fetch(url)
    .then(resp => resp.json())
    .then(spiceBlends => {
        
        spiceBlends.forEach(spiceBlend => {
            const divParent = document.createElement('div')
            const img = document.createElement('img')
            img.src = spiceBlend.image
            img.dataset.id = spiceBlend.id
            divParent.append(img)
            imagesDiv.append(divParent)
        })
    })
}

const handleUpdateBlend = (event) => {
    event.preventDefault()
    const newTitle = event.target.title.value
    fetch(`${url}/${event.target.dataset.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({title: newTitle})
    })
    .then(resp => resp.json())
    .then(newValue => {
        const h2 = document.querySelector('h2.title')
        h2.textContent = newTitle
    })
}

const handleAddIngredient = (event) => {
    event.preventDefault()
    const newIngredient = event.target[0].value
    
    const li = document.createElement('li')
    li.textContent = newIngredient
    ul.append(li)
    fetch(ingredientUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify( {
            name: newIngredient,
            spiceblendId: parseInt(event.target.dataset.id)
        })
    })
    .then(resp => resp.json())
    .then( newIngredient=> {
        console.log(newIngredient)
    })
}
/*** EVENT LISTENERS ***/
updateForm.addEventListener('submit', handleUpdateBlend)
ingredientForm.addEventListener('submit', handleAddIngredient)
imagesDiv.addEventListener('click', renderOneBlend)

/*** APP INIT ***/
renderFirstBlend()
renderAllBlend()