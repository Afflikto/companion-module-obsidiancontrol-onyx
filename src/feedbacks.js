const { combineRgb } = require('@companion-module/base');

module.exports = {
	initFeedbacks: function () {
		let self = this;

		let feedbacks = {};
		feedbacks["cuelist_active"] = {
			name: "Active Cuelist",
			type: 'boolean',
			description: "If the specified cuelist is active, change colors of the bank",
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 255, 0)
			},
			options: [
				{
					type: "textinput",
					label: "Cuelist Number",
					id: "index",
					default: 0,
					regex: self.REGEX_NUMBER
				}
			],
			callback: function (feedback) {
				if (self.activeCuelists.indexOf(parseInt(feedback.options.index)) > -1) {
					return true;
				}
				return false;
			}
		};

		self.setFeedbackDefinitions(feedbacks);
	}

}
