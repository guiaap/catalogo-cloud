import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const configurado = Boolean(url && publishableKey && url.startsWith('https://'))
export const supabase = configurado ? createClient(url, publishableKey) : null
export const BUCKET = 'imagens-produtos'
