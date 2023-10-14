/** @module MEMBER */

/**
 * Récupère tout les utilisateur présent dans la base de donné
 * @function
 * @param db database - Objet de la database MySQL
 * @return {array} rows
 * @return {error} err
 */

async function DBGetAllMember(db) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${process.env.DB_MEMBER_NAME};`, function(err, rows) {
            if (err) {
                reject(err);
            };

            resolve(rows);
        });
    });
};

/**
 * Permet d'ajouter un membre dans la base de donnée MySQL
 * @param {object} db - Database MySQL Crée
 * @param {string} name - Nom de la personne
 * @param {string} section - Section de la personne
 * @param {number} phone - Numéro de la personne
 * @returns {boolean} True
 * @returns {error} error
 */

async function DBAddMember(db, name, section, phone) {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO ${process.env.DB_MEMBER_NAME} (name, section, history, phone) VALUES (?, ?, ?, ?);`, [name, section, JSON.stringify([]), phone], function(err) {
            if (err) {
                reject(err);
            };

            resolve(true);
        });
    });
};

/**
 * Permet de changer le nom de quelqu'un dans la base de donné MySQL
 * @param {object} db - Database MySQL Crée
 * @param {number} id - ID de la personne dans la base de donnée MySQL
 * @param {string} newName - Nouveau nom de la personne
 * @returns {boolean} True
 * @returns {error} err
 */

async function DBAddMemberChangeName(db, id, newName) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE ${process.env.DB_MEMBER_NAME} SET name = ? WHERE id = ?`, [newName, id], function(err) {
            if (err) {
                reject(err);
            };

            resolve(true);
        });
    });
};

/**
 * Permet de changer la section d'une personne dans la base de donnée MySQL
 * @param {object} db - Database MySQL crée
 * @param {number} id - ID de la personne dans la base de donné MySQL
 * @param {string} newSection - Nouvelle section de la personne
 * @returns {boolean} True
 * @returns {error} err
 */

async function DBAddMemberChangeSection(db, id, newSection) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE ${process.env.DB_MEMBER_NAME} SET section = ? WHERE id = ?`, [newSection, id], function(err) {
            if (err) {
                reject(err);
            };

            resolve(true);
        });
    });
};

/**
 * Permet de récupèrer l'historique d'une personne des TIG d'une personne
 * @param {object} db - Database MySQL Crée
 * @param {number} id - ID de la personne dans la base de donné MySQL
 * @returns {array} rows
 * @returns {errror} err
 */

async function DBAddMemberGetAllHistory(db, id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${process.env.DB_MEMBER_NAME} (history) WHERE id = ?`, [id], function(err, rows) {
            if (err) {
                reject(err);
            };

            resolve(rows);
        });
    });
};

/**
 * Permet de changer l'historique des TIG d'une personne 
 * @param {object} db - Database MySQL Crée
 * @param {number} id - ID de la personne dans la base de donnée MySQL
 * @param {string} newHistory - Informations de l'historique des TIG de la personne
 * @returns {boolean} True
 * @returns {error} err
 */

async function DBAddMemberChangeHistory(db, id, newHistory) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE ${process.env.DB_MEMBER_NAME} SET history = ? WHERE id = ?`, [newHistory, id], function(err) {
            if (err) {
                reject(err);
            };

            resolve(true);
        });
    });
};

module.exports = {
    DBGetAllMember,
    DBAddMember,
    DBAddMemberChangeName,
    DBAddMemberChangeSection,
    DBAddMemberChangeHistory,
    DBAddMemberGetAllHistory
};