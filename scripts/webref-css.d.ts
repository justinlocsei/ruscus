declare module '@webref/css' {
  type Type = {
    syntax?: string;
  };

  type Property = {
    name: string;
    syntax?: string;
  };

  const css: {
    index(): Promise<{
      properties: Record<string, Property>;
      types?: Record<string, Type>;
    }>;
  };

  export default css;
}
