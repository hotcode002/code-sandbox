const config = {};

config.PORT = 8080;

config.isolate = {
    run: {
        env: "--env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        stdin: "--stdin=stdin.txt",
        stdout: "--stdout=stdout.txt",
        stderr_redirect: "--stderr-to-stdout",
        meta: "--meta=meta.txt",
        processes: "-p",
        run: "--run",
        dir: "--dir=/root/data",
    },
};

config.languages = {
    C: {
        "11.3.0": {
            name: "C",
            version: "11.3.0",
            /**
             * if "compile" is set to true, we don't directly run the code.
             * Instead, we follow the 2 step compile-run
             */
            compile: true,
            sourceFileName: "main.c",
            runFileName: "a.out",
            compileCommand: "/usr/bin/gcc main.c",
            runCommand: "./a.out",
        },
        default: "11.3.0",
    },
    CPP: {
        "11.3.0": {
            name: "C++",
            version: "11.3.0",
            compile: true,
            sourceFileName: "main.cpp",
            runFileName: "a.out",
            compileCommand: "/usr/bin/g++ main.cpp",
            runCommand: "./a.out",
        },
        default: "11.3.0",
    },
    JAVA: {
        "20.0.1": {
            name: "Java",
            version: "11.0.18",
            compile: true,
            sourceFileName: "Main.java",
            runFileName: "Main.class",
            compileCommand: "/usr/local/bin/javac Main.java",
            runCommand: "/usr/local/bin/java Main",
        },
        default: "20.0.1",
    },
    PYTHON: {
        "3.10.6": {
            name: "Python",
            version: "3.10.6",
            compile: false,
            sourceFileName: "main.py",
            runCommand: "/usr/bin/python3 main.py",
        },
        default: "3.10.6",
    },
    JAVASCRIPT: {
        "18.16.0": {
            name: "Python",
            version: "18.16.0",
            compile: false,
            sourceFileName: "main.js",
            runCommand: "/usr/local/node-18.16.0/bin/node main.js",
        },
        default: "18.16.0",
    },
};

export default config;
