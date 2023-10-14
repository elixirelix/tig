/** @module TIG */

/**
 * 
 * @param {object} db - Database MySQL Crée
 * @param {string} name - Nom de la TIG
 * @param {number} ammout - Nombre de personne nécéssaire a cet TIG
 * @returns {boolean} True
 * @returns {error} err
 */

async function DBAddTIG(db, name, ammout) {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO ${process.env.DB_TIG_NAME} (name, status, ammout) VALUES (?, ?, ?);`, [name, true, ammout], function(err) {
            if (err) {
                reject(err);
            };
    
            resolve(true)
        });    
    })
}

/**
 * Permet de récupérer la liste des TIG
 * @param {object} db - Database MySQL Crée 
 * @returns {array} rows
 * @returns {error} err
 */

async function DBGetAllTIG(db) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${process.env.DB_TIG_NAME}`, function(err, rows) {
            if (err) {
                reject(err);
            };

            resolve(rows);
        });
    })
}

/**
 * Permet de changer le status d'une TIG (Activé = True, Désactiver = False)
 * @param {object} db - Database MySQL Crée
 * @param {number} id - ID de la TIG selectionner
 * @param {boolean} newStatus - Status de la TIG
 * @returns {boolean} True
 * @returns {error} err
 */

async function DBChangeTIGStatus(db, id, newStatus) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE ${process.env.DB_TIG_NAME} SET status = ? WHERE id = ?`, [newStatus, id], function(err) {
            if (err) {
                reject(err);
            };

            resolve(true);
        })
    })
}

/**
 * Permet de changer le nom d'une TIG après ça création
 * @param {object} db - Database MySQL Crée
 * @param {number} id - ID de la TIG a changer de nom
 * @param {string} newValue - Nouveau nom de la TIG
 * @returns {boolean} True
 * @returns {error} err
 */

async function DBChangeTIGName(db, id, newValue) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE ${process.env.DB_TIG_NAME} SET name = ? WHERE id = ?`, [newValue, id], function(err) {
            if (err) {
                reject(err);
            };

            resolve(true);
        })
    })
}

/**
 * Permet de changer le nombre de personne a une TIG selectionner
 * @param {object} db - Database MySQL Crée 
 * @param {number} id - ID de la TIG Selectionner
 * @param {number} newAmmout - Nouveaux nombre de personne a y affecer
 * @returns {boolean} True
 * @returns {error} err
 */

async function DBChangeAmmoutMember(db, id, newAmmout) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE ${process.env.DB_TIG_NAME} SET ammout = ? WHERE id = ?`, [newAmmout, id], function(err) {
            if (err) {
                reject(err);
            };

            resolve(true);
        })
    })
}

module.exports = { DBAddTIG, DBGetAllTIG, DBChangeTIGName, DBChangeTIGStatus, DBChangeAmmoutMember };