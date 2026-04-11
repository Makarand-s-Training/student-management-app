const STORAGE_KEY = "student-management-app.students";

function getStoredStudents() {
    const rawStudents = localStorage.getItem(STORAGE_KEY);

    if (!rawStudents) {
        return [];
    }

    try {
        const students = JSON.parse(rawStudents);
        return Array.isArray(students) ? students : [];
    } catch {
        return [];
    }
}

function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function listStudents() {
    return getStoredStudents();
}

function renderStudents() {
    const studentListElement = document.getElementById("student-list");
    const studentCountElement = document.getElementById("student-count");
    const students = listStudents();

    studentCountElement.textContent = `${students.length} ${students.length === 1 ? "student" : "students"}`;

    if (students.length === 0) {
        studentListElement.innerHTML = '<div class="empty-state">No students added yet.</div>';
        return;
    }

    studentListElement.innerHTML = students
        .map(
            (student) => `
        <article class="student-card">
          <h3>${student.name}</h3>
          <p class="student-meta">Student ID: ${student.studentId}</p>
          <p class="student-meta">Course: ${student.course}</p>
        </article>
      `
        )
        .join("");
}

function addStudent(student) {
    const students = listStudents();
    const updatedStudents = [...students, student];
    saveStudents(updatedStudents);
    renderStudents();
}

function handleStudentSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formStatus = document.getElementById("form-status");
    const formData = new FormData(form);
    const student = {
        name: formData.get("name").toString().trim(),
        studentId: formData.get("studentId").toString().trim(),
        course: formData.get("course").toString().trim(),
    };

    if (!student.name || !student.studentId || !student.course) {
        formStatus.textContent = "All fields are required.";
        return;
    }

    addStudent(student);
    form.reset();
    formStatus.textContent = `Added ${student.name}.`;
}

document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("student-form");
    studentForm.addEventListener("submit", handleStudentSubmit);
    renderStudents();
});