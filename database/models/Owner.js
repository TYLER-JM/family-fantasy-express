import prisma from '../prismaClient.js'


const Owner = {
  async upcomingGames(ownerId) {
    //dynamically get start and ends of a date
    let startOfDay = new Date()
    startOfDay.setUTCHours(0,0,0,0)
    let endOfDay = new Date(startOfDay.getTime())
    endOfDay.setUTCHours(23,59,59,999)

    let histories = await prisma.ownerTeamHistory.findMany({
      where: {ownerId: ownerId, endDate: null},
      include: {
        team: {
          include: {
            homeGames: {
              where: {
                scheduledDate: {gte: startOfDay, lte: endOfDay}
              },
              include: {awayTeam: true, homeTeam: true}
            },
            awayGames: {
              where: {
                scheduledDate: {gte: startOfDay, lte: endOfDay}
              },
              include: {homeTeam: true, awayTeam: true}
            }
          }
        }
      }
    })

    let allGames = []
    histories.forEach(history => {
      allGames = [...allGames, ...history.team.homeGames, ...history.team.awayGames]
    });
    return allGames
  }
}

export default Owner