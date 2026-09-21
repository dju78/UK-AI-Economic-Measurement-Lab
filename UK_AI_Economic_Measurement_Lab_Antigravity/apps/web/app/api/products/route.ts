import { NextResponse } from 'next/server';
import { ALL_CPA_PRODUCTS } from '../../../lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const group = searchParams.get('group');

  let results = ALL_CPA_PRODUCTS;

  if (code) {
    results = results.filter((p) => p.product_code.toLowerCase() === code.toLowerCase());
  }

  if (group) {
    results = results.filter((p) => p.ons_thematic_group.toLowerCase() === group.toLowerCase());
  }

  return NextResponse.json({
    status: 'success',
    count: results.length,
    data_vintage: 'Blue Book 2025 / SUT 2023',
    statistical_status: 'Published official-statistics source (broad totals)',
    data: results
  });
}
