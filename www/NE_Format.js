function NEFormat() {

    this.getFormatedCurrentDate = () => {
        let data = new Date(),
            dia = data.getDate().toString().padStart(2, '0'),
            mes = (data.getMonth() + 1).toString().padStart(2, '0'),
            ano = data.getFullYear();
        return dia + "/" + mes + "/" + ano;
    }

    this.getFormatedDateTime = function (date) {
        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear();
        let hour = date.getHours().toString().padStart(2, '0');
        let min = date.getMinutes().toString().padStart(2, '0');

        return day + "/" + month + "/" + year + " " + hour + ":" + min;
    }

    this.convertToInteger = function (varBoolean) {
        if (varBoolean)
            return 1;
        return 0;
    }

    this.formatDate = function (strDate) {
        var formatDate = '',
            gmtDate = new Date(strDate),
            utcDate = gmtDate.getUTCDate() < 10 ? ('0' + gmtDate.getUTCDate()) : gmtDate.getUTCDate(),
            utcMonth = (gmtDate.getUTCMonth() + 1) < 10 ? '0' + (gmtDate.getUTCMonth() + 1) : (gmtDate.getUTCMonth() + 1),
            utcYear = gmtDate.getUTCFullYear();

        formatDate = `${utcDate}/${utcMonth}/${utcYear}`;
        return formatDate;
    }

    this.formatDBDate = function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    this.daysBetweenDates = function (date1, date2) {
        var diff, aDay = 86400000;
        diff = Math.floor((Date.parse(date2) - Date.parse(date1)) / aDay);
        return diff;
    }

    this.formatBRL = function (value, style) {
        var num = parseFloat(parseFloat(value).toFixed(2));
        var valueBRL = num.toLocaleString("pt-BR", { minimumFractionDigits: 2, style: style, currency: 'BRL' });
        return valueBRL;
    }

}
NEFormat.VAR_instance = null;
NEFormat.SUB_getInstance = function () {
    if (this.VAR_instance === null) this.VAR_instance = new NEFormat();
    return this.VAR_instance;
};
NEFormat.getFormatedCurrentDate = function () {
    return NEFormat.SUB_getInstance().getFormatedCurrentDate();
};
NEFormat.getFormatedDateTime = function (date) {
    return NEFormat.SUB_getInstance().getFormatedDateTime(date);
};
NEFormat.convertToInteger = function (varBoolean) {
    return NEFormat.SUB_getInstance().convertToInteger(varBoolean);
}
NEFormat.formatDate = function (strDate) {
    return NEFormat.SUB_getInstance().formatDate(strDate);
}
NEFormat.formatDBDate = function (strDate) {
    return NEFormat.SUB_getInstance().formatDBDate(strDate);
}
NEFormat.daysBetweenDates = function (date1, date2) {
    return NEFormat.SUB_getInstance().daysBetweenDates(date1, date2);
}
NEFormat.formatBRL = function (value, style) {
    return NEFormat.SUB_getInstance().formatBRL(value, style);
}