/**
 * Crée les différentes tables de la base de donné SQL
 * @function
 * @param {object} db - Base de donnée SQL
 */
async function CreateTables(db) {
    db.query(`CREATE TABLE IF NOT EXISTS ${process.env.DB_TIG_NAME} (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, name TEXT NOT NULL, status BIT NOT NULL, ammout INT NOT NULL);`);
    db.query(`CREATE TABLE IF NOT EXISTS ${process.env.DB_MEMBER_NAME} (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, name TEXT NOT NULL, section TEXT NOT NULL, history TEXT NOT NULL, phone INT NOT NULL);`);
    return true
}

/**
 * Permet de purger les tables SQL utilisé
 * @function
 * @param {object} db - Objet de la database MySQL
 * @returns True
 */
async function PurgeTables(db) {
    db.query(`DROP TABLE ${process.env.DB_TIG_NAME};`);
    db.query(`DROP TABLE ${process.env.DB_MEMBER_NAME};`);
    return true
}

module.exports = { CreateTables, PurgeTables };