import Owner from "../database/models/Owner.js"

export default {
  get (req, res) {
    let templateVars = {
      username: req.session.username,
    }
    if (!templateVars.username) {
      res.redirect('/login')
    }
    Owner.upcomingGames(req.session.ownerId).then(games => {
      templateVars.games = games
      return res.render('predictions-create', templateVars)
    }).catch(err => {
      console.log('THERE WAS AN ERROR', err)
      return res.redirect('/')
    })
  },

  post(req, res) {
    let templateVars = {
      username: req.session.username,
    }
    if (!templateVars.username) {
      res.redirect('/login')
    }
    Owner.createPredictions(req.session.ownerId, req.body).then(response => {
      req.session.flash = `saved ${response.count} prediction(s)!`
      res.redirect('/')
    }).catch(error => {
      req.session.flash = `Error occurred, predictions not saved`
      console.log('ERROR DURING predictions: ', error)
      res.redirect('/')
    })
  },

  load(req, res, app) {
    let templateVars = {
      username: req.session.username,
    }
    if (!templateVars.username) {
      res.redirect('/login')
    }
    let addDays = req.params.addDays
    Owner.upcomingGames(req.session.ownerId, addDays).then(games => {
      let gameInputs = Object.entries(games).map(([gameId, game]) => {
        templateVars = {game, gameId}
        let guac = app.render('partials/game', templateVars)
        return guac
      })
      return res.json(gameInputs)
    }).catch(err => {
      console.log('THERE WAS AN ERROR', err)
      return res.redirect('/')
    })
  }
}