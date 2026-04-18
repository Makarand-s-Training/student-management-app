const STORAGE_KEY = "sinhgadCollegeStudents";
const AUTH_STORAGE_KEY = "sinhgadCollegeCurrentUser";
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin123";

const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const statusMessage = document.getElementById("statusMessage");
const refreshButton = document.getElementById("refreshButton");
const loginForm = document.getElementById("loginForm");
const loginPanel = document.getElementById("loginPanel");
const appContent = document.getElementById("appContent");
const logoutButton = document.getElementById("logoutButton");
const authStatus = document.getElementById("authStatus");

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

function getCurrentUser() {
    const currentUser = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!currentUser) {
        return null;
    }

    try {
        return JSON.parse(currentUser);
    } catch {
        return null;
    }
}

function saveCurrentUser(username) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ username }));
}

function clearCurrentUser() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

function setAuthMessage(message) {
    authStatus.textContent = message;
}

function renderAuthState() {
    const currentUser = getCurrentUser();
    const isLoggedIn = Boolean(currentUser);

    loginPanel.classList.toggle("hidden", isLoggedIn);
    appContent.classList.toggle("hidden", !isLoggedIn);
    logoutButton.classList.toggle("hidden", !isLoggedIn);

    if (isLoggedIn) {
        setAuthMessage(`Logged in as ${currentUser.username}.`);
        listStudents();
        return;
    }

    setAuthMessage("Please log in to continue.");
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

    if (!getCurrentUser()) {
        statusMessage.textContent = "Please log in before adding students.";
        return;
    }

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

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = formData.get("username").toString().trim();
    const password = formData.get("password").toString().trim();

    if (!username || !password) {
        setAuthMessage("Please enter username and password.");
        return;
    }

    if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
        setAuthMessage("Invalid username or password.");
        return;
    }

    saveCurrentUser(username);
    loginForm.reset();
    renderAuthState();
});

logoutButton.addEventListener("click", () => {
    clearCurrentUser();
    renderAuthState();
    statusMessage.textContent = "";
});

refreshButton.addEventListener("click", listStudents);

renderAuthState();
