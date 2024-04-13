document.addEventListener('DOMContentLoaded', function () {
    // Obtener elementos del DOM
    const taskInput = document.getElementById('taskInput'); //Campo para el nombre de la tarea
    const startDateInput = document.getElementById('startDate'); //Fecha de incio
    const dueDateInput = document.getElementById('dueDate'); //Fecha de vencimiento
    const taskList = document.getElementById('taskList'); //Lista no ordenada de las tareas
    const filterAll = document.getElementById('filterAll'); //Mostrar todas las tareas
    const filterActive = document.getElementById('filterActive'); //Mostrar las tareas pendientes
    const filterCompleted = document.getElementById('filterCompleted'); //Mostrar las tareas completadas
    const clearCompleted = document.getElementById('clearCompleted'); //Quitar todas las tareas completadas

    // Obtener tareas guardadas en localStorage o inicializar como un array vacío
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Función para renderizar las tareas en el DOM y aparicion de los respectivos botones de las tareas
    function renderTasks() {
        taskList.innerHTML = ''; // Limpiar lista de tareas
        tasks.forEach((task, index) => {
            const li = document.createElement('li'); // Crear elemento li para cada tarea
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="taskText ${task.completed ? 'completed' : ''}">
                    ${task.text} - Fecha Inicio: ${task.startDate || 'N/A'} - Fecha Vencimiento: ${task.dueDate || 'N/A'}
                </span>
                <button class="editBtn">Editar</button> 
                <button class="editDueDateBtn">Editar Fecha</button>
                <button class="deleteBtn">Eliminar</button>
            `; // HTML de cada tarea con checkbox, texto y botones

            taskList.appendChild(li); // Agregar tarea a la lista

            // Evento change para el checkbox de completado
            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => {
                tasks[index].completed = checkbox.checked; // Actualizar estado de completado
                renderTasks(); // Renderizar tareas
                saveTasks(); // Guardar tareas en localStorage
            });

            // Evento click para el botón de editar tarea
            const editBtn = li.querySelector('.editBtn');
            editBtn.addEventListener('click', () => {
                const newText = prompt('Editar tarea:', task.text); // Pedir nuevo texto para tarea
                if (newText !== null && newText.trim() !== '') {
                    tasks[index].text = newText.trim(); // Actualizar texto de la tarea
                    renderTasks(); // Renderizar tareas
                    saveTasks(); // Guardar tareas en localStorage
                }
            });

            // Evento click para el botón de editar fecha de vencimiento
            const editDueDateBtn = li.querySelector('.editDueDateBtn');
            editDueDateBtn.addEventListener('click', () => {
                const newDueDate = prompt('Editar fecha de vencimiento: dd-mm-aaaa', task.dueDate); // Pedir nueva fecha de vencimiento
                if (newDueDate !== null) {
                    tasks[index].dueDate = newDueDate; // Actualizar fecha de vencimiento
                    renderTasks(); // Renderizar tareas
                    saveTasks(); // Guardar tareas en localStorage
                }
            });

            // Evento click para el botón de eliminar tarea
            const deleteBtn = li.querySelector('.deleteBtn');
            deleteBtn.addEventListener('click', () => {
                tasks.splice(index, 1); // Eliminar tarea del array
                renderTasks(); // Renderizar tareas
                saveTasks(); // Guardar tareas en localStorage
            });
        });
    }

    // Función para guardar tareas en localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Función para agregar nueva tarea
    function addTask() {
        const newTask = {
            text: taskInput.value.trim(), // Obtener texto de la tarea
            completed: false, // Inicializar como no completada
            startDate: startDateInput.value, // Obtener fecha de inicio
            dueDate: dueDateInput.value // Obtener fecha de vencimiento
        };
        tasks.push(newTask); // Agregar nueva tarea al array
        taskInput.value = ''; // Limpiar campo de texto
        startDateInput.value = ''; // Limpiar campo de fecha de inicio
        dueDateInput.value = ''; // Limpiar campo de fecha de vencimiento
        renderTasks(); // Renderizar tareas
        saveTasks(); // Guardar tareas en localStorage
    }

    // Evento input para limitar el número de caracteres en el campo taskInput
    taskInput.addEventListener('input', () => {
        if (taskInput.value.length > 20) {
            taskInput.value = taskInput.value.slice(0, 20); // Recortar texto a 20 caracteres
        }
    });

    // Evento keypress para agregar tarea al presionar Enter en taskInput
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim() !== '') {
            addTask(); // Agregar tarea
        }
    });

    // Evento keypress para enfocar taskInput al presionar Enter en startDateInput o dueDateInput
    startDateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim() !== '') {
            taskInput.focus(); // Enfocar taskInput
        }
    });

    dueDateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim() !== '') {
            taskInput.focus(); // Enfocar taskInput
        }
    });

    // Evento keypress para agregar tarea al presionar Enter en cualquier parte del documento
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim() !== '' && document.activeElement !== taskInput && document.activeElement !== startDateInput && document.activeElement !== dueDateInput) {
            addTask(); // Agregar tarea
        }
    });

    // Evento click para filtrar todas las tareas
    filterAll.addEventListener('click', () => {
        renderTasks(); // Renderizar tareas
    });

    // Evento click para filtrar tareas activas
    filterActive.addEventListener('click', () => {
        const activeTasks = tasks.filter(task => !task.completed); // Filtrar tareas activas
        taskList.innerHTML = ''; // Limpiar lista de tareas
        activeTasks.forEach(task => {
            const li = document.createElement('li'); // Crear elemento li para cada tarea activa
            li.innerHTML = `
                <input type="checkbox">
                <span class="taskText">
                    ${task.text} - Fecha Inicio: ${task.startDate || 'N/A'} - Fecha Vencimiento: ${task.dueDate || 'N/A'}
                </span>
                <button class="editBtn">Editar</button>
                <button class="editDueDateBtn">Editar Fecha de Vencimiento</button>
                <button class="deleteBtn">Eliminar</button>
            `; // HTML de cada tarea activa con checkbox, texto y botones
            taskList.appendChild(li); // Agregar tarea a la lista
        });
    });

    // Evento click para filtrar tareas completadas
    filterCompleted.addEventListener('click', () => {
        const completedTasks = tasks.filter(task => task.completed); // Filtrar tareas completadas
        taskList.innerHTML = ''; // Limpiar lista de tareas
        completedTasks.forEach(task => {
            const li = document.createElement('li'); // Crear elemento li para cada tarea completada
            li.innerHTML = `
                <input type="checkbox" checked>
                <span class="taskText completed">
                    ${task.text} - Fecha Inicio: ${task.startDate || 'N/A'} - Fecha Vencimiento: ${task.dueDate || 'N/A'}
                </span>
                <button class="editBtn">Editar</button>
                <button class="editDueDateBtn">Editar Fecha de Vencimiento</button>
                <button class="deleteBtn">Eliminar</button>
            `; // HTML de cada tarea completada con checkbox, texto y botones
            taskList.appendChild(li); // Agregar tarea a la lista
        });
    });

    // Evento click para limpiar tareas completadas
    clearCompleted.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed); // Filtrar tareas no completadas
        renderTasks(); // Renderizar tareas
        saveTasks(); // Guardar tareas en localStorage
    });

    // Renderizar tareas al cargar la página
    renderTasks();
});