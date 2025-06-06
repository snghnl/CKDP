// src/services/realDataService.ts

import { ChartData } from '../types';

export const RealDataService = {
  async getChartDataFromImage(imageUrl: string): Promise<ChartData> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const body = JSON.stringify({
      image_url: imageUrl,
      test_mode: true,
    });

    const response = await fetch('https://ckdp.onrender.com/openai/convert', {
      method: 'POST',
      headers,
      body,
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const text = await response.text();
    const data = JSON.parse(text);

    return {
      headers: data.headers,
      rows: data.rows.map((row: any[]) => row.map(cell => String(cell))),
    };
  },
};
