import prisma from '../prismaClient.js'


const Owner = {
  // async getAllOwners() {} // return a list of Ids

  // async getOwnerPoints(ownerId) {} // return an object with wins, OT-losses

  async upcomingGames(ownerId, addDays = 0) {
    //dynamically get start and ends of a date
    // I just accept a date as second parameter so dates further in the future can be got

    // for development, using April 11, 12, 13 for getting events
    let startOfDay = new Date('2023-04-11T03:00:00.000Z')
    // let startOfDay = new Date()
    startOfDay.setDate(startOfDay.getDate() + Number(addDays))
    // startOfDay.setHours(0,0,0,0) // commented out for development
    let endOfDay = new Date(startOfDay.getTime())
    endOfDay.setHours(23,59,59,999)
    console.log('TIMEFRAME: ', startOfDay, endOfDay)
    let histories = await prisma.ownerTeamHistory.findMany({
      where: {ownerId: ownerId, endDate: null},
      include: {
        team: {
          include: {
            homeGames: {
              where: {
                scheduledDate: {gte: startOfDay, lte: endOfDay},
              },
              orderBy: {scheduledDate: 'asc'},
              include: {awayTeam: true, predictions: {where: {ownerId: ownerId}}}
            },
            awayGames: {
              where: {
                scheduledDate: {gte: startOfDay, lte: endOfDay}
              },
              orderBy: {scheduledDate: 'asc'},
              include: {homeTeam: true, predictions: {where: {ownerId: ownerId}}}
            }
          }
        }
      }
    })
    console.log('histories: ', histories)

    let allGames = histories.reduce((all, history) => {
      let game = {}
      let startTime;
      let now = new Date()
      if (history.team.homeGames.length) {

        let gameId = history.team.homeGames[0].id
        let homeGame  = history.team.homeGames[0]
        startTime = history.team.homeGames[0].scheduledDate
        if ((all.hasOwnProperty(gameId) && startTime > now) && (!homeGame.predictions.length)) {
          let options = {
            ...all[gameId].options,
            [history.team.id + '-win']: `${history.team.name} to win`,
            [history.team.id + '-lose']: `${history.team.name} to lose`
          }
          return {...all, [gameId]: {...all[gameId], options}}
        }
        game = {
          homeTeam: history.team.name,
          awayTeam: history.team.homeGames[0].awayTeam.name,
          date: history.team.homeGames[0].scheduledDate
        }
        if (startTime > now) {
          game.options = {
            [history.team.id + '-win']: `${history.team.name} to win`, 
            [history.team.id + '-lose']: `${history.team.name} to lose` 
          }
        } 
        game.prediction = homeGame.predictions.length
        return {...all, [gameId]: game}

      } else if (history.team.awayGames.length) {

        let gameId = history.team.awayGames[0].id
        let awayGame = history.team.awayGames[0]
        startTime = history.team.awayGames[0].scheduledDate
        if ((all.hasOwnProperty(gameId) && startTime > now) && (!awayGame.predictions.length)) {
          let options = {
            ...all[gameId].options,
            [history.team.id + '-win']: `${history.team.name} to win`,
            [history.team.id + '-lose']: `${history.team.name} to lose`
          }
          return {...all, [gameId]: {...all[gameId], options}}
        }
        game = {
          homeTeam: history.team.awayGames[0].homeTeam.name,
          awayTeam: history.team.name,
          date: history.team.awayGames[0].scheduledDate
        }
        if (startTime > now) {
          game.options = {
            [history.team.id + '-win']: `${history.team.name} to win`, 
            [history.team.id + '-lose']: `${history.team.name} to lose` 
          }
        }
        game.prediction = awayGame.predictions.length
        return {...all, [gameId]: game}

      } else {

        return {...all}

      }

    }, {})
    return allGames

  },

  async createPredictions(ownerId, games) {
    let data = Object.entries(games).filter(([,value]) => value).map(([eventId, value]) => {
      let [teamId, outcome] = value.split('-')
        return {
            ownerId,
            teamId: Number(teamId),
            eventId: Number(eventId),
            winPrediction: outcome === 'win',
        }
    })
    try {
      return await prisma.prediction.createMany({
        data
      })
    } catch (error) {
      console.log('ERROR saving predictions: ', error)
    } 
  },

}

export default Owner