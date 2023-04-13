import prisma from '../prismaClient.js'
import PredictionsStats from './PredictionStats.js'
import EventStats from './EventStats.js'

const Standings = {
  EVENT_COMPLETE: 3,

  async getOwnerAndPredictions(ownerId) {

    return await prisma.owner.findFirst({
      where: {id: ownerId},
      select: {
        id: true,
        name: true,
        teamName: true,
        predictions: {where: {NOT: {winOutcome: null}}}
      }
    })

  },

  async getStandings() {
    let ownerNhlPoints = await this.getOwnerNhlPoints()
    let standingsArray = await this.combineOwnerPointsAndPredictions(ownerNhlPoints)
    return standingsArray.sort(this.sortStandings)
  },

  sortStandings(a, b) {
    return (b.eventStats.getTotalNhlPoints() + b.predictions.getFantasyPoints()) - (a.eventStats.getTotalNhlPoints() + a.predictions.getFantasyPoints())
  },

  async combineOwnerPointsAndPredictions(ownerNhlPoints) {
    let standingsArray = []
    for (let ownerPoints of ownerNhlPoints) {
      let owner = await this.getOwnerAndPredictions(Number(ownerPoints.owner))
      let ownerStats = {owner: owner}
      ownerStats.eventStats = new EventStats(ownerPoints)
      ownerStats.predictions = new PredictionsStats({
        correct: owner.predictions.filter(prediction => prediction.winPrediction === prediction.winOutcome).length,
        total: owner.predictions.length,
      })
      standingsArray.push(ownerStats)
    }
    return standingsArray
  },

  async getOwnerNhlPoints() {
    let ownerTeamTotals = await this.getTeamPointsMappedToOwner()
    return this.getOwnerPointsSummed(ownerTeamTotals)
  },


  async getTeamPointsMappedToOwner() {
    let allHistories = await this.allHistories()

    return allHistories.reduce(async (promisedObject, history) => {
      let games = await this.getGamesWithinHistory(history)
      let returnObject = await promisedObject

      let stats = games.reduce((stats, game) => {
        let win = (game.homeTeamId === history.teamId && game.homeTeamScore > game.awayTeamScore) ||
          (game.awayTeamId === history.teamId && game.awayTeamScore > game.homeTeamScore);

        let loss = (game.homeTeamId === history.teamId && game.homeTeamScore < game.awayTeamScore && !game.overtime) ||
          (game.awayTeamId === history.teamId && game.awayTeamScore < game.homeTeamScore && !game.overtime);

        let ot = (game.homeTeamId === history.teamId && game.homeTeamScore < game.awayTeamScore && game.overtime) ||
          (game.awayTeamId === history.teamId && game.awayTeamScore < game.homeTeamScore && game.overtime);

        if (win) {
          return {...stats, wins: ++stats.wins}
        } else if (loss) {
          return {...stats, losses: ++stats.losses}
        } else if (ot) {
          return {...stats, ot: ++stats.ot}
        }
      // }, {wins: 0, losses: 0, ot: 0, total: games.length, teamName: history.team.name})
      }, {wins: 0, losses: 0, ot: 0, total: games.length})

      let allStats = returnObject[history.ownerId] ? [...returnObject[history.ownerId], stats] : [stats]
      return {
        ...returnObject,
        [history.ownerId]: allStats
      }
    }, {})

  },

  getOwnerPointsSummed(ownerTeamTotals) {
    // let ownersObject = {} 
    let ownersArray = []
    for (let ownerId in ownerTeamTotals) {
      let ownerTotals = ownerTeamTotals[ownerId].reduce((returnObject, team) => {
        return {
          owner: ownerId,
          wins: returnObject.wins + team.wins,
          losses: returnObject.losses + team.losses,
          ot: returnObject.ot + team.ot,
          total: returnObject.total + team.total
        }
      }, {wins: 0, losses: 0, ot: 0, total: 0})
      // ownersObject[ownerId] = ownerTotals
      ownersArray.push(ownerTotals)
    }

    // return ownersObject
    return ownersArray
  },


  async allHistories() {
    let activeHistories = await this.getActiveHistories()
    let pastHistories = await this.getPastHistories()
    return [...activeHistories, ...pastHistories]
  },

  async getActiveHistories() {
    return await prisma.ownerTeamHistory.findMany({
      where: {endDate: null},
      include: {team: true}
    })
  },

  async getPastHistories() {
    return await prisma.ownerTeamHistory.findMany({
      where: {NOT: {endDate: null}},
      include: {team: true}
    })
  },

  async getGamesWithinHistory(history) {
    if (history.endDate) {
      return await prisma.event.findMany({
        where: {
          eventStateId: {equals: this.EVENT_COMPLETE},
          AND: [
            {scheduledDate: {gte: history.startDate}},
            {scheduledDate: {lte: history.endDate}}
          ],
          OR: [
            {homeTeamId: {equals: history.teamId}},
            {awayTeamId: {equals: history.teamId}}
          ]
        }
      })
    }
    return await prisma.event.findMany({
      where: {
        eventStateId: {equals: this.EVENT_COMPLETE},
        scheduledDate: {gte: history.startDate},
        OR: [
          {homeTeamId: {equals: history.teamId}},
          {awayTeamId: {equals: history.teamId}}
        ]
      }
    })
  },

}

export default Standings