import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resourcePath = path.join(root, "localization", "zh-CN.json");

function fail(message) {
    console.error(`[本地化资源检查失败] ${message}`);
    process.exitCode = 1;
}

let resource;
try {
    resource = JSON.parse(fs.readFileSync(resourcePath, "utf8"));
} catch (error) {
    fail(`无法解析 zh-CN.json：${error.message}`);
    process.exit();
}

if (resource.locale !== "zh-CN") {
    fail(`locale 应为 zh-CN，实际为 ${String(resource.locale)}`);
}
if (resource.languageName !== "简体中文") {
    fail("languageName 应为“简体中文”。");
}
if (!resource.messages || typeof resource.messages !== "object" || Array.isArray(resource.messages)) {
    fail("messages 必须是消息 ID 到文本的对象。");
    process.exit();
}

const entries = Object.entries(resource.messages);
const placeholderPattern = /{{([A-Za-z0-9_]+)}}/g;

for (const [id, message] of entries) {
    if (!id.trim()) {
        fail("发现空消息 ID。");
    }
    if (typeof message !== "string" || !message.trim()) {
        fail(`消息“${id}”必须是非空字符串。`);
        continue;
    }

    const placeholders = [...message.matchAll(placeholderPattern)].map(match => match[1]);
    const withoutValidPlaceholders = message.replace(placeholderPattern, "");
    if (/[{}]/.test(withoutValidPlaceholders)) {
        fail(`消息“${id}”包含格式错误的占位符。`);
    }
    if (new Set(placeholders).size !== placeholders.length) {
        fail(`消息“${id}”重复声明了同名占位符。`);
    }
}

if (entries.length === 0) {
    fail("翻译资源为空。");
}

if (process.exitCode) {
    process.exit(process.exitCode);
}

console.log(`[本地化资源检查通过] 已检查 ${entries.length} 条简体中文消息。`);
