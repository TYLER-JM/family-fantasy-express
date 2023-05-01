class PredictionsStats {
  constructor({correct, total}) {
      this.correct = correct
      this.total = total
    }
    getIncorrect = () => (this.total - this.correct)
    getPercentage = () => {
      if (this.total > 0) {
        return (this.correct / this.total).toFixed(3)
      }
      return '--'
    }
    getFantasyPoints = () => (this.correct * 2 - this.getIncorrect() * 2)
}

export default PredictionsStats