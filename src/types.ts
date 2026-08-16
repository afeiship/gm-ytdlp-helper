export interface Command {
  label: string;
  hint?: string;
  getCommand: (url: string) => string;
}

export interface SitePlugin {
  name: string;
  match: (url: string) => boolean;
  commands: Command[];
}