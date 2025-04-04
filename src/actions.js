module.exports = {
	initActions: function () {
		const self = this;
		let actions = {};

		this.log('info', 'Initializing actions...');

		// Define available actions
		actions.command = {
			name: 'Run Custom Command',
			options: [
				{ type: 'textinput', label: 'Command', id: 'command', default: '' },
			],
			callback: async (action) => self.sendCommand(action.options.command),
		};

		actions.go_list_cue = {
			name: 'Go Cuelist',
			options: [
				{ type: 'textinput', label: 'Cuelist Number', id: 'cuelist', default: '' },
			],
			callback: async (action) => self.sendCommand(`GQL ${action.options.cuelist}`),
		};

		actions.go_schedule = {
			name: 'Go Schedule',
			options: [
				{ type: 'textinput', label: 'Schedule Number', id: 'schedule', default: '' },
			],
			callback: async (action) => self.sendCommand(`GSC ${action.options.schedule}`),
		};

		actions.pause_cuelist = {
			name: 'Pause Cuelist',
			options: [
				{ type: 'textinput', label: 'Cuelist Number', id: 'cuelist', default: '' },
			],
			callback: async (action) => self.sendCommand(`PQL ${action.options.cuelist}`),
		};

		actions.release_cl = {
			name: 'Release Cuelist',
			options: [
				{ type: 'textinput', label: 'Cuelist Number', id: 'cuelist', default: '' },
			],
			callback: async (action) => self.sendCommand(`RQL ${action.options.cuelist}`),
		};

		actions.go_cue = {
			name: 'Go Cue in Cuelist',
			options: [
				{ type: 'textinput', label: 'Cuelist Number', id: 'cuelist', default: '' },
				{ type: 'textinput', label: 'Cue Number', id: 'cue', default: '' },
			],
			callback: async (action) => self.sendCommand(`GTQ ${action.options.cuelist},${action.options.cue}`),
		};

		// Log the loaded actions
		console.log('Loaded actions:', Object.keys(actions));

		this.setActionDefinitions(actions);
	},
};
