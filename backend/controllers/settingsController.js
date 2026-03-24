const RestaurantSettings = require('../models/RestaurantSettings');

const get = async (req, res) => {
  try {
    let settings = await RestaurantSettings.findOne();
    if (!settings) settings = await RestaurantSettings.create({});
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const update = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.logo) data.logo = req.files.logo[0].filename;
    if (req.files?.banner) data.banner = req.files.banner[0].filename;

    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }
    res.json(settings);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

module.exports = { get, update };