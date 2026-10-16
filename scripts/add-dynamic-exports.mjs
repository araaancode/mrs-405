// scripts/add-dynamic-exports.mjs
// اجرا: node scripts/add-dynamic-exports.mjs
// این اسکریپت تمام route.ts و route.js زیر app/api را پیدا می‌کند
// و اگر export const dynamic نداشته باشند، اضافه می‌کند.

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const API_DIR = join(ROOT, "app", "api");

const DYNAMIC_LINE = `export const dynamic = "force-dynamic";\n`;

function walk(dir, files = []) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) {
            walk(full, files);
        } else if (entry === "route.ts" || entry === "route.js") {
            files.push(full);
        }
    }
    return files;
}

function hasDynamicExport(content) {
    // فقط در سطح top-level چک می‌کنیم — ساده و کافی
    return /^\s*export\s+const\s+dynamic\s*=/m.test(content);
}

function addDynamicExport(content) {
    // اگر dynamic وجود داره، دست نزن
    if (hasDynamicExport(content)) return content;

    // اگر "use server" یا "use client" در ابتدای فایل هست، بعدش اضافه کن
    const directiveMatch = content.match(/^(["']use (server|client)["'];?\s*\n)/);
    if (directiveMatch) {
        const idx = directiveMatch[0].length;
        return (
            content.slice(0, idx) +
            "\n" +
            DYNAMIC_LINE +
            content.slice(idx)
        );
    }

    // در غیر این صورت، بالای فایل اضافه کن
    return DYNAMIC_LINE + "\n" + content;
}

function main() {
    let routes;
    try {
        routes = walk(API_DIR);
    } catch (err) {
        console.error("❌ پوشه app/api پیدا نشد:", err.message);
        process.exit(1);
    }

    let added = 0;
    let skipped = 0;

    for (const file of routes) {
        const original = readFileSync(file, "utf8");
        const updated = addDynamicExport(original);

        if (updated !== original) {
            writeFileSync(file, updated, "utf8");
            added++;
            console.log("✅ اضافه شد:", relative(ROOT, file));
        } else {
            skipped++;
            console.log("⏭️  از قبل داشت:", relative(ROOT, file));
        }
    }

    console.log(
        `\n📦 مجموع: ${routes.length} فایل — ${added} اضافه شد، ${skipped} رد شد.`
    );
}

main();