function NEApplication() {

    var APP = this;

    this.systemInfo = {};
    this.lastSincDateTime = '';

    this.showLoading = function (show) {
        if (show) $('#spinner').show();
        else $('#spinner').hide();
    }

    this.SUB_init = function() {
        APP.showLoading(true);
        this.extend(this);
        this.initLogin();
    };

    /* --------------------------------------------------
                        LOGIN E LOGOUT
    ---------------------------------------------------- */

    this.initLogin = function() {
        NeDBManager.SUB_initDatabase(() => {
            NeDBManager.SUB_getSystemInfo(function (userData) {

                if (userData != null) {
                    APP.systemInfo = userData;

                    if (APP.systemInfo.userIdx > ' ') {
                        APP.drawScreen('HOME', {});
                    } else {
                        APP.drawScreen('LOGIN', {});
                    }
                } else {
                    APP.drawScreen('LOGIN', {});
                }
            });
        });
    };

    this.proceedLogin = function(sfClient) {
        NeDBManager.SUB_setConnectionInfo({
            apiHost: sfClient.instanceUrl,
            refreshToken: sfClient.refreshToken,
            sessionKey: sfClient.sessionId
        }, function(status) {
            if (status) {
                var syncMessages = [
                    'Atualizando Dados Base ...'
                ];
                APP.syncProcessList = [
                    'loadBaseData'
                ];
                AppLoading.prepare({
                    showSteps: true,
                    timeout: 2000,
                    texts: syncMessages,
                    endMessage: 'Dados Atualizados com Sucesso!',
                    errorMessage: 'Erro na atualização dos dados...'
                });
                APP.startSyncProcess();
            } else {
                swal("Não foi possível concluir seu login.", { icon: "error" });
            }
        });
    };


    this.logout = function () {
        swal({
            title: "Deseja sair?",
            text: "Se confirmar, o processo de login terá que ser feito novamente sendo necessário uma conexão com a internet.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willLogout) => {
            if (willLogout) {
                NeDBManager.SUB_clearUserInfo(true, function (VAR_done) {
                    if (VAR_done) {
                        NeDBManager.SUB_dropDatabase((VAR_done) => {

                            APP.systemInfo.lastSyncBase = 0;
                            APP.systemInfo.lastSyncUser = 0;
                            APP.systemInfo.userIdx = '';

                            if (VAR_done) {
                                swal("Processo concluído! Você voltará para a tela de login!", {
                                    icon: "success",
                                }).then((confirm) => {
                                    NescaraConnection.logout();
                                    APP.drawScreen('LOGIN', {});
                                });
                            }
                        });
                    }
                });
            }
        });
    };


    this.loginScreenButton = function () {
        if (checkConnection().online) {
            APP.showLoading(true);
            NescaraConnection.isOnline(function (sfClient, isConnected) {
                if (isConnected) {
                    APP.proceedLogin(sfClient);
                } else {
                    NescaraConnection.whenLogged(function (sfClient) {
                        APP.proceedLogin(sfClient);
                    });
                    NescaraConnection.init();
                    APP.showLoading(false);
                }
            });
        } else {
            swal("Verifique sua conexão antes de prosseguir.", { icon: "warning" });
        }
    };

    /* --------------------------------------------------
                    CONTROLE DE TELAS
    ---------------------------------------------------- */

    this.onDrawScreen = function(screen, params) {
        switch (screen) {
            case 'LOGIN':
                NEBuildScreen.login();
                break;

            case 'HOME':
                NEBuildScreen.welcome();
                break;

            case 'ACCOUNT_SEARCH':
                NEBuildScreen.accountSearch();
                break;

            case 'CONTACT_SEARCH':
                NEBuildScreen.contactSearch();
                break;
        }
    };


    /* --------------------------------------------------
                CONTROLADOR DE SINCRONIZAÇÃO
    ---------------------------------------------------- */

    this.syncProcessList = [];
    this.syncResult = [];
    this.sfClient = null;
    this.syncApp = function() {
        var syncMessages = [
            'Atualizando Dados Base ...'
        ];
        APP.syncProcessList = [
            'loadBaseData',
            'sendAccountData',
            'sendContactData'
        ];
        AppLoading.prepare({
            showSteps: true,
            timeout: 2000,
            texts: syncMessages,
            endMessage: 'Dados Atualizados com Sucesso!',
            errorMessage: 'Erro na atualização dos dados...'
        });
        APP.startSyncProcess();
    };

    this.callSyncBaseData = function(callback) {
        syncBaseData(callback);
    };

    this.continueSyncProcess = function() {

        if (APP.syncProcessList.length > 0) {
            if (checkConnection().online) {
                var process = APP.syncProcessList.pop();
                AppLoading.next();
                switch (process) {
                    case 'loadBaseData':
                        setTimeout(function() { syncBaseData(); }, 0);
                        break;
                    case 'sendAccountData':
                        setTimeout(function () { sendAccountData(); }, 0);
                        break;
                    case 'sendContactData':
                        setTimeout(function () { sendContactData(); }, 0);
                        break;
                }
            } else {
                swal("Verifique sua conexão com a internet e tente novamente.", { icon: "warning" });
                AppLoading.end(false);
                __errorHandler('Verifique sua conexão com a internet e tente novamente.');
            }
        } else {
            NeDBManager.SUB_getSystemInfo(function(userData) {
                if (userData != null) {
                    APP.systemInfo = userData;
                    APP.drawScreen('HOME', {});
                } else {
                    swal("Não foi possível recuperar as informações da sua conta.", { icon: "warning" });
                    APP.drawScreen('LOGIN', {});
                }
                AppLoading.end(false);
            });
        }
    };

    this.startSyncProcess = function() {
        APP.syncResult = [];
        APP.continueSyncProcess();
    };

    /* --------------------------------------------------
                SINCRONIZAÇÃO - CARREGAR DADOS
    ---------------------------------------------------- */

    function syncBaseData(callback) {
        NeDBManager.SUB_getConnectionInfo(function (connectionData) {
            if (connectionData != null) {
                APP.sfClient = new forcetk.Client(AppInfo.connection.clientId, AppInfo.connection.loginURL);
                APP.sfClient.refreshToken = connectionData.refreshToken;
                APP.sfClient.sessionId = connectionData.sessionKey;
                APP.sfClient.instanceUrl = connectionData.apiHost;

                APP.sfClient.apexrest(
                    '/' + AppInfo.name + '/' + AppInfo.APIVersion + '/loadBaseData',
                    function (received) {
                        console.log(received);
                        var groupQuery = NeSyncController.generateSyncQuery(received);

                        (new NEBulkSQL()).execute({
                            statements: groupQuery,
                            callback: function (resultSet, status) {
                                if (status.fails == 0) {
                                    if (received.hasMore) {
                                        setTimeout(function () {

                                            if (callback)
                                                syncBaseData(callback);
                                            else syncBaseData();
                                        }, 10);
                                    } else {

                                        if (callback) {
                                            AppLoading.end(false);
                                            callback();
                                        } else APP.continueSyncProcess();
                                    }
                                } else {
                                    swal("Erro na inserção dos dados", { icon: "warning" });
                                    __errorHandler('Erro na inserção dos dados');
                                }
                            }
                        });
                    },
                    function (error) {
                        console.log(error);
                        if (error.status == '404') { // Remoção da API relativa a essa versão do APP.
                            swal("Versão desatualizada, contate o administrador.", { icon: "warning" });
                            AppLoading.end(false);
                            __errorHandler('Versão desatualizada, contate o administrador.');

                            if (callback)
                                callback();
                        } else {
                            if (APP.sfClient.sessionId) {
                                swal("Não foi possível recuperar as informações do sistema", { icon: "warning" });
                                AppLoading.end(false);
                                __errorHandler('Não foi possível recuperar as informações do sistema');
                            } else {
                                AppLoading.end(false);
                            }

                            if (callback)
                                callback();
                        }
                    },
                    'POST', {
                    lastSyncStamp: {
                        accountSync: NeSyncController.syncData(connectionData.lastSyncAccountData, connectionData.lastSyncAccountDataId),
                        contactSync: NeSyncController.syncData(connectionData.lastSyncContactData, connectionData.lastSyncContactDataId),
                    }
                }
                );
            } else {
                swal("Não foi possível recuperar as informações da sua conta. 2126", { icon: "warning" });
                APP.drawScreen('LOGIN', {});
            }
        });
    }

    /* --------------------------------------------------
            SINCRONIZAÇÃO - ENVIAR CONTAS PENDENTES
    ---------------------------------------------------- */

    function sendAccountData() {
        NeDBManager.SUB_getAccountData((accounts) => {
            var checkResponse = true;
            if (accounts == null || accounts.length == 0)
                checkResponse = false;

            let accountList = [];

            accounts.forEach((item) => {
                accountList.push({
                    id: item.ACCOUNT_IDX ? item.ACCOUNT_IDX : null,
                    appCode: item.ACCOUNT_ID,
                    name: item.ACCOUNT_NAME,
                    phone: item.ACCOUNT_PHONE,
                    type: item.ACCOUNT_TYPE
                });
            });

            var accountLength = accountList.length;
            var count = 0;
            var hasError = false;

            if (checkResponse) {
                accountList.forEach((account) => {
                    NeDBManager.SUB_getConnectionInfo(function (connectionData) {
                        if (connectionData != null) {
                            APP.sfClient = new forcetk.Client(AppInfo.connection.clientId, AppInfo.connection.loginURL);
                            APP.sfClient.refreshToken = connectionData.refreshToken;
                            APP.sfClient.sessionId = connectionData.sessionKey;
                            APP.sfClient.instanceUrl = connectionData.apiHost;

                            APP.sfClient.apexrest(
                                '/' + AppInfo.name + '/' + AppInfo.APIVersion + '/sendAccountData',
                                function (received) { // Requisição => Positiva
                                    count++;
                                    if (!received.hasError) {
                                        let finished = count == accountLength;
                                        NEApplication.syncResponseTransactData(received, 'ACCOUNT', finished);
                                    } else {
                                        hasError = true;
                                    }
                                    if (count == accountLength) {
                                        if (hasError) {
                                            swal("Ocorreram erros ao sincronizar as contas.", { icon: "warning" }).then(() => { APP.continueSyncProcess(); });
                                        }
                                    }
                                },
                                function (error) { // Requisição => Negativa
                                    count++;
                                    if (count == accountLength) {
                                        AppLoading.end(false);
                                    }
                                    console.log(error);
                                    swal("Não foi possível sincronizar os contas com o servidor. 2121", { icon: "error" });
                                    AppLoading.end(false);
                                },
                                'POST', { accountReq: JSON.stringify(account) }
                            );
                        } else {
                            swal("Não foi possível sincronizar as contas com o aplicativo. 2124", { icon: "error" });
                            APP.drawScreen('LOGIN', {});
                        }
                    });
                });

            } else APP.continueSyncProcess();
        });
    }

    /* --------------------------------------------------
            SINCRONIZAÇÃO - ENVIAR CONTATOS PENDENTES
    ---------------------------------------------------- */

    function sendContactData() {
        NeDBManager.SUB_getContactData((contacts) => {
            var checkResponse = true;
            if (contacts == null || contacts.length == 0)
                checkResponse = false;

            let contactList = [];

            contacts.forEach((item) => {
                contactList.push({
                    id: item.CONTACT_IDX ? item.CONTACT_IDX : null,
                    appCode: item.CONTACT_ID,
                    firstName: item.CONTACT_FIRST_NAME,
                    lastName: item.CONTACT_LAST_NAME,
                    email: item.CONTACT_EMAIL,
                    accountId: item.ACCOUNT_IDX,
                });
            });

            var contactLength = contactList.length;
            var count = 0;
            var hasError = false;

            if (checkResponse) {
                contactList.forEach((contact) => {
                    NeDBManager.SUB_getConnectionInfo(function (connectionData) {
                        if (connectionData != null) {
                            APP.sfClient = new forcetk.Client(AppInfo.connection.clientId, AppInfo.connection.loginURL);
                            APP.sfClient.refreshToken = connectionData.refreshToken;
                            APP.sfClient.sessionId = connectionData.sessionKey;
                            APP.sfClient.instanceUrl = connectionData.apiHost;

                            APP.sfClient.apexrest(
                                '/' + AppInfo.name + '/' + AppInfo.APIVersion + '/sendContactData',
                                function (received) { // Requisição => Positiva
                                    count++;
                                    if (!received.hasError) {
                                        let finished = count == contactLength;
                                        NEApplication.syncResponseTransactData(received, 'CONTACT', finished);
                                    } else {
                                        hasError = true;
                                    }
                                    if (count == contactLength) {
                                        if (hasError) {
                                            swal("Ocorreram erros ao sincronizar as contatos.", { icon: "warning" }).then(() => { APP.continueSyncProcess(); });
                                        }
                                    }
                                },
                                function (error) { // Requisição => Negativa
                                    count++;
                                    if (count == contactLength) {
                                        AppLoading.end(false);
                                    }
                                    console.log(error);
                                    swal("Não foi possível sincronizar os contatos com o servidor. 2121", { icon: "error" });
                                    AppLoading.end(false);
                                },
                                'POST', { contactReq: JSON.stringify(contact) }
                            );
                        } else {
                            swal("Não foi possível sincronizar as contatos com o aplicativo. 2124", { icon: "error" });
                            APP.drawScreen('LOGIN', {});
                        }
                    });
                });

            } else APP.continueSyncProcess();
        });
    }

    /* --------------------------------------------------
                SINCRONIZAÇÃO - ENVIAR CONTA
    ---------------------------------------------------- */

    // this.sendAccountData = function(accountId) {
    //     NeDBManager.SUB_getOrderById(accountId, (accounts) => {

    //         let account = accounts[0];

    //         let request = {
    //             id: account.NEGOTIATION_IDX ? account.NEGOTIATION_IDX : null,
    //             appCode: account.NEGOTIATION_ID,
    //         };

    //         NeDBManager.SUB_getConnectionInfo(function (connectionData) {
    //             if (connectionData != null) {
    //                 APP.sfClient = new forcetk.Client(AppInfo.connection.clientId, AppInfo.connection.loginURL);
    //                 APP.sfClient.refreshToken = connectionData.refreshToken;
    //                 APP.sfClient.sessionId = connectionData.sessionKey;
    //                 APP.sfClient.instanceUrl = connectionData.apiHost;

    //                 APP.sfClient.apexrest(
    //                     '/' + AppInfo.name + '/' + AppInfo.APIVersion + '/sendAccountData',
    //                     function (received) { // Requisição => Positiva
    //                         if (!received.hasError) {
    //                             NEApplication.syncResponseTransactData(received, 'ACCOUNT', false);
    //                             swal("Conta sincronizado com sucesso!", { icon: "success" }).then(() => { APP.drawScreen('HOME', {}); });
    //                         } else {
    //                             swal("Ocorreu um erro ao sincronizar a conta, verifique suas notificações.", { icon: "warning" }).then(() => { APP.drawScreen('HOME', {});});
    //                         }
    //                         NEApplication.showLoading(false);
    //                     },
    //                     function (error) { // Requisição => Negativa
    //                         console.log(error);
    //                         swal("Não foi possível sincronizar a conta com o servidor. 2121", { icon: "error" });
    //                         NEApplication.showLoading(false);
    //                         APP.drawScreen('HOME', {});
    //                     },
    //                     'POST', { accountReq: JSON.stringify(request) }
    //                 );
    //             } else {
    //                 swal("Não foi possível sincronizar a conta com o aplicativo. 2125", { icon: "error" });
    //                 APP.drawScreen('LOGIN', {});
    //             }
    //         });
    //     });
    // }

    // this.sendContactData = function (contactId) {
    //     NeDBManager.SUB_getOrderById(contactId, (contacts) => {

    //         let contact = contacts[0];

    //         let request = {
    //             id: contact.NEGOTIATION_IDX ? contact.NEGOTIATION_IDX : null,
    //             appCode: contact.NEGOTIATION_ID,
    //         };

    //         NeDBManager.SUB_getConnectionInfo(function (connectionData) {
    //             if (connectionData != null) {
    //                 APP.sfClient = new forcetk.Client(AppInfo.connection.clientId, AppInfo.connection.loginURL);
    //                 APP.sfClient.refreshToken = connectionData.refreshToken;
    //                 APP.sfClient.sessionId = connectionData.sessionKey;
    //                 APP.sfClient.instanceUrl = connectionData.apiHost;

    //                 APP.sfClient.apexrest(
    //                     '/' + AppInfo.name + '/' + AppInfo.APIVersion + '/sendContactData',
    //                     function (received) { // Requisição => Positiva
    //                         if (!received.hasError) {
    //                             NEApplication.syncResponseTransactData(received, 'CONTACT', false);
    //                             swal("Contato sincronizado com sucesso!", { icon: "success" }).then(() => { APP.drawScreen('HOME', {}); });
    //                         } else {
    //                             swal("Ocorreu um erro ao sincronizar a contato, verifique suas notificações.", { icon: "warning" }).then(() => { APP.drawScreen('HOME', {}); });
    //                         }
    //                         NEApplication.showLoading(false);
    //                     },
    //                     function (error) { // Requisição => Negativa
    //                         console.log(error);
    //                         swal("Não foi possível sincronizar a contato com o servidor. 2121", { icon: "error" });
    //                         NEApplication.showLoading(false);
    //                         APP.drawScreen('HOME', {});
    //                     },
    //                     'POST', { contactReq: JSON.stringify(request) }
    //                 );
    //             } else {
    //                 swal("Não foi possível sincronizar a contato com o aplicativo. 2125", { icon: "error" });
    //                 APP.drawScreen('LOGIN', {});
    //             }
    //         });
    //     });
    // }

    this.syncResponseTransactData = function (received, object, finish) {
        var groupQuery = [];

        groupQuery.push(`UPDATE ${object} SET ${object}_IDX = '${received.id}', SYNC_STATUS = '1' WHERE ${object}_ID = ${received.appCode}`);

        (new NEBulkSQL()).execute({
            statements: groupQuery,
            callback: function (resultSet, status) {
                if (status.fails == 0) { // Atualização de dados => Positiva
                    if (finish) {
                        APP.continueSyncProcess();
                    }
                } else { // Atualização de dados => Negativa
                    swal("Erro ao atualizar conta. 2119", { icon: "error" });
                    NEApplication.showLoading(false);
                }
            }
        });
    }

}

NEApplication.prototype = new NEAppCore();
NEApplication.VAR_instance = null;
NEApplication.SUB_getInstance = function() {
    if (this.VAR_instance === null) this.VAR_instance = new NEApplication();
    return this.VAR_instance;
};
NEApplication.init = function() {
    NEApplication.SUB_getInstance().SUB_init();
};
NEApplication.sync = function() {
    NEApplication.SUB_getInstance().syncApp();
};
NEApplication.logout = function() {
    NEApplication.SUB_getInstance().logout();
};
NEApplication.getProperty = function(param) {
    return NEApplication.SUB_getInstance()[param];
};
NEApplication.setProperty = function(attr, value) {
    NEApplication.SUB_getInstance()[attr] = value;
};
NEApplication.showLoading = function (param) {
    NEApplication.SUB_getInstance().showLoading(param);
};
NEApplication.syncResponseTransactData = function (received, object, finish) {
    NEApplication.SUB_getInstance().syncResponseTransactData(received, object, finish);
};

var APP = NEApplication.SUB_getInstance();

var __errorHandler = function(e){
	var error = ( typeof e.code 	!= 'undefined' ? '( code: ' + e.code + ' ) ' : '' );
	error 	 += ( typeof e.message  != 'undefined' ? e.message : e );
    swal(error, { icon: "error" });
	//showInfoPopup('Internal Error', error);
    APP.showLoading(false);
};

function SUB_stringEscape(VAR_string) {
    if (VAR_string == null || VAR_string == 'null') {
        return '';
    }
    return (typeof VAR_string == 'string' ?
        VAR_string.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "'":
                    return "''";
                case "\"":
                case "\\":
                case "%":
                    return "";
            }
        }) : VAR_string
    );
}