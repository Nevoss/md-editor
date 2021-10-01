import commandGenerator from './command-generator';

export const italic = commandGenerator((value) => `*${value}*`);
export const bold = commandGenerator((value) => `**${value}**`);
// export const strikethrough = commandGenerator((value) => `~~${value}~~`);
