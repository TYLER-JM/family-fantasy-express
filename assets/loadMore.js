const loadMoreButton = document.querySelector('#loadMore')

loadMoreButton.addEventListener('click', loadMoreGames)
loadMoreButton.dataset.addDays = 1

function loadMoreGames(event) {
  if (event.target.dataset.addDays >= 4) {
    loadMoreButton.removeEventListener('click', loadMoreGames)
    loadMoreButton.disabled = true
    loadMoreButton.innerHTML = 'slow down there partner!'
  } else {
    fetchGames(event)
  }
}
function fetchGames(event) {
  let lastChild = document.querySelector('#predictionsForm p:last-of-type')

  lastChild.parentNode.insertBefore(loadingElement(), lastChild.nextSibling)
  event.target.disabled = true
  fetch(`/games/load/${event.target.dataset.addDays}`).then(response => response.json()).then(response => {

    ++event.target.dataset.addDays

    document.querySelector('.spinner').remove()
    if (Object.entries(response).length > 0) {
      for (let gameId in response) {
        lastChild.parentNode.insertBefore(newGameInput(response[gameId]), lastChild.nextSibling)
      }
    } else {
      lastChild.parentNode.insertBefore(noGamesMessage(event.target.dataset.addDays), lastChild.nextSibling)
    }
    event.target.disabled = false
  })
}

function loadingElement() {
  const loadingMessage = document.createElement('div')
  loadingMessage.className = 'spinner'
  loadingMessage.innerHTML = 'Loading...'
  return loadingMessage
}

function newGameInput(game) {
  const wrapper = document.createElement('p')
  const label = document.createElement('label')
  label.innerHTML = `${game.awayTeam} @ ${game.homeTeam} `
  
  const dateTag = document.createElement('span')
  dateTag.innerHTML = new Date(game.date).toDateString()
  dateTag.className = 'tag is-small'

  label.appendChild(dateTag)

  if (game.prediction) {
    const alreadyBet = document.createElement('span')
    alreadyBet.innerHTML = "You've already bet on this"
    alreadyBet.className = 'tag is-small'
    label.appendChild(alreadyBet)
  } else if (game.options) {
    label.appendChild(returnSelectAndOptions(game))
  } else {
    const gameStarted = document.createElement('span')
    gameStarted.innerHTML = 'game has already started'
    gameStarted.className = 'tag is-small'
    label.appendChild(gameStarted)
  }
  wrapper.appendChild(label)
  return wrapper
}

function returnSelectAndOptions(game) {
  const select = document.createElement('select')
  select.name = game.id
  const firstOption = document.createElement('option')
  firstOption.value = ""
  firstOption.innerHTML = "no predictions"
  select.appendChild(firstOption)

  for (let optionId in game.options) {
    const option = document.createElement('option')
    option.value = optionId
    option.innerHTML = game.options[optionId]
    select.appendChild(option)
  }
  return select
}

function noGamesMessage(daysFromNow) {
  const noGameElement = document.createElement('p')
  noGameElement.className = 'is-center bg-dark text-white'
  // const emptyDate = new Date()
  const emptyDate = new Date('2023-04-11') // for development
  emptyDate.setDate(emptyDate.getDate() + Number(daysFromNow))
  noGameElement.innerHTML = `No games on: ${emptyDate.toDateString()}`
  return noGameElement
}