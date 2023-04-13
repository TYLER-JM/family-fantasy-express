import Standings from '../database/models/Standings.js'

export default {
  async get(req, res) {
    let templateVars = {
      username: req.session.username
    }
    if (!templateVars.username) {
      res.redirect('/login')
    }

    templateVars.standings = await Standings.getStandings()

    res.render('standings', templateVars)
  },
}