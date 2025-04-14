const auth = new Auth();

//logout button
document.querySelector(".log-out-button").addEventListener("click", (event) => {
    auth.logOut();
})