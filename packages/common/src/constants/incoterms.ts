/** Incoterms 2020 definitions used across the TradeForge platform. */
export interface IIncotermDefinition {
  code: string;
  name: string;
  description: string;
  /** 'any' | 'sea' — indicates whether the term is limited to sea/inland waterway transport. */
  transport: string;
}

export const INCOTERMS: Record<string, IIncotermDefinition> = {
  EXW: {
    code: 'EXW',
    name: 'Ex Works',
    description:
      'The seller makes goods available at their premises. The buyer bears all costs and risks from that point on.',
    transport: 'any',
  },
  FCA: {
    code: 'FCA',
    name: 'Free Carrier',
    description:
      'The seller delivers goods to a named carrier or nominated party at a named place. Risk transfers upon delivery to the carrier.',
    transport: 'any',
  },
  CPT: {
    code: 'CPT',
    name: 'Carriage Paid To',
    description:
      'The seller pays for carriage to the named destination. Risk transfers when goods are handed to the first carrier.',
    transport: 'any',
  },
  CIP: {
    code: 'CIP',
    name: 'Carriage and Insurance Paid To',
    description:
      'Like CPT but the seller also contracts and pays for insurance against the buyer\'s risk of loss during carriage.',
    transport: 'any',
  },
  DAP: {
    code: 'DAP',
    name: 'Delivered at Place',
    description:
      'The seller delivers goods at the named destination, ready for unloading, but the buyer is responsible for import duties.',
    transport: 'any',
  },
  DPU: {
    code: 'DPU',
    name: 'Delivered at Place Unloaded',
    description:
      'The seller delivers and unloads goods at the named place of destination. The buyer handles import clearance.',
    transport: 'any',
  },
  DDP: {
    code: 'DDP',
    name: 'Delivered Duty Paid',
    description:
      'The seller delivers goods cleared for import at the named destination, bearing all costs and risks including duties.',
    transport: 'any',
  },
  FAS: {
    code: 'FAS',
    name: 'Free Alongside Ship',
    description:
      'The seller delivers goods placed alongside the vessel at the named port. Risk transfers at that point.',
    transport: 'sea',
  },
  FOB: {
    code: 'FOB',
    name: 'Free on Board',
    description:
      'The seller delivers goods on board the vessel at the named port of shipment. Risk transfers when goods are on board.',
    transport: 'sea',
  },
  CFR: {
    code: 'CFR',
    name: 'Cost and Freight',
    description:
      'The seller pays cost and freight to the destination port. Risk transfers when goods are on board the vessel.',
    transport: 'sea',
  },
  CIF: {
    code: 'CIF',
    name: 'Cost, Insurance and Freight',
    description:
      'Like CFR but the seller also contracts minimum insurance cover for the buyer\'s risk during carriage.',
    transport: 'sea',
  },
};

export const INCOTERM_CODES: string[] = Object.keys(INCOTERMS);

/** Returns true if the given string is a valid Incoterms 2020 code. */
export function isValidIncoterm(code: string): boolean {
  return Object.prototype.hasOwnProperty.call(INCOTERMS, code.toUpperCase());
}
