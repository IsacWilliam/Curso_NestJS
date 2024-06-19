import { ReadStream, createReadStream } from 'fs';

export const getFileToBuffer = (filename: string) => {
  const readStream = createReadStream(filename);
  const chuncks = [];

  return new Promise<{ buffer: Buffer; stream: ReadStream }>(
    (resolve, reject) => {
      readStream.on('data', (chunck) => chuncks.push(chunck));
      readStream.on('error', (err) => reject(err));
      readStream.on('close', () => {
        resolve({
          buffer: Buffer.concat(chuncks) as Buffer,
          stream: readStream,
        });
      });
    },
  );
};
