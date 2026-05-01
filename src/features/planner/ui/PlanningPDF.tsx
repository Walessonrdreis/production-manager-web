import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Inter', fontSize: 10, color: '#1E293B' },
  header: { marginBottom: 20, borderBottom: 1, borderBottomColor: '#E2E8F0', paddingBottom: 10 },
  title: { fontSize: 18, fontWeight: 700, color: '#0F172A' },
  subtitle: { fontSize: 10, color: '#64748B', marginTop: 4 },
  table: { display: 'flex', width: 'auto', marginTop: 15 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', minHeight: 25, alignItems: 'center' },
  tableHeader: { backgroundColor: '#F8FAFC', fontWeight: 700, borderBottomColor: '#E2E8F0' },
  colCode: { width: '15%', padding: 4 },
  colDesc: { width: '40%', padding: 4 },
  colSector: { width: '15%', padding: 4 },
  colQty: { width: '10%', padding: 4, textAlign: 'right' },
  colNotes: { width: '20%', padding: 4 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', color: '#94A3B8', fontSize: 8 }
});

interface PlanningPDFProps {
  items: any[];
  period: string;
}

export const PlanningPDF = ({ items, period }: PlanningPDFProps) => {
  const periodLabel = {
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal'
  }[period as keyof typeof periodLabel] || period;

  // Agrupa itens por setor para gerar páginas independentes
  const groupedItems = items.reduce((acc: any, item) => {
    const sectorKey = item.sectorId || 'unassigned';
    const sectorName = item.sectorName || 'Sem Setor';
    
    if (!acc[sectorKey]) {
      acc[sectorKey] = {
        name: sectorName,
        items: []
      };
    }
    acc[sectorKey].items.push(item);
    return acc;
  }, {});

  const sectors = Object.keys(groupedItems);

  return (
    <Document>
      {sectors.map((sectorId) => (
        <Page key={sectorId} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.title}>Ordem de Produção</Text>
              <Text style={{ fontSize: 10, fontWeight: 700, backgroundColor: '#F1F5F9', padding: '4 8', borderRadius: 4 }}>
                SETOR: {groupedItems[sectorId].name.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.subtitle}>Período: {periodLabel} | Gerado em: {new Date().toLocaleString()}</Text>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.colCode}>Cód.</Text>
              <Text style={styles.colDesc}>Produto</Text>
              <Text style={styles.colQty}>Qtd.</Text>
              <Text style={[styles.colNotes, { width: '35%' }]}>Concluído (_) Visto (_)</Text>
            </View>

            {groupedItems[sectorId].items.map((item: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.colCode}>{item.code}</Text>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={[styles.colNotes, { width: '35%', borderBottomColor: '#F1F5F9', borderBottomWidth: 0.5 }]}></Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10 }}>
            <Text style={{ fontSize: 8, color: '#64748B', marginBottom: 10 }}>Assinatura do Responsável (Setor {groupedItems[sectorId].name}):</Text>
            <View style={{ height: 40, borderBottomWidth: 1, borderBottomColor: '#CBD5E1', width: '60%' }} />
          </View>

          <Text style={styles.footer}>Documento gerado automaticamente pelo Production Manager - Página do Setor {groupedItems[sectorId].name}</Text>
        </Page>
      ))}
    </Document>
  );
};
