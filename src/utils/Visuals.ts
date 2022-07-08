const TOKEN_ID_TO_IMAGE_MAPPING = new Map([
  ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'.toLowerCase(), '/assets/images/tokens/usdc.svg']
]);

export function getIconUriForToken(tokenId: string): string | null {
  const imageUri = TOKEN_ID_TO_IMAGE_MAPPING.get(tokenId.toLowerCase());
  if (imageUri) {
    return imageUri;
  }
  return null;
}

export function getIconForSymbol(symbol: string): string {
  return `/assets/images/tokens/${symbol}.svg`;
}