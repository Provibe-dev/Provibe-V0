import useSWR from 'swr'
import { supabase } from './supabase-client'

// Reusable fetcher function
const fetcher = async (url: string) => {
  if (url.startsWith('/api/')) {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
  }
  
  // Parse Supabase query from URL
  const [table, id] = url.split('/')
  if (table === 'projects') {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
  
  throw new Error('Invalid fetcher URL')
}

// Hook for fetching project data
export function useProjectData(projectId: string | null) {
  return useSWR(
    projectId ? `projects/${projectId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    }
  )
}