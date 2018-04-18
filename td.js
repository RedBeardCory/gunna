#!/usr/bin/env node
const chalk = require('chalk');
const fs = require('fs');
const os = require('os');

const FilePath = os.homedir() + '/tasks.json';

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
                addTask(task);
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
            case '-p':
            case '--pretty':
                // make a nice printout with ascii art and stuff
                console.log(chalk.green.bold('|>------>>>------>>> ToDo List <<<------<<<------<|'));
                // loop over tasks and print
                let tasks = getTasks();
                for (var i = 0; i < tasks.length; i++) {
                    console.log(tasks[i]);
                }
                // console.log(chalk.green.bold('|                                                 |'))
                console.log(chalk.green.bold('|>------>>>------>>> ToDo List <<<------<<<------<|'));
                break;
            default:
                console.log('Argument not recognised: ' + args[i]);
        }
    }
}


function addTask(task) {
    fs.readFile(FilePath, 'utf8', (err, data) => {
        let json = null;
        if (err && err.code === 'ENOENT') {
            fs.closeSync(fs.openSync(FilePath, 'w'));
            console.log(chalk.green.bold('File Created'));
            // add the task
            json = {
                "tasks": [task]
            }
        } else {
            // append the task
            json = JSON.parse((data === null)? '{"tasks": []}': data);
            json.tasks.push(task);
        }

        // write the json
        fs.writeFile(FilePath, JSON.stringify(json,null, 4), err => {
            if (err) throw err;
            console.log(chalk.green.bold('Task Added Successfully'));
        })
    });
}

function getTasks() {
    fs.readFile(FilePath, 'utf8', (err, data) => {
        let json = null;
        if (err && err.code === 'ENOENT') {
            console.log(chalk.yellow('No Tasks Found'));
        } else {
            // append the task
            json = JSON.parse((data === null)? null: data);
        }
        return json;
    });

}

function completeTask() {

}

function removeTask() {

}
