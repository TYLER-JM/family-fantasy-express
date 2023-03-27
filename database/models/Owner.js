import prisma from '../prismaClient.js'


const Owner = {
  async upcomingGames(ownerId) {
    //dynamically get start and ends of a date
    // I just accept a date as second parameter so dates further in the future can be got
    let startOfDay = new Date()
    startOfDay.setHours(0,0,0,0)
    let endOfDay = new Date(startOfDay.getTime())
    endOfDay.setHours(23,59,59,999)
    console.log("DAY start/end: ", startOfDay, endOfDay)
    let histories = await prisma.ownerTeamHistory.findMany({
      where: {ownerId: ownerId, endDate: null},
      include: {
        team: {
          include: {
            homeGames: {
              where: {
                scheduledDate: {gte: startOfDay, lte: endOfDay}
              },
              orderBy: {scheduledDate: 'asc'},
              include: {awayTeam: true, homeTeam: true}
            },
            awayGames: {
              where: {
                scheduledDate: {gte: startOfDay, lte: endOfDay}
              },
              orderBy: {scheduledDate: 'asc'},
              include: {homeTeam: true, awayTeam: true}
            }
          }
        }
      }
    })

    let allGames = histories.reduce((all, history) => {
      let game = {}
      if (history.team.homeGames.length) {
        game = {
          homeTeam: history.team.homeGames[0].homeTeam,
          ownedTeam: history.team.homeGames[0].homeTeam,
          awayTeam: history.team.homeGames[0].awayTeam,
          id: history.team.homeGames[0].id,
          date: history.team.homeGames[0].scheduledDate
        }
      } else if (history.team.awayGames.length) {
        game = {
          homeTeam: history.team.awayGames[0].homeTeam,
          ownedTeam: history.team.awayGames[0].awayTeam,
          awayTeam: history.team.awayGames[0].awayTeam,
          id: history.team.awayGames[0].id,
          date: history.team.awayGames[0].scheduledDate
        }
      } else {
        return [...all]
      }
      return [...all, game]
    }, [])
    return allGames
  },

  async createPreditions(ownerId, games) {
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
  }
}

// Owner.upcomingGames(6)
export default Owner