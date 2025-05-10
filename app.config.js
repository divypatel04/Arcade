module.exports = ({ config }) => {
  return {
    ...config,
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "your-organization",
            project: "arcade",
            authToken: process.env.SENTRY_AUTH_TOKEN
          }
        }
      ]
    },
    plugins: [
      // Add any required plugins here
    ],
    android: {
      ...config.android,
      intentFilters: [
        {
          action: "android.intent.action.VIEW",
          category: ["android.intent.category.DEFAULT", "android.intent.category.BROWSABLE"],
          data: [
            {
              scheme: "https",
              host: "yourdomain.com",
              pathPrefix: "/app"
            }
          ]
        }
      ]
    }
  };
};
