import { Token } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { useAaveAnalyticsApiContext } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';
import { useTheme } from 'next-themes';
import Select from 'react-select';
import { TokenChip } from '../badges/TokenChip';

export const TokenSelect = ({
  onSelect,
  excludes,
}: {
  onSelect: (token: Token) => void;
  excludes?: Token[];
  className?: string;
}) => {
  const { resolvedTheme } = useTheme();
  const { tokens } = useAaveAnalyticsApiContext();
  const filteredTokens = tokens.filter(
    (token) => !(excludes || []).includes(token)
  );

  const options = filteredTokens.map((token: Token) => ({
    value: token.id,
    label: token.symbol,
  }));

  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      zIndex: 50 /** z-50 */,
      backgroundColor: resolvedTheme === 'dark' ? 'black' : 'white',
    }),

    control: (provided: any) => ({
      ...provided,
      borderRadius: '0.75rem' /* rounded-xl */,
      cursor: 'text' /** cursor-text */,
      background: 'none',
      borderColor: 'grey',
    }),
  };

  return (
    <Select
      styles={customStyles}
      onChange={(entry) => {
        const token = filteredTokens.find((t) => t.id === entry?.value);
        if (token) {
          onSelect(token);
        }
      }}
      controlShouldRenderValue={false}
      options={options}
      isSearchable={true}
      closeMenuOnSelect={false}
      maxMenuHeight={200}
      placeholder="Search token..."
      formatOptionLabel={({ value }) => {
        const token = filteredTokens.find((t) => t.id === value);
        if (token) {
          return <TokenChip symbol={token.symbol} />;
        }
        return '';
      }}
    />
  );
};
