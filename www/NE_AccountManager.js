function NEAccountManager() {

    this.account = {};

    this.createAccount = () => {
        this.account = {
            name: '',
            phone: '',
            type: ''
        };

        NEBuildScreen.account(this.account);
    }

    this.saveAccount = () => {

        NEApplication.showLoading(true);

        this.account.name = $('#account-name').val();
        this.account.phone = $('#account-phone').val();
        this.account.type = $('#account-type').val();

        if (NEAccountManager.verifyFields()) {

            var account = this.account;

            let groupQuery = [];
            let accountBaseDMLInsert = 'INSERT INTO account (ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_TYPE, SYNC_STATUS) VALUES ';
            let accountBaseDMLUpdate = 'UPDATE account SET ';
            let accountQuery = ``;

            if (account.id) {
                accountQuery = `
                    ${accountBaseDMLUpdate}
                    ACCOUNT_NAME = '${account.name}',
                    ACCOUNT_PHONE = '${account.phone}',
                    ACCOUNT_TYPE = '${account.type}',
                    SYNC_STATUS = '0'
                    WHERE ACCOUNT_ID = '${account.id}'
                `;
            } else {
                accountQuery = `
                ${accountBaseDMLInsert}
                    (
                        '${SUB_stringEscape(account.name)}',
                        '${SUB_stringEscape(account.phone)}',
                        '${SUB_stringEscape(account.type)}',
                        '${SUB_stringEscape(0)}'
                    )
                `;
            }

            accountQuery = accountQuery.replace(/(\r\n|\n|\r)/gm, "");

            groupQuery.push(accountQuery);

            (new NEBulkSQL()).execute({
                statements: groupQuery,
                callback: function (resultSet, status) {
                    if (status.fails == 0) {
                        swal("Conta salva com sucesso!", { icon: "warning" }).then(() => {
                            NEApplication.showLoading(false);
                            NEBuildScreen.accountSearch();
                        });
                    } else {
                        swal("Erro na inserção do cliente", { icon: "error" });
                        NEApplication.showLoading(false);
                    }
                }
            });

        } else {
            swal("Para salvar, preencha todos os campos obrigatórios: " + this.field, { icon: "warning" });
            NEApplication.showLoading(false);
        }

    }

    this.field = '';

    this.verifyFields = () => {
        this.field = '';
        let requiredFields = {
            'type': 'Tipo do Cliente',
            'phone': 'Telefone',
            'name': 'Nome'
        };
        let valid = true;
        Object.keys(requiredFields).forEach((field) => {
            if (!this.account[field]) {
                this.field = requiredFields[field];
                valid = false;
            }
        });
        return valid;
    }

    this.getType = () => {
        return this.account.type;
    }

    this.editAccount = (accountId) => {
        NEApplication.showLoading(true);
        NeDBManager.SUB_getAccountById(accountId, (response) => {
            let account = response[0];

            this.account = {
                id: account.ACCOUNT_ID,
                name: account.ACCOUNT_NAME,
                phone: account.ACCOUNT_PHONE,
                type: account.ACCOUNT_TYPE
            };

            NEApplication.showLoading(false);
            NEBuildScreen.account(this.account);
        });
    }

}

NEAccountManager.VAR_instance = null;
NEAccountManager.SUB_getInstance = function () {
    if (this.VAR_instance === null) this.VAR_instance = new NEAccountManager();
    return this.VAR_instance;
};
NEAccountManager.createAccount = function () {
    NEAccountManager.SUB_getInstance().createAccount();
};
NEAccountManager.verifyFields = function () {
    return NEAccountManager.SUB_getInstance().verifyFields();
};
NEAccountManager.getType = function () {
    return NEAccountManager.SUB_getInstance().getType();
};
NEAccountManager.saveAccount = function () {
    NEAccountManager.SUB_getInstance().saveAccount();
};
NEAccountManager.editAccount = function (accountId) {
    NEAccountManager.SUB_getInstance().editAccount(accountId);
};