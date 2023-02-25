function Result({number, success, message}) {
    this.number = number;
    this.success = success;
    this.message = message;
}

const CUTSIZE = 1;

function cutString(str) {
    let res = [];
    let begin = str.length;
    while (begin) {
        let end = begin;
        begin = (begin > CUTSIZE) ? begin - CUTSIZE : 0;
        res.push( str.slice(begin, end) );
    }
    return res;
}

function sumBig(a, b) {
    // check for negative numbers
    let sign = '';
    if (a[0] == '-' && b[0] == '-') {
        return '-' + sumBig(a.slice(1), b.slice(1));
    }
    if (a[0] == '-') return sumBig(b, a);
    if (b[0] == '-') {
        b = b.slice(1);
        sign = '-';
    }

    let aPieces = cutString(a);
    let bPieces = cutString(b);
    let resarr = [];
    let overflow = 0;
    let ai = 0;
    let bi = 0;
    while (ai < aPieces.length && bi < bPieces.length) {
        let aNum = +aPieces[ai++];
        let bNum = +( sign + bPieces[bi++] );
        let sum = aNum + bNum + overflow;
        // console.log(`sum = ${sum}`)
        if (sum < 0) {
            sum = -sum;
        }
        overflow = Math.floor(sum / 10**CUTSIZE);
        sum = sum % 10**CUTSIZE;
        let zeroesNeed = CUTSIZE - ('' + sum).length;
        sum = '0'.repeat(zeroesNeed) + sum;
        // console.log(`sum = ${sum}`)
        resarr.push(sum);
    }

    let rest = [];
    let resti = 0;
    if (ai < aPieces.length) {
        rest = aPieces;
        resti = ai;
    }
    if (bi < bPieces.length) {
        rest = bPieces;
        resti = bi;
    } 

    while (resti < rest.length) {
        let sum = +rest[resti++] + overflow;
        resarr.push(sum % 10**CUTSIZE);
        overflow = Math.floor(sum / 10**CUTSIZE);
    }
    if (overflow) resarr.push(overflow);

    resarr[resarr.length - 1] = +resarr[resarr.length - 1]; // erase beginning zeroes

    let result = resarr.reduceRight( (res, num) => {
        return res + num;
    }, '');

    return result
}

function subtrBig(a, b) {
    return '';
}

const operations = {
    '+': sumBig,
    '-': (a, b) => {
        return sumBig(a, -b);
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