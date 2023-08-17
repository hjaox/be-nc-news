# Northcoders News API

The purpose of this repository is learn how to build an API for accessing application data programmatically. The intention is to mimic the building of a real world backend services which should provide information to the front end architecture.

https://nc-news-ee7w.onrender.com/api

SOURCE CODE:
    To make a local copy of the repository:
        -On your terminal, go to your desired folder to make a copy of the repository and type `git clone https://github.com/hjaox/be-nc-news.git`. This will make a clone of the repository.

    Requirements:
        Certain dependencies and devDependencies must be installed to be able to run the the code smoothly.

        -type `npm i` to install modules listed in package.json. It includes:
            dependencies:
                "dotenv": "^16.0.0",
                "express": "^4.18.2",
                "pg": "^8.7.3",
                "pg-format": "^1.0.4"
            devDependencies (for testing purposes)
                "jest": "^27.5.1",
                "jest-extended": "^2.0.0",
                "jest-sorted": "^1.0.14",
                "supertest": "^6.3.3"

        Minimum requirements:
            development environment:
                node: >=12.0.0
                psql: >=14.7
            testing environment:
                node: >=18.0.0
                psql: >=14.7

    Scripts:
        On your terminal:
            Type `npm run setup-dbs`
                -to setup your database
                    *Note: psql is needed for database.
            Type `npm run seed`
                -to seed your development data into your database.
            Type `npm test`
                -to run your tests in app.test.js
                
    To access the database:
        -In a testing environment
            -create a file `.env.test` in the root folder and write `PGDATABASE=nc_news_test`
        -In a development environment
            -create a file `.env.development` in the root folder and write `PGDATABASE=nc_news`