export const uploadVideoApi = async (file: File) => {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload video');
    }

    return response.json();
};
