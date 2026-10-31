import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeHero } from '@/features/home/components/home-hero';

describe('HomeHero', () => {
  it('renders "Welcome to my website" heading', () => {
    render(<HomeHero />);
    expect(screen.getByRole('heading', { level: 1, name: /welcome to my website/i })).toBeInTheDocument();
  });
});
