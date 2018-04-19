#!/usr/bin/env node
const chalk = require('chalk');
const fs = require('fs');
const os = require('os');
const util = require('util');

const FilePath = os.homedir() + '/todo.json';

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

                process.stdin.on('data', buf => {
                    text = buf.toString('ascii');
                    // need to trim out the returns
                    if (text === 'q\r\n' || text === 'quit\r\n') {
                        process.stdin.pause();
                    }
                    // task = ((i + 1) < args.length && args[i + 1].charAt(0) !== '-')? args[i + 1]: '';
                    // i++;
                    // while ((i + 1) < args.length && args[i + 1].charAt(0) !== '-') {
                    //     // add to the main string
                    //     task = task + ' ' + args[i + 1];
                    //     // remove from the list of args
                    //     i++;
                    // }
                    // console.log((!!task)? chalk.green.bold('Task Completed: ') + chalk.italic(task): chalk.yellow('ERROR:') + ' ' + chalk.cyan.underline('Must specify the name of the task!'));
                });
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
                // loop over tasks and print
                getTasks()
                .then(data => {
                    console.log(data);
                    console.log(chalk.green.bold('|>------>>>------>>> ToDo List <<<------<<<------<|'));
                    for (var i = 0; i < data.length; i++) {
                        process.stdout.write(chalk.green.bold('| [] ' + data[i].padEnd(45) + '|\n'));
                    }
                    // console.log(chalk.green.bold('|                                                 |'))
                    console.log(chalk.green.bold('|>------>>>------>>> ToDo List <<<------<<<------<|'));
                })
                .catch(err => {
                    console.log(err);
                });
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
    return new Promise((resolve, reject) => {
        fs.readFile(FilePath, 'utf8', (err, data) => {
            let json = null;
            if (err && err.code === 'ENOENT') {
                reject(err);
            } else {
                // append the task
                json = JSON.parse((data === null)? null: data);
            }
            resolve(json.tasks);
        });
    })
}

function completeTask(int) {

}

function removeTask() {

}
