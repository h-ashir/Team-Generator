import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

// Firebase configuration
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
const db = getFirestore(app);
const storage = getStorage(app);

// Function to fetch projects from Firestore and display them
async function fetchAndDisplayProjects() {
    const projectsCollection = collection(db, 'projects');
    const projectsSnapshot = await getDocs(projectsCollection);
    const projectsList = document.querySelector('.history-container-content');
    

    projectsSnapshot.forEach((doc, index) => {
        const projectData = doc.data();
        const projectName = projectData.projectName;
        const creationDate = new Date(projectData.uploadDate).toLocaleDateString();
        const fileURL = projectData.fileURL;

        const projectRow = document.createElement('div');
        projectRow.className = 'history-content-row';

        projectRow.innerHTML = `
            <div class="history-content-details">${projectName}</div>
            <div class="history-content-details">${creationDate}</div>
            <div class="history-content-details">
                <a href="#" class="download-link" data-url="${fileURL}">Download</a>
            </div>

        `;

        projectsList.appendChild(projectRow);
    });

    // Add event listeners to download links
    const downloadLinks = document.querySelectorAll('.download-link');
    downloadLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const url = event.target.getAttribute('data-url');
            const response = await fetch(url);
            const blob = await response.blob();
            const fileName = url.split('?')[0].split('/').pop();
            const linkElement = document.createElement('a');
            linkElement.href = URL.createObjectURL(blob);
            linkElement.download = fileName;
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        });
    });
}

// Initialize the app and fetch projects on page load
document.addEventListener('DOMContentLoaded', fetchAndDisplayProjects);

// Add your existing authentication and logout logic here
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("User is signed in:", user);
  } else {
    // User is signed out
    window.location.href = 'login.html';
  }
});

const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', () => {
  signOut(auth).then(() => {
    // Sign-out successful
    window.location.href = 'login.html';
  }).catch((error) => {
    // An error happened
    console.error("Error signing out:", error);
  });
});
