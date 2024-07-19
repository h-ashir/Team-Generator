import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAIuCN5NMapt-HyvTWmEXPOhXTdBYlVhOk",
    authDomain: "login-backend-59af8.firebaseapp.com",
    databaseURL: "https://login-backend-59af8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "login-backend-59af8",
    storageBucket: "login-backend-59af8.appspot.com",
    messagingSenderId: "1097943042656",
    appId: "1:1097943042656:web:174161d4af1d7017cad105",
    measurementId: "G-Q9C3E9L2P6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display = "block";
        messageDiv.innerHTML = message;
        messageDiv.style.opacity = 1;
        setTimeout(function () {
            messageDiv.style.opacity = 0;
        }, 50000);
    }
}

function setupAuthEventListeners() {
    const signIn = document.getElementById('submitSignIn');
    if (signIn) {
        signIn.addEventListener('click', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const auth = getAuth();

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    showMessage('Login is successful', 'signInMessage');
                    const user = userCredential.user;
                    localStorage.setItem('loggedInUserId', user.uid);
                    window.location.href = 'team-generation-implementation.html';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode === 'auth/invalid-credential') {
                        showMessage('Incorrect Email or Password', 'signInMessage');
                    } else {
                        showMessage('Account does not Exist', 'signInMessage');
                    }
                });
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            const auth = getAuth();
            signOut(auth).then(() => {
                // Sign-out successful.
                showMessage('Logout successful', 'logOutMessage');
                updateAuthButton(false);
                console.log("Logged out");
                localStorage.removeItem('loggedInUserId');
                window.location.href = 'home.html';
            }).catch((error) => {
                console.error('Logout error:', error);
                showMessage('Logout failed', 'logOutMessage');
            });
            
        });
    }
}

function updateAuthButton(isSignedIn) {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const historyButton = document.getElementById('historyButton');

    if (loginButton && logoutButton && historyButton) {
        if (isSignedIn) {
            historyButton.style.display = "block";
            logoutButton.style.display = "block";
            loginButton.style.display = "none";
        } else {
            historyButton.style.display = "none";
            logoutButton.style.display = "none";
            loginButton.style.display = "block";
        }
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    setupAuthEventListeners();
});