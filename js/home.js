//Calculate max number of people in each group
document.addEventListener("DOMContentLoaded", function() {
    const numberOfPeople = document.getElementById("numberOfPeople");
    const numberOfGroups = document.getElementById("numberOfGroups");
    const result = document.getElementById("result");

    function calculate() {
        const value1 = parseFloat(numberOfPeople.value) || 0;
        const value2 = parseFloat(numberOfGroups.value) || 0;

        
        const calculationResult = value1 / value2;
        result.value = Math.ceil(calculationResult) ;
    }

    numberOfPeople.addEventListener("input", calculate);
    numberOfGroups.addEventListener("input", calculate);
});


//Generate form
document.getElementById('numberForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const numberOfPeople = parseInt(document.getElementById('numberOfPeople').value);
    generateForm(numberOfPeople);
});

function generateForm(n) {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = ''; // Clear previous content
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    
    ['Serial Number', 'Name', 'Technical Skills Rating', 'Soft Skills Rating'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    
    for (let i = 1; i <= n; i++) {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="text" name="name${i}" required></td>
            <td><input type="number" name="technicalSkills${i}" min="1" max="10" required></td>
            <td><input type="number" name="softSkills${i}" min="1" max="10" required></td>
        `;
    }
    
    formContainer.appendChild(table);
    document.getElementById('submitAll').style.display = 'block';
}

document.getElementById('submitAll').addEventListener('click', function() {
    const tableRows = document.querySelectorAll('#formContainer table tr:not(:first-child)');
    const result = [];
    tableRows.forEach((row, index) => {
        const name = row.querySelector(`input[name="name${index + 1}"]`).value;
        const technicalSkills = row.querySelector(`input[name="technicalSkills${index + 1}"]`).value;
        const softSkills = row.querySelector(`input[name="softSkills${index + 1}"]`).value;
        result.push({
            serialNumber: index + 1,
            name,
            technicalSkills,
            softSkills
        });
    });

    displayResult(result);
});

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h2>Submitted Data:</h2>`;
    data.forEach(person => {
        resultDiv.innerHTML += `
            <p><strong>Serial Number:</strong> ${person.serialNumber}</p>
            <p><strong>Name:</strong> ${person.name}</p>
            <p><strong>Technical Skills Rating:</strong> ${person.technicalSkills}</p>
            <p><strong>Soft Skills Rating:</strong> ${person.softSkills}</p>
            <hr>
        `;
    });
}

//


