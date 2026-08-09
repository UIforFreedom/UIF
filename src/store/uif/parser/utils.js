export function DeepCopy(input) {
  return JSON.parse(JSON.stringify(input))
}

export function DeleteKeyFromDict(key, dict) {
  if (key in dict) {
    delete dict[key]
  }
}
