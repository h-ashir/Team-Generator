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
document.getElementById('logoutButton').addEventListener('click', function() {
  localStorage.setItem('showSwal', 'true');
  window.location.href = 'index.html';
 
});
const projectCategoryInput = document.getElementById('exampleFormControlInput3');
const projectNameInput = document.getElementById('exampleFormControlInput1');
  const generateButton = document.getElementById('generate-teams');
  const generateProjectNameButton = document.getElementById('generateButton');
  const generateProjectCategoryButton = document.getElementById('generateButton');

  projectNameInput.addEventListener('input', () => {
    generateButton.disabled = !projectNameInput.value;
  });
  projectCategoryInput.addEventListener('input', () => {
    generateButton.disabled = !projectCategoryInput.value;
  });
 
  // Save project name to localStorage when button is clicked
  generateProjectNameButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default form submission
    localStorage.setItem('projectName', projectNameInput.value);
  });
  generateProjectCategoryButton.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.setItem('projectCategory', projectCategoryInput.value);
  });
  document.addEventListener("DOMContentLoaded", function() {
    const guidelinesText = document.getElementById("guidelinesText");
    const guidelinesCard = document.getElementById("guidelinesCard");
    // Function to show guidelines card
    function showGuidelinesCard() {
        guidelinesCard.classList.add("active");
    }
    // Function to hide guidelines card
    function hideGuidelinesCard() {
        guidelinesCard.classList.remove("active");
    }
    // Click event to toggle guidelines card visibility
    guidelinesText.addEventListener("click", function(event) {
        showGuidelinesCard();
    });

    // Close the card if user clicks outside of it
    document.addEventListener("click", function(event) {
        if (!guidelinesCard.contains(event.target) && event.target !== guidelinesText) {
            hideGuidelinesCard();
        }
    });

});
let pieChartInstance;
let activeInput = null;
let activeLabel = null;
let parameters = [];
let memberScores = [];
let parameterWeightages = [];
let currentWeightage = 0;
const minWeightage = 0;
const maxWeightage = 100;
 
document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();
 
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
 
        // Extract headers (parameters)
        parameters = rows[0].slice(1); // Exclude the first column (name)
        const parameterCount = parameters.length;
 
        // Extract member names and scores
        memberScores = [];
        for (let i = 1; i < rows.length; i++) {
            const member = {
                name: rows[i][0],
                scores: rows[i].slice(1)
            };
            memberScores.push(member);
        }
 
        // Display parameter count in textarea
        document.getElementById('parameterCount').value = `${parameterCount}`;
        document.getElementById('fileUploadSection').classList.remove('hidden');
 
        // Initialize Chart.js pie chart data with dynamic opacity and initial weightage
        const initialWeightage = Array(parameterCount).fill(100 / parameterCount); // Equal weightage initially
        const pieData = {
            labels: parameters,
            datasets: [{
                data: initialWeightage,
                backgroundColor: generateColorPalette(parameterCount)
            }]
        };
 
        // Configure Chart.js options
        const pieOptions = {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += Math.round(context.raw * 100) / 100 + '%';
                            return label;
                        },
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        }
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const value = this.data.datasets[0].data[index];
                    const label = this.data.labels[index];
                    showTextInput(label, value, index);
                }
            }
        };
 
        // Create the Chart.js pie chart
        const ctx = document.getElementById('pieChart').getContext('2d');
        pieChartInstance = new Chart(ctx, {
            type: 'pie',
            data: pieData,
            options: pieOptions
        });
 
        document.getElementById('generateButton').style.display = 'block';
    };
 
    reader.readAsArrayBuffer(file);
});
 
// Function to show text input for editing weightage
function showTextInput(label, currentWeightage, index) {
    document.getElementById('weightageInput').style.display = 'block';
    const weightageLabel = document.getElementById('weightageLabel');
    const weightageValue = document.getElementById('weightageValue');
    weightageValue.value = currentWeightage.toFixed(2);
    weightageValue.dataset.index = index;
    weightageLabel.textContent = `Enter the weightage for '${label}'`;
  weightageLabel.style.color="#42497b";
    activeInput = weightageValue;
    weightageValue.addEventListener('input', handleWeightageInput);
  }
  function handleWeightageInput(event) {
    const index = parseInt(event.target.dataset.index);
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      updatePieChartWeightage(index, newValue);
    }
  }
  function updatePieChartWeightage(index, value) {
    pieChartInstance.data.datasets[0].data[index] = value;
    pieChartInstance.update();
  } 
function generateColorPalette(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const color = generateShadeOfPurple();
        colors.push(color);
    }
    return colors;
}
function generateShadeOfPurple() {
    const hue = randomInt(0, 300);
    const saturation = randomInt(0, 40);
    const lightness = randomInt(5, 70); 
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
 
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
 
function validateWeightage() {
    const totalWeightage = pieChartInstance.data.datasets[0].data.reduce((a, b) => a + b, 0);
    if (totalWeightage !== 100) {
        alert('Total weightage must equal 100%');
        return false;
    }
    return true;
}
 
function calculateWeightedScores(members, weightages) {
    return members.map(member => {
        const weightedScores = member.scores.map((score, index) => score * weightages[index] / 100);
        const totalWeightedScore = weightedScores.reduce((acc, val) => acc + val, 0);
        return {
            name: member.name,
            scores: member.scores,
            weightedScores: weightedScores,
            totalWeightedScore: totalWeightedScore
        };
    });
}
  
document.getElementById('generateButton').addEventListener('click', handleGenerateButtonClick);
document.getElementById('weightageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        // Get the current active input index from the weightageValue dataset
        const currentIndex = parseInt(document.getElementById('weightageValue').dataset.index);

        // Update the weightage for the current index
        const newValue = parseFloat(document.getElementById('weightageValue').value);
        updatePieChartWeightage(currentIndex, newValue);
        hideWeightageInput();
        // Find the next index to move to (assuming circular movement)
        const nextIndex = (currentIndex + 1) % parameters.length;

        const nextLabel = parameters[nextIndex];
        showTextInput(nextLabel, pieChartInstance.data.datasets[0].data[nextIndex], nextIndex);
    }
});
function hideWeightageInput() {
    if (activeInput) {
        activeInput.blur();
        activeInput = null; 
        document.getElementById('weightageInput').style.display = 'none';
    }
}

 

document.getElementById('increaseButton').addEventListener('click', () => {
    if (activeInput) {
      const index = parseInt(activeInput.dataset.index);
      let newValue = parseFloat(activeInput.value) + 1;
      newValue = Math.min(newValue, maxWeightage);
      activeInput.value = newValue.toFixed(2);
      pieChartInstance.data.datasets[0].data[index] = newValue;
      pieChartInstance.update();
    }
  });
   
  document.getElementById('decreaseButton').addEventListener('click', () => {
    if (activeInput) {
      let newValue = parseFloat(activeInput.value) - 1;
      newValue = Math.max(newValue, minWeightage);
      updateWeightageInput(newValue);
    }
  });
 
 
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
 
function updatePieChart(parameters) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: parameters,
            datasets: [{
                data: new Array(parameters.length).fill(100 / parameters.length),
                backgroundColor: generateRandomColors(parameters.length),
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}
 
function generateRandomColors(num) {
    const colors = [];
    for (let i = 0; i < num; i++) {
        colors.push(`hsl(${Math.random() * 360}, 100%, 75%)`);
    }
    return colors;
}
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
 
function handleFileUpload(event) {
    document.getElementById('weightageInput').style.display = 'block';
    const file = event.target.files[0];
    const reader = new FileReader();
     reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const parameters = Object.keys(firstSheet).slice(1);

        const membersData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }).slice(1).map(row => ({
            name: row[0],
            scores: row.slice(1)
        }));
        parameterWeightages = new Array(parameters.length).fill(100 / parameters.length);

        localStorage.setItem('membersData', JSON.stringify(membersData));
        alert('File uploaded successfully');
        document.getElementById('parameterCount').value = parameters.length;
        updatePieChart(parameters);
        updateWeightageInput(value);
        document.getElementById('weightageInput').style.display = 'block';
    };
    reader.readAsArrayBuffer(file);
}

function updateWeightageInput(value) {
    if (activeInput) {
      const index = parseInt(activeInput.dataset.index);
      activeInput.value = value.toFixed(2);
      pieChartInstance.data.datasets[0].data[index] = value;
      pieChartInstance.update();
    }
  }
  const numberOfTeamsInput = document.getElementById('exampleFormControlInput2');
  const teamMembersInput = document.getElementById('teamMembersInput');
  const teamMembersFields = document.getElementById('teamMembersFields');
  
  numberOfTeamsInput.addEventListener('input', function() {
      const numberOfTeams = parseInt(numberOfTeamsInput.value);
  
      // Prompt user to enter number of members manually
      const answer = prompt('Do you want to enter the number of members for each team manually? Enter YES or NO.');
  
      if (answer && answer.toLowerCase() === 'yes') {
          teamMembersFields.innerHTML = '';
  
          for (let i = 1; i <= numberOfTeams; i++) {
              const teamInputField = document.createElement('div');
              teamInputField.classList.add('mb-3');
              teamInputField.innerHTML = `
                  <input
                      type="number"
                      class="form-control"
                      id="team${i}Members"
                      placeholder="Enter number of members for Team ${i}"
                      required
                  />
              `;
              teamMembersFields.appendChild(teamInputField);
          }
  
          teamMembersInput.style.display = 'block';
      } else {
          teamMembersInput.style.display = 'none'; 
          const membersCounts = [];
          for (let i = 1; i <= numberOfTeams; i++) {
              const inputField = document.getElementById(`team${i}Members`);
              if (inputField) {
                  const memberCount = parseInt(inputField.value);
                  if (!isNaN(memberCount) && memberCount > 0) {
                      membersCounts.push(memberCount);
                  } else {
                      alert(`Please enter a valid number of members for Team ${i}`);
                      return;
                  }
              } 
              else {
                  return;
              }
          }
          // Proceed to generate teams with the extracted number of members
          const teams = generateTeams1(numberOfTeams, membersCounts);
  
          // Display teams on the generated-team page
          sessionStorage.setItem('generatedTeams', JSON.stringify(teams));
          window.location.href = 'generated-team.html';
      }
  });
function generateTeams1(numberOfTeams, membersCounts) {
    const teams = [];
    const weightedMembers = calculateWeightedScores(memberScores, parameterWeightages);
function calculateWeightedScores(members, weightages) {
    return members.map(member => {
        const weightedScores = member.scores.map((score, index) => score * weightages[index] / 100);
        const totalWeightedScore = weightedScores.reduce((acc, val) => acc + val, 0);
        return {
            name: member.name,
            scores: member.scores,
            weightedScores: weightedScores,
            totalWeightedScore: totalWeightedScore
        };
    });
}
    // Sort members by total weighted score in descending order
    weightedMembers.sort((a, b) => b.totalWeightedScore - a.totalWeightedScore);

    // Initialize teams with empty arrays
    for (let i = 0; i < numberOfTeams; i++) {
        teams.push({
            name: `TEAM ${i + 1}`,
            members: [],
            leader: null
        });
    }

    // Distribute members to teams
     let memberIndex = 0;
    while (memberIndex < weightedMembers.length) {
        for (let i = 0; i < numberOfTeams; i++) {
            if (teams[i].members.length < membersCounts[i] && memberIndex < weightedMembers.length) {
                teams[i].members.push(weightedMembers[memberIndex]);
                memberIndex++;
            }
        }
    }

    // Select leader for each team (highest weighted score member)
    teams.forEach(team => {
        if (team.members.length > 0) {
            team.leader = team.members[0].name;
        }
    });

    return teams;
}

function handleGenerateButtonClick(event) {
    if(!validateWeightage())
    {
        return;

    }
    event.preventDefault(); // Prevent the default form submission

    const numberOfTeams = parseInt(document.getElementById('exampleFormControlInput2').value);

    // Check if the user has manually entered number of members for each team
    const teamMembersInput = document.getElementById('teamMembersInput');
    const manuallyEntered = teamMembersInput.style.display === 'block';

    if (manuallyEntered) {
        const membersCounts = [];
        for (let i = 1; i <= numberOfTeams; i++) {
            const inputField = document.getElementById(`team${i}Members`);
            if (inputField) {
                const memberCount = parseInt(inputField.value);
                if (!isNaN(memberCount) && memberCount > 0) {
                    membersCounts.push(memberCount);
                } else {
                    alert(`Please enter a valid number of members for Team ${i}`);
                    return;
                }
            } else {
                alert(`Input field for Team ${i} not found`);
                return;
            }
        }

        const teams = generateTeams1(numberOfTeams, membersCounts);

        // Display teams on the generated-team page
        sessionStorage.setItem('generatedTeams', JSON.stringify(teams));
        window.location.href = 'generated-team.html';
    } else {
        const teams = generateTeams(numberOfTeams);
        function generateTeams(numberOfTeams) {
   
            const teams = [];
            const weightedMembers = calculateWeightedScores(memberScores, parameterWeightages);
         
            // Sort members by total weighted score in descending order
            weightedMembers.sort((a, b) => b.totalWeightedScore - a.totalWeightedScore);
         
            // Initialize teams with empty arrays
            for (let i = 0; i < numberOfTeams; i++) {
                teams.push({
                    name: `TEAM ${i + 1}`,
                    members: [],
                    leader: null
                });
            }
         
            // Distribute members to teams
            weightedMembers.forEach((member, index) => {
                const teamIndex = index % numberOfTeams;
                teams[teamIndex].members.push(member);
            });
         
            // Ensure minimal difference in team sizes (members)
            let maxMembers = Math.ceil(memberScores.length / numberOfTeams);
            let minMembers = Math.floor(memberScores.length / numberOfTeams);
         
            // Adjust teams to balance the number of members
            teams.sort((a, b) => b.members.length - a.members.length);
            for (let i = 0; i < numberOfTeams; i++) {
                while (teams[i].members.length > maxMembers) {
                    const memberToMove = teams[i].members.pop();
                    teams[i === numberOfTeams - 1 ? 0 : i + 1].members.push(memberToMove);
                }
            }
         
            // Select leader for each team (highest weighted score member)
            teams.forEach(team => {
                team.members.forEach(member => {
                            team.leader = team.members[0].name;
         
                });
            });
         
            return teams;
        }
        // Display teams on the generated-team page
        sessionStorage.setItem('generatedTeams', JSON.stringify(teams));
        window.location.href = 'generated-team.html';
    }
}
  