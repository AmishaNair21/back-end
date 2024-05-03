var express = require('express');
var router = express.Router();
const userModel=require("./users")
const postModel=require("./post")
//passport session
const passport=require("passport")
const localStrategy=require("passport-local")
passport.use(new localStrategy(userModel.authenticate()));
const upload=require("./multer")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.render('login',{message: req.flash("error")});
});



router.post("/upload",isLoggedIn,upload.single("file"),async(req,res)=>{
 if(!req.file){
  return res.status(404).send("no files given")
 }
const user=await  userModel.findOne({username:req.session.passport.user});

const post=await postModel.create({
  image:req.file.filename,
  imageText:req.body.filecaption,
  user:user._id
});
 user.post.push(post._id);
 await user.save();
res.redirect("/profile")
 
})



//profile route
router.get("/profile",isLoggedIn,async(req,res,next)=>{
  const user=await userModel.findOne({
    username:req.session.passport.user
  })
  .populate("post")
 res.render("profile",{user})
})

// Register route
router.post("/register", (req, res) => {
  // Create a new user object with the provided data
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.fullName,
   
  });

  // Register the user using the register method provided by Passport-local-mongoose
  userModel.register(userData, req.body.password, (err, user) => {
    if (err) {
      if (err.name === 'UserExistsError') {
        // If a user with the same username already exists, send a specific error message
        return res.status(400).json({ error: "Username is already taken" });
      } else {
        // For other errors, send a generic error message
        console.error("Error registering user:", err);
        return res.status(500).json({ error: "Error registering user" });
      }
    }

    // If registration is successful, authenticate the user and redirect to the profile page
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});



//login route
router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true      //flash
}), function(req, res) {

});

//logoutroute
router.get("/logout",(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });


})

 //checking loggedin
  function isLoggedIn(req,res,next){
    if(req.isAuthenticated())return next();
    res.redirect("/")
  }



module.exports = router;
