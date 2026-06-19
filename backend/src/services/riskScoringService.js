class RiskScoringService {
  constructor() {
    this.weights = {
      password: 40,
      phone: 20,
      address: 20,
      financial: 50,
      default: 10
    };
  }

  calculateScore(exposedDataTypes) {
    let score = 0;
    exposedDataTypes.forEach(type => {
      score += this.weights[type] || this.weights.default;
    });

    return {
      score: Math.min(score, 100),
      severity: this.getSeverity(score)
    };
  }

  getSeverity(score) {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 30) return 'Medium';
    return 'Low';
  }
}

module.exports = new RiskScoringService();
