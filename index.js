const mysql = require('mysql');
const moment = require('momen');
require('dotenv').config();
const readline = require('readline');
const { unix } = require('moment');
var rl = readline.createInterface(process.stdin, process.stdout);
const { Sleep } = require(`${process.cwd()}/functions/sleep.js`);
const {
    DBAddTIG,
    DBGetAllTIG,
    DBChangeTIGName,
    DBChangeTIGStatus,
    DBChangeAmmoutMember
} = require(`${process.cwd()}/functions/tig_db.js`);

const {
    CreateTables,
    PurgeTables
} = require(`${process.cwd()}/functions/db_tables.js`);

const {
    DBGetAllMember,
    DBAddMember,
    DBAddMemberChangeName,
    DBAddMemberChangeSection,
    DBAddMemberChangeHistory,
    DBAddMemberGetAllHistory 
} = require(`${process.cwd()}/functions/member_db.js`);

let db;
db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    typeCast: function castField(field, useDefaultTypeCasting) {
        if ( (field.type === "BIT") && (field.length == 1) ) {
            var bytes = field.buffer();

            return (bytes[ 0 ] === 1 );
        }

        return (useDefaultTypeCasting());
    }
});

db.connect(async function(err) {
    if (err) {
        throw err;
    };

    console.log("[°] Succesfully Connected");
    await CreateTables(db);
    await Sleep(1500, MainMenu)
});

/**
 * Permet d'afficher le Menu Principale.
 * @returns {number} 0 - Renvoie de fin d'Algo
 */
async function MainMenu() {
    console.clear();
    console.log("1> Add/Edit TIG");
    console.log("2> Add/Edit a Member in the Database");
    console.log("3> Launch the random tirage");
    console.log("4> See week history")
    console.log('5> Purge Table');
    rl.question('> ', (ans) => {
        switch (ans.toLowerCase()) {
            case "1":
                AddTIG();
                break;
            case "2":
                AddMember();
                break;
            case "3":
                break;
            case "4":
                break;
            case "5":
                PurgeTable();
                break;
            case "exit":
                process.exit();
            default:
                MainMenu();
                break;
        };
    });

    return 0;
}
/**
 * Fonction principale d'ajout de TIG
 * @returns 0 - Renvoie de fin de fonciton
 */

async function AddTIG() {
    console.clear();
    let AllTIG = await DBGetAllTIG(db);
    /**
     * Si aucune TIG n'est présente dans la Database
     */

    if (AllTIG.length == 0) {
        console.log("[°] No TIG found");
        rl.question(`You wan't to add one ? (Y/n) `, async (ans) => {
            if (ans.toLocaleLowerCase() == "y" || ans == "") {
                rl.question('Name of the TIG : ', async (name) => {
                    rl.question('Ammout of member assigned to this TIG : ', async (ammout) => {
                        await DBAddTIG(db, name, ammout);
                        console.log("[°] The TIG was Added");
                        await Sleep(1000, MainMenu);    
                    })
                });
            } else {
                console.log('[°] Return to main Menu');
                await Sleep(1000, MainMenu);
            };
        });
    } else {
        /**
         * Une TIG est présente dans la database
         */
        for (i = 0; i < AllTIG.length; i++) {
            console.log(`TIG ID: ${AllTIG[i].id} | TIG Name: ${AllTIG[i].name} | TIG Status: ${AllTIG[i].status ? "Activé" : "Désactiver"} | TIG Ammout : ${AllTIG[i].ammout}`);
        }

        console.log("Enter the TIG ID to edit them. Enter 0 to add a TIG");
        rl.question('> ', async (ans) => {
            /**
             * Ajout d'une TIG
             */
            if (ans == 0) {
                rl.question('Name of the TIG : ', async (name) => {
                    rl.question('Ammout member of the TIG : ', async (ammout) => {
                        await DBAddTIG(db, name, ammout);
                        console.log("[°] The TIG was Added");
                        await Sleep(1000, MainMenu);
                    });    
                });
            } else {
                /**
                 * Modification d'une TIG
                 */
                const tig = AllTIG.some(async (element) => {
                    if (element.id == ans) {
                        console.clear();
                        console.log(`[°] TIG Found ! What's value woul'd you change ?`)
                        console.log(`Possible value : status, name, ammout`)
                        rl.question('> ', async function(changed) {
                            switch (changed) {
                                /**
                                 * Changement de status
                                 */
                                case "status":
                                    var newStatus = null;
                                    if (element.status) {
                                        newStatus = false;
                                    } else {
                                        newStatus = true;
                                    };

                                    await DBChangeTIGStatus(db, element.id, newStatus);
                                    console.log(`[°] The status of ${element.name} was changed`);
                                    Sleep(1000, AddTIG);
                                    break;
                                /**
                                 * Changement de nom
                                 */
                                case "name":
                                    console.log("[°] Enter the new name of the TIG");
                                    rl.question('> ', async (name) => {
                                        await DBChangeTIGName(db, element.id, name);
                                        console.log(`[°] The name of ${element.name} was changed to ${name}`);
                                        Sleep(1000, AddTIG);
                                    })
                                    break;
                                /**
                                 * Changement de nombre de personne dans la TIG
                                */
                                case "ammout":
                                    console.log("[°] Enter a new ammout value of the TIG");
                                    rl.question('> ', async (ammot) => {
                                        await DBChangeAmmoutMember(db, element.id, ammot);
                                        console.log(`[°] Assigned member to the TIG was succesfully change to ${ammot}`);
                                        Sleep(1000, AddTIG)
                                    })
                                    break;
                                default:
                                    console.log("Return to MainMenu");
                                    Sleep(1000, MainMenu);
                            };
                        });
                    };
                });

                if (!tig) {
                    console.log("[°] No TIG Found, return to Adding Menu");
                    Sleep(1000, AddTIG)
                };
            };
        });
    };

    return 0;
}

async function AddMember() {
    console.clear();
    var data = await DBGetAllMember(db);
    if (data.length == 0) {
        console.log("[°] No member found");
        rl.question(`You wan't to add one ? (Y/n) `, async (ans) => {
            if (ans.toLocaleLowerCase() == "y" || ans == "") {
                rl.question('Name of the member : ', async (name) => {
                    rl.question('Section of the member : ', async (section) => {
                        rl.question('Phone of the member : ', async (phone) => {
                            await DBAddMember(db, name, section, phone);
                            console.log("[°] New member was added");
                            Sleep(1000, MainMenu);
                        });
                    });
                });
            } else {
                console.log('[°] Return to main Menu');
                await Sleep(1000, MainMenu);
            };
        });
    } else {
        for (i = 0; i < data.length; i++) {
            console.log(`ID: ${data[i].id} | Member Name: ${data[i].name} | Section Member: ${data[i].section} | Phone Member: ${data[i].phone}`);
        };

        console.log("Enter Member ID to try to edit. Enter exit to return to the Main Menu");
        rl.question('> ', async (ans) => {
            if (ans.toLowerCase() == "exit") {
                console.log("[°] Return to the Main Menu");
                Sleep(1000, MainMenu);
            } else {
                const member = data.some(async (element) => {
                    if (element.id == ans) {
                        console.log(`[°] Member found ! Try to edit ${element.name} (${element.phone})`);
                        console.log("Value to edit : name, section, history, phone");
                        rl.question('> ', async (edit) => {
                            switch (edit.toLowerCase()) {
                                case "name":
                                    console.log("[°] Enter the new name");
                                    rl.question('> ', async (name) => {
                                        await DBAddMemberChangeName(db, element.id, name);
                                        console.log("[°] Value changed !");
                                        Sleep(1000, MainMenu);
                                    });
                                    break;
                                case "section":
                                    console.log("[°] Enter the new section");
                                    rl.question('> ', async (section) => {
                                        await DBAddMemberChangeSection(db, element.id, section);
                                        console.log("[°] Value changed !");
                                        Sleep(1000, MainMenu);
                                    });
                                    break;
                                case "history":
                                    let MemberData = await DBAddMemberGetAllHistory(db, element.id);
                                    let RealData = MemberData[0];
                                    let hist = JSON.parse(RealData.history);
                                    console.log("What is the edit of the history ?");
                                    console.log("Possible value: deleteAll, deleteValue, addValue");
                                    rl.question('> ', async (histResp) => {
                                        switch (histResp.toLowerCase()) {
                                            case "deleteall":
                                                break;
                                            case "deletevalue":
                                                break;
                                            case "addvalue":
                                                const AllTIG = await DBGetAllTIG(db);
                                                if (AllTIG.length < 1) {
                                                    console.log("[°] No TIG Config. Return to Main Menu");
                                                    Sleep(1000, MainMenu);
                                                } else {
                                                    console.log("Slect a TIG ID");
                                                    for (i=0; i<AllTIG.length; i++) {
                                                        console.log(`TIG ID: ${AllTIG[i].id} | TIG Name: ${AllTIG[i].name}`);
                                                    };
                                                    rl.question('> ', async (tig_id) => {
                                                        console.log("[°] Enter Date");
                                                        rl.question('> ', async (date) => {
                                                            let unix_date = moment(date).unix();
                                                            print(unix_date)
                                                            await AddEntryHistoryMember(element.id, hist, true, unix_date, tig_id);
                                                            Sleep()
                                                        });
                                                    });
                                                };
                                                break;
                                            default:
                                                break;
                                        }
                                    });
                                    break;
                                case "phone":
                                    break;
                                default:
                                    Sleep(1000, AddMember);
                                    break;
                            }
                        })
                    }
                });
            }
        });
    };
}

async function AddEntryHistoryMember(id, hist, type, date, tig_id) {
    if (type) {
        hist.push({tig: tig_id, date: date});
        await DBAddMemberChangeHistory(db, id, JSON.stringify(hist));
    };
    await Sleep(5000, MainMenu);
}

async function PurgeTable() {
    await PurgeTables(db);
    Sleep(1000, function() {
        console.log("[°] Purged Table")
        process.exit();
    })
}