import useSWR from 'swr'

export async function fetcher(...args) {
  const res = await fetch(...args)
  return res.json()
}


export function useProjects() {
  return useSWR('/api/data', fetch)
}
