let currentQuote = '';
let currentAuthor = 'Abhinesh';

function handleQuoteResponse(data) {
    const quoteTextEl = document.getElementById("quote-text");
    const quoteAuthorEl = document.getElementById("quote-author");

    if (data.quoteText) {
        currentQuote = `"${data.quoteText}"`;
        quoteTextEl.innerText = currentQuote;
        currentAuthor = data.quoteAuthor || "Abhinesh"; // Fallback to default author
        quoteAuthorEl.innerText = `— ${currentAuthor}`;
    } else {
        quoteTextEl.innerText = "No quote available. Please try again.";
        quoteAuthorEl.innerText = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchQuote();

    document.getElementById("new-quote").addEventListener("click", fetchQuote);

    document.getElementById("save-quote").addEventListener("click", () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 600;
        canvas.height = 400;

        // Dynamic background color
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Inner opaque quote box background
        ctx.fillStyle = "#000000";
        ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

        // Draw the opening quote mark
        ctx.font = 'bold 40px Arial, sans-serif';
        ctx.fillStyle = "#ed0909"; 
        ctx.textAlign = 'left'; 
        ctx.textBaseline = 'middle';
        const quoteMarkX = 40; 
        const quoteMarkY = canvas.height / 2 - 30;
        ctx.fillText('"', quoteMarkX, quoteMarkY);

        // Style and wrap the quote text
        ctx.font = 'italic 24px Arial, sans-serif';
        ctx.fillStyle = "#FFFDEF";
        const maxWidth = canvas.width - 80;
        const quoteLines = wrapText(ctx, currentQuote.slice(1, -1), maxWidth); // Exclude the quotes

        let lineHeight = 30;
        let yPosition = canvas.height / 2 - (quoteLines.length - 1) * lineHeight / 2;

        // Draw wrapped quote text
        quoteLines.forEach(line => {
            ctx.fillText(line, quoteMarkX + 20, yPosition);
            yPosition += lineHeight;
        });

        // Draw author name centered below the quote
        ctx.font = '18px Arial, sans-serif';
        ctx.fillStyle = "#00fffc";
        const authorXPosition = (canvas.width - ctx.measureText(`— ${currentAuthor}`).width) / 2;
        ctx.fillText(`— ${currentAuthor}`, authorXPosition, yPosition + 20);

        // Add watermark at the bottom right
        ctx.font = '14px Arial, sans-serif';
        ctx.fillStyle = "#09edbc";
        ctx.textAlign = 'right';
        ctx.fillText("Quotes by Abhinesh", canvas.width - 40, canvas.height - 30);

        // Generate the image
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quote.png`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    });
});

function fetchQuote() {
    const apiUrl = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";

    const script = document.createElement('script');
    script.src = `${apiUrl}&jsonp=handleQuoteResponse`;

    script.onerror = () => {
        console.error("Error fetching quote: Network issue or API down");
        document.getElementById("quote-text").innerText = "Sorry, couldn't fetch a new quote. Please try again later.";
        document.getElementById("quote-author").innerText = "";
    };

    document.body.appendChild(script);
}

function wrapText(context, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}
