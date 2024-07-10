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
  const downloadButton = document.querySelector('.download');

  const dragAlert = document.querySelector('.drag-alert');

  document.getElementById('downloadButton').addEventListener('click', function() {
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

    // Write the workbook and trigger a download
    XLSX.writeFile(wb, 'teams.xlsx');
});

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

  downloadButton.addEventListener('click', function() {
    localStorage.setItem('showSwal', 'true');
    window.location.href = 'generated-team.html';
  });


  if (editButton && feedbackArea){
    editButton.addEventListener('click', (event) =>{
      event.preventDefault();
      feedbackArea.style.display =  feedbackArea.style.display === 'none' ? 'block' :'none';
    });
  }

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