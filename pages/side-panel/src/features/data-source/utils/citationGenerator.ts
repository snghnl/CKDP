import { CitationFormat, CitationInput } from '../types';

export function generateCitations(input: CitationInput): Record<CitationFormat, string> {
  const { author, title, year, publisher, url, journal, volume, issue, pages } = input;

  return {
    APA: generateAPA(author, title, year, publisher, url, journal, volume, issue, pages),
    MLA: generateMLA(author, title, year, publisher, url, journal, volume, issue, pages),
    Chicago: generateChicago(author, title, year, publisher, url, journal, volume, issue, pages),
    Harvard: generateHarvard(author, title, year, publisher, url, journal, volume, issue, pages),
    IEEE: generateIEEE(author, title, year, publisher, url, journal, volume, issue, pages),
  };
}

function generateAPA(
  author: string,
  title: string,
  year: string,
  publisher?: string,
  url?: string,
  journal?: string,
  volume?: string,
  issue?: string,
  pages?: string,
): string {
  let citation = `${author}. (${year}). ${title}.`;

  if (journal) {
    citation += ` ${journal}`;
    if (volume) {
      citation += `, ${volume}`;
      if (issue) {
        citation += `(${issue})`;
      }
    }
    if (pages) {
      citation += `, ${pages}`;
    }
    citation += '.';
  } else if (publisher) {
    citation += ` ${publisher}.`;
  }

  if (url) {
    citation += ` ${url}`;
  }

  return citation;
}

function generateMLA(
  author: string,
  title: string,
  year: string,
  publisher?: string,
  url?: string,
  journal?: string,
  volume?: string,
  issue?: string,
  pages?: string,
): string {
  let citation = `${author}. "${title}."`;

  if (journal) {
    citation += ` ${journal}`;
    if (volume) {
      citation += ` ${volume}`;
      if (issue) {
        citation += `.${issue}`;
      }
    }
    citation += ` (${year})`;
    if (pages) {
      citation += `: ${pages}`;
    }
    citation += '.';
  } else if (publisher) {
    citation += ` ${publisher}, ${year}.`;
  }

  if (url) {
    citation += ` Web. ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`;
  }

  return citation;
}

function generateChicago(
  author: string,
  title: string,
  year: string,
  publisher?: string,
  url?: string,
  journal?: string,
  volume?: string,
  issue?: string,
  pages?: string,
): string {
  let citation = `${author}. "${title}."`;

  if (journal) {
    citation += ` ${journal}`;
    if (volume) {
      citation += ` ${volume}`;
      if (issue) {
        citation += `, no. ${issue}`;
      }
    }
    citation += ` (${year})`;
    if (pages) {
      citation += `: ${pages}`;
    }
    citation += '.';
  } else if (publisher) {
    citation += ` ${publisher}, ${year}.`;
  }

  if (url) {
    citation += ` ${url}`;
  }

  return citation;
}

function generateHarvard(
  author: string,
  title: string,
  year: string,
  publisher?: string,
  url?: string,
  journal?: string,
  volume?: string,
  issue?: string,
  pages?: string,
): string {
  let citation = `${author}, ${year}. ${title}.`;

  if (journal) {
    citation += ` ${journal}, ${volume}(${issue}), pp.${pages}.`;
  } else if (publisher) {
    citation += ` ${publisher}.`;
  }

  if (url) {
    citation += ` Available at: ${url}`;
  }

  return citation;
}

function generateIEEE(
  author: string,
  title: string,
  year: string,
  publisher?: string,
  url?: string,
  journal?: string,
  volume?: string,
  issue?: string,
  pages?: string,
): string {
  let citation = `[1] ${author}, "${title},"`;

  if (journal) {
    citation += ` ${journal}, vol. ${volume}, no. ${issue}, pp. ${pages}, ${year}.`;
  } else if (publisher) {
    citation += ` ${publisher}, ${year}.`;
  }

  if (url) {
    citation += ` [Online]. Available: ${url}`;
  }

  return citation;
}
