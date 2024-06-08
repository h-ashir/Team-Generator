import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAIuCN5NMapt-HyvTWmEXPOhXTdBYlVhOk",
    authDomain: "login-backend-59af8.firebaseapp.com",
    projectId: "login-backend-59af8",
    storageBucket: "login-backend-59af8.appspot.com",
    messagingSenderId: "1097943042656",
    appId: "1:1097943042656:web:174161d4af1d7017cad105",
    measurementId: "G-Q9C3E9L2P6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  document.getElementById("submit").addEventListener('click', function(e){
    e.preventDefault();

    set(ref(db, 'user/' + document.getElementById("username").value),
    {

         username: document.getElementById("username").value,
         email: document.getElementById("email").value,
         PhoneNumber: document.getElementById("phone").value

    });

    alert("Login Sucessfull !");
  })
