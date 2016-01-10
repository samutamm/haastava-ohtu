
const commands = require('./commands.json');

var commandCall = process.argv[2];
var command = commands[commandCall];

if(commandCall === undefined || command === undefined) {
  console.log('Availeble commands: ');
  for (var key in commands) {
    if (commands.hasOwnProperty(key)) {
      console.log(key + " - " + commands[key].description);
    }
  }
} else {
  require(command.location)(command);
}
