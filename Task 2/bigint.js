

const operations = {
    '+': (a, b) => {
        return BigInt(a) + BigInt(b);
    },
    '-': (a, b) => {
        return BigInt(a) - BigInt(b);
    },
    '*': (a, b) => {
        return BigInt(a) * BigInt(b);
    },
    '/': (a, b) => {
        return BigInt(a) / BigInt(b);
    }
}


/**
 * 
 * @param {string} expression 
 * @returns {string}
 */
export function execute(expression) {
    let items = expression.split(' ');
    if (items.length != 3) {
        return new Result({
            number: NaN,
            success: false,
            message: 'Wrong format'
        })
    }

    let [a, op, b] = items;

    if ( !(op in operations) ) {
        return new Result({
            number: NaN,
            success: false,
            message: `Wrong operator '${op}' Module supports '${Object.keys(operations)}'`
        })
    }

    return operations[op](a, b);
}