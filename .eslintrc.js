module.exports = {
    "env": {
        "browser": true,
        "es2021": true,

        "amd": true,
        "node": true
    },
    "extends": ["airbnb-base","prettier",
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {"no-underscore-dangle":["error",{"allow":["_id"]}]
    }

}
