const keywords = require('./keywords');

async function addLabel (context) {
  console.log(context.payload.action, context.payload.pull_request.body);

  const issues = keywords(context.payload.pull_request.body);
  if (issues.length > 0) {
    // review body information for the fixes, fixed, etc keywords.
    await issues.forEach(async issue => {
      const params = context.issue({
        number: issue,
        labels: ['in-progress']
      });
      await context.github.issues.addLabels(params);
    });
  }
}

async function removeLabel (context) {
  // review body information for the fixes, fixed, etc keywords.
  const issues = keywords(context.payload.pull_request.body);

  if (issues.length > 0) {
    await issues.forEach(async issue => {
      const params = context.issue({
        number: issue,
        name: 'in-progress',
      });

      await context.github.issues.removeLabel(params);
    });
  }
}

module.exports = robot => {
  // Your code here
  console.log('Yay, the app was loaded!');

  robot.on('pull_request.opened', addLabel);

  robot.on('pull_request.reopened', addLabel);

  robot.on('pull_request.edited', addLabel);

  robot.on('pull_request.closed', removeLabel);
};
