function NeSyncController() {
    this.syncRecords = {
        lastSyncAccountId: '',
    }

    this.resetSyncRecords = function () {
        this.syncRecords = {
            lastSyncAccountId: '',
        }
    }

    this.syncData = function (lastSyncStamp, lastSyncId) {
        return {
            lastSyncStamp: lastSyncStamp,
            lastSyncId: lastSyncId
        }
    }

    this.generateSyncQuery = function (received) {
        var groupQuery = [];

        groupQuery = groupQuery.concat(this.syncBaseData(received));
        groupQuery = groupQuery.concat(this.syncSystemData(received));
        groupQuery = groupQuery.concat(this.syncSystemData(received));

        return groupQuery;
    }

    this.syncSystemData = function (received) {
        var groupQuery = [];
        var query =
            'UPDATE system SET ' +
            '   USER_IDX = \'' + received.userData.userId + '\' '           +
            ' , USER_NAME = \'' + received.userData.userName + '\' '        +
            ' , USER_EMAIL = \'' + received.userData.userLogin + '\' '      +
            ' , USER_PROFILE = \'' + received.userData.userProfile + '\' '  +
            ' , LAST_SYNC_BASE_DATA = ' + received.userData.lastSyncUser;

        if (received.syncData.accountSync.lastSyncStamp) {
            query += ' , LAST_SYNC_ACCOUNT = ' + received.syncData.accountSync.lastSyncStamp;
            query += ' , LAST_SYNC_ACCOUNT_ID = \'' + received.syncData.accountSync.lastSyncId + '\'';
        }

        if (received.syncData.contactSync.lastSyncStamp) {
            query += ' , LAST_SYNC_CONTACT = ' + received.syncData.contactSync.lastSyncStamp;
            query += ' , LAST_SYNC_CONTACT_ID = \'' + received.syncData.contactSync.lastSyncId + '\'';
        }

        query += ' WHERE SYSTEM_ID = 1';

        groupQuery.push(
            query
        );

        return groupQuery;
    }

    this.syncBaseData = function (received) {

        var groupQuery = [];
        var baseQuery = {
            'account': 'INSERT OR REPLACE INTO account (ACCOUNT_ID, ACCOUNT_IDX, ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_TYPE, SYNC_STATUS) VALUES',
            'contact': 'INSERT OR REPLACE INTO contact (CONTACT_ID, CONTACT_IDX, CONTACT_FIRST_NAME, CONTACT_LAST_NAME, CONTACT_EMAIL, ACCOUNT_IDX, SYNC_STATUS) VALUES',
            'account_type': 'INSERT OR REPLACE INTO account_type (ACCOUNT_TYPE_IDX, ACCOUNT_TYPE_NAME) VALUES',
        }
        queryBuffer = '',
        maxLength = 20000,
        currLength = 0,
        deletedArray = {
            'account': [],
            'contact': []
        };

        //ACCOUNT_ID, ACCOUNT_IDX, ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_TYPE
        if (received.accountRequest && received.accountRequest.id.length > 0) {
            currLength = received.accountRequest.id.length;
            queryBuffer = baseQuery['account'];
            var hasBuffer = false;
            for (var i = 0; i < currLength; i++) {
                if (received.accountRequest.deleted[i]) {
                    deletedArray['account'].push(received.accountRequest.id[i]);
                } else {
                    queryBuffer += (hasBuffer ? ',' : '') + '('                                                                 +
                        ' (SELECT ACCOUNT_ID FROM account WHERE ACCOUNT_IDX = \'' + received.accountRequest.id[i] + '\' ), '    +
                        '\'' + SUB_stringEscape(received.accountRequest.id[i])                                                  +
                        '\',\'' + SUB_stringEscape(received.accountRequest.name[i])                                             +
                        '\',\'' + SUB_stringEscape(received.accountRequest.phone[i])                                            +
                        '\',\'' + SUB_stringEscape(received.accountRequest.type[i])                                             +
                        '\',\'' + SUB_stringEscape(1)                                                                           +
                        '\''                                                                                                    +
                        ')';
                    hasBuffer = true;
                    if (queryBuffer.length > maxLength) {
                        groupQuery.push(queryBuffer + ';');
                        queryBuffer = baseQuery['account'];
                        hasBuffer = false;
                    }
                }
            }
            if (hasBuffer) groupQuery.push(queryBuffer);
            if (deletedArray['account'].length > 0) {
                groupQuery.push(
                    'DELETE FROM account ' +
                    ' WHERE ACCOUNT_IDX IN (\'' + deletedArray['account'].join('\',\'') + '\')'
                );
            }
        }

        //CONTACT_ID, CONTACT_IDX, CONTACT_FIRST_NAME, CONTACT_LAST_NAME, CONTACT_EMAIL, ACCOUNT_IDX
        if (received.contactRequest && received.contactRequest.id.length > 0) {
            currLength = received.contactRequest.id.length;
            queryBuffer = baseQuery['contact'];
            var hasBuffer = false;
            for (var i = 0; i < currLength; i++) {
                if (received.contactRequest.deleted[i]) {
                    deletedArray['contact'].push(received.contactRequest.id[i]);
                } else {
                    queryBuffer += (hasBuffer ? ',' : '') + '('                                                                 +
                        ' (SELECT CONTACT_ID FROM contact WHERE CONTACT_IDX = \'' + received.contactRequest.id[i] + '\' ), '    +
                        '\'' + SUB_stringEscape(received.contactRequest.id[i])                                                  +
                        '\',\'' + SUB_stringEscape(received.contactRequest.firstName[i])                                        +
                        '\',\'' + SUB_stringEscape(received.contactRequest.lastName[i])                                         +
                        '\',\'' + SUB_stringEscape(received.contactRequest.email[i])                                            +
                        '\',\'' + SUB_stringEscape(received.contactRequest.accountId[i])                                        +
                        '\',\'' + SUB_stringEscape(1)                                                                           +
                        '\''                                                                                                    +
                        ')';
                    hasBuffer = true;
                    if (queryBuffer.length > maxLength) {
                        groupQuery.push(queryBuffer + ';');
                        queryBuffer = baseQuery['contact'];
                        hasBuffer = false;
                    }
                }
            }
            if (hasBuffer) groupQuery.push(queryBuffer);
            if (deletedArray['contact'].length > 0) {
                groupQuery.push(
                    'DELETE FROM contact ' +
                    ' WHERE contact_IDX IN (\'' + deletedArray['contact'].join('\',\'') + '\')'
                );
            }
        }

        
        if (received.accountTypeRequest && received.accountTypeRequest.length > 0) {
            groupQuery.push(' DELETE FROM account_type ');
            currLength = received.accountTypeRequest.length;
            queryBuffer = baseQuery['account_type'];
            var hasBuffer = false;
            for (var i = 0; i < currLength; i++) {
                queryBuffer += (hasBuffer ? ',' : '') + '('                                     +
                    '\'' + SUB_stringEscape(received.accountTypeRequest[i].accountTypeId)       +
                    '\',\'' + SUB_stringEscape(received.accountTypeRequest[i].accountTypeName)  +
                    '\''                                                                        +
                    ')';
                hasBuffer = true;
                if (queryBuffer.length > maxLength) {
                    groupQuery.push(queryBuffer + ';');
                    queryBuffer = baseQuery['account_type'];
                    hasBuffer = false;
                }
            }
            if (hasBuffer) groupQuery.push(queryBuffer);
        } else groupQuery.push(' DELETE FROM account_type ');


        return groupQuery;
    }
}

NeSyncController.instance = null;

NeSyncController.getInstance = function () {
    if (NeSyncController.instance == null)
        NeSyncController.instance = new NeSyncController();

    return NeSyncController.instance;
}
NeSyncController.generateSyncQuery = function (received) {
    return NeSyncController.getInstance().generateSyncQuery(received);
}
NeSyncController.syncData = function (lastSyncStamp, lastSyncId) {
    return NeSyncController.getInstance().syncData(lastSyncStamp, lastSyncId);
}
NeSyncController.getSyncRecords = function () {
    return NeSyncController.getInstance().syncRecords;
}
NeSyncController.setSyncRecords = function (syncRecords) {
    NeSyncController.getInstance().syncRecords = syncRecords;
}
NeSyncController.resetSyncRecords = function () {
    return NeSyncController.getInstance().resetSyncRecords();
}

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