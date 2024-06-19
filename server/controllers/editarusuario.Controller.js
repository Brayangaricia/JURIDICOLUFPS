const controller = {};

controller.editarusuario = (req, res) => {
  const tipoCargoSession = req.session.user ? req.session.user.tipoCargo : null;
  res.render("editarusuario", { tipoCargo: tipoCargoSession });
};

module.exports = controller;
