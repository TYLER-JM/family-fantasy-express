console.log('more predictions loader!')

const showMoreButton = document.querySelector('#showMore')
showMoreButton.addEventListener('click', showMore)
showMoreButton.dataset.page = 0 //zero index because 'skip' uses page * 10 to determine how many items to skip

function showMore(event) {
  console.log('you want more rows')

  fetchGames(event)
}

function fetchGames(event) {
  let tableBody = document.querySelector('#predictionList')
  tableBody.parentNode.insertBefore(loadingElement(), tableBody.nextSibling)
  event.target.disabled = true
  fetch(`/predictions/load/${event.target.dataset.page}`).then(response => response.json()).then(response => {
    ++event.target.dataset.page
    console.log('response', response)
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