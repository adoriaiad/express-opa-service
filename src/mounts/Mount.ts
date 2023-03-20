import type { Topic } from '@ghii/ghii';
import type { PartialDeep } from 'type-fest';

export default interface Mount<Conf> {
  init(configs: Conf): Promise<void>;
  validator: Topic<Conf>['validator'];
  defaults?: PartialDeep<Conf>;
}

export type ConfType<T extends Mount<unknown>> = Parameters<T['init']>[0];
