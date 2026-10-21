/**
 * A string that allows literal suggestions to be shown to an author
 */
type AuthorString = string & {};

/**
 * A CSS value directly provided by an author
 */
export type AuthorValue = number | AuthorString;

/**
 * A CSS value
 */
export type Value = number | string;
