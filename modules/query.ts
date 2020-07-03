import qs from 'qs';

const queryMap: { [key: string]: any } = {};

export default function getQueryParamFromLocation(location: { search: string }) {
  if (!queryMap[location.search]) {
    const result = JSON.stringify(qs.parse(location.search.slice(1)));
    queryMap[location.search] = new Function(`return ${result}`);
  }
  return queryMap[location.search]();
}