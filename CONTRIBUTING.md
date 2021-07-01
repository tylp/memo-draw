# Contributing.md

Guidelines to follow when working on this project.

## Project Structure
The project follows the following structure :
- src/
    - hooks/
    - pages/
    - components/

### Hooks
The hooks folder contains all the hooks of the project.
A hook should start byse the keyword "use" and be defined by two files :
* use<Hookname>.ts
* use<Hookname>.test.ts

New hooks should be registered in the hooks/index.ts file and be imported with `import {use<Hookname>} from 'hooks'`.

## Pages
The page folder contains all the pages of the application.

## components
The components folder contains the components of the application.
Components shoudl follow the structure defined in the [Components](https://github.com/tylp/memo-draw/blob/main/CONTRIBUTING.md#Components) section.

## Components

Each component consists of four files :

- <component>.tsx
- <component>.module.css
- <component>.spec.ts
- <component>.test.ts

## Branching & Commit

### Branching

> ***See*** [Git branching workflow](https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow) article and [Branch naming guidelines](https://gist.github.com/revett/88ee5abf5a9a097b4c88).

In order to allow a better collaboration, the git workflow is structured as follow:
- `main` branch is the common development branch, features and bugfix should be merged on this branch.
- `release` branch is used only for stable release, it can be merged only from the `release` branch.
- `hotfix` branch is used to fix bug in production. Commit must include a tag for the version.
- Separate branch for development features and bugfix. Must be merged with the `main` branch. Indicate at the begining of the branch name if it is a feature or a bugfix. 

***Specify in the first or last commit of a new branch, the revelant issue(s).***

### Commit

> ***See*** [Git commit guidelines](https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow).

Commit name must clearly specify the different changes.

## Merge request

For all the contribution, you need to :
- Fork the project into your personal namespace
- Create a feature branch (`fea/...`)  or a bugfix branch (`bug/...`) in your fork (don’t work on `main`).
- Write tests and code.
- Follow the commit messages guidelines.
- Push the commit(s) to your working branch in your fork.
- Make sure all the test (old and new) pass.
- Submit a merge request (MR) to the `main` branch in the main GitLab project.
- Make sure the merge request reference the revelent issue(s).
- You can aprove the MR by yourself for minor changes, it is necessary to do a code review for major changes.
