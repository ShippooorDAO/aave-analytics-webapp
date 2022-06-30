import { render, screen } from '@testing-library/react';

import { Main } from './Main';

describe('Main template', () => {
  describe('Render method', () => {
    it('should include navbar and footer', () => {
      render(<Main meta={null} />);

      const heading = screen.getByRole('navigation');
      expect(heading).toBeInTheDocument();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });
  });
});