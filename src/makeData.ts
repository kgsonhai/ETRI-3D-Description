import { action_labels, desc } from './mock';

export type Description = {
  id: number;
  actionName: string;
  description: string;
};

export const data = desc.map((item, index) => ({
  id: index + 1,
  actionName: action_labels[index],
  description: desc[index],
})) as Description[];
