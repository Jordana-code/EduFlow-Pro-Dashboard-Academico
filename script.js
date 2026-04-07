document.addEventListener('DOMContentLoaded', () => {
    const subjectInput = document.getElementById('subjectInput');
    const taskInput = document.getElementById('taskInput');
    const colorSelect = document.getElementById('colorSelect');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const progressBar = document.getElementById('progressBar');
    const percentTxt = document.getElementById('percentTxt');
    const dateDisplay = document.getElementById('dateDisplay');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearBtn = document.getElementById('clearBtn');

    let tasks = JSON.parse(localStorage.getItem('eduFlow_neon_v1')) || [];
    let currentFilter = 'all';

    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    dateDisplay.innerText = new Date().toLocaleDateString('pt-BR', dateOptions);

    function updateApp() {
        tasks.sort((a, b) => b.pinned - a.pinned);
        localStorage.setItem('eduFlow_neon_v1', JSON.stringify(tasks));
        render();
    }

    function render() {
        taskList.innerHTML = '';
        const filtered = tasks.filter(t => {
            if (currentFilter === 'pending') return !t.completed;
            if (currentFilter === 'completed') return t.completed;
            return true;
        });

        filtered.forEach((task) => {
            const li = document.createElement('li');
            li.className = `${task.color} ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <button class="pin-btn ${task.pinned ? 'active' : ''}">${task.pinned ? '★' : '☆'}</button>
                <input type="checkbox" ${task.completed ? 'checked' : ''} style="cursor:pointer; width:18px; height:18px;">
                <div class="task-info">
                    <span class="subject-tag">${task.subject}</span>
                    <span class="task-text">${task.text}</span>
                </div>
                <button class="del-btn">&times;</button>
            `;

            li.querySelector('.pin-btn').onclick = () => {
                const idx = tasks.findIndex(item => item.id === task.id);
                tasks[idx].pinned = !tasks[idx].pinned;
                updateApp();
            };

            li.querySelector('input').onclick = () => {
                const idx = tasks.findIndex(item => item.id === task.id);
                tasks[idx].completed = !tasks[idx].completed;
                updateApp();
            };

            li.querySelector('.del-btn').onclick = () => {
                li.style.transform = 'scale(0.9)';
                li.style.opacity = '0';
                setTimeout(() => {
                    tasks = tasks.filter(item => item.id !== task.id);
                    updateApp();
                }, 200);
            };
            taskList.appendChild(li);
        });

        const done = tasks.filter(t => t.completed).length;
        const total = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
        progressBar.style.width = `${total}%`;
        percentTxt.innerText = `${total}%`;
    }

    addBtn.onclick = () => {
        const sub = subjectInput.value.trim();
        const task = taskInput.value.trim();
        if (!task) return;
        tasks.push({ id: Date.now(), subject: sub || "Geral", text: task, color: colorSelect.value, completed: false, pinned: false });
        subjectInput.value = ''; taskInput.value = ''; updateApp();
    };

    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        };
    });

    clearBtn.onclick = () => { if(confirm("Limpar concluídas?")) { tasks = tasks.filter(t => !t.completed); updateApp(); } };

    [subjectInput, taskInput].forEach(el => el.onkeypress = (e) => { if (e.key === 'Enter') addBtn.click(); });
    render();
});