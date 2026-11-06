---
title: "Installing MATLAB on Arch Linux"
publishDate: "06 Mar 2024"
description: "I wrestled a bit with installing MATLAB on Arch Linux"
tags: ["en", "linux", "arch", "matlab"]
---

Greetings. I needed MATLAB for my master's studies, so I looked into how to install it on Arch Linux and wrote this post based on my own setup. The installation works for me; for more information and detail, check the [Arch Linux Wiki](https://wiki.archlinux.org/title/MATLAB).

If you have the means, I recommend using GNU Octave instead of MATLAB.

I assume you know your own filesystem and how to launch an application without clicking an icon.

## Installation

This installation is written for MATLAB R2022b; it will probably work for other versions too.

### Download the zip archive

Download the `.zip` archive from MATLAB's own [official site](https://matlab.mathworks.com/). To download it, you need an account with a license. I'll assume you downloaded it to your `Downloads` folder.

### Create two new folders

```bash
cd ~/Downloads
mkdir matlab
mkdir tmp
```

### Move the zip file

```sh
mv matlab_R2022b_glnxa64.zip matlab/
cd matlab/
```

We do this so that extracting the zip file doesn't clutter your Downloads folder with unnecessary things.

### Extract the zip file

```sh
unzip matlab_R2022b_glnxa64.zip
```

### Remove the incompatible library

```sh
rm ./bin/glnxa64/libfreetype.so*
```

Some libraries used by the installer are incompatible with Arch Linux's `freetype2` library. For this reason we must delete these files.

### Launch the installer

```sh
sudo ./install -downloadFolder /home/<username>/Downloads/tmp/
```

Launch the installer with `sudo` so the tool can create the `/usr/local/MATLAB/` path and create the link in `/usr/local/bin`.

### Continue with the installer

**IMPORTANT:** Select the "Create symlinks to your `$PATH`" option. Sometimes it may not be selected by default. It is necessary so you don't have to set the path manually and run the program by typing text.

**IMPORTANT:** Your username must match the output of the `whoami` command.

This way the files will download successfully and the installation will be completed.

## Activate MATLAB

```sh
cd /usr/local/MATLAB/R2022b/bin/
sudo ./activate_matlab.sh
```

You need to do the verification you did during installation a second time here.

## MATLAB doesn't work when I run the matlab command!

It's quite normal to think the program will run when you call the `matlab` command. When you run this command, a small MATLAB window probably appears and then disappears. To run it in GUI mode, you should run the program with the `matlab -desktop` command.

## Unable to connect to the license server.

If you're getting this error, then you're getting the same error as me. Since it's a license tied to the university, the program doesn't work without being connected to the university network.

For this reason, if your university has a VPN network, you can connect to the VPN and run the program.

## Epilogue

Thanks to this guide, you may have completed the installation or not. To not deal with these kinds of headaches, GNU Octave can be a good alternative. We can't say it's exactly the same as MATLAB, but it will get the job done most of the time.

Stay well.
