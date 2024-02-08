[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Azure Devops - Pipelines

## Build et publish sur un feed npm privé

<details>
  <summary>Code yaml de la pipeline</summary>

ps : Dans cet exemple, on réalise l'étape de build via yarn, il suffit de remplacer les commandes yarn par npm si besoin

````yaml
trigger:
  - master
  - develop
  - main

pr:
  - "*"

pool:
  vmImage: "windows-latest"

variables:
  buildConfiguration: "Release"

jobs:
  - job: Install_Yarn
    steps:
      - task: Bash@3
        displayName: "Yarn installation"
        inputs:
          targetType: inline
          script: |
            echo "Install yarn"
            npm install -g yarn

      - task: Bash@3
        displayName: "Update Yarn version to 2.x"
        inputs:
          targetType: inline
          script: |
            yarn set version berry

      - task: Bash@3
        displayName: "Yarn version after update"
        inputs:
          targetType: inline
          script: |
            echo "Yarn version after update:"
            yarn --version

      - task: Bash@3
        displayName: "yarn install"
        inputs:
          targetType: inline
          script: |
            yarn

      - task: Bash@3
        displayName: "yarn build <ANGULAR_LIB_NAME>"
        inputs:
          targetType: inline
          script: |
            yarn ng build <ANGULAR_LIB_NAME>

      - task: Npm@1
        displayName: "npm publish"
        inputs:
          command: publish
          workingDir: "$(System.DefaultWorkingDirectory)/dist/<ANGULAR_LIB_NAME>"
          verbose: false
          publishRegistry: useFeed
          publishFeed: "<YOUR_NPM_FEED_GUID>"

````

</details>
