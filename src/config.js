const { Regex } = require('@companion-module/base');

module.exports = {
    getConfigFields: function () {
        return [
            {
                type: "static-text",
                id: "info",
                width: 12,
                label: "Information",
                value:
                    "Control ONYX (formerly Martin M-Series) consoles with Companion! Enable telnet in ONYX Manager"
            },
            {
                type: "textinput",
                id: "host",
                label: "ONYX Console IP",
                width: 6,
                default: "192.168.0.1",
                regex: Regex.IP
            },
            {
                type: "textinput",
                id: "port",
                label: "Port",
                width: 6,
                default: "2323"
            },
            {
                type: "textinput",
                id: "polling_interval",
                label: "Polling Interval (ms)",
                width: 4,
                default: "1000"
            }
        ];
    },
};
