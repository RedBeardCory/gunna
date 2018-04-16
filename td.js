#!/usr/bin/env node
const chalk = require('chalk');
const fs = require('fs');

// get command line args
let args = process.argv.slice(2);

// console.log(process.stdout);

// check for any arguments
if (args.length > 0) {
    for (var i = 0; i < args.length; i++) {
        let task = '';
        switch (args[i]) {
            case '-h':
            case '--help':
                console.log('Helpful hints');
                break;
            case '-a':
            case '--add':
                task = ((i + 1) < args.length && args[i + 1].charAt(0) !== '-')? args[i + 1]: '';
                i++;
                while ((i + 1) < args.length && args[i + 1].charAt(0) !== '-') {
                    // add to the main string
                    task = task + ' ' + args[i + 1];
                    // remove from the list of args
                    i++;
                }
                console.log((!!task)? chalk.green.bold('Task Added: ') + chalk.italic(task): chalk.yellow('ERROR:') + ' ' + chalk.cyan.underline('Must specify the name of the task!'));
                addTask();
                break;
            case '-d':
            case '--done':
                task = ((i + 1) < args.length && args[i + 1].charAt(0) !== '-')? args[i + 1]: '';
                i++;
                while ((i + 1) < args.length && args[i + 1].charAt(0) !== '-') {
                    // add to the main string
                    task = task + ' ' + args[i + 1];
                    // remove from the list of args
                    i++;
                }
                console.log((!!task)? chalk.green.bold('Task Completed: ') + chalk.italic(task): chalk.yellow('ERROR:') + ' ' + chalk.cyan.underline('Must specify the name of the task!'));
                break;
            case '-l':
            case '--list':
                console.log(chalk.green.bold('LISTING'));
                break;
            case '-la':
            case '--list-all':
                console.log(chalk.green.bold('LISTING ALL, EVEN ') + chalk.bold.red('DELETED') + chalk.green.bold(' TASKS'));
                break;
            default:
                console.log('Argument not recognised: ' + args[i]);
        }
    }
}

function addTask() {
    fs.open('tasks.json', 'w+', function (err, fp) {
        if (err) throw err;
        let str = 'this is a test';
        fs.write(fp, str, 0, str.length, function(err) {
            if (err) throw err;
            console.log('success');
        });
    });
}

function completeTask() {

}

function removeTask() {

}
