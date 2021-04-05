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

