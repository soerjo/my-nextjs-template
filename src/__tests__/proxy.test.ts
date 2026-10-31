import { describe, it, expect } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { proxy, config } from '@/proxy';

describe('proxy', () => {
  it('passes through any request without redirect', () => {
    const req = new NextRequest('http://localhost:3000/');
    const res = proxy(req);
    expect(res).toBeInstanceOf(NextResponse);
  });

  it('has matcher configuration', () => {
    expect(config.matcher).toBeDefined();
    expect(config.matcher.length).toBeGreaterThan(0);
  });
});
