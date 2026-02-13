export type TaxonomyType = 'AREA' | 'SECTOR' | 'REASON';

export type Taxonomy = {
  id: number;
  type: TaxonomyType;
  name: string;
};
