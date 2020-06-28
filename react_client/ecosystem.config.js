module.exports = {
  apps: [{
    name: "ReactClient",
    script: "./node_modules/react-scripts/scripts/start.js",
    watch: true,
    increment_var: 'PORT',
    env: { "PORT": 3002, "NODE_ENV": "production" }
  }]
}