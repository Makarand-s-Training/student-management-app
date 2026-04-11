const STORAGE_KEY = "student-management-app.students";
const SESSION_KEY = "student-management-app.session";

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";

// ── Auth helpers ─────────────────────────────────────────────────────────────

function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "true";
}

function login(username, password) {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, "true");
        return true;
    }
    return false;
}

function logout() {
    sessionStorage.removeItem(SESSION_KEY);
}

function showApp() {
    document.getElementById("login-overlay").hidden = true;
    document.getElementById("app-content").hidden = false;
}

function showLogin() {
    document.getElementById("app-content").hidden = true;
    document.getElementById("login-overlay").hidden = false;
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const loginStatus = document.getElementById("login-status");
    const username = form.elements["username"].value.trim();
    const password = form.elements["password"].value;

    if (!username || !password) {
        loginStatus.textContent = "Username and password are required.";
        return;
    }

    if (login(username, password)) {
        loginStatus.textContent = "";
        form.reset();
        showApp();
        renderStudents();
    } else {
        loginStatus.textContent = "Invalid username or password.";
    }
}

function handleLogout() {
    logout();
    showLogin();
}

// ── Student helpers ───────────────────────────────────────────────────────────

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
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", handleLoginSubmit);

    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", handleLogout);

    const studentForm = document.getElementById("student-form");
    studentForm.addEventListener("submit", handleStudentSubmit);

    if (isLoggedIn()) {
        showApp();
        renderStudents();
    } else {
        showLogin();
    }
});