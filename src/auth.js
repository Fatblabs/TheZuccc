class Auth {
    constructor() {
        //Only white flash, make sure it doesn't load
        document.querySelector("body").style.display = "none";
        const auth = localStorage.getItem("auth");
        this.ValidateAuth(auth);
    }
    ValidateAuth(auth) {
        if (auth != 1) {
            window.location.replace("/");
        }
        else {
            document.querySelector("body").style.display = "block";
        }
    }
    
    logOut() {
        localStorage.removeItem("auth");
        window.location.replace("/");
    }
}