export default ({ env }) => ({
  // Upload provider set to "local" - new uploads will be stored locally
  // Existing Cloudinary URLs will continue working during transition
  upload: {
    config: {
      provider: "local",
      sizeLimit: env.int("MAX_FILE_SIZE", 200 * 1024 * 1024), // 200MB default, configurable via env
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
