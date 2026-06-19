const intelligenceService = require('../services/intelligenceService');

const getAdvisories = async (req, res, next) => {
  try {
    const advisories = await intelligenceService.getAdvisories();
    res.json(advisories);
  } catch (error) {
    next(error);
  }
};

const getCompliance = async (req, res, next) => {
  try {
    const guidance = await intelligenceService.getComplianceGuidance(req.user.role);
    res.json(guidance);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdvisories, getCompliance };
