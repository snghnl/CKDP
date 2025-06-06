import { Source, CitationFormat } from './types';

// 인용 형식별 예시 데이터
export const citationExamples: Record<CitationFormat, string> = {
  APA: 'Smith, J. (2024). Data Visualization in Modern Business. Journal of Business Analytics, 15(2), 123-145. https://doi.org/10.1234/jba.2024.001',

  MLA: 'Smith, John. "Data Visualization in Modern Business." Journal of Business Analytics 15.2 (2024): 123-145. Web. 15 Mar. 2024.',

  Chicago: 'Smith, John. "Q1 Sales Analysis Report." Financial Analytics Journal 12, no. 1 (2024): 45-67.',

  Harvard: 'Smith, J., 2024. Q1 Sales Analysis Report. Financial Analytics Journal, 12(1), pp.45-67.',

  IEEE: '[1] J. Smith, "Q1 Sales Analysis Report," Financial Analytics Journal, vol. 12, no. 1, pp. 45-67, 2024.',
};

export const mockSources: Source[] = [
  {
    id: '1',
    name: '세계 경제 포럼 (World Economic Forum)',
    description: '글로벌 경제 동향 및 미래 전망 보고서',
    url: 'https://www.weforum.org',
    citations: [
      {
        format: 'APA',
        text: 'World Economic Forum. (2023). Global Economic Outlook 2023. https://www.weforum.org',
      },
      {
        format: 'MLA',
        text: 'World Economic Forum. "Global Economic Outlook 2023." World Economic Forum, 2023, www.weforum.org.',
      },
      {
        format: 'Chicago',
        text: 'World Economic Forum. "Global Economic Outlook 2023." Last modified 2023. https://www.weforum.org.',
      },
      {
        format: 'Harvard',
        text: 'World Economic Forum (2023) Global Economic Outlook 2023. Available at: https://www.weforum.org',
      },
      {
        format: 'IEEE',
        text: '[1] World Economic Forum, "Global Economic Outlook 2023," 2023. [Online]. Available: https://www.weforum.org',
      },
    ],
  },
  {
    id: '2',
    name: '국제 통화 기금 (IMF)',
    description: '세계 경제 전망 보고서',
    url: 'https://www.imf.org',
    citations: [
      {
        format: 'APA',
        text: 'International Monetary Fund. (2023). World Economic Outlook. https://www.imf.org',
      },
      {
        format: 'MLA',
        text: 'International Monetary Fund. "World Economic Outlook." IMF, 2023, www.imf.org.',
      },
      {
        format: 'Chicago',
        text: 'International Monetary Fund. "World Economic Outlook." Last modified 2023. https://www.imf.org.',
      },
      {
        format: 'Harvard',
        text: 'International Monetary Fund (2023) World Economic Outlook. Available at: https://www.imf.org',
      },
      {
        format: 'IEEE',
        text: '[1] International Monetary Fund, "World Economic Outlook," 2023. [Online]. Available: https://www.imf.org',
      },
    ],
  },
  {
    id: '3',
    name: 'OECD 경제 전망',
    description: 'OECD 회원국 경제 동향 분석',
    url: 'https://www.oecd.org',
    citations: [
      {
        format: 'APA',
        text: 'OECD. (2023). Economic Outlook. https://www.oecd.org',
      },
      {
        format: 'MLA',
        text: 'OECD. "Economic Outlook." OECD, 2023, www.oecd.org.',
      },
      {
        format: 'Chicago',
        text: 'OECD. "Economic Outlook." Last modified 2023. https://www.oecd.org.',
      },
      {
        format: 'Harvard',
        text: 'OECD (2023) Economic Outlook. Available at: https://www.oecd.org',
      },
      {
        format: 'IEEE',
        text: '[1] OECD, "Economic Outlook," 2023. [Online]. Available: https://www.oecd.org',
      },
    ],
  },
];
