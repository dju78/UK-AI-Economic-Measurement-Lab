import { NextResponse } from 'next/server';
import { classifyBusinessText } from '../../../../../packages/methods/classifier';
import { CompanyClassificationRecord } from '../../../../../packages/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const record: CompanyClassificationRecord = {
      business_id: body.business_id || 'API-USER',
      company_name: body.company_name || 'Anonymous Submission',
      sic_code: body.sic_code || '62.01',
      sic_description: body.sic_description || 'Computer programming',
      text: body.text || ''
    };

    const modelType = body.model_type === 'rule_baseline' ? 'rule_baseline' : 'tfidf_logistic';
    const prediction = classifyBusinessText(record, modelType);

    return NextResponse.json({
      status: 'success',
      data: prediction
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: err.message || 'Classification failed' },
      { status: 400 }
    );
  }
}
