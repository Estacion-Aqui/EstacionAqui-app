function NEQueryController() {

    this.accountList = [];
    this.contactList = [];

    this.searchAccounts = function () {
        NeDBManager.SUB_getAccounts((accounts) => {
            this.accountList = accounts;
            NEBuildScreen.writeAccountList(this.accountList);
            APP.showLoading(false);
        });
    }

    this.searchContactAccounts = function () {
        NeDBManager.SUB_getAccounts((accounts) => {
            this.contactAccountList = accounts;
            if (this.contactAccountList.length > 0) {
                NEBuildScreen.writeAccountListToSelect(this.contactAccountList.filter(item => item.ACCOUNT_IDX));
            } else {
                NEBuildScreen.writeAccountListToSelect(this.contactAccountList);
            }
            APP.showLoading(false);
        });
    }

    this.getAccount = function (accountId) {
        return this.accountList.find(account => account.ACCOUNT_IDX == accountId);
    }

    this.searchContacts = function () {
        NeDBManager.SUB_getContacts((contacts) => {
            this.contactList = contacts;
            NEBuildScreen.writeContactList(this.contactList);
            APP.showLoading(false);
        });
    }

    this.getContact = function (contactId) {
        return this.contactList.find(contact => contact.CONTACT_IDX == contactId);
    }

    this.searchAccountTypes = function () {
        NeDBManager.SUB_getAccountTypes((accountTypes) => {
            NEBuildScreen.writeAccountTypeList(accountTypes);
        });
    }

}

NEQueryController.VAR_instance = null;
NEQueryController.SUB_getInstance = function () {
    if (this.VAR_instance === null) this.VAR_instance = new NEQueryController();
    return this.VAR_instance;
};
NEQueryController.searchAccounts = function () {
    NEQueryController.SUB_getInstance().searchAccounts();
};
NEQueryController.searchContactAccounts = function () {
    NEQueryController.SUB_getInstance().searchContactAccounts();
};
NEQueryController.getAccount = function (accountId) {
    return NEQueryController.SUB_getInstance().getAccount(accountId);
};
NEQueryController.searchAccountTypes = function () {
    NEQueryController.SUB_getInstance().searchAccountTypes();
};
NEQueryController.searchContacts = function () {
    NEQueryController.SUB_getInstance().searchContacts();
};
NEQueryController.getContact = function (contactId) {
    return NEQueryController.SUB_getInstance().getContact(contactId);
};