import fs from "fs";

function replacer(key: string, value: any): any {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  }
  if (value instanceof Set) {
    return {
      dataType: 'Set',
      value: Array.from(value),
    };
  }
  return value;
}

function reviver(key: string, value: any): any {
  if (value && value.dataType === 'Map' && Array.isArray(value.value)) {
    return new Map(value.value);
  }
  if (value && value.dataType === 'Set' && Array.isArray(value.value)) {
    return new Set(value.value);
  }
  return value;
}

export function saveObjectAsJSON<T>(object: T, filename: string): void {
  const json = JSON.stringify(object, replacer);
  fs.writeFileSync(`${filename}.json`, json);
  console.log(`Saved ${filename}.json`);
}

export function loadObjectFromJSON<T>(filename: string): T | undefined {
  const json = fs.readFileSync(`${filename}.json`).toString();
  return JSON.parse(json, reviver) as T;
}
