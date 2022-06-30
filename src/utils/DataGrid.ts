import { GridValueFormatterParams } from "@mui/x-data-grid";

export const PercentageGridValueFormatter = (params: GridValueFormatterParams<number>) => {
    if (params.value == null) {
        return '';
    }

    const valueFormatted = Number(params.value * 100).toLocaleString();
    return `${valueFormatted} %`;
};
