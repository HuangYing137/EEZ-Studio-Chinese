/**
 * EEZ Studio 简体中文翻译运行时（独立原型）
 *
 * 设计约束：
 * - 不依赖 Electron、React 或浏览器 API，可供主进程和渲染进程共用。
 * - key 是稳定的内部消息 ID；fallback 是英文原文。
 * - 不改变调用方传入的动态数据，只替换明确声明的 {{参数名}} 占位符。
 * - 缺少中文条目时回退到英文原文，避免出现空白文案。
 */

export type TranslationParams = Record<string, string | number>;

const zhCN: Record<string, string> = {
    "menu.about": "关于 {{appName}}",
    "menu.services": "服务",
    "menu.hide": "隐藏 {{appName}}",
    "menu.hideOthers": "隐藏其他",
    "menu.showAll": "全部显示",
    "menu.quit": "退出",
    "menu.file": "文件",
    "menu.edit": "编辑",
    "menu.view": "视图",
    "menu.window": "窗口",
    "menu.help": "帮助",
    "menu.newProject": "新建项目…",
    "menu.addInstrument": "添加仪器…",
    "menu.newWindow": "新建窗口",
    "menu.open": "打开…",
    "menu.openRecent": "打开最近项目",
    "menu.reloadProject": "重新载入项目",
    "menu.loadDebugInfo": "载入调试信息…",
    "menu.saveDebugInfo": "保存调试信息…",
    "dialog.ok": "确定",
    "dialog.cancel": "取消",
    "dialog.yes": "是",
    "dialog.no": "否",
    "dialog.apply": "应用",
    "dialog.close": "关闭",
    "dialog.retry": "重试",
    "dialog.skip": "跳过",
    "fileFilter.eezProject": "EEZ 项目",
    "fileFilter.eezDashboard": "EEZ 仪表板",
    "fileFilter.debugInfo": "EEZ 调试信息",
    "fileFilter.allFiles": "所有文件",
    "error.fileNotExist": "文件不存在。",
    "error.fileNotExistDetail": "文件“{{filePath}}”似乎已不存在。",
    "validation.invalidValue": "值无效。",
    "validation.required": "请填写此字段。",
    "validation.rangeInclusive": "请输入介于 {{min}} 和 {{max}} 之间的值。",
    "validation.rangeInclusiveMin": "请输入大于或等于 {{min}} 的值。",
    "validation.rangeExclusive": "请输入大于 {{min}} 且小于 {{max}} 的值。",
    "validation.rangeExclusiveMin": "请输入大于 {{min}} 的值。",
    "validation.notUnique": "此字段的值必须唯一。",
    "validation.invalidCharacter": "不允许使用字符“{{char}}”。",
    "validation.invalidFileName": "文件名无效。",
    "common.loading": "正在加载…",
    "common.search": "搜索",
    "common.refresh": "刷新",
    "common.browse": "浏览…",
    "common.name": "名称",
    "common.description": "描述",
    "common.type": "类型",
    "common.value": "值",
    "common.enabled": "已启用",
    "common.disabled": "已禁用"
};

export function translate(
    id: string,
    fallback: string,
    params?: TranslationParams,
    locale: string = "zh-CN"
): string {
    const template =
        locale.toLowerCase() === "zh-cn" ? zhCN[id] || fallback : fallback;

    if (!params) {
        return template;
    }

    return template.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (match, name: string) => {
        const value = params[name];
        return value === undefined ? match : String(value);
    });
}

/** 返回当前已登记的简体中文消息 ID，供完整性检查工具使用。 */
export function getChineseMessageIds(): string[] {
    return Object.keys(zhCN).sort();
}
