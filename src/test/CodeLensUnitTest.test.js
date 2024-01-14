import { describe, it, beforeEach, expect } from 'vitest';
import {getFunctionEndIndex} from '../function';

describe('TestCodeLens', () => {

  it('should return the correct end index of a function body', () => {
    const code = `function test() {
      console.log("Hello, world!");
    }`;
    const startIndex = code.indexOf('{');
    const endIndex = getFunctionEndIndex(startIndex, code);
    expect(endIndex).to.equal(code.lastIndexOf('}') + 1) ;
  });

  it('should return the start index if no function body is found', () => {
    const code = `function test()`;
    const startIndex = code.indexOf('{');
    const endIndex = getFunctionEndIndex(startIndex, code);
    expect(endIndex).to.equal(startIndex);
  });

  it('should handle nested function bodies correctly', () => {
    const code = `function outer() {
      function inner() {
        console.log("Nested function");
      }
    }`;
    const startIndex = code.indexOf('{');
    const endIndex = getFunctionEndIndex(startIndex, code);
    expect(endIndex).to.equal(code.lastIndexOf('}') + 1 );
  });

  // Add more tests to cover edge cases, such as empty strings, code without functions, etc.
});