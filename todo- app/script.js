const inputField = document.getElementById('input');
const addButton = document.getElementById('btn');
const todoList = document.getElementById('a');
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskValue = inputField.value.trim();

    if (taskValue !== "") {
        const li = document.createElement('li');

        // Text span (better control ke liye)
        const span = document.createElement('span');
        span.textContent = taskValue;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        // LI me dono add karo
        li.appendChild(span);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);

        inputField.value = "";
    } else {
        alert("Kuch toh likho bhai!");
    }
});

