function NeDBManager() {

	var OBJ_database = window.sqlitePlugin.openDatabase({
		name: "app.db",
		location: 1
	});

	this.SUB_getDatabase = function(){
		return OBJ_database;
	};

	this.extractArrayFromDBResult = function (dbArray) {
		var arrayE = [];
		for (var m = 0; m < dbArray.rows.length; m++) {
			arrayE.push(dbArray.rows.item(m));
		}
		return arrayE;
	}

	this.SUB_getAccounts = function (VAR_callBack) {
		var response = [];

		var accountQuery = 'SELECT ' 			 																	+
			'					ACCOUNT_ID, ' 	 																	+
			'					ACCOUNT_IDX, ' 																		+
			'					ACCOUNT_NAME, '  																	+
			'					ACCOUNT_PHONE, ' 																	+
			'					ACCOUNT_TYPE, ' 																	+
			'					account_type.ACCOUNT_TYPE_NAME, '													+
			'					SYNC_STATUS '																		+
			'				FROM account '		 																	+
			'					LEFT JOIN account_type on account_type.ACCOUNT_TYPE_IDX = account.ACCOUNT_TYPE ' 	+
			'				ORDER BY ACCOUNT_NAME ';

		OBJ_database.transaction(
			function (VAR_transaction) {

				VAR_transaction.executeSql(
					accountQuery,
					[],
					function (VAR_trx, VAR_res) {
						response = NeDBManager.extractArrayFromDBResult(VAR_res);
					}
				);
			},
			function (VAR_err) {
				__errorHandler(VAR_err);
				VAR_callBack(VAR_err);
			},
			function () {
				VAR_callBack(response);
			}
		)
	}

	this.SUB_getAccountTypes = function (VAR_callBack) {
		var response = [];

		var accountTypeQuery = 'SELECT ' 					+
			'						ACCOUNT_TYPE_IDX, ' 	+
			'						ACCOUNT_TYPE_NAME ' 	+
			'					FROM account_type ' 		+
			'					ORDER BY ACCOUNT_TYPE_NAME ';

		OBJ_database.transaction(
			function (VAR_transaction) {

				VAR_transaction.executeSql(
					accountTypeQuery,
					[],
					function (VAR_trx, VAR_res) {
						response = NeDBManager.extractArrayFromDBResult(VAR_res);
					}
				);
			},
			function (VAR_err) {
				__errorHandler(VAR_err);
				VAR_callBack(VAR_err);
			},
			function () {
				VAR_callBack(response);
			}
		)
	}

	this.SUB_getContacts = function (VAR_callBack) {
		var response = [];

		var contactQuery = 'SELECT ' 																+
			'					CONTACT_ID, ' 														+
			'					CONTACT_IDX, ' 														+
			'					CONTACT_FIRST_NAME, ' 												+
			'					CONTACT_LAST_NAME, ' 												+
			'					CONTACT_EMAIL, ' 													+
			'					account.ACCOUNT_IDX, ' 												+
			'					account.ACCOUNT_NAME, ' 											+
			'					contact.SYNC_STATUS '												+
			'				FROM contact ' 															+
			'					INNER JOIN account on account.ACCOUNT_IDX = contact.ACCOUNT_IDX ' 	+
			'				ORDER BY CONTACT_FIRST_NAME, CONTACT_LAST_NAME ';

		OBJ_database.transaction(
			function (VAR_transaction) {

				VAR_transaction.executeSql(
					contactQuery,
					[],
					function (VAR_trx, VAR_res) {
						response = NeDBManager.extractArrayFromDBResult(VAR_res);
					}
				);
			},
			function (VAR_err) {
				__errorHandler(VAR_err);
				VAR_callBack(VAR_err);
			},
			function () {
				VAR_callBack(response);
			}
		)
	}

	this.SUB_getAccountData = function (VAR_callBack) {

		var accountQuery = 'SELECT ' 																				+
			'					ACCOUNT_ID, ' 																		+
			'					ACCOUNT_IDX, ' 																		+
			'					ACCOUNT_NAME, ' 																	+
			'					ACCOUNT_PHONE, ' 																	+
			'					ACCOUNT_TYPE, ' 																	+
			'					account_type.ACCOUNT_TYPE_NAME ' 													+
			'				FROM account ' 																			+
			'					LEFT JOIN account_type on account_type.ACCOUNT_TYPE_IDX = account.ACCOUNT_TYPE ' 	+
			'				WHERE account.SYNC_STATUS = 0';

		OBJ_database.transaction(
			function (VAR_transaction) {

				VAR_transaction.executeSql(
					accountQuery,
					[],
					function (VAR_trx, VAR_res) {
						response = NeDBManager.extractArrayFromDBResult(VAR_res);
					}
				);
			},
			function (VAR_err) {
				__errorHandler(VAR_err);
				VAR_callBack(VAR_err);
			},
			function () {
				VAR_callBack(response);
			}
		)
	}

	this.SUB_getAccountById = function (accountId, VAR_callBack) {

		var accountQuery = 'SELECT ' 																				+
			'					ACCOUNT_ID, ' 																		+	
			'					ACCOUNT_IDX, ' 																		+
			'					ACCOUNT_NAME, ' 																	+
			'					ACCOUNT_PHONE, ' 																	+
			'					ACCOUNT_TYPE, ' 																	+
			'					account_type.ACCOUNT_TYPE_NAME ' 													+
			'				FROM account ' 																			+
			'					LEFT JOIN account_type on account_type.ACCOUNT_TYPE_IDX = account.ACCOUNT_TYPE ' 	+
			'				WHERE  account.ACCOUNT_ID = \'' + accountId + '\'';

		OBJ_database.transaction(
			function (VAR_transaction) {

				VAR_transaction.executeSql(
					accountQuery,
					[],
					function (VAR_trx, VAR_res) {
						response = NeDBManager.extractArrayFromDBResult(VAR_res);
					}
				);
			},
			function (VAR_err) {
				__errorHandler(VAR_err);
				VAR_callBack(VAR_err);
			},
			function () {
				VAR_callBack(response);
			}
		)
	}

	this.SUB_getContactData = function (VAR_callBack) {

		var contactQuery = 'SELECT ' 																+
			'					CONTACT_ID, ' 														+
			'					CONTACT_IDX, ' 														+
			'					CONTACT_FIRST_NAME, ' 												+
			'					CONTACT_LAST_NAME, ' 												+
			'					CONTACT_EMAIL, ' 													+
			'					account.ACCOUNT_IDX, '												+
			'					account.ACCOUNT_NAME ' 												+
			'				FROM contact ' 															+
			'					INNER JOIN account on account.ACCOUNT_IDX = contact.ACCOUNT_IDX ' 	+
			'				WHERE contact.SYNC_STATUS = 0';

		OBJ_database.transaction(
			function (VAR_transaction) {

				VAR_transaction.executeSql(
					contactQuery,
					[],
					function (VAR_trx, VAR_res) {
						response = NeDBManager.extractArrayFromDBResult(VAR_res);
					}
				);
			},
			function (VAR_err) {
				__errorHandler(VAR_err);
				VAR_callBack(VAR_err);
			},
			function () {
				VAR_callBack(response);
			}
		)
	}

	this.SUB_getContactById = function (contactId, VAR_callBack) {

		var contactQuery = 'SELECT ' 																+
			'					CONTACT_ID, ' 														+
			'					CONTACT_IDX, ' 														+
			'					CONTACT_FIRST_NAME, ' 												+
			'					CONTACT_LAST_NAME, '											 	+
			'					CONTACT_EMAIL, ' 													+
			'					account.ACCOUNT_IDX, ' 												+
			'					account.ACCOUNT_NAME ' 												+
			'				FROM contact ' 															+
			'					INNER JOIN account on account.ACCOUNT_IDX = contact.ACCOUNT_IDX ' 	+
			'				WHERE  contact.CONTACT_ID = \'' + contactId + '\'';

		OBJ_database.transaction(
			function (VAR_transaction) {

				VAR_transaction.executeSql(
					contactQuery,
					[],
					function (VAR_trx, VAR_res) {
						response = NeDBManager.extractArrayFromDBResult(VAR_res);
					}
				);
			},
			function (VAR_err) {
				__errorHandler(VAR_err);
				VAR_callBack(VAR_err);
			},
			function () {
				VAR_callBack(response);
			}
		)
	}

	this.SUB_getSystemInfo = function(VAR_callBack){
		var VAR_systemData = null;
		OBJ_database.transaction(
			function(VAR_transaction) {
				VAR_transaction.executeSql(
					'SELECT '                   +
					'    API_HOST_URL, '        +
					'    USER_EMAIL, '          +
					'    USER_NAME, '           +
					'    USER_IDX, '            +
					'    USER_PROFILE, ' 		+
					'    REFRESH_TOKEN, '       +
					'    SESSION_KEY, '         +
                    '    LAST_SYNC_BASE_DATA '  +
					'  FROM system WHERE SYSTEM_ID = 1',
					[],
					function(VAR_trx, VAR_res){
						if(VAR_res.rows.length > 0){
							VAR_systemData = {
								apiHost:					VAR_res.rows.item(0).API_HOST_URL,
								userEmail:					VAR_res.rows.item(0).USER_EMAIL,
								userName:					VAR_res.rows.item(0).USER_NAME,
								userIdx:					VAR_res.rows.item(0).USER_IDX,
								userProfile: 				VAR_res.rows.item(0).USER_PROFILE,
								refreshToken:				VAR_res.rows.item(0).REFRESH_TOKEN,
								sessionKey:					VAR_res.rows.item(0).SESSION_KEY,
                                lastSyncBase:               VAR_res.rows.item(0).LAST_SYNC_BASE_DATA,
							};
						}
					}
				);
			},
			function(VAR_err){
				__errorHandler(VAR_err);
				VAR_callBack(VAR_systemData);
			},
			function(){
				VAR_callBack(VAR_systemData);
			}
		);
	};

	this.SUB_setConnectionInfo = function(VAR_data,VAR_callBack){
		var VAR_done = false;
		OBJ_database.transaction(
			function(VAR_transaction) {
				VAR_transaction.executeSql(
					'INSERT OR REPLACE INTO system (SYSTEM_ID, SYSTEM_VERSION, DB_VERSION, API_HOST_URL, REFRESH_TOKEN, SESSION_KEY) VALUES (?, ?, ?, ?, ?, ?)',
					[1, AppInfo.version, AppInfo.dbVersion, VAR_data.apiHost, VAR_data.refreshToken, VAR_data.sessionKey],
					function (VAR_trx, VAR_res) {
						VAR_done = (VAR_res.rowsAffected == 1);
					}
				);
			},
			function(VAR_err){
				__errorHandler(VAR_err);
				VAR_callBack(VAR_done);
			},
			function(){
				VAR_callBack(VAR_done);
			}
		);
	};

	this.SUB_getConnectionInfo = function(VAR_callBack){
		var VAR_systemData = null;
		OBJ_database.transaction(
			function(VAR_transaction) {
				VAR_transaction.executeSql(
					'	SELECT '                           	+
					'		API_HOST_URL, '                	+
					'		REFRESH_TOKEN, '               	+
					'		SESSION_KEY, '                 	+
					'		LAST_SYNC_BASE_DATA, '         	+
					'		LAST_SYNC_TRANSACTION_DATA, '  	+
					' 		LAST_SYNC_ACCOUNT, '           	+
					'		LAST_SYNC_ACCOUNT_ID, '        	+
					' 		LAST_SYNC_CONTACT, ' 			+
					'		LAST_SYNC_CONTACT_ID ' 			+
					'	FROM system WHERE SYSTEM_ID = 1',
					[],
					function(VAR_trx, VAR_res){
						if(VAR_res.rows.length > 0){
							VAR_systemData = {
								apiHost                     : VAR_res.rows.item(0).API_HOST_URL,
								refreshToken                : VAR_res.rows.item(0).REFRESH_TOKEN,
								sessionKey                  : VAR_res.rows.item(0).SESSION_KEY,
								lastSyncBaseData            : VAR_res.rows.item(0).LAST_SYNC_BASE_DATA,
								lastSyncTransactionData     : VAR_res.rows.item(0).LAST_SYNC_TRANSACTION_DATA,
								lastSyncAccountData         : VAR_res.rows.item(0).LAST_SYNC_ACCOUNT,
								lastSyncAccountDataId       : VAR_res.rows.item(0).LAST_SYNC_ACCOUNT_ID,
								lastSyncContactData			: VAR_res.rows.item(0).LAST_SYNC_CONTACT,
								lastSyncContactDataId	  	: VAR_res.rows.item(0).LAST_SYNC_CONTACT_ID
							};
						}
					}
				);
			},
			function(VAR_err){
				__errorHandler(VAR_err);
				VAR_callBack(VAR_systemData);
			},
			function(){
				VAR_callBack(VAR_systemData);
			}
		);
	};

	this.SUB_initDatabase = function(VAR_callBack) {
        console.log('create databse');
		OBJ_database.transaction(
			function(VAR_transaction) {
				VAR_transaction.executeSql(
					'CREATE TABLE IF NOT EXISTS system ( '						+
					'	SYSTEM_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '	+
					'	SYSTEM_VERSION TEXT NOT NULL DEFAULT \'\', '			+
					'	DB_VERSION TEXT NOT NULL DEFAULT \'\', '				+
					'	API_HOST_URL TEXT NOT NULL DEFAULT \'\', '				+
					'	USER_EMAIL TEXT NOT NULL DEFAULT \'\', '				+
					'	USER_NAME TEXT NOT NULL DEFAULT \'\', '					+
					'	USER_IDX TEXT NOT NULL DEFAULT \'\', '					+
					'	USER_PROFILE TEXT NOT NULL DEFAULT \'\', ' 				+
					'	REFRESH_TOKEN TEXT NOT NULL DEFAULT \'\', '				+
					'	SESSION_KEY TEXT NOT NULL DEFAULT \'\', '				+
					'	LAST_SYNC_BASE_DATA NUMERIC DEFAULT 0, '				+
					'	LAST_SYNC_TRANSACTION_DATA NUMERIC DEFAULT 0, '			+

					' 	LAST_SYNC_ACCOUNT NUMERIC DEFAULT 0, ' 					+
					' 	LAST_SYNC_ACCOUNT_ID TEXT DEFAULT \'\', ' 				+

					' 	LAST_SYNC_CONTACT NUMERIC DEFAULT 0, ' 					+
					' 	LAST_SYNC_CONTACT_ID TEXT DEFAULT \'\' ' 				+

					');', [], function(VAR_res){
						VAR_res.executeSql(
							'INSERT OR IGNORE INTO system (SYSTEM_ID, SYSTEM_VERSION, DB_VERSION, API_HOST_URL, USER_NAME, ' +
							'USER_EMAIL, USER_IDX, USER_PROFILE, REFRESH_TOKEN, SESSION_KEY) ' +
							'VALUES (1, "' + AppInfo.version + '", "' + AppInfo.dbVersion + '", "", "", "", "", "", "", "");'
						);
					}
				);

				VAR_transaction.executeSql(
					'CREATE TABLE IF NOT EXISTS sync_finger_print ( '	+
					'	TABLE_NAME TEXT NOT NULL DEFAULT \'\', '		+
					'	FINGER_PRINT TEXT NOT NULL DEFAULT \'\', '		+
					'	ID INTEGER NOT NULL DEFAULT 0, '				+
					'	PRIMARY KEY (TABLE_NAME,FINGER_PRINT)'			+
					');'
				);

                VAR_transaction.executeSql(
                    'CREATE TABLE IF NOT EXISTS ACCOUNT( ' 					+
					'    ACCOUNT_ID INTEGER PRIMARY KEY AUTOINCREMENT, ' 	+
                    '    ACCOUNT_IDX TEXT NOT NULL DEFAULT \'\', ' 			+
                    '    ACCOUNT_NAME TEXT NOT NULL DEFAULT \'\', ' 		+
                    '    ACCOUNT_PHONE TEXT NOT NULL DEFAULT \'\', ' 		+
                    '    ACCOUNT_TYPE TEXT NOT NULL DEFAULT \'\', ' 		+
                    '    DELETED NUMERIC NOT NULL DEFAULT 0, ' 				+
					' 	 SYNC_STATUS NUMERIC NOT NULL DEFAULT 0 ' 			+
                    '); '
                );

                VAR_transaction.executeSql(
                    'CREATE TABLE IF NOT EXISTS ACCOUNT_TYPE( ' 			+
                    '    ACCOUNT_TYPE_IDX TEXT NOT NULL DEFAULT \'\', ' 	+
                    '    ACCOUNT_TYPE_NAME TEXT NOT NULL DEFAULT \'\', ' 	+
                    '    PRIMARY KEY(ACCOUNT_TYPE_IDX) ' 					+
                    '); '
                );

				VAR_transaction.executeSql(
					'CREATE TABLE IF NOT EXISTS CONTACT( ' 					+
					'    CONTACT_ID INTEGER PRIMARY KEY AUTOINCREMENT, ' 	+
					'    CONTACT_IDX TEXT NOT NULL DEFAULT \'\', ' 			+
					'    CONTACT_FIRST_NAME TEXT NOT NULL DEFAULT \'\', ' 	+
					'    CONTACT_LAST_NAME TEXT NOT NULL DEFAULT \'\', ' 	+
					'    CONTACT_EMAIL TEXT NOT NULL DEFAULT \'\', ' 		+
					'    ACCOUNT_IDX TEXT NOT NULL DEFAULT \'\', ' 			+
					'    DELETED NUMERIC NOT NULL DEFAULT 0, ' 				+
					' 	 SYNC_STATUS NUMERIC NOT NULL DEFAULT 0 ' 			+
					'); '
				);

			},
			function (VAR_err) {
				__errorHandler(VAR_err);
				VAR_callBack();
			},
			function () {
				VAR_callBack();
			}
		);

		this.SUB_clearUserInfo = function (VAR_data, VAR_callBack) {
			var VAR_done = false;
			
			OBJ_database.transaction(
				function (VAR_transaction) {

					var VAR_sql =
						'UPDATE system SET ' +
						' USER_EMAIL     = "", ' +
						' USER_NAME      = "", ' +
						' API_HOST_URL   = "", ' +
						' REFRESH_TOKEN  = "", ' +
						' SYSTEM_VERSION = "", ' +
						' DB_VERSION     = "", ' +
						' SESSION_KEY    = ""  ' +
						(VAR_data ?
							' , USER_IDX                  	= ""' +
							' , LAST_SYNC_BASE_DATA       	= 0 ' +
							' , LAST_SYNC_TRANSACTION_DATA	= 0 ' +
							' , LAST_SYNC_ACCOUNT         	= 0 ' +
							' , LAST_SYNC_ACCOUNT_ID      	= 0 ' +
							' , LAST_SYNC_CONTACT			= 0 ' +
							' , LAST_SYNC_CONTACT_ID		= 0 '
							: 
							''
						) +
						'WHERE SYSTEM_ID = 1'
						;
					VAR_transaction.executeSql(
						VAR_sql,
						[],
						function (VAR_trx, VAR_res) {
							VAR_done = (VAR_res.rowsAffected == 1);
						}
					);
				},
				function (VAR_err) {
					__errorHandler(VAR_err);
					VAR_callBack(VAR_done);
				},
				function () {
					VAR_callBack(VAR_done);
				}
			);
		};
	};

	this.SUB_executeSQL = function(VAR_query, VAR_params, VAR_done, VAR_error) {
		OBJ_database.transaction(function(VAR_transaction) {
			VAR_transaction.executeSql(VAR_query, VAR_params, VAR_done, VAR_error);
		});
	};

	this.SUB_close = function() {
		OBJ_database.close();
	};

	this.SUB_dropDatabase = function (VAR_callback) {
		var groupQuery = [
			'DELETE FROM account',
			'DELETE FROM account_type',
			'DELETE FROM contact',
		];

		(new NEBulkSQL()).execute({
			statements: groupQuery,
			callback: function (resultSet, status) {
				if (status.fails == 0) {
					VAR_callback(true);
				}
				else {
					VAR_callback(false)
				}
			}
		});
	};
}

NeDBManager.VAR_instance = null;
NeDBManager.SUB_getInstance = function() {
	if (this.VAR_instance == null) this.VAR_instance = new NeDBManager();
	return this.VAR_instance;
};

NeDBManager.SUB_initDatabase = function(VAR_callBack) {
	NeDBManager.SUB_getInstance().SUB_initDatabase(VAR_callBack);
};
NeDBManager.SUB_executeSQL = function(VAR_query, VAR_params, VAR_done, VAR_error) {
	NeDBManager.SUB_getInstance().SUB_executeSQL(VAR_query, VAR_params, VAR_done, VAR_error);
};
NeDBManager.SUB_close = function() {
	NeDBManager.SUB_getInstance().SUB_close();
};
NeDBManager.SUB_getDatabase = function() {
	return NeDBManager.SUB_getInstance().SUB_getDatabase();
};
NeDBManager.SUB_getConnectionInfo = function(VAR_callback) {
	NeDBManager.SUB_getInstance().SUB_getConnectionInfo(VAR_callback);
};
NeDBManager.SUB_setConnectionInfo = function(VAR_data,VAR_callback) {
	NeDBManager.SUB_getInstance().SUB_setConnectionInfo(VAR_data,VAR_callback);
};
NeDBManager.SUB_getSystemInfo = function(VAR_data,VAR_callback) {
	NeDBManager.SUB_getInstance().SUB_getSystemInfo(VAR_data,VAR_callback);
};
NeDBManager.SUB_clearUserInfo = function (VAR_data, VAR_callBack) {
	NeDBManager.SUB_getInstance().SUB_clearUserInfo(VAR_data, VAR_callBack);
}
NeDBManager.SUB_dropDatabase = function (VAR_callBack) {
	NeDBManager.SUB_getInstance().SUB_dropDatabase(VAR_callBack);
}
NeDBManager.SUB_getAccounts = function (VAR_callBack) {
	NeDBManager.SUB_getInstance().SUB_getAccounts(VAR_callBack);
}
NeDBManager.SUB_getAccountTypes = function (VAR_callBack) {
	NeDBManager.SUB_getInstance().SUB_getAccountTypes(VAR_callBack);
}
NeDBManager.SUB_getContacts = function (VAR_callBack) {
	NeDBManager.SUB_getInstance().SUB_getContacts(VAR_callBack);
}
NeDBManager.SUB_getAccountData = function (VAR_callBack) {
	NeDBManager.SUB_getInstance().SUB_getAccountData(VAR_callBack);
}
NeDBManager.SUB_getAccountById = function (accountId, VAR_callBack) {
	NeDBManager.SUB_getInstance().SUB_getAccountById(accountId, VAR_callBack);
}
NeDBManager.SUB_getContactData = function (VAR_callBack) {
	NeDBManager.SUB_getInstance().SUB_getContactData(VAR_callBack);
}
NeDBManager.SUB_getContactById = function (contactId, VAR_callBack) {
	NeDBManager.SUB_getInstance().SUB_getContactById(contactId, VAR_callBack);
}
NeDBManager.extractArrayFromDBResult = function (dbArray) {
	return NeDBManager.SUB_getInstance().extractArrayFromDBResult(dbArray);
}

var __errorHandler = function(e){
	var error = ( typeof e.code 	!= 'undefined' ? '( code: ' + e.code + ' ) ' : '' );
	error 	 += ( typeof e.message  != 'undefined' ? e.message : e );
	showInfoPopup('Internal Error', error);
    APP.showLoading(false);
};