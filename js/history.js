import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('historyContainer');

    onAuthStateChanged(auth, user => {
        if (user) {
            fetchTeamHistory(user.uid);
        } else {
            window.location.href = 'index.html'; // Redirect to home if not logged in
        }
    });

    // Fetch team history from Firebase
    function fetchTeamHistory(userId) {
        const historyRef = ref(database, `users/${userId}/teams`);
        get(historyRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                displayHistory(data);
            } else {
                historyContainer.innerHTML = '<p>No history found.</p>';
            }
        }).catch((error) => {
            console.error('Error fetching team history:', error);
        });
    }

    // Display history
    function displayHistory(data) {
        const historyHtml = Object.values(data).map(entry => {
            return `<div>
<h3>Team generated on ${new Date(entry.timestamp).toLocaleString()}</h3>
<ul>${entry.team.map(player => `<li>${player}</li>`).join('')}</ul>
</div>`;
        }).join('');
        historyContainer.innerHTML = historyHtml;
    }
});