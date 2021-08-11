function NEContactManager() {

    this.contact = {};

    this.createContact = () => {
        this.contact = {
            firstName: '',
            lastName: '',
            email: '',
            accountId: '',
            accountName: ''
        };

        NEBuildScreen.contact(this.contact);
    }

    this.addAccount = (accountId, accountName) => {
        this.contact.accountId = accountId;
        this.contact.accountName = accountName;
        $('#contact-account').val(accountName);
        NEBuildScreen.closeSelectModal();
    }

    this.saveContact = () => {

        NEApplication.showLoading(true);

        this.contact.firstName = $('#contact-first-name').val();
        this.contact.lastName = $('#contact-last-name').val();
        this.contact.email = $('#contact-email').val();

        if (NEContactManager.verifyFields()) {

            var contact = this.contact;

            let groupQuery = [];
            let contactBaseDMLInsert = 'INSERT INTO contact (CONTACT_FIRST_NAME, CONTACT_LAST_NAME, CONTACT_EMAIL, ACCOUNT_IDX, SYNC_STATUS) VALUES ';
            let contactBaseDMLUpdate = 'UPDATE contact SET ';
            let contactQuery = ``;

            if (contact.id) {
                contactQuery = `
                    ${contactBaseDMLUpdate}
                    CONTACT_FIRST_NAME = '${contact.firstName}',
                    CONTACT_LAST_NAME = '${contact.lastName}',
                    CONTACT_EMAIL = '${contact.email}',
                    ACCOUNT_IDX = '${contact.accountId}',
                    SYNC_STATUS = '0'
                    WHERE CONTACT_ID = '${contact.id}'
                `;
            } else {
                contactQuery = `
                ${contactBaseDMLInsert}
                    (
                        '${SUB_stringEscape(contact.firstName)}',
                        '${SUB_stringEscape(contact.lastName)}',
                        '${SUB_stringEscape(contact.email)}',
                        '${SUB_stringEscape(contact.accountId)}',
                        '${SUB_stringEscape(0)}'
                    )
                `;
            }

            contactQuery = contactQuery.replace(/(\r\n|\n|\r)/gm, "");

            groupQuery.push(contactQuery);

            (new NEBulkSQL()).execute({
                statements: groupQuery,
                callback: function (resultSet, status) {
                    if (status.fails == 0) {
                        swal("Contato salvo com sucesso!", { icon: "warning" }).then(() => {
                            NEApplication.showLoading(false);
                            NEBuildScreen.contactSearch();
                        });
                    } else {
                        swal("Erro na inserção do contato", { icon: "error" });
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
            'accountId': 'Cliente',
            'email': 'Email',
            'lastName': 'Sobrenome',
            'firstName': 'Nome'
        };
        let valid = true;
        Object.keys(requiredFields).forEach((field) => {
            if (!this.contact[field]) {
                this.field = requiredFields[field];
                valid = false;
            }
        });
        return valid;
    }


    this.editContact = (contactId) => {
        NEApplication.showLoading(true);
        NeDBManager.SUB_getContactById(contactId, (response) => {
            let contact = response[0];

            this.contact = {
                id: contact.CONTACT_ID,
                firstName: contact.CONTACT_FIRST_NAME,
                lastName: contact.CONTACT_LAST_NAME,
                email: contact.CONTACT_EMAIL,
                accountId: contact.ACCOUNT_IDX,
                accountName: contact.ACCOUNT_NAME
            };

            NEApplication.showLoading(false);
            NEBuildScreen.contact(this.contact);
        });
    }

}

NEContactManager.VAR_instance = null;
NEContactManager.SUB_getInstance = function () {
    if (this.VAR_instance === null) this.VAR_instance = new NEContactManager();
    return this.VAR_instance;
};
NEContactManager.createContact = function () {
    NEContactManager.SUB_getInstance().createContact();
};
NEContactManager.addAccount = function (accountId, accountName) {
    NEContactManager.SUB_getInstance().addAccount(accountId, accountName);
};
NEContactManager.verifyFields = function () {
    return NEContactManager.SUB_getInstance().verifyFields();
};
NEContactManager.saveContact = function () {
    NEContactManager.SUB_getInstance().saveContact();
};
NEContactManager.editContact = function (contactId) {
    NEContactManager.SUB_getInstance().editContact(contactId);
}; 