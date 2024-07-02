// Attach event listener to the range input
const slider = document.getElementById('customRange3');
const sliderValue = document.getElementById('sliderValue');

slider.addEventListener('input', function() {
  sliderValue.textContent = this.value + '%';
});

// document.addEventListener("DOMContentLoaded", function() {
//     const teamForm = document.getElementById("teamForm");
//     const manualInputFields = document.getElementById("manualInputFields");
//     const fileInputFields = document.getElementById("fileInputFields");
 
 
//     manualInputOption.addEventListener("change", function() {
//         if (manualInputOption.checked) {
//             manualInputFields.style.display = "block";
//             fileInputFields.style.display = "none";
//             generateMemberInputs(); 
//         }
//     });
 
//     fileInputOption.addEventListener("change", function() {
//         if (fileInputOption.checked) {
//             fileInputFields.style.display = "block";
//             manualInputFields.style.display = "none";
//         }
//     });
 
//     teamForm.addEventListener("submit", function(event) {
//         event.preventDefault();
//         output.innerHTML = ""; 
 
//         const numTeams = parseInt(document.getElementById("numTeams").value);
//         const numMembers = parseInt(document.getElementById("numMembers").value);
 
//         if (manualInputOption.checked) {
//             const teams = generateTeamsFromManualInput(numTeams, numMembers);
//             displayTeams(teams);
//         } else if (fileInputOption.checked) {
//             const file = document.getElementById("file").files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onload = function(e) {
//                     const data = new Uint8Array(e.target.result);
//                     const workbook = XLSX.read(data, { type: 'array' });
//                     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//                     const fileContent = XLSX.utils.sheet_to_csv(sheet);
//                     const teams = generateTeamsFromFile(fileContent, numTeams);
//                     displayTeams(teams);
//                 };
//                 reader.readAsArrayBuffer(file);
//             }
//         }
//     });
// });
 
 
 
// function displayResult(data) {
//     const resultDiv = document.getElementById('result');
//     resultDiv.innerHTML = `<h2>Submitted Data:</h2>`;
//     data.forEach(person => {
//         resultDiv.innerHTML += `
//             <p><strong>Serial Number:</strong> ${person.serialNumber}</p>
//             <p><strong>Name:</strong> ${person.name}</p>
//             <p><strong>Technical Skills Rating:</strong> ${person.technicalSkills}</p>
//             <p><strong>Soft Skills Rating:</strong> ${person.softSkills}</p>
//             <hr>
//         `;
//     });
// }
 
// function generateMemberInputs() {
//     const container = document.getElementById("manualInputFields");
//     container.innerHTML = "";
 
//     const numMembers = parseInt(document.getElementById("numMembers").value);
 
//     for (let i = 0; i < numMembers; i++) {
//         const div = document.createElement("div");
 
//         const nameLabel = document.createElement("label");
//         nameLabel.textContent = "Name " + (i + 1) + ":";
//         const nameInput = document.createElement("input");
//         nameInput.type = "text";
//         nameInput.required = true;
 
//         const techLabel = document.createElement("label");
//         techLabel.textContent = "Technical Score " + (i + 1) + ":";
//         const techInput = document.createElement("input");
//         techInput.type = "number";
//         techInput.min = "0";
//         techInput.required = true;
 
//         const softLabel = document.createElement("label");
//         softLabel.textContent = "Soft Skill Score " + (i + 1) + ":";
//         const softInput = document.createElement("input");
//         softInput.type = "number";
//         softInput.min = "0";
//         softInput.required = true;
 
//         div.appendChild(nameLabel);
//         div.appendChild(nameInput);
//         div.appendChild(document.createElement("br"));
//         div.appendChild(techLabel);
//         div.appendChild(techInput);
//         div.appendChild(document.createElement("br"));
//         div.appendChild(softLabel);
//         div.appendChild(softInput);
//         div.appendChild(document.createElement("br"));
 
//         container.appendChild(div);
//     }
// }
 
// function generateTeamsFromFile(fileContent, numTeams) {
//     const lines = fileContent.split('\n');
//     const members = [];
//     for (let i = 0; i < lines.length; i++) {
//         const parts = lines[i].split(',');
//         const name = parts[0];
//         const techScore = parseFloat(parts[1]);
//         const softScore = parseFloat(parts[2]);
//         members.push({ name, techScore, softScore });
//     }
 
//     return generateTeams(numTeams, members);
// }
 
// function generateTeamsFromManualInput(numTeams, numMembers) {
//     const members = [];
//     const memberInputs = document.querySelectorAll("#manualInputFields > div");
//     memberInputs.forEach(input => {
//         const name = input.querySelector("input[type='text']").value;
//         const techScore = parseFloat(input.querySelector("input[type='number']").value);
//         const softScore = parseFloat(input.querySelectorAll("input[type='number']")[1].value);
//         members.push({ name, techScore, softScore });
//     });
 
//     return generateTeams(numTeams, members);
// }
 
// function generateTeams(numTeams, members) {
//     members.sort((a, b) => b.techScore - a.techScore);

//     const teams = Array.from({ length: numTeams }, () => ({ leader: null, members: [], totalTechScore: 0 }));

//     members.forEach(member => {
//         let minScore = Infinity;
//         let minTeamIndex = 0;
//         teams.forEach((team, index) => {
//             if (team.totalTechScore < minScore) {
//                 minScore = team.totalTechScore;
//                 minTeamIndex = index;
//             }
//         });
//         teams[minTeamIndex].members.push(member);
//         teams[minTeamIndex].totalTechScore += member.techScore;
//     });

//     teams.forEach(team => {
//         const eligibleLeaders = team.members.filter(member => member.softScore >= 1);
//         if (eligibleLeaders.length > 0) {
//             team.leader = eligibleLeaders[0];
//             team.members = team.members.filter(member => member !== team.leader);
//         }
//     });

//     return teams;
// }
 
// function displayTeams(teams) {
//     const output = document.getElementById("output");
//     teams.forEach((team, index) => {
//         const teamDiv = document.createElement("div");
//         teamDiv.classList.add("team");
//         teamDiv.innerHTML = `
// <h3>Team ${index + 1}</h3>
// <p><strong>Leader:</strong> ${team.leader.name}</p>
// <p><strong>Members:</strong></p>
// <ul>
//                 ${team.members.map(member => `<li>${member.name}</li>`).join("")}
// </ul>
//         `; 
//         output.appendChild(teamDiv);
//     });
// }

// const stars = document.querySelectorAll('.star');
//     stars.forEach(star => {
//         star.addEventListener('click', (event) => {
//             selectedRating = event.target.dataset.value;
//             highlightStars(selectedRating);
//         });
//     });
 
//     function highlightStars(rating) {
//         stars.forEach(star => {
//             star.style.color = star.dataset.value <= rating ? 'gold' : 'grey';
//         });
//     }
//     document.addEventListener('DOMContentLoaded', function() {
//         const submitButton = document.getElementById('submitButton');
//         const output = document.getElementById('output');
       
//         submitButton.addEventListener('click',function(){
//             output.style.visibility = 'visible';
//         })
 
       
//     })