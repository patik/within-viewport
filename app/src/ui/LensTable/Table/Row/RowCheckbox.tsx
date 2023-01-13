import Checkbox from '@mui/material/Checkbox'
import useDoFStore from '../../../../store'
import { getRowLabelId } from '../../../../utilities/getRowLabelId'

export default function RowCheckbox({ lens }: { lens: LensDefinition }) {
    const { selected, setSelected, isSelected } = useDoFStore()

    const onRowClick = (id: SelectedItem) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected: readonly SelectedItem[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
        }

        setSelected(newSelected)
    }

    return (
        <Checkbox
            onChange={() => onRowClick(lens.id)}
            color="primary"
            checked={isSelected(lens.id)}
            inputProps={{
                'aria-labelledby': getRowLabelId(lens),
            }}
            data-testid={`lens-checkbox-${lens.id}`}
        />
    )
}
