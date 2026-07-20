const XLSX = require('xlsx');
const FS = require('fs');
const PATH = require('path');

/* 导入目录 */
const IMPORT_DIR = PATH.join(__dirname, '..', '..', 'datas');
/* 导出目录 */
const EXPORT_DIR = PATH.join(__dirname, '..', '..', 'assets', 'Script', 'data', 'templates');

/* 表名 */
const REG_EXP_SHEET_NAME = /^[a-zA-Z][0-9a-zA-Z]*$/;
/* 整型单元格 */
const REG_EXP_INT = /^\s*\d+\s*$/;
/* 浮点型单元格 */
const REG_EXP_FLOAT = /^\s*\d+\.?\d*\s*$/;
/* 布尔型单元格 */
const REG_EXP_BOOLEAN = /^\s*([0-1])\s*$/;

/* 字段名行数 */
const FIELD_NAME_ROW = 2;
/* 字段类型行数 */
const FIELD_TYPE_ROW = 3;
/* 数据开始行数 */
const DATA_START_ROW = 4;
/* 数据开始列数 */
const DATA_START_COLUMN = 1;

// 遍历导表
console.log('> start export template datas...');
const startTime = Date.now();
const fileNameSet = new Set();
for (const filePath of listFiles(IMPORT_DIR)) {
    const workBook = XLSX.readFile(filePath);
    for (const sheetName of workBook.SheetNames) {
        console.log(`> exporting ${sheetName}...`);

        if (!REG_EXP_SHEET_NAME.test(sheetName)) {
            /* 无效表名 */
            throw new Error(`invalid sheet name "${sheetName}"`);
        }

        const sheet = workBook.Sheets[sheetName];
        const sheetRange = sheet['!ref'];
        if (!sheetRange || sheetRange.length <= 0) {
            /* 空表 */
            console.warn(`[WARN] sheet "${sheetName}" is empty`);
            continue;
        }

        const range = XLSX.utils.decode_range(sheetRange);
        if (range.s.r > FIELD_NAME_ROW || range.e.r < DATA_START_ROW || range.s.c > DATA_START_COLUMN || range.e.c < DATA_START_COLUMN) {
            /* 无效表 */
            console.warn(`[WARN] invalid sheet "${sheetName}"`);
            continue;
        }

        console.log(`export ${sheetName} from ${XLSX.utils.encode_col(range.s.c)}${XLSX.utils.encode_row(range.s.r)} to ${XLSX.utils.encode_col(range.e.c)}${XLSX.utils.encode_row(range.e.r)}`)

        let headers = collectHeaders(sheet, sheetName, range.e.c);
        if (!headers || headers.length <= 0) {
            /* 无效表头 */
            console.warn(`[WARN] headers of sheet "${sheetName}" not found`);
            continue;
        }

        const sheetData = [];
        for (let i = DATA_START_ROW; i <= range.e.r; ++i) {
            const itemKey = getFieldValue(sheet, sheetName, i, headers[0]);
            if (itemKey !== null && itemKey !== undefined) {
                let itemData = new Map();
                for (const header of headers) {
                    const fieldValue = getFieldValue(sheet, sheetName, i, header);
                    if (fieldValue !== null && fieldValue !== undefined) {
                        itemData.set(header.name, fieldValue);
                    } else {
                        header.optional = true;
                    }
                }
                sheetData.push({
                    key: itemKey,
                    data: itemData,
                });
            } else {
                console.log(`skip row at ${XLSX.utils.encode_row(i)} of sheet "${sheetName}"`);
            }
        }

        if (sheetData.length > 0) {
            fileNameSet.add(writeSheetDataToFile(sheetName, sheetData, headers));
        } else {
            console.warn(`[WARN] no data in sheet "${sheetName}"`);
        }
    }
}

// 删除冗余文件
console.log(`> start deleting redundant files...`)
const filePaths = listFiles(EXPORT_DIR);
for (const path of filePaths) {
    const extName = PATH.extname(path);
    if (extName === '.ts' || extName === '.meta') {
        const baseName = PATH.basename(path);
        if (!(fileNameSet.has(baseName) || fileNameSet.has(baseName.slice(0, -5)))) {
            console.log(`delete file "${path}"`);
            FS.rmSync(path);
        }
    }
}

// 导表完成
console.log(`$ export DONE: ${Date.now() - startTime} ms spent`);

/**
 * 深度遍历文件夹的所有文件
 * @param {string} dir 目标文件夹
 * @returns {string[]} 文件全路径列表
 */
function listFiles(dir) {
    let files = [];
    const contents = FS.readdirSync(dir);
    for (const name of contents) {
        const path = PATH.join(dir, name)
        const stat = FS.lstatSync(path);
        if (stat.isFile()) {
            files.push(path);
        } else if (stat.isDirectory()) {
            files = files.concat(listFiles(path));
        }
    }
    return files;
}

/**
 * 收集表头信息
 * @param {XLSX.WorkSheet} sheet 表格
 * @param {string} sheetName 表格名
 * @param {number} endColumn 结束列数
 * @returns {object} 表头信息
 */
function collectHeaders(sheet, sheetName, endColumn) {
    const headers = [];
    for (let i = DATA_START_COLUMN; i <= endColumn; ++i) {
        const fieldNameAddress = XLSX.utils.encode_cell({r: FIELD_NAME_ROW, c: i})
        const fieldTypeAddress = XLSX.utils.encode_cell({r: FIELD_TYPE_ROW, c: i})
        const fieldNameCell = sheet[fieldNameAddress];
        const fieldTypeCell = sheet[fieldTypeAddress];
        if (isValidCellObject(fieldNameCell) && isValidCellObject(fieldTypeCell)
                && !(fieldNameCell.v instanceof Date || fieldTypeCell.v instanceof Date)) {
            const typeDesc = fieldTypeCell.v.toString().trim();
            const typeHandler = getTypeHandler(typeDesc);
            if (typeHandler) {
                headers.push({
                    column: i,
                    name: fieldNameCell.v.toString(),
                    type: typeDesc.replace(/int|float/, 'number'),
                    handler: typeHandler,
                })
            } else {
                throw new Error(`invalid field type declaration at ${fieldTypeAddress} of sheet "${sheetName}"`)
            }
        } else {
            throw new Error(`invalid header at column ${XLSX.utils.encode_col(i)} of sheet "${sheetName}"`);
        }
    }
    return headers;
}

/**
 * 获取指定行指定字段的字段值
 * @param {XLSX.WorkSheet} sheet 指定表格
 * @param {string} sheetName 表格名
 * @param {number} row 指定行数
 * @param {object} header 指定字段的表头
 * @returns {number | string | boolean | number[] | string[] | boolean[] | undefined} 字段值
 */
function getFieldValue(sheet, sheetName, row, header) {
    const address = XLSX.utils.encode_cell({r: row, c: header.column});
    const cell = sheet[address];
    if (isValidCellObject(cell)) {
        const fieldValue = header.handler(cell.v.toString());
        if (fieldValue !== null && fieldValue !== undefined) {
            return fieldValue;
        } else {
            /* 无效数据 */
            throw new Error(`invalid cell at ${address} of sheet "${sheetName}"`);
        }
    }
}

/**
 * 将表格数据写入文件
 * @param {string} sheetName 表名
 * @param {object} sheetData 已序列化的表格数据
 * @param {object} headers 表头信息
 * @return {string} 文件名
 */
function writeSheetDataToFile(sheetName, sheetData, headers) {
    const capitalization = `${sheetName.slice(0, 1).toUpperCase()}${sheetName.slice(1)}`;
    const uncapitalize = `${sheetName.slice(0, 1).toLowerCase()}${sheetName.slice(1)}`;
    const dash = uncapitalize.replaceAll(/[A-Z]/g, char => `-${char.toLowerCase()}`)
        .replaceAll(/\d+/g, numbers => `-${numbers}`)
        .replaceAll(/(?<=\d)[a-z]/g, char => `-${char}`);

    const rowDataStrArray = []
    for (const rowData of sheetData) {
        rowDataStrArray.push(`        ${rowData.key}: {`);
        for (const [fieldName, fieldValue] of rowData.data) {
            rowDataStrArray.push(`            ${fieldName}: ${fieldValue},`);
        }
        rowDataStrArray.push('        },');
    }

    const interfaceStrArray = [];
    for (const header of headers) {
        interfaceStrArray.push(`        ${header.name}${header.optional ? '?' : ''}: ${header.type},`);
    }

    const keyName = headers[0].name;
    const keyType = headers[0].type;

    const fileStr = `/*
 * auto-generated by script, DO NOT modify this file manually
 */
export namespace ${capitalization}Template {

    export interface I${capitalization}Data {
${interfaceStrArray.join('\n')}
    };

    let _size: number | null = null;

    let _datas: { [key: ${keyType}]: I${capitalization}Data } = {
${rowDataStrArray.join('\n')}
    };

    /**
     * 查询
     * @param ${keyName}Key 数据项的 key
     * @returns 只读的数据项（可能为空）
     */
    export function query(${keyName}Key: ${keyType}): Readonly<I${capitalization}Data> | null {
        return _datas[${keyName}Key] ?? null;
    }

    /**
     * 获取数据项列表
     * @returns 只读的数据项列表
     */
    export function datas(): Readonly<{ [key: ${keyType}]: Readonly<I${capitalization}Data> }> {
        return _datas;
    }

    /**
     * 获取数据项数量
     * @returns 数据项数量
     */
    export function size(): number {
        if (!_size) {
            _size = 0;
            for (const _ in _datas) {
                ++_size;
            }
        }
        return _size;
    }

}
`;

    const fileName = `${dash}-data.ts`;
    FS.writeFileSync(PATH.join(EXPORT_DIR, fileName), fileStr);
    return fileName;
}

/**
 * 判断单元格有效性
 * @param {XLSX.CellObject} object 单元格
 * @returns {boolean} 判断结果
 */
function isValidCellObject(object) {
    if (object && object.t !== undefined && object.v !== undefined) {
        return true;
    }
    return false;
}

/**
 * 解析整型
 * @param {string} value 待解析值
 * @returns {number | undefined} 解析结果
 */
function parseInt(value) {
    if (REG_EXP_INT.test(value)) {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }
}

/**
 * 解析浮点型
 * @param {string} value 待解析值
 * @returns {number | undefined} 解析结果
 */
function parseFloat(value) {
    if (REG_EXP_FLOAT.test(value)) {
        const parsed = Number.parseFloat(value);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }
}

/**
 * 解析字符串
 * @param {string} value 待解析值
 * @returns {string} 解析结果
 */
function parseString(value) {
    return `'${value.replace('\\', '\\\\').replace('\'', '\\\'')}'`;
}

/**
 * 解析布尔型
 * @param {string} value 待解析值
 * @returns {boolean | undefined} 解析结果
 */
function parseBoolean(value) {
    const result = value.match(REG_EXP_BOOLEAN);
    if (result) {
        switch (result[1].toString()) {
            case '0':
                return false;
            case '1':
                return true;
        }
    }
}

/**
 * 解析整型数组
 * @param {string} value 待解析值
 * @returns {number[] | undefined} 解析结果
 */
function parseIntArray(value) {
    return parseArray(value, parseInt);
}

/**
 * 解析浮点型数组
 * @param {string} value 待解析值
 * @returns {number[] | undefined} 解析结果
 */
function parseFloatArray(value) {
    return parseArray(value, parseFloat);
}

/**
 * 解析字符串数组
 * @param {string} value 待解析值
 * @returns {string[] | undefined} 解析结果
 */
function parseStringArray(value) {
    return parseArray(value, parseString);
}

/**
 * 解析布尔型数组
 * @param {string} value 待解析值
 * @returns {number[] | undefined} 解析结果
 */
function parseBooleanArray(value) {
    return parseArray(value, parseBoolean);
}

/**
 * 解析数组
 * @param {string} value 待解析值
 * @param {Function} func 类型解析函数
 * @returns {Array | undefined} 解析结果
 */
function parseArray(value, func) {
    const array = value.split('|');
    if (array.length > 0) {
        const parsedArray = [];
        for (const element of array) {
            const parsed = func(element);
            if (parsed !== null && parsed !== undefined) {
                parsedArray.push(parsed);
            } else {
                return;
            }
        }
        if (parsedArray.length > 0) {
            return `[${parsedArray.join(',')}]`;
        }
    }
}

/**
 * 获取类型解析函数
 * @param {string} typeDesc 类型描述
 * @returns {Function | undefined} 类型解析函数
 */
function getTypeHandler(typeDesc) {
    switch (typeDesc) {
        case 'int':
            return parseInt;
        case 'float':
            return parseFloat;
        case 'string':
            return parseString;
        case 'boolean':
            return parseBoolean;
        case 'int[]':
            return parseIntArray;
        case 'float[]':
            return parseFloatArray;
        case 'string[]':
            return parseStringArray;
        case 'boolean[]':
            return parseBooleanArray;
    }
}
