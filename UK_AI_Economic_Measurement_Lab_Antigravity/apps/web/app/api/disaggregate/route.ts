import { NextResponse } from 'next/server';
import { getProductByCode, ALL_CPA_PRODUCTS } from '../../../lib/data';
import { runDisaggregation } from '../../../../../packages/methods/disaggregation';
import { DisaggregationParams } from '../../../../../packages/schemas';

export async function POST(request: Request) {
  try {
    const body: DisaggregationParams = await request.json();
    const product = getProductByCode(body.product_code) || ALL_CPA_PRODUCTS[12];
    const result = runDisaggregation(product, body);

    return NextResponse.json({
      status: 'success',
      data: result
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: err.message || 'Disaggregation failed' },
      { status: 400 }
    );
  }
}
