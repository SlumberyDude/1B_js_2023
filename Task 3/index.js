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

    

    // static #wrongRule(rule) {
    //     let errorMsg = `Error, wrong rule format '${rule}'`;

    //     let ruleParts = rule.split('-');
    //     let fieldName = ruleParts[0];

    //     if ( !(fieldName in this.#fieldTypes) ) return errorMsg;

    //     let fieldType = this.#fieldTypes[fieldName];

    //     let keyword;

    //     if (fieldType == 'num') {
    //         keyword = this.#parseNumKW(ruleParts[1]);
    //     }
    //     if (fieldType == 'string') {
    //         if (ruleParts.length != 3) return errorMsg;
    //         keyword = ruleParts[1];
    //     }
    //     if ( !(keyword in this.#typeProps[fieldType]) ) return errorMsg;
        
    //     return false;
    // }

    static #filterRule(products, rule) {
        // let errorMsg = this.#wrongRule(rule);
        // if (errorMsg) return errorMsg;
        let result = [];
        for (let product of products) {
            let goodRule = product.#isRuleFit(rule);
            if (goodRule) result.push(product);
        }
        return result;
    }

    /**
     * "name-contains-fd&price-=2&quantity->5&description-ends-abc"
     * @param {Array} products 
     * @param {string} rulestring
     */
    static filter(products, rulestring) {
        // let prodCopy = products.slice();
        let rules = rulestring.split('&');
        for (let rule of rules) {
            products = this.#filterRule(products, rule);
        }
        return products;
    }
}

let products = [
    new Product({name: 'Игрушка "Слон"', price: 5, quantity: 7, description: 'Фигурка слона'}),
    new Product({name: 'Игрушка "Медведь"', price: 11, quantity: 3, description: 'Фигурка медведя'}),
    new Product({name: 'Игрушка "Жираф"', price: 8, quantity: 21, description: 'Фигурка жирафа'}),
    new Product({name: 'Ноутбук 1', price: 1053, quantity: 5, description: 'Ноутбук для учёбы'}),
    new Product({name: 'Ноутбук 5', price: 1532, quantity: 13, description: 'Ноутбук для работы'}),
    new Product({name: 'Ноутбук 13', price: 2399, quantity: 3, description: 'Игровой ноутбук'}),
    new Product({name: 'Холодильник', price: 671, quantity: 9, description: 'Профессиональный холодильник'}),
    new Product({name: 'Будильник', price: 99, quantity: 32, description: 'Не проспи учёбу! Купи будильник 3000!'}),
    new Product({name: 'Ходильник', price: 173, quantity: 14, description: 'Ходи с нами, не иди против нас'}),
    new Product({name: 'Ножницы', price: 99, quantity: 13, description: 'Профессиональные ножницы для работы'}),
    new Product({name: 'Игрушка "Ножницы"', price: 11, quantity: 32, description: 'Игрушечные ножницы, не для детей'}),
]

// test contains name

// let rulestring = 'name-contains-Игрушка';
// let filProd = Product.filter(products, rulestring);
// console.log(filProd);
// console.log(products.length);

// test contains description
// let rulestring = 'description-contains-ник';
// let filProd = Product.filter(products, rulestring);
// console.log(filProd);

// test starts name
// let rulestring = 'name-starts-Но';
// let filProd = Product.filter(products, rulestring);
// console.log(filProd);

// test ends name
// let rulestring = 'name-ends-ник';
// let filProd = Product.filter(products, rulestring);
// console.log(filProd);

// test name and price
let rulestring = 'name-starts-Но&quantity->=5&price-<1000';
let filProd = Product.filter(products, rulestring);
console.log(filProd);