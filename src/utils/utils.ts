export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getBlobURL = (data: Blob) => {
  return URL.createObjectURL(data);
};

export const createBlob = (data: any, type: string) => {
  return new Blob([JSON.stringify(data)], { type });
};
