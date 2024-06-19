const controller = {};

controller.seguimiento = (req, res) => {
  const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
  res.render("seguimiento", { tipoCargo });
};

module.exports = controller;
