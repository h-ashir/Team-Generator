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

// const loginButton = document.getElementById('loginButton');
// const logoutButton = document.getElementById('logoutButton');
// const historyButton = document.getElementById('historyButton');
// const slider = document.getElementById('customRange3');
// const sliderValue = document.getElementById('sliderValue');
// const generateTeamsButton = document.querySelector('.generate-area button');

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
//logout successful popup
document.getElementById('logoutButton').addEventListener('click', function() {
  localStorage.setItem('showSwal', 'true');
  window.location.href = 'home.html';
  
});

const projectNameInput = document.getElementById('exampleFormControlInput1');
  const generateButton = document.getElementById('generate-teams');
  const generateProjectNameButton = document.getElementById('generateButton');

  // Enable button when input is not empty
  projectNameInput.addEventListener('input', () => {
    generateButton.disabled = !projectNameInput.value;
  });

  // Save project name to localStorage when button is clicked
  generateProjectNameButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default form submission
    localStorage.setItem('projectName', projectNameInput.value);
    // window.location.href = generateLink.href; // Redirect to generated-team page
  });

// part 1 end

// part 2 start 
  // Logic implementation

// // Add event listener for the Generate Teams button
// document.querySelector('.generate-area button').addEventListener('click', handleGenerateButtonClick);
let pieChartInstance; // Variable to hold the Chart.js instance
let activeInput = null; // Variable to store the active input element
let activeLabel = null; // Variable to store the active label element
let parameters = []; // Array to store parameter names
let memberScores = []; // Array to store member scores
let parameterWeightages = []; // Array to store user-defined parameter weightages

document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Assuming the first sheet is used
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

        // Destroy existing chart instance if it exists
        if (pieChartInstance) {
            pieChartInstance.destroy();
        }

        // Create the Chart.js pie chart
        const ctx = document.getElementById('pieChart').getContext('2d');
        pieChartInstance = new Chart(ctx, {
            type: 'pie',
            data: pieData,
            options: pieOptions
        });

        // Show the Generate Teams and Randomly Generate buttons
        document.getElementById('generateButton').style.display = 'block';
        // document.getElementById('randomGenerateButton').style.display = 'block';
    };

    reader.readAsArrayBuffer(file);
});

// Function to show text input for editing weightage
function showTextInput(label, currentWeightage, index) {
    // If there's already an active input, remove it
    hideAllTextInput();

    // Create a new label element
    const labelElement = document.createElement('label');
    labelElement.textContent = `Enter weightage for ${label}`;
    labelElement.style.position = 'absolute';
    labelElement.style.left = `75%`;
    labelElement.style.top = `200%`;
    labelElement.style.zIndex = '100';
    labelElement.style.fontFamily = 'Arial, sans-serif';
    labelElement.style.fontSize = '14px';

    // Create a new input element
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = currentWeightage.toFixed(2);
    inputElement.style.position = 'absolute';
    inputElement.style.left = `70%`;
    inputElement.style.top = `210%`;
    inputElement.style.border = '1px solid #ccc';
    inputElement.style.padding = '5px';
    inputElement.style.backgroundColor = '#ffffff'; // White background
    inputElement.style.zIndex = '100';
    inputElement.style.fontFamily = 'Arial, sans-serif';
    inputElement.style.fontSize = '14px';
    inputElement.style.width = '80px';
    inputElement.dataset.index = index;

    console.log(`Showing input at (${inputElement.style.left}, ${inputElement.style.top}) with initial value ${inputElement.value}`);

    // Event listener for input change
    inputElement.addEventListener('input', function() {
        const newValue = parseFloat(this.value);
        if (!isNaN(newValue) && newValue >= 0) {
            pieChartInstance.data.datasets[0].data[index] = newValue;
            pieChartInstance.update();
        }
    });

    // Append label and input element to document body
    document.body.appendChild(labelElement);
    document.body.appendChild(inputElement);

    // Set the active input and label
    activeInput = inputElement;
    activeLabel = labelElement;

    // Focus on the input field 
    inputElement.focus();
}

// Function to hide all text input fields
function hideAllTextInput() {
    if (activeInput) {
        activeInput.remove(); // Remove input element from DOM
        activeInput = null;
    }
    if (activeLabel) {
        activeLabel.remove(); // Remove label element from DOM
        activeLabel = null;
    }
}

// Function to generate random color palette
function generateColorPalette(count) {
    const colors = [];
    const opacity = 0.7; // Set initial opacity
    for (let i = 0; i < count; i++) {
        const color = `rgba(${randomInt(90, 150)}, ${randomInt(90, 150)}, ${randomInt(90, 150)}, ${opacity})`;
        colors.push(color);
    }
    return colors;
}

// Function to generate random integer
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to validate total weightage
function validateWeightage() {
    const totalWeightage = pieChartInstance.data.datasets[0].data.reduce((a, b) => a + b, 0);
    if (totalWeightage !== 100) {
        alert('Total weightage must equal 100%');
        return false;
    }
    return true;
}

// Function to handle the Generate Teams button click
// Function to handle the Generate Teams button click
function handleGenerateButtonClick(event) {
    if (!validateWeightage()) {
        event.preventDefault();
        return;
    }

    const numberOfTeams = parseInt(document.getElementById('exampleFormControlInput2').value);
    const teams = generateTeams(numberOfTeams);

    // Display teams on the generated-team page
    sessionStorage.setItem('generatedTeams', JSON.stringify(teams));
    window.location.href = 'generated-team.html';
}
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
        let maxWeightedScore = -Infinity;
        team.members.forEach(member => {
                    team.leader = team.members[0].name;

        });

    });

    return teams;
}

// Function to calculate weighted scores based on parameter weightages
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


// Add event listener for the Generate Teams button
document.getElementById('generateButton').addEventListener('click', handleGenerateButtonClick);
// let memberScores = []; // This will store the member scores from the Excel file

// function handleFileUpload(event) {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = function (e) {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];

//         const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//         const headers = jsonSheet[0];
//         const parameters = headers.slice(1);

//         memberScores = jsonSheet.slice(1).map(row => {
//             return {
//                 name: row[0],
//                 scores: row.slice(1)
//             };
//         });

//         // Update parameter count and pie chart
//         document.getElementById('parameterCount').value = parameters.length;
//         updatePieChart(parameters);
//     };

//     reader.readAsArrayBuffer(file);
// }

document.getElementById('fileInput').addEventListener('change', handleFileUpload);

// function validateWeightage() {
//     const totalWeightages = pieChartInstance.data.datasets[0].data;
//     const total = totalWeightages.reduce((acc, curr) => acc + curr, 0);
//     return total === 100;
// }

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
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const membersData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }).slice(1).map(row => ({
            name: row[0],
            scores: row.slice(1)
        }));
        localStorage.setItem('membersData', JSON.stringify(membersData));
        alert('File uploaded successfully');
                // Update parameter count and pie chart
        document.getElementById('parameterCount').value = parameters.length;
        updatePieChart(parameters);
    };
    reader.readAsArrayBuffer(file);
}