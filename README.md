# @wish/fe-cli

init front-end project tool

## Install wnpm if you don't have

Install nrm to management npm registries.

```
npm i nrm -g
```

2、Use nrm add wish's registry wnpm. Switch to wnpm and login in it.

```
nrm add wnpm https://npm.infra.wish-cn.com
nrm use wnpm
nrm login     - please add user if you don't have it.
```

## Install global cli tool: @wish-fe-cli

```bash
npm install @wish/fe-cli -g
```

# Use cli tool to init project

```bash
wfe-cli  create <projectName>
```
