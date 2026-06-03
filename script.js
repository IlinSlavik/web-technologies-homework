class TreeMenu {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Контейнер меню не найден');
            return;
        }
        this.init();
    }

    init() {
        this.addEventListeners();
        this.restoreState();
    }

    addEventListeners() {
        this.container.addEventListener('click', (e) => {
            const header = e.target.closest('.menu-header');
            if (!header) return;

            const hasChildren = header.classList.contains('has-children');
            if (!hasChildren) return;

            this.toggleMenuItem(header);
        });
    }

    toggleMenuItem(header) {
        const menuContent = header.nextElementSibling;
        if (!menuContent || !menuContent.classList.contains('menu-content')) return;

        header.classList.toggle('active');
        
        menuContent.classList.toggle('open');
        
        this.saveState(header.parentElement.dataset.id, menuContent.classList.contains('open'));
        
        this.animateMenu(menuContent);
    }

    animateMenu(menuContent) {
        if (menuContent.classList.contains('open')) {
            menuContent.style.display = 'block';
            menuContent.style.opacity = '0';
            menuContent.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                menuContent.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                menuContent.style.opacity = '1';
                menuContent.style.transform = 'translateY(0)';
            }, 10);
            
            setTimeout(() => {
                menuContent.style.transition = '';
                menuContent.style.opacity = '';
                menuContent.style.transform = '';
            }, 220);
        } else {
            menuContent.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            menuContent.style.opacity = '0';
            menuContent.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                menuContent.style.display = 'none';
                menuContent.style.transition = '';
                menuContent.style.opacity = '';
                menuContent.style.transform = '';
            }, 200);
        }
    }

    saveState(itemId, isOpen) {
        let states = this.getStoredStates();
        if (isOpen) {
            states[itemId] = true;
        } else {
            delete states[itemId];
        }
        localStorage.setItem('menuStates', JSON.stringify(states));
    }

    restoreState() {
        const states = this.getStoredStates();
        
        for (const [itemId, isOpen] of Object.entries(states)) {
            const menuItem = this.container.querySelector(`.menu-item[data-id="${itemId}"]`);
            if (menuItem) {
                const header = menuItem.querySelector('.menu-header');
                const menuContent = header?.nextElementSibling;
                
                if (header && menuContent && header.classList.contains('has-children') && isOpen) {
                    header.classList.add('active');
                    menuContent.classList.add('open');
                    menuContent.style.display = 'block';
                }
            }
        }
    }

    getStoredStates() {
        const stored = localStorage.getItem('menuStates');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Ошибка парсинга сохраненных состояний', e);
                return {};
            }
        }
        return {};
    }

    openAll() {
        const allHeaders = this.container.querySelectorAll('.menu-header.has-children');
        allHeaders.forEach(header => {
            if (!header.classList.contains('active')) {
                this.toggleMenuItem(header);
            }
        });
    }

    closeAll() {
        const allHeaders = this.container.querySelectorAll('.menu-header.has-children.active');
        allHeaders.forEach(header => {
            this.toggleMenuItem(header);
        });
    }

    clearStates() {
        localStorage.removeItem('menuStates');
        this.closeAll();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menu = new TreeMenu('menuContainer');
    
    window.treeMenu = menu;
    
    console.log('Меню инициализировано. Для управления используйте window.treeMenu');
});

window.addEventListener('beforeunload', () => {});