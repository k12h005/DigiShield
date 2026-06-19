let alerts = [];

class AlertRepository {
  async findAllByUserId(userId) {
    return alerts.filter(a => a.userId === userId);
  }

  async create(alertData) {
    const newAlert = {
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'pending',
      ...alertData
    };
    alerts.push(newAlert);
    return newAlert;
  }

  async updateStatus(id, status) {
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      alert.status = status;
      return alert;
    }
    return null;
  }
}

module.exports = new AlertRepository();
