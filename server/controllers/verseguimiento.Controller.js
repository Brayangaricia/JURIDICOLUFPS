const controller = {};

controller.verseguimiento = (req, res) => {
  const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
  res.render("verseguimiento", { tipoCargo });
};

module.exports = controller;
