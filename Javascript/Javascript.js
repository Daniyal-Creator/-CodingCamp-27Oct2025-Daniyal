
let todos = [];
let editingId = null;
let currentFilter = 'semua';
let currentSort = 'priority';

function showAlert(message) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = 'alert success';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}

function toggleDescription(id) {
    const content = document.getElementById(`desc-${id}`);
    const toggle = document.getElementById(`toggle-${id}`);
    content.classList.toggle('show');
    toggle.classList.toggle('open');
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    let filteredTodos = [...todos];

    if (currentFilter !== 'semua') {
        filteredTodos = filteredTodos.filter(t => t.priority === currentFilter);
    }

    filteredTodos.sort((a, b) => {
        if (currentSort === 'priority') {
            const priorityOrder = { 'penting': 0, 'lumayan': 1, 'tidak': 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (currentSort === 'date-asc') {
            return new Date(a.schedule) - new Date(b.schedule);
        } else if (currentSort === 'date-desc') {
            return new Date(b.schedule) - new Date(a.schedule);
        }
        return 0;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <h3>📝 Belum ada kegiatan</h3>
                <p>Tambahkan kegiatan baru untuk memulai!</p>
            </div>
        `;
        return;
    }

    todoList.innerHTML = filteredTodos.map(todo => {
        const date = new Date(todo.schedule);
        const formattedDate = date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const priorityText = {
            'penting': 'Penting',
            'lumayan': 'Lumayan',
            'tidak': 'Tidak Terlalu'
        };

        const hasDescription = todo.description && todo.description.trim() !== '';

        return `
            <div class="todo-item priority-${todo.priority}">
                <div class="todo-header">
                    <div class="todo-title">${todo.activity}</div>
                    <span class="priority-badge badge-${todo.priority}">
                        ${priorityText[todo.priority]}
                    </span>
                </div>
                <div class="todo-date">${formattedDate}</div>
                ${hasDescription ? `
                    <button class="todo-description-toggle" id="toggle-${todo.id}" onclick="toggleDescription(${todo.id})">
                        📄 Lihat Detail
                        <span class="arrow">▼</span>
                    </button>
                    <div class="todo-description-content" id="desc-${todo.id}">
                        ${todo.description.replace(/\n/g, '<br>')}
                    </div>
                ` : ''}
                <div class="todo-actions">
                    <button class="btn btn-edit" onclick="editTodo(${todo.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteTodo(${todo.id})">Hapus</button>
                </div>
            </div>
        `;
    }).join('');
}

document.getElementById('todoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const activity = document.getElementById('activity').value.trim();
    const description = document.getElementById('description').value.trim();
    const schedule = document.getElementById('schedule').value;
    const priority = document.getElementById('priority').value;

    if (!activity || !schedule || !priority) {
        alert('Mohon lengkapi field yang wajib diisi (*)!');
        return;
    }

    if (editingId !== null) {
        const index = todos.findIndex(t => t.id === editingId);
        if (index !== -1) {
            todos[index] = { id: editingId, activity, description, schedule, priority };
        }
        editingId = null;
        document.getElementById('submitBtn').textContent = 'Tambah Kegiatan';
        showAlert('✅ Kegiatan berhasil diupdate!');
    } else {
        const newTodo = { id: Date.now(), activity, description, schedule, priority };
        todos.push(newTodo);
        showAlert('✅ Kegiatan berhasil ditambahkan!');
    }

    document.getElementById('todoForm').reset();
    renderTodos();
});

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        document.getElementById('activity').value = todo.activity;
        document.getElementById('description').value = todo.description || '';
        document.getElementById('schedule').value = todo.schedule;
        document.getElementById('priority').value = todo.priority;
        document.getElementById('submitBtn').textContent = 'Update Kegiatan';
        editingId = id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function deleteTodo(id) {
    if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
        todos = todos.filter(t => t.id !== id);
        showAlert('🗑️ Kegiatan berhasil dihapus!');
        renderTodos();
    }
}

// Fungsi filter todos
function filterTodos(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTodos();
}

function sortTodos(sort) {
    currentSort = sort;
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTodos();
}

renderTodos();
