const { InstanceBase, InstanceStatus, runEntrypoint, TelnetHelper } = require('@companion-module/base');
const UpgradeScripts = require('./src/upgrades');
const actions = require('./src/actions');
const feedbacks = require('./src/feedbacks');
const config = require('./src/config');
const variables = require('./src/variables');
const presets = require('./src/presets');
const utils = require('./src/utils');

class OnyxInstance extends InstanceBase {
    constructor(internal) {
        super(internal);
        this.activeCuelists = [];
        this.request_id = 0;

        Object.assign(this, {
            ...config,
            ...actions,
            ...feedbacks,
            ...variables,
            ...presets,
            ...utils,
        });

        this.updateStatus(InstanceStatus.Connecting);
    }

    async init(config) {
        this.configUpdated(config);
    }

    async configUpdated(config) {
        if (config.polling_interval && Number.isNaN(config.polling_interval)) {
            // Minimum 100ms polling interval
            this.polling_interval = Math.max(100, config.polling_interval);
        } else {
            this.polling_interval = 0;
        }
        this.config = config;

        this.initActions();
        this.initFeedbacks();
        this.initVariables();
        this.initPresets();

        this.updateStatus(InstanceStatus.Connecting);
        this.initConnection();
    }

    initConnection() {
        if (this.socket) {
            this.socket.destroy();
            delete this.socket;
        }

        if (this.config.host && this.config.port) {
            this.socket = new TelnetHelper(this.config.host, this.config.port, { reconnect: true, reconnect_interval: 2000 });

            this.socket.on('status_change', (status, message) => {
                this.log('debug', "New status from telnet: " + status + " " + message)
                this.updateStatus(status, message);
            });

            this.socket.on('connect', () => {
                this.log('info', `Connected to ${this.config.host}:${this.config.port}`);
                this.updateStatus(InstanceStatus.Ok);

                if (this.pollTimer) {
                    clearInterval(this.pollTimer);
                }
                this.log('debug', "Polling interval: " + this.config.polling_interval);
                if (this.config.polling_interval > 0) {
                    this.pollTimer = setInterval(() => {
                        this.pollActiveCuelists();
                    }, this.config.polling_interval);
                }

                this.socket.on('data', (buffer) => {
                    this.handleIncomingData(buffer);
                });    
            });

            
            this.socket.on('error', (err) => {
                this.log('error', `Connection error: ${err.message}`);
                this.updateStatus(InstanceStatus.ConnectionFailure, err.message);
            });

            this.socket.on('end', () => {
                this.log('info', 'Disconnected from device.');
                this.updateStatus(InstanceStatus.Disconnected);
            });

            this.socket.connect();
        } else {
            this.updateStatus(InstanceStatus.BadConfig, 'Missing host or port configuration.');
        }
    }

    handleIncomingData(buffer) {
        const data = buffer.toString('utf8');
        this.buffer += data;

        const lines = this.buffer.split(/\r?\n/);
        for (const line of lines) {
            if (line === '.') {
                this.buffer = '';
            } else if (!isNaN(parseInt(line))) {
                this.activeCuelists.push(parseInt(line));
            }
        }
        this.log('debug', `Received data: ${data}`);
        this.checkFeedbacks('cuelist_active');
    }

    pollActiveCuelists() {
        this.activeCuelists = [];
        if (this.socket && this.socket.isConnected) {
            this.sendCommand("QLActive")
        }
    }

    async destroy() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            delete this.pollTimer;
        }

        if (this.socket) {
            this.socket.destroy();
            delete this.socket;
        }

        this.log('debug', `Instance ${this.id} destroyed`);
    }
}

runEntrypoint(OnyxInstance, UpgradeScripts);
