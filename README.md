# avocat 
🥑 Continuous contract testing tool for HTTP APIs

## Description
Avocat is a continuous contract testing tool for HTTP APIs. It allows running integration tests between different modules. Make sure you have your APIs contracts written in (YAML, RAML, JSON or XML), then you're ready to get started!

## Contents
1. [ Getting Started ](#getting-started)
    1. [ Prerequisites ](#prerequisites)
    2. [ Installation ](#installation)
2. [ Running Tests ](#running-tests)
    1. [ Unit Tests ](#run-unit-tests)
    2. [ Code Coverage ](#run-code-coverage)
    3. [ Code Conformance ](#run-code-conformance)
3. [ Usage ](#usage)
    1. [ CLI Commands ](#cli-commands)
    2. [ Start Coding ](#start-coding)
    3. [ Additional Scripts ](#additional-scripts)
4. [ Authors ](#authors)
3. [ Licence ](#licence)


## Getting Started
Avocat installation is a simple process. It won't take too much of your time :)

### Prerequisites
- npm version >=6.12.1
- node version >=10.15.3

### Installation
- Clone this git repository into a local directory
    ```sh
        $ git clone git@git.soma.salesforce.com:searchdev/avocat.git
    ```

- Open it
    ```sh
        $ cd avocat
    ```

- Install npm dependencies
    ```sh
        $ npm install  
    ```

- Install Avocat globally
  ```sh
      $ npm r -g avocat && npm i -g
  ```
  
- That's it! You can start Avocat
    ```sh
        $ avocat
    ```

## Running tests
Trust is our first value, and to do so, we have strict quality checks and metrics.

### Run unit tests
- We use Jest to write unit tests, you can run them easily with
    ```sh
        $ npm test   
    ```
  
### Update snapshots
- We use Jest to generate snapshots of avocat expected UX, in case of modifications update them with
    ```sh
        $ npm run test:updateSnapshot  
    ```

### Run Code Coverage
- We use Jest to measure code coverage as well, you can run it easily with
    ```sh
        $ npm run coverage  
    ```

### Run Code Conformance
- We use ESlint to validate code style conformance, and it applies [StandardJS](https://standardjs.com/) set of rules. Validate your code with
    ```sh
        $ npm run validate  
    ```


## Usage
Before you start using avocat, make sure you've installed it globally, otherwise refer to [ Installation ](#installation) section.

### CLI Commands

- **status** <br/>
    This command allows you check if there is pending changes in your local repositories. It takes no parameters or options. <br/>
    e.g. ``` $ avocat status ``` <br/>
    *See more detailed examples [here](https://git.soma.salesforce.com/searchdev/avocat/wiki/CLI%3A%3Astatus).*

- **import** <br/>
    This command allows you to import new contract version into local avocat repository. It takes one parameter which is your contract file. <br/>
    e.g. ``` $ avocat import <contract_path> ``` <br/>
    *See more detailed examples [here](https://git.soma.salesforce.com/searchdev/avocat/wiki/CLI%3A%3Aimport).*
    
- CLI::amend
- CLI::pull
- CLI::push
- CLI::test
- CLI::reveng

### Start coding
This section describes our code files structure.

#### Source code files
Could be found in avocat/src directory. <br/>
```
    |_ main             # source code and unit tests        
      |_ cli            # commands UX management            
      |_ core           # avocat business logic             
    |_ index.ts         # loads CliApp and runs avocat      
    |_ test             # integration tests and test utils 
```

#### Config files
All config files could be found under the root directory.
- [package.json](/package.json): Avocat manifest, scripts and dependencies.
- [tsconfig.json](/tsconfig.json): contains [ts-node](https://github.com/TypeStrong/ts-node) config.
- [jest.config.js](/jest.config.js): contains [Jest](https://jestjs.io/) config.
- [.eslintrc.js](/.eslintrc.js): contains [eslint](https://eslint.org/) config.
- [Jenkinsfile](/Jenkinsfile): contains the definition of the [SFCI](https://searchdevci.dop.sfdc.net/job/searchdev/job/avocat/) pipeline.

### Additional Scripts
We've added some custom scripts that might be useful when coding in Avocat.

- **ts-node:** this command is an alternative way to run avocat when you don't want to install it globally every time. You can run it with 
    ``` sh 
      $ ts-node src/main/index.ts
    ```

- **Build:** this command transpiles typescript code into javascript. Transpiled files could be found in avocat/dist folder. You can run it with 
    ``` sh 
        $ npm run build
    ```
  
- **Refresh:** this command removes node_modules directory and package-lock.json file, then re-installs new versions of dependencies. You can run it with 
    ``` sh 
      $ npm run refresh
    ```
  
- **Other commands:** ("ci:test", "ci:coverage", "ci:validate") these custom commands are used by [SFCI](https://searchdevci.dop.sfdc.net/job/searchdev/job/avocat/) when pushing new changes.

## Supported Contract Formats
| Format | Status |
| ------ | ------ |
| OpenAPI | In progress |
| RAML | Not supported |
| JSON | Not supported |
| XML  | Not supported |

## Authors
[SPEP Team](https://gus.lightning.force.com/lightning/r/ADM_Scrum_Team__c/a00B0000000wkIzIAI/view). Salesforce, Grenoble site


## Licence
TODO