document.addEventListener('DOMContentLoaded', function() {
    const linkForm = document.getElementById('linkForm');
    const linkInput = document.getElementById('linkInput');
    const expirationInput = document.getElementById('expirationInput');
    const linkDashboard = document.getElementById('linkDashboard');

    linkForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const originalUrl = linkInput.value;
        const expirationTime = expirationInput.value;

        if (originalUrl) {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originalUrl, expirationTime })
            });

            const data = await response.json();
            if (data.shortenedUrl) {
                alert(`Link created: ${data.shortenedUrl}`);
                linkInput.value = '';
                expirationInput.value = '';
                loadLinks();
            } else {
                alert('Error creating link');
            }
        }
    });

    async function loadLinks() {
        const response = await fetch('/api/links');
        const links = await response.json();
        linkDashboard.innerHTML = '';

        links.forEach(link => {
            const linkElement = document.createElement('div');
            linkElement.innerHTML = `
                <p>Original URL: ${link.originalUrl}</p>
                <p>Shortened URL: <a href="${link.shortenedUrl}" target="_blank">${link.shortenedUrl}</a></p>
                <p>Expires on: ${new Date(link.expirationTime).toLocaleString()}</p>
            `;
            linkDashboard.appendChild(linkElement);
        });
    }

    loadLinks();
});