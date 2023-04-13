class EventStats {
  constructor({wins, losses, ot, total}) {
    this.wins = wins,
    this.losses = losses,
    this.ot = ot,
    this.total = total
  }
  getTotalNhlPoints() {
    return (this.wins * 2) + this.ot
  }
  getWinPercentage() {
    return (this.wins / this.total).toFixed(3)
  }

}

export default EventStats