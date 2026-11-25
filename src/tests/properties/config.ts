// Environment variables to control test runs
const VARIABLES = {
  runs: 'RUSCUS_PROP_TEST_RUNS',
  seed: 'RUSCUS_PROP_TEST_S1ED'
};

/**
 * A configuration variable
 */
type ConfigVariable = keyof typeof VARIABLES;

/**
 * Get the value of a config variable
 */
export function getConfigVariable(
  variable: ConfigVariable
): string | undefined {
  return process.env[VARIABLES[variable]];
}
