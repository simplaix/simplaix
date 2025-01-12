const fs = require('fs');
const { z } = require('zod');
const { transpileModule } = require('typescript');

// Read TypeScript file
const tsFile = process.argv[2]; // The input TypeScript file containing Zod schemas
const outputJson = process.argv[3]; // The output JSON Schema file

if (!tsFile || !outputJson) {
  console.error("Usage: node convert-zod-to-jsonschema.js <input.ts> <output.json>");
  process.exit(1);
}

const tsCode = fs.readFileSync(tsFile, 'utf-8');

// Transpile TypeScript to JavaScript using TypeScript compiler API
const jsCode = transpileModule(tsCode, { compilerOptions: { module: "CommonJS" } }).outputText;

// Execute the transpiled code to load Zod schemas
const schemaExports = {};
const moduleFunc = new Function(
  'exports',
  'require',
  'z',
  jsCode
);
moduleFunc(
  schemaExports,
  require,
  z
);

// Helper function to convert Zod schemas to JSON Schema
const convertSchemaToJSONSchema = (schema, name) => {
  return {
    "$schema": "http://json-schema.org/draft-07/schema#",
    title: name,
    ...schema
  };
};

// Get the draft schema definitions if getDraftJsonSchema exists
let schemas = {};
if (typeof schemaExports.getJsonSchema === 'function') {
  schemas = schemaExports.getJsonSchema();
} else {
  // Fall back to the original schema conversion logic
  schemas = Object.entries(schemaExports)
    .filter(([_, value]) => value instanceof z.ZodType)
    .reduce((acc, [name, schema]) => {
      acc[name] = convertSchemaToJSONSchema(schema, name);
      return acc;
    }, {});
}

// Write the JSON Schema to the output file
fs.writeFileSync(outputJson, JSON.stringify(schemas, null, 2), 'utf-8');

console.log(`JSON Schema has been generated: ${outputJson}`);
