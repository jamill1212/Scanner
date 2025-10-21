// craco.config.js
const path = require("path");
require("dotenv").config();

const isTrue = (v) => String(v).toLowerCase() === "true";

// Environment variable overrides
const config = {
  disableHotReload: isTrue(process.env.DISABLE_HOT_RELOAD),
  enableVisualEdits: isTrue(process.env.REACT_APP_ENABLE_VISUAL_EDITS),
  enableHealthCheck: isTrue(process.env.ENABLE_HEALTH_CHECK),
};

// Conditionally load visual editing modules only if enabled (guard with try/catch)
let babelMetadataPlugin;
let setupDevServer;
if (config.enableVisualEdits) {
  try {
    babelMetadataPlugin = require("./plugins/visual-edits/babel-metadata-plugin");
    setupDevServer = require("./plugins/visual-edits/dev-server-setup");
  } catch (err) {
    // optional: console.warn("Visual edits plugins not found, skipping:", err);
    babelMetadataPlugin = undefined;
    setupDevServer = undefined;
  }
}

// Conditionally load health check modules only if enabled (guard with try/catch)
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;
if (config.enableHealthCheck) {
  try {
    WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
    setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
    if (typeof WebpackHealthPlugin === "function") {
      healthPluginInstance = new WebpackHealthPlugin();
    }
  } catch (err) {
    // optional: console.warn("Health-check plugins not found, skipping:", err);
    WebpackHealthPlugin = undefined;
    setupHealthEndpoints = undefined;
    healthPluginInstance = undefined;
  }
}

const webpackConfig = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (cfg = {}) => {
      // Ensure plugins array exists
      cfg.plugins = Array.isArray(cfg.plugins) ? cfg.plugins : [];

      // Disable hot reload completely if environment variable is set
      if (config.disableHotReload) {
        // Remove hot reload related plugins (safe checks)
        cfg.plugins = cfg.plugins.filter((plugin) => {
          return !(plugin && plugin.constructor && plugin.constructor.name === "HotModuleReplacementPlugin");
        });

        // Disable watch mode
        cfg.watch = false;
        cfg.watchOptions = {
          ignored: /.*/, // Ignore all files
        };
      } else {
        // Add ignored patterns to reduce watched directories (preserve existing watchOptions)
        cfg.watchOptions = {
          ...(cfg.watchOptions || {}),
          ignored: [
            "**/node_modules/**",
            "**/.git/**",
            "**/build/**",
            "**/dist/**",
            "**/coverage/**",
            "**/public/**",
          ],
        };
      }

      // Add health check plugin to webpack if enabled
      if (config.enableHealthCheck && healthPluginInstance) {
        cfg.plugins.push(healthPluginInstance);
      }

      return cfg;
    },
  },
};

// Only add babel plugin if visual editing is enabled and plugin loaded
if (config.enableVisualEdits && babelMetadataPlugin) {
  webpackConfig.babel = {
    plugins: [babelMetadataPlugin],
  };
}

// Setup dev server with visual edits and/or health check
if (config.enableVisualEdits || config.enableHealthCheck) {
  webpackConfig.devServer = (devServerConfig = {}) => {
    let cfg = devServerConfig;

    // Apply visual edits dev server setup if enabled
    if (config.enableVisualEdits && typeof setupDevServer === "function") {
      try {
        cfg = setupDevServer(cfg) || cfg;
      } catch (err) {
        // optional: console.warn("setupDevServer failed:", err);
      }
    }

    // Add health check endpoints if enabled
    if (config.enableHealthCheck && typeof setupHealthEndpoints === "function" && healthPluginInstance) {
      const originalSetupMiddlewares = cfg.setupMiddlewares;

      cfg.setupMiddlewares = (middlewares = [], devServer) => {
        // Call original setup if exists (safely)
        if (typeof originalSetupMiddlewares === "function") {
          try {
            middlewares = originalSetupMiddlewares(middlewares, devServer) || middlewares;
          } catch (err) {
            // optional: console.warn("original setupMiddlewares failed:", err);
          }
        }

        try {
          setupHealthEndpoints(devServer, healthPluginInstance);
        } catch (err) {
          // optional: console.warn("setupHealthEndpoints failed:", err);
        }

        return middlewares;
      };
    }

 
