import { data, type LoaderFunctionArgs } from 'react-router';
import { projectBySlug, projects } from '../data/projects';

export function loader({ params }: LoaderFunctionArgs) {
  const project = projectBySlug(params.slug);
  if (!project) throw data(null, { status: 404, statusText: 'Project not found' });
  const i = projects.indexOf(project);
  const prev = projects[(i - 1 + projects.length) % projects.length] ?? project;
  const next = projects[(i + 1) % projects.length] ?? project;
  return { project, prev, next };
}
