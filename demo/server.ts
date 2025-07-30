import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3006;

// 设置项目根目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// 静态文件服务
app.use('/dist', express.static(path.join(projectRoot, 'dist')));
app.use('/demo', express.static(path.join(projectRoot, 'demo')));

// 主页面路由
app.get('/', (req, res) => {
  res.redirect('/demo/');
});

app.get('/demo/', (req, res) => {
  res.sendFile(path.join(projectRoot, 'demo', 'index.html'));
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Demo server running at http://localhost:${port}`);
  console.log(`Demo page: http://localhost:${port}/demo/`);
  console.log(`Health check: http://localhost:${port}/health`);
});
