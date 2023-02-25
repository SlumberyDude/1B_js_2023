import {execute} from './bign.js';

// +
console.assert(execute('5 + 2') == 7, '5 + 2');
console.assert(execute('511 + 234') == 511 + 234, '511 + 234');
console.assert(execute('511 + 534') == 511 + 534, '511 + 534');
console.assert(execute('511 + 0') == 511 + 0, '511 + 0');
console.assert(execute('99999 + 99999') == 99999 + 99999, '99999 + 99999');
console.assert(execute('4 + 214531') == 4 + 214531, '4 + 214531');

// -
console.assert(execute('5 - 3') == 2, '5 - 3');
console.assert(execute('5 - 7') == -2, '5 - 7');
console.assert(execute('55 - 77') == 55 - 77, '55 - 77');
console.assert(execute('753826 - 367482') == 753826 - 367482, '753826 - 367482');

console.log(execute('5 - 7'));
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