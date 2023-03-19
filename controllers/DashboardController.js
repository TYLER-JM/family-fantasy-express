import Owner from "../database/models/Owner.js"

export default {
   get(req, res) {
    let templateVars = {
      username: req.session.username
    }
    if (!templateVars.username) {
      res.redirect('/login')
    }
    Owner.upcomingGames(req.session.ownerId).then(games => {
      // histories.forEach(history => {
      //   allGames = [...allGames, ...history.team.awayGames, ...history.team.homeGames]
      // });
      templateVars.games = games
      return res.render('dashboard', templateVars)
    }).catch(err => {
      console.log('THERE WAS AN ERROR', err)
      return res.render('dashboard', templateVars)
    })
  },
}