# FileInput component

## Env variables

- DEFAULT_STORAGE_TYPE. If not set, then GridFS is used when main DB in startup.js is Mongo, and SQLite, when main DB is SQLite. Possible values are:
    - mongo
    - sqlite
    - azureblob. If specified, then AZURE_BLOB_STORAGE_CONNECTION_STRING to Azure Blob Storage must be specified.

- AZURE_BLOB_STORAGE_CONNECTION_STRING. Connection string to Azure Blob Storage.
