import Standings from '../database/models/Standings.js'

export default {
  async get(req, res) {
    let templateVars = {
      username: req.session.username
    }
    if (!templateVars.username) {
      return res.redirect('/login')
    }

    templateVars.standings = await Standings.getStandings()

    return res.render('standings', templateVars)
  },
}