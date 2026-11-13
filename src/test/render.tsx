import { render } from '@testing-library/react';
import { LazyMotion, MotionConfig, domMax } from 'motion/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';

/** Renders `ui` inside the same Motion setup as the app and a memory router. */
export function renderWithApp(ui: ReactElement, path = '/') {
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <MotionConfig reducedMotion="user">
            <LazyMotion features={domMax} strict>
              {ui}
            </LazyMotion>
          </MotionConfig>
        ),
      },
    ],
    { initialEntries: [path] },
  );
  return render(<RouterProvider router={router} />);
}
