class RiskScoringService {
  constructor() {
    this.weights = {
      'Passwords': 50,
      'Email addresses': 20,
      'Phone numbers': 30,
      'Physical addresses': 40,
      'Bank account numbers': 60,
      'Credit cards': 70,
      'Names': 5,
      'Dates of birth': 15,
      'IP addresses': 10,
      'Usernames': 10,
      'default': 10
    };
  }

  calculateScore(exposedDataTypes) {
    let score = 0;
    exposedDataTypes.forEach(type => {
      // Direct match or partial match for case sensitivity
      const matchedWeight = this.weights[type] || 
                           this.weights[Object.keys(this.weights).find(k => k.toLowerCase() === type.toLowerCase())] || 
                           this.weights.default;
      score += matchedWeight;
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
