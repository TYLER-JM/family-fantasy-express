import prisma from '../prismaClient.js'


const Owner = {
  async seed(props) {
    await prisma.owner.create({
      data: {
        name: props.name,
        teams: {
          create: props.teams
        }
      }
    })
  },
  async findMany() {
    return await prisma.owner.findMany({
      include: {
        teams: true
      }
    })
  }
}

export default Owner