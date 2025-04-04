module.exports = {
    exampleUtilityFunction: function () {
        // Placeholder for future utility functions
    },

    sendCommand: function (command) {
        (async () => {
            if (this.socket && this.socket.isConnected) {
                try {
                    this.socket.send(command + '\r\n');
                    this.log('info', `Command sent: ${command}`);
                } catch (e) {
                    this.log('error', `Failed to send command: ${command}. ${e.message}`);
                }
            } else {
                this.log('error', `Failed to send command: ${command}. Not connected to ONYX`);
            }
        })()
    }
};
