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
    // for (var i = 0; i < args.length; i++) {
        let task = '';
        switch (args[0]) {
            case '-h':
            case '--help':
                console.log('Helpful hints');
                break;
            case '-a':
            case '--add':
                let i = 0;
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
                getTasks()
                .then(tasks => {
                    prettyPrint(tasks);
                    console.log(chalk.cyan('Please Enter the number of the completed task:'));
                    process.stdin.on('data', buf => {
                        text = buf.toString('ascii');
                        // need to trim out the returns
                        text = text.replace('\r', '');
                        text = text.replace('\n', '');
                        if (text === 'q' || text === 'quit') {
                            process.stdin.pause();
                        } else {
                            let select = Number(text);

                            if (isNaN(select)) {
                                console.log('That\'s not a number, this is a number: ');
                                printAsciiNum(Math.floor(Math.random() * 9) + 1);
                            } else if (select > tasks.list.length) {
                                console.log('That number is too large');
                            } else if (select < 1) {
                                console.log('That number is too small');
                            } else {
                                // actually a valid selection
                                completeTask(select - 1);
                            }
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
                })
                .catch(err => {
                    console.log(err);
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
                .then(tasks => {
                    prettyPrint(tasks);
                })
                .catch(err => {
                    console.log(err);
                });
                break;
            default:
                console.log('Argument not recognised: ' + args[i]);
        }
    // }
}


function addTask(task) {
    fs.readFile(FilePath, 'utf8', (err, data) => {
        let json = null;
        if (err && err.code === 'ENOENT') {
            fs.closeSync(fs.openSync(FilePath, 'w'));
            console.log(chalk.green.bold('File Created'));
            // add the task
            json = {
                "tasks": {
                    "list": [task],
                    "done": []
                },
                "config": {
                    "test": true
                }
            };
        } else {
            // append the task
            json = JSON.parse((data === null)? '{"tasks": {"list": [], "done": []}}': data);
            json.tasks.list.push(task);
        }

        // write the json
        fs.writeFile(FilePath, JSON.stringify(json, null, 4), err => {
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
    fs.readFile(FilePath, 'utf8', (err, data) => {
        let json = null;
        // append the task
        json = JSON.parse((data === null)? '{"tasks": {"list": [], "done": []}}': data);
        json.tasks.done.push(int);

        // write the json
        fs.writeFile(FilePath, JSON.stringify(json, null, 4), err => {
            if (err) throw err;
            console.log(chalk.green.bold('Task Completed'));
        })
    });
}

function removeTask() {

}

function prettyPrint(tasks) {
    console.log(chalk.green.bold('|>------>>>------>>> ToDo List <<<------<<<------<|'));
    for (var i = 0; i < tasks.list.length; i++) {
        process.stdout.write(chalk.green.bold('|') + chalk.bold(' ' + (i + 1) + ' [] ' + tasks.list[i].padEnd(43)) + chalk.green.bold('|\n'));
    }
    console.log(chalk.green.bold('|>------>>>------>>> ToDo List <<<------<<<------<|'));
}

// TODO: add ascii art here
function printAsciiNum(num) {
    console.log(num);
}
