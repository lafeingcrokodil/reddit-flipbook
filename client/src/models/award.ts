export interface Award {
  name: string;
  count: number;
  iconURL: string;
}

export function getAwards(things: {[key: string]: any}[]): Award[] {
  const awards = [];
  for (const thing of things) {
    awards.push({
      count: thing.count,
      iconURL: thing.icon_url,
      name: thing.name
    });
  }
  return awards;
}
