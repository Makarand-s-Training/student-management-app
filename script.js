const STORAGE_KEY = "sinhgadCollegeStudents";

const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const statusMessage = document.getElementById("statusMessage");
const refreshButton = document.getElementById("refreshButton");

function getStudents() {
    const storedStudents = localStorage.getItem(STORAGE_KEY);

    if (!storedStudents) {
        return [];
    }

    try {
        return JSON.parse(storedStudents);
    } catch {
        return [];
    }
}

function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function addStudent(student) {
    const students = getStudents();
    students.push(student);
    saveStudents(students);
}

function listStudents() {
    const students = getStudents();

    if (students.length === 0) {
        studentList.innerHTML = '<div class="empty-state">No student records found. Add a student to get started.</div>';
        return;
    }

    studentList.innerHTML = students
        .map((student) => `
      <article class="student-card">
        <h3>${student.name}</h3>
        <p class="student-meta"><strong>Roll Number:</strong> ${student.rollNo}</p>
        <p class="student-meta"><strong>Course:</strong> ${student.course}</p>
      </article>
    `)
        .join("");
}

studentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(studentForm);
    const student = {
        name: formData.get("studentName").toString().trim(),
        rollNo: formData.get("studentRollNo").toString().trim(),
        course: formData.get("studentCourse").toString().trim()
    };

    if (!student.name || !student.rollNo || !student.course) {
        statusMessage.textContent = "Please fill in all student details.";
        return;
    }

    addStudent(student);
    studentForm.reset();
    statusMessage.textContent = `Student ${student.name} added successfully.`;
    listStudents();
});

refreshButton.addEventListener("click", listStudents);

listStudents();