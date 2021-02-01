import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Topics {
  readonly id: string;
  readonly heading?: string;
  readonly detail?: string;
  readonly identifier?: number;
  constructor(init: ModelInit<Topics>);
  static copyOf(source: Topics, mutator: (draft: MutableModel<Topics>) => MutableModel<Topics> | void): Topics;
}