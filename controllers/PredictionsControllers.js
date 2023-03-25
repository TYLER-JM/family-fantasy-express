import Owner from "../database/models/Owner.js"

export default {
  get (req, res) {
    let templateVars = {
      date: req.params.date,
      username: req.session.username,
    }
    if (!templateVars.username) {
      res.redirect('/login')
    }
    Owner.upcomingGames(req.session.ownerId).then(games => {
      templateVars.games = games
      templateVars.gameDate = new Date()
      return res.render('predictions-create', templateVars)
    }).catch(err => {
      console.log('THERE WAS AN ERROR', err)
      return res.render('dashboard', templateVars)
    })
  },
  post() {

  }
}