class RecommendationService {
  getRecommendations(exposedDataTypes) {
    const recommendations = [];

    if (exposedDataTypes.includes('password')) {
      recommendations.push('Change your password immediately.', 'Enable Multi-Factor Authentication (MFA).');
    }
    
    if (exposedDataTypes.includes('phone')) {
      recommendations.push('Monitor for suspicious SMS or calls.', 'Contact your telecom provider to lock your SIM.');
    }

    if (exposedDataTypes.includes('financial')) {
      recommendations.push('Contact your bank to freeze affected accounts.', 'Monitor your credit report for unauthorized activity.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Monitor your account for any unusual activity.');
    }

    return recommendations;
  }
}

module.exports = new RecommendationService();
