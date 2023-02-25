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

/**
 * check if a >= b as number. a and b are positive
 * @param {string} a 
 * @param {string} b 
 */
function ge(a, b) {
    if (a.length > b.length) return true;
    if (a.length < b.length) return false;

    let aParts = cutString(a);
    let bParts = cutString(b);
    for (let i = aParts.length - 1; i >= 0; i--) {
        if (aParts[i] > bParts[i]) return true;
        if (aParts[i] < bParts[i]) return false;
    }
    return true;
}

/**
 * if sub = true a
 * @param {string} a 
 * @param {string} b 
 * @param {boolean} sub 
 * @returns 
 */
function sumSubBig(a, b, sub = false) {
    let sign = '';
    if (sub) {
        sign = '-';
        if ( !ge(a,b) ) return '-' + sumSubBig(b, a, true);
    }

    let aPieces = cutString(a).map( piece => +piece );
    let bPieces = cutString(b).map( piece => +(sign + piece) );
    // console.log(aPieces);
    // console.log(bPieces);
    let resarr = [];
    let overflow = 0;
    let ai = 0;
    let bi = 0;
    while (ai < aPieces.length && bi < bPieces.length) {
        let aNum = aPieces[ai++];
        let bNum = bPieces[bi++];
        // console.log(`anum = ${aNum} bNum = ${bNum}`);
        let sum = aNum + bNum + overflow;
        // console.log(`sum = ${sum}`)
        if (sum < 0) {
            sum = sum + 10**CUTSIZE;
            overflow = -1;
        } else {
            overflow = Math.floor(sum / 10**CUTSIZE);
            sum = sum % 10**CUTSIZE;
        }
        // overflow = Math.floor(sum / 10**CUTSIZE);
        // sum = sum % 10**CUTSIZE;
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
        // console.log(`rest = ${rest[resti]} over = ${overflow}`);
        let sum = rest[resti++] + overflow;
        if (sum < 0) {
            sum = sum + 10**CUTSIZE;
            overflow = -1;
        } else {
            overflow = Math.floor(sum / 10**CUTSIZE);
            sum = sum % 10**CUTSIZE;
        }
        resarr.push(sum);
        // console.log(`sum = ${sum} resarr = ${resarr}`)
    }
    if (overflow) resarr.push(overflow);

    // let zeroPiece = '0'.repeat(CUTSIZE);
    for (let i = resarr.length - 1; i >= 0; i--) {
        if (resarr.length === 1) break;
        if (+resarr[i] === 0) {
            resarr.pop();
        } else {
            break;
        }
    }
    resarr[resarr.length - 1] = +resarr[resarr.length - 1]; // erase beginning zeroes


    let result = resarr.reduceRight( (res, num) => {
        return res + num;
    }, '');

    return result
}

const operations = {
    '+': (a, b) => {
        return sumSubBig(a, b);
    },
    '-': (a, b) => {
        return sumSubBig(a, b, true);
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