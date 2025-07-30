module.exports = {
  apps: [
    {
      name: 'lithless-storybook',
      script: 'npm',
      args: 'run storybook',
      cwd: '/home/yarnb/lithless',
      env: {
        NODE_ENV: 'development'
      },
      log_file: './logs/storybook.log',
      out_file: './logs/storybook-out.log',
      error_file: './logs/storybook-error.log',
      merge_logs: true,
      time: true,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s'
    },
    {
      name: 'lithless-demo',
      script: 'http-server',
      args: 'demo -p 3006 -c-1',
      cwd: '/home/yarnb/lithless',
      env: {
        NODE_ENV: 'production'
      },
      log_file: './logs/demo.log',
      out_file: './logs/demo-out.log',
      error_file: './logs/demo-error.log',
      merge_logs: true,
      time: true,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '5s',
      watch: false
    }
  ]
};