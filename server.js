const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
//const passport = require("passport");
const passport = require("./config/passport");

const { sequelize } = require("./models");
require("dotenv").config();
const path = require("path");

const app = express();


const PORT = process.env.PORT;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(__dirname, "node_modules")));
//app.use(express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false }));



app.use(session({ 
  secret: "secret_learnup",
  resave: false, 
  saveUninitialized: false,
  cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      sameSite: "lax", // Options: 'strict', 'lax', or 'none'
    },
})); // Configuration de la session

app.use(flash());
// Middleware pour rendre les messages accessibles dans les vues
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash("error");
    next();
  });

app.use(passport.initialize());
app.use(passport.session());


// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const formateurRoutes = require("./routes/formateurRoutes");
const studentRoutes = require("./routes/studentRoutes");




// ... (other middleware and route setup)

app.use("/", authRoutes);

app.use("/admin", adminRoutes);
app.use("/formateur", formateurRoutes);
app.use("/", studentRoutes);

app.get("/", (req, res) => {
    res.render("index");
  }
);
// Synchronisation de la base de données
sequelize.sync().then(() => console.log("Base de données synchronisée"));

// Démarrage du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log("Serveur démarré sur http://0.0.0.0:${PORT}");
});


