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
      script: 'npx',
      args: 'vite',
      cwd: '/home/yarnb/lithless/demo',
      env: {
        NODE_ENV: 'development'
      },
      log_file: './logs/demo.log',
      out_file: './logs/demo-out.log',
      error_file: './logs/demo-error.log',
      merge_logs: true,
      time: true,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      watch: false
    }
  ]
};