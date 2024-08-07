import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

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

document.getElementById('downloadButton').addEventListener('click', async function() {
  // Ensure the user is authenticated
  const user = auth.currentUser;
  if (!user) {
    console.error('User is not authenticated');
    return;
  }

  // Extract team data from the webpage
  const teams = [];
  document.querySelectorAll('.result-tg-t').forEach(teamDiv => {
    const teamName = teamDiv.querySelector('.result-tg-t-title p').textContent;
    // const teamLeaderText = teamDiv.querySelector('.result-tg-t-teamleader').textContent;
    // const teamLeader = teamLeaderText.split(': ')[1];
    const teamLeaderText = teamDiv.querySelector('.result-tg-t-teamleader').textContent;
const startIndex = teamLeaderText.indexOf(':') ;  // Find the index after ": "
const teamLeader = teamLeaderText.substring(startIndex+2);
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

  // Save project metadata to Firestore with user ID
  await addDoc(collection(db, 'projects'), {
    projectName: projectName,
    fileURL: downloadURL,
    uploadDate: new Date().toISOString(),
    userId: user.uid // Include user ID here
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

function enableDragAndDrop() {
  document.querySelectorAll('.result-tg-t ol li, .result-tg-t-teamleader p').forEach(item => {
    item.setAttribute('draggable', true);

    item.addEventListener('dragstart', function(event) {
      event.dataTransfer.setData('text/plain', event.target.id);
      event.target.classList.add('dragging');
    });

    item.addEventListener('dragend', function(event) {
      event.target.classList.remove('dragging');
    });
  });

  document.querySelectorAll('.result-tg-t ol, .result-tg-t-teamleader').forEach(list => {
    list.addEventListener('dragover', function(event) {
      event.preventDefault();
      const draggingItem = document.querySelector('.dragging');
      const afterElement = getDragAfterElement(list, event.clientY);
      if (afterElement == null) {
        list.appendChild(draggingItem);
      } else {
        list.insertBefore(draggingItem, afterElement);
      }
    });

    list.addEventListener('drop', function(event) {
      event.preventDefault();
      const id = event.dataTransfer.getData('text/plain');
      const draggable = document.getElementById(id);
      list.appendChild(draggable);
    });
  });
}

function disableDragAndDrop() {
  document.querySelectorAll('.result-tg-t ol li, .result-tg-t-teamleader p').forEach(item => {
    item.removeAttribute('draggable');
    item.removeEventListener('dragstart', function() {});
    item.removeEventListener('dragend', function() {});
  });

  document.querySelectorAll('.result-tg-t ol, .result-tg-t-teamleader').forEach(list => {
    list.removeEventListener('dragover', function() {});
    list.removeEventListener('drop', function() {});
  });
}

function getDragAfterElement(list, y) {
  const draggableElements = [...list.querySelectorAll('li:not(.dragging), p:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

if (editButton && feedbackArea) {
  // Show feedback area on page load
  feedbackArea.style.display = 'block';
  enableDragAndDrop();
  dragAlert.textContent = '';

  editButton.addEventListener('click', (event) => {
    event.preventDefault();
    const isVisible = feedbackArea.style.display === 'block';
    feedbackArea.style.display = isVisible ? 'none' : 'block';

    const editButtonText = document.getElementById('editButtonText');
    const editButtonIcon = editButton.querySelector('i');

    if (!isVisible) {
      disableDragAndDrop();
      dragAlert.textContent = '';
      editButtonText.textContent = 'Edit';
      editButtonIcon.classList.remove('fa-check');
      editButtonIcon.classList.add('fa-pencil');
    } else {
      enableDragAndDrop();
      dragAlert.textContent = 'You can drag and drop to swap members and leaders across teams';
      editButtonText.textContent = 'Done';
      editButtonIcon.classList.remove('fa-pencil');
      editButtonIcon.classList.add('fa-check');
    }
  });
}
document.getElementById('logoutButton').addEventListener('click', function() {
  localStorage.setItem('showSwal', 'true');
  window.location.href = 'home.html';
});

const projectNameHeading = document.getElementById('project-name-heading');
const projectName = localStorage.getItem('projectName');

if (projectName) {
  projectNameHeading.textContent = ` ${projectName}`;
} else {
  projectNameHeading.textContent = 'No project name provided';
}
