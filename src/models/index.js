// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Topics } = initSchema(schema);

export {
  Topics
};