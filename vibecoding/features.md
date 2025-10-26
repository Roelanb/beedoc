Build a markdown editor with the following features:

- Edit the markdown directly in markdown style (wysiwyg)


Tech stack:

Use html and D3.js to render the markdown in the browser.
The app needs to be running as an executable on linux and windows. Use Pake (https://github.com/tw93/Pake/) to generate the exe.


Create a complete plan for the requirements in @features.md, save this plann in plan.md so we can track the implementation.


When typing text, create a new paragraph that is automatically created when typing text. Make it draggable.


Add a context menu that allows the user to create a new paragraph, heading, list, etc.

Add at the top a drop down/or pane that shows the folder and file structure of the current directory.
This will serve as a file browser, where the user can open files. and navigate to files and subdirectories.

Look at the code for the file browser. Simplify it and make it work.
Functions needed:
- by default open the docs folder (/media/bart/Development/dev/github/BeeDoc/docs)
- add a small button to open a folder selection dialog box, so that the user can select a different folder.
- show the directory structure in a tree view.
- when the user selects a md file, open it in the editor
