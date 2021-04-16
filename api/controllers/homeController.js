exports.homePage = (req, res, next)=>{
        res.render('index')
}


exports.dashboard = (req, res, next)=>{
 
   return res.render('dashboard', {role: res.locals.role})

}
