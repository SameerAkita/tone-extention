async function callRewriteAPI(text: string, tone: string) {
    const res = await fetch("http://localhost:3000/api/rewrite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, tone }),
    });

    const data = await res.json();
    return data.result;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "REWRITE") {
        callRewriteAPI(msg.text, msg.tone)
            .then((result) => sendResponse({ ok: true, result }))
            .catch((err) => sendResponse({ ok: false, error: err.message }));

        return true;
    }
})