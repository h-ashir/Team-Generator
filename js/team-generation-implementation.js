// Attach event listener to the range input
// const slider = document.getElementById('customRange3');
// const sliderValue = document.getElementById('sliderValue');

// slider.addEventListener('input', function() {
//   sliderValue.textContent = this.value + '%';
// });


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
      import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 
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
 
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
 
      const loginButton = document.getElementById('loginButton');
      const logoutButton = document.getElementById('logoutButton');
      const historyButton = document.getElementById('historyButton');
      const slider = document.getElementById('customRange3');
      const sliderValue = document.getElementById('sliderValue');
 
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
 
      onAuthStateChanged(auth, user => {
        updateAuthButton(!!user);
      });
 
      updateAuthButton(false);
 
      slider.addEventListener('input', function() {
        sliderValue.textContent = this.value + '%';
      });

      document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.setItem('showSwal', 'true');
        window.location.href = 'home.html';
        
    });