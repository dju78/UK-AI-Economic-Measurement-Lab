import { NextResponse } from 'next/server';
import { classifyBusinessText } from '../../../../../packages/methods/classifier';
import { CompanyClassificationRecord } from '../../../../../packages/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const textContent = body.text || body.description || body.business_description || body.input_text || '';
    
    const record: CompanyClassificationRecord = {
      business_id: body.business_id || body.id || 'API-USER',
      company_name: body.company_name || body.name || body.business_name || 'Anonymous Submission',
      sic_code: body.sic_code || body.sic || '62.01',
      sic_description: body.sic_description || 'Computer programming',
      text: textContent
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
