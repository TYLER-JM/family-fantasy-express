import https from 'https'
import prisma from '../database/prismaClient.js'

let today = new Date()
today.setDate(today.getDate()-1) // (-1) = yesterday
let dateString = today.toLocaleDateString() // "3/23/2023" -- this format also works with the API
const API_URL = `https://statsapi.web.nhl.com/api/v1/schedule?date=${dateString}&expand=schedule.linescore`
const PLACEHOLDER = 'https://jsonplaceholder.typicode.com/users'


https.get(API_URL, res => {
  let data = [];
  const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
  console.log('Status Code:', res.statusCode);
  console.log('Date in Response header:', headerDate);

  res.on('data', chunk => {
    data.push(chunk);
  });

  res.on('end', () => {
    console.log('Response ended: ');
    const response = JSON.parse(Buffer.concat(data).toString());
    for(let game of response.dates[0].games) {
      prisma.event.update({
        where: {id: game.gamePk},
        data: {
          homeTeamScore: game.teams.home.score,
          awayTeamScore: game.teams.away.score,
          overtime: game.linescore.currentPeriod  > 3,
          eventStateId: 3 // completed
        }
      }).then(result => {

        let winningTeamId = result.awayTeamScore > result.homeTeamScore ? result.awayTeamId : result.homeTeamId 
        prisma.prediction.findMany({
          where: {eventId: result.id}
        }).then(predictions => {

          predictions.forEach(pred => {
            prisma.prediction.update({
              where: {id: pred.id},
              data: {winOutcome: pred.teamId == winningTeamId} 
            }).catch(error => console.log('error updating a prediction: ', error))
          })

        }).catch(error => console.log('error finding predictions: ', error))
        console.log(`updated Game ${result.id}: (${result.awayTeamId}) ${result.awayTeamScore} -- ${result.homeTeamScore} (${result.homeTeamId})`)

      }).catch(error => console.log('there was an error updating an event: ', error))
    }
  });
}).on('error', err => {
  console.log('Error during HTTPS call: ', err.message);
});