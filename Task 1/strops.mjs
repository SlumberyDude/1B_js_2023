
/**
 * Преобразование строки к нижнему регистру, но первая буква большая. "Abscd"
 * @param {string} str 
 * @returns {string}
 */
export function capFirst(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Преобразование строки с целью правильной расстановки пробелов.
 * @param {string} str 
 * @returns {string}
 */
export function fixSpaces(str) {
    let signs = new Set(['.', ',']);
    let result = str
                  .split(' ')
                  .filter( x => x !== '')
                  .reduce( (tot, cur) => {
                    if (tot == '') return cur;
                    if (signs.has(cur)) {
                        return tot + cur;
                    }
                    if (signs.has(cur[0])) {
                        tot += cur[0];
                        cur = cur.slice(1);
                    }
                    return tot + ' ' + cur;
                  }, '');
    return result;
}

/**
 * Посдчитывает кол-во слов в строке.
 * @param {string} str 
 * @returns {number}
 */
export function countWords(str) {
    return str.split(' ').filter( x => x !== '').length;
}

/**
 * Подсчитывает уникальные слова
 * @param {string} str 
 * @returns {Map}
 */
export function countUniqueWords(str) {
    let result = new Map();

    str.replace(/\n/g, ' ')
       .split(' ')
       .filter( word => word !== '')
       .map( word => {
        word = word.toLowerCase();
        if (result.has(word)) {
            result.set(word, result.get(word) + 1);
        } else {
            result.set(word, 1);
        }
    });

    return result;
}