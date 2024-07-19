export async function loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
    });
}

window.addEventListener('load', async () => {
    const showSwal = localStorage.getItem('showSwal');
    if (showSwal === 'true') {
        await loadScript('https://cdn.jsdelivr.net/npm/sweetalert2@11');

        (window as any).Swal.fire({
            title: 'Logged Out',
            text: 'You have successfully logged out.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        localStorage.removeItem('showSwal');
    }
});