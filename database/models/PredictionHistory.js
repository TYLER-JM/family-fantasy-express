class PredictionHistory {
  constructor({correct, total, owner}) {
      this.owner = owner
      this.correct = correct
      this.total = total,
      this.getIncorrect = () => (this.total - this.correct),
      this.getPercentage = () => {
        if (this.total > 0) {
          return (this.correct / this.total).toFixed(3)
        }
        return '--'
      },
      this.getFantasyPoints = () => (this.correct * 2 - this.getIncorrect() * 2)
  }
}

export default PredictionHistory