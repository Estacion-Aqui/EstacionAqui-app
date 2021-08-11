function NEBuildScreen() {

    this.login = () => {

        NEApplication.showLoading(true);

        let html = `
             <div class="container-fluid bg-light">
                <div class="row">
                    <div class="col">
                        <div class="box-wrap-inicial">
                            <div class="brand">
                                <img src="img/nescara-logo.png" class="mb-3 mt-3 icon-mobile" alt="Mobile">
                            </div>
                            <button type="button" class="btn btn-block btn-cta-main" onclick="NEApplication.SUB_getInstance().loginScreenButton()">
                                <span>Acessar</span>
                                <img src="img/ic-arrow-right.svg" alt="Acessar">
                            </button>
                            <span style="color: #129fdb;font-size: 22px;font-weight: 600;text-align: center;">Treinamentos</span>
                        </div>
                    </div>
                </div>
            </div>
		`;

        $('#main').html(html);

        NEApplication.showLoading(false);
    }

    this.welcome = () => {

        NEApplication.showLoading(true);

        let html = `
			<!-- HEADER -->
            <header class="header">
                <div class="container">

                    <div class="row">
                        <div class="col-3">
                            <a href="#" class="brand-header">
                                <img src="img/nescara-logo.png" alt="Vendas App" style="max-width: 95px;">
                            </a>
                        </div>
                        <div class="col-9">
                            <div class="wrap-header">
                                <nav class="nav-header">
                                    <a class="text-secondary" onclick="NEApplication.logout()">${APP.systemInfo.userName}</a>
                                </nav>
                            </div>
                        </div>
                    </div>

                </div>
            </header>
            <!-- /HEADER -->

            <div id="modal_container"></div>

            <!-- CORPO DE CONTEÚDO -->
            <div id="body_content">
                <div class="wrap bg-welcome">
                    <div class="container">

                    </div>
                </div>
            </div>
            <!-- /CORPO DE CONTEÚDO -->


            <div class="version_container">
                <div class="version_text">Versão ${AppInfo.version}</div>
            </div>

            <!-- FOOTER -->
            <footer class="footer">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="nav-footer">
                                <ul>
                                    <li>
                                        <a onclick="NEBuildScreen.welcome()">
                                            <img src="img/ic-home.svg" alt="Home">
                                            <span>Home</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a onclick="NEBuildScreen.accountSearch()">
                                            <img src="img/ic-users.svg" alt="Clientes">
                                            <span>Clientes</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a onclick="NEBuildScreen.contactSearch()">
                                            <img src="img/ic-users.svg" alt="Contatos">
                                            <span>Contatos</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a onclick="NEApplication.sync()">
                                            <img src="img/ic-sync-cinza.svg" alt="Sync">
                                            <span>Sincronizar</span>
                                        </a>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <!-- /FOOTER -->
		`;

        $('#main').html(html);

        NEApplication.showLoading(false);
    }

    this.accountSearch = () => {
        NEApplication.showLoading(true);
        let html = `
            <div class="wrap commom" style="position: absolute;width: 100%;height: 100%;">
                <div class="container" style="height: 100%;">

                    <div class="row">
                        <div class="col-12">
                            <div class="unique-data">
                                <div class="content" style="padding: 0px 5px 15px 5px">
                                    <button class="btn btn-cta-primary shadow mb-2" onclick="NEAccountManager.createAccount()">
                                        <span>Criar Cliente</span>
                                        <img src="img/ic-plus-circle-white.svg" alt="Criar Cliente">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--- BOX LISTA OS PRODUTOS -->
                    <div class="box-lista-search" id="account_list_container">


                    </div>
                    <!-- /BOX TOTALIZADOR -->
                </div>
            </div>
        `;

        $('#body_content').html(html);

        NEQueryController.searchAccounts();
    }

    this.writeAccountList = (accounts) => {
        let html = ``;

        if (accounts.length == 0)
            listHTML = '';

        accounts.forEach((account) => {
            html += `
                <div class="row">
                    <div class="mx-auto col-md-12 col-sm-12 col-xs-12 mb-2 mb-md-4">
                        <div class="card card-lista-pedido border-secondary">

                            <div class="card-body pt-3" onclick="NEAccountManager.editAccount('${account.ACCOUNT_ID}')">

                                <div class="row">
                                    <div class="col-12" style="display: flex;justify-content: space-between;">
                                        <div class="unique-data">
                                            <div class="content" style="color: #1f68b1">
                                                ${account.ACCOUNT_NAME}
                                            </div>
                                            <div class="lb-commom">
                                                Telefone: ${account.ACCOUNT_PHONE ? account.ACCOUNT_PHONE : 'Não informado'}
                                            </div>
                                            <div class="lb-commom">
                                                Tipo: ${account.ACCOUNT_TYPE ? account.ACCOUNT_TYPE : 'Não informado'}
                                            </div>
                                        </div>
                                        ${account.SYNC_STATUS == 0 ? `
                                            <div>
                                                <img src="img/ic-substituir.svg" alt="Sync">
                                            </div>
                                        ` : ``}
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            `;
        });

        $('#account_list_container').html(html);
        NEApplication.showLoading(false);
    }


    this.contactSearch = () => {
        NEApplication.showLoading(true);
        let html = `
            <div class="wrap commom" style="position: absolute;width: 100%;height: 100%;">
                <div class="container" style="height: 100%;">

                    <div class="row">
                        <div class="col-12">
                            <div class="unique-data">
                                <div class="content" style="padding: 0px 5px 15px 5px">
                                    <button class="btn btn-cta-primary shadow mb-2" onclick="NEContactManager.createContact()">
                                        <span>Criar Contato</span>
                                        <img src="img/ic-plus-circle-white.svg" alt="Criar Contato">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="box-lista-search" id="contact_list_container">

                    </div>
                </div>
            </div>
        `;

        $('#body_content').html(html);

        NEQueryController.searchContacts();

    }

    this.writeContactList = (contacts) => {
        let html = ``;

        if (contacts.length == 0)
            listHTML = '';

        contacts.forEach((contact) => {
            html += `
                <div class="row">
                    <div class="mx-auto col-md-12 col-sm-12 col-xs-12 mb-2 mb-md-4">
                        <div class="card card-lista-pedido border-secondary">

                            <div class="card-body pt-3" onclick="NEContactManager.editContact('${contact.CONTACT_ID}')">

                                <div class="row">
                                    <div class="col-12" style="display: flex;justify-content: space-between;">
                                        <div class="unique-data">
                                            <div class="content" style="color: #1f68b1">
                                                ${contact.CONTACT_FIRST_NAME + ' ' + contact.CONTACT_LAST_NAME}
                                            </div>
                                            <div class="lb-commom">
                                                Email: ${contact.CONTACT_EMAIL ? contact.CONTACT_EMAIL : 'Não informado'}
                                            </div>
                                            <div class="lb-commom">
                                                Cliente: ${contact.ACCOUNT_NAME ? contact.ACCOUNT_NAME : 'Não informado'}
                                            </div>
                                        </div>
                                        ${contact.SYNC_STATUS == 0 ? `
                                            <div>
                                                <img src="img/ic-substituir.svg" alt="Sync">
                                            </div>
                                        ` : ``}
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            `;
        });

        $('#contact_list_container').html(html);
        NEApplication.showLoading(false);
    }

    this.account = (account) => {
        NEApplication.showLoading(true);

        let html = `
            <div class="wrap commom">
                <div class="container">

                    <div id="select_modal_container"></div>

                    <div class="box-form-pedido">

                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="unique-data">
                                    <div class="lb-commom">
                                        Nome <span class="required">*</span>
                                    </div>
                                    <div class="content">
                                        <input id="account-name" type="text" class="form-control" value="${account.name}">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="unique-data">
                                    <div class="lb-commom">
                                        Telefone <span class="required">*</span>
                                    </div>
                                    <div class="content">
                                        <input id="account-phone" type="number" class="form-control" value="${account.phone}">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="unique-data">
                                    <div class="lb-commom">
                                        Tipo do Cliente <span class="required">*</span>
                                    </div>
                                    <select id="account-type" class="form-control">

                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div class="row mb-3 mt-4">
                        <div class="col-6 col-xs-6">
                            <button class="btn btn-outline-primary btn-nav-steps p-3 btn-block" onclick="NEBuildScreen.accountSearch()">
                                <img src="img/ic-arrow-left.svg" class="ic-voltar" alt="Voltar">
                                <span>Voltar</span>
                            </button>
                        </div>
                        <div class="col-6 col-xs-6 text-right">
                            <button class="btn btn-primary btn-nav-steps-blue p-3 btn-block" onclick="NEAccountManager.saveAccount()">
                                <span>Salvar</span>
                                <img src="img/ic-arrow-right.svg" class="ic-continuar" alt="Salvar">
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;

        $('#body_content').html(html);

        NEQueryController.searchAccountTypes();

        NEApplication.showLoading(false);
        $(window).scrollTop(0);
    }


    this.writeAccountTypeList = (accountTypes) => {
        let accountTypeValue = NEAccountManager.getType();
        let html = ``;

        if (!accountTypeValue) {
            html = `
                <option value="" disabled selected style="display: none;"></option>
            `;
        }

        accountTypes.forEach(item => {
            html += `
                <option value="${item.ACCOUNT_TYPE_IDX}" ${accountTypeValue == item.ACCOUNT_TYPE_IDX ? 'selected' : ''}>${item.ACCOUNT_TYPE_NAME}</option>
            `;
        });

        $('#account-type').html(html);
    }

    this.contact = (contact) => {
        NEApplication.showLoading(true);

        let html = `
            <div class="wrap commom">
                <div class="container">

                    <div id="select_modal_container"></div>

                    <div class="box-form-pedido">

                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="unique-data">
                                    <div class="lb-commom">
                                        Nome <span class="required">*</span>
                                    </div>
                                    <div class="content">
                                        <input id="contact-first-name" type="text" class="form-control" value="${contact.firstName}">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="unique-data">
                                    <div class="lb-commom">
                                        Sobrenome <span class="required">*</span>
                                    </div>
                                    <div class="content">
                                        <input id="contact-last-name" type="text" class="form-control" value="${contact.lastName}">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="unique-data">
                                    <div class="lb-commom">
                                        Email <span class="required">*</span>
                                    </div>
                                    <div class="content">
                                        <input id="contact-email" type="email" class="form-control" value="${contact.email}">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="unique-data">
                                    <div class="lb-commom">
                                        Cliente <span class="required">*</span>
                                    </div>
                                    <div class="content" onclick="NEBuildScreen.openSelectAccountModal()">
                                        <input id="contact-account" type="text" class="form-control" readonly value="${contact.accountName}">
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div class="row mb-3 mt-4">
                        <div class="col-6 col-xs-6">
                            <button class="btn btn-outline-primary btn-nav-steps p-3 btn-block" onclick="NEBuildScreen.contactSearch()">
                                <img src="img/ic-arrow-left.svg" class="ic-voltar" alt="Voltar">
                                <span>Voltar</span>
                            </button>
                        </div>
                        <div class="col-6 col-xs-6 text-right">
                            <button class="btn btn-primary btn-nav-steps-blue p-3 btn-block" onclick="NEContactManager.saveContact()">
                                <span>Salvar</span>
                                <img src="img/ic-arrow-right.svg" class="ic-continuar" alt="Salvar">
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;

        $('#body_content').html(html);

        NEQueryController.searchAccountTypes();

        NEApplication.showLoading(false);
        $(window).scrollTop(0);
    }


    this.openSelectAccountModal = () => {
        NEApplication.showLoading(true);
        let html = `
            <div class="modal modal-info" id="modal-select" tabindex="-1" role="dialog" style="display: none;">
                <div class="modal-dialog" role="document" style="height: 100%;display: flex;align-items: center;">
                    <div class="modal-content" style="padding: 20px;height: 80%;">

                        <div class="modal-header" style="padding: 0;">
                            <div class="row">
                                <div class="col-12">
                                    <div class="unique-data">
                                        <div class="content" style="padding: 0px 5px 15px 5px">
                                            <span>Selecione um cliente</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="close btn-modal" data-dismiss="modal" aria-label="Close" onclick="NEBuildScreen.closeSelectModal()">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div id="account_select_container" class="modal-body">


                        </div>

                    </div>
                </div>
            </div>
        `;
        $('#select_modal_container').html(html);
        $('#modal-select').show();

        NEQueryController.searchContactAccounts();
    }

    this.writeAccountListToSelect = (accounts) => {
        let html = ``;

        if (accounts.length == 0)
            html = ``;

        accounts.forEach((account) => {
            html += `
                <div class="row" style="padding-bottom: 5px;">
                    <div class="mx-auto col-md-12 col-sm-12 col-xs-12 mb-2 mb-md-4" style="padding: 0;">
                        <div class="card card-lista-pedido border-secondary">

                            <div class="card-body pt-3" onclick="NEContactManager.addAccount('${account.ACCOUNT_IDX}', '${account.ACCOUNT_NAME}')">

                                <div class="row">
                                    <div class="col-12">
                                        <div class="unique-data">
                                            <div class="content" style="color: #1f68b1">
                                                ${account.ACCOUNT_NAME}
                                            </div>
                                            <div class="lb-commom">
                                                Telefone: ${account.ACCOUNT_PHONE ? account.ACCOUNT_PHONE : 'Não informado'}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            `;
        });

        $('#account_select_container').html(html);
        NEApplication.showLoading(false);
    }

    this.closeSelectModal = () => {
        $('#modal-select').hide();
    }

}

NEBuildScreen.VAR_instance = null;
NEBuildScreen.SUB_getInstance = function () {
    if (this.VAR_instance === null) this.VAR_instance = new NEBuildScreen();
    return this.VAR_instance;
};
NEBuildScreen.login = function () {
    NEBuildScreen.SUB_getInstance().login();
};
NEBuildScreen.welcome = function () {
    NEBuildScreen.SUB_getInstance().welcome();
};
NEBuildScreen.accountSearch = function () {
    NEBuildScreen.SUB_getInstance().accountSearch();
};
NEBuildScreen.writeAccountList = function (accounts) {
    NEBuildScreen.SUB_getInstance().writeAccountList(accounts);
};
NEBuildScreen.writeAccountTypeList = function (accountTypes) {
    NEBuildScreen.SUB_getInstance().writeAccountTypeList(accountTypes);
};
NEBuildScreen.contactSearch = function () {
    NEBuildScreen.SUB_getInstance().contactSearch();
};
NEBuildScreen.writeContactList = function (accounts) {
    NEBuildScreen.SUB_getInstance().writeContactList(accounts);
};
NEBuildScreen.account = function (account) {
    NEBuildScreen.SUB_getInstance().account(account);
};
NEBuildScreen.contact = function (contact) {
    NEBuildScreen.SUB_getInstance().contact(contact);
};
NEBuildScreen.openSelectAccountModal = function () {
    NEBuildScreen.SUB_getInstance().openSelectAccountModal();
};
NEBuildScreen.writeAccountListToSelect = function (account) {
    NEBuildScreen.SUB_getInstance().writeAccountListToSelect(account);
};
NEBuildScreen.closeSelectModal = function () {
    NEBuildScreen.SUB_getInstance().closeSelectModal();
};