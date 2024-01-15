
const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const path = require("path");
const bodyParser = require("body-parser");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const flash = require("connect-flash");
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

app.set("views", path.join(__dirname, "views"));

app.use(flash());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("Shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));




app.use(session({
  secret: "my-super-key 1234567890",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));



app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy({
  usernameField: "email",// this is the name of the input field in our signup
  passwordField: "password"
},
  (username, password, done) => {
    User.findOne({ where: { email: username } })
      .then(async function (user) {
        const result = await bcrypt.compare(password, user.password);
        if (result) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      })
      .catch((error) => {
        return done(error);
      });
  }))


passport.serializeUser((user, done) => {
  console.log("serializing user in session ", user.id);
  done(null, user.id);
});


passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => { done(null, user) })
    .catch((error) => done(error, null))
});

app.get("/", (request, response) => {
  if (request.isAuthenticated()) {
    return response.redirect("/todos");
  }
  else {
    return response.render("index.ejs", {
      title: "To-Do Application",
      csrfToken: request.csrfToken(),
    });
  }
});

// app.get("/", async (request, response) => {
//   response.render('index.ejs', {
//     title: "To-Do Application",
//     csrfToken: request.csrfToken(),
//   })
// })


app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});


app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  try {
    const allTodos = await Todo.getTodos();
    const loggedInUser = request.user.id;
    const overdueTodos = await Todo.isOverdue(loggedInUser);
    const dueTodayTodos = await Todo.isDueToday(loggedInUser);
    const dueLaterTodos = await Todo.isDueLater(loggedInUser);
    const completed = await Todo.isCompleted(loggedInUser);

    if (request.accepts("html")) {
      response.render('todos.ejs', {
        allTodos,
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completed,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        allTodos,
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos
      });
    }
  } catch (error) {
    console.error(error);
    response.status(404).json({ error: "rendering Error" });
  }
});




app.get("/signup", async (request, response) => {
  response.render("signup.ejs", { title: "signup", csrfToken: request.csrfToken(), })

})


app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  try {
    const user = await User.create({
      firstname: request.body.firstName,
      lastname: request.body.lastName,
      email: request.body.email,
      password: hashedPwd

    });
    request.login(user, (err) => {
      if (err) {
        console.log(err)
      }
      response.redirect("/todos");
    })

  } catch (error) {
    console.log(error)
  }

})

app.get("/login", (request, response) => {
  response.render('login.ejs', { title: "Login", csrfToken: request.csrfToken() })
})

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (request, response) {
    console.log(request.user);
    response.redirect("/todos");
  }
);

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});




app.post("/todos", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  console.log(request.user.id);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      UserId: request.user.id,
    });

    return response.redirect("/todos");
  } catch (error) {

    return response.status(422).json(error)
  }
})




app.put("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const status = todo.completed;
    //logic to toogle checkbox if true than do false and vise-versa
    const updatedTodo = await Todo.setCompletionStatus(request.params.id, !status, request.user.id);
    console.log(updatedTodo);
    return response.json(updatedTodo);

  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});



app.delete("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);

  try {
    //const deletedItem = await Todo.deleteTodo(request.params.id);
    const deletedItem = await Todo.remove(request.params.id, request.user.id,)
    // Check if a todo was deleted successfully
    return response.json(deletedItem);

  } catch (error) {
    console.error(error);
    return response.status(422).json({ success: false, error: "Deletion error" });
  }
});







module.exports = app;