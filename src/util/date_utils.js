/**
 * 获取指定日期是星期几的数字表示（0-6，0 表示周日）
 * @param {string} dateStr - 日期字符串，格式为 'YYYY-MM-DD'，可选参数
 * @returns {number} 星期几的数字表示
 */
export function getDayOfWeek(dateStr) {
    let date;
    if (dateStr) {
        date = new Date(dateStr);
    } else {
        date = new Date();
    }
    return date.getDay();
}

/**
 * 获取指定日期是星期几的中文表示
 * @param {string} dateStr - 日期字符串，格式为 'YYYY-MM-DD'，可选参数
 * @returns {string} 星期几的中文表示
 */
export function getDayOfWeekCN(dateStr) {
    const dayOfWeek = getDayOfWeek(dateStr);
    const dayOfWeekCN = ['日', '一', '二', '三', '四', '五', '六'];
    return dayOfWeekCN[dayOfWeek];
}

