import Owner from "../database/models/Owner.js"
import prisma from "../database/prismaClient.js"

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
      console.log('games: ', games)
      templateVars.games = games
      return res.render('predictions-create', templateVars)
    }).catch(err => {
      console.log('THERE WAS AN ERROR', err)
      return res.render('dashboard', templateVars)
    })
  },
  post(req, res) {
    console.log('BODY', req.body)
    for (const gameId in req.body) {
      let [teamId, outcome] = req.body[gameId].split('-')
      // I think I have to CreateMany
      prisma.prediction.create({
        data: {
          ownerId: req.session.ownerId,
          eventId,
          teamId,
          winPrediction: outcome === 'win'
        }
      }).then(result => {
        console.log('created: ', result.id)
        res.redirect('/')
      }).catch(error => {
        console.log("ERROR making prediction: ", error)
        res.redirect('/')
      })
    }
  }
}