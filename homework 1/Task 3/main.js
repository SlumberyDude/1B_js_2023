class Product {
    constructor({name, price, quantity, description}) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
    }

    static #fieldTypes = {
        'name': 'string',
        'price': 'num',
        'quantity': 'num',
        'description': 'string',
    }

    static #parseRule(rule) {
        let ruleParts = rule.split('-');

        if (ruleParts.length == 3) return ruleParts;

        let keyword = '';
        for (let ch of ruleParts[1]) {
            if ( isFinite(ch) ) break;
            keyword += ch;
        }
        let num = +ruleParts[1].slice(keyword.length);
    
        return [ruleParts[0], keyword, num];
    }

    #typeProps = {
        'string': {
            'contains': (fieldname, substr) => {
                return this[fieldname].includes(substr);
            },
            'starts': (fieldname, substr) => {
                return this[fieldname].startsWith(substr);
            },
            'ends': (fieldname, substr) => {
                return this[fieldname].endsWith(substr);
            }
        },
        'num': {
            '>': (fieldname, num) => {
                return this[fieldname] > num;
            },
            '<': (fieldname, num) => {
                return this[fieldname] < num;
            },
            '=': (fieldname, num) => {
                return this[fieldname] === num;
            },
            '>=': (fieldname, num) => {
                return this[fieldname] >= num;
            },
            '<=': (fieldname, num) => {
                return this[fieldname] <= num;
            },
        }
    }

    #isRuleFit(rule) {
        let [fieldName, keyword, val] = Product.#parseRule(rule);

        let fieldType = Product.#fieldTypes[fieldName];
        
        let func = this.#typeProps[fieldType][keyword];

        return func(fieldName, val);
    }

    static #filterRule(products, rule) {
        let result = [];
        for (let product of products) {
            let goodRule = product.#isRuleFit(rule);
            if (goodRule) result.push(product);
        }
        return result;
    }

    /**
     * 
     * @param {Array} products 
     * @param {string} rulestring
     */
    static filter(products, rulestring) {
        let rules = rulestring.split('&');
        for (let rule of rules) {
            products = this.#filterRule(products, rule);
        }
        return products;
    }
}

let products = [
    new Product({name: 'Игрушка "Слон"', price: 5, quantity: 7, description: 'Фигурка слона'}), // 0
    new Product({name: 'Игрушка "Медведь"', price: 11, quantity: 3, description: 'Фигурка медведя'}), // 1
    new Product({name: 'Игрушка "Жираф"', price: 8, quantity: 21, description: 'Фигурка жирафа'}), // 2
    new Product({name: 'Ноутбук 1', price: 1053, quantity: 5, description: 'Ноутбук для учёбы'}), // 3
    new Product({name: 'Ноутбук 5', price: 1532, quantity: 13, description: 'Ноутбук для работы'}), // 4
    new Product({name: 'Ноутбук 13', price: 2399, quantity: 3, description: 'Игровой ноутбук'}), // 5
    new Product({name: 'Холодильник', price: 671, quantity: 9, description: 'Профессиональный холодильник'}), // 6
    new Product({name: 'Будильник', price: 99, quantity: 32, description: 'Не проспи учёбу! Купи будильник 3000!'}), // 7
    new Product({name: 'Ходильник', price: 173, quantity: 14, description: 'Ходи с нами, не иди против нас'}), // 8
    new Product({name: 'Ножницы', price: 99, quantity: 13, description: 'Профессиональные ножницы для работы'}), // 9
    new Product({name: 'Игрушка "Ножницы"', price: 11, quantity: 32, description: 'Игрушечные ножницы, не для детей'}), // 10
]

// test name and quantity
let rulestring1 = 'name-starts-Но&quantity->=5&price-<1000';
let filProd1 = Product.filter(products, rulestring1);
console.assert(filProd1[0] == products[9]);

// test contains name
let rulestring2 = 'name-contains-Игрушка';
let filProd2 = Product.filter(products, rulestring2);
console.assert(filProd2.length == 4);
console.assert(filProd2.includes(products[0]));
console.assert(filProd2.includes(products[1]));
console.assert(filProd2.includes(products[2]));
console.assert(filProd2.includes(products[10]));

// test starts name equal price
let rulestring3 = 'name-starts-Игрушка&price-=11';
let filProd3 = Product.filter(products, rulestring3);
console.assert(filProd3.length == 2);
console.assert(filProd3.includes(products[1]));
console.assert(filProd3.includes(products[10]));

// test description ends
let rulestring4 = 'description-ends-работы';
let filProd4 = Product.filter(products, rulestring4);
console.assert(filProd4.length == 2);
console.assert(filProd4.includes(products[4]));
console.assert(filProd4.includes(products[9]));

// test description ends and price <= 200
let rulestring5 = 'description-ends-работы&price-<=200';
let filProd5 = Product.filter(products, rulestring5);
console.assert(filProd5.length == 1);
console.assert(filProd5.includes(products[9]));