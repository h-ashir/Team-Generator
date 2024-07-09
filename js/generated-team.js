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

function updateAuthButton(isSignedIn) {
  console.log("Hi")
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


  const stars = document.querySelectorAll('.star');
  const ratingValue = document.getElementById('ratingValue');
  const ratingStars = document.getElementById('ratingStars');

  const editButton = document.querySelector('.edit-feedback');
  const feedbackArea = document.querySelector('.feedback-area');


  

  if (editButton && feedbackArea){
    editButton.addEventListener('click', (event) =>{
      event.preventDefault();
      feedbackArea.style.display =  feedbackArea.style.display === 'none' ? 'block' :'none';
    });
  }
 
  stars.forEach(star => {
    star.addEventListener('mouseover', function() {
      const value = parseInt(this.getAttribute('data-value'));
      highlightStars(value);
    });
 
    star.addEventListener('mouseleave', function() {
      const value = parseInt(ratingValue.value);
      highlightStars(value);
    });
 
    star.addEventListener('click', function() {
      const value = parseInt(this.getAttribute('data-value'));
      ratingValue.value = value;
      highlightStars(value);
    });
  });
 
  function highlightStars(value) {
    stars.forEach(star => {
      const starValue = parseInt(star.getAttribute('data-value'));
      if (starValue <= value) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

