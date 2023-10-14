/**
 * Permet d'attendre un certains temps afin d'executer une fonction
 * @param {number} time - Nombre de milisecondes a attendre
 * @param {function} callback - Fonction étant executer a l'issue
 */

async function Sleep(time, callback) {
    setTimeout(callback, time)
};

module.exports = { Sleep };