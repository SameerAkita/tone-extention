console.log("background service")

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    if (msg.type !== "REWRITE") return;

    console.log("Rewrite request received: ", msg);

    (async () => {
        try {
            const res = await fetch("http://localhost:3000/api/rewrite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: msg.text,
                    tone: msg.tone,
                }),
            });

            const data = await res.json();

            console.log("backend response: ", data);
            sendResponse(data);
        } catch (err) {
            console.log("rewrite failed: ", err);
            sendResponse({ error: "Backend call failed" })
        }
    })();

    return true;
})