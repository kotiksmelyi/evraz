export const base64ToFile = async (base64: string, fileName: string) => {
  const res: Response = await fetch(base64);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/jpeg' });
};
