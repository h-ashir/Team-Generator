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
const generateTeamsButton = document.querySelector('.generate-area button');

// Disable 'Generate Teams' button initially
// generateTeamsButton.disabled = true;
// generateTeamsButton.style.opacity = 0.5;

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

//Pie chart

document.getElementById('generate').addEventListener('click', () => {
  const numParts = parseInt(document.getElementById('numParts').value);
  const inputsDiv = document.getElementById('inputs');
  inputsDiv.innerHTML = '';
  document.getElementById('warning').style.display = 'none';
  document.getElementById('generate-teams').disabled = true;

  if (isNaN(numParts) || numParts < 1) {
      alert('Please enter a valid number greater than 0.');
      return;
  }

  for (let i = 0; i < numParts; i++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.className = 'skill-input';
      input.placeholder = `Skill ${i + 1}`;
      input.dataset.index = i;
      input.addEventListener('input', updateChart);
      inputsDiv.appendChild(input);
  }

  createChart(numParts);
});

let myPieChart;

function createChart(numParts) {
  const ctx = document.getElementById('myPieChart').getContext('2d');
  const initialData = new Array(numParts).fill(1);

  if (myPieChart) {
      myPieChart.destroy();
  }

  const colors = generateColors(numParts);

  myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: initialData.map((_, i) => `Skill ${i + 1}`),
          datasets: [{
              data: initialData,
              backgroundColor: colors,
          }]
      }
  });
}

function updateChart() {
  const inputs = document.querySelectorAll('.skill-input');
  const newData = Array.from(inputs).map(input => parseFloat(input.value) || 0);
  const sum = newData.reduce((acc, curr) => acc + curr, 0);
  const warning = document.getElementById('warning');
  const generateTeamsButton = document.getElementById('generate-teams');

  if (sum === 100) {
      warning.style.display = 'none';
      generateTeamsButton.disabled = false;
  } else {
      warning.style.display = 'block';
      warning.textContent = 'Sum of the skill weightages should be equal to 100';
      generateTeamsButton.disabled = true;
  }

  myPieChart.data.datasets[0].data = newData;
  myPieChart.update();
}

function generateColors(numParts) {
  const colors = ['#5A639C', '#9B86BD', '#4E5EC8', '#2E3A82', '#AE87EC', '#3D2B5A', '#412C64', '#3A4067'];
  const result = [];
  for (let i = 0; i < numParts; i++) {
      result.push(colors[i % colors.length]);
  }
  return result;
}



      document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.setItem('showSwal', 'true');
        window.location.href = 'home.html';
        
    });