# Script-Runner

**Script-Runner** is a tool for running **.SQL** script files into multiple **Oracle Databases** in chain by issuing multiple **SQLPLUS** instances for each Connection List file.

## Installation

Use the package manager [npm](https://www.npmjs.com/package/download) to install **Script-Runner**.

On the project folder run

```bash
npm install
npm run build
```

## Configuration

### ./config Folder

This folder must contain one or more **[config].json** files with the Database Connection Parameters, on the following pattern:

```json
{
  "Connection 1": {
    "user": "user1",
    "pass": "pass1",
    "dbConn": "host:port/service_name"
  },
  "Connection 2": {
    "user": "user2",
    "pass": "pass2",
    "dbConn": "host:port:sid"
  }
}
```

### ./scripts Folder

This folder must contain a single subfolder for each **[config].json** config file created.

Each folder should have all **.SQL** scripts which should be processed on the configured Databases.

```bash
.
├── ...
├── config                  # Connections Config Folder
│   ├── config1.json        # Database Configuration List 1
│   ├── config2.json        # Database Configuration List 2
├── scripts                 # Script Files Folder
│   ├── config1             # Scripts for Database Configuration List 1
│   │   ├── script1.sql     # SQL script
│   ├── config2             # Scripts for Database Configuration List 2
│   │   ├── script2.sql     # SQL script
│   │   ├── script3.sql     # SQL script
└── ...
```

## Execution

```bash
npm start
```

### Processing Chain

After running the Execution Command, a new folder with the current timestamp is created under the path **./exec**.

On this folder is stored a backup of all configs and scripts and also the execution logs.

### Monitoring Execution

Each **[config].json** file generates an **executing-[config]** file under the path **./exec/[timestamp]**, to indicate the execution isn't finished yet

This file is deleted only after the whole **[config]** processing is finished.

### Logging

Each **[config].json** file generates a **[config].log** file under the path **./exec/[timestamp]**.
