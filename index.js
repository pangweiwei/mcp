import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HttpServerTransport } from "@modelcontextprotocol/sdk/server/http.js";
import { z } from "zod";
// 创建一个 MCP 服务器
const server = new McpServer({
    name: "Demo",
    version: "1.0.0"
});
// 提供一个工具，实现 a + b 两数相加的简单功能
server.tool("add",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }]
    })
);
// 提供一个数据源，用于获取用户信息
server.resource(
    "user-profile",
    new ResourceTemplate("users://{userId}/profile", { list: undefined }),
    async (uri, { userId }) => ({
        contents: [{
            uri: uri.href,
            text: `Profile data for user ${userId}`
        }]
    })
);
// 提供一个提示词模版指令，用于 review 代码
server.prompt(
    "review-code",
    { code: z.string() },
    ({ code }) => ({
        messages: [{
            role: "user",
            content: {
                type: "text",
                text: `Please review this code:\n\n${code}`
            }
        }]
    })
);
// 开始通过标准指令接收和发送消息
const transport = new StdioServerTransport();
await server.connect(transport);