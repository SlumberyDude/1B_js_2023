import {execute, Segment} from './bign.js';

let s1 = new Segment(9, 7);
let s2 = new Segment(5, 3);
let s3 = s1.mul(s2);
console.log(s3.toString());

console.log(execute('900000000000000000000 + 8000000000000000000000'));
// console.log(execute(' + 8000000000000000000000'));

// +

console.assert(execute('5 + 2') == 7, '5 + 2');
console.assert(execute('511 + 234') == 511 + 234, `511 + 234 = ${execute('511 + 234')}`);
console.assert(execute('511 + 534') == 511 + 534, `511 + 534 = ${execute('511 + 534')}`);
console.assert(execute('511 + 0') == 511 + 0, '511 + 0');
console.assert(execute('99999 + 99999') == 99999 + 99999, '99999 + 99999');
console.assert(execute('4 + 214531') == 4 + 214531, '4 + 214531');

console.log('Сложение');
console.log(execute('999999999999999 + 999999999999999'));
console.log(999999999999999 + 999999999999999);
console.log(BigInt(999999999999999) + BigInt(999999999999999));

// -
console.assert(execute('5 - 3') == 2, '5 - 3');
console.assert(execute('71 - 39') == 71 - 39, `71 - 39 ${execute("71 - 39")} vs ${71 - 39}`);
console.assert(execute('5 - 7') == -2, `5 - 7 = ${execute('5 - 7')}`);
console.assert(execute('55 - 77') == 55 - 77, '55 - 77');
console.assert(execute('753826 - 367482') == 753826 - 367482, '753826 - 367482');

console.assert(execute('5000000 - 4999999') == 5000000 - 4999999, '5000000 - 4999999');
console.assert(execute('5 - 177') == 5 - 177, '5 - 177');
console.assert(execute('5 - 1777') == 5 - 1777, '5 - 1777');
console.assert(execute('5115 - 5115') == 5115 - 5115, '5115 - 5115');
console.assert(execute('1000000000001 - 999') == 1000000000001 - 999, '1000000000001 - 999');

console.log('вычитание');
console.log(execute('123 - 9999999999999999876'));
console.log(123 - 9999999999999999876);
console.log(BigInt('123') - BigInt('9999999999999999876'));
console.log('---');
console.log(execute('923 - 1999999999999999876'));
console.log(923 - 1999999999999999876);
console.log(BigInt('923') - BigInt('1999999999999999876'));
console.log('---')
console.log(execute('9999999999999999999 - 9999999999999999876'));
console.log(9999999999999999999 - 9999999999999999876);
console.log(BigInt('9999999999999999999') - BigInt('9999999999999999876'));

// *
console.log('Умножение')
console.log(execute('999999999999 * 9999999999999'));
console.log(999999999999 * 9999999999999);
console.log(BigInt(999999999999) * BigInt(9999999999999));
console.log(execute('99999999 * 99999999'));
console.log(99999999 * 99999999);
console.log(BigInt(99999999) * BigInt(99999999));

// /
console.log('Целочисленное деление')
console.log(execute('123 / 11'));
console.log(123 / 11);
console.log(BigInt('123') / BigInt('11'));
console.log('---')
console.log(execute('123 / 7693'));
console.log(123 / 7693);
console.log(BigInt('123') / BigInt('7693'));
console.log('---')
console.log(execute('9999999987654321 / 1234567890'));
console.log(9999999987654321 / 1234567890);
console.log(BigInt('9999999987654321') / BigInt('1234567890'));
console.log('---')
console.log(execute('9999999987654321999 / 648456789087657992'));
console.log(9999999987654321999 / 648456789087657992);
console.log(BigInt('9999999987654321999') / BigInt('648456789087657992'));






// console.log(execute('5 - 7'));
// console.log(execute('5 + 2 + 6'))
// console.log(execute('5 / 2'))
// console.log(execute('12005678 + 76543'))
// console.log(12005678 + 76543);
// console.log(execute('123 + 7655'))
// console.log(123 + 7655);
// console.log(execute('4 + 23'))
// console.log(4 + 23)
// console.log(execute('54321 + 0'))
// console.log(execute('5 - 2'))

// console.log(execute('-532326 + -23'))

// console.log(execute('4000000 + 5000000'))

// console.log(execute('99999 + 99999'))
// console.log(99999 + 99999)