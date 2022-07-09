import { Token } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { useAaveAnalyticsApiContext } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';
import TokenChip from '../TokenChip';
import Select from 'react-select';

export const TokenSelect = ({
  onSelect,
  excludes,
}: {
  onSelect: (token: Token) => void;
  excludes?: Token[];
  className?: string;
}) => {
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
    }),

    control: (provided: any) => ({
      ...provided,
      borderRadius: '0.75rem' /* rounded-xl */,
      cursor: 'text' /** cursor-text */,
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
          return <TokenChip token={token} />;
        }
        return '';
      }}
    />
  );
};
