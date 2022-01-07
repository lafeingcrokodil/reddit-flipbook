import debug from 'debug';
import split from 'split';

export default function Logger(context: string) {
  const log = debug(context);
  const error = (err: Error) => {
    debug(`${context}:error`)(`${err.name}: ${err.message}`);
  };
  const stream = split().on('data', log);
  return { log, error, stream };
}
