const showMoreButton = document.querySelector('#showMore')
showMoreButton.addEventListener('click', showMore)

function showMore(event) {
  fetchGames(event)
}

function fetchGames(event) {
  let tableBody = document.querySelector('#predictionList')
  tableBody.parentNode.insertBefore(loadingElement(), tableBody.nextSibling)
  event.target.disabled = true
  fetch(`/predictions/load/${event.target.dataset.page}`).then(response => response.json()).then(response => {
    ++event.target.dataset.page
    response.forEach(row => {
      tableBody.appendChild(newRow(row))  
    });

    event.target.disabled = false
    document.querySelector('.spinner').remove()
  })
}

function loadingElement() {
  const loadingMessage = document.createElement('div')
  loadingMessage.className = 'spinner'
  loadingMessage.innerHTML = 'Loading...'
  return loadingMessage
}

function newRow(data) {
  const row = document.createElement('tr')

  for (let key in data) {
    const td = document.createElement('td')
    td.innerHTML = data[key]
    row.appendChild(td)
  }

  return row
}