import Owner from "../database/models/Owner.js"

export default {
  get (req, res) {
    let templateVars = {
      username: req.session.username,
    }
    if (!templateVars.username) {
      res.redirect('/login')
      return
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
      return res.redirect('/login')
    }
    Owner.createPredictions(req.session.ownerId, req.body).then(response => {
      req.session.flash = `saved ${response.count} prediction(s)!`
      return res.redirect('/')
    }).catch(error => {
      req.session.flash = `Error occurred, predictions not saved`
      console.log('ERROR DURING predictions: ', error)
      return res.redirect('/')
    })
  },

  loadGames(req, res) {
    let templateVars = {
      username: req.session.username,
    }
    if (!templateVars.username) {
      return res.redirect('/login')
    }
    let addDays = req.params.addDays
    setTimeout(() => {
      Owner.upcomingGames(req.session.ownerId, addDays).then(games => {
        return res.json(games)
      }).catch(err => {
        console.log('THERE WAS AN ERROR', err)
        return res.redirect('/')
      })
    }, 3000);
    
  },

  async list(req, res) {
    let templateVars = {
      username: req.session.username,
    }
    if (!templateVars.username) {
      return res.redirect('/login')
    }
    templateVars.predictions = await Owner.loadPredictions(req.session.ownerId, 0)
    return res.render('predictions-list', templateVars)
  },

  loadPredictions(req, res) {
    let templateVars = {
      username: req.session.username,
    }
    if (!templateVars.username) {
      return res.redirect('/login')
    }
    Owner.loadPredictions(req.session.ownerId, req.params.page).then(predictions => {
      return res.json(predictions)
    }).catch(error => {
      console.log('ERROR LOADING MORE PREDICTIONS: ', error)
      return res.redirect('/')
    })
  }
}