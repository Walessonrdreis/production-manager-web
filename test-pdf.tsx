import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { PlanningPDF } from './apps/web/src/features/planner/ui/PlanningPDF';

async function testPdf() {
  try {
    const stream = await renderToStream(<PlanningPDF items={[{ code: '123', description: 'test', quantity: 1, sectorId: '1', sectorName: 'Corte' }]} period="daily" scheduledAt="2023-01-01" />);
    stream.on('data', () => {});
    stream.on('end', () => console.log('Successfully rendered PDF'));
    stream.on('error', (err) => console.error('Stream error:', err));
  } catch (err) {
    console.error('Unhandled rejection caught:', err);
  }
}

testPdf();
