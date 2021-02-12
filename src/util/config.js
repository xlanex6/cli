const fs = require("fs");
const util = require("util");
const exists = util.promisify(fs.exists);
const unlink = util.promisify(fs.unlink);
const path = require("path");
const { homedir } = require("os");
const writeJSON = require("write-json-file");
const loadJSON = require("load-json-file");

const NHOST_DIR = path.join(homedir(), ".nhost");
const authPath = path.join(NHOST_DIR, "auth.json");

let configData = `# hasura configuration for the CLI
version: 2
metadata_directory: metadata

# hasura configuration for the project
hasura_graphql_version: {{ hasura_gqe_version }}.cli-migrations-v2
hasura_graphql_port: 8080
hasura_graphql_admin_secret: 123456

# hasura backend plus configuration
hasura_backend_plus_version: {{ backend_version }}
hasura_backend_plus_port: 9001

# postgres configuration
postgres_version: {{ postgres_version }}
postgres_port: 5432
postgres_user: postgres
postgres_password: postgres

# minio
minio_port: 9000

# api
api_port: 4000

# custom environment variables for Hasura GraphQL engine: webhooks, headers, etc
env_file: ../.env.development

# OAuth services
provider_success_redirect: http://localhost:3000
provider_failure_redirect: http://localhost:3000/login-fail

google_enable: false
google_client_id:
google_secret_id:

github_enable: false
github_client_id:
github_secret_id:

facebook_enable: false
facebook_client_id:
facebook_secret_id:

linkedin_enable: false
linkedin_client_id:
linkedin_client_secret:
`;

async function writeAuthFile(data) {
  try {
    return writeJSON.sync(authPath, data, {
      indent: 2,
      mode: 0o600,
    });
  } catch (err) {
    throw err;
  }
}

async function deleteAuthFile() {
  try {
    await unlink(authPath);
  } catch (err) {
    throw err;
  }
}

function readAuthFile() {
  return loadJSON.sync(authPath);
}

async function authFileExists() {
  return await exists(authPath);
}

function getCustomApiEndpoint() {
  return "https://customapi.nhost.io";
}

function getNhostConfigTemplate() {
  return configData;
}

module.exports = {
  writeAuthFile,
  readAuthFile,
  authFileExists,
  getCustomApiEndpoint,
  getNhostConfigTemplate,
  deleteAuthFile,
};
