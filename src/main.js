/*
import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

*/

//import { Wait } from "aws-cdk-lib/aws-stepfunctions";

//const { Wait } = require("aws-cdk-lib/aws-stepfunctions");

//const { a } = require("@aws-amplify/backend");

//const { ConsoleLogger } = require("aws-amplify/utils");
//We've created a class so that it can handle these fields, and so that it can handle the 'form' as created in the html file perviously.

class Account {
  constructor(form, fields) {
    this.form = form;
    this.fields = fields;
    this.validation();
  }

  auth(error) {
    if (error == 0) {
      localStorage.setItem("auth", 1);
      this.form.submit();
    } else {
      console.log("ERROR");
    }
  }

  validation() {
    let self = this;
    let user, pass;

    this.form.addEventListener("submit", async (event) => {
      try {
        console.log("Submit handler triggered");
        event.preventDefault();
        let error = 0;

        // Validate each field
        self.fields.forEach((field) => {
          const input = document.querySelector(`#${field}`);
          if (input.type === "password") {
            pass = input.value;
          } else {
            user = input.value;
          }
          if (!this.validateFields(input)) {
            error++;
          }
        });

        // Check if account exists
        const exists = await checkIfAccountExists(user, pass);
        if (!exists) {
          console.log("Account not found, prompting to sign up");
          error++;
          document.querySelector(".login").style.visibility = "hidden";

          const accountDiv = document.getElementById("account");
          accountDiv.innerHTML = `
            <h1> Do you want to sign up? </h1>
            <button id="yesButton" class="yesButton">Yes</button>
            <button id="noButton" class="noButton" onclick="closeAccount()">No</button>
          `;
          accountDiv.style.visibility = "visible";

          // Attach click handler for “Yes”, and catch its errors too:
          document
            .getElementById("yesButton")
            .addEventListener("click", async (event) => {
              try {
                const created = await openAccount(user, pass, error);
                if (!created) {
                  this.ping(
                    "Hey man, sorry for calling you stupid, but something went wrong when trying to create your dumb account",
                    "error"
                  );
                  error++;
                } else {
                  console.log("Account created successfully!");
                  error = 0;
                  this.auth(error);
                }
              } catch (err) {
                console.error("Error in signup click‐handler:", err);
                this.ping(
                  "A network error occurred while creating your account. Please check your connection and try again.",
                  "error"
                );
              }
            });
        } else {
          console.log("Account exists, proceeding to log in");
          this.auth(error);
        }
      } catch (err) {
        console.error("Error in submit handler:", err);
        this.ping(
          "Something went wrong while submitting the form. Please try again.",
          "error"
        );
      }
    });
  }

  validateFields(field) {
    // … your existing validation logic …
    if (field.value.trim() === "") {
      this.ping("You gotta put something....", "error");
      return false;
    }
    if (field.type === "password") {
      if (field.value.length < 8) {
        this.ping(
          "What, you want your password to be brute forced within seconds? Make password that's more than 8 characters you idiot",
          "error"
        );
        return false;
      }
      return true;
    } else {
      if (field.value.length < 3) {
        this.ping("Dude, are you serious???? You gotta make your username longer than that", "error");
        return false;
      }
      return true;
    }
  }

  ping(message, status) {
    if (status === "error") {
      const notification = document.createElement("div");
      notification.classList.add("alert", "alert-warning", "alert-dismissible", "fade", "show");
      notification.role = "alert";
      notification.innerHTML = `
        <strong>STUPID!!!</strong> ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
      `;
      document.getElementById("notification-container").appendChild(notification);
    } else {
      console.log("Skibidi");
    }
  }
}


//THis is the amount of fields that are needed.
const form = document.querySelector(".loginForm");
console.log(form);
if (form) {
  const fields = ['UsernameElement', 'PasswordElement'];
  const validator = new Account(form, fields);
}


/* Show Password Function */
function showPass() {
  var x = document.getElementById("PasswordElement");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
//CHECK the database if the account exists. Return true if exists. If it doesn't, then prompt user to sign up
async function checkIfAccountExists(user, pass) {
  try {
    const response = await fetch('https://3fea-2601-600-8d82-2480-c403-3bd3-a030-b934.ngrok-free.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user,
        password: pass
      })
    });
    const data = await response.text();
    console.log(data);
    return data === "found";
    } catch (error) {
    console.error("Login check failed:", error);
    return false;
  }
}

//connects with database and adds new table element containing new user and pass
async function openAccount(user, pass, error) {
  try {
    const response = await fetch('https://3fea-2601-600-8d82-2480-c403-3bd3-a030-b934.ngrok-free.app/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user,
        password: pass
      })
    });

    const data = await response.text();
    console.log('Signup response:', data);
    return data === 'created';
  } catch (error) {
    console.error('Signup failed:', error);
    return false;
  }
  
}

//Reload page cuz we don't need to really do anything after the user presses no when prompted
function closeAccount() {
  location.reload();
}
async function getIpAddress() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  console.log(`Your IP Address: ${data.ip}`);
}

getIpAddress();
