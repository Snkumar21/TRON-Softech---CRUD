let students = [];

// DOM references
const form = document.getElementById('studentForm');
const tableBody = document.querySelector('#studentTable tbody');
const searchInput = document.getElementById('searchInput');

// Add Student
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const newStudent = {
        urn: form.urn.value,
        name: form.name.value,
        course: form.course.value,
        percentage: form.percentage.value
    };

    fetch('/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
    })
        .then(res => res.json())
        .then(data => {
            alert("Student added successfully!");
            form.reset();
            fetchStudents();
        })
        .catch(err => {
            console.error("Error adding student:", err);
            alert("Something went wrong!");
        });
});

// Fetch All Students
function fetchStudents() {
    fetch('/students')
        .then(res => res.json())
        .then(data => {
            students = data;
            displayStudents(students);
        })
        .catch(err => console.error("Error fetching students:", err));
}

// Display Student Data
function displayStudents(studentList) {
    tableBody.innerHTML = '';

    studentList.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="action-btn">${student.urn}</td>
            <td class="action-btn">${student.name}</td>
            <td class="action-btn">${student.course}</td>
            <td class="action-btn">${student.percentage}</td>
            <td>
                <button onclick="editStudent(${index})" class="edit-btn" >Edit</button>
                <button onclick="deleteStudent(${index})" class="delete-btn" >Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Delete Student (from DB)
function deleteStudent(index) {
    const urn = students[index].urn;

    fetch(`/delete-student/${urn}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        alert("Student deleted!");
        fetchStudents();
    })
    .catch(err => console.error("Error deleting student:", err));
}

// Edit Student (Update DB)
function editStudent(index) {
    const student = students[index];
    form.urn.value = student.urn;
    form.name.value = student.name;
    form.course.value = student.course;
    form.percentage.value = student.percentage;

    // Disable URN (since it's a unique identifier)
    form.urn.disabled = true;

    // Change submit button text
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = "Update";

    // Update behavior
    form.onsubmit = function (e) {
        e.preventDefault();

        const updatedStudent = {
            name: form.name.value,
            course: form.course.value,
            percentage: form.percentage.value
        };

        fetch(`/update-student/${student.urn}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedStudent)
        })
        .then(res => res.json())
        .then(data => {
            alert("Student updated successfully!");
            form.reset();
            form.urn.disabled = false;
            submitBtn.textContent = "Submit";
            fetchStudents();

            // Restore default form submission
            form.onsubmit = defaultSubmitHandler;
        })
        .catch(err => console.error("Update error:", err));
    };
}

// Default Add handler
function defaultSubmitHandler(e) {
    e.preventDefault();

    const newStudent = {
        urn: form.urn.value,
        name: form.name.value,
        course: form.course.value,
        percentage: form.percentage.value
    };

    fetch('/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
    })
    .then(res => res.json())
    .then(data => {
        alert("Student added successfully!");
        form.reset();
        fetchStudents();
    })
    .catch(err => {
        console.error("Error adding student:", err);
        alert("Something went wrong!");
    });
}

// Search Students
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.urn.toLowerCase().includes(query)
    );
    displayStudents(filtered);
});

// Initial load
document.addEventListener('DOMContentLoaded', fetchStudents);

// Set initial submit handler
form.onsubmit = defaultSubmitHandler;