// 安装依赖：npm install openai readline-sync

import OpenAI from "openai";
import readlineSync from "readline-sync";

// 配置项
const CONFIG = {
  BASE_URL: 'https://api.deepseek.com',
  API_KEY: 'sk-e2fb7e0a6e024fedbad012126a32ebe3', // 请替换为您自己的API密钥
  MODEL: 'deepseek-chat',
  SYSTEM_PROMPT: "你是一个智能助手，母语是中文。请用中文回答所有问题。",
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1000
};

// 初始化客户端
const openai = new OpenAI({
  baseURL: CONFIG.BASE_URL,
  apiKey: CONFIG.API_KEY
});

// 创建对话历史
let conversationHistory = [{
  role: "system",
  content: CONFIG.SYSTEM_PROMPT
}];

// 带颜色输出的工具函数
const coloredLog = (text, colorCode) => 
  console.log(`\x1b[${colorCode}m${text}\x1b[0m`);

async function main() {
  coloredLog("DeepSeek 智能助手已启动（输入 'exit' 退出）", 36); // 青色

  while (true) {
    try {
      const userInput = readlineSync.question("You: ");
      
      // 退出检测
      if (userInput.toLowerCase() === 'exit') {
        coloredLog("对话已结束，感谢使用！", 33); // 黄色
        break;
      }

      // 添加用户消息到历史
      conversationHistory.push({
        role: "user",
        content: userInput
      });

      // API调用
      const completion = await openai.chat.completions.create({
        messages: conversationHistory,
        model: CONFIG.MODEL,
        temperature: CONFIG.TEMPERATURE,
        max_tokens: CONFIG.MAX_TOKENS
      });

      // 获取助手回复
      const assistantReply = completion.choices[0].message.content;
      
      // 添加助手回复到历史
      conversationHistory.push({
        role: "assistant",
        content: assistantReply
      });

      // 格式化输出
      coloredLog("\n助手:", 32); // 绿色
      console.log(assistantReply);
      
      // 显示元数据
      coloredLog(
        `\n[本次消耗 Token 数：${completion.usage?.total_tokens || '未知'}]`,
        90
      ); // 灰色
      console.log("------------------------------");
      
    } catch (error) {
      console.error("\n发生错误：");
      console.error(error.message);
      coloredLog("正在尝试重新连接...", 31); // 红色
    }
  }
}

// 启动程序
main().catch(error => {
  console.error("致命错误：", error);
  process.exit(1);
});