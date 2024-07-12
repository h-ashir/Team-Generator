import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

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

  document.getElementById('downloadButton').addEventListener('click', async function() {
    // Extract team data from the webpage
    const teams = [];
    document.querySelectorAll('.result-tg-t').forEach(teamDiv => {
        const teamName = teamDiv.querySelector('.result-tg-t-title p').textContent;
        const teamLeader = teamDiv.querySelector('.result-tg-t-teamleader p').textContent.split(': ')[1];
        const members = Array.from(teamDiv.querySelectorAll('ol li')).map(li => li.textContent);
        
        teams.push({
            teamName,
            teamLeader,
            members
        });
    });

    // Convert team data to worksheet
    const ws_data = [['Team Name', 'Team Leader', 'Members']];
    teams.forEach(team => {
        ws_data.push([team.teamName, team.teamLeader, team.members.join(', ')]);
    });
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teams');

    // Write the workbook to a Blob
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    // Upload the file to Firebase Storage
    const projectName = localStorage.getItem('projectName') || 'NoProjectName';
    const storageRef = ref(storage, `projects/${projectName}_${Date.now()}.xlsx`);
    await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Save project metadata to Firestore
    await addDoc(collection(db, 'projects'), {
        projectName: projectName,
        fileURL: downloadURL,
        uploadDate: new Date().toISOString()
    });

    // Trigger download of the Excel file (optional)
    XLSX.writeFile(wb, 'teams.xlsx');

    // Display success message
    Swal.fire({
        title: 'File uploaded and saved successfully',
        icon: 'success',
        confirmButtonText: 'OK'
    });
});

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

window.addEventListener('load', function() {
    if (localStorage.getItem('showSwal') === 'true') {
        Swal.fire({
            title: 'Saved to history',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        localStorage.removeItem('showSwal');
    }
});

const editButton = document.querySelector('.edit-feedback');
const feedbackArea = document.querySelector('.feedback-area');
const dragAlert = document.querySelector('.drag-alert');
const downloadButton = document.querySelector('.download');

  function dragAlertfunction(){
    if (editButton){
      editButton.addEventListener('click', (event) => {
        event.preventDefault();
        setTimeout(() => {
          dragAlert.textContent = 'You can drag and drop to swap members across team';
        }, 200);
      });
    }
  }
  dragAlertfunction();

  if (editButton && feedbackArea){
    editButton.addEventListener('click', (event) =>{
      event.preventDefault();
      feedbackArea.style.display =  feedbackArea.style.display === 'none' ? 'block' :'none';
    });
  }
 
    //logout successful popup
document.getElementById('logoutButton').addEventListener('click', function() {
  localStorage.setItem('showSwal', 'true');
  window.location.href = 'home.html';
  
});

const projectName = localStorage.getItem('projectName');
    const projectNameHeading = document.getElementById('project-name-heading');

    if (projectName) {
      projectNameHeading.textContent = ` ${projectName}`;
    } else {
      projectNameHeading.textContent = 'No project name provided';
    }