module.exports = {


  friendlyName: 'Add app setup',


  description: 'Add an app setup for an account.',


  extendedDescription: '',


  inputs: {

    apiToken: {
      example: 'abc12421-1234-abdc-5343-ae4adf123fea4',
      description: "Your Heroku API token",
      whereToGet: {
        url: "https://devcenter.heroku.com/articles/authentication#authenticating-with-the-api-token",
        description: "Copy the API key from your Heroku dashboard on the \"Manage Account\" page."
      },
      required: true
    },

    sourceUrl: {
      example: "https://example.com/source.tgz?token=xyz",
      description: "URL of gzipped tarball of source code containing app.json manifest file",
      required: true
    },

    environment: {
      typeclass: "dictionary",
      description: "Environment variable overrides to use in setting up the app."
    },

    name: {
      example: "My awesome app",
      description: "Unique name for the app."
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
    },

  },


  fn: function (inputs,exits) {

    // Require the Http pack so we can make requests
    var Http = require('machinepack-http');

    // Set the URL to get the source tarball from
    var params = {
      source_blob: {
        url: inputs.sourceUrl
      }
    };

    // Set the app name if provided
    if (inputs.name) {
      params.app = {
        name: inputs.name
      };
    }

    // Set the env overrides if provided
    if (inputs.environment) {
      params.overrides = {
        env: inputs.environment
      };
    }

    // Send an HTTP request and receive the response.
    Http.sendHttpRequest({
      url: 'app-setups',
      baseUrl: 'https://api.heroku.com/',
      method: 'post',
      params: params,
      headers: {
        Accept: 'application/vnd.heroku+json; version=3',
        Authorization: 'Bearer ' + inputs.apiToken
      },
    }).exec({
      success: function(result) {
        return exits.success(result);
      },
      // An unexpected error occurred.
      error: exits.error,
      // 404 status code returned from server
      notFound: exits.error,
      // 400 status code returned from server
      badRequest: exits.error,
      // 403 status code returned from server
      forbidden: exits.error,
      // 401 status code returned from server
      unauthorized: exits.error,
      // 5xx status code returned from server (this usually means something went wrong on the other end)
      serverError: exits.error,
      // Unexpected connection error: could not send or receive HTTP request.
      requestFailed: exits.error
    });
  },



};
