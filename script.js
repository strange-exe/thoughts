let currentQuote = '';

function handleQuoteResponse(data) {
    const quoteTextEl = document.getElementById("quote-text");
    const quoteAuthorEl = document.getElementById("quote-author");

    if (data.quoteText) {
        currentQuote = `"${data.quoteText}"`;
        quoteTextEl.innerText = currentQuote;
        quoteAuthorEl.innerText = data.quoteAuthor ? `— ${data.quoteAuthor}` : "— Unknown";
    } else {
        quoteTextEl.innerText = "No quote available. Please try again.";
        quoteAuthorEl.innerText = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchQuote();

    document.getElementById("new-quote").addEventListener("click", fetchQuote);

    document.getElementById("share-image").addEventListener("click", () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 600;
        canvas.height = 300;

        ctx.fillStyle = "#f4f4f4"; // Background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#333"; // Text color
        ctx.font = '24px Georgia';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const lines = currentQuote.split(' — ');
        const quoteText = lines[0];
        const authorText = lines[1] || '';

        ctx.fillText(quoteText, canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText(`— ${authorText}`, canvas.width / 2, canvas.height / 2 + 20);

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'quote.png';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    });
});

// Fetch a quote
function fetchQuote() {
    const apiUrl = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";

    const script = document.createElement('script');
    script.src = `${apiUrl}&jsonp=handleQuoteResponse`;
    script.onerror = () => {
        document.getElementById("quote-text").innerText = "Sorry, couldn't fetch a new quote. Please try again later.";
        document.getElementById("quote-author").innerText = "";
    };
    document.body.appendChild(script);
}
