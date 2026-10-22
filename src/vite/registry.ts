/**
 * A registry of component IDs and the files that define them
 */
export class ComponentRegistry {
  private readonly owners = new Map<string, string>();

  /**
   * Clear the registry
   */
  clear(): void {
    this.owners.clear();
  }

  /**
   * Release all claims on components held by a module
   */
  remove(moduleID: string): void {
    for (const [componentID, owner] of this.owners) {
      if (owner === moduleID) {
        this.owners.delete(componentID);
      }
    }
  }

  /**
   * Register a module as the owner of a component
   */
  register(componentID: string, moduleID: string): void {
    const owner = this.owners.get(componentID);

    if (owner !== undefined && owner !== moduleID) {
      throw new Error(
        `The Ruscus component ${componentID} is defined by both ${owner} and ${moduleID}.`
      );
    }

    this.owners.set(componentID, moduleID);
  }
}
