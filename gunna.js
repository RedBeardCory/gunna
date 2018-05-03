#!/usr/bin/env node
const chalk = require('chalk');
const fs = require('fs');
const os = require('os');
const util = require('util');
const boxen = require('boxen');

const FilePath = os.homedir() + '/todo.json';

// get command line args
let args = process.argv.slice(2);

// console.log(process.stdout);

// check for any arguments
if (args.length > 0) {
    let task = '';
    switch (args[0]) {
        case '-h':
        case '--help':
            console.log(chalk.bold.cyan(os.EOL + 'td -h td --help') + os.EOL + os.EOL
            + '    Displays the list of command and what they do.' + os.EOL + os.EOL
            + chalk.bold.cyan('td -l || td --list') + os.EOL + os.EOL
            + '    Displays all the todo tasks.' + os.EOL + os.EOL
            + chalk.bold.cyan('td -a [task] || td --add [task]') + os.EOL + os.EOL
            + '    Add a task to the list.' + os.EOL + os.EOL
            + chalk.bold.cyan('td -r [(optional) task #] || td --remove [(optional) task #]') + os.EOL + os.EOL
            + '    Remove a task from the list.' + os.EOL + os.EOL
            + chalk.bold.cyan('td -d [(optional) task #] || td  --done [(optional) task #]') + os.EOL + os.EOL
            + '    Mark a task as complete.' + os.EOL);
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
            // check for input
            let num = Number(args[1]);
            if (!isNaN(num)) {
                completeTask(num - 1);
                break;
            }
            getTasks()
            .then(tasks => {
                prettyPrint(tasks);
                console.log(chalk.cyan('Please Enter the number of the completed task:'));
                process.stdin.on('data', buf => {
                    text = buf.toString('ascii');
                    // need to trim out the returns
                    text = text.replace(os.EOL, '');
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
                            // process.stdin.pause();
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
            break;
        case '-l':
        case '--list':
            // loop over tasks and print
            getTasks()
            .then(tasks => {
                prettyPrint(tasks);
            })
            .catch(err => {
                console.log(err);
            });
            break;
        case '-r':
        case '--remove':
            // remove a task
            let n = Number(args[1]);
            if (!isNaN(n)) {
                removeTask(n - 1);
                break;
            }
            getTasks()
            .then(tasks => {
                prettyPrint(tasks);
                console.log(chalk.cyan('Please Enter the number of the task to remove:'));
                process.stdin.on('data', buf => {
                    text = buf.toString('ascii');
                    // need to trim out the returns
                    text = text.replace(os.EOL, '');
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
                            removeTask(select - 1);
                            // process.stdin.pause();
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
            break;
        default:
            console.log(chalk.red.bold('Argument not recognised: ') + args[0]);
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
    });
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
        });
    });
}

function removeTask(int) {
    console.log(int);
    fs.readFile(FilePath, 'utf8', (err, data) => {
        let json = null;

        json = JSON.parse((data === null)? '{"tasks": {"list": [], "done": []}}': data);

        if (json.tasks.list[int]) {
            json.tasks.list.splice(int, 1);
            json.tasks.done.splice(json.tasks.done.indexOf(int), 1);
            for (var i = 0; i < json.tasks.done.length; i++) {
                if (json.tasks.done[i] > int) {
                    json.tasks.done[i] = (json.tasks.done[i] - 1);
                }
            }
            fs.writeFile(FilePath, JSON.stringify(json, null, 4), err => {
                if (err) throw err;
                console.log(chalk.green.bold('Task Removed'));
            });
        }
    });
}

function prettyPrint(tasks) {
    let string = '';

    for (var i = 0; i < tasks.list.length; i++) {
        string += (chalk.bold((i + 1) + ' [' + (tasks.done.includes(i)? chalk.red('X'):' ') + '] ' + (tasks.done.includes(i)? chalk.dim(tasks.list[i]): tasks.list[i]) + '\n'));
    }

    console.log(boxen(string, { padding: 1, borderColor: 'green', borderStyle: 'round', dimBorder: true }));
}

// TODO: add ascii art here
function printAsciiNum(num) {
    console.log(num);
}
