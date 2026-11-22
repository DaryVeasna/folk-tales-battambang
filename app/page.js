import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import EntryList from '../components/EntryList';
import { createClient } from '../lib/supabase/server'; // use the exact path/name from your old page.js

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) console.error(error);
  const entries = data ?? [];

  return (
    <>
      <Hero />
      <FeatureCards />
      <section id="entries" className="entries">
        <EntryList entries={entries} />
      </section>
    </>
  );
}