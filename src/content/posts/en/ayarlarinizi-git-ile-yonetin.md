---
title: "Manage Your Settings with Git"
publishDate: "06 May 2022"
description: "Git is not only for controlling the code you write; it is also a great tool for managing and storing your config files."
tags: ["en", "linux", "git", "dotfiles"]
---

Git is not only for controlling the code you write; it is also a great tool for managing and storing your config files. These files, usually found in your home directory, are called config files. Since we don't want to put the entire home directory into a repository, we can use something called a bare git repository.

## Initial setup
First, let's create a bare git repository:

```bash
git init --bare $HOME/.dotfiles
```

With this bare repository, we need to determine the git directory and our working tree. This can be done by adding an alias to your `.gitconfig` file.

```bash
git config --global alias.dotfiles '!git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'
```

Now we can simply write it like this:

```bash
git dotfiles <git command>
```

for example:

```bash
git dotfiles status
```

When we query as above, git will show us all the untracked files in the home directory. To prevent this, we can write:

```bash
git dotfiles config --local status.showUntrackedFiles no
```

Now it will only show the files we add to the repository. Let's add our `.gitconfig` file first:

```bash
git dotfiles add .gitconfig
git dotfiles commit -m ".gitconfig file added" -a
```

Now let's add our remote repository:

```bash
git dotfiles remote add origin <remote repo>
# an example with my remote repo
git dotfiles remote add origin git@github.com:eminboydak/.dotfiles.git
```

and send our first commit:

```bash
git dotfiles push
```

Now you can add all the settings files you want.

## Syncing settings across devices
You can now use the remote repository to sync your settings across many devices. On a new device, you can simply clone the remote repository:

```bash
git clone --bare <remote repo> $HOME/.dotfiles
```

Once you're sure you no longer need the old settings, to ignore them:

```bash
git reset --hard
```

and overwrite the current files in the home directory (make sure you back up your old settings first if you want to keep them):

```bash
git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME pull
```
