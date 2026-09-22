import type { Metadata } from 'next';
import ConceptExperience from './experience';

export const metadata: Metadata = {
  title: 'Sriraam’s Map · Illustrated concept',
  description:
    'Explore the original illustrated estate, a restored comparison, and a detailed castle study.',
};
export default function ConceptPage() {
  return <ConceptExperience />;
}
