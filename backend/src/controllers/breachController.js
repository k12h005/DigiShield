const breachIntelligenceService = require('../services/BreachIntelligenceService');

const getAllBreaches = async (req, res, next) => {
  try {
    const breaches = breachIntelligenceService.getAllBreaches();
    res.json(breaches);
  } catch (error) {
    next(error);
  }
};

const getBreachByName = async (req, res, next) => {
  try {
    const breach = breachIntelligenceService.getBreachByName(req.params.name);
    if (!breach) return res.status(404).json({ message: 'Breach not found' });
    res.json(breach);
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = breachIntelligenceService.getAnalytics();
    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const stats = breachIntelligenceService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBreaches,
  getBreachByName,
  getAnalytics,
  getDashboard
};
