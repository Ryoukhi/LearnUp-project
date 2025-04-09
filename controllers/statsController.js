const { User, Inscription, SessionFormation } = require('../models');
const sequelize = require('sequelize');

module.exports = {
  getStudentCount: async (req, res) => {
    try {
      const count = await User.count({ where: { role: 'apprenant' } });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTeacherCount: async (req, res) => {
    try {
      const count = await User.count({ where: { role: 'formateur' } });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSessionCount: async (req, res) => {
    try {
      const count = await SessionFormation.count({ 
        where: { status: 'en_cours' } 
      });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getDailySubscriptions: async (req, res) => {
    try {
      const subscriptions = await Inscription.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('dateInscription')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: { status: 'active' },
        group: [sequelize.fn('DATE', sequelize.col('dateInscription'))],
        order: [[sequelize.fn('DATE', sequelize.col('dateInscription')), 'ASC']],
        raw: true
      });
      
      // Format data consistently
      const formattedData = subscriptions.map(item => ({
        date: item.date,
        count: parseInt(item.count) || 0
      }));
      
      res.json(formattedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getLearnerRegistrations: async (req, res) => {
    // Development mode - return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockData = [];
      const now = new Date();
      
      // Generate 90 days of registration data
      for (let i = 0; i < 90; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - (90 - i));
        
        mockData.push({
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 6) // Random count 0-5
        });
      }
      
      return res.json(mockData);
    }

    // Production mode - real data
    try {
      const registrations = await User.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: { role: 'apprenant' },
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
        raw: true
      });
      
      const formattedData = registrations.map(item => ({
        date: item.date,
        count: parseInt(item.count) || 0
      }));
      
      res.json(formattedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
