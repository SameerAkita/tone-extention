export async function rewriteText(text: string, tone: number) {
    await new Promise((r) => setTimeout(r, 500));

    return `${tone}% Business rewrite: ${text}`
}