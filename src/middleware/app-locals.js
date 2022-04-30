module.exports = function (req, res, next) {
  // Set any global value which can be made avaialble to express renderer
   
  res.locals.app = 'App';
  res.locals.darkmode = req.cookies['mode'] || 'dark';

  next();
}
