export const sanitizeMessage = (message: string): string => {
  return message.replace(/\\n/g, ' ').replace(/\\\\/g, '\\');
};
