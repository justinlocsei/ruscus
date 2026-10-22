declare module '@webref/css' {
  type CssTypeEntry = {
    syntax?: string;
  };

  type WebrefProperty = {
    name: string;
    syntax?: string;
  };

  const css: {
    index(): Promise<{
      properties: Record<string, WebrefProperty>;
      types?: Record<string, CssTypeEntry>;
    }>;
  };

  export default css;
}
