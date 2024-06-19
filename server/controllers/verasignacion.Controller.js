const controller = {};

controller.verasignacion = (req, res) => {
  const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
  res.render("verasignacion", { tipoCargo });
};

module.exports = controller;
