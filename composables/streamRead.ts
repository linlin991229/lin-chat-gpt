import type { RecordList } from '~/types/communications'

// Read the stream from the server
export async function read(reader: any,
  target: RecordList): Promise<any> {
  // TextDecoder is a built-in object that allows you to convert a stream of bytes into a string
  const decoder = new TextDecoder('utf-8')
  // Destructure the value returned by reader.read()
  const { done, value } = await reader.read()
  // If the stream is done reading, release the lock on the reader
  if (done)
    return reader.releaseLock()
  // Convert the stream of bytes into a string
  const chunk = decoder.decode(value, { stream: true })
  // Split the string into an array of strings
  // console.log(chunk)
  const jsons = chunk
    .split('data:')
    .map((data) => {
      // Trim any whitespace
      const trimData = data.trim()
      // If the string is empty, return undefined
      if (trimData === '')
        return undefined
      // If the string is [DONE], return undefined
      if (trimData === '[DONE]')
        return undefined
      // Otherwise, parse the string as JSON
      return JSON.parse(data.trim())
    })
    // Filter out any undefined values
    .filter(data => data)
  // Combine the data into a single string
  const streamMessage = jsons
    .map(jn => jn.choices.map((choice: any) => choice.delta.content).join(''))
    .join('')
  // Update the ref to the target element with the new string
  const response = streamMessage
  target.items[target.items.length - 1].delta.content += response

  // Repeat the process
  return read(reader, target)
}
