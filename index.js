const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require ('express');
const uuid = require ('uuid');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'asdfg@12345'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ]
}

// //============= Inserting multiple user data ===========//
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let data = [];
// for (let i = 0; i < 100; i++){
//   data.push(getRandomUser()); // 100 fake users
// }

// let users = [
//   ["144", "123_newusf", "abc@mpler.com", "pasord@123"],
// ];

// try {
//     connection.query(q, [data], (err, result) => {
//       if(err) throw err;
//       console.log(result);
//     });
// } catch (err) {
//   console.log(err);
// }

// connection.end();

//Home Page
app.get("/", (req, res) => {
  let q = `SELECT  count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (error) {
    console.log(err);
    res.send("some error in DB");
  }
});

// Show all users
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      if(err) throw err;
      // console.log(result);
      res.render("showuser.ejs", { users });
    })
  } catch (error) {
    console.log(err);
    res.send("Some is wrong in user");
  }
});

// show edit form for a user
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    })
  } catch (error) {
    console.log(err);
    res.send("Some is wrong in user");
  }
})

// // update user data in db
// app.patch("/user/:id", (req, res) => {
//     let { id } = req.params;
//     let { password: formPass, username: newUsername } = req.body;
//   let q = `SELECT * FROM user WHERE id='${id}'`;
//   try {
//     connection.query(q, (err, result) => {
//       if(err) throw err;
//       let user = result[0];
//       if(formPass != user.password){
//         res.send("Wrong Password");
//       } else {
//         let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
//         connection.query(q2, (err, result) => {
//           if(err) throw err;
//           res.redirect("/user");
//         })
//       }
//     })
//   } catch (error) {
//     console.log(err);
//     res.send("Some is wrong in user");
//   }
//   res.send("updated");
// })

// update user data in db
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;

  let q = "SELECT * FROM user WHERE id = ?";

  connection.query(q, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Something went wrong with the database");
    }

    if (result.length === 0) {
      return res.status(404).send("User not found");
    }

    let user = result[0];

    if (formPass !== user.password) {
      return res.send("Wrong Password");
    }

    let q2 = "UPDATE user SET username = ? WHERE id = ?";
    connection.query(q2, [newUsername, id], (err, updateResult) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to update username");
      }

      // Explicitly send response ONLY inside the callback after success
      return res.redirect("/user");
    });
  });
});

app.listen("8080", () => {
  console.log("Server is running on port 8080");
});
// ================ inserting single user data  =================//
// let q = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";
// let user = ["1434", "123_newuserf", "abc@exampler.com", "password@123"];
// try {
//     connection.query(q, user, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//     });
// } catch (err) {
//   console.log(err);
// }


// let getRandomUser = () => {
//   return {
//     userId: faker.string.uuid(),
//     username: faker.internet.username(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),
//   };
// }

// console.log(getRandomUser());