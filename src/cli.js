import arg from 'arg';
import inquirer from 'inquirer';
import createWidget from './generator';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--js': Boolean,
      '--name': String,
      '--namespace': String,
      '-js': '--js',
      '-n': '--name',
      '-ns': '--namespace',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    js: args['--js'] || false,
    name: args['--name'] || false,
    namespace: args['--namespace'] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'JavaScript';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];
  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'What is the name of the new widget?',
      default: 'Simple Widget',
    });
  }

  if (!options.js) {
    questions.push({
      type: 'confirm',
      name: 'js',
      message: 'Add JavaScript?',
      default: true,
    });
  }

  if (options.js || answers.js) {
    if (!options.namespace) {
      questions.push({
        type: 'input',
        name: 'namespace',
        message: 'What is the (JS) namespace of the new widget?',
        default: 'custom',
      });
    }
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    name: options.name || answers.name,
    js: options.js || answers.js,
    namespace: options.namespace || answers.namespace,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  createWidget(options);
}