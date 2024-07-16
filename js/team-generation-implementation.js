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
const projectCategoryInput = document.getElementById('exampleFormControlInput3');
const projectNameInput = document.getElementById('exampleFormControlInput1');
  const generateButton = document.getElementById('generate-teams');
  const generateProjectNameButton = document.getElementById('generateButton');
  const generateProjectCategoryButton = document.getElementById('generateButton');

  // Enable button when input is not empty
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
    // window.location.href = generateLink.href; // Redirect to generated-team page
  });
  generateProjectCategoryButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default form submission
    localStorage.setItem('projectCategory', projectCategoryInput.value);
    // window.location.href = generateLink.href; // Redirect to generated-team page
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
        // event.stopPropagation(); // Prevents the click from bubbling up and hiding the card
        showGuidelinesCard();
    });

    // Close the card if user clicks outside of it
    document.addEventListener("click", function(event) {
        if (!guidelinesCard.contains(event.target) && event.target !== guidelinesText) {
            hideGuidelinesCard();
        }
    });

    // // Hover events to show/hide guidelines card
    // guidelinesText.addEventListener("mouseenter", function() {
    //     showGuidelinesCard();
    // });

    // guidelinesText.addEventListener("mouseleave", function() {
    //     hideGuidelinesCard();
    // });

    // guidelinesCard.addEventListener("mouseenter", function() {
    //     showGuidelinesCard();
    // });

    // guidelinesCard.addEventListener("mouseleave", function() {
    //     hideGuidelinesCard();
    // });
});

// part 1 end
 
// part 2 start
  // Logic implementation
 
// // Add event listener for the Generate Teams button
// document.querySelector('.generate-area button').addEventListener('click', handleGenerateButtonClick);
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
        // document.getElementById('fileUploadSection').classList.remove('hidden');
 
        // Show the Generate Teams and Randomly Generate buttons
        document.getElementById('generateButton').style.display = 'block';
        // document.getElementById('randomGenerateButton').style.display = 'block';
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
    activeInput = weightageValue; // Set the activeInput
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
 
// Function to hide all text input fields
// function hideAllTextInput() {
//     if (activeInput) {
//         activeInput.remove(); // Remove input element from DOM
//         activeInput = null;
//     }
//     document.getElementById('weightageInput').style.display = 'none';
// }
 
// Function to generate random color palette
function generateColorPalette(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const color = generateShadeOfPurple();
        colors.push(color);
    }
    return colors;
}
function generateShadeOfPurple() {
    const hue = randomInt(0, 300); //0 Hue range for purple/lavender/lilac
    const saturation = randomInt(0, 400); // Saturation range (lighter shades)
    const lightness = randomInt(50, 70); // Lightness range (lighter shades)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
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
        // let maxWeightedScore = -Infinity;
        team.members.forEach(member => {
                    team.leader = team.members[0].name;
 
        });
        // team.members=team.members.filter(member=> member.name!==team.leader);
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
document.getElementById('weightageInput').addEventListener('keypress', function(event) {
    // Check if the key pressed is Enter (key code 13)
    if (event.key === 'Enter') {
        // Prevent the default action (form submission, if any)
        event.preventDefault();

        // Get the current active input index from the weightageValue dataset
        const currentIndex = parseInt(document.getElementById('weightageValue').dataset.index);

        // Update the weightage for the current index
        const newValue = parseFloat(document.getElementById('weightageValue').value);
        updatePieChartWeightage(currentIndex, newValue);

        // Hide the current weightage input
        hideWeightageInput();

        // Find the next index to move to (assuming circular movement)
        const nextIndex = (currentIndex + 1) % parameters.length;

        // Show the input for the next parameter
        const nextLabel = parameters[nextIndex];
        showTextInput(nextLabel, pieChartInstance.data.datasets[0].data[nextIndex], nextIndex);
    }
});
function hideWeightageInput() {
    if (activeInput) {
        activeInput.blur(); // Remove focus from current input
        activeInput = null; // Clear active input reference
        document.getElementById('weightageInput').style.display = 'none'; // Hide input field
        
        // Example logic to move to next input if needed
        // You can implement logic to focus on the next input or proceed
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
      document.getElementById('weightageInput').style.display = 'block';
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
        updateWeightageInput(value);
        document.getElementById('weightageInput').style.display = 'block';
 
    };
    reader.readAsArrayBuffer(file);
}
 
// document.getElementById('increaseButton').addEventListener('click', function() {
//     if (currentWeightage < maxWeightage) {
//         currentWeightage++;
//         updateWeightageInput(currentWeightage);
//     }
// });
 
// document.getElementById('decreaseButton').addEventListener('click', function() {
//     if (currentWeightage > minWeightage) {
//         currentWeightage--;
//         updateWeightageInput(currentWeightage);
//     }
// });
 
 
// function updateWeightageInput(value) {
//     document.getElementById('weightageValue').value = value;
//     // Update the pie chart weightage here if needed
//     updatePieChartWeightage(value);
// }

function updateWeightageInput(value) {
    if (activeInput) {
      const index = parseInt(activeInput.dataset.index);
      activeInput.value = value.toFixed(2);
      pieChartInstance.data.datasets[0].data[index] = value;
      pieChartInstance.update();
    }
  }
