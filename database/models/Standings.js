import prisma from '../prismaClient.js'
import PredictionHistory from './PredictionHistory.js'

const Standings = {
  async getOwnerPredictions() {

    let ownersWithPredictions = await prisma.owner.findMany({
      select: {
        id: true,
        name: true,
        teamName: true,
        predictions: {where: {NOT: {winOutcome: null}}}
      }
    })
     // I can replace the predictions: [] in the returned data with my own PredictionHistory class
    let ownerPredsMapped = ownersWithPredictions.map(owner => {
      return new PredictionHistory({
        correct: owner.predictions.filter(prediction => prediction.winPrediction === prediction.winOutcome).length,
        total: owner.predictions.length,
        owner
      })
    })
    return ownerPredsMapped

  }

  // async getNhlPoints() {
  //   await prisma.
  // }
}

export default Standings