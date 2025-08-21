const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch'); // 新增依赖

const app = express();
const PORT = 3000;

// ================= 配置项 =================
const CONFIG = {
  // SiliconFlow API 配置
  SF_API_ENDPOINT: 'https://api.siliconflow.cn/v1/chat/completions',
  API_KEY: 'sk-pefnssfzppcdesemjbmmypfyaybimotxwisnxzibbepuxpcw',
  DEFAULT_MODEL: 'Qwen/Qwen2.5-7B-Instruct',
  
  // 默认参数配置
  DEFAULT_PARAMS: {
    stream: false,
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    frequency_penalty: 0.5,
    n: 1,
    response_format: { type: "text" },
    tools: [{
      type: "function",
      function: {
        description: "default function",
        name: "default_tool",
        parameters: {},
        strict: false
      }
    }]
  }
};

// ================= 中间件配置 =================
app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());

// ================= 路由配置 =================

// 根路由
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// 图片服务路由
const ROOT_DIR = path.join(__dirname, 'photo', 'public');

// 警告：未进行路径穿越攻击防护，请确保所有请求路径都是安全的！
const getFilePath = (userPath) => {
  return path.join(ROOT_DIR, userPath);
};

app.get('/api/images/:path(*)?', async (req, res) => {
  try {
    // 获取请求路径，默认为根目录
    const userPath = req.params.path || '';
    const targetPath = getFilePath(userPath);
    // 检查路径是否存在
    const stats = await fs.promises.stat(targetPath);
    if (stats.isDirectory()) {
      // 如果是目录，返回目录中的文件列表
      const files = await fs.promises.readdir(targetPath, { withFileTypes: true });
      const fileList = files.map((file) => ({
        name: file.name,
        path: path.join(userPath, file.name), // 提供相对路径
        type: file.isDirectory() ? 'directory' : 'file'
      }));
      res.json(fileList);
    } else if (stats.isFile()) {
      // 如果是文件，直接返回文件内容
      res.setHeader('Content-Type', 'image/jpeg'); // 假设所有文件都是图片
      const stream = fs.createReadStream(targetPath);
      stream.pipe(res);
    } else {
      // 如果路径既不是文件也不是目录，返回错误
      res.status(400).json({ error: '无效的路径' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(404).json({ error: '路径不存在' });
  }
});


// ================= 新版AI聊天路由 =================
app.post('/api/chat', async (req, res) => {
  try {
    // 验证请求数据
    if (!req.body?.messages) {
      return res.status(400).json({ error: "缺少messages参数" });
    }

    // 构建请求参数
    const requestBody = {
      ...CONFIG.DEFAULT_PARAMS,
      model: req.body.model || CONFIG.DEFAULT_MODEL,
      messages: req.body.messages,
      stop: req.body.stop || null,
      temperature: req.body.temperature ?? CONFIG.DEFAULT_PARAMS.temperature,
    };

    // 调用硅流API
    const response = await fetch(CONFIG.SF_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // 处理响应
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    
    // 返回标准化响应
    res.json({
      success: true,
      reply: responseData.choices[0].message.content,
      usage: responseData.usage,
      full_response: responseData // 可选，调试用
    });

  } catch (error) {
    console.error('[AI服务错误]', error);
    res.status(500).json({
      success: false,
      error: error.message || 'AI服务暂时不可用'
    });
  }
});

// ================= 安全增强 =================
// 安装依赖：npm install express-rate-limit
const rateLimit = require('express-rate-limit');
app.use('/api/chat', rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限流100次
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "请求过于频繁，请稍后再试" }
}));

// ================= 启动服务 =================
app.listen(PORT, () => {
  console.log(`服务已启动：
  - 前端地址: http://localhost:${PORT}`);
});