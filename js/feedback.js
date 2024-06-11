import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
    import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
 
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
    const db = getDatabase(app);
 
    document.getElementById("submitFeedbackBtn").addEventListener('click', function(e){
    e.preventDefault();
    set(ref(db, 'user/' + document.getElementById("submitFeedbackBtn").value),
    {
        feedback: document.getElementById("feedbackMessage").value
        // rating: document.getElementById("rating").value
 
    });
    alert("Feedback uploaded Sucessfully  !");
})