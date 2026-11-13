import { isRouteErrorResponse, useRouteError } from 'react-router';
import { Button } from '../components/ds';

/** Error boundary for unknown routes and unknown project slugs. */
export function NotFound() {
  const error = useRouteError();
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return (
    <section className="section not-found" aria-labelledby="nf-title">
      <title>Page not found — Francis Ciril Arulsamy</title>
      <div className="wrap not-found-in">
        <p className="t-eyebrow">{missing ? 'Error 404' : 'Something went wrong'}</p>
        <h1 className="t-section" id="nf-title">
          {missing ? 'That Page Is Not Here' : 'This Page Could Not Load'}
        </h1>
        <p className="t-body">
          {missing
            ? 'The link may be old or mistyped. The projects are all on the home page.'
            : 'Try again, or head back to the home page.'}
        </p>
        <Button variant="outline" to="/#projects">
          All Projects
        </Button>
      </div>
    </section>
  );
}
