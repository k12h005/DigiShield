const fs = require('fs');
const path = require('path');

class BreachIntelligenceService {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data/breaches.json');
    this.cache = null;
    this.lastLoad = null;
  }

  loadBreaches() {
    try {
      // Simple cache for 5 minutes
      if (this.cache && this.lastLoad && (Date.now() - this.lastLoad < 300000)) {
        return this.cache;
      }

      const rawData = fs.readFileSync(this.dataPath, 'utf8');
      this.cache = JSON.parse(rawData);
      this.lastLoad = Date.now();
      return this.cache;
    } catch (error) {
      console.error('[BreachIntelligence] Error loading breaches:', error);
      return [];
    }
  }

  getAllBreaches() {
    return this.loadBreaches();
  }

  getBreachByName(name) {
    const breaches = this.loadBreaches();
    return breaches.find(b => b.Name.toLowerCase() === name.toLowerCase());
  }

  searchBreaches(query) {
    const breaches = this.loadBreaches();
    const q = query.toLowerCase();
    return breaches.filter(b => 
      (b.Name && b.Name.toLowerCase().includes(q)) || 
      (b.Domain && b.Domain.toLowerCase().includes(q)) ||
      (b.Description && b.Description.toLowerCase().includes(q))
    );
  }

  getAnalytics() {
    const breaches = this.loadBreaches();
    
    // Count common data classes exposed
    const dataClassCounts = {};
    breaches.forEach(b => {
      if (b.DataClasses) {
        b.DataClasses.forEach(dc => {
          dataClassCounts[dc] = (dataClassCounts[dc] || 0) + 1;
        });
      }
    });

    // Formatting for Recharts
    const mostCommonData = Object.entries(dataClassCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Proxy Severity based on PwnCount since it's missing in the JSON
    const getSeverity = (pwnCount) => {
      if (pwnCount > 10000000) return 'Critical';
      if (pwnCount > 1000000) return 'High';
      if (pwnCount > 100000) return 'Medium';
      return 'Low';
    };

    const severityDistribution = [
      { name: 'Critical', value: breaches.filter(b => getSeverity(b.PwnCount) === 'Critical').length },
      { name: 'High', value: breaches.filter(b => getSeverity(b.PwnCount) === 'High').length },
      { name: 'Medium', value: breaches.filter(b => getSeverity(b.PwnCount) === 'Medium').length },
      { name: 'Low', value: breaches.filter(b => getSeverity(b.PwnCount) === 'Low').length }
    ];

    return {
      totalBreaches: breaches.length,
      totalPwnCount: breaches.reduce((sum, b) => sum + (b.PwnCount || 0), 0),
      mostCommonData,
      severityDistribution
    };
  }

  calculateRiskScore(dataClasses) {
    let score = 0;
    const weights = {
      'Passwords': 50,
      'Email addresses': 20,
      'Phone numbers': 30,
      'Physical addresses': 40,
      'IP addresses': 15,
      'Usernames': 10,
      'Names': 5
    };

    dataClasses.forEach(dc => {
      score += weights[dc] || 10;
    });

    const normalizedScore = Math.min(score, 100);
    return {
      score: normalizedScore,
      severity: normalizedScore > 80 ? 'Critical' : normalizedScore > 50 ? 'High' : normalizedScore > 25 ? 'Medium' : 'Low'
    };
  }

  getDashboardStats() {
    const analytics = this.getAnalytics();
    const critical = analytics.severityDistribution.find(s => s.name === 'Critical');
    
    return {
      totalIntelligenceRecords: analytics.totalBreaches,
      globalImpactEstimate: analytics.totalPwnCount,
      criticalAlertsActive: critical ? critical.value : 0,
      latestBreach: this.loadBreaches().sort((a, b) => new Date(b.BreachDate) - new Date(a.BreachDate))[0]
    };
  }
}

module.exports = new BreachIntelligenceService();
