import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import useDoFStore from '../../../store'
import BottomToolbar from './BottomToolbar'
import Header from './Header'
import Row from './Row/Row'

function removeAperturePrefix(value: LensDefinition['aperture']) {
    return value.replace(/^f\//, '')
}

function descendingComparator(a: LensDefinition, b: LensDefinition, orderBy: ColumnName) {
    let valueA = a[orderBy]
    let valueB = b[orderBy]

    if (typeof valueA === 'string') {
        valueA = parseFloat(removeAperturePrefix(valueA))
    }

    if (typeof valueB === 'string') {
        valueB = parseFloat(removeAperturePrefix(valueB))
    }

    if (valueB < valueA) {
        return -1
    }

    if (valueB > valueA) {
        return 1
    }

    return 0
}

function getComparator<Key extends ColumnName>(
    order: Order,
    orderBy: Key
): (a: LensDefinition, b: LensDefinition) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

export default function LensTable() {
    const { lenses, order, orderBy } = useDoFStore()

    return (
        <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
                <Table aria-labelledby="tableTitle" size="small">
                    <Header />
                    <TableBody>
                        {lenses.sort(getComparator(order, orderBy)).map((row) => (
                            <Row key={row.id} lens={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <BottomToolbar />
        </Paper>
    )
}
