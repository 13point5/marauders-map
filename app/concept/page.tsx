import type { Metadata } from 'next';
import ConceptExperience from './experience';

export const metadata: Metadata = {
  title: 'Sriraam’s Map · Illustrated castle',
  description:
    'Explore the illustrated castle in clean ink: six connected destinations, sharp architectural details, and a draggable, zoomable map.',
};
export default function ConceptPage() {
  return <ConceptExperience />;
}
