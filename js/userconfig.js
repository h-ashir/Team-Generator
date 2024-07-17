import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
 
const firebaseConfig = {
    apiKey: "AIzaSyAIuCN5NMapt-HyvTWmEXPOhXTdBYlVhOk",
    authDomain: "login-backend-59af8.firebaseapp.com",
    projectId: "login-backend-59af8",
    storageBucket: "login-backend-59af8.appspot.com",
    messagingSenderId: "1097943042656",
    appId: "1:1097943042656:web:174161d4af1d7017cad105",
    measurementId: "G-Q9C3E9L2P6"
};
 
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}
 
const auth = getAuth(app);
const firestore = getFirestore(app);
  
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
 
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            retrieveUsername(user.uid);
        })
        .catch(error => {
            console.error('Error during login:', error);
        });
}
 
function logout() {
    signOut(auth).then(() => {
        updateUserUI();
    }).catch(error => {
        console.error('Error during logout:', error);
    });
}
 
async function retrieveUsername(uid) {
    try {
        const userDoc = await getDoc(doc(firestore, "users", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const uesrname = userData.uesrname;
            updateUserUI(uesrname);
        } else {
            console.log("No such document!");
            updateUserUI("Guest");
        }
    } catch (error) {
        console.error("Error retrieving username:", error);
        updateUserUI("Guest");
    }
}
 
function updateUserUI(username = "Guest") {
    onAuthStateChanged(auth, user => {
        const loginButton = document.getElementById('loginButton');
        const dropdownButton = document.getElementById('dropdownButton');
        const userButton = document.getElementById('userButton');

        if (user) {
            if (loginButton) loginButton.style.display = 'none';
            if (dropdownButton) dropdownButton.style.display = 'block';
            if (userButton) userButton.textContent = username;
        } else {
            if (loginButton) loginButton.style.display = 'block';
            if (dropdownButton) dropdownButton.style.display = 'none';
            if (userButton) userButton.textContent = 'Guest';
        }
    });
    console.log(username);
}

window.onload = () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            retrieveUsername(user.uid);
        } else {
            updateUserUI();
        }
    });

    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', login);
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
};