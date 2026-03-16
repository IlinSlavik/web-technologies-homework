class Pizza {
    static PIZZA_TYPES = {
        MARGHERITA: { name: 'Маргарита', price: 500, calories: 300 },
        PEPPERONI: { name: 'Пепперони', price: 800, calories: 400 },
        BAVARIAN: { name: 'Баварская', price: 700, calories: 450 }
    };

    static SIZES = {
        SMALL: { name: 'Маленькая', price: 100, calories: 100 },
        LARGE: { name: 'Большая', price: 200, calories: 200 }
    };

    static TOPPINGS = {
        CHEESE_BORDER: { 
            name: 'Сырный бортик', 
            getPrice: (size) => size === 'LARGE' ? 300 : 150,
            getCalories: (size) => 50
        },
        MOZZARELLA: { 
            name: 'Сливочная моцарелла', 
            getPrice: (size) => 50,
            getCalories: (size) => 20
        },
        CHEDDAR_PARMESAN: { 
            name: 'Чеддер и пармезан', 
            getPrice: (size) => size === 'LARGE' ? 300 : 150,
            getCalories: (size) => 50
        }
    };

    constructor(pizzaType, size) {
        this.pizzaType = pizzaType;
        this.size = size;
        this.toppings = new Set();
    }

    addTopping(topping) {
        this.toppings.add(topping);
    }

    removeTopping(topping) {
        this.toppings.delete(topping);
    }

    calculatePrice() {
        const basePrice = Pizza.PIZZA_TYPES[this.pizzaType].price;
        const sizePrice = Pizza.SIZES[this.size].price;
        
        let toppingsPrice = 0;
        for (const topping of this.toppings) {
            toppingsPrice += Pizza.TOPPINGS[topping].getPrice(this.size);
        }

        return basePrice + sizePrice + toppingsPrice;
    }

    calculateCalories() {
        const baseCalories = Pizza.PIZZA_TYPES[this.pizzaType].calories;
        const sizeCalories = Pizza.SIZES[this.size].calories;
        
        let toppingsCalories = 0;
        for (const topping of this.toppings) {
            toppingsCalories += Pizza.TOPPINGS[topping].getCalories(this.size);
        }

        return baseCalories + sizeCalories + toppingsCalories;
    }
}

let currentPizza = new Pizza('MARGHERITA', 'SMALL');
let selectedSize = 'SMALL';
let selectedType = 'MARGHERITA';

function init() {
    renderToppings();
    selectPizzaType('MARGHERITA');
    selectSize('SMALL');
    updateButtonText();
}

function renderToppings() {
    const toppingsList = document.getElementById('toppingsList');
    toppingsList.innerHTML = '';

    Object.entries(Pizza.TOPPINGS).forEach(([key, topping]) => {
        const price = topping.getPrice(selectedSize);
        
        const item = document.createElement('div');
        item.className = 'topping-item';
        item.onclick = () => toggleTopping(key);
        
        item.innerHTML = `
            <input type="checkbox" ${currentPizza.toppings.has(key) ? 'checked' : ''}>
            <div class="topping-info">
                <span class="topping-name">${topping.name}</span>
            </div>
            <span class="topping-price">${price} ₽</span>
        `;
        
        toppingsList.appendChild(item);
    });
}

window.selectPizzaType = function(type) {
    selectedType = type;
    currentPizza.pizzaType = type;
    
    document.querySelectorAll('.pizza-type-option').forEach(opt => {
        if (opt.dataset.type === type) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    
    updateButtonText();
}

window.selectSize = function(size) {
    selectedSize = size;
    currentPizza.size = size;
    
    document.querySelectorAll('.size-option').forEach(opt => {
        if (opt.dataset.size === size) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    
    renderToppings();
    updateButtonText();
}

function toggleTopping(toppingKey) {
    if (currentPizza.toppings.has(toppingKey)) {
        currentPizza.removeTopping(toppingKey);
    } else {
        currentPizza.addTopping(toppingKey);
    }
    
    renderToppings();
    updateButtonText();
}

function updateButtonText() {
    const price = currentPizza.calculatePrice();
    const calories = currentPizza.calculateCalories();
    const btn = document.getElementById('addToCartBtn');
    
    btn.textContent = `Добавить в корзину за ${price} ₽ (${calories} кКал)`;
    btn.disabled = false;
}

window.addToCart = function() {
    const pizzaInfo = {
        type: Pizza.PIZZA_TYPES[currentPizza.pizzaType].name,
        size: Pizza.SIZES[currentPizza.size].name,
        toppings: Array.from(currentPizza.toppings).map(key => Pizza.TOPPINGS[key].name),
        price: currentPizza.calculatePrice(),
        calories: currentPizza.calculateCalories()
    };
    
    alert(`Пицца добавлена в корзину!\n\nВид: ${pizzaInfo.type}\nРазмер: ${pizzaInfo.size}\nДобавки: ${pizzaInfo.toppings.join(', ') || 'нет'}\nЦена: ${pizzaInfo.price} ₽\nКалорийность: ${pizzaInfo.calories} кКал`);
    
    console.log('Добавлено в корзину:', pizzaInfo);
}

document.addEventListener('DOMContentLoaded', init);