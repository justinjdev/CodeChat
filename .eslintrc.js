module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended", "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "modules": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react", "node"
    ],
    "extends": [
        "eslint:recommended", "plugin:node/recommended"
    ],

    "rules": {
        "indent": [
            "error", 4
        ],
        "linebreak-style": [
            "error", "unix"
        ],
        "quotes": [
            "error", "double"
        ],
        "semi": ["error", "never"]
    },
    "rules": {
        "no-console": 0,
        "disallowMultipleVarDecl": 0,
        "maximumLineLength": 0
    }
}
