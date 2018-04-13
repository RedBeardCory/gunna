#!/usr/bin/env node
const chalk = require('chalk');
const fs = require('fs');

// get command line args
let args = process.argv.slice(2);

// console.log(process.stdout);

// check for any arguments
if (args.length > 0) {
    for (var i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-h':
            case '--help':
                console.log('Helpful hints');
                break;
            case '-a':
            case '--add':
                console.log('Adding task');
                let task = '';
                if (args[i + 1].charAt(0) !== '-') {
                    console.log(i);
                    while (args[i + 1].charAt(0) !== '-' && (i + 1) < args.length) {
                        // add to the main string
                        task += ' ' + args[i + 1];
                        // remove from the list of args
                        args.splice(i + 1, 1);
                        i++;
                    }
                    console.log(task);
                } else {
                    console.log(chalk.yellow('ERROR:') + ' ' + chalk.cyan.underline('Must specify the name of the task!'));
                }
                break;
            default:
                console.log('Argument not recognised: ' + args[i]);
        }
    }
}


// for ( var i = 0; i < 1000; i++) {
//     if (i == 99) {
//         process.stdout.write("h\n");
//     }
//     process.stdout.write("h\r");
// }
