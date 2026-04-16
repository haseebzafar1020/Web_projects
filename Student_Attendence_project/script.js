const nameInput = document.getElementById("studentName")
const dateInput = document.getElementById("attendanceDate")
const tableBody = document.querySelector("#attendanceTable tbody")

let students = []
let rollNo = 1

window.onload = function (){
    const savedData = localStorage.getItem("students");
    if (savedData) {
        students = JSON.parse(savedData)
        rollNo = students[students.length -1].roll + 1 ;
    }

    setTodayDate();
    displayStudents();
}

function setTodayDate(){
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today
    dateInput.addEventListener("change", displayStudents)
}

function savedData(){
    localStorage.setItem("students", JSON.stringify(students))
}

function addStudent(){
    const name = nameInput.value.trim();

    if (name === '') {
        alert("Student name is required")
        return
    }

    const student = {
        roll: rollNo,
        name: name,
        attendance:{}
    }

    students.push(student)
    rollNo++;
    nameInput.value = ""
    savedData()
    displayStudents();
}

function displayStudents(){
    tableBody.innerHTML = ""
    let selectedDate = dateInput.value;

    students.forEach((student) => {
        let status = student.attendance[selectedDate] || "Not Marked";

        const row = document.createElement("tr")

        row.innerHTML = `
            <td> ${student.roll}</td>
            <td> ${student.name}</td>
            <td> 
                <span class="${status === 'Present' ? 'present': status === 'Absent' ? 'absent' : "" }">${status}</span><br>
                <button class="status-btn present-btn" onclick="markAttendance(${student.roll}, 'Present')">Present</button>
                <button class="status-btn absent-btn" onclick="markAttendance(${student.roll}, 'Absent')">Absent</button>
            </td>
        `;

        tableBody.appendChild(row)
    });
}

function markAttendance(roll, status){
    const selectedDate = dateInput.value;
    const student = students.find(s => s.roll === roll)

    if (student) {
        student.attendance[selectedDate] = status;
    }

    savedData();
    displayStudents();
}

