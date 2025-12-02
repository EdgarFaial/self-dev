let items = JSON.parse(localStorage.getItem('checklistItems')) || [];

function addItem() {
    const text = document.getElementById('itemInput').value.trim();
    if (text === '') {
        alert('Digite uma missão antes de adicionar!');
        return;
    }
    
    const newItem = {
        id: Date.now(),
        text: text,
        completed: false,
        addedAt: new Date().toISOString()
    };
    
    items.push(newItem);
    saveItems();
    renderChecklist();
    document.getElementById('itemInput').value = '';
    document.getElementById('itemInput').focus();
}

function toggleCompletion(id) {
    const item = items.find(item => item.id === id);
    if (item) {
        item.completed = !item.completed;
        saveItems();
        renderChecklist();
        
        // Remover automaticamente após ser marcada como concluída
        if (item.completed) {
            setTimeout(() => {
                removeCompletedItem(id);
            }, 1000);
        }
    }
}

function removeCompletedItem(id) {
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex !== -1 && items[itemIndex].completed) {
        // Animação de remoção
        const itemElement = document.querySelector(`[data-id="${id}"]`);
        if (itemElement) {
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                items.splice(itemIndex, 1);
                saveItems();
                renderChecklist();
            }, 300);
        }
    }
}

function renderChecklist() {
    const checklist = document.getElementById('checklist');
    
    if (items.length === 0) {
        checklist.innerHTML = '<div class="empty-message">Nenhuma missão adicionada. Comece adicionando sua primeira quest!</div>';
        return;
    }
    
    checklist.innerHTML = '';
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.setAttribute('data-id', item.id);
        
        if (item.completed) {
            li.classList.add('completed');
        }
        
        li.innerHTML = `
            <input type="checkbox" ${item.completed ? 'checked' : ''}>
            <span>${item.text}</span>
        `;
        
        li.querySelector('input').addEventListener('change', () => toggleCompletion(item.id));
        checklist.appendChild(li);
    });
}

function saveItems() {
    localStorage.setItem('checklistItems', JSON.stringify(items));
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Configurar botão de adicionar
    document.getElementById('addBtn').addEventListener('click', addItem);
    
    // Configurar tecla Enter no input
    document.getElementById('itemInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });
    
    // Focar no input ao carregar
    document.getElementById('itemInput').focus();
    
    // Renderizar lista inicial
    renderChecklist();
    
    // Adicionar algumas missões de exemplo se estiver vazio
    if (items.length === 0) {
        const exampleQuests = [
            "Derrotar o boss final",
            "Coletar 10 cristais mágicos",
            "Explorar a caverna sombria",
            "Completar a missão principal"
        ];
        
        // Oferecer para adicionar exemplos
        if (confirm('Deseja adicionar algumas missões de exemplo?')) {
            exampleQuests.forEach(quest => {
                items.push({
                    id: Date.now() + Math.random(),
                    text: quest,
                    completed: false,
                    addedAt: new Date().toISOString()
                });
            });
            saveItems();
            renderChecklist();
        }
    }
});