
const menuData = [
    {
        label: 'Каталог товаров',
        children: [
            {
                label: 'Мойки',
                children: [
                    { label: 'Ulgran', children: [
                        { label: 'Smith', children: [] },
                        { label: 'Smith', children: [] }
                    ] },
                    { label: 'Vigro Mramor', children: [] },
                    {
                        label: 'Handmade',
                        children: [
                            { label: 'Smith', children: [] },
                            { label: 'Smith', children: [] }
                        ]
                    },
                    { label: 'Vigro Glass', children: [] }
                ]
            },
            {
                label: 'Фильтры',
                children: [
                    { label: 'Ulgran', children: [
                        { label: 'Smith', children: [] },
                        { label: 'Smith', children: [] }
                        ] },
                    { label: 'Vigro Mramor', children: [] }
                ]
            }
        ]
    }
];

function makeMenu(items) {
    let result = '';

    for (let item of items) {
        const hasChildren = item.children.length > 0;

        result += `<div class="menu-item">
            <div class="menu-header ${hasChildren ? 'has-children' : ''}">
                <div class="toggle"></div>
                <span class="item-label">${item.label}</span>
            </div>`;

        if (hasChildren) {
            result += `<div class="menu-content">
                ${makeMenu(item.children)}
            </div>`;
        }

        result += `</div>`;
    }

    return result;
}

function initMenu() {
    const menu = document.getElementById('menuContainer');
    menu.innerHTML = makeMenu(menuData);

    menu.addEventListener('click', (e) => {
        const header = e.target.closest('.menu-header');
        if (!header || !header.classList.contains('has-children')) return;

        header.classList.toggle('active');
        header.nextElementSibling.classList.toggle('open');
    });
}


document.addEventListener('DOMContentLoaded', initMenu);