const alertRepository = require('../repositories/alertRepository');

const getAlerts = async (req, res, next) => {
  try {
    const alerts = await alertRepository.findAllByUserId(req.user.id);
    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

const updateAlertStatus = async (req, res, next) => {
  try {
    const alert = await alertRepository.updateStatus(req.params.id, req.body.status);
    res.json(alert);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  updateAlertStatus
};
