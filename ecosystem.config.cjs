module.exports = {
  apps: [
    {
      name: 'diagramai',
      script: 'npm',
      args: 'start',
      cwd: '/root/Diagram/DiagramAI',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      // 环境变量
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // 日志配置
      error_file: '/root/Diagram/DiagramAI/logs/pm2-error.log',
      out_file: '/root/Diagram/DiagramAI/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // 进程管理优化
      min_uptime: '10s',              // 最小运行时间，避免频繁重启
      max_restarts: 10,               // 最大重启次数
      restart_delay: 4000,            // 重启延迟 (毫秒)

      // 崩溃后自动重启
      exp_backoff_restart_delay: 100, // 指数退避重启延迟

      // 优雅关闭
      kill_timeout: 5000,             // 强制关闭前等待时间
      wait_ready: true,               // 等待应用 ready 信号
      listen_timeout: 10000,          // 等待端口监听超时

      // 性能优化
      instance_var: 'INSTANCE_ID',    // 实例 ID 环境变量

      // 时间相关
      cron_restart: '0 4 * * *',      // 每天凌晨 4 点自动重启 (可选)
    },
  ],
};
