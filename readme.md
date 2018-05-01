# gunna

#### By Cory Patterson

## Why

I wanted to expand my node cli skills and simultaneously wanted a nice looking todo list for work. So I created my own todo list and here it is. I also plan on taking this totally overboard so any weird and or wacky feature requests are welcome.

## Install

Clone the repo.
Inside the repo do an `npm i`.
Finally once that has installed then run `npm i -g`.
Linux and Mac users may require sudo for the global install.

Once installed with npm you can use the todo list anywhere within your terminal with the command `td`.

## Usage

There are a few simple flags for this program:

`td -h || td --help`:

Displays the list of command and what they do.

`td -l || td --list`:

Displays all the todo tasks.

`td -a || td --add`:

Add a task to the list.

`td -r [(optional) task #] || td --remove [(optional) task #]`:

Remove a task from the list.

`td -d [(optional) task #] || td  --done [(optional) task #]`:

Mark a task as complete.

## Future Works

Just some features that I thought could make this pretty cool:

- [ ] Sync lists and settings across devices (via google drive or something)
- [ ] Interactive selection instead of text prompts
- [ ] Configuration options (colours and stuff)
- [ ] Priority of tasks

If you think there is an awesome feature just make an issue on this repo with the feature and explain what it does and I'll consider adding it to the program.
