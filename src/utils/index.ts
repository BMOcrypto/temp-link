export const generateUniqueId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export const isValidUrl = (url: string): boolean => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
};