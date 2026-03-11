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
    MOZZARELLA: { 
      name: 'Сливочная моцарелла', 
      price: 50, 
      calories: 2,
      getPrice: (size) => 50,
      getCalories: (size) => 20
    },
    CHEESE_BORDER: { 
      name: 'Сырный борт', 
      getPrice: (size) => size === 'LARGE' ? 300 : 150,
      getCalories: (size) => 50
    },
    CHEDDAR_PARMESAN: { 
      name: 'Чедер и пармезан', 
      getPrice: (size) => size === 'LARGE' ? 300 : 150,
      getCalories: (size) => 50
    }
  };

  constructor(pizzaType, size) {
    if (!Pizza.PIZZA_TYPES[pizzaType]) {
      throw new Error('Неверный тип пиццы');
    }
    if (!Pizza.SIZES[size]) {
      throw new Error('Неверный размер пиццы');
    }

    this.pizzaType = pizzaType;
    this.size = size;
    this.toppings = new Set();
  }

  addTopping(topping) {
    if (!Pizza.TOPPINGS[topping]) {
      throw new Error('Неверная добавка');
    }
    this.toppings.add(topping);
  }

  removeTopping(topping) {
    this.toppings.delete(topping);
  }

  getToppings() {
    return Array.from(this.toppings).map(t => Pizza.TOPPINGS[t].name);
  }

  getType() {
    return Pizza.PIZZA_TYPES[this.pizzaType].name;
  }

  getSize() {
    return Pizza.SIZES[this.size].name;
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

  getInfo() {
    return {
      type: this.getType(),
      size: this.getSize(),
      toppings: this.getToppings(),
      price: this.calculatePrice(),
      calories: this.calculateCalories()
    };
  }
}


