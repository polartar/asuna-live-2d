# Cubism Web Framework

It is a framework for using the model output by Live2D Cubism 4 Editor in the application.

It provides various functions for displaying and operating the model.
Use in combination with the Live2D Cubism Core library to load the model.

By building, you can use it as a JavaScript library that can be used in the browser.


## License

Please check [License] (LICENSE.md) before using this SDK.


## Development environment

### Node.js

* 17.2.0
* 16.13.1
* 14.18.2
* 12.22.7

### TypeScript

4.5.2


## Development environment construction

1. Install [Node.js] and [Visual Studio Code]
1. Open this project in Visual Studio Code and install the recommended extension
    * You can check by typing `@recommended` from the Extensions tab
1. In the command palette (* View> Command Palette ... *), enter `> Tasks: Run Task` to display the task list.
1. Select `npm: install` to download dependent packages

You can execute various commands from the task list on the command palette.

NOTE: The settings for debugging are described in `.vscode/tasks.json`.

## Task list

### `npm: build`

Build the source files and output to the `dist` directory.

You can change the settings by editing `tsconfig.json`.

### `npm: test`

Perform a TypeScript type check test.

You can change the settings by editing `tsconfig.json`.

### `npm: lint`

Performs static analysis of TypeScript files in the `src` directory.

You can change the settings by editing `.eslintrc.yml`.

### `npm: lint:fix`

Performs static analysis and automatic modification of TypeScript files in the `src` directory.

You can change the settings by editing `.eslintrc.yml`.

### `npm: clean`

Delete the build artifact directory (`dist`).


## Component

### effect

It provides functions such as automatic blinking and lip sync to add motion information to the model as an effect.

### id

It provides a function to manage the parameter name, part name, and Drawable name set in the model with a unique type.

### math

It provides the functions of arithmetic operations required for model operation and drawing, such as matrix calculation and vector calculation.

### model

It provides various functions (generate, update, destroy) for handling models.

### motion

It provides various functions (motion playback, parameter blending) for applying motion data to the model.

### physics

Provides functionality for applying physics transformation operations to a model.

### rendering

Provides a renderer that implements graphics instructions for drawing the model.

### type

Provides a type definition for use within the framework.

### utils

It provides utility functions such as JSON parser and log output.


## Live2D Cubism Core for Web

Cubism Core for Web is not included in this repository.

Download it from the [Cubism SDK for Web].

[Cubism SDK for Web]: https://www.live2d.com/download/cubism-sdk/download-web/


## sample

See [CubismWebSamples] for an example implementation of a standard application.

[CubismWebSamples]: https://github.com/Live2D/CubismWebSamples


## Manual

[Cubism SDK Manual](https://docs.live2d.com/cubism-sdk-manual/top/)


## change history

Please refer to [CHANGELOG.md] (CHANGELOG.md) for the change history of this repository.


## community

If you want to suggest or ask questions about how to use the Cubism SDK between users, please use the community.

-[Live2D Official Community] (https://creatorsforum.live2d.com/)
- [Live2D community(English)](http://community.live2d.com/)