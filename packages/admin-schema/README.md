# Database schema live-editor

View and edit the current database schema.

It reads schemas for each collection from `model/*` files, shows it in the admin panel as tables, lets you edit the columns (and add new ones) and saves changes back to the file system.

## Prerequisites

This is a plugin for [`@startupjs/admin`](../admin). Follow its readme instructions on how to install it.

## Installation

1. Install `eslint` and `eslint-plugin-startupjs` by running the following command:

    ```
    npx startupjs install --dev
    ```

2. Install `@startupjs/admin-schema`.

    When using `yarn`:

    ```
    yarn add @startupjs/admin-schema
    ```

## Usage

Got to the new `Schema` page from the admin panel [http://localhost:8081/admin](http://localhost:8081/admin)

View and edit the DB structure. Changes are getting saved in real time back to the file system.

After you have changed something, don't forget to commit your changes to Git.
