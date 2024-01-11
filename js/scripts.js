const containerCard = document.getElementById('container-card')

const prevPage = document.getElementById('prevPage')
const nextPage = document.getElementById('nextPage')

const filter = document.getElementById('filter')

let search = false
let nameSearch = ''

let currentPage = 1
let totalPages = 1

if (filter === null) {
    search = false
}

//get name of last episode

async function getLastEpisode(ep) {
    try {
        const response = await api.get(`/episode/${ep}`)
        const episodeName = response.data.name
        return episodeName
    } catch (e) {
        console.log('Error', e)
    }

}

//event keyup for search

filter.addEventListener('keyup', e => {
    const nameCharacter = e.target.value
    nameSearch = nameCharacter
    fetchCharacters(currentPage, nameSearch)
    search = true

})

//fetch characters

async function fetchCharacters(page, characterName) {
    try {
        const params = {
            page
        }

        let response = ''
        if (search === false) {
            response = await api.get(`/character`, { params })
            
        } else if (search === true) {
            response = await api.get(`/character/?name=${characterName}`, { params })
        }

        const character = response.data.results
        console.log(character)
        totalPages = response.data.info.pages

        containerCard.innerHTML = ''

        character.forEach(async character => {
            const characterCard = document.createElement('article')
            characterCard.classList.add('card')

            let lastEpisode = character.episode.length

            let statusCharacter = ''
            if (character.status === 'Alive') {
                statusCharacter = 'Vivo'
            } else if (character.status === 'Dead') {
                statusCharacter = 'Morto'
            } else if (character.status === 'unknown') {
                statusCharacter = 'Desconhecido'
            }

            characterCard.innerHTML = `
        <img class="img-character" src="${character.image}" alt="Image of character">
        <div class="info-character">
            <div>
                <h3 class="character-title">${character.name}</h3>
                <span class="character-sub-title"><span class="status-character ${statusCharacter}"></span>${statusCharacter} - ${character.species}</h3>
            </div>
            <div>
                <p>Última localização conhecida:</p>
                <h3 class="character-sub-title">${character.location.name}</h3>
            </div>
            <div>
                <p>Visto a última vez em:</p>
                <h3 class="character-sub-title">${await getLastEpisode(lastEpisode)}</h3>
            </div>
        `

            containerCard.appendChild(characterCard)

        })

        if (character.length === 0) {
            const h3 = document.createElement('h3')
            h3.textContent = 'Nenhum personagem encontrado.'
            containerCard.appendChild(h3)
        }


    } catch (e) {
        console.log('Error', e)
    }

}

fetchCharacters(currentPage, nameSearch)


//fetch informations footer

async function fectchInformations() {
    try {
        const characters = await api.get(`/character`)
        const locations = await api.get(`/location`)
        const episodes = await api.get(`/episode`)

        const infoApi = document.getElementById('info-api')

        infoApi.innerHTML += `
                <p class="info-text">PERSONAGENS: ${characters.data.info.count}</p>
                <p class="info-text">LOCALIZAÇÕES: ${locations.data.info.count}</p>
                <p class="info-text">EPISÓDIOS: ${episodes.data.info.count}</p>
            `


    } catch (e) {
        console.log('Error', e)
    }
}

fectchInformations()

//events for prev and next page

prevPage.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--
        fetchCharacters(currentPage, nameSearch)
        
    }
})

nextPage.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;

        fetchCharacters(currentPage, nameSearch)

    }
})
